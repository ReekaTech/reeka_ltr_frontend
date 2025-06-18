import { DashboardParams, OverviewData, PortfolioData, PropertyData } from '@/services/api/schemas';
import { getOverviewData, getPortfolioData, getPropertyData } from '@/services/api/dashboard';

import { useQuery } from '@tanstack/react-query';

export const useOverviewData = (params: DashboardParams) => {
  // Remove undefined or empty string filters
  const cleanParams = {
    ...params,
    portfolioId: params.portfolioId || undefined,
    propertyId: params.propertyId || undefined
  };

  return useQuery<OverviewData>({
    queryKey: ['overview', cleanParams],
    queryFn: () => getOverviewData(cleanParams),
  });
};

export const usePortfolioData = (params: DashboardParams) => {
  // Remove undefined or empty string filters
  const cleanParams = {
    ...params,
    portfolioId: params.portfolioId || undefined,
    propertyId: params.propertyId || undefined
  };

  return useQuery<PortfolioData>({
    queryKey: ['portfolio', cleanParams],
    queryFn: () => getPortfolioData(cleanParams),
  });
};

export const usePropertyData = (propertyId: string, params: DashboardParams) => {
  // Remove undefined or empty string filters
  const cleanParams = {
    ...params,
    portfolioId: params.portfolioId || undefined,
    propertyId: params.propertyId || undefined
  };

  return useQuery<PropertyData>({
    queryKey: ['property', propertyId, cleanParams],
    queryFn: () => getPropertyData(cleanParams),
    enabled: true // Always enable the query
  });
}; 