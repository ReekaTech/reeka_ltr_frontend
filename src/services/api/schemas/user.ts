import { UserRole } from '@/services/api/schemas';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  phone: string;
  phoneCountryCode: string;
  country: string;
  role: UserRole;
  invitationStatus: 'ACCEPTED' | 'PENDING' | 'OWNER' | 'EXPIRED' | null;
  lastInvitationSentAt: string | null;
  invitationAttempts: number;
  isEmailVerified: boolean;
  isActive: boolean;
  failedLoginAttempts: number;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface UserUpdatePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneCountryCode?: string;
}

export interface UserInvitePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  country: string;
  role: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}
