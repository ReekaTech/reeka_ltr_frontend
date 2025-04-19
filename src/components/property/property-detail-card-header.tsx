// components/PropertyCard.tsx

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  title: string;
  address: string;
  type: string;
  price: number;
  status: "Booked" | "Available";
  imageUrl?: string;
}

export const PropertyDetailHeadCard = ({
  title,
  address,
  type,
  price,
  status,
  imageUrl,
}: PropertyCardProps) => {
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

      <div className="flex flex-col gap-1">
        <div className="flex flex-col items-start gap-2">
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
            {status}
          </Badge>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-700">{address}</p>
        <p className="text-sm text-gray-500">
          {type} • <span className="font-medium text-gray-700">${price}</span> per night
        </p>
      </div>
    </div>
  );
};
