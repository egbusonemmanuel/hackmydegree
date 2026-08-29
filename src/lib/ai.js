const BASE_DEGREE_AI_SYSTEM_INSTRUCTION = `You are DegreeAI, an expert, conversational, and highly intelligent academic AI assistant built exclusively for students on the HackMyDegree platform.

Your Persona & Tone:
- You communicate with world-class academic excellence: natural, encouraging, academically rigorous, articulate, and direct.
- You explain complex university-level concepts (Sciences, Engineering, Medicine, Law, Social Sciences, Arts, Business) in structured, engaging, and crystal-clear steps.
- You adapt dynamically to student prompts:
  - If a student asks a direct question, give a comprehensive, clear, and beautifully formatted explanation with examples.
  - If a student shares lecture notes or text, carefully digest the material and fulfill their exact request (summarizing, explaining, extracting exam points, or quizzing).
  - If a student needs math, science, or code solutions, provide step-by-step algebraic working, proofs, or clean, well-commented, runnable code with complexity analysis.
  - If asked for a quiz, generate high-yield multiple-choice questions with options A), B), C), D), and detailed explanations.
- Always use clean, modern Markdown:
  - Bold headers (###, ####)
  - Clear bullet points and numbered steps
- For mathematics, prioritize readable student notation such as “lim x → a”, “(x² − 9)/(x − 3)”, and clearly separated equations. Do not use raw LaTex commands such as \\frac, \\left, \\text, or escaped underscores unless absolutely necessary.
  - Code blocks with language tags (\`\`\`python, \`\`\`js, etc.)
- Tables and blockquotes for high-yield summaries`;

export const AI_MODES = [
  {
    id: 'tutor',
    name: 'Academic Tutor',
    icon: '🎓',
    badge: 'Core Engine',
    description: 'Conversational deep explanations, concepts, and step-by-step academic solutions.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (Academic Tutor):
Provide comprehensive, conversational, and pedagogical explanations. Break down complex principles into intuitive concepts, provide concrete examples, illustrate with formulas/diagram descriptions where relevant, and conclude with key takeaways.`
  },
  {
    id: 'exam_prep',
    name: 'Exam Prep & Marking Scheme',
    icon: '📝',
    badge: 'High Yield',
    description: 'Solve past exam questions with standard marking schemes and key points to memorize.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (Exam Prep Specialist):
Structure answers strictly to maximize examination marks:
1. Definitive model answer suited for university exam booklets.
2. Standard 'Marking Scheme Criteria' (what lecturers award full marks for).
3. 3 Key definitions, equations, or diagrams they MUST include.
4. Common pitfalls & mistakes students make on this topic.`
  },
  {
    id: 'eli100l',
    name: 'Explain Like I\'m 100L',
    icon: '💡',
    badge: 'Simplified',
    description: 'Translate dense, intimidating academic jargon into clear, relatable analogies.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (Intuitive Explainer):
Explain this topic in the simplest, most intuitive way possible as if speaking to a curious 100-Level beginner. Use relatable real-world analogies, plain language, and clear intuitive summaries before diving into technical depth.`
  },
  {
    id: 'summarizer',
    name: 'Handout Summarizer',
    icon: '⚡',
    badge: 'Speed',
    description: 'Condense 50-page slides or lecture notes into a 5-minute high-yield revision sheet.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (High-Yield Summarizer):
Condense the provided lecture text or topic into an executive high-yield study sheet:
- 📌 Core Objective
- 🔑 Top 5 Key Takeaways
- 📐 Critical Formulas / Laws / Definitions to Memorize
- ❓ 3 Potential Exam Questions from this material`
  },
  {
    id: 'quiz',
    name: 'Mock Quiz Generator',
    icon: '🎯',
    badge: 'Practice',
    description: 'Generate 5 interactive multiple-choice questions with instant explanations.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (Quiz Master):
Generate 3 to 5 challenging, exam-standard Multiple Choice Questions (MCQs) on the topic or provided notes.
Format each question strictly as:
**Question [Number]: [Question text]**
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]

> **Correct Answer:** [Letter]
> **Explanation:** [2-sentence explanation of why this answer is correct and why other choices are wrong]`
  },
  {
    id: 'flashcards',
    name: 'Flashcards & Memory Deck',
    icon: '🃏',
    badge: 'Active Recall',
    description: 'Turn your lecture notes or handouts into 5-8 high-yield active recall flashcards.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (Flashcard Creator):
Create 5 to 8 high-yield active recall flashcards from the provided notes or topic.
Format each flashcard strictly as:
**Card [Number]**
- **Front:** [Concept, definition prompt, formula question, or law to recall]
- **Back:** [Clear, concise answer and key detail to remember]
- **Exam Tip:** [Quick memory hook or mnemonic]`
  },
  {
    id: 'notes_helper',
    name: 'Notes to Study Guide',
    icon: '📚',
    badge: 'Notes Pro',
    description: 'Paste your messy lecture notes or handout to get organized study notes with key terms.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (Lecture Note Structurer):
Transform the provided raw lecture notes, voice transcription, or handout text into clean, structured study notes:
1. 📖 **Overview & Main Themes**
2. 📌 **Structured Concepts & Definitions**
3. 📐 **Formulas, Laws, or Citations** (with parameter breakdowns)
4. ⚠️ **Common Exam Pitfalls & High-Yield Questions**`
  },
  {
    id: 'code_solver',
    name: 'Code & Math Solver',
    icon: '💻',
    badge: 'STEM',
    description: 'Step-by-step mathematical proofs, circuit calculations, and debugged code.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (STEM & Code Architect):
Provide rigorous, bug-free, and well-commented code or mathematical derivations.
For code: explain time/space complexity and provide runnable examples.
For math/engineering: provide detailed line-by-line algebraic derivations with all units clearly labeled.`
  }
];

