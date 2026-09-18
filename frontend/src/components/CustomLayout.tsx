"use client";

import React, { useState, useCallback } from 'react';
import { GripVertical, X, Save, RotateCcw, Plus } from 'lucide-react';

export interface PanelConfig {
  id: string;
  name: string;
  component: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
}

export interface LayoutConfig {
  id: string;
  name: string;
  panels: PanelConfig[];
}

interface CustomLayoutProps {
  availablePanels: PanelConfig[];
  currentLayout?: LayoutConfig;
  onLayoutChange?: (layout: LayoutConfig) => void;
  onLayoutSave?: (layout: LayoutConfig) => void;
}

export const CustomLayout: React.FC<CustomLayoutProps> = ({
  availablePanels,
  currentLayout,
  onLayoutChange,
  onLayoutSave,
}) => {
  const [panels, setPanels] = useState<PanelConfig[]>(currentLayout?.panels || []);
  const [draggingPanel, setDraggingPanel] = useState<string | null>(null);
  const [resizingPanel, setResizingPanel] = useState<string | null>(null);
  const [savedLayouts, setSavedLayouts] = useState<LayoutConfig[]>([]);

  const handlePanelDrag = useCallback((panelId: string, deltaX: number, deltaY: number) => {
    setPanels((prev) =>
      prev.map((panel) =>
        panel.id === panelId
          ? { ...panel, x: Math.max(0, panel.x + deltaX), y: Math.max(0, panel.y + deltaY) }
          : panel
      )
    );
  }, []);

  const handlePanelResize = useCallback((panelId: string, deltaWidth: number, deltaHeight: number) => {
    setPanels((prev) =>
      prev.map((panel) =>
        panel.id === panelId
          ? {
              ...panel,
              width: Math.max(panel.minWidth || 200, panel.width + deltaWidth),
              height: Math.max(panel.minHeight || 150, panel.height + deltaHeight),
            }
          : panel
      )
    );
  }, []);

  const handleAddPanel = (panel: PanelConfig) => {
    if (!panels.find((p) => p.id === panel.id)) {
      setPanels([...panels, { ...panel, x: 100, y: 100 }]);
    }
  };

  const handleRemovePanel = (panelId: string) => {
    setPanels(panels.filter((p) => p.id !== panelId));
  };

  const handleResetLayout = () => {
    setPanels(currentLayout?.panels || []);
  };

  const handleSaveLayout = () => {
    const newLayout: LayoutConfig = {
      id: `layout-${Date.now()}`,
      name: `Custom Layout ${savedLayouts.length + 1}`,
      panels,
    };
    setSavedLayouts([...savedLayouts, newLayout]);
    onLayoutSave?.(newLayout);
  };

  return (
    <div className="bg-surface-2 border border-gray-700 rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-4k-base font-semibold text-contrast-primary">Custom Layout</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetLayout}
            className="p-2 hover:bg-surface-3 rounded transition-colors"
            title="Reset to default"
          >
            <RotateCcw className="w-4 h-4 text-contrast-secondary" />
          </button>
          <button
            onClick={handleSaveLayout}
            className="p-2 hover:bg-surface-3 rounded transition-colors"
            title="Save layout"
          >
            <Save className="w-4 h-4 text-contrast-secondary" />
          </button>
        </div>
      </div>

      {/* Available Panels */}
      <div className="mb-3">
        <div className="text-4k-xs text-contrast-muted mb-2">Available Panels</div>
        <div className="flex flex-wrap gap-2">
          {availablePanels.map((panel) => (
            <button
              key={panel.id}
              onClick={() => handleAddPanel(panel)}
              disabled={panels.find((p) => p.id === panel.id)}
              className={`px-3 py-1 rounded text-4k-sm transition-colors ${
                panels.find((p) => p.id === panel.id)
                  ? 'bg-surface-3 text-contrast-muted cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {panel.name}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Canvas */}
      <div className="relative bg-surface-1 rounded border border-gray-700" style={{ height: '400px' }}>
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="absolute bg-surface-2 border border-gray-600 rounded overflow-hidden"
            style={{
              left: `${panel.x}px`,
              top: `${panel.y}px`,
              width: `${panel.width}px`,
              height: `${panel.height}px`,
            }}
          >
            {/* Panel Header */}
            <div
              className="flex items-center justify-between p-2 bg-surface-3 cursor-move"
              onMouseDown={() => setDraggingPanel(panel.id)}
            >
              <span className="text-4k-sm text-contrast-primary">{panel.name}</span>
              <button
                onClick={() => handleRemovePanel(panel.id)}
                className="p-1 hover:bg-surface-4 rounded"
              >
                <X className="w-3 h-3 text-contrast-muted" />
              </button>
            </div>

            {/* Panel Content Placeholder */}
            <div className="p-2 text-4k-xs text-contrast-muted">
              {panel.component}
            </div>

            {/* Resize Handle */}
            {panel.resizable !== false && (
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                onMouseDown={() => setResizingPanel(panel.id)}
              >
                <GripVertical className="w-4 h-4 text-contrast-muted" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Saved Layouts */}
      {savedLayouts.length > 0 && (
        <div className="mt-3">
          <div className="text-4k-xs text-contrast-muted mb-2">Saved Layouts</div>
          <div className="space-y-1">
            {savedLayouts.map((layout) => (
              <button
                key={layout.id}
                onClick={() => setPanels(layout.panels)}
                className="w-full text-left px-3 py-2 bg-surface-1 hover:bg-surface-3 rounded text-4k-sm text-contrast-primary transition-colors"
              >
                {layout.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
