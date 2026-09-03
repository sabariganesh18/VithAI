import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';

export default function SundayTestPage() {
  const { user } = useAuth();
  const { progress, submitSundayTest } = useLearning();
  const navigate = useNavigate();

  const isUnlocked = progress.simulatedDay === 'Sunday' || (progress.streakCalendar.Mon && progress.streakCalendar.Tue && progress.streakCalendar.Wed && progress.streakCalendar.Thu && progress.streakCalendar.Fri && progress.streakCalendar.Sat);

  const testQuestions = [
    {
      id: 1,
      category: 'vocabulary',
      question: 'What is the native meaning of "Improve"?',
      options: ['மேம்படுத்துதல்', 'வாய்ப்பு', 'நம்பிக்கை', 'பாராட்டுதல்'],
      answer: 'மேம்படுத்துதல்'
    },
    {
      id: 2,
      category: 'vocabulary',
      question: 'Which word means "A favorable chance or set of circumstances"?',
      options: ['Confidence', 'Opportunity', 'Encourage', 'Patience'],
      answer: 'Opportunity'
    },
    {
      id: 3,
      category: 'grammar',
      question: 'Choose the correct sentence:',
      options: [
        'I wants to improve my English.',
        'I want to improve my English.',
        'I improving my English want.',
        'I wanted to improved English.'
      ],
      answer: 'I want to improve my English.'
    },
    {
      id: 4,
      category: 'translation',
      question: 'Translate: "ஆசிரியர்கள் மாணவர்களை ஊக்குவிக்கிறார்கள்."',
      options: [
        'Teachers encourage students.',
        'Teachers ignore students.',
        'Teachers test students.',
        'Teachers introduce students.'
      ],
      answer: 'Teachers encourage students.'
    },
    {
      id: 5,
      category: 'listening',
      question: 'Select the word matching pronunciation /floo-uhnt/:',
      options: ['Focus', 'Fluent', 'Effort', 'Skill'],
      answer: 'Fluent'
    },
    {
      id: 6,
      category: 'speaking',
      question: 'Which word completes: "Reading books expands your _______ rapidly."',
      options: ['Routine', 'Vocabulary', 'Wisdom', 'Journey'],
      answer: 'Vocabulary'
    }
  ];

  const [answers, setAnswers] = useState({});
  const [currentQIdx, setCurrentQIdx] = useState(0);

  if (!isUnlocked) {
    return (
      <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column">
        <Header />
        <Navbar />

        <main className="container max-w-2xl py-5 flex-grow-1 text-center d-flex flex-column align-items-center justify-content-center">
          <div className="rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '64px', height: '64px', fontSize: '2rem' }}>
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="fw-black mb-2">Sunday Challenge Locked</h2>
          <p className="small text-muted max-w-md mb-4 leading-relaxed">
            The Sunday Challenge unlocks on Sunday or when you complete all Monday through Saturday lessons.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-indigo rounded-3 px-4 py-2.5 fw-bold shadow-sm"
          >
            Back to Dashboard
          </button>
        </main>

        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  const currentQ = testQuestions[currentQIdx];

  const handleSelectOption = (opt) => {
    setAnswers({ ...answers, [currentQ.id]: opt });
  };

  const handleSubmitTest = () => {
    let score = 0;
    testQuestions.forEach(q => {
      if (answers[q.id] === q.answer) score += 10;
    });

    const resultAttempt = submitSundayTest(score, 60);
    navigate('/test-result', { state: { result: resultAttempt } });
  };

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container max-w-3xl py-4 flex-grow-1">
        {/* Test Banner Header */}
        <div className="card border-0 rounded-5 p-4 text-white shadow-lg bg-indigo mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="badge bg-white text-indigo rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Sunday Challenge • Week 1
            </span>
            <span className="small fw-bold d-inline-flex align-items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Untimed Test
            </span>
          </div>
          <h2 className="fw-black mb-1">Weekly Retention Test</h2>
          <p className="small mb-3 opacity-75">
            Prove your 60 vocabulary and grammar concepts learned this week.
          </p>

          <div className="progress rounded-pill bg-white bg-opacity-25" style={{ height: '8px' }}>
            <div
              className="progress-bar bg-warning rounded-pill"
              style={{ width: `${((currentQIdx + 1) / testQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Active Question Box */}
        <div className="card border-0 rounded-5 p-4 p-md-5 shadow-sm mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="small fw-bold text-indigo text-uppercase">
              Question {currentQIdx + 1} of {testQuestions.length}
            </span>
            <span className="badge bg-light text-dark border rounded-3 px-2.5 py-1">
              {currentQ.category}
            </span>
          </div>

          <h4 className="fw-bold text-dark dark:text-white mb-4">
            {currentQ.question}
          </h4>

          <div className="d-flex flex-column gap-2">
            {currentQ.options.map((opt, idx) => {
              const isChosen = answers[currentQ.id] === opt;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-100 text-start p-3 rounded-4 border btn text-sm font-semibold d-flex align-items-center justify-content-between ${
                    isChosen
                      ? 'btn-indigo text-white shadow-sm'
                      : 'btn-light border-slate-200 text-dark'
                  }`}
                >
                  <span>{opt}</span>
                  {isChosen && <CheckCircle2 className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nav Buttons */}
        <div className="d-flex align-items-center justify-content-between">
          <button
            onClick={() => setCurrentQIdx(Math.max(0, currentQIdx - 1))}
            disabled={currentQIdx === 0}
            className="btn btn-light border rounded-3 px-4 py-2 fw-bold text-dark disabled:opacity-40"
          >
            Previous Question
          </button>

          {currentQIdx < testQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentQIdx(currentQIdx + 1)}
              className="btn btn-indigo rounded-3 px-4 py-2 fw-bold shadow-sm"
            >
              Next Question →
            </button>
          ) : (
            <button
              onClick={handleSubmitTest}
              className="btn btn-success rounded-3 px-4 py-2.5 fw-black shadow text-white animate-pulse"
            >
              Submit Sunday Challenge 🎉
            </button>
          )}
        </div>

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
