import { api } from '../../api/api-service';
import { useInfiniteQueryFactory } from '../factories/use-query-factory';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersQueryParams {
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useUsersQuery(params?: UsersQueryParams) {
  return useInfiniteQueryFactory<User[], UsersQueryParams>({
    queryKey: ['users'],
    queryFn: async ({ page, ...restParams }) => {
      const response = await api.get('/users', {
        params: {
          page,
          limit: 10,
          ...restParams,
        },
      });

      return {
        data: response.data.items,
        paginationMeta: {
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages,
        },
      };
    },
    params,
  });
}
