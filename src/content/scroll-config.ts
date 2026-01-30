/**
 * Platform-specific scroll configuration for aggressive extraction
 * Each platform has different virtual scrolling behavior and DOM characteristics
 * These parameters determine how aggressively we scroll to load all messages
 */

export interface ScrollConfig {
  topAttempts: number;      // How many times to scroll to top
  bottomAttempts: number;   // How many times to scroll to bottom
  waitPerScroll: number;    // MS to wait after each scroll for DOM to render
  stabilityChecks: number;  // Consecutive stable height checks before breaking
  parallelWait: number;     // MS to wait before parallel position extraction
  name: string;
}

/**
 * Configuration for all supported platforms
 * Tuned based on platform-specific virtual scrolling aggressiveness
 */
export const PLATFORM_SCROLL_CONFIG: Record<string, ScrollConfig> = {
  // TIER 1: Aggressive virtual scrolling (needs maximum extraction)
  lovable: {
    name: 'Lovable',
    topAttempts: 70,        // Increased: 50 → 70 (more attempts for top messages)
    bottomAttempts: 70,     // Increased: 50 → 70 (more attempts for bottom messages)
    waitPerScroll: 600,     // Increased: 500ms → 600ms (more render time)
    stabilityChecks: 6,     // Increased: 5 → 6 (stricter confirmation)
    parallelWait: 1200      // Increased: 1000ms → 1200ms (more extraction time)
  },

  // TIER 2: Moderate virtual scrolling (most platforms)
  chatgpt: {
    name: 'ChatGPT',
    topAttempts: 40,
    bottomAttempts: 40,
    waitPerScroll: 400,
    stabilityChecks: 4,
    parallelWait: 800
  },

  claude: {
    name: 'Claude',
    topAttempts: 40,
    bottomAttempts: 40,
    waitPerScroll: 400,
    stabilityChecks: 4,
    parallelWait: 800
  },

  gemini: {
    name: 'Gemini',
    topAttempts: 35,
    bottomAttempts: 35,
    waitPerScroll: 350,
    stabilityChecks: 4,
    parallelWait: 750
  },

  perplexity: {
    name: 'Perplexity',
    topAttempts: 35,
    bottomAttempts: 35,
    waitPerScroll: 350,
    stabilityChecks: 4,
    parallelWait: 750
  },

  // TIER 3: Lighter virtual scrolling (less aggressive)
  deepseek: {
    name: 'DeepSeek',
    topAttempts: 30,
    bottomAttempts: 30,
    waitPerScroll: 300,
    stabilityChecks: 3,
    parallelWait: 600
  },

  bolt: {
    name: 'Bolt.new',
    topAttempts: 30,
    bottomAttempts: 30,
    waitPerScroll: 300,
    stabilityChecks: 3,
    parallelWait: 600
  },

  cursor: {
    name: 'Cursor',
    topAttempts: 30,
    bottomAttempts: 30,
    waitPerScroll: 300,
    stabilityChecks: 3,
    parallelWait: 600
  },

  'meta-ai': {
    name: 'Meta AI',
    topAttempts: 25,
    bottomAttempts: 25,
    waitPerScroll: 250,
    stabilityChecks: 3,
    parallelWait: 500
  }
};

/**
 * Get scroll configuration for a specific platform
 * Falls back to conservative defaults if platform not found
 */
export function getScrollConfig(platformName: string | null): ScrollConfig {
  const name = platformName || 'generic';
  const normalizedName = name.toLowerCase().replace(/\s+/g, '-');

  return (
    PLATFORM_SCROLL_CONFIG[normalizedName] ||
    (platformName ? PLATFORM_SCROLL_CONFIG[platformName] : null) ||
    // Conservative defaults for unknown platforms
    {
      name: name,
      topAttempts: 20,
      bottomAttempts: 20,
      waitPerScroll: 250,
      stabilityChecks: 3,
      parallelWait: 500
    }
  );
}

/**
 * Configuration tier lookup
 * Helps understand which extraction strategy is being used
 */
export function getConfigTier(platformName: string | null): string {
  const config = getScrollConfig(platformName);

  if (config.topAttempts >= 40) {
    return 'TIER 1 (Aggressive)';
  } else if (config.topAttempts >= 30) {
    return 'TIER 2 (Moderate)';
  } else {
    return 'TIER 3 (Conservative)';
  }
}
