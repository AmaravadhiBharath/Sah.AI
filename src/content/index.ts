import { getAdapter, getPlatformName } from './adapters';
import { RemoteConfigService } from '../services/remote-config';
import { getScrollConfig, getConfigTier } from './scroll-config';
import type { ExtractionResult, ScrapedPrompt } from '../types';

// Global lock to prevent concurrent extractions
let isExtracting = false;

// Get the current adapter
// Get the current adapter
let adapter = getAdapter();
let platformName = getPlatformName();

// Function to update adapter on navigation
function updateAdapter() {
  adapter = getAdapter();
  platformName = getPlatformName();
  console.log(`[SahAI] Adapter updated: ${platformName || 'unknown'}`);

  // Update debug info
  (window as any).__pe_debug = {
    adapter,
    platformName,
    sessionPrompts,
    getConversationId,
    findInputContainer
  };
}

// Initialize Remote Config (fire and forget)
RemoteConfigService.getInstance().initialize();

console.log('[SahAI] Content script loaded v1.2.9');
console.log(`[SahAI] URL: ${window.location.href}`);
console.log(`[SahAI] Platform detected: ${platformName || 'unknown'}`);

// Session storage for captured prompts (new prompts only)
let sessionPrompts: ScrapedPrompt[] = [];

// Expose for console debugging
(window as any).__pe_debug = {
  adapter,
  platformName,
  sessionPrompts,
  getConversationId,
  findInputContainer
};

if (!adapter) {
  console.warn('[SahAI] No adapter found for this page. Buttons will not be shown.');
}

// Store copied content for paste functionality
let copiedContent: string | null = null;
const SEND_BUTTON_SELECTORS: Record<string, string[]> = {
  chatgpt: [
    'button[data-testid="send-button"]',
    'button[data-testid="composer-send-button"]',
    'form button[type="submit"]',
    'button[aria-label*="Send"]',
  ],
  claude: [
    'button[aria-label="Send Message"]',
    'button[type="submit"]',
    'fieldset button:last-child',
  ],
  gemini: [
    'button[aria-label*="Send"]',
    '.send-button',
    'button[data-test-id="send-button"]',
  ],
  perplexity: [
    'button[aria-label="Submit"]',
    'button[type="submit"]',
  ],
  deepseek: [
    'button[data-testid="send-button"]',
    '.send-btn',
  ],
  lovable: [
    'button[type="submit"]',
    'button[aria-label*="Send"]',
  ],
  bolt: [
    'button[type="submit"]',
    '.send-button',
  ],
  cursor: [
    'button[type="submit"]',
  ],
  'meta-ai': [
    'button[aria-label*="Send"]',
    'button[type="submit"]',
  ],
};

const TEXTAREA_SELECTORS: Record<string, string[]> = {
  chatgpt: [
    '#prompt-textarea',
    'textarea[data-id="root"]',
    'div[contenteditable="true"][data-placeholder]',
  ],
  claude: [
    'div[contenteditable="true"]',
    'fieldset div[contenteditable]',
  ],
  gemini: [
    '.ql-editor',
    'rich-textarea div[contenteditable]',
    'textarea',
  ],
  perplexity: [
    'textarea',
    'div[contenteditable="true"]',
  ],
  deepseek: [
    'textarea',
    '#chat-input textarea',
  ],
  lovable: [
    'textarea',
  ],
  bolt: [
    'textarea',
  ],
  cursor: [
    'textarea',
  ],
  'meta-ai': [
    'div[contenteditable="true"]',
    'textarea',
  ],
};

// Get text from input element
function getInputText(element: HTMLElement | null): string {
  if (!element) return '';

  if (element instanceof HTMLTextAreaElement) {
    return element.value.trim();
  }

  if (element.getAttribute('contenteditable') === 'true') {
    return element.innerText?.trim() || element.textContent?.trim() || '';
  }

  return '';
}

// Find the active textarea/input
function findActiveInput(): HTMLElement | null {
  const selectors = TEXTAREA_SELECTORS[platformName || ''] || [];

  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && element.offsetParent !== null) {
      return element;
    }
  }

  // Fallback: any visible textarea or contenteditable
  const textarea = document.querySelector('textarea:not([type="hidden"])') as HTMLElement;
  if (textarea && textarea.offsetParent !== null) return textarea;

  const contentEditable = document.querySelector('[contenteditable="true"]') as HTMLElement;
  if (contentEditable && contentEditable.offsetParent !== null) return contentEditable;

  return null;
}

// Capture prompt before submission
function capturePrompt(): string | null {
  const input = findActiveInput();
  const text = getInputText(input);

  if (text && text.length > 0) {
    console.log('[SahAI] Captured prompt:', text.slice(0, 50) + '...');
    return text;
  }

  return null;
}

// Add captured prompt to session storage
// ============================================
// Improved Session Storage with Conversation Isolation
// ============================================

