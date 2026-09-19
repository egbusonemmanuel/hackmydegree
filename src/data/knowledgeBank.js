// src/data/knowledgeBank.js
/**
 * HackMyDegree Master Knowledge Bank
 * Curated academic study materials, lecture notes, and past questions
 * spanning 100L to 500L across Nigerian University curricula.
 * Exclusively accessible to HackMyDegree Pro members on-site.
 */

export const KNOWLEDGE_BANK_METADATA = {
  title: "HackMyDegree Academic Knowledge Bank",
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

  // ─── 200 LEVEL: BASIC MEDICAL SCIENCES ────────────────
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

  // ─── 300 LEVEL: 300 LEVEL NURSING NOTES BANK ─────────
  {
    id: "kb-nsc306",
    course_code: "NSC 306",
    title: "300 Level Note: Medical-Surgical Nursing II (Musculoskeletal, Sensory & Neuro-Endocrine Disorders)",
    level: "300 Level",
    semester: "First Semester",
    faculty: "Health Sciences",
    department: "Department of Nursing Science",
    type: "lecture_notes",
    icon: "🏥",
    topics: [
      "Musculoskeletal Anatomy, Diagnostic Evaluation (X-ray, CT, MRI, DEXA, EMG) & 5 P's Assessment",
      "Care Modalities: Casts, Splints, Traction, External Fixators & Compartment Syndrome Protocols",
      "Fracture Management, Bone Healing Phases, Osteomyelitis & Surgical Amputation Rehabilitation",
      "Assessment and Clinical Management of Patients with Endocrine Disorders & Hormone Feedback Loops",
      "Neurological Emergencies: Head Trauma, Headache Syndromes, Seizure Disorders & Status Epilepticus",
      "Sensory Disorders: Eye/Vision (Cataracts, Glaucoma, Retinal Detachment) & Ear/Hearing (Otitis Media, Ménière's)"
    ],
    documents: [
      {
        id: "nsc306-doc-1",
        title: "NSC 306 - Comprehensive Medical-Surgical Master Notes: Musculoskeletal, Eye & Ear Disorders",
        format: "MD / MASTER NOTE",
        pages: 60,
        summary: "Complete 600-line study guide covering pathophysiology, clinical manifestations, diagnostics, medical and nursing management templates for musculoskeletal, ophthalmic, and otic conditions.",
        key_points: [
          "5 P's Neurovascular Assessment: Pain, Pallor, Pulselessness, Paresthesia, Paralysis",
          "Compartment Syndrome: Earliest sign is pain on passive stretch — emergent bivalving/fasciotomy required",
          "Traction Rules: Never remove weights without order; ropes must be unobstructed in pulleys; patient in good alignment",
          "Amputation Care: Elevate stump only in first 24h to avoid hip flexion contracture; prone positioning daily"
        ]
      },
      {
        id: "nsc306-doc-2",
        title: "NSC 314 - Musculoskeletal Disorders I: Anatomy, Assessment & Trauma Management (Dr. A.D. Ajayi)",
        format: "PPTX",
        pages: 35,
        summary: "Detailed presentation on musculoskeletal biomechanics, osteoblast/osteoclast remodeling, physical assessment techniques, muscle grading (0–5), and initial trauma stabilization."
      },
      {
        id: "nsc306-doc-3",
        title: "NSC 314 - Musculoskeletal Disorders II: Fracture Classification, Casts & Traction Mechanics",
        format: "PPTX",
        pages: 42,
        summary: "In-depth clinical slides covering closed vs open fractures, Gustilo-Anderson classification, plaster vs fiberglass cast handling, skin vs skeletal traction, and pin-site care."
      },
      {
        id: "nsc306-doc-4",
        title: "NSC 314 - Musculoskeletal Disorders III: Osteomyelitis, Arthritis & Amputations",
        format: "PPTX",
        pages: 38,
        summary: "Pathophysiology and nursing interventions for acute/chronic osteomyelitis, osteoarthritis vs rheumatoid arthritis, gouty arthritis, and pre/post-operative amputation care."
      },
      {
        id: "nsc306-doc-5",
        title: "NSC 306 - Assessment & Management of Patients with Endocrine Disorders",
        format: "PPT",
        pages: 48,
        summary: "Comprehensive slide deck on pituitary, thyroid (hyper/hypothyroidism, thyroid storm), adrenal (Cushing's, Addisonian crisis), and pancreatic disorders (DKA, HHS, insulin regimens)."
      },
      {
        id: "nsc306-doc-6",
        title: "NSC 306 - Physiology of the Endocrine System & Hormone Feedback Mechanisms",
        format: "PDF",
        pages: 40,
        summary: "Endocrine physiology handbook detailing hypothalamic-pituitary axis, negative and positive feedback loops, second-messenger hormone receptors, and metabolic homeostasis."
      },
      {
        id: "nsc306-doc-7",
        title: "NSC 306 - Emergency Nursing Care in Head Trauma & Traumatic Brain Injury (TBI)",
        format: "PPTX",
        pages: 32,
        summary: "Glasgow Coma Scale (GCS) assessment, Monro-Kellie doctrine, signs of increasing ICP (Cushing's triad), epidural vs subdural hematoma, and emergency airway/hyperosmolar therapy."
      },
      {
        id: "nsc306-doc-8",
        title: "NSC 306 - Clinical Lecture Note on Headaches, Migraines & Cranial Neuralgias",
        format: "PDF",
        pages: 20,
        summary: "Differential diagnosis and nursing interventions for tension, cluster, and migraine headaches; red flag symptoms (SNOOP criteria) and acute/preventive pharmacotherapy."
      },
      {
        id: "nsc306-doc-9",
        title: "NSC 306 - Clinical Lecture Note on Seizure Disorders & Epilepsy Syndromes",
        format: "PDF",
        pages: 24,
        summary: "Classification of focal vs generalized seizures, aura phases, EEG correlates, anticonvulsant therapy, patient safety during active seizures, and postictal nursing care."
      },
      {
        id: "nsc306-doc-10",
        title: "NSC 306 - Emergency Protocol: Management of Status Epilepticus in Clinical Practice",
        format: "PDF",
        pages: 18,
        summary: "Minute-by-minute resuscitation algorithm for status epilepticus (>5 minutes of continuous seizure activity), IV benzodiazepine first-line dosing, second-line AEDs, and ICU airway management."
      },
      {
        id: "nsc306-doc-11",
        title: "NSC 306 - Neurotransmitter Systems & Chemical Synaptic Transmission",
        format: "PDF",
        pages: 26,
        summary: "Acetylcholine, Dopamine, Serotonin, GABA, Glutamate, and Norepinephrine synthesis, vesicle packaging, receptor activation, reuptake inhibitors, and neuropsychiatric correlations."
      },
      {
        id: "nsc306-doc-12",
        title: "NSC 306 - What Are Neurotransmitters: Clinical Guide & Pharmacological Targets",
        format: "PDF",
        pages: 22,
        summary: "Student revision guide linking neurotransmitter imbalances with Parkinson's, Alzheimer's, Myasthenia Gravis, depression, and epilepsy; key drug interactions and clinical pearls."
      }
    ],
    has_past_questions: true,
    is_premium: true
  },

  {
    id: "kb-nsc315",
    course_code: "NSC 315 / PHM 307",
    title: "300 Level Note: Foundations of Pharmacology, Drug Calculations & Clinical Therapeutics",
    level: "300 Level",
    semester: "First Semester",
    faculty: "Health Sciences",
    department: "Department of Nursing Science",
    type: "lecture_notes",
    icon: "💊",
    topics: [
      "Pharmacokinetics (ADME: Absorption, Distribution, Biotransformation & Excretion) & Half-life",
      "Stock Concentrations, Flow Rate Calculations, Pediatric Dosing & IV Drug Administration",
      "Antimicrobial Agents: Penicillins, Cephalosporins, Aminoglycosides, Fluoroquinolones & Resistance",
      "Safe Routes of Drug Administration (Enteral, Parenteral, Topical, Inhalation) & 10 Rights of Medication",
      "Classification of Therapeutic Drugs, Autonomic Drugs, Cardiovascular Agents & Analgesics",
      "Essential Drug Lists, Drug Revolving Fund (DRF) Systems, Drug Laws & Dangerous Drugs Act"
    ],
    documents: [
      {
        id: "nsc315-doc-1",
        title: "NSC 315 - Foundation of Clinical Pharmacology for Nursing Practice",
        format: "DOCX",
        pages: 45,
        summary: "Comprehensive textbook notes covering pharmacodynamics, receptor types, agonists/antagonists, therapeutic index, adverse drug reactions (ADRs), and nursing responsibilities."
      },
      {
        id: "nsc315-doc-2",
        title: "PHM 307 - Stock Concentration, Dilution & Clinical Dosage Calculations Manual",
        format: "PPTX",
        pages: 36,
        summary: "Step-by-step mathematical formulas for stock solutions (C1V1 = C2V2), IV drip rates (gtts/min), body surface area (BSA) calculations, and pediatric dosage rules (Clark's & Young's rules)."
      },
      {
        id: "nsc315-doc-3",
        title: "NSC 315 - Antimicrobial Agents: Classifications, Mechanisms & Antibiotic Stewardship",
        format: "PPTX",
        pages: 40,
        summary: "Mechanism of action (cell wall, protein synthesis, nucleic acid inhibitors), spectrum of activity, beta-lactamase inhibitors, peak & trough monitoring for vancomycin/aminoglycosides."
      },
      {
        id: "nsc315-doc-4",
        title: "NSC 315 - Drug Pharmacokinetics: Absorption, Distribution, Biotransformation & Excretion",
        format: "PPTX",
        pages: 38,
        summary: "Bioavailability, first-pass metabolism, plasma protein binding, cytochrome P450 enzyme induction/inhibition, renal clearance, and factors altering pharmacokinetic parameters."
      },
      {
        id: "nsc315-doc-5",
        title: "NSC 315 - Safe Routes of Drug Administration & Clinical Nursing Precautions",
        format: "PPTX",
        pages: 30,
        summary: "Oral, sublingual, IM (deltoid, ventrogluteal, vastus lateralis sites), subcutaneous, IV push vs piggyback, Z-track injection technique, and preventing medication errors."
      },
      {
        id: "nsc315-doc-6",
        title: "NSC 315 - Comprehensive Classification & Types of Therapeutic Drugs",
        format: "DOCX",
        pages: 34,
        summary: "Systematic classification of CNS stimulants/depressants, antihypertensives, diuretics, antidiabetics, anticoagulants, bronchodilators, and NSAIDs vs opioids."
      },
      {
        id: "nsc315-doc-7",
        title: "NSC 315 - National Essential Medicines List & Rational Prescribing Framework",
        format: "PDF",
        pages: 28,
        summary: "WHO & Nigerian National Essential Drugs concept, criteria for drug selection, rational use of medicines, and preventing polypharmacy in primary healthcare."
      },
      {
        id: "nsc315-doc-8",
        title: "NSC 315 - Drug Legislation, Dangerous Drugs Act & Poison Laws in Nigeria",
        format: "PPTX",
        pages: 26,
        summary: "Statutory laws governing controlled substances, PCN/NAFDAC regulatory powers, storage of scheduled narcotics, double-lock drug cupboards, and narcotic register documentation."
      },
      {
        id: "nsc315-doc-9",
        title: "NSC 315 - Drug Revolving Fund (DRF) Systems & Hospital Formulary Management",
        format: "PPTX",
        pages: 25,
        summary: "Financial sustainability models for hospital pharmacies, seed capital management, pricing structures, cost-recovery mechanisms, and avoiding out-of-stock syndromes."
      },
      {
        id: "nsc315-doc-10",
        title: "NSC 315 - Revolving Drug Funds: International Management Guidelines & Auditing (MDS-3)",
        format: "PDF",
        pages: 32,
        summary: "Managing Drug Supply (MDS) Chapter 13 international guidelines for revolving drug funds, supply chain security, procurement integrity, and auditing procedures."
      },
      {
        id: "nsc315-doc-11",
        title: "NSC 315 - Substance Abuse, Chemical Dependence & Addictive Disorders Pharmacology",
        format: "PPTX",
        pages: 35,
        summary: "Neurobiology of addiction, tolerance and withdrawal syndromes for opioids, alcohol, benzodiazepines, cannabis, and amphetamines; detoxification pharmacotherapy (methadone, buprenorphine, naloxone)."
      }
    ],
    has_past_questions: true,
    is_premium: true
  },

  {
    id: "kb-nsc307",
    course_code: "NSC 307",
    title: "300 Level Note: Human Nutrition, Dietary Assessment & Clinical Dietetics",
    level: "300 Level",
    semester: "First Semester",
    faculty: "Health Sciences",
    department: "Department of Nursing Science",
    type: "lecture_notes",
    icon: "🥗",
    topics: [
      "Macronutrients (Carbohydrates, Lipids, Proteins) & Micronutrients (Vitamins & Trace Minerals)",
      "Nutritional Assessment (ABCD: Anthropometry, Biochemical, Clinical, Dietary) & RDA Guidelines",
      "Protein-Energy Malnutrition (Kwashiorkor vs Marasmus) & Nutritional Rehabilitation Protocols",
      "Therapeutic Diets in Renal Disease, Diabetes, Hypertension, Liver Cirrhosis & Post-Op Recovery",
      "Enteral (NG tube, PEG) & Total Parenteral Nutrition (TPN): Formulas, Insertion & Complication Management"
    ],
    documents: [
      {
        id: "nsc307-doc-1",
        title: "NSC 307 - Human Nutrition Curriculum Outline, Group Topics & Assessment Guide",
        format: "DOCX",
        pages: 20,
        summary: "Course roadmap detailing core learning objectives, seminar group allocations, dietary survey requirements, and clinical nutritional assessment competencies."
      },
      {
        id: "nsc307-doc-2",
        title: "NSC 307 - Clinical Human Nutrition, Metabolism & Deficiency Syndromes (Dr. Auta Lecture Notes)",
        format: "DOCX",
        pages: 52,
        summary: "Detailed academic lecture notes by Dr. Auta on nutrient digestion/absorption, biochemical pathways, basal metabolic rate (BMR), vitamin deficiency disorders (scurvy, rickets, beriberi, pellagra), and nutritional epidemiology."
      },
      {
        id: "nsc307-doc-3",
        title: "NSC 307 - Therapeutic Diets, Enteral/Parenteral Feeding & Malnutrition Nursing (Group 6)",
        format: "DOCX",
        pages: 36,
        summary: "Comprehensive clinical presentation on disease-specific therapeutic diets (DASH, low sodium, diabetic exchanges, high-protein wound healing), TPN monitoring, and nursing care in severe acute malnutrition (SAM)."
      }
    ],
    has_past_questions: true,
    is_premium: true
  },

  {
    id: "kb-nsc301",
    course_code: "NSC 301",
    title: "300 Level Note: Foundations of Professional Nursing Practice, Ethics & Quality Improvement",
    level: "300 Level",
    semester: "First Semester",
    faculty: "Health Sciences",
    department: "Department of Nursing Science",
    type: "lecture_notes",
    icon: "🩺",
    topics: [
      "The Nursing Process (ADPIE: Assessment, Diagnosis, Planning, Implementation, Evaluation)",
      "Formulation of NANDA Nursing Diagnoses, SMART Goals & Evidence-Based Interventions",
      "Quality Improvement (QI) in Healthcare, Clinical Governance & Patient Safety Protocols",
      "Nursing Ethics: Autonomy, Beneficence, Non-Maleficence, Justice, Fidelity & Confidentiality",
      "Nursing Jurisprudence, Malpractice, Negligence, Informed Consent & Documentation Standards"
    ],
    documents: [
      {
        id: "nsc301-doc-1",
        title: "NSC 301 - The Nursing Process: ADPIE Framework & Care Plan Formulation",
        format: "PPTX",
        pages: 45,
        summary: "Foundational slides breaking down subjective vs objective data collection, NANDA-I taxonomy, NOC outcomes, NIC interventions, and constructing clinical nursing care plans."
      },
      {
        id: "nsc301-doc-2",
        title: "NSC 301 - Quality Improvement (QI) in Healthcare & Patient Safety Protocols",
        format: "DOCX",
        pages: 32,
        summary: "Principles of continuous quality improvement (CQI), PDCA cycle (Plan-Do-Check-Act), root cause analysis (RCA), sentinel event reporting, and international patient safety goals (IPSG)."
      },
      {
        id: "nsc301-doc-3",
        title: "NSC 301 - Nursing Ethics, Legal Aspects & Professional Jurisprudence Guide",
        format: "PDF",
        pages: 38,
        summary: "Study manual on ethical dilemmas in clinical practice, code of ethics for Nigerian nurses, end-of-life decision making, duty of care, vicarious liability, and legal deposition readiness."
      },
      {
        id: "nsc301-doc-4",
        title: "NSC 301 - Nursing Law, Ethics & Clinical Practice: Quiz Questions & Verified Answers",
        format: "PDF",
        pages: 25,
        summary: "High-yield practice quiz questions and scenario-based past questions testing clinical ethics, informed consent in emergencies, patient confidentiality, and nursing board exam topics."
      }
    ],
    has_past_questions: true,
    is_premium: true
  },

  {
    id: "kb-nsc302",
    course_code: "NSC 302",
    title: "300 Level Note: Maternal, Neonatal & Reproductive Health Nursing Anatomy & Physiology",
    level: "300 Level",
    semester: "First Semester",
    faculty: "Health Sciences",
    department: "Department of Nursing Science",
    type: "lecture_notes",
    icon: "👶",
    topics: [
      "Male Reproductive Anatomy, Spermatogenesis, Semen Analysis & Hormonal Regulation (LH/FSH/Testosterone)",
      "Female Reproductive Anatomy, Ovarian Cycle, Oogenesis, Fallopian Tubes & Pelvic Bony Diameters",
      "Endometrial & Menstrual Cycle Phases (Follicular, Ovulatory, Luteal, Ischemic) & Feedback Hormones",
      "Antenatal Assessment, Calculation of EDD/EGA (Naegele's Rule) & Gravida/Para Obstetric History",
      "Labor Stages (First, Second, Third, Fourth), Partograph Plotting (Alert/Action lines) & APGAR Scoring"
    ],
    documents: [
      {
        id: "nsc302-doc-1",
        title: "NSC 302 - Male Reproductive System Anatomy, Physiology & Endocrinology",
        format: "PDF",
        pages: 35,
        summary: "Detailed structural and histological guide of testes, seminiferous tubules, epididymis, prostate, seminal vesicles, hormonal feedback loops, and clinical semen analysis parameters."
      },
      {
        id: "nsc302-doc-2",
        title: "NSC 302 - Female Reproductive System Anatomy, Oogenesis & Pelvic Architecture",
        format: "PPTX",
        pages: 40,
        summary: "Lecture slides on ovaries, uterus, cervix, pelvic floor muscles, true vs false pelvis, pelvic plane diameters (obstetric conjugate, interspinous diameter), and fetal head engagement."
      },
      {
        id: "nsc302-doc-3",
        title: "NSC 302 - Female Reproductive Tract: Comprehensive Anatomical & Histological Manual",
        format: "PDF",
        pages: 45,
        summary: "Comprehensive illustrated atlas and text on external genitalia, vaginal pH/microbiome, uterine layers (endometrium, myometrium, perimetrium), and fallopian tube physiology."
      },
      {
        id: "nsc302-doc-4",
        title: "NSC 302 - Menstrual Cycle, Hormonal Regulation & Ovulation Physiology (Unit 2)",
        format: "PPTX",
        pages: 38,
        summary: "Step-by-step hormone dynamics: GnRH, estrogen surge, LH surge triggering ovulation, progesterone secretion by corpus luteum, endometrial decidualization, and menses."
      },
      {
        id: "nsc302-doc-5",
        title: "NSC 302 - Clinical Chart 1: Maternal Antenatal Assessment & Gravida/Para Calculations",
        format: "JPEG / DIAGRAM",
        pages: 10,
        summary: "High-resolution clinical summary chart detailing Leopold's maneuvers, fundal height tracking (McDonald's rule), normal prenatal laboratory ranges, and fetal heart rate auscultation."
      },
      {
        id: "nsc302-doc-6",
        title: "NSC 302 - Clinical Chart 2: Labor Stages & WHO Partograph Interpretation Key",
        format: "JPEG / DIAGRAM",
        pages: 10,
        summary: "Visual guide to labor progression: latent vs active phase, plotting cervical dilatation against alert/action lines, monitoring fetal descent, and active management of 3rd stage of labor (AMTSL)."
      },
      {
        id: "nsc302-doc-7",
        title: "NSC 302 - Clinical Chart 3: Postpartum Assessment (BUBBLE-HE Protocol)",
        format: "JPEG / DIAGRAM",
        pages: 10,
        summary: "Clinical assessment mnemonic: Breasts, Uterus (fundal firmness/involution), Bladder, Bowels, Lochia (rubra, serosa, alba), Episiotomy/Perineum, Homan's sign, and Emotional status."
      },
      {
        id: "nsc302-doc-8",
        title: "NSC 302 - Clinical Chart 4: Neonatal APGAR Scoring & Immediate Resuscitation Algorithm",
        format: "JPEG / DIAGRAM",
        pages: 10,
        summary: "Rapid scoring tool at 1 and 5 minutes: Activity, Pulse, Grimace, Appearance, Respiration; immediate cord clamping rules, thermoregulation, and neonatal resuscitation steps."
      }
    ],
    has_past_questions: true,
    is_premium: true
  },

  // ─── 400 LEVEL: 400 LEVEL NURSING NOTES BANK ─────────
  {
    id: "kb-nsc401",
    course_code: "NSC 401",
    title: "400 Level Note: Community Health Nursing, Field Epidemiology & Communicable Disease Control",
    level: "400 Level",
    semester: "First Semester",
    faculty: "Health Sciences",
    department: "Department of Nursing Science",
    type: "lecture_notes",
    icon: "🌐",
    topics: [
      "Epidemiologic Triad (Agent, Host, Environment), Natural History of Disease & Levels of Prevention",
      "Epidemiological Study Designs: Observational (Cohort, Case-Control, Cross-Sectional) & Experimental (RCTs)",
      "Measures of Disease Frequency & Association: Incidence, Prevalence, Attack Rates, Relative Risk & Odds Ratios",
      "Surveillance & Control of Communicable Diseases (Malaria, TB, Cholera, Lassa Fever, Viral Hemorrhagic Fevers)",
      "HIV/AIDS: Epidemiology, Prevention of Mother-to-Child Transmission (PMTCT), ART Regimens & Stigma Reduction",
      "Field Epidemiology: 10 Steps in Outbreak Investigation, Epidemic Curves, Contact Tracing & Quarantine Protocols",
      "Information, Education & Communication (IEC) / Behavior Change Communication (BCC) in Public Health",
      "Non-Communicable Diseases (NCDs): Cardiovascular, Diabetes, Cancers & Community-Based Violence Interventions"
    ],
    documents: [
      {
        id: "nsc401-doc-1",
        title: "NSC 401 - Session 1: Introduction to Epidemiology, Disease Triad & Natural History",
        format: "PPTX",
        pages: 35,
        summary: "Core concepts of descriptive vs analytical epidemiology, web of causation, iceberg phenomenon of disease, and primary, secondary, and tertiary prevention frameworks."
      },
      {
        id: "nsc401-doc-2",
        title: "NSC 401 - Session 2: Epidemiological Study Designs (Cohort, Case-Control & Cross-Sectional)",
        format: "PPTX",
        pages: 38,
        summary: "Methodology, strengths, limitations, and bias control in prospective/retrospective cohort studies, case-control matching, cross-sectional prevalence surveys, and randomized controlled trials."
      },
      {
        id: "nsc401-doc-3",
        title: "NSC 401 - Session 3: Measures of Disease Frequency, Calculations & Risk Metrics",
        format: "PPTX",
        pages: 42,
        summary: "Mathematical calculations: cumulative incidence vs incidence density, point vs period prevalence, case fatality rates, proportional mortality, 2x2 contingency tables, Relative Risk (RR), and Odds Ratio (OR)."
      },
      {
        id: "nsc401-doc-4",
        title: "NSC 401 - Session 5: Epidemiology & Surveillance of Communicable Diseases in the Tropics",
        format: "PPTX",
        pages: 40,
        summary: "Chain of infection, transmission modes, Integrated Disease Surveillance and Response (IDSR) system, disease notification thresholds, and vector control strategies in Nigeria."
      },
      {
        id: "nsc401-doc-5",
        title: "NSC 401 - Session 7: HIV/AIDS Epidemiology, Prevention of Mother-to-Child Transmission (PMTCT) & ART",
        format: "PPTX",
        pages: 36,
        summary: "Global and national HIV statistics, modes of transmission, CD4 count / viral load staging, 4 prongs of PMTCT, Option B+ antiretroviral therapy, and post-exposure prophylaxis (PEP)."
      },
      {
        id: "nsc401-doc-6",
        title: "NSC 401 - Session 8-10: Applied Field Epidemiology, Outbreak Investigation & Contact Tracing",
        format: "PPTX",
        pages: 46,
        summary: "10-step outbreak investigation protocol: verifying diagnosis, establishing case definitions, plotting epidemic curves (point source vs propagated), environmental sampling, and implementing control measures."
      },
      {
        id: "nsc401-doc-7",
        title: "NSC 401 - Community-Based Violence: Assessment, Prevention & Social Interventions",
        format: "DOCX",
        pages: 28,
        summary: "Epidemiological analysis of gender-based violence (GBV), intimate partner violence, child abuse, trauma-informed nursing care, forensic documentation, and multisectoral referral pathways."
      },
      {
        id: "nsc401-doc-8",
        title: "NSC 401 - Information, Education & Communication (IEC) and Behavior Change (BCC) in Health",
        format: "PPTX",
        pages: 30,
        summary: "Health belief model, stages of change (Transtheoretical model), design and testing of health education materials, community mobilization strategies, and health advocacy."
      },
      {
        id: "nsc401-doc-9",
        title: "NSC 401 - Non-Communicable Diseases (NCDs): Epidemiology, Risk Factors & Chronic Disease Control",
        format: "DOCX",
        pages: 48,
        summary: "The epidemiological transition, modifiable risk factors (tobacco, physical inactivity, unhealthy diet, alcohol), hypertension and diabetes screening, WHO PEN package in primary care."
      }
    ],
    has_past_questions: true,
    is_premium: true
  },

  {
    id: "kb-nsc404",
    course_code: "NSC 404",
    title: "400 Level Note: Mental Health, Psychiatric Nursing & Substance Use Disorders",
    level: "400 Level",
    semester: "First Semester",
    faculty: "Health Sciences",
    department: "Department of Nursing Science",
    type: "lecture_notes",
    icon: "🧠",
    topics: [
      "Mental State Examination (MSE: Appearance, Behavior, Speech, Mood, Thought, Perception, Cognition, Insight)",
      "Substance-Related & Addictive Disorders: DSM-5 Diagnostic Criteria, Intoxication & Withdrawal Syndromes",
      "Therapeutic Nurse-Patient Relationship: Phases (Pre-orientation, Orientation, Working, Termination) & Boundaries",
      "Psychopharmacology: Antipsychotics (Typical vs Atypical, EPS, NMS), Antidepressants (SSRIs, SNRIs, TCAs, MAOIs), Mood Stabilizers (Lithium toxicity)",
      "Psychiatric Emergencies: Acute Psychosis, Severe Agitation, Suicide Risk Assessment & Crisis Intervention"
    ],
    documents: [
      {
        id: "nsc404-doc-1",
        title: "NSC 404 - Substance-Related and Addictive Disorders: DSM-5 Diagnostic Criteria & Nursing Care",
        format: "DOCX",
        pages: 32,
        summary: "Comprehensive clinical notes on addiction neurobiology, DSM-5 11 diagnostic criteria for substance use disorders, screening tools (CAGE, AUDIT, DAST), and motivational interviewing techniques."
      },
      {
        id: "nsc404-doc-2",
        title: "NSC 404 - Clinical Visual Guide 1: Psychiatric Mental State Assessment & Therapeutic Communication",
        format: "JFIF / VISUAL GUIDE",
        pages: 15,
        summary: "High-yield illustrated reference chart detailing the components of MSE, assessing thought content (delusions, obsessions) vs thought process, and active listening communication strategies."
      },
      {
        id: "nsc404-doc-3",
        title: "NSC 404 - Clinical Visual Guide 2: Psychopharmacology Pathways & Neurotransmitter Systems in Mood Disorders",
        format: "JFIF / VISUAL GUIDE",
        pages: 15,
        summary: "Detailed visual mapping of dopamine mesolimbic/mesocortical pathways, serotonin receptors in depression, managing extrapyramidal symptoms (acute dystonia, akathisia, parkinsonism, tardive dyskinesia), and neuroleptic malignant syndrome (NMS) emergencies."
      }
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
