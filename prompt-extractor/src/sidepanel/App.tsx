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
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const [user, setUser] = useState<ChromeUser | null>(null);
  const [tier, setTier] = useState<UserTier>('guest');
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [quota, setQuota] = useState<{ used: number; limit: number } | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const portRef = useRef<chrome.runtime.Port | null>(null);
  const [animatedCount, setAnimatedCount] = useState({ prompts: 0, words: 0 });
  const [showStats, setShowStats] = useState(true);

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

  // Load history, theme, and quota
  useEffect(() => {
    chrome.storage.local.get(['extractionHistory', 'theme', 'quotaUsed', 'quotaLimit'], (data) => {
      if (data.extractionHistory) setHistory(data.extractionHistory);
      if (data.theme) setTheme(data.theme);
      if (data.quotaUsed !== undefined && data.quotaLimit !== undefined) {
        setQuota({ used: data.quotaUsed, limit: data.quotaLimit });
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
    console.log('[SahAI] handleExtract called, mode:', mode);

    // Reconnect with proper listeners if disconnected
    if (!portRef.current) {
      console.warn('[SahAI] Port not connected, reconnecting with listeners...');
      connectPort();
    }

    setLoading(true);
    setError(null);
    setDuration(null);
    startTimeRef.current = performance.now();
    setLoadingMessage('Extracting prompts...');

    console.log('[SahAI] Sending EXTRACT_PROMPTS message');
    portRef.current?.postMessage({ action: 'EXTRACT_PROMPTS', mode });

    // Safety timeout in case service worker or content script hangs
    setTimeout(() => {
      setLoading((currentLoading) => {
        if (currentLoading) {
          console.warn('[SahAI] Extraction timed out in sidepanel');
          setError('Request timed out. Please try again.');
          return false;
        }
        return currentLoading;
      });
    }, 8000);
  }, [mode, connectPort]);

  useEffect(() => {
    const handleTriggerExtract = () => handleExtract();
    window.addEventListener('trigger-extract', handleTriggerExtract);
    return () => window.removeEventListener('trigger-extract', handleTriggerExtract);
  }, [handleExtract]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const content = result.prompts.map((p, i) => `${i + 1}. ${p.content}`).join('\n\n');
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) chrome.tabs.sendMessage(tab.id, { action: 'CONTENT_COPIED', content });
  }, [result]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        if (status.supported && !loading) handleExtract();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && result && !window.getSelection()?.toString()) {
        e.preventDefault();
        handleCopy();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status.supported, loading, result, handleExtract, handleCopy]);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't close if clicking inside a popup or on a nav button
      if (target.closest('.popup') || target.closest('.bottom-nav')) return;

      if (showHistoryModal || showSettingsModal || showProfileModal || showPulseCheck) {
        setShowHistoryModal(false);
        setShowSettingsModal(false);
        setShowProfileModal(false);
        setShowPulseCheck(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showHistoryModal, showSettingsModal, showProfileModal]);


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

  const handleClearResult = useCallback(() => {
    console.log('[SahAI] Clearing result');
    setResult(null);
    setSummary(null);
    setError(null);
    setLastExtractionResult(null);
  }, []);

  const wordCount = result?.prompts.reduce((acc, p) => acc + p.content.split(/\s+/).length, 0) || 0;
  const promptCount = result?.prompts.length || 0;

  return (
    <div className="app">
      {/* Header - only show when needed */}
      {/* Header - always visible */}
      <header className="header">
        <div className="header-left">
          {view !== 'main' ? (
            <button onClick={() => setView('main')} className="icon-btn has-tooltip">
              <IconArrowLeft />
              <div className="tooltip-bottom">Back</div>
            </button>
          ) : result ? (
            <button onClick={handleClearResult} className="icon-btn has-tooltip">
              <IconArrowLeft />
              <div className="tooltip-bottom">Back</div>
            </button>
          ) : null}
        </div>

        {/* Mode Toggle in Header */}
        <div className="mode-toggle">
          <button
            onClick={() => setMode('raw')}
            className={`mode-btn ${mode === 'raw' ? 'active' : ''}`}
          >
            <IconList />
            <span>Extract</span>
          </button>
          <button
            onClick={() => setMode('summary')}
            className={`mode-btn ${mode === 'summary' ? 'active' : ''}`}
          >
            <IconSummary />
            <span>Summarize</span>
          </button>
        </div>

        <div className="header-right"></div>
      </header>

      {/* Main Content */}
      <main className="main">
        {view === 'main' && (
          <>

            {/* Content Area */}
            <div className="content-area" onScroll={handleScroll}>
              {error ? (
                <ErrorState error={error} onRetry={handleExtract} />
              ) : loading ? (
                <LoadingState message={loadingMessage} />
              ) : mode === 'summary' && summary ? (
                <SummaryCard summary={summary} />
              ) : result && result.prompts.length > 0 ? (
                <>
                  <div className="floating-actions">
                    <button
                      onClick={handleCopy}
                      className={`floating-copy-btn ${copied ? 'success' : ''}`}
                      title="Copy all prompts"
                    >
                      {copied ? <IconCheck /> : <IconCopy />}
                    </button>
                  </div>
                  <PromptsList prompts={result.prompts} />
                </>
              ) : (
                <EmptyState
                  supported={status.supported}
                  platform={status.platform}
                />
              )}
            </div>

            {/* Sticky Action Bar */}
            {!error && !loading && (
              <div className="action-bar-sticky">
                {/* Stats */}
                {(result || summary) && (
                  <div className={`stats-bar ${!showStats ? 'hidden' : ''}`} style={{ marginBottom: '12px', borderTop: 'none', padding: '0' }}>
                    <span className="stat-badge count-up" key={`p-${promptCount}`}>{animatedCount.prompts} prompts</span>
                    <span className="stat-badge count-up" key={`w-${wordCount}`}>{animatedCount.words} words</span>
                    {currentTimestamp ? (
                      <span className="stat-badge count-up">
                        {new Date(currentTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(currentTimestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    ) : duration !== null && (
                      <span className="stat-badge count-up">{duration.toFixed(1)}s</span>
                    )}
                    {quota && (
                      <span className={`stat-badge ${quota.used >= quota.limit ? 'warning' : ''}`}>
                        {quota.used}/{quota.limit} daily
                      </span>
                    )}
                  </div>
                )}

                <div className={`extract-btn-wrapper ${loading ? 'pulsing' : ''}`}>
                  <button
                    onClick={handleExtract}
                    disabled={!status.supported || loading}
                    className={`btn-primary ${loading ? 'loading' : ''}`}
                    style={{ marginBottom: 0 }}
                  >
                    <span>Generate</span>
                  </button>
                </div>

              </div>
            )}

          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className={`nav-profile ${showProfileModal ? 'active' : ''}`}
          onClick={() => { setShowProfileModal(!showProfileModal); setShowHistoryModal(false); setShowSettingsModal(false); setShowPulseCheck(false); }}
        >
          <div className="nav-profile-avatar">
            {user?.picture ? (
              <img src={user.picture} alt="" />
            ) : (
              <IconUser />
            )}
          </div>
          <div className="nav-profile-info">
            <span className="nav-profile-name">{user?.name?.split(' ')[0] || 'Guest'}</span>
            <span className="nav-profile-tier">{tier}</span>
          </div>
          {!showProfileModal && (
            <div className="nav-tooltip">Profile</div>
          )}
        </button>
        <div className="nav-right">
          <NavItem
            icon={<IconHistory />}
            label="History"
            active={showHistoryModal}
            onClick={() => { setShowHistoryModal(!showHistoryModal); setShowSettingsModal(false); setShowProfileModal(false); setShowPulseCheck(false); }}
          />
          <NavItem
            icon={<IconSettings />}
            label="Settings"
            active={showSettingsModal}
            onClick={() => { setShowSettingsModal(!showSettingsModal); setShowHistoryModal(false); setShowProfileModal(false); setShowPulseCheck(false); }}
          />
        </div>
      </nav>

      {/* Floating Popups */}

      {
        showProfileModal && (
          <div className="popup popup-left">
            <div className="popup-header">
              <span className="popup-title">Profile</span>
            </div>
            <div className="popup-body">
              {user ? (
                <>
                  <div className="popup-user">
                    <div className="popup-avatar">
                      {user.picture ? <img src={user.picture} alt="" /> : <IconUser />}
                    </div>
                    <div className="popup-user-info">
                      <span className="popup-user-name">{user.name}</span>
                      <span className="popup-user-email">{user.email}</span>
                    </div>
                  </div>
                  <button onClick={() => { signOut(); setUser(null); setTier('guest'); setShowProfileModal(false); }} className="popup-btn danger">
                    Sign out
                  </button>
                </>
              ) : (
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
              )}
            </div>
          </div>
        )
      }

      {
        showHistoryModal && (
          <div className="popup popup-right popup-history">
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
                        {item.promptCount} prompts • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.timestamp).toLocaleDateString()}
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
          <div className="popup popup-right">
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
              <div className="popup-setting">
                <span className="popup-setting-label">Version</span>
                <span className="popup-setting-value">1.0.0</span>
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

      <style>{styles}</style>
    </div >
  );
}

// ═══════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════

// Toast component with enter/exit animations
function Toast({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setIsExiting(false);
    } else if (shouldRender) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, 200); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [visible, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className={`toast ${isExiting ? 'toast-exit' : ''}`}>
      {children}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`nav-item ${active ? 'active' : ''}`}>
      <div className="nav-icon">{icon}</div>
      <span className="nav-label">{label}</span>
      {!active && <div className="nav-tooltip">{label}</div>}
    </button>
  );
}

function PromptsList({ prompts }: { prompts: ScrapedPrompt[] }) {
  return (
    <div className="prompts-list stagger-children">
      {prompts.map((prompt, index) => (
        <PromptCard key={index} prompt={prompt} index={index} />
      ))}
    </div>
  );
}

function PromptCard({ prompt, index }: { prompt: ScrapedPrompt; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = prompt.content.length > 200;
  const text = isLong && !expanded ? prompt.content.slice(0, 200) + '...' : prompt.content;

  return (
    <div className="prompt-card">
      <div className="prompt-index">{index + 1}</div>
      <div className="prompt-body">
        <p className="prompt-text">{text}</p>
        {isLong && (
          <button onClick={() => setExpanded(!expanded)} className="expand-btn">
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ summary }: { summary: string }) {
  return (
    <div className="summary-card animate-fade-in">
      <div className="summary-header">
        <IconSummary />
        <span>Summary</span>
      </div>
      <p className="summary-text">{summary}</p>
    </div>
  );
}

function EmptyState({ supported, platform }: { supported: boolean; platform: string | null }) {
  const platforms = [
    { name: 'ChatGPT', url: 'https://chatgpt.com', logo: <LogoChatGPT /> },
    { name: 'Claude', url: 'https://claude.ai', logo: <LogoClaude /> },
    { name: 'Gemini', url: 'https://gemini.google.com', logo: <LogoGemini /> },
    { name: 'Perplexity', url: 'https://perplexity.ai', logo: <LogoPerplexity /> },
    { name: 'DeepSeek', url: 'https://chat.deepseek.com', logo: <LogoDeepseek /> },
  ];

  return (
    <div className="empty-state">
      <div className="empty-icon">
        <IconList />
      </div>
      <h2>{supported ? `Ready to extract from ${platform}` : 'Open an AI platform to start'}</h2>
      <p className="empty-desc">
        {supported
          ? 'Click Generate to capture all prompts from this conversation.'
          : 'Navigate to one of the supported platforms below to begin extracting your prompts.'}
      </p>

      {!supported && (
        <div className="platform-launchpad">
          {platforms.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="platform-link">
              <div className="platform-link-logo">{p.logo}</div>
              <span>{p.name}</span>
            </a>
          ))}
        </div>
      )}

    </div>
  );
}

function LoadingState({ message }: { message?: string }) {
  return (
    <div className="loading-state">
      <div className="simple-spinner" />
      <span className="loading-text">{message || 'Processing...'}</span>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="error-state">
      <div className="error-icon">
        <IconError />
      </div>
      <h3 className="error-title">Something went wrong</h3>
      <p className="error-desc">{error}</p>
      <button onClick={onRetry} className="error-action">
        <IconRefresh />
        <span>Try again</span>
      </button>
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

const IconHistory = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconList = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const IconSummary = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);


const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const IconError = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

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

const LogoGeneric = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8M12 8v8" />
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
// STYLES - Monochrome Design System
// ═══════════════════════════════════════════════════

const styles = `
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: var(--font-sans);
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-light);
    background: var(--surface-primary);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .header-left, .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .logo-text {
    font-size: var(--text-lg);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .logo-text .highlight {
    color: var(--accent);
  }

  .icon-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .icon-btn:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
  }

  /* Avatar & User Menu */
  .user-menu-container {
    position: relative;
  }

  .avatar-btn {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-default);
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    background: var(--surface-secondary);
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-secondary);
  }

  .menu-backdrop {
    position: fixed;
    inset: 0;
    z-index: 40;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 240px;
    background: var(--surface-primary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    z-index: 50;
    animation: fadeInDown 0.15s var(--ease-out);
  }

  .menu-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
  }

  .menu-avatar {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-weight: 600;
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .menu-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .menu-user-info {
    display: flex;
    flex-direction: column;
  }

  .menu-name {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  .menu-email {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }

  .menu-divider {
    height: 1px;
    background: var(--border-light);
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    background: transparent;
    border: none;
    font-size: var(--text-sm);
    color: var(--text-primary);
    cursor: pointer;
    text-align: left;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .menu-item:hover {
    background: var(--surface-hover);
  }

  .menu-item svg {
    color: var(--text-tertiary);
  }

  /* Main */
  .main {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  /* Mode Toggle */
  .mode-toggle {
    display: inline-flex;
    padding: 3px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-lg);
  }

  .mode-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .mode-btn:hover {
    color: var(--text-secondary);
  }

  .mode-btn.active {
    background: var(--surface-primary);
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }

  .content-area {
    flex: 1;
    overflow: auto;
    padding: 12px 16px; /* Reduced top padding */
    position: relative;
  }

  /* Prompts */
  .prompts-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 16px;
  }

  .prompt-card {
    display: flex;
    gap: 12px;
    padding: 14px;
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .prompt-card:hover {
    border-color: var(--border-default);
  }

  .prompt-index {
    width: 22px;
    height: 22px;
    border-radius: var(--radius-full);
    background: var(--grey-900);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    flex-shrink: 0;
  }

  [data-theme="dark"] .prompt-index {
    background: var(--grey-100);
    color: var(--grey-900);
  }

  .prompt-body {
    flex: 1;
    min-width: 0;
  }

  .prompt-text {
    margin: 0;
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--text-primary);
    word-break: break-word;
  }

  .prompt-card.placeholder {
    border-style: dashed;
    background: transparent;
    opacity: 0.8;
  }

  .prompt-card.placeholder.opacity-50 {
    opacity: 0.6;
  }

  .placeholder-text {
    color: var(--text-secondary);
    font-style: italic;
  }

  .placeholder-line {
    height: 10px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-sm);
    margin-bottom: 8px;
  }

  .w-3\\/4 { width: 75%; }
  .w-1\\/2 { width: 50%; }

  .empty-state-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .expand-btn {
    margin-top: 8px;
    padding: 0;
    background: transparent;
    border: none;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--highlight);
    cursor: pointer;
  }

  .expand-btn:hover {
    text-decoration: underline;
  }

  /* Summary */
  .summary-card {
    padding: 16px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
  }

  .summary-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .summary-text {
    margin: 0;
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--text-primary);
    white-space: pre-wrap;
  }

  /* Stats Bar */
  .stats-bar {
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--border-light);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: auto;
    opacity: 1;
    overflow: hidden;
  }

  .stats-bar.hidden {
    height: 0;
    padding: 0;
    opacity: 0;
    border-top: none;
  }

  .stat-badge {
    padding: 4px 10px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--text-secondary);
  }

  .stat-badge.warning {
    background: var(--error-surface);
    color: var(--error);
  }

  /* Action Bar */
  .action-bar {
    padding: 16px;
    border-top: 1px solid var(--border-light);
    background: var(--surface-primary);
  }

  .btn-primary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--grey-900);
    color: var(--white);
    border: none;
    border-radius: var(--radius-full);
    font-size: var(--text-base);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
  }

  [data-theme="dark"] .btn-primary {
    background: var(--white);
    color: var(--grey-900);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-primary.loading {
    pointer-events: none;
  }

  .btn-spinner {
    position: relative;
    width: 18px;
    height: 18px;
  }

  .spinner-ring {
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .secondary-actions {
    display: flex;
    gap: 8px;
  }

  .btn-secondary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 14px;
    background: var(--surface-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-xl);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--surface-hover);
    border-color: var(--border-strong);
  }

  .btn-secondary:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .btn-secondary.success {
    border-color: var(--highlight);
    color: var(--highlight);
    background: var(--highlight-surface);
  }

  /* Bottom Navigation */
  .bottom-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px 8px;
    border-top: 1px solid var(--border-light);
    background: var(--surface-primary);
  }

  .nav-right {
    display: flex;
    gap: 4px;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    padding: 4px 10px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    transition: color var(--duration-fast) var(--ease-out);
    min-width: 0;
  }

  .nav-item:hover {
    color: var(--text-secondary);
  }

  .nav-item:active {
    transform: scale(0.95);
  }

  .nav-item.active {
    color: var(--text-primary);
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 500;
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.02em;
  }

  .nav-profile {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .nav-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, -8px);
    background: #000000;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: var(--radius-md);
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: all 0.2s var(--ease-out);
    z-index: 1000;
    box-shadow: var(--shadow-md);
  }

  .has-tooltip {
    position: relative;
  }

  .tooltip-bottom {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 8px);
    background: #000000;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: var(--radius-md);
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: all 0.2s var(--ease-out);
    z-index: 1000;
    box-shadow: var(--shadow-md);
  }

  [data-theme="dark"] .tooltip-bottom {
    background: #000000;
    color: #ffffff;
    border: 1px solid var(--grey-800);
  }

  .has-tooltip:hover .tooltip-bottom {
    opacity: 1;
    transform: translate(-50%, 4px);
  }

  [data-theme="dark"] .nav-tooltip {
    background: #000000;
    color: #ffffff;
    border: 1px solid var(--grey-800);
  }

  .nav-item:hover .nav-tooltip,
  .nav-profile:hover .nav-tooltip {
    opacity: 1;
    transform: translate(-50%, -4px);
  }

  /* Note: .nav-item is already defined above - adding position: relative here */
  .nav-item {
    position: relative;
  }

  .nav-profile:hover {
    background: var(--surface-hover);
  }

  .nav-profile:active {
    transform: scale(0.97);
  }

  .nav-profile.active {
    background: var(--surface-secondary);
  }

  .nav-profile-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-secondary);
    color: var(--text-muted);
  }

  .nav-profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .nav-profile-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .nav-profile-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-primary);
    line-height: 1.2;
  }

  .nav-profile-tier {
    font-size: 10px;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* Floating Popups */

  .popup {
    position: fixed;
    bottom: 80px;
    min-width: 180px;
    max-width: calc(100% - 32px);
    background: var(--surface-primary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 24px rgba(0,0,0,0.15);
    z-index: 100;
    animation: popupIn 0.15s ease-out;
    display: flex;
    flex-direction: column;
  }

  .popup-left {
    left: 16px;
  }

  .popup-right {
    right: 16px;
  }

  .popup-history {
    width: 280px;
  }

  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  @keyframes popupIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-light);
  }

  .popup-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .popup-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .popup-external-link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
  }

  .popup-external-link:hover {
    color: var(--text-primary);
    background: var(--surface-hover);
  }

  .popup-clear {
    font-size: var(--text-xs);
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
  }

  .popup-clear:hover {
    color: var(--accent);
  }

  .popup-confirm {
    display: flex;
    gap: 6px;
  }

  .popup-confirm-btn {
    padding: 4px 8px;
    font-size: var(--text-xs);
    border-radius: var(--radius-sm);
    border: none;
    cursor: pointer;
    background: var(--surface-secondary);
    color: var(--text-secondary);
  }

  .popup-confirm-btn.danger {
    background: #ef4444;
    color: white;
  }

  .popup-body {
    padding: 12px 16px;
  }

  .popup-scroll {
    overflow-y: auto;
    max-height: 260px;
  }

  .popup-empty {
    color: var(--text-muted);
    font-size: var(--text-sm);
    text-align: center;
    padding: 20px 0;
  }

  .popup-user {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .popup-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background: var(--surface-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }

  .popup-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .popup-user-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .popup-user-name {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  .popup-user-email {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .popup-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    min-height: 40px;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .popup-btn.primary {
    background: var(--surface-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-default);
  }

  .popup-btn.primary:hover {
    background: var(--surface-hover);
  }

  .popup-btn.primary:active {
    transform: scale(0.98);
    background: var(--surface-secondary);
  }

  .popup-btn.primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .popup-btn.danger {
    background: transparent;
    color: #ef4444;
  }

  .popup-btn.danger:hover {
    background: #fef2f2;
  }

  [data-theme="dark"] .popup-btn.danger:hover {
    background: #450a0a;
  }

  .popup-history-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 0;
    background: none;
    border: none;
    border-bottom: 1px solid var(--border-light);
    cursor: pointer;
    text-align: left;
  }

  .popup-history-item:last-child {
    border-bottom: none;
  }

  .popup-history-item:hover {
    background: var(--surface-hover);
    margin: 0 -16px;
    padding: 10px 16px;
    width: calc(100% + 32px);
  }

  .popup-history-item:active {
    background: var(--surface-secondary);
    transform: scale(0.98);
  }

  .popup-history-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .popup-history-preview {
    font-size: var(--text-sm);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .popup-history-meta {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .popup-setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
  }

  .popup-setting-label {
    font-size: var(--text-sm);
    color: var(--text-primary);
  }

  .popup-setting-value {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .popup-select {
    padding: 6px 10px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--text-primary);
    cursor: pointer;
  }

  /* Empty State */
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    text-align: center;
  }

  .empty-illustration {
    margin-bottom: 20px;
    color: var(--text-muted);
  }

  .empty-title {
    margin: 0 0 6px;
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .empty-desc {
    margin: 0 0 20px;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    max-width: 240px;
    line-height: var(--leading-relaxed);
  }

  .empty-action {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: var(--grey-900);
    color: var(--white);
    border: none;
    border-radius: var(--radius-xl);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  [data-theme="dark"] .empty-action {
    background: var(--white);
    color: var(--grey-900);
  }

  .empty-action:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  /* Loading State */
  .loading-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .simple-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--surface-tertiary);
    border-top-color: var(--text-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  /* Error State */
  .error-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    text-align: center;
  }

  .error-icon {
    width: 52px;
    height: 52px;
    border-radius: var(--radius-2xl);
    background: var(--error-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: var(--error);
  }

  .error-title {
    margin: 0 0 6px;
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .error-desc {
    margin: 0 0 20px;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    max-width: 240px;
    line-height: var(--leading-relaxed);
  }

  .error-action {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: var(--grey-900);
    color: var(--white);
    border: none;
    border-radius: var(--radius-xl);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
  }

  [data-theme="dark"] .error-action {
    background: var(--white);
    color: var(--grey-900);
  }

  /* History */
  .history-container {
    padding: 16px;
  }

  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .history-title {
    margin: 0;
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-primary);
  }

  .clear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--error);
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .clear-btn:hover {
    background: var(--error-surface);
  }

  .history-group {
    margin-bottom: 20px;
  }

  .history-date {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
    padding-left: 2px;
  }

  .history-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px;
    margin-bottom: 6px;
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    text-align: left;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .history-item:hover {
    border-color: var(--border-default);
    background: var(--surface-hover);
  }

  .history-badge {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--surface-tertiary);
    color: var(--text-secondary);
  }

  .history-content {
    flex: 1;
    min-width: 0;
  }

  .history-preview {
    display: block;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .history-meta {
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-top: 2px;
  }

  /* Settings */
  .settings-container {
    padding: 16px;
  }

  .settings-section {
    margin-bottom: 24px;
  }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 8px 2px;
  }

  .settings-card {
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .account-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
  }

  .account-avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: var(--text-tertiary);
  }

  .account-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .account-info {
    flex: 1;
    min-width: 0;
  }

  .account-name {
    display: block;
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
  }

  .account-email {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .tier-badge {
    padding: 4px 8px;
    background: var(--grey-900);
    color: var(--white);
    border-radius: var(--radius-sm);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.03em;
  }

  [data-theme="dark"] .tier-badge {
    background: var(--white);
    color: var(--grey-900);
  }

  .setting-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
  }

  .setting-icon {
    width: 20px;
    height: 20px;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .setting-content {
    flex: 1;
    min-width: 0;
  }

  .setting-title {
    display: block;
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
  }

  .setting-title .highlight {
    color: var(--accent);
  }

  .setting-subtitle {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-tertiary);
  }

  .setting-select {
    padding: 6px 10px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--text-primary);
    cursor: pointer;
  }

  .toast.success {
    border: 1px solid var(--highlight);
    color: var(--highlight);
    background: var(--highlight-surface);
  }

  /* Toast */
  .toast {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--grey-900);
    color: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    font-size: var(--text-sm);
    font-weight: 500;
    z-index: 100;
    animation: toastFadeInUp 0.2s var(--ease-out);
  }

  @keyframes toastFadeInUp {
    from {
      opacity: 0;
      transform: translate(-50%, 8px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  @keyframes toastFadeOutDown {
    from {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    to {
      opacity: 0;
      transform: translate(-50%, 8px);
    }
  }

  .toast-exit {
    animation: toastFadeOutDown 0.2s var(--ease-out) forwards;
  }

  [data-theme="dark"] .toast {
    background: var(--white);
    color: var(--grey-900);
  }

  /* Animated checkmark */
  .check-animated polyline {
    stroke-dasharray: 24;
    stroke-dashoffset: 0;
    animation: checkmark 0.3s ease-out;
  }

  @keyframes checkmark {
    from { stroke-dashoffset: 24; }
    to { stroke-dashoffset: 0; }
  }

  /* Nav Avatar */
  .nav-avatar {
    width: 20px;
    height: 20px;
    border-radius: var(--radius-full);
    object-fit: cover;
  }

  /* Profile View */
  .profile-container {
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 32px;
  }

  .profile-avatar {
    width: 72px;
    height: 72px;
    border-radius: var(--radius-full);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 16px;
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-secondary);
  }

  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-name {
    margin: 0 0 4px;
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-primary);
  }

  .profile-email {
    margin: 0 0 12px;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .profile-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .profile-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .profile-action-btn:hover {
    background: var(--surface-hover);
    border-color: var(--border-strong);
  }

  .profile-action-btn.upgrade {
    background: var(--grey-900);
    border-color: var(--grey-900);
    color: var(--white);
  }

  [data-theme="dark"] .profile-action-btn.upgrade {
    background: var(--white);
    border-color: var(--white);
    color: var(--grey-900);
  }

  .profile-action-btn.signout {
    color: var(--error);
  }

  .profile-action-btn.signout:hover {
    background: var(--error-surface);
  }

  .profile-guest {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 16px;
  }

  .profile-guest-icon {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-full);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    color: var(--text-muted);
  }

  .profile-guest-title {
    margin: 0 0 8px;
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .profile-guest-desc {
    margin: 0 0 24px;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    max-width: 240px;
    line-height: var(--leading-relaxed);
  }

  .profile-signin-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    background: var(--surface-primary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-xl);
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .profile-signin-btn:hover {
    background: var(--surface-hover);
    border-color: var(--border-strong);
  }

  .profile-signin-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .profile-signin-btn.loading {
    background: var(--surface-secondary);
  }

  .profile-signin-btn.success {
    background: #10b981;
    border-color: #10b981;
    color: white;
  }

  .profile-signin-btn.error {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-default);
    border-top-color: var(--accent, var(--highlight));
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .login-error {
    margin-bottom: 12px;
    padding: 10px 14px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: var(--radius-md);
    color: #dc2626;
    font-size: var(--text-sm);
    text-align: center;
  }

  [data-theme="dark"] .login-error {
    background: #450a0a;
    border-color: #7f1d1d;
    color: #fca5a5;
  }

  /* Extract Button Pulse Rings */
  .extract-btn-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
  }

  .extract-btn-wrapper .btn-primary {
    margin-bottom: 0;
  }

  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border: 2px solid var(--grey-400);
    border-radius: var(--radius-xl);
    transform: translate(-50%, -50%);
    opacity: 0;
    pointer-events: none;
  }

  .extract-btn-wrapper.pulsing .pulse-ring {
    animation: pulseRing 2s ease-out infinite;
  }

  .pulse-ring.pulse-1 { animation-delay: 0s; }
  .pulse-ring.pulse-2 { animation-delay: 0.4s; }
  .pulse-ring.pulse-3 { animation-delay: 0.8s; }

  @keyframes pulseRing {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.15);
      opacity: 0;
    }
  }

  /* Sparkles */
  .sparkles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sparkle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--grey-400);
    border-radius: 50%;
    animation: sparkleAnim 0.8s ease-out forwards;
  }

  .sparkle.s1 { top: 30%; left: 35%; animation-delay: 0s; }
  .sparkle.s2 { top: 25%; left: 55%; animation-delay: 0.1s; }
  .sparkle.s3 { top: 40%; left: 65%; animation-delay: 0.15s; }
  .sparkle.s4 { top: 55%; left: 60%; animation-delay: 0.2s; }
  .sparkle.s5 { top: 60%; left: 40%; animation-delay: 0.1s; }
  .sparkle.s6 { top: 45%; left: 30%; animation-delay: 0.05s; }

  @keyframes sparkleAnim {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: scale(1.5) rotate(180deg);
      opacity: 1;
    }
    100% {
      transform: scale(0) rotate(360deg) translateY(-30px);
      opacity: 0;
    }
  }

  /* Platform Logo in History */
  .history-platform {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--text-secondary);
  }

  .history-content-top {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .history-mode-tag {
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    flex-shrink: 0;
  }

  .history-mode-tag.raw {
    background: var(--surface-tertiary);
    color: var(--text-secondary);
  }

  .history-mode-tag.summary {
    background: var(--highlight-surface);
    color: var(--highlight);
  }

  /* Pulse Check Styles */
  .pulse-check-popup {
    width: 320px;
  }
  
  .pulse-question {
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text-primary);
  }
  
  .sentiment-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .sentiment-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    background: var(--surface-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .sentiment-btn:hover {
    background: var(--surface-tertiary);
    border-color: var(--text-primary);
    transform: translateY(-1px);
  }
  
  .sentiment-emoji {
    font-size: 24px;
    margin-bottom: 4px;
    transition: transform 0.2s;
  }
  
  .sentiment-btn:hover .sentiment-emoji {
    transform: scale(1.1);
  }
  
  .sentiment-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
  }
  
  .sentiment-btn:hover .sentiment-label {
    color: var(--text-primary);
  }
  
  .pulse-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .form-group label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--text-primary);
  }
  
  .toggle-group {
    display: flex;
    gap: 8px;
  }
  
  .toggle-btn {
    flex: 1;
    padding: 6px;
    font-size: 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-sm);
    background: var(--surface-primary);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .toggle-btn:hover {
    background: var(--surface-secondary);
  }
  
  .toggle-btn.active {
    background: var(--text-primary);
    color: var(--surface-primary);
    border-color: var(--text-primary);
  }
  
  .options-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .option-btn {
    text-align: left;
    padding: 8px 12px;
    font-size: 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-sm);
    background: var(--surface-primary);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .option-btn:hover {
    background: var(--surface-secondary);
  }
  
  .option-btn.active {
    background: var(--surface-secondary);
    border-color: var(--text-primary);
    color: var(--text-primary);
    font-weight: 500;
  }
  
  .pulse-form textarea {
    width: 100%;
    padding: 8px;
    font-size: 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-sm);
    background: var(--surface-secondary);
    color: var(--text-primary);
    resize: none;
    outline: none;
  }
  
  .pulse-form textarea:focus {
    border-color: var(--text-primary);
    background: var(--surface-primary);
  }
  
  .pulse-submit {
    width: 100%;
    margin-top: 8px;
  }
  
  .pulse-success {
    text-align: center;
    padding: 20px 0;
  }
  
  .success-icon-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
    color: var(--success);
  }
  
  .pulse-success h3 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .pulse-success p {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }
  
  .pulse-close {
    width: 100%;
  }

  /* Floating Actions */
  .floating-actions {
    position: sticky;
    top: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    height: 0; /* Don't take up space */
    z-index: 100;
    pointer-events: none;
  }

  .floating-copy-btn {
    pointer-events: auto;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: var(--shadow-md);
    transition: all 0.2s;
    margin-top: 4px; /* Slight offset from top */
  }

  .floating-copy-btn:hover {
    border-color: var(--text-primary);
    color: var(--text-primary);
    transform: scale(1.05);
  }

  .floating-copy-btn.success {
    background: var(--highlight);
    border-color: var(--highlight);
    color: var(--white);
  }

  /* Platform Launchpad */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 40px 20px;
  }

  .empty-icon {
    width: 64px;
    height: 64px;
    background: var(--surface-secondary);
    border-radius: var(--radius-2xl);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-tertiary);
    margin-bottom: 20px;
  }

  .empty-state h2 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .empty-desc {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 32px;
    max-width: 280px;
  }

  .platform-launchpad {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;
    max-width: 320px;
  }

  .platform-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-xl);
    text-decoration: none;
    color: var(--text-primary);
    transition: all 0.2s;
  }

  .platform-link:hover {
    border-color: var(--text-primary);
    background: var(--surface-hover);
    transform: translateY(-2px);
  }

  .platform-link-logo {
    color: var(--text-secondary);
  }

  .platform-link span {
    font-size: 12px;
    font-weight: 600;
  }

  .empty-action {
    margin-top: 20px;
  }

  /* Sticky Action Bar */
  .action-bar-sticky {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background: linear-gradient(to top, var(--bg-primary) 80%, transparent);
    z-index: 100;
  }
`;
