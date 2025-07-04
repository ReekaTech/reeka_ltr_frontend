'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExportHistoryItem, ReportSummary } from '@/services/api/schemas';
import { ExportStatus, ReportType } from '@/services/api/schemas';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { useState } from 'react';

interface ReportComponentProps {
  exports: ExportHistoryItem[];
  summary?: ReportSummary[];
  isLoading: boolean;
  selectedReportType: string;
  currentPage: number;
  totalPages: number;
  onReportTypeChange: (type: string) => void;
  onPageChange: (page: number) => void;
  onExportAll: () => void;
  onViewExport: (exportItem: ExportHistoryItem) => void;
  onDownloadExport: (exportItem: ExportHistoryItem) => void;
}

export default function ReportComponent({
  exports,
  summary,
  isLoading,
  selectedReportType,
  currentPage,
  totalPages,
  onReportTypeChange,
  onPageChange,
  onExportAll,
  onViewExport,
  onDownloadExport
}: ReportComponentProps) {
  const reportTypes = [
    { id: 'all', label: 'All Reports' },
    { id: ReportType.FINANCIAL, label: 'Financial' },
    { id: ReportType.RENT_ROLL, label: 'Rent Roll' },
    { id: ReportType.LEASE_EXPIRATION, label: 'Lease Expiration' },
    { id: ReportType.TENANT_DIRECTORY, label: 'Tenant Directory' }
  ];

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Filters skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>

        {/* Reports grid skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!exports || exports.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Exports Available</h2>
        <p className="text-gray-500">
          There are no exports available for the selected criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Export History</h1>
          <p className="text-gray-500">View and download your exported reports</p>
        </div>
        <Button variant="outline" onClick={onExportAll}>
          Create New Export
        </Button>
      </div>

      {/* Report Type Filters */}
      <div className="flex flex-wrap gap-2">
        {reportTypes.map((type) => (
          <Button
            key={type.id}
            variant={selectedReportType === type.id ? "default" : "outline"}
            size="sm"
            onClick={() => onReportTypeChange(type.id)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Exports Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exports.map((exportItem: ExportHistoryItem, index: number) => (
          <Card key={exportItem._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm">
                  {exportItem.reportTypes.join(', ')}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  exportItem.status === ExportStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                  exportItem.status === ExportStatus.RUNNING ? 'bg-yellow-100 text-yellow-800' :
                  exportItem.status === ExportStatus.PENDING ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {exportItem.status}
                </span>
              </CardTitle>
              <CardDescription>
                Requested by {exportItem.userId?.fullName || 'Unknown User'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Requested:</span>
                  <span>{formatDate(exportItem.requestedAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Format:</span>
                  <span>{exportItem.format}</span>
                </div>
                {exportItem.fileSizeBytes && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Size:</span>
                    <span>{formatFileSize(exportItem.fileSizeBytes)}</span>
                  </div>
                )}
                <div className="pt-3 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onViewExport(exportItem)}
                  >
                    View Details
                  </Button>
                  {exportItem.status === ExportStatus.COMPLETED && exportItem.resultUrl && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onDownloadExport(exportItem)}
                    >
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* Summary Stats */}
      {summary && summary.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {summary.map((stat: ReportSummary, index: number) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 