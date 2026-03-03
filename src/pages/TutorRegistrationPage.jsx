// src/pages/TutorRegistrationPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { createTutorProfile } from '../lib/supabase';
import { Button, Field, Input, Banner } from '../components/SharedUI';

export default function TutorRegistrationPage() {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        bio: '',
        hourly_rate: 1500,
        subjects: '' // Will be split by comma
    });

    const handleChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            const subjectsArray = form.subjects.split(',').map(s => s.trim()).filter(s => s.length > 0);
            if (subjectsArray.length === 0) throw new Error('Please list at least one subject (e.g. MTH101)');
            if (form.bio.length < 50) throw new Error('Bio must be at least 50 characters to attract students.');

            const { error: tutorError } = await createTutorProfile(user.id, {
                bio: form.bio,
                hourly_rate: parseInt(form.hourly_rate),
                subjects: subjectsArray,
                is_available: false // Set to false for moderation
            });

            if (tutorError) throw tutorError;

            await refreshProfile();
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ maxWidth: 600, margin: '10rem auto', textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h1 style={{ fontFamily: 'var(--font-header)', fontWeight: 800 }}>Application Successful!</h1>
                <p style={{ color: 'var(--on-surface-variant)' }}>You are now part of the Elite Tutor network. Redirecting to your dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontFamily: 'var(--font-header)', fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 1rem' }}>
                    Join the Elite Network 👨‍🏫
                </h1>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.2rem', fontWeight: 500 }}>
                    Help your peers ace their exams and earn competitive rates while doing it.
                </p>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--outline-variant)', borderRadius: 24, padding: '2.5rem' }}>
                {error && <Banner type="error" msg={error} />}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Field label="Hourly Rate (₦)" helper="Set your preferred rate per hour">
                            <Input
                                type="number"
                                min="1000"
                                step="500"
                                value={form.hourly_rate}
                                onChange={handleChange('hourly_rate')}
                                required
                            />
                        </Field>
                        <Field label="Subjects" helper="Comma separated (e.g. MTH101, GST102)">
                            <Input
                                placeholder="E.g. ACC101, LAW204"
                                value={form.subjects}
                                onChange={handleChange('subjects')}
                                required
                            />
                        </Field>
                    </div>

                    <Field label="Professional Bio" helper="Tell students about your expertise and grades (Min 50 chars)">
                        <textarea
                            style={{
                                width: '100%', minHeight: '150px', background: 'var(--surface-variant)',
                                border: '1px solid var(--outline-variant)', borderRadius: '12px', padding: '1rem',
                                color: 'var(--on-surface)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none'
                            }}
                            placeholder="I am a 400L student with a 4.5 CGPA in Mechanical Engineering..."
                            value={form.bio}
                            onChange={handleChange('bio')}
                            required
                        />
                    </Field>



                    <div style={{ paddingTop: '1rem' }}>
                        <Button type="submit" loading={loading} style={{ height: '56px', fontSize: '1.1rem' }}>
                            Submit Tutor Application
                        </Button>
                        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginTop: '1.5rem' }}>
                            By submitting, you agree to our Tutor Standards and Conduct Policy.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
