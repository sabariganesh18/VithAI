import React from 'react';
import { Award, Download, Printer, X, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NATIVE_LANGUAGES } from '../../data/languagesData';

export default function CertificateModal({ isOpen, onClose, courseTitle = "English Foundations Level 1" }) {
  const { user } = useAuth();
  if (!isOpen) return null;

  const nativeLang = NATIVE_LANGUAGES.find(l => l.id === user?.nativeLanguage)?.name || 'Tamil';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 1060, backdropFilter: 'blur(4px)' }}>
      <div className="card border-0 rounded-5 shadow-lg w-100 bg-white dark:bg-dark text-dark dark:text-white p-4" style={{ maxWidth: '650px' }}>
        {/* Top Controls */}
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
          <div className="d-flex align-items-center gap-2">
            <Award className="w-6 h-6 text-warning" />
            <h5 className="fw-bold mb-0">
              Official Certificate of Completion
            </h5>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-sm btn-light border rounded-3 fw-bold d-flex align-items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={onClose}
              className="btn-close shadow-none cursor-pointer"
            ></button>
          </div>
        </div>

        {/* Certificate Printable Canvas Box */}
        <div className="p-4 p-md-5 bg-light rounded-4 text-center border border-2 border-warning shadow-inner">
          <img
            src="/vithai-logo.png"
            alt="VithAI Logo"
            className="mx-auto mb-2 rounded-circle shadow-sm p-1 bg-white border border-warning"
            style={{ width: '64px', height: '64px', objectFit: 'contain' }}
          />

          <h6 className="fw-black text-uppercase text-warning mb-1" style={{ letterSpacing: '2px' }}>
            VithAI Learning Platform
          </h6>
          <h3 className="fw-black text-dark dark:text-white mb-4">
            CERTIFICATE OF ACHIEVEMENT
          </h3>

          <p className="small text-muted text-uppercase mb-1">
            This is proudly presented to
          </p>
          <h2 className="fw-black text-indigo my-3 tracking-wide" style={{ fontSize: '2.2rem', letterSpacing: '1px' }}>
            {user?.name || 'Learner'}
          </h2>

          <p className="small text-muted max-w-lg mx-auto leading-relaxed mb-4">
            For successfully completing daily vocabulary & coding concepts on <strong>{courseTitle}</strong> through native language ({nativeLang}).
          </p>

          <div className="row g-3 max-w-sm mx-auto pt-3 border-top small">
            <div className="col-6">
              <p className="fw-bold mb-0">September 2026</p>
              <p className="text-muted small m-0" style={{ fontSize: '0.7rem' }}>Completion Date</p>
            </div>
            <div className="col-6">
              <p className="fw-bold mb-0 text-success d-flex align-items-center justify-content-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Verified
              </p>
              <p className="text-muted small m-0" style={{ fontSize: '0.7rem' }}>VITH-VERIFY-{Date.now().toString().slice(-6)}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="btn btn-indigo rounded-4 px-4 py-2.5 fw-bold shadow-sm"
          >
            Close & Keep Learning
          </button>
        </div>
      </div>
    </div>
  );
}
