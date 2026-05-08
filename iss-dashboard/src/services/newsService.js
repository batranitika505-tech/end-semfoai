const RSS_FEED_URL = 'https://www.nasa.gov/rss/dyn/shuttle_station.rss';
const BASE_URL = 'https://api.rss2json.com/v1/api.json';
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

export const fetchBreakingNews = async () => {
  const rss2jsonUrl = `${BASE_URL}?rss_url=${encodeURIComponent(RSS_FEED_URL)}`;

  // Strategy 1: Direct
  try {
    const response = await fetch(rss2jsonUrl, { signal: AbortSignal.timeout(6000) });
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'ok') return transformRSS(data.items);
    }
  } catch (e) {
    console.warn('Direct news fetch failed, trying proxy...');
  }

  // Strategy 2: Proxy
  try {
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(rss2jsonUrl)}`;
    const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
    const wrapper = await response.json();
    const data = JSON.parse(wrapper.contents);

    if (data.status === 'ok') return transformRSS(data.items);
    throw new Error('RSS Link Failure');
  } catch (error) {
    console.error('News Error:', error);
    throw new Error('Failed to fetch orbital news');
  }
};

const transformRSS = (items) => {
  return items.map(article => ({
    title: article.title,
    description: article.description?.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...',
    url: article.link,
    urlToImage: article.enclosure?.link || article.thumbnail || 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800',
    publishedAt: article.pubDate,
    source: 'NASA',
    author: article.author || 'Mission Control'
  }));
};
