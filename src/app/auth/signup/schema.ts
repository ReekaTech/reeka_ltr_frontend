import * as Yup from 'yup';

import { Country } from '@/services/api/schemas/country';

export interface SignupFormValues {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  dial_code: string;
  company: string;
}

export const getInitialValues = (countries?: Country[]): SignupFormValues => ({
  lastName: '',
  firstName: '',
  email: '',
  phone: '',
  country: countries?.[0]?.id || '',
  password: '',
  dial_code: countries?.[0]?.dial_code || '',
  company: '',
});

export const SignupSchema = Yup.object().shape({
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Last name is required'),
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('First name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(8, 'Too Short!')
    .max(15, 'Too Long!')
    .required('Phone number is required'),
  country: Yup.string().required('Country is required'),
  dial_code: Yup.string().required('Dial code is required'),
  password: Yup.string()
    .min(8, 'Too Short!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    )
    .required('Password is required'),
  company: Yup.string()
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Company name is required'),
});
