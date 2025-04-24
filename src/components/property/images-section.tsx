'use client';

import { Upload, X } from 'lucide-react';

import { PropertyFormData } from '@/services/api/schemas';
import type React from 'react';
import { useRef } from 'react';

interface ImagesSectionProps {
  formData: PropertyFormData;
  updateFormData: (field: keyof PropertyFormData, value: any) => void;
}

export function ImagesSection({
  formData,
  updateFormData,
}: ImagesSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const updatedImages = [...formData.images, ...newFiles];
    
    // Create preview URLs for new files
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    const updatedPreviews = [...formData.imagePreviews, ...newPreviewUrls];

    updateFormData('images', updatedImages);
    updateFormData('imagePreviews', updatedPreviews);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formData.images];
    const updatedPreviews = [...formData.imagePreviews];

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviews[index]);

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    updateFormData('images', updatedImages);
    updateFormData('imagePreviews', updatedPreviews);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;

    const newFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/'),
    );
    const updatedImages = [...formData.images, ...newFiles];
    
    // Create preview URLs for new files
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    const updatedPreviews = [...formData.imagePreviews, ...newPreviewUrls];

    updateFormData('images', updatedImages);
    updateFormData('imagePreviews', updatedPreviews);
  };

  return (
    <div className="space-y-6">
      {/* Image Grid */}
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {formData.imagePreviews.map((url, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={url}
              alt={`Property image ${index + 1}`}
              className="h-full w-full rounded-md object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 rounded-full bg-white p-1 shadow-md"
              aria-label="Remove image"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, 1 - formData.imagePreviews.length) }).map(
          (_, index) => (
            <div
              key={`empty-${index}`}
              className="flex aspect-square items-center justify-center rounded-md border border-gray-200 bg-gray-50"
            >
              <X className="h-4 w-4 text-gray-300" />
            </div>
          ),
        )}
      </div>

      {/* File Upload Area */}
      <div
        className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-6 text-center"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <Upload className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500">Click here to upload file</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
          aria-label="Upload property images"
        />
      </div>
    </div>
  );
}
