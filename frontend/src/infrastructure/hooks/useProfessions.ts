import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProfessionCreate, ProfessionUpdate } from '../../domain/entities/Profession';
import { professionApiService } from '../services/ProfessionApiService';

export const useProfessions = (page: number = 1, size: number = 50) => {
  return useQuery({
    queryKey: ['professions', page, size],
    queryFn: () => professionApiService.getAll(page, size),
  });
};

export const useAllProfessions = () => {
  return useQuery({
    queryKey: ['professions-all'],
    queryFn: () => professionApiService.getAllForSelector(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProfession = (id: number) => {
  return useQuery({
    queryKey: ['profession', id],
    queryFn: () => professionApiService.getById(id),
    enabled: !!id,
  });
};

export const useSearchProfessions = (query: string) => {
  return useQuery({
    queryKey: ['professions-search', query],
    queryFn: () => professionApiService.search(query),
    enabled: !!query.trim(),
  });
};

export const useCreateProfession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (professionData: ProfessionCreate) => professionApiService.create(professionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professions'] });
    },
  });
};

export const useUpdateProfession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProfessionUpdate }) => 
      professionApiService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['professions'] });
      queryClient.invalidateQueries({ queryKey: ['profession', variables.id] });
    },
  });
};

export const useDeleteProfession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => professionApiService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professions'] });
    },
  });
};
