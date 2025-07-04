export enum ReportType {
  FINANCIAL = 'FINANCIAL',
  RENT_ROLL = 'RENT_ROLL',
  LEASE_EXPIRATION = 'LEASE_EXPIRATION',
  TENANT_DIRECTORY = 'TENANT_DIRECTORY',
}

export enum ExportFormat {
  SINGLE_FILE_MULTIPLE_SHEET = 'SINGLE_FILE_MULTIPLE_SHEET',
  SINGLE_FILE_SEPARATE_SHEET = 'SINGLE_FILE_SEPARATE_SHEET',
  SUMMARY_FILE_ONLY_SHEET = 'SUMMARY_FILE_ONLY_SHEET',
}

export enum ExportStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface ReportParams {
  startDate: string;
  endDate: string;
  portfolioId?: string;
  propertyId?: string;
  reportType?: string;
}

export interface ReportSummary {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  status: ExportStatus;
  generatedAt: string;
  period: string;
  downloadUrl?: string;
  data?: any;
}

export interface ReportData {
  reports: Report[];
  summary?: ReportSummary[];
  totalReports: number;
  availableTypes: ReportType[];
}

export interface DateRange {
  from: string;
  to: string;
}

export interface ExportFilters {
  dateRange: DateRange;
  propertyIds?: string[];
  portfolioIds?: string[];
}

export interface ExportRequest {
  reportTypes: ReportType[];
  filters: ExportFilters;
  format: ExportFormat;
}

export interface ReportFilters {
  dateRange: DateRange;
  portfolioId?: string;
  propertyId?: string;
  reportType?: ReportType;
  status?: ExportStatus;
}

// Export History Types
export interface ReportUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  id: string;
}

export interface ExportHistoryItem {
  _id: string;
  userId: ReportUser | null;
  organizationId: string;
  requestedAt: string;
  reportTypes: ReportType[];
  filters: {
    dateRange: DateRange;
    propertyIds: string[];
    _id: string;
  };
  format: ExportFormat;
  status: ExportStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  fileSizeBytes?: number;
  resultUrl?: string;
}

export interface ExportHistoryResponse {
  items: ExportHistoryItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ExportHistoryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: ExportStatus;
  reportType?: ReportType;
}

export interface DownloadUrlResponse {
  url: string;
} 