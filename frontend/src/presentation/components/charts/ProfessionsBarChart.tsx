import {
  Alert,
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Tab,
  Tabs
} from '@mui/material';
import { ApexOptions } from 'apexcharts';
import React from 'react';
import Chart from 'react-apexcharts';

interface ProfessionStats {
  profession_name: string;
  count: number;
}

interface ProfessionsBarChartProps {
  data: ProfessionStats[];
  isLoading?: boolean;
  error?: string | null;
}

const ProfessionsBarChart: React.FC<ProfessionsBarChartProps> = ({
  data,
  isLoading,
  error
}) => {
  const chartSeries = [
    {
      name: 'Personas',
      data: data.map(item => item.count)
    }
  ];

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    colors: ['#1976d2'],
    dataLabels: {
      enabled: true
    },
    grid: {
      borderColor: '#f1f1f1'
    },
    xaxis: {
      categories: data.map(item => item.profession_name),
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Número de Personas'
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} personas`
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Personas por Profesión" />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="Personas por Profesión" />
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        subheader="Distribución de personas registradas por profesión"
        title="Personas por Profesión"
        action={
          <Tabs value="all">
            <Tab label="Todas" value="all" />
          </Tabs>
        }
      />
      <Box sx={{ height: 336 }}>
        <Chart
          height={300}
          options={chartOptions}
          series={chartSeries}
          type="bar"
        />
      </Box>
    </Card>
  );
};

export default ProfessionsBarChart;
