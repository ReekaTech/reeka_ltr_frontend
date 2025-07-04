import { Calendar, CheckCircle2, FileSpreadsheet, FileText, Settings, Users } from 'lucide-react';
import { Dropdown, SelectItem } from '@/components/ui/dropdown'; // Replace with your dropdown
import { ExportFormat, ReportType } from '@/services/api/schemas';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
// Import your date range picker
import { DateRangePicker } from '@/components/ui/date-range-picker'; // Replace with your actual component
import { Modal } from '@/components/ui/modal';
import { useExportReports } from '@/services/queries/hooks/useReport';
import { useProperties } from '@/services/queries/hooks/useProperties';
import { useState } from 'react';

interface CustomExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_OPTIONS = [
  {
    type: ReportType.FINANCIAL,
    label: 'Financial Reports',
    description: 'Revenue, expenses, rent roll, and financial summaries',
    icon: <FileSpreadsheet size={20} />,
  },
  {
    type: ReportType.RENT_ROLL,
    label: 'Rent Roll Reports',
    description: 'Vacancy rates, lease expirations, and unit status',
    icon: <FileText size={20} />,
  },
  {
    type: ReportType.LEASE_EXPIRATION,
    label: 'Lease Expiration Reports',
    description: 'Work orders, costs, and vendor performance',
    icon: <Settings size={20} />,
  },
  {
    type: ReportType.TENANT_DIRECTORY,
    label: 'Tenant Reports',
    description: 'Tenant information, contacts, and lease details',
    icon: <Users size={20} />,
  },
];

const FORMAT_OPTIONS = [
  { value: ExportFormat.SINGLE_FILE_MULTIPLE_SHEET, label: 'Single Excel File (Multiple Sheets)' },
  { value: ExportFormat.SINGLE_FILE_SEPARATE_SHEET, label: 'Single Excel File (Separate Sheets)' },
  { value: ExportFormat.SUMMARY_FILE_ONLY_SHEET, label: 'Summary File Only' },
];

const TABS = [
  { label: 'Reports & Data' },
  { label: 'Filters & Range' },
  { label: 'Format & Output' },
];

