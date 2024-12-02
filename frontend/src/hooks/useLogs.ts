import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogService } from '../services/logs';
import { LogCreate, LogUpdate } from '../types/log';

export const useLogs = (projectId?: number) => {
  const queryClient = useQueryClient();
  const queryKey = ['logs', projectId];

  const { data: logs, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => LogService.getLogs(projectId),
  });

  const createMutation = useMutation({
    mutationFn: (data: LogCreate) => LogService.createLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: LogUpdate }) =>
      LogService.updateLog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => LogService.deleteLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    logs,
    isLoading,
    error,
    createLog: createMutation.mutate,
    updateLog: updateMutation.mutate,
    deleteLog: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
