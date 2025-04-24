import {
  CreatePortfolioPayload,
  Portfolio,
  UnassignedProperty,
  UpdatePortfolioPayload,
} from '@/services/api/schemas';

import { api } from './api-service';
import { getSession } from 'next-auth/react';

export interface GetPortfoliosParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedPortfolios {
  data: Portfolio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get all portfolios with optional filtering and pagination
 */
export async function getPortfolios(
  params: GetPortfoliosParams = {},
): Promise<Portfolio[]> {
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

  // Add search parameter
  if (params.search) queryParams.append('search', params.search);

  const response = await api.get<Portfolio[]>(`/organizations/${organizationId}/portfolios ${queryParams.toString() ? `?search=${queryParams.toString()}` : ''}`);
  return response.data;

}

/**
 * Get a portfolio by ID
 */
export async function getPortfolioById(id: string): Promise<Portfolio> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;

  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.get(`/organizations/${organizationId}/portfolios/${id}`);
  return response.data;
}

/**
 * Create a new portfolio
 */
export async function createPortfolio(
  data: CreatePortfolioPayload,
): Promise<Portfolio> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;

  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.post(`/organizations/${organizationId}/portfolios`, data);
  return response.data;
}

/**
 * Update an existing portfolio
 */
export async function updatePortfolio(
  id: string,
  data: UpdatePortfolioPayload,
): Promise<Portfolio> {
  const response = await api.patch(`/portfolios/${id}`, data);
  return response.data;
}

/**
 * Delete a portfolio
 */
export async function deletePortfolio(
  id: string,
): Promise<{ message: string }> {
  const response = await api.delete(`/portfolios/${id}`);
  return response.data;
}

/**
 * Add properties to a portfolio
 */
export async function addPropertiesToPortfolio(
  portfolioId: string,
  propertyIds: string[],
): Promise<Portfolio> {
  const response = await api.post(`/portfolios/${portfolioId}/properties`, {
    propertyIds,
  });
  return response.data;
}

/**
 * Remove properties from a portfolio
 */
export async function removePropertiesFromPortfolio(
  portfolioId: string,
  propertyIds: string[],
): Promise<Portfolio> {
  const response = await api.delete(`/portfolios/${portfolioId}/properties`, {
    data: { propertyIds },
  });
  return response.data;
}

export async function getUnassignedProperties(organizationId: string): Promise<UnassignedProperty[]> {
  const response = await api.get<UnassignedProperty[]>(
    `/organizations/${organizationId}/portfolios/unassigned-properties`,
  );
  return response.data;
}
