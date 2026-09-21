// src/components/KnowledgeReaderModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { payForProSubscription } from '../lib/paystack';
import { useToast } from '../contexts/ToastContext';
import { generateFullNoteContent } from '../data/knowledgeNotesContent';
import NoteDiagramRenderer from './NoteDiagramRenderer';
import { generate10QuestionExam } from '../lib/examGenerator';

export default function KnowledgeReaderModal({ course, isOpen, onClose, user, profile, onProActivated }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [upgrading, setUpgrading] = useState(false);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf', 'flashcards', 'quiz'
  const [paperTheme, setPaperTheme] = useState('light'); // 'light', 'sepia', 'dark'
  const [zoomLevel, setZoomLevel] = useState(100); // 85, 100, 115
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0); // 0.8, 1.0, 1.2, 1.5

  // Responsive mobile states
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sticky Study Notes & Scratchpad
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [stickyNotes, setStickyNotes] = useState('');

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState(new Set());

  // Quiz state
  const [customQuestions, setCustomQuestions] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Bookmarking state
  const [isBookmarked, setIsBookmarked] = useState(false);

  const printRef = useRef(null);

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timerSeconds > 0 && !quizSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds(sec => {
          if (sec <= 1) {
            setQuizSubmitted(true);
            setIsTimerActive(false);
            showToast('⏰ Time up! Your mock exam has been submitted.', 'info');
            return 0;
          }
          return sec - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds, quizSubmitted, showToast]);

  // Reset active document index and reader states when switching courses or opening
  useEffect(() => {
    setActiveDocIndex(0);
    setActiveTab('pdf');
    printRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSpeaking(false);
    setIsNotesOpen(false);
    setMobileModulesOpen(false);
    setMobileToolsOpen(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [course?.id, isOpen]);

  useEffect(() => {
    if (course && activeDocIndex !== undefined) {
      const saved = localStorage.getItem(`hmd_bookmark_${course.id}_${activeDocIndex}`);
      setIsBookmarked(Boolean(saved));
      const savedNotes = localStorage.getItem(`hmd_notes_${course.id}_${activeDocIndex}`) || '';
      setStickyNotes(savedNotes);
      setCardIndex(0);
      setIsFlipped(false);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setCustomQuestions(null);
      setTimerSeconds(600);
      setIsTimerActive(false);
      setIsSpeaking(false);
      setMobileModulesOpen(false);
      setMobileToolsOpen(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [course, activeDocIndex]);

  if (!isOpen || !course) return null;

  const isPro = Boolean(profile?.is_pro);
  const activeDoc = course.documents?.[activeDocIndex] || course.documents?.[0] || {
    id: 'doc-1',
    title: course.title,
    format: 'PDF',
    pages: 35
  };

  const pdfData = generateFullNoteContent(course, activeDoc, activeDocIndex);
  const currentDocTopic = pdfData.cleanTopic || activeDoc.title.replace(/^.*?- /, '');

  const flashcards = [
    {
      front: `Core Concept: ${currentDocTopic}`,
      back: pdfData.overview || `Essential foundational mechanism and academic guidelines for ${course.course_code}.`
    },
    {
      front: `Primary Learning Outcome (${course.course_code})`,
      back: `Master baseline definitions, theoretical principles, and analytical methodologies governing ${currentDocTopic} in compliance with university standards.`
    },
    {
      front: `Standard Methodological Protocol (${course.course_code})`,
      back: `1. Baseline Assessment -> 2. Differential/Theoretical Evaluation -> 3. Protocol Execution -> 4. Continuous Monitoring & Documentation.`
    },
    {
      front: `High-Yield Board Exam Takeaway (${course.course_code})`,
      back: `Always establish verified baseline metrics and adhere strictly to standard nomenclature and units when answering 15-mark questions on ${currentDocTopic}.`
    }
  ];

  const quizQuestions = [
    {
      id: 'q1',
      question: `In studying ${currentDocTopic} for ${course.course_code}, what is the mandatory first step before executing standard protocols?`,
      options: [
        'Skip documentation and begin immediately',
        'Establish and verify comprehensive baseline diagnostic and operational metrics',
        'Apply aggressive secondary interventions without screening',
        'Discontinue all regulatory feedback monitoring'
      ],
      correct: 1,
      explanation: `Establishing verified baseline parameters is critical before administering management or formulating solutions in ${currentDocTopic}.`
    },
    {
      id: 'q2',
      question: `What distinguishes primary mechanisms from secondary compensatory adaptations in ${currentDocTopic}?`,
      options: [
        'Primary mechanisms establish initial functional equilibrium, whereas secondary adaptations are triggered to offset systemic stress',
        'There is no theoretical or operational difference',
        'Secondary adaptations only occur in simulated environments',
        'Primary mechanisms are entirely random'
      ],
      correct: 0,
      explanation: `Primary mechanisms govern baseline equilibrium, while secondary adaptations compensate when regulatory limits are altered in ${currentDocTopic}.`
    },
    {
      id: 'q3',
      question: `How must calculations, formulas, and findings in ${currentDocTopic} be documented for university and board exam grading?`,
      options: [
        'Informally without explicit units',
        'Using standardized academic nomenclature with explicit SI units and step-by-step justification',
        'Only through verbal summaries',
        'Omitting intermediate derivations'
      ],
      correct: 1,
      explanation: `Accurate standardized documentation with verified units is a mandatory requirement under university and board exam marking schemes.`
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleSaveNotes = (val) => {
    setStickyNotes(val);
    localStorage.setItem(`hmd_notes_${course.id}_${activeDocIndex}`, val);
  };

  const handleDownloadStudySheet = () => {
    let sectionsText = '';
    pdfData.pages.forEach(p => {
      sectionsText += `\n\n-----------------------------------------------------\n${p.sectionTitle.toUpperCase()}\n-----------------------------------------------------\n\n`;
      p.contentBlocks.forEach(b => {
        if (b.type === 'metadata_box') {
          Object.entries(b.data).forEach(([k, v]) => {
            sectionsText += `${k}: ${v}\n`;
          });
        } else if (b.type === 'heading') {
          sectionsText += `\n### ${b.text}\n`;
        } else if (b.type === 'paragraph') {
          sectionsText += `${b.text}\n\n`;
        } else if (b.type === 'callout_box') {
          sectionsText += `[${b.title}]\n${b.text}\n\n`;
        } else if (b.type === 'list') {
          b.items.forEach(it => { sectionsText += `• ${it}\n`; });
          sectionsText += '\n';
        } else if (b.type === 'numbered_list') {
          b.items.forEach((it, idx) => { sectionsText += `${idx + 1}. ${it}\n`; });
          sectionsText += '\n';
        } else if (b.type === 'table') {
          sectionsText += b.headers.join(' | ') + '\n';
          sectionsText += b.headers.map(() => '---').join(' | ') + '\n';
          b.rows.forEach(r => {
            sectionsText += r.join(' | ') + '\n';
          });
          sectionsText += '\n';
        } else if (b.type === 'pearls_list') {
          b.items.forEach(it => { sectionsText += `★ ${it}\n`; });
          sectionsText += '\n';
        } else if (b.type === 'qa_box') {
          sectionsText += `\n[${b.questionNumber}]\nQUESTION:\n${b.question}\n\n${b.modelAnswer}\n\n`;
        }
      });
    });

    const content = `=====================================================
HACKMYDEGREE OFFICIAL ACADEMIC LECTURE HANDOUT
Course Code: ${course.course_code}
Course Title: ${course.title}
Module ${activeDocIndex + 1}: ${activeDoc.title}
Faculty: ${pdfData.faculty}
Department: ${pdfData.department}
Level / Semester: ${course.level} • ${course.semester}
Accreditation: Accredited NUC / BMAS Benchmark Curriculum
=====================================================
${sectionsText}
=====================================================
Official Academic Study Pack • HackMyDegree Repository
All Rights Reserved
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${course.course_code}_Module_${activeDocIndex + 1}_${currentDocTopic.replace(/[^a-zA-Z0-9]/g, '_')}_Official_Notes.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📥 Complete authentic lecture notes downloaded!', 'success');
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech is not supported on this browser.', 'info');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      showToast('Audio playback stopped', 'info');
    } else {
      let speechParts = [
        `Now reading lecture handout for ${pdfData.courseCode}: ${pdfData.courseTitle}.`,
        `Module: ${activeDoc.title}.`,
        `Overview: ${pdfData.overview}.`
      ];

      const page2 = pdfData.pages[1];
      if (page2) {
        page2.contentBlocks.forEach(b => {
          if (b.type === 'callout_box' || b.type === 'paragraph') {
            speechParts.push(b.text);
          }
        });
      }

      const page4 = pdfData.pages[3];
      if (page4) {
        speechParts.push('Key examination pearls:');
        const pearls = page4.contentBlocks.find(b => b.type === 'pearls_list')?.items || [];
        pearls.slice(0, 4).forEach(p => speechParts.push(p));
      }

      const fullSpeechText = speechParts.join(' ');
      const utterance = new SpeechSynthesisUtterance(fullSpeechText);
      utterance.rate = speechRate;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      showToast(`🔊 Reading lecture note at ${speechRate}x speed...`, 'info');
    }
  };

  const handleToggleBookmark = () => {
    const key = `hmd_bookmark_${course.id}_${activeDocIndex}`;
    if (isBookmarked) {
      localStorage.removeItem(key);
      setIsBookmarked(false);
      showToast('Bookmark removed', 'info');
    } else {
      localStorage.setItem(key, JSON.stringify({
        courseId: course.id,
        courseCode: course.course_code,
        title: activeDoc.title,
        date: new Date().toISOString()
      }));
      setIsBookmarked(true);
      showToast('⭐ Lecture note PDF bookmarked!', 'success');
    }
  };

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
        showToast('🎉 Welcome to PRO! Unlimited downloads & AI tutoring unlocked.', 'success');
        if (onProActivated) await onProActivated();
      },
      onClose: () => {
        setUpgrading(false);
      }
    });
  };

  const calculateQuizScore = () => {
    let score = 0;
    const questions = customQuestions || quizQuestions;
    questions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) score++;
    });
    return score;
  };

  // Render an individual content block within the handout
  const renderBlock = (block, bIdx, theme) => {
    const isDark = paperTheme === 'dark';
    const isSepia = paperTheme === 'sepia';
    const isLight = paperTheme === 'light';

    if (block.type === 'metadata_box') {
      return (
        <div key={bIdx} style={{
          background: theme.sheetBoxBg,
          border: `1px solid ${theme.sheetBorder}`,
          borderRadius: '8px',
          padding: isMobile ? '0.85rem' : '1.25rem',
          marginBottom: isMobile ? '1rem' : '1.5rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: isMobile ? '0.5rem' : '0.75rem',
            fontSize: isMobile ? '0.8rem' : '0.84rem'
          }}>
            {Object.entries(block.data).map(([k, v], idx) => (
              <div key={idx}>
                <span style={{ color: theme.sheetTextMuted, fontWeight: 600, display: 'block', fontSize: isMobile ? '0.7rem' : '0.74rem', textTransform: 'uppercase' }}>
                  {k}:
                </span>
                <span style={{ color: theme.sheetHeaderColor, fontWeight: 700, wordBreak: 'break-word' }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === 'heading') {
      return (
        <h3 key={bIdx} style={{
          fontSize: isMobile ? '1.02rem' : '1.18rem',
          fontWeight: 800,
          color: theme.sheetHeaderColor,
          margin: isMobile ? '1.25rem 0 0.5rem 0' : '1.75rem 0 0.75rem 0',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1.35
        }}>
          {block.text}
        </h3>
      );
    }

    if (block.type === 'paragraph') {
      return (
        <p key={bIdx} style={{
          margin: '0 0 1.15rem 0',
          color: theme.sheetColor,
          textAlign: isMobile ? 'left' : 'justify',
          wordBreak: 'break-word',
          lineHeight: isMobile ? 1.65 : 1.8
        }}>
          {block.text}
        </p>
      );
    }

    if (block.type === 'callout_box') {
      return (
        <div key={bIdx} style={{
          background: theme.sheetCalloutBg,
          borderLeft: `4px solid ${theme.sheetCalloutBorder}`,
          borderRadius: '0 8px 8px 0',
          padding: isMobile ? '0.85rem 1rem' : '1.15rem 1.35rem',
          margin: isMobile ? '1rem 0 1.25rem 0' : '1.35rem 0 1.5rem 0',
          fontStyle: 'italic',
          color: theme.sheetCalloutText,
          wordBreak: 'break-word'
        }}>
          <div style={{ fontWeight: 800, fontStyle: 'normal', marginBottom: '0.35rem', fontSize: '0.85rem', fontFamily: 'system-ui' }}>
            {block.title}
          </div>
          <div style={{ lineHeight: 1.65 }}>{block.text}</div>
        </div>
      );
    }

    if (block.type === 'list') {
      return (
        <ul key={bIdx} style={{ margin: '0 0 1.35rem 0', paddingLeft: isMobile ? '1.2rem' : '1.6rem', color: theme.sheetColor }}>
          {block.items.map((it, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem', wordBreak: 'break-word', lineHeight: 1.6 }}>{it}</li>
          ))}
        </ul>
      );
    }

    if (block.type === 'numbered_list') {
      return (
        <ol key={bIdx} style={{ margin: '0 0 1.35rem 0', paddingLeft: isMobile ? '1.2rem' : '1.6rem', color: theme.sheetColor }}>
          {block.items.map((it, idx) => (
            <li key={idx} style={{ marginBottom: '0.65rem', wordBreak: 'break-word', lineHeight: 1.6 }}>{it}</li>
          ))}
        </ol>
      );
    }

    if (block.type === 'syllabus_grid') {
      return (
        <div key={bIdx} style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '0.6rem', margin: '0.85rem 0 1.35rem 0', fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {block.topics.map((t, idx) => (
            <div key={idx} style={{
              background: theme.sheetBoxBg,
              border: `1px solid ${theme.sheetBorder}`,
              borderRadius: '6px', padding: '0.6rem 0.8rem', fontSize: isMobile ? '0.78rem' : '0.84rem',
              display: 'flex', gap: '0.5rem', alignItems: 'center'
            }}>
              <span style={{ fontWeight: 900, color: '#D97706', flexShrink: 0 }}>Unit {idx + 1}:</span>
              <span style={{ color: theme.sheetHeaderColor, fontWeight: 600 }}>{t}</span>
            </div>
          ))}
        </div>
      );
    }

    if (block.type === 'diagram') {
      return (
        <NoteDiagramRenderer
          key={bIdx}
          diagram={block}
          isLight={!isDark}
        />
      );
    }

    if (block.type === 'table') {
      return (
        <div key={bIdx} style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          margin: '1.35rem 0',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          border: `1px solid ${theme.sheetBorder}`,
          borderRadius: '8px'
        }}>
          <table style={{
            width: '100%',
            minWidth: isMobile ? '480px' : '100%',
            borderCollapse: 'collapse',
            fontSize: isMobile ? '0.78rem' : '0.84rem'
          }}>
            <thead>
              <tr style={{ background: theme.sheetBoxBg, borderBottom: `2px solid ${theme.sheetBorder}` }}>
                {block.headers.map((h, idx) => (
                  <th key={idx} style={{
                    padding: isMobile ? '0.6rem 0.75rem' : '0.75rem 1rem',
                    textAlign: 'left', fontWeight: 800,
                    color: theme.sheetHeaderColor,
                    whiteSpace: 'nowrap'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, rIdx) => (
                <tr key={rIdx} style={{
                  borderBottom: `1px solid ${theme.sheetSubtleBorder}`,
                  background: rIdx % 2 === 0 ? 'transparent' : theme.sheetBoxBg
                }}>
                  {r.map((cell, cIdx) => (
                    <td key={cIdx} style={{
                      padding: isMobile ? '0.55rem 0.75rem' : '0.65rem 1rem',
                      color: cIdx === 0 ? theme.sheetHeaderColor : theme.sheetColor,
                      fontWeight: cIdx === 0 ? 700 : 400,
                      lineHeight: 1.55
                    }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {isMobile && (
            <div style={{ padding: '0.35rem 0.65rem', fontSize: '0.68rem', color: theme.sheetTextMuted, textAlign: 'right', background: theme.sheetBoxBg }}>
              👉 Swipe table horizontally to see all columns
            </div>
          )}
        </div>
      );
    }

    if (block.type === 'pearls_list') {
      return (
        <div key={bIdx} style={{
          background: isSepia ? '#E8F5E9' : isLight ? '#F0FDF4' : 'rgba(0, 230, 118, 0.05)',
          border: isSepia ? '1px solid #C8E6C9' : isLight ? '1px solid #BBF7D0' : '1px solid rgba(0, 230, 118, 0.2)',
          borderRadius: '8px', padding: isMobile ? '0.85rem 1rem' : '1.35rem', margin: '1.35rem 0',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <ul style={{ margin: 0, paddingLeft: isMobile ? '1.1rem' : '1.35rem', color: isDark ? '#86EFAC' : '#166534' }}>
            {block.items.map((p, idx) => (
              <li key={idx} style={{ marginBottom: '0.6rem', fontWeight: 600, wordBreak: 'break-word', lineHeight: 1.6 }}>{p}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (block.type === 'qa_box') {
      return (
        <div key={bIdx} style={{
          background: theme.sheetBoxBg,
          border: `1px solid ${theme.sheetBorder}`,
          borderRadius: '10px', padding: isMobile ? '0.95rem' : '1.35rem', marginBottom: '1.35rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            fontSize: '0.8rem', fontWeight: 900, color: '#D97706',
            textTransform: 'uppercase', marginBottom: '0.4rem'
          }}>
            {block.questionNumber}
          </div>
          <div style={{
            fontWeight: 700, color: theme.sheetHeaderColor,
            fontSize: isMobile ? '0.9rem' : '0.96rem', marginBottom: '0.95rem', whiteSpace: 'pre-line',
            wordBreak: 'break-word', lineHeight: 1.55
          }}>
            {block.question}
          </div>
          <div style={{
            background: isDark ? 'rgba(0,0,0,0.45)' : '#FFFFFF',
            border: `1px solid ${theme.sheetSubtleBorder}`,
            borderRadius: '8px', padding: isMobile ? '0.9rem' : '1.15rem',
            fontSize: isMobile ? '0.82rem' : '0.88rem',
            color: theme.sheetColor, whiteSpace: 'pre-line', lineHeight: 1.65,
            wordBreak: 'break-word'
          }}>
            {block.modelAnswer}
          </div>
        </div>
      );
    }

    if (block.type === 'footer_notice') {
      return (
        <div key={bIdx} style={{
          marginTop: '1.75rem', padding: '0.85rem', textAlign: 'center',
          borderTop: `1px dashed ${theme.sheetBorder}`,
          fontSize: '0.72rem', color: theme.sheetTextMuted,
          fontWeight: 700, fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '0.05em'
        }}>
          {block.text}
        </div>
      );
    }

    return null;
  };

  // Render the Complete Continuous Handout Document
  const renderHandoutDocument = (data) => {
    const isSepia = paperTheme === 'sepia';
    const isDark = paperTheme === 'dark';
    const isLight = paperTheme === 'light';

    const theme = {
      sheetBg: isSepia ? '#FDF6E2' : isDark ? '#181A1F' : '#FFFFFF',
      sheetColor: isSepia ? '#3E2723' : isDark ? '#E2E8F0' : '#1A202C',
      sheetTextMuted: isSepia ? '#5D4037' : isDark ? '#94A3B8' : '#475569',
      sheetHeaderColor: isSepia ? '#271206' : isDark ? '#FFFFFF' : '#0F172A',
      sheetBorder: isSepia ? '#E6D7B8' : isDark ? 'rgba(255,255,255,0.08)' : '#CBD5E1',
      sheetSubtleBorder: isSepia ? '#ECDCC2' : isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0',
      sheetBoxBg: isSepia ? '#F5E6CC' : isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
      sheetCalloutBg: isSepia ? '#FAEDCD' : isDark ? 'rgba(201,150,62,0.08)' : '#FFFBEB',
      sheetCalloutText: isSepia ? '#603808' : isDark ? '#FDE68A' : '#92400E',
      sheetCalloutBorder: '#D97706',
      sheetShadow: isSepia
        ? '0 10px 30px rgba(62,39,35,0.25), 0 1px 3px rgba(0,0,0,0.05)'
        : isDark
        ? '0 10px 30px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)'
        : '0 10px 30px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.1)'
    };

    const sectionNav = [
      { id: 'hmd-sec-0', label: '1.0 Objectives', icon: '🎯' },
      { id: 'hmd-sec-1', label: '2.0 Theory', icon: '🔬' },
      { id: 'hmd-sec-2', label: '3.0 Protocols', icon: '📋' },
      { id: 'hmd-sec-3', label: '4.0 Exam Pearls', icon: '💎' },
      { id: 'hmd-sec-4', label: '5.0 Past Questions', icon: '✍️' }
    ];

    const scrollToSection = (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    return (
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          margin: isMobile ? '0 auto 1.25rem auto' : '0 auto 3rem auto',
          background: theme.sheetBg,
          color: theme.sheetColor,
          borderRadius: isMobile ? '10px' : '12px',
          boxShadow: theme.sheetShadow,
          padding: isMobile ? '1.25rem 0.95rem' : 'clamp(2rem, 5vw, 3.5rem)',
          fontFamily: '"Lora", "Georgia", "Times New Roman", serif',
          fontSize: isMobile
            ? (zoomLevel === 115 ? '0.98rem' : zoomLevel === 85 ? '0.84rem' : '0.92rem')
            : (zoomLevel === 115 ? '1.08rem' : zoomLevel === 85 ? '0.90rem' : '1.0rem'),
          lineHeight: isMobile ? 1.65 : 1.8,
          position: 'relative',
          transition: 'background 0.2s ease, color 0.2s ease',
          boxSizing: 'border-box'
        }}>

        {/* Master Document Header */}
        <div style={{
          borderBottom: isSepia ? '2px solid #8D6E63' : isLight ? '2px solid #1E293B' : '2px solid rgba(201,150,62,0.35)',
          paddingBottom: '1.25rem',
          marginBottom: isMobile ? '1.25rem' : '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: '#C9963E', color: '#000000', fontWeight: 900,
                fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '4px', letterSpacing: '0.04em'
              }}>
                {course.course_code}
              </span>
              <span style={{
                background: isSepia ? '#EADBC8' : isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                color: theme.sheetHeaderColor, fontWeight: 700,
                fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '4px'
              }}>
                {course.level} • {course.semester}
              </span>
              <span style={{
                background: 'rgba(0, 230, 118, 0.12)', color: '#00C853',
                fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '4px'
              }}>
                ✓ AUTHENTIC CURRICULUM
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: theme.sheetTextMuted, fontWeight: 600 }}>
              Module {activeDocIndex + 1} of {course.documents?.length || 1}
            </div>
          </div>

          <h1 style={{
            fontSize: isMobile ? '1.35rem' : '1.85rem',
            fontWeight: 900,
            color: theme.sheetHeaderColor,
            margin: '0 0 0.5rem 0',
            lineHeight: 1.25,
            letterSpacing: '-0.025em'
          }}>
            {activeDoc.title}
          </h1>

          <div style={{
            fontSize: isMobile ? '0.75rem' : '0.82rem',
            color: theme.sheetTextMuted,
            lineHeight: 1.4,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap'
          }}>
            <span>🏛️ {course.faculty}</span>
            <span>•</span>
            <span>{course.department}</span>
          </div>

          {/* Jump To Navigation Pills */}
          <div style={{
            marginTop: '1.25rem',
            paddingTop: '0.85rem',
            borderTop: `1px dashed ${theme.sheetSubtleBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: '0.25rem'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: theme.sheetTextMuted, textTransform: 'uppercase', flexShrink: 0, marginRight: '0.25rem' }}>
              Jump To:
            </span>
            {sectionNav.map(sec => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                style={{
                  background: theme.sheetBoxBg,
                  border: `1px solid ${theme.sheetBorder}`,
                  color: theme.sheetHeaderColor,
                  padding: '0.3rem 0.65rem',
                  borderRadius: '100px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.15s ease'
                }}>
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sequential Sections */}
        {data.pages.map((section, sIdx) => {
          const anchorId = sectionNav[sIdx]?.id;
          return (
            <section
              key={section.pageNumber || sIdx}
              id={anchorId}
              style={{
                marginBottom: sIdx === data.pages.length - 1 ? '1.5rem' : (isMobile ? '2rem' : '2.75rem'),
                scrollMarginTop: '1rem'
              }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${theme.sheetSubtleBorder}`,
                paddingBottom: '0.6rem',
                marginBottom: isMobile ? '1rem' : '1.35rem',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                <h2 style={{
                  fontSize: isMobile ? '1.15rem' : '1.35rem',
                  fontWeight: 800,
                  color: theme.sheetHeaderColor,
                  margin: 0,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3
                }}>
                  {section.sectionTitle}
                </h2>

                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#D97706',
                  background: theme.sheetBoxBg,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  border: `1px solid ${theme.sheetBorder}`,
                  flexShrink: 0
                }}>
                  Part {sIdx + 1} of {data.pages.length}
                </span>
              </div>

              {section.contentBlocks.map((block, bIdx) => renderBlock(block, bIdx, theme))}

              {sIdx < data.pages.length - 1 && (
                <div style={{
                  margin: isMobile ? '1.75rem auto 0 auto' : '2.5rem auto 0 auto',
                  height: '1px',
                  width: '60%',
                  background: `radial-gradient(ellipse at center, ${theme.sheetBorder} 0%, transparent 80%)`
                }} />
              )}
            </section>
          );
        })}

        {/* Completion Footer & Study Actions */}
        <div style={{
          borderTop: isSepia ? '2px solid #8D6E63' : isLight ? '2px solid #1E293B' : '2px solid rgba(201,150,62,0.35)',
          paddingTop: '1.5rem',
          marginTop: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            background: theme.sheetBoxBg,
            border: `1px solid ${theme.sheetBorder}`,
            borderRadius: '10px',
            padding: isMobile ? '1.15rem 0.85rem' : '1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '1.6rem' }}>🎓</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: theme.sheetHeaderColor }}>
              End of {activeDoc.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: theme.sheetTextMuted, maxWidth: '520px', lineHeight: 1.5 }}>
              You have completed the full authentic syllabus module for {course.course_code}. Test your mastery with CBT mock questions or review flashcards.
            </div>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '0.5rem'
            }}>
              <button
                onClick={() => setActiveTab('quiz')}
                style={{
                  background: '#00E676',
                  color: '#000000',
                  border: 'none',
                  padding: '0.55rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                <span>🧪</span> Practice CBT Quiz
              </button>

              <button
                onClick={() => setActiveTab('flashcards')}
                style={{
                  background: '#C9963E',
                  color: '#000000',
                  border: 'none',
                  padding: '0.55rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                <span>🃏</span> Study Flashcards
              </button>

              <button
                onClick={handleDownloadStudySheet}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: theme.sheetHeaderColor,
                  border: `1px solid ${theme.sheetBorder}`,
                  padding: '0.55rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                <span>📥</span> Download Notes (.txt)
              </button>

              <button
                onClick={() => printRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  background: 'transparent',
                  color: theme.sheetTextMuted,
                  border: `1px solid ${theme.sheetSubtleBorder}`,
                  padding: '0.55rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}>
                ↑ Back to Top
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            fontSize: '0.68rem',
            color: theme.sheetTextMuted,
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div>HACKMYDEGREE • {course.course_code} ({course.level}) • OFFICIAL CURRICULUM REPOSITORY</div>
            <div>VERIFIED STUDY MATERIAL</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(5, 5, 5, 0.94)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 0 : 'clamp(0.25rem, 1.5vw, 1rem)'
    }} onClick={onClose}>
      <div style={{
        background: '#0F1013', color: '#FFFFFF',
        border: isMobile ? 'none' : '1px solid rgba(201, 150, 62, 0.35)',
        borderRadius: isMobile ? 0 : '16px',
        width: '100%', maxWidth: isMobile ? '100%' : '1240px',
        height: isMobile ? '100dvh' : '94vh',
        maxHeight: isMobile ? '100dvh' : '94vh',
        overflow: 'hidden', display: 'flex',
        flexDirection: 'column',
        boxShadow: isMobile ? 'none' : '0 25px 60px rgba(0,0,0,0.98)',
        animation: 'fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }} onClick={e => e.stopPropagation()}>

        {/* ─── MOBILE TOPBAR (2-ROW + TOOLS DRAWER) ─── */}
        {isMobile ? (
          <div style={{ flexShrink: 0, background: '#15161A', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Row 1: Header Bar */}
            <div style={{
              padding: '0.6rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}>
              {/* Back / Close button */}
              <button
                onClick={onClose}
                aria-label="Close reader"
                style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF',
                  width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                  fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                ✕
              </button>

              {/* Course badge & active document title */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{
                    background: '#C9963E', color: '#000000', fontWeight: 900,
                    fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '3px', flexShrink: 0
                  }}>
                    {course.course_code}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    Mod {activeDocIndex + 1}/{course.documents?.length || 1}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {activeDoc.title}
                </div>
              </div>

              {/* Right action icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                {/* Modules button */}
                <button
                  onClick={() => setMobileModulesOpen(true)}
                  title="View all course modules"
                  style={{
                    background: mobileModulesOpen ? '#C9963E' : 'rgba(255,255,255,0.08)',
                    color: mobileModulesOpen ? '#000000' : '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.12)',
                    padding: '0.35rem 0.55rem', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem'
                  }}>
                  <span>📁</span> Modules
                </button>

                {/* Read aloud button */}
                <button
                  onClick={handleToggleAudio}
                  title={isSpeaking ? "Stop Narration" : `Listen (${speechRate}x)`}
                  style={{
                    background: isSpeaking ? '#C9963E' : 'rgba(255,255,255,0.08)',
                    color: isSpeaking ? '#000000' : '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.12)',
                    padding: '0.35rem 0.45rem', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '0.8rem', display: 'flex', alignItems: 'center'
                  }}>
                  {isSpeaking ? '⏸️' : '🔊'}
                </button>

                {/* Tools Toggle */}
                <button
                  onClick={() => setMobileToolsOpen(o => !o)}
                  title="Reading options, font size, themes, scratchpad"
                  style={{
                    background: mobileToolsOpen ? 'rgba(201,150,62,0.25)' : 'rgba(255,255,255,0.08)',
                    color: mobileToolsOpen ? '#C9963E' : '#FFFFFF',
                    border: mobileToolsOpen ? '1px solid #C9963E' : '1px solid rgba(255,255,255,0.12)',
                    padding: '0.35rem 0.55rem', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '0.74rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem'
                  }}>
                  ⚙️ Tools
                </button>
              </div>
            </div>

            {/* Row 2: 3-Way Tabs */}
            <div style={{
              display: 'flex',
              background: '#0E0F12',
              padding: '0.3rem 0.6rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              gap: '0.35rem'
            }}>
              <button
                onClick={() => { setActiveTab('pdf'); setMobileToolsOpen(false); }}
                style={{
                  flex: 1, padding: '0.45rem 0.2rem', borderRadius: '6px', border: 'none',
                  background: activeTab === 'pdf' ? '#C9963E' : 'rgba(255,255,255,0.04)',
                  color: activeTab === 'pdf' ? '#000000' : '#CCCCCC',
                  fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
                }}>
                <span>📄</span> Handout
              </button>
              <button
                onClick={() => { setActiveTab('flashcards'); setMobileToolsOpen(false); }}
                style={{
                  flex: 1, padding: '0.45rem 0.2rem', borderRadius: '6px', border: 'none',
                  background: activeTab === 'flashcards' ? '#C9963E' : 'rgba(255,255,255,0.04)',
                  color: activeTab === 'flashcards' ? '#000000' : '#CCCCCC',
                  fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
                }}>
                <span>🃏</span> Flashcards
              </button>
              <button
                onClick={() => { setActiveTab('quiz'); setMobileToolsOpen(false); }}
                style={{
                  flex: 1, padding: '0.45rem 0.2rem', borderRadius: '6px', border: 'none',
                  background: activeTab === 'quiz' ? '#C9963E' : 'rgba(0, 230, 118, 0.15)',
                  color: activeTab === 'quiz' ? '#000000' : '#00E676',
                  fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
                }}>
                <span>🧪</span> CBT Quiz
              </button>
            </div>

            {/* Collapsible Mobile Tools Tray */}
            {mobileToolsOpen && (
              <div style={{
                background: '#1A1C22',
                borderTop: '1px solid rgba(201,150,62,0.3)',
                padding: '0.75rem 0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C9963E', textTransform: 'uppercase' }}>
                    Reading Preferences & Tools
                  </span>
                  <button
                    onClick={() => setMobileToolsOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '0.75rem', cursor: 'pointer' }}>
                    ✕ Close Tools
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {/* Reading Format Badge */}
                  <div
                    style={{
                      flex: 1, minWidth: '130px',
                      background: 'rgba(201,150,62,0.15)', color: '#C9963E',
                      border: '1px solid rgba(201,150,62,0.3)', padding: '0.45rem 0.5rem',
                      borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
                    }}>
                    <span>📜</span> Complete Authentic Handout
                  </div>

                  {/* Theme buttons */}
                  <div style={{ display: 'flex', gap: '0.25rem', flex: 1, minWidth: '150px' }}>
                    <button
                      onClick={() => setPaperTheme('light')}
                      style={{
                        flex: 1, padding: '0.45rem 0.2rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                        background: paperTheme === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
                        color: paperTheme === 'light' ? '#000000' : '#CCCCCC',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}>
                      📄 White
                    </button>
                    <button
                      onClick={() => setPaperTheme('sepia')}
                      style={{
                        flex: 1, padding: '0.45rem 0.2rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                        background: paperTheme === 'sepia' ? '#FDF6E2' : 'rgba(255,255,255,0.08)',
                        color: paperTheme === 'sepia' ? '#3E2723' : '#CCCCCC',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}>
                      📜 Sepia
                    </button>
                    <button
                      onClick={() => setPaperTheme('dark')}
                      style={{
                        flex: 1, padding: '0.45rem 0.2rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                        background: paperTheme === 'dark' ? '#181A1F' : 'rgba(255,255,255,0.08)',
                        color: paperTheme === 'dark' ? '#00E676' : '#CCCCCC',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}>
                      🌙 Dark
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                  {/* Zoom controls */}
                  <div style={{
                    display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)',
                    borderRadius: '6px', padding: '0.1rem', border: '1px solid rgba(255,255,255,0.12)'
                  }}>
                    <button
                      onClick={() => setZoomLevel(z => z > 85 ? z - 15 : z)}
                      style={{ background: 'transparent', color: '#FFFFFF', border: 'none', padding: '0.35rem 0.55rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}>
                      A-
                    </button>
                    <span style={{ fontSize: '0.74rem', color: '#C9963E', fontWeight: 800, padding: '0 0.3rem' }}>
                      {zoomLevel}%
                    </span>
                    <button
                      onClick={() => setZoomLevel(z => z < 115 ? z + 15 : z)}
                      style={{ background: 'transparent', color: '#FFFFFF', border: 'none', padding: '0.35rem 0.55rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}>
                      A+
                    </button>
                  </div>

                  {/* Personal Notes */}
                  <button
                    onClick={() => { setIsNotesOpen(o => !o); setMobileToolsOpen(false); }}
                    style={{
                      flex: 1,
                      background: isNotesOpen || stickyNotes.length > 0 ? 'rgba(201,150,62,0.2)' : 'rgba(255,255,255,0.08)',
                      color: isNotesOpen || stickyNotes.length > 0 ? '#C9963E' : '#FFFFFF',
                      border: '1px solid rgba(255,255,255,0.15)', padding: '0.45rem 0.6rem',
                      borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
                    }}>
                    <span>📝</span> Notes {stickyNotes.length > 0 && '●'}
                  </button>

                  {/* Bookmark */}
                  <button
                    onClick={handleToggleBookmark}
                    style={{
                      background: isBookmarked ? 'rgba(201,150,62,0.2)' : 'rgba(255,255,255,0.08)',
                      color: isBookmarked ? '#C9963E' : '#FFFFFF',
                      border: '1px solid rgba(255,255,255,0.15)', padding: '0.45rem 0.6rem',
                      borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: '0.3rem'
                    }}>
                    <span>{isBookmarked ? '★' : '☆'}</span> Bookmark
                  </button>

                  {/* Download Study Pack */}
                  <button
                    onClick={() => { handleDownloadStudySheet(); setMobileToolsOpen(false); }}
                    style={{
                      background: 'rgba(255,255,255,0.08)', color: '#FFFFFF',
                      border: '1px solid rgba(255,255,255,0.15)', padding: '0.45rem 0.6rem',
                      borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
                    }}>
                    <span>📥</span> Pack
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ─── DESKTOP TOPBAR ─── */
          <div style={{
            padding: '0.65rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'linear-gradient(90deg, #18191E 0%, #121316 100%)',
            flexShrink: 0, flexWrap: 'wrap', gap: '0.75rem'
          }}>

            {/* Left Title info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.6rem' }}>📄</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    background: '#C9963E', color: '#000000', fontWeight: 900,
                    fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px'
                  }}>
                    {course.course_code}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#A0A0A0', fontWeight: 600 }}>
                    {course.level} • {activeDoc.format || 'OFFICIAL PDF'}
                  </span>
                </div>
                <h2 style={{
                  margin: '0.1rem 0 0 0', fontSize: '1rem', fontWeight: 800,
                  color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '420px'
                }}>
                  {activeDoc.title}
                </h2>
              </div>
            </div>

            {/* Center Tabs: PDF View vs Flashcards vs Quiz */}
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px', padding: '0.2rem', border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <button
                onClick={() => setActiveTab('pdf')}
                style={{
                  padding: '0.35rem 0.85rem', borderRadius: '6px', border: 'none',
                  background: activeTab === 'pdf' ? '#C9963E' : 'transparent',
                  color: activeTab === 'pdf' ? '#000000' : '#CCCCCC',
                  fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem'
                }}>
                <span>📄</span> PDF Handout
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                style={{
                  padding: '0.35rem 0.85rem', borderRadius: '6px', border: 'none',
                  background: activeTab === 'flashcards' ? '#C9963E' : 'transparent',
                  color: activeTab === 'flashcards' ? '#000000' : '#CCCCCC',
                  fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem'
                }}>
                <span>🃏</span> Flashcards
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                style={{
                  padding: '0.35rem 0.85rem', borderRadius: '6px', border: 'none',
                  background: activeTab === 'quiz' ? '#C9963E' : '#00E676',
                  color: activeTab === 'quiz' ? '#000000' : '#000000',
                  fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem'
                }}>
                <span>🧪</span> CBT Quiz
              </button>
            </div>

            {/* Right Toolbar Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              {activeTab === 'pdf' && (
                <>
                  {/* Reading Format Badge */}
                  <div
                    title="Complete authentic curriculum lecture note"
                    style={{
                      background: 'rgba(201,150,62,0.12)', color: '#C9963E',
                      border: '1px solid rgba(201,150,62,0.25)', padding: '0.35rem 0.6rem',
                      borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', gap: '0.3rem'
                    }}>
                    <span>📜</span> Complete Handout
                  </div>

                  {/* Zoom Selector */}
                  <div style={{
                    display: 'flex', background: 'rgba(255,255,255,0.05)',
                    borderRadius: '6px', padding: '0.12rem', border: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <button
                      onClick={() => setZoomLevel(z => z > 85 ? z - 15 : z)}
                      title="Zoom Out"
                      style={{
                        background: 'transparent', color: '#CCCCCC', border: 'none',
                        padding: '0.2rem 0.4rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800
                      }}>-</button>
                    <span style={{ fontSize: '0.72rem', color: '#C9963E', fontWeight: 800, padding: '0.2rem 0.3rem' }}>
                      {zoomLevel}%
                    </span>
                    <button
                      onClick={() => setZoomLevel(z => z < 115 ? z + 15 : z)}
                      title="Zoom In"
                      style={{
                        background: 'transparent', color: '#CCCCCC', border: 'none',
                        padding: '0.2rem 0.4rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800
                      }}>+</button>
                  </div>

                  {/* Paper Theme 3-Way Selector */}
                  <button
                    onClick={() => setPaperTheme(t => t === 'light' ? 'sepia' : t === 'sepia' ? 'dark' : 'light')}
                    title="Cycle White Paper, Eye-Care Sepia, and Dark PDF themes"
                    style={{
                      background: paperTheme === 'sepia' ? 'rgba(217, 119, 6, 0.2)' : 'rgba(255,255,255,0.06)',
                      color: paperTheme === 'sepia' ? '#FDE68A' : '#FFFFFF',
                      border: paperTheme === 'sepia' ? '1px solid rgba(217, 119, 6, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                      padding: '0.35rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700
                    }}>
                    {paperTheme === 'light' ? '📄 White' : paperTheme === 'sepia' ? '📜 Sepia (Eye-Care)' : '🌙 Dark'}
                  </button>

                  {/* Sticky Notes Scratchpad Toggle */}
                  <button
                    onClick={() => setIsNotesOpen(o => !o)}
                    title="Open Personal Sticky Notes Scratchpad"
                    style={{
                      background: isNotesOpen || stickyNotes.length > 0 ? 'rgba(201,150,62,0.2)' : 'rgba(255,255,255,0.06)',
                      color: isNotesOpen || stickyNotes.length > 0 ? '#C9963E' : '#FFFFFF',
                      border: isNotesOpen || stickyNotes.length > 0 ? '1px solid rgba(201,150,62,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      padding: '0.35rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: '0.3rem'
                    }}>
                    <span>📝</span> Notes {stickyNotes.length > 0 && '●'}
                  </button>

                  {/* Download / Export Study Pack */}
                  <button
                    onClick={handleDownloadStudySheet}
                    title="Export High-Yield Study Summary for Offline Revision"
                    style={{
                      background: 'rgba(255,255,255,0.06)', color: '#FFFFFF',
                      border: '1px solid rgba(255,255,255,0.1)', padding: '0.35rem 0.6rem',
                      borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: '0.3rem'
                    }}>
                    <span>📥</span> Study Pack
                  </button>

                  {/* Print */}
                  <button
                    onClick={handlePrint}
                    title="Print or Save as PDF"
                    style={{
                      background: 'rgba(255,255,255,0.06)', color: '#FFFFFF',
                      border: '1px solid rgba(255,255,255,0.1)', padding: '0.35rem 0.6rem',
                      borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: '0.3rem'
                    }}>
                    <span>🖨️</span> Print
                  </button>

                  {/* Read Aloud + Speed Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <button
                      onClick={handleToggleAudio}
                      title={isSpeaking ? "Stop Narration" : `Listen Aloud (${speechRate}x)`}
                      style={{
                        background: isSpeaking ? '#C9963E' : 'rgba(255,255,255,0.06)',
                        color: isSpeaking ? '#000000' : '#FFFFFF',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.35rem 0.6rem', borderRadius: '6px 0 0 6px', cursor: 'pointer',
                        fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem'
                      }}>
                      <span>{isSpeaking ? '⏸️' : '🔊'}</span>
                    </button>
                    <button
                      onClick={() => setSpeechRate(r => r === 0.8 ? 1.0 : r === 1.0 ? 1.2 : r === 1.2 ? 1.5 : 0.8)}
                      title="Change Narration Speed"
                      style={{
                        background: 'rgba(255,255,255,0.08)', color: '#C9963E',
                        border: '1px solid rgba(255,255,255,0.1)', borderLeft: 'none',
                        padding: '0.35rem 0.45rem', borderRadius: '0 6px 6px 0', cursor: 'pointer',
                        fontSize: '0.72rem', fontWeight: 800
                      }}>
                      {speechRate}x
                    </button>
                  </div>

                  {/* Bookmark */}
                  <button
                    onClick={handleToggleBookmark}
                    title="Bookmark Note"
                    style={{
                      background: isBookmarked ? 'rgba(201,150,62,0.2)' : 'rgba(255,255,255,0.06)',
                      color: isBookmarked ? '#C9963E' : '#A0A0A0',
                      border: isBookmarked ? '1px solid rgba(201,150,62,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      padding: '0.35rem 0.6rem', borderRadius: '6px', cursor: 'pointer',
                      fontSize: '0.82rem'
                    }}>
                    {isBookmarked ? '★' : '☆'}
                  </button>
                </>
              )}

              {/* Close Button */}
              <button onClick={onClose} style={{
                background: 'rgba(255,255,255,0.06)', border: 'none', color: '#CCCCCC',
                width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                ✕
              </button>
            </div>
          </div>
        )}

        {/* ─── WORKSPACE (SIDEBAR + STICKY SCRATCHPAD + PDF CANVAS) ─── */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>

          {/* Desktop Sidebar Document Modules */}
          {!isMobile && (
            <div style={{
              width: '280px', borderRight: '1px solid rgba(255,255,255,0.08)',
              background: '#131417', display: 'flex', flexDirection: 'column',
              flexShrink: 0
            }}>
              <div style={{
                padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize: '0.75rem', fontWeight: 800, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
                📁 Course Document Modules ({course.documents?.length || 1})
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '0.65rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {course.documents?.map((doc, idx) => {
                    const isCurrent = activeDocIndex === idx;
                    return (
                      <div
                        key={doc.id || idx}
                        onClick={() => {
                          setActiveDocIndex(idx);
                          printRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          padding: '0.7rem 0.85rem', borderRadius: '8px', cursor: 'pointer',
                          background: isCurrent ? 'rgba(201,150,62,0.16)' : 'rgba(255,255,255,0.02)',
                          border: isCurrent ? '1px solid rgba(201,150,62,0.45)' : '1px solid rgba(255,255,255,0.04)',
                          transition: 'all 0.15s ease'
                        }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{
                            background: isCurrent ? '#C9963E' : 'rgba(255,255,255,0.08)',
                            color: isCurrent ? '#000000' : '#CCCCCC',
                            fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: '3px'
                          }}>
                            PDF MODULE {idx + 1}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#777777' }}>
                            5 Pages
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.8rem', fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? '#FFFFFF' : '#B0B0B0', lineHeight: 1.35
                        }}>
                          {doc.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Bottom Pro Upgrade / AI Shortcut */}
              <div style={{
                padding: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '0.5rem'
              }}>
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/ai?q=Explain in detail: ${encodeURIComponent(course.course_code)} - ${encodeURIComponent(activeDoc?.title || course.title)}`);
                  }}
                  style={{
                    width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#FFFFFF', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                  }}>
                  <span>🤖</span> Ask DegreeAI About This PDF
                </button>

                {!isPro && (
                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    style={{
                      width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px',
                      background: 'linear-gradient(135deg, rgba(201,150,62,0.2) 0%, rgba(201,150,62,0.08) 100%)',
                      border: '1px solid rgba(201,150,62,0.3)',
                      color: '#C9963E', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                    ⚡ Unlock Download Rights (₦500/mo)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mobile Drawer Document Modules Modal */}
          {isMobile && mobileModulesOpen && (
            <div
              onClick={() => setMobileModulesOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 10001,
                background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
                display: 'flex'
              }}>
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  width: '85%', maxWidth: '320px', height: '100%',
                  background: '#131417', display: 'flex', flexDirection: 'column',
                  boxShadow: '4px 0 25px rgba(0,0,0,0.85)', borderRight: '1px solid rgba(201,150,62,0.3)',
                  animation: 'slideInLeft 0.2s ease'
                }}>
                <div style={{
                  padding: '0.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#C9963E' }}>
                    📁 Course Modules ({course.documents?.length || 1})
                  </div>
                  <button
                    onClick={() => setMobileModulesOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1rem', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0.65rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {course.documents?.map((doc, idx) => {
                      const isCurrent = activeDocIndex === idx;
                      return (
                        <div
                          key={doc.id || idx}
                          onClick={() => {
                            setActiveDocIndex(idx);
                            printRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                            setMobileModulesOpen(false);
                          }}
                          style={{
                            padding: '0.75rem 0.85rem', borderRadius: '8px', cursor: 'pointer',
                            background: isCurrent ? 'rgba(201,150,62,0.16)' : 'rgba(255,255,255,0.02)',
                            border: isCurrent ? '1px solid rgba(201,150,62,0.45)' : '1px solid rgba(255,255,255,0.04)',
                            transition: 'all 0.15s ease'
                          }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{
                              background: isCurrent ? '#C9963E' : 'rgba(255,255,255,0.08)',
                              color: isCurrent ? '#000000' : '#CCCCCC',
                              fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: '3px'
                            }}>
                              PDF MODULE {idx + 1}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#777777' }}>
                              5 Pages
                            </span>
                          </div>
                          <div style={{
                            fontSize: '0.82rem', fontWeight: isCurrent ? 700 : 500,
                            color: isCurrent ? '#FFFFFF' : '#B0B0B0', lineHeight: 1.35
                          }}>
                            {doc.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{
                  padding: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                }}>
                  <button
                    onClick={() => {
                      setMobileModulesOpen(false);
                      onClose();
                      navigate(`/ai?q=Explain in detail: ${encodeURIComponent(course.course_code)} - ${encodeURIComponent(activeDoc?.title || course.title)}`);
                    }}
                    style={{
                      width: '100%', padding: '0.6rem', borderRadius: '6px',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                    }}>
                    <span>🤖</span> Ask DegreeAI About This PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Collapsible Sticky Notes Drawer (Desktop vs Mobile Bottom Sheet) */}
          {isNotesOpen && (
            isMobile ? (
              <div
                onClick={() => setIsNotesOpen(false)}
                style={{
                  position: 'fixed', inset: 0, zIndex: 10002,
                  background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
                }}>
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    width: '100%', maxHeight: '82vh', height: '82vh',
                    background: '#16181D', borderTop: '2px solid #C9963E',
                    borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column',
                    padding: '1rem', boxShadow: '0 -10px 30px rgba(0,0,0,0.85)'
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>📝</span>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#C9963E' }}>
                        Personal Study Notes
                      </span>
                    </div>
                    <button
                      onClick={() => setIsNotesOpen(false)}
                      style={{ background: 'transparent', border: 'none', color: '#888888', cursor: 'pointer', fontSize: '1.1rem' }}>
                      ✕
                    </button>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.5rem' }}>
                    Saved locally for {course.course_code} Module {activeDocIndex + 1}:
                  </div>

                  <textarea
                    value={stickyNotes}
                    onChange={(e) => handleSaveNotes(e.target.value)}
                    placeholder="Type your personal lecture takeaways, formulas, mnemonics, or questions here... (Auto-saved)"
                    style={{
                      flex: 1, width: '100%', background: '#0F1013', color: '#F1F5F9',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                      padding: '0.75rem', fontSize: '0.84rem', lineHeight: 1.5, resize: 'none',
                      fontFamily: 'system-ui, sans-serif', outline: 'none', boxSizing: 'border-box'
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                    <button
                      onClick={() => {
                        handleSaveNotes('');
                        showToast('Notes cleared', 'info');
                      }}
                      style={{
                        background: 'transparent', color: '#EF4444', border: 'none',
                        fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600
                      }}>
                      🗑️ Clear Notes
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(stickyNotes);
                        showToast('📋 Notes copied to clipboard!', 'success');
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.08)', color: '#FFFFFF',
                        border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px',
                        padding: '0.4rem 0.8rem', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700
                      }}>
                      📋 Copy Notes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                width: '320px', background: '#16181D', borderRight: '1px solid rgba(201,150,62,0.3)',
                display: 'flex', flexDirection: 'column', padding: '1rem', flexShrink: 0,
                boxShadow: '4px 0 20px rgba(0,0,0,0.5)', zIndex: 10
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>📝</span>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#C9963E' }}>
                      Personal Study Notes
                    </span>
                  </div>
                  <button
                    onClick={() => setIsNotesOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: '#888888', cursor: 'pointer', fontSize: '0.9rem' }}>
                    ✕
                  </button>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.5rem' }}>
                  Saved locally for {course.course_code} Module {activeDocIndex + 1}:
                </div>

                <textarea
                  value={stickyNotes}
                  onChange={(e) => handleSaveNotes(e.target.value)}
                  placeholder="Type your personal lecture takeaways, board exam formulas, mnemonics, or questions here... (Auto-saved)"
                  style={{
                    flex: 1, width: '100%', background: '#0F1013', color: '#F1F5F9',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                    padding: '0.75rem', fontSize: '0.82rem', lineHeight: 1.5, resize: 'none',
                    fontFamily: 'system-ui, sans-serif', outline: 'none'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                  <button
                    onClick={() => {
                      handleSaveNotes('');
                      showToast('Notes cleared', 'info');
                    }}
                    style={{
                      background: 'transparent', color: '#EF4444', border: 'none',
                      fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600
                    }}>
                    🗑️ Clear Notes
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(stickyNotes);
                      showToast('📋 Notes copied to clipboard!', 'success');
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)', color: '#FFFFFF',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                      padding: '0.3rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700
                    }}>
                    📋 Copy
                  </button>
                </div>
              </div>
            )
          )}

          {/* Main PDF Canvas Area */}
          <div
            ref={printRef}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
              background: '#0B0C0E', overflowY: 'auto',
              padding: isMobile ? '0.75rem 0.4rem' : 'clamp(1rem, 3vw, 2.5rem) 1rem'
            }}>

            {/* TAB: PDF HANDOUT SHEETS */}
            {activeTab === 'pdf' && (
              <div style={{ width: '100%' }}>
                {renderHandoutDocument(pdfData)}
              </div>
            )}

            {/* TAB: FLASHCARDS */}
            {activeTab === 'flashcards' && (
              <div style={{
                padding: isMobile ? '1rem 0.5rem' : '2rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: isMobile ? 'auto' : '450px'
              }}>
                <div style={{ width: '100%', maxWidth: '620px', display: 'flex', flexDirection: 'column', gap: isMobile ? '0.85rem' : '1.25rem' }}>
                  
                  {/* Spaced Repetition Progress Header */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem' }}>
                      <span style={{ color: '#C9963E', fontWeight: 800, fontSize: isMobile ? '0.8rem' : '0.85rem' }}>
                        Card {cardIndex + 1} of {flashcards.length}
                      </span>
                      <span style={{ color: '#00E676', fontSize: isMobile ? '0.75rem' : '0.8rem', fontWeight: 800 }}>
                        Mastered: {masteredCards.size} / {flashcards.length} ({Math.round((masteredCards.size / flashcards.length) * 100)}%)
                      </span>
                    </div>
                    {/* Mastery Progress Bar */}
                    <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${(masteredCards.size / flashcards.length) * 100}%`,
                        background: 'linear-gradient(90deg, #C9963E 0%, #00E676 100%)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{
                      background: isFlipped ? 'linear-gradient(135deg, rgba(201,150,62,0.15) 0%, rgba(18,19,22,0.9) 100%)' : 'rgba(255,255,255,0.03)',
                      border: isFlipped ? '1px solid rgba(201,150,62,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px', minHeight: isMobile ? '200px' : '260px',
                      padding: isMobile ? '1.25rem 1rem' : '2rem',
                      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                      textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      boxSizing: 'border-box'
                    }}>
                    <span style={{ fontSize: isMobile ? '0.7rem' : '0.75rem', color: '#C9963E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem', fontWeight: 700 }}>
                      {isFlipped ? '💡 ANSWER / EXPLANATION' : '❓ QUESTION (Tap card to flip)'}
                    </span>
                    <div style={{ fontSize: isMobile ? '1rem' : '1.15rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.55, wordBreak: 'break-word' }}>
                      {isFlipped ? flashcards[cardIndex]?.back : flashcards[cardIndex]?.front}
                    </div>
                  </div>

                  {/* Confidence Rating Buttons (Spaced Repetition) */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '0.35rem' : '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        const newSet = new Set(masteredCards);
                        newSet.delete(cardIndex);
                        setMasteredCards(newSet);
                        setIsFlipped(false);
                        setCardIndex(i => (i + 1) % flashcards.length);
                        showToast('Marked for review', 'info');
                      }}
                      style={{
                        flex: isMobile ? '1 1 30%' : 'none',
                        padding: isMobile ? '0.45rem 0.5rem' : '0.5rem 0.9rem', borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.15)', color: '#F87171',
                        border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer',
                        fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: 700,
                        textAlign: 'center'
                      }}>
                      🔴 Hard
                    </button>
                    <button
                      onClick={() => {
                        setIsFlipped(false);
                        setCardIndex(i => (i + 1) % flashcards.length);
                      }}
                      style={{
                        flex: isMobile ? '1 1 30%' : 'none',
                        padding: isMobile ? '0.45rem 0.5rem' : '0.5rem 0.9rem', borderRadius: '8px',
                        background: 'rgba(234, 179, 8, 0.15)', color: '#FACC15',
                        border: '1px solid rgba(234, 179, 8, 0.3)', cursor: 'pointer',
                        fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: 700,
                        textAlign: 'center'
                      }}>
                      🟡 Good
                    </button>
                    <button
                      onClick={() => {
                        const newSet = new Set(masteredCards);
                        newSet.add(cardIndex);
                        setMasteredCards(newSet);
                        setIsFlipped(false);
                        setCardIndex(i => (i + 1) % flashcards.length);
                        showToast('✓ Card Mastered!', 'success');
                      }}
                      style={{
                        flex: isMobile ? '1 1 30%' : 'none',
                        padding: isMobile ? '0.45rem 0.5rem' : '0.5rem 0.9rem', borderRadius: '8px',
                        background: 'rgba(0, 230, 118, 0.15)', color: '#00E676',
                        border: '1px solid rgba(0, 230, 118, 0.3)', cursor: 'pointer',
                        fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: 700,
                        textAlign: 'center'
                      }}>
                      🟢 Mastered
                    </button>
                  </div>

                  {/* Previous / Next Navigation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      disabled={cardIndex === 0}
                      onClick={() => {
                        setIsFlipped(false);
                        setCardIndex(i => Math.max(0, i - 1));
                      }}
                      style={{
                        flex: 1,
                        padding: isMobile ? '0.55rem 0.75rem' : '0.6rem 1.2rem', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.06)', color: '#FFFFFF', border: 'none',
                        cursor: cardIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: isMobile ? '0.8rem' : '0.85rem'
                      }}>
                      ← Previous
                    </button>

                    <button
                      disabled={cardIndex >= flashcards.length - 1}
                      onClick={() => {
                        setIsFlipped(false);
                        setCardIndex(i => Math.min(flashcards.length - 1, i + 1));
                      }}
                      style={{
                        flex: 1,
                        padding: isMobile ? '0.55rem 0.75rem' : '0.6rem 1.2rem', borderRadius: '8px',
                        background: '#C9963E', color: '#000000', border: 'none',
                        cursor: cardIndex >= flashcards.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: isMobile ? '0.8rem' : '0.85rem'
                      }}>
                      Next Card →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CBT QUIZ */}
            {activeTab === 'quiz' && (
              <div style={{
                padding: isMobile ? '0.75rem 0.25rem' : '2rem',
                maxWidth: '820px', margin: '0 auto', width: '100%',
                boxSizing: 'border-box'
              }}>
                {/* Quiz Header & AI Generator Bar */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(201,150,62,0.12) 0%, rgba(18,19,22,0.8) 100%)',
                  border: '1px solid rgba(201,150,62,0.3)',
                  borderRadius: isMobile ? '12px' : '16px',
                  padding: isMobile ? '1rem 0.85rem' : '1.5rem',
                  marginBottom: isMobile ? '1.25rem' : '2rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.85rem' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: isMobile ? '1.15rem' : '1.4rem' }}>🎯</span>
                        <h3 style={{ margin: 0, fontSize: isMobile ? '1.05rem' : '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                          DegreeAI CBT Mock Exam Simulator
                        </h3>
                        <span style={{
                          background: '#00E676', color: '#000000', fontSize: '0.68rem',
                          fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '100px'
                        }}>
                          {(customQuestions || quizQuestions).length} MCQs
                        </span>
                      </div>
                      <p style={{ margin: 0, color: '#A0AEC0', fontSize: isMobile ? '0.78rem' : '0.85rem', lineHeight: 1.45 }}>
                        Take a timed, university-standard practice test generated specifically for <strong>{activeDoc.title}</strong>.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
                      {/* Timer Display */}
                      <div style={{
                        background: isTimerActive && timerSeconds < 120 ? 'rgba(239,68,68,0.2)' : 'rgba(0,0,0,0.4)',
                        border: isTimerActive && timerSeconds < 120 ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
                        padding: '0.4rem 0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem',
                        color: isTimerActive && timerSeconds < 120 ? '#F87171' : '#E2E8F0', fontWeight: 800, fontSize: '0.82rem'
                      }}>
                        <span>⏱️</span>
                        <span>
                          {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:
                          {(timerSeconds % 60).toString().padStart(2, '0')}
                        </span>
                      </div>

                      {/* Generate AI Exam Button */}
                      <button
                        disabled={isGeneratingAI}
                        onClick={async () => {
                          setIsGeneratingAI(true);
                          showToast('🤖 DegreeAI is generating 10 university-grade exam questions...', 'info');
                          const exam = await generate10QuestionExam(course, activeDoc);
                          setIsGeneratingAI(false);
                          if (exam && exam.length > 0) {
                            setCustomQuestions(exam);
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                            setTimerSeconds(600);
                            setIsTimerActive(true);
                            showToast(`🎉 10-Question Exam ready! 10-minute timer started.`, 'success');
                          } else {
                            showToast('Failed to generate AI questions. Using verified test bank.', 'info');
                          }
                        }}
                        style={{
                          flex: isMobile ? 1 : 'none',
                          padding: isMobile ? '0.5rem 0.85rem' : '0.55rem 1.1rem', borderRadius: '8px', border: 'none',
                          background: isGeneratingAI ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #C9963E 0%, #A67628 100%)',
                          color: '#000000', fontWeight: 800, fontSize: isMobile ? '0.76rem' : '0.82rem', cursor: isGeneratingAI ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: '0 4px 15px rgba(201,150,62,0.3)'
                        }}>
                        <span>{isGeneratingAI ? '⏳' : '⚡'}</span>
                        <span>{isGeneratingAI ? 'Generating...' : 'Generate 10-Q AI Exam'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Exam Score Banner */}
                  {quizSubmitted && (
                    <div style={{
                      marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem'
                    }}>
                      <div>
                        <div style={{ fontSize: isMobile ? '1.05rem' : '1.15rem', fontWeight: 900, color: '#FFFFFF' }}>
                          🎯 Final Score: {calculateQuizScore()} / {(customQuestions || quizQuestions).length}
                          <span style={{ marginLeft: '0.5rem', color: '#00E676', fontSize: '0.95rem' }}>
                            ({Math.round((calculateQuizScore() / (customQuestions || quizQuestions).length) * 100)}%)
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#A0AEC0', marginTop: '0.2rem' }}>
                          {calculateQuizScore() >= (customQuestions || quizQuestions).length * 0.7
                            ? '🌟 Excellent performance! You have mastered this module.'
                            : '📚 Good attempt. Review the rationale breakdowns below to solidify your understanding.'}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                          setTimerSeconds(600);
                          setIsTimerActive(true);
                        }}
                        style={{
                          padding: '0.45rem 0.9rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)',
                          background: 'rgba(255,255,255,0.06)', color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                        }}>
                        🔄 Retake Test
                      </button>
                    </div>
                  )}
                </div>

                {/* Questions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem' }}>
                  {(customQuestions || quizQuestions).map((q, qIndex) => {
                    const selected = quizAnswers[q.id];
                    const isCorrect = selected === q.correct;

                    return (
                      <div key={q.id || qIndex} style={{
                        background: '#131417',
                        border: quizSubmitted
                          ? isCorrect
                            ? '1px solid rgba(0, 230, 118, 0.4)'
                            : '1px solid rgba(239, 68, 68, 0.4)'
                          : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: isMobile ? '10px' : '12px',
                        padding: isMobile ? '1rem 0.85rem' : '1.5rem',
                        transition: 'all 0.2s ease',
                        boxSizing: 'border-box'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 900,
                            color: '#C9963E', textTransform: 'uppercase'
                          }}>
                            Question {qIndex + 1}
                          </span>
                          {quizSubmitted && (
                            <span style={{
                              fontSize: '0.72rem', fontWeight: 800,
                              color: isCorrect ? '#00E676' : '#EF4444'
                            }}>
                              {isCorrect ? '✓ Correct (+1)' : '✗ Incorrect (0)'}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: isMobile ? '0.92rem' : '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', lineHeight: 1.45, wordBreak: 'break-word' }}>
                          {q.question}
                        </div>

                        {/* Options */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                          {q.options.map((opt, optIdx) => {
                            const isThisOptionSelected = selected === optIdx;
                            const isThisOptionCorrect = optIdx === q.correct;

                            let optBg = 'rgba(255,255,255,0.03)';
                            let optBorder = 'rgba(255,255,255,0.08)';
                            let optColor = '#E2E8F0';

                            if (quizSubmitted) {
                              if (isThisOptionCorrect) {
                                optBg = 'rgba(0, 230, 118, 0.15)';
                                optBorder = 'rgba(0, 230, 118, 0.5)';
                                optColor = '#00E676';
                              } else if (isThisOptionSelected && !isThisOptionCorrect) {
                                optBg = 'rgba(239, 68, 68, 0.15)';
                                optBorder = 'rgba(239, 68, 68, 0.5)';
                                optColor = '#EF4444';
                              }
                            } else if (isThisOptionSelected) {
                              optBg = 'rgba(201, 150, 62, 0.15)';
                              optBorder = '#C9963E';
                              optColor = '#FFFFFF';
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() => {
                                  if (!quizSubmitted) {
                                    setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }));
                                  }
                                }}
                                style={{
                                  padding: isMobile ? '0.65rem 0.75rem' : '0.85rem 1rem', borderRadius: '8px',
                                  background: optBg, border: `1px solid ${optBorder}`, color: optColor,
                                  textAlign: 'left', fontSize: isMobile ? '0.82rem' : '0.88rem', cursor: quizSubmitted ? 'default' : 'pointer',
                                  display: 'flex', alignItems: 'center', gap: '0.65rem', transition: 'all 0.15s ease',
                                  wordBreak: 'break-word'
                                }}>
                                <span style={{
                                  width: isMobile ? '22px' : '24px', height: isMobile ? '22px' : '24px', borderRadius: '50%',
                                  background: isThisOptionSelected ? (quizSubmitted && !isThisOptionCorrect ? '#EF4444' : '#C9963E') : 'rgba(255,255,255,0.08)',
                                  color: isThisOptionSelected ? '#000000' : '#CCCCCC',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.72rem', fontWeight: 800, flexShrink: 0
                                }}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span style={{ flex: 1 }}>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Rationale explanation */}
                        {quizSubmitted && q.explanation && (
                          <div style={{
                            marginTop: '0.85rem', padding: '0.75rem 0.85rem', borderRadius: '8px',
                            background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid #C9963E',
                            fontSize: '0.8rem', color: '#A0AEC0', lineHeight: 1.5,
                            wordBreak: 'break-word'
                          }}>
                            <strong style={{ color: '#C9963E', display: 'block', marginBottom: '0.2rem' }}>
                              💡 Marking Rationale:
                            </strong>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Submit Button */}
                {!quizSubmitted && (
                  <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        setQuizSubmitted(true);
                        setIsTimerActive(false);
                        showToast(`🎉 Exam completed! Your score: ${calculateQuizScore()} / ${(customQuestions || quizQuestions).length}`, 'success');
                      }}
                      style={{
                        width: isMobile ? '100%' : 'auto',
                        padding: isMobile ? '0.85rem 1.5rem' : '0.85rem 2.5rem', borderRadius: '100px', border: 'none',
                        background: 'linear-gradient(135deg, #00E676 0%, #00B0FF 100%)',
                        color: '#000000', fontWeight: 900, fontSize: isMobile ? '0.9rem' : '0.95rem', cursor: 'pointer',
                        boxShadow: '0 8px 25px rgba(0, 230, 118, 0.4)'
                      }}>
                      Submit CBT Answers & View Rationales 🚀
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
