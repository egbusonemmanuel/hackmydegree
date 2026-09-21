import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getResources, getCategories } from '../lib/supabase';
import { useAuth } from '../App';
import PageLoader from '../components/PageLoader';
import { Input } from '../components/SharedUI';
import { KNOWLEDGE_BANK_COURSES } from '../data/knowledgeBank';
import KnowledgeReaderModal from '../components/KnowledgeReaderModal';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

const LEVEL_OPTIONS = ['All Levels', '100 Level', '200 Level', '300 Level', '400 Level', '500 Level'];

export default function ResourcesPage() {
    const { user, profile, refreshProfile } = useAuth();
    const { selectedUniversity, selectedLevel, setSelectedLevel } = useUserPreferences();
    const [searchParams, setSearchParams] = useSearchParams();
    const [resources, setResources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [activeCategory, setActiveCategory] = useState(() => searchParams.get('category') || null);
    const [search, setSearch] = useState(() => searchParams.get('q') || '');
    const [activeLevel, setActiveLevel] = useState(() => selectedLevel || 'All Levels');
    const [activeSource, setActiveSource] = useState('all'); // 'all', 'knowledge_bank', 'uploads'

    // Synchronize local activeLevel when global selectedLevel updates
    useEffect(() => {
        if (selectedLevel) {
            setActiveLevel(selectedLevel);
        }
    }, [selectedLevel]);

    // Reader Modal
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        setActiveCategory(searchParams.get('category') || null);
        setSearch(searchParams.get('q') || '');
    }, [searchParams]);

    useEffect(() => {
        const handleOpenCourse = (e) => {
            if (e.detail) {
                setSelectedCourse(e.detail);
            }
        };
        window.addEventListener('open-knowledge-course', handleOpenCourse);
        return () => window.removeEventListener('open-knowledge-course', handleOpenCourse);
    }, []);

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

    // Academic category slugs that can include Knowledge Bank materials
    const ACADEMIC_CATEGORY_SLUGS = ['past-questions', 'lecture-notes', 'study-materials', 'academic', 'textbooks', 'exam-prep'];
    const isAcademicCategorySelected = activeCategory ? ACADEMIC_CATEGORY_SLUGS.includes(activeCategory.toLowerCase()) : true;

    // Filter Knowledge Bank courses
    const filteredKnowledgeBank = useMemo(() => {
        // If a non-academic category is selected (e.g. NYSC, housing tips), hide Knowledge Bank courses completely
        if (activeCategory && !isAcademicCategorySelected) {
            return [];
        }

        return KNOWLEDGE_BANK_COURSES.filter(course => {
            // If filtering specifically by past-questions category, only show courses with past questions
            if (activeCategory?.toLowerCase() === 'past-questions' && !course.has_past_questions) {
                return false;
            }

            if (activeLevel !== 'All Levels' && course.level !== activeLevel) {
                return false;
            }
            if (!normalizedSearch) return true;
            const searchTargets = [
                course.course_code,
                course.title,
                course.department,
                course.faculty,
                course.level,
                course.semester,
                ...(course.topics || []),
                ...(course.documents || []).map(d => d.title)
            ].join(' ').toLowerCase();
            return searchTargets.includes(normalizedSearch);
        });
    }, [activeCategory, isAcademicCategorySelected, activeLevel, normalizedSearch]);

    // Filter Supabase community resources
    const visibleResources = useMemo(() => {
        if (normalizedSearch.length < 3) {
            return resources.filter((resource) => {
                const searchable = [
                    resource.title, resource.description, resource.category?.name,
                    resource.uploader?.full_name, resource.uploader?.username, resource.school
                ].filter(Boolean).join(' ').toLowerCase();
                return searchable.includes(normalizedSearch);
            });
        }
        return resources;
    }, [resources, normalizedSearch]);

    const isPro = Boolean(profile?.is_pro);
    const totalFound = (activeSource !== 'uploads' ? filteredKnowledgeBank.length : 0) +
        (activeSource !== 'knowledge_bank' ? visibleResources.length : 0);

    return (
        <div className="resource-vault" style={{
            color: 'var(--on-surface)', fontFamily: 'var(--font-body)',
            maxWidth: '1240px', margin: '0 auto',
            padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-header)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
                        margin: 0, fontWeight: 900, letterSpacing: '-0.04em'
                    }}>
                        Resource Vault 📚
                    </h1>
                    <span style={{
                        background: 'linear-gradient(135deg, rgba(201,150,62,0.2) 0%, rgba(201,150,62,0.05) 100%)',
                        color: '#C9963E', border: '1px solid rgba(201,150,62,0.3)',
                        padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.82rem',
                        fontWeight: 800, letterSpacing: '0.04em'
                    }}>
                        🏛️ 100L–500L KNOWLEDGE BANK
                    </span>
                </div>
                <p style={{
                    color: 'var(--on-surface-variant)', margin: 0,
                    fontSize: 'clamp(1rem, 2vw, 1.15rem)', fontWeight: 450, maxWidth: '750px', lineHeight: 1.5
                }}>
                    Verified lecture notes, past questions, and academic repositories across Nigerian universities. Read securely on-site.
                </p>
            </div>

            {/* Knowledge Bank Spotlight Hero Banner - only on All Categories, or when Knowledge Bank is active, or for academic categories */}
            {(!activeCategory || isAcademicCategorySelected || activeSource === 'knowledge_bank') && activeSource !== 'uploads' && (
                <div style={{
                    background: 'linear-gradient(135deg, #15161A 0%, #101114 100%)',
                    border: '1px solid rgba(201, 150, 62, 0.3)',
                    borderRadius: '20px', padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                    marginBottom: '2.5rem', position: 'relative', overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                }}>
                    <div style={{
                        position: 'absolute', top: '-50px', right: '-50px', width: '220px', height: '220px',
                        background: 'radial-gradient(circle, rgba(201,150,62,0.15) 0%, rgba(0,0,0,0) 70%)',
                        borderRadius: '50%', pointerEvents: 'none'
                    }}></div>

                    <div className="vault-spotlight-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div style={{ maxWidth: '720px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                                <span style={{ fontSize: '1.4rem' }}>🏛️</span>
                                <span style={{ color: '#C9963E', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    HackMyDegree Official Knowledge Bank
                                </span>
                                {isPro ? (
                                    <span style={{
                                        background: 'rgba(0, 200, 83, 0.15)', color: '#00E676',
                                        padding: '0.15rem 0.5rem', borderRadius: '100px', fontSize: '0.72rem',
                                        fontWeight: 800, border: '1px solid rgba(0, 230, 118, 0.3)'
                                    }}>
                                        ✓ PRO ACTIVE
                                    </span>
                                ) : (
                                    <span style={{
                                        background: 'rgba(201, 150, 62, 0.15)', color: '#E5B158',
                                        padding: '0.15rem 0.5rem', borderRadius: '100px', fontSize: '0.72rem',
                                        fontWeight: 800, border: '1px solid rgba(201, 150, 62, 0.3)'
                                    }}>
                                        🔒 PRO EXCLUSIVE
                                    </span>
                                )}
                                {selectedUniversity && (
                                    <span style={{
                                        background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA',
                                        padding: '0.15rem 0.55rem', borderRadius: '100px', fontSize: '0.72rem',
                                        fontWeight: 700, border: '1px solid rgba(59, 130, 246, 0.3)'
                                    }}>
                                        🎓 {selectedUniversity.short_name || selectedUniversity.name} Curriculum
                                    </span>
                                )}
                            </div>
                            <h2 style={{
                                margin: '0 0 0.6rem 0', fontSize: 'clamp(1.25rem, 2.5vw, 1.7rem)',
                                fontWeight: 800, letterSpacing: '-0.03em', color: '#FFFFFF'
                            }}>
                                Complete 100L – 500L University Study Bank
                            </h2>
                            <p style={{
                                color: '#A8A8A8', margin: 0, fontSize: '0.92rem', lineHeight: 1.55
                            }}>
                                Access comprehensive notes in Pharmacy, Nursing, Basic Medical, Engineering & General Studies. Protected for exclusive on-site study on HackMyDegree.
                            </p>
                        </div>

                        {/* Level Quick Filter Tabs inside Hero */}
                        <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#888888', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                Browse By Academic Level:
                            </span>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                {LEVEL_OPTIONS.map(lvl => (
                                    <button
                                        key={lvl}
                                        onClick={() => {
                                            setActiveLevel(lvl);
                                            setSelectedLevel(lvl);
                                            setActiveSource('knowledge_bank');
                                        }}
                                        style={{
                                            background: activeLevel === lvl ? '#C9963E' : 'rgba(255,255,255,0.06)',
                                            color: activeLevel === lvl ? '#000000' : '#CCCCCC',
                                            border: activeLevel === lvl ? '1px solid #C9963E' : '1px solid rgba(255,255,255,0.08)',
                                            padding: '0.45rem 0.9rem', borderRadius: '8px', cursor: 'pointer',
                                            fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s', whiteSpace: 'nowrap'
                                        }}>
                                        {lvl.replace(' Level', 'L')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search & Source Tabs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
                <div style={{ flex: '1 1 320px' }}>
                    <Input
                        placeholder="Search courses (e.g. BIO 101, Pharmacy, Nursing, CHM 101)..."
                        value={search}
                        onChange={(e) => updateFilters(activeCategory, e.target.value)}
                        icon={<span>🔍</span>}
                    />
                </div>

                {/* Source Segmented Control */}
                <div className="vault-source-tabs" style={{
                    display: 'flex', background: 'rgba(255,255,255,0.04)', padding: '0.3rem',
                    borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <button
                        onClick={() => setActiveSource('all')}
                        style={{
                            background: activeSource === 'all' ? 'var(--on-surface)' : 'transparent',
                            color: activeSource === 'all' ? 'var(--surface)' : 'var(--on-surface-variant)',
                            border: 'none', padding: '0.5rem 1.1rem', borderRadius: '100px',
                            cursor: 'pointer', fontWeight: 800, fontSize: '0.82rem', transition: 'all 0.2s'
                        }}>
                        All ({filteredKnowledgeBank.length + visibleResources.length})
                    </button>
                    <button
                        onClick={() => {
                            setActiveSource('knowledge_bank');
                            if (activeCategory && !isAcademicCategorySelected) {
                                updateFilters(null, search);
                            }
                        }}
                        style={{
                            background: activeSource === 'knowledge_bank' ? '#C9963E' : 'transparent',
                            color: activeSource === 'knowledge_bank' ? '#000000' : '#CCCCCC',
                            border: 'none', padding: '0.5rem 1.1rem', borderRadius: '100px',
                            cursor: 'pointer', fontWeight: 800, fontSize: '0.82rem', transition: 'all 0.2s'
                        }}>
                        🏛️ Knowledge Bank ({filteredKnowledgeBank.length})
                    </button>
                    <button
                        onClick={() => setActiveSource('uploads')}
                        style={{
                            background: activeSource === 'uploads' ? 'var(--on-surface)' : 'transparent',
                            color: activeSource === 'uploads' ? 'var(--surface)' : 'var(--on-surface-variant)',
                            border: 'none', padding: '0.5rem 1.1rem', borderRadius: '100px',
                            cursor: 'pointer', fontWeight: 800, fontSize: '0.82rem', transition: 'all 0.2s'
                        }}>
                        📂 Community Vault ({visibleResources.length})
                    </button>
                </div>
            </div>

            {/* Category Pills (for uploads) */}
            {activeSource !== 'knowledge_bank' && (
                <div className="responsive-tabs" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => updateFilters(null, search)}
                        style={{
                            background: activeCategory === null ? 'var(--on-surface)' : 'var(--surface-variant)',
                            color: activeCategory === null ? 'var(--surface)' : 'var(--on-surface-variant)',
                            border: '1px solid var(--outline-variant)', padding: '0.55rem 1.25rem', borderRadius: '100px',
                            cursor: 'pointer', fontFamily: 'var(--font-header)', fontWeight: 800, whiteSpace: 'nowrap',
                            fontSize: '0.85rem', flexShrink: 0
                        }}>All Categories</button>
                    {categories.map(cat => (
                        <button key={cat.id}
                            onClick={() => {
                                const isAcademic = ACADEMIC_CATEGORY_SLUGS.includes(cat.slug.toLowerCase());
                                if (!isAcademic && activeSource === 'knowledge_bank') {
                                    setActiveSource('uploads');
                                }
                                updateFilters(cat.slug, search);
                            }}
                            style={{
                                background: activeCategory === cat.slug ? 'var(--on-surface)' : 'var(--surface-variant)',
                                color: activeCategory === cat.slug ? 'var(--surface)' : 'var(--on-surface-variant)',
                                border: '1px solid var(--outline-variant)', padding: '0.55rem 1.25rem', borderRadius: '100px',
                                cursor: 'pointer', fontFamily: 'var(--font-header)', fontWeight: 800, whiteSpace: 'nowrap',
                                fontSize: '0.85rem', flexShrink: 0
                            }}>
                            {cat.icon} {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Results Filter Summary */}
            {(activeCategory || search || activeLevel !== 'All Levels' || activeSource !== 'all') && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--on-surface-variant)', fontSize: '0.88rem' }}>
                    <span>Showing {totalFound} item{totalFound === 1 ? '' : 's'} {activeLevel !== 'All Levels' && `for ${activeLevel}`}</span>
                    <button
                        onClick={() => {
                            updateFilters(null, '');
                            setActiveLevel('All Levels');
                            setActiveSource('all');
                        }}
                        style={{ border: 'none', background: 'transparent', color: '#C9963E', cursor: 'pointer', fontWeight: 800 }}>
                        Reset filters
                    </button>
                </div>
            )}

            {loading ? (
                <PageLoader />
            ) : totalFound === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#A0A0A0', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📭</span>
                    No courses or materials found matching your criteria. Try adjusting your search query or level.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                    {/* ─── KNOWLEDGE BANK GRID ─── */}
                    {activeSource !== 'uploads' && filteredKnowledgeBank.length > 0 && (
                        <div>
                            <div className="vault-section-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                                        Pro Knowledge Bank Courses
                                    </h3>
                                    <span style={{ color: '#888888', fontSize: '0.9rem' }}>({filteredKnowledgeBank.length})</span>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: '#C9963E', fontWeight: 700 }}>
                                    🛡️ On-Site Reader Only
                                </span>
                            </div>

                            <div className="vault-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {filteredKnowledgeBank.map(course => (
                                    <div
                                        key={course.id}
                                        onClick={() => setSelectedCourse(course)}
                                        style={{
                                            background: '#131417', borderRadius: '16px', overflow: 'hidden',
                                            border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
                                            display: 'flex', flexDirection: 'column', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.borderColor = 'rgba(201, 150, 62, 0.4)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                        }}>
                                        {/* Top Card Header */}
                                        <div style={{
                                            padding: '1.25rem 1.25rem 1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)',
                                            background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 100%)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                                    <span style={{
                                                        background: '#C9963E', color: '#000000', fontWeight: 900,
                                                        fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '6px'
                                                    }}>
                                                        {course.course_code}
                                                    </span>
                                                    <span style={{
                                                        background: 'rgba(255,255,255,0.06)', color: '#CCCCCC',
                                                        fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '6px'
                                                    }}>
                                                        {course.level}
                                                    </span>
                                                </div>

                                                <span style={{
                                                    fontSize: '0.72rem',
                                                    color: isPro ? '#00E676' : '#C9963E',
                                                    fontWeight: 800,
                                                    background: isPro ? 'rgba(0, 230, 118, 0.1)' : 'rgba(201, 150, 62, 0.1)',
                                                    padding: '0.15rem 0.5rem',
                                                    borderRadius: '4px'
                                                }}>
                                                    {isPro ? '✓ UNLOCKED' : '📖 READ NOTE'}
                                                </span>
                                            </div>

                                            <h4 style={{
                                                margin: '0 0 0.35rem 0', fontSize: '1.1rem', fontWeight: 800,
                                                color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.35
                                            }}>
                                                {course.title}
                                            </h4>
                                            <span style={{ fontSize: '0.78rem', color: '#888888', display: 'block' }}>
                                                {course.department}
                                            </span>
                                        </div>

                                        {/* Card Topics Teaser */}
                                        <div style={{ padding: '1rem 1.25rem', flex: 1 }}>
                                            <div style={{ fontSize: '0.78rem', color: '#A0A0A0', marginBottom: '0.5rem', fontWeight: 600 }}>
                                                Core Syllabus Highlights:
                                            </div>
                                            <ul style={{
                                                margin: 0, paddingLeft: '1.1rem', color: '#CCCCCC',
                                                fontSize: '0.82rem', lineHeight: 1.5
                                            }}>
                                                {course.topics?.slice(0, 2).map((t, idx) => (
                                                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{t}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Card Action Footer */}
                                        <div style={{
                                            padding: '0.9rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.04)',
                                            background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ fontSize: '0.78rem', color: '#888888' }}>
                                                📄 {course.documents?.length || 1} Document{(course.documents?.length || 1) > 1 ? 's' : ''}
                                            </span>

                                            <button style={{
                                                background: 'rgba(201,150,62,0.15)',
                                                color: '#C9963E',
                                                border: '1px solid rgba(201,150,62,0.35)',
                                                padding: '0.4rem 0.85rem', borderRadius: '8px', cursor: 'pointer',
                                                fontSize: '0.78rem', fontWeight: 800, transition: 'all 0.2s'
                                            }}>
                                                Read Full Note 📖
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ─── COMMUNITY UPLOADS GRID ─── */}
                    {activeSource !== 'knowledge_bank' && visibleResources.length > 0 && (
                        <div>
                            <div className="vault-section-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>📂</span>
                                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                                    Community Uploads & Past Questions
                                </h3>
                                <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>({visibleResources.length})</span>
                            </div>

                            <div className="vault-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {visibleResources.map(res => (
                                    <Link to={`/resources/${res.id}`} key={res.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div style={{
                                            background: 'rgba(255,255,255,0.02)', borderRadius: '16px', overflow: 'hidden',
                                            border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s'
                                        }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                            {res.thumbnail_url ? (
                                                <img src={res.thumbnail_url} alt={res.title} style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '170px', background: 'rgba(201,150,62,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: '2.8rem' }}>📄</span>
                                                </div>
                                            )}
                                            <div style={{ padding: '1.25rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                    <span style={{
                                                        background: 'var(--primary-container)', fontSize: '0.72rem', fontWeight: 800,
                                                        padding: '0.25rem 0.65rem', borderRadius: '100px', color: 'var(--primary)'
                                                    }}>{res.category?.name}</span>
                                                    {res.resource_type === 'premium' ?
                                                        <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800 }}>₦{res.price}</span> :
                                                        <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800 }}>FREE</span>}
                                                </div>
                                                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{res.title}</h3>
                                                <p style={{ color: 'var(--on-surface-variant)', margin: '0 0 1rem 0', fontSize: '0.86rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                                                    {res.description}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{
                                                        width: 22, height: 22, borderRadius: '50%', background: '#333',
                                                        backgroundImage: `url(${res.uploader?.avatar_url})`, backgroundSize: 'cover'
                                                    }}></div>
                                                    <span style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)' }}>
                                                        {res.uploader?.full_name || res.uploader?.username || 'HackMyDegree'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}

            {/* Knowledge Bank On-Site Reader & Paywall Modal */}
            <KnowledgeReaderModal
                course={selectedCourse}
                isOpen={Boolean(selectedCourse)}
                onClose={() => setSelectedCourse(null)}
                user={user}
                profile={profile}
                onProActivated={refreshProfile}
            />
        </div>
    );
}
