import { People as PeopleIcon, Work as WorkIcon } from '@mui/icons-material';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Container,
    Grid,
    Paper,
    Typography
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '../../../infrastructure/hooks/useDashboardStats';
import { usePersons } from '../../../infrastructure/hooks/usePersons';
import { useProfessions } from '../../../infrastructure/hooks/useProfessions';
import AgeDistributionDonutChart from '../../components/charts/AgeDistributionDonutChart';
import MonthlyRegistrationsLineChart from '../../components/charts/MonthlyRegistrationsLineChart';
import ProfessionsBarChart from '../../components/charts/ProfessionsBarChart';

const DashboardIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: persons } = usePersons();
  const { data: professionsResponse } = useProfessions();
  const { data: dashboardStats, isLoading: isLoadingStats, error: statsError } = useDashboardStats();

  const totalPersons = persons?.length || 0;
  const totalProfessions = professionsResponse?.total || 0;

  const menuCards = [
    {
      title: 'Personas',
      subtitle: `${totalPersons} registradas`,
      icon: PeopleIcon,
      path: '/persons',
      color: '#1976d2',
    },
    {
      title: 'Profesiones',
      subtitle: `${totalProfessions} disponibles`,
      icon: WorkIcon,
      path: '/professions',
      color: '#388e3c',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Sistema de Registro de Personas y Profesiones
        </Typography>
      </Box>

      {/* Resumen del Sistema */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Resumen del Sistema
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary">
                {dashboardStats?.total_persons || totalPersons}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Personas Registradas
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">
                {dashboardStats?.total_professions || totalProfessions}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Profesiones Disponibles
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Accesos Rápidos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {menuCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(card.path)}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: card.color,
                      color: 'white',
                      mb: 2,
                    }}
                  >
                    <card.icon fontSize="large" />
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.subtitle}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Gráfico de Barras - Personas por Profesión */}
        <Grid item xs={12} lg={8}>
          <ProfessionsBarChart
            data={dashboardStats?.profession_distribution || []}
            isLoading={isLoadingStats}
            error={statsError?.message}
          />
        </Grid>

        {/* Gráfico de Donut - Distribución por Edad */}
        <Grid item xs={12} lg={4}>
          <AgeDistributionDonutChart
            data={dashboardStats?.age_distribution || []}
            isLoading={isLoadingStats}
            error={statsError?.message}
          />
        </Grid>

        {/* Gráfico de Líneas - Registros Mensuales */}
        <Grid item xs={12}>
          <MonthlyRegistrationsLineChart
            data={dashboardStats?.monthly_registrations || []}
            isLoading={isLoadingStats}
            error={statsError?.message}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardIndexPage;
