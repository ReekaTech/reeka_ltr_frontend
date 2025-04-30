import { fetchTenants, updatePaymentStatus } from '@/services/api/tenants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { GetTenantsParams } from '@/services/api/tenants';
import { toast } from 'react-toastify';

export function useTenantsQuery(params: GetTenantsParams) {
  return useQuery({
    queryKey: ['tenants', params],
    queryFn: () => fetchTenants(params),
  });
}

export function useUpdatePaymentStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, status }: { tenantId: string; status: 'Paid' | 'Unpaid' }) =>
      updatePaymentStatus(tenantId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Payment status updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to update payment status';
      
      toast.error(errorMessage);
    },
  });
} 