const HF_TOKEN = import.meta.env.VITE_HF_TOKEN || import.meta.env.VITE_AI_TOKEN;
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2';
const VERCEL_PROXY = '/api/proxy?url=';

const fetchWithTimeout = (url, options = {}, timeout = 15000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Signal Timeout')), timeout))
  ]);
};

export const askMissionAI = async (userMessage, context = {}, chatHistory = []) => {
  if (!HF_TOKEN) throw new Error('Mission Assistant Link Offline: Token Missing');

  const lat = context.location?.lat?.toFixed(4) || 'N/A';
  const lng = context.location?.lng?.toFixed(4) || 'N/A';
  const speed = context.speed?.toFixed(2) || '27600';
  const crew = context.astronauts?.map(a => a.name).join(', ') || 'Unknown';
  
  const prompt = `<s>[INST] You are a professional Mission Control Assistant. Data: Pos: ${lat}, ${lng} | Spd: ${speed}km/h | Crew: ${crew}. User: ${userMessage} [/INST]`;
  const payload = { inputs: prompt, parameters: { max_new_tokens: 250, temperature: 0.7, return_full_text: false } };
  const hfUrl = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

  try {
    // Strategy 1: Direct Fetch
    try {
      const response = await fetchWithTimeout(hfUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) return parseResponse(await response.json());
      if (response.status === 503) throw new Error('Warming up...');
    } catch (e) {
      console.warn('Direct AI fetch failed, trying Vercel Proxy...');
    }

    // Strategy 2: Vercel Serverless Proxy
    const proxyUrl = `${VERCEL_PROXY}${encodeURIComponent(hfUrl)}`;
    const response = await fetchWithTimeout(proxyUrl, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${HF_TOKEN}`, 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || result.details || 'Signal Lost');
    }
    
    return parseResponse(result);

  } catch (error) {
    if (error.message.includes('Warming up')) throw new Error('Mission AI is warming up (15s). Please retry.');
    throw new Error(`AI Link Error: ${error.message}`);
  }
};

const parseResponse = (result) => {
  let reply = Array.isArray(result) ? result[0].generated_text : result.generated_text;
  if (reply.includes('[/INST]')) reply = reply.split('[/INST]').pop().trim();
  return reply || "Mission Control signal weak.";
};
