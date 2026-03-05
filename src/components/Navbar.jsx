import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { useTheme } from '../App';
import { WhatsAppButton, Button } from './SharedUI';

const Navbar = () => {
    const { user, profile, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    return (
        <>
            <nav className="glass" style={{
                position: 'sticky', top: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                background: 'var(--surface)',
                borderBottom: '1px solid var(--outline-variant)',
                fontFamily: 'var(--font-header)',
                backdropFilter: 'blur(10px)',
            }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--primary)', letterSpacing: '-0.04em' }}>
                        Hack<span style={{ color: 'var(--on-surface)' }}>MyDegree</span>
                    </span>
                </Link>

                {/* Desktop Nav Items */}
                <div className="desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/resources" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Resources</Link>
                    <Link to="/tutors" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Tutors</Link>
                    {user && <Link to="/upload" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Upload</Link>}

                    <WhatsAppButton
                        text="Check out HackMyDegree — The ultimate resource platform for Nigerian students! 🚀"
                        style={{ width: 'auto', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                    />

                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'var(--surface-variant)', border: 'none', cursor: 'pointer', fontSize: '1.2rem',
                            width: 38, height: 38, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--on-surface)', borderBottom: '1px solid var(--outline-variant)'
                        }}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            {profile?.is_pro && (
                                <span style={{
                                    background: 'rgba(212, 160, 32, 0.1)', color: 'var(--primary)',
                                    fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem',
                                    borderRadius: '100px', border: '1px solid var(--primary)'
                                }}>PRO</span>
                            )}
                            <Link to="/dashboard" style={{ color: 'var(--on-surface)', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                                {profile?.username || user.email?.split('@')[0]}
                            </Link>
                            <Button variant="danger" onClick={handleSignOut} style={{ width: 'auto', padding: '0.6rem 1.25rem', fontSize: '0.85rem', gap: '0.5rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link to="/login"><Button variant="secondary" style={{ width: 'auto', padding: '0.5rem 1.25rem' }}>Login</Button></Link>
                            <Link to="/signup"><Button style={{ width: 'auto', padding: '0.5rem 1.5rem' }}>Join Free</Button></Link>
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <div className="mobile-only" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'var(--surface-variant)', border: 'none', cursor: 'pointer', fontSize: '1rem',
                            width: 36, height: 36, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--on-surface)', borderBottom: '1px solid var(--outline-variant)'
                        }}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <button onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'var(--on-surface)', fontSize: '1.5rem', cursor: 'pointer' }}>
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {isMenuOpen && (
                <div className="mobile-nav-overlay mobile-only">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                        <button onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'var(--on-surface)', fontSize: '2rem' }}>✕</button>
                    </div>

                    <Link to="/resources" className="mobile-nav-link" onClick={toggleMenu}>Explore Resources</Link>
                    <Link to="/tutors" className="mobile-nav-link" onClick={toggleMenu}>Find a Tutor</Link>
                    {user && <Link to="/upload" className="mobile-nav-link" onClick={toggleMenu}>Upload Study Material</Link>}
                    {user && <Link to="/dashboard" className="mobile-nav-link" onClick={toggleMenu}>My Dashboard</Link>}

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {!user ? (
                            <>
                                <Link to="/login" onClick={toggleMenu} style={{ display: 'block', width: '100%' }}>
                                    <Button variant="secondary" style={{ height: 56, width: '100%' }}>Log In</Button>
                                </Link>
                                <Link to="/signup" onClick={toggleMenu} style={{ display: 'block', width: '100%' }}>
                                    <Button style={{ height: 56, width: '100%' }}>Get Started Free</Button>
                                </Link>
                            </>
                        ) : (
                            <Button onClick={handleSignOut} variant="danger" style={{ height: 56, width: '100%', gap: '0.75rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Sign Out
                            </Button>
                        )}

                        <div style={{ marginTop: '1rem' }}>
                            <WhatsAppButton
                                text="Check out HackMyDegree — The ultimate resource platform for Nigerian students! 🚀"
                                style={{ width: '100%', height: 56 }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
