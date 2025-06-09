'use client';

import {
  AmenitiesSection,
  ImagesSection,
  PriceSection,
  PropertyDetailsSection,
} from '@/components/property';
import { Building2, DollarSign, ImageIcon, Tag } from 'lucide-react';
import { Form, Formik, FormikProps } from 'formik';

import { AccordionItem } from '@/components/ui/accordion-item';
import { PropertyFormData } from '@/services/api/schemas/property';
import { SuccessModal } from './success-modal';
import { propertyValidationSchema } from '@/app/listings/validation';
import { toast } from 'react-toastify';
import { uploadToS3 } from '@/services/api/upload';
import { useCreateProperty } from '@/services/queries/hooks/useProperties';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useUploadSignedUrl } from '@/services/queries/hooks/useUploadSignedUrl';

type AccordionSection = 'details' | 'amenities' | 'images' | 'price';

export default function AddPropertyFormClient() {
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get('portfolioId');
  
  const [expandedSection, setExpandedSection] = useState<AccordionSection | null>('details');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const uploadMutation = useUploadSignedUrl();
  const createPropertyMutation = useCreateProperty();

  const handleSubmit = async (values: PropertyFormData) => {
    try {
      setIsSubmitting(true);

      // Group images by extension
      const groupedImages = values.images.reduce((acc, file) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!extension) return acc;
        
        if (!acc[extension]) {
          acc[extension] = [];
        }
        acc[extension].push(file);
        return acc;
      }, {} as Record<string, File[]>);

      // Upload images in batches by extension
      const imageUrls = await Promise.all(
        Object.entries(groupedImages).map(async ([extension, files]) => {
          // Get signed URL for this extension type
          const { url, key } = await uploadMutation.mutateAsync({
            type: 'single',
            extension
          });
          
          // Upload all files of this extension
          return Promise.all(
            files.map(async (file) => {
              await uploadToS3(url, file, key);
              return `https://lasser-assets.s3.eu-west-1.amazonaws.com/${key}`;
            })
          );
        })
      ).then(urls => urls.flat());

      // Create property with uploaded image URLs
      await createPropertyMutation.mutateAsync({
        name: values.name,
        status: values.status,
        type: values.type,
        countryId: values.countryId,
        address: values.address,
        rooms: values.rooms,
        amenities: values.amenities,
        imageUrls: imageUrls,
        ...(values.contactPerson && { contactPerson: values.contactPerson }),
        ...(values.portfolioId && { portfolioId: values.portfolioId }),
      });
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to create property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialValues: PropertyFormData = {
    portfolioId: portfolioId || '',
    name: '',
    type: '',
    countryId: '',
    address: '',
    rooms: {
      bedrooms: 1,
      bathrooms: 1,
      studios: 0,
    },
    amenities: {},
    images: [],
    imagePreviews: [],
    contactPerson: '',
    status: 'listed' as const,
  };

  const toggleSection = (section: AccordionSection) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="mx-auto max-w-xl">
      <Formik
        initialValues={initialValues}
        validationSchema={propertyValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, validateForm, errors }: FormikProps<typeof initialValues>) => {
          return (
            <Form>
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
                    formData={values}
                    updateFormData={setFieldValue}
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
                    formData={values}
                    updateFormData={setFieldValue}
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
                    formData={values}
                    updateFormData={setFieldValue}
                  />
                </AccordionItem>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-x-6 rounded-b-2xl bg-[#F0F0F0] p-4">
                <button
                  type="button"
                  onClick={async () => {
                    setFieldValue('status', 'unlisted');
                    await handleSubmit(values);
                  }}
                  className="cursor-pointer text-sm font-bold text-gray-600 transition-colors hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent"></div>
                      <span>Saving as draft...</span>
                    </div>
                  ) : (
                    'Save as draft'
                  )}
                </button>
                <button
                  type="submit"
                  onClick={async () => {
                    await validateForm();
                    if (Object.keys(errors).length > 0) {
                      toast.error('Please fill in all required fields');
                      return;
                    }
                  }}
                  disabled={isSubmitting}
                  className="hover:bg-opacity-90 cursor-pointer rounded-md bg-[#e36b37] px-4 py-2 text-sm font-bold text-white transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Creating Property...</span>
                    </div>
                  ) : (
                    'Create Property'
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
} 