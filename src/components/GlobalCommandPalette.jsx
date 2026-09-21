// src/components/GlobalCommandPalette.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { KNOWLEDGE_BANK_COURSES } from '../data/knowledgeBank';

export default function GlobalCommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered by parent state or keyboard event
          window.dispatchEvent(new CustomEvent('toggle-command-palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Search Results
  const results = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return [
        { type: 'action', title: 'DegreeAI Clinical & Exam Tutor', icon: '🤖', link: '/ai-assistant', desc: 'Ask DegreeAI questions or solve assignments' },
        { type: 'action', title: 'Knowledge Bank & Lecture Notes', icon: '🏛️', link: '/resources', desc: 'Curated 100L–500L university notes' },
        { type: 'action', title: 'Skills Hub & Tech Courses', icon: '⚡', link: '/skills', desc: 'High-income digital skills & certifications' },
        { type: 'action', title: 'Find Verified Peer Tutors', icon: '👨‍🏫', link: '/tutors', desc: '1-on-1 tutoring with top students' },
        { type: 'action', title: 'My Student Dashboard', icon: '📊', link: '/dashboard', desc: 'Saved notes, streak, and uploads' }
      ];
    }

    const matchedCourses = KNOWLEDGE_BANK_COURSES.filter(c => 
      c.course_code.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q) ||
      c.level.toLowerCase().includes(q) ||
      c.topics.some(t => t.toLowerCase().includes(q))
    ).slice(0, 6).map(c => ({
      type: 'course',
      title: `${c.course_code}: ${c.title}`,
      icon: c.icon || '📚',
      desc: `${c.level} • ${c.department}`,
      link: '/resources',
      data: c
    }));

    const quickActions = [
      { type: 'action', title: `Ask DegreeAI: "${query}"`, icon: '🤖', link: `/ai-assistant?q=${encodeURIComponent(query)}`, desc: 'Instant AI tutoring & explanation' },
      { type: 'action', title: `Search Resources for "${query}"`, icon: '🔍', link: `/resources?q=${encodeURIComponent(query)}`, desc: 'Filter library resources' }
    ];

    return [...matchedCourses, ...quickActions];
  }, [query]);

  const handleSelect = (item) => {
    onClose();
    if (item.type === 'course') {
      navigate('/resources');
      // Dispatch event for resource page to open course
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-knowledge-course', { detail: item.data }));
      }, 100);
    } else if (item.link) {
      navigate(item.link);
    }
  };

  const handleKeyDownInInput = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(5, 5, 5, 0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: ' clamp(1rem, 5vw, 4rem) 1rem'
    }} onClick={onClose}>
      <div style={{
        background: '#131417', color: '#FFFFFF',
        border: '1px solid rgba(201, 150, 62, 0.35)',
        borderRadius: '16px', width: '100%', maxWidth: '640px',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
        animation: 'fadeIn 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Search Input Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <span style={{ fontSize: '1.2rem', color: '#C9963E' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInInput}
            placeholder="Search courses (e.g. NSC 301, CHM 101), AI tools, notes..."
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: '#FFFFFF', fontSize: '1rem', outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <span style={{
            background: 'rgba(255,255,255,0.06)', color: '#888888',
            fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            ESC
          </span>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem' }}>
          {results.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888888', fontSize: '0.9rem' }}>
              No matches found for "{query}". Try typing a course code like "BIO 101" or "NSC 301".
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1rem', borderRadius: '10px', cursor: 'pointer',
                    background: isSelected ? 'rgba(201, 150, 62, 0.14)' : 'transparent',
                    border: isSelected ? '1px solid rgba(201, 150, 62, 0.3)' : '1px solid transparent',
                    transition: 'all 0.12s ease'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isSelected ? '#FFFFFF' : '#E0E0E0' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: isSelected ? '#C9963E' : '#777777' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: '0.75rem', color: '#C9963E', fontWeight: 700 }}>
                      Jump ↵
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Command Palette Footer */}
        <div style={{
          padding: '0.65rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', fontSize: '0.75rem', color: '#777777'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span><kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>↑</kbd> <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>↓</kbd> Navigate</span>
            <span><kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>↵</kbd> Select</span>
          </div>
          <span style={{ color: '#C9963E', fontWeight: 600 }}>HackMyDegree Quick Navigator</span>
        </div>

      </div>
    </div>
  );
}
