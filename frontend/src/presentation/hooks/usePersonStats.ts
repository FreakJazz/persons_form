import { useCallback, useState } from 'react';
import { PersonStats } from '../../domain/entities/Person';
import { GetPersonStatsUseCase } from '../../domain/use_cases/GetPersonStatsUseCase';
import { ApiPersonRepository } from '../../infrastructure/repositories/ApiPersonRepository';
import { useAppContext } from '../context/AppContext';

const personRepository = new ApiPersonRepository();
const getPersonStatsUseCase = new GetPersonStatsUseCase(personRepository);

export const usePersonStats = () => {
  const [stats, setStats] = useState<PersonStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useAppContext();

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const statsData = await getPersonStatsUseCase.execute();
      setStats(statsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar estadísticas';
      setError(errorMessage);
      addToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  const refreshStats = useCallback(() => {
    return loadStats();
  }, [loadStats]);

  return {
    stats,
    isLoading,
    error,
    loadStats,
    refreshStats,
  };
};
