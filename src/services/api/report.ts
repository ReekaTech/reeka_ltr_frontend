import {
  DateRange,
  DownloadUrlResponse,
  ExportFormat,
  ExportHistoryItem,
  ExportHistoryParams,
  ExportHistoryResponse,
  ExportRequest,
  ReportData,
  ReportParams,
  ReportType
} from '@/services/api/schemas';

import { api } from '@/services/api';
import { getSession } from 'next-auth/react';

export async function getReportData(params: ReportParams): Promise<ReportData> {
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
  if (params.reportType) queryParams.append('reportType', params.reportType);

  const response = await api.get(`/reports/${organizationId}`, {
    params: Object.fromEntries(queryParams)
  });

  // Ensure all required data structures are properly initialized
  const data = response.data;
  
  // Initialize reports if not present
  if (!data.reports || !Array.isArray(data.reports)) {
    data.reports = [];
  }

  // Initialize summary if not present
  if (!data.summary || !Array.isArray(data.summary)) {
    data.summary = [];
  }

  // Initialize availableTypes if not present
  if (!data.availableTypes || !Array.isArray(data.availableTypes)) {
    data.availableTypes = [];
  }

  // Ensure totalReports is a number
  if (typeof data.totalReports !== 'number') {
    data.totalReports = data.reports.length;
  }

  return data;
}

export async function generateReport(params: ReportParams & { reportType: string }): Promise<{ reportId: string }> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.post(`/reports/${organizationId}/generate`, {
    startDate: params.startDate,
    endDate: params.endDate,
    portfolioId: params.portfolioId,
    propertyId: params.propertyId,
    reportType: params.reportType
  });

  return response.data;
}

export async function downloadReport(reportId: string): Promise<{ downloadUrl: string }> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.get(`/reports/${organizationId}/${reportId}/download`);
  return response.data;
}

export async function exportReports(
  reportTypes: ReportType[],
  dateRange: DateRange,
  propertyIds?: string[],
  format: ExportFormat = ExportFormat.SINGLE_FILE_MULTIPLE_SHEET
): Promise<Blob> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const exportRequest: ExportRequest = {
    reportTypes,
    filters: {
      dateRange,
      propertyIds: propertyIds || []
    },
    format
  };

  const response = await api.post(`/organizations/${organizationId}/exports`, exportRequest, {
    responseType: 'blob'
  });

  return response.data;
}

export async function getExportHistory(params: ExportHistoryParams = {}): Promise<ExportHistoryResponse> {
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
  if (params.status) queryParams.append('status', params.status);
  if (params.reportType) queryParams.append('reportType', params.reportType);

  const response = await api.get(`/organizations/${organizationId}/exports`, {
    params: Object.fromEntries(queryParams)
  });

  return response.data;
}

export async function getExportById(exportId: string): Promise<ExportHistoryItem> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.get(`/organizations/${organizationId}/exports/${exportId}`);
  return response.data;
}

export async function getExportDownloadUrl(exportId: string): Promise<DownloadUrlResponse> {
  const session = await getSession();
  const organizationId = session?.user?.organizationId;
  
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const response = await api.get(`/organizations/${organizationId}/exports/${exportId}/download-url`);
  return response.data;
} 