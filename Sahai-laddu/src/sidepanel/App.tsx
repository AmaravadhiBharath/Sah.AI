import { useState, useEffect, useCallback, useRef } from 'react';
import type { ExtractionResult, Mode, ScrapedPrompt } from '../types';
import {
  initializeAuth,
  signInWithGoogle,
  signOut,
  subscribeToAuthChanges,
  type ChromeUser,
  type UserTier,
} from '../services/auth';
import '../styles/adobe-theme.css';

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
}

type Theme = 'system' | 'dark' | 'light';
type View = 'main' | 'history' | 'settings';

export default function App() {
  const [view, setView] = useState<View>('main');
  const [mode, setMode] = useState<Mode>('raw');
  const [theme, setTheme] = useState<Theme>('system');
  const [status, setStatus] = useState<StatusInfo>({ supported: false, platform: null });
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [user, setUser] = useState<ChromeUser | null>(null);
  const [tier, setTier] = useState<UserTier>('guest');
  const [authLoading, setAuthLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const portRef = useRef<chrome.runtime.Port | null>(null);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'light') root.classList.add('light');
    else if (theme === 'dark') root.classList.add('dark');
    // 'system' is handled by media query in CSS
  }, [theme]);

  // Load history and theme
  useEffect(() => {
    chrome.storage.local.get(['extractionHistory', 'theme'], (data) => {
      if (data.extractionHistory) setHistory(data.extractionHistory);
      if (data.theme) setTheme(data.theme);
    });
  }, []);

  // Initialize auth
  useEffect(() => {
    initializeAuth().then((state) => {
      setUser(state.user);
      setTier(state.tier);
      setAuthLoading(false);
    });
    const unsubscribe = subscribeToAuthChanges((newUser) => {
      setUser(newUser);
      setTier(newUser ? 'free' : 'guest');
    });
    return unsubscribe;
  }, []);

  // Connect to service worker
  useEffect(() => {
    const port = chrome.runtime.connect({ name: 'sidepanel' });
    portRef.current = port;

    port.onMessage.addListener((message) => {
      if (message.action === 'EXTRACTION_RESULT' || message.action === 'EXTRACTION_FROM_PAGE_RESULT') {
        const extractMode = message.mode || mode;
        if (message.mode) setMode(message.mode);
        handleExtractionResult(message.result, extractMode);
      } else if (message.action === 'STATUS_RESULT') {
        setStatus({ supported: message.supported, platform: message.platform });
      }
    });

    port.postMessage({ action: 'GET_STATUS' });
    return () => port.disconnect();
  }, [mode]);

  const handleExtractionResult = useCallback((extractionResult: ExtractionResult, _extractMode: Mode) => {
    setResult(extractionResult);
    setLoading(false);
    setView('main');
  }, []);

  const handleExtract = useCallback(() => {
    setLoading(true);
    portRef.current?.postMessage({ action: 'EXTRACT_PROMPTS', mode });
  }, [mode]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const content = result.prompts.map((p, i) => `${i + 1}. ${p.content}`).join('\n\n');
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) chrome.tabs.sendMessage(tab.id, { action: 'CONTENT_COPIED', content });
  }, [result]);

  const handleSave = useCallback(() => {
    if (!result) return;

    const preview = result.prompts[0]?.content.slice(0, 50) || 'No prompts';
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      platform: result.platform,
      promptCount: result.prompts.length,
      mode,
      timestamp: Date.now(),
      prompts: result.prompts,
      preview,
    };

    setHistory(prev => {
      const updated = [historyItem, ...prev].slice(0, 50);
      chrome.storage.local.set({ extractionHistory: updated });
      return updated;
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [result, mode]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const content = result.prompts.map((p, i) => `${i + 1}. ${p.content}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompts-${result.platform}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  }, [result]);

  const loadHistoryItem = (item: HistoryItem) => {
    setResult({ platform: item.platform, url: '', title: '', prompts: item.prompts, extractedAt: item.timestamp });
    setMode(item.mode);
    setView('main');
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    chrome.storage.local.set({ theme: newTheme });
  };

  const wordCount = result?.prompts.reduce((acc, p) => acc + p.content.split(/\s+/).length, 0) || 0;
  const promptCount = result?.prompts.length || 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* ══════════ HEADER ══════════ */}
      <Header
        user={user}
        tier={tier}
        authLoading={authLoading}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        onSignIn={() => signInWithGoogle().then(u => { setUser(u); setTier('free'); })}
        onSignOut={() => { signOut(); setUser(null); setTier('guest'); setShowMenu(false); }}
        view={view}
        onBack={() => setView('main')}
      />

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className="flex-1 overflow-hidden flex flex-col">

        {view === 'main' && (
          <>
            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              {result && result.prompts.length > 0 ? (
                <div className="results-card">
                  {result.prompts.map((prompt, index) => (
                    <PromptItem key={index} prompt={prompt} index={index} isLast={index === result.prompts.length - 1} />
                  ))}
                </div>
              ) : loading ? (
                <LoadingState mode={mode} />
              ) : (
                <EmptyState
                  supported={status.supported}
                  platform={status.platform}
                  onExtract={handleExtract}
                  mode={mode}
                />
              )}
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
              <div className="stats">
                <div className="stats-dot" style={{ background: mode === 'raw' ? 'var(--accent-primary)' : 'var(--success)' }}></div>
                <span>{mode === 'raw' ? 'EXTRACT' : 'SUMMARIZE'}</span>
                <span>•</span>
                <span>{promptCount} Prompts</span>
                <span>•</span>
                <span>{wordCount}w</span>
              </div>
              <button onClick={() => setView('settings')} className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                <SettingsIcon />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="p-3 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)]">
              <button
                onClick={handleExtract}
                disabled={!status.supported || loading}
                className="btn-primary mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'PROCESSING...' : 'REGENERATE'}
              </button>
              <div className="button-group">
                <button onClick={handleCopy} disabled={!result} className="btn-secondary">
                  {copied ? 'COPIED' : 'COPY'}
                </button>
                <button onClick={handleSave} disabled={!result} className="btn-secondary">
                  {saved ? 'SAVED' : 'SAVE'}
                </button>
                <button onClick={handleDownload} disabled={!result} className="btn-secondary">
                  {downloaded ? 'DONE' : 'DOWNLOAD'}
                </button>
              </div>
            </div>
          </>
        )}

        {view === 'history' && (
          <HistoryView
            history={history}
            onSelect={loadHistoryItem}
            onClear={() => { setHistory([]); chrome.storage.local.remove('extractionHistory'); }}
          />
        )}

        {view === 'settings' && (
          <SettingsView mode={mode} setMode={setMode} theme={theme} setTheme={handleThemeChange} />
        )}
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <div className="footer">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button onClick={() => setView('main')} className={`p-1 transition-colors ${view === 'main' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            </button>
            <button onClick={() => setView('history')} className={`p-1 transition-colors ${view === 'history' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}>
              <HistoryIcon />
            </button>
            <button onClick={() => setView('settings')} className={`p-1 transition-colors ${view === 'settings' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}>
              <SettingsIcon />
            </button>
          </div>
          {tier !== 'pro' && (
            <button onClick={() => window.open('https://superextension.in/pricing', '_blank')} className="badge-pro">
              ↑ PRO
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {(copied || saved || downloaded) && (
        <div className="fixed bottom-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded shadow-lg text-xs animate-in fade-in slide-in-from-bottom-2">
          {copied ? 'Copied to clipboard' : saved ? 'Saved to history' : 'File downloaded'}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════

function Header({ user, tier, authLoading, showMenu, setShowMenu, onSignIn, onSignOut, view, onBack }: any) {
  return (
    <div className="header">
      <div className="header-title">
        {view !== 'main' && (
          <button onClick={onBack} className="btn-back mr-2">
            <BackIcon />
          </button>
        )}
        <span>{view !== 'main' && view.toUpperCase()}</span>
      </div>
      <div className="flex items-center gap-2 relative">
        {!authLoading && (
          <>
            {tier !== 'guest' && (
              <span className="badge-pro !bg-[var(--accent-primary)] !text-white">
                {tier.toUpperCase()}
              </span>
            )}
            <span className="text-xs text-[var(--text-secondary)] truncate max-w-[80px]">
              {user?.name || 'Guest'}
            </span>
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
              <MenuIcon />
            </button>
          </>
        )}
        {showMenu && (
          <>
            <div className="fixed inset-0 z-50" onClick={() => setShowMenu(false)} />
            <div className="absolute top-full right-0 mt-1 min-w-[160px] bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded shadow-xl z-[100] overflow-hidden animate-in zoom-in-95 duration-150">
              {user ? (
                <>
                  <div className="p-3 border-b border-[var(--border-subtle)]">
                    <div className="text-xs font-bold truncate">{user.name}</div>
                    <div className="text-[10px] text-[var(--text-tertiary)] truncate">{user.email}</div>
                  </div>
                  {tier !== 'pro' && <MenuItem onClick={() => window.open('https://superextension.in/pricing', '_blank')}>UPGRADE TO PRO</MenuItem>}
                  <MenuItem onClick={onSignOut}>LOGOUT</MenuItem>
                </>
              ) : (
                <MenuItem onClick={onSignIn}>LOGIN</MenuItem>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MenuItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="w-full p-3 text-left text-[11px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors">
      {children}
    </button>
  );
}

function PromptItem({ prompt, index }: { prompt: ScrapedPrompt; index: number; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = prompt.content.length > 200;
  const text = isLong && !expanded ? prompt.content.slice(0, 200) + '...' : prompt.content;

  return (
    <div className="prompt-item">
      <div className="flex gap-3">
        <span className="text-xs font-bold text-[var(--text-tertiary)] opacity-50">{index + 1}.</span>
        <div className="flex-1">
          <p className="m-0 text-sm leading-relaxed">{text}</p>
          {isLong && (
            <button onClick={() => setExpanded(!expanded)} className="mt-1 p-0 bg-none border-none text-[11px] font-bold text-[var(--accent-primary)] hover:underline cursor-pointer">
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ supported, onExtract }: { supported: boolean; platform: string | null; onExtract: () => void; mode: Mode }) {
  return (
    <div className="error h-full flex flex-col items-center justify-center">
      <div className="error-icon">⚠️</div>
      <div className="error-title">
        {supported ? 'NO PROMPTS FOUND' : 'UNSUPPORTED PAGE'}
      </div>
      <div className="error-message max-w-[240px] mx-auto">
        {supported
          ? 'This conversation is empty or hasn\'t started yet.'
          : 'Navigate to ChatGPT, Claude, Gemini, or another supported platform.'}
      </div>
      <div className="flex gap-2">
        {supported && (
          <button onClick={onExtract} className="btn-secondary !flex-none px-6">
            RETRY
          </button>
        )}
        <button onClick={() => window.open('https://superextension.in/help', '_blank')} className="btn-secondary !flex-none px-6">
          HELP
        </button>
      </div>
    </div>
  );
}

function LoadingState({ mode }: { mode: Mode }) {
  return (
    <div className="loading h-full">
      <div className="spinner mb-4"></div>
      <span className="text-sm font-medium">
        {mode === 'raw' ? 'Extracting prompts...' : 'Summarizing...'}
      </span>
    </div>
  );
}

function HistoryView({ history, onSelect, onClear }: { history: HistoryItem[]; onSelect: (item: HistoryItem) => void; onClear: () => void }) {
  const grouped = groupByDate(history);

  return (
    <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
      {history.length > 0 ? (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{date}</span>
              {date === 'TODAY' && (
                <button onClick={onClear} className="text-[10px] font-bold text-[var(--error)] hover:underline uppercase tracking-widest">
                  Clear All
                </button>
              )}
            </div>
            {items.map(item => (
              <button key={item.id} onClick={() => onSelect(item)} className="w-full flex items-start gap-3 p-3 mb-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded hover:border-[var(--accent-primary)] transition-all text-left">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: item.mode === 'raw' ? 'var(--accent-primary)' : 'var(--success)' }}></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase mb-1">
                    {item.mode === 'raw' ? 'EXTRACT' : 'SUMMARIZE'} • {item.platform}
                  </div>
                  <div className="text-sm font-medium truncate mb-1">
                    {item.preview}...
                  </div>
                  <div className="text-[10px] text-[var(--text-tertiary)]">
                    {item.promptCount} Prompts • {formatTime(item.timestamp)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-[var(--text-tertiary)]">
          <HistoryIcon />
          <span className="mt-2 text-xs font-medium uppercase tracking-widest">No history yet</span>
        </div>
      )}
    </div>
  );
}

function SettingsView({ mode, setMode, theme, setTheme }: { mode: Mode; setMode: (m: Mode) => void; theme: Theme; setTheme: (t: Theme) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      <Section title="THEME">
        <div className="grid grid-cols-3 gap-2">
          {['system', 'dark', 'light'].map(t => (
            <button
              key={t}
              onClick={() => setTheme(t as Theme)}
              className={`py-2 rounded border text-[10px] font-bold uppercase tracking-wider transition-all ${theme === t ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)]'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </Section>
      <Section title="OUTPUT MODE">
        <Radio selected={mode === 'raw'} onClick={() => setMode('raw')} label="Extract (raw prompts)" />
        <Radio selected={mode === 'summary'} onClick={() => setMode('summary')} label="Summarize (consolidated)" />
      </Section>
      <Section title="OUTPUT FORMAT">
        <Radio selected={true} onClick={() => { }} label="Numbered (1. 2. 3...)" />
        <Radio selected={false} onClick={() => { }} label="Separators (---)" />
        <Radio selected={false} onClick={() => { }} label="Bullets (• • •)" />
      </Section>
      <Section title="PREFERENCES">
        <Checkbox checked={true} label="Show word count" />
        <Checkbox checked={false} label="Auto-copy to clipboard" />
      </Section>
      <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] text-center">
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-3">{title}</div>
      {children}
    </div>
  );
}

function Radio({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 w-full py-2 text-left group">
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? 'border-[var(--accent-primary)]' : 'border-[var(--border-subtle)] group-hover:border-[var(--text-tertiary)]'}`}>
        {selected && <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />}
      </div>
      <span className={`text-sm transition-colors ${selected ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)]'}`}>{label}</span>
    </button>
  );
}

function Checkbox({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${checked ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]' : 'border-[var(--border-subtle)]'}`}>
        {checked && <span className="text-[10px] text-white font-bold">✓</span>}
      </div>
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
    </div>
  );
}

// Helpers
function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function groupByDate(items: HistoryItem[]): Record<string, HistoryItem[]> {
  const groups: Record<string, HistoryItem[]> = {};
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  items.forEach(item => {
    const date = new Date(item.timestamp).toDateString();
    const label = date === today ? 'TODAY' : date === yesterday ? 'YESTERDAY' : new Date(item.timestamp).toLocaleDateString();
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });
  return groups;
}

// Icons (compact)
const BackIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>;
const MenuIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>;
const SettingsIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>;
const HistoryIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
