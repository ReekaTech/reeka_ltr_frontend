import { createLease, getLeases } from '@/services/api/lease';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

export interface UseLeasesOptions {
  propertyId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: 'active' | 'completed';
}

export const useLeases = (options: UseLeasesOptions = {}) => {
  const { data: session } = useSession();
  const organizationId = session?.user?.organizationId;

  return useQuery({
    queryKey: ['leases', { ...options, organizationId }],
    queryFn: async () => {
      if (!organizationId) throw new Error('Organization ID is required');
      return getLeases({
        organizationId,
        ...options,
      });
    },
    enabled: !!organizationId,
  });
};

export const useCreateLease = () => {
  const { data: session } = useSession();
  const organizationId = session?.user?.organizationId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof createLease>[0]) => {
      if (!organizationId) throw new Error('Organization ID is required');
      return createLease(data);
    },
    onError: (error: any) => {
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to create lease';
      
      toast.error(errorMessage);
    },
    onSuccess: () => {
      toast.success('Lease created successfully');
      queryClient.invalidateQueries({ queryKey: ['leases'] });
    },
  });
}; 