export const PRESET_PROMPT_CHIPS = [
  { label: '📐 Solve MTH 101 Calculus Limits', mode: 'code_solver', prompt: 'Explain how to evaluate limits using L\'Hopital\'s Rule and algebraic factorization with 3 worked examples for MTH 101.' },
  { label: '🎯 PHY 102 Electrostatics Quiz', mode: 'quiz', prompt: 'Generate 5 past-question standard MCQs on Coulomb\'s Law and Electric Field Intensity with explanations.' },
  { label: '📚 Turn Lecture Notes into Study Guide', mode: 'notes_helper', prompt: 'Here are my lecture notes from class today. Please organize them into a clean study guide with key definitions and potential exam questions:\n\n[Paste your lecture notes here]' },
  { label: '🃏 Generate Active Recall Flashcards', mode: 'flashcards', prompt: 'Create 6 high-yield active recall flashcards on Thermodynamics and Heat Transfer laws with memory tips.' },
  { label: '⚡ Explain Carnot Cycle (Thermodynamics)', mode: 'tutor', prompt: 'Explain the 4 stages of the Carnot Cycle in Thermodynamics, its efficiency formula, and why 100% efficiency is impossible.' },
  { label: '📝 GST 111 Communication in English Summary', mode: 'summarizer', prompt: 'Summarize the primary methods of paragraph development (Cause and Effect, Comparison/Contrast, Analogy) for GST 111.' },
  { label: '💡 Explain OOP Polymorphism simply', mode: 'eli100l', prompt: 'Explain Object-Oriented Programming (OOP) Polymorphism and Inheritance using simple everyday analogies.' }
];

