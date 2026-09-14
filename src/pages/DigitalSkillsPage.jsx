// src/pages/DigitalSkillsPage.jsx
import React, { useState } from 'react';
import LOCAL_VIDEOS from '../videos/youtubeLinks';
import { 
  SparklesIcon, 
  TrendingUpIcon, 
  VideoCameraIcon, 
  GlobeAltIcon, 
  CheckBadgeIcon, 
  StarIcon 
} from '../components/SharedUI';

const SELAR_STORE_URL = 'https://selar.com/m/chiadikobi-rejoice1?affiliate=1v3l31j354';
const WHATSAPP_CONTACT = 'https://wa.me/2348143064008?text=Hello%20Digital%20Oluwaseun,%20I%20am%20interested%20in%20learning%20more%20about%20your%20digital%20skills%20and%20online%20income%20courses!';
const TIKTOK_URL = 'https://www.tiktok.com/@digital.sn.olarimi.o';

const COURSES = [
  {
    id: 'affiliate-marketing',
    title: 'Affiliate Marketing Mastery',
    iconType: 'trending',
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
    iconType: 'video',
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
    iconType: 'sparkles',
    badge: 'Passive Income',
    badgeColor: '#E5A83B',
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
    iconType: 'globe',
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
        padding: 'clamp(5rem, 12vh, 7.5rem) 1.5rem clamp(3rem, 7vh, 4.5rem)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--outline-variant)'
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--primary-container)', color: 'var(--primary)',
            padding: '0.4rem 1.1rem', borderRadius: '100px',
            fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.5rem',
            border: '1px solid rgba(188, 149, 92, 0.25)',
            letterSpacing: '0.3px'
          }}>
            <SparklesIcon size={14} color="var(--primary)" />
            <span>DIGITAL OLUWASEUN × HACKMYDEGREE</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.3rem, 6.5vw, 4rem)',
            lineHeight: 1.08,
            fontWeight: 900,
            marginBottom: '1.5rem',
            letterSpacing: '-0.04em',
            color: 'var(--on-surface)'
          }}>
            High-Income Skills <br />
            <span className="gradient-text">For Ambitious Students.</span>
          </h1>

          <p style={{
            color: 'var(--on-surface-variant)',
            fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            fontWeight: 400,
            lineHeight: 1.6
          }}>
            Gain hands-on mastery in Affiliate Marketing, AI Video Production, and YouTube Automation to build sustainable online revenue alongside your degree.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href={SELAR_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button style={{
                background: 'var(--primary)',
                color: '#000',
                border: 'none',
                borderRadius: '100px',
                padding: '0.95rem 2.2rem',
                fontSize: '0.98rem',
                fontFamily: 'var(--font-header)',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(188, 149, 92, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.25s ease'
              }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <TrendingUpIcon size={16} color="#000" />
                <span>Explore Selar Store →</span>
              </button>
            </a>

            <a
              href={WHATSAPP_CONTACT}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button style={{
                background: 'var(--surface-variant)',
                color: 'var(--on-surface)',
                border: '1px solid var(--outline-variant)',
                borderRadius: '100px',
                padding: '0.95rem 2rem',
                fontSize: '0.98rem',
                fontFamily: 'var(--font-header)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                transition: 'all 0.25s ease'
              }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'var(--outline-variant)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <GlobeAltIcon size={16} color="var(--primary)" />
                <span>Consult Mentor</span>
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Main Course Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem clamp(1rem, 4vw, 2rem) 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.8rem' }}>
            ACCREDITED TRACKS
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginTop: '0.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Featured Digital Programs
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', maxWidth: '580px', margin: '0.5rem auto 0', lineHeight: 1.5 }}>
            Action-oriented practical training created specifically for Nigerian university students.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {COURSES.map((course) => {
            const IconComp = 
              course.iconType === 'trending' ? TrendingUpIcon :
              course.iconType === 'video' ? VideoCameraIcon :
              course.iconType === 'sparkles' ? SparklesIcon : GlobeAltIcon;

            return (
              <div
                key={course.id}
                className="glass"
                style={{
                  borderRadius: '20px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--outline-variant)',
                  background: 'var(--surface-variant)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
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
                      width: 48, height: 48, borderRadius: '14px',
                      background: 'var(--primary-container)', border: '1px solid rgba(188, 149, 92, 0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <IconComp size={22} color="var(--primary)" />
                    </div>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.65rem',
                      borderRadius: '100px', background: 'var(--surface)',
                      color: 'var(--on-surface-variant)', border: '1px solid var(--outline-variant)'
                    }}>
                      {course.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem', lineHeight: 1.3 }}>
                    {course.title}
                  </h3>
                  <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {course.description}
                  </p>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                      Key Modules:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {course.topics.map((t, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--on-surface)' }}>
                          <CheckBadgeIcon size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '0.85rem', fontWeight: 600 }}>
                    {course.highlight}
                  </div>
                  <a
                    href={SELAR_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <button style={{
                      width: '100%',
                      padding: '0.8rem',
                      background: 'var(--surface)',
                      color: 'var(--on-surface)',
                      border: '1px solid var(--outline-variant)',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}
                      onMouseOver={e => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.borderColor = 'var(--outline-variant)';
                        e.currentTarget.style.color = 'var(--on-surface)';
                      }}
                    >
                      <span>Enroll on Selar</span>
                      <span>→</span>
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Instructor / About Digital Oluwaseun */}
      <section style={{
        maxWidth: '1200px', margin: '0 auto 6rem', padding: '0 clamp(1rem, 4vw, 2rem)'
      }}>
        <div className="glass" style={{
          borderRadius: '28px',
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          border: '1px solid var(--outline-variant)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>
              ACCREDITATION & MENTORSHIP
            </span>
            <h2 style={{ fontSize: 'clamp(1.7rem, 4.5vw, 2.3rem)', marginTop: '0.5rem', marginBottom: '1rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
              Meet Olarimi Oluwaseun <br />
              <span style={{ color: 'var(--primary)' }}>Founder, Digital Oluwaseun</span>
            </h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Digital Oluwaseun empowers Nigerian university students with practical monetization frameworks. By combining modern AI workflows with affiliate sales funnels, students acquire real digital leverage.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '0.8rem 1.6rem', borderRadius: '100px',
                  background: 'var(--primary-container)', color: 'var(--primary)',
                  border: '1px solid rgba(188, 149, 92, 0.3)', fontWeight: 700,
                  fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <span>WhatsApp: 08143064008</span>
                </button>
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '0.8rem 1.6rem', borderRadius: '100px',
                  background: 'var(--surface-variant)', color: 'var(--on-surface)',
                  border: '1px solid var(--outline-variant)', fontWeight: 700,
                  fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <span>TikTok: @digital.sn.olarimi.o</span>
                </button>
              </a>
            </div>
          </div>

          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--outline-variant)',
            borderRadius: '20px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.15rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--on-surface)' }}>
              Program Standards & Guarantees
            </h3>
            {[
              { icon: <GlobeAltIcon size={18} color="var(--primary)" />, title: '100% Smartphone Compatible', text: 'All modules are executable on Android and iOS devices.' },
              { icon: <TrendingUpIcon size={18} color="var(--primary)" />, title: '50% - 60% Commission Margins', text: 'High-payout revenue models for enrolled students.' },
              { icon: <SparklesIcon size={18} color="var(--primary)" />, title: 'Practical Execution Workflows', text: 'Step-by-step video demonstrations without theoretical fluff.' },
              { icon: <CheckBadgeIcon size={18} color="var(--primary)" />, title: 'Verified Selar Infrastructure', text: 'Instant access delivery with official course certificates.' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{ marginTop: '2px' }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.title}</div>
                  <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem', lineHeight: 1.4 }}>{item.text}</div>
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
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.95rem', fontWeight: 500 }}>
            Proven results from students implementing the Digital Oluwaseun curriculum.
          </p>
          <a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>
            <button style={{
              background: 'var(--primary)',
              color: '#000',
              border: 'none',
              borderRadius: '100px',
              padding: '0.85rem 2rem',
              fontFamily: 'var(--font-header)',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(188, 149, 92, 0.3)',
              transition: 'all 0.2s ease'
            }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <SparklesIcon size={16} color="#000" />
              <span>Get Started With Digital Skills →</span>
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
