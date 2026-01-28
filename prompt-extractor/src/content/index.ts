import { getAdapter, getPlatformName } from './adapters';
import { RemoteConfigService } from '../services/remote-config';
import type { ExtractionResult, ScrapedPrompt } from '../types';

// Get the current adapter
const adapter = getAdapter();
const platformName = getPlatformName();

// Initialize Remote Config (fire and forget)
RemoteConfigService.getInstance().initialize();

console.log('[SahAI] Content script loaded v1.0.6');
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

// Extract prompts from the current page
// Extract prompts from the current page
async function extractPrompts(): Promise<ScrapedPrompt[]> {
  // 1. Get current session prompts (what we just typed in this tab)
  const currentSessionPrompts = [...sessionPrompts];

  // 2. Get persistent keylogs for this conversation from background
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

  // 3. Merge current session + persistent logs
  // Persistent logs are the "Day 1-9" history. Current session is "Day 10".
  // We prioritize these over DOM scraping as requested.

  let allKeyloggedPrompts = [...persistentPrompts];

  // Add current session prompts if they aren't already in persistent logs
  const persistentContent = new Set(persistentPrompts.map(p => normalizeForComparison(p.content)));
  for (const p of currentSessionPrompts) {
    if (!persistentContent.has(normalizeForComparison(p.content))) {
      allKeyloggedPrompts.push(p);
    }
  }

  // 4. Merge with DOM scraping
  let finalPrompts = [...allKeyloggedPrompts];

  if (adapter) {
    console.log('[SahAI] Augmenting with DOM scraping...');
    const domPrompts = adapter.scrapePrompts();

    const existingContent = new Set(allKeyloggedPrompts.map(p => normalizeForComparison(p.content)));

    for (const p of domPrompts) {
      if (!existingContent.has(normalizeForComparison(p.content))) {
        finalPrompts.push(p);
      }
    }
  }

  // 5. Final sort and return
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
  /* Add space at top of container for Zone 1 */
  .pe-has-zone1 {
    padding-top: 48px !important;
    position: relative !important;
    min-height: 80px !important;
  }
  
  .pe-zone1 {
    position: absolute;
    top: 8px; /* Inside the 44px padding */
    left: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
    z-index: 9999999 !important;
  }
  
  .pe-zone1-btn {
    display: inline-flex !important;
    visibility: visible !important;
    opacity: 1 !important;
    align-items: center;
    justify-content: center;
    padding: 7px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 150ms ease;
    white-space: nowrap;
    line-height: 1;
    letter-spacing: 0.01em;
  }
  
  .pe-zone1-btn.extract {
    background: #ffffff !important;
    color: #000000 !important;
    border: 1px solid #d1d1d1 !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
  }
  
  .pe-zone1-btn.extract:hover {
    background: #f0f0f0 !important;
    transform: translateY(-1px);
  }
  
  .pe-zone1-btn.summarize {
    background: #000000 !important;
    color: #ffffff !important;
    border: 1px solid #333333 !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
  }
  
  .pe-zone1-btn.summarize:hover {
    background: #222222 !important;
    transform: translateY(-1px);
  }
  
  .pe-zone1-btn.paste {
    background: #f0f0f0;
    color: #1a1a1a;
    border: 1px solid #d0d0d0;
    animation: pe-fade-in 200ms ease-out;
  }
  
  .pe-zone1-btn.paste:hover {
    background: #e5e5e5;
  }
  
  .pe-zone1-btn:active {
    transform: scale(0.97);
  }
  
  .pe-zone1-btn.loading {
    opacity: 0.6;
    pointer-events: none;
  }
  
  .pe-zone1-btn svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    margin-right: 4px;
  }
  
  .pe-spinner {
    animation: pe-spin 0.8s linear infinite;
  }
  
  @keyframes pe-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pe-fade-in {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
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
    '[data-testid="composer-container"]',
    '.composer-container',
    'fieldset[class*="composer"]',
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

  // Try platform-specific selectors first
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && element.offsetParent !== null) {
      // Safety check: If the container is huge (like the whole chat), it's the wrong one
      const rect = element.getBoundingClientRect();
      if (rect.height > 400) {
        console.log('[SahAI] Skipping selector (too tall):', selector);
        continue;
      }
      console.log('[SahAI] Found input via selector:', selector);
      return element;
    }
  }

  // ChatGPT specific: find the form and get the inner container
  if (platformName === 'chatgpt') {
    const form = document.querySelector('form[class*="stretch"], form.w-full') as HTMLElement;
    if (form) {
      // Find the rounded container inside
      const innerDiv = form.querySelector('div[class*="rounded"]') as HTMLElement;
      if (innerDiv && innerDiv.offsetParent !== null) {
        console.log('[SahAI] Found ChatGPT inner container');
        return innerDiv;
      }
      // Or just the first div
      const firstDiv = form.querySelector(':scope > div > div') as HTMLElement;
      if (firstDiv) {
        console.log('[SahAI] Found ChatGPT first div');
        return firstDiv;
      }
    }
  }

  // Generic fallback: find visible textarea's styled parent
  const textareas = document.querySelectorAll('textarea, [contenteditable="true"]');
  for (const textarea of textareas) {
    if ((textarea as HTMLElement).offsetParent !== null) {
      let parent = textarea.parentElement;
      let depth = 0;
      while (parent && depth < 6) {
        const style = window.getComputedStyle(parent);
        // Look for the rounded container
        if (style.borderRadius && style.borderRadius !== '0px') {
          console.log('[SahAI] Found container via textarea parent');
          return parent;
        }
        parent = parent.parentElement;
        depth++;
      }
    }
  }

  // Generic fallback 2: Any form that contains a textarea or contenteditable
  const forms = document.querySelectorAll('form');
  for (const form of forms) {
    if (form.querySelector('textarea, [contenteditable="true"]')) {
      console.log('[SahAI] Found container via form with textarea');
      return form;
    }
  }

  // Generic fallback 3: Any div that looks like a chat input
  const possibleInputs = document.querySelectorAll('div[class*="composer"], div[class*="input"], div[class*="prompt"], div[class*="chat"]');
  for (const div of possibleInputs) {
    if ((div as HTMLElement).offsetParent !== null && div.querySelector('textarea, [contenteditable="true"]')) {
      console.log('[SahAI] Found container via heuristic');
      return div as HTMLElement;
    }
  }

  // Last resort: The parent of the first visible textarea
  const firstTextarea = document.querySelector('textarea:not([type="hidden"]), [contenteditable="true"]');
  if (firstTextarea && (firstTextarea as HTMLElement).offsetParent !== null) {
    console.log('[SahAI] Found container via first visible textarea parent');
    return firstTextarea.parentElement;
  }

  console.log('[SahAI] Could not find input container');
  return null;
}

