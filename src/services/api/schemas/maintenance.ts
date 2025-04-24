export interface MaintenanceTicket {
    _id: string;
    organizationId?: string;
    propertyId?: string;
    portfolioId?: string;
    description: string;
    title: string;
    priority: string;
    type: string;
    ticketNumber?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    dueDate?: string;
    attachments?: string[];
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
  }
  