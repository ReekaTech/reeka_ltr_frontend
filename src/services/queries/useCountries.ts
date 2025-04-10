import { Country } from '@/services/api/schemas/country';
import { getCountries } from '../api/countries';
import { useQuery } from '@tanstack/react-query';

export const useCountries = () => {
  return useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: getCountries,
  });
};
