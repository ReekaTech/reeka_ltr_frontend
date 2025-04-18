'use client';

import {
  AmenitiesSection,
  ImagesSection,
  PriceSection,
  PropertyDetailsSection,
} from '@/components/property';
import { Building2, DollarSign, ImageIcon, Tag } from 'lucide-react';

import { AccordionItem } from '@/components/ui/accordion-item';
import type React from 'react';
import { SuccessModal } from './success-modal';
import { usePropertyForm } from './property-form-context';
import { useState } from 'react';

type AccordionSection = 'details' | 'amenities' | 'images' | 'price';

export function AddPropertyForm() {
  const { formData, updateFormData, isSubmitting, setIsSubmitting, resetForm } =
    usePropertyForm();
  const [expandedSection, setExpandedSection] =
    useState<AccordionSection | null>('details');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const toggleSection = (section: AccordionSection) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you would submit the form data to your API here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    // In a real app, you would save the draft to your API or local storage
    console.log('Saving draft:', formData);
  };

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-t-2xl bg-gray-50 px-1 pt-1 pb-6 shadow">
          {/* Property Details Section */}
          <AccordionItem
            title="Property Details"
            icon={<Building2 className="h-5 w-5 text-white" />}
            iconBgColor="bg-blue-500"
            isExpanded={expandedSection === 'details'}
            onToggle={() => toggleSection('details')}
          >
            <PropertyDetailsSection
              formData={formData}
              updateFormData={updateFormData}
            />
          </AccordionItem>

          {/* Amenities Section */}
          <AccordionItem
            title="Rooms and Amenities"
            icon={<Tag className="h-5 w-5 text-white" />}
            iconBgColor="bg-green-500"
            isExpanded={expandedSection === 'amenities'}
            onToggle={() => toggleSection('amenities')}
          >
            <AmenitiesSection
              formData={formData}
              updateFormData={updateFormData}
            />
          </AccordionItem>

          {/* Images Section */}
          <AccordionItem
            title="Images"
            icon={<ImageIcon className="h-5 w-5 text-white" />}
            iconBgColor="bg-orange-500"
            isExpanded={expandedSection === 'images'}
            onToggle={() => toggleSection('images')}
          >
            <ImagesSection
              formData={formData}
              updateFormData={updateFormData}
            />
          </AccordionItem>

          {/* Price Section */}
          <AccordionItem
            title="Price"
            icon={<DollarSign className="h-5 w-5 text-white" />}
            iconBgColor="bg-blue-500"
            isExpanded={expandedSection === 'price'}
            onToggle={() => toggleSection('price')}
          >
            <PriceSection formData={formData} updateFormData={updateFormData} />
          </AccordionItem>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-x-6 rounded-b-2xl bg-[#F0F0F0] p-4">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="cursor-pointer text-sm font-bold text-gray-600 transition-colors hover:text-gray-800"
          >
            Save as draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="hover:bg-opacity-90 cursor-pointer rounded-md bg-[#e36b37] px-4 py-2 text-sm font-bold text-white transition-all disabled:opacity-70"
          >
            {isSubmitting ? 'Creating...' : 'Create Property'}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
}
