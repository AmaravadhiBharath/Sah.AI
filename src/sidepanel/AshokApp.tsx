import { useState, useEffect, useRef } from 'react';
import type { ExtractionResult, Mode } from '../types';
import {
    initializeAuth,
    type ChromeUser,
} from '../services/auth';
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

const IconSettings = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
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

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════

const HistoryView = () => (
    <div className="view-inner">
        <div className="section-title">Past Extractions</div>
        <div className="empty-state">No history available yet.</div>
    </div>
);

const SettingsView = () => (
    <div className="view-inner">
        <div className="section-title">Settings</div>
        <div className="settings-item">
            <span>Theme</span>
            <span className="value">System</span>
        </div>
        <div className="settings-item">
            <span>App Version</span>
            <span className="value">3.1.2</span>
        </div>
        <div className="settings-item">
            <span>Support</span>
            <span className="value link">Get Help</span>
        </div>
        <div className="settings-item">
            <span>Account</span>
            <span className="value">Active</span>
        </div>
    </div>
);

const ProfileView = ({ user, tier }: { user: ChromeUser | null, tier: string }) => (
    <div className="view-inner">
        <div className="section-title">Account Detail</div>
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
                <div className="stat-label">Daily Usage</div>
                <div className="stat-value">24 / 50</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">Member Since</div>
                <div className="stat-value">Jan 2026</div>
            </div>
        </div>

        <button className="auth-action-btn">
            {user ? 'Sign Out' : 'Sign In with Google'}
        </button>
    </div>
);


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

    const [status, setStatus] = useState<StatusInfo>({ supported: false, platform: null });
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [user, setUser] = useState<ChromeUser | null>(null);
    const [tier, setTier] = useState<string>('guest');

    const portRef = useRef<chrome.runtime.Port | null>(null);

    useEffect(() => {
        const port = chrome.runtime.connect({ name: 'sidepanel' });
        portRef.current = port;

        port.onMessage.addListener((message: any) => {
            if (message.action === 'EXTRACTION_RESULT' || message.action === 'EXTRACTION_FROM_PAGE_RESULT') {
                const res = message.result;
                setResult(res);
                setLoading(false);
                setIsExpanded(true);
                setView('home');
            } else if (message.action === 'STATUS_RESULT') {
                setStatus({ supported: message.supported, platform: message.platform });
            } else if (message.action === 'ERROR') {
                setLoading(false);
                setError(message.error);
                setIsExpanded(true);
            }
        });

        port.postMessage({ action: 'GET_STATUS' });

        initializeAuth().then(state => {
            setUser(state.user);
            setTier(state.tier);
        });

        return () => { port.disconnect(); };
    }, []);

    const handleGenerate = () => {
        setLoading(true);
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

    const handleDelete = () => {
        if (!result) return;
        if (selectedPrompts.size === 0) return;
        const remainingPrompts = result.prompts.filter((_, i) => !selectedPrompts.has(i));
        setResult({ ...result, prompts: remainingPrompts });
        setSelectedPrompts(new Set());
    };

    const handleCopy = async () => {
        if (!result) return;
        const promptsToCopy = selectedPrompts.size > 0
            ? result.prompts.filter((_, i) => selectedPrompts.has(i))
            : result.prompts;

        const text = promptsToCopy.map(p => p.content).join('\n\n');
        await navigator.clipboard.writeText(text);

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
                        summarize
                    </button>
                    <button
                        className="toggle-nav-btn"
                        onClick={() => openConfig('history')}
                        title="Go to Config"
                    >
                        <IconSettings />
                    </button>
                </div>
            );
        } else {
            return (
                <div className="toggle-row">
                    <button
                        className="toggle-nav-btn"
                        onClick={() => setView('home')}
                        title="Go to Home"
                        style={{ marginRight: 4 }}
                    >
                        <IconHome />
                    </button>
                    <button
                        className={`mode-btn ${configTab === 'history' ? 'active' : ''}`}
                        onClick={() => setConfigTab('history')}
                    >
                        History
                    </button>
                    <button
                        className={`mode-btn ${configTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setConfigTab('settings')}
                    >
                        Settings
                    </button>
                    <button
                        className={`mode-btn ${configTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setConfigTab('profile')}
                    >
                        Profile
                    </button>
                </div>
            );
        }
    };

    const renderContentArea = () => {
        let content;
        if (view === 'config') {
            if (configTab === 'history') content = <HistoryView />;
            else if (configTab === 'settings') content = <SettingsView />;
            else content = <ProfileView user={user} tier={tier} />;
        } else {
            content = (
                <>
                    {loading ? (
                        <div className="loader-minimal"></div>
                    ) : error ? (
                        <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>{error}</div>
                    ) : result ? (
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
                    ) : (
                        <div style={{ padding: 20, textAlign: 'center', opacity: 0.5 }}>...</div>
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
                    <div className={`controls-row ${islandExpanded ? 'visible' : ''}`}>
                        <button className="control-btn" onClick={handleBack}>
                            Back
                        </button>
                        {view === 'home' && result ? (
                            <button
                                className={`control-btn ${isEditing ? 'primary' : ''}`}
                                onClick={toggleEdit}
                            >
                                {isEditing ? 'Done' : 'Edit'}
                            </button>
                        ) : view === 'config' ? (
                            <button className="control-btn primary" onClick={handleBack}>
                                Save
                            </button>
                        ) : null}
                    </div>
                    {islandExpanded && renderContentArea()}
                    {view === 'home' && islandExpanded && (
                        <div className="action-buttons-container">
                            <button
                                className="dual-btn"
                                onClick={isEditing ? handleDelete : handleGenerate}
                                style={isEditing ? { color: '#ef4444', borderColor: '#ef4444' } : {}}
                            >
                                {isEditing ? `Delete (${selectedPrompts.size})` : 'Re-Generate'}
                            </button>
                            <button className="dual-btn" onClick={handleCopy}>
                                {isEditing ? `Copy (${selectedPrompts.size})` : 'Copy'}
                            </button>
                        </div>
                    )}
                    {view === 'home' && !islandExpanded && (
                        <button className="generate-btn-lg" onClick={handleGenerate} disabled={!status.supported}>
                            Generate
                        </button>
                    )}
                </div>
                <button className={`upgrade-pill ${islandExpanded ? 'visible' : ''}`}>
                    Upgrade
                </button>
            </main>

            <footer className="app-footer">
                <button className="footer-profile-btn" onClick={() => openConfig('profile')}>
                    <div className="footer-avatar-sm">
                        {user?.picture ? <img src={user.picture} alt="u" /> : <IconUser />}
                    </div>
                    <div className="footer-user-stack">
                        <span className="footer-name-min">{user?.name || 'Guest'}</span>
                        <span className="footer-badge-min">{tier}</span>
                    </div>
                </button>

                <div className="footer-status-area">
                    {status.platform && (
                        <div className="status-pill-active" title={`Connected to ${status.platform}`}>
                            <span className="status-dot"></span>
                            <span className="platform-name">{status.platform}</span>
                        </div>
                    )}
                </div>
            </footer>
        </div >
    );
}
