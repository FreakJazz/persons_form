import {
  Alert,
  Box,
  Card,
  CardHeader,
  CircularProgress
} from '@mui/material';
import { ApexOptions } from 'apexcharts';
import React from 'react';
import Chart from 'react-apexcharts';

interface MonthlyStats {
  month: string;
  count: number;
}

interface MonthlyRegistrationsLineChartProps {
  data: MonthlyStats[];
  isLoading?: boolean;
  error?: string | null;
}

const MonthlyRegistrationsLineChart: React.FC<MonthlyRegistrationsLineChartProps> = ({
  data,
  isLoading,
  error
}) => {
  const chartSeries = [
    {
      name: 'Registros',
      data: data.map(item => item.count)
    }
  ];

  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['#00e676'],
    dataLabels: {
      enabled: false
    },
    grid: {
      borderColor: '#f1f1f1'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: data.map(item => item.month),
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Número de Registros'
      }
    },
    markers: {
      size: 6,
      colors: ['#00e676'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} registros`
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Registros por Mes" />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="Registros por Mes" />
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        subheader="Evolución de registros en los últimos 12 meses"
        title="Registros Mensuales"
      />
      <Box sx={{ height: 336 }}>
        <Chart
          height={300}
          options={chartOptions}
          series={chartSeries}
          type="line"
        />
      </Box>
    </Card>
  );
};

export default MonthlyRegistrationsLineChart;
