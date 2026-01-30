import { useState, useEffect, useCallback, useRef } from 'react';
import type { ExtractionResult, Mode, ScrapedPrompt } from '../types';
import { initializeAuth, subscribeToAuthChanges, type ChromeUser, type UserTier } from '../services/auth';
import './material.css';

// Component-specific types
type AppState = 'empty' | 'loading' | 'results';

interface Stats {
    prompts: number;
    characters: number;
    elapsed: number;
}

function friendlyError(error: string): string {
    if (error.includes('timeout')) return 'Request took too long. Please try again.';
    if (error.includes('empty')) return 'No content to process. Start a conversation first.';
    if (error.includes('quota') || error.includes('limit')) return 'Daily limit reached. Upgrade for more.';
    return error.length > 100 ? error.slice(0, 100) + '...' : error;
}

export default function App() {
    // Navigation and UI State
    const [mode, setMode] = useState<Mode>('raw');
    const [appState, setAppState] = useState<AppState>('empty');

    // Data State
    const [prompts, setPrompts] = useState<ScrapedPrompt[]>([]);
    const [summary, setSummary] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<Stats>({ prompts: 0, characters: 0, elapsed: 0 });
    const [platform, setPlatform] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(false);
    const [selectedPrompts, setSelectedPrompts] = useState<Set<number>>(new Set());

    // User State
    const [user, setUser] = useState<ChromeUser | null>(null);
    const [tier, setTier] = useState<UserTier>('guest');

    // Messaging Infrastructure
    const portRef = useRef<chrome.runtime.Port | null>(null);
    const modeRef = useRef<Mode>(mode);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync mode ref for callbacks
    useEffect(() => { modeRef.current = mode; }, [mode]);

    // Handle messages from the extension
    const handlePortMessage = useCallback((message: any) => {
        console.log('[AppMaterial] Received message:', message.action);

        switch (message.action) {
            case 'STATUS_RESULT':
                setIsSupported(message.supported);
                setPlatform(message.platform);
                break;

            case 'EXTRACTION_RESULT':
            case 'EXTRACTION_FROM_PAGE_RESULT':
                const res: ExtractionResult = message.result;
                setPrompts(res.prompts);

                if (modeRef.current === 'summary' && res.prompts.length > 0) {
                    portRef.current?.postMessage({ action: 'SUMMARIZE_PROMPTS', prompts: res.prompts });
                } else {
                    setAppState('results');
                    if (timerRef.current) clearInterval(timerRef.current);
                }
                break;

            case 'SUMMARY_RESULT':
                if (message.success && message.result?.summary) {
                    setSummary(message.result.summary);
                } else {
                    setError(friendlyError(message.error || 'Summary failed'));
                }
                setAppState('results');
                if (timerRef.current) clearInterval(timerRef.current);
                break;

            case 'ERROR':
                setError(friendlyError(message.error));
                setAppState('empty');
                if (timerRef.current) clearInterval(timerRef.current);
                break;
        }
    }, []);

    // Initialize and Maintain Connection
    useEffect(() => {
        // 1. Initialize Auth
        initializeAuth().then(state => {
            setUser(state.user);
            setTier(state.tier);
        });

        const unsubAuth = subscribeToAuthChanges((newUser) => {
            setUser(newUser);
        });

        // 2. Connect to Extension Core
        const port = chrome.runtime.connect({ name: 'sidepanel' });
        portRef.current = port;
        port.onMessage.addListener(handlePortMessage);

        // Initial status check
        port.postMessage({ action: 'GET_STATUS' });

        return () => {
            unsubAuth();
            port.disconnect();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [handlePortMessage]);

    const handleGenerate = () => {
        if (!isSupported) {
            setError("Please navigate to ChatGPT, Claude, or Gemini to extract prompts.");
            return;
        }

        setAppState('loading');
        setError(null);
        setSummary(null);
        setPrompts([]);

        // Start elapsed timer
        const startTime = Date.now();
        setStats({ prompts: 0, characters: 0, elapsed: 0 });

        timerRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            setStats(prev => ({
                ...prev,
                elapsed
            }));
        }, 100);

        // Send real extraction request
        portRef.current?.postMessage({
            action: 'EXTRACT_PROMPTS',
            mode: mode
        });
    };

    const handleBack = () => {
        setAppState('empty');
        setPrompts([]);
        setSummary(null);
        setError(null);
        setSelectedPrompts(new Set());
    };

    const handleCopy = () => {
        const textToCopy = summary || prompts.map(p => p.content).join('\n\n');
        navigator.clipboard.writeText(textToCopy);
    };

    const togglePromptSelection = (index: number) => {
        const newSelected = new Set(selectedPrompts);
        if (newSelected.has(index)) newSelected.delete(index);
        else newSelected.add(index);
        setSelectedPrompts(newSelected);
    };

    const getPlatformName = (p: string | null) => {
        if (!p) return null;
        if (p === 'chatgpt') return 'ChatGPT';
        if (p === 'claude') return 'Claude';
        if (p === 'gemini') return 'Gemini';
        return p.charAt(0).toUpperCase() + p.slice(1);
    };

    // UI Components
    return (
        <div className="md-container">
            {/* === EMPTY STATE === */}
            {appState === 'empty' && (
                <div className="md-flex-column md-flex-center md-gap-2xl md-animate-fade-in" style={{ flex: 1 }}>
                    <div className="md-segmented-button">
                        <button className={`md-segment ${mode === 'raw' ? 'active' : ''}`} onClick={() => setMode('raw')}>Extract</button>
                        <button className={`md-segment ${mode === 'summary' ? 'active' : ''}`} onClick={() => setMode('summary')}>summarize</button>
                    </div>
                    <button className="md-filled-button" onClick={handleGenerate} disabled={!isSupported}>Generate</button>
                    {error && <div className="md-caption md-mt-md" style={{ color: 'var(--md-error)' }}>{error}</div>}
                </div>
            )}

            {/* === LOADING STATE === */}
            {appState === 'loading' && (
                <div className="md-flex-column md-gap-3xl md-animate-fade-in">
                    <div className="md-flex-center">
                        <div className="md-segmented-button">
                            <button className={`md-segment ${mode === 'raw' ? 'active' : ''}`}>Extract</button>
                            <button className={`md-segment ${mode === 'summary' ? 'active' : ''}`}>summarize</button>
                        </div>
                    </div>
                    <div className="md-flex-column md-gap-md md-text-center" style={{ marginTop: '80px' }}>
                        <div className="md-body">loading...</div>
                        {platform && <div className="md-label">{getPlatformName(platform)} detected</div>}
                        <div className="md-flex-column md-gap-xs md-mt-xl">
                            <div className="md-body">{stats.prompts} Prompts</div>
                            <div className="md-body">{Math.floor(stats.elapsed * 700)} char</div>
                            <div className="md-body">{stats.elapsed.toFixed(1)}sec..</div>
                        </div>
                    </div>
                    <div className="md-flex-center md-mt-3xl">
                        <button className="md-filled-button" disabled>Generating</button>
                    </div>
                </div>
            )}

            {/* === RESULTS STATE === */}
            {appState === 'results' && (
                <div className="md-flex-column md-gap-2xl md-animate-fade-in">
                    <div className="md-flex-center">
                        <div className="md-segmented-button">
                            <button className={`md-segment ${mode === 'raw' ? 'active' : ''}`}>Extract</button>
                            <button className={`md-segment ${mode === 'summary' ? 'active' : ''}`}>summarize</button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button className="md-text-button" onClick={handleBack}>Back</button>
                        <button className="md-text-button">Edit</button>
                    </div>
                    <div className="md-flex-column md-gap-md">
                        {(summary ? [{ content: summary, index: 1 }] : prompts).map((p, i) => (
                            <div key={i} className="md-card">
                                <div className="card-number">{i + 1}</div>
                                <label className="card-checkbox-label">
                                    <span className="md-caption">checkbox</span>
                                    <input type="checkbox" checked={selectedPrompts.has(i)} onChange={() => togglePromptSelection(i)} />
                                </label>
                                <div className="md-body" style={{ paddingRight: '20px' }}>{p.content}</div>
                            </div>
                        ))}
                    </div>
                    <div className="md-flex-center md-gap-md">
                        <button className="md-outlined-button" onClick={handleGenerate}>Re-Generate</button>
                        <button className="md-outlined-button" onClick={handleCopy}>copy</button>
                    </div>
                    <button className="md-filled-button md-mt-lg" style={{ background: 'var(--md-surface-variant)', color: 'var(--md-on-surface-variant)', boxShadow: 'none' }}>upgrade</button>
                </div>
            )}

            {/* === FOOTER (ALWAYS VISIBLE) === */}
            <footer className="md-footer">
                <div className="md-footer-left">
                    <div className="md-avatar">
                        {user?.picture ? <img src={user.picture} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : <div style={{ fontSize: '20px' }}>👤</div>}
                    </div>
                    <div className="md-footer-profile">
                        <div className="md-footer-name">{(user?.name || 'Bharath Amaravadi').toUpperCase()}</div>
                        <div className="md-footer-badge">{(tier || 'Admin').charAt(0).toUpperCase() + (tier || 'Admin').slice(1)}</div>
                    </div>
                </div>
                <div className="md-footer-right">
                    <button className="md-icon-button" title="Settings">⚙️</button>
                    <button className="md-icon-button" title="History">🕒</button>
                </div>
            </footer>
        </div>
    );
}
