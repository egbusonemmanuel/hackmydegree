// src/pages/DigitalSkillsPage.jsx
import React, { useState } from 'react';
import LOCAL_VIDEOS from '../videos/youtubeLinks';


const SELAR_STORE_URL = 'https://selar.com/m/chiadikobi-rejoice1?affiliate=1v3l31j354';
const WHATSAPP_CONTACT = 'https://wa.me/2348143064008?text=Hello%20Digital%20Oluwaseun,%20I%20am%20interested%20in%20learning%20more%20about%20your%20digital%20skills%20and%20online%20income%20courses!';
const TIKTOK_URL = 'https://www.tiktok.com/@digital.sn.olarimi.o';

const COURSES = [
  {
    id: 'affiliate-marketing',
    title: 'Affiliate Marketing Mastery',
    icon: '📈',
    badge: '50% - 60% Commission',
    badgeColor: '#25D366',
    description: 'Learn how to recommend high-demand digital products, generate organic & paid traffic, and earn steady weekly commissions on Selar.',
    topics: [
      'Finding high-converting digital products on Selar',
      'High-converting WhatsApp & social media sales funnels',
      'Copywriting & persuasive lead magnets for students',
      'Affiliate link tracking, optimization & payouts'
    ],
    highlight: '50% to 60% commission per referral',
    target: 'Ideal for students seeking passive weekly income'
  },
  {
    id: 'ai-video-creation',
    title: 'AI Video Creation & Production',
    icon: '🤖',
    badge: 'High Demand',
    badgeColor: 'var(--primary)',
    description: 'Create cinema-grade videos, commercials, and viral TikTok / Reels content using cutting-edge AI tools without showing your face.',
    topics: [
      'AI Scriptwriting with ChatGPT & Claude prompts',
      'Realistic AI voiceovers & voice cloning',
      'Image & Video Generation (Midjourney, Runway, Pika)',
      'Automated CapCut editing, captions & viral hooks'
    ],
    highlight: 'No camera or expensive gear required',
    target: 'Content creators, freelancers & brands'
  },
  {
    id: 'youtube-automation',
    title: 'YouTube Automation (Faceless Channels)',
    icon: '📹',
    badge: 'Passive Income',
    badgeColor: '#FF3B30',
    description: 'Launch, grow, and monetize lucrative faceless YouTube channels with high RPM niches, automated workflows, and thumbnail psychology.',
    topics: [
      'High RPM niche selection & competitive analysis',
      'AI-powered scriptwriting & voice generation',
      'Dynamic B-roll curation & copyright-free editing',
      'YouTube SEO, CTR optimization & AdSense monetization'
    ],
    highlight: 'Build assets that pay you while you sleep',
    target: 'Beginners & aspiring digital creators'
  },
  {
    id: 'cyber-networking',
    title: 'Cyber Friend & Remote Freelancing',
    icon: '🌐',
    badge: 'Career Skills',
    badgeColor: '#0A84FF',
    description: 'Build a commanding personal brand, establish authority across digital communities, and close freelance clients for digital services.',
    topics: [
      'Personal branding & portfolio packaging',
      'Client outreach on Twitter/X, LinkedIn & WhatsApp',
      'Service delivery & client management',
      'International payments & freelancing tools'
    ],
    highlight: 'Turn everyday internet skills into income',
    target: 'Students looking for remote gigs'
  }
];

const FAQS = [
  {
    q: 'Do I need a laptop, or can I learn with my smartphone?',
    a: 'All courses are beginner-friendly and optimized for smartphone users (Android/iPhone). You can create AI videos, run affiliate marketing campaigns, and manage faceless channels directly from your phone.'
  },
  {
    q: 'How do I access the course after payment?',
    a: 'All courses are hosted on Selar. Immediately after a secure payment via debit card, bank transfer, or USSD, you will receive instant lifetime access to the video modules and community support.'
  },
  {
    q: 'Is there mentorship and support after purchase?',
    a: 'Yes! Digital Oluwaseun provides dedicated WhatsApp student guidance, Q&A support, and regular updates on emerging AI and digital marketing strategies.'
  },
  {
    q: 'How quickly can I start earning?',
    a: 'Results depend on your dedication and application. With consistent execution of the step-by-step frameworks, students frequently start landing referrals and views within their first 2–4 weeks.'
  }
];

