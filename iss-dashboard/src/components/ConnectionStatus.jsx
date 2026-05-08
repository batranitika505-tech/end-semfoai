import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
          isOnline 
            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
            : 'bg-red-500/10 text-red-600 border-red-500/20 animate-pulse'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi size={12} />
            Link Stable
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          </>
        ) : (
          <>
            <WifiOff size={12} />
            Link Interrupted
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ConnectionStatus;
