export enum ExpenseCategory {
  MAINTENANCE = 'maintenance',
  TAX = 'tax',
  UTILITY = 'utility',
  INSURANCE = 'insurance',
  REPAIR = 'repair',
  CLEANING = 'cleaning',
  GARDENING = 'gardening',
  SECURITY = 'security',
  OTHER = 'other',
}

export interface Expense {
  _id: string;
  organizationId: string;
  propertyId?: string;
  portfolioId?: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateExpensePayload {
  propertyId?: string;
  portfolioId?: string;
  organizationId?: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
} 

export interface GetExpensesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  propertyId?: string;
  portfolioId?: string;
  organizationId?: string;
  search?: string;
}