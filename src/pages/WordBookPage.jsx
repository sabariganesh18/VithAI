import React, { useState } from 'react';
import { Search, Heart, Volume2, BookmarkCheck, Sparkles, Globe, Turtle, Zap, Languages } from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { WEEKLY_LESSONS, WORD_TRANSLATIONS, getWeeklyLessonsForTargetLanguage } from '../data/vocabularyData';
import { NATIVE_LANGUAGES, TARGET_HUMAN_LANGUAGES } from '../data/languagesData';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { getVoiceGender, setVoiceGender, speakText } from '../utils/speechUtils';

export default function WordBookPage() {
  const { user } = useAuth();
  const { progress, toggleFavorite, markWordMastered } = useLearning();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  // Custom Instant Pronunciation & Translation Studio State
  const [inputWord, setInputWord] = useState('');
  const [targetLang, setTargetLang] = useState(user?.nativeLanguage || 'ta');
  const [activeTranslationCard, setActiveTranslationCard] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const targetLangObj = TARGET_HUMAN_LANGUAGES.find(l => l.id === user?.learningLanguage) || TARGET_HUMAN_LANGUAGES[0];
  const weeklyLessons = getWeeklyLessonsForTargetLanguage(user?.learningLanguage || 'en');
  const allWords = weeklyLessons[0].days.flatMap(d => d.words);

  // Extended Dictionary Database
  const EXTENDED_DICT = {
    ...WORD_TRANSLATIONS
  };

  const filteredWords = allWords.filter(w => {
    const nativeMeaning = EXTENDED_DICT[w.word]?.[user?.nativeLanguage || 'ta']?.meaning || w.meaningDefault;
    const matchesSearch = w.word.toLowerCase().includes(searchTerm.toLowerCase()) || nativeMeaning.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'everyday') return w.category === 'everyday';
    if (filterTab === 'advanced') return w.category === 'advanced';
    if (filterTab === 'business') return w.category === 'business';
    if (filterTab === 'coding') return w.category === 'coding';
    if (filterTab === 'idioms') return w.category === 'idioms';
    if (filterTab === 'learned') return progress.learnedWordIds.includes(w.id);
    if (filterTab === 'mastered') return progress.masteredWordIds.includes(w.id);
    if (filterTab === 'favorites') return progress.favoriteWordIds.includes(w.id);
    return true;
  });

  const handleSpeakAudio = (text, speed = 0.9) => {
    if (!text || !text.trim()) return;
    setIsSpeaking(true);
    speakText(text, 'en-US');
    setTimeout(() => setIsSpeaking(false), 1200);
  };

  const handleTranslateSubmit = async (e) => {
    e.preventDefault();
    if (!inputWord.trim()) return;

    const cleanInput = inputWord.trim();
    const targetLangObj = NATIVE_LANGUAGES.find(l => l.id === targetLang) || NATIVE_LANGUAGES[0];

    // Check local dictionary database first
    const foundWord = allWords.find(w => w.word.toLowerCase() === cleanInput.toLowerCase());
    const dictData = EXTENDED_DICT[cleanInput] || EXTENDED_DICT[cleanInput.toLowerCase()] || EXTENDED_DICT[cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1)];

    let meaningStr = dictData?.[targetLang]?.meaning || (foundWord && WORD_TRANSLATIONS[foundWord.word]?.[targetLang]?.meaning);
    let explanationStr = dictData?.[targetLang]?.explanation || (foundWord && WORD_TRANSLATIONS[foundWord.word]?.[targetLang]?.explanation);

    if (!meaningStr) {
      meaningStr = cleanInput;
    }

    if (!explanationStr) {
      explanationStr = foundWord ? foundWord.meaningDefault : `Direct definition and meaning of "${cleanInput}".`;
    }

    setActiveTranslationCard({
      originalText: cleanInput,
      targetLanguage: targetLangObj,
      meaning: meaningStr,
      explanation: explanationStr,
      partOfSpeech: foundWord?.partOfSpeech || 'vocabulary',
      pronunciation: foundWord?.pronunciation || cleanInput.toLowerCase()
    });

    handleSpeakAudio(cleanInput, 0.9);
    setIsTranslating(true);

    // Fetch real-time exact native translation via Google Translate API (100% accurate engine)
    try {
      const apiLang = targetLang || 'ta';
      const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${apiLang}&dt=t&q=${encodeURIComponent(cleanInput)}`;
      const googleResponse = await fetch(googleUrl);
      const googleData = await googleResponse.json();

      if (googleData && googleData[0] && Array.isArray(googleData[0])) {
        const liveText = googleData[0].map(item => item[0]).filter(Boolean).join('');
        if (liveText && liveText.trim() && liveText.toLowerCase() !== cleanInput.toLowerCase()) {
          setActiveTranslationCard(prev => prev ? {
            ...prev,
            meaning: liveText,
            explanation: `Google Direct Translation: "${liveText}"`
          } : prev);
        }
      }
    } catch (err) {
      // Fallback to MyMemory API if Google is unreachable
      try {
        const apiLang = targetLang || 'ta';
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanInput)}&langpair=autodetect|${apiLang}`);
        const data = await response.json();

        if (data && data.responseData && data.responseData.translatedText) {
          const liveText = data.responseData.translatedText;
          if (liveText && liveText.toLowerCase() !== cleanInput.toLowerCase()) {
            setActiveTranslationCard(prev => prev ? {
              ...prev,
              meaning: liveText,
              explanation: `Direct Translation: "${liveText}"`
            } : prev);
          }
        }
      } catch (fallbackErr) {
        console.log('Online translation API fetch fallback', fallbackErr);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container py-4 flex-grow-1">
        
        {/* Header Title */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2.5 mb-4">
          <div>
            <h2 className="fw-black text-dark dark:text-white mb-1 d-flex align-items-center gap-2 fs-3 fs-md-2">
              <BookmarkCheck className="w-6 h-6 text-indigo shrink-0" /> Word Book ({targetLangObj.flag} {targetLangObj.name})
            </h2>
            <p className="small text-muted mb-0">
              Active learning course: <strong className="text-indigo">{targetLangObj.name} ({targetLangObj.nativeName})</strong>
            </p>
          </div>

          <div className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5 shrink-0" style={{ fontSize: '0.72rem' }}>
            <Sparkles className="w-3.5 h-3.5 text-indigo" /> {allWords.length} Total Vocabularies
          </div>
        </div>

        {/* INSTANT ANY-WORD PRONUNCIATION & MULTI-LANGUAGE TRANSLATOR CARD */}
        <div className="rounded-5 p-4 p-md-5 mb-4 text-white shadow-xl bg-indigo position-relative">
          <div className="max-w-3xl mx-auto">
            {/* Main Headline */}
            <h3 className="fw-black mb-2 fs-4 fs-md-3">
              Type ANY Word to Hear Audio & See Meaning 🔊
            </h3>
            <p className="small mb-4 opacity-85 leading-relaxed" style={{ fontSize: '0.85rem' }}>
              Enter any word (e.g. Resilience, Eloquent, Pragmatic, Algorithm) to hear real voice pronunciation and view instant direct translation!
            </p>

            {/* Search & Translate Form */}
            <form onSubmit={handleTranslateSubmit} className="mb-2">
              <div className="bg-white p-2 rounded-4 shadow-lg d-flex flex-column flex-sm-row gap-2">
                <div className="d-flex align-items-center gap-2 px-3 flex-grow-1 py-1">
                  <Volume2 className="w-5 h-5 text-indigo shrink-0" />
                  <input
                    type="text"
                    value={inputWord}
                    onChange={(e) => setInputWord(e.target.value)}
                    placeholder="Type any word (e.g. Resilience, Meticulous)..."
                    className="form-control border-0 text-dark font-bold fs-6 p-0 shadow-none bg-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputWord.trim()}
                  className={`btn btn-warning fw-black px-4 py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 text-nowrap shadow-sm ${isSpeaking || isTranslating ? 'animate-pulse' : ''}`}
                >
                  <Sparkles className="w-4 h-4 fill-dark" /> {isTranslating ? 'Translating...' : 'Speak & Translate'}
                </button>
              </div>
            </form>

            {/* Quick Speed Buttons */}
            {inputWord.trim() && (
              <div className="d-flex align-items-center gap-2 mb-3">
                <button
                  onClick={() => handleSpeakAudio(inputWord, 0.9)}
                  className="btn btn-sm btn-light text-indigo rounded-3 fw-bold d-flex align-items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo" /> Normal Speed (1.0x)
                </button>
                <button
                  onClick={() => handleSpeakAudio(inputWord, 0.6)}
                  className="btn btn-sm btn-outline-light text-white rounded-3 fw-bold d-flex align-items-center gap-1"
                >
                  <Turtle className="w-3.5 h-3.5 text-warning" /> Slow Speed (0.6x)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TRANSLATED RESULT SLIDE / CARD */}
        {activeTranslationCard && (
          <div className="card border-0 rounded-5 p-4 p-md-5 mb-4 shadow-lg bg-white dark:bg-dark border-start border-5 border-warning animate-in zoom-in-95">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-warning text-dark fw-bold rounded-pill px-3 py-1.5">
                  Direct Translation & Meaning
                </span>
                <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-2.5 py-1 fw-bold">
                  {activeTranslationCard.targetLanguage.flag} {activeTranslationCard.targetLanguage.name} ({activeTranslationCard.targetLanguage.nativeName})
                </span>
              </div>
              <span className="badge bg-light text-muted border rounded-3 px-2 py-1 small">
                {activeTranslationCard.partOfSpeech}
              </span>
            </div>

            <div className="row g-4 align-items-center">
              {/* Left Column: Original Word & Speech Buttons */}
              <div className="col-12 col-md-5 border-end-md">
                <div className="d-flex align-items-baseline gap-2 mb-1">
                  <h2 className="fw-black text-dark dark:text-white fs-1 mb-0">
                    {activeTranslationCard.originalText}
                  </h2>
                  <span className="small text-muted fst-italic">
                    /{activeTranslationCard.pronunciation}/
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2 mt-3">
                  <button
                    onClick={() => handleSpeakAudio(activeTranslationCard.originalText, 0.9)}
                    className="btn btn-indigo rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
                  >
                    <Volume2 className="w-4 h-4 fill-white" /> Listen Audio (1.0x)
                  </button>
                  <button
                    onClick={() => handleSpeakAudio(activeTranslationCard.originalText, 0.6)}
                    className="btn btn-outline-warning text-dark rounded-3 px-3 py-2 fw-bold d-flex align-items-center gap-1.5"
                  >
                    <Turtle className="w-4 h-4 text-warning" /> Slow (0.6x)
                  </button>
                </div>
              </div>

              {/* Right Column: Direct Native Meaning & Definition ONLY */}
              <div className="col-12 col-md-7">
                <h3 className="fw-black text-indigo mb-2 d-flex align-items-center gap-2">
                  <span>👉 {activeTranslationCard.meaning}</span>
                </h3>
                <p className="small text-muted mb-0 leading-relaxed fw-bold">
                  💡 {activeTranslationCard.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar & Status Filters */}
        <div className="row g-3 mb-4 align-items-center">
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white dark:bg-dark border-end-0">
                <Search className="w-4 h-4 text-muted" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search saved words or native meanings..."
                className="form-control border-start-0 ps-0"
              />
            </div>
          </div>

          <div className="col-12 col-md-8">
            <div className="d-flex align-items-center gap-2 overflow-x-auto pb-2 pb-md-0">
              {[
                { id: 'all', label: 'All Words (250)' },
                { id: 'everyday', label: '🌟 Everyday (50)' },
                { id: 'advanced', label: '⚡ Advanced (50)' },
                { id: 'business', label: '💼 Business (50)' },
                { id: 'coding', label: '💻 Tech & Code (50)' },
                { id: 'idioms', label: '💬 Idioms (50)' },
                { id: 'favorites', label: 'Favorites ❤️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id)}
                  className={`btn btn-sm shrink-0 rounded-3 px-3 py-1.5 fw-bold border ${
                    filterTab === tab.id ? 'btn-indigo text-white shadow-sm' : 'btn-light border-slate-200 text-dark'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Word Book Grid */}
        <div className="row g-4 mb-4">
          {filteredWords.map((word) => {
            const nativeData = EXTENDED_DICT[word.word]?.[user?.nativeLanguage || 'ta'] || {
              meaning: word.meaningDefault,
              explanation: 'Essential vocabulary building concept.'
            };
            const isFav = progress.favoriteWordIds.includes(word.id);
            const isMast = progress.masteredWordIds.includes(word.id);

            return (
              <div key={word.id} className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 rounded-5 p-4 shadow-sm h-100 d-flex flex-column justify-content-between">
                  <div>
                    {/* Top Row 1: Category Badge on Left + Favorite Heart Button on Right */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="badge bg-indigo-subtle-custom text-indigo border rounded-pill px-2.5 py-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>
                        {word.category || 'everyday'}
                      </span>
                      <button
                        onClick={() => toggleFavorite(word.id)}
                        className="btn btn-sm btn-light border-0 p-1.5 text-muted rounded-circle shrink-0"
                        title="Bookmark Word"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'text-danger fill-danger' : ''}`} />
                      </button>
                    </div>

                    {/* Row 2: Word Title & Native Translation */}
                    <h3 className="fw-black text-dark dark:text-white mb-1 text-break">
                      {word.word}
                    </h3>
                    <h5 className="fw-bold text-indigo mb-2">
                      {nativeData.meaning}
                    </h5>

                    {/* Row 3: Phonetics & Dual Audio Control Toolbar */}
                    <div className="d-flex align-items-center justify-content-between gap-2 p-2 bg-light rounded-4 mb-3">
                      <span className="small text-muted fst-italic ps-1">
                        /{word.pronunciation}/
                      </span>
                      <div className="d-flex align-items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleSpeakAudio(word.word, 0.9)}
                          className="btn btn-sm btn-indigo rounded-pill px-2.5 py-1 text-white border-0 fw-bold d-flex align-items-center gap-1"
                          title="Pronounce word (1.0x)"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <Volume2 className="w-3.5 h-3.5" /> 1.0x
                        </button>
                        <button
                          onClick={() => handleSpeakAudio(word.word, 0.6)}
                          className="btn btn-sm btn-warning text-dark rounded-pill px-2.5 py-1 border-0 fw-bold d-flex align-items-center gap-1"
                          title="Pronounce slowly (0.6x)"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <Turtle className="w-3.5 h-3.5" /> 0.6x
                        </button>
                      </div>
                    </div>

                    {/* Example Sentence Box */}
                    <div className="p-3 bg-light rounded-4 text-dark dark:text-white small fw-medium mb-3 d-flex align-items-start justify-content-between gap-2">
                      <div>"{word.sentence}"</div>
                      <button
                        onClick={() => handleSpeakAudio(word.sentence, 0.9)}
                        className="btn btn-sm btn-link text-indigo p-0 border-0 shrink-0"
                        title="Pronounce full sentence"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Bottom Footer */}
                  <div className="pt-3 border-top d-flex align-items-center justify-content-between">
                    <span className="small text-muted fw-bold text-capitalize">
                      Category: {word.category || 'everyday'}
                    </span>

                    <button
                      onClick={() => markWordMastered(word.id)}
                      className={`btn btn-sm rounded-3 fw-bold ${
                        isMast ? 'btn-warning text-dark' : 'btn-light border text-muted'
                      }`}
                    >
                      {isMast ? '⭐ Mastered' : 'Mark Mastered'}
                    </button>
                  </div>
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
