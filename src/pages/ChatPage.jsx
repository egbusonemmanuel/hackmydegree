// src/pages/ChatPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { supabase, getBookingForChat, getBookingMessages, sendBookingMessage, subscribeToMessages } from '../lib/supabase';
import PageLoader from '../components/PageLoader';
import { useToast } from '../contexts/ToastContext';

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
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [booking, setBooking] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

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

            {/* ── Meet link banner ───────────────────────────── */}
            {booking.meet_link && (
                <div style={{ background: 'var(--primary-container)', borderBottom: '1px solid var(--outline-variant)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '1.1rem' }}>📹</span>
                    <span style={{ color: 'var(--on-surface)', fontWeight: 600, fontSize: '0.9rem', flex: 1 }}>
                        Meeting link ready:&nbsp;
                        <a href={booking.meet_link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                            Join Session
                        </a>
                    </span>
                </div>
            )}

            {/* ── Tip for tutors ─────────────────────────────── */}
            {isTutor && !booking.meet_link && (
                <div style={{ background: 'rgba(212,160,32,0.07)', borderBottom: '1px solid var(--outline-variant)', padding: '0.65rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '1rem' }}>💡</span>
                    <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.82rem', fontWeight: 500 }}>
                        Share your Google Meet or Zoom link by typing it in the chat below.
                    </span>
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
                                ? `Say hello to ${studentName} and share your meeting link when ready.`
                                : `Say hello to ${tutorName}! Ask any questions about the session.`}
                        </p>
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
