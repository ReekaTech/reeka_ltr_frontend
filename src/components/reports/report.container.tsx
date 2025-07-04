'use client';

import type { DateRange, ExportHistoryItem, ReportType } from '@/services/api/schemas';
import { ExportStatus, ReportType as ReportTypeEnum } from '@/services/api/schemas';
import { useExportDownloadUrl, useExportHistory, useExportReports } from '@/services/queries/hooks/useReport';

import ConfirmExportModal from './ConfirmExportModal';
import CustomExportModal from './CustomExportModal';
import ExportCardGrid from './ExportCardGrid';
import ExportManagerHeader from './ExportManagerHeader';
import RecentExportsList from './RecentExportsList';
import ReportComponent from './report.component';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ReportContainer() {
  const searchParams = useSearchParams();
  const [showCustomExport, setShowCustomExport] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; type: string; title: string } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Get export history with pagination and filtering
  const { data: exportHistory, isLoading } = useExportHistory({
    page: currentPage,
    limit: pageSize,
    sortBy: 'requestedAt',
    sortOrder: 'desc',
    reportType: undefined
  });

  const exportReportsMutation = useExportReports();
  const downloadUrlMutation = useExportDownloadUrl();

  const handleExportClick = (type: string, title: string) => {
    setConfirmModal({ open: true, type, title });
  };

  const handleConfirmExport = () => {
    if (!confirmModal) return;
    let reportTypes: ReportType[] = [];
    if (confirmModal.type === 'FINANCIAL') reportTypes = [ReportTypeEnum.FINANCIAL];
    if (confirmModal.type === 'RENT_ROLL') reportTypes = [ReportTypeEnum.RENT_ROLL];
    if (confirmModal.type === 'LEASE_EXPIRATION') reportTypes = [ReportTypeEnum.LEASE_EXPIRATION];
    if (confirmModal.type === 'TENANT_DIRECTORY') reportTypes = [ReportTypeEnum.TENANT_DIRECTORY];

    // Use current month for demo; in real use, let user pick
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    const dateRange: DateRange = { from: startDate, to: endDate };

    exportReportsMutation.mutate(
      { reportTypes, dateRange },
      {
        onSuccess: () => setConfirmModal(null),
        onError: () => setConfirmModal(null),
      }
    );
  };

  const handleDownload = async (item: ExportHistoryItem) => {
    setDownloadingId(item._id);
    try {
      // Get a fresh download URL
      const result = await downloadUrlMutation.mutateAsync(item._id);
      
      if (result.url) {
        const link = document.createElement('a');
        link.href = result.url;
        link.download = item.resultUrl?.split('/').pop()?.split('?')[0] || 'Export.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to get download URL:', error);
      // Fallback to the original resultUrl if available
      if (item.resultUrl) {
        const link = document.createElement('a');
        link.href = item.resultUrl;
        link.download = item.resultUrl.split('/').pop()?.split('?')[0] || 'Export.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCustomExport = () => setShowCustomExport(true);
  const handleCloseCustomExport = () => setShowCustomExport(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ExportManagerHeader onCustomExport={handleCustomExport} />
      <ExportCardGrid onExportClick={handleExportClick} />
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400" />
        </div>
      ) : (
        <RecentExportsList
          exports={exportHistory?.items || []}
          onDownload={handleDownload}
          currentPage={currentPage}
          totalPages={exportHistory?.pages || 1}
          onPageChange={setCurrentPage}
          isDownloading={downloadUrlMutation.isPending}
          downloadingId={downloadingId || undefined}
        />
      )}
      <ConfirmExportModal
        open={!!confirmModal?.open}
        onCancel={() => setConfirmModal(null)}
        onCreate={handleConfirmExport}
        loading={exportReportsMutation.isPending}
        exportTitle={confirmModal?.title || ''}
      />
      <CustomExportModal
        isOpen={showCustomExport}
        onClose={handleCloseCustomExport}
      />
    </div>
  );
} 