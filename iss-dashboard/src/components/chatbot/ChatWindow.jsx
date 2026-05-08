import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, X, Loader2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { askMissionAI } from '../../services/aiService';
import toast from 'react-hot-toast';

const ChatWindow = ({ isOpen, onClose, dashboardContext }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('mission_control_chat');
    return saved ? JSON.parse(saved) : [{ role: 'bot', content: 'Mission Control AI online. How can I assist with orbital data today?' }];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('mission_control_chat', JSON.stringify(messages.slice(-30)));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await askMissionAI(input, dashboardContext, messages);
      setMessages(prev => [...prev, { role: 'bot', content: reply }]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    const defaultMsg = [{ role: 'bot', content: 'Mission Control AI online. How can I assist with orbital data today?' }];
    setMessages(defaultMsg);
    localStorage.removeItem('mission_control_chat');
    toast.success('Chat history cleared');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[500px] bg-[#F7F5F0] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50"
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Mission Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearChat} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((m, i) => (
              <ChatMessage key={i} message={m} />
            ))}
            {isLoading && (
              <div className="flex gap-2 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl w-fit animate-pulse">
                <Loader2 size={16} className="animate-spin text-zinc-400" />
                <span className="text-xs text-zinc-400">Processing Data...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ISS or News..."
              className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white"
            />
            <button
              disabled={isLoading || !input.trim()}
              className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;
