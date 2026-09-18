// ==============================================================================
// ARISE PRODUCTION - KEYBOARD SHORTCUTS HOOK
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  action: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find((shortcut) => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey;
        const metaMatch = shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey;
        const shiftMatch = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey;
        const altMatch = shortcut.altKey === undefined || event.altKey === shortcut.altKey;

        return keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch;
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

// Industry-standard production shortcuts
export const productionShortcuts: KeyboardShortcut[] = [
  {
    key: ' ',
    description: 'Play/Pause',
    action: () => console.log('Play/Pause'),
  },
  {
    key: 'j',
    description: 'Previous Frame',
    action: () => console.log('Previous Frame'),
  },
  {
    key: 'k',
    description: 'Next Frame',
    action: () => console.log('Next Frame'),
  },
  {
    key: 'l',
    description: 'Mark In',
    action: () => console.log('Mark In'),
  },
  {
    key: 'r',
    description: 'Mark Out',
    action: () => console.log('Mark Out'),
  },
  {
    key: 'i',
    ctrlKey: true,
    description: 'Insert Keyframe',
    action: () => console.log('Insert Keyframe'),
  },
  {
    key: 's',
    description: 'Split Clip',
    action: () => console.log('Split Clip'),
  },
  {
    key: 'Delete',
    description: 'Remove Selection',
    action: () => console.log('Remove Selection'),
  },
  {
    key: 'z',
    ctrlKey: true,
    description: 'Undo',
    action: () => console.log('Undo'),
  },
  {
    key: 'z',
    ctrlKey: true,
    shiftKey: true,
    description: 'Redo',
    action: () => console.log('Redo'),
  },
  {
    key: 'f',
    description: 'Toggle Fullscreen',
    action: () => console.log('Toggle Fullscreen'),
  },
  {
    key: 'g',
    description: 'Toggle Grid',
    action: () => console.log('Toggle Grid'),
  },
  {
    key: 'h',
    description: 'Toggle Safe Area',
    action: () => console.log('Toggle Safe Area'),
  },
  {
    key: '1',
    description: 'Perspective View',
    action: () => console.log('Perspective View'),
  },
  {
    key: '2',
    description: 'Top View',
    action: () => console.log('Top View'),
  },
  {
    key: '3',
    description: 'Front View',
    action: () => console.log('Front View'),
  },
  {
    key: '4',
    description: 'Right View',
    action: () => console.log('Right View'),
  },
];
