import {
  CreatePropertyPayload,
  GetPropertiesParams,
  Property,
  UpdatePropertyPayload,
} from '@/services/api/schemas';

import { api } from './api-service';

export interface PaginatedProperties {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get all properties with optional filtering and pagination
 */
export async function getProperties(
  params: GetPropertiesParams = {},
): Promise<PaginatedProperties> {
  const queryParams = new URLSearchParams();

  // Add pagination and sorting parameters
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  // Add filter parameters
  if (params.search) queryParams.append('search', params.search);
  if (params.location) queryParams.append('location', params.location);
  if (params.status) queryParams.append('status', params.status);

  const response = await api.get(`/properties?${queryParams.toString()}`);
  return response.data;
}

/**
 * Get a property by ID
 */
export async function getPropertyById(id: string): Promise<Property> {
  const response = await api.get(`/properties/${id}`);
  return response.data;
}

/**
 * Create a new property
 */
export async function createProperty(
  data: CreatePropertyPayload,
): Promise<Property> {
  const response = await api.post('/properties', data);
  return response.data;
}

/**
 * Update an existing property
 */
export async function updateProperty(
  id: string,
  data: UpdatePropertyPayload,
): Promise<Property> {
  const response = await api.put(`/properties/${id}`, data);
  return response.data;
}

/**
 * Delete a property
 */
export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/properties/${id}`);
}
