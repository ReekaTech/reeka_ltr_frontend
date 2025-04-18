'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ImageGalleryProps {
  images: {
    url: string;
    alt: string;
  }[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="flex gap-4 items-center overflow-x-auto pb-8 pt-4 px-4 scrollbar-hide">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative shrink-0 cursor-pointer transition-all duration-300",
              "rounded-2xl overflow-hidden",
              "hover:-translate-y-2 hover:shadow-xl",
              {
                "translate-x-0 rotate-0 z-30": index === selectedIndex,
                "-translate-x-6 -rotate-6": index < selectedIndex,
                "translate-x-6 rotate-6": index > selectedIndex,
              }
            )}
            style={{
              width: "280px",
              height: "200px",
            }}
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 280px) 100vw, 280px"
              priority={index === 0}
            />
          </div>
        ))}
        <div 
          className="shrink-0 flex items-center justify-center bg-gray-100 rounded-2xl cursor-pointer hover:bg-gray-200 transition-colors"
          style={{
            width: "280px",
            height: "200px",
          }}
          onClick={() => {/* Add image handler */}}
        >
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
} 