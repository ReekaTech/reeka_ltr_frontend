'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  useCreatePortfolio,
  useUpdatePortfolio,
  useDeletePortfolio,
  usePortfolios as usePortfoliosQuery,
} from '@/services/queries/hooks';
import { GetPortfoliosParams } from '@/services/api';
import type {
  Portfolio,
  CreatePortfolioPayload,
  UpdatePortfolioPayload,
} from '@/services/api/schemas';

type PortfolioContextType = {
  portfolios: Portfolio[];
  isLoading: boolean;
  filters: GetPortfoliosParams;
  setFilters: (filters: Partial<GetPortfoliosParams>) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  totalCount: number;
  createPortfolio: (data: CreatePortfolioPayload) => Promise<void>;
  updatePortfolio: (id: string, data: UpdatePortfolioPayload) => Promise<void>;
  deletePortfolio: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<GetPortfoliosParams>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load view mode from localStorage on client-side
  useEffect(() => {
    const savedViewMode = localStorage.getItem('portfolioViewMode');
    if (
      savedViewMode === 'grid' ||
      (savedViewMode === 'list' && viewMode !== savedViewMode)
    ) {
      setViewMode(savedViewMode as 'grid' | 'list');
    }
  }, []);

  // Use React Query hooks
  const { data, isLoading, refetch } = usePortfoliosQuery(filters);
  const createMutation = useCreatePortfolio();
  const updateMutation = useUpdatePortfolio();
  const deleteMutation = useDeletePortfolio();

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('portfolioViewMode', viewMode);
  }, [viewMode]);

  // Build the context value
  const value: PortfolioContextType = {
    portfolios: data?.data || [],
    isLoading,
    filters,
    setFilters: newFilters =>
      setFilters((prev: GetPortfoliosParams) => ({ ...prev, ...newFilters })),
    viewMode,
    setViewMode,
    totalCount: data?.total || 0,
    createPortfolio: async data => {
      await createMutation.mutateAsync(data);
    },
    updatePortfolio: async (id, data) => {
      await updateMutation.mutateAsync({ id, data });
    },
    deletePortfolio: async id => {
      await deleteMutation.mutateAsync(id);
    },
    refetch: async () => {
      await refetch();
    },
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolios() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolios must be used within a PortfolioProvider');
  }
  return context;
}
