# 🎓 HackMyDegree
### *The Ultimate Nigerian University Resource Network*

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/vibesemmy/hackmydegree/blob/main/LICENSE)
[![React](https://img.shields.io/badge/frontend-React-61dafb.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/backend-Supabase-3ecf8e.svg)](https://supabase.com/)
[![Design](https://img.shields.io/badge/design-Material--Design--3-FFD600.svg)]()

**HackMyDegree** is a premium, community-driven educational platform built for Nigerian engineering and academic excellence. It serves as a central intelligence hub where students can access verified faculty resources, book elite tutors, and collaborate within a high-performance ecosystem.

---

## ✨ Signature Features

### 📡 The Resource Matrix
*   **Verified Vault**: Access faculty-specific past questions, lecture notes, and research guides.
*   **Monetization Engine**: Upload high-quality materials and earn premium royalties directly to your wallet.
*   **Smart Categorization**: Academic resources organized by university, department, and level.

### 🧠 Private Tutoring Network
*   **Elite Mentors**: Connect with top scholars from across all Nigerian universities.
*   **Seamless Booking**: integrated scheduling and Paystack-secured transactions.
*   **Virtual Classrooms**: Direct integration for meeting links and session management.

### 🎭 World-Class User Experience
*   **The "Lamp Man" Auth**: A delightful, 3D anime-inspired authentication experience with real-time theme toggling.
*   **Commanding Aesthetics**: A "Google Standard" (MD3) design language featuring Glassmorphism and micro-animations.
*   **Dual-Theme Engine**: Seamless switching between high-contrast Dark and Light modes.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React + Modern Context API |
| **Styling** | Vanilla CSS (Global Design Tokens) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase GoTrue (JWT + RLS) |
| **Storage** | Supabase Storage (S3-Compatible) |
| **Payments** | Paystack Standard Integration |
| **Animations** | SVG + CSS Keyframe Engines |

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js (v16+)
*   NPM or Yarn
*   A Supabase Project

### 2. Installation
```bash
git clone https://github.com/your-username/hackmydegree.git
cd hackmydegree
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Supabase and Paystack keys:
```env
REACT_APP_SUPABASE_URL=your_project_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
REACT_APP_PAYSTACK_PUBLIC_KEY=your_public_key
```

### 4. Running the App
```bash
npm start
```

---

## 📁 System Architecture
- `src/components`: Atomic UI components and layout wrappers.
- `src/lib`: Service singletons for Supabase, Paystack, and analytics.
- `src/pages`: Feature-driven page modules.
- `src/index.css`: The "Source of Truth" for the global design system.

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.

*Empowering the next generation of West African scholars.*
