import React from 'react';
import { Phone, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark border-top text-muted py-4 mt-auto">
      <div className="container px-3 px-md-4">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-center text-md-start">
          
          {/* Brand & Developer Info */}
          <div className="d-flex align-items-center gap-3">
            <img 
              src="/vithai-logo.png" 
              alt="VithAI Logo" 
              className="rounded-3 shadow-sm" 
              style={{ width: '36px', height: '36px', objectFit: 'cover' }} 
            />
            <div>
              <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
                <span className="fw-black fs-5 text-dark dark:text-white">VithAI</span>
                <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-2.5 py-0.5 small font-mono d-inline-flex align-items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> MCA Project
                </span>
              </div>
              <p className="small text-muted mb-0 mt-0.5">
                Designed & Developed by <strong className="text-dark dark:text-white">Sabari Ganesh</strong> (MCA Student)
              </p>
            </div>
          </div>

          {/* Social & Contact Links */}
          <div className="d-flex align-items-center flex-wrap justify-content-center gap-2 gap-md-3">
            
            {/* Phone Number */}
            <a
              href="tel:9003814076"
              className="btn btn-sm btn-light border rounded-pill px-3 py-1.5 fw-bold text-dark d-inline-flex align-items-center gap-2 hover:bg-indigo hover:text-white transition-all shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-success" />
              <span>9003814076</span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/sabariganesh18"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-light border rounded-pill px-3 py-1.5 fw-bold text-dark d-inline-flex align-items-center gap-2 hover:bg-dark hover:text-white transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5 text-indigo" viewBox="0 0 24 24" fill="currentColor" style={{ width: '15px', height: '15px' }}>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/sabari-ganesh-r-525724388"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-light border rounded-pill px-3 py-1.5 fw-bold text-dark d-inline-flex align-items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="currentColor" style={{ width: '15px', height: '15px' }}>
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>

          </div>

        </div>

        <div className="pt-3 mt-3 border-top text-center small text-muted">
          <p className="mb-0">
            © {new Date().getFullYear()} VithAI • Built with React, Bootstrap 5 & AI
          </p>
        </div>
      </div>
    </footer>
  );
}
