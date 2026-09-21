// src/pages/WelcomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from '../components/SharedUI';

const FA = [
  { icon: '📝',  title: 'Verified Past Questions',     desc: "Model answers mapped to your university grading rubric so you know exactly what examiners want." },
  { icon: '📖',   title: 'Lecture Notes & Study Atlas', desc: 'Interactive notes with audio playback, flashcards, diagrams and full-text search.' },
  { icon: '✨',  title: 'DegreeAI 24/7 Study Coach',  desc: 'Solve exam questions instantly, generate mock tests and get step-by-step explanations.' },
  { icon: '👥',  title: '1-on-1 Peer Tutoring',        desc: 'Book private sessions with verified top seniors from UNILAG, UNIBEN, OAU, ABU and UI.' },
];
const FE = [
  { icon: '📄',    title: 'Sell Your Lecture Notes',  desc: 'Upload study packs, set your Naira price and earn on every download automatically.' },
  { icon: '🎯', title: 'Become a Paid Tutor',      desc: 'Set your rate (N1,500 to N5,000 per hour) and tutor junior students through the platform.' },
  { icon: '📊',  title: 'Affiliate Commissions',    desc: 'Earn 50-60% weekly commissions recommending Selar digital courses to classmates.' },
  { icon: '💡',   title: 'Digital Skills Tracks',    desc: 'Learn AI content creation, faceless YouTube and remote freelancing, then monetise immediately.' },
];
const FAQS = [
  { q: 'Is HackMyDegree free?',              a: 'Yes. Core features are free. Premium packs and tutor sessions are priced separately.' },
  { q: 'Do I have to sell? Can I just study?', a: 'Absolutely. Earning features are optional. Many students use it purely as an academic tool.' },
  { q: 'Which universities are supported?',  a: 'UNILAG, UNIBEN, OAU, UI, ABU, LAUTECH, FUTO, UNN, UNIPORT, LASU and more — expanding constantly.' },
  { q: 'How does selling notes work?',       a: 'Upload your material, set a Naira price, and we handle payments. Earnings hit your Nigerian bank account weekly.' },
  { q: 'Is DegreeAI the same as ChatGPT?',  a: 'No. DegreeAI is built specifically for Nigerian university curricula, WAEC, JAMB and departmental syllabi.' },
];
const STATS = [
  { n: '15,000+', l: 'Active Students' },
  { n: '20+ Uni', l: 'Campuses Covered' },
  { n: 'N2.4M+',  l: 'Earned by Students' },
  { n: '24/7',    l: 'AI Study Support' },
];

/* Coursera Design System Standard Button Styles (16px / 1rem, weight 600, 8px radius) */
const BP = {
  background: 'linear-gradient(135deg, #C9963E 0%, #A67628 100%)',
  color: '#000',
  border: 'none',
  borderRadius: '8px',
  padding: '0.75rem 1.75rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'var(--font-header)',
  boxShadow: '0 4px 14px rgba(201,150,62,0.25)',
  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  whiteSpace: 'nowrap'
};

const BG = {
  background: 'transparent',
  color: 'var(--on-surface-variant)',
  border: '1px solid var(--outline-variant)',
  borderRadius: '8px',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'var(--font-header)',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap'
};

