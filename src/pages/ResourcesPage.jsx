import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getResources, getCategories } from '../lib/supabase';
import PageLoader from '../components/PageLoader';
import { Input } from '../components/SharedUI';

export default function ResourcesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [resources, setResources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(() => searchParams.get('category') || null);
    const [search, setSearch] = useState(() => searchParams.get('q') || '');

    useEffect(() => {
        setActiveCategory(searchParams.get('category') || null);
        setSearch(searchParams.get('q') || '');
    // Query parameters are the source of truth for links shared from the home page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const updateFilters = (category, query) => {
        const next = {};
        if (category) next.category = category;
        if (query?.trim()) next.q = query.trim();
        setSearchParams(next, { replace: true });
    };

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        const safetyTimeout = setTimeout(() => {
            if (mounted) setLoading(false);
        }, 7000);

        Promise.all([
            getCategories(),
            getResources({ categorySlug: activeCategory, search: search.length > 2 ? search : '' })
        ])
            .then(([catRes, resRes]) => {
                if (mounted) {
                    setCategories(catRes.data || []);
                    setResources(resRes.data || []);
                }
            })
            .catch(err => console.error('[Resources] Fetch error:', err))
            .finally(() => {
                if (mounted) {
                    setLoading(false);
                    clearTimeout(safetyTimeout);
                }
            });

        return () => { mounted = false; clearTimeout(safetyTimeout); };
    }, [activeCategory, search]);

    const normalizedSearch = search.trim().toLowerCase();
    const visibleResources = normalizedSearch.length < 3 ? resources.filter((resource) => {
        const searchable = [resource.title, resource.description, resource.category?.name, resource.uploader?.full_name, resource.uploader?.username].filter(Boolean).join(' ').toLowerCase();
        return searchable.includes(normalizedSearch);
    }) : resources;

    return (
        <div style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-body)', maxWidth: '1200px', margin: '0 auto', padding: 'clamp(2rem, 8vw, 4rem) clamp(1rem, 4vw, 2rem)' }}>
            <h1 style={{ fontFamily: 'var(--font-header)', fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '1rem', fontWeight: 900, letterSpacing: '-0.05em' }}>
                Resource Vault 📚
            </h1>
            <p style={{ color: 'var(--on-surface-variant)', marginBottom: 'clamp(2rem, 6vw, 3.5rem)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 500 }}>
                High-quality past questions, lecture notes, and study guides from across Nigeria.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: 'clamp(2rem, 5vw, 4rem)', alignItems: 'center' }}>
                <div style={{ flex: '1 1 280px', width: '100%' }}>
                    <Input
                        placeholder="Search resources, topics, or schools..."
                        value={search}
                        onChange={(e) => updateFilters(activeCategory, e.target.value)}
                        icon={<span>🔍</span>}
                    />
                </div>
                <div className="responsive-tabs" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', width: '100%' }}>
                    <button
                        onClick={() => updateFilters(null, search)}
                        style={{
                            background: activeCategory === null ? 'var(--on-surface)' : 'var(--surface-variant)',
                            color: activeCategory === null ? 'var(--surface)' : 'var(--on-surface-variant)',
                            border: '1px solid var(--outline-variant)', padding: '0.75rem 1.5rem', borderRadius: '100px',
                            cursor: 'pointer', fontFamily: 'var(--font-header)', fontWeight: 800, whiteSpace: 'nowrap',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', fontSize: '0.9rem', flexShrink: 0
                        }}>All</button>
                    {categories.map(cat => (
                        <button key={cat.id}
                            onClick={() => updateFilters(cat.slug, search)}
                            style={{
                                background: activeCategory === cat.slug ? 'var(--on-surface)' : 'var(--surface-variant)',
                                color: activeCategory === cat.slug ? 'var(--surface)' : 'var(--on-surface-variant)',
                                border: '1px solid var(--outline-variant)', padding: '0.75rem 1.5rem', borderRadius: '100px',
                                cursor: 'pointer', fontFamily: 'var(--font-header)', fontWeight: 800, whiteSpace: 'nowrap',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', fontSize: '0.9rem', flexShrink: 0
                            }}>
                            {cat.icon} {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {!loading && (activeCategory || search) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', margin: '-2rem 0 2rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
                    <span>{visibleResources.length} resource{visibleResources.length === 1 ? '' : 's'} found</span>
                    <button onClick={() => updateFilters(null, '')} style={{ border: 'none', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontWeight: 800 }}>Clear filters</button>
                </div>
            )}

            {loading ? (
                <PageLoader />
            ) : visibleResources.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#7A9E7E', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📭</span>
                    No resources found. Try adjusting your search or category.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {visibleResources.map(res => (
                        <Link to={`/resources/${res.id}`} key={res.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.02)', borderRadius: '16px', overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s'
                            }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                {res.thumbnail_url ? (
                                    <img src={res.thumbnail_url} alt={res.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '180px', background: 'rgba(0,200,83,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '3rem' }}>📄</span>
                                    </div>
                                )}
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{
                                            background: 'var(--primary-container)', fontSize: '0.75rem', fontWeight: 800,
                                            padding: '0.3rem 0.75rem', borderRadius: '100px', color: 'var(--primary)'
                                        }}>{res.category?.name}</span>
                                        {res.resource_type === 'premium' ?
                                            <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800 }}>₦{res.price}</span> :
                                            <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800 }}>FREE</span>}
                                    </div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{res.title}</h3>
                                    <p style={{ color: 'var(--on-surface-variant)', margin: '0 0 1.25rem 0', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 450, lineHeight: 1.5 }}>
                                        {res.description}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            width: 24, height: 24, borderRadius: '50%', background: '#333',
                                            backgroundImage: `url(${res.uploader?.avatar_url})`, backgroundSize: 'cover'
                                        }}></div>
                                        <span style={{ fontSize: '0.8rem', color: '#7A9E7E' }}>{res.uploader?.full_name || res.uploader?.username}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
