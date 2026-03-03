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
    return (
        <button
            disabled={loading}
            style={{
                width: '100%', padding: '1.1rem',
                background: loading ? 'var(--outline-variant)' : (isPrimary ? 'var(--on-surface)' : 'transparent'),
                color: isPrimary ? 'var(--surface)' : 'var(--on-surface)',
                border: isPrimary ? 'none' : '1px solid var(--outline-variant)',
                borderRadius: '16px', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '1.1rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isPrimary && !loading ? '0 8px 30px rgba(0,0,0,0.15)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem'
            }}
            onMouseOver={(e) => {
                if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    if (isPrimary) e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                }
            }}
            onMouseOut={(e) => {
                if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    if (isPrimary) e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
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
                    width: '100%', padding: '0.8rem 1.5rem',
                    background: '#25D366', color: '#fff',
                    border: 'none', borderRadius: '100px',
                    fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem',
                    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                {...props}
            >
                <span style={{ fontSize: '1.2rem' }}>💬</span> Share on WhatsApp
            </button>
        </a>
    );
};
