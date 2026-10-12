// src/pages/WelcomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from '../components/SharedUI';

const FEATURES_ACADEMIC = [
    { icon: '??', title: 'Verified Past Questions & Model Answers', desc: "Mapped to your university's grading rubric so you know exactly what to write." },
    { icon: '??', title: 'Departmental Lecture Notes & Atlas', desc: 'Interactive notes with audio TTS, flashcards, vector diagrams and smart search.' },
    { icon: '?', title: 'DegreeAI  24/7 Study Copilot', desc: 'Solve exam questions, generate 10-question mock tests, get instant explanations.' },
    { icon: '?????', title: '1-on-1 Verified Peer Tutors', desc: 'Book private sessions with top seniors from UNILAG, UNIBEN, OAU, ABU and UI.' },
];

const FEATURES_EARN = [
    { icon: '??', title: 'Sell Your Lecture Notes', desc: 'Upload typed or handwritten study packs, set your ? price, earn on every download.' },
    { icon: '??', title: 'Become a Paid Peer Tutor', desc: 'Set your rate (?1,500�?5,000/hr) and tutor junior students via the platform.' },
    { icon: '??', title: 'Affiliate Commissions via Selar', desc: 'Earn 50�60% weekly commissions recommending curated digital courses to peers.' },
    { icon: '??', title: 'High-Income Digital Skills Tracks', desc: 'AI video creation, faceless YouTube, remote freelancing practical and monetisable.' },
];

const FAQS = [
    { q: 'Is HackMyDegree free to use?', a: 'Yes. Core features browsing resources, using DegreeAI, and the Skills Hub  are completely free. Premium packs and tutor sessions are priced separately.' },
    { q: 'Do I have to sell things? Can I just study?', a: 'Absolutely. The earning features are optional. Many students use HackMyDegree purely as an academic tool. Choose what suits you.' },
    { q: 'Which universities are supported?', a: 'UNILAG, UNIBEN, OAU, UI, ABU, LAUTECH, FUTO, UNN, UNIPORT, LASU, and more. Content is continuously expanding.' },
    { q: 'How does selling notes work?', a: 'You upload your study material, set a price in Naira, and we handle payments and delivery. Earnings are paid to your Nigerian bank account weekly.' },
    { q: 'Is DegreeAI the same as ChatGPT?', a: "DegreeAI is purpose-built for Nigerian university curricula. It understands WAEC, JAMB, and departmental syllabi � giving more targeted answers than generic AI." },
];

const STATS = [
    { n: '15,000+', l: 'Students Active' },
    { n: '20+ Uni', l: 'Campuses Covered' },
    { n: '?2.4M+', l: 'Earned by Students' },
    { n: '24/7', l: 'DegreeAI Support' },
];

