import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Terminal, ArrowLeft, Sparkles, ArrowRight, Award, Check, BookOpen, Target, Lock, Unlock, AlertTriangle } from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import CodeCompilerMock from '../components/learning/CodeCompilerMock';
import CodingLevelBar from '../components/common/CodingLevelBar';
import { PROGRAMMING_COURSES } from '../data/programmingData';
import { NATIVE_LANGUAGES } from '../data/languagesData';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';

export default function CodingLessonPage() {
  const { langId } = useParams();
  const { user } = useAuth();
  const { progress, completeCodingLevel, completeCodingStage } = useLearning();
  const navigate = useNavigate();

  const course = PROGRAMMING_COURSES.find(c => c.id === langId) || PROGRAMMING_COURSES[0];
  const all48Levels = course.levels || [];

  const [activeStage, setActiveStage] = useState('Beginner');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [isStageCompleteModalOpen, setIsStageCompleteModalOpen] = useState(false);
  const [lockAlertMessage, setLockAlertMessage] = useState(null);

  const completedStageIds = progress?.completedStageIds || [];
  const completedCodingLevelIds = progress?.completedCodingLevelIds || [];

  // Stage Unlocking Logic
  const isStageUnlocked = (stageId) => {
    if (stageId === 'Beginner') return true;
    if (stageId === 'Medium') return completedStageIds.includes(`${course.id}_Beginner`);
    if (stageId === 'Intermediate') return completedStageIds.includes(`${course.id}_Medium`);
    if (stageId === 'Advanced') return completedStageIds.includes(`${course.id}_Intermediate`);
    return false;
  };

  const stages = [
    { id: 'Beginner', title: '1. Beginner Stage', range: 'L1 - L12', unlocked: isStageUnlocked('Beginner') },
    { id: 'Medium', title: '2. Medium Stage', range: 'L13 - L24', unlocked: isStageUnlocked('Medium') },
    { id: 'Intermediate', title: '3. Intermediate Stage', range: 'L25 - L36', unlocked: isStageUnlocked('Intermediate') },
    { id: 'Advanced', title: '4. Advanced / Expert Stage', range: 'L37 - L48', unlocked: isStageUnlocked('Advanced') }
  ];

  const stageLevels = all48Levels.filter(lvl => lvl.stage === activeStage);

  // Level Unlocking Logic inside Active Stage
  const isLevelUnlocked = (idx) => {
    if (idx === 0) return true; // First level of a stage is always unlocked if the stage is unlocked
    const prevLvl = stageLevels[idx - 1];
    if (!prevLvl) return false;
    const prevLvlKey = `${course.id}_L${prevLvl.levelNumber}`;
    return completedCodingLevelIds.includes(prevLvlKey);
  };

  const activeLevel = stageLevels[currentLevelIdx] || stageLevels[0] || all48Levels[0];

  const nativeLangObj = NATIVE_LANGUAGES.find(l => l.id === user?.nativeLanguage) || NATIVE_LANGUAGES[0];

  const isTamil = nativeLangObj.id === 'ta';
  const isEnglish = nativeLangObj.id === 'en';

  const taskText = isTamil
    ? (activeLevel.taskTa || activeLevel.taskInstruction?.ta || activeLevel.taskEn)
    : isEnglish
    ? (activeLevel.taskEn || activeLevel.taskInstruction?.en)
    : (activeLevel[`task${nativeLangObj.id.toUpperCase()}`] || activeLevel.taskInstruction?.[nativeLangObj.id] || activeLevel.taskEn || activeLevel.taskTa);

  const explainText = activeLevel.nativeExplanation?.[nativeLangObj.id] ||
    (isTamil
      ? (activeLevel.taskTa || `குறிப்பு: "${activeLevel.output}" என்ற வெளியீட்டைப் பெற சரியான குறியீட்டை உள்ளிடவும்.`)
      : isEnglish
      ? (activeLevel.taskEn || `Instruction: Write code to produce the expected output "${activeLevel.output}".`)
      : `${nativeLangObj.nativeName} (${nativeLangObj.name}) Instruction: Write code to achieve output "${activeLevel.output}".`);

  const handleStageSelect = (stg) => {
    if (stg.unlocked) {
      setActiveStage(stg.id);
      setCurrentLevelIdx(0);
      setLockAlertMessage(null);
    } else {
      const prevStageName = stg.id === 'Medium' ? 'Beginner' : stg.id === 'Intermediate' ? 'Medium' : 'Intermediate';
      setLockAlertMessage(`🔒 ${stg.title} is Locked! Complete all 12 levels of ${prevStageName} stage to unlock.`);
    }
  };

  const handleLevelSelect = (idx) => {
    if (isLevelUnlocked(idx)) {
      setCurrentLevelIdx(idx);
      setLockAlertMessage(null);
    } else {
      setLockAlertMessage(`🔒 Level L${stageLevels[idx].levelNumber} is Locked! Pass Level L${stageLevels[idx - 1].levelNumber} first.`);
    }
  };

  const handleNextLevel = () => {
    // Save completion of current level
    completeCodingLevel(course.id, activeLevel.levelNumber);

    if (currentLevelIdx < stageLevels.length - 1) {
      setCurrentLevelIdx(currentLevelIdx + 1);
      setLockAlertMessage(null);
    } else {
      // Completed all 12 levels of the active stage!
      completeCodingStage(course.id, activeStage);
      setIsStageCompleteModalOpen(true);
    }
  };

  const handleProceedToNextStage = () => {
    setIsStageCompleteModalOpen(false);
    if (activeStage === 'Beginner') {
      setActiveStage('Medium');
      setCurrentLevelIdx(0);
    } else if (activeStage === 'Medium') {
      setActiveStage('Intermediate');
      setCurrentLevelIdx(0);
    } else if (activeStage === 'Intermediate') {
      setActiveStage('Advanced');
      setCurrentLevelIdx(0);
    } else {
      navigate('/code');
    }
  };

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container max-w-4xl py-4 flex-grow-1">
        
        {/* Top Control Bar */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <button
            onClick={() => navigate('/code')}
            className="btn btn-sm btn-outline-secondary rounded-3 fw-bold d-flex align-items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tracks
          </button>
          
          <span className="badge bg-warning-subtle text-dark border border-warning rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-1.5">
            {course.name} • {activeStage} Stage
            {completedStageIds.includes(`${course.id}_${activeStage}`) && (
              <span className="badge bg-success text-white rounded-circle p-1">✓</span>
            )}
          </span>
        </div>

        {/* Coding Level Progress Bar */}
        <CodingLevelBar />

        {/* Lock Warning Toast/Banner */}
        {lockAlertMessage && (
          <div className="alert alert-warning border-warning rounded-4 shadow-sm mb-4 d-flex align-items-center justify-content-between animate-in fade-in">
            <div className="d-flex align-items-center gap-2 fw-bold text-dark">
              <Lock className="w-5 h-5 text-warning fill-warning" />
              <span>{lockAlertMessage}</span>
            </div>
            <button
              onClick={() => setLockAlertMessage(null)}
              className="btn-close ms-2"
            ></button>
          </div>
        )}

        {/* 4 STAGE SELECTOR TABS (WITH LOCK/UNLOCK BADGES) */}
        <div className="row g-2 mb-4">
          {stages.map((stg) => {
            const isCurrent = activeStage === stg.id;
            const isUnlocked = stg.unlocked;
            const isDone = completedStageIds.includes(`${course.id}_${stg.id}`);

            return (
              <div key={stg.id} className="col-6 col-md-3">
                <button
                  onClick={() => handleStageSelect(stg)}
                  className={`w-100 p-3 rounded-4 border text-center transition-all btn position-relative ${
                    isCurrent
                      ? 'btn-indigo text-white fw-black shadow-lg border-indigo'
                      : isUnlocked
                      ? 'btn-light border-slate-200 text-dark hover:border-indigo shadow-sm'
                      : 'btn-secondary bg-opacity-10 border-slate-300 text-muted opacity-75'
                  }`}
                >
                  <div className="d-flex align-items-center justify-content-center gap-1.5 fw-black small">
                    <span>{stg.title}</span>
                    {isDone ? (
                      <span className="badge bg-success text-white rounded-circle px-1.5 py-0.5" style={{ fontSize: '0.65rem' }}>✓</span>
                    ) : !isUnlocked ? (
                      <Lock className="w-3.5 h-3.5 text-danger" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-success" />
                    )}
                  </div>
                  <div className="small opacity-75 mt-0.5" style={{ fontSize: '0.7rem' }}>
                    {stg.range} {!isUnlocked ? '(Locked 🔒)' : isDone ? '(Completed ✅)' : ''}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Level Chips Bar (12 levels per stage with Lock/Unlock) */}
        <div className="d-flex align-items-center gap-2 overflow-x-auto pb-3 mb-4">
          {stageLevels.map((lvl, idx) => {
            const lvlUnlocked = isLevelUnlocked(idx);
            const lvlKey = `${course.id}_L${lvl.levelNumber}`;
            const isPassed = completedCodingLevelIds.includes(lvlKey);

            return (
              <button
                key={idx}
                onClick={() => handleLevelSelect(idx)}
                className={`shrink-0 px-3 py-1.5 rounded-3 text-xs fw-bold border transition-all d-flex align-items-center gap-1 btn ${
                  idx === currentLevelIdx
                    ? 'btn-indigo text-white shadow-md'
                    : isPassed
                    ? 'btn-success text-white border-success'
                    : lvlUnlocked
                    ? 'btn-light text-dark border-slate-200'
                    : 'btn-light text-muted border-slate-200 opacity-60'
                }`}
              >
                <span>L{lvl.levelNumber}</span>
                {isPassed ? (
                  <Check className="w-3 h-3 text-white" />
                ) : !lvlUnlocked ? (
                  <Lock className="w-3 h-3 text-danger" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* DETAILED TASK INSTRUCTION CARD */}
        <div className="card border-0 rounded-5 p-4 shadow-sm mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="fw-bold text-indigo d-flex align-items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo" /> {activeLevel.title} ({activeStage})
            </span>
            <span className="badge bg-warning-subtle text-dark border border-warning rounded-pill px-3 py-1 fw-bold">
              +25 Coding XP
            </span>
          </div>

          {/* Detailed Task Text */}
          <div className="p-3 bg-indigo-subtle-custom border border-indigo rounded-4 mb-3">
            <h6 className="fw-bold text-indigo text-uppercase tracking-wider mb-1 d-flex align-items-center gap-1.5" style={{ fontSize: '0.75rem' }}>
              <Sparkles className="w-4 h-4" /> {nativeLangObj.flag} Task Instruction ({nativeLangObj.name} - {nativeLangObj.nativeName})
            </h6>
            <p className="fs-6 fw-black text-dark dark:text-white mb-0 leading-relaxed">
              👉 {taskText}
            </p>
          </div>

          {/* Concept Explanation Guide */}
          <div className="p-3 bg-light dark:bg-slate-800 rounded-4 border mb-3">
            <h6 className="fw-bold text-muted text-uppercase tracking-wider mb-1 d-flex align-items-center gap-1.5" style={{ fontSize: '0.75rem' }}>
              <BookOpen className="w-4 h-4 text-indigo" /> Concept Guide ({nativeLangObj.flag} {nativeLangObj.nativeName})
            </h6>
            <p className="small text-dark dark:text-white mb-0 leading-relaxed fw-medium">
              💡 {explainText}
            </p>
          </div>

          {/* Target Expected Output Badge */}
          <div className="d-flex align-items-center justify-content-between p-3 bg-success-subtle border border-success rounded-4 small gap-3">
            <span className="fw-bold text-success d-flex align-items-center gap-1.5">
              <Target className="w-4 h-4 text-success flex-shrink-0" /> 
              <span>எதிர்பார்க்கப்படும் வெளியீடு (Expected Output):</span>
            </span>
            <span 
              className="px-3 py-1.5 bg-dark text-warning font-mono fw-extrabold rounded-3 text-nowrap flex-shrink-0 border border-dark shadow-sm"
              style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}
            >
              {activeLevel.expectedOutput}
            </span>
          </div>
        </div>

        {/* Live Code Compiler Sandbox */}
        <div className="mb-4">
          <CodeCompilerMock
            key={activeLevel.levelNumber}
            initialCode={activeLevel.starterCode}
            language={course.id}
            expectedOutput={activeLevel.expectedOutput}
            testCases={activeLevel.testCases}
            onLevelComplete={handleNextLevel}
          />
        </div>

        {/* Level Controls */}
        <div className="d-flex align-items-center justify-content-between pt-2">
          <button
            onClick={() => setCurrentLevelIdx(Math.max(0, currentLevelIdx - 1))}
            disabled={currentLevelIdx === 0}
            className="btn btn-light border rounded-3 px-4 py-2 fw-bold text-dark disabled:opacity-40"
          >
            ← Prev
          </button>

          <button
            onClick={handleNextLevel}
            className="btn btn-indigo rounded-3 px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-1.5"
          >
            {currentLevelIdx === stageLevels.length - 1 ? 'Finish Stage 🎉' : 'Next Level →'}
          </button>
        </div>

      </main>

      {/* Stage Completion Modal */}
      {isStageCompleteModalOpen && (
        <div className="modal show d-block tab-index-1 bg-dark bg-opacity-75 backdrop-blur-sm">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-5 p-4 text-center shadow-lg">
              <div className="rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center mx-auto mb-3 shadow" style={{ width: '64px', height: '64px', fontSize: '2rem' }}>
                🏆
              </div>
              <h3 className="fw-black text-dark dark:text-white mb-1">
                {activeStage} Stage Complete!
              </h3>
              <p className="small text-muted mb-4">
                Awesome job! You completed all 12 levels of the {activeStage} stage. +100 Stage Bonus XP & Next Stage Unlocked!
              </p>

              <div className="p-3 bg-success-subtle border border-success rounded-4 mb-4 d-flex align-items-center justify-content-center gap-2 fw-bold text-success">
                <Award className="w-5 h-5 text-warning" /> Next Stage Unlocked! 🔓
              </div>

              <button
                onClick={handleProceedToNextStage}
                className="btn btn-indigo w-100 py-3 rounded-4 fw-bold shadow d-flex align-items-center justify-content-center gap-2"
              >
                Proceed to Next Stage <ArrowRight className="w-4 h-4" />
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
