import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Code, Trophy, ArrowRight, CheckCircle2, Globe, Flame } from 'lucide-react';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  const features = [
    { icon: Globe, title: 'Learn Through Native Language', desc: 'Explanations adapted into Tamil, Hindi, Telugu, Malayalam, Kannada, and 7 more Indian languages.' },
    { icon: Flame, title: '10 Words Daily System', desc: 'Bite-sized Monday to Saturday guided lessons that fit into a 15-minute daily schedule.' },
    { icon: Trophy, title: 'Sunday Weekly Challenge', desc: 'No regular lessons on Sunday—test your 60 concepts learned during the week and earn badges.' },
    { icon: Code, title: 'CodeLoop Programming', desc: 'Master Python, C++, Java, JavaScript, and SQL explained simply in your native language.' }
  ];

  const faqs = [
    { q: 'How does native language learning work on VithAI?', a: 'You select your native language (e.g. Tamil) and target language (e.g. English or Python). Word meanings, sentence structures, and code logic are explained in Tamil while keeping the actual target words/code syntax in English.' },
    { q: 'Is VithAI free to use?', a: 'Yes! All daily lessons, Sunday challenges, CodeLoop tracks, and vocabulary tools are 100% free with virtual gamified coins and rewards.' },
    { q: 'How does the Sunday Challenge work?', a: 'From Monday to Saturday you learn 10 new concepts per day (totaling 60). On Sunday, a 60-question challenge unlocks to test your retention and award bonus XP.' },
    { q: 'Can I learn programming from Tamil or Hindi?', a: 'Yes! CodeLoop explains variables, loops, functions, and OOP in simple native sentences alongside actual runnable code snippets.' }
  ];

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column">
      {/* Top Navigation */}
      <header className="container py-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <img 
            src="/vithai-logo.png" 
            alt="VithAI Logo" 
            className="rounded-3 shadow-sm" 
            style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
          />
          <span className="fw-black fs-3 text-indigo">
            VithAI
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link
            to="/login"
            className="btn btn-sm btn-link text-dark text-decoration-none fw-bold me-2"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="btn btn-sm btn-indigo rounded-3 fw-bold px-3 py-2 shadow-sm"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-5 text-center flex-grow-1">
        <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-3 py-2 fw-bold mb-4 d-inline-flex align-items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo" />
          Personalized Daily Learning Platform
        </span>

        <h1 className="display-4 fw-black text-dark dark:text-white mb-4">
          Learn Every Day. <br />
          <span className="text-indigo">
            Grow Every Week.
          </span>
        </h1>

        <p className="lead text-muted max-w-2xl mx-auto mb-5">
          Master languages and coding through the language you already understand. 10 new concepts every day, Monday–Saturday guided lessons, and Sunday weekly tests.
        </p>

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-5">
          <Link
            to="/register"
            className="btn btn-indigo btn-lg rounded-4 fw-bold px-4 py-3 shadow-lg d-flex align-items-center justify-content-center gap-2"
          >
            Start Learning Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/learn"
            className="btn btn-outline-secondary btn-lg rounded-4 fw-bold px-4 py-3 text-dark"
          >
            Explore Courses
          </Link>
        </div>

        {/* Product Preview Card Mockup */}
        <div className="rounded-5 shadow-lg p-3 p-md-4 text-start mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" style={{ maxWidth: '1040px' }}>
          {/* Top Control Bar */}
          <div className="d-flex align-items-center justify-content-between pb-3 border-bottom border-slate-200 dark:border-slate-800 mb-4">
            <div className="d-flex align-items-center gap-2">
              <span className="rounded-circle bg-danger d-inline-block" style={{ width: '12px', height: '12px' }}></span>
              <span className="rounded-circle bg-warning d-inline-block" style={{ width: '12px', height: '12px' }}></span>
              <span className="rounded-circle bg-success d-inline-block" style={{ width: '12px', height: '12px' }}></span>
              <span className="small text-slate-600 dark:text-slate-400 ms-2 font-bold" style={{ fontSize: '0.85rem' }}>VithAI Learning Hub • Live Preview</span>
            </div>
            <div className="d-flex align-items-center gap-3 small font-bold">
              <span className="text-amber-500 bg-amber-500 bg-opacity-10 px-2.5 py-1 rounded-pill border border-amber-500 border-opacity-20">🔥 12 Days</span>
              <span className="text-indigo-500 bg-indigo-500 bg-opacity-10 px-2.5 py-1 rounded-pill border border-indigo-500 border-opacity-20">⭐ 2,450 XP</span>
              <span className="badge bg-emerald-500 text-white rounded-pill px-3 py-1.5 font-bold">Level 4</span>
            </div>
          </div>

          <div className="row g-4">
            {/* Card 1: Today's Word */}
            <div className="col-12 col-lg-4">
              <div className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950 dark:bg-opacity-40">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-indigo-600 text-white rounded-pill px-2.5 py-1 text-uppercase font-black" style={{ fontSize: '0.65rem' }}>Today's Word #3</span>
                    <span className="text-indigo-500 font-mono small font-bold">Everyday</span>
                  </div>
                  <h3 className="fw-black text-slate-900 dark:text-white fs-2 mb-1">Improve</h3>
                  <p className="fw-bold text-indigo-600 dark:text-indigo-400 fs-6 mb-1">Tamil: மேம்படுத்துதல்</p>
                  <p className="small text-slate-500 dark:text-slate-400 font-mono mb-3">/im-proov/</p>
                </div>
                <div className="p-3 rounded-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 small font-medium shadow-xs">
                  "I practise daily to improve my skills."
                </div>
              </div>
            </div>

            {/* Card 2: Weekly Mon-Sun Loop */}
            <div className="col-12 col-lg-4">
              <div className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-black text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>WEEKLY LEARNING LOOP</span>
                  <h4 className="fw-black text-slate-900 dark:text-white mt-1 mb-3">60 Concepts / Week</h4>
                  
                  <div className="d-flex align-items-center justify-content-between gap-1 text-center mt-3">
                    <div className="flex-fill bg-emerald-600 text-white rounded-2 py-2 font-black" style={{ fontSize: '0.68rem' }}>M ✓</div>
                    <div className="flex-fill bg-emerald-600 text-white rounded-2 py-2 font-black" style={{ fontSize: '0.68rem' }}>T ✓</div>
                    <div className="flex-fill bg-emerald-600 text-white rounded-2 py-2 font-black" style={{ fontSize: '0.68rem' }}>W ✓</div>
                    <div className="flex-fill bg-indigo-600 text-white rounded-2 py-2 font-black" style={{ fontSize: '0.68rem' }}>T 🔓</div>
                    <div className="flex-fill bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2 py-2 font-bold" style={{ fontSize: '0.68rem' }}>F 🔒</div>
                    <div className="flex-fill bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2 py-2 font-bold" style={{ fontSize: '0.68rem' }}>S 🔒</div>
                    <div className="flex-fill bg-amber-500 text-slate-950 rounded-2 py-2 font-black" style={{ fontSize: '0.68rem' }}>S 🏆</div>
                  </div>
                </div>
                <div className="pt-3 border-top border-slate-200 dark:border-slate-800 mt-3">
                  <p className="small text-slate-500 dark:text-slate-400 mb-0 font-medium" style={{ fontSize: '0.75rem' }}>
                    Sunday Challenge unlocks after Saturday lesson.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: CodeLoop IDE Console */}
            <div className="col-12 col-lg-4">
              <div className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between border border-slate-800 bg-slate-950 text-white font-mono shadow-sm">
                <div>
                  <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-slate-800">
                    <span className="badge bg-indigo-600 text-white rounded-pill px-3 py-1.5 font-black" style={{ fontSize: '0.7rem' }}>CodeLoop Python</span>
                    <span className="badge bg-emerald-600 text-white rounded-pill px-3 py-1.5 font-black" style={{ fontSize: '0.7rem' }}>Tamil Explanation</span>
                  </div>
                  
                  <p className="text-slate-200 mb-3 font-sans font-bold fs-6">
                    Variable என்பது மதிப்பை சேமிக்கும் பெட்டி:
                  </p>
                  
                  <div className="p-3 rounded-3 bg-slate-900 border border-slate-800 shadow-inner font-mono" style={{ fontSize: '0.88rem' }}>
                    <div className="d-flex gap-3 align-items-start">
                      <div className="text-slate-600 select-none font-bold" style={{ width: '16px' }}>
                        1<br />2<br />3
                      </div>
                      <div className="leading-relaxed">
                        <span className="text-sky-400 font-bold">name</span> <span className="text-slate-300">=</span> <span className="text-amber-300 font-bold">"Sabari"</span><br />
                        <span className="text-sky-400 font-bold">score</span> <span className="text-slate-300">=</span> <span className="text-emerald-400 font-bold">100</span><br />
                        <span className="text-purple-400 font-bold">print</span><span className="text-slate-300">(name)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-top border-slate-800 mt-3 d-flex align-items-center justify-content-between">
                  <span className="text-slate-400 font-sans small font-bold">Predict Output:</span>
                  <span className="badge bg-emerald-500 text-slate-950 font-black rounded-3 px-3 py-1.5 font-mono fs-6 shadow-sm">"Sabari"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-black text-dark dark:text-white">
            Why Students & Professionals Choose VithAI
          </h2>
          <p className="small text-muted">
            Built for fast retention, natural native comprehension, and real daily progress.
          </p>
        </div>

        <div className="row g-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                  <div className="rounded-3 bg-indigo-subtle-custom text-indigo p-3 d-inline-flex mb-3" style={{ width: '48px', height: '48px' }}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h5 className="fw-bold text-dark dark:text-white mb-2">{feat.title}</h5>
                  <p className="small text-muted mb-0">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container py-5" style={{ maxWidth: '800px' }}>
        <h2 className="fw-black text-dark dark:text-white text-center mb-4">
          Frequently Asked Questions
        </h2>
        <div className="d-flex flex-column gap-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold text-dark dark:text-white d-flex align-items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-indigo" /> {faq.q}
              </h5>
              <p className="small text-muted mb-0 ps-4">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
