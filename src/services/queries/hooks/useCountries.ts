import { Country } from '@/services/api/schemas';
import { getCountries } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export const useCountries = () => {
  return useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: getCountries,
  });
};
