'use client';

import { Checkbox, IndeterminateCheckbox } from '@/components/ui';
import { ChevronDown, ChevronRight, FileText, Minus } from 'lucide-react';

import { usePortfoliosWithProperties } from '@/services/queries/hooks';
import { useState } from 'react';

interface Property {
  _id: string;
  name: string;
}

interface Portfolio {
  _id: string;
  name: string;
  organizationId: string;
  properties: Property[];
}

interface PropertyAssignmentData {
  portfolios: Portfolio[];
  unassignedProperties: Property[];
}

interface PropertyAssignmentProps {
  onPropertyAssignmentChange?: (assignments: Record<string, string[]>) => void;
}

export function PropertyAssignment({ onPropertyAssignmentChange }: PropertyAssignmentProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedProperties, setSelectedProperties] = useState<Record<string, string[]>>({});
  
  const { data, isLoading, error } = usePortfoliosWithProperties();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, propIndex) => (
                <div key={propIndex} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load property data</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No property data available</p>
      </div>
    );
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handlePortfolioSelectAll = (portfolioId: string, properties: Property[]) => {
    const currentSelected = selectedProperties[portfolioId] || [];
    const allPropertyIds = properties.map(p => p._id);
    
    if (currentSelected.length === allPropertyIds.length) {
      // Deselect all
      const newSelected = { ...selectedProperties };
      delete newSelected[portfolioId];
      setSelectedProperties(newSelected);
    } else {
      // Select all
      setSelectedProperties(prev => ({
        ...prev,
        [portfolioId]: allPropertyIds
      }));
    }
  };

  const handlePropertySelect = (portfolioId: string, propertyId: string, properties: Property[]) => {
    const currentSelected = selectedProperties[portfolioId] || [];
    const isSelected = currentSelected.includes(propertyId);
    
    if (isSelected) {
      const newSelected = currentSelected.filter(id => id !== propertyId);
      if (newSelected.length === 0) {
        const newState = { ...selectedProperties };
        delete newState[portfolioId];
        setSelectedProperties(newState);
      } else {
        setSelectedProperties(prev => ({
          ...prev,
          [portfolioId]: newSelected
        }));
      }
    } else {
      setSelectedProperties(prev => ({
        ...prev,
        [portfolioId]: [...currentSelected, propertyId]
      }));
    }
  };

  const handleUnassignedSelectAll = (properties: Property[]) => {
    const currentSelected = selectedProperties['unassigned'] || [];
    const allPropertyIds = properties.map(p => p._id);
    
    if (currentSelected.length === allPropertyIds.length) {
      // Deselect all
      const newSelected = { ...selectedProperties };
      delete newSelected['unassigned'];
      setSelectedProperties(newSelected);
    } else {
      // Select all
      setSelectedProperties(prev => ({
        ...prev,
        unassigned: allPropertyIds
      }));
    }
  };

  const handleUnassignedPropertySelect = (propertyId: string, properties: Property[]) => {
    const currentSelected = selectedProperties['unassigned'] || [];
    const isSelected = currentSelected.includes(propertyId);
    
    if (isSelected) {
      const newSelected = currentSelected.filter(id => id !== propertyId);
      if (newSelected.length === 0) {
        const newState = { ...selectedProperties };
        delete newState['unassigned'];
        setSelectedProperties(newState);
      } else {
        setSelectedProperties(prev => ({
          ...prev,
          unassigned: newSelected
        }));
      }
    } else {
      setSelectedProperties(prev => ({
        ...prev,
        unassigned: [...currentSelected, propertyId]
      }));
    }
  };

  const getSelectedCount = (portfolioId: string, properties: Property[]) => {
    const selected = selectedProperties[portfolioId] || [];
    return selected.length;
  };

  const isAllSelected = (portfolioId: string, properties: Property[]) => {
    const selected = selectedProperties[portfolioId] || [];
    return selected.length === properties.length && properties.length > 0;
  };

  const isIndeterminate = (portfolioId: string, properties: Property[]) => {
    const selected = selectedProperties[portfolioId] || [];
    return selected.length > 0 && selected.length < properties.length;
  };

  return (
    <div className="space-y-4">
      {/* Personnel Sections */}
      {data.portfolios.map((portfolio, index) => {
        const personnelId = `P${index + 1}`;
        const isExpanded = expandedSections[personnelId];
        const selectedCount = getSelectedCount(portfolio._id, portfolio.properties);
        const allSelected = isAllSelected(portfolio._id, portfolio.properties);
        const indeterminate = isIndeterminate(portfolio._id, portfolio.properties);

        return (
          <div key={portfolio._id} className="border border-gray-200 rounded-lg">
            {/* Personnel Header */}
            <div 
              className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleSection(personnelId)}
            >
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900">{personnelId}</span>
                <div className="flex items-center space-x-2">
                  <IndeterminateCheckbox
                    checked={allSelected}
                    indeterminate={indeterminate}
                    onChange={() => handlePortfolioSelectAll(portfolio._id, portfolio.properties)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm text-gray-600">
                    Select All ({selectedCount}/{portfolio.properties.length})
                  </span>
                </div>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </div>

            {/* Properties List */}
            {isExpanded && (
              <div className="p-3 space-y-2">
                {portfolio.properties.map((property) => (
                  <div key={property._id} className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedProperties[portfolio._id]?.includes(property._id) || false}
                      onChange={() => handlePropertySelect(portfolio._id, property._id, portfolio.properties)}
                    />
                    <span className="text-sm text-gray-700">{property.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Unassigned Properties Section */}
      <div className="border border-gray-200 rounded-lg">
        <div 
          className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
          onClick={() => toggleSection('unassigned')}
        >
          <div className="flex items-center space-x-3">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-900">Unassigned Properties</span>
            <span className="text-sm text-gray-500">({data.unassignedProperties.length})</span>
            <div className="flex items-center space-x-2">
              <IndeterminateCheckbox
                checked={isAllSelected('unassigned', data.unassignedProperties)}
                indeterminate={isIndeterminate('unassigned', data.unassignedProperties)}
                onChange={() => handleUnassignedSelectAll(data.unassignedProperties)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm text-gray-600">
                Select All ({getSelectedCount('unassigned', data.unassignedProperties)}/{data.unassignedProperties.length})
              </span>
            </div>
          </div>
          {expandedSections['unassigned'] ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </div>

        {expandedSections['unassigned'] && (
          <div className="p-3 space-y-2">
            {data.unassignedProperties.map((property) => (
              <div key={property._id} className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedProperties['unassigned']?.includes(property._id) || false}
                  onChange={() => handleUnassignedPropertySelect(property._id, data.unassignedProperties)}
                />
                <span className="text-sm text-gray-700">{property.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Personnel Button */}
      <button className="w-full bg-[#e36b37] text-white py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all font-medium">
        Add Personnel
      </button>
    </div>
  );
} 