// Inject styles
function injectStyles() {
  if (document.getElementById('pe-styles')) return;

  const style = document.createElement('style');
  style.id = 'pe-styles';
  style.textContent = BUTTON_STYLES;
  document.head.appendChild(style);
}

// Create Zone 1 button row
function createZone1(): HTMLElement {
  console.log('[SahAI] Creating Zone 1 buttons...');
  const zone1 = document.createElement('div');
  zone1.id = 'pe-zone1';
  zone1.className = 'pe-zone1';

  // Extract button
  const extractBtn = document.createElement('button');
  extractBtn.id = 'pe-extract-btn';
  extractBtn.className = 'pe-zone1-btn extract';
  extractBtn.textContent = 'Extract';
  extractBtn.title = 'Extract raw prompts';
  extractBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleButtonClick('raw', extractBtn);
  };
  zone1.appendChild(extractBtn);

  // Summarize button
  const summarizeBtn = document.createElement('button');
  summarizeBtn.id = 'pe-summarize-btn';
  summarizeBtn.className = 'pe-zone1-btn summarize';
  summarizeBtn.textContent = 'Summarise';
  summarizeBtn.title = 'AI-powered summary';
  summarizeBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleButtonClick('summary', summarizeBtn);
  };
  zone1.appendChild(summarizeBtn);

  return zone1;
}

