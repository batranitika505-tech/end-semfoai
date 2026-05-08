const WHERE_THE_ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const ASTROS_URL = 'http://api.open-notify.org/astros.json';
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/reverse';
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

export const getISSLocation = async () => {
  // Strategy 1: Direct Fetch (Fastest, works if no CORS block)
  try {
    const response = await fetch(WHERE_THE_ISS_URL, { signal: AbortSignal.timeout(5000) });
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
    console.warn('Direct ISS fetch failed, trying proxy...', e);
  }

  // Strategy 2: Proxy Fetch (Bypasses CORS)
  try {
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(WHERE_THE_ISS_URL)}`;
    const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Proxy Link Failure');
    
    const wrapper = await response.json();
    if (!wrapper.contents) throw new Error('Empty Proxy Response');
    
    const data = JSON.parse(wrapper.contents);
    return {
      lat: parseFloat(data.latitude),
      lng: parseFloat(data.longitude),
      velocity: parseFloat(data.velocity),
      altitude: parseFloat(data.altitude),
      timestamp: data.timestamp
    };
  } catch (error) {
    console.error('ISS Proxy Error:', error);
    throw new Error('Satellite Link Failure: All ground stations reporting loss of signal');
  }
};

export const getAstronauts = async () => {
  try {
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(ASTROS_URL)}`;
    const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Personnel Link Failure');
    
    const wrapper = await response.json();
    const data = JSON.parse(wrapper.contents);
    return data.people;
  } catch (error) {
    // Fallback for astronauts
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
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return "Remote Orbital Area";
    
    const data = await response.json();
    return data.display_name || "Over ocean / remote area";
  } catch (error) {
    return "Location data unavailable";
  }
};
