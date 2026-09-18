"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Sliders, Palette, Lightbulb, Zap, Box, Move3D } from 'lucide-react';

export interface PropertyValue {
  type: 'number' | 'string' | 'boolean' | 'color' | 'vector3' | 'select';
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
}

export interface PropertyGroup {
  id: string;
  name: string;
  icon?: any;
  properties: Record<string, PropertyValue>;
  collapsed?: boolean;
}

interface InspectorPanelProps {
  selectedObject?: any;
  propertyGroups?: PropertyGroup[];
  onPropertyChange?: (groupId: string, property: string, value: any) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedObject,
  propertyGroups = [],
  onPropertyChange,
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupId)) {
      newCollapsed.delete(groupId);
    } else {
      newCollapsed.add(groupId);
    }
    setCollapsedGroups(newCollapsed);
  };

  const renderPropertyValue = (property: PropertyValue, groupId: string, key: string) => {
    const handleChange = (value: any) => {
      onPropertyChange?.(groupId, key, value);
    };

    switch (property.type) {
      case 'number':
        return (
          <input
            type="number"
            value={property.value}
            min={property.min}
            max={property.max}
            step={property.step || 0.1}
            onChange={(e) => handleChange(parseFloat(e.target.value))}
            className="w-full bg-surface-3 text-contrast-primary px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-purple-500 text-4k-sm"
          />
        );

      case 'string':
        return (
          <input
            type="text"
            value={property.value}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full bg-surface-3 text-contrast-primary px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-purple-500 text-4k-sm"
          />
        );

      case 'boolean':
        return (
          <button
            onClick={() => handleChange(!property.value)}
            className={`w-12 h-6 rounded-full transition-colors ${
              property.value ? 'bg-purple-600' : 'bg-gray-600'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                property.value ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        );

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={property.value}
              onChange={(e) => handleChange(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0"
            />
            <input
              type="text"
              value={property.value}
              onChange={(e) => handleChange(e.target.value)}
              className="flex-1 bg-surface-3 text-contrast-primary px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-purple-500 text-4k-sm font-mono"
            />
          </div>
        );

      case 'vector3':
        const vec = property.value || { x: 0, y: 0, z: 0 };
        return (
          <div className="grid grid-cols-3 gap-2">
            {['x', 'y', 'z'].map((axis) => (
              <div key={axis} className="flex items-center gap-1">
                <span className="text-4k-xs text-contrast-muted w-4">{axis}</span>
                <input
                  type="number"
                  value={vec[axis]}
                  step={property.step || 0.1}
                  onChange={(e) => handleChange({ ...vec, [axis]: parseFloat(e.target.value) })}
                  className="w-full bg-surface-3 text-contrast-primary px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-purple-500 text-4k-sm"
                />
              </div>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            value={property.value}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full bg-surface-3 text-contrast-primary px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-purple-500 text-4k-sm"
          >
            {property.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return <span className="text-4k-sm text-contrast-muted">{String(property.value)}</span>;
    }
  };

  if (!selectedObject) {
    return (
      <div className="bg-surface-2 border border-gray-700 rounded-lg p-4 h-full flex items-center justify-center">
        <div className="text-center text-contrast-muted">
          <Box className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-4k-sm">No object selected</p>
          <p className="text-4k-xs mt-1">Select an object to view properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-2 border border-gray-700 rounded-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-4k-base font-semibold text-contrast-primary">Inspector</h3>
        <p className="text-4k-xs text-contrast-muted mt-1">{selectedObject.name || 'Selected Object'}</p>
      </div>

      {/* Property Groups */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {propertyGroups.map((group) => (
          <div key={group.id} className="mb-2">
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center gap-2 p-2 hover:bg-surface-3 rounded transition-colors text-left"
            >
              {collapsedGroups.has(group.id) ? (
                <ChevronRight className="w-4 h-4 text-contrast-muted" />
              ) : (
                <ChevronDown className="w-4 h-4 text-contrast-muted" />
              )}
              {group.icon && <group.icon className="w-4 h-4 text-contrast-secondary" />}
              <span className="text-4k-sm font-medium text-contrast-primary">{group.name}</span>
            </button>

            {!collapsedGroups.has(group.id) && (
              <div className="mt-2 space-y-2 pl-6">
                {Object.entries(group.properties).map(([key, property]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-4k-xs text-contrast-muted capitalize">{key}</label>
                    {renderPropertyValue(property, group.id, key)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-700 text-4k-xs text-contrast-muted">
        <div className="flex items-center justify-between">
          <span>{propertyGroups.length} sections</span>
          <span>
            {propertyGroups.reduce((acc, g) => acc + Object.keys(g.properties).length, 0)} properties
          </span>
        </div>
      </div>
    </div>
  );
};
