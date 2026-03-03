import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { getResources, getTutors, getCategories } from '../lib/supabase';
import PageLoader from '../components/PageLoader';
import { WhatsAppButton } from '../components/SharedUI';

export default function HomePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [featuredResources, setFeaturedResources] = useState([]);
  const [featuredTutors, setFeaturedTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Safety timeout: dismiss loader after 7 seconds regardless of network
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
        padding: '10rem 2rem 8rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 100%, var(--primary-container) 0%, var(--surface) 100%)'
      }}>
        {/* Animated Background Blobs */}
        <div style={{
          position: 'absolute', top: '-10%', left: '20%', width: '30%', height: '40%',
          background: 'var(--primary)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', top: '10%', right: '10%', width: '20%', height: '30%',
          background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="gradient-text" style={{
            fontSize: 'max(3.5rem, 5vw)', lineHeight: 0.9, marginBottom: '1.5rem',
            fontFamily: 'var(--font-header)', fontWeight: 900, letterSpacing: '-0.06em'
          }}>
            Ace Your Degree.<br />
            Zero Stress.
          </h1>
          <p style={{
            color: 'var(--on-surface-variant)', fontSize: '1.15rem', maxWidth: '600px',
            margin: '0 auto 3.5rem', fontFamily: 'var(--font-body)', fontWeight: 500, lineHeight: 1.6
          }}>
            The ultimate resource platform for Nigerian students. Download past questions,
            lecture notes, and book top-rated tutors in minutes.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/dashboard">
                <button style={{
                  background: 'var(--on-surface)', color: 'var(--surface)', border: 'none',
                  borderRadius: '100px', padding: '1.2rem 3rem', fontSize: '1.1rem',
                  fontFamily: 'var(--font-header)', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >Go to Dashboard</button>
              </Link>
            ) : (
              <Link to="/resources">
                <button style={{
                  background: 'var(--on-surface)', color: 'var(--surface)', border: 'none',
                  borderRadius: '100px', padding: '1.2rem 3rem', fontSize: '1.1rem',
                  fontFamily: 'var(--font-header)', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >Get Started</button>
              </Link>
            )}
            <Link to="/tutors">
              <button style={{
                background: 'var(--surface-variant)', color: 'var(--on-surface)',
                border: '1px solid var(--outline-variant)', borderRadius: '100px',
                padding: '1.2rem 2.5rem', fontSize: '1.1rem',
                fontFamily: 'var(--font-header)', fontWeight: 700,
                cursor: 'pointer', backdropFilter: 'blur(8px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >Find a Tutor</button>
            </Link>
          </div>
        </div>
      </section>

      {loading ? (
        <PageLoader />
      ) : (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' }}>

          {/* Categories Grid */}
          <section style={{ marginBottom: '8rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.75rem' }}>Browse</span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Core Categories</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
              {categories.map(cat => (
                <Link to={`/resources?category=${cat.id}`} key={cat.id} className="glass" style={{
                  borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center',
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
          <section style={{ marginBottom: '8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
              <div>
                <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem' }}>Hot</span>
                <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>Latest Resources</h2>
              </div>
              <Link to="/resources" style={{
                color: 'var(--primary)', padding: '0.75rem 1.75rem', borderRadius: '100px',
                background: 'var(--primary-container)', fontWeight: 800, fontSize: '0.9rem',
                border: '1px solid rgba(188, 149, 92, 0.2)'
              }}>View Repository →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
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
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>Elite Tutors</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
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

          {/* Share Section */}
          <section className="animate-fade-in" style={{
            marginTop: '8rem', padding: '6rem 3rem', borderRadius: '40px',
            background: 'var(--on-surface)', color: 'var(--surface)', textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.06em' }}>Empower Your Circle</h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto 3rem', fontWeight: 500 }}>
              Sharing is the fastest way to build a stronger academic community. Send HackMyDegree to your course groups and help your classmates ace their exams.
            </p>
            <div style={{ maxWidth: '300px', margin: '0 auto' }}>
              <WhatsAppButton text="Hey! Check out HackMyDegree. It's got all the past questions, notes, and tutors we need for our exams! 🚀" />
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
