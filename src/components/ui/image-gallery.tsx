'use client';

import { CloudUpload } from 'lucide-react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
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
  return (
    <div className="flex items-end relative h-[100px] overflow-visible">
      {images.map((src, index) => {
        const rotation = index === images.length - 1
          ? "rotate-[21.37deg]"
          : index % 2 === 1
            ? (index % 4 === 1 ? "rotate-[21.37deg]" : "rotate-[-14.57deg]")
            : "rotate-0";
        
        return (
          <div
            key={index}
            className={cn(
              "w-[90px] h-[90px] rounded-2xl overflow-hidden shadow-lg",
              "ml-[-16px] first:ml-0",
              rotation,
              `z-[${20 + index}]`
            )}
            style={{ zIndex: 20 + index }}
          >
            <img
              src={src.src}
              alt={`image-${index}`}
              className="object-cover w-full h-full"
            />
          </div>
        );
      })}
      <div 
        className={cn(
          "w-[90px] h-[90px] rounded-2xl shadow-lg",
          "ml-[-16px] bg-gray-100 border border-gray-300",
          "flex flex-col items-center justify-center",
          "text-gray-500 text-xs cursor-pointer",
        )}
        style={{ zIndex: 10 }}
      >
        
      </div>
    </div>
  );
}
