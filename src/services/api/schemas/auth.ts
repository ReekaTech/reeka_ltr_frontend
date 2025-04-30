export enum UserRole {
  VENDOR = 'Vendor',
  TENANT = 'Tenant',
  OWNER = 'Owner',
  PROPERTY_MANAGER = 'Property Manager',
  BUILDING = 'Building and Maintenance',
  ADMIN = 'Administrator',
  FRONT_DESK = 'Front Desk',
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