export default function WelcomePage() {
  const navigate = useNavigate();
  const [tab, setTab]   = useState('academic');
  const [faq, setFaq]   = useState(null);
  const [vis, setVis]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 80);
    return () => clearTimeout(t);
  }, []);

  const enter = () => { localStorage.setItem('hmd_welcomed','1'); navigate('/'); };
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });

  return (
    <div style={{ minHeight:'100vh', background:'var(--surface)', fontFamily:'var(--font-body)', opacity:vis?1:0, transition:'opacity 0.5s ease', overflowX:'hidden', position:'relative' }}>

      {/* ═══ TOP BAR / HEADER WITH DASHBOARD ACCESS ═══ */}
      <nav style={{ position:'absolute', top:0, left:0, right:0, zIndex:10, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.25rem 2rem' }}>
        <div style={{ fontWeight:700, fontSize:'1.15rem', fontFamily:'var(--font-header)', letterSpacing:'-0.02em' }}>
          <span style={{ color:'var(--primary)' }}>Hack</span><span style={{ color:'var(--on-surface)' }}>MyDegree</span>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ ...BG, padding:'0.45rem 1.1rem', fontSize:'0.875rem' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='var(--outline-variant)'; e.currentTarget.style.color='var(--on-surface-variant)'; }}>
          Go to Dashboard →
        </button>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight:'92vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'5.5rem 1.5rem 3.5rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-15%', left:'50%', transform:'translateX(-50%)', width:'850px', height:'550px', background:'radial-gradient(ellipse,rgba(201,150,62,0.09) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:'780px', margin:'0 auto' }}>

          {/* Coursera Eyebrow / Overline Badge: 12px, weight 600, letterSpacing */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.45rem', background:'var(--primary-container)', border:'1px solid rgba(201,150,62,0.25)', borderRadius:'100px', padding:'0.35rem 0.9rem', color:'var(--primary)', fontSize:'0.75rem', fontWeight:600, fontFamily:'var(--font-header)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'1.5rem' }}>
            <SparklesIcon size={12} color="var(--primary)" />
            Nigeria&apos;s #1 Student Academic &amp; Career Platform
          </div>

          {/* Coursera Hero H1: 44px (2.75rem) on desktop, 32px (2rem) on mobile, weight 700 (NOT 900), clean line-height */}
          <h1 style={{ fontSize:'clamp(2rem, 4.5vw, 2.75rem)', fontWeight:700, fontFamily:'var(--font-header)', letterSpacing:'-0.02em', lineHeight:1.2, marginBottom:'1.25rem', color:'var(--on-surface)' }}>
            Welcome to <span style={{ color:'var(--primary)' }}>HackMyDegree</span>
          </h1>

          {/* Coursera Lead Paragraph: 18px (1.125rem), weight 400 (normal, not heavy), line-height 1.6 */}
          <p style={{ fontSize:'clamp(1rem, 1.8vw, 1.125rem)', fontWeight:400, color:'var(--on-surface-variant)', lineHeight:1.6, maxWidth:'580px', margin:'0 auto 1.75rem' }}>
            Built for <span style={{ color:'var(--on-surface)', fontWeight:600 }}>Nigerian undergraduates</span> who want excellent university grades and financial independence — at the same time.
          </p>

          {/* Coursera-style Mission Pills: 14px, weight 500 */}
          <div style={{ display:'flex', gap:'0.6rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'2.25rem' }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', color:'#60A5FA', padding:'0.35rem 0.9rem', borderRadius:'100px', fontSize:'0.875rem', fontWeight:500 }}>
              🎓 Ace your exams
            </span>
            <span style={{ color:'var(--on-surface-variant)', display:'flex', alignItems:'center', fontSize:'0.875rem' }}>+</span>
            <span style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(201,150,62,0.1)', border:'1px solid rgba(201,150,62,0.2)', color:'var(--primary)', padding:'0.35rem 0.9rem', borderRadius:'100px', fontSize:'0.875rem', fontWeight:500 }}>
              💰 Earn while you study
            </span>
          </div>

          {/* Action CTAs with Dashboard option */}
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
            <button style={BP} onClick={enter}
              onMouseEnter={e => e.currentTarget.style.boxShadow='0 6px 22px rgba(201,150,62,0.4)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow='0 4px 14px rgba(201,150,62,0.25)'}>
              Enter HackMyDegree →
            </button>
            <button style={BG} onClick={() => navigate('/dashboard')}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--outline-variant)'; e.currentTarget.style.color='var(--on-surface-variant)'; }}>
              Dashboard ↗
            </button>
            <button style={BG} onClick={() => scrollTo('hmd-about')}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--on-surface)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--outline-variant)'; e.currentTarget.style.color='var(--on-surface-variant)'; }}>
              See how it works ↓
            </button>
          </div>

          {/* Coursera-style Stats Row: 32px numbers (weight 700), 14px labels (weight 400) */}
          <div style={{ display:'flex', gap:'2.5rem', justifyContent:'center', flexWrap:'wrap', marginTop:'3.5rem', paddingTop:'2rem', borderTop:'1px solid var(--outline-variant)' }}>
            {STATS.map((s,i) => (
              <div key={i}>
                <div style={{ fontSize:'1.75rem', fontWeight:700, color:'var(--primary)', fontFamily:'var(--font-header)', lineHeight:1.2 }}>{s.n}</div>
                <div style={{ fontSize:'0.875rem', fontWeight:400, color:'var(--on-surface-variant)', marginTop:'0.2rem' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* scroll indicator */}
        <div style={{ position:'absolute', bottom:'1.5rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.35rem', color:'var(--on-surface-variant)', fontSize:'0.75rem', letterSpacing:'0.06em', textTransform:'uppercase', animation:'hmdBounce 2s ease-in-out infinite' }}>
          <span>Scroll to explore</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </section>

      {/* ═══ WHAT IS IT ═══ */}
      <section id="hmd-about" style={{ padding:'clamp(3.5rem, 6vw, 5rem) 1.5rem', borderTop:'1px solid var(--outline-variant)' }}>
        <div style={{ maxWidth:'840px', margin:'0 auto' }}>

          <div style={{ display:'flex', justifyContent:'center', marginBottom:'0.75rem' }}>
            <span style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--primary)', letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:'var(--font-header)' }}>What is HackMyDegree?</span>
          </div>

          {/* Coursera Section H2: 32px (2rem), weight 700 */}
          <h2 style={{ fontSize:'clamp(1.5rem, 3.5vw, 2rem)', fontWeight:700, fontFamily:'var(--font-header)', letterSpacing:'-0.015em', textAlign:'center', marginBottom:'0.75rem', color:'var(--on-surface)' }}>
            One platform. Two clear missions.
          </h2>

          {/* Coursera Section Subhead: 16px (1rem), weight 400, line-height 1.6 */}
          <p style={{ fontSize:'1rem', fontWeight:400, color:'var(--on-surface-variant)', lineHeight:1.6, textAlign:'center', maxWidth:'580px', margin:'0 auto 3rem' }}>
            This is not a random content site. HackMyDegree is a structured system with two parallel goals — and you choose how far you go on each side.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.25rem', marginBottom:'2.5rem' }}>

            {/* Academic Card */}
            <div style={{ background:'var(--surface-variant)', border:'1px solid rgba(59,130,246,0.22)', borderRadius:'14px', padding:'1.75rem' }}>
              <div style={{ width:40, height:40, borderRadius:'8px', background:'rgba(59,130,246,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.25rem', marginBottom:'1rem' }}>🎓</div>
              <div style={{ fontSize:'0.75rem', fontWeight:600, color:'#60A5FA', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'0.35rem', fontFamily:'var(--font-header)' }}>Engine 1</div>
              {/* Coursera H3 Card Title: 20px (1.25rem), weight 600 */}
              <h3 style={{ fontSize:'1.25rem', fontWeight:600, fontFamily:'var(--font-header)', color:'var(--on-surface)', margin:'0 0 0.5rem' }}>Academic Excellence</h3>
              {/* Coursera Body Small: 14px (0.875rem), weight 400 */}
              <p style={{ fontSize:'0.875rem', fontWeight:400, color:'var(--on-surface-variant)', lineHeight:1.6, marginBottom:'1.25rem' }}>
                Graduate with better grades and genuine understanding. Use our academic tools to study smarter, not just longer.
              </p>
              <ul style={{ padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {['Verified Past Questions & Rubrics','Lecture Notes & Diagrams','DegreeAI Exam Coach','1-on-1 Peer Tutoring'].map(t => (
                  <li key={t} style={{ display:'flex', alignItems:'flex-start', gap:'0.55rem', fontSize:'0.875rem', fontWeight:400, color:'var(--on-surface-variant)' }}>
                    <span style={{ color:'#60A5FA', fontWeight:700, flexShrink:0 }}>✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Earning Card */}
            <div style={{ background:'var(--surface-variant)', border:'1px solid rgba(201,150,62,0.22)', borderRadius:'14px', padding:'1.75rem' }}>
              <div style={{ width:40, height:40, borderRadius:'8px', background:'rgba(201,150,62,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.25rem', marginBottom:'1rem' }}>💰</div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.35rem' }}>
                <span style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--primary)', letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:'var(--font-header)' }}>Engine 2</span>
                <span style={{ fontSize:'0.68rem', fontWeight:500, background:'rgba(201,150,62,0.15)', color:'var(--primary)', padding:'0.1rem 0.5rem', borderRadius:'100px' }}>Optional</span>
              </div>
              {/* Coursera H3 Card Title: 20px (1.25rem), weight 600 */}
              <h3 style={{ fontSize:'1.25rem', fontWeight:600, fontFamily:'var(--font-header)', color:'var(--on-surface)', margin:'0 0 0.5rem' }}>Student Financial Freedom</h3>
              {/* Coursera Body Small: 14px (0.875rem), weight 400 */}
              <p style={{ fontSize:'0.875rem', fontWeight:400, color:'var(--on-surface-variant)', lineHeight:1.6, marginBottom:'1.25rem' }}>
                Generate income from campus by sharing what you already study. No shortcuts, no schemes.
              </p>
              <ul style={{ padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {['Sell Notes & Study Packs','Get Hired as a Paid Tutor','Selar Affiliate Commissions','Digital Skills Monetisation'].map(t => (
                  <li key={t} style={{ display:'flex', alignItems:'flex-start', gap:'0.55rem', fontSize:'0.875rem', fontWeight:400, color:'var(--on-surface-variant)' }}>
                    <span style={{ color:'var(--primary)', fontWeight:700, flexShrink:0 }}>✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Clarity note callout: 14px, weight 400 */}
          <div style={{ background:'var(--surface-variant)', borderLeft:'3px solid var(--primary)', borderRadius:'8px', padding:'1rem 1.25rem', fontSize:'0.875rem', fontWeight:400, color:'var(--on-surface-variant)', lineHeight:1.6 }}>
            <strong style={{ color:'var(--on-surface)', fontWeight:600 }}>To be clear: </strong>
            HackMyDegree is not a get-rich-quick scheme. Earning tools are built on legitimate knowledge commerce — you get paid for what you already study. Academics always come first.
          </div>
        </div>
      </section>

      {/* ═══ FEATURE TABS ═══ */}
      <section style={{ padding:'clamp(3.5rem, 6vw, 5rem) 1.5rem', background:'var(--surface-variant)', borderTop:'1px solid var(--outline-variant)', borderBottom:'1px solid var(--outline-variant)' }}>
        <div style={{ maxWidth:'840px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <span style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--primary)', letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:'var(--font-header)', display:'block', marginBottom:'0.5rem' }}>Everything included</span>
            <h2 style={{ fontSize:'clamp(1.5rem, 3.5vw, 2rem)', fontWeight:700, fontFamily:'var(--font-header)', letterSpacing:'-0.015em', marginBottom:'0.5rem', color:'var(--on-surface)' }}>What’s inside?</h2>
            <p style={{ fontSize:'1rem', fontWeight:400, color:'var(--on-surface-variant)', lineHeight:1.6 }}>Select a tab to explore each side of the platform.</p>
          </div>

          {/* Tabs: 14px, weight 600 */}
          <div style={{ display:'flex', justifyContent:'center', gap:'0.5rem', marginBottom:'2rem', flexWrap:'wrap' }}>
            {[
              { id:'academic', label:'Academic Tools',  color:'#3B82F6' },
              { id:'earn',     label:'Earning Features', color:'#C9963E' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'0.55rem 1.35rem', borderRadius:'8px', border: tab===t.id ? '1.5px solid '+t.color : '1.5px solid var(--outline-variant)', background: tab===t.id ? t.color+'18' : 'var(--surface)', color: tab===t.id ? t.color : 'var(--on-surface-variant)', fontWeight: tab===t.id ? 600 : 500, fontSize:'0.875rem', fontFamily:'var(--font-header)', cursor:'pointer', transition:'all 0.18s ease' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:'1rem' }}>
            {(tab==='academic'?FA:FE).map((f,i) => (
              <div key={i}
                style={{ background:'var(--surface)', border:'1px solid var(--outline-variant)', borderRadius:'12px', padding:'1.35rem', display:'flex', gap:'0.85rem', alignItems:'flex-start', transition:'border-color 0.18s ease, transform 0.18s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=tab==='academic'?'rgba(59,130,246,0.4)':'rgba(201,150,62,0.4)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--outline-variant)'; e.currentTarget.style.transform='translateY(0)'; }}>
                <span style={{ fontSize:'1.3rem', width:38, height:38, flexShrink:0, background:tab==='academic'?'rgba(59,130,246,0.08)':'rgba(201,150,62,0.08)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight:600, fontSize:'1rem', marginBottom:'0.25rem', color:'var(--on-surface)', fontFamily:'var(--font-header)' }}>{f.title}</div>
                  <div style={{ fontSize:'0.875rem', fontWeight:400, color:'var(--on-surface-variant)', lineHeight:1.55 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding:'clamp(3.5rem, 6vw, 5rem) 1.5rem' }}>
        <div style={{ maxWidth:'680px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <span style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--primary)', letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:'var(--font-header)', display:'block', marginBottom:'0.5rem' }}>Common questions</span>
            <h2 style={{ fontSize:'clamp(1.5rem, 3.5vw, 2rem)', fontWeight:700, fontFamily:'var(--font-header)', letterSpacing:'-0.015em', marginBottom:'0.5rem', color:'var(--on-surface)' }}>Frequently asked questions</h2>
            <p style={{ fontSize:'1rem', fontWeight:400, color:'var(--on-surface-variant)', lineHeight:1.6 }}>Honest answers, clear details.</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
            {FAQS.map((q,i) => (
              <div key={i} style={{ background:'var(--surface-variant)', border: faq===i ? '1px solid rgba(201,150,62,0.3)' : '1px solid var(--outline-variant)', borderRadius:'10px', overflow:'hidden', transition:'border-color 0.2s ease' }}>
                <button onClick={() => setFaq(faq===i?null:i)} style={{ width:'100%', background:'none', border:'none', padding:'0.95rem 1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', textAlign:'left', gap:'1rem' }}>
                  <span style={{ fontWeight:600, fontSize:'0.95rem', color:'var(--on-surface)', fontFamily:'var(--font-header)', lineHeight:1.45 }}>{q.q}</span>
                  <span style={{ color:'var(--primary)', flexShrink:0, transform:faq===i?'rotate(45deg)':'rotate(0deg)', transition:'transform 0.2s ease', display:'flex' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </span>
                </button>
                {faq===i && (
                  <div style={{ padding:'0.75rem 1.25rem 1rem', fontSize:'0.875rem', fontWeight:400, color:'var(--on-surface-variant)', lineHeight:1.6, borderTop:'1px solid var(--outline-variant)' }}>
                    {q.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding:'clamp(3.5rem, 6vw, 5rem) 1.5rem', background:'var(--surface-variant)', borderTop:'1px solid var(--outline-variant)', textAlign:'center' }}>
        <div style={{ maxWidth:'560px', margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(1.5rem, 3.5vw, 2rem)', fontWeight:700, fontFamily:'var(--font-header)', letterSpacing:'-0.015em', marginBottom:'0.75rem', color:'var(--on-surface)' }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize:'1rem', fontWeight:400, color:'var(--on-surface-variant)', lineHeight:1.6, marginBottom:'2rem' }}>
            Join 15,000+ Nigerian undergraduates already using HackMyDegree to study smarter and earn on campus.
          </p>
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
            <button style={BP} onClick={enter}
              onMouseEnter={e => e.currentTarget.style.boxShadow='0 6px 22px rgba(201,150,62,0.4)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow='0 4px 14px rgba(201,150,62,0.25)'}>
              Enter the Platform →
            </button>
            <button style={BG} onClick={() => navigate('/dashboard')}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--outline-variant)'; e.currentTarget.style.color='var(--on-surface-variant)'; }}>
              Dashboard ↗
            </button>
            <button style={BG} onClick={() => window.scrollTo({top:0,behavior:'smooth'})}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--on-surface)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--outline-variant)'; e.currentTarget.style.color='var(--on-surface-variant)'; }}>
              Back to top ↑
            </button>
          </div>
          <p style={{ fontSize:'0.8125rem', fontWeight:400, color:'var(--on-surface-variant)', marginTop:'1.5rem' }}>
            Free to join  ·  No credit card required  ·  Nigerian universities supported
          </p>
        </div>
      </section>

      <style>{`@keyframes hmdBounce{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(5px);}}`}</style>
    </div>
  );
}
