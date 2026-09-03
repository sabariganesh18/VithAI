import React, { useState } from 'react';
import { Volume2, Heart, CheckCircle, Sparkles } from 'lucide-react';
import { WORD_TRANSLATIONS, getNativeTranslation } from '../../data/vocabularyData';
import { getVoiceGender, setVoiceGender, speakText } from '../../utils/speechUtils';

export default function WordCard({ wordObj, nativeLanguage = 'ta', isLearned, isFavorite, onMarkLearned, onToggleFavorite, onPractice }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceGender, setVoiceGenderState] = useState(getVoiceGender());

  const nativeData = getNativeTranslation(wordObj.word, nativeLanguage);

  const sentenceTranslation = typeof wordObj.sentenceTranslation === 'object' 
    ? (wordObj.sentenceTranslation?.[nativeLanguage] || wordObj.sentenceTranslation?.ta) 
    : wordObj.sentenceTranslation;

  const handleAudioPlay = (genderToUse = null) => {
    setIsPlayingAudio(true);
    speakText(wordObj.word, 'en-US', genderToUse || voiceGender);
    setTimeout(() => setIsPlayingAudio(false), 1200);
  };

  const toggleGender = () => {
    const nextGender = voiceGender === 'female' ? 'male' : 'female';
    setVoiceGenderState(nextGender);
    setVoiceGender(nextGender);
    handleAudioPlay(nextGender);
  };

  return (
    <div className={`card border-0 rounded-5 p-4 shadow-sm mb-4 position-relative overflow-hidden ${
      isLearned ? 'bg-success-subtle border-success' : 'bg-white dark:bg-dark'
    }`}>
      {/* Top Header Actions */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-3 py-1 fw-bold">
          {wordObj.partOfSpeech || 'word'}
        </span>

        <div className="d-flex align-items-center gap-2">
          {/* Quick Voice Gender Selector Pill */}
          <button
            onClick={toggleGender}
            className="btn btn-sm btn-light border rounded-pill px-2 py-1 fw-bold text-dark d-inline-flex align-items-center gap-1 hover:bg-indigo hover:text-white transition-all"
            title="Switch Male/Female Voice"
          >
            <span>{voiceGender === 'female' ? '👩 Female' : '👨 Male'}</span>
          </button>

          <button
            onClick={onToggleFavorite}
            className={`btn btn-sm rounded-circle p-2 border-0 ${
              isFavorite ? 'btn-danger text-white' : 'btn-light text-muted'
            }`}
            title="Bookmark Word"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
          
          <button
            onClick={() => handleAudioPlay()}
            className={`btn btn-sm rounded-circle p-2 ${
              isPlayingAudio ? 'btn-indigo animate-pulse' : 'btn-indigo-subtle text-indigo border border-indigo'
            }`}
            title="Pronounce word"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Target Word & Native Meaning */}
      <div className="mb-3">
        <div className="d-flex align-items-baseline gap-2 mb-1">
          <h2 className="fw-black text-dark dark:text-white mb-0">
            {wordObj.word}
          </h2>
          <span className="small text-muted fst-italic">
            /{wordObj.pronunciation}/
          </span>
        </div>

        <h4 className="fw-bold text-indigo mt-1 mb-1">
          {nativeData.meaning}
        </h4>
        <p className="small text-muted mb-0 leading-relaxed">
          {nativeData.explanation}
        </p>
      </div>

      {/* Sentence Breakdown */}
      <div className="p-3 bg-light rounded-4 border mb-4 space-y-1">
        <div className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Example Sentence</div>
        <p className="fw-bold text-dark dark:text-white mb-1">
          "{wordObj.sentence}"
        </p>
        {sentenceTranslation && sentenceTranslation !== wordObj.sentence && (
          <p className="small fw-medium text-indigo mb-0">
            👉 {sentenceTranslation}
          </p>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="d-flex align-items-center gap-2">
        <button
          onClick={onPractice}
          className="btn btn-indigo flex-grow-1 py-2.5 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Practice Word
        </button>

        <button
          onClick={onMarkLearned}
          className={`btn py-2.5 px-4 rounded-3 fw-bold d-flex align-items-center gap-1.5 ${
            isLearned ? 'btn-success text-white' : 'btn-light border text-dark'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          {isLearned ? 'Learned' : 'Mark Learned'}
        </button>
      </div>
    </div>
  );
}
