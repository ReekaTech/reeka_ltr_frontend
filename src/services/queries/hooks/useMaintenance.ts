import { createMaintenanceTicket, getMaintenanceTickets } from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { GetMaintenanceTicketsParams } from '@/services/api/schemas';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

export function useMaintenanceTickets(params: Omit<GetMaintenanceTicketsParams, 'organizationId'>) {
  const { data: session } = useSession();
  const organizationId = session?.user?.organizationId;

  return useQuery({
    queryKey: ['maintenanceTickets', { ...params, organizationId }],
    queryFn: () => getMaintenanceTickets({ ...params, organizationId }),
    enabled: !!organizationId,
  });
}

export const useCreateMaintenanceTicket = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof createMaintenanceTicket>[0]) => {
      if (!session?.user?.organizationId) {
        throw new Error('Organization ID is required');
      }
      return createMaintenanceTicket(data);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create maintenance ticket',
      );
    },
    onSuccess: () => {
      toast.success('Maintenance ticket created successfully');
      queryClient.invalidateQueries({ queryKey: ['maintenanceTickets'] });
    },
  });
}; 