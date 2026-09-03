# 🎓 VithAI - AI-Powered Dual Learning Platform

**VithAI Learning Hub** is an interactive, gamified dual-learning web application built to master spoken language vocabulary (English with native language translations) and modern programming skills (CodeLoop: Python, C++, Java, JS, SQL).

---

## 📋 Table of Contents
1. [Overview & Highlights](#-overview--highlights)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Prerequisites](#-prerequisites)
5. [Environment Configuration](#-environment-configuration)
6. [Installation & Setup](#-installation--setup)
7. [Running the Application](#-running-the-application)
8. [Architecture & Smart Fallbacks](#-architecture--smart-fallbacks)
9. [Project Structure](#-project-structure)

---

## 🌟 Overview & Highlights

VithAI empowers learners by combining **native-language intuitive explanations** (Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali) with **interactive practice loops**:
- **Daily Spoken Vocabulary**: 250+ curated vocabulary words across 5 categories with native meanings, simple example sentences, and dual-speed audio pronunciation.
- **Instant Google Translator**: Real-time translation powered by Google Translate API for any word or sentence.
- **CodeLoop Sandbox**: Interactive programming tutorials with code execution simulations and native language breakdowns.
- **VithAI Smart AI Tutor**: Multi-provider AI assistant powered by Google Gemini API & Groq API with instant local fallback.
- **Gamified Rewards & XP**: Daily streaks, level progression badges, leaderboards, and rewards store.

---

## ✨ Key Features

### 📖 Spoken Language & Vocabulary Master
- **250+ Master Vocabularies**: 50 Everyday, 50 Advanced Eloquence, 50 Corporate Business, 50 Tech/Coding Terms, and 50 Idioms & Phrases.
- **Dual-Speed Audio Pronunciation**: Listen to standard pronunciation at normal speed (1.0x) or slow turtle mode (0.6x) powered by SpeechSynthesis Web Audio.
- **Simple Example Sentences**: Word-specific, easy-to-understand sentences with native translations.
- **Instant Translation Studio**: Type any custom word or phrase to get instant Google Translate output in 8+ languages.

### 💻 CodeLoop Programming Hub
- **Multi-Language Support**: Interactive tutorials for Python, C++, Java, JavaScript, and SQL.
- **Line-by-Line Native Breakdown**: Code logic explained simply in native languages (Tamil, etc.).
- **Interactive Code Runner**: Execute code snippets in a sandbox environment with output logs.

### 🤖 VithAI Smart AI Assistant
- **Multi-Provider AI Engine**: Primary integration with Google Gemini 1.5 Flash API and secondary Groq (Llama 3.3 70B) API.
- **Local Fallback Mode**: Works 100% offline even without API keys by using smart localized response templates.

### 🏆 Gamification & Analytics
- **XP & Level System**: Earn XP for completing daily lessons, quizzes, and mastering words.
- **Streak Tracker & Freeze**: Keep track of consecutive learning days with streak freeze power-ups.
- **Interactive Leaderboard**: Weekly rank competitions with regional avatars.
- **Mock Tests & Sunday Quizzes**: Category quizzes with instant scorecards and performance breakdown using Recharts.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, React Router v7 |
| **Build Tool & Bundler** | Vite 8 |
| **Styling & UI** | Bootstrap 5, Custom CSS Tokens, Glassmorphism, Dark/Light Mode |
| **Icons & Media** | Lucide React Icons |
| **Audio & Speech** | Web Speech API (SpeechSynthesis) |
| **Translation Engine** | Google Translate GTX API Engine |
| **AI Backend** | Google Gemini API (`gemini-1.5-flash`), Groq API (`llama-3.3-70b-versatile`) |
| **Database & Auth** | Supabase JS Client v2 (with complete local storage mock fallback) |
| **Data Visualization** | Recharts Data Charts |
| **Effects & Gamification** | Canvas Confetti |
| **Linter** | Oxlint |

---

## ⚙️ Prerequisites

Ensure you have the following installed on your environment:
- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **npm**: `v9.0.0` or higher

---

## 🔐 Environment Configuration

VithAI uses a centralized environment manager [`src/config/env.js`](file:///d:/ELITE/DAY1/project/ai-teach/src/config/env.js).

### Step 1: Create `.env` file
Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

### Step 2: Configure Environment Variables

```env
VITE_APP_NAME="VithAI Learning Hub"
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_GROQ_API_KEY=your-groq-api-key
```

> [!NOTE]
> All external credentials (`VITE_SUPABASE_URL`, `VITE_GEMINI_API_KEY`, `VITE_GROQ_API_KEY`) are **optional**. If left blank, VithAI seamlessly operates in high-performance local offline mock mode.

---

## 🚀 Installation & Setup

1. **Clone the repository** (or navigate to the workspace directory):
   ```bash
   cd ai-teach
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## 💻 Running the Application

### Development Server
Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```
The application will launch at: `http://localhost:5173/`

### Production Build
Generate an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Code Quality & Linting
Run Oxlint to check code formatting:

```bash
npm run lint
```

---

## 🛡️ Architecture & Smart Fallbacks

1. **Local Authentication & Storage Fallback**:
   - If Supabase keys are not configured, `AuthContext` seamlessly defaults to browser `localStorage` to save learning progress, streaks, XP, and bookmarks.

2. **Smart AI Tutor Fallback Hierarchy**:
   - **Level 1**: Google Gemini API (`VITE_GEMINI_API_KEY`)
   - **Level 2**: Groq API (`VITE_GROQ_API_KEY`)
   - **Level 3**: Instant Native Local Response Generator (works offline)

3. **Google Translate Fallback**:
   - Uses Google Translate GTX API for instant 100% accurate native translations with automatic fallback to secondary dictionary endpoints.

---

## 📁 Project Structure

```
ai-teach/
├── public/
├── src/
│   ├── assets/           # Images & static assets
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Modals, AI Tutor popup, Navbar, Cards
│   │   ├── layout/       # Header, Navbar, Footer, MobileBottomNav
│   │   └── learning/     # WordCard, CodeSandbox, QuizCard
│   ├── config/           # Centralized environment config (env.js)
│   ├── context/          # AuthContext, LearningContext
│   ├── data/             # Vocabulary data, Programming lessons, Badges
│   ├── pages/            # Page Views (Dashboard, Learn, Code, WordBook, etc.)
│   ├── services/         # AI Tutor Service (Gemini/Groq/Fallback)
│   ├── utils/            # SpeechUtils, Audio, Helpers
│   ├── App.jsx           # Main React Router Routing Table
│   ├── index.css         # Core CSS Design System & Utility Tokens
│   └── main.jsx          # Entry point
├── .env.example          # Environment variable template
├── package.json          # Package dependencies & scripts
├── vite.config.js        # Vite configuration
└── README.md             # Project documentation
```

---

*Built with ❤️ for bilingual learners and programmers.*
