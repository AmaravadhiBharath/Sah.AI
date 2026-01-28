// Core types for the Prompt Extractor extension

export interface ScrapedPrompt {
  content: string;
  index: number;
  timestamp?: number;
  conversationId?: string;
}

export interface ExtractionResult {
  platform: string;
  url: string;
  title: string;
  prompts: ScrapedPrompt[];
  extractedAt: number;
  conversationId?: string;
}

export interface SummaryResult {
  original: ScrapedPrompt[];
  summary: string;
  promptCount: {
    before: number;
    after: number;
  };
}

export interface HistoryItem {
  id: string;
  platform: string;
  promptCount: number;
  mode: Mode;
  timestamp: number;
  prompts: ScrapedPrompt[];
  preview: string;
  summary?: string;
}

export type Mode = 'raw' | 'summary';

export interface PlatformAdapter {
  name: string;
  detect(): boolean;
  scrapePrompts(): ScrapedPrompt[];
}

// Message types for communication between content script, service worker, and side panel
export type MessageAction =
  | 'EXTRACT_PROMPTS'
  | 'EXTRACTION_RESULT'
  | 'EXTRACTION_FROM_PAGE'
  | 'EXTRACTION_FROM_PAGE_RESULT'
  | 'SUMMARIZE_PROMPTS'
  | 'SUMMARY_RESULT'
  | 'GET_STATUS'
  | 'STATUS_RESULT'
  | 'TOGGLE_BUTTONS'
  | 'CONTENT_COPIED'
  | 'SAVE_SESSION_PROMPTS'
  | 'ERROR';

export interface ExtractMessage {
  action: 'EXTRACT_PROMPTS';
  mode: Mode;
}

export interface ExtractionResultMessage {
  action: 'EXTRACTION_RESULT';
  result: ExtractionResult;
}

export interface SummarizeMessage {
  action: 'SUMMARIZE_PROMPTS';
  prompts: ScrapedPrompt[];
}

export interface SummaryResultMessage {
  action: 'SUMMARY_RESULT';
  result: SummaryResult;
}

export interface ErrorMessage {
  action: 'ERROR';
  error: string;
}

export interface StatusMessage {
  action: 'GET_STATUS';
}

export interface StatusResultMessage {
  action: 'STATUS_RESULT';
  supported: boolean;
  platform: string | null;
}

export interface ExtractionFromPageMessage {
  action: 'EXTRACTION_FROM_PAGE';
  result: ExtractionResult;
  mode: Mode;
}

export interface ExtractionFromPageResultMessage {
  action: 'EXTRACTION_FROM_PAGE_RESULT';
  result: ExtractionResult;
  mode: Mode;
}

export interface ToggleButtonsMessage {
  action: 'TOGGLE_BUTTONS';
  visible: boolean;
}

export interface SaveSessionPromptsMessage {
  action: 'SAVE_SESSION_PROMPTS';
  prompts: ScrapedPrompt[];
  platform: string;
}

export type Message =
  | ExtractMessage
  | ExtractionResultMessage
  | ExtractionFromPageMessage
  | ExtractionFromPageResultMessage
  | SummarizeMessage
  | SummaryResultMessage
  | ErrorMessage
  | StatusMessage
  | StatusResultMessage
  | ToggleButtonsMessage
  | SaveSessionPromptsMessage;
