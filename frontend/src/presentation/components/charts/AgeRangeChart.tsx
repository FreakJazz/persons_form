import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip,
} from 'chart.js';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { CHART_COLORS } from '../../../shared/constants';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AgeRangeChartProps {
  data: Record<string, number>;
  title?: string;
}

const AgeRangeChart: React.FC<AgeRangeChartProps> = ({ 
  data, 
  title = 'Distribución por Rangos de Edad' 
}) => {
  const colors = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.accent,
    CHART_COLORS.purple,
  ];

  const chartData = {
    labels: Object.keys(data).map(key => {
      switch (key) {
        case '0-18': return 'Menores de 18';
        case '19-35': return '19-35 años';
        case '36-60': return '36-60 años';
        case '60+': return 'Mayores de 60';
        default: return key;
      }
    }),
    datasets: [
      {
        label: 'Cantidad de Personas',
        data: Object.values(data),
        backgroundColor: colors,
        borderColor: colors.map(color => color),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const total = Object.values(data).reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} personas (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="chart-container">
      <div style={{ height: '400px' }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AgeRangeChart;
