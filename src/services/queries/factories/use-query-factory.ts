import {
  InfiniteData,
  UseInfiniteQueryOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import { handleQueryError } from '../utils/handle-query-error';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface QueryResult<T> {
  data: T;
  paginationMeta?: PaginationMeta;
}

interface QueryFactoryOptions<T, P> {
  queryKey: string[];
  queryFn: (params: P) => Promise<QueryResult<T>>;
  params?: P;
  options?: Omit<
    UseQueryOptions<QueryResult<T>, Error>,
    'queryKey' | 'queryFn'
  >;
}

interface InfiniteQueryFactoryOptions<T, P> {
  queryKey: string[];
  queryFn: (params: P & { page: number }) => Promise<QueryResult<T>>;
  params?: P;
  options?: Omit<
    UseInfiniteQueryOptions<QueryResult<T>, Error>,
    'queryKey' | 'queryFn'
  >;
}

export function useQueryFactory<T, P = void>({
  queryKey,
  queryFn,
  params,
  options,
}: QueryFactoryOptions<T, P>) {
  return useQuery<QueryResult<T>, Error>({
    queryKey: [...queryKey, params],
    queryFn: () => queryFn(params as P),
    throwOnError: true,
    ...options,
  });
}

export function useInfiniteQueryFactory<T, P = void>({
  queryKey,
  queryFn,
  params,
  options,
}: InfiniteQueryFactoryOptions<T, P>) {
  return useInfiniteQuery({
    queryKey: [...queryKey, params],
    queryFn: ({ pageParam = 1 }) =>
      queryFn({ ...params, page: pageParam } as P & { page: number }),
    getNextPageParam: lastPage => {
      const { paginationMeta } = lastPage;
      if (!paginationMeta) return undefined;
      return paginationMeta.page < paginationMeta.totalPages
        ? paginationMeta.page + 1
        : undefined;
    },
    initialPageParam: 1,
    throwOnError: true,
    ...options,
  });
}
