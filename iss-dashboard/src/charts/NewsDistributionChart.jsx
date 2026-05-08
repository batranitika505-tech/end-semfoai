import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const NewsDistributionChart = ({ articles, onFilter, loading }) => {
  if (loading || articles.length === 0) {
    return (
      <div className="glass-card h-[300px] flex items-center justify-center animate-pulse">
        <div className="w-32 h-32 rounded-full border-8 border-zinc-100 dark:border-zinc-800 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  // Group articles by source
  const sources = articles.reduce((acc, article) => {
    acc[article.source] = (acc[article.source] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(sources);
  const dataValues = Object.values(sources);

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          '#3b82f6', // blue
          '#8b5cf6', // violet
          '#ec4899', // pink
          '#ef4444', // red
          '#f59e0b', // amber
          '#10b981', // emerald
        ],
        borderColor: 'transparent',
        hoverOffset: 15,
        cutout: '70%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#9ca3af',
          font: { size: 10, weight: 'bold' },
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw} articles`
        }
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        onFilter(labels[index]);
      } else {
        onFilter(null); // Reset filter
      }
    },
  };

  return (
    <div className="glass-card h-[300px] p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">News by Source</h3>
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Interactive</span>
      </div>
      <div className="flex-1 relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-zinc-900 dark:text-white">{articles.length}</span>
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Total</span>
        </div>
      </div>
    </div>
  );
};

export default NewsDistributionChart;
