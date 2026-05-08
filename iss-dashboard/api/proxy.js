export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const decodedUrl = decodeURIComponent(url);
    const options = {
      method: req.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    };

    if (req.headers.authorization) {
      options.headers['Authorization'] = req.headers.authorization;
    }

    if (req.method === 'POST') {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(decodedUrl, options);
    const data = await response.json();
    
    // Add CORS headers to the response from our serverless function
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
