// src/components/NoteDiagramRenderer.jsx
import React, { useId } from 'react';

/**
 * NoteDiagramRenderer
 * High-resolution, authentic vector academic diagrams, clinical decision algorithms,
 * mathematical coordinate geometries, statistical curves, and biochemical pathways.
 * Dynamically tailored to university syllabi (Medicine, Nursing, Pharmacy, Math, Chemistry, Physics, Biology, etc.)
 */
export default function NoteDiagramRenderer({ diagram, isLight = true }) {
  const uid = useId().replace(/:/g, '_');
  if (!diagram) return null;

  const bg = isLight ? '#F8FAFC' : 'rgba(255,255,255,0.03)';
  const border = isLight ? '#CBD5E1' : 'rgba(255,255,255,0.1)';
  const textColor = isLight ? '#0F172A' : '#FFFFFF';
  const subTextColor = isLight ? '#475569' : '#94A3B8';
  const primaryAccent = '#D97706'; // Gold/Amber accent
  const greenAccent = '#059669';  // Emerald
  const blueAccent = '#2563EB';   // Blue
  const redAccent = '#DC2626';    // Red
  const purpleAccent = '#7C3AED'; // Purple
  const cyanAccent = '#0891B2';   // Cyan

  const title = (diagram.title || '').trim();
  const caption = (diagram.caption || '').trim();
  const rawType = (diagram.diagramType || diagram.type || '').toLowerCase().trim();
  const courseCode = (diagram.courseCode || '').toUpperCase().trim();
  const fullText = `${title} ${caption} ${rawType} ${courseCode}`.toLowerCase();

  // Helper for arrow markers and gradients
  const renderDefs = () => (
    <defs>
      <marker id={`arr_${uid}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={isLight ? '#64748B' : '#94A3B8'} />
      </marker>
      <marker id={`arr_gold_${uid}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={primaryAccent} />
      </marker>
      <marker id={`arr_blue_${uid}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={blueAccent} />
      </marker>
      <marker id={`arr_red_${uid}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={redAccent} />
      </marker>
      <marker id={`arr_green_${uid}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={greenAccent} />
      </marker>
      <linearGradient id={`grad_card_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isLight ? '#FFFFFF' : '#1E293B'} />
        <stop offset="100%" stopColor={isLight ? '#F1F5F9' : '#0F172A'} />
      </linearGradient>
    </defs>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 1. MATHEMATICS: 3D CARTESIAN VECTOR & ORTHOGONAL PROJECTION
  // ──────────────────────────────────────────────────────────────────────────
  const renderMathVector = () => (
    <svg viewBox="0 0 740 320" style={{ width: '100%', height: 'auto', maxHeight: '320px' }}>
      {renderDefs()}
      {/* Background grid */}
      <g stroke={isLight ? '#E2E8F0' : 'rgba(255,255,255,0.06)'} strokeWidth="1" strokeDasharray="3,3">
        <line x1="80" y1="250" x2="380" y2="250" />
        <line x1="80" y1="210" x2="380" y2="210" />
        <line x1="80" y1="170" x2="380" y2="170" />
      </g>

      {/* Origin */}
      <circle cx="200" cy="210" r="4" fill={textColor} />
      <text x="185" y="228" fill={subTextColor} fontSize="12" fontWeight="bold" fontFamily="monospace">O(0,0,0)</text>

      {/* X Axis (oblique/isometric down-left) */}
      <line x1="200" y1="210" x2="100" y2="280" stroke={redAccent} strokeWidth="2.5" markerEnd={`arr_red_${uid}`} />
      <text x="80" y="295" fill={redAccent} fontSize="14" fontWeight="bold" fontFamily="sans-serif">+X Axis</text>
      {/* Unit Vector i */}
      <line x1="200" y1="210" x2="155" y2="241" stroke={redAccent} strokeWidth="4" />
      <text x="145" y="258" fill={redAccent} fontSize="13" fontWeight="bold" fontFamily="monospace">î</text>

      {/* Y Axis (horizontal right) */}
      <line x1="200" y1="210" x2="410" y2="210" stroke={greenAccent} strokeWidth="2.5" markerEnd={`arr_green_${uid}`} />
      <text x="420" y="215" fill={greenAccent} fontSize="14" fontWeight="bold" fontFamily="sans-serif">+Y Axis</text>
      {/* Unit Vector j */}
      <line x1="200" y1="210" x2="265" y2="210" stroke={greenAccent} strokeWidth="4" />
      <text x="255" y="200" fill={greenAccent} fontSize="13" fontWeight="bold" fontFamily="monospace">ĵ</text>

      {/* Z Axis (vertical up) */}
      <line x1="200" y1="210" x2="200" y2="35" stroke={blueAccent} strokeWidth="2.5" markerEnd={`arr_blue_${uid}`} />
      <text x="200" y="25" textAnchor="middle" fill={blueAccent} fontSize="14" fontWeight="bold" fontFamily="sans-serif">+Z Axis</text>
      {/* Unit Vector k */}
      <line x1="200" y1="210" x2="200" y2="155" stroke={blueAccent} strokeWidth="4" />
      <text x="182" y="170" fill={blueAccent} fontSize="13" fontWeight="bold" fontFamily="monospace">k̂</text>

      {/* Resultant Vector R to point P(x,y,z) */}
      <line x1="200" y1="210" x2="330" y2="90" stroke={primaryAccent} strokeWidth="3" markerEnd={`arr_gold_${uid}`} />
      <circle cx="330" cy="90" r="5" fill={primaryAccent} />
      <text x="340" y="85" fill={primaryAccent} fontSize="13" fontWeight="bold" fontFamily="sans-serif">P (x, y, z)</text>

      {/* Projection lines */}
      <line x1="330" y1="90" x2="330" y2="175" stroke={isLight ? '#94A3B8' : '#64748B'} strokeWidth="1.5" strokeDasharray="4,4" />
      <line x1="200" y1="210" x2="330" y2="175" stroke={isLight ? '#94A3B8' : '#64748B'} strokeWidth="1.5" strokeDasharray="4,4" />
      <line x1="330" y1="175" x2="250" y2="235" stroke={isLight ? '#94A3B8' : '#64748B'} strokeWidth="1.5" strokeDasharray="4,4" />
      <text x="270" y="130" fill={primaryAccent} fontSize="14" fontWeight="bold" fontFamily="serif">R⃗ = xî + yĵ + zk̂</text>

      {/* Side Formulation Panel */}
      <rect x="470" y="25" width="250" height="260" rx="8" fill={isLight ? '#F8FAFC' : '#1E293B'} stroke={border} strokeWidth="1.5" />
      <text x="595" y="55" textAnchor="middle" fill={primaryAccent} fontSize="13" fontWeight="bold" fontFamily="sans-serif">
        VECTOR CALCULUS FORMULARY
      </text>

      {/* Formula 1: Magnitude */}
      <rect x="485" y="70" width="220" height="52" rx="6" fill={isLight ? '#FFFFFF' : '#0F172A'} stroke={border} />
      <text x="495" y="90" fill={textColor} fontSize="11" fontWeight="bold" fontFamily="sans-serif">Vector Magnitude:</text>
      <text x="495" y="110" fill={primaryAccent} fontSize="12" fontWeight="bold" fontFamily="monospace">|R⃗| = √(x² + y² + z²)</text>

      {/* Formula 2: Dot Product */}
      <rect x="485" y="132" width="220" height="58" rx="6" fill={isLight ? '#FFFFFF' : '#0F172A'} stroke={border} />
      <text x="495" y="152" fill={textColor} fontSize="11" fontWeight="bold" fontFamily="sans-serif">Scalar (Dot) Product:</text>
      <text x="495" y="170" fill={blueAccent} fontSize="11.5" fontWeight="bold" fontFamily="monospace">A⃗ · B⃗ = |A⃗||B⃗|cos θ</text>
      <text x="495" y="184" fill={subTextColor} fontSize="10.5" fontFamily="monospace">= AxBx + AyBy + AzBz</text>

      {/* Formula 3: Cross Product */}
      <rect x="485" y="200" width="220" height="72" rx="6" fill={isLight ? '#FFFFFF' : '#0F172A'} stroke={border} />
      <text x="495" y="220" fill={textColor} fontSize="11" fontWeight="bold" fontFamily="sans-serif">Vector (Cross) Product:</text>
      <text x="495" y="238" fill={greenAccent} fontSize="11" fontWeight="bold" fontFamily="monospace">A⃗ × B⃗ = |A⃗||B⃗|sin θ n̂</text>
      <text x="495" y="258" fill={subTextColor} fontSize="10" fontFamily="sans-serif">Perpendicular to plane of A⃗ & B⃗</text>
    </svg>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 2. BIOSTATISTICS: NORMAL DISTRIBUTION (GAUSSIAN BELL CURVE) & REJECTION REGION
  // ──────────────────────────────────────────────────────────────────────────
  const renderNormalDistribution = () => (
    <svg viewBox="0 0 740 310" style={{ width: '100%', height: 'auto', maxHeight: '310px' }}>
      {renderDefs()}
      <defs>
        {/* Shaded Rejection Tail Left: x from 70 to 195 */}
        <clipPath id={`left_tail_${uid}`}>
          <rect x="60" y="20" width="135" height="230" />
        </clipPath>
        {/* Shaded Rejection Tail Right: x from 545 to 680 */}
        <clipPath id={`right_tail_${uid}`}>
          <rect x="545" y="20" width="135" height="230" />
        </clipPath>
        {/* Central 95% Region: x from 195 to 545 */}
        <clipPath id={`center_95_${uid}`}>
          <rect x="195" y="20" width="350" height="230" />
        </clipPath>
      </defs>

      {/* Axis Baseline */}
      <line x1="60" y1="240" x2="680" y2="240" stroke={textColor} strokeWidth="2" markerEnd={`arr_${uid}`} />

      {/* Gaussian Path (Peak at x=370, y=50; Base at y=240) */}
      {/* Shaded Center 95% Acceptance Region */}
      <path
        d="M 60 240 C 130 240, 180 230, 240 185 C 290 140, 330 50, 370 50 C 410 50, 450 140, 500 185 C 560 230, 610 240, 680 240 Z"
        fill={isLight ? '#DBEAFE' : 'rgba(37, 99, 235, 0.25)'}
        clipPath={`url(#center_95_${uid})`}
      />

      {/* Left Rejection Region (< -1.96) in Red */}
      <path
        d="M 60 240 C 130 240, 180 230, 240 185 C 290 140, 330 50, 370 50 C 410 50, 450 140, 500 185 C 560 230, 610 240, 680 240 Z"
        fill={isLight ? '#FEE2E2' : 'rgba(239, 68, 68, 0.35)'}
        clipPath={`url(#left_tail_${uid})`}
      />

      {/* Right Rejection Region (> +1.96) in Red */}
      <path
        d="M 60 240 C 130 240, 180 230, 240 185 C 290 140, 330 50, 370 50 C 410 50, 450 140, 500 185 C 560 230, 610 240, 680 240 Z"
        fill={isLight ? '#FEE2E2' : 'rgba(239, 68, 68, 0.35)'}
        clipPath={`url(#right_tail_${uid})`}
      />

      {/* Bell Curve Outline */}
      <path
        d="M 60 240 C 130 240, 180 230, 240 185 C 290 140, 330 50, 370 50 C 410 50, 450 140, 500 185 C 560 230, 610 240, 680 240"
        fill="none"
        stroke={blueAccent}
        strokeWidth="3"
      />

      {/* Center Mean line (x=370) */}
      <line x1="370" y1="50" x2="370" y2="240" stroke={textColor} strokeWidth="1.5" strokeDasharray="4,4" />
      <text x="370" y="258" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="bold" fontFamily="sans-serif">μ = 0</text>
      <text x="370" y="272" textAnchor="middle" fill={subTextColor} fontSize="10" fontFamily="sans-serif">Mean / Median</text>

      {/* Standard Deviation Tick Marks */}
      {/* -1.96 Critical line (x=195) */}
      <line x1="195" y1="140" x2="195" y2="240" stroke={redAccent} strokeWidth="1.5" strokeDasharray="3,3" />
      <text x="195" y="258" textAnchor="middle" fill={redAccent} fontSize="12" fontWeight="bold" fontFamily="sans-serif">-1.96</text>
      <text x="195" y="272" textAnchor="middle" fill={redAccent} fontSize="9.5" fontFamily="sans-serif">Critical Value</text>

      {/* +1.96 Critical line (x=545) */}
      <line x1="545" y1="140" x2="545" y2="240" stroke={redAccent} strokeWidth="1.5" strokeDasharray="3,3" />
      <text x="545" y="258" textAnchor="middle" fill={redAccent} fontSize="12" fontWeight="bold" fontFamily="sans-serif">+1.96</text>
      <text x="545" y="272" textAnchor="middle" fill={redAccent} fontSize="9.5" fontFamily="sans-serif">Critical Value</text>

      {/* ±1σ (x=280 and x=460) */}
      <line x1="280" y1="190" x2="280" y2="240" stroke={subTextColor} strokeWidth="1" strokeDasharray="2,2" />
      <text x="280" y="258" textAnchor="middle" fill={subTextColor} fontSize="11" fontFamily="sans-serif">-1σ</text>
      <line x1="460" y1="190" x2="460" y2="240" stroke={subTextColor} strokeWidth="1" strokeDasharray="2,2" />
      <text x="460" y="258" textAnchor="middle" fill={subTextColor} fontSize="11" fontFamily="sans-serif">+1σ</text>

      {/* Central 95% Confidence Interval Label */}
      <rect x="270" y="90" width="200" height="42" rx="6" fill={isLight ? '#FFFFFF' : '#1E293B'} stroke={blueAccent} strokeWidth="1.5" />
      <text x="370" y="108" textAnchor="middle" fill={blueAccent} fontSize="12" fontWeight="bold" fontFamily="sans-serif">
        1 - α = 95% ACCEPTANCE REGION
      </text>
      <text x="370" y="124" textAnchor="middle" fill={subTextColor} fontSize="10" fontFamily="sans-serif">
        Fail to Reject H₀ (p ≥ 0.05)
      </text>

      {/* Left Rejection Callout */}
      <path d="M 120 200 L 150 160" stroke={redAccent} strokeWidth="1.5" markerEnd={`arr_red_${uid}`} />
      <text x="120" y="150" textAnchor="middle" fill={redAccent} fontSize="10.5" fontWeight="bold" fontFamily="sans-serif">
        Rejection Region (α/2 = 2.5%)
      </text>

      {/* Right Rejection Callout */}
      <path d="M 620 200 L 590 160" stroke={redAccent} strokeWidth="1.5" markerEnd={`arr_red_${uid}`} />
      <text x="620" y="150" textAnchor="middle" fill={redAccent} fontSize="10.5" fontWeight="bold" fontFamily="sans-serif">
        Rejection Region (α/2 = 2.5%)
      </text>

      {/* Formula Footer */}
      <rect x="180" y="284" width="380" height="24" rx="4" fill={isLight ? '#F1F5F9' : '#1E293B'} />
      <text x="370" y="300" textAnchor="middle" fill={textColor} fontSize="11" fontWeight="bold" fontFamily="monospace">
        Standard Error: SE = s / √n   •   Z-score = (X̄ - μ) / (σ / √n)
      </text>
    </svg>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 3. WHO PARTOGRAPH: LABOR PROGRESSION & CRITICAL ACTION LINE (OBSTETRICS)
  // ──────────────────────────────────────────────────────────────────────────
  const renderPartograph = () => (
    <svg viewBox="0 0 740 310" style={{ width: '100%', height: 'auto', maxHeight: '310px' }}>
      {renderDefs()}
      {/* Grid Canvas */}
      <g stroke={isLight ? '#E2E8F0' : 'rgba(255,255,255,0.06)'} strokeWidth="1">
        {/* Horizontal dilation grid lines (0 to 10 cm) */}
        {[0, 2, 4, 6, 8, 10].map((cm, idx) => (
          <g key={idx}>
            <line x1="80" y1={250 - cm * 20} x2="680" y2={250 - cm * 20} />
            <text x="70" y={254 - cm * 20} textAnchor="end" fill={subTextColor} fontSize="11" fontFamily="sans-serif">
              {cm} cm
            </text>
          </g>
        ))}
        {/* Vertical hour grid lines (0 to 12 hours) */}
        {[0, 2, 4, 6, 8, 10, 12].map((hr, idx) => (
          <g key={idx}>
            <line x1={100 + hr * 45} y1="50" x2={100 + hr * 45} y2="250" />
            <text x={100 + hr * 45} y="268" textAnchor="middle" fill={subTextColor} fontSize="11" fontFamily="sans-serif">
              Hr {hr}
            </text>
          </g>
        ))}
      </g>

      {/* Latent Phase Shading (0-4 hours / 0-4 cm) */}
      <rect x="100" y="170" width="180" height="80" fill={isLight ? '#FEF3C7' : 'rgba(217, 119, 6, 0.12)'} />
      <text x="190" y="215" textAnchor="middle" fill={primaryAccent} fontSize="12" fontWeight="bold" fontFamily="sans-serif">
        LATENT PHASE (0 – 4 cm)
      </text>

      {/* ALERT LINE: Starts at (Hr 4, 4cm -> x=280, y=170) and slopes to (Hr 10, 10cm -> x=550, y=50) */}
      <line x1="280" y1="170" x2="550" y2="50" stroke={primaryAccent} strokeWidth="3" />
      <text x="400" y="100" fill={primaryAccent} fontSize="12" fontWeight="bold" fontFamily="sans-serif" transform="rotate(-23 400 100)">
        ALERT LINE (1 cm / hr)
      </text>

      {/* ACTION LINE: Exactly 4 hours to the right of Alert Line -> (Hr 8, 4cm -> x=460, y=170) to (Hr 14) */}
      <line x1="460" y1="170" x2="680" y2="72" stroke={redAccent} strokeWidth="3" strokeDasharray="5,3" />
      <text x="560" y="125" fill={redAccent} fontSize="12" fontWeight="bold" fontFamily="sans-serif" transform="rotate(-23 560 125)">
        ACTION LINE (4-Hr Delay)
      </text>

      {/* Prolonged Labor Intervention Zone */}
      <rect x="520" y="150" width="180" height="60" rx="6" fill={isLight ? '#FEE2E2' : 'rgba(239, 68, 68, 0.25)'} stroke={redAccent} strokeWidth="1.5" />
      <text x="610" y="172" textAnchor="middle" fill={redAccent} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
        CRITICAL INTERVENTION
      </text>
      <text x="610" y="190" textAnchor="middle" fill={textColor} fontSize="10" fontFamily="sans-serif">
        CPD / Emergency C-Section / Oxytocin
      </text>

      {/* Normal Labor Progression Plot Points */}
      <polyline
        points="100,240 190,210 280,170 340,130 400,90 460,50"
        fill="none"
        stroke={greenAccent}
        strokeWidth="2.5"
      />
      {[[100,240], [190,210], [280,170], [340,130], [400,90], [460,50]].map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r="4" fill={greenAccent} stroke="#FFFFFF" strokeWidth="1.5" />
      ))}
      <text x="360" y="45" fill={greenAccent} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
        Normal Labor Curve (Left of Alert Line)
      </text>

      {/* Axis Titles */}
      <text x="40" y="150" textAnchor="middle" fill={textColor} fontSize="12" fontWeight="bold" fontFamily="sans-serif" transform="rotate(-90 40 150)">
        Cervical Dilatation (cm)
      </text>
      <text x="390" y="295" textAnchor="middle" fill={textColor} fontSize="12" fontWeight="bold" fontFamily="sans-serif">
        Duration of Active Labor (Hours)
      </text>
    </svg>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 4. PHYSIOLOGY: CARDIAC & NEURONAL ACTION POTENTIAL PHASES
  // ──────────────────────────────────────────────────────────────────────────
  const renderActionPotential = () => (
    <svg viewBox="0 0 740 310" style={{ width: '100%', height: 'auto', maxHeight: '310px' }}>
      {renderDefs()}
      {/* Grid Lines */}
      <g stroke={isLight ? '#E2E8F0' : 'rgba(255,255,255,0.06)'} strokeWidth="1">
        <line x1="90" y1="70" x2="680" y2="70" />
        <text x="80" y="74" textAnchor="end" fill={subTextColor} fontSize="11" fontFamily="monospace">+30 mV</text>

        <line x1="90" y1="130" x2="680" y2="130" />
        <text x="80" y="134" textAnchor="end" fill={subTextColor} fontSize="11" fontFamily="monospace">0 mV</text>

        <line x1="90" y1="180" x2="680" y2="180" strokeDasharray="3,3" stroke={primaryAccent} />
        <text x="80" y="184" textAnchor="end" fill={primaryAccent} fontSize="11" fontWeight="bold" fontFamily="monospace">-55 mV (Threshold)</text>

        <line x1="90" y1="230" x2="680" y2="230" />
        <text x="80" y="234" textAnchor="end" fill={subTextColor} fontSize="11" fontFamily="monospace">-70 mV (RMP)</text>

        <line x1="90" y1="260" x2="680" y2="260" />
        <text x="80" y="264" textAnchor="end" fill={subTextColor} fontSize="11" fontFamily="monospace">-90 mV</text>
      </g>

      {/* Action Potential Path */}
      {/* Resting -> Phase 0 -> Peak -> Phase 1 -> Phase 2 Plateau -> Phase 3 -> Phase 4 */}
      <path
        d="M 100 230 L 200 230 L 230 180 L 270 70 L 300 95 L 430 110 L 530 240 L 570 260 L 630 230 L 680 230"
        fill="none"
        stroke={blueAccent}
        strokeWidth="3.5"
      />

      {/* Annotations for Phases */}
      {/* Phase 0: Rapid Depolarization */}
      <rect x="180" y="90" width="80" height="40" rx="6" fill={isLight ? '#FEF3C7' : '#78350F'} stroke={primaryAccent} />
      <text x="220" y="107" textAnchor="middle" fill={textColor} fontSize="10.5" fontWeight="bold" fontFamily="sans-serif">Phase 0</text>
      <text x="220" y="122" textAnchor="middle" fill={primaryAccent} fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">Na⁺ Influx</text>

      {/* Phase 1: Notch */}
      <text x="305" y="60" fill={textColor} fontSize="10.5" fontWeight="bold" fontFamily="sans-serif">Phase 1 (Transient K⁺)</text>

      {/* Phase 2: Plateau (Ca2+ in = K+ out) */}
      <rect x="330" y="55" width="110" height="42" rx="6" fill={isLight ? '#DBEAFE' : '#1E3A8A'} stroke={blueAccent} />
      <text x="385" y="73" textAnchor="middle" fill={textColor} fontSize="10.5" fontWeight="bold" fontFamily="sans-serif">Phase 2: Plateau</text>
      <text x="385" y="88" textAnchor="middle" fill={blueAccent} fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">Ca²⁺ Influx (L-Type)</text>

      {/* Phase 3: Rapid Repolarization */}
      <rect x="490" y="150" width="100" height="42" rx="6" fill={isLight ? '#D1FAE5' : '#064E3B'} stroke={greenAccent} />
      <text x="540" y="168" textAnchor="middle" fill={textColor} fontSize="10.5" fontWeight="bold" fontFamily="sans-serif">Phase 3: Repol.</text>
      <text x="540" y="183" textAnchor="middle" fill={greenAccent} fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">K⁺ Efflux</text>

      {/* Phase 4: Resting Potential */}
      <text x="640" y="215" textAnchor="middle" fill={textColor} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
        Phase 4: RMP
      </text>
      <text x="640" y="278" textAnchor="middle" fill={subTextColor} fontSize="10" fontFamily="sans-serif">
        Na⁺/K⁺ ATPase Pump
      </text>

      {/* Refractory Periods Bracket */}
      <line x1="230" y1="285" x2="490" y2="285" stroke={redAccent} strokeWidth="2" />
      <text x="360" y="302" textAnchor="middle" fill={redAccent} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
        Absolute Refractory Period (ARP)
      </text>
      <line x1="490" y1="285" x2="570" y2="285" stroke={primaryAccent} strokeWidth="2" />
      <text x="530" y="302" textAnchor="middle" fill={primaryAccent} fontSize="10" fontWeight="bold" fontFamily="sans-serif">
        RRP
      </text>
    </svg>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 5. NURSING: 5-STEP CYCLICAL PROCESS (ADPIE) FEEDBACK LOOP
  // ──────────────────────────────────────────────────────────────────────────
  const renderNursingProcessCycle = () => {
    const steps = [
      { num: '1', title: 'Assessment', desc: 'Subjective & Objective data collection, baseline vital signs & triage', color: primaryAccent },
      { num: '2', title: 'Diagnosis', desc: 'NANDA-I PES format: Problem, Etiology, and Signs/Symptoms', color: blueAccent },
      { num: '3', title: 'Planning', desc: 'SMART patient goals, expected outcomes & nursing orders', color: purpleAccent },
      { num: '4', title: 'Implementation', desc: 'Execution of autonomous & collaborative nursing interventions', color: cyanAccent },
      { num: '5', title: 'Evaluation', desc: 'Appraise goal achievement, review effectiveness & revise care plan', color: greenAccent }
    ];

    return (
      <svg viewBox="0 0 740 300" style={{ width: '100%', height: 'auto', maxHeight: '300px' }}>
        {renderDefs()}
        {/* Horizontal connected pipeline */}
        {steps.map((st, idx) => {
          const x = 30 + idx * 142;
          return (
            <g key={idx}>
              {/* Connector Arrow */}
              {idx < steps.length - 1 && (
                <line
                  x1={x + 120}
                  y1="110"
                  x2={x + 140}
                  y2="110"
                  stroke={textColor}
                  strokeWidth="2"
                  markerEnd={`arr_${uid}`}
                />
              )}
              {/* Card Box */}
              <rect
                x={x}
                y="55"
                width="120"
                height="125"
                rx="8"
                fill={isLight ? '#FFFFFF' : '#1E293B'}
                stroke={st.color}
                strokeWidth="2"
              />
              {/* Step Badge */}
              <circle cx={x + 60} cy="40" r="18" fill={st.color} />
              <text x={x + 60} y="46" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
                {st.num}
              </text>
              {/* Title */}
              <text x={x + 60} y="85" textAnchor="middle" fill={textColor} fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                {st.title}
              </text>
              {/* Description */}
              <foreignObject x={x + 6} y="95" width="108" height="80">
                <div style={{
                  fontSize: '9.5px',
                  lineHeight: '1.25',
                  color: subTextColor,
                  textAlign: 'center',
                  padding: '2px',
                  fontFamily: 'sans-serif'
                }}>
                  {st.desc}
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Dynamic Closed-Loop Feedback Arrow: Step 5 -> Step 1 */}
        <path
          d="M 660 190 C 660 250, 90 250, 90 190"
          fill="none"
          stroke={greenAccent}
          strokeWidth="2.5"
          strokeDasharray="6,4"
          markerEnd={`arr_green_${uid}`}
        />
        <text x="375" y="242" textAnchor="middle" fill={greenAccent} fontSize="11.5" fontWeight="bold" fontFamily="sans-serif">
          Continuous Reassessment & Cyclical Care Plan Revision Feedback Loop (↺)
        </text>
      </svg>
    );
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 6. PUBLIC HEALTH / EPIDEMIOLOGY: THE EPIDEMIOLOGIC TRIAD
  // ──────────────────────────────────────────────────────────────────────────
  const renderEpidemiologicTriad = () => (
    <svg viewBox="0 0 740 300" style={{ width: '100%', height: 'auto', maxHeight: '300px' }}>
      {renderDefs()}
      {/* Triangular connection lines */}
      <polygon
        points="370,45 150,230 590,230"
        fill={isLight ? 'rgba(217, 119, 6, 0.05)' : 'rgba(255,255,255,0.02)'}
        stroke={primaryAccent}
        strokeWidth="3"
        strokeDasharray="6,4"
      />

      {/* Central Vector / Transmission Hub */}
      <circle cx="370" cy="165" r="45" fill={isLight ? '#FEF3C7' : '#78350F'} stroke={primaryAccent} strokeWidth="2" />
      <text x="370" y="160" textAnchor="middle" fill={textColor} fontSize="12" fontWeight="bold" fontFamily="sans-serif">VECTOR</text>
      <text x="370" y="175" textAnchor="middle" fill={subTextColor} fontSize="10" fontFamily="sans-serif">Transmission</text>

      {/* Apex: AGENT */}
      <rect x="290" y="15" width="160" height="60" rx="8" fill={isLight ? '#FEE2E2' : '#7F1D1D'} stroke={redAccent} strokeWidth="2" />
      <text x="370" y="38" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="bold" fontFamily="sans-serif">1. AGENT</text>
      <text x="370" y="55" textAnchor="middle" fill={subTextColor} fontSize="10.5" fontFamily="sans-serif">Virulence, Inoculum, Toxins</text>

      {/* Bottom Left: HOST */}
      <rect x="70" y="210" width="160" height="65" rx="8" fill={isLight ? '#DBEAFE' : '#1E3A8A'} stroke={blueAccent} strokeWidth="2" />
      <text x="150" y="235" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="bold" fontFamily="sans-serif">2. HOST</text>
      <text x="150" y="252" textAnchor="middle" fill={subTextColor} fontSize="10.5" fontFamily="sans-serif">Immunity, Age, Genetics,</text>
      <text x="150" y="265" textAnchor="middle" fill={subTextColor} fontSize="10.5" fontFamily="sans-serif">Nutritional Status</text>

      {/* Bottom Right: ENVIRONMENT */}
      <rect x="510" y="210" width="160" height="65" rx="8" fill={isLight ? '#D1FAE5' : '#064E3B'} stroke={greenAccent} strokeWidth="2" />
      <text x="590" y="235" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="bold" fontFamily="sans-serif">3. ENVIRONMENT</text>
      <text x="590" y="252" textAnchor="middle" fill={subTextColor} fontSize="10.5" fontFamily="sans-serif">Sanitation, Water, Housing,</text>
      <text x="590" y="265" textAnchor="middle" fill={subTextColor} fontSize="10.5" fontFamily="sans-serif">Climate & Health Services</text>

      {/* Bottom Banner */}
      <text x="370" y="292" textAnchor="middle" fill={textColor} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
        Epidemiological Equilibrium: Breaking any arm of the triad halts disease transmission.
      </text>
    </svg>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 7. PRIMARY HEALTH CARE / HEALTH SYSTEM PYRAMID HIERARCHY
  // ──────────────────────────────────────────────────────────────────────────
  const renderPyramidHierarchy = () => (
    <svg viewBox="0 0 740 300" style={{ width: '100%', height: 'auto', maxHeight: '300px' }}>
      {renderDefs()}
      {/* Tier 1: Tertiary (Apex) */}
      <polygon
        points="370,30 280,105 460,105"
        fill={isLight ? '#FEE2E2' : '#7F1D1D'}
        stroke={redAccent}
        strokeWidth="2"
      />
      <text x="370" y="70" textAnchor="middle" fill={textColor} fontSize="12" fontWeight="bold" fontFamily="sans-serif">
        TERTIARY CARE
      </text>
      <text x="370" y="85" textAnchor="middle" fill={subTextColor} fontSize="10" fontFamily="sans-serif">
        Teaching & Specialist Hospitals (ICU, Complex Surgeries)
      </text>

      {/* Tier 2: Secondary (Middle) */}
      <polygon
        points="275,112 195,190 545,190 465,112"
        fill={isLight ? '#DBEAFE' : '#1E3A8A'}
        stroke={blueAccent}
        strokeWidth="2"
      />
      <text x="370" y="145" textAnchor="middle" fill={textColor} fontSize="12" fontWeight="bold" fontFamily="sans-serif">
        SECONDARY HEALTH CARE
      </text>
      <text x="370" y="162" textAnchor="middle" fill={subTextColor} fontSize="10" fontFamily="sans-serif">
        General & District Hospitals (Inpatient, Blood Bank, Emergency)
      </text>

      {/* Tier 3: Primary (Base) */}
      <polygon
        points="190,197 100,275 640,275 550,197"
        fill={isLight ? '#D1FAE5' : '#064E3B'}
        stroke={greenAccent}
        strokeWidth="2"
      />
      <text x="370" y="225" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="bold" fontFamily="sans-serif">
        PRIMARY HEALTH CARE (PHC) - ALMA-ATA PILLAR
      </text>
      <text x="370" y="243" textAnchor="middle" fill={subTextColor} fontSize="10.5" fontFamily="sans-serif">
        Comprehensive Centers, Health Posts, Dispensaries, Community Health Extension Workers (CHEWs)
      </text>
      <text x="370" y="258" textAnchor="middle" fill={subTextColor} fontSize="9.5" fontFamily="sans-serif">
        Immunization, Maternal-Child Health, Essential Drugs, Clean Water & Sanitation
      </text>

      {/* Referral Vector (Side Arrow) */}
      <line x1="655" y1="260" x2="480" y2="45" stroke={primaryAccent} strokeWidth="2.5" markerEnd={`arr_gold_${uid}`} />
      <text x="635" y="130" fill={primaryAccent} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
        Ascending Referral Path ↑
      </text>
    </svg>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 8. DYNAMIC STEP PIPELINE (PARSED DIRECTLY FROM CAPTION WITH "->")
  // ──────────────────────────────────────────────────────────────────────────
  const renderDynamicStepPipeline = () => {
    // Split caption into sequential steps by "->" or "-->"
    const rawSteps = caption
      .replace(/^(flowchart|schematic|workflow|pipeline|steps?|algorithm):\s*/i, '')
      .split(/->|-->/)
      .map(s => s.trim().replace(/^\[|\]$/g, ''))
      .filter(s => s.length > 0 && !s.toLowerCase().includes('figure'));

    // If less than 2 steps, fallback
    if (rawSteps.length < 2) {
      return renderDynamicWorkflowFallback();
    }

    // Limit to max 6 steps for clean SVG rendering
    const displaySteps = rawSteps.slice(0, 6);
    const stepWidth = Math.min(150, Math.floor(660 / displaySteps.length) - 15);
    const totalSpacing = Math.floor(700 / displaySteps.length);

    const colors = [primaryAccent, blueAccent, purpleAccent, cyanAccent, greenAccent, redAccent];

    return (
      <svg viewBox="0 0 740 280" style={{ width: '100%', height: 'auto', maxHeight: '280px' }}>
        {renderDefs()}
        {displaySteps.map((stepText, idx) => {
          const x = 20 + idx * totalSpacing;
          const color = colors[idx % colors.length];
          const isAction = stepText.startsWith('[') || stepText.toLowerCase().includes('apply') || stepText.toLowerCase().includes('divide') || stepText.toLowerCase().includes('multiply');

          return (
            <g key={idx}>
              {/* Connector Arrow */}
              {idx < displaySteps.length - 1 && (
                <line
                  x1={x + stepWidth + 2}
                  y1="110"
                  x2={x + totalSpacing - 6}
                  y2="110"
                  stroke={textColor}
                  strokeWidth="2"
                  markerEnd={`arr_${uid}`}
                />
              )}

              {/* Step Card */}
              <rect
                x={x}
                y="45"
                width={stepWidth}
                height="135"
                rx="8"
                fill={isLight ? '#FFFFFF' : '#1E293B'}
                stroke={color}
                strokeWidth="2"
              />

              {/* Step Number Tag */}
              <rect
                x={x + 8}
                y="55"
                width="24"
                height="20"
                rx="4"
                fill={color}
              />
              <text x={x + 20} y="69" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                {idx + 1}
              </text>

              <text x={x + 38} y="69" fill={color} fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                {isAction ? "Action" : `Stage ${idx + 1}`}
              </text>

              {/* Step Body */}
              <foreignObject x={x + 6} y="85" width={stepWidth - 12} height="90">
                <div style={{
                  fontSize: displaySteps.length > 4 ? '10px' : '11px',
                  lineHeight: '1.3',
                  color: textColor,
                  fontWeight: 600,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  fontFamily: 'sans-serif',
                  wordBreak: 'break-word'
                }}>
                  {stepText}
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Global Progress Header / Footer */}
        <rect x="40" y="205" width="660" height="40" rx="6" fill={isLight ? '#F1F5F9' : '#1E293B'} stroke={border} />
        <text x="370" y="230" textAnchor="middle" fill={subTextColor} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
          Sequential Academic Methodological Execution • Verified Step-by-Step Curriculum Flow
        </text>
      </svg>
    );
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 9. DYNAMIC WORKFLOW FALLBACK (TOPIC-SPECIFIC CARDS)
  // ──────────────────────────────────────────────────────────────────────────
  const renderDynamicWorkflowFallback = () => {
    const topicLabel = diagram.primaryTopic || title || 'Academic Subject Matter';
    const stages = [
      { num: 'I', label: 'Baseline Assessment', desc: `Verify fundamental parameters, initial conditions & reference limits for ${topicLabel}.` },
      { num: 'II', label: 'Mechanism Transduction', desc: `Theoretical modeling, molecular cascades, and formula derivations governing system equilibrium.` },
      { num: 'III', label: 'Protocol Intervention', desc: `Standardized operational procedure execution, dosage titrations, or analytical calculations.` },
      { num: 'IV', label: 'Equilibrium & Verification', desc: `Appraise output metrics, documentation compliance, and feedback regulation stability.` }
    ];

    return (
      <svg viewBox="0 0 740 280" style={{ width: '100%', height: 'auto', maxHeight: '280px' }}>
        {renderDefs()}
        {stages.map((st, idx) => {
          const x = 30 + idx * 175;
          const color = [primaryAccent, blueAccent, purpleAccent, greenAccent][idx];
          return (
            <g key={idx}>
              {idx < 3 && (
                <line
                  x1={x + 145}
                  y1="105"
                  x2={x + 170}
                  y2="105"
                  stroke={textColor}
                  strokeWidth="2"
                  markerEnd={`arr_${uid}`}
                />
              )}
              <rect
                x={x}
                y="40"
                width="145"
                height="130"
                rx="8"
                fill={isLight ? '#FFFFFF' : '#1E293B'}
                stroke={color}
                strokeWidth="2"
              />
              <circle cx={x + 22} cy="58" r="12" fill={color} />
              <text x={x + 22} y="62" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                {st.num}
              </text>
              <text x={x + 40} y="62" fill={textColor} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                {st.label}
              </text>
              <foreignObject x={x + 8} y="78" width="129" height="85">
                <div style={{
                  fontSize: '10px',
                  lineHeight: '1.3',
                  color: subTextColor,
                  fontFamily: 'sans-serif'
                }}>
                  {st.desc}
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Feedback loop */}
        <path
          d="M 640 180 C 640 235, 100 235, 100 180"
          fill="none"
          stroke={primaryAccent}
          strokeWidth="2"
          strokeDasharray="5,4"
          markerEnd={`arr_gold_${uid}`}
        />
        <text x="370" y="228" textAnchor="middle" fill={primaryAccent} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
          Homeostatic Control & Regulatory Quality Assurance Loop (↺)
        </text>
      </svg>
    );
  };

  // ──────────────────────────────────────────────────────────────────────────
  // DISPATCHER: SELECT SPECIALIZED ACADEMIC RENDERER BASED ON TOPIC & CONTENT
  // ──────────────────────────────────────────────────────────────────────────
  const selectDiagramRenderer = () => {
    // 1. Math / Vectors / Coordinate Geometry
    if (fullText.includes('vector') || fullText.includes('3d coordinate') || fullText.includes('orthogonal') || fullText.includes('argand') || fullText.includes('complex plane') || courseCode.startsWith('MTH')) {
      return renderMathVector();
    }

    // 2. Normal Distribution / Gaussian Curve
    if (fullText.includes('normal distribution') || fullText.includes('empirical 68') || fullText.includes('bell curve') || fullText.includes('critical rejection') || fullText.includes('z-score')) {
      return renderNormalDistribution();
    }

    // 3. Obstetrics / WHO Partograph Labor Progression
    if (fullText.includes('partograph') || fullText.includes('labor progress') || fullText.includes('cervical dilatation') || (courseCode === 'NSC 302' && fullText.includes('labor'))) {
      return renderPartograph();
    }

    // 4. Action Potential (Cardiac / Neuronal)
    if (fullText.includes('action potential') || fullText.includes('pacemaker potential') || fullText.includes('depolarization') || fullText.includes('sa nodal')) {
      return renderActionPotential();
    }

    // 5. Nursing Process (ADPIE) Cycle
    if (fullText.includes('nursing process') || fullText.includes('adpie') || (courseCode === 'NSC 301' && fullText.includes('cyclical'))) {
      return renderNursingProcessCycle();
    }

    // 6. Epidemiologic Triad (Agent - Host - Environment)
    if (fullText.includes('epidemiologic triad') || fullText.includes('triad') || (courseCode === 'NSC 401' && fullText.includes('agent-host'))) {
      return renderEpidemiologicTriad();
    }

    // 7. Primary Health Care / Health System Hierarchy Pyramid
    if (fullText.includes('primary health care') || fullText.includes('phc') || fullText.includes('pyramid') || fullText.includes('hierarchy') || fullText.includes('oyo empire') || fullText.includes('regulatory architecture')) {
      return renderPyramidHierarchy();
    }

    // 8. If caption has explicit step progression ("->"), render authentic parsed pipeline
    if (caption.includes('->') || caption.includes('-->')) {
      return renderDynamicStepPipeline();
    }

    // 9. Otherwise fallback to high-yield dynamic academic workflow
    return renderDynamicWorkflowFallback();
  };

  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: '8px',
      padding: '1.25rem',
      margin: '1.5rem 0',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Diagram Canvas */}
      <div style={{
        background: isLight ? '#FFFFFF' : '#0B0F17',
        borderRadius: '6px',
        padding: '1rem',
        border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255,255,255,0.06)',
        marginBottom: '0.85rem',
        overflowX: 'auto'
      }}>
        {selectDiagramRenderer()}
      </div>

      {/* Caption & Figure Legend */}
      <div style={{
        fontSize: '0.85rem',
        color: textColor,
        fontWeight: 700,
        marginBottom: '0.35rem'
      }}>
        {diagram.figureLabel || "Figure 1.0"}: {diagram.title || "Academic Methodological Diagram"}
      </div>
      <div style={{
        fontSize: '0.76rem',
        color: subTextColor,
        maxWidth: '660px',
        margin: '0 auto',
        lineHeight: 1.45
      }}>
        {diagram.caption || "Schematic illustration detailing the step-by-step diagnostic hierarchy, feedback loop mechanisms, and standardized clinical intervention guidelines for this course module."}
      </div>
    </div>
  );
}
