import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck } from 'lucide-react';

const AstronautsCard = ({ astronauts, loading }) => {
  if (loading) {
    return (
      <div className="glass-card animate-pulse space-y-4">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Users className="text-orange-500" size={20} />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Active Personnel</h2>
        </div>
        <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-full shadow-lg">
          {astronauts.length} ON MISSION
        </span>
      </div>

      <div className="space-y-3">
        {astronauts.map((astro, index) => (
          <motion.div
            key={astro.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 group hover:border-orange-500/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden">
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                  {astro.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  {astro.name}
                </p>
                <p className="text-[10px] text-zinc-500 font-medium">{astro.craft}</p>
              </div>
            </div>
            <ShieldCheck size={14} className="text-emerald-500 opacity-40" />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <p className="text-[10px] text-zinc-400 font-medium">Data source: NASA Mission Control</p>
      </div>
    </motion.div>
  );
};

export default AstronautsCard;
