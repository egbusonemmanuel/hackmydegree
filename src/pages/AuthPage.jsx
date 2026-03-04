// src/pages/AuthPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn, signUp, signInWithGoogle } from '../lib/supabase';


// Shared UI components
import { Banner, Field, Input, Button } from '../components/SharedUI';

/* ─── Keyframe Animations ─── */
const CSS = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lampSwing {
    0%,100% { transform: rotate(-1deg); }
    50%      { transform: rotate(1.5deg); }
  }
  @keyframes armPull {
    0%   { transform: rotate(0deg); }
    20%  { transform: rotate(-25deg); }
    100% { transform: rotate(0deg); }
  }
  @keyframes cordPull {
    0%   { height: 28px; }
    20%  { height: 45px; }
    100% { height: 28px; }
  }
  @keyframes flicker {
    0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1; }
    20%,24%,55%                      { opacity: 0.4; }
  }
  @keyframes particleDrift {
    0%   { transform: translate(0,0) scale(1); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translate(var(--dx), var(--dy)) scale(0.2); opacity: 0; }
  }
  @keyframes floatBody {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes spinnerRing {
    to { transform: rotate(360deg); }
  }

  .auth-input:focus {
    outline: none !important;
    border-color: var(--primary) !important;
    box-shadow: 0 0 0 4px var(--primary-container) !important;
    background: var(--surface) !important;
  }
  .auth-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 30px rgba(0,0,0,0.1) !important;
  }
  .auth-btn:active { transform: scale(0.97) !important; }

  .lamp-head { animation: lampSwing 4s ease-in-out infinite; transform-origin: top right; }
  .pull-animation { animation: cordPull 0.4s ease-out; }
  .arm-animation { animation: armPull 0.4s ease-out; transform-origin: top left; }

  .auth-page { min-height: 100vh; font-family: var(--font-body); overflow: hidden; position: relative; }
  .auth-card  { animation: fadeSlideUp 0.7s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }

  @media (max-width: 768px) {
    .auth-split { flex-direction: column !important; }
    .auth-left  { display: none !important; }
    .auth-right { width: 100% !important; min-height: 100vh; }
  }
