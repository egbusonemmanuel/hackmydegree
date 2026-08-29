// src/pages/AIAssistantPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { AI_MODES, PRESET_PROMPT_CHIPS, sendAIMessage } from '../lib/ai';
import mammoth from 'mammoth';

export default function AIAssistantPage() {
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedMode, setSelectedMode] = useState('tutor');
    const [selectedLevel, setSelectedLevel] = useState('100L');
    const [courseCode, setCourseCode] = useState('');
    const [inputPrompt, setInputPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeProvider, setActiveProvider] = useState('DegreeAI Core');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem('hmd_degreeai_chat');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load chat history', e);
        }
        return [
            {
                id: 'welcome-msg',
                role: 'assistant',
                mode: 'tutor',
                provider: 'DegreeAI Academic Core',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                content: `### 🎓 Welcome to **DegreeAI** — Your 24/7 Academic Copilot!

I am specially trained to assist students across Nigerian universities with:
- 📚 **Exam Preparation & Past Question Solutions** (with marking schemes)
- 💡 **Simplifying Difficult Concepts** (*"Explain Like I'm in 100 Level"*)
- ⚡ **Condensing 50+ Page Handouts & Slides** into 5-minute revision sheets
- 🎯 **Generating Custom Practice Quizzes & MCQs**
- 💻 **Debugging Code & Solving Complex Math Proofs**

*Select a study mode from the left, pick a course prompt, or type your question below to get started!*`
            }
        ];
    });

    const chatEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Clean up any legacy user-entered API keys
    useEffect(() => {
        try {
            localStorage.removeItem('hmd_gemini_key');
        } catch (e) {
            // ignore
        }
    }, []);

    // Save chat to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('hmd_degreeai_chat', JSON.stringify(messages));
        } catch (e) {
            console.error('Failed to persist chat history', e);
        }
    }, [messages]);

    // Check if initial query or topic passed from URL state
    useEffect(() => {
        if (location.state?.initialPrompt) {
            const prompt = location.state.initialPrompt;
            const mode = location.state.mode || 'tutor';
            const course = location.state.courseCode || '';
            setSelectedMode(mode);
            if (course) setCourseCode(course);
            handleSend(prompt, mode, course);
            navigate('/ai-assistant', { replace: true, state: {} });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state]);

    const handleSend = async (customText = null, modeOverride = null, courseOverride = null) => {
        const textToSend = customText || inputPrompt;
        if (!textToSend.trim() || isLoading) return;

        const currentMode = modeOverride || selectedMode;
        const currentCourse = courseOverride !== null ? courseOverride : courseCode;
        
        let formattedPrompt = textToSend.trim();
        if (currentCourse.trim()) {
            formattedPrompt = `[Course: ${currentCourse.trim().toUpperCase()} | Level: ${selectedLevel}]\n${formattedPrompt}`;
        }

        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: textToSend.trim(),
            course: currentCourse.trim() ? currentCourse.trim().toUpperCase() : null,
            level: selectedLevel,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputPrompt('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        setIsLoading(true);

        try {
            const res = await sendAIMessage({
                prompt: formattedPrompt,
                mode: currentMode,
                conversationHistory: messages
            });

            const fullContent = res.content || '';
            const assistantId = (Date.now() + 1).toString();
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            setActiveProvider(res.provider);
            setIsLoading(false);

            // Stream chunk by chunk for fluid DegreeAI response experience
            if (fullContent.length > 50) {
                const chunkSize = Math.max(15, Math.floor(fullContent.length / 35));
                let currentIdx = chunkSize;

                const initialMsg = {
                    id: assistantId,
                    role: 'assistant',
                    mode: currentMode,
                    provider: res.provider,
                    content: fullContent.slice(0, currentIdx),
                    timestamp,
                    isStreaming: true
                };
                setMessages(prev => [...prev, initialMsg]);

                const streamInterval = setInterval(() => {
                    currentIdx += chunkSize;
                    if (currentIdx >= fullContent.length) {
                        clearInterval(streamInterval);
                        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: fullContent, isStreaming: false } : m));
                    } else {
                        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: fullContent.slice(0, currentIdx) } : m));
                    }
                }, 25);
            } else {
                setMessages(prev => [...prev, {
                    id: assistantId,
                    role: 'assistant',
                    mode: currentMode,
                    provider: res.provider,
                    content: fullContent,
                    timestamp,
                    isStreaming: false
                }]);
            }
        } catch (err) {
            console.error('[DegreeAI] Error getting AI response:', err);
            showToast(err?.message || 'Unable to complete AI query. Please try again.', 'error');
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClearChat = () => {
        if (window.confirm('Are you sure you want to clear this study session history?')) {
            localStorage.removeItem('hmd_degreeai_chat');
            setMessages([
                {
                    id: 'welcome-msg-reset',
                    role: 'assistant',
                    mode: selectedMode,
                    provider: 'DegreeAI Academic Core',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    content: `### 🎓 Session Cleared!\n\nReady for your next topic. Select a study mode or type a question to begin.`
                }
            ]);
            showToast('Chat history cleared', 'info');
        }
    };

    const fileInputRef = useRef(null);
    const [attachedFileName, setAttachedFileName] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            showToast('Please upload files under 10MB', 'error');
            return;
        }

        const isDocx = file.name.toLowerCase().endsWith('.docx') || file.type.includes('wordprocessingml');

        try {
            if (isDocx) {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                const cleanText = result?.value ? result.value.trim() : '';

                if (!cleanText) {
                    showToast('Could not extract readable text from this Word document.', 'warning');
                    return;
                }

                setAttachedFileName(file.name);
                setInputPrompt(prev => {
                    const prefix = prev ? `${prev}\n\n` : '';
                    return `${prefix}[Attached Lecture Notes / Handout: ${file.name}]\n${cleanText.slice(0, 15000)}`;
                });
                showToast(`Attached Word document "${file.name}"!`, 'success');
            } else {
                // Plain text, markdown, json, etc.
                const text = await file.text();
                setAttachedFileName(file.name);
                setInputPrompt(prev => {
                    const prefix = prev ? `${prev}\n\n` : '';
                    return `${prefix}[Attached Lecture Notes / Handout: ${file.name}]\n${text.slice(0, 15000)}`;
                });
                showToast(`Attached "${file.name}" to study prompt!`, 'success');
            }
        } catch (err) {
            console.error('File extraction error:', err);
            showToast('Failed to read document text. Please paste text directly.', 'error');
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    };

    const exportToPDF = (msg) => {
        const modeName = AI_MODES.find(m => m.id === msg.mode)?.name || 'Study Notes';
        const printWindow = window.open('', '_blank', 'width=800,height=900');
        if (!printWindow) {
            showToast('Pop-up blocked. Please allow pop-ups to print or save PDF.', 'warning');
            return;
        }

        const safeContent = (msg.content || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>HackMyDegree - ${modeName} Revision Sheet</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #111;
            padding: 36px;
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            border-bottom: 2px solid #d4a020;
            padding-bottom: 12px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo { font-size: 22px; font-weight: 900; color: #000; }
        .logo span { color: #d4a020; }
        .badge {
            font-size: 11px;
            font-weight: 700;
            background: #fff4d9;
            color: #946f00;
            padding: 4px 10px;
            border-radius: 20px;
            border: 1px solid #ffd880;
        }
        .content {
            font-size: 14px;
            white-space: pre-wrap;
            word-break: break-word;
        }
        .footer {
            margin-top: 40px;
            border-top: 1px solid #eee;
            padding-top: 12px;
            font-size: 11px;
            color: #777;
            text-align: center;
        }
        @media print {
            body { padding: 15px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="logo">HackMy<span>Degree</span></div>
            <div style="font-size: 12px; color: #666;">DegreeAI Academic Revision Sheet</div>
        </div>
        <div class="badge">${modeName} • ${msg.timestamp || ''}</div>
    </div>
    <div class="content">${safeContent}</div>
    <div class="footer">Generated by HackMyDegree · https://hackmydegree.ng · Your 24/7 Academic Copilot</div>
    <script>
        window.onload = () => { window.print(); };
    </script>
</body>
</html>`;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    // ─── INTERACTIVE QUIZ RENDERER ───
    const renderInteractiveQuiz = (text) => {
        const hasQuestions = /(?:\*\*Question|Question\s*\d+|\n\d+[.)]\s+)/i.test(text);
        const hasOptions = /(?:^|\n)\s*[A-Da-d][.)]/i.test(text);
        
        if (!hasQuestions || !hasOptions) {
            return null;
        }

        return <InteractiveQuizModule text={text} onCopy={copyToClipboard} onAskAi={handleSend} />;
    };

    // ─── INTERACTIVE FLASHCARDS RENDERER ───
    const renderInteractiveFlashcards = (text) => {
        if (!text.includes('**Card') && !text.includes('Front:') && !text.includes('Back:')) {
            return null;
        }
        return <InteractiveFlashcardsModule text={text} onCopy={copyToClipboard} />;
    };

    const formatMath = (value) => {
        let math = String(value || '').trim();
        const superscripts = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' };
        for (let pass = 0; pass < 6; pass += 1) {
            const next = math.replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1)/($2)');
            if (next === math) break;
            math = next;
        }
        return math
            .replace(/\\(?:left|right|displaystyle|bigl|bigr|Bigl|Bigr)/g, '')
            .replace(/\\(?:to|rightarrow)/g, '→')
            .replace(/\\(?:infty|infinity)/g, '∞')
            .replace(/\\pm/g, '±')
            .replace(/\\times|\\cdot/g, '×')
            .replace(/\\lim\s*_?\{?([^}]*)\}?/g, (_, condition) => `lim ${condition.replace(/\\(?:to|rightarrow)/g, '→')}`)
            .replace(/\\text\{([^}]*)\}/g, '$1')
            .replace(/\^\{?(-?\d+)\}?/g, (_, exponent) => exponent.split('').map((char) => superscripts[char] || char).join(''))
            .replace(/_\{([^}]*)\}/g, ' $1')
            .replace(/\\([a-zA-Z]+)/g, '$1')
            .replace(/[{}]/g, '')
            .replace(/\\_/g, '_')
            .replace(/\s{2,}/g, ' ')
            .trim();
    };

    // Render formatted markdown-like text
    const renderFormattedText = (rawText, mode = null) => {
        if (!rawText) return null;

        // Check if this is a specialized Quiz or Flashcard mode
        if (mode === 'quiz' || /(?:\*\*Question|Question\s*\d+)/i.test(rawText)) {
            const quizView = renderInteractiveQuiz(rawText);
            if (quizView) return quizView;
        }

        if (mode === 'flashcards' || (rawText.includes('**Card') && rawText.includes('Front:'))) {
            const flashcardView = renderInteractiveFlashcards(rawText);
            if (flashcardView) return flashcardView;
        }

        // Split by code blocks first
        const parts = rawText.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const lines = part.slice(3, -3).trim().split('\n');
                const firstLine = lines[0].trim();
                const hasLang = !firstLine.includes(' ') && firstLine.length > 0;
                const lang = hasLang ? firstLine : 'code';
                const codeBody = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

                return (
                    <div key={index} style={{
                        margin: '1rem 0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#0d1117',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.4rem 1rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            fontSize: '0.78rem',
                            fontFamily: 'monospace',
                            color: 'var(--primary)'
                        }}>
                            <span>{lang.toUpperCase()}</span>
                            <button
                                onClick={() => copyToClipboard(codeBody)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--on-surface-variant)',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px'
                                }}
                            >
                                📋 Copy
                            </button>
                        </div>
                        <pre style={{
                            margin: 0,
                            padding: '1rem',
                            overflowX: 'auto',
                            color: '#e6edf3',
                            fontSize: '0.88rem',
                            lineHeight: 1.5,
                            fontFamily: 'Consolas, Monaco, "Courier New", monospace'
                        }}>
                            <code>{codeBody}</code>
                        </pre>
                    </div>
                );
            }

            // Preserve display equations as their own readable study-note blocks.
            const normalizedPart = part
                .replace(/\\\[([\s\S]*?)\\\]/g, '\n$$$1$$\n')
                .replace(/\$\$([\s\S]*?)\$\$/g, '\n§§MATH§§$1\n');
            const lines = normalizedPart.split('\n');
            return (
                <div key={index} style={{ lineHeight: 1.65 }}>
                    {lines.map((line, lIdx) => {
                        const trimmed = line.trim().replace(/^(\d+)\\\.\s*/, '$1. ');

                        if (trimmed.startsWith('§§MATH§§')) {
                            return (
                                <div key={lIdx} style={{
                                    margin: '0.9rem 0', padding: '0.75rem 1rem', overflowX: 'auto',
                                    background: 'var(--surface-variant)', borderLeft: '4px solid var(--primary)',
                                    borderRadius: '0 10px 10px 0', fontFamily: 'Cambria Math, Cambria, serif',
                                    fontSize: '1.05rem', color: 'var(--on-surface)'
                                }}>
                                    {formatMath(trimmed.slice('§§MATH§§'.length))}
                                </div>
                            );
                        }

                        if (trimmed.startsWith('### ')) {
                            return (
                                <h3 key={lIdx} style={{
                                    color: 'var(--primary)',
                                    fontSize: '1.2rem',
                                    fontWeight: 800,
                                    margin: '1.2rem 0 0.5rem',
                                    borderBottom: '1px solid var(--outline-variant)',
                                    paddingBottom: '0.3rem'
                                }}>
                                    {parseInlineStyles(trimmed.replace('### ', ''))}
                                </h3>
                            );
                        }
                        if (trimmed.startsWith('#### ')) {
                            return (
                                <h4 key={lIdx} style={{
                                    color: 'var(--on-surface)',
                                    fontSize: '1.05rem',
                                    fontWeight: 700,
                                    margin: '1rem 0 0.4rem'
                                }}>
                                    {parseInlineStyles(trimmed.replace('#### ', ''))}
                                </h4>
                            );
                        }
                        if (trimmed.startsWith('> ')) {
                            return (
                                <blockquote key={lIdx} style={{
                                    margin: '0.6rem 0',
                                    padding: '0.6rem 1rem',
                                    borderLeft: '4px solid var(--primary)',
                                    background: 'var(--surface-variant)',
                                    borderRadius: '0 8px 8px 0',
                                    fontStyle: 'italic',
                                    color: 'var(--on-surface)'
                                }}>
                                    {trimmed.replace('> ', '')}
                                </blockquote>
                            );
                        }
                        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                            return (
                                <div key={lIdx} style={{ display: 'flex', gap: '0.5rem', margin: '0.3rem 0', paddingLeft: '0.5rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>•</span>
                                    <span>{parseInlineStyles(trimmed.slice(2))}</span>
                                </div>
                            );
                        }
                        if (/^\d+\.\s+/.test(trimmed)) {
                            const [, number, content] = trimmed.match(/^(\d+)\.\s+([\s\S]*)$/);
                            return (
                                <div key={lIdx} style={{ display: 'flex', gap: '0.55rem', margin: '0.35rem 0', paddingLeft: '0.35rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{number}.</span>
                                    <span>{parseInlineStyles(content)}</span>
                                </div>
                            );
                        }
                        if (trimmed.startsWith('---')) {
                            return <hr key={lIdx} style={{ border: 'none', borderTop: '1px solid var(--outline-variant)', margin: '1rem 0' }} />;
                        }
                        if (!trimmed) {
                            return <div key={lIdx} style={{ height: '0.5rem' }} />;
                        }
                        return (
                            <p key={lIdx} style={{ margin: '0.35rem 0' }}>
                                {parseInlineStyles(line)}
                            </p>
                        );
                    })}
                </div>
            );
        });
    };

    // Helper for bold, italics, inline code, and highlights
    const parseInlineStyles = (text) => {
        // Simple parser for bold, code, and inline math.
        const chunks = text.split(/(\*\*.*?\*\*|`.*?`|\$[^$]+\$)/g);
        return chunks.map((chunk, idx) => {
            if (chunk.startsWith('**') && chunk.endsWith('**')) {
                return <strong key={idx} style={{ color: 'var(--primary)', fontWeight: 700 }}>{chunk.slice(2, -2)}</strong>;
            }
            if (chunk.startsWith('`') && chunk.endsWith('`')) {
                return (
                    <code key={idx} style={{
                        background: 'var(--surface-variant)',
                        color: 'var(--secondary)',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.85em',
                        fontFamily: 'monospace'
                    }}>
                        {chunk.slice(1, -1)}
                    </code>
                );
            }
            if (chunk.startsWith('$') && chunk.endsWith('$')) {
                return <span key={idx} style={{ fontFamily: 'Cambria Math, Cambria, serif', color: 'var(--secondary)', fontWeight: 600 }}>{formatMath(chunk.slice(1, -1))}</span>;
            }
            return chunk;
        });
    };

    return (
        <div style={{
            display: 'flex',
            height: 'calc(100vh - 72px)',
            background: 'var(--background)',
            overflow: 'hidden',
            fontFamily: 'var(--font-body)'
        }}>
            {/* ─── LEFT SIDEBAR: STUDY MODES & TOOLS ─── */}
            <aside style={{
                width: '320px',
                borderRight: '1px solid var(--outline-variant)',
                background: 'var(--surface)',
                display: mobileSidebarOpen || (typeof window !== 'undefined' && window.innerWidth > 768) ? 'flex' : 'none',
                flexDirection: 'column',
                overflowY: 'auto',
                flexShrink: 0,
                padding: '1.25rem',
                boxSizing: 'border-box',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#000', fontWeight: 900, fontSize: '1.1rem',
                            boxShadow: '0 4px 12px rgba(212, 160, 32, 0.3)'
                        }}>
                            ⚡
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--on-surface)' }}>
                                Degree<span style={{ color: 'var(--primary)' }}>AI</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                                24/7 Academic Copilot
                            </div>
                        </div>
                    </div>
                </div>

                {/* Level & Course Code Filters */}
                <div style={{
                    background: 'var(--surface-variant)',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    marginBottom: '1.25rem',
                    border: '1px solid var(--outline-variant)',
                    boxSizing: 'border-box',
                    width: '100%'
                }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🎯 Academic Context
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', width: '100%', boxSizing: 'border-box' }}>
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            style={{
                                flex: '1 1 55%',
                                minWidth: 0,
                                background: 'var(--surface)',
                                color: 'var(--on-surface)',
                                border: '1px solid var(--outline-variant)',
                                borderRadius: '8px',
                                padding: '0.4rem 0.4rem',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        >
                            <option value="100L">100 Level</option>
                            <option value="200L">200 Level</option>
                            <option value="300L">300 Level</option>
                            <option value="400L">400 Level</option>
                            <option value="500L">500 Level</option>
                        </select>

                        <input
                            type="text"
                            placeholder="MTH101"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            style={{
                                flex: '1 1 45%',
                                minWidth: 0,
                                background: 'var(--surface)',
                                color: 'var(--on-surface)',
                                border: '1px solid var(--outline-variant)',
                                borderRadius: '8px',
                                padding: '0.4rem 0.5rem',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', lineHeight: 1.3 }}>
                        Context helps DegreeAI align answers with your syllabus.
                    </div>
                </div>

                {/* Study Modes */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🧠 Study Modes
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {AI_MODES.map((mode) => {
                            const isSelected = selectedMode === mode.id;
                            return (
                                <button
                                    key={mode.id}
                                    onClick={() => setSelectedMode(mode.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.65rem 0.8rem',
                                        borderRadius: '10px',
                                        border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                                        background: isSelected ? 'rgba(212, 160, 32, 0.12)' : 'transparent',
                                        color: isSelected ? 'var(--primary)' : 'var(--on-surface)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <span style={{ fontSize: '1.1rem' }}>{mode.icon}</span>
                                        <div>
                                            <div style={{ fontWeight: isSelected ? 800 : 600, fontSize: '0.85rem' }}>
                                                {mode.name}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        padding: '0.15rem 0.45rem',
                                        borderRadius: '100px',
                                        background: isSelected ? 'var(--primary)' : 'var(--surface-variant)',
                                        color: isSelected ? '#000' : 'var(--on-surface-variant)'
                                    }}>
                                        {mode.badge}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Preset Prompt Chips */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        💡 Quick High-Yield Prompts
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {PRESET_PROMPT_CHIPS.map((chip, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setSelectedMode(chip.mode);
                                    handleSend(chip.prompt, chip.mode);
                                }}
                                style={{
                                    padding: '0.5rem 0.7rem',
                                    borderRadius: '8px',
                                    background: 'var(--surface-variant)',
                                    border: '1px solid var(--outline-variant)',
                                    color: 'var(--on-surface)',
                                    fontSize: '0.78rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    lineHeight: 1.3
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                    e.currentTarget.style.transform = 'translateX(2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--outline-variant)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bottom Actions */}
                <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={handleClearChat}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '8px',
                            background: 'transparent',
                            border: '1px solid rgba(255, 82, 82, 0.3)',
                            color: '#FF5252',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        🗑️ Reset Chat
                    </button>
                </div>
            </aside>

            {/* ─── MAIN CHAT AREA ─── */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--background)',
                position: 'relative'
            }}>
                {/* Chat Header Bar */}
                <div style={{
                    padding: '0.85rem 1.5rem',
                    borderBottom: '1px solid var(--outline-variant)',
                    background: 'var(--surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                            title="Toggle Study Modes"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--surface-variant)',
                                border: '1px solid var(--outline-variant)',
                                color: 'var(--on-surface)',
                                borderRadius: '8px',
                                padding: '0.4rem 0.6rem',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                fontWeight: 700
                            }}
                        >
                            ☰ <span style={{ marginLeft: '0.35rem', fontSize: '0.75rem' }}>Modes</span>
                        </button>
                        <span style={{ fontSize: '1.25rem' }}>
                            {AI_MODES.find(m => m.id === selectedMode)?.icon}
                        </span>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--on-surface)' }}>
                                {AI_MODES.find(m => m.id === selectedMode)?.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                                {AI_MODES.find(m => m.id === selectedMode)?.description}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.6rem',
                            borderRadius: '100px',
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                        }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                            {activeProvider}
                        </span>
                    </div>
                </div>

                {/* Messages Container */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem'
                }}>
                    {messages.map((msg) => {
                        const isUser = msg.role === 'user';
                        return (
                            <div
                                key={msg.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                                    gap: '0.75rem',
                                    maxWidth: '100%'
                                }}
                            >
                                {!isUser && (
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#000', fontWeight: 900, fontSize: '1rem', flexShrink: 0,
                                        marginTop: '0.2rem'
                                    }}>
                                        ⚡
                                    </div>
                                )}

                                <div style={{
                                    maxWidth: isUser ? '75%' : '85%',
                                    background: isUser ? 'var(--primary)' : 'var(--surface)',
                                    color: isUser ? '#000' : 'var(--on-surface)',
                                    padding: '1.1rem 1.4rem',
                                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    border: isUser ? 'none' : '1px solid var(--outline-variant)',
                                    boxShadow: isUser ? '0 4px 15px rgba(212, 160, 32, 0.25)' : '0 2px 10px rgba(0,0,0,0.05)',
                                    position: 'relative'
                                }}>
                                    {/* Message Meta Info */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        color: isUser ? 'rgba(0,0,0,0.6)' : 'var(--on-surface-variant)',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span>
                                            {isUser ? (
                                                `You ${msg.course ? `• [${msg.course} - ${msg.level}]` : ''}`
                                            ) : (
                                                `DegreeAI • ${AI_MODES.find(m => m.id === msg.mode)?.name || 'Tutor'}`
                                            )}
                                        </span>
                                        <span>{msg.timestamp}</span>
                                    </div>

                                    {/* Content Body */}
                                    <div style={{ fontSize: '0.94rem' }}>
                                        {isUser ? msg.content : (
                                            <>
                                                {renderFormattedText(msg.content, msg.mode)}
                                                {msg.isStreaming && (
                                                    <span style={{
                                                        display: 'inline-block',
                                                        width: '7px',
                                                        height: '14px',
                                                        background: 'var(--primary)',
                                                        marginLeft: '4px',
                                                        verticalAlign: 'baseline',
                                                        borderRadius: '2px',
                                                        animation: 'pulse 0.8s infinite'
                                                    }} />
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Action buttons on assistant messages */}
                                    {!isUser && !msg.isStreaming && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                            marginTop: '1rem',
                                            paddingTop: '0.75rem',
                                            borderTop: '1px solid var(--outline-variant)',
                                            fontSize: '0.78rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <button
                                                onClick={() => copyToClipboard(msg.content)}
                                                style={{
                                                    background: 'var(--surface-variant)',
                                                    border: '1px solid var(--outline-variant)',
                                                    borderRadius: '6px',
                                                    padding: '0.25rem 0.6rem',
                                                    cursor: 'pointer',
                                                    color: 'var(--on-surface)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.3rem'
                                                }}
                                            >
                                                📋 Copy Notes
                                            </button>
                                            <button
                                                onClick={() => exportToPDF(msg)}
                                                title="Print or Save as Revision PDF"
                                                style={{
                                                    background: 'var(--surface-variant)',
                                                    border: '1px solid var(--outline-variant)',
                                                    borderRadius: '6px',
                                                    padding: '0.25rem 0.6rem',
                                                    cursor: 'pointer',
                                                    color: 'var(--on-surface)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.3rem'
                                                }}
                                            >
                                                📥 Export PDF
                                            </button>
                                            <button
                                                onClick={() => handleSend(`Can you break down the solution above even further with more simple examples?`, 'eli100l')}
                                                style={{
                                                    background: 'var(--surface-variant)',
                                                    border: '1px solid var(--outline-variant)',
                                                    borderRadius: '6px',
                                                    padding: '0.25rem 0.6rem',
                                                    cursor: 'pointer',
                                                    color: 'var(--on-surface)'
                                                }}
                                            >
                                                💡 Simplify Further
                                            </button>
                                            <button
                                                onClick={() => handleSend(`Generate 3 practice exam questions with answers testing the concepts discussed above.`, 'quiz')}
                                                style={{
                                                    background: 'var(--surface-variant)',
                                                    border: '1px solid var(--outline-variant)',
                                                    borderRadius: '6px',
                                                    padding: '0.25rem 0.6rem',
                                                    cursor: 'pointer',
                                                    color: 'var(--on-surface)'
                                                }}
                                            >
                                                🎯 Test Me on This
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {isLoading && (
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#000', fontWeight: 900, fontSize: '1rem', flexShrink: 0
                            }}>
                                ⚡
                            </div>
                            <div style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--outline-variant)',
                                padding: '1rem 1.4rem',
                                borderRadius: '18px 18px 18px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                color: 'var(--on-surface-variant)',
                                fontSize: '0.88rem'
                            }}>
                                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⌛</span>
                                DegreeAI is synthesizing your academic solution...
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* Quick Action Study Bar */}
                <div style={{
                    padding: '0.4rem 1.5rem',
                    background: 'var(--surface)',
                    borderTop: '1px solid var(--outline-variant)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    overflowX: 'auto',
                    scrollbarWidth: 'none'
                }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', flexShrink: 0 }}>
                        ⚡ Quick Tools:
                    </span>
                    <button
                        onClick={() => {
                            setSelectedMode('quiz');
                            setInputPrompt('Generate a 5-question multiple choice practice quiz from my lecture notes/topic with full explanations: ');
                            textareaRef.current?.focus();
                        }}
                        style={{
                            padding: '0.3rem 0.65rem', borderRadius: '8px',
                            background: 'var(--surface-variant)', border: '1px solid var(--outline-variant)',
                            color: 'var(--on-surface)', fontSize: '0.75rem', fontWeight: 600,
                            cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}
                    >
                        🎯 Generate Quiz
                    </button>
                    <button
                        onClick={() => {
                            setSelectedMode('notes_helper');
                            setInputPrompt('Please organize my lecture notes into a structured study guide with key definitions, formulas, and potential exam questions:\n\n');
                            textareaRef.current?.focus();
                        }}
                        style={{
                            padding: '0.3rem 0.65rem', borderRadius: '8px',
                            background: 'var(--surface-variant)', border: '1px solid var(--outline-variant)',
                            color: 'var(--on-surface)', fontSize: '0.75rem', fontWeight: 600,
                            cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}
                    >
                        📚 Structure Notes
                    </button>
                    <button
                        onClick={() => {
                            setSelectedMode('flashcards');
                            setInputPrompt('Create 6 active recall flashcards from my notes with Front, Back, and Exam Tips:\n\n');
                            textareaRef.current?.focus();
                        }}
                        style={{
                            padding: '0.3rem 0.65rem', borderRadius: '8px',
                            background: 'var(--surface-variant)', border: '1px solid var(--outline-variant)',
                            color: 'var(--on-surface)', fontSize: '0.75rem', fontWeight: 600,
                            cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}
                    >
                        🃏 Make Flashcards
                    </button>
                    <button
                        onClick={() => {
                            setSelectedMode('summarizer');
                            setInputPrompt('Summarize this handout into a 5-minute high-yield exam revision sheet:\n\n');
                            textareaRef.current?.focus();
                        }}
                        style={{
                            padding: '0.3rem 0.65rem', borderRadius: '8px',
                            background: 'var(--surface-variant)', border: '1px solid var(--outline-variant)',
                            color: 'var(--on-surface)', fontSize: '0.75rem', fontWeight: 600,
                            cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}
                    >
                        ⚡ 5-Min Summary
                    </button>
                </div>

                {/* Input Form Bar */}
                <div style={{
                    padding: '0.85rem 1.5rem 1rem',
                    background: 'var(--surface)',
                    borderTop: '1px solid var(--outline-variant)'
                }}>
                    {attachedFileName && (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.25rem 0.6rem', background: 'rgba(212, 160, 32, 0.15)',
                            border: '1px solid var(--primary)', borderRadius: '6px',
                            fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 700
                        }}>
                            <span>📎 Notes Attached: {attachedFileName}</span>
                            <button
                                onClick={() => setAttachedFileName(null)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 900 }}
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '0.6rem',
                        background: 'var(--surface-variant)',
                        border: '1px solid var(--outline-variant)',
                        borderRadius: '16px',
                        padding: '0.6rem 0.8rem',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                    }}>
                        {/* Hidden file input for uploading notes */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".txt,.md,.doc,.docx,.pdf,.json"
                            style={{ display: 'none' }}
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            title="Attach Lecture Notes or Handout (.txt, .md, .doc)"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--on-surface-variant)',
                                cursor: 'pointer',
                                padding: '0.4rem',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.15rem',
                                transition: 'all 0.15s'
                            }}
                            onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--on-surface-variant)'}
                        >
                            📎
                        </button>

                        <textarea
                            ref={textareaRef}
                            value={inputPrompt}
                            onChange={(e) => {
                                setInputPrompt(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={`Ask DegreeAI anything (${courseCode ? courseCode.toUpperCase() : 'Paste notes, ask for past questions, generate quiz, or solve equations...'})`}
                            rows={1}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                resize: 'none',
                                color: 'var(--on-surface)',
                                fontSize: '0.92rem',
                                fontFamily: 'inherit',
                                lineHeight: 1.4,
                                maxHeight: '150px'
                            }}
                        />

                        <button
                            onClick={() => handleSend()}
                            disabled={!inputPrompt.trim() || isLoading}
                            style={{
                                background: inputPrompt.trim() && !isLoading ? 'var(--primary)' : 'var(--outline-variant)',
                                color: inputPrompt.trim() && !isLoading ? '#000' : 'var(--on-surface-variant)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.6rem 1.2rem',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                cursor: inputPrompt.trim() && !isLoading ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                            }}
                        >
                            <span>Send</span>
                            <span>🚀</span>
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '0.5rem',
                        fontSize: '0.72rem',
                        color: 'var(--on-surface-variant)'
                    }}>
                        <span>Press <strong>Enter</strong> to send • <strong>Shift + Enter</strong> for new line • 📎 to attach notes</span>
                        <span>Mode: <strong>{AI_MODES.find(m => m.id === selectedMode)?.name}</strong></span>
                    </div>
                </div>
            </main>
        </div>
    );
}

// ─── INTERACTIVE QUIZ MODULE COMPONENT ───
function InteractiveQuizModule({ text, onCopy, onAskAi }) {
    const [userAnswers, setUserAnswers] = useState({});

    const questions = React.useMemo(() => {
        const rawBlocks = text.split(/(?=\*\*Question\s*\d+|Question\s*\d+|\n\d+[.)]\s+)/i);
        const parsed = [];

        rawBlocks.forEach((block, idx) => {
            if (!block.trim()) return;

            const qMatch = block.match(/(?:\*\*Question\s*\d+[:.]?|Question\s*\d+[:.]?|\d+[.)])\s*([^\n\r*]+)/i);
            const questionText = qMatch ? qMatch[1].replace(/\*\*/g, '').trim() : null;

            const optA = block.match(/(?:^|\n)\s*(?:[Aa]\)|\([Aa]\)|[Aa]\.)\s*([^\n\r]+)/)?.[1]?.replace(/\*\*/g, '').trim();
            const optB = block.match(/(?:^|\n)\s*(?:[Bb]\)|\([Bb]\)|[Bb]\.)\s*([^\n\r]+)/)?.[1]?.replace(/\*\*/g, '').trim();
            const optC = block.match(/(?:^|\n)\s*(?:[Cc]\)|\([Cc]\)|[Cc]\.)\s*([^\n\r]+)/)?.[1]?.replace(/\*\*/g, '').trim();
            const optD = block.match(/(?:^|\n)\s*(?:[Dd]\)|\([Dd]\)|[Dd]\.)\s*([^\n\r]+)/)?.[1]?.replace(/\*\*/g, '').trim();

            const ansMatch = block.match(/(?:Correct Answer|Answer|Option)[:\s*]+([A-Da-d])/i);
            const correctAnswer = ansMatch ? ansMatch[1].toUpperCase() : null;

            const expMatch = block.match(/(?:Explanation|Reason|Why)[:\s*]+([^\n\r>]+)/i);
            const explanation = expMatch ? expMatch[1].trim() : null;

            if (questionText && optA && optB) {
                parsed.push({
                    id: idx,
                    question: questionText,
                    options: { A: optA, B: optB, C: optC || '', D: optD || '' },
                    correctAnswer: correctAnswer || 'A',
                    explanation: explanation || 'Refer to standard lecture notes for full derivation.'
                });
            }
        });

        return parsed;
    }, [text]);

    if (questions.length === 0) {
        return <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{text}</div>;
    }

    const answeredCount = Object.keys(userAnswers).length;
    const correctCount = Object.entries(userAnswers).filter(([qId, ans]) => {
        const q = questions.find(item => item.id.toString() === qId.toString());
        return q && q.correctAnswer === ans;
    }).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Quiz Header with live score */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.85rem 1.1rem', background: 'var(--surface-variant)',
                borderRadius: '14px', border: '1px solid var(--outline-variant)', flexWrap: 'wrap', gap: '0.6rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>🎯</span>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>
                            Interactive Practice Quiz ({questions.length} Questions)
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)' }}>
                            Select your answers below to test your mastery in real-time!
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '0.4rem 0.9rem', borderRadius: '100px',
                    background: answeredCount > 0 ? (correctCount === questions.length ? 'rgba(34, 197, 94, 0.2)' : 'rgba(212, 160, 32, 0.2)') : 'var(--surface)',
                    border: '1px solid var(--outline-variant)', fontWeight: 800, fontSize: '0.85rem',
                    color: answeredCount > 0 ? (correctCount === questions.length ? '#22c55e' : 'var(--primary)') : 'var(--on-surface)'
                }}>
                    Score: {correctCount} / {answeredCount} ({questions.length} Questions)
                </div>
            </div>

            {/* Questions List */}
            {questions.map((q, qIndex) => {
                const userChoice = userAnswers[q.id];
                const isAnswered = !!userChoice;
                const isCorrect = userChoice === q.correctAnswer;

                return (
                    <div key={q.id} style={{
                        padding: '1.1rem', background: 'var(--surface)',
                        borderRadius: '16px', border: '1px solid var(--outline-variant)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ fontWeight: 700, fontSize: '0.94rem', marginBottom: '0.85rem', color: 'var(--on-surface)', lineHeight: 1.45 }}>
                            <span style={{ color: 'var(--primary)', marginRight: '0.4rem', fontWeight: 900 }}>Q{qIndex + 1}.</span>
                            {q.question}
                        </div>

                        {/* Options */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                            {['A', 'B', 'C', 'D'].map((letter) => {
                                const optText = q.options[letter];
                                if (!optText) return null;

                                const isSelected = userChoice === letter;
                                const isThisCorrect = q.correctAnswer === letter;

                                let btnBg = 'var(--surface-variant)';
                                let btnBorder = 'var(--outline-variant)';
                                let btnColor = 'var(--on-surface)';

                                if (isAnswered) {
                                    if (isThisCorrect) {
                                        btnBg = 'rgba(34, 197, 94, 0.15)';
                                        btnBorder = '#22c55e';
                                        btnColor = '#22c55e';
                                    } else if (isSelected && !isThisCorrect) {
                                        btnBg = 'rgba(239, 68, 68, 0.15)';
                                        btnBorder = '#ef4444';
                                        btnColor = '#ef4444';
                                    }
                                }

                                return (
                                    <button
                                        key={letter}
                                        onClick={() => {
                                            if (!userAnswers[q.id]) {
                                                setUserAnswers(prev => ({ ...prev, [q.id]: letter }));
                                            }
                                        }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.7rem 0.9rem', borderRadius: '10px',
                                            background: btnBg, border: `1px solid ${btnBorder}`,
                                            color: btnColor, cursor: isAnswered ? 'default' : 'pointer',
                                            textAlign: 'left', fontSize: '0.86rem', transition: 'all 0.15s ease',
                                            fontWeight: isSelected || (isAnswered && isThisCorrect) ? 700 : 500
                                        }}
                                    >
                                        <span style={{
                                            width: '24px', height: '24px', borderRadius: '6px',
                                            background: isAnswered && isThisCorrect ? '#22c55e' : (isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.08)'),
                                            color: isAnswered && isThisCorrect ? '#fff' : (isSelected ? '#000' : 'var(--on-surface)'),
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.78rem', fontWeight: 800, flexShrink: 0
                                        }}>
                                            {letter}
                                        </span>
                                        <span style={{ flex: 1 }}>{optText}</span>
                                        {isAnswered && isThisCorrect && <span>✅</span>}
                                        {isAnswered && isSelected && !isThisCorrect && <span>❌</span>}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation Box */}
                        {isAnswered && (
                            <div style={{
                                marginTop: '0.9rem', padding: '0.8rem 1rem',
                                background: isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                borderLeft: `4px solid ${isCorrect ? '#22c55e' : '#ef4444'}`,
                                borderRadius: '0 10px 10px 0', fontSize: '0.84rem', lineHeight: 1.5
                            }}>
                                <div style={{ fontWeight: 800, marginBottom: '0.25rem', color: isCorrect ? '#22c55e' : '#ef4444' }}>
                                    {isCorrect ? '🎉 Correct Answer!' : `❌ Incorrect (Correct Option: ${q.correctAnswer})`}
                                </div>
                                <div style={{ color: 'var(--on-surface)' }}>
                                    {q.explanation}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── INTERACTIVE FLASHCARDS MODULE COMPONENT ───
function InteractiveFlashcardsModule({ text, onCopy }) {
    const [flipped, setFlipped] = useState({});

    const cards = React.useMemo(() => {
        const blocks = text.split(/(?=\*\*Card\s+\d+|Card\s+\d+:)/i);
        const parsed = [];

        blocks.forEach((block, idx) => {
            if (!block.trim()) return;

            const frontMatch = block.match(/(?:Front:\s*\*?\*?)([^\n\r]+)/i);
            const backMatch = block.match(/(?:Back:\s*\*?\*?)([^\n\r]+)/i);
            const tipMatch = block.match(/(?:Exam Tip:\s*\*?\*?|Tip:\s*\*?\*?)([^\n\r]+)/i);

            if (frontMatch && backMatch) {
                parsed.push({
                    id: idx,
                    front: frontMatch[1].trim(),
                    back: backMatch[1].trim(),
                    tip: tipMatch ? tipMatch[1].trim() : null
                });
            }
        });

        return parsed;
    }, [text]);

    if (cards.length === 0) {
        return <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{text}</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.65rem 1rem', background: 'var(--surface-variant)',
                borderRadius: '10px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700
            }}>
                <span>🃏</span>
                <span>Active Recall Flashcards ({cards.length} Cards) — Click any card to flip & reveal the answer</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {cards.map((c, cardIdx) => {
                    const isFlipped = !!flipped[c.id];
                    return (
                        <div
                            key={c.id}
                            onClick={() => setFlipped(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                            style={{
                                background: isFlipped ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.08), var(--surface))' : 'var(--surface)',
                                border: isFlipped ? '1px solid #22c55e' : '1px solid var(--outline-variant)',
                                borderRadius: '16px', padding: '1.2rem', cursor: 'pointer',
                                transition: 'all 0.2s ease', boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                minHeight: '170px'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: 'var(--on-surface-variant)', marginBottom: '0.6rem' }}>
                                    <span>CARD #{cardIdx + 1} • {isFlipped ? '💡 ANSWER' : '❓ PROMPT'}</span>
                                    <span style={{ color: 'var(--primary)' }}>{isFlipped ? '↺ Flip back' : '↻ Click to flip'}</span>
                                </div>
                                <div style={{ fontSize: '0.92rem', fontWeight: isFlipped ? 500 : 700, color: 'var(--on-surface)', lineHeight: 1.45 }}>
                                    {isFlipped ? c.back : c.front}
                                </div>
                            </div>

                            {isFlipped && c.tip && (
                                <div style={{
                                    marginTop: '0.75rem', paddingTop: '0.5rem',
                                    borderTop: '1px dashed var(--outline-variant)',
                                    fontSize: '0.75rem', color: 'var(--primary)', fontStyle: 'italic'
                                }}>
                                    ⚡ <strong>Exam Tip:</strong> {c.tip}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
