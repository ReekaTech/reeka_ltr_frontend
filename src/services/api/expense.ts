import { Expense, GetExpensesParams } from '@/services/api/schemas';

import { api } from '@/services/api';
import { getSession } from 'next-auth/react';

export interface PaginatedExpenses {
  items: Expense[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export async function getExpenses(params: GetExpensesParams): Promise<PaginatedExpenses> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const queryParams = new URLSearchParams();

  // Add pagination and sorting parameters
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  // Add filter parameters
  if (params.propertyId) queryParams.append('propertyId', params.propertyId);
  if (params.portfolioId) queryParams.append('portfolioId', params.portfolioId);
  if (params.search) queryParams.append('search', params.search);

  const response = await api.get(`/organizations/${organizationId}/expenses?${queryParams.toString()}`);
  return response.data;
}

export const getExpenseById = async (id: string): Promise<Expense> => {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.get(`/organizations/${organizationId}/expenses/${id}`);
  return response.data;
};

export const createExpense = async (data: Omit<Expense, '_id' | 'createdAt' | 'updatedAt' | '__v'>): Promise<Expense> => {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.post(`/organizations/${organizationId}/expenses`, data);
  return response.data;
};

export const updateExpense = async (id: string, data: Partial<Expense>): Promise<Expense> => {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.patch(`/organizations/${organizationId}/expenses/${id}`, data);
  return response.data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  await api.delete(`/organizations/${organizationId}/expenses/${id}`);
}; 