// Extract clean conversation ID from URL
function getConversationId(): string {
  const url = window.location.href;

  // Platform-specific ID extraction
  const patterns: Record<string, RegExp> = {
    chatgpt: /\/c\/([a-zA-Z0-9-]+)/,
    claude: /\/chat\/([a-zA-Z0-9-]+)/,
    gemini: /\/app\/([a-zA-Z0-9-]+)/,
    perplexity: /\/search\/([a-zA-Z0-9-]+)/,
    deepseek: /\/chat\/([a-zA-Z0-9-]+)/,
    lovable: /\/projects\/([a-zA-Z0-9-]+)/,
    bolt: /\/~\/([a-zA-Z0-9-]+)/,
    cursor: /\/chat\/([a-zA-Z0-9-]+)/,
    'meta-ai': /\/c\/([a-zA-Z0-9-]+)/,
  };

  const pattern = patterns[platformName || ''];
  if (pattern) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  // Fallback: hash the pathname (without query params)
  const pathname = new URL(url).pathname;
  return `fallback_${hashString(pathname)}`;
}

// Simple hash function for fallback IDs
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Storage key now includes conversation
function getStorageKey(): string {
  const conversationId = getConversationId();
  return `sessionPrompts_${platformName}_${conversationId}`;
}

// Updated addToSession
function addToSession(text: string) {
  if (!text || text.trim().length === 0) return;

  const conversationId = getConversationId();
  const content = text.trim();
  const lowerContent = content.toLowerCase();

  // SYSTEM CHOICE FILTER
  if (lowerContent.includes('branding approach:') ||
    lowerContent.includes('selected option:') ||
    lowerContent.includes('choice:')) {
    console.log('[SahAI] Skipping system choice capture');
    return;
  }

  // DEDUPLICATION CHECK
  const isDuplicate = sessionPrompts.some(p =>
    normalizeForComparison(p.content) === normalizeForComparison(content)
  );

  if (isDuplicate) {
    console.log('[SahAI] Skipping duplicate prompt');
    return;
  }

  const prompt: ScrapedPrompt = {
    content,
    index: sessionPrompts.length,
    timestamp: Date.now(),
    conversationId,
    source: 'keylog',
  };

  sessionPrompts.push(prompt);

  // Save with conversation-specific key
  const storageKey = getStorageKey();

  chrome.storage.session?.set({
    [storageKey]: sessionPrompts
  }).catch(() => {
    chrome.storage.local.set({
      [storageKey]: sessionPrompts
    });
  });

  console.log(`[SahAI] Session prompts for ${conversationId}: ${sessionPrompts.length}`);

  // Send to background for persistent storage with retry
  const sendToBackground = (retries = 2) => {
    chrome.runtime.sendMessage({
      action: 'SAVE_SESSION_PROMPTS',
      prompts: [prompt],
      platform: platformName || 'unknown',
      conversationId,
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn('[SahAI] Failed to save prompt:', chrome.runtime.lastError.message);
        if (retries > 0) {
          // Retry after a short delay (service worker might be waking up)
          setTimeout(() => sendToBackground(retries - 1), 500);
        } else {
          console.error('[SahAI] Could not save prompt after retries. Data saved locally only.');
        }
      } else if (response?.success) {
        console.log('[SahAI] Prompt saved to background');
      }
    });
  };
  sendToBackground();
}

// Updated loadSessionPrompts
async function loadSessionPrompts() {
  try {
    const storageKey = getStorageKey();
    const data = await chrome.storage.session?.get(storageKey)
      || await chrome.storage.local.get(storageKey);

    if (data[storageKey]) {
      sessionPrompts = data[storageKey];
      console.log(`[SahAI] Loaded ${sessionPrompts.length} session prompts for conversation`);
    }
  } catch (e) {
    console.log('[SahAI] Could not load session prompts');
  }
}

// Hook into send button clicks
function hookSendButton() {
  const selectors = SEND_BUTTON_SELECTORS[platformName || ''] || [];

  for (const selector of selectors) {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(button => {
      if (button.getAttribute('data-pe-hooked')) return;

      button.setAttribute('data-pe-hooked', 'true');

      // Capture on mousedown (before click clears input)
      button.addEventListener('mousedown', () => {
        const text = capturePrompt();
        if (text) {
          // Store temporarily, add after confirmation
          (button as any).__peText = text;
        }
      }, true);

      // Confirm on click
      button.addEventListener('click', () => {
        const text = (button as any).__peText;
        if (text) {
          addToSession(text);
          (button as any).__peText = null;
        }
      }, true);

      console.log('[SahAI] Hooked send button:', selector);
    });
  }
}

// Hook into keyboard submission (Enter/Ctrl+Enter)
// Hook into keyboard submission with proper detection
function hookKeyboardSubmit() {
  const input = findActiveInput();
  if (!input || input.getAttribute('data-pe-key-hooked')) return;

  input.setAttribute('data-pe-key-hooked', 'true');

  let pendingCapture: { text: string; timestamp: number } | null = null;

  input.addEventListener('keydown', (e: KeyboardEvent) => {
    const isEnter = e.key === 'Enter';
    const isCtrlEnter = e.key === 'Enter' && (e.ctrlKey || e.metaKey);
    const isShiftEnter = e.key === 'Enter' && e.shiftKey;

    // Most platforms: Enter sends (not Shift+Enter which is newline)
    if ((isEnter && !isShiftEnter) || isCtrlEnter) {
      const text = capturePrompt();
      if (text && text.length > 0) {
        pendingCapture = { text, timestamp: Date.now() };
      }
    }
  }, true);

  // Watch for input clearing (indicates successful send)
  const observer = new MutationObserver(() => {
    if (!pendingCapture) return;

    // Check if within 2 seconds of capture
    if (Date.now() - pendingCapture.timestamp > 2000) {
      pendingCapture = null;
      return;
    }

    const currentText = getInputText(input);

    // If input is now empty or significantly shorter, the send succeeded
    if (!currentText || currentText.length < 10) {
      addToSession(pendingCapture.text);
      pendingCapture = null;
    }
  });

  // Observe the input for changes
  observer.observe(input, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['value'],
  });

  // Also observe parent for input replacement (some SPAs replace the element)
  if (input.parentElement) {
    observer.observe(input.parentElement, {
      childList: true,
    });
  }

  console.log('[SahAI] Hooked keyboard submit with MutationObserver');
}

