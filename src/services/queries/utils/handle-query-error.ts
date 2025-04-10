import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export const handleQueryError = (error: unknown) => {
  const router = useRouter();
  const axiosError = error as AxiosError;
  const status = axiosError.response?.status;

  switch (status) {
    case 401:
      router.push('/auth/signin');
      break;
    case 403:
      router.push('/forbidden');
      break;
    case 404:
      router.push('/not-found');
      break;
    case 500:
      router.push('/server-error');
      break;
    default:
      router.push('/error');
      break;
  }

  return error;
};
