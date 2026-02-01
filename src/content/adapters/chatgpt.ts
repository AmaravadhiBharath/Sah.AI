import { BaseAdapter } from './base';
import type { ScrapedPrompt } from '../../types';

export class ChatGPTAdapter extends BaseAdapter {
  name = 'ChatGPT';

  detect(): boolean {
    return location.hostname.includes('chatgpt.com') ||
      location.hostname.includes('chat.openai.com');
  }

  scrapePrompts(): ScrapedPrompt[] {
    const prompts: ScrapedPrompt[] = [];
    const seen = new Set<string>();

    // Find all potential prompt elements
    const candidates = this.deepQuerySelectorAll([
      '[data-message-author-role="user"]',
      '[data-testid^="conversation-turn-"]',
      'article'
    ].join(', '));

    console.log(`[SahAI] ChatGPT candidates found: ${candidates.length}`);

    // Filter to keep only the top-most elements
    const topLevelElements = candidates.filter(el => {
      return !candidates.some(other => other !== el && other.contains(el));
    });

    topLevelElements.forEach((el, index) => {
      // Skip articles that are AI responses
      if (el.tagName === 'ARTICLE') {
        if (el.querySelector('.markdown') || el.querySelector('.agent-turn')) return;
      }

      let content = this.cleanText(this.getVisibleText(el));

      // Strip ChatGPT specific headers ("You said", "You") more robustly
      // Only strip if it matches the header pattern (not part of the prompt text)
      content = content.replace(/^(you said|you)\s*:?\s*/i, '').trim();

      if (content && !this.isUIElement(content) && !seen.has(content)) {
        seen.add(content);
        prompts.push({ content, index });
      }
    });

    return prompts;
  }
}
