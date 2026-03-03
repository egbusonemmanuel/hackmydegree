// src/components/PageLoader.jsx
import React from 'react';

const PageLoader = () => (
    <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--surface)'
    }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: 48, height: 48, border: '4px solid var(--outline-variant)',
                borderTopColor: 'var(--primary)', borderRadius: '50%',
                animation: 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite', margin: '0 auto 1.5rem'
            }} />
            <p style={{
                color: 'var(--on-surface)',
                fontFamily: 'var(--font-header)',
                fontSize: '1.2rem',
                fontWeight: 800,
                letterSpacing: '-0.02em'
            }}>
                Hack<span style={{ color: 'var(--primary)' }}>MyDegree</span>
            </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
);

export default PageLoader;
