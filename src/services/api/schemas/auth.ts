export enum UserRole {
  PROPERTY_MANAGER = 'Property Manager',
  MAINTENANCE = 'Maintenance',
  ADMIN = 'Admin',
  ASSOCIATE_MANAGER = 'Associate Manager',
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  phoneCountryCode: string;
  role?: UserRole;
}

export interface SigninPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface InvitationResponsePayload {
  token: string;
  action: 'accept' | 'reject';
  currentPassword?: string; // Only needed when accepting
  newPassword?: string; // Only needed when accepting
}

export interface AuthResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    isEmailVerified: boolean;
    role: UserRole;
  };
  organizationId: string;
  organizationName: string;
}