// Initialize real-time capture
// Initialize real-time capture with single mechanism
function initRealTimeCapture() {
  if (!adapter || !platformName) return;

  loadSessionPrompts();

  // Initial hook
  hookSendButton();
  hookKeyboardSubmit();

  // Single observer for DOM changes (replaces setInterval + MutationObserver)
  let hookDebounceTimer: number | null = null;

  const observer = new MutationObserver(() => {
    // Debounce: only run hooks 500ms after last DOM change
    if (hookDebounceTimer) clearTimeout(hookDebounceTimer);

    hookDebounceTimer = setTimeout(() => {
      hookSendButton();
      hookKeyboardSubmit();
    }, 500) as unknown as number;
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Also watch for URL changes (SPA navigation)
  let lastUrl = location.href;
  const urlObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log('[SahAI] URL changed, reloading session');

      // Reset session for new conversation
      sessionPrompts = [];
      loadSessionPrompts();

      // Re-hook after URL change
      setTimeout(() => {
        hookSendButton();
        hookKeyboardSubmit();
      }, 1000);
    }
  });

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log('[SahAI] Real-time capture initialized (optimized)');
}

// Scroll the conversation to the top to load all history
// Uses platform-specific scroll configuration for optimal extraction
async function scrollConversation(): Promise<void> {
  if (!adapter) return;

  const container = adapter.getScrollContainer();
  if (!container) {
    console.warn('[SahAI] No scroll container found, skipping history load');
    return;
  }

  // Get platform-specific scroll configuration
  const config = getScrollConfig(platformName);
  const tier = getConfigTier(platformName);

  console.log(`[SahAI] Starting conversation scroll on container: ${container.tagName}`);
  console.log(`[SahAI] Platform: ${platformName} (${tier})`);
  console.log(`[SahAI] Config: top=${config.topAttempts}, bottom=${config.bottomAttempts}, wait=${config.waitPerScroll}ms, stability=${config.stabilityChecks}`);

  // Phase 1: Scroll to BOTTOM to trigger lazy-load of ALL content
  let maxHeight = 0;

  chrome.runtime.sendMessage({
    action: 'PROGRESS',
    message: 'Loading conversation history (discovering all messages)...'
  });

  console.log(`[SahAI] Phase 1: Scrolling to bottom (${config.bottomAttempts} attempts)...`);
  for (let i = 0; i < config.bottomAttempts; i++) {
    container.scrollTop = container.scrollHeight;
    container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });
    await new Promise(resolve => setTimeout(resolve, config.waitPerScroll));

    const currentHeight = container.scrollHeight;
    console.log(`[SahAI] Bottom scroll ${i + 1}/${config.bottomAttempts}: height ${currentHeight}px (max: ${maxHeight}px)`);

    if (currentHeight === maxHeight) {
      console.log('[SahAI] Height stable - all content discovered');
      break;
    }
    maxHeight = currentHeight;
  }

  // Phase 2: Scroll to TOP to load oldest messages
  // Virtual scrolling keeps messages in DOM when in viewport
  console.log(`[SahAI] Phase 2: Scrolling to top (${config.topAttempts} attempts)...`);
  chrome.runtime.sendMessage({
    action: 'PROGRESS',
    message: 'Loading oldest messages...'
  });

  let topMaxHeight = 0;
  let topSameHeightCount = 0;

  for (let i = 0; i < config.topAttempts; i++) {
    container.scrollTop = 0;
    container.scrollTo({ top: 0, behavior: 'auto' });
    await new Promise(resolve => setTimeout(resolve, config.waitPerScroll));

    const currentHeight = container.scrollHeight;
    console.log(`[SahAI] Top scroll ${i + 1}/${config.topAttempts}: height ${currentHeight}px (max: ${topMaxHeight}px)`);

    // Stop if height stabilizes (no new content loading)
    if (currentHeight === topMaxHeight) {
      topSameHeightCount++;
      if (topSameHeightCount >= config.stabilityChecks) {
        console.log(`[SahAI] Top height stable for ${config.stabilityChecks} checks - all oldest messages loaded`);
        break;
      }
    } else {
      topSameHeightCount = 0;
    }
    topMaxHeight = currentHeight;
  }

  console.log(`[SahAI] Scroll complete. Total height: ${container.scrollHeight}px. Ready for extraction.`);
}

