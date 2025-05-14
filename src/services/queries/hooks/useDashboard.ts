import { DashboardParams, OverviewData, PortfolioData, PropertyData } from '@/services/api/schemas';
import { getOverviewData, getPortfolioData, getPropertyData } from '@/services/api/dashboard';

import { useQuery } from '@tanstack/react-query';

export const useOverviewData = (params: DashboardParams) => {
  return useQuery<OverviewData>({
    queryKey: ['overview', params],
    queryFn: () => getOverviewData(params),
  });
};

export const usePortfolioData = (params: DashboardParams) => {
  return useQuery<PortfolioData>({
    queryKey: ['portfolio', params],
    queryFn: () => getPortfolioData(params),
  });
};

export const usePropertyData = (propertyId: string, params: DashboardParams) => {
  return useQuery<PropertyData>({
    queryKey: ['property', propertyId, params],
    queryFn: () => getPropertyData(params),
  });
}; 