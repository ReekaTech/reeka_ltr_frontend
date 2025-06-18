import { Property } from "./property";

export interface DashboardMetrics {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  bgColor: string;
  subtitle?: string;
}

export interface Renewal {
  propertyName: string;
  tenantName: string;
  renewalDate: string;
}

export interface UnitStat {
  label: string;
  value: number;
  color: string;
  twColor: string;
}

export interface MaintenanceIssue {
  issueTitle: string;
  tenantName: string;
  propertyName: string;
  timeAgo: string;
}

export interface DashboardProperty {
  name: string;
  location: string;
  imageUrl: string;
}

export interface DashboardTenant {
  name: string;
  status: 'Paid' | 'Delinquent';
  lastPaymentDate: string;
}

export interface RevenueData {
  dates: string[];
  actual: number[];
  ideal: number[];
}

export interface RevenueSummary {
  current: number;
  target: number;
  completion: number;
}

export interface Revenue {
  chartData: RevenueData;
  summary: RevenueSummary;
  target: number;
}

export interface OverviewData {
  metrics: DashboardMetrics[];
  revenue: Revenue;
  units: UnitStat[];
  renewals: Renewal[];
  maintenance: MaintenanceIssue[];
}

export interface PortfolioData {
  metrics: DashboardMetrics[];
  renewals: Renewal[];
  units: UnitStat[];
  maintenance: MaintenanceIssue[];
  properties: DashboardProperty[];
}

export interface PropertyData {
  metrics: DashboardMetrics[];
  maintenance: MaintenanceIssue[];
  tenants: DashboardTenant[];
}

export interface DashboardParams {
  startDate: string;
  endDate: string;
  portfolioId?: string;
  propertyId?: string;
}

export interface DashboardParams {
  startDate: string;
  endDate: string;
  portfolioId?: string;
  propertyId?: string;
} 