import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { useTheme } from '../App';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { WhatsAppButton, Button, SparklesIcon } from './SharedUI';

import PlatformClarityModal from './PlatformClarityModal';

/* ─── Inline style helpers ─── */
const NAV_LINK = {
    base: {
        color: 'var(--on-surface-variant)',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: 600,
        fontFamily: 'var(--font-header)',
        padding: '0.35rem 0.6rem',
        borderRadius: '8px',
        transition: 'all 0.18s ease',
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
    },
};

function NavLink({ to, children, onClick, style = {} }) {
    const location = useLocation();
    const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
    return (
        <Link
            to={to}
            onClick={onClick}
            style={{
                ...NAV_LINK.base,
                color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
                background: isActive ? 'var(--primary-container)' : 'transparent',
                ...style,
            }}
            onMouseEnter={e => {
                if (!isActive) {
                    e.currentTarget.style.color = 'var(--on-surface)';
                    e.currentTarget.style.background = 'var(--surface-variant)';
                }
            }}
            onMouseLeave={e => {
                if (!isActive) {
                    e.currentTarget.style.color = 'var(--on-surface-variant)';
                    e.currentTarget.style.background = 'transparent';
                }
            }}
        >
            {children}
        </Link>
    );
}



const Navbar = ({ onOpenSearch }) => {
    const { user, profile, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { selectedUniversity, setSelectedUniversity, selectedLevel, setSelectedLevel, universities, levels } = useUserPreferences();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUniModalOpen, setIsUniModalOpen] = useState(false);
    const [isClarityModalOpen, setIsClarityModalOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            window.location.href = '/';
        } catch (err) {
            console.error('[Navbar] Sign out error:', err);
            window.location.href = '/';
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const campusLabel = selectedUniversity === 'ALL' ? 'All Campuses' : selectedUniversity;
    const levelLabel = selectedLevel !== 'All Levels' ? selectedLevel.replace(' Level', 'L') : null;

    return (
        <>
            {/* ── MAIN NAV BAR ── */}
            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 clamp(0.75rem, 3vw, 1.5rem)',
                height: '60px',
                background: theme === 'dark'
                    ? 'rgba(14, 16, 21, 0.92)'
                    : 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--outline-variant)',
                fontFamily: 'var(--font-header)',
                gap: '0.75rem',
            }}>

                {/* ── LEFT: Logo ── */}
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            letterSpacing: '-0.025em',
                            fontFamily: 'var(--font-header)',
                            lineHeight: 1,
                        }}>
                            <span style={{ color: 'var(--primary)' }}>Hack</span>
                            <span style={{ color: 'var(--on-surface)' }}>MyDegree</span>
                        </span>
                    </Link>
                </div>

                {/* ── CENTER: Nav links (desktop only) ── */}
                <div className="desktop-only" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flex: 1,
                    justifyContent: 'center',
                    maxWidth: '460px',
                    margin: '0 auto',
                }}>
                    <NavLink to="/resources">Resources</NavLink>
                    <NavLink to="/skills">Skills Hub</NavLink>
                    <NavLink to="/tutors">Tutors</NavLink>

                    {/* DegreeAI — highlighted pill */}
                    <Link to="/ai-assistant" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.8rem',
                        borderRadius: '8px',
                        background: 'var(--primary-container)',
                        border: '1px solid rgba(201,150,62,0.25)',
                        color: 'var(--primary)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.18s ease',
                        fontFamily: 'var(--font-header)',
                    }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(201,150,62,0.22)';
                            e.currentTarget.style.boxShadow = '0 0 14px rgba(201,150,62,0.18)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'var(--primary-container)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <SparklesIcon size={12} color="var(--primary)" />
                        <span>DegreeAI</span>
                    </Link>
                </div>

                {/* ── RIGHT: Actions (desktop only) ── */}
                <div className="desktop-only" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexShrink: 0,
                }}>
                    {/* Search pill */}
                    <button
                        onClick={onOpenSearch}
                        title="Quick Search (Ctrl+K)"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            background: 'var(--surface-variant)',
                            border: '1px solid var(--outline-variant)',
                            borderRadius: '8px',
                            padding: '0.38rem 0.75rem',
                            cursor: 'pointer',
                            color: 'var(--on-surface-variant)',
                            fontSize: '0.82rem',
                            fontFamily: 'var(--font-header)',
                            transition: 'all 0.18s ease',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.color = 'var(--on-surface)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--outline-variant)';
                            e.currentTarget.style.color = 'var(--on-surface-variant)';
                        }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <span>Search</span>
                        <kbd style={{
                            background: 'var(--outline-variant)',
                            border: '1px solid var(--outline)',
                            borderRadius: '4px',
                            padding: '0.05rem 0.3rem',
                            fontSize: '0.65rem',
                            color: 'var(--primary)',
                            fontWeight: 600,
                            lineHeight: 1.5,
                        }}>⌘K</kbd>
                    </button>

                    {/* Upload (logged in only) */}
                    {user && (
                        <Link to="/upload" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            color: 'var(--on-surface-variant)',
                            textDecoration: 'none',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            padding: '0.38rem 0.7rem',
                            borderRadius: '8px',
                            background: 'var(--surface-variant)',
                            border: '1px solid var(--outline-variant)',
                            transition: 'all 0.18s ease',
                            whiteSpace: 'nowrap',
                            fontFamily: 'var(--font-header)',
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'var(--primary)';
                                e.currentTarget.style.color = 'var(--primary)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'var(--outline-variant)';
                                e.currentTarget.style.color = 'var(--on-surface-variant)';
                            }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Upload
                        </Link>
                    )}

                    {/* Campus picker */}
                    <button
                        onClick={() => setIsUniModalOpen(true)}
                        title="Personalize your campus & level"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: 'rgba(201,150,62,0.08)',
                            border: '1px solid rgba(201,150,62,0.25)',
                            borderRadius: '8px',
                            padding: '0.38rem 0.7rem',
                            cursor: 'pointer',
                            color: 'var(--primary)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-header)',
                            transition: 'all 0.18s ease',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(201,150,62,0.15)';
                            e.currentTarget.style.borderColor = 'rgba(201,150,62,0.5)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(201,150,62,0.08)';
                            e.currentTarget.style.borderColor = 'rgba(201,150,62,0.25)';
                        }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span>{campusLabel}</span>
                        {levelLabel && (
                            <span style={{
                                background: 'rgba(201,150,62,0.2)',
                                borderRadius: '4px',
                                padding: '0.05rem 0.3rem',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                            }}>
                                {levelLabel}
                            </span>
                        )}
                    </button>

                    {/* How It Works Guide icon */}
                    <button
                        onClick={() => setIsClarityModalOpen(true)}
                        title="Platform Guide (How HackMyDegree Works)"
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: '8px',
                            background: 'var(--surface-variant)',
                            border: '1px solid var(--outline-variant)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--on-surface-variant)',
                            transition: 'all 0.18s ease',
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.color = 'var(--primary)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--outline-variant)';
                            e.currentTarget.style.color = 'var(--on-surface-variant)';
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                        </svg>
                    </button>

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: '8px',
                            background: 'var(--surface-variant)',
                            border: '1px solid var(--outline-variant)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            color: 'var(--on-surface)',
                            transition: 'all 0.18s ease',
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--outline-variant)'}
                    >
                        {theme === 'dark'
                            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                        }
                    </button>

                    {/* User section — EXACTLY ONE clean Dashboard button */}
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <Link to="/dashboard" title="Go to Student Dashboard" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                textDecoration: 'none',
                                background: 'var(--primary-container)',
                                border: '1px solid rgba(201, 150, 62, 0.35)',
                                padding: '0.3rem 0.75rem 0.3rem 0.35rem',
                                borderRadius: '100px',
                                transition: 'all 0.18s ease',
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(201, 150, 62, 0.22)';
                                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(201, 150, 62, 0.2)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'var(--primary-container)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #C9963E 0%, #A67628 100%)',
                                    color: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.7rem',
                                    flexShrink: 0,
                                }}>
                                    {(profile?.username || user.email)?.[0]?.toUpperCase()}
                                </div>
                                <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.82rem' }}>
                                    Dashboard
                                </span>
                                {profile?.is_pro && (
                                    <span style={{
                                        background: 'var(--primary)',
                                        color: '#000',
                                        fontSize: '0.58rem',
                                        fontWeight: 800,
                                        padding: '0.1rem 0.35rem',
                                        borderRadius: '4px',
                                        letterSpacing: '0.04em',
                                    }}>PRO</span>
                                )}
                            </Link>

                            {/* Sign out */}
                            <button
                                onClick={handleSignOut}
                                title="Sign out"
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '8px',
                                    background: 'transparent',
                                    border: '1px solid transparent',
                                    color: 'var(--on-surface-variant)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.18s ease',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = '#FF5252';
                                    e.currentTarget.style.borderColor = 'rgba(255,82,82,0.25)';
                                    e.currentTarget.style.background = 'rgba(255,82,82,0.06)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = 'var(--on-surface-variant)';
                                    e.currentTarget.style.borderColor = 'transparent';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            <Link to="/login" style={{
                                color: 'var(--on-surface-variant)',
                                textDecoration: 'none',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                padding: '0.38rem 0.75rem',
                                borderRadius: '8px',
                                transition: 'all 0.18s ease',
                                fontFamily: 'var(--font-header)',
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = 'var(--on-surface)';
                                    e.currentTarget.style.background = 'var(--surface-variant)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = 'var(--on-surface-variant)';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                Log in
                            </Link>
                            <Link to="/signup" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    background: 'linear-gradient(135deg, #C9963E 0%, #A67628 100%)',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.42rem 1rem',
                                    fontSize: '0.85rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-header)',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.18s ease',
                                    boxShadow: '0 2px 12px rgba(201,150,62,0.3)',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,150,62,0.45)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(201,150,62,0.3)'}
                                >
                                    Join Free →
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* ── MOBILE: Right side actions ── */}
                <div className="mobile-only mobile-nav-actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                        onClick={onOpenSearch}
                        aria-label="Search"
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: '8px',
                            background: 'var(--surface-variant)',
                            border: '1px solid var(--outline-variant)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--on-surface)',
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>

                    {user && (
                        <Link to="/dashboard" aria-label="Dashboard" style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #C9963E 0%, #A67628 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            color: '#000',
                            fontWeight: 900,
                            fontSize: '0.78rem',
                        }}>
                            {(profile?.username || user.email)?.[0]?.toUpperCase()}
                        </Link>
                    )}

                    {!user && (
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <button style={{
                                background: 'linear-gradient(135deg, #C9963E 0%, #A67628 100%)',
                                color: '#000',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.45rem 1rem',
                                fontFamily: 'var(--font-header)',
                                fontWeight: 800,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}>
                                Login
                            </button>
                        </Link>
                    )}

                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: '8px',
                            background: 'var(--surface-variant)',
                            border: '1px solid var(--outline-variant)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--on-surface)',
                        }}
                    >
                        {theme === 'dark'
                            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                        }
                    </button>

                    <button
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: '8px',
                            background: 'var(--surface-variant)',
                            border: '1px solid var(--outline-variant)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--on-surface)',
                            flexDirection: 'column',
                            gap: '4px',
                        }}
                    >
                        {isMenuOpen ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* ── MOBILE DRAWER ── */}
            {isMenuOpen && (
                <div className="mobile-nav-overlay mobile-only">
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                        <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary)', fontFamily: 'var(--font-header)' }}>
                            HackMyDegree
                        </span>
                        <button onClick={toggleMenu} style={{
                            background: 'none', border: 'none', color: 'var(--on-surface)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 32, height: 32,
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Auth area */}
                    {user ? (
                        <Link to="/dashboard" className="mobile-nav-link" onClick={toggleMenu} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            color: 'var(--primary)', fontWeight: 900,
                            background: 'var(--primary-container)',
                            borderRadius: '12px',
                            border: '1px solid rgba(188,149,92,0.3)',
                            marginBottom: '1rem',
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #C9963E 0%, #A67628 100%)',
                                    color: '#000', fontWeight: 900, fontSize: '0.78rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {(profile?.username || user.email)?.[0]?.toUpperCase()}
                                </div>
                                My Dashboard
                            </span>
                            <span style={{
                                fontSize: '0.72rem', background: 'var(--primary)', color: '#000',
                                padding: '0.15rem 0.5rem', borderRadius: '100px', fontWeight: 800,
                            }}>
                                {profile?.username || user.email?.split('@')[0]}
                            </span>
                        </Link>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                            <Link to="/login" onClick={toggleMenu} style={{ display: 'block', width: '100%' }}>
                                <Button style={{ height: 52, width: '100%', fontSize: '1rem' }}>Log In →</Button>
                            </Link>
                            <Link to="/signup" onClick={toggleMenu} style={{ display: 'block', width: '100%' }}>
                                <Button variant="secondary" style={{ height: 52, width: '100%', fontSize: '0.95rem' }}>Create Free Account</Button>
                            </Link>
                        </div>
                    )}

                    {/* Nav links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
                        <Link to="/resources" className="mobile-nav-link" onClick={toggleMenu}>📚 Academic Resources</Link>
                        <Link to="/skills" className="mobile-nav-link" onClick={toggleMenu} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>🛠 Skills Hub</span>
                            <span style={{ background: 'var(--primary-container)', color: 'var(--primary)', fontSize: '0.62rem', padding: '0.15rem 0.5rem', borderRadius: '100px', fontWeight: 700 }}>CURRICULUM</span>
                        </Link>
                        <Link to="/tutors" className="mobile-nav-link" onClick={toggleMenu}>👨‍🏫 Verified Tutors</Link>
                        <Link to="/ai-assistant" className="mobile-nav-link" onClick={toggleMenu} style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <SparklesIcon size={15} color="var(--primary)" />
                            DegreeAI Workspace
                        </Link>
                        {user && <Link to="/upload" className="mobile-nav-link" onClick={toggleMenu}>⬆ Upload Study Material</Link>}
                    </div>

                    {/* Platform guide */}
                    <button
                        onClick={() => { toggleMenu(); setIsClarityModalOpen(true); }}
                        className="mobile-nav-link"
                        style={{
                            background: 'rgba(217,119,6,0.1)',
                            border: '1px solid rgba(217,119,6,0.3)',
                            borderRadius: '12px',
                            padding: '0.85rem 1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            color: 'var(--primary)', fontWeight: 800, cursor: 'pointer',
                            width: '100%', textAlign: 'left', margin: '0.5rem 0',
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>💡</span>
                            <span>What is HackMyDegree?</span>
                        </span>
                        <span style={{ fontSize: '0.68rem', background: 'var(--primary)', color: '#000', padding: '0.15rem 0.5rem', borderRadius: '100px', fontWeight: 800 }}>GUIDE</span>
                    </button>

                    {/* Bottom actions */}
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.5rem' }}>
                        {user ? (
                            <Button onClick={handleSignOut} variant="secondary" style={{ height: 52, width: '100%' }}>Sign Out</Button>
                        ) : (
                            <>
                                <Link to="/login" onClick={toggleMenu} style={{ display: 'block', width: '100%' }}>
                                    <Button variant="secondary" style={{ height: 52, width: '100%' }}>Log In</Button>
                                </Link>
                                <Link to="/signup" onClick={toggleMenu} style={{ display: 'block', width: '100%' }}>
                                    <Button style={{ height: 52, width: '100%' }}>Get Started Free</Button>
                                </Link>
                            </>
                        )}
                        <WhatsAppButton
                            text="Check out HackMyDegree — The ultimate resource platform for Nigerian students! 🚀"
                            style={{ width: '100%', display: 'block' }}
                        />
                    </div>
                </div>
            )}

            {/* ── University & Level Modal ── */}
            {isUniModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 99999,
                    background: 'rgba(5, 5, 5, 0.88)', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
                }} onClick={() => setIsUniModalOpen(false)}>
                    <div style={{
                        background: '#131417',
                        color: '#FFFFFF',
                        border: '1px solid rgba(201, 150, 62, 0.3)',
                        borderRadius: '18px',
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem',
                        boxShadow: '0 30px 70px rgba(0,0,0,0.85)',
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '10px',
                                    background: 'rgba(201,150,62,0.15)',
                                    border: '1px solid rgba(201,150,62,0.25)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.1rem',
                                }}>🎓</div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-header)' }}>
                                    Personalize Your Feed
                                </h3>
                            </div>
                            <button onClick={() => setIsUniModalOpen(false)} style={{
                                width: 30, height: 30, borderRadius: '8px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#888',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        <p style={{ margin: 0, color: '#A0AEC0', fontSize: '0.85rem', lineHeight: 1.6 }}>
                            Select your Nigerian university and academic level so HackMyDegree can surface notes, past questions, and AI prompts tailored to your syllabus.
                        </p>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#C9963E', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                University
                            </label>
                            <select value={selectedUniversity} onChange={e => setSelectedUniversity(e.target.value)} style={{
                                width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                color: '#FFFFFF', fontSize: '0.9rem', outline: 'none',
                                fontFamily: 'var(--font-body)',
                            }}>
                                {universities.map(u => (
                                    <option key={u.code} value={u.code} style={{ background: '#181A1F', color: '#FFFFFF' }}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#C9963E', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Academic Level
                            </label>
                            <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} style={{
                                width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                color: '#FFFFFF', fontSize: '0.9rem', outline: 'none',
                                fontFamily: 'var(--font-body)',
                            }}>
                                {levels.map(l => (
                                    <option key={l} value={l} style={{ background: '#181A1F', color: '#FFFFFF' }}>
                                        {l}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button onClick={() => setIsUniModalOpen(false)} style={{
                            width: '100%', padding: '0.9rem', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #C9963E 0%, #A67628 100%)',
                            color: '#000', border: 'none', fontWeight: 800, fontSize: '0.92rem',
                            cursor: 'pointer', fontFamily: 'var(--font-header)',
                            boxShadow: '0 4px 20px rgba(201,150,62,0.3)',
                            marginTop: '0.25rem',
                        }}>
                            Save & Update Feed ✓
                        </button>
                    </div>
                </div>
            )}

            {/* Platform Clarity Modal */}
            <PlatformClarityModal
                isOpen={isClarityModalOpen}
                onClose={() => setIsClarityModalOpen(false)}
            />
        </>
    );
};

export default Navbar;
