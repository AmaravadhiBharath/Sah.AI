import { BaseAdapter } from './base';
import type { ScrapedPrompt } from '../../types';

export class ClaudeAdapter extends BaseAdapter {
  name = 'claude';

  detect(): boolean {
    return location.hostname.includes('claude.ai');
  }

  scrapePrompts(): ScrapedPrompt[] {
    const prompts: ScrapedPrompt[] = [];
    const seen = new Set<string>();

    // Strategy 1: Human message containers
    const humanMessages = document.querySelectorAll('[data-testid="human-message"], .human-message, [class*="human"]');
    if (humanMessages.length > 0) {
      humanMessages.forEach((el, index) => {
        const content = this.cleanText(this.getVisibleText(el));
        if (content && !this.isUIElement(content) && !seen.has(content)) {
          seen.add(content);
          prompts.push({ content, index });
        }
      });
      if (prompts.length > 0) return prompts;
    }

    // Strategy 2: Look for user bubbles by structure
    const allMessages = document.querySelectorAll('[class*="message"], [class*="Message"]');
    let promptIndex = 0;
    allMessages.forEach((msg) => {
      const classList = msg.className.toLowerCase();
      // Skip if it looks like an AI response
      if (classList.includes('assistant') || classList.includes('ai') || classList.includes('claude')) {
        return;
      }
      // Include if it looks like user
      if (classList.includes('user') || classList.includes('human')) {
        const content = this.cleanText(this.getVisibleText(msg));
        if (content && content.length > 5 && !seen.has(content)) {
          seen.add(content);
          prompts.push({ content, index: promptIndex++ });
        }
      }
    });

    // Strategy 3: Alternating pattern (user messages are typically at even indices or have specific parent)
    if (prompts.length === 0) {
      const conversationContainer = document.querySelector('[class*="conversation"], [class*="chat"], main');
      if (conversationContainer) {
        const directChildren = conversationContainer.querySelectorAll(':scope > div');
        directChildren.forEach((child, idx) => {
          // Heuristic: user messages often don't have markdown formatting
          if (!child.querySelector('.prose, .markdown, pre, code')) {
            const content = this.cleanText(this.getVisibleText(child));
            if (content && content.length > 10 && !seen.has(content)) {
              seen.add(content);
              prompts.push({ content, index: idx });
            }
          }
        });
      }
    }

    return prompts;
  }
}
