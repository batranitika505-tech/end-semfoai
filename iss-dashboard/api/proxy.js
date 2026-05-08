export default async function handler(req, res) {
  // Add CORS headers immediately
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Target URL is missing' });

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
      // Ensure we stringify the body correctly
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(decodedUrl, options);
    
    // Attempt to get JSON, fallback to text
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy Backend Error:', error);
    return res.status(500).json({ 
      error: 'Mission Control Proxy Error',
      details: error.message 
    });
  }
}
