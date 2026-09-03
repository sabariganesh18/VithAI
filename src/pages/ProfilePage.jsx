import React, { useState } from 'react';
import { Award } from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import CertificateModal from '../components/learning/CertificateModal';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { NATIVE_LANGUAGES, TARGET_HUMAN_LANGUAGES } from '../data/languagesData';
import { BADGES_DATA } from '../data/badgesData';

export default function ProfilePage() {
  const { user } = useAuth();
  const { progress, levelInfo } = useLearning();
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const nativeLang = NATIVE_LANGUAGES.find(l => l.id === user?.nativeLanguage) || NATIVE_LANGUAGES[0];
  const targetLang = TARGET_HUMAN_LANGUAGES.find(l => l.id === user?.learningLanguage) || TARGET_HUMAN_LANGUAGES[0];

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container py-4 flex-grow-1" style={{ maxWidth: '960px' }}>
        {/* Profile Banner */}
        <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 mb-4">
          <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
            <div className="rounded-5 bg-indigo text-white font-extrabold fs-1 d-flex align-items-center justify-content-center shadow" style={{ width: '96px', height: '96px' }}>
              {user?.avatar || '🦉'}
            </div>

            <div className="text-center text-sm-start flex-grow-1">
              <h2 className="fw-black text-dark dark:text-white mb-1">
                {user?.name || 'Learner'}
              </h2>
              <p className="small text-muted mb-3">
                {user?.email} • Joined August 2026
              </p>

              <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start gap-2">
                <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-3 py-1.5 fw-bold">
                  Native: {nativeLang.name} ({nativeLang.nativeName})
                </span>
                <span className="badge bg-purple-subtle text-purple border border-purple rounded-pill px-3 py-1.5 fw-bold">
                  Target: {targetLang.name} & CodeLoop
                </span>
                <span className="badge bg-success-subtle text-success border border-success rounded-pill px-3 py-1.5 fw-bold">
                  {levelInfo.name}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCertModalOpen(true)}
              className="btn btn-warning text-dark fw-bold rounded-4 py-2.5 px-4 shadow-sm d-flex align-items-center gap-2"
            >
              <Award className="w-4 h-4" /> View Certificate
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-sm-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Streak</span>
              <div className="fs-4 fw-black text-warning mt-1">🔥 {progress.streak} Days</div>
            </div>
          </div>
          <div className="col-6 col-sm-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Total XP</span>
              <div className="fs-4 fw-black text-indigo mt-1">⭐ {progress.xp}</div>
            </div>
          </div>
          <div className="col-6 col-sm-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Words Learned</span>
              <div className="fs-4 fw-black text-success mt-1">📚 {progress.learnedWordIds.length}</div>
            </div>
          </div>
          <div className="col-6 col-sm-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Badges</span>
              <div className="fs-4 fw-black text-purple mt-1">🏆 {progress.unlockedBadgeIds.length}</div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 mb-4">
          <h4 className="fw-black text-dark dark:text-white mb-4">
            Earned Badges & Trophies
          </h4>

          <div className="row g-3">
            {BADGES_DATA.map((badge) => {
              const isUnlocked = progress.unlockedBadgeIds.includes(badge.id);
              return (
                <div key={badge.id} className="col-6 col-sm-4 col-md-3">
                  <div
                    className={`card p-3 rounded-4 text-center border h-100 ${
                      isUnlocked
                        ? 'bg-warning-subtle border-warning'
                        : 'bg-light text-muted opacity-50'
                    }`}
                  >
                    <div className="fs-2 mb-1">{badge.icon}</div>
                    <h6 className="fw-bold text-dark small mb-1">{badge.title}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      <Footer />
      <MobileBottomNav />
      <CertificateModal isOpen={isCertModalOpen} onClose={() => setIsCertModalOpen(false)} />
    </div>
  );
}
