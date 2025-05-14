import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { OrganizationTargetRevenueRequest } from '../../api/schemas/organization';
import { organizationsApi } from '../../api/organizations';
import { toast } from 'react-toastify';

export function useOrganizationQuery(organizationId?: string) {
  return useQuery({
    queryKey: ['organization', organizationId, 'target-revenue'],
    queryFn: () => organizationsApi.getTargetRevenue(organizationId!),
    enabled: !!organizationId,
  });
}

export function useUpdateTargetRevenueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }: {
      organizationId: string;
      data: OrganizationTargetRevenueRequest;
    }) => organizationsApi.updateTargetRevenue(organizationId, data),
    onSuccess: () => {
      toast.success('Target revenue updated successfully');
      queryClient.invalidateQueries({ queryKey: ['organization'] });
    },
    onError: (error: any) => {
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to update target revenue';
      
      toast.error(errorMessage);
    },
  });
} 