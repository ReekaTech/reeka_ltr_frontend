import { Property } from "./property";
import { Tenant } from "@/services/api/schemas";

export type AdditionalCharges = Record<string, number>;

export interface Lease {
  _id: string;
  organizationId: string;
  propertyId?: string;
  property: Property;
  tenantId: string;
  startDate: string;
  endDate: string;
  rentalRate: number;
  paymentFrequency: string;
  notes: string;
  status?: 'active' | 'terminated' | 'expired';
  paymentStatus?: 'paid' | 'unpaid';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tenant?: Tenant;
  leaseAgreementUrl?: string;
  additionalCharges?: AdditionalCharges;
  __v: number;
}

export interface CreateLease {
  _id: string;
  organizationId: string;
  property: Property;
  tenantId: string;
  startDate: string;
}

export interface RenewLease {
  startDate: string;
  endDate: string;
  rentalRate: number;
  paymentFrequency: string;
  notes?: string;
  leaseAgreementUrl?: string;
  additionalCharges?: AdditionalCharges;
  propertyId: string;
}

export interface CancelLease {
  reasonForTermination: string;
}

export interface PaginatedLeases {
  items: Lease[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface GetLeasesParams {
  portfolioId?: string;
  propertyId?: string;
  organizationId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: 'active' | 'completed';
}