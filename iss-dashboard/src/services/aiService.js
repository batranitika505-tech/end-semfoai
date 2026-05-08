const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_ID = 'llama-3.3-70b-versatile';

export const askMissionAI = async (userMessage, context = {}, chatHistory = []) => {
  if (!GROQ_API_KEY) {
    throw new Error('Mission Assistant Link Offline: Groq API Key Missing');
  }

  // Robust context string construction
  const lat = context.location?.lat?.toFixed(4) || 'N/A';
  const lng = context.location?.lng?.toFixed(4) || 'N/A';
  const speed = context.speed?.toFixed(2) || '27600';
  const altitude = context.location?.altitude?.toFixed(2) || '420';
  const crew = context.astronauts?.map(a => a.name).join(', ') || 'Unknown';
  const newsHeadlines = context.news?.slice(0, 5).map(n => n.title).join(' | ') || 'No news available';

  const systemPrompt = `You are a professional Mission Control Assistant for the ISS Dashboard.
    Use the following real-time telemetry and intelligence data to answer the user's question accurately.
    Keep responses concise and mission-oriented.

    CURRENT ISS TELEMETRY:
    - Position: Latitude ${lat}, Longitude ${lng}
    - Orbital Velocity: ${speed} km/h
    - Altitude: ${altitude} km
    - Crew Onboard: ${crew}
    
    LATEST ORBITAL INTELLIGENCE:
    ${newsHeadlines}

    If the question is about data not provided above, state that you only have access to current dashboard data.`;

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory.slice(-5).map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          { role: 'user', content: userMessage }
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Satellite Link Interrupted');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Mission Control signal weak. Please retry.";
  } catch (error) {
    console.error('Groq AI Error:', error);
    throw new Error(error.message || 'Failed to reach Mission Control AI via Groq');
  }
};
