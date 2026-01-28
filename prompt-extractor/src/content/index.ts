import { getAdapter, getPlatformName } from './adapters';
import type { ExtractionResult, ScrapedPrompt } from '../types';

console.log('[PromptExtractor] Content script loaded');

// Get the current adapter
const adapter = getAdapter();
const platformName = getPlatformName();

console.log(`[PromptExtractor] Platform detected: ${platformName || 'unknown'}`);

// Store copied content for paste functionality
let copiedContent: string | null = null;

// ============================================
// Real-Time Input Capture (Session Prompts)
// ============================================

// Session storage for captured prompts (new prompts only)
let sessionPrompts: ScrapedPrompt[] = [];

// Platform-specific selectors for send buttons and textareas
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
    console.log('[PromptExtractor] Captured prompt:', text.slice(0, 50) + '...');
    return text;
  }

  return null;
}

// Add captured prompt to session storage
function addToSession(text: string) {
  if (!text || text.trim().length === 0) return;

  // Generate a conversation ID based on the URL (most platforms use URL for conversation ID)
  // Fallback to a session-based ID if URL is generic
  const url = window.location.href;
  const conversationId = url.includes('/c/') || url.includes('/chat/') ? url : `session_${platformName}_${Date.now()}`;

  const prompt: ScrapedPrompt = {
    content: text.trim(),
    index: sessionPrompts.length,
    timestamp: Date.now(),
    conversationId,
  };

  sessionPrompts.push(prompt);

  // Persist to chrome.storage.session
  chrome.storage.session?.set({
    [`sessionPrompts_${platformName}`]: sessionPrompts
  }).catch(() => {
    // Fallback to local storage if session not available
    chrome.storage.local.set({
      [`sessionPrompts_${platformName}`]: sessionPrompts
    });
  });

  console.log(`[PromptExtractor] Session prompts: ${sessionPrompts.length}`);

  // Send to background for persistent storage
  chrome.runtime.sendMessage({
    action: 'SAVE_SESSION_PROMPTS',
    prompts: sessionPrompts,
    platform: platformName || 'unknown'
  });
}

// Load session prompts from storage
async function loadSessionPrompts() {
  try {
    const key = `sessionPrompts_${platformName}`;
    const data = await chrome.storage.session?.get(key) || await chrome.storage.local.get(key);
    if (data[key]) {
      sessionPrompts = data[key];
      console.log(`[PromptExtractor] Loaded ${sessionPrompts.length} session prompts`);
    }
  } catch (e) {
    console.log('[PromptExtractor] Could not load session prompts');
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

      console.log('[PromptExtractor] Hooked send button:', selector);
    });
  }
}

// Hook into keyboard submission (Enter/Ctrl+Enter)
function hookKeyboardSubmit() {
  const input = findActiveInput();
  if (!input || input.getAttribute('data-pe-key-hooked')) return;

  input.setAttribute('data-pe-key-hooked', 'true');

  input.addEventListener('keydown', (e: KeyboardEvent) => {
    const isEnter = e.key === 'Enter';
    const isCtrlEnter = e.key === 'Enter' && (e.ctrlKey || e.metaKey);
    const isShiftEnter = e.key === 'Enter' && e.shiftKey;

    // Most platforms: Enter sends (not Shift+Enter which is newline)
    // Some platforms: Ctrl+Enter sends
    if ((isEnter && !isShiftEnter) || isCtrlEnter) {
      const text = capturePrompt();
      if (text) {
        // Small delay to ensure the message was actually sent
        setTimeout(() => {
          // Check if input was cleared (indicates successful send)
          const currentText = getInputText(input);
          if (!currentText || currentText.length < text.length / 2) {
            addToSession(text);
          }
        }, 100);
      }
    }
  }, true);

  console.log('[PromptExtractor] Hooked keyboard submit');
}

