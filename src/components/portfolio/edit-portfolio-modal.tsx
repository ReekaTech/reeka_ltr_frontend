'use client';

import { useProperties, useUnassignedProperties } from '@/services/queries/hooks';

import { AddPropertyToPortfolioModal } from './add-property-to-portfolio-modal';
import { ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { RemovePropertyFromPortfolioModal } from './remove-property-from-portfolio-modal';
import { useState } from 'react';

interface EditPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
}

export function EditPortfolioModal({
  isOpen,
  onClose,
  portfolioId,
}: EditPortfolioModalProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  // Fetch data for counts
  const { data: unassignedProperties = [] } = useUnassignedProperties();
  const { data: propertiesData } = useProperties({
    portfolioId,
    limit: 100,
  });
  const portfolioProperties = propertiesData?.items || [];

  const unassignedCount = unassignedProperties.length;
  const portfolioPropertyCount = portfolioProperties.length;

  const handleAddPropertyClick = () => {
    setIsAddModalOpen(true);
  };

  const handleRemovePropertyClick = () => {
    setIsRemoveModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleRemoveModalClose = () => {
    setIsRemoveModalOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Portfolio"
        contentClassName="max-w-sm"
      >
        <div className="space-y-3">
          {/* Remove Property Option */}
          <button
            onClick={handleRemovePropertyClick}
            className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#e36b37] focus:ring-offset-2"
          >
            <div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                  <span className="text-sm font-semibold text-red-600">{portfolioPropertyCount}</span>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Remove Property</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Select which properties you want to remove from the portfolio
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          {/* Add Property Option */}
          <button
            onClick={handleAddPropertyClick}
            className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#e36b37] focus:ring-offset-2"
          >
            <div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <span className="text-sm font-semibold text-green-600">{unassignedCount}</span>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Add Property</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Select which properties you want to add to the portfolio
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </Modal>

      {/* Add Property Modal */}
      <AddPropertyToPortfolioModal
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        portfolioId={portfolioId}
      />

      {/* Remove Property Modal */}
      <RemovePropertyFromPortfolioModal
        isOpen={isRemoveModalOpen}
        onClose={handleRemoveModalClose}
        portfolioId={portfolioId}
      />
    </>
  );
} 