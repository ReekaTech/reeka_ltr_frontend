/**
 * Property model returned from the API
 */
export interface Property {
  _id: string;
  organizationId: string;
  name: string;
  type: string;
  countryId: string;
  address: string;
  targetAmount?: number;
  rooms: {
    bedrooms: number;
    bathrooms: number;
  };
  amenities: {
    [key: string]: {
      available: boolean;
      quantity: number;
    };
  };
  imageUrls: string[];
  rentalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload for creating a new property
 */
export interface CreatePropertyPayload {
  name: string;
  status: string;
  imageUrls: string[];
  address?: string;
  type: string;
  countryId: string;
  contactPerson?: string;
  portfolioId?: string;
  targetAmount?: number;
  rooms: {
    bedrooms: number;
    bathrooms: number;
    studios?: number;
  };
  amenities: {
    [key: string]: {
      available: boolean;
      quantity?: number;
    };
  };
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
  imageUrls?: string[];
  targetAmount?: number;
  amenities?: {
    [key: string]: {
      available: boolean;
      quantity: number;
    };
  };
}

/**
 * Parameters for filtering properties
 */
export interface GetPropertiesParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  organizationId: string;
  portfolioId?: string;
}

export interface PaginatedProperties {
  items: Property[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}


export interface PropertyFormData {
  portfolioId?: string;
  name: string;
  type: string;
  countryId: string;
  address: string;
  targetAmount?: number;
  rooms: {
    bedrooms: number;
    bathrooms: number;
    studios: number;
  };
  amenities: {
    [key: string]: {
      available: boolean;
      quantity?: number;
    };
  };
  images: File[];
  imagePreviews: string[];
  contactPerson: string;
  status: 'listed' | 'unlisted';
}