// Extract from multiple scroll positions in parallel
// Uses platform-specific wait time for optimal rendering
async function extractFromMultiplePositions(adapter: any): Promise<ScrapedPrompt[]> {
  const allPrompts: ScrapedPrompt[] = [];
  const globalSeen = new Set<string>();
  let nextIndex = 0;

  const container = adapter.getScrollContainer();
  if (!container) {
    console.warn('[SahAI] No scroll container for parallel extraction');
    return adapter.scrapePrompts();
  }

  const config = getScrollConfig(platformName);
  const totalHeight = container.scrollHeight;
  console.log(`[SahAI] Starting parallel extraction from height: ${totalHeight}px`);
  console.log(`[SahAI] Using platform wait time: ${config.parallelWait}ms`);

  // Define extraction points: top, 25%, 50%, 75%, bottom
  const extractionPoints = [
    { name: 'TOP', position: 0 },
    { name: '25%', position: totalHeight * 0.25 },
    { name: 'MIDDLE', position: totalHeight * 0.5 },
    { name: '75%', position: totalHeight * 0.75 },
    { name: 'BOTTOM', position: totalHeight }
  ];

  console.log(`[SahAI] Extracting from ${extractionPoints.length} positions...`);

  // Extract from each position
  for (const point of extractionPoints) {
    console.log(`[SahAI] [${point.name}] Scrolling to ${Math.round(point.position)}px...`);

    // Scroll to position
    container.scrollTop = point.position;
    container.scrollTo({ top: point.position, behavior: 'auto' });

    // Wait for content to render (async - allows browser to render)
    // Uses platform-specific wait time from config
    await new Promise(resolve => setTimeout(resolve, config.parallelWait));

    // Extract from this position
    const pointPrompts = adapter.scrapePrompts();
    console.log(`[SahAI] [${point.name}] Found ${pointPrompts.length} prompts`);

    // Merge without duplicates
    for (const prompt of pointPrompts) {
      if (!globalSeen.has(prompt.content)) {
        globalSeen.add(prompt.content);
        prompt.index = nextIndex++;
        prompt.source = 'dom';
        allPrompts.push(prompt);
        console.log(`[SahAI] [${point.name}] Added: ${prompt.content.slice(0, 40)}...`);
      } else {
        console.log(`[SahAI] [${point.name}] Duplicate: ${prompt.content.slice(0, 40)}...`);
      }
    }
  }

  console.log(`[SahAI] Parallel extraction complete: ${allPrompts.length} unique prompts`);
  return allPrompts;
}

// Extract prompts from the current page
async function extractPrompts(): Promise<ScrapedPrompt[]> {
  // 1. Perform scrolling to load history if needed
  if (adapter) {
    await scrollConversation();
  }

  // 2. Get current session prompts (what we just typed in this tab)
  const currentSessionPrompts = [...sessionPrompts];

  // 3. Get persistent keylogs for this conversation from background
  const conversationId = getConversationId();

  let persistentPrompts: ScrapedPrompt[] = [];

  if (conversationId) {
    try {
      console.log('[SahAI] Fetching persistent logs for:', conversationId);
      // Add a timeout to the message call to prevent hanging
      const responsePromise = chrome.runtime.sendMessage({
        action: 'GET_CONVERSATION_LOGS',
        platform: platformName,
        conversationId
      });

      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve({ prompts: [] }), 1500)
      );

      const response = await Promise.race([responsePromise, timeoutPromise]) as any;

      if (response && response.prompts) {
        persistentPrompts = response.prompts;
        console.log(`[SahAI] Found ${persistentPrompts.length} persistent prompts`);
      }
    } catch (e) {
      console.error('[SahAI] Failed to fetch persistent logs:', e);
    }
  }

  // 4. Merge current session + persistent logs
  let allKeyloggedPrompts = [...persistentPrompts];

  // Add current session prompts if they aren't already in persistent logs
  const persistentContent = new Set(persistentPrompts.map(p => normalizeForComparison(p.content)));
  for (const p of currentSessionPrompts) {
    if (!persistentContent.has(normalizeForComparison(p.content))) {
      allKeyloggedPrompts.push(p);
    }
  }

  // 5. Merge with DOM scraping (with parallel multi-position extraction for ALL platforms)
  let finalPrompts = [...allKeyloggedPrompts];

  if (adapter) {
    console.log('[SahAI] Augmenting with DOM scraping...');
    console.log(`[SahAI] Using aggressive parallel extraction for ${platformName}...`);
    let domPrompts: ScrapedPrompt[] = [];

    // Use aggressive parallel multi-position extraction for ALL platforms
    // Each platform uses its own scroll configuration (TIER 1, 2, or 3)
    domPrompts = await extractFromMultiplePositions(adapter);

    const existingContent = new Set(allKeyloggedPrompts.map(p => normalizeForComparison(p.content)));

    for (const p of domPrompts) {
      if (!existingContent.has(normalizeForComparison(p.content))) {
        finalPrompts.push(p);
      }
    }
  }

  // 6. Final sort and return
  return finalPrompts.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
}

// Merge session and DOM prompts, avoiding duplicates

// Normalize text for comparison
function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 200); // Compare first 200 chars
}

// Create extraction result
function createExtractionResult(prompts: ScrapedPrompt[]): ExtractionResult {
  const conversationId = getConversationId();

  return {
    platform: platformName || 'unknown',
    url: window.location.href,
    title: document.title,
    prompts,
    extractedAt: Date.now(),
    conversationId,
  };
}

