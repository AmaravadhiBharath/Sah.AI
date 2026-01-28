import type { ScrapedPrompt, SummaryResult } from '../types';

const SUMMARIZATION_PROMPT = `You are a prompt consolidation assistant. Given a list of user prompts from an AI conversation, create a concise summary that:

1. Preserves the user's core intent and requirements
2. Removes duplicate or redundant requests
3. Resolves conflicting instructions (keep the latest)
4. Maintains important context and constraints
5. Does NOT add new information or assumptions

Output a consolidated summary that another AI could use to continue the conversation with full context.

User prompts:
{prompts}

Consolidated summary:`;

interface AIConfig {
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

export class AISummarizer {
  private config: AIConfig | null = null;

  setConfig(config: AIConfig) {
    this.config = config;
  }

  async summarize(prompts: ScrapedPrompt[]): Promise<SummaryResult> {
    // If no API key configured, return raw prompts
    if (!this.config?.apiKey) {
      console.log('[AISummarizer] No API key configured, returning raw prompts');
      return {
        original: prompts,
        summary: prompts.map((p, i) => `${i + 1}. ${p.content}`).join('\n\n'),
        promptCount: {
          before: prompts.length,
          after: prompts.length,
        },
      };
    }

    try {
      const promptText = prompts
        .map((p, i) => `${i + 1}. ${p.content}`)
        .join('\n\n');

      const response = await this.callOpenAI(
        SUMMARIZATION_PROMPT.replace('{prompts}', promptText)
      );

      // Estimate "after" count based on summary length vs original
      const originalLength = promptText.length;
      const summaryLength = response.length;
      const estimatedAfter = Math.max(
        1,
        Math.ceil(prompts.length * (summaryLength / originalLength))
      );

      return {
        original: prompts,
        summary: response,
        promptCount: {
          before: prompts.length,
          after: estimatedAfter,
        },
      };
    } catch (error) {
      console.error('[AISummarizer] Error:', error);
      throw error;
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.config) {
      throw new Error('AI not configured');
    }

    const baseUrl = this.config.baseUrl || 'https://api.openai.com/v1';
    const model = this.config.model || 'gpt-4o-mini';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
}

// Singleton instance
export const aiSummarizer = new AISummarizer();
