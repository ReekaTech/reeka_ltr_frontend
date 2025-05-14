'use client';

import { useRef, useState } from 'react';

import { Modal } from '@/components/ui/modal';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

const commonAmenities = [
  'Swimming Pool',
  'Griller',
  'Basketball Court',
  'Gym',
  'WiFi',
  'Air Conditioning',
  'Kitchen',
  'Parking',
  'TV',
  'Washer',
  'Dryer',
];

interface EditAmenitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAmenities: {
    [key: string]: {
      available: boolean;
      quantity: number;
    };
  };
  onSave: (amenities: {
    [key: string]: {
      available: boolean;
      quantity: number;
    };
  }) => Promise<void>;
}

export function EditAmenitiesModal({
  isOpen,
  onClose,
  currentAmenities,
  onSave,
}: EditAmenitiesModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amenities, setAmenities] = useState<{ [key: string]: { available: boolean; quantity: number } }>(currentAmenities);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddAmenity = (amenity: string) => {
    const normalizedAmenity = amenity.trim();
    if (normalizedAmenity && !amenities[normalizedAmenity]) {
      setAmenities({
        ...amenities,
        [normalizedAmenity]: { available: true, quantity: 1 }
      });
      setInputValue('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    const { [amenity]: _, ...rest } = amenities;
    setAmenities(rest);
  };

  const handleToggleAmenity = (amenity: string) => {
    if (amenities[amenity]) {
      handleRemoveAmenity(amenity);
    } else {
      handleAddAmenity(amenity);
    }
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await onSave(amenities);
      onClose();
    } catch (error) {
      console.error('Failed to update amenities:', error);
      toast.error('Failed to update amenities');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Property Amenities"
    >
      <div className="space-y-6">
        {/* Common amenities */}
        <div className="mb-6 flex flex-wrap gap-2">
          {commonAmenities.map(amenity => (
            <button
              key={amenity}
              type="button"
              onClick={() => handleToggleAmenity(amenity)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                amenities[amenity]?.available
                  ? 'bg-green-500 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>

        {/* Selected amenities with input */}
        <div className="mb-6 rounded-lg border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200">
          <div className="flex flex-wrap items-center p-3">
            {Object.entries(amenities)
              .filter(([_, value]) => value.available)
              .map(([amenity]) => (
                <div
                  key={amenity}
                  className="m-1 flex items-center rounded-full bg-green-500 px-3 py-1 text-sm text-white"
                >
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(amenity)}
                    className="ml-2 flex h-4 w-4 items-center justify-center rounded-full hover:bg-green-600"
                    aria-label={`Remove ${amenity}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            <div className="min-w-[180px] flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAmenity(inputValue);
                  }
                }}
                placeholder="Type Amenities"
                className="w-full rounded-md border-none bg-gray-50 px-2 py-1.5 text-sm outline-none focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="hover:bg-opacity-90 flex items-center justify-center rounded-md bg-[#e36b37] px-4 py-2 text-sm font-medium text-white transition-all disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
} 