import { BaseAdapter } from './base';
import type { ScrapedPrompt } from '../../types';

// Generic adapter as fallback for unknown platforms
export class GenericAdapter extends BaseAdapter {
  name = 'generic';

  detect(): boolean {
    // Always returns true as fallback
    return true;
  }

  scrapePrompts(): ScrapedPrompt[] {
    const prompts: ScrapedPrompt[] = [];
    const seen = new Set<string>();

    // Strategy 1: Common user message patterns
    const userSelectors = [
      '[data-role="user"]',
      '[data-message-author-role="user"]',
      '[class*="user-message"]',
      '[class*="UserMessage"]',
      '[class*="human-message"]',
      '[class*="HumanMessage"]',
      '.user',
      '.human'
    ];

    for (const selector of userSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach((el, index) => {
          const content = this.cleanText(this.getVisibleText(el));
          if (content && content.length > 3 && !this.isUIElement(content) && !seen.has(content)) {
            seen.add(content);
            prompts.push({ content, index });
          }
        });
        if (prompts.length > 0) return prompts;
      }
    }

    // Strategy 2: Chat container with alternating messages
    const chatContainers = document.querySelectorAll('[class*="chat"], [class*="conversation"], [class*="messages"], [role="log"]');
    chatContainers.forEach((container) => {
      const messages = container.querySelectorAll(':scope > div, :scope > article');
      let promptIndex = 0;
      messages.forEach((msg, idx) => {
        const classList = msg.className.toLowerCase();
        const text = this.cleanText(this.getVisibleText(msg));
        
        // Heuristics for user messages:
        // 1. Has "user" in class
        // 2. Doesn't have AI indicators
        // 3. Doesn't have markdown/code
        const isLikelyUser = (
          classList.includes('user') || 
          classList.includes('human') ||
          classList.includes('outgoing') ||
          classList.includes('sent')
        );
        
        const isLikelyAI = (
          classList.includes('assistant') ||
          classList.includes('bot') ||
          classList.includes('ai') ||
          classList.includes('response') ||
          classList.includes('incoming') ||
          msg.querySelector('.markdown, .prose, pre:not(.user-code)')
        );

        if (isLikelyUser || (!isLikelyAI && idx % 2 === 0)) {
          if (text && text.length > 5 && text.length < 5000 && !seen.has(text)) {
            seen.add(text);
            prompts.push({ content: text, index: promptIndex++ });
          }
        }
      });
    });

    return prompts;
  }
}
