import { getAdapter, getPlatformName } from './adapters';
import type { ExtractionResult, ScrapedPrompt } from '../types';

console.log('[PromptExtractor] Content script loaded');

// Get the current adapter
const adapter = getAdapter();
const platformName = getPlatformName();

console.log(`[PromptExtractor] Platform detected: ${platformName || 'unknown'}`);

// Store copied content for paste functionality
let copiedContent: string | null = null;

// Extract prompts from the current page
function extractPrompts(): ScrapedPrompt[] {
  if (!adapter) {
    console.log('[PromptExtractor] No adapter available');
    return [];
  }
  
  const prompts = adapter.scrapePrompts();
  console.log(`[PromptExtractor] Extracted ${prompts.length} prompts`);
  return prompts;
}

// Create extraction result
function createExtractionResult(prompts: ScrapedPrompt[]): ExtractionResult {
  return {
    platform: platformName || 'unknown',
    url: window.location.href,
    title: document.title,
    prompts,
    extractedAt: Date.now(),
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
    const prompts = extractPrompts();
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
  
  // Re-check for SPAs
  setInterval(() => {
    if (!document.getElementById('pe-zone1') && adapter) {
      createZonedLayout();
    }
  }, 2000);
}

// ============================================
// Message Handlers
// ============================================

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('[PromptExtractor] Received message:', message.action);
  
  switch (message.action) {
    case 'EXTRACT_PROMPTS': {
      const prompts = extractPrompts();
      const result = createExtractionResult(prompts);
      
      chrome.runtime.sendMessage({
        action: 'EXTRACTION_RESULT',
        result,
      });
      
      sendResponse({ success: true, promptCount: prompts.length });
      break;
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
