// export interface Tenant {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     startDate: string;
//     endDate: string;
//     currentRate: number;
//     paymentFrequency: 'Annually' | 'Monthly';
//     paymentStatus: 'Paid' | 'Unpaid';
//   }

export interface GetTenantsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  portfolioId?: string;
}

export interface PaginatedTenants {
  items: Tenant[];
  total: number;
  pages: number;
  currentPage: number;
}

export interface Tenant {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  isEmailVerified?: boolean;
  failedLoginAttempts?: number;
  isActive?: boolean;
  phone: string;
  phoneCountryCode: string;
  country?: string;
  role?: string;
  invitationStatus?: string | null;
  invitationToken?: string | null;
  lastInvitationSentAt?: string | null;
  invitationAttempts?: number;
  isInvited?: boolean;
  gender: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  fullName?: string;
  id?: string;
  _id?: string;
}
