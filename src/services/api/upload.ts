import { api } from './api-service';
import axios from 'axios';

export interface SignedUrlRequest {
  type: 'single' | 'bulk';
  extension: string;
}

export interface SignedUrlResponse {
  url: string;
  key: string;
}

/**
 * Get a pre-signed URL from our API for S3 upload
 * Uses our api instance which includes:
 * - Base URL configuration
 * - Authentication headers
 * - Error handling
 * - Request/response interceptors
 */
export const getSignedUrl = async (data: SignedUrlRequest): Promise<SignedUrlResponse> => {
  const response = await api.post<SignedUrlResponse>('/upload/signed-url', data);
  return response.data;
};

/**
 * Upload file directly to S3 using the pre-signed URL
 * Uses axios instead of fetch for:
 * - Consistent error handling with the rest of the app
 * - Better TypeScript support
 * - Automatic JSON parsing
 * - Request/response interceptors
 * Note: We use a new axios instance to avoid our api instance's base URL and interceptors
 */
export const uploadToS3 = async (signedUrl: string, file: File, key: string): Promise<void> => {
  await axios.put(signedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
}; 