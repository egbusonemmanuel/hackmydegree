// src/data/knowledgeBank.js
/**
 * ChongPQ Master Knowledge Bank
 * Curated academic study materials, lecture notes, and past questions
 * spanning 100L to 500L across Nigerian University curricula.
 * Exclusively accessible to HackMyDegree Pro members on-site.
 */

export const KNOWLEDGE_BANK_METADATA = {
  title: "ChongPQ Academic Knowledge Bank",
  description: "Official 100L–500L university lecture notes, summaries, and verified past questions across First & Second Semesters.",
  levels: ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"],
  access_level: "pro_exclusive",
  is_on_site_only: true
};

export const KNOWLEDGE_BANK_COURSES = [
  // ─── 100 LEVEL: 1ST SEMESTER ─────────────────────────
  {
    id: "kb-bio101",
    course_code: "BIO 101",
    title: "General Biology I: Cellular Biology & Genetics",
    level: "100 Level",
    semester: "First Semester",
    faculty: "Basic Sciences / Health Sciences / Pharmacy",
    department: "Biological Sciences / Pre-Med / Pre-Pharm",
    type: "lecture_notes",
    icon: "🧬",
    topics: [
      "Cell Structure & Organelle Functions",
      "Cell Division: Mitosis & Meiosis",
      "Principles of Reproduction in Living Organisms",
      "Stem Cells & Cellular Differentiation",
      "Biological Macromolecules & Enzymes"
    ],
    documents: [
      { id: "bio101-doc-1", title: "BIO 101 - Reproduction & Gametogenesis Part 1", format: "PDF", pages: 28 },
      { id: "bio101-doc-2", title: "BIO 101 - Reproduction & Fertilization Part 2", format: "PDF", pages: 34 },
      { id: "bio101-doc-3", title: "BIO 101 - Embryonic Development Part 3", format: "PDF", pages: 22 },
      { id: "bio101-doc-4", title: "BIO 101 - Understanding Stem Cells & Applications", format: "PDF", pages: 18 },
      { id: "bio101-doc-5", title: "BIO 101 - Essential Assignment & Cell Revision Guide", format: "DOCX", pages: 12 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-chm101",
    course_code: "CHM 101",
    title: "General Chemistry I: Physical & Inorganic Chemistry",
    level: "100 Level",
    semester: "First Semester",
    faculty: "Basic Sciences / Health Sciences / Engineering",
    department: "Pure & Applied Chemistry / Pharmacy / Engineering",
    type: "lecture_notes",
    icon: "🧪",
    topics: [
      "Atomic Structure & Quantum Numbers",
      "Periodic Table Trends & Chemical Bonding",
      "Gas Laws & Kinetic Molecular Theory",
      "Stoichiometry & Mole Concepts",
      "Chemical Equilibrium & Acid-Base Reactions"
    ],
    documents: [
      { id: "chm101-doc-1", title: "CHM 101 - Comprehensive Physical Chemistry Master Notes", format: "PDF", pages: 45 },
      { id: "chm101-doc-2", title: "CHM 101 - Inorganic Bonding & Hybridization Guide", format: "PDF", pages: 31 },
      { id: "chm101-doc-3", title: "CHM 101 - Past Question Solutions & Solved Calculations", format: "PDF", pages: 26 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-chm103",
    course_code: "CHM 103",
    title: "General Chemistry Practical I",
    level: "100 Level",
    semester: "First Semester",
    faculty: "Basic Sciences / Health Sciences",
    department: "Chemistry / Biochemistry / Pharmacy",
    type: "lecture_notes",
    icon: "🔬",
    topics: [
      "Laboratory Safety & Equipment Handling",
      "Volumetric Analysis (Acid-Base Titration)",
      "Qualitative Inorganic Salt Analysis",
      "Redox Reactions in Solution"
    ],
    documents: [
      { id: "chm103-doc-1", title: "CHM 103 - Practical Manual & Titration Report Guide", format: "PDF", pages: 24 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-phy101",
    course_code: "PHY 101",
    title: "General Physics I: Mechanics & Properties of Matter",
    level: "100 Level",
    semester: "First Semester",
    faculty: "Basic Sciences / Engineering / Health Sciences",
    department: "Physics / Engineering / Health Sciences",
    type: "lecture_notes",
    icon: "⚡",
    topics: [
      "Dimensional Analysis & Vectors",
      "Kinematics & Newton's Laws of Motion",
      "Work, Energy, Power & Impulse-Momentum",
      "Rotational Dynamics & Gravitation",
      "Fluid Mechanics, Viscosity & Surface Tension"
    ],
    documents: [
      { id: "phy101-doc-1", title: "PHY 101 - Mechanics & Vectors Handout", format: "PDF", pages: 38 },
      { id: "phy101-doc-2", title: "PHY 101 - Properties of Matter & Fluid Dynamics", format: "PDF", pages: 29 },
      { id: "phy101-doc-3", title: "PHY 101 - Exam Problem Set & Worked Solutions", format: "PDF", pages: 30 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-mth101",
    course_code: "MTH 101",
    title: "Elementary Mathematics I: Algebra & Trigonometry",
    level: "100 Level",
    semester: "First Semester",
    faculty: "Basic Sciences / Engineering",
    department: "Mathematics / Engineering / Computer Science",
    type: "lecture_notes",
    icon: "📐",
    topics: [
      "Set Theory & Real Number Systems",
      "Quadratic Equations & Polynomials",
      "Mathematical Induction & Binomial Theorem",
      "Trigonometric Ratios & De Moivre's Theorem",
      "Matrices & Determinants"
    ],
    documents: [
      { id: "mth101-doc-1", title: "MTH 101 - Algebra & Trigonometry Lecture Series", format: "PDF", pages: 52 },
      { id: "mth101-doc-2", title: "MTH 101 - Solved Past Exam Questions (2018–2023)", format: "PDF", pages: 40 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-mth103",
    course_code: "MTH 103",
    title: "Elementary Mathematics III: Vectors, Geometry & Dynamics",
    level: "100 Level",
    semester: "First Semester",
    faculty: "Basic Sciences / Engineering",
    department: "Mathematics / Engineering",
    type: "lecture_notes",
    icon: "📊",
    topics: [
      "Coordinate Geometry in 2D & 3D",
      "Vector Products & Applications",
      "Lines, Planes & Conic Sections",
      "Particle Kinematics"
    ],
    documents: [
      { id: "mth103-doc-1", title: "MTH 103 - Coordinate Geometry & Vectors Notes", format: "PDF", pages: 36 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-cmp103",
    course_code: "CMP 103",
    title: "Introduction to Computer Science & Computing",
    level: "100 Level",
    semester: "First Semester",
    faculty: "Sciences / Engineering",
    department: "Computer Science / Software Engineering",
    type: "lecture_notes",
    icon: "💻",
    topics: [
      "History & Evolution of Computers",
      "Hardware Architecture & CPU Operations",
      "Number Systems & Boolean Algebra",
      "Algorithms, Flowcharts & Intro to Coding"
    ],
    documents: [
      { id: "cmp103-doc-1", title: "CMP 103 - Complete Computing Fundamentals", format: "PDF", pages: 30 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-bst103",
    course_code: "BST 103",
    title: "Introductory Biostatistics & Data Methods",
    level: "100 Level",
    semester: "First Semester",
    faculty: "Basic Sciences / Health Sciences",
    department: "Biological Sciences / Nursing / Pharmacy",
    type: "lecture_notes",
    icon: "📈",
    topics: [
      "Measures of Central Tendency & Dispersion",
      "Probability Distributions in Biological Systems",
      "Hypothesis Testing & Confidence Intervals"
    ],
    documents: [
      { id: "bst103-doc-1", title: "BST 103 - Biostatistics Lecture Notes & Tables", format: "PDF", pages: 25 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-gst121",
    course_code: "GST 121",
    title: "Use of Library, Study Skills & ICT",
    level: "100 Level",
    semester: "First Semester",
    faculty: "General University Studies",
    department: "All Faculties",
    type: "lecture_notes",
    icon: "📚",
    topics: [
      "Library Classification Systems (Dewey & Library of Congress)",
      "Reference Sources & Academic Databases",
      "Citation Formats (APA, MLA, Harvard)",
      "Effective Study Techniques & ICT in Research"
    ],
    documents: [
      { id: "gst121-doc-1", title: "GST 121 - Use of Library Handout & Exam Summary", format: "PDF", pages: 20 },
      { id: "gst121-doc-2", title: "GST 121 - Past Exam Multiple Choice Questions", format: "PDF", pages: 15 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-gst113",
    course_code: "GST 113",
    title: "Nigerian Peoples & Culture",
    level: "100 Level",
    semester: "First Semester",
    faculty: "General University Studies",
    department: "All Faculties",
    type: "lecture_notes",
    icon: "🌍",
    topics: [
      "Pre-Colonial History & Ethnic Nationalities",
      "Colonial Rule & Constitutional Developments",
      "Cultural Heritage, Norms & Social Institutions",
      "National Integration & Modern Socio-Economic Challenges"
    ],
    documents: [
      { id: "gst113-doc-1", title: "GST 113 - Nigerian Peoples & Culture Master Notes", format: "PDF", pages: 35 },
      { id: "gst113-doc-2", title: "GST 113 - 100 Solved Revision Questions", format: "PDF", pages: 18 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-gst125",
    course_code: "GST 125",
    title: "Contemporary Health & Environment",
    level: "100 Level",
    semester: "First Semester",
    faculty: "General University Studies",
    department: "All Faculties",
    type: "lecture_notes",
    icon: "🩺",
    topics: [
      "Primary Healthcare & Preventative Medicine",
      "Environmental Sanitation & Climate Impact",
      "Drug Abuse & Reproductive Health"
    ],
    documents: [
      { id: "gst125-doc-1", title: "GST 125 - Lecture Summary & Key Concepts", format: "PDF", pages: 22 }
    ],
    has_past_questions: true,
    is_premium: true
  },

  // ─── 200 LEVEL ────────────────────────────────────────
  {
    id: "kb-pha201",
    course_code: "PHA 201",
    title: "Pharmaceutical Chemistry I: Organic & Physicochemical Principles",
    level: "200 Level",
    semester: "First Semester",
    faculty: "Faculty of Pharmacy",
    department: "Pharmaceutical Chemistry",
    type: "lecture_notes",
    icon: "💊",
    topics: [
      "Structure-Activity Relationships (SAR) Fundamentals",
      "Aromatic Compounds & Heterocyclic Systems",
      "Drug Solubility, Partition Coefficient & Ionization",
      "Stereochemistry in Drug Action"
    ],
    documents: [
      { id: "pha201-doc-1", title: "PHA 201 - Organic Principles in Pharmacy", format: "PDF", pages: 42 },
      { id: "pha201-doc-2", title: "PHA 201 - Comprehensive Past Questions & Marking Schemes", format: "PDF", pages: 28 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-ana201",
    course_code: "ANA 201",
    title: "Human Anatomy for Health Sciences: Upper & Lower Limbs",
    level: "200 Level",
    semester: "First Semester",
    faculty: "Basic Medical Sciences",
    department: "Nursing / Pharmacy / Medicine",
    type: "lecture_notes",
    icon: "🫀",
    topics: [
      "Osteology, Myology & Arthrology",
      "Neurovascular Supply of Limbs",
      "Histology of Primary Tissues",
      "Clinical Correlates in Surface Anatomy"
    ],
    documents: [
      { id: "ana201-doc-1", title: "ANA 201 - Gross Anatomy Lecture Series", format: "PDF", pages: 58 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-phs201",
    course_code: "PHS 201",
    title: "Human Physiology: Cardiovascular, Respiratory & Blood",
    level: "200 Level",
    semester: "First Semester",
    faculty: "Basic Medical Sciences",
    department: "Nursing / Pharmacy / Physiology",
    type: "lecture_notes",
    icon: "🩸",
    topics: [
      "Blood Cells, Hemostasis & Blood Groups",
      "Cardiac Cycle, Electrocardiography & Hemodynamics",
      "Pulmonary Ventilation & Gas Exchange",
      "Homeostatic Regulation Mechanisms"
    ],
    documents: [
      { id: "phs201-doc-1", title: "PHS 201 - Cardiovascular & Respiratory Physiology Notes", format: "PDF", pages: 46 }
    ],
    has_past_questions: true,
    is_premium: true
  },

  // ─── 300 LEVEL: NURSING & PHARMACY ───────────────────
  {
    id: "kb-nur301",
    course_code: "NUR 301",
    title: "Medical-Surgical Nursing I: Pathophysiology & Nursing Care",
    level: "300 Level",
    semester: "First Semester",
    faculty: "Health Sciences",
    department: "Department of Nursing",
    type: "lecture_notes",
    icon: "🏥",
    topics: [
      "Perioperative Nursing & Infection Control",
      "Cardiovascular Disorders (Hypertension, Heart Failure)",
      "Respiratory Conditions (Asthma, Pneumonia, Tuberculosis)",
      "Fluid, Electrolyte & Acid-Base Imbalances",
      "Nursing Process in Acute & Chronic Care"
    ],
    documents: [
      { id: "nur301-doc-1", title: "NUR 301 - Medical-Surgical Nursing Clinical Notes", format: "PDF", pages: 64 },
      { id: "nur301-doc-2", title: "NUR 301 - Nursing Care Plans & Case Study Templates", format: "PDF", pages: 30 },
      { id: "nur301-doc-3", title: "NUR 301 - 300L Professional Exam Past Questions", format: "PDF", pages: 35 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-nur303",
    course_code: "NUR 303",
    title: "Maternal & Child Health Nursing (Obstetrics & Pediatrics)",
    level: "300 Level",
    semester: "First Semester",
    faculty: "Health Sciences",
    department: "Department of Nursing",
    type: "lecture_notes",
    icon: "👶",
    topics: [
      "Antenatal Assessment & High-Risk Pregnancy",
      "Labor & Delivery Management (Partograph Tracking)",
      "Postpartum Care & Neonatal Resuscitation",
      "Pediatric Milestones & Common Childhood Illnesses"
    ],
    documents: [
      { id: "nur303-doc-1", title: "NUR 303 - Obstetric & Pediatric Nursing Master Notes", format: "PDF", pages: 55 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-pcl301",
    course_code: "PCL 301",
    title: "General Pharmacology & Autonomic Nervous System",
    level: "300 Level",
    semester: "First Semester",
    faculty: "Faculty of Pharmacy / Basic Medical",
    department: "Pharmacology / Pharmacy / Nursing",
    type: "lecture_notes",
    icon: "💊",
    topics: [
      "Pharmacokinetics (ADME) & Bioavailability",
      "Pharmacodynamics: Receptors, Agonists & Antagonists",
      "Cholinergic & Adrenergic Neurotransmission",
      "Drugs Acting on Autonomic Effector Sites"
    ],
    documents: [
      { id: "pcl301-doc-1", title: "PCL 301 - Pharmacokinetics & Receptor Mechanisms", format: "PDF", pages: 48 },
      { id: "pcl301-doc-2", title: "PCL 301 - ANS Drug Classification Charts & Tables", format: "PDF", pages: 20 },
      { id: "pcl301-doc-3", title: "PCL 301 - Departmental Past Questions (2017–2023)", format: "PDF", pages: 32 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-pct301",
    course_code: "PCT 301",
    title: "Pharmaceutics I: Physical Pharmacy & Dosage Form Design",
    level: "300 Level",
    semester: "First Semester",
    faculty: "Faculty of Pharmacy",
    department: "Pharmaceutics & Pharmaceutical Technology",
    type: "lecture_notes",
    icon: "🧪",
    topics: [
      "Solutions, Disperse Systems & Colloids",
      "Micromeritics (Particle Size & Flow Properties)",
      "Rheology & Interfacial Phenomena",
      "Formulation of Liquid Dosage Forms"
    ],
    documents: [
      { id: "pct301-doc-1", title: "PCT 301 - Physical Pharmacy & Dosage Form Theory", format: "PDF", pages: 50 },
      { id: "pct301-doc-2", title: "PCT 301 - Formulation Calculations & Past Questions", format: "PDF", pages: 22 }
    ],
    has_past_questions: true,
    is_premium: true
  },

  // ─── 400 LEVEL: ADVANCED PHARMACY & HEALTH ───────────
  {
    id: "kb-pha401",
    course_code: "PHA 401",
    title: "Clinical Pharmacy, Therapeutics & Patient Care",
    level: "400 Level",
    semester: "First Semester",
    faculty: "Faculty of Pharmacy",
    department: "Clinical Pharmacy & Pharmacy Practice",
    type: "lecture_notes",
    icon: "⚕️",
    topics: [
      "Rational Drug Use & Therapeutic Drug Monitoring (TDM)",
      "Cardiovascular & Endocrine Pharmacotherapy (Diabetes, HTN)",
      "Adverse Drug Reaction (ADR) Reporting & Pharmacovigilance",
      "Drug Interactions & Clinical Case Management"
    ],
    documents: [
      { id: "pha401-doc-1", title: "PHA 401 - Clinical Pharmacotherapy Case Guides", format: "PDF", pages: 72 },
      { id: "pha401-doc-2", title: "PHA 401 - Hospital Ward Round Notes & Cases", format: "PDF", pages: 40 },
      { id: "pha401-doc-3", title: "PHA 401 - 400L Professional Exam Past Questions", format: "PDF", pages: 38 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-pcg401",
    course_code: "PCG 401",
    title: "Pharmacognosy & Traditional African Medicine",
    level: "400 Level",
    semester: "First Semester",
    faculty: "Faculty of Pharmacy",
    department: "Pharmacognosy",
    type: "lecture_notes",
    icon: "🌿",
    topics: [
      "Biosynthetic Pathways of Secondary Metabolites",
      "Alkaloids, Flavonoids, Glycosides & Tannins",
      "Phytochemical Screening & Standardization of Herbal Medicines",
      "Toxic Plants & Ethnopharmacology"
    ],
    documents: [
      { id: "pcg401-doc-1", title: "PCG 401 - Phytochemistry & Plant Monographs", format: "PDF", pages: 45 }
    ],
    has_past_questions: true,
    is_premium: true
  },

  // ─── 500 LEVEL: PROFESSIONAL FINAL YEAR ──────────────
  {
    id: "kb-pha501",
    course_code: "PHA 501",
    title: "Forensic Pharmacy, Drug Laws & Pharmacy Ethics",
    level: "500 Level",
    semester: "First Semester",
    faculty: "Faculty of Pharmacy",
    department: "Pharmacy Administration",
    type: "lecture_notes",
    icon: "⚖️",
    topics: [
      "Pharmacy Council of Nigeria (PCN) Act & Regulations",
      "NAFDAC Guidelines & Counterfeit Drug Control",
      "Dangerous Drugs Act & Poison Laws",
      "Professional Ethics, Malpractice & Jurisprudence"
    ],
    documents: [
      { id: "pha501-doc-1", title: "PHA 501 - Nigerian Drug Laws & PCN Ethics Manual", format: "PDF", pages: 54 },
      { id: "pha501-doc-2", title: "PHA 501 - Final Year Comprehensive Exam Past Questions", format: "PDF", pages: 30 }
    ],
    has_past_questions: true,
    is_premium: true
  },
  {
    id: "kb-nur501",
    course_code: "NUR 501",
    title: "Advanced Community Health Nursing & Epidemiology",
    level: "500 Level",
    semester: "First Semester",
    faculty: "Health Sciences",
    department: "Department of Nursing",
    type: "lecture_notes",
    icon: "🌐",
    topics: [
      "Epidemiological Surveillance & Disease Outbreak Control",
      "Community Diagnosis, Primary Healthcare (PHC) Centers",
      "Occupational Health & Environmental Health Policies"
    ],
    documents: [
      { id: "nur501-doc-1", title: "NUR 501 - Community Health & Epidemiology Lecture Notes", format: "PDF", pages: 60 }
    ],
    has_past_questions: true,
    is_premium: true
  }
];
