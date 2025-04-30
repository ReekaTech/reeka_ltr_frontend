export type MaintenanceStatus = 'open' | 'in_progress' | 'completed';
export type RequestType = 'Light' | 'Water' | 'Cleaning' | 'Appliances' | 'Gardening';

export interface Maintenance {
  _id: string;
  ticketNumber: string;
  description: string;
  property: string;
  dateOfCreation: string;
  requestType: RequestType;
  status: MaintenanceStatus;
}

export interface MaintenanceTicket {
  _id: string;
  organizationId?: string;
  propertyId?: string;
  portfolioId?: string;
  description: string;
  title: string;
  priority: string;
  type: RequestType;
  ticketNumber?: string;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  attachments?: string[];
  property?: {
    name: string;
  };
}

export interface UpdateMaintenanceStatusPayload {
  status: MaintenanceStatus;
}

export interface MaintenanceFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  portfolioId?: string;
  status?: MaintenanceStatus;
}

export interface GetMaintenanceTicketsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  propertyId?: string;
  portfolioId?: string;
  organizationId?: string;
  search?: string;
  status?: MaintenanceStatus;
}
  