import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import WordCard from '../components/learning/WordCard';
import PracticeQuestion from '../components/learning/PracticeQuestion';
import { WEEKLY_LESSONS, getWeeklyLessonsForTargetLanguage } from '../data/vocabularyData';

export default function DailyLessonPage() {
  const { user } = useAuth();
  const { progress, markWordLearned, toggleFavorite, completeLesson, addXP } = useLearning();
  const navigate = useNavigate();

  const weeklyLessons = getWeeklyLessonsForTargetLanguage(user?.learningLanguage || 'en');
  const currentDayLesson = weeklyLessons[0].days[0];
  const words = currentDayLesson.words;

  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [showPractice, setShowPractice] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  const activeWord = words[activeWordIdx];
  const isLearned = progress.learnedWordIds.includes(activeWord.id);
  const isFavorite = progress.favoriteWordIds.includes(activeWord.id);

  const handleNextWord = () => {
    if (activeWordIdx < words.length - 1) {
      setActiveWordIdx(activeWordIdx + 1);
      setShowPractice(false);
    } else {
      completeLesson('w1_d1', 50);
      setIsCompletedModalOpen(true);
    }
  };

  const handlePrevWord = () => {
    if (activeWordIdx > 0) {
      setActiveWordIdx(activeWordIdx - 1);
      setShowPractice(false);
    }
  };

  const currentQuestion = {
    type: 'Choose Native Meaning',
    question: `What is the native meaning of "${activeWord.word}"?`,
    options: [
      activeWord.word === 'Improve' ? 'மேம்படுத்துதல்' : 'வாய்ப்பு',
      'நம்பிக்கை',
      'பாராட்டுதல்',
      'சரளமாக பேசுதல்'
    ],
    correctAnswer: activeWord.word === 'Improve' ? 'மேம்படுத்துதல்' : 'வாய்ப்பு',
    explanation: `"${activeWord.word}" means ${activeWord.meaningDefault}.`
  };

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container max-w-4xl py-4 flex-grow-1">
        {/* Top Navigation & Day Progress Bar */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-sm btn-outline-secondary rounded-3 fw-bold d-flex align-items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Lesson
          </button>
          
          <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-3 py-1.5 fw-bold">
            Word {activeWordIdx + 1} of {words.length}
          </span>
        </div>

        {/* Lesson Header Title Card */}
        <div className="card border-0 shadow-sm rounded-5 p-4 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="badge bg-indigo text-white rounded-pill px-3 py-1.5 fw-bold">
              Day 1 of 6 • Monday Lesson
            </span>
            <span className="small fw-bold text-warning">
              +10 XP per word
            </span>
          </div>

          <h2 className="fw-black text-dark dark:text-white mb-3">
            {currentDayLesson.title}
          </h2>

          {/* Progress bar */}
          <div className="progress rounded-pill bg-light" style={{ height: '8px' }}>
            <div
              className="progress-bar bg-indigo rounded-pill"
              style={{ width: `${((activeWordIdx + 1) / words.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 10 Words Tab Selector Slider */}
        <div className="d-flex align-items-center gap-2 overflow-x-auto pb-3 mb-4">
          {words.map((w, idx) => {
            const wordLearned = progress.learnedWordIds.includes(w.id);
            const isCurrent = idx === activeWordIdx;
            return (
              <button
                key={w.id}
                onClick={() => {
                  setActiveWordIdx(idx);
                  setShowPractice(false);
                }}
                className={`shrink-0 px-3 py-1.5 rounded-3 text-xs fw-bold border transition-all d-flex align-items-center gap-1 btn ${
                  isCurrent
                    ? 'btn-indigo text-white shadow-sm'
                    : wordLearned
                    ? 'btn-success text-white border-success'
                    : 'btn-light text-dark border-slate-200'
                }`}
              >
                <span>{idx + 1}. {w.word}</span>
                {wordLearned && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>

        {/* Main Word Card / Practice View */}
        {!showPractice ? (
          <WordCard
            wordObj={activeWord}
            nativeLanguage={user?.nativeLanguage || 'ta'}
            isLearned={isLearned}
            isFavorite={isFavorite}
            onMarkLearned={() => markWordLearned(activeWord.id)}
            onToggleFavorite={() => toggleFavorite(activeWord.id)}
            onPractice={() => setShowPractice(true)}
          />
        ) : (
          <div className="space-y-4">
            <PracticeQuestion
              questionObj={currentQuestion}
              onAnswerSubmitted={(correct) => {
                if (correct) {
                  addXP(5);
                  markWordLearned(activeWord.id);
                }
              }}
            />
            <button
              onClick={() => setShowPractice(false)}
              className="btn btn-sm btn-light border rounded-3 fw-bold text-dark mt-3"
            >
              ← Back to Word Explanation
            </button>
          </div>
        )}

        {/* Navigation Control Buttons */}
        <div className="d-flex align-items-center justify-content-between mt-4">
          <button
            onClick={handlePrevWord}
            disabled={activeWordIdx === 0}
            className="btn btn-light border rounded-3 px-4 py-2 fw-bold text-dark disabled:opacity-40"
          >
            ← Previous Word
          </button>

          <button
            onClick={handleNextWord}
            className="btn btn-indigo rounded-3 px-4 py-2 fw-bold shadow-sm"
          >
            {activeWordIdx === words.length - 1 ? 'Finish Lesson 🎉' : 'Next Word →'}
          </button>
        </div>

      </main>

      {/* Completion Modal */}
      {isCompletedModalOpen && (
        <div className="modal show d-block tab-index-1 bg-dark bg-opacity-75 backdrop-blur-sm">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-5 p-4 text-center shadow-lg">
              <div className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center mx-auto mb-3 shadow" style={{ width: '64px', height: '64px', fontSize: '2rem' }}>
                🎉
              </div>
              <h3 className="fw-black text-dark dark:text-white mb-1">
                Today's Lesson Complete!
              </h3>
              <p className="small text-muted mb-4">
                You learned 10 new words and maintained your daily learning streak.
              </p>

              <div className="p-3 bg-indigo-subtle-custom border border-indigo rounded-4 mb-4 d-flex align-items-center justify-content-around text-center">
                <div>
                  <span className="small text-muted">XP Earned</span>
                  <p className="fs-4 fw-black text-indigo mb-0">+50 XP</p>
                </div>
                <div className="vr"></div>
                <div>
                  <span className="small text-muted">New Streak</span>
                  <p className="fs-4 fw-black text-warning mb-0">🔥 {progress.streak} Days</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCompletedModalOpen(false);
                  navigate('/dashboard');
                }}
                className="btn btn-indigo w-100 py-3 rounded-4 fw-bold shadow"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
