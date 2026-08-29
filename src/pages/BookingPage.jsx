// src/pages/BookingPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { payForTutorBooking } from '../lib/paystack';
import { useAuth } from '../App';
import PageLoader from '../components/PageLoader';
import { Button, Input, Field } from '../components/SharedUI';
import { useToast } from '../contexts/ToastContext';

export default function BookingPage() {
  const { tutorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    subject: '',
    message: '',
    date: '',
    time: '',
    duration: 1
  });

  useEffect(() => {
    const fetchTutor = async () => {
      const { data } = await supabase
        .from('tutor_profiles')
        .select(`*, profile:profiles(id, username, full_name, avatar_url, university)`)
        .eq('id', tutorId)
        .single();
      setTutor(data);
      setLoading(false);
    };
    fetchTutor();
  }, [tutorId]);

  const totalCost = tutor ? tutor.hourly_rate * form.duration : 0;

  const handleBook = async () => {
    if (!form.subject || !form.date || !form.time) {
      showToast('Please fill in subject, date, and time', 'error');
      return;
    }

    setBooking(true);
    const scheduledAt = new Date(`${form.date}T${form.time}:00`).toISOString();

    await payForTutorBooking({
      tutor,
      student: { id: user.id, email: user.email },
      subject: form.subject,
      message: form.message,
      scheduledAt,
      durationHours: form.duration,
      onSuccess: (response) => {
        setSuccess(response.booking);
        setBooking(false);
      },
      onClose: () => setBooking(false)
    });
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  if (loading) return <PageLoader />;
  if (!tutor) return (
    <div style={{ textAlign: 'center', padding: '10rem', color: 'var(--on-surface-variant)' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Tutor not found</h2>
      <Link to="/tutors" style={{ color: 'var(--primary)', fontWeight: 700 }}>Return to Tutors</Link>
    </div>
  );

  if (success) {
    return (
      <div className="page-container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass" style={{ maxWidth: '540px', padding: '5rem 3rem', borderRadius: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '6rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 24px var(--primary))' }}>🎓</div>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 900 }}>Confirmed!</h2>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '3.5rem', fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6 }}>
            {tutor.profile.full_name} will confirm your session and send a meeting link. Check your email for details.
          </p>
          <Button onClick={() => navigate('/dashboard')} style={{ width: 'auto', padding: '1.25rem 3rem' }}>
            View My Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px', padding: 'clamp(1rem, 5vw, 2.5rem) clamp(1rem, 5vw, 2rem)' }}>
      <Link to="/tutors" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'clamp(1.5rem, 6vw, 3rem)', fontWeight: 700 }}>
        <span>←</span> Back to Academy
      </Link>

      {/* Tutor Card */}
      <div className="glass" style={{ borderRadius: '24px', padding: 'clamp(1.5rem, 5vw, 3rem)', marginBottom: '2.5rem', border: '1px solid var(--outline-variant)' }}>
        <div style={{ display: 'flex', gap: 'clamp(1rem, 5vw, 2rem)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: 88, height: 88, borderRadius: '24px', flexShrink: 0,
            background: tutor.profile.avatar_url ? `url(${tutor.profile.avatar_url}) center/cover` : 'var(--primary-container)',
            border: '1px solid var(--outline-variant)'
          }}></div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: 900, color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.04em', lineHeight: 1.2 }}>
              {tutor.profile.full_name}
            </h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 'clamp(0.85rem, 3vw, 1rem)', margin: '0.3rem 0', fontWeight: 500, lineHeight: 1.4 }}>{tutor.profile.university} · {tutor.profile.department}</p>
            <div style={{ display: 'flex', gap: 'clamp(0.75rem, 3vw, 1.5rem)', marginTop: '0.75rem', flexWrap: 'wrap', fontWeight: 700, fontSize: '0.85rem' }}>
              <span style={{ color: '#FFD600', whiteSpace: 'nowrap' }}>⭐ {tutor.rating_avg?.toFixed(1) || 'New'}</span>
              <span style={{ color: 'var(--on-surface-variant)', whiteSpace: 'nowrap' }}>📚 {tutor.total_sessions} sessions</span>
              <span style={{ color: 'var(--primary)', whiteSpace: 'nowrap' }}>₦{tutor.hourly_rate?.toLocaleString()}/hr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="glass" style={{ borderRadius: '24px', padding: 'clamp(1.5rem, 6vw, 3.5rem)', border: '1px solid var(--outline-variant)' }}>
        <h3 style={{ fontSize: 'clamp(1.5rem, 8vw, 2rem)', color: 'var(--on-surface)', marginBottom: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Book Session</h3>

        <Field label="Subject / Topic *">
          <Input placeholder="e.g. MTH 101 — Integration by parts" value={form.subject} onChange={set('subject')} required />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(1rem, 5vw, 2rem)', marginBottom: '1.5rem' }}>
          <Field label="Preferred Date *">
            <Input type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={set('date')} required />
          </Field>
          <Field label="Preferred Time *">
            <Input type="time" value={form.time} onChange={set('time')} required />
          </Field>
        </div>

        <Field label="Duration (Hours)">
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[0.5, 1, 1.5, 2].map(h => (
              <button key={h} type="button"
                onClick={() => setForm(f => ({ ...f, duration: h }))}
                style={{
                  padding: 'clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.5rem)', borderRadius: '100px', cursor: 'pointer',
                  fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                  background: form.duration === h ? 'var(--on-surface)' : 'var(--surface-variant)',
                  color: form.duration === h ? 'var(--surface)' : 'var(--on-surface-variant)',
                  border: `1px solid var(--outline-variant)`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  flex: '1 1 auto', textAlign: 'center'
                }}>
                {h}hr{h > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Inquiry (Optional)">
          <textarea className="glass" style={{
            width: '100%', padding: '1.1rem 1.25rem', borderRadius: '14px',
            border: '1px solid var(--outline-variant)', background: 'var(--surface)',
            color: 'var(--on-surface)', fontFamily: 'var(--font-body)',
            minHeight: '100px', resize: 'vertical', outline: 'none'
          }} placeholder="Tell the tutor what you need help with specifically..." value={form.message} onChange={set('message')} />
        </Field>

        {/* Cost Summary */}
        <div style={{ background: 'var(--primary-container)', padding: '2rem', borderRadius: '24px', marginBottom: '2.5rem', border: '1px solid var(--outline-variant)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 'clamp(1rem, 3vw, 1.1rem)', marginBottom: '0.25rem' }}>
                Total Investment
              </div>
              <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', fontWeight: 500 }}>
                ₦{tutor.hourly_rate?.toLocaleString()}/hr × {form.duration}hr{form.duration > 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.75rem, 10vw, 2.5rem)', fontWeight: 900, color: 'var(--on-surface)' }}>
              ₦{totalCost.toLocaleString()}
            </div>
          </div>
        </div>

        <Button onClick={handleBook} loading={booking}>
          {booking ? 'Opening Secure Payment...' : `Confirm & Pay ₦${totalCost.toLocaleString()}`}
        </Button>

        <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '0.85rem', marginTop: '1.5rem', fontWeight: 500 }}>
          🔒 Secured by Paystack · 100% Refundable if tutor cancels
        </p>
      </div>
    </div>
  );
}
