// src/components/OnboardingModal.jsx
import React, { useState, useEffect } from 'react';

const SLIDES = [
    {
        emoji: '🎓',
        color: '#BC955C',
        gradient: 'linear-gradient(135deg, rgba(188,149,92,0.18) 0%, rgba(188,149,92,0.04) 100%)',
        title: 'Welcome to HackMyDegree',
        subtitle: 'Your ultimate academic companion for Nigerian university students.',
        bullets: [
            '📚 Access thousands of past questions & notes',
            '🤖 AI-powered study assistant available 24/7',
            '👨‍🏫 Book verified tutors for 1-on-1 sessions',
        ],
    },
    {
        emoji: '📂',
        color: '#5C9EBC',
        gradient: 'linear-gradient(135deg, rgba(92,158,188,0.18) 0%, rgba(92,158,188,0.04) 100%)',
        title: 'Explore Resources',
        subtitle: 'Find past questions, lecture notes, and handouts curated by students like you.',
        bullets: [
            '🔍 Search by course code (e.g. MTH101, CSC201)',
            '⬇️ Download PDFs, slides & past papers instantly',
            '⭐ Rate and bookmark your favourite materials',
        ],
    },
    {
        emoji: '⚡',
        color: '#BC955C',
        gradient: 'linear-gradient(135deg, rgba(188,149,92,0.18) 0%, rgba(188,149,92,0.04) 100%)',
        title: 'DegreeAI — Your Study Copilot',
        subtitle: 'Ask anything. Get expert-level academic answers in seconds.',
        bullets: [
            '🧠 Choose a Study Mode: Tutor, Quiz, Flashcards, Summarise & more',
            '📄 Attach your lecture notes and get instant summaries',
            '💡 Generate MCQs and practice quizzes on demand',
        ],
    },
    {
        emoji: '👨‍🏫',
        color: '#9B59B6',
        gradient: 'linear-gradient(135deg, rgba(155,89,182,0.18) 0%, rgba(155,89,182,0.04) 100%)',
        title: 'Find a Tutor',
        subtitle: 'Connect with verified tutors who understand your curriculum.',
        bullets: [
            '🎯 Filter by subject, university, and level',
            '📅 Book sessions directly from their profile',
            '💬 Chat and collaborate before your session',
        ],
    },
    {
        emoji: '🚀',
        color: '#25D366',
        gradient: 'linear-gradient(135deg, rgba(37,211,102,0.18) 0%, rgba(37,211,102,0.04) 100%)',
        title: "You're All Set!",
        subtitle: 'Start exploring and make your study sessions smarter, faster, and more effective.',
        bullets: [
            '📝 Upload your own notes to help fellow students',
            '🏆 Build your dashboard and track your activity',
            '📲 Share HackMyDegree with your course group!',
        ],
    },
];

const STORAGE_KEY = 'hmd_onboarding_done';

