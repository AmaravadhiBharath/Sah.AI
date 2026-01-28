# SahAI Robustness Solutions Guide

> Transform fragility into world-class reliability. Simple for users. Complex for copycats.

---

## Table of Contents
1. [Scraping Layer - Remote Config System](#1-scraping-layer---remote-config-system)
2. [UI Layer - Bulletproof React](#2-ui-layer---bulletproof-react)
3. [Auth & Firebase - Secure & Resilient](#3-auth--firebase---secure--resilient)
4. [Backend/API - Observable & Configurable](#4-backendapi---observable--configurable)
5. [Chrome APIs - Graceful Degradation](#5-chrome-apis---graceful-degradation)
6. [Build & Config - Production-Grade](#6-build--config---production-grade)
7. [Data Integrity - Bulletproof Sync](#7-data-integrity---bulletproof-sync)

---

## 1. SCRAPING LAYER - Remote Config System

### Problem
Hardcoded CSS selectors break when platforms update their UI. Every breakage requires a new extension release (3-7 day review).

### Solution: Remote Selector Registry

#### Firestore Structure
```
/config/selectors
├── version: 15
├── lastUpdated: 1706435200
├── platforms:
│   ├── claude:
│   │   ├── version: 3
│   │   ├── enabled: true
│   │   ├── strategies: [
│   │   │   {
│   │   │     name: "primary",
│   │   │     selectors: ["[data-testid='human-message']"],
│   │   │     excludeSelectors: [".assistant", ".claude-response"],
│   │   │     minContentLength: 5
│   │   │   },
│   │   │   {
│   │   │     name: "fallback_class",
│   │   │     selectors: [".human-message", "[class*='human'][class*='message']"],
│   │   │     excludePatterns: ["assistant", "ai", "claude"]
│   │   │   },
│   │   │   {
│   │   │     name: "fallback_structure",
│   │   │     containerSelector: "[class*='conversation'], main",
│   │   │     childSelector: ":scope > div",
│   │   │     excludeChildSelectors: [".prose", ".markdown", "pre", "code"]
│   │   │   }
│   │   │ ]
│   │   └── detection: { hostname: "claude.ai" }
│   ├── chatgpt:
│   │   ├── version: 5
│   │   ├── strategies: [...]
│   │   └── detection: { hostname: ["chatgpt.com", "chat.openai.com"] }
│   └── ... (other platforms)
```

#### New Service: `src/services/selector-registry.ts`
```typescript
/**
 * Remote Selector Registry
 * - Fetches selectors from Firestore
 * - Caches locally with TTL
 * - Falls back to bundled defaults on failure
 */

import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

interface SelectorStrategy {
  name: string;
  selectors?: string[];
  excludeSelectors?: string[];
  excludePatterns?: string[];
  containerSelector?: string;
  childSelector?: string;
  excludeChildSelectors?: string[];
  minContentLength?: number;
}

interface PlatformConfig {
  version: number;
  enabled: boolean;
  strategies: SelectorStrategy[];
  detection: {
    hostname: string | string[];
  };
}

interface SelectorRegistry {
  version: number;
  lastUpdated: number;
  platforms: Record<string, PlatformConfig>;
}

// Bundled fallback (current hardcoded selectors)
const BUNDLED_SELECTORS: SelectorRegistry = {
  version: 1,
  lastUpdated: Date.now(),
  platforms: {
    claude: {
      version: 1,
      enabled: true,
      detection: { hostname: 'claude.ai' },
      strategies: [
        {
          name: 'primary',
          selectors: ['[data-testid="human-message"]', '.human-message'],
          minContentLength: 5
        },
        {
          name: 'fallback_class',
          selectors: ['[class*="message"]'],
          excludePatterns: ['assistant', 'ai', 'claude']
        }
      ]
    },
    chatgpt: {
      version: 1,
      enabled: true,
      detection: { hostname: ['chatgpt.com', 'chat.openai.com'] },
      strategies: [
        {
          name: 'primary',
          selectors: ['[data-message-author-role="user"]'],
          minContentLength: 5
        },
        {
          name: 'fallback_article',
          selectors: ['article'],
          excludeChildSelectors: ['.markdown', '.agent-turn']
        }
      ]
    }
    // ... other platforms
  }
};

const CACHE_KEY = 'selectorRegistry';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

class SelectorRegistryService {
  private registry: SelectorRegistry | null = null;
  private lastFetch: number = 0;

  async getRegistry(): Promise<SelectorRegistry> {
    // Try cache first
    if (this.registry && Date.now() - this.lastFetch < CACHE_TTL) {
      return this.registry;
    }

    // Try local storage cache
    const cached = await this.loadFromStorage();
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      this.registry = cached.registry;
      this.lastFetch = cached.fetchedAt;
      return this.registry;
    }

    // Fetch from Firestore
    try {
      const docRef = doc(db, 'config', 'selectors');
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        this.registry = snapshot.data() as SelectorRegistry;
        this.lastFetch = Date.now();
        await this.saveToStorage(this.registry, this.lastFetch);
        console.log('[SelectorRegistry] Loaded from Firestore v' + this.registry.version);
        return this.registry;
      }
    } catch (error) {
      console.warn('[SelectorRegistry] Firestore fetch failed, using cache/bundled:', error);
    }

    // Fall back to cached or bundled
    if (cached) {
      this.registry = cached.registry;
      return this.registry;
    }

    console.log('[SelectorRegistry] Using bundled selectors');
    this.registry = BUNDLED_SELECTORS;
    return this.registry;
  }

  async getPlatformConfig(platform: string): Promise<PlatformConfig | null> {
    const registry = await this.getRegistry();
    return registry.platforms[platform] || null;
  }

  async getStrategies(platform: string): Promise<SelectorStrategy[]> {
    const config = await this.getPlatformConfig(platform);
    return config?.strategies || [];
  }

  private async loadFromStorage(): Promise<{ registry: SelectorRegistry; fetchedAt: number } | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get([CACHE_KEY], (result) => {
        resolve(result[CACHE_KEY] || null);
      });
    });
  }

  private async saveToStorage(registry: SelectorRegistry, fetchedAt: number): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [CACHE_KEY]: { registry, fetchedAt } }, resolve);
    });
  }

  // Force refresh (for debugging or manual update)
  async refresh(): Promise<SelectorRegistry> {
    this.lastFetch = 0;
    await chrome.storage.local.remove([CACHE_KEY]);
    return this.getRegistry();
  }
}

export const selectorRegistry = new SelectorRegistryService();
```

#### Refactored Base Adapter: `src/content/adapters/base.ts`
```typescript
import type { PlatformAdapter, ScrapedPrompt } from '../../types';
import { selectorRegistry } from '../../services/selector-registry';

export abstract class BaseAdapter implements PlatformAdapter {
  abstract name: string;
  abstract detect(): boolean;

  // New: Use remote strategies
  async scrapePromptsWithConfig(): Promise<ScrapedPrompt[]> {
    const strategies = await selectorRegistry.getStrategies(this.name);

    for (const strategy of strategies) {
      const prompts = this.executeStrategy(strategy);
      if (prompts.length > 0) {
        console.log(`[${this.name}] Strategy "${strategy.name}" found ${prompts.length} prompts`);

        // Report success for telemetry
        this.reportSuccess(strategy.name, prompts.length);
        return prompts;
      }
    }

    // All strategies failed
    this.reportFailure();
    return this.fallbackScrape(); // Use local fallback
  }

  private executeStrategy(strategy: SelectorStrategy): ScrapedPrompt[] {
    const prompts: ScrapedPrompt[] = [];
    const seen = new Set<string>();

    if (strategy.selectors) {
      // Standard selector-based strategy
      for (const selector of strategy.selectors) {
        const elements = this.deepQuerySelectorAll(selector);

        for (const el of elements) {
          // Check exclusions
          if (strategy.excludeSelectors?.some(s => el.matches(s))) continue;
          if (strategy.excludePatterns?.some(p =>
            el.className.toLowerCase().includes(p.toLowerCase())
          )) continue;

          const content = this.cleanText(this.getVisibleText(el));
          const minLength = strategy.minContentLength || 3;

          if (content && content.length >= minLength && !seen.has(content) && !this.isUIElement(content)) {
            seen.add(content);
            prompts.push({ content, index: prompts.length });
          }
        }
      }
    } else if (strategy.containerSelector && strategy.childSelector) {
      // Structure-based strategy
      const container = document.querySelector(strategy.containerSelector);
      if (container) {
        const children = container.querySelectorAll(strategy.childSelector);
        children.forEach((child, idx) => {
          // Check if child has excluded elements
          if (strategy.excludeChildSelectors?.some(s => child.querySelector(s))) return;

          const content = this.cleanText(this.getVisibleText(child));
          if (content && content.length > 10 && !seen.has(content)) {
            seen.add(content);
            prompts.push({ content, index: idx });
          }
        });
      }
    }

    return prompts;
  }

  // Override in subclass for local fallback
  protected fallbackScrape(): ScrapedPrompt[] {
    return [];
  }

  // Telemetry hooks (implement in service)
  private reportSuccess(strategy: string, count: number): void {
    // Send to analytics
    chrome.runtime.sendMessage({
      action: 'TELEMETRY',
      event: 'extraction_success',
      data: { platform: this.name, strategy, count }
    });
  }

  private reportFailure(): void {
    chrome.runtime.sendMessage({
      action: 'TELEMETRY',
      event: 'extraction_failure',
      data: { platform: this.name, url: location.href }
    });
  }

  // ... existing utility methods unchanged
}
```

### Why This Makes You Defensible
- **Speed**: Fix broken selectors in seconds, not days
- **Observability**: Know when extraction breaks before users complain
- **Moat**: Competitors need to build this infra; you already have it
- **A/B Testing**: Test new selectors on 10% of users first

---

## 2. UI LAYER - Bulletproof React

### Problem
- 30+ useState hooks = state desync risk
- No error boundary = single crash kills UI
- setTimeout for sidepanel connection = unreliable

### Solution A: Error Boundary

#### `src/sidepanel/ErrorBoundary.tsx`
```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    // Report to telemetry
    chrome.runtime.sendMessage({
      action: 'TELEMETRY',
      event: 'ui_crash',
      data: {
        error: error.message,
        stack: error.stack?.slice(0, 500),
        component: errorInfo.componentStack?.slice(0, 200)
      }
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 text-center">
          <div className="text-4xl mb-4">😵</div>
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Usage in `index.tsx`
```typescript
import { ErrorBoundary } from './ErrorBoundary';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
```

### Solution B: State Consolidation with useReducer

#### `src/sidepanel/useAppState.ts`
```typescript
import { useReducer, useCallback } from 'react';
import type { ExtractionResult, Mode, ScrapedPrompt } from '../types';
import type { ChromeUser, UserTier } from '../services/auth';

// Consolidated state
interface AppState {
  // View
  view: 'main' | 'history' | 'settings' | 'profile';
  theme: 'system' | 'dark' | 'light';

  // Extraction
  mode: Mode;
  result: ExtractionResult | null;
  loading: boolean;
  loadingMessage: string;
  error: string | null;

  // Status
  status: { supported: boolean; platform: string | null };

  // User
  user: ChromeUser | null;
  tier: UserTier;
  signingIn: boolean;

  // Quota
  quota: { used: number; limit: number } | null;

  // UI State
  copied: boolean;
  showSuccess: boolean;
  confirmClear: boolean;
  animatedCount: { prompts: number; words: number };

  // History
  history: HistoryItem[];

  // Summary
  summary: string | null;
  duration: number | null;
}

type Action =
  | { type: 'SET_VIEW'; payload: AppState['view'] }
  | { type: 'SET_THEME'; payload: AppState['theme'] }
  | { type: 'SET_MODE'; payload: Mode }
  | { type: 'START_EXTRACTION'; payload?: string }
  | { type: 'EXTRACTION_SUCCESS'; payload: ExtractionResult }
  | { type: 'EXTRACTION_ERROR'; payload: string }
  | { type: 'SET_STATUS'; payload: AppState['status'] }
  | { type: 'SET_USER'; payload: { user: ChromeUser | null; tier: UserTier } }
  | { type: 'SET_SIGNING_IN'; payload: boolean }
  | { type: 'SET_QUOTA'; payload: AppState['quota'] }
  | { type: 'SET_COPIED'; payload: boolean }
  | { type: 'SET_HISTORY'; payload: HistoryItem[] }
  | { type: 'ADD_TO_HISTORY'; payload: HistoryItem }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_SUMMARY'; payload: string | null }
  | { type: 'SET_ANIMATED_COUNT'; payload: AppState['animatedCount'] }
  | { type: 'RESET_EXTRACTION' };

const initialState: AppState = {
  view: 'main',
  theme: 'system',
  mode: 'raw',
  result: null,
  loading: false,
  loadingMessage: '',
  error: null,
  status: { supported: false, platform: null },
  user: null,
  tier: 'guest',
  signingIn: false,
  quota: null,
  copied: false,
  showSuccess: false,
  confirmClear: false,
  animatedCount: { prompts: 0, words: 0 },
  history: [],
  summary: null,
  duration: null,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SET_MODE':
      return { ...state, mode: action.payload };

    case 'START_EXTRACTION':
      return {
        ...state,
        loading: true,
        loadingMessage: action.payload || 'Extracting...',
        error: null,
        result: null,
        summary: null,
      };

    case 'EXTRACTION_SUCCESS':
      return {
        ...state,
        loading: false,
        loadingMessage: '',
        result: action.payload,
        showSuccess: true,
        error: null,
      };

    case 'EXTRACTION_ERROR':
      return {
        ...state,
        loading: false,
        loadingMessage: '',
        error: action.payload,
      };

    case 'SET_STATUS':
      return { ...state, status: action.payload };

    case 'SET_USER':
      return { ...state, user: action.payload.user, tier: action.payload.tier };

    case 'SET_SIGNING_IN':
      return { ...state, signingIn: action.payload };

    case 'SET_QUOTA':
      return { ...state, quota: action.payload };

    case 'SET_COPIED':
      return { ...state, copied: action.payload };

    case 'SET_HISTORY':
      return { ...state, history: action.payload };

    case 'ADD_TO_HISTORY':
      return { ...state, history: [action.payload, ...state.history].slice(0, 50) };

    case 'CLEAR_HISTORY':
      return { ...state, history: [], confirmClear: false };

    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };

    case 'SET_ANIMATED_COUNT':
      return { ...state, animatedCount: action.payload };

    case 'RESET_EXTRACTION':
      return {
        ...state,
        result: null,
        summary: null,
        error: null,
        showSuccess: false,
      };

    default:
      return state;
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Memoized action creators
  const actions = {
    setView: useCallback((view: AppState['view']) =>
      dispatch({ type: 'SET_VIEW', payload: view }), []),

    setTheme: useCallback((theme: AppState['theme']) =>
      dispatch({ type: 'SET_THEME', payload: theme }), []),

    startExtraction: useCallback((message?: string) =>
      dispatch({ type: 'START_EXTRACTION', payload: message }), []),

    extractionSuccess: useCallback((result: ExtractionResult) =>
      dispatch({ type: 'EXTRACTION_SUCCESS', payload: result }), []),

    extractionError: useCallback((error: string) =>
      dispatch({ type: 'EXTRACTION_ERROR', payload: error }), []),

    // ... other actions
  };

  return { state, dispatch, actions };
}
```

### Solution C: Reliable Sidepanel Connection

#### Replace setTimeout with retry + event-based approach
```typescript
// In service-worker.ts

// Replace this:
setTimeout(() => {
  if (pendingExtraction) {
    broadcastToSidePanels({...});
    pendingExtraction = null;
  }
}, 500);

// With this:
async function waitForSidePanelAndSend(data: any, maxWait = 3000) {
  const startTime = Date.now();
  const interval = 100;

  while (Date.now() - startTime < maxWait) {
    if (sidePanelPorts.size > 0) {
      broadcastToSidePanels(data);
      return true;
    }
    await new Promise(r => setTimeout(r, interval));
  }

  console.warn('[ServiceWorker] Sidepanel did not connect in time');
  return false;
}

// Usage
chrome.sidePanel.open({ windowId }).then(async () => {
  const sent = await waitForSidePanelAndSend({
    action: 'EXTRACTION_FROM_PAGE_RESULT',
    result: pendingExtraction.result,
    mode: pendingExtraction.mode,
  });
  if (sent) pendingExtraction = null;
});
```

### Why This Matters
- **Error Boundary**: Crashes show friendly error, not blank screen
- **useReducer**: Single source of truth, predictable state updates
- **Reliable connection**: Works on slow machines, no race conditions

---

## 3. AUTH & FIREBASE - Secure & Resilient

### Problem
- Hardcoded OAuth client ID and Firebase config
- Email sanitization is incomplete (`+` and unicode fail)
- Module-level `currentUserId` resets on service worker restart
- No Firestore transactions = race conditions

### Solution A: Environment-Based Config

#### `src/config/index.ts`
```typescript
/**
 * Configuration Management
 *
 * Priority: Runtime Config > Storage > Bundled Defaults
 */

interface Config {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  backend: {
    url: string;
  };
  features: {
    telemetryEnabled: boolean;
    remoteSelectorEnabled: boolean;
  };
}

// Bundled defaults (can be overridden)
const BUNDLED_CONFIG: Config = {
  firebase: {
    apiKey: "AIzaSyCub0XtA27wJfA8QzLWTRcVvsn4Wiz84H0",
    authDomain: "tiger-superextension-09.firebaseapp.com",
    projectId: "tiger-superextension-09",
    storageBucket: "tiger-superextension-09.firebasestorage.app",
    messagingSenderId: "523127017746",
    appId: "1:523127017746:web:c58418b3ad5009509823cb",
  },
  backend: {
    url: "https://tai-backend.amaravadhibharath.workers.dev",
  },
  features: {
    telemetryEnabled: true,
    remoteSelectorEnabled: true,
  },
};

class ConfigService {
  private config: Config = BUNDLED_CONFIG;
  private loaded = false;

  async load(): Promise<Config> {
    if (this.loaded) return this.config;

    try {
      // Try to fetch runtime config from Firestore
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../services/firebase');

      const configDoc = await getDoc(doc(db, 'config', 'runtime'));
      if (configDoc.exists()) {
        const remoteConfig = configDoc.data() as Partial<Config>;
        this.config = this.mergeConfig(BUNDLED_CONFIG, remoteConfig);
        console.log('[Config] Loaded runtime config from Firestore');
      }
    } catch (error) {
      console.log('[Config] Using bundled config');
    }

    this.loaded = true;
    return this.config;
  }

  private mergeConfig(base: Config, override: Partial<Config>): Config {
    return {
      firebase: { ...base.firebase, ...override.firebase },
      backend: { ...base.backend, ...override.backend },
      features: { ...base.features, ...override.features },
    };
  }

  get firebase() { return this.config.firebase; }
  get backend() { return this.config.backend; }
  get features() { return this.config.features; }
}

export const config = new ConfigService();
```

### Solution B: Robust Email Key Sanitization

```typescript
// In firebase.ts

/**
 * Sanitize email for use as Firestore document key
 * Handles: dots, plus signs, unicode, special chars
 */
function sanitizeEmailKey(email: string): string {
  return email
    .toLowerCase()
    .replace(/\./g, '_dot_')
    .replace(/\+/g, '_plus_')
    .replace(/@/g, '_at_')
    .replace(/[^a-z0-9_]/g, '_'); // Catch-all for unicode/special
}

// Usage
export async function checkProStatus(email: string): Promise<boolean> {
  try {
    const userKey = sanitizeEmailKey(email);
    // ... rest unchanged
  }
}
```

### Solution C: Persistent User ID

```typescript
// In firebase.ts

// Replace module-level variable with storage-backed approach
const USER_ID_KEY = 'firebase_current_user_id';

export async function setCurrentUser(userId: string | null): Promise<void> {
  if (userId) {
    await chrome.storage.session.set({ [USER_ID_KEY]: userId });
  } else {
    await chrome.storage.session.remove([USER_ID_KEY]);
  }
  console.log('[Firebase] User set:', userId ? 'logged in' : 'logged out');
}

export async function getCurrentUserId(): Promise<string | null> {
  const result = await chrome.storage.session.get([USER_ID_KEY]);
  return result[USER_ID_KEY] || null;
}
```

### Solution D: Firestore Transactions

```typescript
// In firebase.ts

import { runTransaction } from 'firebase/firestore';

export async function saveKeylogsToCloud(
  userId: string,
  platform: string,
  prompts: CloudKeylogItem[]
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const keylogRef = doc(db, `users/${userId}/keylogs/${platform}_${today}`);

  try {
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(keylogRef);
      let existing: CloudKeylogItem[] = [];

      if (snapshot.exists()) {
        existing = snapshot.data().prompts || [];
      }

      // Merge and deduplicate
      const merged = [...existing];
      const existingKeys = new Set(
        existing.map(p => `${p.content}|||${p.conversationId}`) // Safer delimiter
      );

      for (const prompt of prompts) {
        const key = `${prompt.content}|||${prompt.conversationId}`;
        if (!existingKeys.has(key)) {
          merged.push(prompt);
          existingKeys.add(key);
        }
      }

      transaction.set(keylogRef, {
        prompts: merged,
        lastUpdated: Date.now()
      });
    });

    console.log('[Firebase] Saved keylogs with transaction');
  } catch (error) {
    console.error('[Firebase] Transaction failed:', error);
  }
}
```

---

## 4. BACKEND/API - Observable & Configurable

### Problem
- Hardcoded backend URL
- Circuit breaker state lost on restart
- No visibility into failures

### Solution A: Configurable Backend URL

```typescript
// In ai-summarizer.ts

import { config } from '../config';

// Replace hardcoded URL
// const BACKEND_URL = 'https://tai-backend.amaravadhibharath.workers.dev';

// With:
const getBackendUrl = async () => {
  const cfg = await config.load();
  return cfg.backend.url;
};

export class AISummarizer {
  async summarize(prompts: ScrapedPrompt[], options: SummaryOptions = {}): Promise<SummaryResult> {
    const backendUrl = await getBackendUrl();

    const response = await resilientFetch(backendUrl, {
      // ... rest unchanged
    });
  }
}
```

### Solution B: Persistent Circuit Breaker

```typescript
// In resilient-api.ts

const CIRCUIT_STATE_KEY = 'circuit_breaker_state';

interface PersistedCircuitState {
  state: CircuitState;
  failures: number;
  lastFailureTime: number;
}

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private config: CircuitBreakerConfig;
  private name: string;

  constructor(name: string, config: CircuitBreakerConfig) {
    this.name = name;
    this.config = config;
    this.loadState();
  }

  private async loadState(): Promise<void> {
    try {
      const key = `${CIRCUIT_STATE_KEY}_${this.name}`;
      const result = await chrome.storage.session.get([key]);
      if (result[key]) {
        const persisted = result[key] as PersistedCircuitState;
        this.state = persisted.state;
        this.failures = persisted.failures;
        this.lastFailureTime = persisted.lastFailureTime;
        console.log(`[CircuitBreaker:${this.name}] Restored state: ${this.state}`);
      }
    } catch (e) {
      // Ignore, use defaults
    }
  }

  private async saveState(): Promise<void> {
    const key = `${CIRCUIT_STATE_KEY}_${this.name}`;
    await chrome.storage.session.set({
      [key]: {
        state: this.state,
        failures: this.failures,
        lastFailureTime: this.lastFailureTime,
      }
    });
  }

  // ... rest of implementation calls this.saveState() after state changes
}
```

### Solution C: Telemetry Service

#### `src/services/telemetry.ts`
```typescript
/**
 * Telemetry Service
 * - Tracks extraction success/failure
 * - Reports errors
 * - Batches events for efficiency
 */

interface TelemetryEvent {
  event: string;
  timestamp: number;
  data: Record<string, any>;
}

class TelemetryService {
  private queue: TelemetryEvent[] = [];
  private flushInterval: number | null = null;
  private enabled = true;

  constructor() {
    // Flush every 30 seconds
    this.flushInterval = setInterval(() => this.flush(), 30000) as unknown as number;
  }

  track(event: string, data: Record<string, any> = {}): void {
    if (!this.enabled) return;

    this.queue.push({
      event,
      timestamp: Date.now(),
      data: {
        ...data,
        version: chrome.runtime.getManifest().version,
      },
    });

    // Flush immediately for critical events
    if (event.includes('error') || event.includes('crash')) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      // Send to Firestore
      const { collection, addDoc } = await import('firebase/firestore');
      const { db, getCurrentUserId } = await import('./firebase');

      const userId = await getCurrentUserId();
      const telemetryRef = collection(db, 'telemetry');

      await addDoc(telemetryRef, {
        userId: userId || 'anonymous',
        events,
        sentAt: Date.now(),
      });
    } catch (error) {
      // Re-queue on failure (with limit)
      if (events.length < 100) {
        this.queue = [...events, ...this.queue].slice(0, 100);
      }
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

export const telemetry = new TelemetryService();
```

---

## 5. CHROME APIs - Graceful Degradation

### Problem
- SidePanel API might change
- Service worker goes inactive after ~30s
- Content scripts might not load on SPAs

### Solution A: API Feature Detection

```typescript
// In service-worker.ts

// Check if sidePanel API exists before using
function setupSidePanel(): void {
  if (chrome.sidePanel) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
      .catch(err => {
        console.warn('[ServiceWorker] SidePanel setup failed:', err);
        // Fallback: open popup instead
        setupPopupFallback();
      });
  } else {
    console.warn('[ServiceWorker] SidePanel API not available');
    setupPopupFallback();
  }
}

function setupPopupFallback(): void {
  chrome.action.setPopup({ popup: 'popup.html' });
}
```

### Solution B: Service Worker Keep-Alive (for long operations)

```typescript
// In service-worker.ts

// Keep service worker alive during long operations
async function withKeepAlive<T>(operation: () => Promise<T>): Promise<T> {
  // Create a port to keep alive (Chrome workaround)
  const keepAlive = setInterval(() => {
    chrome.runtime.getPlatformInfo(() => {}); // Dummy call
  }, 25000);

  try {
    return await operation();
  } finally {
    clearInterval(keepAlive);
  }
}

// Usage
async function handleSummarization(prompts: any[]) {
  return withKeepAlive(async () => {
    const result = await aiSummarizer.summarize(prompts);
    return result;
  });
}
```

### Solution C: Dynamic Content Script Injection

```typescript
// In service-worker.ts

// Handle SPA navigation by re-injecting content script
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  if (details.frameId !== 0) return; // Only main frame

  const platform = detectPlatformFromUrl(details.url);
  if (platform) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ['content.js'],
      });
      console.log(`[ServiceWorker] Re-injected content script for ${platform}`);
    } catch (err) {
      // Already injected or permission denied
    }
  }
});
```

---

## 6. BUILD & CONFIG - Production-Grade

### Problem
- No tests
- Loose version pinning
- Fragile post-build path manipulation

### Solution A: Add Vitest for Testing

#### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
    },
  },
});
```

