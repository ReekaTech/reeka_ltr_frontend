# Query Service Layer

This directory contains a reusable API query service layer built with TanStack
Query that provides consistent data fetching, pagination, and error handling
across the application.

## Structure

```
services/queries/
├── factories/           # Factory functions for creating query hooks
├── hooks/              # Custom query hooks for specific endpoints
├── utils/              # Utility functions for error handling
└── README.md           # This documentation
```

## Features

- ✅ Automatic pagination support
- ✅ Consistent return structure
- ✅ Centralized error handling with automatic redirects
- ✅ Type-safe query parameters and responses
- ✅ Reusable query factories

## Usage

### Creating a New Query Hook

1. Use the appropriate factory function:

   - `useQueryFactory` for single requests
   - `useInfiniteQueryFactory` for paginated requests

2. Define your types:

   ```typescript
   interface YourData {
     // Your data structure
   }

   interface YourParams {
     // Your query parameters
   }
   ```

3. Create the hook:
   ```typescript
   export function useYourQuery(params?: YourParams) {
     return useQueryFactory<YourData, YourParams>({
       queryKey: ['your-key'],
       queryFn: async params => {
         const response = await api.get('/your-endpoint', { params });
         return {
           data: response.data.items,
           paginationMeta: response.data.meta, // if paginated
         };
       },
       params,
     });
   }
   ```

### Using a Query Hook

```typescript
function YourComponent() {
  const { data, isLoading, isError, paginationMeta } = useUsersQuery({
    search: 'john',
    role: 'admin',
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred</div>;

  return (
    <div>
      {data?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      {paginationMeta && (
        <div>
          Page {paginationMeta.page} of {paginationMeta.totalPages}
        </div>
      )}
    </div>
  );
}
```

## Error Handling

The service layer automatically handles common HTTP errors:

- 401 → Redirects to `/auth/signin`
- 403 → Redirects to `/forbidden`
- 404 → Redirects to `/not-found`
- 500 → Redirects to `/server-error`
- Default → Redirects to `/error`

## Pagination

For paginated queries:

1. Use `useInfiniteQueryFactory`
2. Return `paginationMeta` in your query function
3. Access pagination data via the `paginationMeta` property

Example:

```typescript
const { data, paginationMeta } = useUsersQuery();
console.log(`Page ${paginationMeta?.page} of ${paginationMeta?.totalPages}`);
```