export default function CustomExportModal({ isOpen, onClose }: CustomExportModalProps) {
  const [tab, setTab] = useState(1); // Default to Filters & Range as in screenshot
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedReports, setSelectedReports] = useState<ReportType[]>([]);
  const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>(['all']);
  const [format, setFormat] = useState(ExportFormat.SINGLE_FILE_MULTIPLE_SHEET);
  const [fileName, setFileName] = useState('Property_Report');
  const [applyFormatting, setApplyFormatting] = useState(true);
  const [passwordProtect, setPasswordProtect] = useState(false);

  const exportReportsMutation = useExportReports();
  const { data: propertiesData, isLoading: isPropertiesLoading } = useProperties();

  // Validation
  const canGenerate =
    selectedReports.length > 0 &&
    dateRange && dateRange.from && dateRange.to &&
    selectedProperties.length > 0 &&
    fileName &&
    !exportReportsMutation.isPending;

  // Handlers
  const handleReportToggle = (type: ReportType) => {
    setSelectedReports((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handlePropertyToggle = (id: string) => {
    if (id === 'all') {
      setSelectedProperties(['all']);
    } else {
      setSelectedProperties((prev) => {
        const next = prev.includes(id)
          ? prev.filter((p) => p !== id)
          : [...prev.filter((p) => p !== 'all'), id];
        return next.length === 0 ? ['all'] : next;
      });
    }
  };

  const handleQuickRange = (range: 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'thisYear') => {
    const now = new Date();
    let from, to;
    if (range === 'thisMonth') {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (range === 'lastMonth') {
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      to = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (range === 'thisQuarter') {
      const quarter = Math.floor(now.getMonth() / 3);
      from = new Date(now.getFullYear(), quarter * 3, 1);
      to = new Date(now.getFullYear(), quarter * 3 + 3, 0);
    } else {
      from = new Date(now.getFullYear(), 0, 1);
      to = new Date(now.getFullYear(), 11, 31);
    }
    setDateRange({
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0],
    });
  };

  const handleGenerateExport = async () => {
    if (!canGenerate) return;
    exportReportsMutation.mutate(
      {
        reportTypes: selectedReports,
        dateRange: dateRange!,
        propertyIds: selectedProperties.includes('all') ? [] : selectedProperties,
        format,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            onClose();
          }, 1500);
        },
      }
    );
  };

  // Success State
  if (success) {
    return null;
  }

  // Map properties for checkbox list
  const propertyOptions = [
    { id: 'all', label: 'All Properties' },
    ...(propertiesData?.items?.map((p: any) => ({ id: p._id, label: p.name })) || [])
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Custom Export Configuration" contentClassName="max-w-2xl w-full">
      {/* Tabs */}
      <div className="flex mb-8 mt-2 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
        {TABS.map((t, i) => (
          <button
            key={t.label}
            className={`flex-1 py-3 text-center font-medium text-base transition-colors focus:outline-none
              ${tab === i ? 'bg-white text-gray-900 border-b-2 border-b-gray-900' : 'bg-gray-50 text-gray-400'}`}
            onClick={() => setTab(i)}
            type="button"
            tabIndex={0}
            style={{ outline: tab === i ? '2px solid theme(colors.primary.DEFAULT)' : 'none', outlineOffset: 0 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[320px] max-h-[60vh] overflow-y-auto">
        {tab === 0 && (
          <div>
            <div className="font-semibold text-lg text-gray-900 mb-4">Select Report Types</div>
            <div className="flex flex-col gap-4">
              {REPORT_OPTIONS.map((opt) => (
                <label key={opt.type} className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-5 cursor-pointer">
                  <Checkbox checked={selectedReports.includes(opt.type)} onCheckedChange={() => handleReportToggle(opt.type)} />
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      {opt.icon} {opt.label}
                    </div>
                    <div className="text-gray-500 text-sm">{opt.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
        {tab === 1 && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="font-semibold text-lg text-gray-900 mb-3">Date Range</div>
              <div className="mb-3">
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  requiredEndDate
                />
              </div>
              <div className="mb-2 text-gray-500 text-sm">Quick Ranges:</div>
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={() => handleQuickRange('thisMonth')}>This Month</Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickRange('lastMonth')}>Last Month</Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickRange('thisQuarter')}>This Quarter</Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickRange('thisYear')}>This Year</Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg text-gray-900 mb-3">Properties</div>
              <div className="w-full max-w-xs flex flex-col gap-2 max-h-60 overflow-y-auto border border-gray-100 rounded-lg p-2 bg-white">
                {isPropertiesLoading ? (
                  <div className="text-gray-500 text-sm">Loading properties...</div>
                ) : (
                  propertyOptions.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 whitespace-nowrap">
                      <Checkbox checked={selectedProperties.includes(opt.id)} onCheckedChange={() => handlePropertyToggle(opt.id)} />
                      <span className={opt.id === 'all' ? 'font-medium text-gray-900' : ''}>{opt.label}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        {tab === 2 && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="font-semibold text-lg text-gray-900 mb-3">Export Format</div>
              <Dropdown value={format} onChange={(value) => setFormat(value as ExportFormat)}>
                {FORMAT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </Dropdown>
              <div className="mt-4">
                <div className="font-medium text-gray-900 mb-2">Additional Options:</div>
                <label className="flex items-center gap-2 mb-2">
                  <Checkbox checked={applyFormatting} onCheckedChange={() => setApplyFormatting(!applyFormatting)} />
                  <span>Apply Formatting</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked={passwordProtect} onCheckedChange={() => setPasswordProtect(!passwordProtect)} />
                  <span>Password Protect File</span>
                </label>
              </div>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg text-gray-900 mb-3">File Settings</div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">File Name:</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                <div className="font-medium mb-1">Export Preview:</div>
                <div>File: {fileName}_2025-07-04.xlsx</div>
                <div>Reports: {selectedReports.length} selected</div>
                <div>Properties: {selectedProperties.includes('all') ? 'All' : selectedProperties.join(', ')}</div>
                <div>Format: {FORMAT_OPTIONS.find(opt => opt.value === format)?.label}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-8 gap-3 border-t border-gray-200 pt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button
          variant="default"
          disabled={!canGenerate}
          onClick={handleGenerateExport}
          className="flex items-center gap-2 min-w-[150px]"
        >
          <FileSpreadsheet size={18} />
          {exportReportsMutation.isPending ? 'Generating...' : 'Generate Export'}
        </Button>
      </div>
    </Modal>
  );
} 