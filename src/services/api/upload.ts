import { getSession } from 'next-auth/react';

import { api } from './api-service';

export interface UploadUrlsResponse {
  urls: string[];
}

async function getOrganizationIdFromSession(): Promise<string> {
  const session = await getSession();
  const organizationId = (session as any)?.user?.organizationId as string | undefined;
  if (!organizationId) {
    throw new Error('Organization ID not found in session');
  }
  return organizationId;
}

/**
 * Upload property images to the LTR backend (GCS) and return public URLs.
 *
 * Backend route:
 * POST /organizations/:organizationId/uploads/images
 * multipart/form-data field name: files
 * response: { urls: string[] }
 */
export async function uploadPropertyImages(files: File[]): Promise<string[]> {
  if (!files.length) return [];
  const organizationId = await getOrganizationIdFromSession();

  const form = new FormData();
  for (const f of files) form.append('files', f);

  const res = await api.post<UploadUrlsResponse>(
    `/organizations/${organizationId}/uploads/images`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return res.data.urls ?? [];
}

/**
 * Upload maintenance ticket attachments to the LTR backend (GCS) and return public URLs.
 *
 * Backend route:
 * POST /organizations/:organizationId/uploads/attachments
 * multipart/form-data field name: files
 * response: { urls: string[] }
 */
export async function uploadMaintenanceAttachments(files: File[]): Promise<string[]> {
  if (!files.length) return [];
  const organizationId = await getOrganizationIdFromSession();

  const form = new FormData();
  for (const f of files) form.append('files', f);

  const res = await api.post<UploadUrlsResponse>(
    `/organizations/${organizationId}/uploads/attachments`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return res.data.urls ?? [];
}