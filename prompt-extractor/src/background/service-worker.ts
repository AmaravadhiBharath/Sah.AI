import type { ExtractionResult, Message, Mode } from '../types';
import { aiSummarizer, initializeAISummarizer } from '../services/ai-summarizer';
import { saveKeylogsToCloud, getCurrentUserId, CloudKeylogItem } from '../services/firebase';
import { doc, increment } from 'firebase/firestore';
import { getDb } from '../services/firebase';
import { RemoteConfigService, CACHE_TTL, LAST_FETCH_KEY } from '../services/remote-config';
import { fetchRemoteConfigUpdates } from '../services/remote-config-fetcher';

console.log('[SahAI] Service worker started');

// Initialize AI summarizer
initializeAISummarizer();

// Initialize Remote Config and check for updates
// Initialize Remote Config and check for updates
try {
  RemoteConfigService.getInstance().initialize().then(async () => {
    try {
      const stored = await chrome.storage.local.get([LAST_FETCH_KEY]);
      const lastFetch = stored[LAST_FETCH_KEY] || 0;
      if (Date.now() - lastFetch > CACHE_TTL) {
        const config = (RemoteConfigService.getInstance() as any).config;
        fetchRemoteConfigUpdates(config?.version || 0).catch(err => {
          console.error('[SahAI] Remote config update failed:', err);
        });
      }
    } catch (innerErr) {
      console.error('[SahAI] Error checking remote config cache:', innerErr);
    }
  }).catch(err => {
    console.error('[SahAI] Remote config initialization failed:', err);
  });
} catch (err) {
  console.error('[SahAI] Critical error initializing remote config:', err);
}

// Prevent unhandled rejections from crashing the service worker
self.addEventListener('unhandledrejection', (event) => {
  console.error('[SahAI] Unhandled rejection in service worker:', event.reason);
  event.preventDefault(); // Prevent crash if possible
});

// Store for side panel connections
const sidePanelPorts = new Set<chrome.runtime.Port>();

// Cache for extraction results
let lastExtractionResult: ExtractionResult | null = null;

// Open side panel on extension icon click
if (chrome.sidePanel) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch(err => console.warn('[SahAI] SidePanel setup failed:', err));
} else {
  console.warn('[SahAI] SidePanel API not available, falling back to popup');
  chrome.action.setPopup({ popup: 'sidepanel.html' }); // Reuse sidepanel as popup
}

// Handle connections from side panel
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidepanel') {
    console.log('[SahAI] Side panel connected');
    sidePanelPorts.add(port);

    // Send cached result if available
    if (lastExtractionResult) {
      port.postMessage({
        action: 'EXTRACTION_RESULT',
        result: lastExtractionResult,
      });
    }

    // Handle messages from side panel
    port.onMessage.addListener((message: Message) => {
      handleSidePanelMessage(message);
    });

    port.onDisconnect.addListener(() => {
      console.log('[SahAI] Side panel disconnected');
      sidePanelPorts.delete(port);
    });
  }
});

// Store pending extraction to send when side panel connects
let pendingExtraction: { result: ExtractionResult; mode: Mode } | null = null;

// Batch keylog writing
let pendingKeylogs: { userId: string; platform: string; prompts: CloudKeylogItem[] }[] = [];
let batchTimer: number | null = null;

async function flushKeylogs() {
  if (pendingKeylogs.length === 0) return;

  const toWrite = [...pendingKeylogs];
  pendingKeylogs = [];
  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }

  // Group by user and platform to minimize writes
  const groups = new Map<string, CloudKeylogItem[]>();

  for (const item of toWrite) {
    const key = `${item.userId}|${item.platform}`;
    const existing = groups.get(key) || [];
    groups.set(key, [...existing, ...item.prompts]);
  }

  for (const [key, prompts] of groups.entries()) {
    const [userId, platform] = key.split('|');
    await saveKeylogsToCloud(userId, platform, prompts);
  }
}

