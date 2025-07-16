// components/PropertyCard.tsx

import { Bath, Bed, Home } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { propertyTypes } from "@/app/constants";

interface PropertyCardProps {
  title: string;
  address: string;
  type: string;
  price: number;
  status: string;
  imageUrl?: string;
  rooms?: {
    bedrooms: number;
    bathrooms: number;
  };
  onStatusToggle?: () => Promise<void>;
}

export const PropertyDetailHeadCard = ({
  title,
  address,
  type,
  price,
  status,
  imageUrl,
  rooms,
  onStatusToggle,
}: PropertyCardProps) => {
  // Helper function to get room display text
  const getRoomDisplayText = () => {
    if (!rooms) return null;
    
    if (rooms.bedrooms === 0) {
      return `Studio Apartment | ${rooms.bathrooms} ${rooms.bathrooms === 1 ? 'Bath' : 'Baths'}`;
    } else {
      return `${rooms.bedrooms} ${rooms.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'} | ${rooms.bathrooms} ${rooms.bathrooms === 1 ? 'Bath' : 'Baths'}`;
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 w-full border-b-1 border-gray-200">
      <div className="w-[148px] h-[121px] rounded-lg bg-gray-200 overflow-hidden shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${title} thumbnail`}
            width={148}
            height={121}
            className="object-cover w-full h-full"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-1 flex-1 items-start">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={cn(
                status === 'listed' 
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-gray-100 text-gray-700 border-gray-200",
                onStatusToggle && "cursor-pointer hover:bg-blue-200 transition-colors"
              )}
              onClick={onStatusToggle}
            >
              {status}
            </Badge>
            <Toggle
              checked={status === 'listed'}
              onToggle={onStatusToggle || (() => {})}
              
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-700">{address}</p>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Home className="h-4 w-4" />
          <span>{propertyTypes[type as keyof typeof propertyTypes]}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {rooms && (
            <>
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{rooms.bedrooms === 0 ? 'Studio' : `${rooms.bedrooms} ${rooms.bedrooms === 1 ? 'Bed' : 'Beds'}`}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{rooms.bathrooms} {rooms.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
