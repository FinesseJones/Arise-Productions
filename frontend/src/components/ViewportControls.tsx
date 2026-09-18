"use client";

import React, { useState } from 'react';
import { 
  View, 
  Box, 
  Layers, 
  Grid3X3, 
  Maximize2, 
  Minimize2,
  Monitor,
  ScanLine,
  Crop,
  Square
} from 'lucide-react';

type ViewportMode = 'perspective' | 'orthographic' | 'top' | 'front' | 'right';
type Resolution = '1080p' | '2K' | '4K' | '8K';
type AspectRatio = '16:9' | '2.39:1' | '9:16' | '1:1';

interface ViewportControlsProps {
  currentMode?: ViewportMode;
  currentResolution?: Resolution;
  currentAspectRatio?: AspectRatio;
  showGrid?: boolean;
  showSafeArea?: boolean;
  onModeChange?: (mode: ViewportMode) => void;
  onResolutionChange?: (resolution: Resolution) => void;
  onAspectRatioChange?: (ratio: AspectRatio) => void;
  onGridToggle?: () => void;
  onSafeAreaToggle?: () => void;
  onFullscreen?: () => void;
}

export const ViewportControls: React.FC<ViewportControlsProps> = ({
  currentMode = 'perspective',
  currentResolution = '4K',
  currentAspectRatio = '16:9',
  showGrid = false,
  showSafeArea = false,
  onModeChange,
  onResolutionChange,
  onAspectRatioChange,
  onGridToggle,
  onSafeAreaToggle,
  onFullscreen,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const viewportModes: { value: ViewportMode; label: string; icon: any }[] = [
    { value: 'perspective', label: 'Perspective', icon: View },
    { value: 'orthographic', label: 'Orthographic', icon: Box },
    { value: 'top', label: 'Top', icon: Layers },
    { value: 'front', label: 'Front', icon: Box },
    { value: 'right', label: 'Right', icon: Box },
  ];

  const resolutions: Resolution[] = ['1080p', '2K', '4K', '8K'];
  const aspectRatios: { value: AspectRatio; label: string }[] = [
    { value: '16:9', label: '16:9' },
    { value: '2.39:1', label: '2.39:1 (Cinema)' },
    { value: '9:16', label: '9:16 (Mobile)' },
    { value: '1:1', label: '1:1 (Square)' },
  ];

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (onFullscreen) onFullscreen();
  };

  return (
    <div className="bg-surface-2 border border-gray-700 rounded-lg p-2 flex items-center gap-4">
      {/* Viewport Mode */}
      <div className="flex items-center gap-2">
        <span className="text-4k-xs text-contrast-muted">View:</span>
        <div className="flex gap-1">
          {viewportModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => onModeChange?.(mode.value)}
              className={`p-2 rounded transition-colors ${
                currentMode === mode.value
                  ? 'bg-surface-4 text-contrast-primary'
                  : 'hover:bg-surface-3 text-contrast-secondary'
              }`}
              title={mode.label}
            >
              <mode.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Resolution */}
      <div className="flex items-center gap-2">
        <span className="text-4k-xs text-contrast-muted">Res:</span>
        <select
          value={currentResolution}
          onChange={(e) => onResolutionChange?.(e.target.value as Resolution)}
          className="bg-surface-3 text-contrast-primary text-4k-xs rounded px-2 py-1 border border-gray-700 focus:outline-none focus:border-purple-500"
        >
          {resolutions.map((res) => (
            <option key={res} value={res}>
              {res}
            </option>
          ))}
        </select>
      </div>

      {/* Aspect Ratio */}
      <div className="flex items-center gap-2">
        <span className="text-4k-xs text-contrast-muted">Ratio:</span>
        <select
          value={currentAspectRatio}
          onChange={(e) => onAspectRatioChange?.(e.target.value as AspectRatio)}
          className="bg-surface-3 text-contrast-primary text-4k-xs rounded px-2 py-1 border border-gray-700 focus:outline-none focus:border-purple-500"
        >
          {aspectRatios.map((ratio) => (
            <option key={ratio.value} value={ratio.value}>
              {ratio.label}
            </option>
          ))}
        </select>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-2">
        <button
          onClick={onGridToggle}
          className={`p-2 rounded transition-colors ${
            showGrid
              ? 'bg-surface-4 text-contrast-primary'
              : 'hover:bg-surface-3 text-contrast-secondary'
          }`}
          title="Toggle Grid"
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
        <button
          onClick={onSafeAreaToggle}
          className={`p-2 rounded transition-colors ${
            showSafeArea
              ? 'bg-surface-4 text-contrast-primary'
              : 'hover:bg-surface-3 text-contrast-secondary'
          }`}
          title="Toggle Safe Area"
        >
          <Crop className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen */}
      <div className="ml-auto">
        <button
          onClick={handleFullscreen}
          className="p-2 rounded hover:bg-surface-3 text-contrast-secondary transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
