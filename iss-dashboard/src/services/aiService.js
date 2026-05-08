const HF_TOKEN = import.meta.env.VITE_HF_TOKEN || import.meta.env.VITE_AI_TOKEN;
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2';

export const askMissionAI = async (userMessage, context, chatHistory) => {
  if (!HF_TOKEN) {
    throw new Error('Mission Assistant Link Offline: HF Token Missing');
  }

  // Construct context string as requested
  const contextData = `
    ISS Position: Lat ${context.location?.lat.toFixed(4)}, Lng ${context.location?.lng.toFixed(4)}
    Current Velocity: ${context.speed.toFixed(2)} km/h
    Altitude: ${context.location?.altitude?.toFixed(2) || '420'} km
    Astronauts in Space: ${context.astronauts?.map(a => a.name).join(', ')}
    Latest News: ${context.news?.slice(0, 3).map(n => n.title).join(' | ')}
  `;

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `<s>[INST] You are a dashboard assistant. Only answer using this data: ${contextData} 
          User question: ${userMessage} [/INST]`,
          parameters: { max_new_tokens: 300, temperature: 0.7 }
        }),
      }
    );

    if (!response.ok) throw new Error('Satellite Link Interrupted');

    const result = await response.json();
    
    // Clean up response: Mistral sometimes includes the prompt
    let reply = Array.isArray(result) ? result[0].generated_text : result.generated_text;
    if (reply.includes('[/INST]')) {
      reply = reply.split('[/INST]').pop().trim();
    }
    
    return reply || "I only know dashboard data.";
  } catch (error) {
    console.error('AI Error:', error);
    throw new Error('Failed to reach Mission Control AI');
  }
};