export default function DigitalSkillsPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: 'var(--surface)', color: 'var(--on-surface)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      {/* Hero Header */}
      <section style={{
        padding: 'clamp(5rem, 12vh, 8rem) 1.5rem clamp(3rem, 8vh, 5rem)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 0%, rgba(188, 149, 92, 0.15) 0%, var(--surface) 75%)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            background: 'var(--primary-container)', color: 'var(--primary)',
            padding: '0.45rem 1.25rem', borderRadius: '100px',
            fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.5rem',
            border: '1px solid rgba(188, 149, 92, 0.3)',
            letterSpacing: '0.5px'
          }}>
            <span>🚀</span>
            <span>DIGITAL OLUWASEUN × HACKMYDEGREE</span>
          </div>

          <h1 className="gradient-text" style={{
            fontSize: 'clamp(2.4rem, 7vw, 4.2rem)',
            lineHeight: 1.1,
            fontWeight: 900,
            marginBottom: '1.5rem',
            letterSpacing: '-0.05em'
          }}>
            Master High-Income Skills.<br />
            Earn While You Learn.
          </h1>

          <p style={{
            color: 'var(--on-surface-variant)',
            fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
            maxWidth: '700px',
            margin: '0 auto 2.5rem',
            fontWeight: 500,
            lineHeight: 1.6
          }}>
            Don't graduate with just a certificate. Gain hands-on mastery in **Affiliate Marketing**, **AI Video Production**, and **YouTube Automation** to build sustainable online revenue.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href={SELAR_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button style={{
                background: 'linear-gradient(135deg, #d4a020 0%, #ff8c00 100%)',
                color: '#000',
                border: 'none',
                borderRadius: '100px',
                padding: '1.1rem 2.5rem',
                fontSize: '1.05rem',
                fontFamily: 'var(--font-header)',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(212, 160, 32, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>🛒</span>
                <span>Browse Selar Store</span>
                <span>→</span>
              </button>
            </a>

            <a
              href={WHATSAPP_CONTACT}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button style={{
                background: 'rgba(37, 211, 102, 0.12)',
                color: '#25D366',
                border: '1px solid rgba(37, 211, 102, 0.35)',
                borderRadius: '100px',
                padding: '1.1rem 2.25rem',
                fontSize: '1.05rem',
                fontFamily: 'var(--font-header)',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'rgba(37, 211, 102, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'rgba(37, 211, 102, 0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>💬</span>
                <span>WhatsApp Mentor</span>
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Main Course Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2rem) 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.8rem' }}>
            CURATED ACCELERATORS
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', marginTop: '0.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
            Featured Digital Skill Programs
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.05rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Beginner-friendly step-by-step training created for students and ambitious creators.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {COURSES.map((course) => (
            <div
              key={course.id}
              className="glass"
              style={{
                borderRadius: '24px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--outline-variant)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.2)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--outline-variant)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: '16px',
                    background: 'var(--surface)', border: '1px solid var(--outline-variant)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem'
                  }}>
                    {course.icon}
                  </div>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 800, padding: '0.3rem 0.75rem',
                    borderRadius: '100px', background: 'rgba(255,255,255,0.06)',
                    color: course.badgeColor, border: `1px solid ${course.badgeColor}40`,
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    {course.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.25 }}>
                  {course.title}
                </h3>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {course.description}
                </p>

                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>
                    What You Will Master:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {course.topics.map((t, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--on-surface)' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '1.25rem', marginTop: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginBottom: '0.9rem', fontWeight: 600 }}>
                  💡 {course.highlight}
                </div>
                <a
                  href={SELAR_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <button style={{
                    width: '100%',
                    padding: '0.85rem',
                    background: 'var(--primary)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease'
                  }}
                    onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                    onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}
                  >
                    <span>Get Access on Selar</span>
                    <span>→</span>
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instructor / About Digital Oluwaseun */}
      <section style={{
        maxWidth: '1200px', margin: '0 auto 6rem', padding: '0 clamp(1rem, 4vw, 2rem)'
      }}>
        <div className="glass" style={{
          borderRadius: '32px',
          padding: 'clamp(2rem, 6vw, 4rem)',
          border: '1px solid var(--outline-variant)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>
              ABOUT THE MENTOR
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginTop: '0.5rem', marginBottom: '1.25rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
              Meet Olarimi Oluwaseun <br />
              <span style={{ color: 'var(--primary)' }}>Founder, Digital Oluwaseun</span>
            </h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Digital Oluwaseun is committed to demystifying online income and modern tech skills for Nigerian students and young adults. By leveraging battle-tested affiliate strategies and automated AI pipelines, we help learners build real, practical digital assets.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '0.85rem 1.75rem', borderRadius: '100px',
                  background: 'rgba(37, 211, 102, 0.15)', color: '#25D366',
                  border: '1px solid rgba(37, 211, 102, 0.35)', fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <span>💬 Direct WhatsApp: 08143064008</span>
                </button>
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '0.85rem 1.75rem', borderRadius: '100px',
                  background: 'var(--surface-variant)', color: 'var(--on-surface)',
                  border: '1px solid var(--outline-variant)', fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <span>🎵 TikTok: @digital.sn.olarimi.o</span>
                </button>
              </a>
            </div>
          </div>

          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--outline-variant)',
            borderRadius: '24px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
              🌟 Why Students Choose Our Programs
            </h3>
            {[
              { icon: '📱', title: '100% Mobile Optimized', text: 'Learn and execute everything directly from your smartphone.' },
              { icon: '💰', title: '50% - 60% Affiliate Margins', text: 'Earn substantial commissions as you practice real digital sales.' },
              { icon: '⚡', title: 'Action-Oriented Training', text: 'No fluff or outdated theories — purely practical execution.' },
              { icon: '🔒', title: 'Secure Selar Processing', text: 'Instant course delivery and reliable NGN payment channels.' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{item.title}</div>
                  <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Local Video Gallery ── */}
      {LOCAL_VIDEOS.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto 6rem', padding: '0 clamp(1rem, 4vw, 2rem)' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.8rem' }}>
              WATCH &amp; LEARN
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', marginTop: '0.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
              See It In Action
            </h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.05rem', maxWidth: '560px', margin: '0.5rem auto 0' }}>
              Real demonstrations from Digital Oluwaseun — watch before you enroll.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '1.75rem'
          }}>
            {LOCAL_VIDEOS.map((video, idx) => (
              <div
                key={idx}
                className="glass"
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid var(--outline-variant)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.25)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--outline-variant)';
                }}
              >
                {/* Native HTML5 video player — works on all devices */}
                <video
                  src={video.file}
                  controls
                  playsInline
                  preload="metadata"
                  style={{ width: '100%', display: 'block', maxHeight: '280px', objectFit: 'cover', background: '#000' }}
                />

                {/* Video info */}
                <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: 1.3 }}>
                    {video.title}
                  </h3>
                  {video.description && (
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Student Testimonials ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 6rem', padding: '0 clamp(1rem, 4vw, 2rem)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.8rem' }}>
            REAL RESULTS
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', marginTop: '0.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
            What Our Students Are Saying
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.05rem', maxWidth: '560px', margin: '0.5rem auto 0' }}>
            Real screenshots from real students — their wins speak for themselves.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '1.25rem'
        }}>
          {[
            { src: '/testimonials/testimony1.jpeg', alt: 'Student testimony 1' },
            { src: '/testimonials/testimony2.jpeg', alt: 'Student testimony 2' },
            { src: '/testimonials/testimony3.jpeg', alt: 'Student testimony 3' },
            { src: '/testimonials/testimony4.jpeg', alt: 'Student testimony 4' },
          ].map((img, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid var(--outline-variant)',
                background: 'var(--surface-variant)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'zoom-in'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--outline-variant)';
              }}
              onClick={() => window.open(img.src, '_blank')}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover'
                }}
              />
            </div>
          ))}
        </div>

        {/* Social proof line */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.95rem', fontWeight: 600 }}>
            Join hundreds of students already earning with Digital Oluwaseun 🚀
          </p>
          <a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button style={{
              marginTop: '1rem',
              background: 'rgba(37, 211, 102, 0.12)',
              color: '#25D366',
              border: '1px solid rgba(37, 211, 102, 0.35)',
              borderRadius: '100px',
              padding: '0.85rem 2rem',
              fontFamily: 'var(--font-header)',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              💬 I Want Results Like These
            </button>
          </a>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ maxWidth: '850px', margin: '0 auto 6rem', padding: '0 clamp(1rem, 4vw, 2rem)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="glass"
              style={{
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                border: '1px solid var(--outline-variant)',
                cursor: 'pointer'
              }}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1rem' }}>
                <span>{faq.q}</span>
                <span style={{ color: 'var(--primary)', fontSize: '1.2rem', transition: 'transform 0.2s', transform: openFaq === idx ? 'rotate(45deg)' : 'none' }}>
                  +
                </span>
              </div>
              {openFaq === idx && (
                <div style={{ marginTop: '0.75rem', color: 'var(--on-surface-variant)', fontSize: '0.92rem', lineHeight: 1.5, borderTop: '1px solid var(--outline-variant)', paddingTop: '0.75rem' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={{
        maxWidth: '1200px', margin: '0 auto 6rem', padding: '0 clamp(1rem, 4vw, 2rem)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 160, 32, 0.15) 0%, var(--surface-variant) 100%)',
          border: '1.5px solid var(--primary)',
          borderRadius: '32px',
          padding: 'clamp(2.5rem, 6vw, 4.5rem) 2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.04em' }}>
            Ready to Build Your Online Income?
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Get instant access to our top digital courses on Selar or message us directly on WhatsApp for one-on-one enrollment guidance.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={SELAR_STORE_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'var(--primary)', color: '#000', border: 'none',
                borderRadius: '100px', padding: '1rem 2.5rem', fontWeight: 900, fontSize: '1rem',
                cursor: 'pointer', boxShadow: '0 8px 30px rgba(212, 160, 32, 0.4)'
              }}>
                Visit Selar Store Now →
              </button>
            </a>
            <a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'rgba(37, 211, 102, 0.15)', color: '#25D366',
                border: '1px solid rgba(37, 211, 102, 0.35)', borderRadius: '100px',
                padding: '1rem 2.25rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer'
              }}>
                Chat with Olarimi on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
