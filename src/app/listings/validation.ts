import * as Yup from 'yup';

import { ExpenseCategory } from '@/services/api/schemas';

export const propertyValidationSchema = Yup.object().shape({
  name: Yup.string().required('Property name is required'),
  type: Yup.string()
    .oneOf(['block_of_flats', 'detached_house', 'duplex'], 'Invalid property type')
    .required('Property type is required'),
  countryId: Yup.string().required('Country is required'),
  contactPerson: Yup.string().required('Contact person is required'),
  address: Yup.string().required('Address is required'),
  rooms: Yup.object().shape({
    bedrooms: Yup.number().min(1, 'Must have at least 1 bedroom').required('Number of bedrooms is required'),
    bathrooms: Yup.number().min(1, 'Must have at least 1 bathroom').required('Number of bathrooms is required')
  }),
  rentalPrice: Yup.number().min(0, 'Base price must be 0 or greater').required('Base price is required'),
});

export const leaseValidationSchema = Yup.object().shape({
  tenant: Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    currentAddress: Yup.string().required('Current address is required'),
    gender: Yup.string().required('Gender is required'),
    phoneCountryCode: Yup.string().required('Phone country code is required'),
    phone: Yup.string().required('Phone number is required'),
  }),
  propertyId: Yup.string().required('Property ID is required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End date is required'),
  rentalRate: Yup.number().required('Rental rate is required').min(0, 'Rental rate must be positive'),
  paymentFrequency: Yup.string().required('Payment frequency is required'),
  notes: Yup.string(),
});

export const expenseValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  category: Yup.string()
    .oneOf(Object.values(ExpenseCategory), 'Invalid category')
    .required('Category is required'),
  amount: Yup.number()
    .min(0, 'Amount must be greater than or equal to 0')
    .required('Amount is required'),
  date: Yup.string().required('Date is required'),
});

export const maintenanceValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  type: Yup.string().required('Request type is required'),
  priority: Yup.string().required('Priority is required'),
}); 