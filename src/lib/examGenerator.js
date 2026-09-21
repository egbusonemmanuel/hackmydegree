// src/lib/examGenerator.js
import { sendAIMessage } from './ai';

/**
 * Generates an exam-standard 10-question multiple choice test bank
 * for any course and topic, with fallback curriculum questions.
 */
export async function generate10QuestionExam(course, doc, onProgress) {
  if (!course || !doc) return null;

  const topics = course.topics || [];
  const primaryTopic = doc.title.replace(/^.*?- /, '');

  const prompt = `Generate a rigorous 10-question Multiple Choice Question (MCQ) university semester exam for the course: ${course.course_code} - ${course.title} (${course.level}, ${course.department}).
Topic: "${primaryTopic}".
Core Topics Covered: ${topics.join(', ')}.

Format each question strictly as:
**Question [Number]: [Question Text]**
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
> **Correct Answer:** [A, B, C, or D]
> **Explanation:** [Detailed 2-sentence rationale for the correct answer]`;

  try {
    if (onProgress) onProgress(true);
    const aiResponse = await sendAIMessage({
      messages: [{ role: 'user', content: prompt }],
      mode: 'quiz',
      courseCode: course.course_code,
      level: course.level
    });

    const parsed = parseAIExamResponse(aiResponse);
    if (parsed && parsed.length >= 5) {
      return parsed;
    }
  } catch (err) {
    console.warn('[ExamGenerator] AI generation fallback triggered:', err);
  } finally {
    if (onProgress) onProgress(false);
  }

  // High quality fallback curriculum questions
  return generateCurriculumFallbackExam(course, doc);
}

export function parseAIExamResponse(text) {
  if (!text) return null;
  const questions = [];
  const questionBlocks = text.split(/\*\*Question\s*\d+:/i).filter(Boolean);

  questionBlocks.forEach((block, idx) => {
    const lines = block.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 5) return;

    const questionText = lines[0];
    const options = [];
    let correct = 0;
    let explanation = 'Standard curriculum principle.';

    lines.forEach(line => {
      if (/^[A-D]\)/i.test(line)) {
        options.push(line.replace(/^[A-D]\)\s*/i, ''));
      } else if (/Correct Answer:/i.test(line)) {
        const match = line.match(/Correct Answer:\s*\*?\*?([A-D])/i);
        if (match) {
          correct = ['A', 'B', 'C', 'D'].indexOf(match[1].toUpperCase());
          if (correct === -1) correct = 0;
        }
      } else if (/Explanation:/i.test(line)) {
        explanation = line.replace(/^.*Explanation:\s*\*?\*?/i, '').replace(/\*?\*?$/, '');
      }
    });

    if (options.length >= 4) {
      questions.push({
        id: `ai-q-${idx + 1}`,
        question: questionText,
        options: options.slice(0, 4),
        correct,
        explanation
      });
    }
  });

  return questions.length > 0 ? questions : null;
}

