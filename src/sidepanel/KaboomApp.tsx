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
import './kaboom.css';

// ═══════════════════════════════════════════════════
// ICONS (Kaboom Style)
// ═══════════════════════════════════════════════════

const IconClock = ({ active }: { active?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`kb-nav-icon ${active ? 'active' : ''}`}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconSettings = ({ active }: { active?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`kb-nav-icon ${active ? 'active' : ''}`}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);



const IconBack = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const IconCopy = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

// ═══════════════════════════════════════════════════

type AppTab = 'home' | 'history' | 'settings' | 'profile' | 'processing';

export default function KaboomApp() {
    const [activeTab, setActiveTab] = useState<AppTab>('home');
    const [user, setUser] = useState<ChromeUser | null>(null);
    const [tier, setTier] = useState<string>('FREE');
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const [mode, setMode] = useState<Mode>('raw');
    const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState({ supported: false, platform: null as string | null });

    const [historySearchQuery, setHistorySearchQuery] = useState('');

    // Step simulation for extraction UI
    const [extractionStep, setExtractionStep] = useState(1);

    const portRef = useRef<chrome.runtime.Port | null>(null);

    useEffect(() => {
        const port = chrome.runtime.connect({ name: 'sidepanel' });
        portRef.current = port;

        port.onMessage.addListener((msg) => {
            if (msg.action === 'STATUS_RESULT') {
                setStatus({ supported: msg.supported, platform: msg.platform });
            } else if (msg.action === 'EXTRACTION_RESULT') {
                setExtractionResult(msg.result);
                setLoading(false);
                setActiveTab('home');
                setExtractionStep(3); // Result ready

                const newItem: HistoryItem = {
                    id: Date.now().toString(),
                    platform: msg.result.platform,
                    promptCount: msg.result.prompts.length,
                    mode: 'raw',
                    timestamp: Date.now(),
                    prompts: msg.result.prompts,
                    preview: msg.result.prompts[0]?.content.slice(0, 100) || '',
                };

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
                setActiveTab('home');
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
    }, [user, extractionResult, activeTab]); // Include activeTab to avoid stale closure

    const handleStartExtraction = () => {
        setActiveTab('processing');
        setExtractionStep(1);
        setLoading(true);
        setError(null);

        // Simulate steps for UI
        setTimeout(() => setExtractionStep(2), 800);
        setTimeout(() => setExtractionStep(3), 1600);

        if (portRef.current) {
            portRef.current.postMessage({ action: 'EXTRACT_PROMPTS', mode: 'raw' });
        }
    };

    const handleSummarize = () => {
        if (!extractionResult) return;
        setLoading(true);
        if (portRef.current) {
            portRef.current.postMessage({
                action: 'SUMMARIZE_PROMPTS',
                prompts: extractionResult.prompts
            });
        }
    };

    const handleCopy = async () => {
        const text = summary || extractionResult?.prompts.map(p => p.content).join('\n\n');
        if (text) await navigator.clipboard.writeText(text);
    };

    const renderProcessing = () => (
        <div className="kb-content kb-animate kb-extract-container">
            <div className="kb-extract-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                </svg>
            </div>
            <h1 className="kb-extract-title">Extracting prompts</h1>
            <p className="kb-extract-sub">Analyzing conversation structure and tokenizing content.</p>

            <div className="kb-stats-row">
                <div className="kb-stat-col">
                    <div className="kb-stat-label">Elapsed</div>
                    <div className="kb-stat-value">0.8<span style={{ fontSize: 14, fontWeight: 500 }}>s</span></div>
                </div>
                <div className="kb-stat-col">
                    <div className="kb-stat-label">Source</div>
                    <div className="kb-stat-value">{status.platform || 'Auto'}</div>
                </div>
                <div className="kb-stat-col">
                    <div className="kb-stat-label">Found</div>
                    <div className="kb-stat-value" style={{ color: '#3A82F6' }}>--</div>
                </div>
            </div>

            <div className="kb-step-list">
                <div className={`kb-step-item ${extractionStep >= 1 ? 'active' : ''} ${extractionStep > 1 ? 'done' : ''}`}>
                    <div className="kb-step-dot">{extractionStep === 1 && <div className="kb-step-dot-inner" />}</div>
                    <span>Detecting page</span>
                </div>
                <div className={`kb-step-item ${extractionStep >= 2 ? 'active' : ''} ${extractionStep > 2 ? 'done' : ''}`}>
                    <div className="kb-step-dot">{extractionStep === 2 && <div className="kb-step-dot-inner" />}</div>
                    <span>Reading conversation</span>
                </div>
                <div className={`kb-step-item ${extractionStep >= 3 ? 'active' : ''}`}>
                    <div className="kb-step-dot">{extractionStep === 3 && <div className="kb-step-dot-inner" />}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span>Processing content</span>
                        {extractionStep === 3 && <span style={{ fontSize: 10, color: '#3A82F6', fontWeight: 700 }}>IN PROGRESS</span>}
                    </div>
                </div>
            </div>

            <button className="kb-btn-secondary" style={{ marginTop: 'auto' }} onClick={() => { setActiveTab('home'); setLoading(false); }}>
                Stop Processing
            </button>
        </div>
    );

    const renderAccount = () => (
        <div className="kb-content kb-animate">
            <h1 className="kb-view-title">Account</h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 24 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#F9F9F9', border: '1px solid #EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 500, color: '#999', overflow: 'hidden' }}>
                    {user?.picture ? <img src={user.picture} style={{ width: '100%' }} /> : (user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'JD')}
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>{user?.email || 'email@example.com'}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#3A82F6', textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 }}>
                        {tier === 'PRO' ? 'PRO MEMBER' : 'PREMIUM MEMBER'}
                    </div>
                </div>
            </div>

            <div className="kb-group-card" style={{ marginTop: 32 }}>
                <div className="kb-list-item">
                    <span className="kb-list-label">Manage Subscription</span>
                    <div style={{ transform: 'rotate(180deg)', opacity: 0.3 }}><IconBack /></div>
                </div>
                <div className="kb-list-item">
                    <span className="kb-list-label">Billing History</span>
                    <div style={{ transform: 'rotate(180deg)', opacity: 0.3 }}><IconBack /></div>
                </div>
            </div>

            <button className="kb-btn-primary" style={{ marginTop: 'auto' }} onClick={user ? signOut : signInWithGoogle}>
                {user ? 'Log Out' : 'Sign In'}
            </button>
            <div style={{ textAlign: 'center', fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginTop: 16 }}>
                Version 3.1.0
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="kb-content kb-animate">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h1 className="kb-view-title">Settings</h1>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#3A82F6', cursor: 'pointer' }}>UPGRADE</span>
            </div>
            <div className="kb-section-label">Preferences</div>

            <div>
                <div className="kb-section-label" style={{ marginBottom: 8 }}>Theme</div>
                <div className="kb-group-card">
                    {['Light', 'Dark', 'System Default'].map(t => (
                        <div key={t} className="kb-list-item">
                            <span className="kb-list-label">{t}</span>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #EAEAEA', position: 'relative' }}>
                                {t === 'Light' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3A82F6', position: 'absolute', top: 3, left: 3 }} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="kb-section-label" style={{ marginBottom: 8 }}>Automation</div>
                <div className="kb-group-card">
                    <div className="kb-list-item">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="kb-list-label">Auto-extract</span>
                            <span style={{ fontSize: 12, color: '#999' }}>On page load</span>
                        </div>
                        <div style={{ width: 40, height: 22, borderRadius: 100, background: '#EAEAEA', position: 'relative' }}>
                            <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                        </div>
                    </div>
                </div>
            </div>

            <button className="kb-btn-secondary" style={{ marginTop: 'auto' }} onClick={user ? signOut : undefined}>
                Sign Out
            </button>
            <div style={{ textAlign: 'center', fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginTop: 16 }}>
                Version 3.1.0
            </div>
        </div>
    );

    const renderHistory = () => {
        const filteredHistory = history.filter(item => {
            const matchesSearch = item.preview.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                item.platform.toLowerCase().includes(historySearchQuery.toLowerCase());
            return matchesSearch;
        });

        return (
            <div className="kb-content kb-animate">
                <h1 className="kb-view-title">History</h1>
                <div className="kb-group-card" style={{ display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search history..."
                        style={{ flex: 1, border: 'none', padding: '16px 12px', fontSize: 15, outline: 'none' }}
                        value={historySearchQuery}
                        onChange={(e) => setHistorySearchQuery(e.target.value)}
                    />
                </div>

                <div className="kb-section-label">Recent Explorations</div>
                <div className="kb-group-card">
                    {filteredHistory.length > 0 ? filteredHistory.map(item => (
                        <div key={item.id} className="kb-list-item" onClick={() => {
                            setExtractionResult({ prompts: item.prompts, platform: item.platform, url: '', title: '', extractedAt: item.timestamp });
                            setMode(item.mode);
                            setSummary(item.summary || null);
                            setActiveTab('home');
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="kb-list-label">{item.platform}</span>
                                <span style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{item.preview.slice(0, 50)}...</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                <span style={{ fontSize: 11, color: '#999' }}>{new Date(item.timestamp).toLocaleDateString()}</span>
                                <div className="kb-badge" style={{ fontSize: 8, padding: '2px 6px' }}>{item.mode}</div>
                            </div>
                        </div>
                    )) : (
                        <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>No history items found.</div>
                    )}
                </div>
            </div>
        );
    };

    const renderResult = () => (
        <div className="kb-app kb-animate">
            <div className="kb-top-bar" style={{ borderBottom: '1px solid #F5F5F5' }}>
                <button className="kb-back-btn" onClick={() => { setExtractionResult(null); setActiveTab('home'); setSummary(null); setMode('raw'); }}>
                    <IconBack />
                </button>
                <div className="kb-top-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                    {extractionResult?.title || `Analysis of ${extractionResult?.platform}...`}
                </div>
            </div>

            <div className="kb-content" style={{ background: '#F9F9F9' }}>
                {error && (
                    <div style={{ padding: 12, background: '#FEE2E2', color: '#B91C1C', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                        {error}
                    </div>
                )}

                <div className="kb-result-meta">
                    <div className="kb-badge-row">
                        <div className="kb-badge" style={{ background: mode === 'summary' ? '#FEEED4' : 'white' }}>
                            {mode === 'summary' ? 'Summary' : 'Extract'}
                        </div>
                        <div className="kb-badge" style={{ color: 'black' }}>{extractionResult?.platform || 'ChatGPT'}</div>
                    </div>
                    <div className="kb-date-label">
                        {extractionResult?.extractedAt ? new Date(extractionResult.extractedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Today'}
                    </div>
                </div>

                {mode === 'raw' && (
                    <div style={{ padding: '4px 12px 16px', background: 'white', border: '1px solid var(--kb-outline)', borderRadius: 12, marginBottom: 16, display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: -10, right: 10, background: '#3A82F6', color: 'white', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>PRO</div>
                        <button onClick={handleSummarize} style={{ background: 'none', border: 'none', color: '#666', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            Summarize Extract
                        </button>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {mode === 'summary' && summary ? (
                        <div className="kb-prompt-card" style={{ borderLeft: '4px solid #3A82F6' }}>
                            {summary}
                        </div>
                    ) : (
                        extractionResult?.prompts.map((p, i) => (
                            <div key={i} className="kb-prompt-card">
                                {p.content}
                            </div>
                        ))
                    )}
                </div>

                <div style={{ height: 80 }} /> {/* Spacer for floating button area if needed, but mockup shows it at bottom */}

                <button className="kb-btn-primary" onClick={handleCopy}>
                    <IconCopy />
                    Copy
                </button>
            </div>

            <div className="kb-footer">
                <div className="kb-nav-user" onClick={() => setActiveTab('profile')}>
                    <div className="kb-nav-avatar">
                        {user?.picture ? <img src={user.picture} style={{ width: '100%' }} /> : <span style={{ fontSize: 12, fontWeight: 700 }}>
                            {user?.name ? user.name[0] : 'AD'}
                        </span>}
                    </div>
                    <span className="kb-nav-name">{user?.name?.split(' ')[0] || 'Alex D.'}</span>
                </div>
                <div className="kb-nav-links">
                    <div onClick={() => setActiveTab('history')}><IconClock active={activeTab === 'history'} /></div>
                    <div onClick={() => setActiveTab('settings')}><IconSettings active={activeTab === 'settings'} /></div>
                </div>
            </div>
        </div>
    );

    const renderMainLayout = (content: React.ReactNode) => (
        <div className="kb-app">
            {content}
            <div className="kb-footer">
                <div className="kb-nav-user" onClick={() => setActiveTab('profile')}>
                    <div className="kb-nav-avatar">
                        {user?.picture ? <img src={user.picture} style={{ width: '100%' }} /> : <span style={{ fontSize: 12, fontWeight: 700 }}>
                            {user?.name ? user.name[0] : 'AD'}
                        </span>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="kb-nav-name">{user?.name?.split(' ')[0] || 'Alex D.'}</span>
                        {tier === 'PRO' && <span style={{ fontSize: 10, fontWeight: 700, color: '#3A82F6' }}>PREMIUM</span>}
                    </div>
                </div>
                <div className="kb-nav-links">
                    <div onClick={() => setActiveTab('history')}><IconClock active={activeTab === 'history'} /></div>
                    <div onClick={() => setActiveTab('settings')}><IconSettings active={activeTab === 'settings'} /></div>
                </div>
            </div>
        </div>
    );

    if (activeTab === 'processing') return renderProcessing();
    if (activeTab === 'profile') return renderMainLayout(renderAccount());
    if (activeTab === 'settings') return renderMainLayout(renderSettings());
    if (activeTab === 'history') return renderMainLayout(renderHistory());
    if (extractionResult && activeTab === 'home') return renderResult();

    // Default Home View (Empty state)
    return renderMainLayout(
        <div className="kb-content kb-animate">
            <div className="kb-group-card" style={{ padding: 40, textAlign: 'center', background: 'white' }}>
                <div className="kb-extract-icon" style={{ margin: '0 auto 24px' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v10m0 0l-3-3m3 3l3-3" />
                        <path d="M3 18v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
                    </svg>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Ready to Extract</h2>
                <p style={{ fontSize: 14, color: '#999', marginBottom: 24 }}>Navigate to a supported AI chat to begin.</p>
                <button className="kb-btn-primary" onClick={handleStartExtraction} disabled={!status.supported}>
                    {status.supported ? 'Start Extraction' : 'Unsupported Page'}
                </button>
                {!status.supported && (
                    <p style={{ fontSize: 11, color: '#999', marginTop: 12 }}>Visit ChatGPT, Claude, or Gemini to use SahAI.</p>
                )}
            </div>

            {history.length > 0 && (
                <div style={{ marginTop: 8 }}>
                    <div className="kb-section-label">Recent Explorations</div>
                    <div className="kb-group-card">
                        {history.slice(0, 3).map(item => (
                            <div key={item.id} className="kb-list-item" onClick={() => {
                                setExtractionResult({ prompts: item.prompts, platform: item.platform, url: '', title: '', extractedAt: item.timestamp });
                                setMode(item.mode);
                                setSummary(item.summary || null);
                                setActiveTab('home');
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="kb-list-label">{item.platform}</span>
                                    <span style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{item.preview.slice(0, 40)}...</span>
                                </div>
                                <span style={{ fontSize: 11, color: '#999' }}>{new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
