import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

import { Session } from 'next-auth';

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:30000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(async config => {
  const session = (await getSession()) as Session;
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Response interceptor for refresh token
// api.interceptors.response.use(
//   response => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };
//     if (!originalRequest) return Promise.reject(error);

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         // Skip refresh token logic for server-side requests
//         if (typeof window === 'undefined') {
//           return Promise.reject(error);
//         }

//         const session = (await getSession()) as Session;
//         const response = await axios.get(`${baseURL}/auth/refresh`, {
//           headers: {
//             'X-Refresh-Token': session.refreshToken,
//           },
//         });

//         const { accessToken, refreshToken } = response.data?.tokens;
//         session.accessToken = accessToken;
//         session.refreshToken = refreshToken;

//         originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         // Skip signOut for server-side requests
//         if (typeof window !== 'undefined') {
//           await signOut();
//         }
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   },
// );
