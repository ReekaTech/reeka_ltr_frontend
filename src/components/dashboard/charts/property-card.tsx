import Image from "next/image";

interface PropertyItemProps {
  name: string;
  location: string;
  imageUrl: string;
}

function PropertyItem({ name, location, imageUrl }: PropertyItemProps) {
  return (
    <div className="flex items-center gap-3 border-b-1 border-[#eaeaea] py-4 last:border-b-0">
      <div className="relative h-12 w-12 overflow-hidden rounded-md">
        <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <div>
        <div className="font-medium text-sm">{name}</div>
        <div className="text-sm text-[#6d6d6d]">{location}</div>
      </div>
    </div>
  );
}


interface Property {
    name: string;
    location: string;
    imageUrl: string;
  }
  
  interface PropertiesCardProps {
    title?: string;
    properties: Property[];
  }
  
  export function PropertiesCard({ title = "Properties", properties }: PropertiesCardProps) {
    return (
      <div className="rounded-lg border border-[#dcdcdc] bg-white shadow-sm">
        <div className="border-b-1 border-[#eaeaea] shadow-sm p-4">
          <h2 className="font-medium text-[#808080] text-base">{title}</h2>
        </div>
  
        <div className="p-4">
          {properties.map((property, index) => (
            <PropertyItem
              key={index}
              name={property.name}
              location={property.location}
              imageUrl={property.imageUrl}
            />
          ))}
        </div>
      </div>
    );
  }
  