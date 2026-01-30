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
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
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
    const [isExpanded, setIsExpanded] = useState(false);

    // Data State
    const [status, setStatus] = useState<StatusInfo>({ supported: false, platform: null });
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // User State
    const [user, setUser] = useState<ChromeUser | null>(null);
    // UserTier removed from component state as it was unused, but might be needed for rendering footer badge? 
    // Wait, I removed the import but I kept the JSX: <span className="footer-badge">{tier}</span>
    // This will error if I remove the state but keep the JSX.
    // I need to check my last edit. I removed getUserTier import. 
    // I should also remove the JSX usage or restore the state logic properly.
    // In the last successful write (Step 247), I had:
    // const [tier, setTier] = useState<UserTier>('guest');
    // and initializeAuth().then(state => { ... setTier(state.tier); });
    // But Step 254 failed because 'getUserTier' was unused in imports? 
    // Ah, 'getUserTier' was imported but maybe not used if I removed the call to it?
    // Let's re-add the tier logic cleanly.

    const [tier, setTier] = useState<string>('guest');

    const portRef = useRef<chrome.runtime.Port | null>(null);

    // ═══════════════════════════════════════════════════
    // EFFECTS & LOGIC
    // ═══════════════════════════════════════════════════

    useEffect(() => {
        const port = chrome.runtime.connect({ name: 'sidepanel' });
        portRef.current = port;

        port.onMessage.addListener((message: any) => {
            if (message.action === 'EXTRACTION_RESULT' || message.action === 'EXTRACTION_FROM_PAGE_RESULT') {
                const res = message.result;
                setResult(res);
                setLoading(false);
                setIsExpanded(true);
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

        if (portRef.current) {
            portRef.current.postMessage({ action: 'EXTRACT_PROMPTS', mode });
        }
    };

    const handleBack = () => {
        setIsExpanded(false);
        setResult(null);
        setLoading(false);
        setError(null);
    };

    const handleCopy = async () => {
        if (!result) return;
        const text = result.prompts.map(p => p.content).join('\n\n');
        await navigator.clipboard.writeText(text);
    };

    // ═══════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════

    return (
        <div className="app-container">
            <main className="main-content">

                {/* THE ISLAND */}
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
                        <button className="control-btn">Edit</button>
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
                                    <div key={i} className="prompt-box">
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
                            <button className="dual-btn" onClick={handleGenerate}>
                                Re-Generate
                            </button>
                            <button className="dual-btn" onClick={handleCopy}>
                                Copy
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

                {/* Upgrade Button */}
                <button className={`upgrade-pill ${isExpanded ? 'visible' : ''}`}>
                    Upgrade
                </button>

            </main>

            {/* Footer: Details Left, Icons Right */}
            <footer className="app-footer">

                {/* Profile Section */}
                <div className="footer-profile-section">
                    <div className="footer-avatar">
                        {user?.picture ? <img src={user.picture} alt="u" /> : <IconUser />}
                    </div>
                    <div className="footer-user-info">
                        <span className="footer-name">{user?.name || 'Guest'}</span>
                        <span className="footer-badge">{tier}</span>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="footer-actions">
                    <button className="footer-icon-btn" title="History">
                        <IconHistory />
                    </button>
                    <button className="footer-icon-btn" title="Settings">
                        <IconSettings />
                    </button>
                </div>
            </footer>
        </div>
    );
}
