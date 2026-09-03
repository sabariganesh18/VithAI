import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function PracticeQuestion({ questionObj, onAnswerSubmitted }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = (option) => {
    if (isSubmitted) return;
    const chosen = option || selectedOption;
    if (!chosen) return;

    setSelectedOption(chosen);
    const correct = chosen === questionObj.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (onAnswerSubmitted) {
      onAnswerSubmitted(correct);
    }
  };

  return (
    <div className="card border-0 rounded-5 p-4 shadow-sm mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-3 py-1 fw-bold">
          {questionObj.type || 'Practice Question'}
        </span>
        <span className="small text-muted fw-bold">
          +5 XP Practice
        </span>
      </div>

      <h4 className="fw-bold text-dark dark:text-white mb-4">
        {questionObj.question}
      </h4>

      {/* Options List */}
      <div className="d-flex flex-column gap-2 mb-4">
        {questionObj.options.map((option, idx) => {
          let btnClass = 'btn-light border-slate-200 text-dark';

          if (isSubmitted) {
            if (option === questionObj.correctAnswer) {
              btnClass = 'btn-success text-white font-bold';
            } else if (option === selectedOption) {
              btnClass = 'btn-danger text-white font-bold';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSubmit(option)}
              disabled={isSubmitted}
              className={`w-100 text-start p-3 rounded-4 border btn text-sm font-medium d-flex align-items-center justify-content-between ${btnClass}`}
            >
              <span>{option}</span>
              {isSubmitted && option === questionObj.correctAnswer && (
                <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              )}
              {isSubmitted && option === selectedOption && option !== questionObj.correctAnswer && (
                <XCircle className="w-5 h-5 text-white shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {isSubmitted && (
        <div className={`p-3 rounded-4 border mb-2 ${
          isCorrect ? 'bg-success-subtle border-success text-success' : 'bg-danger-subtle border-danger text-danger'
        }`}>
          <div className="d-flex align-items-center gap-2 fw-bold mb-1">
            {isCorrect ? <CheckCircle2 className="w-5 h-5 text-success" /> : <XCircle className="w-5 h-5 text-danger" />}
            <span>{isCorrect ? 'Correct! +5 XP' : 'Incorrect choice'}</span>
          </div>
          <p className="small mb-0 leading-relaxed">
            {questionObj.explanation || (isCorrect ? 'Great job! Keep up the daily practice.' : `The correct answer is "${questionObj.correctAnswer}".`)}
          </p>
        </div>
      )}
    </div>
  );
}
