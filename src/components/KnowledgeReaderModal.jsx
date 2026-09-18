// src/components/KnowledgeReaderModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { payForProSubscription } from '../lib/paystack';
import { useToast } from '../contexts/ToastContext';

export default function KnowledgeReaderModal({ course, isOpen, onClose, user, profile, onProActivated }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [upgrading, setUpgrading] = useState(false);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'topics', 'practice'

  if (!isOpen || !course) return null;

  const isPro = Boolean(profile?.is_pro);
  const activeDoc = course.documents?.[activeDocIndex] || course.documents?.[0];

  const handleUpgrade = async () => {
    if (!user) {
      onClose();
      navigate('/login');
      return;
    }

    setUpgrading(true);
    await payForProSubscription({
      user: { id: user.id, email: user.email },
      onSuccess: async () => {
        setUpgrading(false);
        showToast('🎉 Welcome to PRO! Knowledge Bank unlocked.', 'success');
        if (onProActivated) await onProActivated();
      },
      onClose: () => {
        setUpgrading(false);
      }
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(5, 5, 5, 0.88)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(0.5rem, 2vw, 1.5rem)'
    }} onClick={onClose}>
      <div style={{
        background: '#121316', color: '#FFFFFF',
        border: '1px solid rgba(201, 150, 62, 0.25)',
        borderRadius: '20px', width: '100%', maxWidth: '1050px',
        maxHeight: '92vh', overflow: 'hidden', display: 'flex',
        flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
        animation: 'fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }} onClick={e => e.stopPropagation()}>

        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(201,150,62,0.08) 0%, rgba(18,19,22,1) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '1.75rem' }}>{course.icon || '📚'}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                  background: '#C9963E', color: '#000000', fontWeight: 900,
                  fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '6px',
                  letterSpacing: '0.04em'
                }}>
                  {course.course_code}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#A0A0A0', fontWeight: 600 }}>
                  {course.level} • {course.semester}
                </span>
                {isPro ? (
                  <span style={{
                    background: 'rgba(0, 200, 83, 0.15)', color: '#00E676',
                    fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '100px',
                    fontWeight: 800, border: '1px solid rgba(0, 230, 118, 0.3)'
                  }}>
                    PRO UNLOCKED
                  </span>
                ) : (
                  <span style={{
                    background: 'rgba(201, 150, 62, 0.15)', color: '#E5B158',
                    fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '100px',
                    fontWeight: 800, border: '1px solid rgba(201, 150, 62, 0.3)'
                  }}>
                    🔒 PRO ONLY
                  </span>
                )}
              </div>
              <h2 style={{
                margin: '0.25rem 0 0 0', fontSize: '1.15rem', fontWeight: 800,
                letterSpacing: '-0.02em', color: '#FFFFFF'
              }}>
                {course.title}
              </h2>
            </div>
          </div>

          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: 'none', color: '#CCCCCC',
            width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
            fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s'
          }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        {!isPro ? (
          /* ─── LOCKED PRO PAYWALL SCREEN ─── */
          <div style={{
            padding: ' clamp(1.5rem, 4vw, 3rem)', textAlign: 'center', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(201,150,62,0.2) 0%, rgba(201,150,62,0.05) 100%)',
              border: '1px solid rgba(201,150,62,0.4)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
              marginBottom: '1.25rem', boxShadow: '0 0 25px rgba(201,150,62,0.15)'
            }}>
              🔒
            </div>

            <span style={{
              color: '#C9963E', fontWeight: 800, letterSpacing: '0.08em',
              fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem'
            }}>
              HackMyDegree Pro Exclusive
            </span>

            <h3 style={{
              fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: 800,
              letterSpacing: '-0.03em', margin: '0 0 0.75rem 0', maxWidth: '620px'
            }}>
              Unlock Verified Lecture Notes, Outlines & Past Questions
            </h3>

            <p style={{
              color: '#A5A5A5', maxWidth: '560px', margin: '0 0 2rem 0',
              fontSize: '0.95rem', lineHeight: 1.6
            }}>
              The <strong>ChongPQ Knowledge Bank</strong> is protected and accessible exclusively to Pro members for on-site studying. Upgrade now to read all 100L–500L materials directly in your browser.
            </p>

            {/* Course Summary Pill Cards (Teaser) */}
            <div style={{
              display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center',
              maxWidth: '650px', marginBottom: '2rem'
            }}>
              {course.topics?.slice(0, 4).map((topic, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '100px', padding: '0.5rem 1rem', fontSize: '0.85rem',
                  color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <span style={{ color: '#C9963E' }}>✓</span> {topic}
                </div>
              ))}
              {course.documents?.length > 0 && (
                <div style={{
                  background: 'rgba(201,150,62,0.08)', border: '1px solid rgba(201,150,62,0.3)',
                  borderRadius: '100px', padding: '0.5rem 1rem', fontSize: '0.85rem',
                  color: '#C9963E', fontWeight: 700
                }}>
                  + {course.documents.length} Complete Study Documents
                </div>
              )}
            </div>

            {/* Upgrade CTA Box */}
            <div style={{
              background: 'linear-gradient(180deg, rgba(201,150,62,0.12) 0%, rgba(201,150,62,0.03) 100%)',
              border: '1px solid rgba(201,150,62,0.35)', borderRadius: '16px',
              padding: '1.5rem 2rem', maxWidth: '500px', width: '100%',
              display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#C9963E' }}>₦500</span>
                <span style={{ color: '#A0A0A0', fontSize: '0.9rem' }}>/ month</span>
              </div>

              <ul style={{
                textAlign: 'left', listStyle: 'none', padding: 0, margin: 0,
                fontSize: '0.88rem', color: '#CCCCCC', display: 'flex', flexDirection: 'column', gap: '0.5rem'
              }}>
                <li>⚡ <strong>Full On-Site Reader</strong>: All 100L–500L lecture notes</li>
                <li>🎯 <strong>Past Questions Bank</strong> with verified solutions</li>
                <li>🤖 <strong>Unlimited DegreeAI</strong> homework & study tutoring</li>
                <li>🚫 <strong>Ad-free experience</strong> across the entire site</li>
              </ul>

              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                style={{
                  width: '100%', padding: '0.95rem 1.5rem', borderRadius: '100px',
                  background: 'linear-gradient(135deg, #C9963E 0%, #A67628 100%)',
                  color: '#000000', border: 'none', fontWeight: 800, fontSize: '1rem',
                  cursor: upgrading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-header)',
                  boxShadow: '0 8px 25px rgba(201,150,62,0.3)', transition: 'all 0.2s',
                  marginTop: '0.5rem'
                }}
                onMouseEnter={e => !upgrading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => !upgrading && (e.currentTarget.style.transform = 'translateY(0)')}>
                {upgrading ? 'Connecting to Paystack...' : '⚡ Unlock Knowledge Bank — ₦500/mo'}
              </button>

              <span style={{ fontSize: '0.75rem', color: '#777777' }}>
                Secure Paystack Payment • Cancel anytime from your dashboard
              </span>
            </div>
          </div>
        ) : (
          /* ─── PRO ON-SITE READER SCREEN ─── */
          <div style={{ display: 'flex', flex: 1, minHeight: '520px', overflow: 'hidden' }}>
            {/* Sidebar / Document Navigation */}
            <div style={{
              width: '290px', borderRight: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.015)', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{
                padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', gap: '0.5rem'
              }}>
                <button
                  onClick={() => setActiveTab('notes')}
                  style={{
                    flex: 1, padding: '0.45rem 0.5rem', borderRadius: '8px', border: 'none',
                    background: activeTab === 'notes' ? 'rgba(201,150,62,0.18)' : 'transparent',
                    color: activeTab === 'notes' ? '#C9963E' : '#888888',
                    fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer'
                  }}>
                  Documents ({course.documents?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('topics')}
                  style={{
                    flex: 1, padding: '0.45rem 0.5rem', borderRadius: '8px', border: 'none',
                    background: activeTab === 'topics' ? 'rgba(201,150,62,0.18)' : 'transparent',
                    color: activeTab === 'topics' ? '#C9963E' : '#888888',
                    fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer'
                  }}>
                  Syllabus
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
                {activeTab === 'notes' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {course.documents?.map((doc, idx) => (
                      <div
                        key={doc.id || idx}
                        onClick={() => setActiveDocIndex(idx)}
                        style={{
                          padding: '0.75rem 0.9rem', borderRadius: '10px', cursor: 'pointer',
                          background: activeDocIndex === idx ? 'rgba(201,150,62,0.12)' : 'rgba(255,255,255,0.02)',
                          border: activeDocIndex === idx ? '1px solid rgba(201,150,62,0.35)' : '1px solid rgba(255,255,255,0.04)',
                          transition: 'all 0.15s ease'
                        }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                          <span style={{
                            background: doc.format === 'PDF' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            color: doc.format === 'PDF' ? '#F87171' : '#60A5FA',
                            fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px'
                          }}>
                            {doc.format}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#777777' }}>{doc.pages} pages</span>
                        </div>
                        <div style={{
                          fontSize: '0.84rem', fontWeight: activeDocIndex === idx ? 700 : 500,
                          color: activeDocIndex === idx ? '#FFFFFF' : '#B5B5B5', lineHeight: 1.35
                        }}>
                          {doc.title}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'topics' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {course.topics?.map((topic, i) => (
                      <div key={i} style={{
                        padding: '0.7rem 0.85rem', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                        fontSize: '0.82rem', color: '#CCCCCC', display: 'flex', gap: '0.5rem'
                      }}>
                        <span style={{ color: '#C9963E', fontWeight: 800 }}>{i + 1}.</span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* In-Reader AI Assistant Link */}
              <div style={{
                padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(201,150,62,0.04)'
              }}>
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/ai?q=Explain ${encodeURIComponent(course.course_code)}: ${encodeURIComponent(course.topics?.[0] || course.title)}`);
                  }}
                  style={{
                    width: '100%', padding: '0.65rem 1rem', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}>
                  <span>🤖</span> Ask DegreeAI about {course.course_code}
                </button>
              </div>
            </div>

            {/* Main Reading Canvas */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <div style={{
                padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(0,0,0,0.2)'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    On-Site Reader • {course.department}
                  </span>
                  <h4 style={{ margin: '0.15rem 0 0 0', fontSize: '1rem', color: '#FFFFFF', fontWeight: 700 }}>
                    {activeDoc?.title || course.title}
                  </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.75rem', color: '#C9963E', background: 'rgba(201,150,62,0.1)',
                    padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 600
                  }}>
                    🛡️ On-Site Study Protected
                  </span>
                </div>
              </div>

              {/* Reader View Content */}
              <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                <div style={{
                  maxWidth: '740px', margin: '0 auto', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px',
                  padding: '2rem', lineHeight: 1.7
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: '#C9963E', fontWeight: 700 }}>
                      Course Module: {course.course_code}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#777777' }}>
                      Verified ChongPQ Study Bank
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#FFFFFF' }}>
                    {activeDoc?.title}
                  </h3>

                  <p style={{ color: '#C5C5C5', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                    This module covers core curriculum requirements for Nigerian universities. Study through the topics below, follow the referenced lecture outlines, and practice with past questions:
                  </p>

                  <div style={{
                    background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1.25rem',
                    border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.75rem'
                  }}>
                    <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#E5B158', fontWeight: 700 }}>
                      📌 Key Focus Areas in this Document:
                    </h5>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#D4D4D4', fontSize: '0.88rem' }}>
                      {course.topics?.map((topic, i) => (
                        <li key={i} style={{ marginBottom: '0.4rem' }}>{topic}</li>
                      ))}
                    </ul>
                  </div>

                  {course.has_past_questions && (
                    <div style={{
                      background: 'rgba(201,150,62,0.06)', borderRadius: '12px', padding: '1.25rem',
                      border: '1px solid rgba(201,150,62,0.2)', marginBottom: '1.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>📝</span>
                        <h5 style={{ margin: 0, fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700 }}>
                          Past Question Bank Included
                        </h5>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#B0B0B0' }}>
                        Exam solutions and marking guide principles are included in this course file. Use DegreeAI to test your understanding of each year's questions.
                      </p>
                    </div>
                  )}

                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '2rem'
                  }}>
                    <button
                      disabled={activeDocIndex === 0}
                      onClick={() => setActiveDocIndex(i => Math.max(0, i - 1))}
                      style={{
                        padding: '0.6rem 1.2rem', borderRadius: '8px',
                        background: activeDocIndex === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)',
                        color: activeDocIndex === 0 ? '#555555' : '#FFFFFF',
                        border: 'none', cursor: activeDocIndex === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem', fontWeight: 600
                      }}>
                      ← Previous Document
                    </button>
                    <span style={{ fontSize: '0.82rem', color: '#777777' }}>
                      Doc {activeDocIndex + 1} of {course.documents?.length || 1}
                    </span>
                    <button
                      disabled={activeDocIndex >= (course.documents?.length || 1) - 1}
                      onClick={() => setActiveDocIndex(i => Math.min((course.documents?.length || 1) - 1, i + 1))}
                      style={{
                        padding: '0.6rem 1.2rem', borderRadius: '8px',
                        background: activeDocIndex >= (course.documents?.length || 1) - 1 ? 'rgba(255,255,255,0.02)' : '#C9963E',
                        color: activeDocIndex >= (course.documents?.length || 1) - 1 ? '#555555' : '#000000',
                        border: 'none', cursor: activeDocIndex >= (course.documents?.length || 1) - 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem', fontWeight: 700
                      }}>
                      Next Document →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
