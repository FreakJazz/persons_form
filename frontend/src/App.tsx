import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { theme } from './infrastructure/theme/theme';
import { NavigationBar } from './presentation/components/NavigationBar';
import { DashboardIndexPage } from './presentation/pages/dashboard';
import { CreatePersonPage, EditPersonPage, PersonsListPage } from './presentation/pages/persons';
import CreateProfessionPage from './presentation/pages/professions/CreateProfessionPage';
import EditProfessionPage from './presentation/pages/professions/EditProfessionPage';
import ProfessionsListPage from './presentation/pages/professions/ProfessionsListPage';
import RegistrationPage from './presentation/pages/RegistrationPage';

// Configuración del cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000, 
      retry: (failureCount, error: any) => {
        // No reintentar para errores 401 (no autorizado)
        if (error?.response?.status === 401) return false;
        // Reintentar hasta 3 veces para otros errores
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // No reintentar mutaciones fallidas
        return false;
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <NavigationBar>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardIndexPage />} />
              
              {/* Rutas de Personas */}
              <Route path="/persons" element={<PersonsListPage />} />
              <Route path="/persons/create" element={<CreatePersonPage />} />
              <Route path="/persons/edit/:id" element={<EditPersonPage />} />
              <Route path="/persons/register" element={<RegistrationPage />} />
              
              {/* Rutas de Profesiones */}
              <Route path="/professions" element={<ProfessionsListPage />} />
              <Route path="/professions/create" element={<CreateProfessionPage />} />
              <Route path="/professions/edit/:id" element={<EditProfessionPage />} />
            </Routes>
          </NavigationBar>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
