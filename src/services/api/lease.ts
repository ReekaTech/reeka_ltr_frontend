import { CancelLease, GetLeasesParams, Lease, PaginatedLeases, RenewLease } from '@/services/api/schemas';

import { api } from '@/services/api';
import { getSession } from 'next-auth/react';

/**
 * Get all leases with optional filtering and pagination
 */
export async function getLeases(
  params: GetLeasesParams,
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

  // Add filter parameters
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  if (params.propertyId) queryParams.append('propertyId', params.propertyId);

  const response = await api.get(`/organizations/${organizationId}/leases/portfolio/${params.portfolioId}?${queryParams.toString()}`);
  return response.data;
}

/**
 * Get a lease by ID
 */
export async function getLeaseById(id: string): Promise<Lease> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.get(`/organizations/${organizationId}/leases/${id}`);
  return response.data;
}

/**
 * Create a new lease
 */
export async function createLease(data: Partial<Lease>): Promise<Lease> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.post(`/organizations/${organizationId}/leases`, data);
  return response.data;
}

/**
 * Update a lease
 */
export async function updateLease(id: string, data: RenewLease): Promise<Lease> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.put(`/organizations/${organizationId}/leases/${id}`, data);
  return response.data;
}

/**
 * Delete a lease
 */
export async function deleteLease(id: string): Promise<void> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  await api.delete(`/organizations/${organizationId}/leases/${id}`);
}

/**
 * Cancel a lease
 */
export async function cancelLease(id: string, data: CancelLease): Promise<Lease> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.patch(`/organizations/${organizationId}/leases/${id}/cancel`, data);
  return response.data;
}

/**
 * Renew a lease
 */
export async function renewLease(id: string, data: RenewLease): Promise<Lease> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.put(`/organizations/${organizationId}/leases/${id}/renew`, data);
  return response.data;
}
