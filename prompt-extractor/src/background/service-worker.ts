import type { ExtractionResult, Message, Mode } from '../types';
import { aiSummarizer, initializeAISummarizer } from '../services/ai-summarizer';
import { saveKeylogsToCloud, getCurrentUserId } from '../services/firebase';

console.log('[PromptExtractor] Service worker started');

// Initialize AI summarizer
initializeAISummarizer();

// Store for side panel connections
const sidePanelPorts = new Set<chrome.runtime.Port>();

// Cache for extraction results
let lastExtractionResult: ExtractionResult | null = null;

// Open side panel on extension icon click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Handle connections from side panel
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidepanel') {
    console.log('[PromptExtractor] Side panel connected');
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
      console.log('[PromptExtractor] Side panel disconnected');
      sidePanelPorts.delete(port);
    });
  }
});

// Store pending extraction to send when side panel connects
let pendingExtraction: { result: ExtractionResult; mode: Mode } | null = null;

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  console.log('[PromptExtractor] Received message:', message.action);

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
          console.log('[PromptExtractor] Side panel opened');
          // Give the side panel time to connect
          setTimeout(() => {
            if (pendingExtraction) {
              broadcastToSidePanels({
                action: 'EXTRACTION_FROM_PAGE_RESULT',
                result: pendingExtraction.result,
                mode: pendingExtraction.mode,
              });
              pendingExtraction = null;
            }
          }, 500);
        }).catch((err) => {
          console.error('[PromptExtractor] Error opening side panel:', err);
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
      const { prompts, platform } = message as { prompts: any[], platform: string };
      // Save to local storage with a key that includes the platform and date
      const today = new Date().toISOString().split('T')[0];
      const key = `keylog_${platform}_${today}`;

      chrome.storage.local.get([key], (result) => {
        const existing = result[key] || [];
        // Merge and deduplicate based on content
        const merged = [...existing];
        const existingContent = new Set(existing.map((p: any) => p.content));

        for (const prompt of prompts) {
          if (!existingContent.has(prompt.content)) {
            merged.push(prompt);
            existingContent.add(prompt.content);
          }
        }

        chrome.storage.local.set({ [key]: merged });

        // Sync to cloud if user is logged in
        const userId = getCurrentUserId();
        if (userId) {
          saveKeylogsToCloud(userId, platform, prompts.map((p: any) => ({
            content: p.content,
            timestamp: p.timestamp,
            conversationId: p.conversationId || 'unknown',
            platform: platform
          })));
        }
      });

      sendResponse({ success: true });
      break;
    }

    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }

  return true;
});

// Handle messages from side panel
async function handleSidePanelMessage(message: Message) {
  console.log('[PromptExtractor] Side panel message:', message.action);

  switch (message.action) {
    case 'EXTRACT_PROMPTS': {
      const mode = (message as { mode: Mode }).mode;

      // Send extraction request to active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_PROMPTS', mode });
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
        const result = await aiSummarizer.summarize(prompts);
        broadcastToSidePanels({
          action: 'SUMMARY_RESULT',
          result,
          success: true,
        });
      } catch (error) {
        console.error('[PromptExtractor] Summarization error:', error);
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
      console.error('[PromptExtractor] Error sending to side panel:', e);
      sidePanelPorts.delete(port);
    }
  });
}

// Install handler - show welcome page on first install
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[PromptExtractor] Extension installed:', details.reason);

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
    console.error('[PromptExtractor] Error checking tab status:', e);
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
