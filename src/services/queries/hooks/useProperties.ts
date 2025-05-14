import {
  CreatePropertyPayload,
  GetPropertiesParams,
  Property,
  UpdatePropertyPayload,
} from '@/services/api/schemas';
import {
  createProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  updateProperty,
} from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { PaginatedProperties } from '@/services/api/schemas/property';
import { getSession } from 'next-auth/react';
import { toast } from 'react-toastify';

export function useProperties(params?: Partial<GetPropertiesParams>) {
  return useQuery<PaginatedProperties>({
    queryKey: ['properties', params],
    queryFn: async () => {
      const session = await getSession();
      if (!session?.user.organizationId) {
        throw new Error('Organization ID not found in session');
      }
      return getProperties({ ...params, organizationId: session.user.organizationId });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePropertyPayload) => {
      const session = await getSession();
      if (!session?.user.organizationId) {
        throw new Error('Organization ID not found in session');
      }
      return createProperty(session.user.organizationId, data);
    },
    onError: (error: any) => {
      // Handle array of error messages
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to create property';
      
      toast.error(errorMessage);
    },
    onSuccess: () => {
      toast.success('Property created successfully');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePropertyPayload }) => {
      const session = await getSession();
      if (!session?.user.organizationId) {
        throw new Error('Organization ID not found in session');
      }
      return updateProperty(session.user.organizationId, id, data);
    },
    onError: (error: any) => {
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to create property';
      
      toast.error(errorMessage);
    },
    onSuccess: (_, { id }) => {
      toast.success('Property updated successfully');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const session = await getSession();
      if (!session?.user.organizationId) {
        throw new Error('Organization ID not found in session');
      }
      return deleteProperty(session.user.organizationId, id);
    },
    onError: (error: any) => {
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message || error.message || 'Failed to create property';
      
      toast.error(errorMessage);
    },
    onSuccess: () => {
      toast.success('Property deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export function useProperty(id: string) {
  return useQuery<Property>({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Property ID is required');
      }
      const session = await getSession();
      if (!session?.user.organizationId) {
        throw new Error('Organization ID not found in session');
      }
      return getPropertyById(session.user.organizationId, id);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
}