`;

/* ─── Particle System ─── */
function Particles({ lit }) {
  const count = 15;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: count }).map((_, i) => {
        const dx = `${-50 + Math.random() * 100}px`;
        const dy = `${-150 - Math.random() * 200}px`;
        const size = 2 + Math.random() * 2;
        const delay = Math.random() * 5;
        const dur = 4 + Math.random() * 4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${15 + Math.random() * 70}%`,
              bottom: '10%',
              width: size, height: size,
              borderRadius: '50%',
              background: lit ? 'var(--primary)' : 'var(--outline)',
              '--dx': dx, '--dy': dy,
              animation: `particleDrift ${dur}s ${delay}s ease-out infinite`,
              opacity: 0,
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── Stylized Character Component ─── */
function CharacterWithLamp({ lit, onToggle }) {
  const [pulling, setPulling] = useState(false);

  const handleToggle = () => {
    setPulling(true);
    setTimeout(() => {
      onToggle();
      setPulling(false);
    }, 200);
  };

  const skinBase = lit ? '#FFDBAC' : '#8D5524';
  const skinShadow = lit ? '#F1C27D' : '#5E3C1B';
  const hairBase = lit ? '#333' : '#1a1a1a';
  const shirtBase = lit ? '#EEE' : '#222';
  const shirtShadow = lit ? '#CCC' : '#111';

  return (
    <div style={{ position: 'relative', width: '320px', height: '440px', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>

      {/* 3D Lamp */}
      <div
        onClick={handleToggle}
        style={{ position: 'absolute', top: 10, right: '15%', cursor: 'pointer', zIndex: 20 }}
      >
        <div className={pulling ? 'pull-animation' : ''} style={{
          position: 'absolute', top: 12, left: '50%', width: 2, height: 32,
          background: lit ? 'var(--primary)' : '#444', transition: 'background 0.5s',
          boxShadow: lit ? '0 0 10px var(--primary)' : 'none'
        }} />
        <div className="lamp-head" style={{ position: 'relative', top: 0, marginLeft: -75 }}>
          <svg width="150" height="90" viewBox="0 0 150 90" style={{ filter: lit ? 'drop-shadow(0 0 15px var(--primary))' : 'none', transition: 'filter 0.5s' }}>
            <defs>
              <linearGradient id="lampGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={lit ? '#c8a020' : '#333'} />
                <stop offset="50%" stopColor={lit ? '#eec040' : '#444'} />
                <stop offset="100%" stopColor={lit ? '#c8a020' : '#333'} />
              </linearGradient>
            </defs>
            <polygon points="30,10 120,10 150,80 0,80" fill="url(#lampGrad)" stroke={lit ? '#fff' : '#222'} strokeWidth="1" style={{ transition: 'all 0.5s' }} />
            <ellipse cx="75" cy="80" rx="12" ry="6" fill={lit ? '#FFF9E0' : '#222'} style={{ animation: lit ? 'flicker 4s infinite' : 'none' }} />
          </svg>
        </div>
      </div>

      {/* 3D Anime Man */}
      <svg width="300" height="420" viewBox="0 0 200 300" style={{ animation: 'floatBody 6s ease-in-out infinite' }}>
        {/* Neck */}
        <path d="M92,80 L108,80 L106,90 L94,90 Z" fill={skinShadow} style={{ transition: 'fill 1s' }} />

        {/* Head Base */}
        <path d="M78,40 Q78,15 100,15 Q122,15 122,40 Q122,65 100,80 Q78,65 78,40" fill={skinBase} style={{ transition: 'fill 1s' }} />
        {/* Face Shading (Cel-shading) */}
        <path d="M100,80 L122,40 Q122,65 100,80 Z" fill={skinShadow} opacity="0.3" />

        {/* Spiky Anime Hair */}
        <path d="M75,40 Q70,20 85,10 L100,5 L115,10 Q130,20 125,40 Q130,30 135,45 L120,50 Q115,30 100,25 Q85,30 80,50 L65,45 Q70,30 75,40" fill={hairBase} style={{ transition: 'fill 1s' }} />

        {/* Torso/Shirt */}
        <path d="M65,95 Q100,85 135,95 L145,260 Q100,270 55,260 Z" fill={shirtBase} style={{ transition: 'fill 1s' }} />
        {/* Torso Shading */}
        <path d="M100,90 L135,95 L145,260 Q100,270 100,90" fill={shirtShadow} opacity="0.15" />

        {/* Left Arm (Relaxed) */}
        <path d="M70,100 Q50,140 55,190" stroke={shirtBase} strokeWidth="20" fill="none" strokeLinecap="round" style={{ transition: 'stroke 1s' }} />
        <path d="M70,100 Q50,140 55,190" stroke={shirtShadow} strokeWidth="20" fill="none" strokeLinecap="round" opacity="0.1" style={{ clipPath: 'inset(0 0 0 50%)' }} />

        {/* Right Arm (Interactive) */}
        <g className={pulling ? 'arm-animation' : ''} style={{ transformOrigin: '130px 100px' }}>
          <path d="M130,100 Q155,75 165,50" stroke={shirtBase} strokeWidth="20" fill="none" strokeLinecap="round" style={{ transition: 'stroke 1s' }} />
          {/* Hand */}
          <circle cx="165" cy="50" r="9" fill={skinBase} style={{ transition: 'fill 1s' }} />
          <path d="M165,42 A9,9 0 0 1 174,50 L165,50 Z" fill={skinShadow} style={{ transition: 'fill 1s' }} />
        </g>
      </svg>

      {/* Surface reflection */}
      <div style={{
        position: 'absolute', bottom: 5, left: '10%', width: '80%', height: '12px',
        background: lit ? 'rgba(188, 149, 92, 0.2)' : 'rgba(255, 255, 255, 0.04)',
        borderRadius: '50%', filter: 'blur(6px)', transition: 'background 1s'
      }} />
    </div>
  );
}

/* ─── Light Beam ─── */
function LightBeam({ lit }) {
  return (
    <div style={{ position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 1, pointerEvents: 'none' }}>
      {/* Primary cone */}
      <div style={{
        width: 0, height: 0,
        borderLeft: '280px solid transparent',
        borderRight: '280px solid transparent',
        borderTop: `520px solid rgba(188, 149, 92, ${lit ? 0.07 : 0})`,
        transition: 'border-top-color 1s ease',
        filter: 'blur(12px)',
      }} />
      {/* Tight core beam */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', marginLeft: -80,
        width: 0, height: 0,
        borderLeft: '80px solid transparent',
        borderRight: '80px solid transparent',
        borderTop: `320px solid rgba(255, 220, 80, ${lit ? 0.12 : 0})`,
        transition: 'border-top-color 1s ease',
        filter: 'blur(4px)',
      }} />
    </div>
  );
}

/* ─── Main Component ─── */
export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  const [lit, setLit] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', fullName: '', username: '', university: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPass, setShowPass] = useState(false);

  // Theme-aware colors
  const accent = 'var(--primary)';
  const bg = lit ? 'var(--surface)' : '#000000';
  const panelBg = lit ? 'var(--surface-variant)' : '#0a0a0a';
  const textPrimary = 'var(--on-surface)';
  const textSecondary = 'var(--on-surface-variant)';
  const borderCol = lit ? 'var(--outline-variant)' : 'rgba(212, 160, 32, 0.1)';

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        const { error: signInError } = await signIn({ email: form.email, password: form.password });
        if (signInError) throw signInError;
        navigate('/dashboard');
      } else {
        if (form.username.length < 3) throw new Error('Username must be at least 3 characters');
        if (form.password.length < 8) throw new Error('Password must be at least 8 characters');
        const { error: signUpError } = await signUp({
          email: form.email, password: form.password,
          fullName: form.fullName, username: form.username.toLowerCase().replace(/\s+/g, '_')
        });
        if (signUpError) throw signUpError;
        setSuccess('Account created! Check your email to confirm, then login.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    const { error: gErr } = await signInWithGoogle();
    if (gErr) { setError(gErr.message); setGoogleLoading(false); }
    // On success, Supabase redirects the browser to /dashboard — no further action needed
  };


  return (
    <>
      <style>{CSS}</style>

      {/* ── Full-page container ── */}
      <div className="auth-page" style={{ background: bg, color: textPrimary, transition: 'background 1s ease, color 1s ease' }}>
        <Particles lit={lit} />

        {/* ── Split layout ── */}
        <div className="auth-split" style={{ display: 'flex', minHeight: '100vh' }}>

          {/* ══ LEFT PANEL ══ */}
          <div className="auth-left" style={{
            flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', padding: '3rem',
            position: 'relative', overflow: 'hidden',
            background: panelBg,
            transition: 'background 1s ease',
          }}>
            {/* Character + beam */}
            <div style={{ transform: 'scale(1.1)', marginBottom: '2rem' }}>
              <CharacterWithLamp lit={lit} onToggle={() => setLit(l => !l)} />
            </div>
            <LightBeam lit={lit} />

            {/* Brand text */}
            <div style={{ zIndex: 5, textAlign: 'center', animation: 'fadeIn 1s ease 0.5s forwards', opacity: 0 }}>
              <h1 style={{
                fontFamily: 'var(--font-header)', fontWeight: 800,
                fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', lineHeight: 1,
                margin: '0 0 1rem',
                color: textPrimary,
                transition: 'color 1s ease',
                letterSpacing: '-0.04em'
              }}>
                Your Academic<br />Superpower.
              </h1>
              <p style={{
                fontFamily: 'var(--font-body)',
                color: textSecondary,
                fontSize: '1.1rem',
                lineHeight: 1.6,
                maxWidth: 320,
                margin: '0 auto',
                transition: 'color 1s ease'
              }}>
                The fastest-growing faculty resource network for Nigerian students.
              </p>
            </div>
          </div>

          {/* ══ RIGHT PANEL ══ */}
          <div className="auth-right" style={{
            width: '44%', minWidth: 440, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', position: 'relative',
            background: bg,
            borderLeft: `1px solid ${borderCol}`,
            transition: 'all 1s ease',
          }}>
            <div className="auth-card" style={{ width: '100%', maxWidth: 400 }}>
              {/* Logo */}
              <Link to="/" style={{ textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>
                <span style={{
                  fontFamily: 'var(--font-header)',
                  fontWeight: 900,
                  fontSize: '1.8rem',
                  color: textPrimary,
                  letterSpacing: '-0.02em'
                }}>
                  Hack<span style={{ color: accent }}>MyDegree</span>
                </span>
              </Link>
              <p style={{
                fontFamily: 'var(--font-body)',
                color: textSecondary,
                fontSize: '1rem',
                marginBottom: '2.5rem',
                fontWeight: 500,
                transition: 'color 1s ease'
              }}>
                {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your free account today.'}
              </p>

              {/* ── Error / Success banners ── */}
              {error && <Banner type="error" msg={error} />}
              {success && <Banner type="success" msg={success} />}

              {/* ── Form ── */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {!isLogin && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    <Field label="Full Name" lit={lit}>
                      <Input type="text" placeholder="e.g. Ebuka Ibe" value={form.fullName} onChange={set('fullName')} required />
                    </Field>
                    <Field label="Username" lit={lit}>
                      <Input type="text" placeholder="ebuka_ibe" value={form.username} onChange={set('username')} required />
                    </Field>
                  </div>
                )}

                <Field label="Email Address" lit={lit}>
                  <Input type="email" placeholder="you@school.edu.ng" value={form.email} onChange={set('email')} required />
                </Field>

                <Field label="Password" lit={lit}>
                  <Input
                    type={showPass ? 'text' : 'password'}
                    placeholder={isLogin ? '••••••••' : 'Min. 8 characters'}
                    value={form.password} onChange={set('password')} required
                    icon={
                      <button
                        type="button"
                        onClick={() => setShowPass(s => !s)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', fontSize: 18,
                          color: 'inherit', padding: '0'
                        }}
                      >
                        {showPass ? '🙈' : '👁'}
                      </button>
                    }
                  />
                </Field>

                {isLogin && (
                  <div style={{ textAlign: 'right', marginTop: -8, marginBottom: '1.5rem' }}>
                    <Link to="/forgot-password" style={{ color: accent, fontSize: '0.9rem', textDecoration: 'none', fontWeight: 700, transition: 'color 0.3s ease' }}>
                      Forgot password?
                    </Link>
                  </div>
                )}

                {/* ── Submit button ── */}
                <Button type="submit" loading={loading}>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              {/* ── OR Divider ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--outline-variant)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'var(--outline-variant)' }} />
              </div>

              {/* ── Google Sign-In Button ── */}
              <button
                type="button"
                id="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.75rem', padding: '0.9rem 1.5rem', borderRadius: 12,
                  background: 'var(--surface)', border: '1.5px solid var(--outline-variant)',
                  color: 'var(--on-surface)', fontFamily: 'var(--font-body)', fontWeight: 700,
                  fontSize: '1rem', cursor: googleLoading ? 'not-allowed' : 'pointer',
                  opacity: googleLoading ? 0.6 : 1, transition: 'all 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }}
                onMouseOver={e => { if (!googleLoading) e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'; }}
              >
                {googleLoading ? '⏳ Redirecting…' : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              {/* ── Switch mode ── */}
              <p style={{
                fontFamily: 'var(--font-body)',
                textAlign: 'center',
                color: textSecondary,
                fontSize: '1rem',
                marginTop: '2.5rem',
                fontWeight: 500
              }}>
                {isLogin ? "New to HackMyDegree? " : 'Already a member? '}
                <Link to={isLogin ? '/signup' : '/login'} style={{ color: accent, fontWeight: 800, textDecoration: 'none' }}>
                  {isLogin ? 'Sign up free →' : 'Log in here →'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
