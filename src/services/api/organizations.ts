import type { OrganizationTargetRevenueRequest } from '@/services/api/schemas';
import { api } from './api-service';

export const organizationsApi = {
  updateTargetRevenue: (organizationId: string, data: OrganizationTargetRevenueRequest) =>
    api.put<OrganizationTargetRevenueRequest>(
      `/organizations/${organizationId}/target-revenue`,
      data,
    ),
  getTargetRevenue: (organizationId: string) =>
    api.get(`/organizations/${organizationId}/target-revenue`),
}; 