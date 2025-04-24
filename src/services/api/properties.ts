import {
  CreatePropertyPayload,
  GetPropertiesParams,
  Property,
  UpdatePropertyPayload,
} from '@/services/api/schemas';

import { api } from './api-service';

export interface PaginatedProperties {
  items: Property[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Get all properties with optional filtering and pagination
 */
export async function getProperties(
  params: GetPropertiesParams,
): Promise<PaginatedProperties> {
  const queryParams = new URLSearchParams();

  // Add pagination and sorting parameters
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  // Add filter parameters
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  if (params.portfolioId) queryParams.append('portfolioId', params.portfolioId);
  const response = await api.get(`/organizations/${params.organizationId}/properties?${queryParams.toString()}`);
  return response.data;
}

/**
 * Get a property by ID
 */
export async function getPropertyById(organizationId: string, id: string): Promise<Property> {
  const response = await api.get(`/organizations/${organizationId}/properties/${id}`);
  return response.data;
}

/**
 * Create a new property
 */
export async function createProperty(
  organizationId: string,
  data: CreatePropertyPayload,
): Promise<Property> {
  const response = await api.post(`/organizations/${organizationId}/properties`, data);
  return response.data;
}

/**
 * Update a property
 */
export async function updateProperty(
  organizationId: string,
  id: string,
  data: UpdatePropertyPayload,
): Promise<Property> {
  const response = await api.put(`/organizations/${organizationId}/properties/${id}`, data);
  return response.data;
}

/**
 * Delete a property
 */
export async function deleteProperty(organizationId: string, id: string): Promise<void> {
  await api.delete(`/organizations/${organizationId}/properties/${id}`);
}
