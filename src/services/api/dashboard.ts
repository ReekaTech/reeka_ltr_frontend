import { DashboardParams, OverviewData, PortfolioData, PropertyData } from '@/services/api/schemas';

import { api } from '@/services/api';
import { getSession } from 'next-auth/react';

export async function getOverviewData(params: DashboardParams): Promise<OverviewData> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  // Remove undefined or empty string filters
  const queryParams = new URLSearchParams();
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.portfolioId) queryParams.append('portfolioId', params.portfolioId);
  if (params.propertyId) queryParams.append('propertyId', params.propertyId);

  const response = await api.get(`/dashboard/overview/${organizationId}`, {
    params: Object.fromEntries(queryParams)
  });

  // Ensure all required data structures are properly initialized
  const data = response.data;
  
  // Initialize revenueData if not present
  if (!data.revenueData || !data.revenueData.dates || !data.revenueData.actual || !data.revenueData.ideal) {
    data.revenueData = {
      dates: [],
      actual: [],
      ideal: []
    };
  }

  // Initialize unitStats if not present
  if (!data.unitStats || !Array.isArray(data.unitStats)) {
    data.unitStats = [];
  }

  // Initialize metrics if not present
  if (!data.metrics || !Array.isArray(data.metrics)) {
    data.metrics = [];
  }

  // Initialize renewals if not present
  if (!data.renewals || !Array.isArray(data.renewals)) {
    data.renewals = [];
  }

  // Initialize maintenanceData if not present
  if (!data.maintenanceData || !Array.isArray(data.maintenanceData)) {
    data.maintenanceData = [];
  }

  // Initialize propertyList if not present
  if (!data.propertyList || !Array.isArray(data.propertyList)) {
    data.propertyList = [];
  }

  // Initialize tenantList if not present
  if (!data.tenantList || !Array.isArray(data.tenantList)) {
    data.tenantList = [];
  }

  return data;
}

export async function getPortfolioData(params: DashboardParams): Promise<PortfolioData> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  // Remove undefined or empty string filters
  const queryParams = new URLSearchParams();
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.portfolioId) queryParams.append('portfolioId', params.portfolioId);
  if (params.propertyId) queryParams.append('propertyId', params.propertyId);

  const response = await api.get(`/dashboard/portfolio/${organizationId}`, {
    params: Object.fromEntries(queryParams)
  });

  // Ensure all required data structures are properly initialized
  const data = response.data;

  // Initialize metrics if not present
  if (!data.metrics || !Array.isArray(data.metrics)) {
    data.metrics = [];
  }

  // Initialize renewals if not present
  if (!data.renewals || !Array.isArray(data.renewals)) {
    data.renewals = [];
  }

  // Initialize unitStats if not present
  if (!data.unitStats || !Array.isArray(data.unitStats)) {
    data.unitStats = [];
  }

  // Initialize maintenanceData if not present
  if (!data.maintenanceData || !Array.isArray(data.maintenanceData)) {
    data.maintenanceData = [];
  }

  // Initialize propertyList if not present
  if (!data.propertyList || !Array.isArray(data.propertyList)) {
    data.propertyList = [];
  }

  return data;
}

export async function getPropertyData(params: DashboardParams): Promise<PropertyData> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  // Remove undefined or empty string filters
  const queryParams = new URLSearchParams();
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.portfolioId) queryParams.append('portfolioId', params.portfolioId);
  if (params.propertyId) queryParams.append('propertyId', params.propertyId);

  const response = await api.get(`/dashboard/property/${organizationId}`, {
    params: Object.fromEntries(queryParams)
  });

  // Ensure all required data structures are properly initialized
  const data = response.data;

  // Initialize metrics if not present
  if (!data.metrics || !Array.isArray(data.metrics)) {
    data.metrics = [];
  }

  // Initialize maintenanceData if not present
  if (!data.maintenanceData || !Array.isArray(data.maintenanceData)) {
    data.maintenanceData = [];
  }

  // Initialize tenantList if not present
  if (!data.tenantList || !Array.isArray(data.tenantList)) {
    data.tenantList = [];
  }

  return data;
} 