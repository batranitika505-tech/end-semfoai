import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsCard = ({ article }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="glass-card flex flex-col h-full !p-0 overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.urlToImage || 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800'}
          alt={article.title}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800';
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md shadow-lg">
            {article.source}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-zinc-400 text-[10px] mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <User size={12} />
            {article.author ? article.author.split(',')[0] : 'Admin'}
          </span>
        </div>
        
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-4 flex-1">
          {article.description}
        </p>
        
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-zinc-900 dark:text-white rounded-lg text-xs font-semibold transition-all"
        >
          Read Full Mission Report
          <ExternalLink size={14} />
        </a>
      </div>
    </motion.div>
  );
};

export default NewsCard;
