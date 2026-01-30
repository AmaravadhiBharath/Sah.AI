import { useState, useEffect, useCallback, useRef } from 'react';
import type { ExtractionResult, Mode, ScrapedPrompt } from '../types';
import {
  initializeAuth,
  signInWithGoogle,
  signOut,
  subscribeToAuthChanges,
  type ChromeUser,
  type UserTier,
  getUserTier,
} from '../services/auth';
import {
  saveHistoryToCloud,
  getHistoryFromCloud,
  mergeHistory,
  type CloudHistoryItem,
} from '../services/firebase';
import {
  OnboardingModal,
  SuccessCelebration,
  KeyboardHints,
  ModeToggle,
} from './UXComponents';
// Import design system and fixes (in order of priority)
import './design-tokens.css';      // Spacing tokens, typography scale, focus styles
import './fixes.css';               // Critical fixes for audit issues
import './ux-enhancements.css';     // Legacy styles (will be gradually phased out)

interface StatusInfo {
  supported: boolean;
  platform: string | null;
}

interface HistoryItem {
  id: string;
  platform: string;
  promptCount: number;
  mode: Mode;
  timestamp: number;
  prompts: ScrapedPrompt[];
  preview: string;
  summary?: string;
}

type Theme = 'system' | 'dark' | 'light';
type View = 'main' | 'history' | 'settings' | 'profile';

function friendlyError(error: string): string {
  if (error.includes('timeout') || error.includes('Timeout')) {
    return 'Request took too long. Please try again.';
  }
  if (error.includes('network') || error.includes('Network') || error.includes('Failed to fetch')) {
    return 'Connection issue. Check your internet and try again.';
  }
  if (error.includes('temporarily unavailable') || error.includes('Circuit')) {
    return 'Service is busy. Please wait a moment and try again.';
  }
  if (error.includes('quota') || error.includes('limit') || error.includes('429')) {
    return 'Daily limit reached. Upgrade to Pro for more.';
  }
  if (error.includes('401') || error.includes('403') || error.includes('auth')) {
    return 'Session expired. Please sign in again.';
  }
  if (error.includes('empty')) {
    return 'No content to process. Start a conversation first.';
  }
  return error.length > 100 ? error.slice(0, 100) + '...' : error;
}

