import { GetMaintenanceTicketsParams, MaintenanceTicket } from '@/services/api/schemas';
import type { Maintenance, MaintenanceFilters, UpdateMaintenanceStatusPayload } from './schemas/maintenance';

import { api } from '@/services/api';
import { getSession } from 'next-auth/react';

export interface PaginatedMaintenanceTickets {
  items: MaintenanceTicket[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export async function getMaintenanceTickets(params: GetMaintenanceTicketsParams): Promise<PaginatedMaintenanceTickets> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params.propertyId) queryParams.append('propertyId', params.propertyId);
  if (params.portfolioId) queryParams.append('portfolioId', params.portfolioId);
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);

  const response = await api.get(`/organizations/${organizationId}/maintenance?${queryParams.toString()}`);
  return response.data;
}

export async function createMaintenanceTicket(data: Omit<MaintenanceTicket, '_id' | 'createdAt' | 'updatedAt' | '__v'>): Promise<MaintenanceTicket> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.post(`/organizations/${organizationId}/maintenance`, data);
  return response.data;
}

export async function updateMaintenanceStatus(
  ticketId: string,
  payload: UpdateMaintenanceStatusPayload,
): Promise<MaintenanceTicket> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.patch(`/organizations/${organizationId}/maintenance/${ticketId}/status`, payload);
  return response.data;
} 