'use client';

import { PropertyFormData } from "@/services/api/schemas";

interface PriceSectionProps {
  formData: PropertyFormData;
  updateFormData: (field: keyof PropertyFormData, value: any) => void;
}

export function PriceSection({ formData, updateFormData }: PriceSectionProps) {
  const handlePriceChange = (
    value: string,
  ) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    updateFormData('rentalPrice', sanitizedValue);
  };

  return (
    <div className="space-y-6">
      {/* Rental Price */}
      <div>
        <label
          htmlFor="rental-price"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Rental Price
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500">₦</span>
          </div>
          <input
            type="text"
            id="rental-price"
            value={formData.rentalPrice}
            onChange={e => handlePriceChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pr-16 pl-8 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
            placeholder="0.00"
            inputMode="decimal"
            required
          />
        </div>
      </div>
    </div>
  );
}