export default function App() {
  const [view, setView] = useState<View>('main');
  const [mode, setMode] = useState<Mode>('raw');
  const [theme, setTheme] = useState<Theme>('system');
  const [status, setStatus] = useState<StatusInfo>({ supported: false, platform: null });
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPulseCheck, setShowPulseCheck] = useState(false);
  const [, setCurrentTimestamp] = useState<number | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const [user, setUser] = useState<ChromeUser | null>(null);
  const [tier, setTier] = useState<UserTier>('guest');
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [, setQuota] = useState<{ used: number; limit: number } | null>(null);
  const [, setDuration] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const portRef = useRef<chrome.runtime.Port | null>(null);
  const [, setAnimatedCount] = useState({ prompts: 0, words: 0 });
  const [showStats, setShowStats] = useState(true);

  const profileRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // UX Enhancement States
  const [showOnboarding, setShowOnboarding] = useState(false);
  // Tooltip state removed - using component-level tooltips instead
  const [showSuccessCelebration, setShowSuccessCelebration] = useState(false);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);

  // Track last extracted content to detect changes
  const [lastExtractedContent, setLastExtractedContent] = useState<string>('');

  // Debug: Tier simulator (only for admin users)
  const [debugTierOverride, setDebugTierOverride] = useState<UserTier | null>(null);
  const displayTier = debugTierOverride || tier;

  // Track selected prompts for checkbox functionality
  const [selectedPrompts, setSelectedPrompts] = useState<Set<number>>(new Set());



  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 10 && showStats) {
      setShowStats(false);
    } else if (scrollTop <= 10 && !showStats) {
      setShowStats(true);
    }
  };

  // Animate count up when result changes
  useEffect(() => {
    if (result) {
      const targetPrompts = result.prompts.length;
      const targetWords = result.prompts.reduce((acc, p) => acc + p.content.split(/\s+/).length, 0);

      setAnimatedCount({ prompts: 0, words: 0 });

      const duration = 600;
      const steps = 20;
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
        setAnimatedCount({
          prompts: Math.round(targetPrompts * eased),
          words: Math.round(targetWords * eased),
        });
        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [result]);

  // Apply theme
  const getEffectiveTheme = useCallback(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  const effectiveTheme = getEffectiveTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);

  // Load history, theme, quota, and check for first-time user
  useEffect(() => {
    chrome.storage.local.get(['extractionHistory', 'theme', 'quotaUsed', 'quotaLimit', 'hasSeenOnboarding'], (data) => {
      if (data.extractionHistory) setHistory(data.extractionHistory);
      if (data.theme) setTheme(data.theme);
      if (data.quotaUsed !== undefined && data.quotaLimit !== undefined) {
        setQuota({ used: data.quotaUsed, limit: data.quotaLimit });
      }

      // Show onboarding for first-time users
      if (!data.hasSeenOnboarding && !data.extractionHistory?.length) {
        setTimeout(() => setShowOnboarding(true), 800);
      }
    });
  }, []);

  // Initialize auth and sync history from cloud
  useEffect(() => {
    initializeAuth().then(async (state) => {
      setUser(state.user);
      setTier(state.tier);

      if (state.user) {
        try {
          const cloudHistory = await getHistoryFromCloud(state.user.id);
          if (cloudHistory.length > 0) {
            setHistory(prev => {
              const merged = mergeHistory(prev as CloudHistoryItem[], cloudHistory);
              chrome.storage.local.set({ extractionHistory: merged });
              return merged as HistoryItem[];
            });
          }
        } catch (error) {
          console.error('[App] Cloud sync failed:', error);
        }
      }
    });
    const unsubscribe = subscribeToAuthChanges(async (newUser) => {
      setUser(newUser);
      if (newUser) {
        const newTier = await getUserTier(newUser);
        setTier(newTier);
        try {
          const cloudHistory = await getHistoryFromCloud(newUser.id);
          if (cloudHistory.length > 0) {
            setHistory(prev => {
              const merged = mergeHistory(prev as CloudHistoryItem[], cloudHistory);
              chrome.storage.local.set({ extractionHistory: merged });
              return merged as HistoryItem[];
            });
          }
        } catch (error) {
          console.error('[App] Cloud sync on login failed:', error);
        }
      } else {
        setTier('guest');
      }
    });
    return unsubscribe;
  }, []);

  // Keep track of last result for auto-save
  const [lastExtractionResult, setLastExtractionResult] = useState<ExtractionResult | null>(null);

  const autoSaveToHistory = useCallback((res: ExtractionResult, saveMode: Mode, sum?: string) => {
    const preview = res.prompts[0]?.content.slice(0, 50) || 'No prompts';
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      platform: res.platform,
      promptCount: res.prompts.length,
      mode: saveMode,
      timestamp: Date.now(),
      prompts: res.prompts,
      preview,
      summary: sum,
    };

    setHistory(prev => {
      // Avoid duplicate consecutive saves of the same content
      if (prev.length > 0 && prev[0].preview === historyItem.preview && prev[0].platform === historyItem.platform && prev[0].mode === historyItem.mode) {
        return prev;
      }
      const updated = [historyItem, ...prev].slice(0, 50);
      chrome.storage.local.set({ extractionHistory: updated });
      return updated;
    });

    if (user) {
      saveHistoryToCloud(user.id, historyItem as CloudHistoryItem).catch(e => console.error('[App] Auto-save cloud failed:', e));
    }
  }, [user]);

  const closeModals = useCallback(() => {
    setShowProfileModal(false);
    setShowHistoryModal(false);
    setShowSettingsModal(false);
  }, []);

  const handleClearResult = () => {
    setResult(null);
    setSummary(null);
    setLoading(false);
    setLoadingMessage('');
    setDuration(0);
    setError(null);
    setShowStats(false);
    setLastExtractedContent(''); // Changed from null to '' to match useState type
    closeModals();
  };

  const handleExtractionResult = useCallback((extractionResult: ExtractionResult, extractMode: Mode) => {
    const endTime = performance.now();
    setDuration((endTime - startTimeRef.current) / 1000);
    setResult(extractionResult);
    setLastExtractionResult(extractionResult);
    setLoading(false);
    setLoadingMessage('');
    setView('main');
    setSummary(null);
    setError(null);
    setShowStats(true);
    setCurrentTimestamp(null);

    // Track the extracted content to detect changes
    const contentHash = extractionResult.prompts.map(p => p.content).join('|');
    setLastExtractedContent(contentHash);

    // Show success celebration for first extraction
    // Timeout: 5000ms (5 seconds) for accessibility - gives users time to read message
    // Increased from 3000ms per WCAG accessibility guidelines
    // DISABLED: Success celebration popup interferes with clean UI
    // if (extractionResult.prompts.length > 0) {
    //   setShowSuccessCelebration(true);
    //   setTimeout(() => setShowSuccessCelebration(false), 5000);
    // }

    // Auto-save raw extraction immediately (Always)
    if (extractMode === 'raw') {
      autoSaveToHistory(extractionResult, 'raw');
    }
  }, [autoSaveToHistory]);

  // Refs to access latest state in callbacks without triggering re-connections
  const modeRef = useRef(mode);
  const lastResultRef = useRef(lastExtractionResult);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { lastResultRef.current = lastExtractionResult; }, [lastExtractionResult]);

  // Message handler - extracted so it can be reused on reconnection
  const handlePortMessage = useCallback((message: any) => {
    if (message.action === 'EXTRACTION_RESULT' || message.action === 'EXTRACTION_FROM_PAGE_RESULT') {
      setError(null);
      const extractMode = message.mode || modeRef.current;
      if (message.mode) setMode(message.mode);
      handleExtractionResult(message.result, extractMode);

      if (extractMode === 'summary' && message.result.prompts.length > 0) {
        setLoading(true);
        setLoadingMessage('Consolidating prompts...');
        portRef.current?.postMessage({ action: 'SUMMARIZE_PROMPTS', prompts: message.result.prompts });
      }
    } else if (message.action === 'STATUS_RESULT') {
      setStatus({ supported: message.supported, platform: message.platform });
    } else if (message.action === 'SUMMARY_RESULT') {
      setLoading(false);
      setLoadingMessage('');
      if (message.success && message.result?.summary) {
        setSummary(message.result.summary);
        setError(null);
        // Auto-save to history when summary is ready
        if (lastResultRef.current) {
          autoSaveToHistory(lastResultRef.current, 'summary', message.result.summary);
        }
      } else if (message.error) {
        setError(friendlyError(message.error));
      }
      if (message.quotaUsed !== undefined) {
        setQuota({ used: message.quotaUsed, limit: message.quotaLimit || 10 });
        chrome.storage.local.set({ quotaUsed: message.quotaUsed, quotaLimit: message.quotaLimit || 10 });
      }
    } else if (message.action === 'ERROR') {
      setLoading(false);
      setLoadingMessage('');
      setError(friendlyError(message.error));
    } else if (message.action === 'PROGRESS') {
      setLoadingMessage(message.message || 'Processing...');
    }
  }, [handleExtractionResult, autoSaveToHistory]);

  // Connect to service worker with auto-reconnection
  const connectPort = useCallback(() => {
    const port = chrome.runtime.connect({ name: 'sidepanel' });
    portRef.current = port;

    port.onMessage.addListener(handlePortMessage);

    port.onDisconnect.addListener(() => {
      console.log('[SahAI] Port disconnected, will reconnect on next action');
      portRef.current = null;
    });

    port.postMessage({ action: 'GET_STATUS' });
    return port;
  }, [handlePortMessage]);

  useEffect(() => {
    const port = connectPort();
    return () => {
      portRef.current = null;
      port.disconnect();
    };
  }, [connectPort]);

  const handleExtract = useCallback(() => {
    closeModals();
    if (!status.supported) return;
    console.log('[SahAI] handleExtract called, mode:', mode);

    // Always ensure port is connected before sending message
    if (!portRef.current) {
      console.warn('[SahAI] Port not connected, connecting...');
      connectPort();

      // Wait a bit for port to be ready after connecting
      setTimeout(() => {
        if (portRef.current) {
          console.log('[SahAI] Port connected, sending EXTRACT_PROMPTS');
          portRef.current.postMessage({ action: 'EXTRACT_PROMPTS', mode });
        } else {
          console.error('[SahAI] Port still not connected after retry');
          setLoading(false);
          setError('Failed to connect to extension. Please try again.');
        }
      }, 100);

      setLoading(true);
      setError(null);
      setDuration(null);
      startTimeRef.current = performance.now();
      setLoadingMessage('Extracting prompts...');
    } else {
      setLoading(true);
      setError(null);
      setDuration(null);
      startTimeRef.current = performance.now();
      setLoadingMessage('Extracting prompts...');

      console.log('[SahAI] Sending EXTRACT_PROMPTS message');
      portRef.current.postMessage({ action: 'EXTRACT_PROMPTS', mode });
    }

    // Safety timeout in case service worker or content script hangs
    // Increased to 50 seconds to match service worker + buffer
    setTimeout(() => {
      setLoading((currentLoading) => {
        if (currentLoading) {
          console.warn('[SahAI] Extraction timed out in sidepanel');
          setError('Request timed out. Please refresh the page and try again.');
          return false;
        }
        return currentLoading;
      });
    }, 50000);
  }, [mode, connectPort, status.supported, closeModals]);

  useEffect(() => {
    const handleTriggerExtract = () => handleExtract();
    window.addEventListener('trigger-extract', handleTriggerExtract);
    return () => window.removeEventListener('trigger-extract', handleTriggerExtract);
  }, [handleExtract]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const content = result.prompts.map(p => p.content).join('\n\n');
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) chrome.tabs.sendMessage(tab.id, { action: 'CONTENT_COPIED', content });
  }, [result]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + E: Extract
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        if (status.supported && !loading) handleExtract();
      }
      // Cmd/Ctrl + C: Copy
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && result && !window.getSelection()?.toString()) {
        e.preventDefault();
        handleCopy();
      }
      // ?: Show keyboard hints
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setShowKeyboardHints(true);
      }
      // Esc: Close modals
      if (e.key === 'Escape') {
        setShowOnboarding(false);
        setShowKeyboardHints(false);
        setShowHistoryModal(false);
        setShowSettingsModal(false);
        setShowProfileModal(false);
        setShowPulseCheck(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status.supported, loading, result, handleExtract, handleCopy]);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't close if clicking inside a popup or on a nav button (prevent toggle glitch)
      if (target.closest('.popup') || target.closest('.nav-dock') || target.closest('.action-zone') || target.closest('.m3-top-app-bar')) return;

      if (showHistoryModal || showSettingsModal || showProfileModal || showPulseCheck) {
        setShowHistoryModal(false);
        setShowSettingsModal(false);
        setShowProfileModal(false);
        setShowPulseCheck(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside, true);
    return () => window.removeEventListener('mousedown', handleClickOutside, true);
  }, [showHistoryModal, showSettingsModal, showProfileModal, showPulseCheck]);


  const loadHistoryItem = (item: HistoryItem) => {
    setResult({ prompts: item.prompts, platform: item.platform, url: '', title: '', extractedAt: item.timestamp });
    setSummary(item.summary || null);
    setMode(item.mode);
    setView('main');
    setShowHistoryModal(false);
    setCurrentTimestamp(item.timestamp);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    chrome.storage.local.set({ theme: newTheme });
  };



  // TEMP: Disabled delete functionality - will add Edit mode later
  // const handleDeletePrompt = useCallback((index: number) => {
  //   setResult(prev => {
  //     if (!prev) return null;
  //     const updatedPrompts = prev.prompts.filter((_, i) => i !== index);
  //     return { ...prev, prompts: updatedPrompts };
  //   });
  // }, []);

  // Counts are calculated inline where needed

  return (
    <div className="app">
      <header className="m3-top-app-bar animate-fade-in">
        <div className="header-left">
          {(result || summary || view !== 'main') && (
            <button
              onClick={result || summary ? handleClearResult : () => setView('main')}
              className="icon-btn has-tooltip"
              title="Back"
            >
              <IconArrowLeft />
            </button>
          )}
        </div>

        <div className="mode-toggle-center">
          {(result || summary || loading || error) && (
            <ModeToggle mode={mode} onChange={setMode} />
          )}
        </div>

        <div className="header-right">
          {(result || summary) && (
            <button onClick={handleCopy} className="icon-btn has-tooltip" title="Copy All">
              {copied ? <IconCheck /> : <IconCopy />}
            </button>
          )}
        </div>
      </header>

      <main className="main">
        {view === 'main' && (
          <>
            <div
              className={`content-area animate-m3-fade-in ${(!result || (result && result.prompts.length === 0)) && !summary && !loading && !error ? 'is-empty' : ''}`}
              onScroll={handleScroll}
            >
              {error ? (
                <ErrorState error={error} onRetry={handleExtract} />
              ) : loading ? (
                <LoadingState message={loadingMessage} />
              ) : mode === 'summary' && summary ? (
                <SummaryCard summary={summary} />
              ) : result && result.prompts.length > 0 ? (
                <div className="result-view">
                  <PromptsList
                    prompts={result.prompts}
                    selectedPrompts={selectedPrompts}
                    onTogglePrompt={(idx) => {
                      const newSelected = new Set(selectedPrompts);
                      if (newSelected.has(idx)) {
                        newSelected.delete(idx);
                      } else {
                        newSelected.add(idx);
                      }
                      setSelectedPrompts(newSelected);
                    }}
                  />
                </div>
              ) : (
                <div className="empty-state-centered">
                  {/* Mode Toggle */}
                  <div className="empty-state-mode-toggle">
                    <button
                      onClick={() => setMode('raw')}
                      className={`empty-toggle-btn ${mode === 'raw' ? 'active' : ''}`}
                    >
                      Extract
                    </button>
                    <button
                      onClick={() => setMode('summary')}
                      className={`empty-toggle-btn ${mode === 'summary' ? 'active' : ''}`}
                    >
                      summarize
                    </button>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleExtract}
                    disabled={!status.supported || loading}
                    className="empty-state-generate-btn"
                  >
                    Generate
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* FOOTER AREA - Match Lo-Fi */}
      <div className="footer-area">
        {/* Large Primary Action */}
        {!error && !loading && (result || summary) && (
          <div className="action-zone">
            <button
              onClick={() => {
                if (result && lastExtractedContent && mode === 'raw') {
                  alert('🎯 Upgrade Feature!\n\nSummarize mode is available in the premium version.');
                  return;
                }
                handleExtract();
              }}
              disabled={!status.supported || loading}
              className="big-extract-btn"
            >
              <IconRefresh className={loading ? 'animate-spin' : ''} />
              <span>
                {result && lastExtractedContent && mode === 'raw'
                  ? 'Summarize'
                  : mode === 'summary'
                    ? (result ? 'Re-Generate' : 'Summarize')
                    : (result ? 'Re-Generate' : 'Generate')
                }
              </span>
            </button>
          </div>
        )}

        {/* Nav Dock */}
        <nav className="nav-dock">
          <div className="nav-group-left">
            <button
              className="large-profile-btn"
              onClick={() => { setShowProfileModal(!showProfileModal); setShowHistoryModal(false); setShowSettingsModal(false); }}
            >
              {user?.picture ? (
                <img src={user.picture} className="nav-avatar-large" alt="Profile" />
              ) : (
                <div className="nav-avatar-fallback"><IconUser /></div>
              )}
            </button>
            {user && (
              <div className="nav-user-info">
                <div className="nav-user-name">{user.name}</div>
                <div className={`nav-user-badge tier-${displayTier}`}>
                  {displayTier === 'guest' && 'Guest'}
                  {displayTier === 'free' && 'Free'}
                  {displayTier === 'go' && 'Go'}
                  {displayTier === 'pro' && 'Pro'}
                  {displayTier === 'infi' && 'Infi'}
                  {displayTier === 'admin' && 'Admin'}
                </div>
              </div>
            )}
          </div>

          <div className="nav-group-right">
            <button
              className={`nav-icon-btn ${showHistoryModal ? 'active' : ''}`}
              onClick={() => { setShowHistoryModal(!showHistoryModal); setShowSettingsModal(false); setShowProfileModal(false); }}
              title="History"
            >
              <IconHistory size={24} />
            </button>
            <button
              className={`nav-icon-btn ${showSettingsModal ? 'active' : ''}`}
              onClick={() => { setShowSettingsModal(!showSettingsModal); setShowHistoryModal(false); setShowProfileModal(false); }}
              title="Settings"
            >
              <IconSettings size={24} />
            </button>
          </div>
        </nav>
      </div>

      {/* Floating Popups */}

      {
        showProfileModal && (
          <div className="popup popup-left" ref={profileRef}>
            <div className="popup-header">
              <span className="popup-title">Profile</span>
            </div>
            <div className="popup-body">
              {user ? (
                <>
                  <div className="profile-info-horizontal">
                    <div className="profile-text">
                      <div className="profile-name">{user.name}</div>
                      <div className="profile-email">{user.email}</div>
                    </div>
                    <div className={`profile-tier-badge tier-${displayTier}`}>
                      {displayTier === 'free' && 'Free'}
                      {displayTier === 'go' && 'Go'}
                      {displayTier === 'pro' && 'Pro'}
                      {displayTier === 'infi' && 'Infi'}
                      {displayTier === 'admin' && 'Admin'}
                    </div>
                  </div>

                  {displayTier === 'free' && (
                    <button className="popup-btn upgrade">
                      Upgrade to Go
                    </button>
                  )}

                  {displayTier === 'go' && (
                    <button className="popup-btn upgrade">
                      Upgrade to Pro
                    </button>
                  )}

                  {displayTier === 'pro' && (
                    <button className="popup-btn upgrade">
                      Upgrade to Infi
                    </button>
                  )}

                  {displayTier === 'infi' && (
                    <div className="profile-perk">
                      ⚡ Priority Support
                    </div>
                  )}

                  {displayTier === 'admin' && (
                    <div className="profile-perk">
                      🔧 No Limits
                    </div>
                  )}

                  <button
                    onClick={() => { signOut(); setUser(null); setTier('guest'); setShowProfileModal(false); }}
                    className="popup-btn danger"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <div className="profile-info">
                    <div className={`profile-tier-badge tier-guest`}>
                      Guest
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setSigningIn(true);
                      try {
                        const u = await signInWithGoogle();
                        setUser(u);
                        setTier('free');
                        setShowProfileModal(false);
                      } catch (e) {
                        console.error(e);
                      } finally {
                        setSigningIn(false);
                      }
                    }}
                    className="popup-btn primary"
                    disabled={signingIn}
                  >
                    {signingIn ? (
                      <>
                        <span className="spinner"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <IconGoogle />
                        Sign in with Google
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )
      }

      {
        showHistoryModal && (
          <div className="popup popup-right popup-history" ref={historyRef}>
            <div className="popup-header">
              <div className="popup-title-group">
                <span className="popup-title">History</span>
                <button
                  className="popup-external-link"
                  onClick={() => chrome.tabs.create({ url: 'history.html' })}
                  title="Open full history"
                >
                  <IconExternalLink />
                </button>
              </div>
              {history.length > 0 && !confirmClear && (
                <button className="popup-clear" onClick={() => setConfirmClear(true)}>
                  Clear all
                </button>
              )}
              {confirmClear && (
                <div className="popup-confirm">
                  <button className="popup-confirm-btn danger" onClick={() => { setHistory([]); chrome.storage.local.remove('extractionHistory'); setConfirmClear(false); }}>
                    Yes, clear
                  </button>
                  <button className="popup-confirm-btn" onClick={() => setConfirmClear(false)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="popup-body popup-scroll">
              {history.length === 0 ? (
                <p className="popup-empty">No extractions yet</p>
              ) : (
                history.slice(0, 20).map(item => (
                  <button key={item.id} className="popup-history-item" onClick={() => { loadHistoryItem(item); setShowHistoryModal(false); }}>
                    <PlatformLogo platform={item.platform} />
                    <div className="popup-history-info">
                      <span className="popup-history-preview">{item.preview}</span>
                      <span className="popup-history-meta">
                        {item.mode === 'summary' ? 'Summary • ' : ''}
                        {item.promptCount} prompts
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )
      }

      {
        showSettingsModal && (
          <div className="popup popup-right" ref={settingsRef}>
            <div className="popup-header">
              <span className="popup-title">Settings</span>
            </div>
            <div className="popup-body">
              <div className="popup-setting">
                <span className="popup-setting-label">Theme</span>
                <select value={theme} onChange={e => handleThemeChange(e.target.value as Theme)} className="popup-select">
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              {/* Debug Tier Simulator - Only for Admin */}
              {tier === 'admin' && (
                <>
                  <div className="popup-divider" style={{ margin: '16px 0', borderTop: '1px solid var(--border-color)' }}></div>
                  <div className="popup-setting">
                    <span className="popup-setting-label" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                      🔧 Debug: Tier Simulator
                    </span>
                    <select
                      value={debugTierOverride || tier}
                      onChange={e => setDebugTierOverride(e.target.value as UserTier)}
                      className="popup-select"
                      style={{ borderColor: 'var(--accent-color)' }}
                    >
                      <option value="guest">Guest</option>
                      <option value="free">Free</option>
                      <option value="go">Go</option>
                      <option value="pro">Pro</option>
                      <option value="infi">Infi</option>
                      <option value="admin">Admin (Real)</option>
                    </select>
                  </div>
                  {debugTierOverride && debugTierOverride !== tier && (
                    <div style={{
                      padding: '8px 12px',
                      background: 'rgba(255, 152, 0, 0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginTop: '8px'
                    }}>
                      ⚠️ Simulating <strong>{debugTierOverride}</strong> tier for testing
                    </div>
                  )}
                  <div className="popup-divider" style={{ margin: '16px 0', borderTop: '1px solid var(--border-color)' }}></div>
                </>
              )}

              <div className="popup-setting">
                <span className="popup-setting-label">Version</span>
                <span className="popup-setting-value">3.0.2</span>
              </div>
              <button onClick={() => { setShowPulseCheck(true); setShowSettingsModal(false); }} className="popup-setting-link">
                <span className="popup-setting-label">Pulse Check</span>
                <IconExternalLink />
              </button>
            </div>
          </div>
        )
      }

      {
        showPulseCheck && (
          <PulseCheckModal onClose={() => setShowPulseCheck(false)} userEmail={user?.email} />
        )
      }




      {/* Copied Toast with exit animation */}
      <Toast visible={copied}>
        <IconCheck />
        <span>Copied to clipboard</span>
      </Toast>

      {/* UX Enhancement Modals */}
      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}

      {showKeyboardHints && (
        <KeyboardHints onClose={() => setShowKeyboardHints(false)} />
      )}

      {showSuccessCelebration && (
        <SuccessCelebration
          message={`🎉 Extracted ${result?.prompts.length || 0} prompts successfully!`}
          onClose={() => setShowSuccessCelebration(false)}
        />
      )}

      <style>{styles}</style>
    </div >
  );
}

// ═══════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════

// Toast component with enter/exit animations
// Toast component with enter/exit animations
function Toast({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // Small delay to trigger transition
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <div className={`toast ${isAnimating ? 'visible' : ''}`}>
      {children}
    </div>
  );
}

// NavItem component - kept for potential future use
// function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
//   return (
//     <button onClick={onClick} className={`nav-item ${active ? 'active' : ''}`}>
//       <div className="nav-icon">{icon}</div>
//       <span className="nav-label">{label}</span>
//       {!active && <div className="nav-tooltip">{label}</div>}
//     </button>
//   );
// }

function PromptsList({ prompts, selectedPrompts, onTogglePrompt }: {
  prompts: any[];
  selectedPrompts?: Set<number>;
  onTogglePrompt?: (index: number) => void;
}) {
  return (
    <div className="prompts-list animate-m3-fade-in">
      {prompts.map((p, idx) => (
        <PromptCard
          key={p.id || idx}
          index={idx + 1}
          prompt={p}
          isSelected={selectedPrompts?.has(idx)}
          onToggleSelect={onTogglePrompt ? () => onTogglePrompt(idx) : undefined}
        />
      ))}
    </div>
  );
}

function PromptCard({ index, prompt, isSelected, onToggleSelect }: {
  index: number;
  prompt: any;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}) {
  return (
    <div className="m3-card prompt-card animate-m3-slide-up">
      <div className="card-blueprint-index">{index}</div>

      {/* Checkbox in top-right */}
      {onToggleSelect && (
        <label className="prompt-checkbox-wrapper">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={onToggleSelect}
            className="prompt-checkbox"
          />
          <span className="checkbox-label">checkbox</span>
        </label>
      )}

      <div className="prompt-content">
        {prompt.content}
      </div>
    </div>
  );
}


function SummaryCard({ summary }: { summary: string }) {
  return (
    <div className="m3-card summary-card animate-fade-in">
      <div className="m3-card-header">
        <div className="platform-info">
          <IconSummary />
          <span className="m3-label-small">AI Summary</span>
        </div>
      </div>
      <div className="prompt-content" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
        {summary}
      </div>
    </div>
  );
}

// EmptyState component - replaced by EnhancedEmptyState
// function EmptyState({ supported, platform }: { supported: boolean; platform: string | null }) {
//   const platforms = [
//     { name: 'ChatGPT', url: 'https://chatgpt.com', logo: <LogoChatGPT /> },
//     { name: 'Claude', url: 'https://claude.ai', logo: <LogoClaude /> },
//     { name: 'Gemini', url: 'https://gemini.google.com', logo: <LogoGemini /> },
//     { name: 'Perplexity', url: 'https://perplexity.ai', logo: <LogoPerplexity /> },
//     { name: 'DeepSeek', url: 'https://chat.deepseek.com', logo: <LogoDeepseek /> },
//     { name: 'Lovable', url: 'https://lovable.dev', logo: <LogoLovable /> },
//     { name: 'Bolt', url: 'https://bolt.new', logo: <LogoBolt /> },
//     { name: 'Cursor', url: 'https://cursor.com', logo: <LogoCursor /> },
//     { name: 'Meta AI', url: 'https://meta.ai', logo: <LogoMetaAI /> },
//   ];
//
//   return (
//     <div className="empty-state animate-m3-fade-in">
//       <div className="m3-hero-icon">
//         <LogoGeneric size={64} />
//       </div>
//       <h1 className="m3-headline-medium">
//         {supported ? `Extract from ${platform}` : 'Extract your prompts'}
//       </h1>
//       <p className="m3-body-large text-secondary">
//         {supported
//           ? 'Captured conversations are saved to your local history automatically.'
//           : 'Open a chat platform to begin extracting and managing your prompts.'}
//       </p>
//
//       {!supported && (
//         <div className="m3-launchpad">
//           {platforms.map(p => (
//             <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="m3-launch-item">
//               <div className="m3-launch-logo">{p.logo}</div>
//               <span className="m3-label-medium">{p.name}</span>
//             </a>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


function LoadingState({ message }: { message: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Parse message to extract platform info
  const isPlatformDetected = message.toLowerCase().includes('extract') || message.toLowerCase().includes('consolidat');
  const platform = message.toLowerCase().includes('consolidat') ? 'AI' :
    window.location.href.includes('chatgpt') ? 'ChatGPT' :
      window.location.href.includes('claude') ? 'Claude' :
        window.location.href.includes('gemini') ? 'Gemini' : 'Platform';

  return (
    <div className="loading-state-modern animate-fade-in">
      {/* Platform Detection */}
      {isPlatformDetected && (
        <div className="platform-detected">
          <div className="platform-pulse"></div>
          <span className="platform-text">{platform} detected</span>
        </div>
      )}

      {/* Loading Spinner */}
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring spinner-ring-2"></div>
      </div>

      {/* Status Message */}
      <p className="loading-message">{message}</p>

      {/* Real-time Stats (if extracting) */}
      {message.toLowerCase().includes('extract') && (
        <div className="extraction-stats">
          <div className="stat-item">
            <span className="stat-value">--</span>
            <span className="stat-label">Prompts</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">--</span>
            <span className="stat-label">Characters</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{elapsed.toFixed(1)}s</span>
            <span className="stat-label">Elapsed</span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="modern-progress-bar">
        <div className="progress-fill"></div>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="error-state animate-fade-in">
      <div className="m3-error-container">
        <IconAlertCircle size={48} color="var(--error)" />
        <h2 className="m3-headline-small">Something went wrong</h2>
        <p className="m3-body-medium">{error}</p>
        <button onClick={onRetry} className="m3-button-filled mt-4">
          Try Again
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════

function PlatformLogo({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p.includes('chatgpt') || p.includes('openai')) return <LogoChatGPT />;
  if (p.includes('claude') || p.includes('anthropic')) return <LogoClaude />;
  if (p.includes('gemini') || p.includes('google')) return <LogoGemini />;
  if (p.includes('perplexity')) return <LogoPerplexity />;
  if (p.includes('deepseek')) return <LogoDeepseek />;
  if (p.includes('lovable')) return <LogoLovable />;
  if (p.includes('bolt')) return <LogoBolt />;
  if (p.includes('cursor')) return <LogoCursor />;
  if (p.includes('meta')) return <LogoMetaAI />;
  return <LogoGeneric />;
}

// ═══════════════════════════════════════════════════
// ICONS - Monochrome stroke style
// ═══════════════════════════════════════════════════

const IconArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const IconHistory = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v4l3 3" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const IconSettings = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// IconList - kept for potential future use
// const IconList = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="8" y1="6" x2="21" y2="6" />
//     <line x1="8" y1="12" x2="21" y2="12" />
//     <line x1="8" y1="18" x2="21" y2="18" />
//     <line x1="3" y1="6" x2="3.01" y2="6" />
//     <line x1="3" y1="12" x2="3.01" y2="12" />
//     <line x1="3" y1="18" x2="3.01" y2="18" />
//   </svg>
// );

const IconSummary = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);


const IconRefresh = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const IconCopy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);


const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconCheckAnimated = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--highlight)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="check-animated">
    <polyline points="20 6 9 17 4 12" strokeDasharray="24" strokeDashoffset="0" style={{ animation: 'checkmark 0.3s ease-out' }} />
  </svg>
);

// IconError - kept for potential future use
// const IconError = () => (
//   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="12" cy="12" r="10" />
//     <line x1="15" y1="9" x2="9" y2="15" />
//     <line x1="9" y1="9" x2="15" y2="15" />
//   </svg>
// );

const IconAlertCircle = ({ size = 48, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);


// TEMP: Disabled - will be used for Edit mode later
// const IconTrash = ({ size = 16 }: { size?: number }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="3 6 5 6 21 6" />
//     <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//     <line x1="10" y1="11" x2="10" y2="17" />
//     <line x1="14" y1="11" x2="14" y2="17" />
//   </svg>
// );

const IconGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// Platform Logos
const LogoChatGPT = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
  </svg>
);

const LogoClaude = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const LogoGemini = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const LogoPerplexity = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const LogoDeepseek = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const LogoLovable = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const LogoGeneric = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8M12 8v8" />
  </svg>
);

const LogoBolt = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const LogoCursor = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    <path d="M13 13l6 6" />
  </svg>
);

const LogoMetaAI = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12.5C12 12.5 11 10 10 10C8.5 10 7.5 11.5 7.5 12.5C7.5 13.5 8.5 15 10 15C11 15 12 12.5 12 12.5ZM12 12.5C12 12.5 13 10 14 10C15.5 10 16.5 11.5 16.5 12.5C16.5 13.5 15.5 15 14 15C13 15 12 12.5 12 12.5ZM24 12.5C24 16.5 21 21 16 21C13.5 21 12 19.5 12 19.5C12 19.5 10.5 21 8 21C3 21 0 16.5 0 12.5C0 8.5 3 4 8 4C11 4 12 5.5 12 5.5C12 5.5 13 4 16 4C21 4 24 8.5 24 12.5Z" />
  </svg>
);

const IconExternalLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

function PulseCheckModal({ onClose, userEmail }: { onClose: () => void; userEmail?: string }) {
  const [step, setStep] = useState<number>(1);
  const [sentiment, setSentiment] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [answers, setAnswers] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  // Use the provided Google Script URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzVYHShkNF4yPbMf5rGnVfLg2oLq9cZxMpa_GQ3jwPEVWl-TQyTSE8WTz7b7P_GuA4NAg/exec';

  const handleRating = (rating: string) => {
    let s: 'happy' | 'neutral' | 'sad' = 'neutral';
    if (rating === 'Game Changer' || rating === 'Useful') s = 'happy';
    if (rating === 'Not helpful') s = 'sad';

    setSentiment(s);
    setAnswers((prev: any) => ({ ...prev, rating }));
    setStep(2);
  };

  const handleAnswerChange = (key: string, value: any) => {
    setAnswers((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const payload = {
        type: 'pulse_check',
        timestamp: new Date().toLocaleString(),
        email: userEmail || 'anonymous',
        sentiment,
        ...answers
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });

      setStep(3);
    } catch (error) {
      console.error('Feedback error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="popup popup-center pulse-check-popup">
      <div className="popup-header">
        <span className="popup-title">Pulse Check</span>
        <button onClick={onClose} className="popup-close">×</button>
      </div>
      <div className="popup-body">
        {step === 1 && (
          <div className="pulse-step-1">
            <h3 className="pulse-question">How is your experience?</h3>
            <div className="sentiment-grid">
              <button onClick={() => handleRating('Game Changer')} className="sentiment-btn group">
                <span className="sentiment-emoji">🤩</span>
                <span className="sentiment-label">Game Changer</span>
              </button>
              <button onClick={() => handleRating('Useful')} className="sentiment-btn group">
                <span className="sentiment-emoji">🙂</span>
                <span className="sentiment-label">Useful</span>
              </button>
              <button onClick={() => handleRating('Okay')} className="sentiment-btn group">
                <span className="sentiment-emoji">😐</span>
                <span className="sentiment-label">Okay</span>
              </button>
              <button onClick={() => handleRating('Not helpful')} className="sentiment-btn group">
                <span className="sentiment-emoji">🙁</span>
                <span className="sentiment-label">Not helpful</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="pulse-step-2 animate-fade-in">
            {sentiment === 'happy' ? (
              <div className="pulse-form">
                <div className="form-group">
                  <label>Should I invest more time into this?</label>
                  <div className="toggle-group">
                    <button
                      className={`toggle-btn ${answers.investTime === true ? 'active' : ''}`}
                      onClick={() => handleAnswerChange('investTime', true)}
                    >Yes</button>
                    <button
                      className={`toggle-btn ${answers.investTime === false ? 'active' : ''}`}
                      onClick={() => handleAnswerChange('investTime', false)}
                    >No</button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Did you wish for this tool before?</label>
                  <div className="toggle-group">
                    <button
                      className={`toggle-btn ${answers.wishedBefore === true ? 'active' : ''}`}
                      onClick={() => handleAnswerChange('wishedBefore', true)}
                    >Yes</button>
                    <button
                      className={`toggle-btn ${answers.wishedBefore === false ? 'active' : ''}`}
                      onClick={() => handleAnswerChange('wishedBefore', false)}
                    >No</button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Share more thoughts? (Optional)</label>
                  <textarea
                    placeholder="What was your impression?"
                    rows={2}
                    onChange={(e) => handleAnswerChange('feedbackText', e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="pulse-form">
                <div className="form-group">
                  <label>What went wrong?</label>
                  <div className="options-list">
                    {['Buggy', 'Confusing', "Didn't solve problem"].map(opt => (
                      <button
                        key={opt}
                        className={`option-btn ${answers.whatWentWrong === opt ? 'active' : ''}`}
                        onClick={() => handleAnswerChange('whatWentWrong', opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>One thing to fix?</label>
                  <textarea
                    placeholder="Tell us what to improve..."
                    rows={2}
                    onChange={(e) => handleAnswerChange('feedbackText', e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              className="btn-primary pulse-submit"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Sending...' : 'Submit Feedback'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="pulse-success animate-fade-in">
            <div className="success-icon-wrapper">
              <IconCheckAnimated />
            </div>
            <h3>Thank You!</h3>
            <p>Your feedback helps us build better.</p>
            <button onClick={onClose} className="btn-secondary pulse-close">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
// STYLES - Minimal Clean Design
// ═══════════════════════════════════════════════════
const styles = `
  :root {
    --bg: #ffffff;
    --bg-secondary: #f8f9fa;
    --border: #e0e0e0;
    --text: #1a1a1a;
    --text-secondary: #666666;
    --primary: #0066cc;
    --primary-light: #e6f2ff;
    --success: #28a745;
    --error: #dc3545;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    background: var(--bg);
    /* Blueprint Background */
    background-image: radial-gradient(var(--border) 1px, transparent 1px);
    background-size: 20px 20px;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: var(--text);
    overflow: hidden;
  }

  /* HEADER - Match Lo-Fi */
  .m3-top-app-bar {
    display: grid;
    grid-template-columns: 80px 1fr 80px;
    align-items: center;
    padding: 8px 16px;
    background: var(--bg);
    border-bottom: 2px solid var(--border);
    flex-shrink: 0;
    z-index: 1000;
  }

  .header-left {
    display: flex;
    justify-content: flex-start;
  }

  .header-right {
    display: flex;
    justify-content: flex-end;
  }

  /* Segmented Mode Toggle */
  .mode-toggle-center {
    display: flex;
    justify-content: center;
  }

  /* MODE TOGGLE */
  .mode-toggle {
    display: flex;
    background: var(--bg-secondary);
    padding: 2px;
    border-radius: 6px;
    gap: 2px;
    border: 1px solid var(--border);
  }

  .toggle-btn {
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    background: transparent;
    color: var(--text-secondary);
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  }

  .toggle-btn.active {
    background: white;
    color: var(--primary);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  /* CONTENT AREA */
  .main {
    flex: 1;
    overflow-y: auto;
    position: relative;
    background: var(--bg-secondary);
  }

  .content-area {
    padding: 12px;
    max-width: 100%;
    margin: 0 auto;
  }

  /* Center content when empty */
  .content-area.is-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  /* Empty State Centered - Figma Lo-Fi Design */
  .empty-state-centered {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 40px 20px;
  }

  .empty-state-mode-toggle {
    display: flex;
    background: var(--bg-secondary);
    padding: 4px;
    border-radius: 8px;
    gap: 4px;
    border: 1px solid var(--border);
  }

  .empty-toggle-btn {
    padding: 8px 20px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    background: transparent;
    color: var(--text-secondary);
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
    min-width: 90px;
  }

  .empty-toggle-btn:hover {
    background: var(--bg);
    color: var(--text);
  }

  .empty-toggle-btn.active {
    background: var(--bg);
    color: var(--text);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .empty-state-generate-btn {
    padding: 12px 40px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
    min-width: 180px;
  }

  .empty-state-generate-btn:hover:not(:disabled) {
    background: var(--primary-light);
    border-color: var(--primary);
    color: var(--primary);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,102,204,0.2);
  }

  .empty-state-generate-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* PROMPTS LIST */
  .prompts-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 20px;
  }

  .m3-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px;
    position: relative;
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }

  .m3-card:hover {
    box-shadow: none;
    border: 0.5px solid var(--primary);
  }

  /* Prompt Checkbox - Top Right */
  .prompt-checkbox-wrapper {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    z-index: 10;
  }

  .prompt-checkbox {
    width: 16px;
    height: 16px;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background: var(--bg);
    transition: all 0.2s;
  }

  .prompt-checkbox:checked {
    background: var(--primary);
    border-color: var(--primary);
  }

  .prompt-checkbox:checked::after {
    content: '✓';
    display: block;
    text-align: center;
    color: white;
    font-size: 12px;
    line-height: 14px;
  }

  .checkbox-label {
    font-size: 11px;
    color: var(--text-secondary);
    user-select: none;
  }

  .card-blueprint-index {
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--text-secondary);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .m3-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    padding-left: 12px;
  }

  .platform-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-secondary);
  }

  .platform-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--primary);
  }

  .prompt-content {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 13px;
    line-height: 1.6;
    color: var(--text);
    white-space: pre-wrap;
    word-break: break-word;
    background: var(--bg-secondary);
    padding: 10px;
    border-radius: 6px;
    border: 1px solid var(--border);
    margin: 8px 0;
  }

  .m3-body-medium {
    font-size: 14px;
    line-height: 1.5;
    color: var(--text);
    word-wrap: break-word;
  }

  .prompt-delete-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    opacity: 0;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .prompt-delete-btn:hover {
    color: var(--error);
    background: var(--primary-light);
  }

  .m3-card:hover .prompt-delete-btn {
    opacity: 1;
  }

  /* RESULT VIEW */
  .result-view {
    position: relative;
  }

  .floating-actions {
    position: fixed;
    bottom: 90px;
    right: 20px;
    z-index: 50;
  }

  .m3-fab {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .m3-fab:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4);
  }

  .m3-fab.success {
    background: var(--success);
  }

  /* EMPTY STATE */
  .empty-state,
  .enhanced-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 20px;
    min-height: 300px;
  }

  .empty-hero,
  .m3-hero-icon {
    margin-bottom: 16px;
    color: var(--primary);
  }

  .hero-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .empty-hero h1,
  .m3-headline-medium {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text);
  }

  .empty-hero p,
  .m3-body-large {
    font-size: 14px;
    color: var(--text-secondary);
    max-width: 400px;
    margin: 0 auto;
  }

  /* PLATFORM GRID */
  .platform-grid,
  .m3-launchpad {
    margin-top: 24px;
    width: 100%;
    max-width: 500px;
  }

  .platforms-showcase,
  .m3-launchpad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .platform-card,
  .m3-launch-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    text-decoration: none;
    color: var(--text);
    font-size: 12px;
    transition: all 0.2s;
  }

  .platform-card:hover,
  .m3-launch-item:hover {
    border-color: var(--primary);
    background: var(--primary-light);
  }

  /* BUTTONS */
  .icon-btn {
    border: none;
    background: transparent;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .icon-btn:hover {
    background: var(--bg-secondary);
  }

  .m3-button-filled,
  .btn-primary {
    background: var(--primary);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: opacity 0.2s;
  }

  .m3-button-filled:hover,
  .btn-primary:hover {
    opacity: 0.9;
  }

  .m3-button-filled:disabled,
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .m3-button-text,
  .btn-secondary {
    background: transparent;
    color: var(--primary);
    border: 1px solid var(--border);
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .m3-button-text:hover,
  .btn-secondary:hover {
    background: var(--bg-secondary);
  }

  /* ACTION ZONE - Large Extract Button */
  .action-zone {
    padding: 12px 16px;
    background: var(--bg);
    border-top: 2px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .big-extract-btn {
    width: 100%;
    height: 52px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: none;
    border-bottom: 3px solid rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.1s;
  }

  .big-extract-btn:hover {
    filter: brightness(0.95);
  }

  .big-extract-btn:active {
    transform: translateY(2px);
    border-bottom-width: 1px;
  }

  /* NAV DOCK */
  .nav-dock {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 20px;
    background: var(--bg);
    border-top: 1px solid var(--border);
    height: 64px;
    flex-shrink: 0;
  }

  .nav-group-left {
    display: flex;
    align-items: center;
  }

  .nav-group-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .large-profile-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid var(--primary-light);
    overflow: hidden;
    padding: 0;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .large-profile-btn:hover {
    transform: scale(1.1);
  }

  .nav-icon-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 10px;
    border-radius: 12px;
    transition: all 0.2s;
  }

  .nav-icon-btn:hover, .nav-icon-btn.active {
    background: var(--primary-light);
    color: var(--primary);
  }

  .nav-avatar-large {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* LOADING STATE */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    min-height: 300px;
  }

  .m3-linear-progress {
    width: 200px;
    height: 4px;
    background: var(--bg-secondary);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 16px;
  }

  .m3-progress-bar {
    height: 100%;
    background: var(--primary);
    width: 50%;
    animation: progress 1.5s infinite ease-in-out;
  }

  @keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }

  /* MODERN LOADING STATE - Figma Lo-Fi Design */
  .loading-state-modern {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    min-height: 400px;
    gap: 24px;
  }

  .platform-detected {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--primary-light);
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    color: var(--primary);
    animation: slideDown 0.3s ease-out;
  }

  .platform-pulse {
    width: 8px;
    height: 8px;
    background: var(--primary);
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .loading-spinner {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }

  .spinner-ring-2 {
    border-top-color: var(--primary-light);
    animation-duration: 1.8s;
    animation-direction: reverse;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-message {
    font-size: 15px;
    font-weight: 500;
    color: var(--text);
    text-align: center;
    margin: 0;
  }

  .extraction-stats {
    display: flex;
    gap: 32px;
    padding: 20px;
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary);
    font-family: 'JetBrains Mono', monospace;
  }

  .stat-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .modern-progress-bar {
    width: 100%;
    max-width: 300px;
    height: 4px;
    background: var(--bg-secondary);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), var(--primary-light), var(--primary));
    background-size: 200% 100%;
    animation: progressFlow 1.5s ease-in-out infinite;
  }

  @keyframes progressFlow {
    0% { background-position: 0% 0%; }
    100% { background-position: 200% 0%; }
  }

  /* ERROR STATE */
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
    min-height: 300px;
  }

  .error-state h3 {
    font-size: 18px;
    margin-bottom: 8px;
    color: var(--error);
  }

  .error-state p {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 16px;
  }

  /* TOAST */
  .toast {
    position: fixed;
    bottom: 84px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    opacity: 0;
    transition: all 0.2s ease-in-out;
    pointer-events: none;
    z-index: 2000;
  }

  .toast.visible {
    opacity: 1;
  }

  /* SUCCESS CELEBRATION */
  .success-celebration {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
    pointer-events: none;
  }

  .celebration-content {
    background: var(--primary);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255,255,255,0.1);
  }

  .celebration-content p {
    margin: 0;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
  }

  .celebration-icon {
    font-size: 20px;
  }

  /* ANIMATIONS */
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-m3-fade-in,
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-m3-slide-up {
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* MODALS */
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .popup-content {
    background: var(--bg);
    border-radius: 12px;
    padding: 24px;
    max-width: 400px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
  }

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .popup-header h2 {
    font-size: 18px;
    font-weight: 600;
  }

  .popup-close {
    background: transparent;
    border: none;
    font-size: 24px;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }

  .popup-close:hover {
    background: var(--bg-secondary);
  }

  .popup-setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }

  .popup-setting-label {
    font-size: 14px;
    color: var(--text);
  }

  .popup-setting-value {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .popup-setting-link {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    color: var(--primary);
    font-size: 14px;
    font-weight: 500;
  }

  /* POPUP MODALS - Pure Functional Style */
  .popup {
    position: fixed;
    bottom: 84px;
    background: var(--bg);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    border: 1px solid var(--border);
    width: 280px;
    margin: 0 16px;
  }

  /* Specific Positioning */
  .popup-left {
    left: 0;
  }

  .popup-right {
    right: 0;
  }

  /* History needs to be wider */
  .popup-history {
    width: 320px;
  }

  @keyframes slideUpModal {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .popup {
    animation: slideUpModal 0.2s ease-out;
  }

  .popup-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }

  .popup-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .popup-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
  }

  .popup-external-link {
    background: transparent;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
  }

  .popup-external-link:hover {
    color: var(--primary);
  }

  .popup-clear {
    background: transparent;
    border: none;
    color: var(--error);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 4px 8px;
  }

  .popup-confirm {
    display: flex;
    gap: 8px;
  }

  .popup-confirm-btn {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }

  .popup-confirm-btn.danger {
    background: var(--error);
    color: white;
    border-color: var(--error);
  }

  .popup-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Profile Styles */
  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
  }

  .profile-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
  }

  .profile-email {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .profile-tier-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: fit-content;
    margin-top: 4px;
  }

  .tier-guest {
    background: #e0e0e0;
    color: #666;
  }

  .tier-free {
    background: #e3f2fd;
    color: #1976d2;
  }

  .tier-go {
    background: #e8f5e9;
    color: #388e3c;
  }

  .tier-pro {
    background: #fff3e0;
    color: #f57c00;
  }

  .tier-infi {
    background: #f3e5f5;
    color: #7b1fa2;
  }

  .tier-admin {
    background: #ffebee;
    color: #c62828;
  }

  .profile-perk {
    padding: 10px 12px;
    background: var(--bg-secondary);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text);
    text-align: center;
  }

  /* Profile Info Horizontal Layout (Modal) */
  .profile-info-horizontal {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .profile-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  .profile-info-horizontal .profile-tier-badge {
    margin-top: 0;
    flex-shrink: 0;
  }

  /* Nav User Info (Footer) */
  .nav-group-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav-user-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    justify-content: center;
  }

  .nav-user-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.2;
  }

  .nav-user-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: fit-content;
    line-height: 1.2;
  }

  .popup-btn {
    width: 100%;
    padding: 10px 16px;
    border-radius: 6px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.15s;
  }

  .popup-btn.primary {
    background: var(--primary);
    color: white;
  }

  .popup-btn.primary:hover {
    filter: brightness(0.95);
  }

  .popup-btn.upgrade {
    background: var(--primary);
    color: white;
  }

  .popup-btn.upgrade:hover {
    filter: brightness(0.95);
  }

  .popup-btn.danger {
    background: transparent;
    color: var(--error);
    border: 1px solid var(--border);
  }

  .popup-btn.danger:hover {
    background: var(--bg-secondary);
  }

  .popup-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .popup-scroll {
    overflow-y: auto;
  }

  .popup-empty {
    text-align: center;
    color: var(--text-secondary);
    padding: 40px 20px;
    font-size: 14px;
  }

  .popup-history-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: all 0.2s;
  }

  .popup-history-item:hover {
    border-color: var(--primary);
    background: var(--primary-light);
  }

  .popup-history-info {
    flex: 1;
    min-width: 0;
  }

  .popup-history-preview {
    display: block;
    font-size: 14px;
    color: var(--text);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .popup-history-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
    font-size: 12px;
    color: var(--text-secondary);
  }

  .popup-profile-section {
    margin-bottom: 20px;
  }

  .popup-profile-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .popup-profile-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .popup-profile-info h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 2px;
  }

  .popup-profile-info p {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .popup-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .popup-stat-card {
    background: var(--bg-secondary);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
  }

  .popup-stat-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary);
    display: block;
  }

  .popup-stat-label {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 4px;
  }

  /* RESPONSIVE */
  @media (max-width: 640px) {
    .platforms-showcase,
    .m3-launchpad {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* UTILITY */
  .text-secondary {
    color: var(--text-secondary);
  }

  .m3-label-small {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .m3-label-medium {
    font-size: 12px;
    font-weight: 500;
  }

  .m3-badge {
    padding: 4px 8px;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
  }
`;