// Fallback academic response generator if no API key is provided
export function generateFallbackAcademicResponse(prompt, modeId) {
  const cleanPrompt = prompt.trim();
  const mode = AI_MODES.find(m => m.id === modeId) || AI_MODES[0];

  if (modeId === 'quiz') {
    return `### 🎯 DegreeAI Practice Quiz: ${cleanPrompt.slice(0, 50)}...

Here is a 5-question high-yield mock test based on your topic:

---

**Question 1: Which of the following best defines the primary principle in this topic?**
A) It remains constant regardless of system boundaries
B) It varies inversely with external pressure and temperature
C) It represents the fundamental rate of change within the defined domain
D) It only applies to closed equilibrium states

> **Correct Answer:** **C**
> **Explanation:** Option C accurately captures the core operational definition found in standard university past questions, while the other choices confuse boundary conditions.

---

**Question 2: In standard examination marking schemes, which component carries the highest weight when solving this problem?**
A) Final numerical answer only
B) Stating initial conditions, formula definition, and clear step-by-step derivation
C) Drawing decorative borders
D) Quoting historical researchers

> **Correct Answer:** **B**
> **Explanation:** University examiners allocate up to 70% of question marks to proper formula citation, intermediate substitutions, and dimensional units.

---

**Question 3: If the governing parameter is doubled while keeping other variables constant, what is the expected outcome?**
A) The output quadruples ($2^2 = 4$)
B) The output is halved
C) The output remains unaffected
D) The system becomes non-linear

> **Correct Answer:** **A**
> **Explanation:** Due to the direct quadratic relationship in the standard formulation, doubling the input scale results in a 4x increase in output.

---

**Question 4: What is the most common pitfall students make during semester examinations on this concept?**
A) Writing with blue ink
B) Forgetting unit conversions (e.g., converting cm to meters or minutes to seconds)
C) Writing too quickly
D) Memorizing past questions without understanding the fundamental derivation

> **Correct Answer:** **B**
> **Explanation:** Unit conversion omissions account for the majority of lost marks in 100L–300L engineering and science papers.

---

**Question 5: Which boundary condition must be verified before applying the general formula?**
A) Temperature must be at absolute zero
B) The system must satisfy continuity and conservation requirements
C) The exam time must be under 30 minutes
D) Only single-variable systems are supported

> **Correct Answer:** **B**
> **Explanation:** Conservation and continuity ensure the governing differential equations hold true without singularities.

---
💡 *Tip: You can ask DegreeAI to explain the solution to any of these questions step-by-step!*`;
  }

  if (modeId === 'eli100l') {
    return `### 💡 DegreeAI: Explained Simply

Let's break down **"${cleanPrompt}"** so it makes 100% crystal-clear sense!

---

#### 🌟 1. The Big Picture
Think of this concept as a **traffic control system for complex data or energy**. Instead of chaos where everything crashes into each other, it sets up clear rules so every piece knows exactly when to move, how much energy to transfer, and where to land safely.

---

#### 🚗 2. The Everyday Analogy
Imagine you are at a busy BRT terminal in Lagos during rush hour:
- If everyone rushes the bus door at once, nobody enters (**Congestion & Inefficiency**).
- When the station master organizes passengers into structured queues based on destination, boarding speed triples (**Optimized Flow & High Throughput**).
- That station master is exactly what this concept does in your course!

---

#### 🔍 3. How It Actually Works
1. **Input Phase:** The system accepts raw variables (energy, data, mass, or legal claims).
2. **Transformation Phase:** It applies fundamental governing laws (like Conservation of Energy, Ohm's Law, or Legal Precedent) to process the input.
3. **Equilibrium State:** The system stabilizes into a predictable, measurable output that can be calculated using standard formulas.

---

#### 🧠 4. The "Aha!" Exam Takeaway
Whenever you see this question in an exam, immediately write down:
> *"This concept is fundamentally about optimizing state transitions under constrained resources."*

*(Your lecturer will instantly know you understand the core philosophy behind the math!)*`;
  }

  if (modeId === 'summarizer') {
    return `### ⚡ DegreeAI 5-Minute Revision Sheet

**Topic / Subject:** ${cleanPrompt}

---

#### 📌 1. Core Objective
To understand the theoretical foundation, mathematical models, and practical engineering/scientific applications of this topic for university assessments.

---

#### 🔑 2. Top 5 Key Takeaway Points
1. **Fundamental Definition:** An established principle governing how systems behave under standard thermodynamic, electromagnetic, or algebraic conditions.
2. **Governing Law:** Directly dependent on state variables $(P, V, T)$ or $(x, y, t)$ through conservation equations.
3. **Primary Applications:** Used across industrial design, computational algorithms, economic models, and structural analysis.
4. **Boundary Limits:** Valid only when external interference is negligible and laminar/steady-state assumptions hold.
5. **Exam Significance:** Appears in Section A (Compulsory Theory) or Section B numerical questions in over 80% of past semester papers.

---

#### 📐 3. Key Formulas & Laws to Memorize
$$\\eta = 1 - \\frac{Q_{out}}{Q_{in}} = 1 - \\frac{T_L}{T_H}$$
$$\\sum F = m \\cdot a, \\quad \\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}$$

---

#### ❓ 4. High-Probability Exam Questions
- *“State the fundamental postulates of this concept and prove its governing equation from first principles.”* (10 Marks)
- *“Calculate the efficiency when the high-temperature reservoir is 600K and low reservoir is 300K.”* (5 Marks)
- *“Discuss three real-world limitations encountered in engineering practice.”* (5 Marks)`;
  }

  // Default Academic Tutor / Exam Prep response
  return `### 🎓 DegreeAI Academic Breakdown

**Topic:** ${cleanPrompt}  
**Mode:** ${mode.name}

---

#### 1. Overview & Conceptual Foundation
In Nigerian University and West African academic curricula (NUC standard benchmark), understanding this topic requires mastering both the qualitative theory and quantitative derivations.

At its core, this subject addresses how physical, mathematical, or social systems transition between states under defined constraints.

---

#### 2. Step-by-Step Derivation & Principles

Let us analyze the problem systematically:

1. **Step 1: Identify Given Variables & Standard Units**
   - Let the primary state function be denoted by $\\Psi(x, t)$
   - Ensure all parameters are converted to SI standard base units (kg, m, s, A, K).

2. **Step 2: Apply the Governing Fundamental Equation**
   $$\\mathcal{L} = \\int_{t_1}^{t_2} (T - V) \\, dt$$
   Substitute the boundary parameters into the general equilibrium condition:
   $$f(x) = a_0 + \\sum_{n=1}^{\\infty} \\left( a_n \\cos\\frac{n\\pi x}{L} + b_n \\sin\\frac{n\\pi x}{L} \\right)$$

3. **Step 3: Solve for the Unknowns**
   Differentiating with respect to the independent variable and setting $\\frac{\\partial f}{\\partial x} = 0$ yields the steady-state maximum.

---

#### 3. Standard University Marking Scheme Points
When answering this in an examination, guarantee maximum marks by structuring your answer as:
- [x] **Clear Definition:** 2 Marks for stating the formal definition verbatim.
- [x] **Labeled Diagram / Schematic:** 3 Marks for drawing clean axes with units.
- [x] **Mathematical Steps:** 4 Marks for showing formula substitution without skipping intermediate lines.
- [x] **Final Statement with Units:** 1 Mark for highlighting the final answer in a neat box.

---

#### 4. Need Further Practice?
Ask DegreeAI to:
- *"Give me 3 practice calculation problems with solutions for this"*
- *"Explain this in Pidgin / simpler words"*
- *"Generate a 5-question mock test"*`;
}

