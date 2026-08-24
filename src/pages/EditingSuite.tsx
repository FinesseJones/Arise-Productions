import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Scissors, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  Palette,
  Zap,
  Layers,
  Download,
  Save,
  Undo,
  Redo,
  Settings,
  Eye,
  Wand2,
  Target,
  Sliders,
  Film,
  Music,
  Mic,
  Camera,
  Monitor,
  Maximize,
  Grid3X3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

export default function EditingSuite() {
  const { id } = useParams<{ id: string }>();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120);
  const [volume, setVolume] = useState([80]);
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedTool, setSelectedTool] = useState('cut');
  const [colorGradeSettings, setColorGradeSettings] = useState({
    exposure: [0],
    contrast: [100],
    highlights: [0],
    shadows: [0],
    temperature: [0],
    saturation: [100]
  });
  const { toast } = useToast();

  const startEditingSession = async (sessionType: 'rough_cut' | 'fine_cut' | 'color_grade' | 'vfx' | 'audio_mix') => {
    try {
      const response = await backend.ai.startEditingSession({
        project_id: parseInt(id!),
        session_type: sessionType,
        footage_files: ['sample_footage_1.mp4', 'sample_footage_2.mp4'],
        edit_instructions: 'Create a compelling narrative flow'
      });

      setSessionId(response.session_id);
      
      toast({
        title: "🎬 Editing Session Started",
        description: `${sessionType.replace('_', ' ')} session is now active with AI assistance.`,
      });
    } catch (error) {
      console.error('Failed to start editing session:', error);
      toast({
        title: "Error",
        description: "Failed to start editing session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const applyEdit = async (editType: 'cut' | 'transition' | 'color' | 'audio' | 'effect') => {
    if (!sessionId) return;

    try {
      const response = await backend.ai.applyEdit({
        session_id: sessionId,
        edit_type: editType,
        parameters: { intensity: 0.8, duration: 1.0 },
        timeline_position: currentTime
      });

      toast({
        title: "✂️ Edit Applied",
        description: `${editType} edit has been applied to the timeline.`,
      });
    } catch (error) {
      console.error('Failed to apply edit:', error);
      toast({
        title: "Error",
        description: "Failed to apply edit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const applyColorGrade = async (gradeType: 'cinematic' | 'natural' | 'stylized') => {
    if (!sessionId) return;

    try {
      const response = await backend.ai.applyColorGrade({
        session_id: sessionId,
        scene_id: 'scene_1',
        grade_type: gradeType,
        parameters: {
          exposure: colorGradeSettings.exposure[0] / 100,
          contrast: colorGradeSettings.contrast[0] / 100,
          highlights: colorGradeSettings.highlights[0] / 100,
          shadows: colorGradeSettings.shadows[0] / 100,
          temperature: colorGradeSettings.temperature[0],
          saturation: colorGradeSettings.saturation[0] / 100
        }
      });

      toast({
        title: "🎨 Color Grade Applied",
        description: `${gradeType} color grade has been applied to the scene.`,
      });
    } catch (error) {
      console.error('Failed to apply color grade:', error);
      toast({
        title: "Error",
        description: "Failed to apply color grade. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportProject = async () => {
    if (!sessionId) return;

    try {
      const response = await backend.ai.exportEdit({
        session_id: sessionId,
        export_format: 'prores',
        resolution: '4k',
        include_audio: true
      });

      toast({
        title: "📦 Export Started",
        description: `Project export initiated. Estimated time: ${response.estimated_time}`,
      });
    } catch (error) {
      console.error('Failed to export project:', error);
      toast({
        title: "Error",
        description: "Failed to export project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-purple-900">
      {/* Header */}
      <div className="border-b border-gold-500/20 bg-navy-800/30 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/project/${id}`}>
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Project
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-gold-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Editing Suite</h1>
                <p className="text-sm text-gray-400">Professional post-production workspace</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!sessionId ? (
              <div className="flex gap-2">
                <Button 
                  onClick={() => startEditingSession('rough_cut')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  Start Editing
                </Button>
                <Button 
                  onClick={() => startEditingSession('color_grade')}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Color Grade
                </Button>
                <Button 
                  onClick={() => startEditingSession('vfx')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  VFX
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  Session Active
                </Badge>
                <Button 
                  variant="outline" 
                  onClick={exportProject}
                  className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!sessionId ? (
        /* Session Selection */
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-gold-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
              <Scissors className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-gold-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Choose Your Editing Workflow
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional editing suite with AI-enhanced capabilities for every stage of post-production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 cursor-pointer group transform hover:scale-105"
              onClick={() => startEditingSession('rough_cut')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white group-hover:text-gold-400 transition-colors">Rough Cut</CardTitle>
                <CardDescription className="text-gray-400">
                  Basic editing, cuts, and timeline assembly with AI scene detection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Timeline Editor
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    AI Scene Detection
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Basic Transitions
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 cursor-pointer group transform hover:scale-105"
              onClick={() => startEditingSession('fine_cut')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white group-hover:text-gold-400 transition-colors">Fine Cut</CardTitle>
                <CardDescription className="text-gray-400">
                  Precision editing with advanced tools and AI pacing analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    Precision Tools
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    AI Pacing Analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    Advanced Transitions
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 cursor-pointer group transform hover:scale-105"
              onClick={() => startEditingSession('color_grade')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white group-hover:text-gold-400 transition-colors">Color Grading</CardTitle>
                <CardDescription className="text-gray-400">
                  Professional color correction and grading with AI enhancement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    Color Wheels
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    AI Color Match
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    LUT Library
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 cursor-pointer group transform hover:scale-105"
              onClick={() => startEditingSession('vfx')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-gold-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white group-hover:text-gold-400 transition-colors">VFX & Compositing</CardTitle>
                <CardDescription className="text-gray-400">
                  Visual effects, green screen, and AI-powered compositing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-gold-400 rounded-full" />
                    Green Screen
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-gold-400 rounded-full" />
                    AI Enhancement
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-gold-400 rounded-full" />
                    Compositing
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 cursor-pointer group transform hover:scale-105"
              onClick={() => startEditingSession('audio_mix')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white group-hover:text-gold-400 transition-colors">Audio Mixing</CardTitle>
                <CardDescription className="text-gray-400">
                  Professional audio mixing with AI noise reduction and enhancement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    Multi-track Mixer
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    AI Cleanup
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    Surround Sound
                  </div>
                </div>
              </CardContent>
            </Card>

            <Link to={`/script-editor/${id}`}>
              <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 cursor-pointer group transform hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Film className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white group-hover:text-gold-400 transition-colors">Script Editor</CardTitle>
                  <CardDescription className="text-gray-400">
                    Post-production script editing and revision tracking.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-teal-400 rounded-full" />
                      Script Revisions
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-teal-400 rounded-full" />
                      Version Control
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-teal-400 rounded-full" />
                      Change Tracking
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      ) : (
        /* Active Editing Interface */
        <div className="h-screen flex flex-col">
          {/* Timeline and Preview */}
          <div className="flex-1 flex">
            {/* Main Editing Area */}
            <div className="flex-1 flex flex-col">
              {/* Preview Monitor */}
              <div className="h-1/2 bg-black border-b border-gold-500/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Preview Monitor</p>
                    <p className="text-sm text-gray-500">1920x1080 • 24fps</p>
                  </div>
                </div>
                
                {/* Playback Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                    className="text-white hover:bg-white/10"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:bg-white/10"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                    className="text-white hover:bg-white/10"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2 ml-4">
                    <Volume2 className="w-4 h-4 text-white" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="w-20"
                    />
                  </div>
                </div>

                {/* Timecode */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded px-3 py-1">
                  <span className="text-white font-mono text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="h-1/2 bg-navy-900 border-t border-gold-500/20">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <TabsList className="bg-navy-800/50 border-b border-gold-500/20 rounded-none">
                    <TabsTrigger value="timeline" className="data-[state=active]:bg-navy-700">Timeline</TabsTrigger>
                    <TabsTrigger value="color" className="data-[state=active]:bg-navy-700">Color</TabsTrigger>
                    <TabsTrigger value="audio" className="data-[state=active]:bg-navy-700">Audio</TabsTrigger>
                    <TabsTrigger value="effects" className="data-[state=active]:bg-navy-700">Effects</TabsTrigger>
                  </TabsList>

                  <TabsContent value="timeline" className="flex-1 p-4">
                    <div className="space-y-4">
                      {/* Timeline Ruler */}
                      <div className="bg-navy-800 rounded p-2">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                          <span>00:00</span>
                          <span>01:00</span>
                          <span>02:00</span>
                        </div>
                        <div className="h-2 bg-navy-700 rounded relative">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gold-400 rounded"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Video Tracks */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm w-16">Video 1</span>
                          <div className="flex-1 h-12 bg-blue-600/30 rounded border border-blue-500/50 flex items-center px-3">
                            <span className="text-white text-sm">Main_Footage.mp4</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm w-16">Audio 1</span>
                          <div className="flex-1 h-8 bg-green-600/30 rounded border border-green-500/50 flex items-center px-3">
                            <span className="text-white text-xs">Audio_Track.wav</span>
                          </div>
                        </div>
                      </div>

                      {/* Editing Tools */}
                      <div className="flex gap-2">
                        <Button 
                          variant={selectedTool === 'cut' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSelectedTool('cut');
                            applyEdit('cut');
                          }}
                          className="border-gold-500/30"
                        >
                          <Scissors className="w-4 h-4 mr-2" />
                          Cut
                        </Button>
                        <Button 
                          variant={selectedTool === 'transition' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSelectedTool('transition');
                            applyEdit('transition');
                          }}
                          className="border-gold-500/30"
                        >
                          <Layers className="w-4 h-4 mr-2" />
                          Transition
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => applyEdit('effect')}
                          className="border-purple-500/30 text-purple-300"
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          AI Enhance
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="color" className="flex-1 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold">Color Correction</h3>
                        
                        <div className="space-y-3">
                          <div>
                            <Label className="text-white text-sm">Exposure</Label>
                            <Slider
                              value={colorGradeSettings.exposure}
                              onValueChange={(value) => setColorGradeSettings(prev => ({ ...prev, exposure: value }))}
                              min={-100}
                              max={100}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-white text-sm">Contrast</Label>
                            <Slider
                              value={colorGradeSettings.contrast}
                              onValueChange={(value) => setColorGradeSettings(prev => ({ ...prev, contrast: value }))}
                              min={0}
                              max={200}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-white text-sm">Saturation</Label>
                            <Slider
                              value={colorGradeSettings.saturation}
                              onValueChange={(value) => setColorGradeSettings(prev => ({ ...prev, saturation: value }))}
                              min={0}
                              max={200}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-white font-semibold">AI Color Grading</h3>
                        
                        <div className="space-y-2">
                          <Button 
                            onClick={() => applyColorGrade('cinematic')}
                            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                          >
                            <Palette className="w-4 h-4 mr-2" />
                            Cinematic Look
                          </Button>
                          <Button 
                            onClick={() => applyColorGrade('natural')}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Natural Look
                          </Button>
                          <Button 
                            onClick={() => applyColorGrade('stylized')}
                            className="w-full bg-gradient-to-r from-gold-600 to-yellow-600 hover:from-gold-700 hover:to-yellow-700"
                          >
                            <Wand2 className="w-4 h-4 mr-2" />
                            Stylized Look
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="audio" className="flex-1 p-4">
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Audio Mixing</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-navy-800/30 border-gold-500/20">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-white text-sm">Dialogue</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Slider
                              value={[80]}
                              max={100}
                              step={1}
                              className="mb-2"
                            />
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="border-gold-500/30 text-xs">
                                <Mic className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-gold-500/30 text-xs">
                                EQ
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-navy-800/30 border-gold-500/20">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-white text-sm">Music</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Slider
                              value={[60]}
                              max={100}
                              step={1}
                              className="mb-2"
                            />
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="border-gold-500/30 text-xs">
                                <Music className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-gold-500/30 text-xs">
                                FX
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-navy-800/30 border-gold-500/20">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-white text-sm">SFX</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Slider
                              value={[70]}
                              max={100}
                              step={1}
                              className="mb-2"
                            />
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="border-gold-500/30 text-xs">
                                <Volume2 className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-gold-500/30 text-xs">
                                AI
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="effects" className="flex-1 p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button 
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center border-green-500/30 text-green-300 hover:bg-green-500/10"
                      >
                        <Camera className="w-6 h-6 mb-2" />
                        <span className="text-xs">Green Screen</span>
                      </Button>
                      <Button 
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                      >
                        <Zap className="w-6 h-6 mb-2" />
                        <span className="text-xs">AI Enhance</span>
                      </Button>
                      <Button 
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                      >
                        <Layers className="w-6 h-6 mb-2" />
                        <span className="text-xs">Composite</span>
                      </Button>
                      <Button 
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center border-gold-500/30 text-gold-300 hover:bg-gold-500/10"
                      >
                        <Target className="w-6 h-6 mb-2" />
                        <span className="text-xs">Tracking</span>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Tools Panel */}
            <div className="w-80 bg-navy-800/30 border-l border-gold-500/20 p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-3">Project Files</h3>
                  <div className="space-y-2">
                    <div className="bg-navy-700/30 p-3 rounded border border-gold-500/10">
                      <p className="text-white text-sm">Main_Footage.mp4</p>
                      <p className="text-xs text-gray-400">1920x1080 • 24fps • 2.1GB</p>
                    </div>
                    <div className="bg-navy-700/30 p-3 rounded border border-gold-500/10">
                      <p className="text-white text-sm">Audio_Track.wav</p>
                      <p className="text-xs text-gray-400">48kHz • Stereo • 156MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3">AI Suggestions</h3>
                  <div className="space-y-2">
                    <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded">
                      <p className="text-blue-300 text-sm">Cut detected at 0:45</p>
                      <p className="text-xs text-gray-400">AI suggests removing pause</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded">
                      <p className="text-purple-300 text-sm">Color correction needed</p>
                      <p className="text-xs text-gray-400">Skin tones appear warm</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3">Export Settings</h3>
                  <div className="space-y-3">
                    <Select defaultValue="prores">
                      <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-800 border-gold-500/30">
                        <SelectItem value="prores">ProRes 4444</SelectItem>
                        <SelectItem value="h264">H.264</SelectItem>
                        <SelectItem value="dnxhd">DNxHD</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="4k">
                      <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-800 border-gold-500/30">
                        <SelectItem value="4k">4K (3840x2160)</SelectItem>
                        <SelectItem value="2k">2K (2048x1080)</SelectItem>
                        <SelectItem value="1080p">1080p (1920x1080)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