#### `tests/setup.ts`
```typescript
// Mock Chrome APIs
global.chrome = {
  runtime: {
    sendMessage: vi.fn(),
    onMessage: { addListener: vi.fn() },
    getManifest: () => ({ version: '1.0.0' }),
    lastError: null,
  },
  storage: {
    local: {
      get: vi.fn((keys, cb) => cb({})),
      set: vi.fn((data, cb) => cb?.()),
      remove: vi.fn((keys, cb) => cb?.()),
    },
    session: {
      get: vi.fn((keys, cb) => cb({})),
      set: vi.fn((data, cb) => cb?.()),
    },
    onChanged: { addListener: vi.fn() },
  },
  identity: {
    getAuthToken: vi.fn(),
    removeCachedAuthToken: vi.fn(),
  },
  tabs: {
    query: vi.fn(),
    sendMessage: vi.fn(),
  },
  sidePanel: {
    open: vi.fn(),
    setPanelBehavior: vi.fn(),
  },
} as any;
```

#### `tests/adapters/claude.test.ts`
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { ClaudeAdapter } from '../../src/content/adapters/claude';

describe('ClaudeAdapter', () => {
  let adapter: ClaudeAdapter;

  beforeEach(() => {
    adapter = new ClaudeAdapter();
    document.body.innerHTML = '';
  });

  it('detects claude.ai hostname', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'claude.ai' },
      writable: true,
    });
    expect(adapter.detect()).toBe(true);
  });

  it('extracts user messages from data-testid', () => {
    document.body.innerHTML = `
      <div data-testid="human-message">Hello Claude</div>
      <div class="assistant">Hi there!</div>
      <div data-testid="human-message">How are you?</div>
    `;

    const prompts = adapter.scrapePrompts();

    expect(prompts).toHaveLength(2);
    expect(prompts[0].content).toBe('Hello Claude');
    expect(prompts[1].content).toBe('How are you?');
  });

  it('filters UI elements', () => {
    document.body.innerHTML = `
      <div data-testid="human-message">Copy</div>
      <div data-testid="human-message">Real question here</div>
    `;

    const prompts = adapter.scrapePrompts();

    expect(prompts).toHaveLength(1);
    expect(prompts[0].content).toBe('Real question here');
  });
});
```

### Solution B: Lock Dependencies

```json
// package.json - pin exact versions
{
  "dependencies": {
    "firebase": "12.8.0",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@types/chrome": "0.0.268",
    "vite": "5.3.1",
    "vitest": "1.6.0"
  }
}
```

### Solution C: Robust Post-Build Plugin

```typescript
// vite.config.ts

