import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

const FloatingButton = ({ isOpen, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-white dark:border-zinc-800"
    >
      {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
    </motion.button>
  );
};

export default FloatingButton;
