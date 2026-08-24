import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Target, 
  Download, 
  Settings, 
  Monitor,
  Smartphone,
  Tv,
  Globe,
  Play,
  Film,
  Music,
  Image,
  FileText,
  Zap,
  CheckCircle,
  Clock,
  Star,
  Layers,
  Eye,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

export default function PlatformOptimizer() {
  const { id } = useParams<{ id: string }>();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [contentType, setContentType] = useState<'feature' | 'series' | 'short' | 'documentary' | 'commercial'>('feature');
  const [targetAudience, setTargetAudience] = useState('');
  const [optimizationData, setOptimizationData] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { toast } = useToast();

  const platforms = [
    {
      id: 'netflix',
      name: 'Netflix',
      icon: Tv,
      color: 'from-red-600 to-red-700',
      description: '4K HDR streaming platform',
      specs: '4K, HDR, 5.1 Audio, Multiple Languages'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Play,
      color: 'from-red-500 to-red-600',
      description: 'Global video sharing platform',
      specs: '1080p, Stereo, Auto-captions, Thumbnails'
    },
    {
      id: 'theatrical',
      name: 'Theatrical',
      icon: Film,
      color: 'from-purple-600 to-purple-700',
      description: 'Cinema distribution',
      specs: '2K/4K DCP, 7.1 Audio, Multiple formats'
    },
    {
      id: 'streaming',
      name: 'Streaming Platforms',
      icon: Monitor,
      color: 'from-blue-600 to-blue-700',
      description: 'General streaming services',
      specs: '1080p/4K, 5.1 Audio, Subtitles'
    },
    {
      id: 'mobile',
      name: 'Mobile Platforms',
      icon: Smartphone,
      color: 'from-green-600 to-green-700',
      description: 'Mobile-optimized content',
      specs: '720p/1080p, Stereo, Vertical options'
    },
    {
      id: 'broadcast',
      name: 'Broadcast TV',
      icon: Tv,
      color: 'from-indigo-600 to-indigo-700',
      description: 'Television broadcasting',
      specs: '1080i/720p, Stereo/5.1, Closed captions'
    }
  ];

  const optimizeForPlatform = async () => {
    if (!selectedPlatform) {
      toast({
        title: "Error",
        description: "Please select a platform to optimize for.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      const response = await backend.ai.optimizeForPlatform({
        project_id: parseInt(id!),
        platform: selectedPlatform as any,
        content_type: contentType,
        target_audience: targetAudience,
        content_rating: 'PG-13'
      });

      setOptimizationData(response);
      
      toast({
        title: "🎯 Optimization Complete",
        description: `Content has been optimized for ${platforms.find(p => p.id === selectedPlatform)?.name}.`,
      });
    } catch (error) {
      console.error('Failed to optimize for platform:', error);
      toast({
        title: "Error",
        description: "Failed to optimize content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const exportOptimizedPackage = async () => {
    if (!optimizationData) return;

    setExportProgress(0);
    
    try {
      const response = await backend.ai.exportPlatformPackage({
        project_id: parseInt(id!),
        platform: selectedPlatform,
        optimization_id: 'opt_123',
        include_marketing: true
      });

      // Simulate export progress
      const interval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            toast({
              title: "📦 Export Complete",
              description: `Optimized package ready for ${platforms.find(p => p.id === selectedPlatform)?.name}.`,
            });
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      
    } catch (error) {
      console.error('Failed to export package:', error);
      toast({
        title: "Error",
        description: "Failed to export package. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/project/${id}`}>
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-gold-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center animate-bounce">
                  <Zap className="w-4 h-4 text-navy-900" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-gold-400 bg-clip-text text-transparent mb-4">
              Platform Optimizer
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Optimize your content for specific platforms with automated technical specifications, 
              content guidelines, and delivery packages.
            </p>
          </div>
        </div>

        {!optimizationData ? (
          /* Platform Selection */
          <div className="space-y-8">
            {/* Platform Grid */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Choose Target Platform</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => (
                  <Card 
                    key={platform.id}
                    className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedPlatform === platform.id
                        ? 'bg-gradient-to-br from-navy-800/50 via-purple-800/30 to-gold-800/20 border-gold-400 shadow-xl'
                        : 'bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 hover:border-gold-400/50'
                    } backdrop-blur-sm`}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center shadow-lg`}>
                          <platform.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-white">{platform.name}</CardTitle>
                          <CardDescription className="text-gray-400">{platform.description}</CardDescription>
                        </div>
                        {selectedPlatform === platform.id && (
                          <CheckCircle className="w-6 h-6 text-gold-400" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300">{platform.specs}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Configuration */}
            <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Content Configuration</CardTitle>
                <CardDescription>Configure your content for optimal platform delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="content-type" className="text-white">Content Type</Label>
                    <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                      <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-800 border-gold-500/30">
                        <SelectItem value="feature">Feature Film</SelectItem>
                        <SelectItem value="series">TV Series</SelectItem>
                        <SelectItem value="short">Short Film</SelectItem>
                        <SelectItem value="documentary">Documentary</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="target-audience" className="text-white">Target Audience</Label>
                    <Input
                      id="target-audience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g., Adults 18-34, Family-friendly, etc."
                      className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                    />
                  </div>
                </div>

                <Button 
                  onClick={optimizeForPlatform}
                  disabled={!selectedPlatform || isOptimizing}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-gold-600 hover:from-blue-700 hover:via-purple-700 hover:to-gold-700 text-white py-6 text-lg shadow-xl"
                >
                  {isOptimizing ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5 mr-2" />
                      Optimize for {selectedPlatform ? platforms.find(p => p.id === selectedPlatform)?.name : 'Platform'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Optimization Results */
          <div className="space-y-6">
            {/* Header with Export */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Optimized for {platforms.find(p => p.id === selectedPlatform)?.name}
                </h2>
                <p className="text-gray-400">Content specifications and delivery package ready</p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setOptimizationData(null)}
                  className="border-gray-500/30 text-gray-300 hover:bg-gray-500/10"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Reconfigure
                </Button>
                <Button 
                  onClick={exportOptimizedPackage}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Package
                </Button>
              </div>
            </div>

            {/* Export Progress */}
            {exportProgress > 0 && exportProgress < 100 && (
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Exporting Package</span>
                    <span className="text-gold-400 font-bold">{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-2" />
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="specs" className="space-y-6">
              <TabsList className="bg-navy-800/50 border-gold-500/20 backdrop-blur-sm">
                <TabsTrigger value="specs" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                  Technical Specs
                </TabsTrigger>
                <TabsTrigger value="guidelines" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                  Content Guidelines
                </TabsTrigger>
                <TabsTrigger value="delivery" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                  Delivery Package
                </TabsTrigger>
                <TabsTrigger value="marketing" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                  Marketing Assets
                </TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Monitor className="w-5 h-5" />
                        Video Specifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Resolution</span>
                        <span className="text-white">{optimizationData.optimization_settings.video_specs.resolution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frame Rate</span>
                        <span className="text-white">{optimizationData.optimization_settings.video_specs.frame_rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bitrate</span>
                        <span className="text-white">{optimizationData.optimization_settings.video_specs.bitrate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Codec</span>
                        <span className="text-white">{optimizationData.optimization_settings.video_specs.codec}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">HDR</span>
                        <span className="text-white">{optimizationData.optimization_settings.video_specs.hdr ? 'Yes' : 'No'}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        Audio Specifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Channels</span>
                        <span className="text-white">{optimizationData.optimization_settings.audio_specs.channels}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sample Rate</span>
                        <span className="text-white">{optimizationData.optimization_settings.audio_specs.sample_rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bitrate</span>
                        <span className="text-white">{optimizationData.optimization_settings.audio_specs.bitrate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Format</span>
                        <span className="text-white">{optimizationData.optimization_settings.audio_specs.format}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      Thumbnail & Artwork Specs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dimensions</span>
                      <span className="text-white">{optimizationData.optimization_settings.thumbnail_specs.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Format</span>
                      <span className="text-white">{optimizationData.optimization_settings.thumbnail_specs.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Count Required</span>
                      <span className="text-white">{optimizationData.optimization_settings.thumbnail_specs.count}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="guidelines" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Content Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-gray-400">Duration Limits</Label>
                        <p className="text-white">{optimizationData.content_guidelines.duration_limits}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Content Restrictions</Label>
                        <div className="space-y-1">
                          {optimizationData.content_guidelines.content_restrictions.map((restriction: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                              <span className="text-white text-sm">{restriction}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Accessibility Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {optimizationData.content_guidelines.accessibility_features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-white text-sm">{feature}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Metadata Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {optimizationData.content_guidelines.metadata_requirements.map((requirement: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-white text-sm">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="delivery" className="space-y-4">
                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Required Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {optimizationData.delivery_package.required_files.map((file: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-navy-700/30 rounded-lg border border-gold-500/10">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white text-sm">{file}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Naming Conventions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {optimizationData.delivery_package.naming_conventions.map((convention: string, index: number) => (
                        <div key={index} className="bg-navy-700/30 p-2 rounded font-mono text-sm text-gray-300">
                          {convention}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Folder Structure</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {optimizationData.delivery_package.folder_structure.map((folder: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-gold-400" />
                          <span className="text-white text-sm font-mono">{folder}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="marketing" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Title Optimization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {optimizationData.marketing_optimization.title_suggestions.map((suggestion: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-gold-400" />
                          <span className="text-white text-sm">{suggestion}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Tag Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {optimizationData.marketing_optimization.tag_recommendations.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300 mr-2 mb-2">
                          {tag}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Description Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {optimizationData.marketing_optimization.description_templates.map((template: string, index: number) => (
                      <div key={index} className="bg-navy-700/30 p-3 rounded-lg border border-gold-500/10">
                        <p className="text-gray-300 text-sm">{template}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
