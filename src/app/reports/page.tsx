'use client';

import { Layout } from '@/components/ui';
import ReportContainer from '@/components/reports/report.container';
import { RoleProtection } from '@/components/hocs/with-role-protection';

export default function ReportsPage() {
  return (
    <RoleProtection requiredModule="reports">
      <Layout title="Reports" description="View your reports and analytics.">
        <ReportContainer />
      </Layout>
    </RoleProtection>
  );
} 