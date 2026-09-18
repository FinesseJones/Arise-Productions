"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut, Scissors, Layers, Maximize2 } from 'lucide-react';

export interface TimelineMarker {
  id: string;
  time: number; // in frames
  type: 'in' | 'out' | 'chapter' | 'comment';
  label?: string;
  color?: string;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'subtitle';
  clips: TimelineClip[];
  locked?: boolean;
  muted?: boolean;
  solo?: boolean;
}

export interface TimelineClip {
  id: string;
  name: string;
  startTime: number; // in frames
  duration: number; // in frames
  color?: string;
  selected?: boolean;
}

interface TimelineProps {
  duration: number; // total duration in frames
  fps: number;
  currentTime: number;
  markers?: TimelineMarker[];
  tracks?: TimelineTrack[];
  onTimeChange?: (time: number) => void;
  onMarkerAdd?: (marker: TimelineMarker) => void;
  onClipSelect?: (clipId: string) => void;
  onClipSplit?: (clipId: string, atTime: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  duration = 900, // 30 seconds at 30fps
  fps = 30,
  currentTime = 0,
  markers = [],
  tracks = [],
  onTimeChange,
  onMarkerAdd,
  onClipSelect,
  onClipSplit,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1); // pixels per frame
  const [scrollLeft, setScrollLeft] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  // Format timecode
  const formatTimecode = (frames: number) => {
    const totalSeconds = frames / fps;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const frame = Math.floor(frames % fps);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frame).padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle playhead drag
  const handlePlayheadDrag = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollLeft;
    const newTime = Math.max(0, Math.min(duration, x / zoom));
    onTimeChange?.(newTime);
  };

  // Handle zoom
  const handleZoomIn = () => setZoom(Math.min(zoom * 1.5, 10));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.5, 0.5));

  // Handle frame navigation
  const handlePreviousFrame = () => {
    onTimeChange?.(Math.max(0, currentTime - 1));
  };

  const handleNextFrame = () => {
    onTimeChange?.(Math.min(duration, currentTime + 1));
  };

  // Auto-scroll to playhead
  useEffect(() => {
    if (isPlaying && timelineRef.current) {
      const playheadPosition = currentTime * zoom;
      const containerWidth = timelineRef.current.clientWidth;
      if (playheadPosition > scrollLeft + containerWidth * 0.8) {
        setScrollLeft(playheadPosition - containerWidth * 0.5);
      }
    }
  }, [currentTime, isPlaying, zoom, scrollLeft]);

  return (
    <div className="bg-surface-2 border border-gray-700 rounded-lg flex flex-col h-full">
      {/* Timeline Header */}
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousFrame}
            className="p-2 hover:bg-surface-3 rounded transition-colors"
            title="Previous Frame (J)"
          >
            <SkipBack className="w-4 h-4 text-contrast-secondary" />
          </button>
          <button
            onClick={togglePlay}
            className="p-2 hover:bg-surface-3 rounded transition-colors"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-contrast-secondary" />
            ) : (
              <Play className="w-4 h-4 text-contrast-secondary" />
            )}
          </button>
          <button
            onClick={handleNextFrame}
            className="p-2 hover:bg-surface-3 rounded transition-colors"
            title="Next Frame (K)"
          >
            <SkipForward className="w-4 h-4 text-contrast-secondary" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-mono text-4k-sm text-contrast-primary bg-surface-3 px-3 py-1 rounded">
            {formatTimecode(currentTime)}
          </div>
          <div className="text-4k-xs text-contrast-muted">
            / {formatTimecode(duration)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-surface-3 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-contrast-secondary" />
          </button>
          <div className="text-4k-xs text-contrast-muted w-12 text-center">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-surface-3 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-contrast-secondary" />
          </button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar" ref={timelineRef}>
        <div
          className="relative"
          style={{ width: `${duration * zoom}px`, minWidth: '100%' }}
        >
          {/* Time Ruler */}
          <div className="h-6 bg-surface-1 border-b border-gray-700 relative">
            {Array.from({ length: Math.ceil(duration / fps) }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-gray-600 text-4k-xs text-contrast-muted pl-1"
                style={{ left: `${i * fps * zoom}px` }}
              >
                {i}s
              </div>
            ))}
          </div>

          {/* Markers */}
          <div className="h-6 bg-surface-1 border-b border-gray-700 relative">
            {markers.map((marker) => (
              <div
                key={marker.id}
                className="absolute top-0 bottom-0 w-0.5 cursor-pointer"
                style={{
                  left: `${marker.time * zoom}px`,
                  backgroundColor: marker.color || '#f59e0b',
                }}
                title={marker.label || marker.type}
              />
            ))}
          </div>

          {/* Tracks */}
          <div className="relative">
            {tracks.map((track, trackIndex) => (
              <div
                key={track.id}
                className="h-12 border-b border-gray-700 relative bg-surface-1 hover:bg-surface-2 transition-colors"
              >
                {/* Track clips */}
                {track.clips.map((clip) => (
                  <div
                    key={clip.id}
                    className={`absolute top-1 bottom-1 rounded cursor-pointer transition-all ${
                      clip.selected ? 'ring-2 ring-purple-500' : ''
                    }`}
                    style={{
                      left: `${clip.startTime * zoom}px`,
                      width: `${clip.duration * zoom}px`,
                      backgroundColor: clip.color || (track.type === 'video' ? '#3b82f6' : track.type === 'audio' ? '#22c55e' : '#f59e0b'),
                    }}
                    onClick={() => onClipSelect?.(clip.id)}
                    onDoubleClick={() => onClipSplit?.(clip.id, currentTime)}
                    title={clip.name}
                  >
                    <div className="text-4k-xs text-white px-2 truncate">{clip.name}</div>
                  </div>
                ))}

                {/* Track controls */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button
                    className="p-1 hover:bg-surface-3 rounded"
                    title={track.locked ? 'Unlock' : 'Lock'}
                  >
                    <Layers className="w-3 h-3 text-contrast-muted" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div
            ref={playheadRef}
            className="absolute top-0 bottom-0 w-0.5 bg-orange-500 cursor-ew-resize z-10"
            style={{ left: `${currentTime * zoom}px` }}
            onMouseDown={handlePlayheadDrag}
          >
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-orange-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Timeline Footer */}
      <div className="p-2 border-t border-gray-700 flex items-center justify-between text-4k-xs text-contrast-muted">
        <div>
          <span>Duration: {formatTimecode(duration)}</span>
          <span className="ml-4">FPS: {fps}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Tracks: {tracks.length}</span>
          <span className="ml-4">Clips: {tracks.reduce((acc, t) => acc + t.clips.length, 0)}</span>
        </div>
      </div>
    </div>
  );
};
