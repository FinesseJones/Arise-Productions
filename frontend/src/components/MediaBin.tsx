"use client";

import React, { useState } from 'react';
import { Search, Grid, List, Filter, FolderOpen, Clock, HardDrive, Download, Upload } from 'lucide-react';

export interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image' | '3d';
  url: string;
  thumbnail?: string;
  duration?: number; // in seconds
  resolution?: string;
  codec?: string;
  fps?: number;
  size?: number; // in bytes
  createdAt: string;
  tags?: string[];
}

interface MediaBinProps {
  assets: MediaAsset[];
  onAssetSelect?: (asset: MediaAsset) => void;
  onAssetDelete?: (assetId: string) => void;
  onAssetUpload?: (files: File[]) => void;
}

type FilterType = 'all' | 'video' | 'audio' | 'image' | '3d';
type SortBy = 'name' | 'date' | 'duration' | 'size';
type ViewMode = 'grid' | 'list';

export const MediaBin: React.FC<MediaBinProps> = ({
  assets = [],
  onAssetSelect,
  onAssetDelete,
  onAssetUpload,
}) => {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    const matchesType = filterType === 'all' || asset.type === filterType;
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Sort assets
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'duration':
        return (b.duration || 0) - (a.duration || 0);
      case 'size':
        return (b.size || 0) - (a.size || 0);
      default:
        return 0;
    }
  });

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  // Get type icon
  const getTypeIcon = (type: MediaAsset['type']) => {
    switch (type) {
      case 'video':
        return '🎬';
      case 'audio':
        return '🎵';
      case 'image':
        return '🖼️';
      case '3d':
        return '🎮';
      default:
        return '📄';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onAssetUpload?.(files);
  };

  return (
    <div className="bg-surface-2 border border-gray-700 rounded-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-4k-base font-semibold text-contrast-primary">Media Bin</h3>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button className="p-2 hover:bg-surface-3 rounded transition-colors" title="Upload">
                <Upload className="w-4 h-4 text-contrast-secondary" />
              </button>
            </label>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 hover:bg-surface-3 rounded transition-colors"
              title={viewMode === 'grid' ? 'List View' : 'Grid View'}
            >
              {viewMode === 'grid' ? (
                <List className="w-4 h-4 text-contrast-secondary" />
              ) : (
                <Grid className="w-4 h-4 text-contrast-secondary" />
              )}
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-contrast-muted" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-3 text-contrast-primary pl-10 pr-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-purple-500 text-4k-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="bg-surface-3 text-contrast-primary px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-purple-500 text-4k-sm"
          >
            <option value="all">All Types</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="image">Image</option>
            <option value="3d">3D</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="bg-surface-3 text-contrast-primary px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-purple-500 text-4k-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="duration">Sort by Duration</option>
            <option value="size">Sort by Size</option>
          </select>
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        {sortedAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-contrast-muted">
            <FolderOpen className="w-12 h-12 mb-2" />
            <p className="text-4k-sm">No assets found</p>
            <p className="text-4k-xs mt-1">Upload files to get started</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-3">
            {sortedAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-surface-1 rounded-lg overflow-hidden hover:bg-surface-3 transition-colors cursor-pointer group"
                onClick={() => onAssetSelect?.(asset)}
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-surface-2 flex items-center justify-center">
                  {asset.thumbnail ? (
                    <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">{getTypeIcon(asset.type)}</span>
                  )}
                </div>

                {/* Info */}
                <div className="p-2">
                  <div className="text-4k-xs text-contrast-primary truncate">{asset.name}</div>
                  <div className="flex items-center gap-2 mt-1 text-4k-xs text-contrast-muted">
                    {asset.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(asset.duration)}
                      </span>
                    )}
                    {asset.size && (
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {formatSize(asset.size)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {sortedAssets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center gap-3 p-2 bg-surface-1 rounded hover:bg-surface-3 transition-colors cursor-pointer group"
                onClick={() => onAssetSelect?.(asset)}
              >
                <span className="text-2xl">{getTypeIcon(asset.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-4k-sm text-contrast-primary truncate">{asset.name}</div>
                  <div className="flex items-center gap-3 text-4k-xs text-contrast-muted">
                    {asset.resolution && <span>{asset.resolution}</span>}
                    {asset.codec && <span>{asset.codec}</span>
                    {asset.fps && <span>{asset.fps}fps</span>}
                    {asset.duration && <span>{formatDuration(asset.duration)}</span>}
                    {asset.size && <span>{formatSize(asset.size)}</span>}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssetDelete?.(asset.id);
                  }}
                  className="p-1 hover:bg-surface-4 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete"
                >
                  <Download className="w-4 h-4 text-contrast-muted" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-700 flex items-center justify-between text-4k-xs text-contrast-muted">
        <div>
          <span>{sortedAssets.length} assets</span>
          <span className="ml-4">Total: {formatSize(assets.reduce((acc, a) => acc + (a.size || 0), 0))}</span>
        </div>
      </div>
    </div>
  );
};
