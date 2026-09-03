import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import CodingLevelBar from '../components/common/CodingLevelBar';
import { PROGRAMMING_LANGUAGES, NATIVE_LANGUAGES } from '../data/languagesData';
import { useAuth } from '../context/AuthContext';

export default function CodeLoopPage() {
  const { user, updateProfile } = useAuth();
  const nativeLang = NATIVE_LANGUAGES.find(l => l.id === user?.nativeLanguage) || NATIVE_LANGUAGES[0];

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container py-4 flex-grow-1">
        {/* Coding Level Progress Bar (Beginner to Expert) */}
        <div className="mb-4">
          <CodingLevelBar />
        </div>

        {/* Header Hero */}
        <div className="card border-0 bg-dark text-white rounded-5 p-4 p-md-5 shadow-lg mb-4">
          <div className="max-w-2xl">
            <span className="badge bg-warning text-dark fw-bold rounded-pill px-3 py-1.5 mb-3 d-inline-flex align-items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> CodeLoop Platform
            </span>
            <h2 className="fw-black mb-2">
              Learn Programming in {nativeLang.name}
            </h2>
            <p className="small text-light opacity-75 mb-0">
              Break down complex syntax, variables, loops, functions, and OOP concepts into clear native explanations with code output evaluation.
            </p>
          </div>
        </div>

        {/* Courses Grid */}
        <h4 className="fw-black text-dark dark:text-white mb-3">
          Select Programming Language Track
        </h4>

        <div className="row g-4 mb-4">
          {PROGRAMMING_LANGUAGES.map((lang) => {
            const isSelected = user?.codingLanguage === lang.id;
            return (
              <div key={lang.id} className="col-12 col-sm-6 col-lg-3">
                <div className={`card border-0 shadow-sm rounded-5 p-4 h-100 d-flex flex-column justify-content-between ${isSelected ? 'border border-2 border-warning' : ''}`}>
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="fs-1">{lang.icon}</span>
                      {lang.popular && (
                        <span className="badge bg-warning text-dark fw-bold" style={{ fontSize: '0.65rem' }}>
                          Popular
                        </span>
                      )}
                    </div>

                    <h5 className="fw-bold text-dark dark:text-white mb-1">
                      {lang.name}
                    </h5>
                    <p className="small text-muted mb-4">
                      {lang.tagline}
                    </p>
                  </div>

                  <Link
                    to={`/code-lesson/${lang.id}`}
                    onClick={() => updateProfile({ codingLanguage: lang.id })}
                    className="btn btn-dark w-100 py-2.5 rounded-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    Start {lang.name} Module <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
