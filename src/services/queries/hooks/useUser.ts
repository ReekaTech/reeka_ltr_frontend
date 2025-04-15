import {
  GetUsersParams,
  User,
  UserInvitePayload,
  UserUpdatePayload,
} from '@/services/api/schemas';
import {
  getUserById,
  getUsers,
  inviteUser,
  retryInvite,
  updateUser,
  uploadAvatar,
} from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-toastify';

export const useUser = (userId: string | undefined) => {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId as string),
    enabled: !!userId,
  });
};

export const useUsers = (params: GetUsersParams = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdatePayload }) =>
      updateUser(id, data),
    onError: (error: any) => {
      // Handle axios error object to extract the backend message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const backendError =
          error.response.data?.message || error.response.data?.error;
        if (backendError) {
          toast.error(backendError);
          return;
        }
      }
      toast.error(error.message || 'Failed to update profile');
    },
    onSuccess: (_, variables) => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadAvatar(id, file),
    onError: error => {
      toast.error(error.message || 'Failed to upload avatar');
    },
    onSuccess: (_, variables) => {
      toast.success('Avatar uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};

export const useInviteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserInvitePayload) => inviteUser(data),
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to invite user',
      );
    },
    onSuccess: () => {
      toast.success('Invitation sent successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useRetryInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => retryInvite(id),
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to retry invitation',
      );
    },
    onSuccess: () => {
      toast.success('Invitation resent successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