// ============================================
// Zone 1: Top Row Buttons
// ============================================

const BUTTON_STYLES = `

  .pe-has-zone1-absolute {
    position: relative !important;
    padding-top: 48px !important;
    overflow: visible !important;
  }

  .pe-zone1 {
    position: absolute !important;
    top: 8px !important;
    left: 8px !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    width: calc(100% - 16px) !important;
    box-sizing: border-box !important;
    background: transparent !important;
    padding-bottom: 0 !important;
    border-bottom: none !important;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif !important;
    z-index: 2147483647 !important;
    pointer-events: auto !important;
    visibility: visible !important;
    opacity: 1 !important;
    height: 32px !important;
  }
  
  .pe-zone1-btn {
    position: relative !important;
    z-index: 10001 !important;
    box-sizing: border-box !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 28px !important;
    min-height: 28px !important;
    max-height: 28px !important;
    padding: 0 12px !important;
    border-radius: 14px !important;
    font-size: 12px !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
    font-weight: 600 !important;
    line-height: 1 !important;
    margin: 0 !important;
    text-transform: none !important;
    letter-spacing: normal !important;
    cursor: pointer !important;
    transition: all 150ms ease !important;
    white-space: nowrap !important;
    pointer-events: auto !important;
    outline: none !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
  }
  
  .pe-zone1-btn:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
  }

  .pe-zone1-btn:active {
    transform: scale(0.96) !important;
    transition: transform 50ms ease-out !important;
  }

  .pe-zone1-btn.loading {
    pointer-events: none !important;
    opacity: 0.8 !important;
  }
  
  .pe-zone1-btn.extract {
    background: #000000 !important;
    color: #ffffff !important;
    border: 1px solid #000000 !important;
  }
  
  .pe-zone1-btn.paste {
    background: #ffffff !important;
    color: #000000 !important;
    border: 1px solid rgba(0,0,0,0.1) !important;
  }
  
  .pe-zone1-btn svg {
    width: 12px !important;
    height: 12px !important;
    margin-right: 6px !important;
    display: inline-block !important;
    vertical-align: middle !important;
    flex-shrink: 0 !important;
    stroke-width: 2.5 !important;
  }

  @keyframes pe-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .pe-spinner {
    animation: pe-spin 1s linear infinite !important;
    transform-origin: center !important;
  }
`;

// Platform-specific input container selectors
const INPUT_CONTAINER_SELECTORS: Record<string, string[]> = {
  chatgpt: [
    '#composer-background',
    '[data-testid="composer-background"]',
    '#prompt-textarea-wrapper',
    'form[class*="stretch"] > div > div',
    'form.w-full > div > div[class*="relative"]',
    'main form > div > div',
  ],
  claude: [
    'div:has(> [contenteditable="true"])',
    'div.relative:has([contenteditable="true"])',
    'fieldset:has([contenteditable="true"])',
    'form:has([contenteditable="true"])',
    '[data-testid="composer-container"]',
    '.composer-container',
  ],
  gemini: [
    'rich-textarea',
    '.input-area',
    '.input-area-container',
    'section[class*="input-area"]',
    '.text-input-field_textarea-wrapper',
  ],
  perplexity: [
    '[data-testid="ask-input-container"]',
    '.ask-input-container',
  ],
  deepseek: [
    '.chat-input-container',
    '#chat-input',
  ],
  lovable: [
    '.prompt-input-container',
    '[data-testid="prompt-input"]',
    'div[class*="PromptBox"]',
    'div[class*="InputArea"]',
  ],
  bolt: [
    '.chat-input',
    '[data-testid="chat-input"]',
  ],
  cursor: [
    '.input-container',
    '[data-testid="input"]',
  ],
  'meta-ai': [
    '[data-testid="composer"]',
    '.composer',
  ],
};