// Main AI Completion function
export async function legacySendAIMessage({ prompt, mode = 'tutor', conversationHistory = [] }) {
  const selectedMode = AI_MODES.find(m => m.id === mode) || AI_MODES[0];
  const apiKey = typeof process !== 'undefined' ? process.env?.REACT_APP_GEMINI_API_KEY : '';

  // If Gemini API Key is available, make live call to Google Gemini
  if (apiKey && apiKey.trim().length > 10) {
    const modelsToTry = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-flash-latest'];

    // Build strictly valid alternating user/model history turns (last 4 turns max)
    const validHistory = [];
    let expectingUser = true;

    for (const m of conversationHistory.slice(-6)) {
      if (!m.content || m.id === 'welcome-msg' || m.id === 'welcome-msg-reset' || m.status === 'error') continue;
      const isUserMsg = m.role === 'user';
      
      if (expectingUser && isUserMsg) {
        validHistory.push({
          role: 'user',
          parts: [{ text: m.content.slice(0, 1500) }]
        });
        expectingUser = false;
      } else if (!expectingUser && !isUserMsg) {
        validHistory.push({
          role: 'model',
          parts: [{ text: m.content.slice(0, 1500) }]
        });
        expectingUser = true;
      }
    }

    // Ensure the last item in validHistory is a model turn, so adding the new user turn is valid
    if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
      validHistory.pop();
    }

    const contents = [
      ...validHistory,
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ];

    const bodyPayload = {
      systemInstruction: {
        parts: [{ text: selectedMode.systemPrompt }]
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2500,
      }
    };

    for (const modelName of modelsToTry) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;
        
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timeoutId = controller ? setTimeout(() => controller.abort(), 25000) : null;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
          signal: controller?.signal
        });
        if (timeoutId) clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (text && text.trim().length > 0) {
            return {
              content: text,
              provider: `Google ${modelName}`,
              status: 'success'
            };
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.warn(`[DegreeAI] Model ${modelName} returned status ${response.status}:`, errorData);
        }
      } catch (err) {
        console.warn(`[DegreeAI] Error with ${modelName}:`, err?.message || err);
      }
    }
  }

  // If live calls failed, return an informative actionable error rather than identical canned text
  return {
    content: `⚠️ **DegreeAI Connection Notice**\n\nWe could not connect to the academic engine for this specific question right now.\n\n**Suggestions:**\n- Check your internet connection.\n- Try rephrasing or shortening your prompt.\n- Click one of the quick prompt chips below to retry.`,
    provider: 'DegreeAI Core',
    status: 'error'
  };
}

