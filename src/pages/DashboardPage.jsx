// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { supabase, getMyPurchases, getMyBookings, getTutorBookings, getPendingTutors, getPendingResources, confirmBooking, approveTutor, approveResource, deleteResource, completeBooking, deleteTutorProfile, deleteBooking } from '../lib/supabase';
import { payForProSubscription } from '../lib/paystack';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../components/PageLoader';
import { Button, Banner, Field, Input } from '../components/SharedUI';

const TAB = { OVERVIEW: 'overview', UPLOADS: 'uploads', PURCHASES: 'purchases', BOOKINGS: 'bookings', MESSAGES: 'messages', EARNINGS: 'earnings', SESSIONS: 'sessions', ADMIN: 'admin' };

export default function DashboardPage() {
  const { user, profile, refreshProfile, session } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(TAB.OVERVIEW);
  const [uploads, setUploads] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tutorSessions, setTutorSessions] = useState([]);
  const [pendingTutors, setPendingTutors] = useState([]);
  const [pendingResources, setPendingResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [upgradingPro, setUpgradingPro] = useState(false);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    const safetyTimeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 8000);

    const fetchData = async () => {
      try {
        const promises = [
          supabase.from('resources').select('*, category:categories(name, icon)').eq('uploader_id', user.id).order('created_at', { ascending: false }),
          getMyPurchases(user.id),
          getMyBookings(user.id)
        ];

        // If tutor, get incoming sessions
        if (profile?.is_tutor) {
          const { data: tpRows } = await supabase.from('tutor_profiles').select('id').eq('user_id', user.id);
          const tp = tpRows?.length > 0 ? tpRows[0] : null;
          if (tp) promises.push(getTutorBookings(tp.id));
          else promises.push(Promise.resolve({ data: [] }));
        } else {
          promises.push(Promise.resolve({ data: [] }));
        }

        // If admin, get pending applications
        if (profile?.is_admin) {
          promises.push(getPendingTutors());
          promises.push(getPendingResources());
        } else {
          promises.push(Promise.resolve({ data: [] }));
          promises.push(Promise.resolve({ data: [] }));
        }

        const [up, pur, book, tutSess, pendTut, pendRes] = await Promise.all(promises);

        if (!mounted) return;
        setUploads(up.data || []);
        setPurchases(pur.data || []);
        setBookings(book.data || []);
        setTutorSessions(tutSess.data || []);
        setPendingTutors(pendTut.data || []);
        setPendingResources(pendRes.data || []);
      } catch (err) {
        console.error('[Dashboard] Data load error:', err);
        if (mounted) setError('Failed to synchronize data. Some information may be unavailable.');
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    };

    fetchData();
    return () => { mounted = false; clearTimeout(safetyTimeout); };
  }, [user, profile]);

  const handleApproveTutor = async (id) => {
    const { error } = await approveTutor(id, session?.access_token);
    if (!error) {
      setPendingTutors(prev => prev.filter(t => t.id !== id));
      alert('Tutor approved and activated!');
    }
  };

  const handleConfirmBooking = async (id) => {
    const link = prompt('Enter the Meeting Link (e.g., Google Meet / Zoom):');
    if (!link) return;
    const { error } = await confirmBooking(id, link);
    if (!error) {
      setTutorSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'confirmed', meet_link: link } : s));
      alert('Booking confirmed and link shared!');
    }
  };

  const handleCompleteBooking = async (id, tutorProfileId, amount) => {
    if (!window.confirm('Mark this session as completed? This will release the payment to the tutor.')) return;

    // We need the tutor's user_id, not their profile id, for the completeBooking function
    // Find the booking to get the user_id
    const booking = bookings.find(b => b.id === id);
    const tutorUserId = booking?.tutor?.user_id;

    if (!tutorUserId) {
      alert('Error finding tutor user ID');
      return;
    }

    const { error } = await completeBooking(id, tutorUserId, amount);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'completed' } : b));
      alert('Session marked as completed! Payment released to tutor.');
    } else {
      console.error(error);
      alert('Error completing booking.');
    }
  };

  const handleDeleteBooking = async (id, isTutorView = false) => {
    if (!window.confirm(!isTutorView
      ? 'Are you sure you want to delete this session from your dashboard? (Note: If this is a paid session, you will lose access and no refund is automatically issued).'
      : 'Are you sure you want to remove this session from your dashboard?')) return;

    const { error } = await deleteBooking(id);
    if (!error) {
      if (isTutorView) {
        setTutorSessions(prev => prev.filter(s => s.id !== id));
      } else {
        setBookings(prev => prev.filter(b => b.id !== id));
      }
    } else {
      alert('Failed to delete session.');
      console.error(error);
    }
  };

  const handleDeleteTutorProfile = async () => {
    const confirm1 = window.confirm('Are you sure you want to deactivate your Tutor Profile?');
    if (!confirm1) return;
    const confirm2 = window.prompt('Type "DEACTIVATE" to confirm you want to remove yourself from the tutor network:');
    if (confirm2 !== 'DEACTIVATE') return;

    setLoading(true);
    const { error } = await deleteTutorProfile(user.id);
    if (error) {
      setLoading(false);
      alert('Failed to deactivate tutor profile.');
      console.error(error);
    } else {
      // Refresh the page to load standard user view
      window.location.reload();
    }
  };

  const handleApproveResource = async (id) => {
    const { error } = await approveResource(id, session?.access_token);
    if (!error) {
      setPendingResources(prev => prev.filter(r => r.id !== id));
      alert('Resource approved and published!');
    }
  };

  const handleRejectResource = async (id) => {
    if (!window.confirm('Are you sure you want to reject and delete this resource?')) return;
    const { error } = await deleteResource(id, session?.access_token);
    if (!error) {
      setPendingResources(prev => prev.filter(r => r.id !== id));
      alert('Resource rejected and removed.');
    }
  };

  const handleUpgradePro = async () => {
    setUpgradingPro(true);
    await payForProSubscription({
      user: { id: user.id, email: user.email },
      onSuccess: async () => {
        await refreshProfile();
        setUpgradingPro(false);
      },
      onClose: () => setUpgradingPro(false)
    });
  };

  const totalEarnings = profile?.total_earned || 0;
  const availableBalance = profile?.balance || 0;
  const totalDownloads = uploads.reduce((acc, r) => acc + (r.download_count || 0), 0);

  // Calculate pending escrow (Tutor share of confirmed/pending sessions)
  const pendingEscrow = profile?.is_tutor ? tutorSessions
    .filter(s => s.status === 'confirmed' || s.status === 'pending')
    .reduce((acc, s) => acc + (s.amount_paid * 0.70), 0) : 0;

  const s = {
    page: { maxWidth: 1080, margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2.5rem)', fontFamily: 'var(--font-body)' },
    card: { background: 'var(--surface)', border: '1px solid var(--outline-variant)', borderRadius: 20, padding: 'clamp(1rem, 4vw, 2rem)', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' },
    statCard: { background: 'var(--surface)', border: '1px solid var(--outline-variant)', borderRadius: 20, padding: '1.25rem', textAlign: 'center', transition: 'all 0.3s ease' },
    tab: (active) => ({
      padding: '0.8rem 1.75rem', borderRadius: '100px', cursor: 'pointer',
      fontFamily: 'var(--font-header)', fontWeight: 700, fontSize: '0.95rem',
      background: active ? 'var(--on-surface)' : 'var(--surface-variant)',
      color: active ? 'var(--surface)' : 'var(--on-surface-variant)',
      border: active ? 'none' : '1px solid var(--outline-variant)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }),
    badge: (type) => ({
      fontSize: '0.75rem', fontWeight: 800, padding: '0.4rem 1rem', borderRadius: '100px',
      background: type === 'approved' ? 'var(--primary-container)' : type === 'pending' ? 'rgba(212, 160, 32, 0.1)' : type === 'completed' ? 'var(--surface-variant)' : 'rgba(255,82,82,0.1)',
      color: type === 'approved' ? 'var(--primary)' : type === 'pending' ? 'var(--primary)' : type === 'completed' ? 'var(--on-surface-variant)' : '#FF5252',
      border: `1px solid var(--outline-variant)`,
      textTransform: 'uppercase', letterSpacing: '1px'
    })
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#888888', marginBottom: '0.3rem' }}>
            My Dashboard
          </div>
          <h1 style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '2rem', color: 'var(--on-surface)', letterSpacing: '-0.04em', margin: 0 }}>
            Hey, {profile?.full_name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p style={{ color: '#888888', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            {profile?.university || 'Welcome back to HackMyDegree'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {!profile?.is_pro && (
            <button onClick={handleUpgradePro} disabled={upgradingPro}
              style={{
                background: 'rgba(212, 160, 32, 0.1)', color: 'var(--primary)',
                border: '1px solid var(--primary)', borderRadius: '100px',
                padding: '0.75rem 1.5rem', cursor: 'pointer',
                fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}>
              {upgradingPro ? '⏳...' : '⚡ Upgrade — ₦500/mo'}
            </button>
          )}
          {profile?.is_pro && (
            <span style={{
              background: 'var(--primary-container)', color: 'var(--primary)',
              border: '1px solid var(--outline-variant)', borderRadius: '100px',
              padding: '0.75rem 1.5rem', fontFamily: 'var(--font-header)',
              fontWeight: 800, fontSize: '0.9rem'
            }}>
              ⭐ PRO Active
            </span>
          )}
          <Button onClick={() => navigate('/upload')} style={{ width: 'auto', padding: '0.75rem 1.75rem' }}>
            + Upload Resource
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { label: 'Uploads', value: uploads.length, icon: '📤' },
          { label: 'Total Downloads', value: totalDownloads.toLocaleString(), icon: '📥' },
          { label: 'Total Earned', value: `₦${totalEarnings.toLocaleString()}`, icon: '💰' },
          { label: 'Available Balance', value: `₦${availableBalance.toLocaleString()}`, icon: '🏦' },
          { label: 'Purchases', value: purchases.length, icon: '🛍️' },
          { label: 'Bookings', value: bookings.length, icon: '📅' }
        ].map(stat => (
          <div key={stat.label} style={s.statCard}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{stat.icon}</div>
            <div style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '1.35rem', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>{stat.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', marginTop: '0.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {Object.values(TAB).map(t => {
          if (t === TAB.SESSIONS && !profile?.is_tutor) return null;
          if (t === TAB.ADMIN && !profile?.is_admin) return null;
          const icons = { overview: '🏠', uploads: '📤', purchases: '🛍️', bookings: '📅', messages: '💬', earnings: '💰', sessions: '🎓', admin: '⚙️' };
          const label = `${icons[t] || ''} ${t.charAt(0).toUpperCase() + t.slice(1)}`;
          return (
            <button key={t} onClick={() => setTab(t)} style={s.tab(tab === t)}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {error && <Banner type="error" msg={error} />}
      {loading ? (
        <PageLoader />
      ) : (
        <>
          {tab === TAB.UPLOADS && (
            <div style={s.card}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', color: '#ffffff', fontSize: '1.5rem', margin: '0 0 1.5rem' }}>
                My Uploads <span style={{ color: '#888888' }}>({uploads.length})</span>
              </h3>
              {uploads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#050705', borderRadius: 16, border: '1px dashed rgba(0,200,83,0.2)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.8 }}>📭</div>
                  <p style={{ color: '#7A9E7E', fontSize: '1rem', margin: 0 }}>
                    Your vault is empty. <span style={{ color: '#00C853', cursor: 'pointer', fontWeight: 600, borderBottom: '1px solid #00C853' }} onClick={() => navigate('/upload')}>Upload your first resource</span>
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {uploads.map(r => (
                    <div key={r.id} style={{ background: '#050705', borderRadius: 16, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', border: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#111611'} onMouseOut={e => e.currentTarget.style.background = '#050705'}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8F5E9', fontSize: '1.1rem', marginBottom: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{r.category?.icon}</span> {r.title}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={s.badge(r.status)}>{r.status}</span>
                          <span style={{ color: '#7A9E7E', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                            {r.download_count || 0}
                          </span>
                          {r.resource_type === 'premium' && (
                            <span style={{ color: '#FFD600', fontSize: '0.85rem', background: 'rgba(255,214,0,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                              ₦{r.price} · Earned: ₦{Math.round((r.download_count || 0) * r.price * 0.7)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ color: '#4A6A4E', fontSize: '0.8rem', flexShrink: 0, fontWeight: 600 }}>
                        {new Date(r.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PURCHASES TAB */}
          {tab === TAB.PURCHASES && (
            <div style={s.card}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', color: '#fff', fontSize: '1.5rem', margin: '0 0 1.5rem' }}>
                Purchased Library <span style={{ color: '#00C853' }}>({purchases.length})</span>
              </h3>
              {purchases.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#050705', borderRadius: 16, border: '1px dashed rgba(0,200,83,0.2)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.8 }}>🛍️</div>
                  <p style={{ color: '#7A9E7E', fontSize: '1rem', margin: 0 }}>
                    No purchases yet. <span style={{ color: '#00C853', cursor: 'pointer', fontWeight: 600, borderBottom: '1px solid #00C853' }} onClick={() => navigate('/resources')}>Explore resources</span>
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {purchases.map(p => (
                    <div key={p.id} style={{ background: '#050705', borderRadius: 16, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8F5E9', fontSize: '1.1rem', marginBottom: '0.2rem' }}>
                          {p.resource?.title || 'Unknown Resource'}
                        </div>
                        <div style={{ color: '#7A9E7E', fontSize: '0.85rem' }}>Paid ₦{p.amount_paid} on {new Date(p.created_at).toLocaleDateString()}</div>
                      </div>
                      <button style={{ background: '#00C853', color: '#000', border: 'none', borderRadius: '100px', padding: '0.6rem 1.5rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BOOKINGS TAB */}
          {tab === TAB.BOOKINGS && (
            <div style={s.card}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', color: '#fff', fontSize: '1.5rem', margin: '0 0 1.5rem' }}>
                My Sessions <span style={{ color: '#00C853' }}>({bookings.length})</span>
              </h3>
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#050705', borderRadius: 16, border: '1px dashed rgba(0,200,83,0.2)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.8 }}>📅</div>
                  <p style={{ color: '#7A9E7E', fontSize: '1rem', margin: 0 }}>
                    No upcoming classes. <span style={{ color: '#00C853', cursor: 'pointer', fontWeight: 600, borderBottom: '1px solid #00C853' }} onClick={() => navigate('/tutors')}>Find a super-tutor</span>
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {bookings.map(b => (
                    <div key={b.id} style={{ background: '#050705', borderRadius: 16, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8F5E9', fontSize: '1.1rem', marginBottom: '0.3rem' }}>
                          {b.subject} <span style={{ color: '#7A9E7E', fontWeight: 500 }}>— with {b.tutor?.profile?.full_name}</span>
                        </div>
                        <div style={{ color: '#7A9E7E', fontSize: '0.85rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> {b.scheduled_at ? new Date(b.scheduled_at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) : 'Time TBD'}</span>
                          <span>{b.duration_hours}hr{b.duration_hours > 1 ? 's' : ''}</span>
                          <span style={{ color: '#FFD600' }}>₦{b.amount_paid}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={s.badge(b.status)}>{b.status}</span>
                        <button onClick={() => navigate(`/chat/${b.id}`)} style={{ background: 'var(--surface-variant)', color: 'var(--on-surface)', border: '1px solid var(--outline-variant)', borderRadius: '100px', padding: '0.5rem 1.1rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary-container)'; e.currentTarget.style.color = 'var(--primary)'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-variant)'; e.currentTarget.style.color = 'var(--on-surface)'; }}>
                          💬 Chat
                        </button>
                        {b.meet_link && b.status !== 'completed' && (
                          <a href={b.meet_link} target="_blank" rel="noreferrer"
                            style={{ background: '#00C853', color: '#000', textDecoration: 'none', borderRadius: '100px', padding: '0.5rem 1.1rem', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.6 11.6L22 7v10l-6.4-4.5v-1zM4 5h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2z" /></svg>
                            Join Session
                          </a>
                        )}
                        {b.status === 'confirmed' && (
                          <button onClick={() => handleCompleteBooking(b.id, b.tutor_id, b.amount_paid)} style={{ background: 'var(--primary-container)', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '100px', padding: '0.5rem 1.1rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            ✅ Mark Completed
                          </button>
                        )}
                        <button onClick={() => handleDeleteBooking(b.id, false)} title="Delete Session" style={{ background: 'transparent', color: '#ff5252', border: '1px solid rgba(255,82,82,0.3)', borderRadius: '100px', padding: '0.5rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,82,82,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EARNINGS TAB */}
          {tab === TAB.EARNINGS && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={s.card}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', color: '#fff', fontSize: '1.5rem', margin: '0 0 2rem' }}>Earnings Overview</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div style={{ background: 'linear-gradient(135deg, var(--primary-container) 0%, var(--surface) 100%)', borderRadius: 24, padding: '2rem', border: '1px solid rgba(188, 149, 92, 0.2)', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(188, 149, 92, 0.05)' }}>
                    <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '0.5rem' }}>TOTAL EARNED</div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '3rem', color: 'var(--on-surface)', letterSpacing: '-0.04em' }}>₦{totalEarnings.toLocaleString()}</div>
                    <svg style={{ position: 'absolute', right: '-10%', bottom: '-20%', opacity: 0.05, color: 'var(--primary)' }} width="140" height="140" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.7c.09 1.15.93 1.83 2 1.83 1.17 0 2.11-.8 2.11-1.84 0-.96-.64-1.64-2.22-2.11-2.11-.64-3.27-1.6-3.27-3.32 0-1.57 1.14-2.61 2.94-3.03V4.2h2.67v1.89c1.37.3 2.53 1.25 2.76 2.75h-1.69c-.21-.86-.96-1.51-1.96-1.51-1.05 0-1.93.71-1.93 1.69 0 .91.68 1.48 2.12 1.96 2.45.82 3.39 1.87 3.39 3.42 0 1.69-1.31 2.85-3.01 3.29z" /></svg>
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, rgba(255,214,0,0.1) 0%, rgba(255,214,0,0.02) 100%)', borderRadius: 20, padding: '2rem', border: '1px solid rgba(255,214,0,0.2)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ color: '#FFD600', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>AVAILABLE BALANCE</div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2.5rem', color: '#fff' }}>₦{availableBalance.toLocaleString()}</div>
                    <svg style={{ position: 'absolute', right: '-10%', bottom: '-20%', opacity: 0.1, color: '#FFD600' }} width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1h-9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9zm-9-2h10V8H12v8zm4-2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" /></svg>
                  </div>
                  {profile?.is_tutor && (
                    <div style={{ background: 'var(--surface-variant)', borderRadius: 20, padding: '2rem', border: '1px solid var(--outline-variant)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>PENDING ESCROW</div>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2.5rem', color: 'var(--on-surface-variant)' }}>₦{pendingEscrow.toLocaleString()}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Held securely until session complete</div>
                      <svg style={{ position: 'absolute', right: '-10%', bottom: '-20%', opacity: 0.1, color: 'var(--on-surface-variant)' }} width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </div>
                  )}
                </div>

                {availableBalance >= 1000 ? (
                  <div style={{ background: 'var(--surface-variant)', borderRadius: 24, padding: '2.5rem', border: '1px solid var(--outline-variant)' }}>
                    <h4 style={{ fontFamily: 'var(--font-header)', color: 'var(--on-surface)', fontSize: '1.4rem', marginBottom: '2rem', fontWeight: 800 }}>Withdraw to Bank Account</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                      <Field label="Bank Name">
                        <Input placeholder="e.g. GTBank, Kuda, Access..." />
                      </Field>
                      <Field label="Account Number">
                        <Input placeholder="0123456789" maxLength={10} />
                      </Field>
                    </div>
                    <Button onClick={() => alert('Withdrawal requested!')}>
                      Request Withdrawal of ₦{availableBalance.toLocaleString()}
                    </Button>
                    <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', marginTop: '1.5rem', textAlign: 'center', fontWeight: 500 }}>
                      🔒 Monies are processed securely within 24hrs on business days.
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', background: '#050705', padding: '2rem', borderRadius: 16, border: '1px dashed rgba(255,214,0,0.2)' }}>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', margin: 0 }}>
                      Minimum <strong style={{ color: '#FFD600' }}>₦1,000</strong> balance required to withdraw. <br />Keep uploading amazing resources! 🚀
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TUTOR SESSIONS TAB */}
          {tab === TAB.SESSIONS && (
            <div style={s.card}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', color: '#fff', fontSize: '1.5rem', margin: '0 0 1.5rem' }}>
                Incoming Tutoring Sessions <span style={{ color: 'var(--primary)' }}>({tutorSessions.length})</span>
              </h3>
              {tutorSessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#050705', borderRadius: 16, border: '1px dashed rgba(188,149,92,0.2)' }}>
                  <p style={{ color: 'var(--on-surface-variant)' }}>No incoming bookings yet. Make sure your profile is active!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {tutorSessions.map(sess => (
                    <div key={sess.id} style={{ background: '#050705', borderRadius: 16, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8F5E9', fontSize: '1.1rem', marginBottom: '0.3rem' }}>
                          {sess.subject} <span style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>— with {sess.student?.full_name || sess.student?.username}</span>
                        </div>
                        <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                          {new Date(sess.scheduled_at).toLocaleString()} · {sess.duration_hours}hr · <span style={{ color: 'var(--primary)' }}>₦{sess.amount_paid}</span>
                        </div>
                        {sess.message && <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem', fontStyle: 'italic' }}>"{sess.message}"</div>}
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={s.badge(sess.status)}>{sess.status}</span>
                        <button onClick={() => navigate(`/chat/${sess.id}`)} style={{ background: 'var(--surface-variant)', color: 'var(--on-surface)', border: '1px solid var(--outline-variant)', borderRadius: '100px', padding: '0.5rem 1.1rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary-container)'; e.currentTarget.style.color = 'var(--primary)'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-variant)'; e.currentTarget.style.color = 'var(--on-surface)'; }}>
                          💬 Chat
                        </button>
                        {sess.status === 'pending' || (!sess.meet_link && sess.status !== 'completed') ? (
                          <Button onClick={() => handleConfirmBooking(sess.id)} style={{ width: 'auto', padding: '0.5rem 1.25rem' }}>
                            Share Meet Link
                          </Button>
                        ) : (
                          <div style={{ fontSize: '0.85rem', color: sess.status === 'completed' ? 'var(--on-surface-variant)' : 'var(--primary)', fontWeight: 700 }}>
                            {sess.status === 'completed' ? 'Paid out ✓' : 'Link Shared ✓'}
                          </div>
                        )}
                        <button onClick={() => handleDeleteBooking(sess.id, true)} title="Delete Session" style={{ background: 'transparent', color: '#ff5252', border: '1px solid rgba(255,82,82,0.3)', borderRadius: '100px', padding: '0.5rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s', marginLeft: 'auto' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,82,82,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MESSAGES TAB */}
          {tab === TAB.MESSAGES && (
            <div style={s.card}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', color: '#fff', fontSize: '1.5rem', margin: '0 0 1.5rem' }}>
                💬 My Chats <span style={{ color: 'var(--primary)' }}>({[...bookings, ...(profile?.is_tutor ? tutorSessions : [])].length})</span>
              </h3>
              {(() => {
                const allThreads = [
                  ...bookings.map(b => ({
                    id: b.id,
                    subject: b.subject,
                    other: b.tutor?.profile?.full_name || b.tutor?.profile?.username || 'Tutor',
                    otherAvatar: b.tutor?.profile?.avatar_url,
                    date: b.scheduled_at,
                    status: b.status,
                    role: 'student'
                  })),
                  ...(profile?.is_tutor ? tutorSessions.map(s => ({
                    id: s.id,
                    subject: s.subject,
                    other: s.student?.full_name || s.student?.username || 'Student',
                    otherAvatar: s.student?.avatar_url,
                    date: s.scheduled_at,
                    status: s.status,
                    role: 'tutor'
                  })) : [])
                ];

                if (allThreads.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#050705', borderRadius: 16, border: '1px dashed rgba(188,149,92,0.2)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.8 }}>💬</div>
                      <p style={{ color: 'var(--on-surface-variant)', margin: 0 }}>No active chats yet. Book a session to get started.</p>
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {allThreads.map(thread => (
                      <div
                        key={`${thread.role}-${thread.id}`}
                        onClick={() => navigate(`/chat/${thread.id}`)}
                        style={{ background: '#050705', borderRadius: 16, padding: '1.25rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = '#111611'; e.currentTarget.style.borderColor = 'var(--outline-variant)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#050705'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; }}
                      >
                        <div style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0, background: 'var(--surface-variant)', backgroundImage: thread.otherAvatar ? `url(${thread.otherAvatar})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                          {!thread.otherAvatar && '👤'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8F5E9', fontSize: '1rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {thread.other}
                          </div>
                          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {thread.subject}{thread.date ? ` · ${new Date(thread.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}` : ''}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.3rem 0.8rem', borderRadius: '100px', background: thread.status === 'confirmed' ? 'var(--primary-container)' : thread.status === 'completed' ? 'var(--surface-variant)' : 'rgba(212,160,32,0.1)', color: thread.status === 'completed' ? 'var(--on-surface-variant)' : 'var(--primary)', border: '1px solid var(--outline-variant)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{thread.status}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>{thread.role === 'tutor' ? '🎓 Tutor' : '📚 Student'}</span>
                        </div>
                        <div style={{ color: 'var(--on-surface-variant)', fontSize: '1.2rem', marginLeft: '0.25rem' }}>›</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ADMIN TAB */}
          {tab === TAB.ADMIN && (
            <div style={s.card}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', color: '#fff', fontSize: '1.5rem', margin: '0 0 1.5rem' }}>
                Pending Tutor Applications <span style={{ color: 'var(--primary)' }}>({pendingTutors.length})</span>
              </h3>
              {pendingTutors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#050705', borderRadius: 16, border: '1px dashed rgba(188,149,92,0.2)' }}>
                  <p style={{ color: 'var(--on-surface-variant)' }}>No pending applications. Good job!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pendingTutors.map(t => (
                    <div key={t.id} style={{ background: '#050705', borderRadius: 16, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8F5E9', fontSize: '1.1rem', marginBottom: '0.2rem' }}>
                          {t.profile?.full_name} (@{t.profile?.username})
                        </div>
                        <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                          {t.profile?.university} · {t.subjects?.join(', ')}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>{t.bio}</p>
                      </div>
                      <Button onClick={() => handleApproveTutor(t.id)} style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
                        Give Access
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* RESOURCES MODERATION */}
              <h3 style={{ fontFamily: 'Syne, sans-serif', color: '#fff', fontSize: '1.5rem', margin: '3rem 0 1.5rem' }}>
                Pending Resources <span style={{ color: 'var(--primary)' }}>({pendingResources.length})</span>
              </h3>
              {pendingResources.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#050705', borderRadius: 16, border: '1px dashed rgba(188,149,92,0.2)' }}>
                  <p style={{ color: 'var(--on-surface-variant)' }}>No pending resources. All clear!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pendingResources.map(r => (
                    <div key={r.id} style={{ background: '#050705', borderRadius: 16, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                        {r.thumbnail_url ? (
                          <img src={r.thumbnail_url} alt={r.title} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📄</div>
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8F5E9', fontSize: '1.1rem', marginBottom: '0.2rem' }}>
                            {r.title}
                          </div>
                          <div style={{ color: '#7A9E7E', fontSize: '0.85rem' }}>
                            by {r.uploader?.full_name || r.uploader?.username} · {r.category?.icon} {r.category?.name} · {r.school}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Button onClick={() => handleApproveResource(r.id)} style={{ width: 'auto', padding: '0.5rem 1.25rem' }}>
                          Approve
                        </Button>
                        <Button variant="secondary" onClick={() => handleRejectResource(r.id)} style={{ width: 'auto', padding: '0.5rem 1.25rem', borderColor: '#ff5252', color: '#ff5252' }}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* OVERVIEW TAB */}
          {tab === TAB.OVERVIEW && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {profile?.is_tutor ? (
                <div style={{ background: 'linear-gradient(135deg, rgba(0,200,83,0.1), rgba(var(--primary-rgb), 0.05))', border: '1px solid rgba(0,200,83,0.3)', borderRadius: 24, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div style={{ flex: 1, minWidth: 250 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff', fontSize: '1.4rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>🎓</span> You are a Verified Tutor
                    </div>
                    <div style={{ color: '#7A9E7E', fontSize: '1rem', lineHeight: 1.5 }}>You are now visible in the tutor directory. Keep your profile updated and monitor your bookings tab for new sessions.</div>
                  </div>
                  <button onClick={handleDeleteTutorProfile} style={{ background: 'transparent', color: '#ff5252', border: '1px solid rgba(255,82,82,0.3)', borderRadius: '100px', padding: '0.75rem 1.5rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,82,82,0.1)'; e.currentTarget.style.borderColor = '#ff5252'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,82,82,0.3)'; }}>
                    Deactivate Profile
                  </button>
                </div>
              ) : (
                <div style={{ background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), rgba(0,200,83,0.05))', border: '1px solid var(--outline-variant)', borderRadius: 24, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div style={{ flex: 1, minWidth: 250 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff', fontSize: '1.4rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>👨‍🏫</span> Earn as a Tutor
                    </div>
                    <div style={{ color: '#7A9E7E', fontSize: '1rem', lineHeight: 1.5 }}>Help other students from your university and earn up to <strong>₦5,000/hr</strong>. Join our elite mentor network today.</div>
                  </div>
                  <button onClick={() => navigate('/become-a-tutor')} style={{ background: 'var(--on-surface)', color: 'var(--surface)', border: 'none', borderRadius: '100px', padding: '1rem 2rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', whiteSpace: 'nowrap', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
                    Apply to Tutor
                  </button>
                </div>
              )}

              {!profile?.is_pro && (
                <div style={{ background: 'linear-gradient(135deg, rgba(255,214,0,0.1), rgba(0,200,83,0.05))', border: '1px solid rgba(255,214,0,0.3)', borderRadius: 24, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', boxShadow: 'inset 0 0 40px rgba(255,214,0,0.05)' }}>
                  <div style={{ flex: 1, minWidth: 250 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff', fontSize: '1.4rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>⚡</span> Unlock HackMyDegree Pro
                    </div>
                    <div style={{ color: '#7A9E7E', fontSize: '1rem', lineHeight: 1.5 }}>Access all premium study materials, get unlimited downloads, and stand out in the tutors directory. All for just <strong>₦500/month</strong>.</div>
                  </div>
                  <button onClick={handleUpgradePro} style={{ background: 'linear-gradient(135deg, #FFEA00 0%, #FFD600 100%)', color: '#000', border: 'none', borderRadius: '100px', padding: '1rem 2rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', whiteSpace: 'nowrap', transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(255,214,0,0.3)' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
                    Upgrade Now
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="stat-card" style={{ ...s.card, cursor: 'pointer', padding: '1.5rem' }} onClick={() => setTab(TAB.UPLOADS)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff', fontSize: '1.2rem' }}>📤 Recent Uploads</div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A9E7E" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                  {uploads.slice(0, 3).map(r => (
                    <div key={r.id} style={{ color: '#E8F5E9', fontSize: '0.95rem', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#7A9E7E' }}>{r.category?.icon}</span> {r.title}
                    </div>
                  ))}
                  {uploads.length === 0 && <div style={{ color: '#4A6A4E', fontSize: '0.9rem', padding: '1rem 0' }}>You haven't uploaded anything yet.</div>}
                </div>

                <div className="stat-card" style={{ ...s.card, cursor: 'pointer', padding: '1.5rem' }} onClick={() => setTab(TAB.BOOKINGS)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff', fontSize: '1.2rem' }}>📅 Upcoming Sessions</div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A9E7E" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                  {bookings.filter(b => b.status === 'confirmed').slice(0, 3).map(b => (
                    <div key={b.id} style={{ color: '#E8F5E9', fontSize: '0.95rem', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>{b.subject}</span>
                      <span style={{ color: '#7A9E7E' }}>{b.scheduled_at ? new Date(b.scheduled_at).toLocaleDateString() : 'TBD'}</span>
                    </div>
                  ))}
                  {bookings.filter(b => b.status === 'confirmed').length === 0 && <div style={{ color: '#4A6A4E', fontSize: '0.9rem', padding: '1rem 0' }}>No confirmed upcoming sessions.</div>}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const hoverStyles = (bg, fg) => ({});
