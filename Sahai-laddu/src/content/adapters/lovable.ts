import { BaseAdapter } from './base';
import type { ScrapedPrompt } from '../../types';

export class LovableAdapter extends BaseAdapter {
  name = 'lovable';

  detect(): boolean {
    return location.hostname.includes('lovable.dev');
  }

  scrapePrompts(): ScrapedPrompt[] {
    const prompts: ScrapedPrompt[] = [];
    const seen = new Set<string>();

    // Strategy 1: User message containers (Lovable uses a chat interface)
    const userMessages = document.querySelectorAll('[class*="user-message"], [class*="UserMessage"], [data-sender="user"]');
    userMessages.forEach((el, index) => {
      const content = this.cleanText(this.getVisibleText(el));
      if (content && !this.isUIElement(content) && !seen.has(content)) {
        seen.add(content);
        prompts.push({ content, index });
      }
    });

    if (prompts.length > 0) return prompts;

    // Strategy 2: Look for edit buttons (user messages often have edit capability)
    const editableMessages = document.querySelectorAll('[class*="editable"], [class*="edit-button"]');
    editableMessages.forEach((el, index) => {
      const parent = el.closest('[class*="message"]');
      if (parent) {
        const content = this.cleanText(this.getVisibleText(parent));
        if (content && content.length > 5 && !seen.has(content)) {
          seen.add(content);
          prompts.push({ content, index });
        }
      }
    });

    // Strategy 3: Chat history
    if (prompts.length === 0) {
      const chatContainer = document.querySelector('[class*="chat"], [class*="conversation"], [class*="messages"]');
      if (chatContainer) {
        const messages = chatContainer.querySelectorAll(':scope > div');
        let promptIndex = 0;
        messages.forEach((msg) => {
          const classList = msg.className.toLowerCase();
          // Skip if looks like AI/bot response
          if (classList.includes('bot') || classList.includes('assistant') || classList.includes('ai') || classList.includes('system')) {
            return;
          }
          const content = this.cleanText(this.getVisibleText(msg));
          if (content && content.length > 5 && !seen.has(content)) {
            seen.add(content);
            prompts.push({ content, index: promptIndex++ });
          }
        });
      }
    }

    return prompts;
  }
}
