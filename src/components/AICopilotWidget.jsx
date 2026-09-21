// src/components/AICopilotWidget.jsx
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendAIMessage, AI_MODES } from '../lib/ai';
import { SparklesIcon } from './SharedUI';

export default function AICopilotWidget() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState('tutor');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const widgetEndRef = useRef(null);

    // Don't display widget on the full AI assistant page itself
    if (location.pathname === '/ai-assistant') {
        return null;
    }

    const handleQuickAsk = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim() || loading) return;

        setLoading(true);
        setResponse(null);

        try {
            const res = await sendAIMessage({
                prompt: query.trim(),
                mode: mode
            });
            setResponse(res.content);
        } catch (err) {
            console.error('[CopilotWidget] Error:', err);
            setResponse(err?.message || 'DegreeAI could not answer right now. Please try again.');
        } finally {
            setLoading(false);
            setTimeout(() => {
                widgetEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const handleOpenFullWorkspace = () => {
        navigate('/ai-assistant', {
            state: {
                initialPrompt: query.trim() || null,
                mode: mode
            }
        });
        setIsOpen(false);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            fontFamily: 'var(--font-body)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '12px',
        }}>
            {/* Pop-up Quick AI Assistant Box */}
            {isOpen && (
                <div className="copilot-widget-box" style={{
                    width: '360px',
                    maxHeight: '500px',
                    background: 'var(--surface)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: '20px',
                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    order: -1,
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '0.85rem 1rem',
                        background: 'var(--surface-variant)',
                        borderBottom: '1px solid var(--outline-variant)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '8px',
                                background: 'var(--primary-container)',
                                border: '1px solid rgba(188, 149, 92, 0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <SparklesIcon size={15} color="var(--primary)" />
                            </div>
                            <div>
                                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--on-surface)' }}>
                                    Degree<span style={{ color: 'var(--primary)' }}>AI</span> Copilot
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <button
                                onClick={handleOpenFullWorkspace}
                                title="Expand to Full Workspace"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '6px'
                                }}
                            >
                                ↗ Full View
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--on-surface-variant)',
                                    cursor: 'pointer',
                                    fontSize: '1.1rem',
                                    lineHeight: 1
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Mode pills */}
                    <div style={{
                        display: 'flex',
                        gap: '0.35rem',
                        padding: '0.6rem 0.8rem',
                        background: 'var(--surface-variant)',
                        borderBottom: '1px solid var(--outline-variant)',
                        overflowX: 'auto'
                    }}>
                        {AI_MODES.slice(0, 4).map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                style={{
                                    fontSize: '0.72rem',
                                    fontWeight: mode === m.id ? 800 : 600,
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '100px',
                                    border: mode === m.id ? '1px solid var(--primary)' : '1px solid var(--outline-variant)',
                                    background: mode === m.id ? 'var(--primary)' : 'var(--surface)',
                                    color: mode === m.id ? '#000' : 'var(--on-surface)',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {m.icon} {m.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>

                    {/* Chat Content Body */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '0.85rem 1rem',
                        minHeight: '140px',
                        maxHeight: '260px',
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        color: 'var(--on-surface)'
                    }}>
                        {!response && !loading && (
                            <div style={{ color: 'var(--on-surface-variant)', textAlign: 'center', padding: '1.5rem 0' }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>💡</div>
                                <div style={{ fontWeight: 700 }}>Ask any quick study question</div>
                                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                    Formulas, definitions, exam prep, or coding questions.
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', padding: '1rem 0' }}>
                                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⌛</span>
                                <span>DegreeAI is generating solution...</span>
                            </div>
                        )}

                        {response && (
                            <div style={{
                                background: 'var(--surface-variant)',
                                padding: '0.85rem',
                                borderRadius: '12px',
                                border: '1px solid var(--outline-variant)',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {response}
                            </div>
                        )}
                        <div ref={widgetEndRef} />
                    </div>

                    {/* Quick Input Box */}
                    <form onSubmit={handleQuickAsk} style={{
                        padding: '0.75rem',
                        background: 'var(--surface)',
                        borderTop: '1px solid var(--outline-variant)',
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type homework or study question..."
                            style={{
                                flex: 1,
                                background: 'var(--surface-variant)',
                                border: '1px solid var(--outline-variant)',
                                borderRadius: '10px',
                                padding: '0.5rem 0.75rem',
                                color: 'var(--on-surface)',
                                fontSize: '0.82rem',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!query.trim() || loading}
                            style={{
                                background: query.trim() && !loading ? 'var(--primary)' : 'var(--outline-variant)',
                                color: query.trim() && !loading ? '#000' : 'var(--on-surface-variant)',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '0.5rem 0.9rem',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                cursor: query.trim() && !loading ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Ask
                        </button>
                    </form>
                </div>
            )}

            {/* Circular FAB Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="DegreeAI Copilot"
                title="DegreeAI Copilot"
                style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: isOpen
                        ? 'var(--surface-variant)'
                        : 'linear-gradient(135deg, #C9963E 0%, #A67628 100%)',
                    color: isOpen ? 'var(--on-surface-variant)' : '#000',
                    border: isOpen
                        ? '1px solid var(--outline-variant)'
                        : '2px solid rgba(201,150,62,0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isOpen
                        ? 'none'
                        : '0 4px 18px rgba(188, 149, 92, 0.45), 0 0 0 4px rgba(201,150,62,0.12)',
                    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isOpen ? 'rotate(45deg) scale(0.95)' : 'rotate(0deg) scale(1)',
                    flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.transform = 'scale(1.08)';
                        e.currentTarget.style.boxShadow = '0 6px 24px rgba(188,149,92,0.55), 0 0 0 6px rgba(201,150,62,0.15)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = isOpen ? 'rotate(45deg) scale(0.95)' : 'rotate(0deg) scale(1)';
                    e.currentTarget.style.boxShadow = isOpen
                        ? 'none'
                        : '0 4px 18px rgba(188,149,92,0.45), 0 0 0 4px rgba(201,150,62,0.12)';
                }}
            >
                {isOpen
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    : <SparklesIcon size={20} color="#000" />
                }
            </button>
        </div>
    );
}
