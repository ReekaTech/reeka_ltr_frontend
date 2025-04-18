'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type PropertyFormData = {
  name: string;
  type: string;
  country: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: File[];
  basePrice: string;
  minPrice: string;
  maxPrice: string;
};

type PropertyFormContextType = {
  formData: PropertyFormData;
  updateFormData: (field: keyof PropertyFormData, value: any) => void;
  resetForm: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
};

const initialFormData: PropertyFormData = {
  name: '',
  type: '',
  country: '',
  address: '',
  bedrooms: 1,
  bathrooms: 1,
  amenities: [],
  images: [],
  basePrice: '',
  minPrice: '',
  maxPrice: '',
};

const PropertyFormContext = createContext<PropertyFormContextType | undefined>(
  undefined,
);

export function PropertyFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return (
    <PropertyFormContext.Provider
      value={{
        formData,
        updateFormData,
        resetForm,
        isSubmitting,
        setIsSubmitting,
      }}
    >
      {children}
    </PropertyFormContext.Provider>
  );
}

export function usePropertyForm() {
  const context = useContext(PropertyFormContext);
  if (context === undefined) {
    throw new Error(
      'usePropertyForm must be used within a PropertyFormProvider',
    );
  }
  return context;
}
