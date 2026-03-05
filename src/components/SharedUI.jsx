// src/components/SharedUI.jsx
import React from 'react';

export const Banner = ({ type, msg }) => {
    const isErr = type === 'error';
    return (
        <div style={{
            padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem',
            fontSize: '0.95rem', fontWeight: 500, fontFamily: 'var(--font-body)',
            background: isErr ? 'rgba(255,82,82,0.1)' : 'var(--primary-container)',
            border: `1px solid ${isErr ? 'rgba(255,82,82,0.2)' : 'var(--outline-variant)'}`,
            color: isErr ? '#FF5252' : 'var(--primary)',
            animation: 'fadeIn 0.4s ease forwards',
            display: 'flex', gap: '0.8rem', alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
            <span style={{ fontSize: '1.2rem' }}>{isErr ? '⚠️' : '✅'}</span>
            <span>{msg}</span>
        </div>
    );
};

export const Field = ({ label, children, lit = true }) => {
    return (
        <div style={{ width: '100%', marginBottom: '1.5rem' }}>
            <label style={{
                display: 'block', marginBottom: '0.6rem',
                fontSize: '0.75rem', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '2px',
                fontFamily: 'var(--font-header)',
                color: lit ? 'var(--primary)' : 'rgba(212, 160, 32, 0.8)',
                transition: 'color 1s ease',
            }}>
                {label}
            </label>
            {children}
        </div>
    );
};

export const Input = ({ icon, ...props }) => {
    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <input
                style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'var(--surface)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: '14px', padding: '1.1rem 1.25rem',
                    color: 'var(--on-surface)', fontSize: '1rem',
                    fontFamily: 'var(--font-body)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    outline: 'none',
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 4px var(--primary-container)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'var(--outline-variant)';
                    e.target.style.boxShadow = 'none';
                }}
                {...props}
            />
            {icon && (
                <span style={{
                    position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--on-surface-variant)', opacity: 0.6
                }}>
                    {icon}
                </span>
            )}
        </div>
    );
};

export const Button = ({ children, variant = 'primary', loading = false, ...props }) => {
    const isPrimary = variant === 'primary';
    const isDanger = variant === 'danger';

    let background = 'transparent';
    let color = 'var(--on-surface)';
    let border = '1px solid var(--outline-variant)';

    if (isPrimary) {
        background = 'var(--on-surface)';
        color = 'var(--surface)';
        border = 'none';
    } else if (isDanger) {
        background = 'rgba(255, 82, 82, 0.1)';
        color = '#FF5252';
        border = '1px solid rgba(255, 82, 82, 0.2)';
    }

    return (
        <button
            disabled={loading}
            style={{
                width: '100%', padding: '1.1rem',
                background: loading ? 'var(--outline-variant)' : background,
                color: loading ? 'var(--outline)' : color,
                border: border,
                borderRadius: '16px', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '1rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isPrimary && !loading ? '0 8px 30px rgba(0,0,0,0.15)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem'
            }}
            onMouseOver={(e) => {
                if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    if (isPrimary) e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                    if (isDanger) {
                        e.currentTarget.style.background = 'rgba(255, 82, 82, 0.15)';
                    }
                }
            }}
            onMouseOut={(e) => {
                if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    if (isPrimary) e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                    if (isDanger) {
                        e.currentTarget.style.background = 'rgba(255, 82, 82, 0.1)';
                    }
                }
            }}
            {...props}
        >
            {loading ? (
                <div style={{
                    width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                }} />
            ) : children}
        </button>
    );
};

export const WhatsAppButton = ({ text, url = window.location.origin, ...props }) => {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    return (
        <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', width: '100%' }}
        >
            <button
                style={{
                    width: '100%', padding: '0.85rem 1.75rem',
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: '#fff',
                    border: 'none', borderRadius: '100px',
                    fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.9rem',
                    cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    boxShadow: '0 8px 20px rgba(37, 211, 102, 0.25)',
                    borderBottom: '2px solid rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.4)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 211, 102, 0.25)';
                }}
                {...props}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766h.001c.001-3.18-2.587-5.765-5.765-5.765zm3.333 8.164c-.145.412-.729.742-1.012.787-.247.039-.569.062-1.603-.362-1.325-.544-2.18-1.879-2.247-1.968-.066-.09-.536-.713-.536-1.37s.344-.981.467-1.114c.123-.132.27-.165.361-.165.091 0 .181.001.258.006.082.003.193-.031.302.235.112.274.385.938.419 1.005.035.068.058.146.013.235-.045.09-.068.146-.135.225-.068.079-.142.176-.203.236-.068.067-.139.139-.06.276.08.136.353.582.757.941.52.462.96.605 1.096.669.136.064.215.053.294-.038.08-.09.339-.395.429-.529.09-.136.181-.113.306-.067.124.045.789.373.924.441.136.067.226.101.259.157.034.057.034.331-.111.743zM12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                </svg>
                Share on WhatsApp
            </button>
        </a>
    );
};
