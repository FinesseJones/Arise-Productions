import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Film, 
  Sparkles, 
  Zap, 
  Globe, 
  ArrowRight, 
  Brain,
  Camera,
  Users,
  Calendar,
  Palette,
  Share,
  FileText,
  Play,
  Settings,
  Star,
  TrendingUp,
  Clock,
  Award,
  Layers,
  Eye,
  Wand2,
  Scissors,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { Project } from '~backend/studio/types';

export default function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    genre: ''
  });
  const [showWelcome, setShowWelcome] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const hasVisited = localStorage.getItem('finesse-jones-visited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('finesse-jones-visited', 'true');
    }
  }, []);

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => backend.studio.listProjects()
  });

  const createProjectMutation = useMutation({
    mutationFn: (projectData: typeof newProject) => 
      backend.studio.createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsCreateDialogOpen(false);
      setNewProject({ title: '', description: '', genre: '' });
      toast({
        title: "🎬 Project Created",
        description: "Your new film project has been created with automated workflows ready to go.",
      });
    },
    onError: (error) => {
      console.error('Failed to create project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreateProject = () => {
    if (!newProject.title.trim()) {
      toast({
        title: "Error",
        description: "Project title is required.",
        variant: "destructive",
      });
      return;
    }
    createProjectMutation.mutate(newProject);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      development: 'from-blue-500 via-purple-500 to-gold-500',
      pre_production: 'from-yellow-500 via-gold-500 to-orange-500',
      production: 'from-green-500 via-emerald-500 to-teal-500',
      post_production: 'from-purple-500 via-violet-500 to-indigo-500',
      distribution: 'from-orange-500 via-red-500 to-pink-500',
      completed: 'from-gray-500 via-slate-500 to-zinc-500'
    };
    return colors[status] || colors.development;
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getProjectProgress = (status: string) => {
    const progressMap: Record<string, number> = {
      development: 15,
      pre_production: 35,
      production: 60,
      post_production: 85,
      distribution: 95,
      completed: 100
    };
    return progressMap[status] || 0;
  };

  const aiAgents = [
    { name: 'Screenwriting Assistant', icon: FileText, color: 'from-blue-500 via-purple-400 to-gold-400' },
    { name: 'Script Supervisor', icon: Settings, color: 'from-green-500 via-emerald-400 to-gold-400' },
    { name: 'Casting Director', icon: Users, color: 'from-purple-500 via-violet-400 to-gold-400' },
    { name: 'Production Coordinator', icon: Calendar, color: 'from-orange-500 via-gold-400 to-yellow-400' },
    { name: 'Virtual Camera Operator', icon: Camera, color: 'from-pink-500 via-purple-400 to-gold-400' },
    { name: 'Post-Production Supervisor', icon: Palette, color: 'from-indigo-500 via-purple-400 to-gold-400' },
    { name: 'Distribution Desk', icon: Share, color: 'from-teal-500 via-blue-400 to-gold-400' },
    { name: 'Studio Forms Generator', icon: Scissors, color: 'from-yellow-500 via-gold-400 to-orange-400' }
  ];

  return (
    <div className="min-h-screen">
      {/* Welcome Modal */}
      {showWelcome && (
        <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
          <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-slate-900 via-navy-900 to-purple-900 border-gold-500/30 backdrop-blur-xl">
            <DialogHeader>
              <div className="text-center mb-6">
                <div className="relative mx-auto mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gold-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl animate-pulse">
                    <div className="text-4xl font-bold text-white z-10">FJ</div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-4 h-4 text-navy-900" />
                  </div>
                </div>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Welcome to Finesse Jones Studio
                </DialogTitle>
                <DialogDescription className="text-lg text-gray-300 mt-4">
                  Your AI-powered digital film studio where creativity meets cutting-edge technology.
                  No limits. No restrictions. Pure creative freedom.
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-navy-800/50 via-purple-800/30 to-gold-800/20 p-4 rounded-lg border border-gold-500/20">
                  <Brain className="w-8 h-8 text-gold-400 mb-2" />
                  <h3 className="font-semibold text-white mb-1">AI-Powered Workflow</h3>
                  <p className="text-sm text-gray-400">Automated production pipeline with intelligent agents</p>
                </div>
                <div className="bg-gradient-to-br from-navy-800/50 via-purple-800/30 to-gold-800/20 p-4 rounded-lg border border-gold-500/20">
                  <Zap className="w-8 h-8 text-gold-400 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Zero Restrictions</h3>
                  <p className="text-sm text-gray-400">Complete creative freedom with no content limitations</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/studio-tour" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700">
                    <Eye className="w-4 h-4 mr-2" />
                    Take Studio Tour
                  </Button>
                </Link>
                <Button 
                  onClick={() => setShowWelcome(false)}
                  className="flex-1 bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Start Creating
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600/20 via-purple-600/15 to-blue-600/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gold-400/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500" />
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-gold-500/8 rounded-full blur-xl animate-pulse delay-700" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-gold-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl animate-pulse">
                  <div className="text-5xl font-bold text-white z-10 tracking-wider">FJ</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-400/30 via-purple-400/20 to-blue-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-gold-400 to-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Sparkles className="w-6 h-6 text-navy-900" />
                </div>
              </div>
            </div>
            <h1 className="text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Finesse Jones
              </span>
              <span className="block text-5xl bg-gradient-to-r from-blue-400 via-purple-400 to-gold-400 bg-clip-text text-transparent mt-2">
                Digital Film Studio
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Where <span className="text-gold-400 font-semibold">vision meets technology</span>. 
              Creator-led. AI-powered. Built to empower the next generation of filmmakers with 
              <span className="text-purple-400 font-semibold"> zero creative restrictions</span> and 
              cutting-edge automation for <span className="text-blue-400 font-semibold">Netflix, YouTube, and beyond</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-navy-900 to-purple-900 border-gold-500/30 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle className="text-white text-xl">Create New Film Project</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Start your next cinematic journey with automated AI-powered workflows.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Project Title</Label>
                      <Input
                        id="title"
                        value={newProject.title}
                        onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter project title"
                        className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-white">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief project description"
                        className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="genre" className="text-white">Genre</Label>
                      <Select value={newProject.genre} onValueChange={(value) => setNewProject(prev => ({ ...prev, genre: value }))}>
                        <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent className="bg-navy-800 border-gold-500/30">
                          <SelectItem value="drama">Drama</SelectItem>
                          <SelectItem value="comedy">Comedy</SelectItem>
                          <SelectItem value="thriller">Thriller</SelectItem>
                          <SelectItem value="horror">Horror</SelectItem>
                          <SelectItem value="scifi">Sci-Fi</SelectItem>
                          <SelectItem value="documentary">Documentary</SelectItem>
                          <SelectItem value="experimental">Experimental</SelectItem>
                          <SelectItem value="adult">Adult Content</SelectItem>
                          <SelectItem value="series">TV Series</SelectItem>
                          <SelectItem value="short">Short Film</SelectItem>
                          <SelectItem value="feature">Feature Film</SelectItem>
                          <SelectItem value="uncategorized">Uncategorized</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={handleCreateProject} 
                      disabled={createProjectMutation.isPending}
                      className="w-full bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700"
                    >
                      {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Link to="/ai-studio">
                <Button size="lg" className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Studio
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 backdrop-blur-sm border border-gold-500/20 rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-gold-400">{projectsData?.projects.length || 0}</div>
                <div className="text-sm text-gray-400">Active Projects</div>
              </div>
              <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 backdrop-blur-sm border border-gold-500/20 rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-purple-400">{aiAgents.length}</div>
                <div className="text-sm text-gray-400">AI Agents</div>
              </div>
              <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 backdrop-blur-sm border border-gold-500/20 rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-blue-400">∞</div>
                <div className="text-sm text-gray-400">Creative Freedom</div>
              </div>
              <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 backdrop-blur-sm border border-gold-500/20 rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-green-400">24/7</div>
                <div className="text-sm text-gray-400">AI Assistance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Agents Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">Meet Your AI Studio Team</h2>
          <p className="text-xl text-gray-400">8 specialized AI agents working 24/7 to bring your vision to life</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {aiAgents.map((agent, index) => (
            <Card key={agent.name} className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group">
              <CardHeader>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${agent.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg animate-pulse`}>
                    <agent.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white group-hover:text-gold-400 transition-colors text-lg text-center">
                      {agent.name}
                    </CardTitle>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400">Online</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Studio Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 transform hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-gold-500 rounded-lg flex items-center justify-center mb-4 shadow-lg animate-pulse">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Intelligent Automation</CardTitle>
              <CardDescription className="text-gray-400">
                AI agents automatically generate forms, schedules, and documentation as your project progresses through each phase.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 transform hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-gold-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 shadow-lg animate-pulse">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Cross-Functional Workflow</CardTitle>
              <CardDescription className="text-gray-400">
                Full film studio replica with next-gen tech. AI and human collaboration for Netflix, YouTube, and all platforms.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 transform hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-gold-500 via-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 shadow-lg animate-pulse">
                <Star className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Complete Production Suite</CardTitle>
              <CardDescription className="text-gray-400">
                Full editing capabilities, AI actors, real talent collaboration, and zero creative restrictions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">Your Projects</h2>
              <p className="text-gray-400">Manage your film projects and track production progress</p>
            </div>
            <div className="flex gap-3">
              <Link to="/asset-library">
                <Button className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700">
                  <Layers className="w-4 h-4 mr-2" />
                  Asset Library
                </Button>
              </Link>
              <Link to="/collaboration">
                <Button className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700">
                  <Users className="w-4 h-4 mr-2" />
                  Collaboration
                </Button>
              </Link>
              <Link to="/admin">
                <Button className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-navy-700 rounded mb-2"></div>
                  <div className="h-4 bg-navy-700 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-navy-700 rounded mb-2"></div>
                  <div className="h-4 bg-navy-700 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projectsData?.projects.length === 0 ? (
          <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Film className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gold-400 rounded-full flex items-center justify-center animate-bounce">
                  <Plus className="w-3 h-3 text-navy-900" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Ready to Create Your First Masterpiece?</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Start your filmmaking journey with AI-powered workflows, unlimited creative freedom, and professional-grade tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Project
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Link to="/studio-tour">
                  <Button className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700">
                    <Eye className="w-4 h-4 mr-2" />
                    Take Studio Tour
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData?.projects.map((project: Project) => (
              <Link key={project.id} to={`/project/${project.id}`}>
                <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 cursor-pointer group transform hover:scale-105 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white group-hover:text-gold-400 transition-colors text-lg">
                          {project.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          {project.genre && (
                            <Badge variant="secondary" className="bg-navy-700/50 text-gray-300 text-xs">
                              {project.genre}
                            </Badge>
                          )}
                          <Badge className={`bg-gradient-to-r ${getStatusColor(project.status)} text-white text-xs`}>
                            {formatStatus(project.status)}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-gold-400 transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                      {project.description || 'No description provided'}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-gold-400 font-medium">{getProjectProgress(project.status)}%</span>
                      </div>
                      <Progress 
                        value={getProjectProgress(project.status)} 
                        className="h-2 bg-navy-700"
                      />
                    </div>
                    <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Created {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