const postBuildPlugin = () => ({
  name: 'post-build',
  closeBundle() {
    const operations = [
      { src: 'public/manifest.json', dest: 'dist/manifest.json' },
      { src: 'public/welcome.html', dest: 'dist/welcome.html' },
    ];

    for (const op of operations) {
      try {
        if (existsSync(op.src)) {
          copyFileSync(op.src, op.dest);
          console.log(`✓ Copied ${op.src}`);
        }
      } catch (err) {
        console.error(`✗ Failed to copy ${op.src}:`, err);
        throw err; // Fail build on error
      }
    }

    // Fix paths with validation
    const htmlFiles = [
      { path: 'dist/src/sidepanel/index.html', dest: 'dist/sidepanel/index.html' },
      { path: 'dist/src/sidepanel/history.html', dest: 'dist/sidepanel/history.html' },
    ];

    mkdirSync('dist/sidepanel', { recursive: true });

    for (const file of htmlFiles) {
      if (existsSync(file.path)) {
        let html = readFileSync(file.path, 'utf-8');

        // Validate HTML before transform
        if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
          console.warn(`⚠ ${file.path} may not be valid HTML`);
        }

        html = html
          .replace(/src="\.\.\/\.\.\/([^"]+)"/g, 'src="../$1"')
          .replace(/href="\.\.\/\.\.\/([^"]+)"/g, 'href="../$1"');

        writeFileSync(file.dest, html);
        console.log(`✓ Fixed paths in ${file.dest}`);
      }
    }

    // Cleanup
    rmSync('dist/src', { recursive: true, force: true });
    console.log('✓ Build post-processing complete');
  }
});
```

---

## 7. DATA INTEGRITY - Bulletproof Sync

### Problem
- Firestore read-modify-write without transactions
- History merge can lose items on ID collision
- No versioning for conflict detection

### Solution A: Optimistic Locking with Versions

```typescript
// In firebase.ts