function queueKeylogWrite(userId: string, platform: string, prompts: CloudKeylogItem[]) {
  pendingKeylogs.push({ userId, platform, prompts });

  if (pendingKeylogs.length >= 5) {
    flushKeylogs();
  } else if (!batchTimer) {
    batchTimer = setTimeout(flushKeylogs, 30000) as unknown as number;
  }
}

// Track daily metrics
async function trackDailyMetrics(promptCount: number) {
  try {
    const db = await getDb();
    const today = new Date().toISOString().split('T')[0];
    const metricsRef = doc(db, 'metrics', today);

    const { setDoc } = await import('firebase/firestore');

    // Use setDoc with merge: true to create the doc if it doesn't exist
    await setDoc(metricsRef, {
      activeUsers: increment(1),
      totalPrompts: increment(promptCount),
      lastUpdated: Date.now()
    }, { merge: true });
  } catch (e) {
    // Ignore metrics errors
  }
}

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  console.log('[SahAI] Received message:', message.action);

  switch (message.action) {
    case 'EXTRACTION_FROM_PAGE': {
      // From floating buttons - extract prompts and open side panel
      const { result, mode } = message as { result: ExtractionResult; mode: Mode };
      lastExtractionResult = result;
      pendingExtraction = { result, mode };

      // Open the side panel
      const windowId = sender.tab?.windowId;
      if (windowId) {
        chrome.sidePanel.open({ windowId }).then(() => {
          console.log('[SahAI] Side panel opened');

          // Smart delivery: try immediately, then retry with backoff
          const deliverResult = (attempt = 1) => {
            if (!pendingExtraction) return; // Already delivered

            if (sidePanelPorts.size > 0) {
              // Sidepanel connected, deliver immediately
              broadcastToSidePanels({
                action: 'EXTRACTION_FROM_PAGE_RESULT',
                result: pendingExtraction.result,
                mode: pendingExtraction.mode,
              });
              pendingExtraction = null;
              console.log(`[SahAI] Result delivered on attempt ${attempt}`);
            } else if (attempt < 5) {
              // Not connected yet, retry with increasing delay
              const delay = attempt * 150; // 150, 300, 450, 600ms
              setTimeout(() => deliverResult(attempt + 1), delay);
            } else {
              console.warn('[SahAI] Could not deliver result - sidepanel never connected');
              pendingExtraction = null;
            }
          };

          // Start delivery attempts
          deliverResult();
        }).catch((err) => {
          console.error('[SahAI] Error opening side panel:', err);
        });
      }

      sendResponse({ success: true });
      break;
    }

    case 'EXTRACTION_RESULT': {
      const result = (message as { result: ExtractionResult }).result;
      lastExtractionResult = result;

      // Broadcast to all connected side panels
      broadcastToSidePanels({
        action: 'EXTRACTION_RESULT',
        result,
      });

      sendResponse({ success: true });
      break;
    }

    case 'STATUS_RESULT': {
      // Content script reporting its status
      broadcastToSidePanels(message);
      sendResponse({ success: true });
      break;
    }

    case 'SAVE_SESSION_PROMPTS': {
      const { prompts, platform, conversationId } = message as {
        prompts: any[];
        platform: string;
        conversationId?: string;
      };

      const today = new Date().toISOString().split('T')[0];
      const key = conversationId
        ? `keylog_${platform}_${conversationId}`
        : `keylog_${platform}_${today}`;

      chrome.storage.local.get([key], (result) => {
        const existing = result[key] || [];

        // Merge with deduplication
        const merged = [...existing];
        const existingContent = new Set(
          existing.map((p: any) => normalizeContent(p.content))
        );

        for (const prompt of prompts) {
          const normalized = normalizeContent(prompt.content);
          if (!existingContent.has(normalized)) {
            merged.push({
              ...prompt,
              conversationId: conversationId || prompt.conversationId,
              savedAt: Date.now(),
            });
            existingContent.add(normalized);
          }
        }

        chrome.storage.local.set({ [key]: merged });

        // Sync to cloud if user is logged in
        getCurrentUserId().then(userId => {
          if (userId && conversationId) {
            const cloudPrompts = prompts.map((p: any) => ({
              content: p.content,
              timestamp: p.timestamp,
              conversationId: conversationId,
              platform: platform
            }));

            queueKeylogWrite(userId, platform, cloudPrompts);
            trackDailyMetrics(prompts.length);
          }
        });
      });

      sendResponse({ success: true });
      break;
    }

    case 'GET_CONVERSATION_LOGS': {
      const { platform, conversationId } = message as {
        platform: string;
        conversationId: string;
      };

      const today = new Date().toISOString().split('T')[0];
      const specificKey = `keylog_${platform}_${conversationId}`;
      const generalKey = `keylog_${platform}_${today}`;

      chrome.storage.local.get([specificKey, generalKey], (result) => {
        let conversationLogs = result[specificKey] || [];

        // If no specific logs, check general logs and filter
        if (conversationLogs.length === 0 && result[generalKey]) {
          conversationLogs = result[generalKey].filter((log: any) =>
            log.conversationId === conversationId
          );
        }

        sendResponse({
          success: true,
          prompts: conversationLogs
        });
      });

      return true; // Keep channel open for async response
    }

    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }

  return true;
});

