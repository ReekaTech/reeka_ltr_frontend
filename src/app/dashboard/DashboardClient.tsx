'use client';

import { Layout, Tabs, TabsContent } from '@/components/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { formatDate, getDateRangeOption } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui';
import { ChevronDown } from 'lucide-react';
import type { DateRangeOption } from '@/lib/utils';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import Overview from '@/components/dashboard/overview';
import type { Portfolio as PaginatedPortfolio } from '@/services/api/schemas';
import { PaginatedProperties } from '@/services/api/schemas/property';
import Portfolio from '@/components/dashboard/portfolio';
import Properties from '@/components/dashboard/properties';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

const tabs = [
  {
    label: 'Overview',
    value: 'overview',
    content: <Overview />,
  },
  {
    label: 'Portfolio',
    value: 'portfolio',
    content: <Portfolio />,
  },
  {
    label: 'Properties',
    value: 'properties',
    content: <Properties />,
  },
];

export default function DashboardClient({ properties, portfolios }: { properties: PaginatedProperties, portfolios: PaginatedPortfolio[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [portfolioSearch, setPortfolioSearch] = useState('');
  const [propertiesSearch, setPropertiesSearch] = useState('');
  const [filterType, setFilterType] = useState<DateRangeOption>('this_year');
  const initializedRef = useRef(false);
  
  // Store selected filters
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  const { data: session, status } = useSession();

  // Update URL parameters based on active tab
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear both filters first
    params.delete('portfolio');
    params.delete('property');
    
    // Add the appropriate filter based on active tab
    if (activeTab === 'portfolio' && selectedPortfolio) {
      params.set('portfolio', selectedPortfolio);
    } else if (activeTab === 'properties' && selectedProperty) {
      params.set('property', selectedProperty);
    }
    
    router.push(`?${params.toString()}`);
  }, [activeTab, selectedPortfolio, selectedProperty]);

  // Initialize filters from URL params
  useEffect(() => {
    const portfolioId = searchParams.get('portfolio');
    const propertyId = searchParams.get('property');
    
    if (portfolioId) setSelectedPortfolio(portfolioId);
    if (propertyId) setSelectedProperty(propertyId);
  }, [searchParams]);

  // Set default selections when data becomes available
  useEffect(() => {
    if (portfolios.length > 0 && !selectedPortfolio) {
      setSelectedPortfolio(portfolios[0]._id);
    }
  }, [portfolios, selectedPortfolio]);

  useEffect(() => {
    if (properties.items.length > 0 && !selectedProperty) {
      setSelectedProperty(properties.items[0]._id);
    }
  }, [properties.items, selectedProperty]);



  // Update URL when date range changes
  const updateDateRange = useCallback((start: Date, end: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('startDate', format(start, 'yyyy-MM-dd'));
    params.set('endDate', format(end, 'yyyy-MM-dd'));
    params.set('filterType', filterType);
    router.push(`?${params.toString()}`);
  }, [router, searchParams, filterType]);

  // Initialize date range from URL params or set default
  useEffect(() => {
    if (initializedRef.current) return;
    
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const filterTypeParam = searchParams.get('filterType');

    if (filterTypeParam) {
      setFilterType(filterTypeParam as DateRangeOption);
    }

    if (startDateParam && endDateParam) {
      setStartDate(new Date(startDateParam));
      setEndDate(new Date(endDateParam));
    } else {
      // If no URL params, set default date range and update URL immediately
      const { startDate: defaultStartDate, endDate: defaultEndDate } = getDateRangeOption('this_year');
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
      setFilterType('this_year');
      
      // Update URL with default date range immediately
      const params = new URLSearchParams();
      params.set('startDate', format(defaultStartDate, 'yyyy-MM-dd'));
      params.set('endDate', format(defaultEndDate, 'yyyy-MM-dd'));
      params.set('filterType', 'this_year');
      router.replace(`?${params.toString()}`, { scroll: false });
    }
    
    initializedRef.current = true;
  }, [searchParams, router]);

  const handleDateRangeChange = (startDate: Date, endDate: Date, filterType: DateRangeOption) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setFilterType(filterType);
    updateDateRange(startDate, endDate);
  };

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
      <div className="space-y-8">
        <Tabs
          items={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
          rightSlot={
            <div className="flex items-center gap-4">
              {activeTab === 'portfolio' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border border-solid bg-white text-[#6d6d6d] hover:bg-gray-50 h-auto py-2 px-3"
                    >
                      <span>
                        {selectedPortfolio
                          ? portfolios.find(p => p._id === selectedPortfolio)?.name || 'Select Portfolio'
                          : portfolios.length > 0 
                            ? 'Select Portfolio'
                            : 'No Portfolios'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 bg-white" align="end">
                    <div className="p-2">
                      <input
                        type="text"
                        className="w-full rounded-md border border-[#d0d5dd] px-2 py-1 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                        placeholder="Search portfolio..."
                        value={portfolioSearch}
                        onChange={(e) => setPortfolioSearch(e.target.value)}
                      />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {portfolios
                        .filter(portfolio => 
                          portfolio.name.toLowerCase().includes(portfolioSearch.toLowerCase())
                        )
                        .map(portfolio => (
                          <button
                            key={portfolio._id}
                            className={`flex w-full items-center px-4 py-2 text-left hover:bg-gray-100 ${
                              portfolio._id === selectedPortfolio ? 'bg-gray-50 text-[#e36b37]' : ''
                            }`}
                            onClick={() => setSelectedPortfolio(portfolio._id)}
                          >
                            {portfolio.name}
                          </button>
                        ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              {activeTab === 'properties' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border border-solid bg-white text-[#6d6d6d] hover:bg-gray-50 h-auto py-2 px-3"
                    >
                      <span>
                        {selectedProperty
                          ? properties.items.find(p => p._id === selectedProperty)?.name || 'Select Property'
                          : properties.items.length > 0 
                            ? 'Select Property'
                            : 'No Properties'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 bg-white" align="end">
                    <div className="p-2">
                      <input
                        type="text"
                        className="w-full rounded-md border border-[#d0d5dd] px-2 py-1 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                        placeholder="Search property..."
                        value={propertiesSearch}
                        onChange={(e) => setPropertiesSearch(e.target.value)}
                      />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {properties.items
                        .filter(property => 
                          property.name.toLowerCase().includes(propertiesSearch.toLowerCase())
                        )
                        .map(property => (
                          <button
                            key={property._id}
                            className={`flex w-full items-center px-4 py-2 text-left hover:bg-gray-100 ${
                              property._id === selectedProperty ? 'bg-gray-50 text-[#e36b37]' : ''
                            }`}
                            onClick={() => setSelectedProperty(property._id)}
                          >
                            {property.name}
                          </button>
                        ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <DateRangePicker
                showPredefinedOptions={true}
                defaultFilterType={filterType}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          }
        />

        <TabsContent value="overview" activeValue={activeTab}>
          <Overview />
        </TabsContent>

        <TabsContent value="portfolio" activeValue={activeTab}>
          <Portfolio />
        </TabsContent>

        <TabsContent value="properties" activeValue={activeTab}>
          <Properties />
        </TabsContent>
      </div>
    </Layout>
  );
} 