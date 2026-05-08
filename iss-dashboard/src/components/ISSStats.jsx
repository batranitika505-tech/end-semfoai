import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';

const StatCard = ({ label, value, subValue, error }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#FDFCF8] dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 p-4 rounded-xl flex flex-col justify-between min-h-[100px]"
  >
    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</p>
    <div className="mt-1">
      <h3 className="text-lg font-black text-zinc-900 dark:text-white leading-tight">
        {error ? '---' : value}
      </h3>
      {subValue && <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-bold">{subValue}</p>}
    </div>
  </motion.div>
);

const ISSStats = ({ location, speed, astronauts, historyCount, nearestPlace, error, onRetry }) => {
  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-600 shrink-0" size={24} />
          <div>
            <p className="text-sm font-black text-red-900 dark:text-red-200">Orbital Link Offline</p>
            <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition shadow-lg"
        >
          <RefreshCw size={14} />
          Reconnect
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <StatCard
        label="Latitude / Longitude"
        value={location ? `${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}` : 'Fetching...'}
      />
      <StatCard
        label="Speed"
        value={`${speed ? speed.toFixed(2) : '27600'} km/h`}
      />
      <StatCard
        label="Nearest Place"
        value={nearestPlace || "Over ocean / remote area"}
      />
      <StatCard
        label="Tracked Positions"
        value={historyCount || '0'}
      />
    </div>
  );
};

export default ISSStats;
