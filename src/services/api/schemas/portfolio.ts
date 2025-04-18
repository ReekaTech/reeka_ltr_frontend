/**
 * Portfolio model returned from the API
 */
export interface Portfolio {
  id: string;
  name: string;
  propertyCount: number;
  properties?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload for creating a new portfolio
 */
export interface CreatePortfolioPayload {
  name: string;
  properties?: string[]; // Optional array of property IDs to add to the portfolio
}

/**
 * Payload for updating an existing portfolio
 */
export interface UpdatePortfolioPayload {
  name?: string;
  properties?: string[]; // Optional array of property IDs to update in the portfolio
}
