import { Country } from '@/services/api/schemas';
import { api } from '@/services/api';

export async function getCountries(): Promise<Country[]> {
  const response = await api.get('/countries');
  const data = response.data;

  return data.map((country: any) => ({
    id: country._id,
    name: country.name,
    code: country.code,
    dial_code: country.dial_code,
    flag: country.flag || '🇺🇸', // Fallback flag if not provided
  }));
}
