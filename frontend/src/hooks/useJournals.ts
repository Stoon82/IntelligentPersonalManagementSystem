import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_ROUTES } from '../services/api';

interface Journal {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface CreateJournalData {
  title: string;
}

export const useJournals = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    data: journals,
    isLoading,
    error: fetchError,
  } = useQuery<Journal[]>({
    queryKey: ['journals'],
    queryFn: async () => {
      const response = await apiClient.get(API_ROUTES.JOURNALS.LIST);
      return response.data;
    },
  });

  const { mutateAsync: createJournal, isPending: isCreating } = useMutation({
    mutationFn: async (data: CreateJournalData) => {
      const response = await apiClient.post(API_ROUTES.JOURNALS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      setError(null);
    },
    onError: (error: any) => {
      setError(error.response?.data?.detail || 'Failed to create journal');
    },
  });

  return {
    journals,
    isLoading,
    error: error || (fetchError as Error)?.message,
    createJournal,
    isCreating,
  };
};
