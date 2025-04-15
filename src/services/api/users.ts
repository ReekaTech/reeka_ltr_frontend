import {
  GetUsersParams,
  PaginatedUsers,
  User,
  UserInvitePayload,
  UserUpdatePayload,
} from '@/services/api/schemas';

import { api } from '@/services/api';

export async function getUsers(
  params: GetUsersParams = {},
): Promise<PaginatedUsers> {
  const queryParams = new URLSearchParams();

  // Add pagination and sorting parameters
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  // Add filter parameters
  if (params.firstName) queryParams.append('firstName', params.firstName);
  if (params.lastName) queryParams.append('lastName', params.lastName);
  if (params.email) queryParams.append('email', params.email);
  if (params.role) queryParams.append('role', params.role);

  const response = await api.get(`/users?${queryParams.toString()}`);
  return response.data;
}

export async function getUserById(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function updateUser(
  id: string,
  data: UserUpdatePayload,
): Promise<User> {
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
}

export async function inviteUser(
  data: UserInvitePayload,
): Promise<{ message: string }> {
  const response = await api.post('/users/invite', data);
  return response.data;
}

export async function uploadAvatar(
  id: string,
  file: File,
): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.post(`/users/${id}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function retryInvite(id: string): Promise<{ message: string }> {
  const response = await api.post(`/users/invite/retry/${id}`);
  return response.data;
}
