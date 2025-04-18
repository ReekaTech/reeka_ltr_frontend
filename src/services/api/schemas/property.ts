/**
 * Property model returned from the API
 */
export interface Property {
  id: string;
  name: string;
  location: string;
  status: string;
  image: string;
  description?: string;
  price?: number;
  currency?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload for creating a new property
 */
export interface CreatePropertyPayload {
  name: string;
  location: string;
  status: string;
  image: string;
  description?: string;
  price?: number;
  currency?: string;
  address?: string;
}

/**
 * Payload for updating an existing property
 */
export interface UpdatePropertyPayload {
  name?: string;
  location?: string;
  status?: string;
  image?: string;
  description?: string;
  price?: number;
  currency?: string;
  address?: string;
}

/**
 * Parameters for filtering properties
 */
export interface GetPropertiesParams {
  search?: string;
  location?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
