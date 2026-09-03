import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sparkles, ArrowRight, Search } from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { MOCK_TEST_TITLES } from '../data/aptitudeMockData';

export default function MockTestsPage() {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Aptitude & Placement', 'Programming Technical', 'Database Technical', 'Web Technical'];

  const filteredTests = MOCK_TEST_TITLES.filter(test => {
    const matchesCat = filterCategory === 'All' || test.category === filterCategory;
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) || test.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container py-4 flex-grow-1">
        
        {/* Hero Banner */}
        <div className="card border-0 rounded-5 p-4 p-md-5 mb-4 text-white shadow-lg bg-indigo">
          <div className="max-w-2xl">
            <span className="badge bg-white text-indigo rounded-pill px-3 py-1.5 fw-bold mb-3 d-inline-flex align-items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Aptitude & Technical Mock Test Module
            </span>
            <h1 className="fw-black mb-2">
              50-Question Full Mock Tests
            </h1>
            <p className="small mb-0 opacity-75 leading-relaxed">
              Prepare for company placement exams, coding interviews, and aptitude rounds with 50 structured questions per title, live timer, and detailed score analysis.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="row g-3 mb-4 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white dark:bg-dark border-end-0">
                <Search className="w-4 h-4 text-muted" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search aptitude, Python, Java, SQL mock tests..."
                className="form-control border-start-0 ps-0"
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center gap-2 overflow-x-auto pb-2 pb-md-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`btn btn-sm shrink-0 rounded-3 px-3 py-1.5 fw-bold border ${
                    filterCategory === cat ? 'btn-indigo text-white shadow-sm' : 'btn-light border-slate-200 text-dark'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mock Test Cards Grid */}
        <div className="row g-4 mb-4">
          {filteredTests.map((test) => (
            <div key={test.id} className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 rounded-5 p-4 shadow-sm h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fs-1">{test.icon}</span>
                    <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-3 py-1 fw-bold">
                      {test.questionCount} Questions
                    </span>
                  </div>

                  <h4 className="fw-bold text-dark dark:text-white mb-2">
                    {test.title}
                  </h4>
                  <p className="small text-muted mb-3 leading-relaxed">
                    {test.tagline}
                  </p>

                  <div className="d-flex align-items-center gap-2 small fw-semibold text-muted mb-4">
                    <span className="d-flex align-items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo" /> {test.durationMins} Mins
                    </span>
                    <span>•</span>
                    <span>Difficulty: {test.difficulty}</span>
                  </div>
                </div>

                <Link
                  to={`/mock-test/${test.id}`}
                  className="btn btn-indigo w-100 py-2.5 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  Start 50-Question Mock Test <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
