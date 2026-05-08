import React, { useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { useNews } from '../hooks/useNews';
import NewsCard from './NewsCard';
import { motion, AnimatePresence } from 'framer-motion';

// Skeleton loader card
const SkeletonCard = () => (
  <div className="glass-card !p-0 overflow-hidden animate-pulse">
    <div className="h-48 bg-zinc-200 dark:bg-zinc-700 rounded-t-2xl" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6" />
      <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg mt-2" />
    </div>
  </div>
);

const NewsSection = ({ dashboardContext, filterSource, onResetFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');
  const { articles, loading, error, refreshNews } = useNews();

  // Apply source filtering if active
  const displayedArticles = filterSource 
    ? articles.filter(a => a.source === filterSource)
    : articles;

  const handleSearch = (e) => {
    e.preventDefault();
    refreshNews(searchQuery || 'ISS NASA space', sortBy);
  };

  const handleSort = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    refreshNews(searchQuery || 'ISS NASA space', newSort);
  };

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Breaking News</h2>
        <button
          onClick={() => {
            localStorage.removeItem('news_dashboard_cache');
            localStorage.removeItem('news_dashboard_time');
            refreshNews(searchQuery, sortBy);
          }}
          className="text-[10px] font-bold px-4 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-md hover:bg-zinc-100 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            placeholder="Search title, source, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </form>
        <select
          value={sortBy}
          onChange={handleSort}
          className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
        >
          <option value="publishedAt">Sort by Date</option>
          <option value="relevancy">Sort by Relevance</option>
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 text-center bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl mb-6">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button
            onClick={() => refreshNews(searchQuery, sortBy)}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : (
            <AnimatePresence>
              {displayedArticles.map((article, index) => (
                <motion.div
                  key={article.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NewsCard article={article} />
                </motion.div>
              ))}
            </AnimatePresence>
          )
        }
      </div>

      {!loading && displayedArticles.length === 0 && !error && (
        <div className="text-center py-20 text-zinc-400">
          No articles found for this source. Try clearing the filter.
        </div>
      )}
    </div>
  );
};

export default NewsSection;