export interface CloudHistoryItem {
  id: string;
  platform: string;
  promptCount: number;
  mode: 'raw' | 'summary';
  timestamp: number;
  preview: string;
  prompts: Array<{ content: string; index: number }>;
  summary?: string;
  version: number; // NEW: for optimistic locking
  clientId: string; // NEW: identify which client created it
}

const CLIENT_ID = crypto.randomUUID(); // Unique per extension instance

export async function saveHistoryToCloud(
  userId: string,
  item: Omit<CloudHistoryItem, 'version' | 'clientId'>
): Promise<void> {
  const historyRef = doc(db, `users/${userId}/history/${item.id}`);

  try {
    await runTransaction(db, async (transaction) => {
      const existing = await transaction.get(historyRef);
      const currentVersion = existing.exists() ? existing.data().version || 0 : 0;

      transaction.set(historyRef, {
        ...item,
        version: currentVersion + 1,
        clientId: CLIENT_ID,
        timestamp: item.timestamp || Date.now(),
        syncedAt: Date.now(),
      });
    });

    console.log('[Firebase] Saved history:', item.id);
  } catch (error) {
    console.error('[Firebase] Save history error:', error);
    throw error;
  }
}
```

### Solution B: Smart Merge with Conflict Detection

```typescript
export function mergeHistory(
  local: CloudHistoryItem[],
  cloud: CloudHistoryItem[]
): { merged: CloudHistoryItem[]; conflicts: CloudHistoryItem[] } {
  const cloudMap = new Map(cloud.map(item => [item.id, item]));
  const merged: CloudHistoryItem[] = [];
  const conflicts: CloudHistoryItem[] = [];

  // Process cloud items
  for (const cloudItem of cloud) {
    merged.push(cloudItem);
  }

  // Process local items
  for (const localItem of local) {
    const cloudItem = cloudMap.get(localItem.id);

    if (!cloudItem) {
      // Local-only item, add it
      merged.push(localItem);
    } else if (localItem.version > cloudItem.version) {
      // Local is newer (shouldn't happen normally)
      conflicts.push(localItem);
    }
    // Otherwise cloud wins (already in merged)
  }

  // Sort by timestamp descending
  merged.sort((a, b) => b.timestamp - a.timestamp);

  return { merged, conflicts };
}
```

### Solution C: Sync Status Tracking

```typescript
// Track sync state for UI feedback

