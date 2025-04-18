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
  updateProperty,
} from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-toastify';

export const useProperties = (params: GetPropertiesParams = {}) => {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => getProperties(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyPayload) => createProperty(data),
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create property',
      );
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
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyPayload }) =>
      updateProperty(id, data),
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update property',
      );
    },
    onSuccess: () => {
      toast.success('Property updated successfully');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete property',
      );
    },
    onSuccess: () => {
      toast.success('Property deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};
