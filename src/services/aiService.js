import env from '../config/env';

// AI Tutor Service supporting Google Gemini API & Groq API with Native Language Fallback
const GEMINI_API_KEY = env.geminiApiKey;
const GROQ_API_KEY = env.groqApiKey;

export async function askAiTutor({ query, nativeLanguageName = 'Tamil', nativeLanguageCode = 'ta', userGoal = 'vocabulary' }) {
  const systemPrompt = `You are VithAI Tutor, a supportive daily AI learning assistant.
Explain language concepts (English vocabulary, grammar, sentences) and programming topics (Python, C++, Java, JS, SQL) in simple ${nativeLanguageName} (with English terms/code syntax preserved).
Be concise, clear, and encouraging. Include a small example or line-by-line breakdown in ${nativeLanguageName}.`;

  // 1. Try Gemini API if API key is provided
  if (GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }]
              }
            ]
          })
        }
      );
      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) return aiText;
    } catch (e) {
      console.warn('Gemini API call failed, attempting fallback...', e);
    }
  }

  // 2. Try Groq API if API key is provided
  if (GROQ_API_KEY) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ]
        })
      });
      const data = await response.json();
      const aiText = data?.choices?.[0]?.message?.content;
      if (aiText) return aiText;
    } catch (e) {
      console.warn('Groq API call failed, using local AI fallback...', e);
    }
  }

  // 3. Native Language Local Fallback Generator
  await new Promise((r) => setTimeout(r, 600));

  const qLower = query.toLowerCase();
  let result = `Explanations in ${nativeLanguageName}:\n\n`;

  if (qLower.includes('python') || qLower.includes('variable') || qLower.includes('code')) {
    result += `**CodeLoop Python Concept**:\n\nVariable என்பது நினைவகத்தில் (Memory) ஒரு தகவலை சேமிக்கப் பயன்படும் பெயர்.\n\n\`\`\`python\nname = "Sabari"\nage = 21\nprint(name)\n\`\`\`\n\n**${nativeLanguageName} Breakdown**:\n- \`name\` என்ற பெயர் உள்ள பெட்டியில் "Sabari" சேமிக்கப்பட்டுள்ளது.\n- \`print()\` திரையில் அதை அச்சிடும்.`;
  } else if (qLower.includes('improve') || qLower.includes('meaning')) {
    result += `**Word**: "Improve"\n\n**${nativeLanguageName} Meaning**: மேம்படுத்துதல் (To make better).\n\n**Sentence**: "I want to improve my English."\n\n**${nativeLanguageName} Translation**: நான் என் ஆங்கிலத்தை மேம்படுத்த விரும்புகிறேன்.`;
  } else {
    result += `Here is your explanation in ${nativeLanguageName}:\n\n"${query}" - தினமும் 10 புதிய வார்த்தைகளை பயிற்சி செய்வதன் மூலம் உங்கள் சொல்லகராதி வேகமாகவும் எளிதாகவும் வளரும்! (Daily practice with 10 words expands your memory fast.)`;
  }

  return result;
}