// Find the main input container
function findInputContainer(): HTMLElement | null {
  const selectors = INPUT_CONTAINER_SELECTORS[platformName || ''] || [];

  // 1. Try platform-specific selectors first
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && element.offsetParent !== null) {
      // CRITICAL: Never inject inside a contenteditable area or textarea
      if (element.getAttribute('contenteditable') === 'true' || element.tagName === 'TEXTAREA') {
        // console.log('[SahAI] Skipping selector match because it is a text input area:', selector);
        continue;
      }

      // Ensure it's not a hidden wrapper
      const style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        continue;
      }

      const rect = element.getBoundingClientRect();
      if (rect.height > 450 || rect.height < 20) continue;
      // console.log('[SahAI] Found input via platform selector:', selector);
      return element;
    }
  }

  // 2. Claude specific: find input and get parent container
  if (platformName === 'claude') {
    const input = document.querySelector('[contenteditable="true"], textarea');
    if (input && (input as HTMLElement).offsetParent !== null) {
      // Method A: Look for the immediate relative wrapper (the "box")
      const container = input.closest('div.relative, fieldset, form');
      if (container && (container as HTMLElement).offsetParent !== null) {
        const rect = container.getBoundingClientRect();
        // The chat box is usually between 40px and 400px
        if (rect.height > 30 && rect.height < 450) {
          // console.log('[SahAI] Found Claude input container via closest()');
          return container as HTMLElement;
        }
      }

      // Method B: Heuristic search for stable parent
      let parent = input.parentElement;
      let depth = 0;
      while (parent && depth < 6) {
        const rect = parent.getBoundingClientRect();
        const isEditable = parent.getAttribute('contenteditable') === 'true';
        const style = window.getComputedStyle(parent);
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';

        if (rect.height > 30 && rect.height < 400 && !isEditable && isVisible) {
          // console.log('[SahAI] Found Claude input container via heuristic at depth', depth);
          return parent as HTMLElement;
        }
        parent = parent.parentElement;
        depth++;
      }
    }
  }

  // 3. ChatGPT specific: find the form and get the inner container
  if (platformName === 'chatgpt') {
    const form = document.querySelector('form[class*="stretch"], form.w-full') as HTMLElement;
    if (form) {
      const innerDiv = form.querySelector('div[class*="rounded"]') as HTMLElement;
      if (innerDiv && innerDiv.offsetParent !== null) return innerDiv;
      const firstDiv = form.querySelector(':scope > div > div') as HTMLElement;
      if (firstDiv) return firstDiv;
    }
  }

  // 4. Generic fallback: find visible textarea's styled parent
  const textareas = document.querySelectorAll('textarea, [contenteditable="true"]');
  for (const textarea of textareas) {
    if ((textarea as HTMLElement).offsetParent !== null) {
      let parent = textarea.parentElement;
      let depth = 0;
      while (parent && depth < 6) {
        const style = window.getComputedStyle(parent);
        // Look for the rounded container or background
        const hasRadius = style.borderRadius && style.borderRadius !== '0px';
        const hasBg = style.backgroundColor !== 'transparent' && style.backgroundColor !== 'rgba(0, 0, 0, 0)';

        if (hasRadius || hasBg) {
          const rect = parent.getBoundingClientRect();
          if (rect.height < 450) {
            // console.log('[SahAI] Found container via textarea parent heuristic');
            return parent;
          }
        }
        parent = parent.parentElement;
        depth++;
      }
    }
  }

  // 5. Any form that contains a textarea
  const forms = document.querySelectorAll('form');
  for (const form of forms) {
    if (form.querySelector('textarea, [contenteditable="true"]')) {
      const rect = form.getBoundingClientRect();
      if (rect.height < 450) return form;
    }
  }

  return null;
}

// Inject styles
function injectStyles() {
  if (document.getElementById('pe-styles')) return;

  const style = document.createElement('style');
  style.id = 'pe-styles';
  style.textContent = BUTTON_STYLES;
  (document.head || document.documentElement).appendChild(style);
}

// Create Zone 1 button row
function createZone1(): HTMLElement {
  // console.log('[SahAI] Creating Zone 1 buttons...');
  const zone1 = document.createElement('div');
  zone1.id = 'pe-zone1';
  zone1.className = 'pe-zone1';

  // Extract button
  const extractBtn = document.createElement('button');
  extractBtn.id = 'pe-extract-btn';
  extractBtn.className = 'pe-zone1-btn extract';
  extractBtn.textContent = 'Extract';
  extractBtn.title = 'Extract prompts to SahAI';
  extractBtn.addEventListener('click', (e) => {
    // console.log('[SahAI] Extract button clicked');
    e.preventDefault();
    e.stopPropagation();
    handleButtonClick('raw', extractBtn);
  }, true); // Use capture phase
  zone1.appendChild(extractBtn);

  return zone1;
}

