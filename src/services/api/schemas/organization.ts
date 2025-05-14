import * as Yup from 'yup';

export const organizationTargetRevenueSchema = Yup.object().shape({
  targetRevenue: Yup.number()
    .min(0, 'Target revenue must be a positive number')
    .required('Target revenue is required'),
});

export type OrganizationTargetRevenueRequest = Yup.InferType<typeof organizationTargetRevenueSchema>; 