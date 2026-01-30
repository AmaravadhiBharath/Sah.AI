import { useState, useEffect, useRef } from 'react';
import type { ExtractionResult, Mode } from '../types';
import {
    initializeAuth,
    type ChromeUser,
    type UserTier,
} from '../services/auth';
import type { CloudHistoryItem } from '../services/firebase';
import './ashok-design.css';

// ═══════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════

const IconUser = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconHistory = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconSettings = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

interface StatusInfo {
    supported: boolean;
    platform: string | null;
}

// ═══════════════════════════════════════════════════
// ACTION ISLAND APP COMPONENT
// ═══════════════════════════════════════════════════

export default function AshokApp() {
    // UI State
    const [mode, setMode] = useState<Mode>('raw');
    const [view, setView] = useState<'main' | 'history' | 'settings'>('main');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPrompts, setSelectedPrompts] = useState<Set<number>>(new Set());

    // Data State
    const [status, setStatus] = useState<StatusInfo>({ supported: false, platform: null });
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<CloudHistoryItem[]>([]);

    // User State
    const [user, setUser] = useState<ChromeUser | null>(null);
    const [tier, setTier] = useState<UserTier>('guest');

    const portRef = useRef<chrome.runtime.Port | null>(null);
    const connectPort = useRef<() => void>();

    // ═══════════════════════════════════════════════════
    // EFFECTS & LOGIC
    // ═══════════════════════════════════════════════════

    useEffect(() => {
        const connect = () => {
            if (portRef.current) return;
            try {
                const port = chrome.runtime.connect({ name: 'sidepanel' });
                portRef.current = port;

                port.onMessage.addListener((message: any) => {
                    if (message.action === 'EXTRACTION_RESULT' || message.action === 'EXTRACTION_FROM_PAGE_RESULT') {
                        const res = message.result;
                        setResult(res);
                        setLoading(false);
                        setIsExpanded(true);

                        const newItem: CloudHistoryItem = {
                            id: Date.now().toString(),
                            platform: res.platform,
                            promptCount: res.prompts.length,
                            mode: mode,
                            timestamp: Date.now(),
                            prompts: res.prompts,
                            preview: res.prompts[0]?.content.substring(0, 50) || 'No content'
                        };
                        setHistory(prev => [newItem, ...prev]);
                    } else if (message.action === 'STATUS_RESULT') {
                        setStatus({ supported: message.supported, platform: message.platform });
                    } else if (message.action === 'ERROR') {
                        setLoading(false);
                        setError(message.error);
                        setIsExpanded(true);
                    }
                });

                port.onDisconnect.addListener(() => {
                    console.log("Port disconnected");
                    portRef.current = null;
                });

                port.postMessage({ action: 'GET_STATUS' });
            } catch (e) {
                console.error("Connection failed", e);
            }
        };

        connectPort.current = connect;
        connect();

        initializeAuth().then(state => {
            setUser(state.user);
            setTier(state.tier);
        });

        chrome.storage.local.get(['extractionHistory'], (data) => {
            if (data.extractionHistory) {
                setHistory(data.extractionHistory);
            }
        });

        return () => {
            if (portRef.current) {
                portRef.current.disconnect();
                portRef.current = null;
            }
        };
    }, []);

    const handleGenerate = () => {
        setLoading(true);
        setResult(null);
        setError(null);
        setIsExpanded(true);
        setIsEditing(false); // Reset edit mode on new generate

        // Reconnect if needed
        if (!portRef.current && connectPort.current) {
            connectPort.current();
        }

        setTimeout(() => {
            if (portRef.current) {
                try {
                    portRef.current.postMessage({ action: 'EXTRACT_PROMPTS', mode });
                } catch (e) {
                    setError("Connection lost. Please retry.");
                }
            } else {
                setError("Service Unavailable. Please reload the extension.");
            }
        }, 50);
    };

    const handleBack = () => {
        setIsExpanded(false);
        setResult(null);
        setLoading(false);
        setError(null);
        setIsEditing(false);
    };

    const handleCopy = async () => {
        if (!result) return;

        // If editing/selection mode is active, copy only selected
        let text = "";
        if (isEditing && selectedPrompts.size > 0) {
            text = result.prompts
                .filter((_, i) => selectedPrompts.has(i))
                .map(p => p.content)
                .join('\n\n');
        } else {
            text = result.prompts.map(p => p.content).join('\n\n');
        }

        await navigator.clipboard.writeText(text);
        const btn = document.getElementById('copy-btn');
        if (btn) btn.innerText = "Copied!";
        setTimeout(() => { if (btn) btn.innerText = "Copy"; }, 2000);
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        setSelectedPrompts(new Set()); // Reset selection when toggling
    };

    const toggleSelection = (index: number) => {
        const next = new Set(selectedPrompts);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        setSelectedPrompts(next);
    };

    // ═══════════════════════════════════════════════════
    // RENDER CONTENT
    // ═══════════════════════════════════════════════════

    const renderMainContent = () => (
        <div className={`action-island ${isExpanded ? 'expanded' : ''}`}>
            {/* Toggle */}
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
                    summarize
                </button>
            </div>

            {/* Header */}
            <div className={`controls-row ${isExpanded ? 'visible' : ''}`}>
                <button className="control-btn" onClick={handleBack}>Back</button>
                <button className="control-btn" onClick={toggleEdit}>
                    {isEditing ? 'Done' : 'Edit'}
                </button>
            </div>

            {/* Prompts List */}
            {isExpanded && (
                <div className={`prompts-area ${isExpanded ? 'visible' : ''}`}>
                    {loading ? (
                        <div className="loader-minimal"></div>
                    ) : error ? (
                        <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>{error}</div>
                    ) : result ? (
                        result.prompts.map((p, i) => (
                            <div
                                key={i}
                                className={`prompt-box ${isEditing && selectedPrompts.has(i) ? 'selected' : ''}`}
                                onClick={() => isEditing && toggleSelection(i)}
                                style={{
                                    cursor: isEditing ? 'pointer' : 'default',
                                    border: isEditing && selectedPrompts.has(i) ? '2px solid #1A1A1A' : '2px solid transparent',
                                    animationDelay: `${i * 0.05}s`,
                                    opacity: 1
                                }}
                            >
                                {isEditing && (
                                    <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: selectedPrompts.has(i) ? '#1A1A1A' : '#999' }}>
                                        {selectedPrompts.has(i) ? '✓ Selected' : '○ Select'}
                                    </div>
                                )}
                                {p.content}
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: 20, textAlign: 'center', opacity: 0.5 }}>...</div>
                    )}
                </div>
            )}

            {/* Buttons */}
            {isExpanded ? (
                <div className="action-buttons-container">
                    {isEditing ? (
                        <button className="dual-btn" style={{ color: '#EF4444', borderColor: '#EF4444' }} onClick={() => {
                            // Implement Delete Logic
                            if (!result) return;
                            const newPrompts = result.prompts.filter((_, i) => !selectedPrompts.has(i));
                            setResult({ ...result, prompts: newPrompts });
                            setSelectedPrompts(new Set()); // Reset selection
                        }}>
                            Delete ({selectedPrompts.size})
                        </button>
                    ) : (
                        <button className="dual-btn" onClick={handleGenerate}>
                            Re-Generate
                        </button>
                    )}
                    <button id="copy-btn" className="dual-btn" onClick={handleCopy}>
                        {isEditing && selectedPrompts.size > 0 ? `Copy (${selectedPrompts.size})` : 'Copy'}
                    </button>
                </div>
            ) : (
                <button
                    className="generate-btn-lg"
                    onClick={handleGenerate}
                    disabled={!status.supported}
                >
                    Generate
                </button>
            )}
        </div>
    );

    const renderHistory = () => (
        <div className="action-island expanded">
            <div className="controls-row visible" style={{ marginTop: 0 }}>
                <button className="control-btn" onClick={() => setView('main')}>← Back</button>
                <span style={{ fontWeight: 600 }}>History</span>
                <div style={{ width: 32 }}></div> {/* Spacer */}
            </div>
            <div className="prompts-area visible">
                {history.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>No history yet</div>
                ) : (
                    history.map((item) => (
                        <div key={item.id} className="prompt-box" onClick={() => {
                            // Load into main view
                            setResult({
                                prompts: item.prompts,
                                platform: item.platform,
                                url: item.platform,
                                title: new Date(item.timestamp).toLocaleString(),
                                extractedAt: item.timestamp
                            });
                            setIsExpanded(true);
                            setView('main');
                        }} style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 4 }}>
                                <span>{item.platform}</span>
                                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                            </div>
                            {item.preview}
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="action-island expanded">
            <div className="controls-row visible" style={{ marginTop: 0 }}>
                <button className="control-btn" onClick={() => setView('main')}>← Back</button>
                <span style={{ fontWeight: 600 }}>Settings</span>
                <div style={{ width: 32 }}></div>
            </div>
            <div className="prompts-area visible">
                <div className="prompt-box">
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Account</div>
                    <div>{user?.email || 'Guest'}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Tier: {tier}</div>
                </div>
                <div className="prompt-box">
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Preferences</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Auto-Copy</span>
                        <input type="checkbox" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <main className="main-content">

                {view === 'main' && renderMainContent()}
                {view === 'history' && renderHistory()}
                {view === 'settings' && renderSettings()}

            </main>

            {/* Upgrade Button - Show on all views */}
            <button className={`upgrade-pill ${isExpanded || view !== 'main' ? 'visible' : ''}`}>
                Upgrade
            </button>

            {/* Footer */}
            <footer className="app-footer">
                <div className="footer-profile-section">
                    <div className="footer-avatar">
                        {user?.picture ? <img src={user.picture} alt="u" /> : <IconUser />}
                    </div>
                    <div className="footer-user-info">
                        <span className="footer-name">{user?.name || 'Guest'}</span>
                        <span className="footer-badge">{tier}</span>
                    </div>
                </div>

                <div className="footer-actions">
                    <button
                        className={`footer-icon-btn ${view === 'history' ? 'active' : ''}`}
                        onClick={() => setView(view === 'history' ? 'main' : 'history')}
                        title="History"
                    >
                        <IconHistory />
                    </button>
                    <button
                        className={`footer-icon-btn ${view === 'settings' ? 'active' : ''}`}
                        onClick={() => setView(view === 'settings' ? 'main' : 'settings')}
                        title="Settings"
                    >
                        <IconSettings />
                    </button>
                </div>
            </footer>
        </div>
    );
}