export function generateCurriculumFallbackExam(course, doc) {
  const primaryTopic = doc?.title?.replace(/^.*?- /, '') || course.title;
  const topics = course.topics || [];

  return [
    {
      id: 'fb-1',
      question: `What is the primary diagnostic baseline priority in ${course.course_code} (${primaryTopic})?`,
      options: [
        'Immediate surgical intervention without screening',
        'Establish verified baseline diagnostic and clinical metrics before protocol initiation',
        'Discharge the subject without recording indices',
        'Omit secondary monitoring parameters'
      ],
      correct: 1,
      explanation: 'Establishing baseline physiological and diagnostic parameters is mandatory before administering any clinical or technical protocol.'
    },
    {
      id: 'fb-2',
      question: `Under the ${course.faculty} syllabus, how are acute deviations in ${course.course_code} categorized?`,
      options: [
        'Rapid onset with compensatory physiological disruption requiring immediate stabilization',
        'Slow chronic changes requiring no clinical review',
        'Informal observations without therapeutic relevance',
        'Elective conditions only'
      ],
      correct: 0,
      explanation: 'Acute conditions manifest rapidly and demand immediate evidence-based stabilization protocols.'
    },
    {
      id: 'fb-3',
      question: `Which regulatory mechanism governs homeostatic balance in ${topics[0] || primaryTopic}?`,
      options: [
        'Uncontrolled positive cascades only',
        'Negative feedback regulatory loops with receptor sensitivity',
        'Complete cessation of cellular activity',
        'Non-specific systemic depletion'
      ],
      correct: 1,
      explanation: 'Negative feedback loops serve as the primary mechanism for maintaining homeostatic equilibrium in physiological and biological systems.'
    },
    {
      id: 'fb-4',
      question: `When administering therapeutic dosages or technical procedures in ${course.level} ${course.course_code}, what is required?`,
      options: [
        'Approximating quantities without calculations',
        'Standardized unit-based calculations, double verification, and strict documentation',
        'Verbal instructions without written logs',
        'Single unverified estimation'
      ],
      correct: 1,
      explanation: 'Professional accreditation standards require strict unit verification, dosage calculation formulas, and legal documentation.'
    },
    {
      id: 'fb-5',
      question: `What is the initial action when a patient or experimental subject exhibits acute critical decompensation?`,
      options: [
        'Immediately execute emergency escalation protocol (Pathway B) and alert senior consultants',
        'Wait 24 hours to re-evaluate symptoms',
        'Stop all monitoring immediately',
        'Transfer without triage assessment'
      ],
      correct: 0,
      explanation: 'Acute decompensation mandates immediate escalation to emergency clinical stabilization and specialist consult.'
    },
    {
      id: 'fb-6',
      question: `In the study of ${topics[1] || primaryTopic}, how are differential diagnoses prioritized?`,
      options: [
        'Random guessing',
        'By matching clinical symptom clusters, diagnostic biomarkers, and evidence-based criteria',
        'Alphabetical listing only',
        'Excluding laboratory results'
      ],
      correct: 1,
      explanation: 'Differential diagnosis requires structured clinical correlation between presenting symptoms and verified diagnostic markers.'
    },
    {
      id: 'fb-7',
      question: `Which standard ethical and legal guideline governs practice in ${course.department}?`,
      options: [
        'Informed consent, strict patient confidentiality, and compliance with statutory council acts',
        'Unregulated personal judgment',
        'Informal peer agreements',
        'Discretionary compliance without accountability'
      ],
      correct: 0,
      explanation: 'Statutory professional councils (e.g. NMCN, PCN, MDCN, MLSCN) mandate legal compliance, informed consent, and confidential records.'
    },
    {
      id: 'fb-8',
      question: `What distinguishes chronic physiological changes from acute manifestations in ${course.course_code}?`,
      options: [
        'Chronic changes involve gradual onset, cellular adaptation, and long-term structural remodeling',
        'Chronic manifestations only last 5 minutes',
        'There is no distinction in medical science',
        'Acute always resolves without therapy'
      ],
      correct: 0,
      explanation: 'Chronic pathology involves progressive tissue adaptation and structural compensation over weeks to months.'
    },
    {
      id: 'fb-9',
      question: `Why is interdisciplinary clinical collaboration critical in managing ${primaryTopic}?`,
      options: [
        'It enables holistic patient care between nurses, physicians, pharmacists, and medical scientists',
        'It reduces the need for diagnostic testing',
        'It is an optional suggestion with no clinical benefit',
        'It replaces standard operating procedures'
      ],
      correct: 0,
      explanation: 'Multidisciplinary care combines pharmacotherapy, nursing interventions, and laboratory monitoring for optimal outcomes.'
    },
    {
      id: 'fb-10',
      question: `According to university marking schemes, what guarantees maximum marks on structured essay questions?`,
      options: [
        'Writing lengthy informal anecdotes',
        'Stating exact definitions, mechanistic sequences, specific clinical points, and clear diagrams',
        'Skipping theoretical explanations',
        'Only writing one-sentence summaries'
      ],
      correct: 1,
      explanation: 'Examiners award top marks for exact scientific nomenclature, numbered step-by-step mechanisms, and structured clinical rationales.'
    }
  ];
}
