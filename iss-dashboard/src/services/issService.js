const WHERE_THE_ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const ASTROS_URL = 'http://api.open-notify.org/astros.json';
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/reverse';

// Production proxy via our own Serverless Function
const VERCEL_PROXY = '/api/proxy?url=';
const PUBLIC_PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?'
];

const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Signal Timeout')), timeout))
  ]);
};

export const getISSLocation = async () => {
  // Strategy 1: Direct Fetch
  try {
    const response = await fetchWithTimeout(WHERE_THE_ISS_URL);
    if (response.ok) {
      const data = await response.json();
      return {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
        velocity: parseFloat(data.velocity),
        altitude: parseFloat(data.altitude),
        timestamp: data.timestamp
      };
    }
  } catch (e) {
    console.warn('Direct fetch failed, trying Vercel Proxy...');
  }

  // Strategy 2: Vercel Serverless Proxy (Production)
  try {
    const proxyUrl = `${VERCEL_PROXY}${encodeURIComponent(WHERE_THE_ISS_URL)}`;
    const response = await fetchWithTimeout(proxyUrl);
    if (response.ok) {
      const data = await response.json();
      return {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
        velocity: parseFloat(data.velocity),
        altitude: parseFloat(data.altitude),
        timestamp: data.timestamp
      };
    }
  } catch (e) {
    console.warn('Vercel proxy failed, trying public proxies...');
  }

  // Strategy 3: Public Proxies
  for (const proxy of PUBLIC_PROXIES) {
    try {
      const url = proxy.includes('allorigins') 
        ? `${proxy}${encodeURIComponent(WHERE_THE_ISS_URL)}` 
        : `${proxy}${WHERE_THE_ISS_URL}`;
        
      const response = await fetchWithTimeout(url);
      const wrapper = await response.json();
      const data = proxy.includes('allorigins') ? JSON.parse(wrapper.contents) : wrapper;

      if (data && data.latitude) {
        return {
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
          velocity: parseFloat(data.velocity),
          altitude: parseFloat(data.altitude),
          timestamp: data.timestamp
        };
      }
    } catch (err) {}
  }

  // Final Fallback: Simulation
  return {
    lat: 25.0 + Math.random(),
    lng: -45.0 + Math.random(),
    velocity: 27580,
    altitude: 421,
    timestamp: Date.now() / 1000,
    simulated: true
  };
};

export const getAstronauts = async () => {
  const url = ASTROS_URL;
  try {
    const proxyUrl = `${VERCEL_PROXY}${encodeURIComponent(url)}`;
    const response = await fetchWithTimeout(proxyUrl);
    const data = await response.json();
    return data.people;
  } catch (error) {
    return [{ name: 'Oleg Kononenko', craft: 'ISS' }, { name: 'Nikolai Chub', craft: 'ISS' }];
  }
};

export const getNearestLocation = async (lat, lng) => {
  const url = `${NOMINATIM_BASE}?lat=${lat}&lon=${lng}&format=json`;
  try {
    const proxyUrl = `${VERCEL_PROXY}${encodeURIComponent(url)}`;
    const response = await fetchWithTimeout(proxyUrl);
    const data = await response.json();
    return data.display_name || "Remote Orbital Zone";
  } catch (error) {
    return "Orbital Transit Area";
  }
};
