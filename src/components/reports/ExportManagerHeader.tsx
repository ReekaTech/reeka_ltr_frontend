import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import React from 'react';

interface ExportManagerHeaderProps {
  onCustomExport: () => void;
}

export default function ExportManagerHeader({ onCustomExport }: ExportManagerHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Export Manager</h1>
        <p className="text-gray-500 mt-1">Generate and download customized Excel reports</p>
      </div>
      <Button
        variant="default"
        className="flex items-center gap-2 px-5 py-2 text-base font-medium"
        onClick={onCustomExport}
      >
        <Download size={18} />
        Custom Export
      </Button>
    </div>
  );
} 