// Initialize real-time capture
function initRealTimeCapture() {
  if (!adapter || !platformName) return;

  loadSessionPrompts();

  // Initial hook
  hookSendButton();
  hookKeyboardSubmit();

  // Re-hook periodically for SPAs
  setInterval(() => {
    hookSendButton();
    hookKeyboardSubmit();
  }, 2000);

  // Watch for DOM changes to catch new send buttons
  const observer = new MutationObserver(() => {
    hookSendButton();
    hookKeyboardSubmit();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log('[PromptExtractor] Real-time capture initialized');
}

// Extract prompts from the current page
// Extract prompts from the current page
async function extractPrompts(): Promise<ScrapedPrompt[]> {
  // 1. Get current session prompts (what we just typed in this tab)
  const currentSessionPrompts = [...sessionPrompts];

  // 2. Get persistent keylogs for this conversation from background
  // We need to identify the conversation ID to fetch the right logs
  const url = window.location.href;
  const conversationId = url.includes('/c/') || url.includes('/chat/') ? url : null;

  let persistentPrompts: ScrapedPrompt[] = [];

  if (conversationId) {
    try {
      // We need to ask the background script for the logs
      // This requires changing extractPrompts to be async
      const response = await chrome.runtime.sendMessage({
        action: 'GET_CONVERSATION_LOGS',
        platform: platformName,
        conversationId
      });

      if (response && response.prompts) {
        persistentPrompts = response.prompts;
      }
    } catch (e) {
      console.error('[PromptExtractor] Failed to fetch persistent logs:', e);
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

  // 4. If we have keylogged data, USE IT ONLY (as requested)
  if (allKeyloggedPrompts.length > 0) {
    console.log(`[PromptExtractor] Using ${allKeyloggedPrompts.length} keylogged prompts (ignoring DOM)`);
    return allKeyloggedPrompts.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  }

  // 5. Fallback: If NO keylogs exist (e.g. first install, or data cleared), use DOM
  console.log('[PromptExtractor] No keylogs found, falling back to DOM scraping');
  if (adapter) {
    return adapter.scrapePrompts();
  }

  return [];
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
  const url = window.location.href;
  // Use the conversation ID from the first prompt if available, otherwise use URL
  const conversationId = prompts[0]?.conversationId || (url.includes('/c/') || url.includes('/chat/') ? url : `session_${platformName}_${Date.now()}`);

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
    padding-top: 44px !important;
    position: relative !important;
  }
  
  .pe-zone1 {
    position: absolute;
    top: 8px;
    left: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
    z-index: 10;
  }
  
  .pe-zone1-btn {
    display: inline-flex;
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
    background: #ffffff;
    color: #1a1a1a;
    border: 1px solid #e0e0e0;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  
  .pe-zone1-btn.extract:hover {
    background: #f5f5f5;
    border-color: #d0d0d0;
  }
  
  .pe-zone1-btn.summarize {
    background: #1a1a1a;
    color: #ffffff;
    border: 1px solid #1a1a1a;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  }
  
  .pe-zone1-btn.summarize:hover {
    background: #333333;
    border-color: #333333;
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
    // Main composer wrapper
    'form[class*="stretch"] > div > div',
    'form.w-full > div > div[class*="relative"]',
    '[data-testid="composer-background"]',
    'main form > div > div',
    '#composer-background',
  ],
  claude: [
    '[data-testid="composer-container"]',
    '.composer-container',
    'fieldset[class*="composer"]',
  ],
  gemini: [
    '.input-area-container',
    'rich-textarea',
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
      console.log('[PromptExtractor] Found input via selector:', selector);
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
        console.log('[PromptExtractor] Found ChatGPT inner container');
        return innerDiv;
      }
      // Or just the first div
      const firstDiv = form.querySelector(':scope > div > div') as HTMLElement;
      if (firstDiv) {
        console.log('[PromptExtractor] Found ChatGPT first div');
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
          console.log('[PromptExtractor] Found container via textarea parent');
          return parent;
        }
        parent = parent.parentElement;
        depth++;
      }
    }
  }

  console.log('[PromptExtractor] Could not find input container');
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
  // This prevents buttons from showing on the "New Chat" screen
  const url = window.location.href;
  const hasConversationId = url.includes('/c/') || url.includes('/chat/') || url.includes('/thread/');

  // Exception: Some platforms like Perplexity/Gemini might not use /c/ but still be valid
  // For now, we enforce the rule for ChatGPT/Claude as requested
  if ((platformName === 'chatgpt' || platformName === 'claude') && !hasConversationId) {
    return;
  }

  const inputContainer = findInputContainer();
  if (!inputContainer) {
    console.log('[PromptExtractor] Could not find input container');
    return;
  }

  injectStyles();

  // Add class for padding and relative positioning
  inputContainer.classList.add('pe-has-zone1');

  // Create Zone 1
  const zone1 = createZone1();

  // Append Zone 1 (uses absolute positioning in padded area)
  inputContainer.appendChild(zone1);

  console.log('[PromptExtractor] Zone 1 buttons injected');
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
    console.error('[PromptExtractor] Error:', error);
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

// Initialize with retry
function initZonedLayout() {
  let attempts = 0;
  const maxAttempts = 30;

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

  // Re-check for SPAs and URL changes
  setInterval(() => {
    const url = window.location.href;
    const hasConversationId = url.includes('/c/') || url.includes('/chat/') || url.includes('/thread/');
    const shouldShow = (platformName !== 'chatgpt' && platformName !== 'claude') || hasConversationId;

    if (shouldShow) {
      if (!document.getElementById('pe-zone1') && adapter) {
        createZonedLayout();
      }
    } else {
      // If we moved back to "New Chat", remove the buttons
      removeZonedLayout();
    }
  }, 1000);
}

// ============================================
// Message Handlers
// ============================================

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('[PromptExtractor] Received message:', message.action);

  switch (message.action) {
    case 'EXTRACT_PROMPTS': {
      extractPrompts().then(prompts => {
        const result = createExtractionResult(prompts);

        chrome.runtime.sendMessage({
          action: 'EXTRACTION_RESULT',
          result,
        });

        sendResponse({ success: true, promptCount: prompts.length });
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
