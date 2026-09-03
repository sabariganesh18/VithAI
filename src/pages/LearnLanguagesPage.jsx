import React from 'react';
import { Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { TARGET_HUMAN_LANGUAGES, NATIVE_LANGUAGES } from '../data/languagesData';
import { useAuth } from '../context/AuthContext';

export default function LearnLanguagesPage() {
  const { user, updateProfile } = useAuth();
  const nativeLang = NATIVE_LANGUAGES.find(l => l.id === user?.nativeLanguage) || NATIVE_LANGUAGES[0];

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container py-4 flex-grow-1">
        <div className="text-center mx-auto mb-4" style={{ maxWidth: '600px' }}>
          <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-3 py-1.5 fw-bold mb-2 d-inline-flex align-items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Explained in {nativeLang.name} ({nativeLang.nativeName})
          </span>
          <h2 className="fw-black text-dark dark:text-white mb-1">
            Human Languages Catalog
          </h2>
          <p className="small text-muted">
            Select a target language to start your daily 10-words guided learning cycle.
          </p>
        </div>

        <div className="row g-4 mb-4">
          {TARGET_HUMAN_LANGUAGES.map((lang) => {
            const isSelected = user?.learningLanguage === lang.id;
            return (
              <div key={lang.id} className="col-12 col-sm-6 col-lg-4">
                <div className={`card border-0 shadow-sm rounded-5 p-4 h-100 d-flex flex-column justify-content-between ${isSelected ? 'border border-2 border-indigo' : ''}`}>
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="fs-1">{lang.flag}</span>
                      <span className="badge bg-light text-muted border rounded-pill px-3 py-1.5 fw-bold" style={{ fontSize: '0.65rem' }}>
                        {lang.category}
                      </span>
                    </div>

                    <h4 className="fw-bold text-dark dark:text-white mb-1">
                      {lang.name}
                    </h4>
                    <p className="small text-indigo fw-medium mb-2">
                      {lang.nativeName}
                    </p>
                    <p className="small text-muted mb-4">
                      Master 60 words per week with native sentence breakdowns in {nativeLang.name}.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      updateProfile({ learningLanguage: lang.id });
                    }}
                    className={`btn w-100 py-2.5 rounded-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 ${
                      isSelected
                        ? 'btn-success text-white'
                        : 'btn-indigo text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Active Course
                      </>
                    ) : (
                      <>
                        Select {lang.name} Course <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
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
