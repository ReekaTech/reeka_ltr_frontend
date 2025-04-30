import { CreateExpensePayload, GetExpensesParams } from '@/services/api/schemas';
import { createExpense, getExpenses } from '@/services/api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useExpenses(params: Omit<GetExpensesParams, 'organizationId'>) {
  const { data: session } = useSession();
  const organizationId = session?.user?.organizationId;

  return useQuery({
    queryKey: ['expenses', { ...params, organizationId }],
    queryFn: () => getExpenses({ ...params, organizationId }),
    enabled: !!organizationId,
  });
}

export const useCreateExpense = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpensePayload) => {
      if (!session?.user?.organizationId) {
        throw new Error('Organization ID is required');
      }
      return createExpense({ ...data, organizationId: session.user.organizationId });
    },
    onSuccess: () => {
      // Invalidate expenses query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense created successfully');
    },
    onError: (error: any) => {
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to create expense';
      
      toast.error(errorMessage);
    },
  });
}; 