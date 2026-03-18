import { useMutation } from '@tanstack/react-query';

import { uploadPropertyImages } from '@/services/api/upload';

export const useUploadPropertyImages = () => {
  return useMutation<string[], Error, File[]>({
    mutationFn: uploadPropertyImages,
  });
};