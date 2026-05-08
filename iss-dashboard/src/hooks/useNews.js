import { useState, useEffect, useCallback } from 'react';
import { fetchBreakingNews } from '../services/newsService';
import toast from 'react-hot-toast';

const CACHE_KEY = 'mission_news_cache';
const CACHE_TIME_KEY = 'mission_news_expiry';
const EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export const useNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getNews = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);

    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    const now = Date.now();

    if (!force && cachedData && cachedTime && (now - cachedTime < EXPIRY_MS)) {
      setArticles(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    try {
      const data = await fetchBreakingNews();
      setArticles(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIME_KEY, now.toString());
    } catch (err) {
      setError(err.message);
      toast.error('News Feed Link Failure');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getNews();
  }, [getNews]);

  return { articles, loading, error, refreshNews: () => getNews(true) };
};
