import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const SpeedChart = ({ history, loading }) => {
  if (loading || history.length === 0) return (
    <div className="glass-card h-full min-h-[450px] flex flex-col animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
        <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-12" />
      </div>
      <div className="flex-1 flex flex-col justify-end gap-2 px-2">
        <div className="flex items-end justify-between gap-1 h-32">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%` }} />
          ))}
        </div>
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
      </div>
    </div>
  );
  const data = history.map((p, index) => ({
    time: new Date(p.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    speed: p.speed || 27600
  }));

  return (
    <div className="glass-card h-full min-h-[450px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-zinc-900 dark:text-white">Velocity Trend</h3>
        <span className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">KM/H</span>
      </div>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              hide={true} 
            />
            <YAxis 
              domain={['auto', 'auto']} 
              fontSize={10} 
              tickFormatter={(val) => `${(val/1000).toFixed(1)}k`}
              stroke="#9ca3af"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '12px', 
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
              }}
              labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
            />
            <Area 
              type="monotone" 
              dataKey="speed" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSpeed)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpeedChart;
