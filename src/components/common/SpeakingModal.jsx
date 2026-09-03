import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2, RefreshCw, X, Award, Sparkles, AlertCircle } from 'lucide-react';
import { speakText } from '../../utils/speechUtils';

export default function SpeakingModal({ isOpen, onClose, targetSentence = "I am going to college today.", onComplete }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
        evaluateSpeech(spoken);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
          setErrorMsg('No speech detected! Please speak clearly into your microphone.');
        } else if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access denied. Please enable mic permissions in your browser.');
        } else {
          setErrorMsg(`Mic error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [targetSentence]);

  if (!isOpen) return null;

  const handlePlaySample = () => {
    setIsPlayingAudio(true);
    speakText(targetSentence, 'en-US');
    setTimeout(() => setIsPlayingAudio(false), 2000);
  };

  const calculateSimilarity = (spoken, target) => {
    const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
    const cleanTarget = target.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);

    let matchCount = 0;
    cleanTarget.forEach((word) => {
      if (cleanSpoken.includes(word)) matchCount++;
    });

    const accuracy = Math.round((matchCount / cleanTarget.length) * 100);
    return Math.min(100, Math.max(0, accuracy));
  };

  const evaluateSpeech = (spokenText) => {
    if (!spokenText || spokenText.trim() === '') {
      setErrorMsg('No speech detected! Please try speaking out loud.');
      return;
    }

    const accuracyScore = calculateSimilarity(spokenText, targetSentence);

    let feedback = 'Good attempt!';
    if (accuracyScore >= 90) {
      feedback = 'Outstanding pronunciation & word accuracy!';
    } else if (accuracyScore >= 70) {
      feedback = `Good job! You said: "${spokenText}". Keep practising clarity.`;
    } else {
      feedback = `You said: "${spokenText}". Try repeating the sample audio.`;
    }

    setResult({
      score: accuracyScore,
      spokenText,
      feedback,
      passed: accuracyScore >= 60
    });

    if (onComplete && accuracyScore >= 60) {
      onComplete(accuracyScore);
    }
  };

  const startListening = () => {
    setErrorMsg('');
    setResult(null);
    setTranscript('');

    if (recognitionRef.current) {
      try {
        setIsListening(true);
        recognitionRef.current.start();
      } catch (err) {
        setIsListening(false);
        setErrorMsg('Microphone is already active or unavailable.');
      }
    } else {
      // Fallback for browsers without WebSpeech API: simulate realistic prompt
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setErrorMsg('Web Speech API is not supported in this browser. Please use Chrome or Edge for real speech recognition.');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6 text-center relative overflow-hidden">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Real Speech Recognition
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Read Out Loud
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Tap the microphone and speak the sentence into your microphone.
        </p>

        {/* Target Sentence Card */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl mb-4 relative">
          <p className="text-lg font-bold text-indigo-950 dark:text-indigo-200 mb-2">
            "{targetSentence}"
          </p>
          <button
            onClick={handlePlaySample}
            className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
              isPlayingAudio
                ? 'bg-indigo-600 text-white animate-pulse'
                : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {isPlayingAudio ? 'Listening...' : 'Listen Sample'}
          </button>
        </div>

        {/* Error message display */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl mb-4 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Mic Button & Evaluation Display */}
        <div className="flex flex-col items-center justify-center my-2">
          {!result ? (
            <button
              onClick={startListening}
              disabled={isListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                isListening
                  ? 'bg-rose-600 text-white ring-8 ring-rose-500/30 animate-pulse scale-105'
                  : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:scale-105 active:scale-95'
              }`}
            >
              {isListening ? <Mic className="w-9 h-9 animate-bounce" /> : <Mic className="w-9 h-9" />}
            </button>
          ) : (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl w-full text-center animate-in zoom-in-95">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 text-white rounded-full mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {result.score}% Score
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 mb-2">
                {result.feedback}
              </p>
              {result.score >= 60 && (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 py-1.5 px-3 rounded-lg border border-indigo-200/50">
                  <Award className="w-4 h-4" /> +10 Speaking XP Awarded!
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
            {isListening ? "🎙️ Microphone is active... Speak now!" : result ? "" : "Tap button & speak into your microphone"}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {(result || errorMsg) && (
            <button
              onClick={() => {
                setResult(null);
                setErrorMsg('');
              }}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
