import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreatePersonRequest, UpdatePersonRequest } from '../../domain/entities/Person';
import { personApiService } from '../services/PersonApiService';

export const usePersons = (skip: number = 0, limit: number = 100) => {
  const queryResult = useQuery({
    queryKey: ['persons', skip, limit],
    queryFn: () => personApiService.getAllPersons(skip, limit),
  });

  const createPerson = useCreatePerson();
  const updatePerson = useUpdatePerson();
  const deletePerson = useDeletePerson();

  return {
    ...queryResult,
    createPerson,
    updatePerson,
    deletePerson,
  };
};

export const usePerson = (id: number) => {
  return useQuery({
    queryKey: ['person', id],
    queryFn: () => personApiService.getPersonById(id),
    enabled: !!id,
  });
};

export const useCreatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (personData: CreatePersonRequest) => personApiService.createPerson(personData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};

export const useUpdatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePersonRequest }) => 
      personApiService.updatePerson(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      queryClient.invalidateQueries({ queryKey: ['person', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};

export const useDeletePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => personApiService.deletePerson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => personApiService.getDashboardStats(),
  });
};

export const useSearchPersons = (query: string) => {
  return useQuery({
    queryKey: ['search-persons', query],
    queryFn: () => personApiService.searchPersons(query),
    enabled: !!query && query.length > 2,
  });
};
