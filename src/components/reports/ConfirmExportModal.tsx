import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import React from 'react';

interface ConfirmExportModalProps {
  open: boolean;
  onCancel: () => void;
  onCreate: () => void;
  loading: boolean;
  exportTitle: string;
}

export default function ConfirmExportModal({
  open,
  onCancel,
  onCreate,
  loading,
  exportTitle,
}: ConfirmExportModalProps) {
  return (
    <Modal
      isOpen={open}
      onClose={onCancel}
      title="Confirm Export"
      showFooter
      footerContent={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onCreate}
            disabled={loading}
            className="min-w-[100px] flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            Create
          </Button>
        </div>
      }
    >
      <div className="text-gray-600">
        Are you sure you want to create the <span className="font-medium text-gray-900">{exportTitle}</span>?
      </div>
    </Modal>
  );
} 