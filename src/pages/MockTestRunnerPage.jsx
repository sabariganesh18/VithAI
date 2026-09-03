import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, CheckCircle2, Award, Sparkles } from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { getMockTestQuestions } from '../data/aptitudeMockData';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';

export default function MockTestRunnerPage() {
  const { testId } = useParams();
  const { user } = useAuth();
  const { addXP } = useLearning();
  const navigate = useNavigate();

  const { testInfo, questions } = getMockTestQuestions(testId);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState((testInfo?.durationMins || 60) * 60);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (isTestSubmitted || timeLeftSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTestSubmitted, timeLeftSeconds]);

  const safeQuestions = questions || [];
  const currentQ = safeQuestions[currentIdx] || safeQuestions[0] || {
    id: 1,
    question: 'Sample Question',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: 'Option A'
  };

  const optionsList = currentQ.options || currentQ.opts || [];
  const questionText = currentQ.question || currentQ.q || 'Question';
  const correctAnswer = currentQ.answer || currentQ.ans || '';

  const handleSelectAnswer = (option) => {
    if (isTestSubmitted) return;
    setUserAnswers({ ...userAnswers, [currentQ.id]: option });
  };

  const handleSubmitTest = () => {
    if (isTestSubmitted) return;

    let correctCount = 0;
    safeQuestions.forEach(q => {
      const qAns = q.answer || q.ans;
      if (userAnswers[q.id] === qAns) correctCount++;
    });

    const percentage = Math.round((correctCount / safeQuestions.length) * 100);
    const xpAward = Math.round(percentage * 1.5);

    setTestResult({
      total: safeQuestions.length,
      correct: correctCount,
      incorrect: safeQuestions.length - correctCount,
      percentage,
      xpEarned: xpAward
    });

    setIsTestSubmitted(true);
    addXP(xpAward);
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container max-w-6xl py-4 flex-grow-1">
        
        {/* Top Controls & Timer Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <button
            onClick={() => navigate('/mock-tests')}
            className="btn btn-sm btn-outline-secondary rounded-3 fw-bold d-flex align-items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Mock Tests
          </button>

          {!isTestSubmitted && (
            <div className="badge bg-warning-subtle text-warning border border-warning px-3 py-2 rounded-4 fw-bold d-flex align-items-center gap-1.5">
              <Clock className="w-4 h-4 text-warning animate-pulse" />
              <span>Time Remaining: {formatTimer(timeLeftSeconds)}</span>
            </div>
          )}
        </div>

        {!isTestSubmitted ? (
          <div className="row g-4">
            
            {/* Main Active Question Card */}
            <div className="col-12 col-lg-8">
              <div className="card border-0 rounded-5 p-4 p-md-5 shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge bg-indigo text-white rounded-pill px-3 py-1.5 fw-bold">
                    Question {currentIdx + 1} of {safeQuestions.length}
                  </span>
                  <span className="small text-muted fw-bold">
                    {testInfo?.title || 'Mock Test'}
                  </span>
                </div>

                <h4 className="fw-bold text-dark dark:text-white mb-4">
                  {questionText}
                </h4>

                <div className="d-flex flex-column gap-2 mb-4">
                  {optionsList.map((opt, idx) => {
                    const isSelected = userAnswers[currentQ.id] === opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(opt)}
                        className={`w-100 text-start p-3 rounded-4 border btn text-sm font-semibold d-flex align-items-center justify-content-between ${
                          isSelected
                            ? 'btn-indigo text-white shadow-sm'
                            : 'btn-light border-slate-200 text-dark'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation Controls */}
                <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                  <button
                    onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                    disabled={currentIdx === 0}
                    className="btn btn-light border rounded-3 px-3 py-2 fw-bold text-dark disabled:opacity-40"
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={() => setCurrentIdx(Math.min(safeQuestions.length - 1, currentIdx + 1))}
                    disabled={currentIdx === safeQuestions.length - 1}
                    className="btn btn-indigo rounded-3 px-4 py-2 fw-bold shadow-sm"
                  >
                    Next Question →
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: 50-Question Matrix Navigator & Submit */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 rounded-5 p-4 shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-bold text-dark dark:text-white mb-0">
                    50 Question Navigator
                  </h6>
                  <span className="small text-indigo fw-bold">
                    {Object.keys(userAnswers).length} / {safeQuestions.length} Answered
                  </span>
                </div>

                {/* 50-Grid Matrix */}
                <div className="row g-1 mb-4 overflow-y-auto" style={{ maxHeight: '280px' }}>
                  {safeQuestions.map((q, idx) => {
                    const isAnswered = Boolean(userAnswers[q.id]);
                    const isCurrent = idx === currentIdx;
                    return (
                      <div key={q.id || idx} className="col-2">
                        <button
                          onClick={() => setCurrentIdx(idx)}
                          className={`w-100 p-2 rounded-3 text-center btn btn-sm fw-bold ${
                            isCurrent
                              ? 'btn-indigo text-white shadow'
                              : isAnswered
                              ? 'btn-success text-white'
                              : 'btn-light text-dark border-slate-200'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleSubmitTest}
                  className="btn btn-success w-100 py-3 rounded-4 fw-black shadow text-white animate-pulse"
                >
                  Submit 50-Question Mock Test 🎉
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Test Result Summary View */
          <div className="card border-0 rounded-5 p-5 shadow-lg max-w-2xl mx-auto text-center">
            <div className="rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center mx-auto mb-3 shadow" style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
              🏆
            </div>

            <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-3 py-1.5 fw-bold mb-3 d-inline-flex align-items-center gap-1 mx-auto">
              <Sparkles className="w-3.5 h-3.5" /> Mock Test Completed
            </span>

            <h2 className="fw-black text-dark dark:text-white mb-2">
              {testInfo?.title || 'Mock Test'} Results
            </h2>
            <p className="small text-muted mb-4">
              Here is your performance breakdown for the {safeQuestions.length}-question mock test.
            </p>

            <div className="card border-0 bg-indigo-subtle-custom rounded-5 p-4 mb-4 max-w-xs mx-auto">
              <div className="fs-1 fw-black text-indigo mb-1">
                {testResult?.percentage}%
              </div>
              <div className="small fw-bold text-muted">
                {testResult?.correct} / {testResult?.total} Correct Answers
              </div>
            </div>

            <div className="p-3 bg-success-subtle border border-success rounded-4 mb-4 d-flex align-items-center justify-content-center gap-2 small fw-bold text-success">
              <Award className="w-5 h-5 text-warning" /> +{testResult?.xpEarned} Mock Test XP Awarded to your profile!
            </div>

            <div className="d-flex gap-3 justify-content-center">
              <button
                onClick={() => {
                  setIsTestSubmitted(false);
                  setUserAnswers({});
                  setCurrentIdx(0);
                  setTimeLeftSeconds((testInfo?.durationMins || 60) * 60);
                }}
                className="btn btn-light border rounded-3 px-4 py-2.5 fw-bold text-dark"
              >
                Retake Mock Test
              </button>
              <button
                onClick={() => navigate('/mock-tests')}
                className="btn btn-indigo rounded-3 px-4 py-2.5 fw-bold shadow-sm"
              >
                Explore Other Mock Tests
              </button>
            </div>
          </div>
        )}

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