export default function WelcomePage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('academic');
    const [openFaq, setOpenFaq] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 60);
        return () => clearTimeout(t);
    }, []);

    const handleEnter = () => {
        localStorage.setItem('hmd_welcomed', '1');
        navigate('/');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--surface)',
            fontFamily: 'var(--font-body)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s ease',
            overflowX: 'hidden',
        }}>

            {/* -- HERO -- */}
            <section style={{
                minHeight: '100vh',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center',
                padding: 'clamp(3rem,8vw,6rem) 1.5rem',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* glow orbs */}
                <div style={{ position:'absolute', top:'-10%', left:'50%', transform:'translateX(-50%)', width:'clamp(400px,80vw,900px)', height:'clamp(300px,60vw,700px)', background:'radial-gradient(ellipse, rgba(201,150,62,0.13) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />
                <div style={{ position:'absolute', bottom:'-5%', right:'-5%', width:'350px', height:'350px', background:'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />

                <div style={{ position:'relative', zIndex:1, maxWidth:'860px', margin:'0 auto' }}>

                    {/* top badge */}
                    <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'var(--primary-container)', border:'1px solid rgba(201,150,62,0.3)', borderRadius:'100px', padding:'0.45rem 1.1rem', fontSize:'0.78rem', fontWeight:800, color:'var(--primary)', marginBottom:'2rem', letterSpacing:'0.05em', textTransform:'uppercase', fontFamily:'var(--font-header)' }}>
                        <SparklesIcon size={12} color="var(--primary)" />
                        Nigeria's #1 Student Platform � Welcome
                    </div>

                    {/* wordmark */}
                    <div style={{ fontSize:'clamp(2.8rem,8vw,5.5rem)', fontWeight:900, fontFamily:'var(--font-header)', letterSpacing:'-0.05em', lineHeight:1, marginBottom:'1.5rem' }}>
                        <span style={{ color:'var(--primary)' }}>Hack</span>
                        <span style={{ color:'var(--on-surface)' }}>MyDegree</span>
                    </div>

                    {/* tagline */}
                    <p style={{ fontSize:'clamp(1.05rem,2.5vw,1.35rem)', fontWeight:400, color:'var(--on-surface-variant)', lineHeight:1.65, maxWidth:'640px', margin:'0 auto 1.5rem' }}>
                        The platform built for <strong style={{ color:'var(--on-surface)', fontWeight:700 }}>Nigerian undergraduates</strong> who refuse to choose between academic success and financial survival.
                    </p>

                    {/* dual mission pills */}
                    <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'3rem' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.25)', color:'#60A5FA', padding:'0.4rem 1rem', borderRadius:'100px', fontSize:'0.85rem', fontWeight:700 }}>
                            ?? Ace Your Exams
                        </span>
                        <span style={{ color:'var(--on-surface-variant)', display:'flex', alignItems:'center', fontWeight:700 }}>+</span>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(201,150,62,0.12)', border:'1px solid rgba(201,150,62,0.25)', color:'var(--primary)', padding:'0.4rem 1rem', borderRadius:'100px', fontSize:'0.85rem', fontWeight:700 }}>
                            ?? Earn While You Study
                        </span>
                    </div>

                    {/* CTA buttons */}
                    <div style={{ display:'flex', gap:'0.85rem', justifyContent:'center', flexWrap:'wrap' }}>
                        <button onClick={handleEnter} style={{ background:'linear-gradient(135deg,#C9963E 0%,#A67628 100%)', color:'#000', border:'none', borderRadius:'12px', padding:'0.95rem 2.25rem', fontSize:'1rem', fontWeight:800, cursor:'pointer', fontFamily:'var(--font-header)', boxShadow:'0 4px 20px rgba(201,150,62,0.35)', transition:'all 0.2s ease', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 28px rgba(201,150,62,0.55)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,150,62,0.35)'}
                        >
                            Enter HackMyDegree ?
                        </button>
                        <button onClick={() => document.getElementById('hmd-explainer')?.scrollIntoView({ behavior:'smooth' })} style={{ background:'transparent', color:'var(--on-surface-variant)', border:'1px solid var(--outline-variant)', borderRadius:'12px', padding:'0.95rem 2rem', fontSize:'1rem', fontWeight:700, cursor:'pointer', fontFamily:'var(--font-header)', transition:'all 0.2s ease', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--on-surface)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--outline-variant)'; e.currentTarget.style.color='var(--on-surface-variant)'; }}
                        >
                            Learn How It Works ?
                        </button>
                    </div>

                    {/* stats row */}
                    <div style={{ display:'flex', gap:'2rem', justifyContent:'center', flexWrap:'wrap', marginTop:'3.5rem' }}>
                        {STATS.map((s,i) => (
                            <div key={i} style={{ textAlign:'center' }}>
                                <div style={{ fontSize:'1.4rem', fontWeight:900, color:'var(--primary)', fontFamily:'var(--font-header)' }}>{s.n}</div>
                                <div style={{ fontSize:'0.74rem', color:'var(--on-surface-variant)', marginTop:'0.1rem' }}>{s.l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* scroll hint */}
                <div style={{ position:'absolute', bottom:'2rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.35rem', color:'var(--on-surface-variant)', fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', animation:'hmdBounce 2s ease-in-out infinite' }}>
                    <span>Scroll to explore</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                </div>
            </section>

            {/* -- WHAT IS HACKMYDEGREE -- */}
            <section id="hmd-explainer" style={{ padding:'clamp(4rem,8vw,7rem) 1.5rem', background:'var(--surface-variant)', borderTop:'1px solid var(--outline-variant)', borderBottom:'1px solid var(--outline-variant)' }}>
                <div style={{ maxWidth:'900px', margin:'0 auto', textAlign:'center' }}>

                    <div style={{ display:'inline-flex', alignItems:'center', gap:'0.45rem', background:'var(--primary-container)', color:'var(--primary)', padding:'0.35rem 1rem', borderRadius:'100px', fontSize:'0.72rem', fontWeight:800, marginBottom:'1.5rem', letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:'var(--font-header)' }}>
                        What is HackMyDegree?
                    </div>

                    <h2 style={{ fontSize:'clamp(1.9rem,5vw,3rem)', fontWeight:900, fontFamily:'var(--font-header)', letterSpacing:'-0.04em', lineHeight:1.12, marginBottom:'1.25rem', color:'var(--on-surface)' }}>
                        One App. Two Clear Goals.
                    </h2>

                    <p style={{ fontSize:'clamp(1rem,2vw,1.15rem)', color:'var(--on-surface-variant)', lineHeight:1.7, maxWidth:'700px', margin:'0 auto 3rem' }}>
                        HackMyDegree is <strong style={{ color:'var(--on-surface)' }}>not</strong> a random content site. It is a structured ecosystem built around two parallel missions for Nigerian undergraduates � academic mastery and student-led financial independence. You choose how deep you go on either side.
                    </p>

                    {/* two-column engine cards */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px,1fr))', gap:'1.5rem', textAlign:'left', marginBottom:'3rem' }}>

                        {/* Academic */}
                        <div style={{ background:'var(--surface)', border:'2px solid rgba(59,130,246,0.3)', borderRadius:'20px', padding:'2rem' }}>
                            <div style={{ width:44, height:44, borderRadius:'12px', background:'rgba(59,130,246,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', marginBottom:'1rem' }}>??</div>
                            <h3 style={{ fontSize:'1.2rem', fontWeight:900, margin:'0 0 0.5rem', color:'#60A5FA', fontFamily:'var(--font-header)' }}>Engine 1 � Academics</h3>
                            <p style={{ color:'var(--on-surface-variant)', fontSize:'0.9rem', lineHeight:1.6, margin:'0 0 1.25rem' }}>
                                For every undergraduate who wants to graduate with <strong style={{ color:'var(--on-surface)' }}>better grades and deeper understanding</strong>. Prepare smarter, not harder.
                            </p>
                            <ul style={{ padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                                {['Verified Past Questions','Lecture Notes & Diagrams','DegreeAI Exam Coach','1-on-1 Peer Tutoring'].map(t => (
                                    <li key={t} style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.875rem', color:'var(--on-surface)' }}>
                                        <span style={{ color:'#60A5FA', fontWeight:800 }}>?</span> {t}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Earnings */}
                        <div style={{ background:'var(--surface)', border:'2px solid rgba(201,150,62,0.3)', borderRadius:'20px', padding:'2rem' }}>
                            <div style={{ width:44, height:44, borderRadius:'12px', background:'rgba(201,150,62,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', marginBottom:'1rem' }}>??</div>
                            <h3 style={{ fontSize:'1.2rem', fontWeight:900, margin:'0 0 0.5rem', color:'var(--primary)', fontFamily:'var(--font-header)', display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
                                Engine 2  Earnings
                                <span style={{ fontSize:'0.65rem', fontWeight:700, background:'rgba(201,150,62,0.15)', color:'var(--primary)', padding:'0.1rem 0.5rem', borderRadius:'100px' }}>OPTIONAL</span>
                            </h3>
                            <p style={{ color:'var(--on-surface-variant)', fontSize:'0.9rem', lineHeight:1.6, margin:'0 0 1.25rem' }}>
                                For students who want to <strong style={{ color:'var(--on-surface)' }}>generate income while still in school</strong> � without abandoning academics. 100% your choice.
                            </p>
                            <ul style={{ padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                                {['Sell Notes & Study Packs','Get Hired as a Paid Tutor','Selar Affiliate Commissions','Digital Skills Monetisation'].map(t => (
                                    <li key={t} style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.875rem', color:'var(--on-surface)' }}>
                                        <span style={{ color:'var(--primary)', fontWeight:800 }}>?</span> {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* clarity callout */}
                    <div style={{ background:'var(--surface)', border:'1px solid rgba(201,150,62,0.2)', borderLeft:'4px solid var(--primary)', borderRadius:'12px', padding:'1.25rem 1.5rem', textAlign:'left', fontSize:'0.9rem', color:'var(--on-surface-variant)', lineHeight:1.65 }}>
                        <strong style={{ color:'var(--primary)' }}>Important: </strong>
                        HackMyDegree is not a get-rich-quick scheme, a gambling app, or just another JAMB prep site. The earning features are powered by legitimate knowledge commerce � you earn by sharing what you already know. Academics always come first.
                    </div>
                </div>
            </section>

            {/* -- FEATURE TABS -- */}
            <section style={{ padding:'clamp(4rem,8vw,7rem) 1.5rem' }}>
                <div style={{ maxWidth:'900px', margin:'0 auto' }}>
                    <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
                        <h2 style={{ fontSize:'clamp(1.75rem,4vw,2.6rem)', fontWeight:900, fontFamily:'var(--font-header)', letterSpacing:'-0.04em', marginBottom:'0.75rem' }}>Everything You Get</h2>
                        <p style={{ color:'var(--on-surface-variant)', fontSize:'1rem', lineHeight:1.6 }}>Select a tab to explore each side of the platform.</p>
                    </div>

                    {/* tabs */}
                    <div style={{ display:'flex', justifyContent:'center', gap:'0.5rem', marginBottom:'2rem', flexWrap:'wrap' }}>
                        {[
                            { id:'academic', label:'?? Academic Tools', color:'#3B82F6' },
                            { id:'earn',     label:'?? Earning Features', color:'#C9963E' },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding:'0.65rem 1.5rem', borderRadius:'100px', border:`2px solid ${activeTab===tab.id ? tab.color : 'var(--outline-variant)'}`, background: activeTab===tab.id ? `${tab.color}18` : 'transparent', color: activeTab===tab.id ? tab.color : 'var(--on-surface-variant)', fontWeight:800, fontSize:'0.88rem', fontFamily:'var(--font-header)', cursor:'pointer', transition:'all 0.18s ease' }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* feature cards */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.25rem' }}>
                        {(activeTab==='academic' ? FEATURES_ACADEMIC : FEATURES_EARN).map((f,i) => (
                            <div key={i} style={{ background:'var(--surface-variant)', border:'1px solid var(--outline-variant)', borderRadius:'16px', padding:'1.5rem', display:'flex', gap:'1rem', alignItems:'flex-start', transition:'border-color 0.18s ease, transform 0.18s ease' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = activeTab==='academic' ? 'rgba(59,130,246,0.45)' : 'rgba(201,150,62,0.45)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--outline-variant)'; e.currentTarget.style.transform='translateY(0)'; }}
                            >
                                <span style={{ fontSize:'1.4rem', width:44, height:44, flexShrink:0, background: activeTab==='academic' ? 'rgba(59,130,246,0.1)' : 'rgba(201,150,62,0.1)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center' }}>{f.icon}</span>
                                <div>
                                    <div style={{ fontWeight:800, fontSize:'0.92rem', marginBottom:'0.35rem', color:'var(--on-surface)', fontFamily:'var(--font-header)' }}>{f.title}</div>
                                    <div style={{ fontSize:'0.82rem', color:'var(--on-surface-variant)', lineHeight:1.55 }}>{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* -- FAQ -- */}
            <section style={{ padding:'clamp(3.5rem,7vw,6rem) 1.5rem', background:'var(--surface-variant)', borderTop:'1px solid var(--outline-variant)' }}>
                <div style={{ maxWidth:'720px', margin:'0 auto' }}>
                    <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
                        <h2 style={{ fontSize:'clamp(1.6rem,4vw,2.3rem)', fontWeight:900, fontFamily:'var(--font-header)', letterSpacing:'-0.04em', marginBottom:'0.75rem' }}>Common Questions</h2>
                        <p style={{ color:'var(--on-surface-variant)', fontSize:'0.95rem' }}>Clear answers before you dive in.</p>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                        {FAQS.map((faq,i) => (
                            <div key={i} style={{ background:'var(--surface)', border:`1px solid ${openFaq===i ? 'rgba(201,150,62,0.35)' : 'var(--outline-variant)'}`, borderRadius:'14px', overflow:'hidden', transition:'border-color 0.2s ease' }}>
                                <button onClick={() => setOpenFaq(openFaq===i ? null : i)} style={{ width:'100%', background:'none', border:'none', padding:'1.1rem 1.35rem', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', textAlign:'left', gap:'1rem' }}>
                                    <span style={{ fontWeight:700, fontSize:'0.92rem', color:'var(--on-surface)', fontFamily:'var(--font-header)', lineHeight:1.4 }}>{faq.q}</span>
                                    <span style={{ color:'var(--primary)', flexShrink:0, transform: openFaq===i ? 'rotate(45deg)' : 'rotate(0deg)', transition:'transform 0.2s ease', display:'flex', alignItems:'center' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    </span>
                                </button>
                                {openFaq===i && (
                                    <div style={{ padding:'0.85rem 1.35rem 1.1rem', fontSize:'0.88rem', color:'var(--on-surface-variant)', lineHeight:1.65, borderTop:'1px solid var(--outline-variant)' }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* -- FINAL CTA -- */}
            <section style={{ padding:'clamp(4rem,8vw,7rem) 1.5rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'600px', height:'400px', background:'radial-gradient(ellipse, rgba(201,150,62,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />
                <div style={{ position:'relative', zIndex:1, maxWidth:'600px', margin:'0 auto' }}>
                    <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>??</div>
                    <h2 style={{ fontSize:'clamp(1.8rem,5vw,2.8rem)', fontWeight:900, fontFamily:'var(--font-header)', letterSpacing:'-0.04em', marginBottom:'1rem', color:'var(--on-surface)' }}>
                        Ready to Transform<br/>
                        <span style={{ background:'linear-gradient(135deg,#C9963E 0%,#F59E0B 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Your Student Life?</span>
                    </h2>
                    <p style={{ color:'var(--on-surface-variant)', fontSize:'1.05rem', lineHeight:1.65, marginBottom:'2.5rem' }}>
                        Join 15,000+ Nigerian undergraduates already using HackMyDegree to study smarter and earn on campus.
                    </p>
                    <div style={{ display:'flex', gap:'0.85rem', justifyContent:'center', flexWrap:'wrap' }}>
                        <button onClick={handleEnter} style={{ background:'linear-gradient(135deg,#C9963E 0%,#A67628 100%)', color:'#000', border:'none', borderRadius:'12px', padding:'1rem 2.5rem', fontSize:'1.05rem', fontWeight:800, cursor:'pointer', fontFamily:'var(--font-header)', boxShadow:'0 4px 20px rgba(201,150,62,0.35)', transition:'box-shadow 0.2s ease' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow='0 8px 32px rgba(201,150,62,0.55)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow='0 4px 20px rgba(201,150,62,0.35)'}
                        >
                            Enter the Platform ?
                        </button>
                        <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })} style={{ background:'transparent', color:'var(--on-surface-variant)', border:'1px solid var(--outline-variant)', borderRadius:'12px', padding:'1rem 2rem', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', fontFamily:'var(--font-header)', transition:'all 0.2s ease' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--on-surface)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--outline-variant)'; e.currentTarget.style.color='var(--on-surface-variant)'; }}
                        >
                            Back to Top ?
                        </button>
                    </div>
                    <p style={{ color:'var(--on-surface-variant)', fontSize:'0.78rem', marginTop:'1.5rem' }}>
                        Free to join &nbsp;�&nbsp; No credit card required &nbsp;�&nbsp; Nigerian universities supported
                    </p>
                </div>
            </section>

            <style>{`
                @keyframes hmdBounce {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50%       { transform: translateX(-50%) translateY(7px); }
                }
            `}</style>
        </div>
    );
}
