'use client';

import { Layout } from '@/components/ui';
import React from 'react'
import { RoleProtection } from '@/components/hocs/with-role-protection';
import { TenantList } from '@/components/tenants/tenant-list';

const TenantsPage = () => {
  return (
    <RoleProtection requiredModule="tenants">
      <Layout title="Tenants" description="Manage your tenants with ease.">
          <TenantList />
      </Layout>
    </RoleProtection>
  )
}

export default TenantsPage;