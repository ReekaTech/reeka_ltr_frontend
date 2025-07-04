import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { ExportHistoryItem } from '@/services/api/schemas';
import { Pagination } from '@/components/ui/pagination';

interface RecentExportsListProps {
  exports: ExportHistoryItem[];
  onDownload: (item: ExportHistoryItem) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isDownloading?: boolean;
  downloadingId?: string;
}

function formatFileSize(bytes?: number) {
  if (!bytes) return 'N/A';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 10) / 10 + ' ' + sizes[i];
}

function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' • ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function RecentExportsList({ 
  exports, 
  onDownload, 
  currentPage, 
  totalPages, 
  onPageChange,
  isDownloading = false,
  downloadingId
}: RecentExportsListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-2">
      <div className="font-semibold text-lg text-gray-900 mb-4">Recent Exports</div>
      <div className="flex flex-col gap-3">
        {exports.length === 0 && (
          <div className="text-gray-500 text-center py-8">No exports found.</div>
        )}
        {exports.map((item) => {
          const isItemDownloading = isDownloading && downloadingId === item._id;
          return (
            <div
              key={item._id}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet size={28} className="text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">{item.resultUrl ? item.resultUrl.split('/').pop()?.split('?')[0] : 'Export.xlsx'}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {formatDate(item.requestedAt)}
                    {item.fileSizeBytes && (
                      <span> • {formatFileSize(item.fileSizeBytes)}</span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2 px-4 cursor-pointer"
                onClick={() => onDownload(item)}
                disabled={!item.resultUrl || isItemDownloading}
              >
                {isItemDownloading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                {isItemDownloading ? 'Getting URL...' : 'Download'}
              </Button>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
} 