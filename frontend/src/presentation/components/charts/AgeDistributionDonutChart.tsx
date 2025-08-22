import { Info as InfoIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Stack,
  SvgIcon,
  Tooltip,
  Typography
} from '@mui/material';
import { ApexOptions } from 'apexcharts';
import React from 'react';
import Chart from 'react-apexcharts';

interface AgeRangeStats {
  range: string;
  count: number;
}

interface AgeDistributionDonutChartProps {
  data: AgeRangeStats[];
  isLoading?: boolean;
  error?: string | null;
}

const AgeDistributionDonutChart: React.FC<AgeDistributionDonutChartProps> = ({
  data,
  isLoading,
  error
}) => {
  const chartSeries = data.map(item => item.count);
  const labels = data.map(item => item.range);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut'
    },
    colors: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`
    },
    labels: labels,
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
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
        <CardHeader title="Distribución por Edad" />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="Distribución por Edad" />
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Distribución por Rangos de Edad"
        action={
          <Tooltip title="Actualización cada 24h">
            <SvgIcon color="action">
              <InfoIcon />
            </SvgIcon>
          </Tooltip>
        }
      />
      <CardContent>
        <Chart
          height={200}
          options={chartOptions}
          series={chartSeries}
          type="donut"
        />
        <Grid container spacing={1} sx={{ mt: 2 }}>
          {data.map((item, index) => (
            <Grid key={index} item xs={12} sm={6}>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Box
                  sx={{
                    backgroundColor: chartOptions.colors![index],
                    borderRadius: '50%',
                    height: 8,
                    width: 8,
                  }}
                />
                <Typography variant="subtitle2">
                  {item.range} años ({item.count} personas)
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AgeDistributionDonutChart;
