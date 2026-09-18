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
  Filler,
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
  Filler,
);

export const CarbonChart = ({ metrics, siteName }) => {
  if (metrics.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
        }}
      >
        No carbon metric data available yet.
      </div>
    );
  }

  const sorted = [...metrics].sort((a, b) => a.recorded_at.localeCompare(b.recorded_at));

  const data = {
    labels: sorted.map((m) =>
      new Date(m.recorded_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
    ),
    datasets: [
      {
        label: 'CO₂e (tonnes)',
        data: sorted.map((m) => m.co2e_tonnes),
        borderColor: '#2d6a4f',
        backgroundColor: 'rgba(45, 106, 79, 0.12)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#2d6a4f',
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: !!siteName,
        text: siteName,
        font: { size: 13 },
        color: '#5a6b5e',
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y.toFixed(2)} t CO₂e`,
        },
      },
    },
    scales: {
      y: {
        grid: { color: '#e8ede9' },
        ticks: { font: { size: 11 } },
        title: { display: true, text: 'CO₂e tonnes', font: { size: 11 }, color: '#8a9b8e' },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  return <Line data={data} options={options} />;
};
