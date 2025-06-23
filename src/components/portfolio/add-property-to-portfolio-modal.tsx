'use client';

import { useAddPropertiesToPortfolio, useUnassignedProperties } from '@/services/queries/hooks';
import { useEffect, useState } from 'react';

import { Modal } from '@/components/ui/modal';
import type { Property } from '@/services/api/schemas';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddPropertyToPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
}

export function AddPropertyToPortfolioModal({
  isOpen,
  onClose,
  portfolioId,
}: AddPropertyToPortfolioModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  // Fetch unassigned properties
  const { data: unassignedProperties = [], isLoading } = useUnassignedProperties();
  const addPropertiesMutation = useAddPropertiesToPortfolio();

  // Reset form on open/close
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedProperties([]);
    }
  }, [isOpen]);

  const filteredProperties = unassignedProperties.filter(
    property =>
      property.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId],
    );
  };

  const handleSubmit = async () => {
    if (selectedProperties.length === 0) return;

    try {
      await addPropertiesMutation.mutateAsync({
        portfolioId,
        propertyIds: selectedProperties,
      });
      onClose();
    } catch (error) {
      console.error('Failed to add properties:', error);
    }
  };

  const footerContent = (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={selectedProperties.length === 0 || addPropertiesMutation.isPending}
      className="hover:bg-opacity-90 w-full rounded-md bg-green-600 py-3 text-white transition-colors focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {addPropertiesMutation.isPending ? 'Adding...' : 'Add'}
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Property"
      showFooter
      footerContent={footerContent}
      contentClassName="max-w-lg"
    >
      <div className="space-y-4">
        {/* Description */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-900">Properties</h3>
          <p className="mb-4 text-sm text-gray-500">
            Select which properties you want to add to the portfolio
          </p>
        </div>

        {/* Search Properties */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Properties"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-gray-50 py-3 pr-4 pl-10 focus:border-green-600 focus:ring-green-600 focus:outline-none"
          />
        </div>

        {/* Property List */}
        <div className="max-h-60 space-y-2 overflow-y-auto" role="listbox" aria-label="Properties to add">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-green-600"></div>
            </div>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map(property => {
              const isSelected = selectedProperties.includes(property._id as string);
              return (
                <label
                  key={property._id}
                  className={cn(
                    'flex cursor-pointer items-center rounded-md p-3 transition-colors',
                    isSelected ? 'bg-green-50' : 'hover:bg-gray-50'
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePropertySelection(property._id as string)}
                      className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-600 sr-only"
                      aria-describedby={`property-${property._id}-label`}
                    />
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
                        isSelected
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-300 bg-white'
                      )}
                    >
                      {isSelected && (
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <span id={`property-${property._id}-label`} className="block text-sm font-medium text-gray-700">
                      {property.name}
                    </span>
                  </div>
                </label>
              );
            })
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">
              {searchQuery
                ? 'No properties match your search criteria'
                : 'No unassigned properties available'}
            </p>
          )}
        </div>

        {/* Selection counter */}
        {selectedProperties.length > 0 && (
          <div className="text-sm text-gray-600">
            {selectedProperties.length} propert{selectedProperties.length === 1 ? 'y' : 'ies'} selected
          </div>
        )}
      </div>
    </Modal>
  );
} 