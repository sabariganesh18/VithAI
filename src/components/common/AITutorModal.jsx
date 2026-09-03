import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, X, RefreshCw, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NATIVE_LANGUAGES } from '../../data/languagesData';
import { askAiTutor } from '../../services/aiService';

export default function AITutorModal({ isOpen, onClose, initialQuery = '' }) {
  const { user } = useAuth();
  const nativeLangObj = NATIVE_LANGUAGES.find(l => l.id === user?.nativeLanguage) || NATIVE_LANGUAGES[0];

  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Vanakkam ${user?.name || 'Learner'}! 👋 I am your VithAI Tutor (powered by Gemini & Groq AI). How can I help you understand English or Programming in ${nativeLangObj.name} today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setInputQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const responseText = await askAiTutor({
        query,
        nativeLanguageName: nativeLangObj.name,
        nativeLanguageCode: nativeLangObj.id,
        userGoal: user?.goalObjective || 'vocabulary'
      });

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('AI Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    `Explain "Improve" in ${nativeLangObj.name}`,
    `Explain Python variables simply`,
    `Give another example sentence`,
    `Why is this sentence wrong?`
  ];

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center p-3"
      style={{ zIndex: 1060, backdropFilter: 'blur(4px)' }}
    >
      <div
        className="card border-0 rounded-5 shadow-lg overflow-hidden w-100 bg-white dark:bg-dark text-dark dark:text-white d-flex flex-column"
        style={{ maxWidth: '650px', height: '620px' }}
      >
        {/* Header */}
        <div className="bg-indigo text-white px-4 py-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-4 d-flex align-items-center justify-content-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h5 className="fw-black mb-0 d-flex align-items-center gap-2">
                VithAI Tutor
                <span className="badge bg-emerald-subtle text-emerald border border-emerald rounded-pill px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
                  <Cpu className="w-3 h-3 me-1" /> Gemini / Groq AI
                </span>
              </h5>
              <p className="small mb-0 text-white-50">
                {nativeLangObj.name} ({nativeLangObj.nativeName}) Mode
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="btn-close btn-close-white shadow-none cursor-pointer"
            aria-label="Close"
          ></button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-2.5 bg-light dark:bg-dark border-bottom d-flex align-items-center gap-2 overflow-x-auto">
          <Sparkles className="w-4 h-4 text-indigo shrink-0 me-1" />
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="btn btn-sm btn-outline-indigo shrink-0 rounded-pill px-3 py-1 fw-bold bg-white text-indigo"
              style={{ fontSize: '0.75rem' }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-grow-1 p-3 p-md-4 overflow-y-auto d-flex flex-column gap-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex gap-2 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              {msg.sender === 'ai' && (
                <div
                  className="rounded-circle bg-indigo text-white d-flex align-items-center justify-content-center shrink-0 fw-bold shadow-sm"
                  style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}
                >
                  AI
                </div>
              )}

              <div
                className={`p-3 rounded-4 small leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo text-white rounded-bottom-end-0'
                    : 'bg-light dark:bg-dark border text-dark dark:text-white rounded-bottom-start-0'
                }`}
                style={{ maxWidth: '82%' }}
              >
                <div className="fw-medium text-break">{msg.text}</div>
                <div
                  className={`text-end mt-1.5 opacity-75`}
                  style={{ fontSize: '0.65rem' }}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="d-flex align-items-center gap-2 text-muted small fst-italic py-2">
              <div className="spinner-border spinner-border-sm text-indigo" role="status"></div>
              <span>Gemini AI is generating answer in {nativeLangObj.name}...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-top bg-white dark:bg-dark d-flex align-items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask AI in ${nativeLangObj.name} or English...`}
            className="form-control rounded-4 py-2 px-3 shadow-none border-secondary-subtle"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isLoading}
            className="btn btn-indigo rounded-4 px-3 py-2 fw-black d-flex align-items-center justify-content-center shadow-sm shrink-0"
          >
            <Send className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
