"use client";

import React, { useState } from 'react';
import { Keyboard, X, Search } from 'lucide-react';
import { productionShortcuts } from '../hooks/useKeyboardShortcuts';

export const KeyboardShortcutsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredShortcuts = productionShortcuts.filter((shortcut) =>
    shortcut.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatShortcut = (shortcut: typeof productionShortcuts[0]) => {
    const parts: string[] = [];
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.metaKey) parts.push('Cmd');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.altKey) parts.push('Alt');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-surface-2 border border-gray-700 rounded-lg hover:bg-surface-3 transition-colors"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="w-5 h-5 text-contrast-secondary" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-2 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-4k-lg font-semibold text-contrast-primary">Keyboard Shortcuts</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-surface-3 rounded transition-colors"
          >
            <X className="w-5 h-5 text-contrast-secondary" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-contrast-muted" />
            <input
              type="text"
              placeholder="Search shortcuts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-3 text-contrast-primary pl-10 pr-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-4">
            {filteredShortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-surface-1 rounded border border-gray-700"
              >
                <span className="text-4k-sm text-contrast-secondary">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-surface-3 text-contrast-primary text-4k-xs rounded border border-gray-600 font-mono">
                  {formatShortcut(shortcut)}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 text-center">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
