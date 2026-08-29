// src/pages/ChatPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { supabase, getBookingForChat, getBookingMessages, sendBookingMessage, subscribeToMessages } from '../lib/supabase';
import PageLoader from '../components/PageLoader';
import { useToast } from '../contexts/ToastContext';
import { whatsAppAudio } from '../lib/callAudio';

// ── Tiny helper: auto-linkify URLs inside message text ─────────────
function Linkified({ text }) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return (
        <>
            {parts.map((part, i) =>
                urlRegex.test(part) ? (
                    <a key={i} href={part} target="_blank" rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline', wordBreak: 'break-all' }}>
                        {part}
                    </a>
                ) : part
            )}
        </>
    );
}

export default function ChatPage() {
    const { bookingId } = useParams();
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [booking, setBooking] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [videoOpen, setVideoOpen] = useState(false);
    const [callingState, setCallingState] = useState('idle'); // 'idle' | 'calling' | 'connected'
    const [showCallGuideModal, setShowCallGuideModal] = useState(() => {
        try {
            return !localStorage.getItem('hmd_call_guide_seen');
        } catch (e) {
            return false;
        }
    });
    const [sessionSecondsLeft, setSessionSecondsLeft] = useState(3600); // 1-Hour Session (60 mins)
    const [warnedFiveMin, setWarnedFiveMin] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    // Live 1-Hour Session Countdown Timer
    useEffect(() => {
        if (!videoOpen) return;

        const timer = setInterval(() => {
            setSessionSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    showToast('1-Hour session time has ended!', 'warning');
                    return 0;
                }
                if (prev === 300 && !warnedFiveMin) {
                    setWarnedFiveMin(true);
                    showToast('⚠️ 5 minutes remaining in this 1-hour tutoring session.', 'warning');
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [videoOpen, warnedFiveMin, showToast]);

    const formatTimer = (totalSecs) => {
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleExtendSession = () => {
        setSessionSecondsLeft(prev => prev + 900); // +15 mins
        showToast('Added +15 minutes to session!', 'success');
    };

    const startCall = () => {
        setVideoOpen(true);
        setCallingState('calling');
        whatsAppAudio.startRing();

        // Auto-connect into room after brief realistic WhatsApp ringback
        setTimeout(() => {
            setCallingState('connected');
            whatsAppAudio.stopRing();
        }, 3200);
    };

    const endCall = () => {
        whatsAppAudio.playEndTone();
        setCallingState('idle');
        setVideoOpen(false);
    };

    // Production-ready Jitsi configuration: prejoin skipped, display name auto-set, watermarks hidden
    const participantName = encodeURIComponent(profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'Learner');
    const jitsiRoom = `HMD-Session-${bookingId}`;
    const jitsiUrl = `https://meet.jit.si/${jitsiRoom}#userInfo.displayName="${participantName}"&config.prejoinPageEnabled=false&config.disableDeepLinking=true&config.startWithVideoMuted=false&config.startWithAudioMuted=false&config.enableWelcomePage=false&config.enableClosePage=false&config.requireDisplayName=false&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false`;

    // ── Load booking details + message history ──────────────────────
    useEffect(() => {
        if (!bookingId || !user) return;

        const load = async () => {
            const [{ data: bk, error: bkErr }, { data: msgs }] = await Promise.all([
                getBookingForChat(bookingId),
                getBookingMessages(bookingId)
            ]);

            if (bkErr || !bk) {
                setError('Session not found or you do not have access.');
                setLoading(false);
                return;
            }

            // Access check: must be student or tutor
            const isStudent = bk.student_id === user.id;
            const isTutor = bk.tutor?.user_id === user.id;
            if (!isStudent && !isTutor) {
                setError('You do not have access to this chat.');
                setLoading(false);
                return;
            }

            setBooking(bk);
            setMessages(msgs || []);
            setLoading(false);
        };

        load();
    }, [bookingId, user]);

    // ── Subscribe to real-time messages ────────────────────────────
    useEffect(() => {
        if (!bookingId) return;

        const channel = subscribeToMessages(bookingId, async (newMsg) => {
            // Fetch sender profile for the incoming message
            const { data: senderProfile } = await supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url')
                .eq('id', newMsg.sender_id)
                .single();

            setMessages(prev => {
                // Avoid duplicate if we already optimistically added this message
                const exists = prev.some(m => m.id === newMsg.id);
                if (exists) return prev;
                return [...prev, { ...newMsg, sender: senderProfile }];
            });
        });

        return () => supabase.removeChannel(channel);
    }, [bookingId]);

    // ── Auto-scroll to bottom on new messages ──────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Send message ───────────────────────────────────────────────
    const handleSend = async () => {
        const trimmed = text.trim();
        if (!trimmed || sending) return;

        setSending(true);
        setText('');

        // Optimistic update
        const optimisticMsg = {
            id: `optimistic-${Date.now()}`,
            booking_id: bookingId,
            sender_id: user.id,
            content: trimmed,
            created_at: new Date().toISOString(),
            sender: null
        };
        setMessages(prev => [...prev, optimisticMsg]);

        const { error: sendErr } = await sendBookingMessage(bookingId, user.id, trimmed);
        if (sendErr) {
            // Roll back on error
            setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
            setText(trimmed);
            showToast('Failed to send message. Please try again.', 'error');
        }

        setSending(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ── Helpers ────────────────────────────────────────────────────
    const isMyMsg = (msg) => msg.sender_id === user?.id;

    const formatTime = (ts) => {
        const d = new Date(ts);
        return d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (ts) => {
        const d = new Date(ts);
        const today = new Date();
        const isToday = d.toDateString() === today.toDateString();
        if (isToday) return 'Today';
        return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
    };

    // Group messages by date
    const grouped = messages.reduce((acc, msg) => {
        const key = new Date(msg.created_at).toDateString();
        if (!acc[key]) acc[key] = { label: formatDate(msg.created_at), msgs: [] };
        acc[key].msgs.push(msg);
        return acc;
    }, {});

    // ── Render ─────────────────────────────────────────────────────
    if (loading) return <PageLoader />;

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '1.5rem', padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem' }}>🔒</div>
                <h2 style={{ fontFamily: 'var(--font-header)', color: 'var(--on-surface)', margin: 0 }}>{error}</h2>
                <button onClick={() => navigate('/dashboard')} style={btnStyle('primary')}>Back to Dashboard</button>
            </div>
        );
    }

    const tutorName = booking.tutor?.profile?.full_name || booking.tutor?.profile?.username || 'Tutor';
    const studentName = booking.student?.full_name || booking.student?.username || 'Student';
    const isTutor = booking.tutor?.user_id === user.id;
    const otherName = isTutor ? studentName : tutorName;
    const otherAvatar = isTutor ? booking.student?.avatar_url : booking.tutor?.profile?.avatar_url;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 760, margin: '0 auto', fontFamily: 'var(--font-body)' }}>

            {/* ── Header ─────────────────────────────────────── */}
            <div style={{
                background: 'var(--surface)', borderBottom: '1px solid var(--outline-variant)',
                padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
                position: 'sticky', top: 0, zIndex: 10, flexShrink: 0
            }}>
                <Link to="/dashboard" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', fontWeight: 700, fontSize: '1.3rem', lineHeight: 1 }}>←</Link>

                <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: 'var(--primary-container)', backgroundImage: otherAvatar ? `url(${otherAvatar})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {!otherAvatar && '👤'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {otherName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {booking.subject} · {booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date TBD'}
                    </div>
                </div>

                {/* Help / Guide button */}
                <button
                    onClick={() => setShowCallGuideModal(true)}
                    title="How 1-Hour Video Calls work"
                    style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '100px',
                        background: 'var(--surface-variant)',
                        border: '1px solid var(--outline-variant)',
                        color: 'var(--on-surface)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--outline-variant)'; }}
                >
                    <span>💡</span>
                    <span>How it works</span>
                </button>

                {/* Video call button */}
                <button
                    onClick={videoOpen ? endCall : startCall}
                    title={videoOpen ? 'Close Video Call' : 'Start 1-Hour Video Call'}
                    style={{
                        width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
                        background: videoOpen
                            ? 'linear-gradient(135deg, #e53935, #c62828)'
                            : 'linear-gradient(135deg, #25D366, #128C7E)',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem',
                        boxShadow: videoOpen
                            ? '0 4px 14px rgba(229,57,53,0.4)'
                            : '0 4px 14px rgba(37,211,102,0.35)',
                        transition: 'all 0.25s ease',
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    {videoOpen ? '📵' : '📹'}
                </button>

                <span style={{
                    fontSize: '0.72rem', fontWeight: 800, padding: '0.35rem 0.9rem', borderRadius: '100px',
                    letterSpacing: '0.8px', textTransform: 'uppercase',
                    background: booking.status === 'confirmed' ? 'var(--primary-container)' : 'rgba(212,160,32,0.12)',
                    color: booking.status === 'confirmed' ? 'var(--primary)' : 'var(--primary)',
                    border: '1px solid var(--outline-variant)', flexShrink: 0
                }}>
                    {booking.status}
                </span>
            </div>

            {/* ── Jitsi Video Panel & WhatsApp Calling Screen ───────────────────────────── */}
            {videoOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 500,
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#0b141a',
                }}>
                    {/* WhatsApp Outgoing Calling Screen Overlay */}
                    {callingState === 'calling' && (
                        <div style={{
                            position: 'absolute', inset: 0, zIndex: 600,
                            background: 'radial-gradient(circle at 50% 30%, #12251e 0%, #0b141a 75%)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'space-between',
                            padding: '4rem 1.5rem 3rem', color: '#fff',
                            animation: 'fadeIn 0.3s ease forwards'
                        }}>
                            {/* Top info */}
                            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                                <div style={{ fontSize: '0.78rem', color: 'var(--primary, #d4a020)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    🔒 HackMyDegree End-to-End Encrypted
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '1.8rem', fontWeight: 800, margin: '0.3rem 0 0' }}>
                                    {otherName}
                                </h2>
                                <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#25D366', animation: 'videoPulse 1.2s infinite' }}></span>
                                    <span>Ringing...</span>
                                </div>
                            </div>

                            {/* Avatar with WhatsApp pulse waves */}
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{
                                    position: 'absolute', width: 180, height: 180, borderRadius: '50%',
                                    background: 'rgba(37, 211, 102, 0.12)',
                                    animation: 'pulseRing 2s infinite'
                                }} />
                                <div style={{
                                    position: 'absolute', width: 140, height: 140, borderRadius: '50%',
                                    background: 'rgba(37, 211, 102, 0.2)',
                                    animation: 'pulseRing 2s 0.5s infinite'
                                }} />
                                <div style={{
                                    width: 100, height: 100, borderRadius: '50%',
                                    background: 'var(--primary-container)',
                                    backgroundImage: otherAvatar ? `url(${otherAvatar})` : 'none',
                                    backgroundSize: 'cover', backgroundPosition: 'center',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2.5rem', border: '3px solid #25D366',
                                    boxShadow: '0 8px 30px rgba(37,211,102,0.4)',
                                    zIndex: 2
                                }}>
                                    {!otherAvatar && '👤'}
                                </div>
                            </div>

                            {/* Controls */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: 300 }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', width: '100%' }}>
                                    <button
                                        onClick={endCall}
                                        title="Decline Call"
                                        style={{
                                            width: 60, height: 60, borderRadius: '50%',
                                            background: '#e53935', color: '#fff',
                                            border: 'none', fontSize: '1.5rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', boxShadow: '0 6px 20px rgba(229,57,53,0.5)',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        📵
                                    </button>
                                    <button
                                        onClick={() => {
                                            whatsAppAudio.stopRing();
                                            setCallingState('connected');
                                        }}
                                        title="Answer / Connect Now"
                                        style={{
                                            width: 60, height: 60, borderRadius: '50%',
                                            background: '#25D366', color: '#fff',
                                            border: 'none', fontSize: '1.5rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', boxShadow: '0 6px 20px rgba(37,211,102,0.5)',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        📹
                                    </button>
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                                    Connecting to 1-Hour Academic Room...
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Video header bar with 1-Hour Timer & Controls */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.65rem 1.25rem',
                        background: 'rgba(15, 17, 23, 0.96)',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        flexShrink: 0,
                        zIndex: 10,
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: 10, height: 10, borderRadius: '50%',
                                background: sessionSecondsLeft > 300 ? '#25D366' : '#FF5252',
                                boxShadow: `0 0 10px ${sessionSecondsLeft > 300 ? '#25D366' : '#FF5252'}`,
                                animation: 'videoPulse 1.5s infinite',
                            }} />
                            <span style={{ color: '#fff', fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem' }}>
                                Live Session — {booking.subject}
                            </span>
                            <span style={{
                                fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.6rem',
                                borderRadius: '100px', background: 'rgba(37,211,102,0.18)',
                                color: '#25D366', border: '1px solid rgba(37,211,102,0.4)',
                                letterSpacing: '0.5px',
                            }}>
                                1-ON-1
                            </span>
                        </div>

                        {/* 1-Hour Live Countdown Timer Badge */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            background: sessionSecondsLeft > 900
                                ? 'rgba(212, 160, 32, 0.12)'
                                : sessionSecondsLeft > 300
                                    ? 'rgba(255, 167, 38, 0.15)'
                                    : 'rgba(255, 82, 82, 0.18)',
                            border: `1px solid ${sessionSecondsLeft > 900 ? 'rgba(212, 160, 32, 0.35)' : sessionSecondsLeft > 300 ? 'rgba(255, 167, 38, 0.45)' : 'rgba(255, 82, 82, 0.5)'}`,
                            padding: '0.35rem 0.85rem',
                            borderRadius: '100px',
                            color: sessionSecondsLeft > 900 ? 'var(--primary, #d4a020)' : sessionSecondsLeft > 300 ? '#FFA726' : '#FF5252',
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            fontSize: '0.9rem'
                        }}>
                            <span>⏱️ {formatTimer(sessionSecondsLeft)}</span>
                            <button
                                onClick={handleExtendSession}
                                title="Add 15 minutes to session"
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    padding: '0.15rem 0.45rem',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-header)'
                                }}
                            >
                                +15m
                            </button>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <a
                                href={jitsiUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '0.78rem',
                                    textDecoration: 'none',
                                    padding: '0.35rem 0.7rem',
                                    borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                                title="Open full screen in new tab"
                            >
                                ↗ Popout
                            </a>
                            <button
                                onClick={endCall}
                                style={{
                                    background: 'linear-gradient(135deg, #e53935, #c62828)',
                                    border: 'none',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    padding: '0.4rem 1rem',
                                    fontFamily: 'var(--font-header)',
                                    fontWeight: 800, fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    boxShadow: '0 2px 10px rgba(229,57,53,0.3)',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                📵 End Call
                            </button>
                        </div>
                    </div>

                    {/* Jitsi Production Iframe */}
                    <iframe
                        src={jitsiUrl}
                        allow="camera; microphone; display-capture; autoplay; clipboard-write; fullscreen"
                        style={{ flex: 1, border: 'none', width: '100%', height: '100%', background: '#000' }}
                        title="1-Hour Live Video Session"
                    />
                </div>
            )}

            {/* ── Messages area ──────────────────────────────── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>

                {messages.length === 0 && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                        <div style={{ fontSize: '3.5rem' }}>💬</div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>No messages yet</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: 280, lineHeight: 1.5 }}>
                            {isTutor
                                ? `Say hello to ${studentName}! Hit 📹 in the top-right to start your video session.`
                                : `Say hello to ${tutorName}! Hit 📹 to join the video session when it's ready.`}
                        </p>
                        <button
                            onClick={startCall}
                            style={{
                                marginTop: '0.5rem',
                                padding: '0.65rem 1.5rem',
                                borderRadius: '100px',
                                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                                color: '#fff',
                                border: 'none',
                                fontFamily: 'var(--font-header)',
                                fontWeight: 800, fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            📹 Start Video Session
                        </button>
                    </div>
                )}

                {Object.entries(grouped).map(([dateKey, group]) => (
                    <div key={dateKey}>
                        {/* Date separator */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0 1rem' }}>
                            <div style={{ flex: 1, height: 1, background: 'var(--outline-variant)' }} />
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{group.label}</span>
                            <div style={{ flex: 1, height: 1, background: 'var(--outline-variant)' }} />
                        </div>

                        {group.msgs.map((msg, i) => {
                            const mine = isMyMsg(msg);
                            const senderLabel = mine ? 'You' : (msg.sender?.full_name || msg.sender?.username || otherName);
                            const showName = !mine && (i === 0 || group.msgs[i - 1]?.sender_id !== msg.sender_id);

                            return (
                                <div key={msg.id} style={{ display: 'flex', flexDirection: mine ? 'row-reverse' : 'row', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-end' }}>
                                    {/* Avatar */}
                                    {!mine && (
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'var(--surface-variant)', backgroundImage: msg.sender?.avatar_url ? `url(${msg.sender.avatar_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', alignSelf: 'flex-end', marginBottom: 2 }}>
                                            {!msg.sender?.avatar_url && '👤'}
                                        </div>
                                    )}

                                    <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start', gap: '0.2rem' }}>
                                        {showName && (
                                            <span style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', fontWeight: 700, paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>{senderLabel}</span>
                                        )}
                                        <div style={{
                                            padding: '0.65rem 1rem', borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                            background: mine ? 'var(--primary)' : 'var(--surface)',
                                            color: mine ? 'var(--on-primary, #000)' : 'var(--on-surface)',
                                            border: mine ? 'none' : '1px solid var(--outline-variant)',
                                            fontSize: '0.92rem', lineHeight: 1.5, wordBreak: 'break-word',
                                            boxShadow: mine ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 4px rgba(0,0,0,0.08)',
                                            opacity: msg.id?.toString().startsWith('optimistic') ? 0.6 : 1,
                                        }}>
                                            <Linkified text={msg.content} />
                                        </div>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                                            {formatTime(msg.created_at)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}

                <div ref={bottomRef} />
            </div>

            {/* ── Input bar ──────────────────────────────────── */}
            <div style={{
                borderTop: '1px solid var(--outline-variant)', background: 'var(--surface)',
                padding: '0.9rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-end',
                flexShrink: 0, position: 'sticky', bottom: 0
            }}>
                <textarea
                    ref={inputRef}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                    rows={1}
                    style={{
                        flex: 1, resize: 'none', background: 'var(--surface-variant)',
                        border: '1px solid var(--outline-variant)', borderRadius: 14,
                        padding: '0.75rem 1rem', color: 'var(--on-surface)',
                        fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none',
                        lineHeight: 1.5, maxHeight: 120, overflowY: 'auto',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--outline-variant)'}
                />
                <button
                    onClick={handleSend}
                    disabled={!text.trim() || sending}
                    style={{
                        background: !text.trim() || sending ? 'var(--surface-variant)' : 'var(--primary)',
                        color: !text.trim() || sending ? 'var(--on-surface-variant)' : 'var(--on-primary, #000)',
                        border: 'none', borderRadius: 14, width: 46, height: 46, cursor: !text.trim() || sending ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'all 0.2s', fontSize: '1.2rem',
                        transform: !text.trim() || sending ? 'none' : 'scale(1)',
                    }}
                    onMouseOver={e => { if (text.trim() && !sending) e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    title="Send message"
                >
                    {sending ? '⏳' : '➤'}
                </button>
            </div>

            {/* ── First-Time User Call Guide Modal Popup ────────────────────────── */}
            {showCallGuideModal && (
                <>
                    <div
                        onClick={() => {
                            localStorage.setItem('hmd_call_guide_seen', '1');
                            setShowCallGuideModal(false);
                        }}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(0,0,0,0.75)',
                            backdropFilter: 'blur(6px)',
                            zIndex: 8000,
                            animation: 'fadeIn 0.25s ease'
                        }}
                    />
                    <div style={{
                        position: 'fixed',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%', maxWidth: '500px',
                        background: 'var(--surface)',
                        border: '1px solid var(--outline-variant)',
                        borderRadius: '24px',
                        padding: '2rem',
                        zIndex: 8001,
                        boxShadow: '0 30px 90px rgba(0,0,0,0.6)',
                        fontFamily: 'var(--font-body)',
                        animation: 'fadeSlideUp 0.3s cubic-bezier(0.175,0.885,0.32,1.275)'
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.2rem', color: '#fff'
                                }}>
                                    📹
                                </div>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--on-surface)' }}>
                                        Live 1-on-1 Video Session
                                    </h3>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                                        🔒 Encrypted Academic Communication
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    localStorage.setItem('hmd_call_guide_seen', '1');
                                    setShowCallGuideModal(false);
                                }}
                                style={{
                                    background: 'var(--surface-variant)', border: '1px solid var(--outline-variant)',
                                    width: 30, height: 30, borderRadius: '50%', color: 'var(--on-surface-variant)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Guide Steps */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                            <div style={{
                                padding: '0.75rem 0.9rem', borderRadius: '12px', background: 'var(--surface-variant)',
                                border: '1px solid var(--outline-variant)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--on-surface)' }}>1-Tap In-App Calling</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
                                        Hit the green video button to start or answer. No Zoom or Google Meet app download needed.
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                padding: '0.75rem 0.9rem', borderRadius: '12px', background: 'var(--surface-variant)',
                                border: '1px solid var(--outline-variant)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--on-surface)' }}>1-Hour Active Timer</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
                                        Sessions run on a live 60-minute countdown with a 5-minute alert and an instant <b>+15m extension</b> button.
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                padding: '0.75rem 0.9rem', borderRadius: '12px', background: 'var(--surface-variant)',
                                border: '1px solid var(--outline-variant)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>📑</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--on-surface)' }}>Screen Share &amp; Past Questions</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
                                        Tutors and students can share slides, PDF handouts, or code directly within the call panel.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => {
                                    localStorage.setItem('hmd_call_guide_seen', '1');
                                    setShowCallGuideModal(false);
                                }}
                                style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '12px',
                                    background: 'var(--surface-variant)', border: '1px solid var(--outline-variant)',
                                    color: 'var(--on-surface)', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
                                }}
                            >
                                Got it
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.setItem('hmd_call_guide_seen', '1');
                                    setShowCallGuideModal(false);
                                    startCall();
                                }}
                                style={{
                                    flex: 1.4, padding: '0.75rem', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #25D366, #128C7E)', border: 'none',
                                    color: '#fff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                                    boxShadow: '0 4px 16px rgba(37,211,102,0.35)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                                }}
                            >
                                📹 Start 1-Hour Call
                            </button>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes videoPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.85); }
                }
                @keyframes pulseRing {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    50% { transform: scale(1.4); opacity: 0.2; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
            `}</style>
        </div>
    );
}

function btnStyle(type) {
    return {
        background: type === 'primary' ? 'var(--primary)' : 'transparent',
        color: type === 'primary' ? 'var(--on-primary, #000)' : 'var(--primary)',
        border: type === 'primary' ? 'none' : '1px solid var(--primary)',
        borderRadius: 100, padding: '0.9rem 2.5rem',
        fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '1rem',
        cursor: 'pointer', transition: 'all 0.2s'
    };
}
