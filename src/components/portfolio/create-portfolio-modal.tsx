'use client';

import { useEffect, useState } from 'react';

import type { CreatePortfolioPayload } from '@/services/api/schemas';
import { Modal } from '@/components/ui/modal';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Property {
  id: string;
  name: string;
  location: string;
}

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreatePortfolioPayload) => Promise<void>;
  properties: Property[];
}

export function CreatePortfolioModal({
  isOpen,
  onClose,
  onSave,
  properties,
}: CreatePortfolioModalProps) {
  const [portfolioName, setPortfolioName] = useState('');
  const [nameError, setNameError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  // Reset form on open/close
  useEffect(() => {
    if (isOpen) {
      setPortfolioName('');
      setNameError('');
      setSearchQuery('');
      setSelectedProperties([]);
    }
  }, [isOpen]);

  const filteredProperties = properties.filter(
    property =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!portfolioName.trim()) {
      setNameError('Portfolio name is required');
      return;
    }

    onSave({
      name: portfolioName,
      properties:
        selectedProperties.length > 0 ? selectedProperties : undefined,
    });
    onClose();
  };

  const footerContent = (
    <button
      type="submit"
      form="create-portfolio-form"
      className="hover:bg-opacity-90 w-full rounded-md bg-[#e36b37] py-3 text-white transition-colors focus:ring-2 focus:ring-[#e36b37] focus:ring-offset-2 focus:outline-none"
    >
      Create Portfolio
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Portfolio"
      showFooter
      footerContent={footerContent}
    >
      <form
        id="create-portfolio-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Portfolio Name */}
        <div>
          <label
            htmlFor="portfolio-name"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Name<span className="text-red-500">*</span>
          </label>
          <input
            id="portfolio-name"
            type="text"
            value={portfolioName}
            onChange={e => {
              setPortfolioName(e.target.value);
              if (nameError) setNameError('');
            }}
            placeholder="Name"
            className={cn(
              'w-full rounded-md border border-gray-200 px-4 py-3 focus:border-[#e36b37] focus:ring-[#e36b37] focus:outline-none',
              nameError && 'border-red-500',
            )}
            autoFocus
          />
          {nameError && (
            <p className="mt-1 text-xs text-red-500">{nameError}</p>
          )}
        </div>

        {/* Properties Section */}
        <div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Add Properties
          </h3>
          <p className="mb-4 text-sm text-gray-500">
            Properties are categorised based on locations. You can either the
            locations or use the drop downs to select specific properties in
            that location.
          </p>

          {/* Search Properties */}
          <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Properties"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-gray-50 py-3 pr-4 pl-10 focus:border-[#e36b37] focus:ring-[#e36b37] focus:outline-none"
            />
          </div>

          {/* Property List */}
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {filteredProperties.length > 0 ? (
              filteredProperties.map(property => (
                <label
                  key={property.id}
                  className="flex cursor-pointer items-center rounded-md p-2 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(property.id)}
                    onChange={() => togglePropertySelection(property.id)}
                    className="h-5 w-5 rounded border-gray-300 text-[#e36b37] focus:ring-[#e36b37]"
                  />
                  <span className="ml-3 block text-sm font-medium text-gray-700">
                    {property.name}, {property.location}
                  </span>
                </label>
              ))
            ) : (
              <p className="py-3 text-center text-sm text-gray-500">
                No properties match your search criteria
              </p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
