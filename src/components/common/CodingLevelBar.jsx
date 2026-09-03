import React from 'react';
import { Zap } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export default function CodingLevelBar() {
  const { progress } = useLearning();

  const codingXp = progress.codingXp || progress.xp || 0;

  // Calculate Coding Level (Beginner to Expert)
  const getCodingLevel = (xp) => {
    if (xp < 100) return { level: 1, title: 'Novice Coder', badge: '🐣', minXp: 0, nextXp: 100 };
    if (xp < 300) return { level: 2, title: 'Beginner Developer', badge: '💻', minXp: 100, nextXp: 300 };
    if (xp < 600) return { level: 3, title: 'Intermediate Programmer', badge: '🚀', minXp: 300, nextXp: 600 };
    if (xp < 1000) return { level: 4, title: 'Advanced Architect', badge: '⚡', minXp: 600, nextXp: 1000 };
    return { level: 5, title: 'Expert Code Master', badge: '👑', minXp: 1000, nextXp: 2000 };
  };

  const levelInfo = getCodingLevel(codingXp);
  const percent = Math.min(100, Math.max(5, Math.round(((codingXp - levelInfo.minXp) / (levelInfo.nextXp - levelInfo.minXp)) * 100)));

  const stages = [
    { title: 'Beginner', level: 1, active: levelInfo.level >= 1 },
    { title: 'Intermediate', level: 3, active: levelInfo.level >= 3 },
    { title: 'Advanced', level: 4, active: levelInfo.level >= 4 },
    { title: 'Expert', level: 5, active: levelInfo.level >= 5 }
  ];

  return (
    <div className="card border-0 rounded-5 p-4 bg-dark text-white shadow-lg overflow-hidden position-relative mb-4">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-4 bg-warning text-dark fw-bold d-flex align-items-center justify-content-center shadow" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
            {levelInfo.badge}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-warning text-dark rounded-pill px-2.5 py-1 small fw-extrabold">
                CodeLoop Mastery
              </span>
              <span className="small text-white-50 fw-bold">Level {levelInfo.level} / 5</span>
            </div>
            <h3 className="fw-black text-white m-0 tracking-tight mt-1">
              {levelInfo.title}
            </h3>
          </div>
        </div>

        <div className="badge bg-indigo text-white border border-indigo-subtle px-3 py-2 rounded-4 d-inline-flex align-items-center gap-1.5 align-self-start align-self-md-center shadow-sm">
          <Zap className="w-4 h-4 text-warning fill-warning" />
          <span className="fw-bold fs-6">{codingXp} Coding XP</span>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="space-y-2">
        <div className="d-flex justify-content-between small font-semibold text-white-50 mb-1">
          <span>Current Level: <strong className="text-warning">{levelInfo.title}</strong></span>
          <span>Next Level at <strong className="text-white">{levelInfo.nextXp} XP</strong></span>
        </div>

        <div className="progress rounded-pill bg-secondary bg-opacity-25" style={{ height: '10px' }}>
          <div
            className="progress-bar bg-warning rounded-pill"
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        {/* Milestone Stages Indicator with High Contrast Colors */}
        <div className="row g-2 pt-2 text-center text-xs font-bold">
          {stages.map((st, idx) => (
            <div key={idx} className="col-3">
              <div
                className={`py-2 px-2 rounded-3 border fw-bold text-truncate transition-all ${
                  st.active
                    ? 'bg-warning text-dark border-warning shadow-sm'
                    : 'bg-secondary bg-opacity-25 text-white-50 border-secondary border-opacity-25'
                }`}
              >
                {st.title} {st.active ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
