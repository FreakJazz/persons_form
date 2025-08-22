import { useQuery } from '@tanstack/react-query';

interface ProfessionStats {
  profession_name: string;
  count: number;
}

interface AgeRangeStats {
  range: string;
  count: number;
}

interface MonthlyStats {
  month: string;
  count: number;
}

interface DashboardStats {
  total_persons: number;
  total_professions: number;
  profession_distribution: ProfessionStats[];
  age_distribution: AgeRangeStats[];
  monthly_registrations: MonthlyStats[];
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch('http://localhost:8000/api/v1/persons/stats/dashboard');
  if (!response.ok) {
    throw new Error('Error al obtener estadísticas del dashboard');
  }
  return response.json();
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
