import {
  DateRange,
  DownloadUrlResponse,
  ExportFormat,
  ExportHistoryItem,
  ExportHistoryParams,
  ExportHistoryResponse,
  ExportRequest,
  ReportType
} from '@/services/api/schemas';

import { api } from '@/services/api';
import { getSession } from 'next-auth/react';

// Note: LTR backend does not expose /reports/* endpoints.
// Reports UI is powered by /organizations/:organizationId/exports.

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