// Keep service worker alive during long operations
async function withKeepAlive<T>(operation: () => Promise<T>): Promise<T> {
  // Create a port to keep alive (Chrome workaround)
  let port: chrome.runtime.Port | null = chrome.runtime.connect({ name: 'keep-alive' });

  const keepAlive = setInterval(() => {
    if (port) {
      port.postMessage({ action: 'ping' });
    } else {
      // Reconnect if disconnected
      port = chrome.runtime.connect({ name: 'keep-alive' });
    }
  }, 25000);

  port.onDisconnect.addListener(() => {
    port = null;
  });

  try {
    return await operation();
  } finally {
    clearInterval(keepAlive);
    if (port) port.disconnect();
  }
}

// Track which tabs have content scripts injected
const injectedTabs = new Set<number>();

// Clean up when tab closes
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});

// Handle SPA navigation - notify existing script instead of re-injecting
chrome.webNavigation?.onHistoryStateUpdated.addListener(async (details) => {
  if (details.frameId !== 0) return; // Only main frame

  const platform = detectPlatformFromUrl(details.url);
  if (!platform) return;

  // If already injected, just notify the existing script
  if (injectedTabs.has(details.tabId)) {
    try {
      chrome.tabs.sendMessage(details.tabId, {
        action: 'URL_CHANGED',
        url: details.url
      });
      console.log(`[SahAI] Notified content script of URL change for ${platform}`);
    } catch (err) {
      // Script might have been unloaded, try re-injecting
      injectedTabs.delete(details.tabId);
    }
    return;
  }

  // Not injected yet, inject now
  try {
    await chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ['content.js'],
    });
    injectedTabs.add(details.tabId);
    console.log(`[SahAI] Injected content script for ${platform}`);
  } catch (err) {
    // Permission denied or other error
    console.warn(`[SahAI] Could not inject content script:`, err);
  }
});

// Handle messages from side panel
async function handleSidePanelMessage(message: Message) {
  console.log('[SahAI] Side panel message:', message.action);

  switch (message.action) {
    case 'EXTRACT_PROMPTS': {
      const mode = (message as { mode: Mode }).mode;

      // Send extraction request to active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        console.log('[SahAI] Sending EXTRACT_PROMPTS to tab:', tab.id);

        // Use a timeout for the tab message
        const messageTimeout = setTimeout(() => {
          broadcastToSidePanels({
            action: 'ERROR',
            error: 'Content script not responding. Please refresh the page.'
          });
        }, 5000);

        chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_PROMPTS', mode }, (response) => {
          clearTimeout(messageTimeout);
          if (chrome.runtime.lastError) {
            console.error('[SahAI] Error sending to tab:', chrome.runtime.lastError);
            broadcastToSidePanels({
              action: 'ERROR',
              error: 'Could not connect to the page. Please refresh and try again.'
            });
          } else {
            console.log('[SahAI] Content script acknowledged extraction:', response);
          }
        });
      } else {
        broadcastToSidePanels({
          action: 'ERROR',
          error: 'No active tab found.'
        });
      }
      break;
    }

    case 'GET_STATUS': {
      checkActiveTabStatus();
      break;
    }

    case 'SUMMARIZE_PROMPTS': {
      // Handle summarization request with Gemini
      const prompts = (message as { prompts: Array<{ content: string; index: number }> }).prompts;

      try {
        console.log(`[SahAI] Summarizing ${prompts.length} prompts...`);
        const result = await withKeepAlive(async () => {
          return await aiSummarizer.summarize(prompts);
        });
        console.log('[SahAI] Summarization successful');

        broadcastToSidePanels({
          action: 'SUMMARY_RESULT',
          result,
          success: true,
        });
      } catch (error) {
        console.error('[SahAI] Summarization error:', error);
        broadcastToSidePanels({
          action: 'SUMMARY_RESULT',
          result: {
            original: prompts,
            summary: prompts.map(p => p.content).join('\n\n---\n\n'),
            promptCount: { before: prompts.length, after: prompts.length },
          },
          success: false,
          error: error instanceof Error ? error.message : 'Summarization failed',
        });
      }
      break;
    }
  }
}

