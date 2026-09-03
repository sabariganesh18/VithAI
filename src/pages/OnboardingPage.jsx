import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, BookOpen, Code, Clock, Target, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Compass, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NATIVE_LANGUAGES, TARGET_HUMAN_LANGUAGES, PROGRAMMING_LANGUAGES, LEVELS, TIME_GOALS, GOAL_OPTIONS } from '../data/languagesData';

export default function OnboardingPage() {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nativeLanguage: user?.nativeLanguage || 'ta',
    category: 'both',
    learningLanguage: 'en',
    codingLanguage: 'python',
    level: 'beginner',
    dailyGoalMins: 20,
    goalObjective: 'vocabulary'
  });

  const selectedNative = NATIVE_LANGUAGES.find(l => l.id === formData.nativeLanguage) || NATIVE_LANGUAGES[0];
  const selectedHuman = TARGET_HUMAN_LANGUAGES.find(l => l.id === formData.learningLanguage) || TARGET_HUMAN_LANGUAGES[0];
  const selectedCode = PROGRAMMING_LANGUAGES.find(p => p.id === formData.codingLanguage) || PROGRAMMING_LANGUAGES[0];

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      completeOnboarding(formData);
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column justify-content-between py-5 px-3">
      <div className="container max-w-2xl mx-auto">
        
        {/* Step Indicator Header */}
        <div className="mb-4 text-center">
          <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-3 py-1.5 fw-bold mb-3 d-inline-flex align-items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Step {step} of 6 Personalization Questionnaire
          </span>
          
          {/* Progress Bar */}
          <div className="progress rounded-pill bg-slate-200" style={{ height: '8px' }}>
            <div
              className="progress-bar bg-indigo rounded-pill"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Wizard Card Container */}
        <div className="card border-0 rounded-5 p-4 p-md-5 shadow-lg min-vh-50 d-flex flex-column justify-content-between">
          
          {/* STEP 1: Native Language Choice */}
          {step === 1 && (
            <div>
              <div className="mb-4">
                <h3 className="fw-black text-dark dark:text-white mb-1 d-flex align-items-center gap-2">
                  <Globe className="w-6 h-6 text-indigo" /> 1. Select Your Native Language
                </h3>
                <p className="small text-muted mb-0">
                  All explanations, translations, and coding concepts will be taught in your chosen native tongue.
                </p>
              </div>

              <div className="row g-2 overflow-y-auto" style={{ maxHeight: '280px' }}>
                {NATIVE_LANGUAGES.map((lang) => {
                  const isSelected = formData.nativeLanguage === lang.id;
                  return (
                    <div key={lang.id} className="col-6 col-sm-4">
                      <button
                        onClick={() => setFormData({ ...formData, nativeLanguage: lang.id })}
                        className={`w-100 p-3 rounded-4 border text-start btn transition-all ${
                          isSelected
                            ? 'btn-indigo text-white fw-bold shadow'
                            : 'btn-light border-slate-200 text-dark'
                        }`}
                      >
                        <div className="fs-5 mb-1">{lang.flag}</div>
                        <div className="fw-bold small">{lang.name}</div>
                        <div className="small opacity-75" style={{ fontSize: '0.7rem' }}>{lang.nativeName}</div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Category Preference */}
          {step === 2 && (
            <div>
              <div className="mb-4">
                <h3 className="fw-black text-dark dark:text-white mb-1 d-flex align-items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo" /> 2. What do you want to learn?
                </h3>
                <p className="small text-muted mb-0">
                  Choose human spoken languages, CodeLoop programming, or both.
                </p>
              </div>

              {/* Category Selector */}
              <div className="row g-3 mb-4">
                {[
                  { id: 'human', label: 'Human Spoken Languages', icon: BookOpen },
                  { id: 'coding', label: 'Programming & Tech', icon: Code },
                  { id: 'both', label: 'Both (Recommended)', icon: Sparkles }
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.id;
                  return (
                    <div key={cat.id} className="col-4">
                      <button
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`w-100 p-3 rounded-4 border text-center btn transition-all ${
                          isSelected
                            ? 'btn-indigo text-white fw-bold shadow'
                            : 'btn-light border-slate-200 text-dark'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="small fw-bold">{cat.label}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Human Language Selection */}
              {formData.category !== 'coding' && (
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark dark:text-white">
                    Select Target Language:
                  </label>
                  <div className="row g-2">
                    {TARGET_HUMAN_LANGUAGES.map((lang) => (
                      <div key={lang.id} className="col-6 col-sm-3">
                        <button
                          onClick={() => setFormData({ ...formData, learningLanguage: lang.id })}
                          className={`w-100 p-2.5 rounded-3 border text-xs fw-bold btn ${
                            formData.learningLanguage === lang.id
                              ? 'btn-indigo text-white shadow-sm'
                              : 'btn-light border-slate-200 text-dark'
                          }`}
                        >
                          {lang.flag} {lang.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coding Track Selection */}
              {formData.category !== 'human' && (
                <div>
                  <label className="form-label small fw-bold text-dark dark:text-white">
                    Select Target Programming Track:
                  </label>
                  <div className="row g-2">
                    {PROGRAMMING_LANGUAGES.map((prog) => (
                      <div key={prog.id} className="col-6 col-sm-3">
                        <button
                          onClick={() => setFormData({ ...formData, codingLanguage: prog.id })}
                          className={`w-100 p-2.5 rounded-3 border text-xs fw-bold btn ${
                            formData.codingLanguage === prog.id
                              ? 'btn-warning text-dark shadow-sm'
                              : 'btn-light border-slate-200 text-dark'
                          }`}
                        >
                          {prog.icon} {prog.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Experience Level */}
          {step === 3 && (
            <div>
              <div className="mb-4">
                <h3 className="fw-black text-dark dark:text-white mb-1">
                  3. Select your current experience level
                </h3>
                <p className="small text-muted mb-0">
                  This adjusts word complexity and initial lesson speed.
                </p>
              </div>

              <div className="d-flex flex-column gap-2">
                {LEVELS.map((lvl) => {
                  const isSelected = formData.level === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => setFormData({ ...formData, level: lvl.id })}
                      className={`w-100 p-3 rounded-4 border text-start btn d-flex align-items-center justify-content-between ${
                        isSelected
                          ? 'btn-indigo text-white fw-bold shadow'
                          : 'btn-light border-slate-200 text-dark'
                      }`}
                    >
                      <div>
                        <div className="fw-bold fs-6">{lvl.title}</div>
                        <div className="small opacity-75">{lvl.desc}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Daily Goal Commitment */}
          {step === 4 && (
            <div>
              <div className="mb-4">
                <h3 className="fw-black text-dark dark:text-white mb-1 d-flex align-items-center gap-2">
                  <Clock className="w-6 h-6 text-indigo" /> 4. Set your daily learning goal
                </h3>
                <p className="small text-muted mb-0">
                  How much time can you spend learning 10 concepts each day?
                </p>
              </div>

              <div className="row g-3">
                {TIME_GOALS.map((tg) => {
                  const isSelected = formData.dailyGoalMins === tg.minutes;
                  return (
                    <div key={tg.minutes} className="col-6">
                      <button
                        onClick={() => setFormData({ ...formData, dailyGoalMins: tg.minutes })}
                        className={`w-100 p-4 rounded-4 border text-center btn ${
                          isSelected
                            ? 'btn-indigo text-white fw-bold shadow'
                            : 'btn-light border-slate-200 text-dark'
                        }`}
                      >
                        <div className="fs-3 fw-black mb-1">
                          {tg.minutes} mins
                        </div>
                        <span className="small fw-bold">
                          {tg.tag}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Learning Objective */}
          {step === 5 && (
            <div>
              <div className="mb-4">
                <h3 className="fw-black text-dark dark:text-white mb-1 d-flex align-items-center gap-2">
                  <Target className="w-6 h-6 text-indigo" /> 5. Primary Learning Goal
                </h3>
                <p className="small text-muted mb-0">
                  Select your primary motivation for learning.
                </p>
              </div>

              <div className="row g-2">
                {GOAL_OPTIONS.map((g) => {
                  const isSelected = formData.goalObjective === g.id;
                  return (
                    <div key={g.id} className="col-6 col-sm-4">
                      <button
                        onClick={() => setFormData({ ...formData, goalObjective: g.id })}
                        className={`w-100 p-3 rounded-4 border text-center btn ${
                          isSelected
                            ? 'btn-indigo text-white fw-bold shadow'
                            : 'btn-light border-slate-200 text-dark'
                        }`}
                      >
                        <div className="fs-4 mb-1">{g.icon}</div>
                        <div className="small fw-bold">{g.label}</div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Custom Recommendation Summary */}
          {step === 6 && (
            <div>
              <div className="mb-4 text-center">
                <div className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center mx-auto mb-3 shadow" style={{ width: '64px', height: '64px', fontSize: '2rem' }}>
                  🎯
                </div>
                <h3 className="fw-black text-dark dark:text-white mb-1">
                  Your Personalized Curriculum Plan is Ready!
                </h3>
                <p className="small text-muted mb-0">
                  Based on your questionnaire responses, we recommend the following tailored track:
                </p>
              </div>

              <div className="card border-0 bg-indigo-subtle-custom rounded-4 p-4 mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Compass className="w-5 h-5 text-indigo" />
                  <h6 className="fw-bold text-indigo mb-0">Custom Recommendations</h6>
                </div>

                <ul className="list-unstyled small space-y-2 mb-0">
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Native Explanation Language: <strong>{selectedNative.flag} {selectedNative.name} ({selectedNative.nativeName})</strong></span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Target Human Language Track: <strong>{selectedHuman.flag} {selectedHuman.name}</strong></span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Target CodeLoop Programming Track: <strong>{selectedCode.icon} {selectedCode.name}</strong></span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Daily Schedule Commitment: <strong>{formData.dailyGoalMins} Minutes / Day</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Bottom Wizard Navigation Buttons */}
          <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="btn btn-light border rounded-3 px-3 py-2 fw-bold text-dark d-flex align-items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={handleNext}
              className="btn btn-indigo rounded-3 px-4 py-2.5 fw-bold shadow-sm d-flex align-items-center gap-2"
            >
              {step === 6 ? 'Launch My Personalized Dashboard 🎉' : 'Next Step →'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
