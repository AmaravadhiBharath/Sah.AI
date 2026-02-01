import { useState, useEffect, useRef } from 'react';
import type { ExtractionResult, HistoryItem } from '../types';
import {
    initializeAuth,
    signInWithGoogle,
    signOut,
    subscribeToAuthChanges,
    type ChromeUser
} from '../services/auth';
import './kaboom.css';

export default function KaboomApp() {
    const [user, setUser] = useState<ChromeUser | null>(null);
    const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ supported: false, platform: null as string | null });
    const [selectedPrompts, setSelectedPrompts] = useState<number[]>([]);
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    const portRef = useRef<chrome.runtime.Port | null>(null);

    const [extractionTime, setExtractionTime] = useState<number | null>(null);
    const [liveTime, setLiveTime] = useState(0);
    const startTimeRef = useRef<number>(0);
    const timerRef = useRef<number | null>(null);

    const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0);
    const platforms = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'DeepSeek', 'Lovable', 'Bolt.new', 'Cursor', 'Meta AI'];

    const [viewingHistory, setViewingHistory] = useState(false);
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPlatformIndex(prev => (prev + 1) % platforms.length);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        initializeAuth().then(state => {
            setUser(state.user);
        });

        const unsubscribe = subscribeToAuthChanges((newUser) => {
            setUser(newUser);
            if (newUser) setShowPopup(false); // Close popup on login
        });

        const port = chrome.runtime.connect({ name: 'sidepanel' });
        portRef.current = port;

        const messageListener = (msg: any) => {
            if (msg.action === 'STATUS_RESULT') {
                setStatus({ supported: msg.supported, platform: msg.platform });
            } else if (msg.action === 'EXTRACTION_RESULT' || msg.action === 'EXTRACTION_FROM_PAGE_RESULT') {
                setExtractionResult(msg.result);
                setSelectedPrompts(msg.result.prompts.map((_: any, i: number) => i));
                setLoading(false);
                if (startTimeRef.current) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    const duration = (Date.now() - startTimeRef.current) / 1000;
                    setExtractionTime(parseFloat(duration.toFixed(1)));
                }
            } else if (msg.action === 'EXTRACT_TRIGERED_FROM_PAGE') {
                // The page button was clicked, so we set loading to true here
                setLoading(true);
                startTimeRef.current = Date.now();
                setExtractionTime(null);
                setLiveTime(0);
                if (timerRef.current) clearInterval(timerRef.current);
                timerRef.current = setInterval(() => {
                    const d = (Date.now() - startTimeRef.current) / 1000;
                    setLiveTime(parseFloat(d.toFixed(1)));
                }, 100) as unknown as number;

            } else if (msg.action === 'ERROR') {
                setLoading(false);
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
                alert(msg.error || 'Extraction failed');
            }
        };

        port.onMessage.addListener(messageListener);
        port.postMessage({ action: 'GET_STATUS' });

        return () => {
            port.onMessage.removeListener(messageListener);
            port.disconnect();
            unsubscribe();
        };
    }, []);

    const handleCopy = async () => {
        const text = extractionResult?.prompts
            .filter((_, i) => selectedPrompts.includes(i))
            .map(p => p.content).join('\n\n');
        if (text) {
            await navigator.clipboard.writeText(text);
            setCopyStatus('copied');

            // Notify content script to show Paste button
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const activeTab = tabs[0];
                if (activeTab?.id) {
                    chrome.tabs.sendMessage(activeTab.id, {
                        action: 'CONTENT_COPIED',
                        content: text
                    });
                }
            });

            setTimeout(() => setCopyStatus('idle'), 2000);
        }
    };

    const togglePromptSelection = (index: number) => {
        setSelectedPrompts(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const handleExtract = () => {
        if (!status.supported) return;
        setLoading(true);
        setViewingHistory(false);
        startTimeRef.current = Date.now();
        setExtractionTime(null);
        setLiveTime(0);

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            const d = (Date.now() - startTimeRef.current) / 1000;
            setLiveTime(parseFloat(d.toFixed(1)));
        }, 100) as unknown as number;

        portRef.current?.postMessage({ action: 'EXTRACT_PROMPTS', mode: 'raw' });
    };

    const loadHistory = () => {
        chrome.storage.local.get(['extractionHistory'], (result) => {
            if (result.extractionHistory) {
                // Sort by timestamp desc
                const sorted = (result.extractionHistory as HistoryItem[]).sort((a, b) => b.timestamp - a.timestamp);
                setHistoryItems(sorted);
            }
            setViewingHistory(true);
            setExtractionResult(null);
        });
    };

    const openHistoryItem = (item: HistoryItem) => {
        // Convert HistoryItem to ExtractionResult format to reuse the view
        const result: ExtractionResult = {
            platform: item.platform,
            url: '', // Not stored in history item usually, or retrieval needed
            title: item.preview, // Using preview as title fallback
            prompts: item.prompts,
            extractedAt: item.timestamp
        };
        setExtractionResult(result);
        setSelectedPrompts(item.prompts.map((_, i) => i));
        setViewingHistory(false);
    };

    const handleEarlyAccess = () => {
        if (!user) {
            alert('Please login with Google to request early access.');
            setShowPopup(false);
            return;
        }
        // Redirect to a form or show Success
        alert('Your request for early access has been recorded!');
        setShowPopup(false);
    };


    return (
        <div className="kb-app">
            <div className="kb-main-card kb-animate" onClick={() => showPopup && setShowPopup(false)}>
                <div className="kb-top-actions" onClick={(e) => e.stopPropagation()}>
                    {(extractionResult || viewingHistory) && !loading && (
                        <button
                            className="kb-back-btn"
                            onClick={() => {
                                if (extractionResult && !viewingHistory && historyItems.length > 0) {
                                    // If we are viewing a result but have history functionality, 
                                    // check if we came from history? 
                                    // For simplicity, back always goes to Home from result, 
                                    // unless we want 'Back to History'. 
                                    // Requirement: "history should show card in the same panel as the result"
                                    // Let's make Back go to Home always for now, or toggle history if user wants.
                                    setExtractionResult(null);
                                    setExtractionTime(null);
                                } else {
                                    setViewingHistory(false);
                                    setExtractionResult(null);
                                    setExtractionTime(null);
                                }
                            }}
                            title="Back to Home"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {extractionTime !== null && !loading && !viewingHistory && (
                        <span style={{
                            marginRight: 'auto',  /* Pushes everything else (profile) to the right */
                            fontSize: 11,
                            fontWeight: 500,
                            color: '#86868b',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            Extracted in {extractionTime}s
                        </span>
                    )}
                    {viewingHistory && !loading && (
                        <span style={{
                            marginRight: 'auto',
                            fontSize: 11,
                            fontWeight: 500,
                            color: '#86868b',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            History
                        </span>
                    )}
                    {user && !viewingHistory && (
                        <button
                            className="kb-profile-btn"
                            style={{ marginRight: 8 }}
                            onClick={loadHistory}
                            title="History"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </button>
                    )}
                    <button className="kb-profile-btn" onClick={() => setShowPopup(!showPopup)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>

                    {showPopup && (
                        <>
                            <div
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 999
                                }}
                                onClick={() => setShowPopup(false)}
                            />
                            <div className="kb-profile-popup">
                                {user && (
                                    <div style={{ padding: '12px 12px 8px 12px', borderBottom: '1px solid #f0f0f0', marginBottom: 4 }}>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 2 }}>{user.name}</p>
                                        <p style={{ fontSize: 11, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                                    </div>
                                )}
                                {!user ? (
                                    <button className="kb-popup-item" onClick={signInWithGoogle}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                                        </svg>
                                        Login with Google
                                    </button>
                                ) : (
                                    <button className="kb-popup-item logout" onClick={() => { signOut(); setShowPopup(false); }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                                        </svg>
                                        Logout
                                    </button>
                                )}
                                <div className="kb-popup-divider" />
                                <button className="kb-popup-item" onClick={handleEarlyAccess}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    Request Early Access
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {!user ? (
                    <div className="kb-login-container" style={{ flex: 1 }}>
                        <div className="kb-login-logo">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1 className="kb-login-title">SahAI v1</h1>
                        <p className="kb-login-sub">Extract prompts from AI tools instantly.</p>
                        <button className="kb-btn-pill" onClick={signInWithGoogle} style={{ padding: '10px 32px' }}>
                            Continue with Google
                        </button>
                    </div>
                ) : (
                    <div className="kb-content">
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 12 }}>
                                <svg className="kb-spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#000' }}>
                                    <circle cx="12" cy="12" r="10" strokeOpacity="0.1"></circle>
                                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path>
                                </svg>
                                <p style={{ fontSize: 13, color: '#999', fontVariantNumeric: 'tabular-nums' }}>
                                    Extracting..{liveTime.toFixed(1)} sec
                                </p>
                            </div>
                        ) : extractionResult ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {extractionResult.prompts.map((p, i) => (
                                    <div
                                        key={i}
                                        className={`kb-prompt-card ${selectedPrompts.includes(i) ? 'selected' : ''}`}
                                        onClick={() => togglePromptSelection(i)}
                                    >
                                        {p.content}
                                        {p.source === 'keylog' && (
                                            <div style={{ marginTop: 8 }}>
                                                <span style={{
                                                    fontSize: 9,
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    padding: '2px 6px',
                                                    borderRadius: 4,
                                                    background: '#FEEED4',
                                                    color: '#BC6C25'
                                                }}>
                                                    Captured
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : viewingHistory ? (
                            <div className="kb-hist-list-container">
                                {historyItems.length === 0 ? (
                                    <p style={{ fontSize: 13, color: '#999', textAlign: 'center', marginTop: 40 }}>No history yet.</p>
                                ) : (
                                    historyItems.map(item => (
                                        <div key={item.id} className="kb-history-card" onClick={() => openHistoryItem(item)}>
                                            <div className="kb-h-top">
                                                <span className="kb-h-platform">{item.platform}</span>
                                                <span className="kb-h-date">
                                                    {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="kb-h-preview">{item.preview}</div>
                                            <span className="kb-h-count">{item.promptCount} prompts</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: 20 }}>
                                <p style={{ fontSize: 13, color: '#999', lineHeight: 1.5, maxWidth: 220 }}>
                                    {status.supported
                                        ? `SahAI is connected to ${status.platform}.`
                                        : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                <span>Navigate to an AI chat like</span>
                                                <span className="kb-fade-text" key={currentPlatformIndex} style={{ color: '#000', fontSize: '1.2em' }}>
                                                    {platforms[currentPlatformIndex]}
                                                </span>
                                            </div>
                                        )}
                                </p>
                                {status.supported && (
                                    <button className="kb-btn-pill" onClick={handleExtract}>
                                        Extract
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {user && (
                    <div className="kb-card-footer">
                        <button
                            className="kb-btn-pill"
                            onClick={handleCopy}
                            disabled={!extractionResult || selectedPrompts.length === 0}
                            style={{ opacity: (!extractionResult || selectedPrompts.length === 0) ? 0.3 : 1 }}
                        >
                            {copyStatus === 'copied' ? 'copied!' : 'copy'}
                        </button>
                    </div>
                )}
            </div>

            <div className="kb-app-footer">
                <p className="kb-footer-text">
                    SahAI extracts and summarizes your conversations. Please double check outputs.
                </p>
            </div>
        </div >
    );
}
