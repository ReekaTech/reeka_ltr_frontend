import { CalendarCheck, FileSpreadsheet, FileText, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import React from 'react';

interface ExportCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: string;
}

const cards: ExportCard[] = [
  {
    icon: <FileSpreadsheet size={28} className="text-gray-700" />,
    title: 'Monthly Financial Report',
    description: 'Complete financial overview for the current month',
    type: 'FINANCIAL',
  },
  {
    icon: <FileText size={28} className="text-gray-700" />,
    title: 'Rent Roll Export',
    description: 'Current rent roll with payment status',
    type: 'RENT_ROLL',
  },
  {
    icon: <CalendarCheck size={28} className="text-gray-700" />,
    title: 'Lease Expiration Report',
    description: 'Upcoming lease expirations in next 90 days',
    type: 'LEASE_EXPIRATION',
  },
  {
    icon: <Users size={28} className="text-gray-700" />,
    title: 'Tenant Directory',
    description: 'Complete tenant contact and lease information',
    type: 'TENANT_DIRECTORY',
  },
];

interface ExportCardGridProps {
  onExportClick: (type: string, title: string) => void;
}

export default function ExportCardGrid({ onExportClick }: ExportCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-start gap-4"
        >
          <div>{card.icon}</div>
          <div className="font-semibold text-lg text-gray-900 mb-1">{card.title}</div>
          <div className="text-gray-500 text-sm mb-4 flex-1">{card.description}</div>
          <Button
            variant="default"
            className="w-full flex items-center justify-center gap-2 font-medium cursor-pointer"
            onClick={() => onExportClick(card.type, card.title)}
          >
            <FileSpreadsheet size={16} /> Export
          </Button>
        </div>
      ))}
    </div>
  );
} 