import {
  AuthResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  InvitationResponsePayload,
  ResendVerificationPayload,
  ResetPasswordPayload,
  SigninPayload,
  SignupPayload,
  VerifyEmailPayload,
} from './schemas/auth';

import { api } from './api-service';
import axios from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:30000/api/v1';

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', payload);
  return response.data;
}

export async function signin(payload: SigninPayload): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>(
    `${baseURL}/auth/login`,
    payload,
  );
  return response.data;
}

export async function verifyEmail(payload: VerifyEmailPayload): Promise<void> {
  await api.post('/auth/verify-email', payload);
}

export async function resendVerification(
  payload: ResendVerificationPayload,
): Promise<void> {
  await api.post('/auth/resend-verification', payload);
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<void> {
  await api.post('/auth/forgot-password', payload);
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<void> {
  await api.post('/auth/reset-password', payload);
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  await api.post('/auth/change-password', payload);
}

export async function respondToInvitation(
  payload: InvitationResponsePayload,
): Promise<any> {
  const response = await api.post('/users/invitation-response', payload);
  return response.data;
}

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
