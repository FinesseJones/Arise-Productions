import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Film, 
  Brain, 
  Zap, 
  Star, 
  Eye,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Users,
  Camera,
  Palette,
  Share,
  FileText,
  Calendar,
  Settings,
  Layers,
  Sparkles,
  Scissors
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function StudioTour() {
  const [currentTour, setCurrentTour] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const tourStops = [
    {
      title: "Studio Overview",
      description: "Welcome to your next-generation digital film studio",
      content: (
        <div className="space-y-6">
          <div className="relative h-64 bg-gradient-to-br from-gold-800/30 via-purple-800/20 to-blue-900 rounded-lg overflow-hidden border border-gold-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
                  <div className="text-2xl font-bold text-white tracking-wider">FJ</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Finesse Jones Studio</h3>
                <p className="text-gray-300">Your command center for all productions</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                <Play className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-4 rounded-lg border border-gold-500/20">
              <Zap className="w-8 h-8 text-gold-400 mb-2" />
              <h4 className="font-semibold text-white mb-1">8 AI Agents</h4>
              <p className="text-sm text-gray-400">Cross-functional intelligent workflows</p>
            </div>
            <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-4 rounded-lg border border-gold-500/20">
              <Layers className="w-8 h-8 text-purple-400 mb-2" />
              <h4 className="font-semibold text-white mb-1">Complete Studio</h4>
              <p className="text-sm text-gray-400">Full film studio replica with next-gen tech</p>
            </div>
            <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-4 rounded-lg border border-gold-500/20">
              <Star className="w-8 h-8 text-blue-400 mb-2" />
              <h4 className="font-semibold text-white mb-1">Platform Ready</h4>
              <p className="text-sm text-gray-400">Netflix, YouTube, and all platforms</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "AI Studio Team",
      description: "Meet your 8 specialized AI agents",
      content: (
        <div className="space-y-6">
          <div className="relative h-64 bg-gradient-to-br from-purple-800/30 via-gold-800/20 to-blue-900 rounded-lg overflow-hidden border border-gold-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-gold-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Agent Hub</h3>
                <p className="text-gray-300">Your 24/7 cross-functional collaborators</p>
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                8 Agents Online
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Screenwriter', icon: FileText, color: 'from-blue-500 via-purple-400 to-gold-400' },
              { name: 'Script Supervisor', icon: Settings, color: 'from-green-500 via-emerald-400 to-gold-400' },
              { name: 'Casting Director', icon: Users, color: 'from-purple-500 via-violet-400 to-gold-400' },
              { name: 'Production Coord', icon: Calendar, color: 'from-orange-500 via-gold-400 to-yellow-400' },
              { name: 'Camera Operator', icon: Camera, color: 'from-pink-500 via-purple-400 to-gold-400' },
              { name: 'Post Supervisor', icon: Palette, color: 'from-indigo-500 via-purple-400 to-gold-400' },
              { name: 'Distribution', icon: Share, color: 'from-teal-500 via-blue-400 to-gold-400' },
              { name: 'Forms Generator', icon: Scissors, color: 'from-yellow-500 via-gold-400 to-orange-400' }
            ].map((agent) => (
              <div key={agent.name} className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-3 rounded-lg border border-gold-500/20 text-center">
                <div className={`w-8 h-8 bg-gradient-to-r ${agent.color} rounded-lg flex items-center justify-center mx-auto mb-2 animate-pulse`}>
                  <agent.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-white font-medium">{agent.name}</p>
                <div className="w-1 h-1 bg-green-400 rounded-full mx-auto mt-1" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Cross-Functional Workflow",
      description: "Automated production pipeline with AI/Human collaboration",
      content: (
        <div className="space-y-6">
          <div className="relative h-64 bg-gradient-to-br from-green-800/30 via-purple-800/20 to-gold-900 rounded-lg overflow-hidden border border-gold-500/20">
            <div className="absolute inset-0 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Production Pipeline</h3>
              <div className="space-y-3">
                {[
                  { phase: 'Development', progress: 100, color: 'bg-gradient-to-r from-blue-500 via-purple-500 to-gold-500' },
                  { phase: 'Pre-Production', progress: 75, color: 'bg-gradient-to-r from-yellow-500 via-gold-500 to-orange-500' },
                  { phase: 'Production', progress: 45, color: 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500' },
                  { phase: 'Post-Production', progress: 20, color: 'bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500' },
                  { phase: 'Distribution', progress: 0, color: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500' }
                ].map((phase) => (
                  <div key={phase.phase} className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${phase.color} rounded-full`} />
                    <span className="text-sm text-white w-24">{phase.phase}</span>
                    <div className="flex-1 bg-navy-700 rounded-full h-2">
                      <div 
                        className={`h-2 ${phase.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{phase.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-4 rounded-lg border border-gold-500/20">
              <Users className="w-8 h-8 text-purple-400 mb-2" />
              <h4 className="font-semibold text-white mb-1">AI/Human Collaboration</h4>
              <p className="text-sm text-gray-400">AI actors and real talent working together</p>
            </div>
            <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-4 rounded-lg border border-gold-500/20">
              <Settings className="w-8 h-8 text-gold-400 mb-2" />
              <h4 className="font-semibold text-white mb-1">Cross-Functional</h4>
              <p className="text-sm text-gray-400">All departments working seamlessly together</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Complete Editing Suite",
      description: "Professional-grade post-production capabilities",
      content: (
        <div className="space-y-6">
          <div className="relative h-64 bg-gradient-to-br from-gold-800/30 via-purple-800/20 to-indigo-900 rounded-lg overflow-hidden border border-gold-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-600 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
                  <Scissors className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Editing Suite</h3>
                <p className="text-gray-300">Complete post-production capabilities</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Editing & VFX</h4>
              <div className="space-y-2">
                {['AI-Enhanced Editing', 'Color Grading', 'VFX Integration', 'Sound Design'].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gold-400 rounded-full" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Platform Delivery</h4>
              <div className="space-y-2">
                {['Netflix 4K HDR', 'YouTube Optimization', 'Theatrical DCP', 'Streaming Ready'].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Platform Distribution",
      description: "Delivery-ready packages for any platform",
      content: (
        <div className="space-y-6">
          <div className="relative h-64 bg-gradient-to-br from-teal-800/30 via-purple-800/20 to-blue-900 rounded-lg overflow-hidden border border-gold-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-600 via-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
                  <Share className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Distribution Hub</h3>
                <p className="text-gray-300">One-click delivery to any platform</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Netflix', color: 'from-red-500 to-red-600' },
              { name: 'YouTube', color: 'from-red-600 to-red-700' },
              { name: 'Theatrical', color: 'from-purple-500 to-purple-600' },
              { name: 'Streaming', color: 'from-blue-500 to-blue-600' },
              { name: 'Festivals', color: 'from-gold-500 to-gold-600' },
              { name: 'VOD', color: 'from-green-500 to-green-600' },
              { name: 'Broadcast', color: 'from-indigo-500 to-indigo-600' },
              { name: 'Mobile', color: 'from-teal-500 to-teal-600' }
            ].map((platform) => (
              <div key={platform.name} className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-3 rounded-lg border border-gold-500/20 text-center">
                <div className={`w-8 h-8 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <Share className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-white font-medium">{platform.name}</p>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs mt-1">
                  Ready
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const nextTour = () => {
    if (currentTour < tourStops.length - 1) {
      setCurrentTour(currentTour + 1);
    }
  };

  const prevTour = () => {
    if (currentTour > 0) {
      setCurrentTour(currentTour - 1);
    }
  };

  const progress = ((currentTour + 1) / tourStops.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-purple-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">Studio Tour</h1>
            <p className="text-xl text-gray-300 mb-6">
              Explore the features and capabilities of Finesse Jones Studio
            </p>
            
            {/* Progress */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-sm text-gray-400">Stop {currentTour + 1} of {tourStops.length}</span>
              <div className="flex-1 max-w-md">
                <Progress value={progress} className="h-2" />
              </div>
              <span className="text-sm text-gold-400 font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Tour Content */}
        <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {tourStops[currentTour].title}
            </CardTitle>
            <CardDescription className="text-lg text-gray-300">
              {tourStops[currentTour].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {tourStops[currentTour].content}
          </CardContent>
        </Card>

        {/* Tour Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            {currentTour > 0 && (
              <Button 
                variant="outline" 
                onClick={prevTour}
                className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-gray-400 hover:text-white"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsMuted(!isMuted)}
              className="text-gray-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setCurrentTour(0)}
              className="text-gray-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Skip Tour
              </Button>
            </Link>
            {currentTour < tourStops.length - 1 ? (
              <Button 
                onClick={nextTour}
                className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Link to="/">
                <Button className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold">
                  Start Creating
                  <Film className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Tour Navigation Dots */}
        <div className="flex justify-center gap-2">
          {tourStops.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTour(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentTour 
                  ? 'bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 scale-125' 
                  : 'bg-navy-600 hover:bg-navy-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
