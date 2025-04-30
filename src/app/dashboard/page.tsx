'use client';

import { Layout, Tabs, TabsContent } from '@/components/ui';
import { useEffect, useState } from 'react';

import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  

  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Properties', value: 'properties' },
    { label: 'Portfolios', value: 'portfolios' },
  ];
  
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e36b37] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Layout title={`${session?.user.organizationName} Dashboard`} description={formatDate(new Date().toISOString())}>
      <div className="space-y-4">
        <Tabs
          items={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
        />

        <TabsContent value="overview" activeValue={activeTab}>
            <div>Overview</div>
        </TabsContent>

        <TabsContent value="properties" activeValue={activeTab}>
            <div>Properties</div>
        </TabsContent>

        <TabsContent value="portfolios" activeValue={activeTab}>
            <div>Portfolios</div>
        </TabsContent>
      </div>
    </Layout>
  );
}
