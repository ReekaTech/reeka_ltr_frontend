'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import Image from 'next/image';
import { useState } from 'react';

export interface ImageGalleryProps {
  images: {
    id: string;
    src: string;
    alt: string;
  }[];
  aspectRatio?: 'square' | 'video' | 'wide';
  className?: string;
}

export function ImageGallery({
  images,
  aspectRatio = 'wide',
  className = '',
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Prevent rendering if no images
  if (!images || images.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const aspectRatioClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'video'
        ? 'aspect-video'
        : 'aspect-[16/9]';

  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`}>
      {/* Main image */}
      <div className={`relative w-full ${aspectRatioClass}`}>
        <Image
          src={images[activeIndex].src}
          alt={images[activeIndex].alt}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus:ring-2 focus:ring-[#e36b37] focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus:ring-2 focus:ring-[#e36b37] focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-2 flex space-x-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md focus:outline-none ${
                index === activeIndex
                  ? 'ring-2 ring-[#e36b37]'
                  : 'opacity-70 ring-1 ring-gray-200 hover:opacity-100'
              }`}
              aria-label={`View ${image.alt}`}
              aria-current={index === activeIndex ? 'true' : 'false'}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Pagination indicator */}
      {images.length > 1 && (
        <div className="absolute right-3 bottom-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
