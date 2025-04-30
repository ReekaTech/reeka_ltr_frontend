import type { MaintenanceFilters, UpdateMaintenanceStatusPayload } from '@/services/api/schemas/maintenance';
import { createMaintenanceTicket, getMaintenanceTickets } from '@/services/api';
import { getMaintenanceTickets as getMaintenanceTicketsApi, updateMaintenanceStatus } from '@/services/api/maintenance';
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
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to create maintenance ticket';
      
      toast.error(errorMessage);
    },
    onSuccess: () => {
      toast.success('Maintenance ticket created successfully');
      queryClient.invalidateQueries({ queryKey: ['maintenanceTickets'] });
    },
  });
};

export function useMaintenanceQuery(filters: MaintenanceFilters = {}) {
  return useQuery({
    queryKey: ['maintenance', filters],
    queryFn: () => getMaintenanceTicketsApi(filters),
  });
}

export function useUpdateMaintenanceStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: string; status: UpdateMaintenanceStatusPayload['status'] }) =>
      updateMaintenanceStatus(ticketId, { status }),
    onSuccess: () => {
      toast.success('Maintenance status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
    onError: (error: any) => {
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to update maintenance status';
      
      toast.error(errorMessage);
    },
  });
} 