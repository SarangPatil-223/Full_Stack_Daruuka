import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { BiodiversityMetric } from '../../services/sitesApi';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  RadialLinearScale, PointElement, LineElement, Filler,
);

interface Props {
  metrics: BiodiversityMetric[];
  siteName?: string;
}

export const BiodiversityChart: React.FC<Props> = ({ metrics, siteName }) => {
  if (metrics.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        No biodiversity metric data available yet.
      </div>
    );
  }

  const sorted = [...metrics].sort((a, b) => a.recorded_at.localeCompare(b.recorded_at));

  const data = {
    labels: sorted.map(m =>
      new Date(m.recorded_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    ),
    datasets: [
      {
        label: 'Biodiversity Index',
        data: sorted.map(m => m.index_score),
        backgroundColor: sorted.map(m =>
          m.index_score >= 0.7 ? 'rgba(45, 106, 79, 0.75)' :
          m.index_score >= 0.4 ? 'rgba(146, 64, 14, 0.75)' :
          'rgba(153, 27, 27, 0.75)'
        ),
        borderColor: sorted.map(m =>
          m.index_score >= 0.7 ? '#2d6a4f' :
          m.index_score >= 0.4 ? '#92400e' :
          '#991b1b'
        ),
        borderWidth: 1.5,
        borderRadius: 4,
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
          label: (ctx: any) => ` Index: ${ctx.parsed.y.toFixed(3)}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 1,
        grid: { color: '#e8ede9' },
        ticks: { font: { size: 11 } },
        title: { display: true, text: 'Index Score (0–1)', font: { size: 11 }, color: '#8a9b8e' },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  return <Bar data={data} options={options} />;
};
