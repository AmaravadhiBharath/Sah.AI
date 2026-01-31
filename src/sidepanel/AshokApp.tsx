import { useState, useEffect, useRef } from 'react';
import type { ExtractionResult, Mode, HistoryItem } from '../types';
import {
    initializeAuth,
    signInWithGoogle,
    signOut,
    subscribeToAuthChanges,
    type ChromeUser,
    getUserTier,
} from '../services/auth';
import {
    saveHistoryToCloud,
    getHistoryFromCloud,
    mergeHistory,
    type CloudHistoryItem,
} from '../services/firebase';
import {
    LoadingState,
    ErrorState,
    Toast,
    ConfirmDialog,
    Tooltip,
    SelectionToolbar,
    PromptCountHeader,
} from './AshokComponents';
import './ashok-design.css';

// ═══════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════

const IconHome = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);


const IconUser = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

interface StatusInfo {
    supported: boolean;
    platform: string | null;
}

type ThemeMode = 'system' | 'light' | 'dark';

const APP_VERSION = '3.2.2';
const SUPPORT_URL = 'https://sahai.app/support';

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════

interface HistoryViewProps {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    currentPlatform: string | null;
}

const HistoryView = ({ history, onSelect, currentPlatform }: HistoryViewProps) => {
    const [filterPlatform, setFilterPlatform] = useState<'all' | 'current'>('all');
    const [filterTime, setFilterTime] = useState<'all' | 'today' | 'week'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredHistory = history.filter(item => {
        // Platform Filter
        if (filterPlatform === 'current' && currentPlatform) {
            if (item.platform.toLowerCase() !== currentPlatform.toLowerCase()) return false;
        }

        // Time Filter
        if (filterTime === 'today') {
            const today = new Date();
            const itemDate = new Date(item.timestamp);
            if (today.setHours(0, 0, 0, 0) !== itemDate.setHours(0, 0, 0, 0)) return false;
        } else if (filterTime === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            if (item.timestamp < weekAgo.getTime()) return false;
        }

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                item.preview.toLowerCase().includes(query) ||
                item.platform.toLowerCase().includes(query)
            );
        }

        return true;
    });

    return (
        <div className="view-inner history-view-root">
            <div className="history-filters">
                <div className="filter-row">
                    <input
                        type="text"
                        placeholder="Search history..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-row">
                    <button
                        className={`filter-chip ${filterPlatform === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterPlatform('all')}
                    >
                        All Apps
                    </button>
                    <button
                        className={`filter-chip ${filterPlatform === 'current' ? 'active' : ''}`}
                        onClick={() => setFilterPlatform('current')}
                        disabled={!currentPlatform}
                    >
                        Current Tab
                    </button>
                    <div className="divider-v"></div>
                    <select
                        className="filter-select"
                        value={filterTime}
                        onChange={(e) => setFilterTime(e.target.value as any)}
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Past Week</option>
                    </select>
                </div>
            </div>

            <div className="history-scroll-area">
                {filteredHistory.length === 0 ? (
                    <div className="empty-state">No matching history found.</div>
                ) : (
                    <div className="history-list">
                        {filteredHistory.map((item) => (
                            <div
                                key={item.id}
                                className="history-item clickable"
                                onClick={() => onSelect(item)}
                            >
                                <div className="history-meta">
                                    <span className="history-platform">{item.platform}</span>
                                    <span className="history-date">
                                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="history-preview">
                                    {item.preview}
                                </div>
                                <div className="history-stats">
                                    <span className="history-badge">{item.mode}</span>
                                    <span className="history-count">{item.promptCount} prompt{item.promptCount !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

interface SettingsViewProps {
    theme: ThemeMode;
    onThemeChange: (theme: ThemeMode) => void;
    onClearHistory: () => void;
}

const SettingsView = ({ theme, onThemeChange, onClearHistory }: SettingsViewProps) => {
    const themeOptions: ThemeMode[] = ['system', 'light', 'dark'];
    const nextTheme = () => {
        const currentIndex = themeOptions.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeOptions.length;
        onThemeChange(themeOptions[nextIndex]);
    };

    const openSupport = () => {
        chrome.tabs.create({ url: SUPPORT_URL });
    };

    return (
        <div className="view-inner">
            <div className="settings-item clickable" onClick={nextTheme}>
                <span>Theme</span>
                <span className="value">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
            </div>
            <div className="settings-item">
                <span>App Version</span>
                <span className="value">{APP_VERSION}</span>
            </div>
            <div className="settings-item clickable" onClick={openSupport}>
                <span>Support</span>
                <span className="value link">Get Help</span>
            </div>
            <div className="settings-item clickable" onClick={onClearHistory} style={{ color: '#ef4444' }}>
                <span>Clear History</span>
                <span className="value">➔</span>
            </div>
        </div>
    );
};

interface ProfileViewProps {
    user: ChromeUser | null;
    tier: string;
    onSignIn: () => void;
    onSignOut: () => void;
    isAuthLoading: boolean;
}

const ProfileView = ({ user, tier, onSignIn, onSignOut, isAuthLoading }: ProfileViewProps) => {
    const memberSince = user ? new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-';


    return (
        <div className="view-inner">
            <div className="profile-hero">
                <div className="hero-avatar">
                    {user?.picture ? <img src={user.picture} alt="u" /> : <IconUser />}
                </div>
                <div className="hero-info">
                    <div className="hero-name">{user?.name || 'Guest User'}</div>
                    <div className="hero-tier">{tier}</div>
                </div>
            </div>

            <div className="usage-stats">
                <div className="stat-card">
                    <div className="stat-label">Plan</div>
                    <div className="stat-value">{tier === 'guest' ? 'Free' : tier}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Member Since</div>
                    <div className="stat-value">{memberSince}</div>
                </div>
            </div>

            <button
                className="auth-action-btn"
                onClick={user ? onSignOut : onSignIn}
                disabled={isAuthLoading}
            >
                {isAuthLoading ? 'Please wait...' : (user ? 'Sign Out' : 'Sign In with Google')}
            </button>
        </div>
    );
};


// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════

export default function AshokApp() {
    const [view, setView] = useState<'home' | 'config'>('home');
    const [configTab, setConfigTab] = useState<'history' | 'settings' | 'profile'>('history');

    const [mode, setMode] = useState<Mode>('raw');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPrompts, setSelectedPrompts] = useState<Set<number>>(new Set());
    const [summary, setSummary] = useState<string | null>(null);

    const [status, setStatus] = useState<StatusInfo>({ supported: false, platform: null });
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [user, setUser] = useState<ChromeUser | null>(null);
    const [tier, setTier] = useState<string>('guest');
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // UX Enhancement State
    const [loadingMessage, setLoadingMessage] = useState('');
    const [showToast, setShowToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Settings State
    const [theme, setTheme] = useState<ThemeMode>('system');
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    const portRef = useRef<chrome.runtime.Port | null>(null);

    useEffect(() => {
        const port = chrome.runtime.connect({ name: 'sidepanel' });
        portRef.current = port;

        port.onMessage.addListener((message: any) => {
            if (message.action === 'EXTRACTION_RESULT' || message.action === 'EXTRACTION_FROM_PAGE_RESULT') {
                const res = message.result;
                const extractionMode = message.mode || mode;

                setResult(res);
                if (message.mode) setMode(message.mode);

                if (extractionMode === 'summary') {
                    // Start summarization
                    setLoading(true);
                    setLoadingMessage('Processing content...');
                    if (res.prompts.length === 0) {
                        setLoading(false);
                        setError('No prompts found to summarize.');
                        setIsExpanded(true);
                        setView('home');
                    } else {
                        // Send for summarization
                        port.postMessage({
                            action: 'SUMMARIZE_PROMPTS',
                            prompts: res.prompts
                        });
                    }
                } else {
                    // Raw mode - done
                    setLoading(false);
                    setSummary(null);
                    setIsExpanded(true);
                    setView('home');
                    autoSaveToHistory(res, 'raw');
                }
            } else if (message.action === 'SUMMARY_RESULT') {
                if (message.success) {
                    setSummary(message.result.summary);
                    setLoading(false);
                    setIsExpanded(true);
                    setView('home');
                    if (result) {
                        autoSaveToHistory(result, 'summary', message.result.summary);
                    }
                    // Show warning if AI failed but fallback was used
                    if (message.error) {
                        setShowToast({ visible: true, message: 'AI unavailable - showing raw prompts' });
                        setTimeout(() => setShowToast({ visible: false, message: '' }), 3000);
                    }
                } else {
                    setLoading(false);
                    setError(message.error || 'Summarization failed');
                    setIsExpanded(true);
                }
            } else if (message.action === 'STATUS_RESULT') {
                setStatus({ supported: message.supported, platform: message.platform });
            } else if (message.action === 'ERROR') {
                setLoading(false);
                setError(message.error);
                setIsExpanded(true);
            }
        });

        port.postMessage({ action: 'GET_STATUS' });

        initializeAuth().then(async (state) => {
            setUser(state.user);
            setTier(state.tier);

            // Initial cloud sync if logged in
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
                    console.error('Cloud sync failed:', error);
                }
            }
        });

        // Subscribe to auth changes
        const unsubscribeAuth = subscribeToAuthChanges(async (newUser) => {
            setUser(newUser);
            if (newUser) {
                const newTier = await getUserTier(newUser);
                setTier(newTier);

                // Sync history on login
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
                    console.error('Cloud sync on login failed:', error);
                }
            } else {
                setTier('guest');
            }
        });

        // Load saved theme and history
        chrome.storage.local.get(['theme', 'extractionHistory'], (result) => {
            if (result.theme) {
                setTheme(result.theme);
            }
            if (result.extractionHistory) {
                setHistory(result.extractionHistory);
            }
        });

        return () => {
            port.disconnect();
            unsubscribeAuth();
        };
    }, []);

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
        // Save theme preference
        chrome.storage.local.set({ theme });
    }, [theme]);

    const handleSignIn = async () => {
        setIsAuthLoading(true);
        try {
            const user = await signInWithGoogle();
            setUser(user);
            setShowToast({ visible: true, message: 'Signed in successfully' });
            setTimeout(() => setShowToast({ visible: false, message: '' }), 2000);
        } catch (err) {
            setShowToast({ visible: true, message: 'Sign in failed' });
            setTimeout(() => setShowToast({ visible: false, message: '' }), 2000);
        } finally {
            setIsAuthLoading(false);
        }
    };

    const handleSignOut = async () => {
        setIsAuthLoading(true);
        try {
            await signOut();
            setUser(null);
            setTier('guest');
            setShowToast({ visible: true, message: 'Signed out' });
            setTimeout(() => setShowToast({ visible: false, message: '' }), 2000);
        } catch (err) {
            setShowToast({ visible: true, message: 'Sign out failed' });
            setTimeout(() => setShowToast({ visible: false, message: '' }), 2000);
        } finally {
            setIsAuthLoading(false);
        }
    };

    const autoSaveToHistory = (res: ExtractionResult, saveMode: Mode, sum?: string) => {
        const preview = res.prompts[0]?.content.slice(0, 60) + (res.prompts[0]?.content.length > 60 ? '...' : '') || 'No prompts';
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

        // Save to cloud if logged in
        if (user) {
            saveHistoryToCloud(user.id, historyItem as CloudHistoryItem).catch(e => console.error('Cloud save failed:', e));
        }

        setHistory(prev => {
            // Avoid duplicate consecutive saves
            if (prev.length > 0 && prev[0].preview === historyItem.preview && prev[0].platform === historyItem.platform && prev[0].mode === historyItem.mode) {
                return prev;
            }
            const updated = [historyItem, ...prev].slice(0, 50); // Keep last 50
            chrome.storage.local.set({ extractionHistory: updated });
            return updated;
        });
    };

    const loadHistoryItem = (item: HistoryItem) => {
        setResult({
            prompts: item.prompts,
            platform: item.platform,
            url: '',
            title: '',
            extractedAt: item.timestamp
        });
        setMode(item.mode);
        setSummary(item.summary || null);
        setView('home');
        setIsExpanded(true);
    };

    const handleGenerate = () => {
        setLoading(true);
        setLoadingMessage(mode === 'raw' ? 'Extracting prompts...' : 'Summarizing conversation...');
        setResult(null);
        setError(null);
        setIsExpanded(true);
        setView('home');

        if (portRef.current) {
            portRef.current.postMessage({ action: 'EXTRACT_PROMPTS', mode });
        }
    };

    const handleBack = () => {
        if (view === 'config') {
            setView('home');
        } else {
            setIsExpanded(false);
            setResult(null);
            setSummary(null);
            setLoading(false);
            setError(null);
            setIsEditing(false);
            setSelectedPrompts(new Set());
        }
    };

    const openConfig = (tab: 'history' | 'settings' | 'profile') => {
        setIsExpanded(true);
        setView('config');
        setConfigTab(tab);
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        setSelectedPrompts(new Set());
    };

    const toggleSelection = (idx: number) => {
        const newSet = new Set(selectedPrompts);
        if (newSet.has(idx)) newSet.delete(idx);
        else newSet.add(idx);
        setSelectedPrompts(newSet);
    };

    const handleDeleteClick = () => {
        if (!result || selectedPrompts.size === 0) return;
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        if (!result) return;
        const remainingPrompts = result.prompts.filter((_, i) => !selectedPrompts.has(i));
        setResult({ ...result, prompts: remainingPrompts });
        setSelectedPrompts(new Set());
        setShowDeleteConfirm(false);
        if (remainingPrompts.length === 0) {
            setIsEditing(false);
        }
    };

    const handleClearHistory = () => {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            setHistory([]);
            chrome.storage.local.set({ extractionHistory: [] });
            setShowToast({ visible: true, message: 'History cleared' });
            setTimeout(() => setShowToast({ visible: false, message: '' }), 2000);
        }
    };

    const handleCopy = async () => {
        if (!result) return;
        const promptsToCopy = selectedPrompts.size > 0
            ? result.prompts.filter((_, i) => selectedPrompts.has(i))
            : result.prompts;

        const text = promptsToCopy.map(p => p.content).join('\n\n');
        await navigator.clipboard.writeText(text);

        // Show toast notification
        setShowToast({ visible: true, message: 'Copied to clipboard' });
        setTimeout(() => setShowToast({ visible: false, message: '' }), 2000);

        if (isEditing) {
            setIsEditing(false);
            setSelectedPrompts(new Set());
        }
    };

    const renderToggleRow = () => {
        if (view === 'home') {
            return (
                <div className="toggle-row">
                    <button
                        className={`mode-btn ${mode === 'raw' ? 'active' : ''}`}
                        onClick={() => { if (!loading) setMode('raw'); }}
                    >
                        Extract
                    </button>
                    <button
                        className={`mode-btn ${mode === 'summary' ? 'active' : ''}`}
                        onClick={() => { if (!loading) setMode('summary'); }}
                    >
                        Summarize
                    </button>
                </div>
            );
        } else {
            // For config views (History, Settings, Profile), show simple title
            return (
                <div className="toggle-row centered-title">
                    <span className="section-title-text">{configTab.charAt(0).toUpperCase() + configTab.slice(1)}</span>
                </div>
            );
        }
    };

    const renderContentArea = () => {
        let content;
        if (view === 'config') {
            if (configTab === 'history') content = <HistoryView history={history} onSelect={loadHistoryItem} currentPlatform={status.platform} />;
            else if (configTab === 'settings') content = <SettingsView theme={theme} onThemeChange={setTheme} onClearHistory={handleClearHistory} />;
            else content = <ProfileView user={user} tier={tier} onSignIn={handleSignIn} onSignOut={handleSignOut} isAuthLoading={isAuthLoading} />;
        } else {
            content = (
                <>
                    {loading ? (
                        <LoadingState message={loadingMessage} />
                    ) : error ? (
                        <ErrorState
                            error={error}
                            onRetry={handleGenerate}
                            onDismiss={() => setError(null)}
                        />
                    ) : result ? (
                        <>
                            <PromptCountHeader
                                count={result.prompts.length}
                                platform={status.platform}
                                mode={mode}
                            />
                            {mode === 'summary' && summary ? (
                                <div className="summary-content-container">
                                    {summary.split('\n').map((line, i) => (
                                        <p key={i} className="summary-paragraph">{line}</p>
                                    ))}
                                </div>
                            ) : (
                                result.prompts.map((p, i) => (
                                    <div
                                        key={i}
                                        className={`prompt-box 
                                            ${isEditing ? 'selectable' : ''} 
                                            ${isEditing && selectedPrompts.has(i) ? 'selected' : ''} 
                                            ${isEditing && !selectedPrompts.has(i) && selectedPrompts.size > 0 ? 'dimmed' : ''}
                                        `}
                                        onClick={() => isEditing && toggleSelection(i)}
                                    >
                                        {isEditing && (
                                            <div className="selection-indicator">
                                                {selectedPrompts.has(i) ? '✓' : ''}
                                            </div>
                                        )}
                                        {p.content}
                                    </div>
                                ))
                            )}
                        </>
                    ) : (
                        <div className="empty-prompt-text">Click Generate to extract prompts</div>
                    )}
                </>
            );
        }

        return (
            <div className={`view-content-anim 
                ${view === 'home' ? 'prompts-area' : ''} 
                ${view === 'home' && isExpanded ? 'visible' : ''}
            `}>
                {content}
            </div>
        );
    };

    const islandExpanded = isExpanded || view === 'config';

    return (
        <div className="app-container">
            <main className={`main-content ${islandExpanded ? 'expanded-view' : ''}`}>
                <div className={`action-island ${islandExpanded ? 'expanded' : ''}`}>
                    {renderToggleRow()}
                    {view === 'home' && isExpanded && (
                        <div className="controls-row visible">
                            <button className="control-btn" onClick={handleBack}>
                                <span style={{ marginRight: 4 }}>←</span> Back
                            </button>
                            {result ? (
                                isEditing ? (
                                    <SelectionToolbar
                                        selectedCount={selectedPrompts.size}
                                        totalCount={result.prompts.length}
                                        onSelectAll={() => setSelectedPrompts(new Set(result.prompts.map((_, i) => i)))}
                                        onClearAll={() => setSelectedPrompts(new Set())}
                                    />
                                ) : (
                                    <button
                                        className="control-btn"
                                        onClick={toggleEdit}
                                    >
                                        Edit
                                    </button>
                                )
                            ) : null}
                        </div>
                    )}
                    {islandExpanded && renderContentArea()}
                    {view === 'home' && islandExpanded && (
                        <div className="action-buttons-container">
                            {isEditing ? (
                                <>
                                    <button
                                        className="dual-btn"
                                        onClick={handleDeleteClick}
                                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                        disabled={selectedPrompts.size === 0}
                                    >
                                        Delete ({selectedPrompts.size})
                                    </button>
                                    <button className="dual-btn" onClick={handleCopy}>
                                        Copy ({selectedPrompts.size})
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="dual-btn primary" onClick={handleGenerate}>
                                        Generate
                                    </button>
                                    <button className="dual-btn" onClick={handleCopy}>
                                        Copy
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    {view === 'home' && !islandExpanded && (
                        <button className="generate-btn-lg" onClick={handleGenerate} disabled={!status.supported}>
                            Generate
                        </button>
                    )}
                </div>
                <Tooltip content="Unlock unlimited extractions and AI summaries" fullWidth>
                    <button className={`upgrade-pill ${islandExpanded ? 'visible' : ''}`}>
                        Upgrade
                    </button>
                </Tooltip>
            </main>

            <footer className="app-footer">
                <button
                    className={`footer-icon-btn ${view === 'home' && !islandExpanded ? 'active' : ''}`}
                    onClick={() => {
                        setView('home');
                        setIsExpanded(false);
                    }}
                    title="Home"
                >
                    <IconHome />
                </button>
                <button
                    className={`footer-icon-btn ${configTab === 'history' && islandExpanded ? 'active' : ''}`}
                    onClick={() => openConfig('history')}
                    title="History"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                </button>
                <button
                    className={`footer-icon-btn ${configTab === 'settings' && islandExpanded ? 'active' : ''}`}
                    onClick={() => openConfig('settings')}
                    title="Settings"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                    </svg>
                </button>
                <button
                    className={`footer-icon-btn ${configTab === 'profile' && islandExpanded ? 'active' : ''}`}
                    onClick={() => openConfig('profile')}
                    title="Profile"
                >
                    <div className="footer-avatar-mini">
                        {user?.picture ? <img src={user.picture} alt="u" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : <IconUser />}
                    </div>
                </button>
            </footer>

            <Toast visible={showToast.visible} message={showToast.message} />

            <ConfirmDialog
                visible={showDeleteConfirm}
                title="Delete prompts?"
                message={`Delete ${selectedPrompts.size} prompt${selectedPrompts.size !== 1 ? 's' : ''}? This cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div >
    );
}
