import { Property } from "./property";

export interface Tenant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  failedLoginAttempts: number;
  isActive: boolean;
  phone: string;
  phoneCountryCode: string;
  country: string;
  role: string;
  invitationStatus: string | null;
  invitationToken: string | null;
  lastInvitationSentAt: string | null;
  invitationAttempts: number;
  isInvited: boolean;
  gender: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullName: string;
  id: string;
}

export interface Lease {
  _id: string;
  organizationId: string;
  property: Property;
  tenantId: Tenant;
  startDate: string;
  endDate: string;
  rentalRate: number;
  depositAmount: number;
  paymentFrequency: string;
  notes: string;
  status: 'active' | 'completed';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

  
  export interface PaginatedLeases {
    items: Lease[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }
  
  
  export interface GetLeasesParams {
    propertyId?: string;
    organizationId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    status?: 'active' | 'completed';
  }