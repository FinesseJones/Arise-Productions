import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Film, 
  Users, 
  MapPin, 
  Calendar, 
  FileText, 
  Camera, 
  Palette, 
  Music, 
  Share,
  Settings,
  Play,
  Edit3,
  Zap,
  Brain,
  Download,
  Eye,
  MessageSquare,
  Clock,
  Star,
  TrendingUp,
  Layers,
  Target,
  Award,
  Scissors,
  Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { Project, ProjectStatus } from '~backend/studio/types';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projectData, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => backend.studio.getProject({ id: parseInt(id!) }),
    enabled: !!id
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: ProjectStatus) => 
      backend.studio.updateProjectStatus({ id: parseInt(id!), status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast({
        title: "🎬 Status Updated",
        description: "Project status has been updated and automated workflows triggered.",
      });
    },
    onError: (error) => {
      console.error('Failed to update status:', error);
      toast({
        title: "Error",
        description: "Failed to update project status.",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-navy-700 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-navy-700 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-navy-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-navy-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <Link to="/">
            <Button variant="outline" className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { project, assets, scripts, characters } = projectData;

  const getStatusColor = (status: string) => {
    const colors = {
      development: 'from-blue-500 to-cyan-500',
      pre_production: 'from-yellow-500 to-orange-500',
      production: 'from-green-500 to-emerald-500',
      post_production: 'from-purple-500 to-violet-500',
      distribution: 'from-orange-500 to-red-500',
      completed: 'from-gray-500 to-slate-500'
    };
    return colors[status] || colors.development;
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getProjectProgress = (status: string) => {
    const progressMap = {
      development: 15,
      pre_production: 35,
      production: 60,
      post_production: 85,
      distribution: 95,
      completed: 100
    };
    return progressMap[status] || 0;
  };

  const getAssetIcon = (type: string) => {
    const icons = {
      script: FileText,
      treatment: Edit3,
      shot_list: Camera,
      call_sheet: Calendar,
      budget: Settings,
      schedule: Calendar,
      casting: Users,
      storyboard: Palette,
      location: MapPin,
      talent: Users,
      breakdown: FileText,
      casting_board: Users,
      location_scout: MapPin,
      crew_list: Users,
      daily_reports: FileText,
      continuity_log: FileText,
      footage_log: Camera,
      safety_reports: Settings,
      edit_decision_list: Edit3,
      color_notes: Palette,
      sound_cue_sheet: Music,
      vfx_notes: Zap,
      music_cue_sheet: Music,
      press_kit: Share,
      screener: Play,
      delivery_specs: Settings,
      festival_submissions: Share,
      streaming_package: Share
    };
    return icons[type] || FileText;
  };

  const groupAssetsByType = (assets: any[]) => {
    const groups = {
      'Script & Story': ['script', 'treatment', 'breakdown'],
      'Pre-Production': ['shot_list', 'call_sheet', 'budget', 'schedule', 'casting', 'casting_board', 'location_scout', 'crew_list'],
      'Production': ['storyboard', 'daily_reports', 'continuity_log', 'footage_log', 'safety_reports'],
      'Post-Production': ['edit_decision_list', 'color_notes', 'sound_cue_sheet', 'vfx_notes', 'music_cue_sheet'],
      'Distribution': ['press_kit', 'screener', 'delivery_specs', 'festival_submissions', 'streaming_package'],
      'Legal & Releases': ['location', 'talent']
    };

    const grouped = {};
    Object.entries(groups).forEach(([groupName, types]) => {
      grouped[groupName] = assets.filter(asset => types.includes(asset.asset_type));
    });

    return grouped;
  };

  const assetGroups = groupAssetsByType(assets);

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
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Film className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
                  <div className="flex items-center gap-3">
                    {project.genre && (
                      <Badge variant="secondary" className="bg-navy-700/50 text-gray-300 border-gold-500/20">
                        {project.genre}
                      </Badge>
                    )}
                    <Badge className={`bg-gradient-to-r ${getStatusColor(project.status)} text-white shadow-lg`}>
                      {formatStatus(project.status)}
                    </Badge>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Created {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {project.description && (
                <p className="text-gray-300 text-lg max-w-3xl leading-relaxed mb-6">{project.description}</p>
              )}

              {/* Progress Bar */}
              <div className="bg-navy-800/30 backdrop-blur-sm border border-gold-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Production Progress</span>
                  <span className="text-gold-400 font-bold">{getProjectProgress(project.status)}%</span>
                </div>
                <Progress 
                  value={getProjectProgress(project.status)} 
                  className="h-3 bg-navy-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Development</span>
                  <span>Pre-Production</span>
                  <span>Production</span>
                  <span>Post-Production</span>
                  <span>Distribution</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-80 space-y-4">
              {/* Status Control */}
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Project Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={project.status} 
                    onValueChange={(value: ProjectStatus) => updateStatusMutation.mutate(value)}
                  >
                    <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-gold-500/30">
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="pre_production">Pre-Production</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="post_production">Post-Production</SelectItem>
                      <SelectItem value="distribution">Distribution</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Production Rooms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to={`/writing-room/${id}`}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg">
                      <Users className="w-4 h-4 mr-2" />
                      Writing Room
                    </Button>
                  </Link>
                  <Link to={`/editing-suite/${id}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg">
                      <Scissors className="w-4 h-4 mr-2" />
                      Editing Suite
                    </Button>
                  </Link>
                  <Link to={`/platform-optimizer/${id}`}>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg">
                      <Target className="w-4 h-4 mr-2" />
                      Platform Optimizer
                    </Button>
                  </Link>
                  <Link to="/ai-studio">
                    <Button className="w-full bg-gradient-to-r from-gold-600 to-yellow-600 hover:from-gold-700 hover:to-yellow-700 shadow-lg">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Studio
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Additional Actions */}
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full border-gold-500/30 text-gold-300 hover:bg-gold-500/10">
                    <Download className="w-4 h-4 mr-2" />
                    Export Package
                  </Button>
                  <Button variant="outline" className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Collaboration
                  </Button>
                </CardContent>
              </Card>

              {/* Project Stats */}
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Project Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assets</span>
                    <span className="text-white font-medium">{assets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Scripts</span>
                    <span className="text-white font-medium">{scripts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Characters</span>
                    <span className="text-white font-medium">{characters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-gold-400 font-medium">{getProjectProgress(project.status)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="bg-navy-800/50 border-gold-500/20 backdrop-blur-sm">
            <TabsTrigger value="assets" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
              Project Assets ({assets.length})
            </TabsTrigger>
            <TabsTrigger value="scripts" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
              Scripts ({scripts.length})
            </TabsTrigger>
            <TabsTrigger value="characters" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
              Characters ({characters.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-8">
            {Object.entries(assetGroups).map(([groupName, groupAssets]) => (
              groupAssets.length > 0 && (
                <div key={groupName}>
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-gold-500 to-yellow-500 rounded-lg flex items-center justify-center">
                      <Layers className="w-4 h-4 text-white" />
                    </div>
                    {groupName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupAssets.map((asset) => {
                      const IconComponent = getAssetIcon(asset.asset_type);
                      return (
                        <Card key={asset.id} className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm hover:bg-navy-800/50 transition-all duration-300 cursor-pointer group transform hover:scale-105">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-white text-sm group-hover:text-gold-400 transition-colors">
                                  {asset.asset_name}
                                </CardTitle>
                                <CardDescription className="text-xs flex items-center gap-2">
                                  {asset.metadata.auto_generated ? (
                                    <>
                                      <Zap className="w-3 h-3 text-blue-400" />
                                      <span className="text-blue-400">Auto-generated</span>
                                    </>
                                  ) : (
                                    <>
                                      <Edit3 className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-400">Manual</span>
                                    </>
                                  )}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Created {new Date(asset.created_at).toLocaleDateString()}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </TabsContent>

          <TabsContent value="scripts" className="space-y-4">
            {scripts.length === 0 ? (
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardContent className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-navy-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">No Scripts Yet</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Use the Writing Room to collaborate with AI agents and create your first script.
                  </p>
                  <Link to={`/writing-room/${id}`}>
                    <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg">
                      <Users className="w-4 h-4 mr-2" />
                      Open Writing Room
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scripts.map((script) => (
                  <Card key={script.id} className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm hover:bg-navy-800/50 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-lg">{script.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="bg-navy-700/50 text-gray-300 text-xs">
                              Version {script.version}
                            </Badge>
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                              {script.format.toUpperCase()}
                            </Badge>
                          </CardDescription>
                        </div>
                        <Button size="sm" variant="outline" className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-400 mb-4 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last updated {new Date(script.updated_at).toLocaleDateString()}
                      </div>
                      <div className="bg-navy-900/50 p-4 rounded text-sm text-gray-300 font-mono max-h-32 overflow-hidden border border-gold-500/10">
                        {script.content.substring(0, 200)}...
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="characters" className="space-y-4">
            {characters.length === 0 ? (
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardContent className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">No Characters Yet</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Characters will be automatically extracted from your scripts or you can create them manually.
                  </p>
                  <Link to={`/writing-room/${id}`}>
                    <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg">
                      <Users className="w-4 h-4 mr-2" />
                      Writing Room
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character) => (
                  <Card key={character.id} className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm hover:bg-navy-800/50 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{character.name}</CardTitle>
                          {character.age_range && (
                            <CardDescription>Age: {character.age_range}</CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {character.description && (
                        <p className="text-gray-300 text-sm mb-3">{character.description}</p>
                      )}
                      {character.casting_notes && (
                        <div className="bg-navy-900/50 p-3 rounded text-sm text-gray-400 border border-gold-500/10">
                          <strong className="text-gold-400">Casting Notes:</strong> {character.casting_notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <CardTitle className="text-white text-lg">Progress</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {getProjectProgress(project.status)}%
                  </div>
                  <p className="text-sm text-gray-400">Production complete</p>
                </CardContent>
              </Card>
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    <CardTitle className="text-white text-lg">Assets</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400 mb-1">{assets.length}</div>
                  <p className="text-sm text-gray-400">Total assets created</p>
                </CardContent>
              </Card>
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-gold-400" />
                    <CardTitle className="text-white text-lg">AI Generated</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gold-400 mb-1">
                    {assets.filter(a => a.metadata.auto_generated).length}
                  </div>
                  <p className="text-sm text-gray-400">AI-created assets</p>
                </CardContent>
              </Card>
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-400" />
                    <CardTitle className="text-white text-lg">Quality</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400 mb-1">A+</div>
                  <p className="text-sm text-gray-400">Project rating</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
