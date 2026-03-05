import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTutors, getTutorReviews, reportReview } from '../lib/supabase';
import PageLoader from '../components/PageLoader';
import { Input, Button } from '../components/SharedUI';

function ReviewSection({ tutorId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTutorReviews(tutorId).then(({ data }) => {
            setReviews(data || []);
            setLoading(false);
        });
    }, [tutorId]);

    const handleReport = async (reviewId) => {
        const reason = window.prompt("Why are you reporting this review?");
        if (!reason) return;
        const { error } = await reportReview(reviewId, reason);
        if (error) alert("Failed to report: " + error.message);
        else {
            alert("Review reported. It will be hidden from the public.");
            setReviews(reviews.filter(r => r.id !== reviewId));
        }
    };

    if (loading) return <div style={{ fontSize: '0.8rem', opacity: 0.5, padding: '1rem 0' }}>Loading reviews...</div>;

    return (
        <div style={{ padding: '1rem 0' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--primary)' }}>What students say</h4>
            {reviews.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>No reviews yet.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reviews.map(r => (
                        <div key={r.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#444', backgroundImage: `url(${r.profiles?.avatar_url})`, backgroundSize: 'cover' }}></div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.profiles?.full_name || r.profiles?.username}</span>
                                    <span style={{ fontSize: '0.85rem', color: '#FFD600' }}>{'★'.repeat(r.rating)}</span>
                                </div>
                                <Button
                                    onClick={() => handleReport(r.id)}
                                    variant="danger"
                                    style={{ height: '28px', width: 'auto', padding: '0 0.75rem', fontSize: '0.75rem' }}
                                    title="Report Review"
                                >
                                    🚩 Report
                                </Button>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>"{r.review_text}"</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function TutorsPage() {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedTutor, setExpandedTutor] = useState(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        const safetyTimeout = setTimeout(() => {
            if (mounted) setLoading(false);
        }, 7000);

        getTutors({ limit: 50 }).then(({ data }) => {
            if (mounted) {
                setTutors(data || []);
                setLoading(false);
                clearTimeout(safetyTimeout);
            }
        });

        return () => { mounted = false; clearTimeout(safetyTimeout); };
    }, []);

    const filteredTutors = tutors.filter(t =>
        t.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        t.profile?.username?.toLowerCase().includes(search.toLowerCase()) ||
        t.subjects?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
        t.profile?.university?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-body)', maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <h1 style={{ fontFamily: 'var(--font-header)', fontSize: '3.5rem', marginBottom: '1.25rem', fontWeight: 900, letterSpacing: '-0.06em' }}>
                    Elite Tutors 👨‍🏫
                </h1>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', maxWidth: '700px', margin: '0 auto 2.5rem', fontWeight: 500, lineHeight: 1.6 }}>
                    Struggling with a course? Book 1-on-1 virtual sessions with top-performing scholars from your university network.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <Link to="/become-a-tutor" style={{ textDecoration: 'none' }}>
                        <Button style={{ padding: '0.8rem 2.5rem', fontSize: '1rem', width: 'auto', background: 'var(--primary-container)', color: 'var(--primary)' }}>
                            Join Our Tutor Network
                        </Button>
                    </Link>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5rem' }}>
                <div style={{ width: '100%', maxWidth: '700px' }}>
                    <Input
                        placeholder="Search by name, subject (e.g. MTH101), or university..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<span>🔍</span>}
                    />
                </div>
            </div>

            {loading ? (
                <PageLoader />
            ) : filteredTutors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#7A9E7E', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                    No tutors found matching your search.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {filteredTutors.map(tutor => (
                        <div key={tutor.id} style={{
                            background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '2rem',
                            border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: 80, height: 80, borderRadius: '50%', background: '#333',
                                    backgroundImage: `url(${tutor.profile?.avatar_url})`, backgroundSize: 'cover'
                                }}></div>
                                <div>
                                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-header)' }}>{tutor.profile?.full_name || tutor.profile?.username}</h3>
                                    <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        {tutor.profile?.university} • {tutor.profile?.department} {tutor.profile?.level}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#FFD600' }}>★</span> {tutor.rating_avg} ({tutor.total_reviews} reviews)
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <p style={{ color: '#E8F5E9', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    "{tutor.bio}"
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                    {tutor.subjects?.map(sub => (
                                        <span key={sub} style={{
                                            background: 'rgba(255,255,255,0.1)', color: '#fff',
                                            fontSize: '0.8rem', padding: '0.3rem 0.6rem', borderRadius: '100px'
                                        }}>{sub}</span>
                                    ))}
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={() => setExpandedTutor(expandedTutor === tutor.id ? null : tutor.id)}
                                    style={{ height: '36px', width: 'auto', padding: '0 1rem', fontSize: '0.85rem', marginBottom: '1rem' }}
                                >
                                    {expandedTutor === tutor.id ? 'Hide Reviews' : `Show Reviews (${tutor.total_reviews})`}
                                </Button>
                                {expandedTutor === tutor.id && <ReviewSection tutorId={tutor.id} />}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>₦{tutor.hourly_rate}</div>
                                    <div style={{ color: '#7A9E7E', fontSize: '0.8rem' }}>per hour</div>
                                </div>
                                <Link to={`/book/${tutor.id}`} style={{ width: 'auto' }}>
                                    <Button style={{ padding: '0 2rem', fontSize: '0.95rem', width: 'auto' }}>
                                        Book Session
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
