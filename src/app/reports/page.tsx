'use client';

import { Layout } from '@/components/ui';
import { RoleProtection } from '@/components/hocs/with-role-protection';

export default function ReportsPage() {
  return (
    <RoleProtection requiredModule="reports">
      <Layout title="Reports" description="View your reports and analytics.">
        <div className="space-y-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Reports Coming Soon</h2>
            <p className="text-gray-500">
              This section will contain detailed reports and analytics about your properties.
            </p>
          </div>
        </div>
      </Layout>
    </RoleProtection>
  );
} 