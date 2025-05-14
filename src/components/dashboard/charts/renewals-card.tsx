import 'react-day-picker/dist/style.css';

import { DateRange, DayPicker } from 'react-day-picker';

import { Calendar } from "lucide-react";
import { format } from 'date-fns';
import { useState } from 'react';

interface RenewalItemProps {
  propertyName: string;
  tenantName: string;
  renewalDate: string;
}

function RenewalItem({ propertyName, tenantName, renewalDate }: RenewalItemProps) {
  return (
    <div className="border-b-1 border-[#eaeaea] py-4 last:border-b-0">
      <div className="text-sm font-bold text-[#3a3a3a]">{propertyName}</div>
      <div className="mt-1 flex items-center justify-between">
        <div className="text-sm text-[#6d6d6d]">Tenant: <span className="font-medium text-[#3a3a3a]">{tenantName}</span></div>
        <div className="text-xs font-light text-[#6d6d6d]">Date for renewal: <span className="font-medium text-[#3a3a3a]">{renewalDate}</span></div>
      </div>
    </div>
  );
}

interface RenewalsCardProps {
  title?: string;
  dateRange?: string;
  items: RenewalItemProps[];
}

export function RenewalsCard({
  title = "Renewals",
  items,
}: RenewalsCardProps) {
  

  return (
    <div className="rounded-lg border border-[#dcdcdc] bg-white py-4 shadow-sm">
      <div className="flex items-center justify-between px-4">
        <h2 className="font-medium text-[#808080] text-base">{title}</h2>
    
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <span className="text-xs border-b-2 border-[#e36b37] pb-3 text-[#e36b37]">Upcoming Renewals</span>
          <div className="absolute top-[2.1rem] left-0 right-0 h-px bg-[#eaeaea] shadow-sm" />
        </div>

        {items.map((item, index) => (
          <RenewalItem
            key={`${item.tenantName}-${index}`}
            propertyName={item.propertyName}
            tenantName={item.tenantName}
            renewalDate={item.renewalDate}
          />
        ))}
      </div>
    </div>
  );
}
