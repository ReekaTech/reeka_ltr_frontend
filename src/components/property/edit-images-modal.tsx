'use client';

import { Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { Modal } from '@/components/ui/modal';
import { toast } from 'react-toastify';
import { uploadToS3 } from '@/services/api/upload';
import { useUploadSignedUrl } from '@/services/queries/hooks/useUploadSignedUrl';

const MAX_SIZE_MB = 7;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface EditImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImages: string[];
  onSave: (imageUrls: string[]) => Promise<void>;
}

export function EditImagesModal({
  isOpen,
  onClose,
  currentImages,
  onSave,
}: EditImagesModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(currentImages);
  const uploadMutation = useUploadSignedUrl();

  const validateImageSize = (file: File): boolean => {
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`Image ${file.name} is too large. Maximum size is ${MAX_SIZE_MB}MB`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter(validateImageSize);
    if (validFiles.length === 0) return;

    setNewFiles(prev => [...prev, ...validFiles]);
    
    // Create preview URLs for new files
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];
    const updatedNewFiles = [...newFiles];

    // If it's a new file, remove from newFiles
    if (index >= images.length) {
      const newFileIndex = index - images.length;
      URL.revokeObjectURL(updatedPreviews[index]);
      updatedNewFiles.splice(newFileIndex, 1);
      setNewFiles(updatedNewFiles);
    } else {
      updatedImages.splice(index, 1);
    }

    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;

    const validFiles = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .filter(validateImageSize);

    if (validFiles.length === 0) return;
    
    setNewFiles(prev => [...prev, ...validFiles]);
    
    // Create preview URLs for new files
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviewUrls]);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);

      // Group new images by extension
      const groupedImages = newFiles.reduce((acc, file) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!extension) return acc;
        
        if (!acc[extension]) {
          acc[extension] = [];
        }
        acc[extension].push(file);
        return acc;
      }, {} as Record<string, File[]>);

      // Upload new images in batches by extension
      const newImageUrls = await Promise.all(
        Object.entries(groupedImages).map(async ([extension, files]) => {
          const { url, key } = await uploadMutation.mutateAsync({
            type: 'single',
            extension
          });
          
          return Promise.all(
            files.map(async (file) => {
              await uploadToS3(url, file, key);
              return `https://lasser-assets.s3.eu-west-1.amazonaws.com/${key}`;
            })
          );
        })
      ).then(urls => urls.flat());

      // Combine existing and new image URLs
      const updatedImageUrls = [...images, ...newImageUrls];
      
      await onSave(updatedImageUrls);
      onClose();
    } catch (error) {
      console.error('Failed to update images:', error);
      toast.error('Failed to update images');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Property Images"
    >
      <div className="space-y-6">
        {/* Image Grid */}
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {imagePreviews.map((url, index) => (
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
          {Array.from({ length: Math.max(0, 1 - imagePreviews.length) }).map(
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