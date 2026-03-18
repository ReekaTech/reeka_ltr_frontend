import {
  DateRange,
  ExportFormat,
  ExportHistoryItem,
  ExportHistoryParams,
  ExportHistoryResponse,
  ReportType
} from '@/services/api/schemas';
import { exportReports, getExportById, getExportDownloadUrl, getExportHistory } from '@/services/api/report';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useExportReports = () => {
  return useMutation({
    mutationFn: ({
      reportTypes,
      dateRange,
      propertyIds,
      format
    }: {
      reportTypes: ReportType[];
      dateRange: DateRange;
      propertyIds?: string[];
      format?: ExportFormat;
    }) => exportReports(reportTypes, dateRange, propertyIds, format),
    onSuccess: (blob) => {
      // Create download link for the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Export_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};

export const useExportHistory = (params: ExportHistoryParams = {}) => {
  return useQuery<ExportHistoryResponse>({
    queryKey: ['exportHistory', params],
    queryFn: () => getExportHistory(params),
  });
};

export const useExportById = (exportId: string) => {
  return useQuery<ExportHistoryItem>({
    queryKey: ['export', exportId],
    queryFn: () => getExportById(exportId),
    enabled: !!exportId,
  });
};

export const useExportDownloadUrl = () => {
  return useMutation({
    mutationFn: (exportId: string) => getExportDownloadUrl(exportId),
  });
}; 