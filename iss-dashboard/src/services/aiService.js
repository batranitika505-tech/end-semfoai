const HF_TOKEN = import.meta.env.VITE_HF_TOKEN || import.meta.env.VITE_AI_TOKEN;
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2';
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

const fetchWithTimeout = (url, options = {}, timeout = 12000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Signal Timeout')), timeout))
  ]);
};

export const askMissionAI = async (userMessage, context = {}, chatHistory = []) => {
  if (!HF_TOKEN) {
    throw new Error('Mission Assistant Link Offline: Token Missing');
  }

  const lat = context.location?.lat?.toFixed(4) || 'N/A';
  const lng = context.location?.lng?.toFixed(4) || 'N/A';
  const speed = context.speed?.toFixed(2) || '27600';
  const crew = context.astronauts?.map(a => a.name).join(', ') || 'Unknown';
  const news = context.news?.slice(0, 3).map(n => n.title).join(' | ') || 'No news';

  const prompt = `<s>[INST] You are a Mission Control Assistant. Use this data: 
    Pos: ${lat}, ${lng} | Spd: ${speed}km/h | Crew: ${crew} | News: ${news}
    Question: ${userMessage} [/INST]`;

  const payload = {
    inputs: prompt,
    parameters: { max_new_tokens: 250, temperature: 0.7, return_full_text: false }
  };

  const url = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

  try {
    // Strategy 1: Direct Fetch
    try {
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 503) throw new Error('Warming up...');
      if (response.ok) {
        const result = await response.json();
        return parseResponse(result);
      }
    } catch (e) {
      console.warn('Direct AI fetch failed, trying proxy...', e);
    }

    // Strategy 2: Proxy Fallback
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
    const response = await fetchWithTimeout(proxyUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Signal Lost');
    
    const wrapper = await response.json();
    const result = JSON.parse(wrapper.contents);
    return parseResponse(result);

  } catch (error) {
    if (error.message.includes('Warming up')) {
      throw new Error('Mission AI is warming up. Please retry in 10s.');
    }
    throw new Error('Failed to reach Mission Control AI. Signal weak.');
  }
};

const parseResponse = (result) => {
  let reply = Array.isArray(result) ? result[0].generated_text : result.generated_text;
  if (reply.includes('[/INST]')) reply = reply.split('[/INST]').pop().trim();
  return reply || "Signal weak. Re-transmitting...";
};
