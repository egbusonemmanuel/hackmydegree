# HackMyDegree — Team Developer Guide

Welcome to the HackMyDegree engineering team. This document outlines the architecture, database patterns, and security model of the platform.

## 🏗️ Architecture Overview

The application is built with a **Serverless-First** approach:
- **Frontend**: React (Modular Component Architecture) with Material Design 3 (Design Tokens in `index.css`).
- **Backend-as-a-Service**: Supabase (Auth, Database, Storage).
- **Payment Gateway**: Paystack (Integrated for premium resource transactions).

## 🧩 Component Architecture

We maintain a clean separation of concerns by extracting reusable logic and UI:
1.  **`src/components`**: Global components like `Navbar`, `PageLoader`, and `Sidebar`.
2.  **`src/components/SharedUI.jsx`**: Our core UI library (Banners, Inputs, Buttons, Fields). Always use these instead of raw HTML elements to ensure theme support and consistent styling.
3.  **`src/pages`**: View-specific components that compose modular elements.

## 🗄️ Database Schema

### Core Tables
1.  **Profiles**: Extends Supabase Auth users. Stores `username`, `full_name`, and `is_tutor` flag.
2.  **Categories**: Product segments (e.g., Engineering, Medicine). Includes icons and slugs.
3.  **Resources**: The main content table. Links to `uploader_id` and `category_id`. Supports `free` or `premium` modes.
4.  **Tutor Profiles**: Extended details for tutors (bio, subjects, hourly rate).
5.  **Purchases**: Logs successful Paystack transactions.

## 🔐 Security & RLS (Row Level Security)

We use **Supabase RLS** to protect all data.

### Critical Policies
- **Resources (INSERT)**: Only `authenticated` users can insert.
- **Resources (SELECT)**: All users can see `approved` resources.
- **Storage (resources bucket)**: Users can only upload to folders matching their `auth.uid()`.

> [!IMPORTANT]
> To bypass local storage locking deadlocks in the Supabase library, always use the **Direct Fetch** pattern for uploads. See `src/lib/supabase.js:uploadResource`.

## 🚀 Development Workflow

### 1. Environment Setup
Create a `.env` file with:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Making Changes
- **Styling**: Always use the CSS variables in `index.css` (e.g., `var(--primary)`, `var(--font-header)`). Avoid hardcoded hex codes.
- **Components**: Check `SharedUI.jsx` before building a new input or button.
- **Database**: If you add a column, update the RLS policies in the Supabase Dashboard.
- **Auth**: Use the `useAuth()` hook in any component to access the current `user`, `profile`, and `session`.

## 🎨 Visual Consistency Rules
- **Typography**: Always use `fontFamily: 'var(--font-header)'` for headings and `fontFamily: 'var(--font-body)'` for content.
- **Spacing**: Use standard padding (e.g., `2rem`, `3rem`) and gap scales.
- **Theme**: All components must be theme-aware. Avoid `rgba` with hardcoded white/black unless it's for subtle overlays that work in both modes.

## 🛠️ Tech Debt & Gotchas
- **Deadlocks**: Avoid calling `supabase.auth.getSession()` inside high-frequency loops. Use the session provided by `AuthProvider`.
- **Latency**: Large PDF uploads can take time. Always use the `progress` state to give user feedback.

---
*Created by Antigravity AI for the HackMyDegree Team.*
