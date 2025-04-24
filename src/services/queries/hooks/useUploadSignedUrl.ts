import { SignedUrlRequest, SignedUrlResponse, getSignedUrl } from '@/services/api/upload';

import { useMutation } from '@tanstack/react-query';

export const useUploadSignedUrl = () => {
  return useMutation<SignedUrlResponse, Error, SignedUrlRequest>({
    mutationFn: getSignedUrl,
  });
}; 