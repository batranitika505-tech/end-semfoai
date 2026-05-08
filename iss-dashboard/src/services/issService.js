const WHERE_THE_ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const ASTROS_URL = 'http://api.open-notify.org/astros.json';
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/reverse';

// Array of proxies to try
const PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

export const getISSLocation = async () => {
  // Strategy 1: Direct Fetch (Wait longer)
  try {
    const response = await fetch(WHERE_THE_ISS_URL);
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

  // Strategy 2: Try multiple proxies sequentially
  for (const proxy of PROXIES) {
    try {
      const url = proxy.includes('allorigins') 
        ? `${proxy}${encodeURIComponent(WHERE_THE_ISS_URL)}` 
        : `${proxy}${WHERE_THE_ISS_URL}`;
        
      const response = await fetch(url);
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

  // Strategy 3: Hard Fallback (Last resort simulated data if everything is blocked)
  console.error('All telemetry paths failed. Using simulated orbital data.');
  return {
    lat: 0,
    lng: 0,
    velocity: 27600,
    altitude: 420,
    timestamp: Date.now() / 1000,
    simulated: true
  };
};

export const getAstronauts = async () => {
  try {
    const response = await fetch(`${PROXIES[0]}${encodeURIComponent(ASTROS_URL)}`);
    const wrapper = await response.json();
    const data = JSON.parse(wrapper.contents);
    return data.people;
  } catch (error) {
    return [
      { name: 'Oleg Kononenko', craft: 'ISS' },
      { name: 'Nikolai Chub', craft: 'ISS' },
      { name: 'Tracy Caldwell Dyson', craft: 'ISS' },
      { name: 'Matthew Dominick', craft: 'ISS' },
      { name: 'Michael Barratt', craft: 'ISS' },
      { name: 'Jeanette Epps', craft: 'ISS' },
      { name: 'Alexander Grebenkin', craft: 'ISS' }
    ];
  }
};

export const getNearestLocation = async (lat, lng) => {
  try {
    const url = `${NOMINATIM_BASE}?lat=${lat}&lon=${lng}&format=json&accept-language=en`;
    const response = await fetch(url);
    if (!response.ok) return "Orbital Transit Zone";
    const data = await response.json();
    return data.display_name || "Over ocean / remote area";
  } catch (error) {
    return "Telemetry Signal Weak";
  }
};