// Inject Figma-style floating pill
// Handle button click
async function handleButtonClick(mode: 'raw' | 'summary', button: HTMLButtonElement) {
  console.log(`[SahAI] Button clicked: ${mode}`);
  const originalText = button.textContent;

  // 1. Open sidepanel immediately
  chrome.runtime.sendMessage({ action: 'OPEN_SIDE_PANEL' });

  // 1.5. Notify sidepanel that extraction was triggered
  setTimeout(() => {
    chrome.runtime.sendMessage({ action: 'EXTRACT_TRIGERED_FROM_PAGE' });
  }, 500);

  button.classList.add('loading');
  button.innerHTML = `
    <svg class="pe-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
    </svg>
    Extracting...
  `;

  try {
    console.log('[SahAI] Starting extraction...');
    const prompts = await extractPrompts();
    console.log(`[SahAI] Extracted ${prompts.length} prompts`);

    const result = createExtractionResult(prompts);

    console.log('[SahAI] Sending EXTRACTION_FROM_PAGE to background...');
    chrome.runtime.sendMessage({
      action: 'EXTRACTION_FROM_PAGE',
      result,
      mode,
    });

    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width:14px; height:14px; margin-right:6px; display:inline-block; vertical-align:middle;">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Done!
    `;

  } catch (error) {
    console.error('[SahAI] Error:', error);
    button.textContent = 'Error';
  } finally {
    setTimeout(() => {
      button.classList.remove('loading');
      button.textContent = originalText;
    }, 2000);
  }
}

// Create the two-zone layout
function createZonedLayout() {
  console.log('[SahAI] Attempting to create zoned layout...');
  if (document.getElementById('pe-zone1')) return;
  if (!adapter) return;

  const url = window.location.href;
  const hasConversationId = url.includes('/c/') || url.includes('/chat/') || url.includes('/thread/') || url.includes('/projects/');

  const urlObj = new URL(url);
  const isRootPath = (urlObj.hostname.includes('chatgpt.com') || urlObj.hostname.includes('openai.com')) &&
    (urlObj.pathname === '/' || urlObj.pathname === '');

  // Claude uses different URL patterns than ChatGPT
  if (platformName === 'claude') {
    // Claude is at claude.ai/chat, not claude.ai alone
    if (window.location.hostname.includes('claude.ai') && !window.location.pathname.includes('/chat')) {
      return;
    }
  } else if (platformName === 'chatgpt' && !hasConversationId && !isRootPath) {
    return;
  }

  const inputContainer = findInputContainer();

  injectStyles();

  if (inputContainer) {
    // Standard mode: inject into input container

    // Revert any previous style changes that might break alignment
    inputContainer.style.display = '';
    inputContainer.style.flexDirection = '';
    inputContainer.style.alignItems = '';
    inputContainer.style.gap = '';

    // Use absolute positioning for Zone 1
    inputContainer.classList.add('pe-has-zone1-absolute');

    // Create Zone 1
    const zone1 = createZone1();

    // Prepend inside the container
    inputContainer.prepend(zone1);

    // Only remove floating buttons if we successfully added zone1
    if (document.getElementById('pe-zone1')) {
      const floating = document.getElementById('pe-floating-zone');
      if (floating) floating.remove();

      // If we are on Claude, watch the container to re-inject if buttons are removed
      if (platformName === 'claude') {
        const stickyObserver = new MutationObserver(() => {
          // 1. Re-inject buttons if removed
          if (!document.getElementById('pe-zone1')) {
            console.log('[SahAI] Claude removed buttons, re-injecting...');
            inputContainer.prepend(createZone1());
          }

          // 2. Re-apply layout class if removed (prevents overlapping)
          if (!inputContainer.classList.contains('pe-has-zone1-absolute')) {
            console.log('[SahAI] Claude removed layout class, re-applying...');
            inputContainer.classList.add('pe-has-zone1-absolute');
            // Force the style just in case class isn't enough
            inputContainer.style.paddingTop = '48px';
          }
        });

        stickyObserver.observe(inputContainer, {
          childList: true,
          attributes: true,
          attributeFilter: ['class', 'style']
        });
      }
    }

    console.log('[SahAI] Zoned layout initialized (Input Container Mode)');
  }
}

// Show paste button
function showPasteButton() {
  const zone1 = document.getElementById('pe-zone1');
  if (!zone1 || document.getElementById('pe-paste-btn')) return;

  const pasteBtn = document.createElement('button');
  pasteBtn.id = 'pe-paste-btn';
  pasteBtn.className = 'pe-zone1-btn paste';
  pasteBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
       <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
       <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
    Paste
  `;
  pasteBtn.title = 'Paste copied prompts into Chat';
  pasteBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handlePaste();
  };
  zone1.appendChild(pasteBtn);
}

// Hide paste button
function hidePasteButton() {
  const pasteBtn = document.getElementById('pe-paste-btn');
  if (pasteBtn) pasteBtn.remove();
}

// Handle paste action
// Handle paste action
async function handlePaste() {
  let textToPaste = copiedContent;

  if (!textToPaste) {
    try {
      textToPaste = await navigator.clipboard.readText();
    } catch (e) {
      console.error('Failed to read clipboard:', e);
    }
  }

  if (!textToPaste) return;

  // Find the input field
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
  const contentEditable = document.querySelector('[contenteditable="true"]') as HTMLElement;

  if (textarea) {
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const currentVal = textarea.value;
    textarea.value = currentVal.substring(0, start) + textToPaste + currentVal.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + textToPaste.length;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.focus();
  } else if (contentEditable) {
    contentEditable.focus();
    document.execCommand('insertText', false, textToPaste);
  }

  copiedContent = null;
  hidePasteButton();
}

// Remove Zone 1
function removeZonedLayout() {
  const zone1 = document.getElementById('pe-zone1');
  if (zone1) zone1.remove();

  const inputContainer = findInputContainer();
  if (inputContainer) {
    inputContainer.style.display = '';
    inputContainer.style.flexDirection = '';
    inputContainer.style.alignItems = '';
    inputContainer.style.gap = '';
  }

  const styles = document.getElementById('pe-styles');
  if (styles) styles.remove();
}

// Initialize with retry - optimized to avoid polling
let scheduleCheckGlobal: () => void = () => { };

