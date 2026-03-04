// src/pages/ResourceDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getResource, getResourceReviews, getDownloadUrl, hasPurchased } from '../lib/supabase';
import { payForResource } from '../lib/paystack';
import { useAuth } from '../App';
import PageLoader from '../components/PageLoader';
import { Button } from '../components/SharedUI';

export default function ResourceDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, profile } = useAuth();

    const [resource, setResource] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchased, setPurchased] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        const safetyTimeout = setTimeout(() => {
            if (mounted) setLoading(false);
        }, 7000);

        async function load() {
            try {
                const { data: res } = await getResource(id);
                if (res && mounted) {
                    setResource(res);
                    const { data: revs } = await getResourceReviews(id);
                    if (mounted) setReviews(revs || []);

                    if (user) {
                        if (res.resource_type === 'free' || res.uploader_id === user.id || profile?.is_pro) {
                            if (mounted) setPurchased(true);
                        } else {
                            const bought = await hasPurchased(user.id, id);
                            if (mounted) setPurchased(bought);
                        }
                    }
                }
            } catch (err) {
                console.error('[ResourceDetail] Load error:', err);
            } finally {
                if (mounted) {
                    setLoading(false);
                    clearTimeout(safetyTimeout);
                }
            }
        }
        load();
        return () => { mounted = false; clearTimeout(safetyTimeout); };
    }, [id, user, profile]);

    const handleDownload = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setDownloading(true);
        const { url, error } = await getDownloadUrl(id, user.id);
        setDownloading(false);
        if (url) {
            window.open(url, '_blank');
        } else {
            alert(error?.message || 'Failed to get download link');
        }
    };

    const handlePurchase = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        payForResource({
            resource,
            user,
            onSuccess: () => {
                alert('Payment successful! You can now download the resource.');
                // Small delay to ensure DB sync before first download attempt
                setTimeout(() => {
                    setPurchased(true);
                }, 1000);
            },
            onClose: () => {
                console.log('Payment cancelled');
            }
        });
    };

    if (loading) return <PageLoader />;
    if (!resource) return (
        <div style={{ textAlign: 'center', padding: '10rem', color: 'var(--on-surface-variant)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Resource not found</h2>
            <Link to="/resources" style={{ color: 'var(--primary)', fontWeight: 700 }}>Return to Library</Link>
        </div>
    );

    return (
        <div className="page-container" style={{ maxWidth: '1100px' }}>
            <Link to="/resources" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-header)' }}>
                <span>←</span> Back to Repository
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
                {/* Left Column: Details */}
                <div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span style={{ background: 'var(--primary-container)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800 }}>
                            {resource.category?.name}
                        </span>
                        <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.95rem', fontWeight: 500 }}>• {resource.school} {resource.subject && `• ${resource.subject}`}</span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '1.25rem', marginTop: 0, fontWeight: 900, letterSpacing: '-0.04em' }}>
                        {resource.title}
                    </h1>

                    <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2.5rem', color: 'var(--on-surface-variant)', fontSize: '0.95rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#FFD600', fontSize: '1.2rem' }}>★</span> {resource.rating_avg} <span style={{ opacity: 0.6 }}>({resource.rating_count} reviews)</span>
                        </div>
                        <div>⬇ {resource.download_count} Downloads</div>
                        <div>📅 {new Date(resource.created_at).toLocaleDateString()}</div>
                    </div>

                    {resource.thumbnail_url && (
                        <img src={resource.thumbnail_url} alt="thumbnail" style={{ width: '100%', borderRadius: '16px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }} />
                    )}

                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Description</h3>
                    <p style={{ color: '#7A9E7E', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '3rem' }}>
                        {resource.description}
                    </p>

                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Reviews</h3>
                    {reviews.length === 0 ? (
                        <div style={{ color: '#7A9E7E', fontStyle: 'italic' }}>No reviews yet.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {reviews.map(rev => (
                                <div key={rev.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 600 }}>{rev.reviewer?.full_name || rev.reviewer?.username}</span>
                                        <span style={{ color: '#FFD600' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                                    </div>
                                    <p style={{ color: '#7A9E7E', margin: 0, fontSize: '0.9rem' }}>{rev.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Sticky Action Card */}
                <div className="glass" style={{ position: 'sticky', top: '100px', borderRadius: '24px', padding: 'clamp(1.5rem, 5vw, 2.5rem)', border: '1px solid var(--outline-variant)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Access Price</span>
                        <span style={{ fontSize: '2.2rem', fontWeight: 900, color: resource.resource_type === 'free' ? 'var(--primary)' : 'var(--on-surface)' }}>
                            {resource.resource_type === 'free' ? 'FREE' : `₦${resource.price}`}
                        </span>
                    </div>

                    <Button
                        onClick={purchased ? handleDownload : handlePurchase}
                        loading={downloading}
                    >
                        {purchased ? 'Download Asset' : 'Unlock & Download'}
                    </Button>

                    <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--outline-variant)' }}>
                        <h4 style={{ margin: '0 0 1.25rem 0', color: 'var(--on-surface-variant)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Curator</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'var(--surface-variant)', backgroundImage: `url(${resource.uploader?.avatar_url})`, backgroundSize: 'cover', border: '1px solid var(--outline-variant)' }}></div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{resource.uploader?.full_name || resource.uploader?.username}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', fontWeight: 500 }}>{resource.uploader?.university}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
