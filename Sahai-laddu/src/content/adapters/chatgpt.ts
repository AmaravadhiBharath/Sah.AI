import { BaseAdapter } from './base';
import type { ScrapedPrompt } from '../../types';

export class ChatGPTAdapter extends BaseAdapter {
  name = 'chatgpt';

  detect(): boolean {
    return location.hostname.includes('chatgpt.com') || 
           location.hostname.includes('chat.openai.com');
  }

  scrapePrompts(): ScrapedPrompt[] {
    const prompts: ScrapedPrompt[] = [];
    const seen = new Set<string>();

    // Strategy 1: Data attributes (Modern ChatGPT)
    const userTurns = document.querySelectorAll('[data-message-author-role="user"]');
    if (userTurns.length > 0) {
      userTurns.forEach((el, index) => {
        const content = this.cleanText(this.getVisibleText(el));
        if (content && !this.isUIElement(content) && !seen.has(content)) {
          seen.add(content);
          prompts.push({ content, index });
        }
      });
      if (prompts.length > 0) return prompts;
    }

    // Strategy 2: Article structure with user detection
    const articles = document.querySelectorAll('article');
    let promptIndex = 0;
    articles.forEach((article) => {
      // Check if this is a user message (not AI)
      const hasMarkdown = article.querySelector('.markdown');
      const hasAgentTurn = article.querySelector('.agent-turn');
      if (hasMarkdown || hasAgentTurn) return; // Skip AI responses

      const content = this.cleanText(this.getVisibleText(article));
      if (content && content.length > 5 && !seen.has(content)) {
        seen.add(content);
        prompts.push({ content, index: promptIndex++ });
      }
    });

    return prompts;
  }
}
