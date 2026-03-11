import React from 'react';

const Toast = ({ toast, onRemove }) => {
    const isError = toast.type === 'error';
    const isSuccess = toast.type === 'success';

    let icon = 'ℹ️';
    let borderColor = 'rgba(255,255,255,0.1)';
    let textColor = 'var(--on-surface)';
    let glowColor = 'rgba(255,255,255,0.05)';

    if (isError) {
        icon = '❌';
        borderColor = 'rgba(255,82,82,0.3)';
        textColor = '#FF5252';
        glowColor = 'rgba(255,82,82,0.15)';
    } else if (isSuccess) {
        icon = '✅';
        borderColor = 'rgba(76,175,80,0.3)';
        textColor = '#4CAF50';
        glowColor = 'rgba(76,175,80,0.15)';
    }

    return (
        <div 
            onClick={() => onRemove(toast.id)}
            style={{
                background: 'rgba(20, 20, 20, 0.85)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${borderColor}`,
                borderRadius: '16px',
                padding: '1rem 1.5rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                color: textColor,
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 15px ${glowColor}`,
                animation: 'toastSlideIn 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards',
                maxWidth: '400px',
                pointerEvents: 'auto',
                userSelect: 'none',
                fontFamily: 'var(--font-body)'
            }}
        >
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <span style={{ opacity: 0.4, fontSize: '0.8rem' }}>✕</span>
        </div>
    );
};

export default function ToastContainer({ toasts, removeToast }) {
    return (
        <div style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            pointerEvents: 'none',
            perspective: '1000px'
        }}>
            <style>
                {`
                @keyframes toastSlideIn {
                    from { transform: translateX(100%) scale(0.9); opacity: 0; }
                    to { transform: translateX(0) scale(1); opacity: 1; }
                }
                `}
            </style>
            {toasts.map(t => (
                <Toast key={t.id} toast={t} onRemove={removeToast} />
            ))}
        </div>
    );
}
