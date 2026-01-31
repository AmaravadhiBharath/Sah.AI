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
import { LoadingState } from './AshokComponents';
import './sevi-design.css';

// ═══════════════════════════════════════════════════
// ICONS (Clean & Modern)
// ═══════════════════════════════════════════════════

const IconHome = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
);

const IconHistory = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconSettings = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

const IconUser = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconBack = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);



// ═══════════════════════════════════════════════════

type AppTab = 'home' | 'history' | 'settings' | 'profile';

export default function SeviApp() {
    const [activeTab, setActiveTab] = useState<AppTab>('home');
    const [user, setUser] = useState<ChromeUser | null>(null);
    const [tier, setTier] = useState<string>('FREE');
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const [mode, setMode] = useState<Mode>('raw');
    const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState({ supported: false, platform: null as string | null });

    const [historySearchQuery, setHistorySearchQuery] = useState('');
    const [historyFilter, setHistoryFilter] = useState<'all' | 'tab'>('all');

    const portRef = useRef<chrome.runtime.Port | null>(null);

    // Initialization & Auth
    useEffect(() => {
        const port = chrome.runtime.connect({ name: 'sidepanel' });
        portRef.current = port;

        port.onMessage.addListener((msg) => {
            if (msg.action === 'STATUS_RESULT') {
                setStatus({ supported: msg.supported, platform: msg.platform });

                // Auto-extract if supported and we don't have results yet
                if (msg.supported && !extractionResult) {
                    setLoading(true);
                    port.postMessage({ action: 'EXTRACT_PROMPTS', mode: 'raw' });
                }
            } else if (msg.action === 'EXTRACTION_RESULT') {
                setExtractionResult(msg.result);
                setLoading(false);
                setError(null);
                setMode('raw');
                setSummary(null);

                // Auto save
                const newItem: HistoryItem = {
                    id: Date.now().toString(),
                    platform: msg.result.platform,
                    promptCount: msg.result.prompts.length,
                    mode: 'raw',
                    timestamp: Date.now(),
                    prompts: msg.result.prompts,
                    preview: msg.result.prompts[0]?.content.slice(0, 100) || '',
                };

                // Sync to cloud if user is logged in
                if (user) {
                    saveHistoryToCloud(user.id, newItem as CloudHistoryItem).catch(e => console.error('Cloud save failed:', e));
                }

                setHistory(prev => [newItem, ...prev].slice(0, 50));
            } else if (msg.action === 'SUMMARY_RESULT') {
                if (msg.success) {
                    setSummary(msg.result.summary);
                    setMode('summary');
                } else {
                    setError(msg.error);
                }
                setLoading(false);
            } else if (msg.action === 'ERROR') {
                setError(msg.error);
                setLoading(false);
            }
        });

        port.postMessage({ action: 'GET_STATUS' });

        initializeAuth().then(state => {
            setUser(state.user);
            setTier(state.tier?.toUpperCase() || 'FREE');
        });

        const unsubscribe = subscribeToAuthChanges(async (newUser) => {
            setUser(newUser);
            if (newUser) {
                const newTier = await getUserTier(newUser);
                setTier(newTier.toUpperCase());
            } else {
                setTier('FREE');
            }
        });

        chrome.storage.local.get(['extractionHistory'], async (res) => {
            if (res.extractionHistory) setHistory(res.extractionHistory);

            // Sync with cloud if user is logged in
            if (user) {
                try {
                    const cloudHistory = await getHistoryFromCloud(user.id);
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

        return () => {
            port.disconnect();
            unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        await signOut();
        setUser(null);
        setTier('FREE');
    };

    const handleExtraction = () => {
        setLoading(true);
        setError(null);
        if (portRef.current) {
            portRef.current.postMessage({ action: 'EXTRACT_PROMPTS', mode: 'raw' });
        }
    };

    const handleSummarize = () => {
        if (!extractionResult) return;
        setLoading(true);
        setError(null);
        if (portRef.current) {
            portRef.current.postMessage({
                action: 'SUMMARIZE_PROMPTS',
                prompts: extractionResult.prompts
            });
        }
    };

    const handleCopy = async () => {
        const text = summary || extractionResult?.prompts.map(p => p.content).join('\n\n');
        if (text) {
            await navigator.clipboard.writeText(text);
        }
    };

    // Sub-renders
    const renderBottomNav = () => (
        <div className="app-footer-layout">
            <button className="profile-pill" onClick={() => setActiveTab('profile')}>
                <div className="profile-pill-avatar">
                    {user?.picture ? <img src={user.picture} alt="u" /> : <IconUser />}
                </div>
                <div className="profile-pill-info">
                    <span className="profile-pill-name">{user?.name?.split(' ')[0] || 'Guest'}</span>
                    <span className="profile-pill-badge">{tier}</span>
                </div>
            </button>

            <nav className="nav-pill">
                <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                    <IconHome />
                </button>
                <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                    <IconHistory />
                </button>
                <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                    <IconSettings />
                </button>
            </nav>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="view-animate">
                        <div className="sevi-card profile-main-card">
                            <div className="profile-avatar-lg">
                                {user?.picture ? <img src={user.picture} alt="u" /> : <IconUser />}
                            </div>
                            <div className="profile-details">
                                <h2 className="profile-name">{user?.name || 'Guest User'}</h2>
                                <span className="profile-tier-badge">{tier}</span>
                            </div>
                        </div>

                        <div className="grid-stats" style={{ marginTop: 16 }}>
                            <div className="stat-box">
                                <span className="stat-label">Plan</span>
                                <span className="stat-value">{tier}</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-label">Since</span>
                                <span className="stat-value">Jan 2026</span>
                            </div>
                        </div>

                        <button className="sign-out-btn" onClick={user ? handleSignOut : signInWithGoogle}>
                            {user ? 'Sign Out' : 'Sign In'}
                        </button>
                    </div>
                );
            case 'settings':
                return (
                    <div className="view-animate">
                        <div className="sevi-card">
                            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Preferences</h3>
                            <div className="settings-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--outline)' }}>
                                <span>Theme</span>
                                <span style={{ fontWeight: 600 }}>System</span>
                            </div>
                            <div className="settings-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                                <span>Auto-Sync</span>
                                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Enabled</span>
                            </div>
                        </div>

                        <div className="sevi-card" style={{ marginTop: 12 }}>
                            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Support</h3>
                            <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>Need help or have a suggestion?</p>
                            <button className="overlay-btn" style={{ width: '100%', background: 'var(--surface-variant)' }}>Contact Support</button>
                        </div>
                    </div>
                );
            case 'history':
                const filteredHistory = history.filter(item => {
                    const matchesSearch = item.preview.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                        item.platform.toLowerCase().includes(historySearchQuery.toLowerCase());
                    const matchesTab = historyFilter === 'all' || (status.platform && item.platform.toLowerCase() === status.platform.toLowerCase());
                    return matchesSearch && matchesTab;
                });

                return (
                    <div className="view-animate">
                        <div className="search-bar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search history..."
                                value={historySearchQuery}
                                onChange={(e) => setHistorySearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-chips">
                            <button
                                className={`chip ${historyFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setHistoryFilter('all')}
                            >
                                All Apps
                            </button>
                            <button
                                className={`chip ${historyFilter === 'tab' ? 'active' : ''}`}
                                onClick={() => setHistoryFilter('tab')}
                                disabled={!status.platform}
                            >
                                Current Tab
                            </button>
                            <button className="chip">All Time</button>
                        </div>
                        <div className="history-list" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {filteredHistory.length > 0 ? filteredHistory.map(item => (
                                <div key={item.id} className="sevi-card" style={{ padding: 16 }} onClick={() => {
                                    setExtractionResult({ prompts: item.prompts, platform: item.platform, url: '', title: '', extractedAt: item.timestamp });
                                    setSummary(item.summary || null);
                                    setMode(item.mode);
                                    setActiveTab('home');
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, fontWeight: 700, opacity: 0.7 }}>
                                        <span style={{ textTransform: 'uppercase' }}>{item.platform}</span>
                                        <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>{item.preview}</p>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <span className="profile-tier-badge" style={{ fontSize: 9, padding: '2px 8px' }}>{item.mode}</span>
                                        <span style={{ fontSize: 11, opacity: 0.6 }}>{item.promptCount} prompts</span>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>No history found.</div>
                            )}
                        </div>
                    </div>
                );
            case 'home':
            default:
                if (loading) return (
                    <div className="view-animate" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <LoadingState message="Processing content..." />
                    </div>
                );

                // STICKY LOGIC: Show extraction result if available, otherwise show Connect state
                // If we have an extraction result, we show it regardless of status.platform connection
                // This allows viewing results even if user navigates away

                if (!extractionResult) {
                    return (
                        <div className="view-animate">
                            <div className="sevi-card full-height" style={{ background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontWeight: 600 }}>Ready to extract</p>
                                    <p style={{ fontSize: 12 }}>{status.platform ? `Connected to ${status.platform}` : 'Navigate to a supported AI chat'}</p>
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="view-animate">
                        {error && (
                            <div className="sevi-card" style={{ borderColor: '#FCA5A5', background: '#FEF2F2', color: '#B91C1C', fontSize: 13, marginBottom: 16 }}>
                                {error}
                            </div>
                        )}

                        <div className="sevi-card full-height" style={{ background: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--outline)' }}>
                                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', opacity: 0.6 }}>{extractionResult.platform}</span>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="icon-btn-sm" onClick={handleCopy} title="Copy All">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="prompts-list-container">
                                {mode === 'summary' && summary ? (
                                    <div style={{ padding: 12, background: 'var(--accent-soft)', borderRadius: 12, fontSize: 14, lineHeight: 1.6 }}>
                                        {summary}
                                    </div>
                                ) : (
                                    extractionResult.prompts.map((p, i) => (
                                        <div key={i} className="prompt-box">
                                            {p.content}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {extractionResult && (
                            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                                <button className="overlay-btn" style={{ background: 'white', border: '1px solid var(--outline)' }} onClick={handleExtraction}>Re-extract</button>
                                {mode === 'raw' && (
                                    <button className="overlay-btn" style={{ background: 'white', border: '1px solid var(--outline)' }} onClick={handleSummarize}>Summarize</button>
                                )}
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="sevi-app">
            {activeTab !== 'home' ? (
                <div className="top-bar">
                    <button className="icon-btn" onClick={() => setActiveTab('home')}>
                        <IconBack />
                    </button>
                    <span style={{ fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}>{activeTab}</span>
                    <div style={{ width: 24 }}></div>
                </div>
            ) : (
                <div className="top-bar">
                    <button className="icon-btn" onClick={() => setActiveTab('home')} style={{ opacity: 0 }}>
                        <IconBack />
                    </button>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Ashok</span>
                    <button className="icon-btn" onClick={() => {/* Edit toggle logic if needed */ }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                </div>
            )}

            <main className="content-area">
                {renderContent()}
            </main>

            {renderBottomNav()}
        </div>
    );
}
