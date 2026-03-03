import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { uploadResource, getCategories } from '../lib/supabase';
import { Button, Input, Field, Banner } from '../components/SharedUI';

const ACCEPTED_TYPES = '.pdf,.doc,.docx,.ppt,.pptx,.zip,.mp4,.mp3,.jpg,.png';

export default function UploadPage() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [thumbnail] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', category_id: '',
    resource_type: 'free', price: '', school: '',
    subject: '', tags: ''
  });

  useEffect(() => {
    let mounted = true;
    const safetyTimeout = setTimeout(() => {
      if (mounted) {
        setError('Category loading timed out. Please check your connection.');
      }
    }, 10000);

    getCategories()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) setError(`Could not load categories: ${error.message}`);
        setCategories(data || []);
      })
      .finally(() => {
        if (mounted) {
          clearTimeout(safetyTimeout);
        }
      });

    return () => { mounted = false; clearTimeout(safetyTimeout); };
  }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a file to upload'); return; }
    if (form.resource_type === 'premium' && (!form.price || Number(form.price) < 100)) {
      setError('Premium resources must be priced at least ₦100'); return;
    }

    setError(null);
    setUploading(true);
    setProgress(10);

    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 5, 90));
    }, 500);

    const uploadTimeout = setTimeout(() => {
      setUploading(current => {
        if (current) {
          setError('Upload timed out. Please try a smaller file or better connection.');
          clearInterval(progressInterval);
          return false;
        }
        return current;
      });
    }, 90000);

    const { error } = await uploadResource(
      user.id,
      {
        ...form,
        price: form.resource_type === 'free' ? 0 : Number(form.price),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      },
      file,
      thumbnail,
      session?.access_token
    );

    clearTimeout(uploadTimeout);
    clearInterval(progressInterval);

    if (error) {
      setError(error.message || error);
      setUploading(false);
      setProgress(0);
      return;
    }

    setProgress(100);
    setTimeout(() => {
      setSuccess(true);
      setUploading(false);
    }, 600);
  };

  const labelStyle = {
    display: 'block',
    color: 'var(--primary)',
    fontSize: '0.75rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '0.75rem',
    marginLeft: '0.5rem'
  };

  if (success) {
    return (
      <div className="page-container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass" style={{ maxWidth: '540px', padding: '5rem 3rem', borderRadius: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '6rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 24px var(--primary))' }}>✨</div>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 900 }}>Success!</h2>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '3.5rem', fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6 }}>
            Your resource has been queued for verification. It will be live across the network once approved by our moderation team.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button onClick={() => { setSuccess(false); setFile(null); }} style={{ width: 'auto', padding: '1rem 2.5rem' }}>Upload More</Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard')} style={{ width: 'auto', padding: '1rem 2.5rem' }}>Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '850px' }}>
      <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <h1 className="gradient-text" style={{ fontSize: 'max(3.5rem, 5vw)', marginBottom: '1rem', fontWeight: 900, letterSpacing: '-0.06em' }}>Content Creator</h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.25rem', fontWeight: 500 }}>
          Share your academic materials and earn premium royalties.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        {/* Step 1: File Selection */}
        <section className="glass" style={{ borderRadius: '32px', padding: '3rem', marginBottom: '3rem' }}>
          <label style={labelStyle}>File Asset</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById('fileInput').click()}
            style={{
              padding: '4rem 2rem', textAlign: 'center', borderRadius: '24px', cursor: 'pointer',
              border: `2px dashed ${file ? 'var(--primary)' : 'var(--outline-variant)'}`,
              background: dragging ? 'var(--primary-container)' : 'rgba(255, 255, 255, 0.02)',
              transition: 'var(--transition-standard)'
            }}>
            <input id="fileInput" type="file" accept={ACCEPTED_TYPES} onChange={(e) => setFile(e.target.files[0])} style={{ display: 'none' }} />
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: file ? 1 : 0.5 }}>{file ? '✅' : '🚀'}</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{file ? file.name : 'Select or Drop File'}</h3>
            <p style={{ color: 'var(--outline)', fontSize: '0.9rem' }}>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOC, ZIP, MP4 · Max 50MB'}</p>
          </div>
        </section>

        {/* Step 2: Details */}
        <section className="glass" style={{ borderRadius: '32px', padding: '3.5rem', marginBottom: '3rem' }}>
          <Field label="Title">
            <Input required placeholder="e.g. Physics 101: Complete Lecture Notes" value={form.title} onChange={set('title')} />
          </Field>

          <Field label="Description">
            <textarea className="glass" style={{
              width: '100%', padding: '1.1rem 1.25rem', borderRadius: '14px',
              border: '1px solid var(--outline-variant)', background: 'var(--surface)',
              color: 'var(--on-surface)', fontFamily: 'var(--font-body)',
              minHeight: '120px', resize: 'vertical', outline: 'none'
            }} placeholder="What makes this resource valuable?" value={form.description} onChange={set('description')} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <Field label="Category">
              <select required className="glass" style={{
                width: '100%', padding: '1.1rem 1.25rem', borderRadius: '14px',
                border: '1px solid var(--outline-variant)', background: 'var(--surface)',
                color: 'var(--on-surface)', fontFamily: 'var(--font-body)',
                appearance: 'none', outline: 'none'
              }} value={form.category_id} onChange={set('category_id')}>
                <option value="" disabled>Select Segment</option>
                {categories.map(c => <option key={c.id} value={c.id} style={{ background: 'var(--surface)' }}>{c.icon} {c.name}</option>)}
              </select>
            </Field>
            <Field label="School">
              <Input placeholder="e.g. UNILAG" value={form.school} onChange={set('school')} />
            </Field>
          </div>
        </section>

        {/* Step 3: Monetization */}
        <section className="glass" style={{ borderRadius: '32px', padding: '3.5rem', marginBottom: '4rem' }}>
          <label style={labelStyle}>Monetization Engine</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            {['free', 'premium'].map(type => (
              <div key={type} onClick={() => setForm(f => ({ ...f, resource_type: type }))} style={{
                padding: '2.5rem', borderRadius: '24px', cursor: 'pointer', textAlign: 'center',
                border: `2px solid ${form.resource_type === type ? 'var(--primary)' : 'var(--outline-variant)'}`,
                background: form.resource_type === type ? 'var(--primary-container)' : 'var(--surface-variant)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{type === 'free' ? '🌿' : '💎'}</div>
                <h3 style={{ textTransform: 'capitalize', fontWeight: 800 }}>{type}</h3>
              </div>
            ))}
          </div>

          {form.resource_type === 'premium' && (
            <div className="animate-fade-in">
              <Field label="Market Price (₦)">
                <Input required type="number" min="100" placeholder="Minimum 100" value={form.price} onChange={set('price')} />
              </Field>
              <div style={{ background: 'var(--primary-container)', padding: '1.25rem', borderRadius: '16px', color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 600 }}>
                💰 Expected Royalty: <strong style={{ fontWeight: 900 }}>₦{Math.round((Number(form.price) || 0) * 0.7)}</strong> per download.
              </div>
            </div>
          )}
        </section>

        {/* Error Handling */}
        {error && <Banner type="error" msg={error} />}

        {/* Global Progress */}
        {uploading && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
              <span>ENCRYPTING & SYNCING...</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: '8px', background: 'var(--outline-variant)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.5s' }} />
            </div>
          </div>
        )}

        <Button type="submit" loading={uploading}>
          {uploading ? 'Deploying to network...' : 'Deploy Asset'}
        </Button>
      </form>
    </div>
  );
}
