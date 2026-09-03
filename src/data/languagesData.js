export const NATIVE_LANGUAGES = [
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { id: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { id: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { id: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { id: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { id: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { id: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' }
];

export const TARGET_HUMAN_LANGUAGES = [
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', levelCount: 4, category: 'Global' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', levelCount: 4, category: 'Indian' },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', levelCount: 4, category: 'Indian' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', levelCount: 4, category: 'Indian' },
  { id: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', levelCount: 4, category: 'Indian' },
  { id: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', levelCount: 4, category: 'Indian' },
  { id: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', levelCount: 4, category: 'International' },
  { id: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', levelCount: 4, category: 'International' },
  { id: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', levelCount: 4, category: 'International' },
  { id: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', levelCount: 4, category: 'International' },
  { id: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', levelCount: 4, category: 'International' }
];

export const PROGRAMMING_LANGUAGES = [
  { id: 'python', name: 'Python', icon: '🐍', color: 'from-blue-500 to-yellow-500', bgLight: 'bg-yellow-500/10', popular: true, tagline: 'Easiest language for beginners & AI' },
  { id: 'c', name: 'C', icon: '⚡', color: 'from-blue-600 to-cyan-500', bgLight: 'bg-blue-500/10', popular: false, tagline: 'Mother of all programming languages' },
  { id: 'cpp', name: 'C++', icon: '🚀', color: 'from-blue-700 to-indigo-600', bgLight: 'bg-indigo-500/10', popular: true, tagline: 'High performance & competitive coding' },
  { id: 'java', name: 'Java', icon: '☕', color: 'from-red-500 to-orange-500', bgLight: 'bg-orange-500/10', popular: true, tagline: 'Enterprise applications & Android foundation' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨', color: 'from-yellow-400 to-amber-500', bgLight: 'bg-yellow-400/10', popular: true, tagline: 'The language of web development' },
  { id: 'sql', name: 'SQL', icon: '🗄️', color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-500/10', popular: true, tagline: 'Database management & data queries' },
  { id: 'html', name: 'HTML', icon: '🌐', color: 'from-orange-500 to-red-500', bgLight: 'bg-orange-500/10', popular: false, tagline: 'Structure of every website' },
  { id: 'css', name: 'CSS', icon: '🎨', color: 'from-blue-400 to-sky-600', bgLight: 'bg-sky-500/10', popular: false, tagline: 'Styling, animations & UI design' }
];

export const GOAL_OPTIONS = [
  { id: 'speaking', label: 'Speaking & Fluency', icon: '🗣️' },
  { id: 'vocabulary', label: 'Vocabulary Building', icon: '📚' },
  { id: 'grammar', label: 'Grammar Mastery', icon: '✍️' },
  { id: 'reading', label: 'Reading Comprehension', icon: '📖' },
  { id: 'coding', label: 'Programming & Logic', icon: '💻' },
  { id: 'interview', label: 'Interview Preparation', icon: '🎯' },
  { id: 'general', label: 'General Daily Learning', icon: '🌟' }
];

export const TIME_GOALS = [
  { minutes: 10, label: '10 mins / day', tag: 'Casual' },
  { minutes: 20, label: '20 mins / day', tag: 'Recommended' },
  { minutes: 30, label: '30 mins / day', tag: 'Serious' },
  { minutes: 45, label: '45 mins / day', tag: 'Intense' }
];

export const LEVELS = [
  { id: 'beginner', title: 'Beginner', desc: 'Starting from scratch' },
  { id: 'elementary', title: 'Elementary', desc: 'Know basic words & simple phrases' },
  { id: 'intermediate', title: 'Intermediate', desc: 'Can communicate with minor errors' },
  { id: 'advanced', title: 'Advanced', desc: 'Looking for fluency & speed' }
];
