import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star, Coins, Trophy, Sparkles, ArrowRight, Play, CheckCircle2, Lock, Code, BookmarkCheck, Mic, Calendar, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import SpeakingModal from '../components/common/SpeakingModal';
import { NATIVE_LANGUAGES } from '../data/languagesData';

export default function DashboardPage() {
  const { user } = useAuth();
  const { progress, levelInfo } = useLearning();
  const [isSpeakingOpen, setIsSpeakingOpen] = useState(false);

  const nativeLang = NATIVE_LANGUAGES.find(l => l.id === user?.nativeLanguage) || NATIVE_LANGUAGES[0];

  // Dynamic today's words count (Starts at 0 for fresh user)
  const todayWordsCount = Math.min(10, progress.learnedWordIds.length % 10);

  // Weekday progress items
  const weekDays = [
    { day: 'Mon', label: 'Monday', isDone: progress.streakCalendar.Mon, isCurrent: progress.simulatedDay === 'Monday' },
    { day: 'Tue', label: 'Tuesday', isDone: progress.streakCalendar.Tue, isCurrent: progress.simulatedDay === 'Tuesday' },
    { day: 'Wed', label: 'Wednesday', isDone: progress.streakCalendar.Wed, isCurrent: progress.simulatedDay === 'Wednesday' },
    { day: 'Thu', label: 'Thursday', isDone: progress.streakCalendar.Thu, isCurrent: progress.simulatedDay === 'Thursday' },
    { day: 'Fri', label: 'Friday', isDone: progress.streakCalendar.Fri, isCurrent: progress.simulatedDay === 'Friday' },
    { day: 'Sat', label: 'Saturday', isDone: progress.streakCalendar.Sat, isCurrent: progress.simulatedDay === 'Saturday' },
    { day: 'Sun', label: 'Sunday Challenge', isDone: progress.streakCalendar.Sun, isCurrent: progress.simulatedDay === 'Sunday', isSunday: true }
  ];

  const isSundayTestUnlocked = progress.simulatedDay === 'Sunday' || (progress.streakCalendar.Mon && progress.streakCalendar.Tue && progress.streakCalendar.Wed && progress.streakCalendar.Thu && progress.streakCalendar.Fri && progress.streakCalendar.Sat);

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container py-4 flex-grow-1">
        {/* Welcome Header */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="fw-black text-dark dark:text-white mb-1 fs-3 fs-md-2">
              Good day, {user?.name || 'Learner'} 👋
            </h2>
            <p className="small text-muted mb-0">
              Learning English & Code explained in <strong className="text-indigo">{nativeLang.name} ({nativeLang.nativeName})</strong>.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 w-100 w-md-auto">
            <Link
              to="/settings"
              className="btn btn-sm btn-indigo-subtle text-indigo border border-indigo rounded-3 fw-bold d-flex align-items-center justify-content-center gap-1.5 flex-fill flex-md-grow-0 py-2"
            >
              <Settings className="w-4 h-4 text-indigo" /> Settings
            </Link>
            <Link
              to="/words"
              className="btn btn-sm btn-light border rounded-3 fw-bold text-dark d-flex align-items-center justify-content-center gap-1.5 flex-fill flex-md-grow-0 py-2"
            >
              <BookmarkCheck className="w-4 h-4 text-success" /> Word Book ({progress.learnedWordIds.length})
            </Link>
          </div>
        </div>

        {/* Primary Hero Lesson CTA Card */}
        <div className="card border-0 rounded-5 p-4 p-md-5 mb-4 text-white shadow-lg bg-indigo">
          <div className="max-w-2xl">
            <span className="badge bg-white text-indigo rounded-pill px-3 py-1.5 fw-bold mb-3 d-inline-flex align-items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Today is: {progress.simulatedDay}
            </span>

            {progress.simulatedDay === 'Sunday' ? (
              <>
                <h2 className="fw-black mb-2 fs-3 fs-md-2">
                  🏆 Sunday Weekly Challenge is Live!
                </h2>
                <p className="small mb-4 opacity-75">
                  Test your 60 vocabulary & grammar concepts learned from Monday to Saturday. Earn bonus XP and unlock Sunday Champion badges!
                </p>
                <Link
                  to="/sunday-test"
                  className="btn btn-warning btn-lg rounded-4 fw-black text-dark px-4 py-3 shadow-sm w-100 w-sm-auto d-inline-flex align-items-center justify-content-center gap-2"
                >
                  <Play className="w-4 h-4 fill-dark" /> Start Sunday Challenge Now
                </Link>
              </>
            ) : (
              <>
                <h2 className="fw-black mb-2 fs-3 fs-md-2">
                  Continue Today's Lesson ({progress.simulatedDay})
                </h2>
                <p className="small mb-4 opacity-75">
                  Topic: <strong>Greetings & Everyday Vocabulary</strong>. Learn 10 new words with audio pronunciations and native explanations in {nativeLang.name}.
                </p>
                <Link
                  to="/daily-lesson"
                  className="btn btn-light btn-lg rounded-4 fw-black text-indigo px-4 py-3 shadow-sm w-100 w-sm-auto d-inline-flex align-items-center justify-content-center gap-2 text-nowrap fs-6"
                >
                  <Play className="w-5 h-5 fill-indigo" /> Start Today's 10 Words <ArrowRight className="w-5 h-5" />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Stats Grid - Starts Fresh at Zero */}
        <div className="row g-3 mb-4">
          {/* Daily Goal Card */}
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 h-100">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Today's Goal</span>
              <div className="fs-4 fs-md-3 fw-black text-dark dark:text-white mt-1">{todayWordsCount} / 10</div>
              <p className="small text-muted mb-2" style={{ fontSize: '0.75rem' }}>words completed</p>
              <div className="progress mt-auto" style={{ height: '6px' }}>
                <div className="progress-bar bg-indigo" style={{ width: `${(todayWordsCount / 10) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 h-100">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Current Streak</span>
              <div className="fs-4 fs-md-3 fw-black text-warning mt-1 d-flex align-items-center gap-1">
                <Flame className="w-5 h-5 fill-warning" /> {progress.streak} Days
              </div>
              <p className="small text-muted mb-0 mt-auto" style={{ fontSize: '0.75rem' }}>
                {progress.streak === 0 ? 'Start your streak today!' : 'Keep it going!'}
              </p>
            </div>
          </div>

          {/* XP Card */}
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 h-100">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Total XP</span>
              <div className="fs-4 fs-md-3 fw-black text-indigo mt-1 d-flex align-items-center gap-1">
                <Star className="w-5 h-5 fill-indigo text-indigo" /> {progress.xp.toLocaleString()}
              </div>
              <p className="small text-muted mb-0 mt-auto" style={{ fontSize: '0.75rem' }}>+{progress.xp} XP earned</p>
            </div>
          </div>

          {/* Level Progress Card */}
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 h-100">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Current Level</span>
              <div className="fs-6 fs-md-5 fw-black text-dark text-truncate mt-1">
                {levelInfo.name}
              </div>
              <p className="small text-muted mb-2" style={{ fontSize: '0.72rem' }}>
                Lvl {levelInfo.level} • Next: {levelInfo.nextXp} XP
              </p>
              <div className="progress mt-auto" style={{ height: '6px' }}>
                <div
                  className="progress-bar bg-purple"
                  style={{ width: `${Math.min(100, Math.max(0, ((progress.xp - levelInfo.minXp) / (levelInfo.nextXp - levelInfo.minXp)) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Mon-Sun Tracker Card */}
        <div className="card border-0 shadow-sm rounded-5 p-3.5 p-md-4 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h5 className="fw-bold text-dark dark:text-white d-flex align-items-center gap-2 mb-0 fs-6 fs-md-5">
                <Calendar className="w-5 h-5 text-indigo" /> Weekly Learning Cycle
              </h5>
              <p className="small text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                Mon–Sat: 10 new words daily (60 total) • Sun: Evaluation
              </p>
            </div>
            <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-2.5 py-1 fw-bold shrink-0" style={{ fontSize: '0.72rem' }}>
              {progress.simulatedDay}
            </span>
          </div>

          <div className="d-flex align-items-center justify-content-between gap-1 text-center">
            {weekDays.map((item, idx) => (
              <div key={idx} className="flex-fill">
                <div
                  className={`p-1.5 p-sm-2.5 rounded-3 border ${
                    item.isCurrent
                      ? 'border-indigo bg-light fw-bold ring-2 ring-indigo'
                      : item.isDone
                      ? 'border-success bg-success-subtle text-success'
                      : item.isSunday
                      ? 'border-warning bg-warning-subtle text-warning'
                      : 'border-slate-200 bg-light text-muted'
                  }`}
                >
                  <div className="fw-bold mb-1" style={{ fontSize: '0.65rem' }}>{item.day}</div>
                  <div className="d-flex align-items-center justify-content-center fw-black" style={{ fontSize: '0.7rem' }}>
                    {item.isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : item.isSunday ? (
                      isSundayTestUnlocked ? <Trophy className="w-4 h-4 text-warning" /> : <Lock className="w-4 h-4 text-muted" />
                    ) : (
                      <span>D{idx + 1}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CodeLoop Feature Card */}
        <div className="row g-4 mb-4">
          <div className="col-12">
            <div className="card border-0 rounded-5 p-4 p-md-5 bg-dark text-white shadow-lg d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge bg-warning text-dark fw-bold rounded-pill px-3 py-1.5 d-flex align-items-center gap-1">
                    <Code className="w-3.5 h-3.5" /> CodeLoop Programming Platform
                  </span>
                  <span className="small text-muted">{nativeLang.name} Mode</span>
                </div>
                <h3 className="fw-black mb-2">Learn Programming in Simple {nativeLang.name}</h3>
                <p className="small text-light opacity-75 mb-0 max-w-2xl">
                  "Variable என்பது ஒரு மதிப்பை சேமிக்கப் பயன்படும் பெயர்." Practice predicting outputs, learning syntax, and executing runnable code in Python, C++, Java & JS.
                </p>
              </div>
              <Link
                to="/code"
                className="btn btn-warning btn-lg fw-black rounded-4 px-4 py-3 shadow-sm text-dark shrink-0 text-center"
              >
                Open CodeLoop Courses <ArrowRight className="w-4 h-4 ms-1" />
              </Link>
            </div>
          </div>
        </div>

      </main>

      <Footer />
      <MobileBottomNav />
      <SpeakingModal isOpen={isSpeakingOpen} onClose={() => setIsSpeakingOpen(false)} />
    </div>
  );
}