// Show paste button
function showPasteButton() {
  const zone1 = document.getElementById('pe-zone1');
  if (!zone1 || document.getElementById('pe-paste-btn')) return;

  const pasteBtn = document.createElement('button');
  pasteBtn.id = 'pe-paste-btn';
  pasteBtn.className = 'pe-zone1-btn paste';
  pasteBtn.textContent = 'Paste';
  pasteBtn.title = 'Paste copied prompts';
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
function handlePaste() {
  if (!copiedContent) return;

  // Find the input field
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
  const contentEditable = document.querySelector('[contenteditable="true"]') as HTMLElement;

  if (textarea) {
    // For textarea elements
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const text = textarea.value;
    textarea.value = text.substring(0, start) + copiedContent + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + copiedContent.length;

    // Trigger input event for React/Vue/etc.
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.focus();
  } else if (contentEditable) {
    // For contenteditable elements (like Claude)
    contentEditable.focus();
    document.execCommand('insertText', false, copiedContent);
  }

  // Clear and hide after use
  copiedContent = null;
  hidePasteButton();
}

// Create the two-zone layout
function createZonedLayout() {
  if (document.getElementById('pe-zone1')) return;
  if (!adapter) return;

  // Only show buttons if we are in a specific conversation (URL has ID)
  // Relaxed for ChatGPT to allow root path if container is found
  const url = window.location.href;
  const hasConversationId = url.includes('/c/') || url.includes('/chat/') || url.includes('/thread/');

  const urlObj = new URL(url);
  const isRootPath = (urlObj.hostname.includes('chatgpt.com') || urlObj.hostname.includes('openai.com')) &&
    (urlObj.pathname === '/' || urlObj.pathname === '');

  console.log(`[SahAI] createZonedLayout: hasConversationId=${hasConversationId}, isRootPath=${isRootPath}`);

  if ((platformName === 'chatgpt' || platformName === 'claude') && !hasConversationId && !isRootPath) {
    console.log('[SahAI] Skipping buttons: Not in a conversation or root path');
    return;
  }

  const inputContainer = findInputContainer();
  if (!inputContainer) {
    console.warn('[SahAI] Could not find input container. Tried selectors:', INPUT_CONTAINER_SELECTORS[platformName || '']);
    return;
  }

  injectStyles();

  // Add class for padding and relative positioning
  inputContainer.classList.add('pe-has-zone1');

  // Create Zone 1
  const zone1 = createZone1();

  // Prepend Zone 1 (uses absolute positioning in padded area)
  inputContainer.prepend(zone1);

  const rect = inputContainer.getBoundingClientRect();
  console.log(`[SahAI] Zone 1 buttons injected. Container size: ${rect.width}x${rect.height} at (${rect.left}, ${rect.top})`);
}

// Handle button click
async function handleButtonClick(mode: 'raw' | 'summary', button: HTMLButtonElement) {
  const originalText = button.textContent;
  button.classList.add('loading');
  button.innerHTML = `
    <svg class="pe-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
    </svg>
    ${mode === 'raw' ? 'Extracting...' : 'Summarising...'}
  `;

  try {
    const prompts = await extractPrompts();
    const result = createExtractionResult(prompts);

    chrome.runtime.sendMessage({
      action: 'EXTRACTION_FROM_PAGE',
      result,
      mode,
    });

  } catch (error) {
    console.error('[SahAI] Error:', error);
  } finally {
    setTimeout(() => {
      button.classList.remove('loading');
      button.textContent = originalText;
    }, 500);
  }
}

// Remove Zone 1
function removeZonedLayout() {
  const zone1 = document.getElementById('pe-zone1');
  if (zone1) zone1.remove();

  const styles = document.getElementById('pe-styles');
  if (styles) styles.remove();
}

// Initialize with retry - optimized to avoid polling
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

      const shouldShow = (platformName !== 'chatgpt' && platformName !== 'claude') || hasConversationId || isRootPath;

      if (shouldShow) {
        if (!document.getElementById('pe-zone1') && adapter) {
          createZonedLayout();
        }
      } else if (document.getElementById('pe-zone1')) {
        console.log('[SahAI] Removing buttons: No longer in a valid conversation');
        removeZonedLayout();
      }
    }, { timeout: 2000 });
  };

  // Observe only the main content area for changes (lighter than body)
  const targetNode = document.querySelector('main') || document.body;
  const layoutObserver = new MutationObserver((mutations) => {
    // Only check if relevant changes occurred
    const hasRelevantChange = mutations.some(m =>
      m.type === 'childList' && m.addedNodes.length > 0
    );
    if (hasRelevantChange) {
      scheduleCheck();
    }
  });

  layoutObserver.observe(targetNode, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
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
      sessionPrompts = [];
      loadSessionPrompts();

      // Re-check if we need to show/hide buttons
      const zone1 = document.getElementById('pe-zone1');
      if (zone1) {
        removeZonedLayout();
      }
      // Let the normal interval re-create buttons if needed
      setTimeout(() => {
        createZonedLayout();
        hookSendButton();
        hookKeyboardSubmit();
      }, 500);

      sendResponse({ success: true });
      break;
    }

    case 'EXTRACT_PROMPTS': {
      extractPrompts().then(prompts => {
        const result = createExtractionResult(prompts);

        chrome.runtime.sendMessage({
          action: 'EXTRACTION_RESULT',
          result,
        });

        sendResponse({ success: true, promptCount: prompts.length });
      }).catch(err => {
        console.error('[SahAI] Extraction failed:', err);
        sendResponse({ success: false, error: err.message });
      });
      return true; // Keep channel open for async response
    }

    case 'GET_STATUS': {
      sendResponse({
        action: 'STATUS_RESULT',
        supported: !!adapter,
        platform: platformName,
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
});

initZonedLayout();
initRealTimeCapture();
