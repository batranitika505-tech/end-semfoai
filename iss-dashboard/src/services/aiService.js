const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_ID = 'llama-3.3-70b-versatile';
const VERCEL_PROXY = '/api/proxy?url=';

const fetchWithTimeout = (url, options = {}, timeout = 15000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Signal Timeout')), timeout))
  ]);
};

export const askMissionAI = async (userMessage, context = {}, chatHistory = []) => {
  if (!GROQ_API_KEY) throw new Error('Mission Assistant Link Offline: Groq Key Missing');

  // Robust context construction
  const lat = context.location?.lat?.toFixed(4) || 'N/A';
  const lng = context.location?.lng?.toFixed(4) || 'N/A';
  const speed = context.speed?.toFixed(2) || '27600';
  const altitude = context.location?.altitude?.toFixed(2) || '420';
  const crew = context.astronauts?.map(a => a.name).join(', ') || 'Unknown';
  const news = context.news?.slice(0, 3).map(n => n.title).join(' | ') || 'No news';

  const systemPrompt = `You are a professional Mission Control Assistant for the ISS Dashboard.
    Use this telemetry data: Pos: ${lat}, ${lng} | Spd: ${speed}km/h | Alt: ${altitude}km | Crew: ${crew} | News: ${news}.
    Answer concise and professional mission reports. If data is unavailable, state you are checking telemetry.`;

  const payload = {
    model: MODEL_ID,
    messages: [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-3).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      { role: 'user', content: userMessage }
    ],
    temperature: 0.5,
    max_tokens: 500,
  };

  try {
    // Strategy: Route via our custom Vercel Proxy to bypass Groq's browser CORS blocks
    const proxyUrl = `${VERCEL_PROXY}${encodeURIComponent(GROQ_URL)}`;
    const response = await fetchWithTimeout(proxyUrl, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${GROQ_API_KEY}`, 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || result.error || 'Signal Lost');
    }
    
    return result.choices[0]?.message?.content || "Mission Control signal weak.";

  } catch (error) {
    console.error('Groq Proxy Error:', error);
    throw new Error(`AI Link Error: ${error.message}`);
  }
};
