import { Layout } from '@/components/ui';
import React from 'react'
import { TenantList } from '@/components/tenants/tenant-list';

const TenantsPage = () => {
  return (
    <Layout title="Tenants" description="Manage your tenants with ease.">
        <TenantList />
    </Layout>
  )
}

export default TenantsPage;