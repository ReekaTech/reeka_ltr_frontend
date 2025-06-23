'use client';

import { Layout } from '@/components/ui/layout/layout';
import { MaintenanceList } from '@/components/maintenance/maintenance-list';
import { RoleProtection } from '@/components/hocs/with-role-protection';

export default function MaintenancePage() {
  return (
    <RoleProtection requiredModule="maintenance">
      <Layout title="Maintenance" description="Manage your buildings with ease.">
          <MaintenanceList />
      </Layout>
    </RoleProtection>
  );
} 