// ── DUAL-SERVER REDUNDANCY & FAILOVER AI COMPLETION ──
// Server 1 (Primary): HackMyDegree Serverless /api/degree-ai (Production Edge)
// Server 2 (Backup / Secondary Failover): Direct DegreeAI Neural Gateway
export async function sendAIMessage({ prompt, mode = 'tutor', conversationHistory = [] }) {
  const selectedMode = AI_MODES.find((item) => item.id === mode) || AI_MODES[0];
  const cleanPrompt = String(prompt || '').trim();
  if (!cleanPrompt) throw new Error('Enter a question before sending it to DegreeAI.');

  const history = conversationHistory
    .filter((message) => message?.content && !message.id?.startsWith('welcome-msg') && message.status !== 'error')
    .slice(-8)
    .map((message) => ({ role: message.role === 'assistant' ? 'model' : 'user', content: String(message.content).slice(0, 4000) }));

  // ── ATTEMPT 1: Primary Server (Edge Node) ──
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    
    const requestBody = JSON.stringify({
      prompt: cleanPrompt.slice(0, 16000),
      systemInstruction: selectedMode.systemPrompt,
      history
    });

    const response = await fetch('/api/degree-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: requestBody,
    }).catch(() => null);

    window.clearTimeout(timeout);

    if (response && response.ok) {
      const payload = await response.json().catch(() => ({}));
      if (payload.content?.trim()) {
        return {
          content: payload.content,
          provider: 'DegreeAI Core Engine',
          server: 'Primary Server (Edge-1)',
          status: 'success'
        };
      }
    }
  } catch (err) {
    console.warn('[DegreeAI] Primary Server 1 failed, initiating Server 2 failover...', err?.message || err);
  }

  // ── ATTEMPT 2: Secondary Failover Server (Direct Neural Gateway) ──
  const apiKey = typeof process !== 'undefined' ? (process.env?.REACT_APP_GEMINI_API_KEY || process.env?.GEMINI_API_KEY) : '';
  
  if (apiKey && apiKey.trim().length > 10) {
    const modelsToTry = ['gemini-3.6-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    const validHistory = [];
    let expectingUser = true;

    for (const m of conversationHistory.slice(-6)) {
      if (!m.content || m.id?.startsWith('welcome-msg') || m.status === 'error') continue;
      const isUserMsg = m.role === 'user';
      if (expectingUser && isUserMsg) {
        validHistory.push({ role: 'user', parts: [{ text: m.content.slice(0, 1500) }] });
        expectingUser = false;
      } else if (!expectingUser && !isUserMsg) {
        validHistory.push({ role: 'model', parts: [{ text: m.content.slice(0, 1500) }] });
        expectingUser = true;
      }
    }

    if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
      validHistory.pop();
    }

    const contents = [
      ...validHistory,
      { role: 'user', parts: [{ text: cleanPrompt }] }
    ];

    const bodyPayload = {
      systemInstruction: { parts: [{ text: selectedMode.systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 2500 }
    };

    for (const modelName of modelsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 22000);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) {
            return {
              content: text,
              provider: 'DegreeAI Neural Core',
              server: 'Backup Server (Edge-2)',
              status: 'success'
            };
          }
        }
      } catch (e) {
        console.warn(`[DegreeAI] Backup model ${modelName} failed:`, e?.message);
      }
    }
  }

  throw new Error('DegreeAI is temporarily busy on both servers. Please try your question again in a moment.');
}
