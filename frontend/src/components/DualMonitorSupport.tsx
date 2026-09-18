"use client";

import React, { useState, useEffect } from 'react';
import { Monitor, Maximize2, Minimize2, ExternalLink } from 'lucide-react';

export interface DisplayInfo {
  id: string;
  isPrimary: boolean;
  width: number;
  height: number;
  refreshRate: number;
  isInternal: boolean;
}

interface DualMonitorSupportProps {
  onDisplayChange?: (displayId: string) => void;
  onWindowMove?: (displayId: string) => void;
}

export const DualMonitorSupport: React.FC<DualMonitorSupportProps> = ({
  onDisplayChange,
  onWindowMove,
}) => {
  const [displays, setDisplays] = useState<DisplayInfo[]>([]);
  const [selectedDisplay, setSelectedDisplay] = useState<string>('');
  const [isExtended, setIsExtended] = useState(false);

  useEffect(() => {
    // Detect displays
    const detectDisplays = async () => {
      try {
        // In a real Electron app, this would use screen API
        // For web, we use window.screen and assume primary
        const primaryDisplay: DisplayInfo = {
          id: 'primary',
          isPrimary: true,
          width: window.screen.width,
          height: window.screen.height,
          refreshRate: 60, // Default, would be detected in Electron
          isInternal: true,
        };

        setDisplays([primaryDisplay]);
        setSelectedDisplay('primary');
      } catch (err) {
        console.error('Failed to detect displays:', err);
      }
    };

    detectDisplays();
  }, []);

  const handleWindowMove = (displayId: string) => {
    if (onWindowMove) {
      onWindowMove(displayId);
    }
  };

  const toggleExtendedMode = () => {
    setIsExtended(!isExtended);
    // In Electron, this would actually enable/disable extended mode
  };

  return (
    <div className="bg-surface-2 border border-gray-700 rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-contrast-secondary" />
          <h3 className="text-4k-base font-semibold text-contrast-primary">Display Configuration</h3>
        </div>
        <button
          onClick={toggleExtendedMode}
          className={`px-3 py-1 rounded text-4k-sm transition-colors ${
            isExtended ? 'bg-purple-600 text-white' : 'bg-surface-3 text-contrast-secondary'
          }`}
        >
          {isExtended ? 'Extended' : 'Mirror'}
        </button>
      </div>

      <div className="space-y-2">
        {displays.map((display) => (
          <div
            key={display.id}
            className={`p-3 rounded border transition-colors ${
              selectedDisplay === display.id
                ? 'bg-surface-3 border-purple-500'
                : 'bg-surface-1 border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {display.isPrimary && (
                  <span className="px-2 py-0.5 bg-green-600 text-white text-4k-xs rounded">Primary</span>
                )}
                <span className="text-4k-sm text-contrast-primary">
                  {display.isInternal ? 'Built-in Display' : 'External Display'}
                </span>
              </div>
              <button
                onClick={() => handleWindowMove(display.id)}
                className="p-1 hover:bg-surface-4 rounded transition-colors"
                title="Move window to this display"
              >
                <ExternalLink className="w-4 h-4 text-contrast-muted" />
              </button>
            </div>
            <div className="mt-2 text-4k-xs text-contrast-muted grid grid-cols-2 gap-2">
              <div>Resolution: {display.width} x {display.height}</div>
              <div>Refresh: {display.refreshRate}Hz</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 p-2 bg-surface-1 rounded border border-gray-700">
        <p className="text-4k-xs text-contrast-muted">
          <strong>Tip:</strong> In desktop mode, drag windows between displays. In web mode, displays are simulated.
        </p>
      </div>
    </div>
  );
};
