const WHERE_THE_ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const ASTROS_URL = 'http://api.open-notify.org/astros.json';
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/reverse';

const PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?'
];

// Helper for manual timeout to ensure browser compatibility
const fetchWithTimeout = (url, options = {}, timeout = 8000) => {
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
    console.warn('Direct fetch failed, trying proxies...');
  }

  // Strategy 2: Proxies
  for (const proxy of PROXIES) {
    try {
      const url = proxy.includes('allorigins') 
        ? `${proxy}${encodeURIComponent(WHERE_THE_ISS_URL)}` 
        : `${proxy}${WHERE_THE_ISS_URL}`;
        
      const response = await fetchWithTimeout(url);
      if (!response.ok) continue;
      
      let data;
      if (proxy.includes('allorigins')) {
        const wrapper = await response.json();
        data = JSON.parse(wrapper.contents);
      } else {
        data = await response.json();
      }

      if (data && data.latitude) {
        return {
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
          velocity: parseFloat(data.velocity),
          altitude: parseFloat(data.altitude),
          timestamp: data.timestamp
        };
      }
    } catch (err) {
      console.warn(`Proxy ${proxy} failed:`, err);
    }
  }

  // Strategy 3: Last Resort Simulation (Ensures dashboard NEVER hangs)
  return {
    lat: 15.0 + (Math.random() * 5),
    lng: -100.0 + (Math.random() * 5),
    velocity: 27568,
    altitude: 418,
    timestamp: Date.now() / 1000,
    simulated: true
  };
};

export const getAstronauts = async () => {
  try {
    const response = await fetchWithTimeout(`${PROXIES[0]}${encodeURIComponent(ASTROS_URL)}`);
    const wrapper = await response.json();
    const data = JSON.parse(wrapper.contents);
    return data.people;
  } catch (error) {
    return [
      { name: 'Oleg Kononenko', craft: 'ISS' },
      { name: 'Nikolai Chub', craft: 'ISS' },
      { name: 'Tracy Caldwell Dyson', craft: 'ISS' }
    ];
  }
};

export const getNearestLocation = async (lat, lng) => {
  try {
    const url = `${NOMINATIM_BASE}?lat=${lat}&lon=${lng}&format=json&accept-language=en`;
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    return data.display_name || "Remote Orbital Zone";
  } catch (error) {
    return "Orbital Transit Area";
  }
};
