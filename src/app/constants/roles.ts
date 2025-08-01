export const allowedRoles = [
    'Maintenance',
    'Property Manager',
    'Admin', // Alias for Administrator
    'Associate Manager',
];

// Role-based module access definitions
export const modulePermissions = {
  'Admin': ['dashboard', 'listings', 'tenants', 'maintenance', 'reports', 'settings'], // Alias
  'Property Manager': ['listings', 'tenants', 'maintenance', 'reports'],
  'Associate Manager': ['listings', 'tenants', 'maintenance', 'reports'],
  'Maintenance': ['maintenance', 'settings'],
} as const;

// Granular action permissions
export const actionPermissions = {
  'Admin': ['add-property', 'add-portfolio', 'edit-property', 'delete-property', 'view-property', 'add-tenant', 'edit-tenant', 'delete-tenant', 'view-tenant', 'add-maintenance', 'edit-maintenance', 'delete-maintenance', 'view-maintenance', 'view-reports', 'manage-settings'],
  'Property Manager': ['edit-property', 'view-property', 'add-tenant', 'edit-tenant', 'view-tenant', 'add-maintenance', 'edit-maintenance', 'view-maintenance', 'view-reports'],
  'Associate Manager': ['view-property', 'add-tenant', 'edit-tenant', 'view-tenant', 'add-maintenance', 'edit-maintenance', 'view-maintenance', 'view-reports'],
  'Maintenance': ['view-maintenance', 'edit-maintenance'],
} as const;

// Route to module mapping
export const routeToModule = {
  '/dashboard': 'dashboard',
  '/': 'dashboard', // Root redirects to dashboard
  '/listings': 'listings',
  '/tenants': 'tenants', 
  '/maintenance': 'maintenance',
  '/reports': 'reports', // Future implementation
  '/settings': 'settings',
} as const;

// Get allowed modules for a role
export function getAllowedModules(role: string): readonly string[] {
  return modulePermissions[role as keyof typeof modulePermissions] || [];
}

// Check if user has access to a specific module
export function hasModuleAccess(role: string, module: string): boolean {
  const allowedModules = getAllowedModules(role);
  return allowedModules.includes(module);
}

// Get allowed actions for a role
export function getAllowedActions(role: string): readonly string[] {
  return actionPermissions[role as keyof typeof actionPermissions] || [];
}

// Check if user has access to a specific action
export function hasActionAccess(role: string, action: string): boolean {
  const allowedActions = getAllowedActions(role);
  return allowedActions.includes(action);
}

// Check if user has access to a specific route
export function hasRouteAccess(role: string, route: string): boolean {
  // Extract base route (remove query params and trailing slashes)
  const baseRoute = route.split('?')[0].replace(/\/$/, '') || '/';
  
  // Find matching module for the route
  const module = routeToModule[baseRoute as keyof typeof routeToModule];
  
  if (!module) {
    // For unmatched routes, check if it's a sub-route
    const matchingRoute = Object.keys(routeToModule).find(routeKey => 
      baseRoute.startsWith(routeKey) && routeKey !== '/'
    );
    
    if (matchingRoute) {
      const parentModule = routeToModule[matchingRoute as keyof typeof routeToModule];
      return hasModuleAccess(role, parentModule);
    }
    
    // Default to allow if no module mapping found (for auth pages, etc.)
    return true;
  }
  
  return hasModuleAccess(role, module);
}
