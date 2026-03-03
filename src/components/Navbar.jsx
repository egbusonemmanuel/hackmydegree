// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useTheme } from '../App';
import { WhatsAppButton, Button } from './SharedUI';

const Navbar = () => {
    const { user, profile, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleSignOut = async () => {
        console.log('[Navbar] Sign out clicked');
        try {
            await signOut();
            console.log('[Navbar] Sign out successful - forcing reload');
            window.location.href = '/';
        } catch (err) {
            console.error('[Navbar] Sign out error:', err);
            window.location.href = '/';
        }
    };

    return (
        <nav className="glass" style={{
            position: 'sticky', top: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 2.5rem',
            background: 'var(--surface)',
            borderBottom: '1px solid var(--outline-variant)',
            fontFamily: 'var(--font-header)',
            backdropFilter: 'blur(10px)',
        }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <span style={{ fontWeight: 900, fontSize: '1.6rem', color: 'var(--primary)', letterSpacing: '-0.04em' }}>
                    Hack<span style={{ color: 'var(--on-surface)' }}>MyDegree</span>
                </span>
            </Link>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/resources" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, transition: 'color 0.3s' }}>Resources</Link>
                <Link to="/tutors" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, transition: 'color 0.3s' }}>Tutors</Link>
                {user && <Link to="/upload" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, transition: 'color 0.3s' }}>Upload</Link>}

                <WhatsAppButton
                    text="Check out HackMyDegree — The ultimate resource platform for Nigerian students! 🚀"
                    style={{ width: 'auto', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                />

                <button
                    onClick={toggleTheme}
                    style={{
                        background: 'var(--surface-variant)', border: 'none', cursor: 'pointer', fontSize: '1.2rem',
                        width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--on-surface)', transition: 'all 0.3s ease',
                        borderBottom: '1px solid var(--outline-variant)'
                    }}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {profile?.is_pro && (
                            <span style={{
                                background: 'rgba(212, 160, 32, 0.1)', color: 'var(--primary)',
                                fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem',
                                borderRadius: '100px', border: '1px solid var(--primary)'
                            }}>PRO</span>
                        )}
                        <Link to="/dashboard" style={{ color: 'var(--on-surface)', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
                            {profile?.username || user.email?.split('@')[0]}
                        </Link>
                        <Button
                            variant="secondary"
                            onClick={handleSignOut}
                            style={{
                                width: 'auto', padding: '0.6rem 1.25rem',
                                fontSize: '0.9rem', fontWeight: 700,
                                borderRadius: '100px'
                            }}>
                            Sign Out
                        </Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link to="/login">
                            <button style={{
                                background: 'transparent', color: 'var(--on-surface)', border: '1px solid var(--outline-variant)',
                                borderRadius: '100px', padding: '0.7rem 1.5rem', cursor: 'pointer',
                                fontFamily: 'var(--font-header)', fontWeight: 700, fontSize: '0.95rem'
                            }}>Login</button>
                        </Link>
                        <Link to="/signup">
                            <button style={{
                                background: 'var(--on-surface)', color: 'var(--surface)', border: 'none',
                                borderRadius: '100px', padding: '0.7rem 1.75rem', cursor: 'pointer',
                                fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            }}>Join Free</button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
