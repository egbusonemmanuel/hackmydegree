import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { getResources, getTutors, getCategories } from '../lib/supabase';
import PageLoader from '../components/PageLoader';
import { 
  WhatsAppButton, 
  SparklesIcon, 
  BookOpenIcon, 
  AcademicCapIcon, 
  TrendingUpIcon, 
  VideoCameraIcon, 
  GlobeAltIcon, 
  CheckBadgeIcon 
} from '../components/SharedUI';

export default function HomePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [featuredResources, setFeaturedResources] = useState([]);
  const [featuredTutors, setFeaturedTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const safetyTimeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 7000);

    async function loadData() {
      try {
        const [cats, res, tuts] = await Promise.all([
          getCategories().then(res => (mounted ? res.data?.slice(0, 4) || [] : [])),
          getResources({ limit: 3 }).then(res => (mounted ? res.data || [] : [])),
          getTutors({ limit: 3 }).then(res => (mounted ? res.data || [] : []))
        ]);

        if (mounted) {
          setCategories(cats);
          setFeaturedResources(res);
          setFeaturedTutors(tuts);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    }

    loadData();
    return () => { mounted = false; clearTimeout(safetyTimeout); };
  }, []);

  return (
    <div style={{ background: 'var(--surface)' }}>
      {/* Hero Section */}
      <section style={{
        padding: 'clamp(5.5rem, 13vh, 8.5rem) 1.5rem clamp(3.5rem, 8vh, 6.5rem)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--outline-variant)'
      }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--primary-container)',
            color: 'var(--primary)',
            padding: '0.4rem 1.1rem',
            borderRadius: '100px',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
            border: '1px solid rgba(188, 149, 92, 0.25)',
            letterSpacing: '0.3px'
          }}>
            <SparklesIcon size={14} color="var(--primary)" />
            <span>ACADEMIC INTELLIGENCE & STUDY VAULT</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 7vw, 4.4rem)',
            lineHeight: 1.06,
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-header)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: 'var(--on-surface)'
          }}>
            The Standard for <br />
            <span className="gradient-text">Academic Excellence.</span>
          </h1>

          <p style={{
            color: 'var(--on-surface-variant)',
            fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
            maxWidth: '640px',
            margin: '0 auto 3rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            lineHeight: 1.6
          }}>
            Access verified past questions, departmental lecture notes, vetted 1-on-1 peer tutors, and DegreeAI revision intelligence across Nigerian universities.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/ai-assistant">
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
                gap: '0.55rem',
                transition: 'all 0.25s ease'
              }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <SparklesIcon size={16} color="#000" />
                <span>Launch DegreeAI</span>
              </button>
            </Link>

            {user ? (
              <Link to="/dashboard">
                <button style={{
                  background: 'var(--surface-variant)',
                  color: 'var(--on-surface)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: '100px',
                  padding: '0.95rem 2.2rem',
                  fontSize: '0.98rem',
                  fontFamily: 'var(--font-header)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >Go to Dashboard</button>
              </Link>
            ) : (
              <Link to="/resources">
                <button style={{
                  background: 'var(--surface-variant)',
                  color: 'var(--on-surface)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: '100px',
                  padding: '0.95rem 2.2rem',
                  fontSize: '0.98rem',
                  fontFamily: 'var(--font-header)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >Explore Vault</button>
              </Link>
            )}

            <Link to="/tutors">
              <button style={{
                background: 'transparent',
                color: 'var(--on-surface-variant)',
                border: '1px solid var(--outline-variant)',
                borderRadius: '100px',
                padding: '0.95rem 2rem',
                fontSize: '0.98rem',
                fontFamily: 'var(--font-header)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.color = 'var(--on-surface)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.color = 'var(--on-surface-variant)';
                }}
              >Find a Tutor</button>
            </Link>
          </div>
        </div>
      </section>

      {loading ? (
        <PageLoader />
      ) : (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1rem, 4vw, 2rem)' }}>

          {/* DegreeAI Showcase Section */}
          <section style={{
            marginBottom: '6.5rem',
            background: 'var(--surface-variant)',
            border: '1px solid var(--outline-variant)',
            borderRadius: '28px',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'var(--primary-container)',
                  color: 'var(--primary)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  marginBottom: '1.25rem',
                  letterSpacing: '0.5px'
                }}>
                  <SparklesIcon size={14} color="var(--primary)" />
                  <span>DEGREEAI ENGINE</span>
                </div>
                <h2 style={{
                  fontSize: 'clamp(1.8rem, 4.5vw, 2.7rem)',
                  fontFamily: 'var(--font-header)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  margin: '0 0 1rem 0',
                  lineHeight: 1.15
                }}>
                  Your On-Demand <br />
                  <span style={{ color: 'var(--primary)' }}>Academic Assistant.</span>
                </h2>
                <p style={{
                  color: 'var(--on-surface-variant)',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  marginBottom: '2rem'
                }}>
                  Stuck on complex past questions, proofs, or 60-slide lecture decks? DegreeAI delivers step-by-step marking scheme solutions and concise revision summaries in seconds.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to="/ai-assistant">
                    <button style={{
                      background: 'var(--primary)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '100px',
                      padding: '0.85rem 1.85rem',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 16px rgba(188, 149, 92, 0.3)'
                    }}>
                      <SparklesIcon size={16} color="#000" />
                      <span>Open DegreeAI Workspace →</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Interactive feature highlights grid */}
              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { icon: <BookOpenIcon size={20} color="var(--primary)" />, title: 'Past Question Marking Scheme', desc: 'Structured, step-by-step exam answers mapped to syllabus criteria.' },
                  { icon: <SparklesIcon size={20} color="var(--primary)" />, title: 'Concept Clarification', desc: 'Break down complex academic theories with intuitive analogies.' },
                  { icon: <CheckBadgeIcon size={20} color="var(--primary)" />, title: '5-Min Revision Sheets', desc: 'Condense large course modules into core formulas and definitions.' },
                  { icon: <AcademicCapIcon size={20} color="var(--primary)" />, title: 'Mock Exam Generator', desc: 'Simulate university exam-style questions to test mastery.' }
                ].map((feat, idx) => (
                  <div key={idx} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    transition: 'var(--transition-standard)'
                  }}>
                    <div style={{ marginBottom: '0.75rem' }}>{feat.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--on-surface)', marginBottom: '0.35rem' }}>{feat.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', lineHeight: 1.45 }}>{feat.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Categories Grid */}
          <section style={{ marginBottom: 'clamp(4rem, 10vw, 8rem)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 4rem)' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.75rem' }}>Browse</span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)', marginTop: '0.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Core Categories</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {categories.map(cat => (
                <Link to={`/resources?category=${cat.id}`} key={cat.id} className="glass" style={{
                  borderRadius: '24px', padding: 'clamp(2rem, 5vw, 3rem) 1.5rem', textAlign: 'center',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', display: 'block',
                  border: '1px solid var(--outline-variant)',
                  background: 'var(--surface-variant)',
                  fontFamily: 'var(--font-body)'
                }} onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.background = 'var(--surface)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                }} onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--outline-variant)';
                  e.currentTarget.style.background = 'var(--surface-variant)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1.25rem', filter: 'drop-shadow(0 0 10px var(--primary-container))' }}>{cat.icon || '📚'}</div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--on-surface)', fontWeight: 800, fontFamily: 'var(--font-header)' }}>{cat.name}</h3>
                  <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', marginTop: '0.4rem', fontWeight: 500 }}>{cat.description || 'View all materials'}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Resources */}
          <section style={{ marginBottom: 'clamp(4rem, 10vw, 8rem)' }}>
            <div className="responsive-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
              <div>
                <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem' }}>Hot</span>
                <h2 style={{ fontSize: 'clamp(1.8rem, 7vw, 2.5rem)', marginTop: '0.5rem' }}>Latest Resources</h2>
              </div>
              <Link to="/resources" style={{
                color: 'var(--primary)', padding: '0.75rem 1.75rem', borderRadius: '100px',
                background: 'var(--primary-container)', fontWeight: 800, fontSize: '0.9rem',
                border: '1px solid rgba(188, 149, 92, 0.2)', display: 'inline-block'
              }}>View Repository →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {featuredResources.map(res => (
                <Link to={`/resources/${res.id}`} key={res.id} className="glass" style={{
                  borderRadius: '24px', overflow: 'hidden', transition: 'var(--transition-smooth)',
                  display: 'block'
                }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ height: '220px', position: 'relative', background: 'var(--surface-variant)' }}>
                    {res.thumbnail_url ? (
                      <img src={res.thumbnail_url} alt={res.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '4rem', opacity: 0.5 }}>📖</span>
                      </div>
                    )}
                    <div style={{
                      position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem 1rem',
                      borderRadius: '100px', fontWeight: 800, fontSize: '0.8rem',
                      background: res.resource_type === 'premium' ? 'var(--on-primary-container)' : 'var(--primary)',
                      color: res.resource_type === 'premium' ? 'var(--primary-container)' : 'var(--on-primary)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>
                      {res.resource_type === 'premium' ? `₦${res.price}` : 'FREE'}
                    </div>
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <div style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      {res.category?.name || 'Academic'}
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>{res.title}</h3>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.95rem', marginBottom: '1.5rem', height: '4.5rem', overflow: 'hidden' }}>
                      {res.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--outline-variant)', paddingTop: '1.25rem' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '12px', background: 'var(--primary-container)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)'
                      }}>
                        {res.uploader?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div style={{ fontSize: '0.9rem' }}>
                        <div style={{ fontWeight: 700 }}>{res.uploader?.username}</div>
                        <div style={{ color: 'var(--outline)', fontSize: '0.75rem' }}>{res.uploader?.university || 'University Student'}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Tutors (Final Section) */}
          <section>
            <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem' }}>Mentorship</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 7vw, 2.5rem)', marginTop: '0.5rem' }}>Elite Tutors</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {featuredTutors.map(tutor => (
                <div key={tutor.id} className="glass" style={{
                  borderRadius: '24px', padding: '2rem', display: 'flex', gap: '1.5rem',
                  alignItems: 'center', transition: 'var(--transition-standard)'
                }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '20px', background: 'var(--surface-variant)',
                    backgroundImage: `url(${tutor.profile?.avatar_url})`, backgroundSize: 'cover',
                    border: '2px solid var(--outline-variant)'
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.2rem' }}>{tutor.profile?.full_name || tutor.profile?.username}</h3>
                      <div style={{ color: '#FFD600', fontWeight: 800, fontSize: '0.9rem' }}>★ {tutor.rating_avg || '5.0'}</div>
                    </div>
                    <div style={{ color: 'var(--outline)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{tutor.profile?.university}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: 'var(--on-surface)' }}>₦{tutor.hourly_rate}<small style={{ opacity: 0.6 }}>/hr</small></span>
                      <Link to={`/book/${tutor.id}`}>
                        <button style={{
                          background: 'var(--on-surface)', color: 'var(--surface)', border: 'none',
                          borderRadius: '100px', padding: '0.7rem 1.5rem', fontSize: '0.85rem',
                          fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                        }}>Reserve Session</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Digital Skills & Online Income Hub */}
          <section style={{
            marginTop: 'clamp(4.5rem, 10vh, 7rem)',
            background: 'var(--surface-variant)',
            border: '1px solid var(--outline-variant)',
            borderRadius: '28px',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="responsive-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'var(--primary-container)',
                  color: 'var(--primary)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  letterSpacing: '0.5px'
                }}>
                  <TrendingUpIcon size={14} color="var(--primary)" />
                  <span>INDUSTRY DIGITAL ACCELERATORS</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                  High-Income Digital Skills <br />
                  <span style={{ color: 'var(--primary)' }}>For Modern Students.</span>
                </h2>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', maxWidth: '640px', marginTop: '0.75rem', lineHeight: 1.55 }}>
                  Practical, cohort-tested curricula in Affiliate Marketing, AI Video Creation, and YouTube Automation to build income alongside your degree.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/skills">
                  <button style={{
                    background: 'var(--primary)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '0.85rem 1.75rem',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 16px rgba(188, 149, 92, 0.3)'
                  }}>
                    Explore All Tracks →
                  </button>
                </Link>
                <a href="https://selar.com/m/chiadikobi-rejoice1?affiliate=1v3l31j354" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'var(--surface)',
                    color: 'var(--on-surface)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: '100px',
                    padding: '0.85rem 1.75rem',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer'
                  }}>
                    Selar Academy ↗
                  </button>
                </a>
              </div>
            </div>

            {/* 4 Feature Skill Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
              {[
                {
                  icon: <TrendingUpIcon size={24} color="var(--primary)" />,
                  title: 'Affiliate Marketing',
                  badge: '50%-60% Commission',
                  desc: 'High-converting sales funnels, student copywriting, and weekly direct payouts via Selar.'
                },
                {
                  icon: <VideoCameraIcon size={24} color="var(--primary)" />,
                  title: 'AI Video Production',
                  badge: 'No Studio Needed',
                  desc: 'Produce high-converting commercial reels and faceless video assets using generative AI tools.'
                },
                {
                  icon: <SparklesIcon size={24} color="var(--primary)" />,
                  title: 'YouTube Automation',
                  badge: 'Passive Revenue',
                  desc: 'Launch and scale faceless channels with automated research, scriptwriting, and high-RPM niche targeting.'
                },
                {
                  icon: <GlobeAltIcon size={24} color="var(--primary)" />,
                  title: 'Remote Freelancing',
                  badge: 'High-Ticket Clients',
                  desc: 'Package portfolio assets and close international clients for remote digital work.'
                }
              ].map((item, idx) => (
                <div key={idx} className="glass" style={{
                  background: 'var(--surface)',
                  borderRadius: '18px',
                  padding: '1.5rem',
                  border: '1px solid var(--outline-variant)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'var(--transition-standard)'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        background: 'var(--primary-container)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {item.icon}
                      </div>
                      <span style={{
                        background: 'var(--surface-variant)',
                        color: 'var(--on-surface-variant)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '100px',
                        border: '1px solid var(--outline-variant)'
                      }}>
                        {item.badge}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--on-surface)' }}>{item.title}</h3>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>{item.desc}</p>
                  </div>
                  <a href="https://selar.com/m/chiadikobi-rejoice1?affiliate=1v3l31j354" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      View Curriculum →
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Share Section */}
          <section className="animate-fade-in" style={{
            marginTop: 'clamp(4rem, 10vh, 7rem)',
            padding: 'clamp(3rem, 7vw, 5rem) 1.5rem',
            borderRadius: '28px',
            background: 'var(--surface-variant)',
            border: '1px solid var(--outline-variant)',
            color: 'var(--on-surface)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.04em' }}>Empower Your Course Mates</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--on-surface-variant)', maxWidth: '580px', margin: '0 auto 2.5rem', fontWeight: 400, lineHeight: 1.6 }}>
              Share HackMyDegree with your university department and study groups to help your classmates prepare for exams with confidence.
            </p>
            <div style={{ maxWidth: '280px', margin: '0 auto' }}>
              <WhatsAppButton text="Hey! Check out HackMyDegree — it has all the past questions, lecture notes, and study resources for our exams: " />
            </div>
          </section>

        </div>
      )}

      {/* Footer / Legal Links */}
      <footer style={{
        borderTop: '1px solid var(--outline-variant)',
        padding: '6rem 2rem',
        textAlign: 'center',
        background: 'var(--surface-variant)',
        fontFamily: 'var(--font-body)'
      }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontFamily: 'var(--font-header)', fontWeight: 900, fontSize: '2rem', color: 'var(--primary)', letterSpacing: '-0.04em' }}>
            Hack<span style={{ color: 'var(--on-surface)' }}>MyDegree</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <Link to="/legal?tab=terms" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>Terms of Service</Link>
          <Link to="/legal?tab=privacy" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>Privacy Policy</Link>
          <Link to="/legal?tab=rights" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>Resource Rights</Link>
        </div>
        <div style={{ color: 'var(--outline)', fontSize: '0.85rem', fontWeight: 500 }}>
          © 2026 HackMyDegree. Engineered for academic excellence in Nigeria.
        </div>
      </footer>
    </div>
  );
}
