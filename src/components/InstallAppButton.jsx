// src/components/InstallAppButton.jsx
import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

export default function InstallAppButton({ style, compact = false }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      showToast('To install: tap the Share or Menu button in your browser, then "Add to Home Screen" 📲', 'info');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('🎉 HackMyDegree App Installed! Access your notes offline anytime.', 'success');
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable && compact) return null;

  return (
    <button
      onClick={handleInstallClick}
      title="Install HackMyDegree App for offline study"
      style={{
        background: 'linear-gradient(135deg, rgba(201,150,62,0.18) 0%, rgba(201,150,62,0.06) 100%)',
        border: '1px solid rgba(201,150,62,0.4)',
        color: '#C9963E',
        borderRadius: '100px',
        padding: compact ? '0.35rem 0.75rem' : '0.5rem 1.1rem',
        fontSize: compact ? '0.76rem' : '0.84rem',
        fontWeight: 800,
        fontFamily: 'var(--font-header)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        transition: 'all 0.2s ease',
        ...style
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#C9963E';
        e.currentTarget.style.color = '#000000';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201,150,62,0.18) 0%, rgba(201,150,62,0.06) 100%)';
        e.currentTarget.style.color = '#C9963E';
      }}>
      <span>📲</span>
      <span>{compact ? 'Install App' : '📲 Install HackMyDegree App'}</span>
    </button>
  );
}
