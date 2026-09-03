// src/components/AICopilotWidget.jsx
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendAIMessage, AI_MODES } from '../lib/ai';

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
            fontFamily: 'var(--font-body)'
        }}>
            {/* Pop-up Quick AI Assistant Box */}
            {isOpen && (
                <div className="copilot-widget-box" style={{
                    position: 'absolute',
                    bottom: '68px',
                    right: 0,
                    width: '380px',
                    maxHeight: '520px',
                    background: 'var(--surface)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: '20px',
                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '0.85rem 1rem',
                        background: 'linear-gradient(135deg, rgba(212, 160, 32, 0.15), rgba(99, 102, 241, 0.1))',
                        borderBottom: '1px solid var(--outline-variant)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                                width: '28px', height: '28px', borderRadius: '8px',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#000', fontWeight: 900, fontSize: '0.9rem'
                            }}>
                                ⚡
                            </span>
                            <div>
                                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--on-surface)' }}>
                                    Degree<span style={{ color: 'var(--primary)' }}>AI</span> Quick Copilot
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

            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'linear-gradient(135deg, #d4a020 0%, #ff8c00 100%)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '0.75rem 1.35rem',
                    fontWeight: 900,
                    fontSize: '0.92rem',
                    fontFamily: 'var(--font-header)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 8px 24px rgba(212, 160, 32, 0.45)',
                    transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: isOpen ? 'scale(0.95)' : 'scale(1)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = isOpen ? 'scale(0.95)' : 'scale(1)'}
            >
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
                <span>DegreeAI</span>
                <span style={{
                    background: 'rgba(0,0,0,0.85)',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '100px',
                    letterSpacing: '0.04em'
                }}>
                    NEW
                </span>
            </button>
        </div>
    );
}