export default function OnboardingModal() {
    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState(0);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        const done = localStorage.getItem(STORAGE_KEY);
        if (!done) {
            const t = setTimeout(() => setVisible(true), 600);
            return () => clearTimeout(t);
        }
    }, []);

    const dismiss = () => {
        setClosing(true);
        setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, '1');
            setVisible(false);
            setClosing(false);
        }, 350);
    };

    const next = () => {
        if (step < SLIDES.length - 1) {
            setStep(s => s + 1);
        } else {
            dismiss();
        }
    };

    const prev = () => {
        if (step > 0) setStep(s => s - 1);
    };

    if (!visible) return null;

    const slide = SLIDES[step];
    const isLast = step === SLIDES.length - 1;

    return (
        <>
            <div
                onClick={dismiss}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.72)',
                    backdropFilter: 'blur(6px)',
                    zIndex: 9000,
                    opacity: closing ? 0 : 1,
                    transition: 'opacity 0.35s ease',
                }}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Welcome to HackMyDegree"
                style={{
                    position: 'fixed',
                    top: '50%', left: '50%',
                    transform: closing
                        ? 'translate(-50%, -50%) scale(0.92)'
                        : 'translate(-50%, -50%) scale(1)',
                    width: '90%', maxWidth: '520px',
                    background: 'var(--surface)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: '24px',
                    boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
                    zIndex: 9001,
                    opacity: closing ? 0 : 1,
                    transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275)',
                    overflow: 'hidden',
                    fontFamily: 'var(--font-body)',
                }}
            >
                {/* Progress bar */}
                <div style={{ height: '3px', background: 'var(--outline-variant)' }}>
                    <div
                        style={{
                            height: '100%',
                            width: ((step + 1) / SLIDES.length) * 100 + '%',
                            background: 'linear-gradient(90deg, ' + slide.color + ', ' + slide.color + 'cc)',
                            transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
                            borderRadius: '0 3px 3px 0',
                        }}
                    />
                </div>

                <div style={{ padding: '2rem 2rem 1.5rem' }}>
                    {/* Close */}
                    <button
                        onClick={dismiss}
                        aria-label="Close onboarding"
                        style={{
                            position: 'absolute', top: '1rem', right: '1rem',
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'var(--surface-variant)',
                            border: '1px solid var(--outline-variant)',
                            color: 'var(--on-surface-variant)',
                            fontSize: '1rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--outline)'; e.currentTarget.style.color = 'var(--on-surface)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-variant)'; e.currentTarget.style.color = 'var(--on-surface-variant)'; }}
                    >
                        ✕
                    </button>

                    {/* Hero card */}
                    <div
                        key={step}
                        style={{
                            background: slide.gradient,
                            borderRadius: '18px',
                            padding: '2rem',
                            textAlign: 'center',
                            marginBottom: '1.5rem',
                            animation: 'onboardSlideIn 0.38s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
                        }}
                    >
                        <div style={{
                            fontSize: '3.5rem',
                            marginBottom: '0.75rem',
                            display: 'inline-block',
                            animation: 'onboardBounce 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
                        }}>
                            {slide.emoji}
                        </div>
                        <h2 style={{
                            fontFamily: 'var(--font-header)',
                            fontSize: '1.4rem',
                            fontWeight: 900,
                            color: 'var(--on-surface)',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.03em',
                        }}>
                            {slide.title}
                        </h2>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--on-surface-variant)',
                            lineHeight: 1.55,
                            maxWidth: '340px',
                            margin: '0 auto',
                        }}>
                            {slide.subtitle}
                        </p>
                    </div>

                    {/* Bullets */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.75rem' }}>
                        {slide.bullets.map((b, i) => (
                            <div
                                key={step + '-' + i}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.65rem 0.9rem',
                                    background: 'var(--surface-variant)',
                                    borderRadius: '10px',
                                    border: '1px solid var(--outline-variant)',
                                    fontSize: '0.88rem',
                                    color: 'var(--on-surface)',
                                    fontWeight: 500,
                                    animation: 'onboardSlideIn 0.38s ' + (0.07 * i) + 's cubic-bezier(0.175,0.885,0.32,1.275) both',
                                }}
                            >
                                {b}
                            </div>
                        ))}
                    </div>

                    {/* Nav row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                            onClick={prev}
                            disabled={step === 0}
                            style={{
                                width: 40, height: 40,
                                borderRadius: '10px',
                                border: '1px solid var(--outline-variant)',
                                background: step === 0 ? 'transparent' : 'var(--surface-variant)',
                                color: step === 0 ? 'var(--outline-variant)' : 'var(--on-surface)',
                                fontSize: '1.1rem', cursor: step === 0 ? 'default' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            ←
                        </button>

                        {/* Dots */}
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.4rem', alignItems: 'center' }}>
                            {SLIDES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setStep(i)}
                                    aria-label={'Go to slide ' + (i + 1)}
                                    style={{
                                        width: i === step ? 22 : 8,
                                        height: 8,
                                        borderRadius: '100px',
                                        background: i === step ? slide.color : 'var(--outline-variant)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                                        padding: 0,
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            style={{
                                flex: 1,
                                maxWidth: '180px',
                                padding: '0.65rem 1.25rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: isLast
                                    ? 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'
                                    : 'linear-gradient(135deg, ' + slide.color + ' 0%, ' + slide.color + 'bb 100%)',
                                color: isLast ? '#fff' : '#000',
                                fontFamily: 'var(--font-header)',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                boxShadow: '0 4px 16px ' + (isLast ? 'rgba(37,211,102,0.3)' : slide.color + '44'),
                            }}
                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
                        >
                            {isLast ? '🚀 Get Started' : 'Next →'}
                        </button>
                    </div>

                    {!isLast && (
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button
                                onClick={dismiss}
                                style={{
                                    background: 'none', border: 'none',
                                    color: 'var(--on-surface-variant)',
                                    fontSize: '0.78rem', cursor: 'pointer',
                                    fontFamily: 'var(--font-body)',
                                    textDecoration: 'underline',
                                    textUnderlineOffset: '3px',
                                }}
                            >
                                Skip tour
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes onboardSlideIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes onboardBounce {
                    0%   { transform: scale(0.5); opacity: 0; }
                    70%  { transform: scale(1.15); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </>
    );
}
