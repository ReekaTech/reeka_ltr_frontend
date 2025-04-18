'use client';

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

interface PriceSectionProps {
  formData: PropertyFormData;
  updateFormData: (field: keyof PropertyFormData, value: any) => void;
}

export function PriceSection({ formData, updateFormData }: PriceSectionProps) {
  const handlePriceChange = (
    field: 'basePrice' | 'minPrice' | 'maxPrice',
    value: string,
  ) => {
    // Only allow numbers and decimal points
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    updateFormData(field, sanitizedValue);
  };

  return (
    <div className="space-y-6">
      {/* Base Price */}
      <div>
        <label
          htmlFor="base-price"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Base Price
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500">$</span>
          </div>
          <input
            type="text"
            id="base-price"
            value={formData.basePrice}
            onChange={e => handlePriceChange('basePrice', e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pr-16 pl-8 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
            placeholder="0.00"
            inputMode="decimal"
            required
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500">/Night</span>
          </div>
        </div>
      </div>

      {/* Min and Max Price */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Min Price */}
        <div>
          <label
            htmlFor="min-price"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Min Price
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="text"
              id="min-price"
              value={formData.minPrice}
              onChange={e => handlePriceChange('minPrice', e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pr-16 pl-8 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
              placeholder="0.00"
              inputMode="decimal"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500">/Night</span>
            </div>
          </div>
        </div>

        {/* Max Price */}
        <div>
          <label
            htmlFor="max-price"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Max Price
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="text"
              id="max-price"
              value={formData.maxPrice}
              onChange={e => handlePriceChange('maxPrice', e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pr-16 pl-8 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
              placeholder="0.00"
              inputMode="decimal"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500">/Night</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
