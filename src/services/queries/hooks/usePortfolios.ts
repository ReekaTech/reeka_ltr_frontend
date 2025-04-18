import {
  CreatePortfolioPayload,
  Portfolio,
  UpdatePortfolioPayload,
} from '@/services/api/schemas';
import {
  GetPortfoliosParams,
  createPortfolio,
  deletePortfolio,
  getPortfolioById,
  getPortfolios,
  updatePortfolio,
} from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-toastify';

export const usePortfolio = (portfolioId: string | undefined) => {
  return useQuery<Portfolio>({
    queryKey: ['portfolio', portfolioId],
    queryFn: () => getPortfolioById(portfolioId as string),
    enabled: !!portfolioId,
  });
};

export const usePortfolios = (params: GetPortfoliosParams = {}) => {
  return useQuery({
    queryKey: ['portfolios', params],
    queryFn: () => getPortfolios(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePortfolioPayload) => createPortfolio(data),
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create portfolio',
      );
    },
    onSuccess: () => {
      toast.success('Portfolio created successfully');
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePortfolioPayload }) =>
      updatePortfolio(id, data),
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update portfolio',
      );
    },
    onSuccess: (_, variables) => {
      toast.success('Portfolio updated successfully');
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.id] });
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePortfolio(id),
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete portfolio',
      );
    },
    onSuccess: (_, variables) => {
      toast.success('Portfolio deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables] });
    },
  });
};
