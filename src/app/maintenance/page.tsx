'use client';

import { Layout } from '@/components/ui/layout/layout';
import { MaintenanceList } from '@/components/maintenance/maintenance-list';

export default function MaintenancePage() {
  return (
    <Layout title="Maintenance" description="Manage your buildings with ease.">
        <MaintenanceList />
    </Layout>
  );
} 