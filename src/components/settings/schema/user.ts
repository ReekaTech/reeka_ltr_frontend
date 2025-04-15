import * as Yup from 'yup';

export const StaffFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string().matches(
    /^[0-9]+$/,
    'Phone number must contain only digits',
  ),
  phoneCountryCode: Yup.string().required('Country code is required'),
  country: Yup.string().required('Country is required'),
  role: Yup.string().required('Role is required'),
});
