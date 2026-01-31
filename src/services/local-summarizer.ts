import type { ScrapedPrompt, SummaryResult } from '../types';

/**
 * Local Client-Side Summarization
 * Works without any API calls - perfect fallback when AI is unavailable
 */

export class LocalSummarizer {
  /**
   * Smart deduplication: removes similar prompts
   */
  private deduplicatePrompts(prompts: ScrapedPrompt[]): ScrapedPrompt[] {
    if (prompts.length <= 1) return prompts;

    const result: ScrapedPrompt[] = [];
    const normalized = new Set<string>();

    for (const prompt of prompts) {
      const norm = this.normalizeText(prompt.content);

      // Skip exact duplicates
      if (normalized.has(norm)) continue;

      // Skip if very similar to existing
      let isSimilar = false;
      for (const existing of result) {
        if (this.calculateSimilarity(norm, this.normalizeText(existing.content)) > 0.85) {
          isSimilar = true;
          break;
        }
      }

      if (!isSimilar) {
        normalized.add(norm);
        result.push(prompt);
      }
    }

    return result;
  }

  /**
   * Normalize text for comparison
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '');
  }

  /**
   * Calculate similarity between two strings (0-1)
   */
  private calculateSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    if (!a.length || !b.length) return 0;

    // Check containment
    if (a.includes(b) || b.includes(a)) {
      const shorter = Math.min(a.length, b.length);
      const longer = Math.max(a.length, b.length);
      return shorter / longer;
    }

    // Word-level overlap
    const wordsA = new Set(a.split(' ').filter(w => w.length > 2));
    const wordsB = new Set(b.split(' ').filter(w => w.length > 2));

    if (!wordsA.size || !wordsB.size) return 0;

    let overlap = 0;
    for (const word of wordsA) {
      if (wordsB.has(word)) overlap++;
    }

    return overlap / Math.max(wordsA.size, wordsB.size);
  }

  /**
   * Extract key sentences from prompt
   */
  private extractKeyPoints(text: string): string[] {
    // Split by sentences
    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .slice(0, 3); // Take first 3 sentences

    return sentences;
  }

  /**
   * Categorize prompts by type
   */
  private categorizePrompts(prompts: ScrapedPrompt[]): Map<string, ScrapedPrompt[]> {
    const categories = new Map<string, ScrapedPrompt[]>();

    for (const prompt of prompts) {
      const text = prompt.content.toLowerCase();
      let category = 'Other';

      // Detect categories
      if (text.includes('code') || text.includes('function') || text.includes('script')) {
        category = 'Code & Development';
      } else if (text.includes('design') || text.includes('style') || text.includes('color')) {
        category = 'Design & UI';
      } else if (text.includes('question') || text.match(/^(what|how|why|when|where)/)) {
        category = 'Questions';
      } else if (text.includes('create') || text.includes('write') || text.includes('generate')) {
        category = 'Creation Tasks';
      } else if (text.includes('fix') || text.includes('debug') || text.includes('error')) {
        category = 'Debugging';
      } else if (text.includes('explain') || text.includes('help') || text.includes('guide')) {
        category = 'Help & Explanation';
      }

      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(prompt);
    }

    return categories;
  }

  /**
   * Format summary output
   */
  private formatSummary(prompts: ScrapedPrompt[]): string {
    const deduped = this.deduplicatePrompts(prompts);
    const categories = this.categorizePrompts(deduped);

    const parts: string[] = [];

    // Add overview
    parts.push(`📋 Extraction Summary`);
    parts.push(`Total Prompts: ${prompts.length}`);
    parts.push(`Unique Prompts: ${deduped.length}`);
    parts.push(`Duplicates Removed: ${prompts.length - deduped.length}`);
    parts.push('');

    // Add categorized prompts
    parts.push(`📊 Prompts by Category:`);
    parts.push('');

    for (const [category, items] of categories) {
      parts.push(`🔹 ${category} (${items.length})`);
      for (const item of items.slice(0, 2)) { // Show first 2 of each category
        const preview = item.content.substring(0, 80);
        parts.push(`   • ${preview}${item.content.length > 80 ? '...' : ''}`);
      }
      if (items.length > 2) {
        parts.push(`   • +${items.length - 2} more...`);
      }
      parts.push('');
    }

    // Add key insights
    parts.push(`💡 Key Insights:`);
    parts.push(`• You worked on ${categories.size} different categories`);
    const avgLength = Math.round(deduped.reduce((sum, p) => sum + p.content.length, 0) / deduped.length);
    parts.push(`• Average prompt length: ${avgLength} characters`);

    if (prompts.length > deduped.length) {
      const dupRate = Math.round((prompts.length - deduped.length) / prompts.length * 100);
      parts.push(`• ${dupRate}% of prompts were duplicates`);
    }

    return parts.join('\n');
  }

  /**
   * Main summarization method
   */
  async summarize(prompts: ScrapedPrompt[]): Promise<SummaryResult> {
    if (prompts.length === 0) {
      throw new Error('No prompts to summarize');
    }

    try {
      const summary = this.formatSummary(prompts);
      const deduped = this.deduplicatePrompts(prompts);

      return {
        original: prompts,
        summary,
        promptCount: {
          before: prompts.length,
          after: deduped.length,
        },
      };
    } catch (error) {
      console.error('[LocalSummarizer] Error:', error);
      throw error;
    }
  }
}

// Singleton instance
export const localSummarizer = new LocalSummarizer();
