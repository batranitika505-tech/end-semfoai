import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ISSSpeedChart = ({ history, loading }) => {
  if (loading || history.length === 0) {
    return (
      <div className="glass-card h-[400px] flex flex-col animate-pulse">
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
          <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-12" />
        </div>
        <div className="flex-1 px-4 flex items-end gap-1 pb-10">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-t-md" style={{ height: `${20 + Math.random() * 60}%` }} />
          ))}
        </div>
      </div>
    );
  }

  const data = {
    labels: history.map(p => new Date(p.timestamp * 1000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })),
    datasets: [
      {
        label: 'ISS Speed (km/h)',
        data: history.map(p => p.speed || 27600),
        fill: false,
        borderColor: '#ef4444',
        backgroundColor: '#ef4444',
        tension: 0, // Straight lines as in screenshot
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: '#ef4444',
          font: { size: 10, weight: 'bold' },
          boxWidth: 15,
          usePointStyle: false,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1a1a1a',
        bodyColor: '#1a1a1a',
        borderColor: '#ef4444',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 8 }, maxRotation: 45, minRotation: 45 },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 10 },
          stepSize: 200,
        },
        suggestedMin: 27000,
        suggestedMax: 28500,
      },
    },
  };

  return (
    <div className="glass-card h-[400px] p-4 flex flex-col">
      <div className="flex-1">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ISSSpeedChart;
