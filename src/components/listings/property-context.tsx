'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  useProperties,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
} from '@/services/queries/hooks';
import type {
  Property,
  CreatePropertyPayload,
  UpdatePropertyPayload,
  GetPropertiesParams,
} from '@/services/api/schemas';

type PropertyContextType = {
  properties: Property[];
  isLoading: boolean;
  filters: GetPropertiesParams;
  setFilters: (filters: Partial<GetPropertiesParams>) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  totalCount: number;
  createProperty: (data: CreatePropertyPayload) => Promise<void>;
  updateProperty: (id: string, data: UpdatePropertyPayload) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
};

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined,
);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<GetPropertiesParams>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load view mode from localStorage on client-side
  useEffect(() => {
    const savedViewMode = localStorage.getItem('propertyViewMode');
    if (
      savedViewMode === 'grid' ||
      (savedViewMode === 'list' && viewMode !== savedViewMode)
    ) {
      setViewMode(savedViewMode as 'grid' | 'list');
    }
  }, []);

  // Use React Query hooks
  const { data, isLoading, refetch } = useProperties(filters);
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const deleteMutation = useDeleteProperty();

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('propertyViewMode', viewMode);
  }, [viewMode]);

  // Build the context value
  const value: PropertyContextType = {
    properties: data?.data || [],
    isLoading,
    filters,
    setFilters: newFilters => setFilters(prev => ({ ...prev, ...newFilters })),
    viewMode,
    setViewMode,
    totalCount: data?.total || 0,
    createProperty: async data => {
      await createMutation.mutateAsync(data);
    },
    updateProperty: async (id, data) => {
      await updateMutation.mutateAsync({ id, data });
    },
    deleteProperty: async id => {
      await deleteMutation.mutateAsync(id);
    },
    refetch: async () => {
      await refetch();
    },
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyContext() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error(
      'usePropertyContext must be used within a PropertyProvider',
    );
  }
  return context;
}
