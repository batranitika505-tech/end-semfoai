import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot, Check, Copy } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';
  const isBot = message.role === 'bot';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? 'bg-blue-600' : 'bg-zinc-800 dark:bg-zinc-100'
      }`}>
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white dark:text-zinc-900" />}
      </div>
      <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
        isUser 
          ? 'bg-blue-600 text-white rounded-tr-none' 
          : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-700 rounded-tl-none'
      }`}>
        {message.content}
        {isBot && (
          <button 
            onClick={copyToClipboard}
            className="mt-2 flex items-center gap-1 text-[10px] opacity-50 hover:opacity-100 transition-opacity"
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
