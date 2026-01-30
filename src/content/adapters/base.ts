import type { PlatformAdapter, ScrapedPrompt } from '../../types';

// Base class with common utilities for adapters
export abstract class BaseAdapter implements PlatformAdapter {
  abstract name: string;
  abstract detect(): boolean;
  abstract scrapePrompts(): ScrapedPrompt[];

  // Utility: Deep query selector that pierces shadow DOM
  protected deepQuerySelectorAll(selector: string, root: Node = document): Element[] {
    let nodes: Element[] = [];
    try {
      nodes = Array.from((root as ParentNode).querySelectorAll(selector));
    } catch (e) {
      console.warn('[SahAI] Invalid selector:', selector);
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      const el = node as Element;
      if (el.shadowRoot) {
        nodes = [...nodes, ...this.deepQuerySelectorAll(selector, el.shadowRoot)];
      }
    }
    return nodes;
  }

  // Utility: Clean text content
  protected cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Utility: Check if text is UI noise
  protected isUIElement(text: string): boolean {
    const uiPatterns = /^(copy|regenerate|share|edit|delete|save|retry|cancel|submit|send|stop|continue|new chat|clear)$/i;
    return uiPatterns.test(text.trim()) || text.trim().length < 3;
  }

  // Utility: Extract visible text from element
  protected getVisibleText(element: Element): string {
    const el = element as HTMLElement;
    return el.innerText || el.textContent || '';
  }

  // Utility: Find the main scroll container for the chat
  public getScrollContainer(): HTMLElement | null {
    // Common scroll container patterns
    const selectors = [
      'main',
      '[class*="scroll-area"]',
      '[class*="messages-container"]',
      '[class*="chat-scroll"]',
      'div[style*="overflow-y: auto"]',
      'div[style*="overflow-y: scroll"]'
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector) as HTMLElement;
      if (el && el.scrollHeight > el.clientHeight) return el;
    }

    // Fallback: find the largest scrollable element
    const allDivs = Array.from(document.querySelectorAll('div'));
    let largest: HTMLElement | null = null;
    let maxScroll = 0;

    for (const div of allDivs) {
      const scroll = div.scrollHeight;
      if (scroll > maxScroll && window.getComputedStyle(div).overflowY !== 'hidden') {
        maxScroll = scroll;
        largest = div;
      }
    }

    return largest || document.documentElement;
  }
}
