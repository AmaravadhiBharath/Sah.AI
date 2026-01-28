import { BaseAdapter } from './base';
import type { ScrapedPrompt } from '../../types';

export class GeminiAdapter extends BaseAdapter {
  name = 'gemini';

  detect(): boolean {
    return location.hostname.includes('gemini.google.com');
  }

  scrapePrompts(): ScrapedPrompt[] {
    const prompts: ScrapedPrompt[] = [];
    const seen = new Set<string>();

    // Strategy 1: User query elements (Gemini uses custom elements)
    const userQueries = this.deepQuerySelectorAll('user-query, [class*="user-query"], [class*="query-text"]');
    if (userQueries.length > 0) {
      userQueries.forEach((el, index) => {
        const content = this.cleanText(this.getVisibleText(el));
        if (content && !this.isUIElement(content) && !seen.has(content)) {
          seen.add(content);
          prompts.push({ content, index });
        }
      });
      if (prompts.length > 0) return prompts;
    }

    // Strategy 2: Query containers
    const queryContainers = this.deepQuerySelectorAll('.query-content, .user-message, [data-query]');
    queryContainers.forEach((el, index) => {
      const content = this.cleanText(this.getVisibleText(el));
      if (content && content.length > 3 && !seen.has(content)) {
        seen.add(content);
        prompts.push({ content, index });
      }
    });

    // Strategy 3: Look in main conversation area
    if (prompts.length === 0) {
      const main = document.querySelector('main, [role="main"]');
      if (main) {
        // Gemini often has turn containers
        const turns = main.querySelectorAll('[class*="turn"], [class*="message"]');
        let promptIndex = 0;
        turns.forEach((turn) => {
          const classList = turn.className.toLowerCase();
          // Skip model/AI responses
          if (classList.includes('model') || classList.includes('response') || classList.includes('answer')) {
            return;
          }
          const content = this.cleanText(this.getVisibleText(turn));
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
