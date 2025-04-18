'use client';

import {
  EnhancedPropertyListings,
  PropertyProvider,
} from '@/components/listings';
import { Layout, Tabs, TabsContent } from '@/components/ui';

import { ContextPortfolioManagement } from '@/components/portfolio/context-portfolio-management';
import { PortfolioProvider } from '@/components/portfolio';
import { useState } from 'react';

export default function ListingsPage() {
  const [activeTab, setActiveTab] = useState('properties');
  const [propertyCount, setPropertyCount] = useState(0);
  const [portfolioCount, setPortfolioCount] = useState(0);

  const tabs = [
    { label: 'Properties', value: 'properties' },
    { label: 'Portfolios', value: 'portfolios' },
  ];

  return (
    <Layout title="Listings" description="Manage your listings with ease.">
      <div className="space-y-4">
        <Tabs
          items={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
          rightSlot={
            activeTab === 'properties' ? (
              <div className="text-xs font-light text-gray-500">
                {propertyCount}{' '}
                {propertyCount === 1 ? 'Property' : 'Properties'}
              </div>
            ) : (
              <div className="text-xs font-light text-gray-500">
                {portfolioCount}{' '}
                {portfolioCount === 1 ? 'Portfolio' : 'Portfolios'}
              </div>
            )
          }
        />

        <TabsContent value="properties" activeValue={activeTab}>
          <PropertyProvider>
            <EnhancedPropertyListings onTotalCountChange={setPropertyCount} />
          </PropertyProvider>
        </TabsContent>

        <TabsContent value="portfolios" activeValue={activeTab}>
          <PortfolioProvider>
            <ContextPortfolioManagement
              onTotalCountChange={setPortfolioCount}
            />
          </PortfolioProvider>
        </TabsContent>
      </div>
    </Layout>
  );
}
