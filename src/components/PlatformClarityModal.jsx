// src/components/PlatformClarityModal.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, BookOpenIcon, TrendingUpIcon } from './SharedUI';

/**
 * PlatformClarityModal
 * Provides 100% crystal-clear specification on HackMyDegree's dual-engine purpose:
 * Engine 1: Academic Excellence (Past questions, notes, DegreeAI, peer tutoring)
 * Engine 2: Student Financial Independence (Selling notes, paid peer tutoring, digital skills)
 */
export default function PlatformClarityModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'academics' | 'earnings' | 'faqs'

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.78)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'var(--surface, #12141A)',
        color: 'var(--on-surface, #F1F5F9)',
        border: '1px solid var(--outline-variant, rgba(255,255,255,0.12))',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '840px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 1.75rem 1.25rem',
          borderBottom: '1px solid var(--outline-variant, rgba(255,255,255,0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface-variant, rgba(255,255,255,0.02))'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: 'var(--primary, #D97706)',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '0.35rem'
            }}>
              <SparklesIcon size={14} color="var(--primary, #D97706)" />
              <span>Platform Clarity & Purpose</span>
            </div>
            <h2 style={{
              margin: 0,
              fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em'
            }}>
              What is <span style={{ color: 'var(--primary, #D97706)' }}>HackMyDegree</span>?
            </h2>
            <p style={{
              margin: '0.25rem 0 0',
              fontSize: '0.85rem',
              color: 'var(--on-surface-variant, #94A3B8)'
            }}>
              Understanding Nigeria's 1st Dual-Engine Student Platform: Academics × Student Financial Independence
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#FFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--outline-variant, rgba(255,255,255,0.08))',
          background: 'rgba(0,0,0,0.2)',
          padding: '0 1.25rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'overview', label: '1. The Dual Engine', icon: '⚡' },
            { id: 'academics', label: '2. Academic Engine', icon: '🎓' },
            { id: 'earnings', label: '3. Student Income Engine', icon: '💰' },
            { id: 'faqs', label: '4. Questions & Clarity', icon: '❓' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.9rem 1.15rem',
                border: 'none',
                background: 'transparent',
                color: activeTab === tab.id ? 'var(--primary, #D97706)' : 'var(--on-surface-variant, #94A3B8)',
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: '0.85rem',
                borderBottom: activeTab === tab.id ? '2.5px solid var(--primary, #D97706)' : '2.5px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div style={{
          padding: '1.75rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>

          {/* TAB 1: THE DUAL ENGINE (OVERVIEW) */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Executive Summary Callout */}
              <div style={{
                background: 'rgba(217, 119, 6, 0.08)',
                border: '1px solid rgba(217, 119, 6, 0.25)',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: 'var(--primary, #D97706)', fontSize: '1.1rem', fontWeight: 800 }}>
                  Why does HackMyDegree have both Academics and Money-Making?
                </h3>
                <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--on-surface, #F1F5F9)' }}>
                  Most Nigerian university students face a painful dilemma: <strong>study all day and stay broke</strong>, or <strong>hustle all day and get poor grades</strong>. 
                  HackMyDegree eliminates this compromise with a unified ecosystem: 
                  we give you the academic tools to <strong>graduate with a First-Class mind</strong>, and the monetization channels to <strong>graduate with a bank account</strong>.
                </p>
              </div>

              {/* Side-by-Side Dual Engine Visual */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.25rem'
              }}>
                {/* Engine 1 Card */}
                <div style={{
                  background: 'var(--surface-variant, rgba(255,255,255,0.03))',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  borderRadius: '18px',
                  padding: '1.4rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: 'rgba(37, 99, 235, 0.15)', color: '#3B82F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <BookOpenIcon size={20} color="#3B82F6" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase' }}>ENGINE 1</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>Academic Mastery</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--on-surface-variant, #94A3B8)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                    Pass your semester exams, licensing tests, and difficult courses with vetted study assets:
                  </p>

                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--on-surface, #F1F5F9)' }}>
                    <li><strong>Verified Past Questions</strong>: Solved with marking scheme rubrics.</li>
                    <li><strong>Lecture Notes & Handouts</strong>: Complete with authentic vector diagrams.</li>
                    <li><strong>DegreeAI Exam Copilot</strong>: 24/7 instant question solving & explanations.</li>
                    <li><strong>Peer Tutors</strong>: 1-on-1 mentorship from top seniors.</li>
                  </ul>

                  <button
                    onClick={() => setActiveTab('academics')}
                    style={{
                      marginTop: '1.25rem',
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(37, 99, 235, 0.15)',
                      color: '#60A5FA',
                      border: '1px solid rgba(37, 99, 235, 0.3)',
                      borderRadius: '100px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    View Academic Specifications →
                  </button>
                </div>

                {/* Engine 2 Card */}
                <div style={{
                  background: 'var(--surface-variant, rgba(255,255,255,0.03))',
                  border: '1px solid rgba(217, 119, 6, 0.3)',
                  borderRadius: '18px',
                  padding: '1.4rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: 'rgba(217, 119, 6, 0.15)', color: '#D97706',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <TrendingUpIcon size={20} color="#D97706" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase' }}>ENGINE 2</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>Financial Independence</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--on-surface-variant, #94A3B8)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                    Monetize your knowledge and build online income streams alongside your studies:
                  </p>

                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--on-surface, #F1F5F9)' }}>
                    <li><strong>Sell Your Notes</strong>: Upload summaries, set your ₦ price, earn on every download.</li>
                    <li><strong>Get Booked as a Tutor</strong>: Charge ₦1,500 – ₦5,000/hr tutoring peers.</li>
                    <li><strong>Affiliate Marketing</strong>: Earn 50%–60% commission promoting Selar courses.</li>
                    <li><strong>High-Income Digital Skills</strong>: AI Video, faceless YouTube & freelancing.</li>
                  </ul>

                  <button
                    onClick={() => setActiveTab('earnings')}
                    style={{
                      marginTop: '1.25rem',
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(217, 119, 6, 0.15)',
                      color: '#FBBF24',
                      border: '1px solid rgba(217, 119, 6, 0.3)',
                      borderRadius: '100px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    View Earning Specifications →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC ENGINE DETAILS */}
          {activeTab === 'academics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.2rem', fontWeight: 900 }}>
                  🎓 How to Study & Pass Exams on HackMyDegree
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--on-surface-variant, #94A3B8)', lineHeight: 1.5 }}>
                  HackMyDegree provides official Nigerian university syllabus coverage across Medicine, Nursing, Pharmacy, Engineering, Sciences, and Law.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {[
                  {
                    title: '1. Knowledge Bank & Reader',
                    badge: 'Interactive PDFs',
                    desc: 'Read authentic departmental handouts formatted with clean typography, page navigation, audio narration (text-to-speech), study flashcards, and vector diagrams (Vectors, Normal curves, Partographs, ADPIE cycles).'
                  },
                  {
                    title: '2. Past Questions with Rubrics',
                    badge: 'Model Solutions',
                    desc: 'Study over 10 years of semester exams with marking schemes that show you exactly how professors and licensing councils award marks in 15-mark essay questions.'
                  },
                  {
                    title: '3. DegreeAI Mock Exam Generator',
                    badge: 'AI Powered',
                    desc: 'Generate fresh 10-question multiple-choice and short-answer quizzes on any course module with instant scoring, feedback, and countdown exam timer.'
                  },
                  {
                    title: '4. Verified Peer Tutoring',
                    badge: '1-on-1 Mentorship',
                    desc: 'Connect with top-performing seniors in your department from UNILAG, UNIBEN, OAU, ABU, UI, and LASU for personalized exam prep and problem solving.'
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    background: 'var(--surface-variant, rgba(255,255,255,0.03))',
                    border: '1px solid var(--outline-variant, rgba(255,255,255,0.08))',
                    borderRadius: '14px',
                    padding: '1.15rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{item.title}</span>
                      <span style={{
                        background: 'rgba(37, 99, 235, 0.15)', color: '#60A5FA',
                        padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800
                      }}>
                        {item.badge}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--on-surface-variant, #94A3B8)', lineHeight: 1.5 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <Link to="/resources" onClick={onClose} style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'var(--primary, #D97706)', color: '#000', border: 'none',
                    borderRadius: '100px', padding: '0.75rem 1.6rem', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer'
                  }}>
                    Open Academic Vault →
                  </button>
                </Link>
                <Link to="/ai-assistant" onClick={onClose} style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'transparent', color: 'var(--on-surface, #FFF)',
                    border: '1px solid var(--outline-variant, rgba(255,255,255,0.2))',
                    borderRadius: '100px', padding: '0.75rem 1.6rem', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
                  }}>
                    Launch DegreeAI Workspace →
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 3: STUDENT INCOME ENGINE DETAILS */}
          {activeTab === 'earnings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.2rem', fontWeight: 900 }}>
                  💰 3 Verified Ways Students Earn on HackMyDegree
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--on-surface-variant, #94A3B8)', lineHeight: 1.5 }}>
                  You do not need capital to begin earning. You can monetize academic knowledge you already have, or learn high-income digital skills.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Method 1 */}
                <div style={{
                  background: 'var(--surface-variant, rgba(255,255,255,0.03))',
                  border: '1px solid rgba(217, 119, 6, 0.25)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: 'rgba(217, 119, 6, 0.15)', color: '#D97706',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', flexShrink: 0
                  }}>
                    📄
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem' }}>Method 1: Sell Your Lecture Notes & Summaries</span>
                      <span style={{ background: '#059669', color: '#FFF', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '100px' }}>Passive ₦ Payouts</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--on-surface-variant, #94A3B8)', lineHeight: 1.5 }}>
                      Did you write great revision notes, flashcards, or past question solutions? Upload them to HackMyDegree, set a price (e.g. ₦500 – ₦2,000), and receive direct payouts every time classmates across Nigeria download your pack.
                    </p>
                    <div style={{ marginTop: '0.75rem' }}>
                      <Link to="/upload" onClick={onClose} style={{ color: 'var(--primary, #D97706)', fontWeight: 800, fontSize: '0.82rem', textDecoration: 'none' }}>
                        Go to Upload & Pricing Studio →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Method 2 */}
                <div style={{
                  background: 'var(--surface-variant, rgba(255,255,255,0.03))',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: 'rgba(37, 99, 235, 0.15)', color: '#3B82F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', flexShrink: 0
                  }}>
                    👨‍🏫
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem' }}>Method 2: Become a Paid Peer Tutor</span>
                      <span style={{ background: '#2563EB', color: '#FFF', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '100px' }}>₦1,500 – ₦5,000 / hr</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--on-surface-variant, #94A3B8)', lineHeight: 1.5 }}>
                      If you scored an 'A' in courses like Anatomy, Organic Chemistry, Engineering Math, or Law, register as a peer tutor. Set your hourly rate, availability, and conduct Zoom/Google Meet tutoring sessions for junior undergraduates.
                    </p>
                    <div style={{ marginTop: '0.75rem' }}>
                      <Link to="/tutors" onClick={onClose} style={{ color: '#60A5FA', fontWeight: 800, fontSize: '0.82rem', textDecoration: 'none' }}>
                        Browse Tutors or Register as a Tutor →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Method 3 */}
                <div style={{
                  background: 'var(--surface-variant, rgba(255,255,255,0.03))',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.15)', color: '#10B981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', flexShrink: 0
                  }}>
                    🚀
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem' }}>Method 3: Digital Skills & Affiliate Tracks</span>
                      <span style={{ background: '#059669', color: '#FFF', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '100px' }}>50%–60% Selar Commissions</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--on-surface-variant, #94A3B8)', lineHeight: 1.5 }}>
                      Through our partnership with Selar Academy, master in-demand digital disciplines: Affiliate Marketing, AI Video Creation, Faceless YouTube Channels, and Freelancing to land remote gigs and earn steady cash flow on campus.
                    </p>
                    <div style={{ marginTop: '0.75rem' }}>
                      <Link to="/skills" onClick={onClose} style={{ color: '#34D399', fontWeight: 800, fontSize: '0.82rem', textDecoration: 'none' }}>
                        Explore Skills Tracks & Selar Academy →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FREQUENTLY ASKED QUESTIONS & CLARITY */}
          {activeTab === 'faqs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.15rem', fontWeight: 900 }}>
                  Frequently Asked Questions on App Specification
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--on-surface-variant, #94A3B8)' }}>
                  Clear, transparent answers for students, parents, and peer creators.
                </p>
              </div>

              {[
                {
                  q: 'Is HackMyDegree strictly an academic study app or an online income platform?',
                  a: 'It is intentionally both. We believe academic excellence and financial literacy must go hand-in-hand for African undergraduates. You can use HackMyDegree 100% strictly for studying (accessing past questions, lecture handouts, DegreeAI exam prep) — OR you can also use it to earn money (selling your study notes, tutoring peers, or learning digital income skills).'
                },
                {
                  q: 'Do I have to pay to use HackMyDegree to study?',
                  a: 'No! Foundational lecture handouts, curriculum syllabus matrices, vector diagrams, and many past questions are 100% free in our open Knowledge Bank. Advanced premium summary packs or 1-on-1 private tutoring sessions are priced affordably by student creators.'
                },
                {
                  q: 'How do I withdraw money earned from selling notes or tutoring?',
                  a: 'Earnings are credited directly to your creator balance. You can withdraw directly into any Nigerian commercial bank account (GTBank, Access, Zenith, OPay, PalmPay, Kuda) with instant settlement.'
                },
                {
                  q: 'Who creates the notes and past question solutions?',
                  a: 'Materials are authored by top-performing Nigerian university students, departmental scholars, and verified subject matter experts across accredited universities (NUC standard compliant).'
                },
                {
                  q: 'How does DegreeAI work?',
                  a: 'DegreeAI is trained on Nigerian university course outlines and exam structures. You can paste any past question, assignment, or complex theory to receive a step-by-step model answer, marking rubric breakdown, or a custom 10-question mock test.'
                }
              ].map((faq, idx) => (
                <div key={idx} style={{
                  background: 'var(--surface-variant, rgba(255,255,255,0.03))',
                  border: '1px solid var(--outline-variant, rgba(255,255,255,0.08))',
                  borderRadius: '14px',
                  padding: '1.15rem'
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--on-surface, #FFF)', marginBottom: '0.4rem' }}>
                    {faq.q}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--on-surface-variant, #94A3B8)', lineHeight: 1.55 }}>
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid var(--outline-variant, rgba(255,255,255,0.08))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--surface-variant, rgba(255,255,255,0.02))',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant, #94A3B8)' }}>
            💡 Tip: Choose your path today — study for exams, earn as a creator, or do both.
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--primary, #D97706)',
              color: '#000',
              border: 'none',
              borderRadius: '100px',
              padding: '0.55rem 1.5rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Got It, Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
}
