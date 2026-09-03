// Utility for Web Speech API with Male & Female Voice Toggle

export const getVoiceGender = () => {
  return localStorage.getItem('vithai_voice_gender') || 'female';
};

export const setVoiceGender = (gender) => {
  localStorage.setItem('vithai_voice_gender', gender);
};

export const speakText = (text, lang = 'en-US', genderOverride = null) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const targetGender = genderOverride || getVoiceGender();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // Natural pace

  const voices = window.speechSynthesis.getVoices();

  if (voices.length > 0) {
    let matchedVoice = null;

    if (targetGender === 'male') {
      utterance.pitch = 0.85; // Deep voice pitch
      matchedVoice = voices.find(v => 
        (v.lang.includes(lang.split('-')[0]) || v.lang.includes('en')) &&
        (
          v.name.toLowerCase().includes('david') ||
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('alex') ||
          v.name.toLowerCase().includes('daniel') ||
          v.name.toLowerCase().includes('mark') ||
          v.name.toLowerCase().includes('george') ||
          v.name.toLowerCase().includes('rishi') ||
          v.name.toLowerCase().includes('james') ||
          v.name.toLowerCase().includes('guy') ||
          v.name.toLowerCase().includes('ravi')
        )
      );
    } else {
      utterance.pitch = 1.1; // Female voice pitch
      matchedVoice = voices.find(v => 
        (v.lang.includes(lang.split('-')[0]) || v.lang.includes('en')) &&
        (
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('hazel') ||
          v.name.toLowerCase().includes('heera') ||
          v.name.toLowerCase().includes('eva') ||
          v.name.toLowerCase().includes('google us english')
        )
      );
    }

    // Fallback: Pick any matching lang voice or default
    if (!matchedVoice) {
      matchedVoice = voices.find(v => v.lang.includes(lang.split('-')[0])) || voices[0];
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
};
