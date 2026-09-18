"use client";

import React, { useState } from 'react';
import { 
  Grid3X3, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Layers, 
  Box, 
  Camera,
  Lightbulb,
  Zap
} from 'lucide-react';

type SafeArea = 'none' | 'title' | 'action' | 'both';
type GridVisibility = 'none' | '1x1' | '10x10' | '100x100';

interface AdvancedViewportFeaturesProps {
  onSafeAreaChange?: (area: SafeArea) => void;
  onGridChange?: (grid: GridVisibility) => void;
  onVisibilityToggle?: (layer: string) => void;
  onLockToggle?: (layer: string) => void;
}

export const AdvancedViewportFeatures: React.FC<AdvancedViewportFeaturesProps> = ({
  onSafeAreaChange,
  onGridChange,
  onVisibilityToggle,
  onLockToggle,
}) => {
  const [safeArea, setSafeArea] = useState<SafeArea>('none');
  const [gridVisibility, setGridVisibility] = useState<GridVisibility>('10x10');
  const [layers, setLayers] = useState<Record<string, { visible: boolean; locked: boolean }>>({
    geometry: { visible: true, locked: false },
    materials: { visible: true, locked: false },
    lighting: { visible: true, locked: false },
    particles: { visible: true, locked: false },
    helpers: { visible: false, locked: false },
  });

  const handleSafeAreaChange = (area: SafeArea) => {
    setSafeArea(area);
    onSafeAreaChange?.(area);
  };

  const handleGridChange = (grid: GridVisibility) => {
    setGridVisibility(grid);
    onGridChange?.(grid);
  };

  const handleLayerToggle = (layer: string, property: 'visible' | 'locked') => {
    setLayers((prev) => ({
      ...prev,
      [layer]: {
        ...prev[layer],
        [property]: !prev[layer][property],
      },
    }));
    
    if (property === 'visible') {
      onVisibilityToggle?.(layer);
    } else {
      onLockToggle?.(layer);
    }
  };

  return (
    <div className="bg-[#0c0819]/90 border border-amber-500/30 rounded-lg p-3 space-y-4">
      {/* Safe Area Overlays */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-amber-400/70" />
          <span className="text-xs font-medium text-amber-200">Safe Area</span>
        </div>
        <div className="flex gap-2">
          {(['none', 'title', 'action', 'both'] as SafeArea[]).map((area) => (
            <button
              key={area}
              onClick={() => handleSafeAreaChange(area)}
              className={`px-3 py-1 rounded text-[10px] font-mono transition-colors ${
                safeArea === area
                  ? 'bg-amber-500/30 border border-amber-400 text-amber-200'
                  : 'bg-[#060508] border border-slate-700 text-slate-400 hover:border-amber-500/50 hover:text-amber-300'
              }`}
            >
              {area.charAt(0).toUpperCase() + area.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Overlay */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Grid3X3 className="w-4 h-4 text-amber-400/70" />
          <span className="text-xs font-medium text-amber-200">Grid</span>
        </div>
        <div className="flex gap-2">
          {(['none', '1x1', '10x10', '100x100'] as GridVisibility[]).map((grid) => (
            <button
              key={grid}
              onClick={() => handleGridChange(grid)}
              className={`px-3 py-1 rounded text-[10px] font-mono transition-colors ${
                gridVisibility === grid
                  ? 'bg-amber-500/30 border border-amber-400 text-amber-200'
                  : 'bg-[#060508] border border-slate-700 text-slate-400 hover:border-amber-500/50 hover:text-amber-300'
              }`}
            >
              {grid}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Visibility */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-amber-400/70" />
          <span className="text-xs font-medium text-amber-200">Layers</span>
        </div>
        <div className="space-y-1">
          {Object.entries(layers).map(([name, layer]) => (
            <div key={name} className="flex items-center gap-2 p-2 bg-[#060508] border border-slate-700 rounded">
              <button
                onClick={() => handleLayerToggle(name, 'visible')}
                className={`p-1 rounded transition-colors ${
                  layer.visible ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleLayerToggle(name, 'locked')}
                className={`p-1 rounded transition-colors ${
                  layer.locked ? 'text-amber-400' : 'text-slate-500'
                }`}
              >
                {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
              <span className="text-[10px] font-mono text-amber-200 capitalize">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-amber-400/70" />
          <span className="text-xs font-medium text-amber-200">Quick Actions</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-[#060508] border border-slate-700 hover:border-amber-500/50 rounded text-[10px] font-mono text-amber-200 transition-colors">
            <Camera className="w-3 h-3" />
            Reset Camera
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#060508] border border-slate-700 hover:border-amber-500/50 rounded text-[10px] font-mono text-amber-200 transition-colors">
            <Box className="w-3 h-3" />
            Reset View
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#060508] border border-slate-700 hover:border-amber-500/50 rounded text-[10px] font-mono text-amber-200 transition-colors">
            <Lightbulb className="w-3 h-3" />
            Reset Lighting
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#060508] border border-slate-700 hover:border-amber-500/50 rounded text-[10px] font-mono text-amber-200 transition-colors">
            <Box className="w-3 h-3" />
            Reset Transforms
          </button>
        </div>
      </div>
    </div>
  );
};
