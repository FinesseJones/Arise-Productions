import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Download, 
  Eye, 
  Star, 
  Clock, 
  Tag,
  Folder,
  FileText,
  Camera,
  Palette,
  Music,
  Video,
  Image,
  Archive,
  Plus,
  Upload,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AssetLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const assetCategories = [
    { name: 'Scripts', icon: FileText, count: 24, color: 'from-blue-500 to-cyan-500' },
    { name: 'Footage', icon: Video, count: 156, color: 'from-green-500 to-emerald-500' },
    { name: 'Images', icon: Image, count: 89, color: 'from-purple-500 to-violet-500' },
    { name: 'Audio', icon: Music, count: 67, color: 'from-orange-500 to-red-500' },
    { name: 'Graphics', icon: Palette, count: 43, color: 'from-pink-500 to-rose-500' },
    { name: 'Documents', icon: Archive, count: 78, color: 'from-teal-500 to-cyan-500' }
  ];

  const mockAssets = [
    {
      id: 1,
      name: 'Main Character Script v3.fdx',
      type: 'script',
      size: '2.4 MB',
      modified: '2 hours ago',
      project: 'Midnight Dreams',
      tags: ['final', 'approved'],
      thumbnail: null
    },
    {
      id: 2,
      name: 'Opening Scene Footage',
      type: 'video',
      size: '1.2 GB',
      modified: '1 day ago',
      project: 'Urban Stories',
      tags: ['raw', 'unedited'],
      thumbnail: '/api/placeholder/150/100'
    },
    {
      id: 3,
      name: 'Character Mood Board',
      type: 'image',
      size: '8.7 MB',
      modified: '3 days ago',
      project: 'Sci-Fi Epic',
      tags: ['concept', 'design'],
      thumbnail: '/api/placeholder/150/100'
    },
    {
      id: 4,
      name: 'Background Music Track 1',
      type: 'audio',
      size: '45.2 MB',
      modified: '1 week ago',
      project: 'Documentary',
      tags: ['ambient', 'licensed'],
      thumbnail: null
    }
  ];

  const getAssetIcon = (type: string) => {
    const icons: Record<string, any> = {
      script: FileText,
      video: Video,
      image: Image,
      audio: Music,
      graphics: Palette,
      document: Archive
    };
    return icons[type] || FileText;
  };

  const getAssetColor = (type: string) => {
    const colors: Record<string, any> = {
      script: 'from-blue-500 to-cyan-500',
      video: 'from-green-500 to-emerald-500',
      image: 'from-purple-500 to-violet-500',
      audio: 'from-orange-500 to-red-500',
      graphics: 'from-pink-500 to-rose-500',
      document: 'from-teal-500 to-cyan-500'
    };
    return colors[type] || 'from-gray-500 to-slate-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Asset Library</h1>
              <p className="text-gray-300">Organize, search, and manage all your creative assets</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button className="bg-gradient-to-r from-navy-600 to-blue-600 hover:from-navy-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Asset
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                />
              </div>
              <div className="flex items-center gap-3">
                <Select>
                  <SelectTrigger className="w-40 bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-800 border-gold-500/30">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="script">Scripts</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-40 bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-800 border-gold-500/30">
                    <SelectItem value="modified">Last Modified</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center border border-gold-500/30 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`${viewMode === 'grid' ? 'bg-gold-500/20 text-gold-300' : 'text-gray-400'} hover:bg-gold-500/10`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`${viewMode === 'list' ? 'bg-gold-500/20 text-gold-300' : 'text-gray-400'} hover:bg-gold-500/10`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {assetCategories.map((category) => (
              <Card key={category.name} className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm hover:bg-navy-800/50 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-400">{category.count} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Assets Grid/List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Assets</h2>
            <Badge variant="secondary" className="bg-navy-700/50 text-gray-300">
              {mockAssets.length} items
            </Badge>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockAssets.map((asset) => {
                const IconComponent = getAssetIcon(asset.type);
                return (
                  <Card key={asset.id} className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm hover:bg-navy-800/50 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-navy-900/50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                        {asset.thumbnail ? (
                          <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-16 h-16 bg-gradient-to-r ${getAssetColor(asset.type)} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="bg-black/50 text-white hover:bg-black/70">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-white mb-2 truncate">{asset.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{asset.size}</span>
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {asset.modified}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-navy-700/50 text-gray-300 text-xs">
                            {asset.project}
                          </Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                              <Share2 className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-gold-500/20 text-gold-300 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="divide-y divide-gold-500/10">
                  {mockAssets.map((asset) => {
                    const IconComponent = getAssetIcon(asset.type);
                    return (
                      <div key={asset.id} className="p-4 hover:bg-navy-800/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getAssetColor(asset.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{asset.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                              <span>{asset.size}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {asset.modified}
                              </span>
                              <Badge variant="secondary" className="bg-navy-700/50 text-gray-300 text-xs">
                                {asset.project}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {asset.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-gold-500/20 text-gold-300 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