interface SyncState {
  lastSynced: number | null;
  pending: number;
  errors: string[];
  status: 'idle' | 'syncing' | 'error' | 'offline';
}

class SyncManager {
  private state: SyncState = {
    lastSynced: null,
    pending: 0,
    errors: [],
    status: 'idle',
  };

  private listeners: Set<(state: SyncState) => void> = new Set();

  async sync(userId: string): Promise<void> {
    this.updateState({ status: 'syncing', errors: [] });

    try {
      // Get local history
      const local = await this.getLocalHistory();

      // Get cloud history
      const cloud = await getHistoryFromCloud(userId);

      // Merge
      const { merged, conflicts } = mergeHistory(local, cloud);

      // Save merged to local
      await this.saveLocalHistory(merged);

      // Upload local-only items to cloud
      const localOnly = merged.filter(item =>
        !cloud.some(c => c.id === item.id)
      );

      for (const item of localOnly) {
        await saveHistoryToCloud(userId, item);
      }

      this.updateState({
        status: conflicts.length > 0 ? 'error' : 'idle',
        lastSynced: Date.now(),
        errors: conflicts.map(c => `Conflict: ${c.id}`),
      });
    } catch (error) {
      this.updateState({
        status: 'error',
        errors: [error instanceof Error ? error.message : 'Sync failed'],
      });
    }
  }

  subscribe(listener: (state: SyncState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private updateState(partial: Partial<SyncState>): void {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach(l => l(this.state));
  }

  // ... getLocalHistory, saveLocalHistory implementations
}

export const syncManager = new SyncManager();
```

---

## Implementation Priority

| Week | Tasks | Impact |
|------|-------|--------|
| **1** | Remote Selector Config + Error Boundary | Fixes critical scraping fragility + prevents UI crashes |
| **2** | Telemetry Service + Firestore Transactions | Observability + data integrity |
| **3** | useReducer refactor + Config service | Cleaner code + configurable deployment |
| **4** | Tests + CI/CD setup | Long-term maintainability |

---

## Your Competitive Moat

After implementing these:

1. **Speed to fix**: Selector breaks? Fix in Firestore in 30 seconds vs. 3-7 day app store review
2. **Observability**: Know when things break before users complain
3. **Reliability**: Transactions, error boundaries, retry logic
4. **Complexity**: 2000+ lines of infrastructure code competitors must replicate

This isn't just about being robust — it's about being **operationally excellent** in a way that's expensive to copy.

---

**Questions?** Let me know which section to implement first!
