import axios from 'axios';

const ISS_BASE_URL = 'https://api.open-notify.org';
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const HF_TOKEN = import.meta.env.VITE_AI_TOKEN;

export const fetchISSLocation = async () => {
  const response = await axios.get(`${ISS_BASE_URL}/iss-now.json`);
  return response.data;
};

export const fetchAstronauts = async () => {
  const response = await axios.get(`${ISS_BASE_URL}/astros.json`);
  return response.data;
};

export const fetchNews = async (query = 'space', sortBy = 'publishedAt') => {
  if (!NEWS_API_KEY) {
    throw new Error('News API Key is missing');
  }
  const response = await axios.get(`https://newsapi.org/v2/everything`, {
    params: {
      q: query,
      sortBy: sortBy,
      apiKey: NEWS_API_KEY,
      pageSize: 10,
    },
  });
  return response.data.articles;
};

export const getAIResponse = async (messages, context) => {
  if (!HF_TOKEN) {
    throw new Error('AI Token is missing');
  }

  const systemPrompt = `You are a helpful AI assistant on the ISS Mission Control Dashboard.
Only answer using the following context. If the answer is unavailable in the context, say: "Data not available in dashboard."

CONTEXT:
${JSON.stringify(context)}

RULES:
- Be concise and professional.
- Only talk about ISS, Astronauts, or Space News provided in the context.`;

  const response = await axios.post(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
    {
      inputs: `<s>[INST] ${systemPrompt} [/INST]</s> ${messages.map(m => `[INST] ${m.text} [/INST] ${m.isBot ? m.text : ''}`).join('\n')}`,
    },
    {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
    }
  );

  return response.data[0].generated_text.split('[/INST]').pop().trim();
};
