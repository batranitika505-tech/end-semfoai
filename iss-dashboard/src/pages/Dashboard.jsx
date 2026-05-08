import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Satellite } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useISS } from '../hooks/useISS';
import { useNews } from '../hooks/useNews';
import ISSStats from '../components/ISSStats';
import ISSMap from '../components/ISSMap';
import ISSSpeedChart from '../charts/ISSSpeedChart';
import NewsSection from '../components/NewsSection';
import NewsDistributionChart from '../charts/NewsDistributionChart';
import AstronautsCard from '../components/AstronautsCard';
import FloatingButton from '../components/chatbot/FloatingButton';
import ChatWindow from '../components/chatbot/ChatWindow';
import ConnectionStatus from '../components/ConnectionStatus';
import ErrorBoundary from '../components/common/ErrorBoundary';

const Dashboard = () => {
  const { isDark, toggleTheme } = useTheme();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sourceFilter, setSourceFilter] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { location, history, astronauts, speed, nearestPlace, loading, error, refresh } = useISS(autoRefresh);
  const { articles, loading: newsLoading } = useNews();

  // Memoize dashboard context to prevent unnecessary re-renders of stable components
  const dashboardContext = useMemo(() => ({ 
    location, 
    speed, 
    astronauts, 
    news: articles 
  }), [location?.lat, location?.lng, location?.altitude, speed, astronauts.length, articles.length]);

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#0e0e0e] transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Section */}
        <header className="mb-10">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Mission Control Dashboard</p>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Real-Time ISS and News Intelligence
          </h1>
        </header>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          
          {/* LEFT SIDE (70%) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* ISS Live Tracking Section */}
            <ErrorBoundary>
              <section className="glass-card !bg-white/90 !p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black text-zinc-900 dark:text-white">ISS Live Tracking</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={refresh} 
                      className="text-[10px] font-bold px-4 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-md hover:bg-zinc-100 transition-colors"
                    >
                      Refresh Now
                    </button>
                    <button 
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className="text-[10px] font-bold px-4 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-md"
                    >
                      Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                <ISSStats 
                  location={location} 
                  speed={speed} 
                  astronauts={astronauts} 
                  historyCount={history.length}
                  nearestPlace={nearestPlace}
                  error={error}
                  onRetry={refresh}
                />

                <div className="mt-6">
                  <ISSMap location={location} history={history} loading={loading} />
                </div>
              </section>
            </ErrorBoundary>

            {/* News Section */}
            <ErrorBoundary>
              <section className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <NewsSection dashboardContext={dashboardContext} filterSource={sourceFilter} onResetFilter={() => setSourceFilter(null)} />
              </section>
            </ErrorBoundary>
          </div>

          {/* RIGHT SIDE (30%) */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Speed Trend Card */}
            <ErrorBoundary>
              <section>
                 <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">ISS Speed Trend</h2>
                 <ISSSpeedChart history={history} loading={loading} />
              </section>
            </ErrorBoundary>

            {/* News Distribution Card */}
            <ErrorBoundary>
              <section>
                 <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Intel Distribution</h2>
                 <NewsDistributionChart articles={articles} loading={newsLoading} onFilter={setSourceFilter} />
              </section>
            </ErrorBoundary>

            {/* Astronauts Personnel Card */}
            <section>
               <AstronautsCard astronauts={astronauts} loading={loading} />
            </section>

            {/* AI Assistant Info Card */}
            <section className="lg:sticky lg:top-24">
               <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Mission Support</h2>
               <div className="glass-card bg-blue-600 text-white">
                 <p className="text-sm font-medium leading-relaxed">
                   Our restricted AI model is online and monitoring all telemetry. 
                   Use the mission bubble to ask questions about current coordinates or news.
                 </p>
                 <button 
                  onClick={() => setIsChatOpen(true)}
                  className="mt-4 w-full py-2 bg-white text-blue-600 rounded-xl text-sm font-bold shadow-lg"
                 >
                   Establish Link
                 </button>
               </div>
            </section>
          </div>
        </div>

        {/* Floating Chatbot Components */}
        <FloatingButton isOpen={isChatOpen} onClick={() => setIsChatOpen(!isChatOpen)} />
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} dashboardContext={dashboardContext} />
      </div>
    </div>
  );
};

export default Dashboard;
