import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { CHART_COLORS } from '../../../shared/constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyRegistrationsChartProps {
  data: Record<string, number>;
  title?: string;
}

const MonthlyRegistrationsChart: React.FC<MonthlyRegistrationsChartProps> = ({ 
  data, 
  title = 'Registros por Mes' 
}) => {
  // Ordenar los datos por fecha y formatear etiquetas
  const sortedEntries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
  
  const labels = sortedEntries.map(([key]) => {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short' 
    });
  });
  
  const values = sortedEntries.map(([, value]) => value);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Personas Registradas',
        data: values,
        borderColor: CHART_COLORS.primary,
        backgroundColor: `${CHART_COLORS.primary}20`,
        borderWidth: 3,
        pointBackgroundColor: CHART_COLORS.primary,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw} personas`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: '#f3f4f6',
        },
      },
      x: {
        grid: {
          color: '#f3f4f6',
        },
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round' as const,
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyRegistrationsChart;