function initZonedLayout() {
  let attempts = 0;
  const maxAttempts = 10;

  const tryCreate = () => {
    if (document.getElementById('pe-zone1')) return;

    createZonedLayout();

    if (!document.getElementById('pe-zone1') && attempts < maxAttempts) {
      attempts++;
      setTimeout(tryCreate, 500);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryCreate);
  } else {
    setTimeout(tryCreate, 500);
  }

  // Watch for input container appearing (instead of polling every 1.5s)
  // This uses a single MutationObserver that's much lighter than setInterval
  let lastUrl = location.href;
  let checkScheduled = false;

  let lastHasPrompts = false;

  const scheduleCheck = () => {
    if (checkScheduled) return;
    checkScheduled = true;

    // Use requestIdleCallback for non-urgent checks (or setTimeout fallback)
    const scheduleIdleCheck = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
    scheduleIdleCheck(() => {
      checkScheduled = false;

      // Check if URL changed
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log('[SahAI] URL change detected');
      }

      const url = window.location.href;
      const hasConversationId = url.includes('/c/') || url.includes('/chat/') || url.includes('/thread/');
      const urlObj = new URL(url);
      const isRootPath = (urlObj.hostname.includes('chatgpt.com') || urlObj.hostname.includes('openai.com')) &&
        (urlObj.pathname === '/' || urlObj.pathname === '');

      const isOnSupportedPlatform = !!platformName && platformName !== 'generic';

      // Show buttons more greedily for the pill
      let shouldShow = isOnSupportedPlatform;

      // But keep Zone 1 (input-top buttons) restricted to active chats
      let shouldShowZone1 = false;
      if (platformName === 'claude') {
        shouldShowZone1 = window.location.pathname.includes('/chat');
      } else if (platformName === 'chatgpt') {
        shouldShowZone1 = hasConversationId || isRootPath;
      } else {
        shouldShowZone1 = true;
      }

      if (shouldShow) {
        const hasZone1 = !!document.getElementById('pe-zone1');
        const hasFigmaPill = !!document.getElementById('pe-figma-pill-container');

        // Always ensure pill is gone
        if (hasFigmaPill) {
          document.getElementById('pe-figma-pill-container')?.remove();
        }

        // Try to create Zone 1 if in an active chat
        if (!hasZone1 && shouldShowZone1 && adapter) {
          createZonedLayout();
        }
      } else {
        if (document.getElementById('pe-zone1') || document.getElementById('pe-figma-pill-container')) {
          console.log('[SahAI] Removing buttons: No longer on supported platform');
          removeZonedLayout();
          document.getElementById('pe-figma-pill-container')?.remove();
        }
      }

      // Check if prompt presence has changed and notify sidepanel
      const currentHasPrompts = adapter ? adapter.scrapePrompts().length > 0 : false;
      if (currentHasPrompts !== lastHasPrompts) {
        lastHasPrompts = currentHasPrompts;
        chrome.runtime.sendMessage({
          action: 'STATUS_RESULT',
          supported: !!adapter,
          platform: platformName,
          hasPrompts: currentHasPrompts,
        });
      }
    }, { timeout: 2000 });
  };

  // Initial check setup
  scheduleCheckGlobal = scheduleCheck;

  // Observe the document element (more stable than body for SPA navigation)
  const layoutObserver = new MutationObserver((mutations) => {
    const hasRelevantChange = mutations.some(m =>
      m.type === 'childList' && m.addedNodes.length > 0
    );
    if (hasRelevantChange) {
      scheduleCheck();
    }
  });

  layoutObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Initial check
  scheduleCheck();
}

// ============================================
// Message Handlers
// ============================================

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('[SahAI] Received message:', message.action);

  switch (message.action) {
    case 'URL_CHANGED': {
      // Handle SPA navigation without re-injection
      console.log('[SahAI] URL changed, resetting session');
      updateAdapter(); // Re-detect platform/adapter
      sessionPrompts = [];
      loadSessionPrompts();

      // Re-check if we need to show/hide buttons
      const zone1 = document.getElementById('pe-zone1');
      if (zone1) {
        removeZonedLayout();
      }
      // Re-check EVERYTHING (pill + zone1)
      setTimeout(() => {
        scheduleCheckGlobal();
        hookSendButton();
        hookKeyboardSubmit();
      }, 500);

      sendResponse({ success: true });
      break;
    }

    case 'EXTRACT_PROMPTS': {
      if (isExtracting) {
        console.warn('[SahAI] Extraction already in progress, ignoring request');
        sendResponse({ success: false, error: 'Extraction already in progress. Please wait.' });
        return true;
      }

      const mode = message.mode;
      isExtracting = true;

      extractPrompts().then(prompts => {
        const result = createExtractionResult(prompts);

        chrome.runtime.sendMessage({
          action: 'EXTRACTION_RESULT',
          result,
          mode,
        });

        sendResponse({ success: true, promptCount: prompts.length });
      }).catch(err => {
        console.error('[SahAI] Extraction failed:', err);
        sendResponse({ success: false, error: err.message });
      }).finally(() => {
        isExtracting = false;
      });
      return true; // Keep channel open for async response
    }

    case 'GET_STATUS': {
      sendResponse({
        action: 'STATUS_RESULT',
        supported: !!adapter,
        platform: platformName,
        hasPrompts: adapter ? adapter.scrapePrompts().length > 0 : false,
      });
      break;
    }

    case 'TOGGLE_BUTTONS': {
      if (message.visible) {
        createZonedLayout();
      } else {
        removeZonedLayout();
      }
      sendResponse({ success: true });
      break;
    }

    case 'CONTENT_COPIED': {
      // User copied content from side panel
      copiedContent = message.content;
      showPasteButton();
      sendResponse({ success: true });
      break;
    }

    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }

  return true;
});

// ============================================
// Initialize
// ============================================

chrome.runtime.sendMessage({
  action: 'STATUS_RESULT',
  supported: !!adapter,
  platform: platformName,
  hasPrompts: adapter ? adapter.scrapePrompts().length > 0 : false,
});

initZonedLayout();
initRealTimeCapture();
