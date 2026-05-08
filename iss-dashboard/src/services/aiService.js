const HF_TOKEN = import.meta.env.VITE_HF_TOKEN || import.meta.env.VITE_AI_TOKEN;
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2';

export const askMissionAI = async (userMessage, context = {}, chatHistory = []) => {
  if (!HF_TOKEN) {
    throw new Error('Mission Assistant Link Offline: HF Token Missing');
  }

  // Robust context construction
  const lat = context.location?.lat?.toFixed(4) || 'N/A';
  const lng = context.location?.lng?.toFixed(4) || 'N/A';
  const speed = context.speed?.toFixed(2) || '27600';
  const crew = context.astronauts?.map(a => a.name).join(', ') || 'Unknown';
  const news = context.news?.slice(0, 3).map(n => n.title).join(' | ') || 'No news';

  const prompt = `<s>[INST] You are a professional Mission Control Assistant. Use the following dashboard data to answer the user question concisely.
  
  DATA: Pos: ${lat}, ${lng} | Spd: ${speed}km/h | Crew: ${crew} | News: ${news}
  
  USER QUESTION: ${userMessage} [/INST]`;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 250, temperature: 0.7, return_full_text: false }
      }),
    });

    if (response.status === 503) {
      throw new Error('Mission AI is warming up (Model Loading). Please try again in 10-15 seconds.');
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Satellite Link Failure');
    }

    const result = await response.json();
    let reply = Array.isArray(result) ? result[0].generated_text : result.generated_text;
    
    // Cleanup prompt remnants
    if (reply.includes('[/INST]')) {
      reply = reply.split('[/INST]').pop().trim();
    }
    
    return reply || "Mission Control signal weak. Please re-transmit.";
  } catch (error) {
    console.error('AI Error:', error);
    throw new Error(error.message || 'Failed to reach Mission Control AI');
  }
};
