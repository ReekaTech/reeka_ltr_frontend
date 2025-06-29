import {
  CreatePortfolioPayload,
  Portfolio,
  UpdatePortfolioPayload,
} from '@/services/api/schemas';
import {
  GetPortfoliosParams,
  addPropertiesToPortfolio,
  createPortfolio,
  deletePortfolio,
  getPortfolioById,
  getPortfolios,
  getUnassignedProperties,
  removePropertiesFromPortfolio,
  updatePortfolio
} from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

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
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to create portfolio';
      
      toast.error(errorMessage);
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
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to update portfolio';
      
      toast.error(errorMessage);
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
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to delete portfolio';
      
      toast.error(errorMessage);
    },
    onSuccess: (_, variables) => {
      toast.success('Portfolio deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables] });
    },
  });
};

export const useUnassignedProperties = () => {
  const { data: session } = useSession();
  const organizationId = session?.user?.organizationId;

  return useQuery({
    queryKey: ['unassignedProperties', organizationId],
    queryFn: () => {
      if (!organizationId) {
        throw new Error('Organization ID is required');
      }
      return getUnassignedProperties(organizationId);
    },
    enabled: !!organizationId,
  });
};

export const useAddPropertiesToPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ portfolioId, propertyIds }: { portfolioId: string; propertyIds: string[] }) =>
      addPropertiesToPortfolio(portfolioId, propertyIds),
    onError: (error: any) => {
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to add properties to portfolio';
      
      toast.error(errorMessage);
    },
    onSuccess: (_, variables) => {
      toast.success('Properties added successfully');
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['unassignedProperties'] });
    },
  });
};

export const useRemovePropertiesFromPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ portfolioId, propertyIds }: { portfolioId: string; propertyIds: string[] }) =>
      removePropertiesFromPortfolio(portfolioId, propertyIds),
    onError: (error: any) => {
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to remove properties from portfolio';
      
      toast.error(errorMessage);
    },
    onSuccess: (_, variables) => {
      toast.success('Properties removed successfully');
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['unassignedProperties'] });
    },
  }); 
};