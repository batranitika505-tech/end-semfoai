import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Trash2, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIResponse } from '../services/api';
import toast from 'react-hot-toast';

const MAX_MESSAGES = 30;

const Chatbot = ({ dashboardContext, inline = false }) => {
  const [isOpen, setIsOpen] = useState(inline); // Always "open" if inline
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    const trimmed = messages.slice(-MAX_MESSAGES);
    localStorage.setItem('chat_history', JSON.stringify(trimmed));
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now(), text, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const context = {
        issLocation: dashboardContext?.location,
        issSpeed: dashboardContext?.speed,
        astronauts: dashboardContext?.astronauts,
        newsHeadlines: dashboardContext?.news?.slice(0, 5).map(a => a.title),
      };
      const reply = await getAIResponse([...messages, userMsg], context);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
    } catch (err) {
      const fallback = "Data not available in dashboard.";
      setMessages(prev => [...prev, { id: Date.now() + 1, text: fallback, isBot: true }]);
      toast.error("AI request failed — using fallback.");
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chat_history');
  };

  const ChatContent = (
    <div className={`${inline ? 'h-full w-full relative' : 'fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px]'} bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-semibold text-sm">Mission AI Assistant</span>
        </div>
        <button onClick={clearChat} className="hover:opacity-70 transition-opacity" title="Clear chat">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50 dark:bg-zinc-950">
        {messages.length === 0 && (
          <div className="text-center text-zinc-400 dark:text-zinc-600 text-xs mt-8">
            <Bot size={32} className="mx-auto mb-2 opacity-40" />
            <p>Ask me anything about the ISS, astronauts, or news.</p>
            <p className="mt-1 text-[10px]">Only dashboard data will be used.</p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} gap-2`}>
            {msg.isBot && (
              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.isBot
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-tl-sm'
                  : 'bg-blue-600 text-white rounded-tr-sm'
              }`}
            >
              {msg.text}
            </div>
            {!msg.isBot && (
              <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-zinc-600 dark:text-zinc-300" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Bot size={14} className="text-blue-600" />
            </div>
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        className="p-3 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about ISS or news..."
          disabled={isTyping}
          className="flex-1 px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="p-2 bg-blue-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl hover:bg-blue-700 transition-all"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );

  if (inline) return ChatContent;

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}><X size={24} /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}><MessageCircle size={24} /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbot"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {ChatContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
