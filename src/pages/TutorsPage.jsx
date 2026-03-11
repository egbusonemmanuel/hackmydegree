import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTutors } from '../lib/supabase';
import PageLoader from '../components/PageLoader';
import { Input, Button } from '../components/SharedUI';

export default function TutorsPage() {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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
        <div style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-body)', maxWidth: '1200px', margin: '0 auto', padding: 'clamp(2rem, 8vw, 4rem) clamp(1rem, 5vw, 2rem)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 10vw, 5rem)' }}>
                <h1 style={{ fontFamily: 'var(--font-header)', fontSize: 'clamp(2.2rem, 10vw, 3.5rem)', marginBottom: '1.25rem', fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 1.1 }}>
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

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(2.5rem, 10vw, 5rem)' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 100%, 350px), 1fr))', gap: '1.5rem' }}>
                    {filteredTutors.map(tutor => (
                        <div key={tutor.id} style={{
                            background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '2rem',
                            border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{ display: 'flex', gap: 'clamp(1rem, 4vw, 1.5rem)', marginBottom: '1.5rem', alignItems: 'center' }}>
                                <div style={{
                                    width: 'clamp(60px, 18vw, 80px)', height: 'clamp(60px, 18vw, 80px)', borderRadius: '50%', background: '#333', flexShrink: 0,
                                    backgroundImage: `url(${tutor.profile?.avatar_url})`, backgroundSize: 'cover'
                                }}></div>
                                <div>
                                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: 'clamp(1.1rem, 4vw, 1.25rem)', fontWeight: 800, fontFamily: 'var(--font-header)', lineHeight: 1.2 }}>{tutor.profile?.full_name || tutor.profile?.username}</h3>
                                    <div style={{ color: 'var(--on-surface-variant)', fontSize: 'clamp(0.75rem, 3vw, 0.85rem)', marginBottom: '0.5rem', fontWeight: 500, lineHeight: 1.3 }}>
                                        {tutor.profile?.university} • {tutor.profile?.department} {tutor.profile?.level}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#FFD600' }}>★</span> {tutor.rating_avg} ({tutor.total_sessions} sessions)
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
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>₦{tutor.hourly_rate}</div>
                                    <div style={{ color: '#7A9E7E', fontSize: '0.8rem' }}>per hour</div>
                                </div>
                                <Link to={`/book/${tutor.id}`} style={{ width: 'auto', display: 'block' }}>
                                    <Button style={{ padding: '0.8rem 1.5rem', fontSize: '0.95rem', width: 'auto', whiteSpace: 'nowrap' }}>
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