// Broadcast message to all connected side panels
function broadcastToSidePanels(message: unknown) {
  sidePanelPorts.forEach((port) => {
    try {
      port.postMessage(message);
    } catch (e) {
      console.error('[SahAI] Error sending to side panel:', e);
      sidePanelPorts.delete(port);
    }
  });
}

// Install handler - show welcome page on first install
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[SahAI] Extension installed:', details.reason);

  if (details.reason === 'install') {
    // Open welcome page on first install
    const { hasSeenWelcome } = await chrome.storage.local.get('hasSeenWelcome');
    if (!hasSeenWelcome) {
      chrome.tabs.create({ url: 'welcome.html' });
      chrome.storage.local.set({ hasSeenWelcome: true });
    }
  }
});

// Monitor tab changes to update side panel status
chrome.tabs.onActivated.addListener(() => {
  checkActiveTabStatus();
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    checkActiveTabStatus();
  }
});

// Helper to check status of active tab
async function checkActiveTabStatus() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    // If it's a restricted URL (chrome://, etc), send unsupported immediately
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      broadcastToSidePanels({
        action: 'STATUS_RESULT',
        supported: false,
        platform: null
      });
      return;
    }

    // 1. Fast Check: URL-based detection (Optimistic UI)
    const platform = detectPlatformFromUrl(tab.url);
    if (platform) {
      broadcastToSidePanels({
        action: 'STATUS_RESULT',
        supported: true,
        platform: platform
      });
    }

    // 2. Verify with Content Script (Source of Truth)
    // Try to ping the content script
    chrome.tabs.sendMessage(tab.id, { action: 'GET_STATUS' }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script not ready. If we detected a platform via URL, we might want to inject the script.
        // For now, we'll just rely on the optimistic update above.
        // If we didn't detect a platform, we send unsupported.
        if (!platform) {
          broadcastToSidePanels({
            action: 'STATUS_RESULT',
            supported: false,
            platform: null
          });
        }
      } else if (response) {
        broadcastToSidePanels(response);
      }
    });
  } catch (e) {
    console.error('[SahAI] Error checking tab status:', e);
  }
}

function detectPlatformFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    if (hostname.includes('chatgpt.com') || hostname.includes('openai.com')) return 'chatgpt';
    if (hostname.includes('claude.ai')) return 'claude';
    if (hostname.includes('gemini.google.com')) return 'gemini';
    if (hostname.includes('perplexity.ai')) return 'perplexity';
    if (hostname.includes('deepseek.com')) return 'deepseek';
    if (hostname.includes('lovable.dev')) return 'lovable';
    if (hostname.includes('bolt.new')) return 'bolt';
    if (hostname.includes('cursor.sh') || hostname.includes('cursor.com')) return 'cursor';
    if (hostname.includes('meta.ai')) return 'meta-ai';

    return null;
  } catch (e) {
    return null;
  }
}

// Helper function
function normalizeContent(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ').slice(0, 200);
}
