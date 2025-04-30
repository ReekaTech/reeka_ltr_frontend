import { GetTenantsParams, PaginatedLeases, PaginatedTenants, Tenant } from '@/services/api/schemas';

import { api } from '@/services/api';
import { getSession } from 'next-auth/react';

/**
 * Get all tenants with optional filtering and pagination
 */
export async function fetchTenants(
  params: GetTenantsParams,
): Promise<PaginatedLeases> {
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
  if (params.search) queryParams.append('search', params.search);
  if (params.portfolioId) queryParams.append('portfolioId', params.portfolioId);

  const response = await api.get(`/organizations/${organizationId}/leases?${queryParams.toString()}`);
  return response.data;
}

/**
 * Update tenant payment status
 */
export async function updatePaymentStatus(
  tenantId: string,
  status: 'Paid' | 'Unpaid',
): Promise<Tenant> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.patch(`/organizations/${organizationId}/tenants/${tenantId}`, {
    paymentStatus: status,
  });
  return response.data;
} 