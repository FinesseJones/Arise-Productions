import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Zap, 
  FileText, 
  Users, 
  Calendar, 
  Camera, 
  Palette, 
  Share,
  Sparkles,
  Brain,
  Wand2,
  Settings,
  Play,
  Eye,
  Layers,
  Star,
  Lightbulb,
  Target,
  Rocket,
  Scissors,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export default function AIStudio() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [creativityLevel, setCreativityLevel] = useState([75]);
  const [noLimitsMode, setNoLimitsMode] = useState(true);

  const aiAgents = [
    {
      id: 'screenwriting',
      name: 'Screenwriting Assistant',
      icon: FileText,
      description: 'Generate scripts, treatments, and adapt novels with AI-powered storytelling',
      color: 'from-blue-500 via-purple-400 to-gold-400',
      features: ['Script Generation', 'Novel Adaptation', 'Story Structure', 'Character Development'],
      status: 'online',
      personality: 'Creative visionary with deep narrative understanding',
      crossFunctional: ['Script Supervisor', 'Casting Director', 'Production Coordinator']
    },
    {
      id: 'script_supervisor',
      name: 'Script Supervisor',
      icon: Settings,
      description: 'Create shooting scripts, breakdowns, and continuity tracking',
      color: 'from-green-500 via-emerald-400 to-gold-400',
      features: ['Shooting Scripts', 'Scene Breakdown', 'Continuity Check', 'Revision Tracking'],
      status: 'online',
      personality: 'Detail-oriented perfectionist ensuring production accuracy',
      crossFunctional: ['Screenwriting Assistant', 'Production Coordinator', 'Virtual Camera Operator']
    },
    {
      id: 'casting',
      name: 'Casting Director AI',
      icon: Users,
      description: 'Generate casting profiles, audition sides, and analyze self-tapes',
      color: 'from-purple-500 via-violet-400 to-gold-400',
      features: ['Character Profiles', 'Audition Sides', 'Casting Analysis', 'Talent Matching'],
      status: 'online',
      personality: 'Intuitive talent scout with keen eye for perfect casting',
      crossFunctional: ['Screenwriting Assistant', 'Production Coordinator', 'Virtual Camera Operator']
    },
    {
      id: 'production',
      name: 'Production Coordinator',
      icon: Calendar,
      description: 'Automated scheduling, call sheets, and production management',
      color: 'from-orange-500 via-gold-400 to-yellow-400',
      features: ['Production Calendar', 'Call Sheets', 'Shot Lists', 'Budget Planning'],
      status: 'online',
      personality: 'Hyper-organized logistics expert keeping everything on track',
      crossFunctional: ['All Departments', 'Script Supervisor', 'Casting Director']
    },
    {
      id: 'virtual_camera',
      name: 'Virtual Camera Operator',
      icon: Camera,
      description: 'Generate storyboards, simulate shots, and create previsualization',
      color: 'from-pink-500 via-purple-400 to-gold-400',
      features: ['Storyboards', 'Shot Simulation', 'Camera Planning', 'Previsualization'],
      status: 'online',
      personality: 'Visionary cinematographer with technical precision',
      crossFunctional: ['Post-Production Supervisor', 'Script Supervisor', 'Production Coordinator']
    },
    {
      id: 'post_production',
      name: 'Post-Production Supervisor',
      icon: Palette,
      description: 'Edit analysis, VFX coordination, and version management',
      color: 'from-indigo-500 via-purple-400 to-gold-400',
      features: ['Edit Notes', 'VFX Handoff', 'Color Notes', 'Version Control'],
      status: 'online',
      personality: 'Meticulous craftsperson perfecting every frame',
      crossFunctional: ['Virtual Camera Operator', 'Distribution Desk', 'Studio Forms Generator']
    },
    {
      id: 'distribution',
      name: 'Distribution Desk',
      icon: Share,
      description: 'Press kits, screeners, and release strategy planning',
      color: 'from-teal-500 via-blue-400 to-gold-400',
      features: ['Press Kits', 'Screeners', 'Release Strategy', 'Festival Planning'],
      status: 'online',
      personality: 'Strategic marketer maximizing your film\'s reach',
      crossFunctional: ['Post-Production Supervisor', 'Studio Forms Generator', 'Production Coordinator']
    },
    {
      id: 'forms_generator',
      name: 'Studio Forms Generator',
      icon: Scissors,
      description: 'Auto-creates all industry-standard production documents',
      color: 'from-yellow-500 via-gold-400 to-orange-400',
      features: ['Legal Forms', 'Production Docs', 'Release Forms', 'Budget Sheets'],
      status: 'online',
      personality: 'Thorough administrator ensuring legal compliance',
      crossFunctional: ['All Departments', 'Production Coordinator', 'Distribution Desk']
    }
  ];

  const AgentInterface = ({ agent }: { agent: any }) => {
    const [formData, setFormData] = useState({});

    const renderAgentForm = () => {
      switch (agent.id) {
        case 'screenwriting':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-4 rounded-lg border border-gold-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-gold-500 rounded-full flex items-center justify-center animate-pulse">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">AI Screenwriter</h4>
                    <p className="text-sm text-gray-400">Ready to craft your story</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="text-xs text-purple-300 mt-2">
                  Cross-functional with: {agent.crossFunctional.join(', ')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="structure" className="text-white">Story Structure</Label>
                  <Select>
                    <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                      <SelectValue placeholder="Select structure" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-gold-500/30">
                      <SelectItem value="save_the_cat">Save the Cat</SelectItem>
                      <SelectItem value="three_act">Three Act</SelectItem>
                      <SelectItem value="free_form">Free Form</SelectItem>
                      <SelectItem value="experimental">Experimental</SelectItem>
                      <SelectItem value="series_pilot">TV Series Pilot</SelectItem>
                      <SelectItem value="feature_length">Feature Length</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="genre" className="text-white">Genre</Label>
                  <Select>
                    <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-gold-500/30">
                      <SelectItem value="drama">Drama</SelectItem>
                      <SelectItem value="comedy">Comedy</SelectItem>
                      <SelectItem value="thriller">Thriller</SelectItem>
                      <SelectItem value="scifi">Sci-Fi</SelectItem>
                      <SelectItem value="horror">Horror</SelectItem>
                      <SelectItem value="adult">Adult Content</SelectItem>
                      <SelectItem value="experimental">Experimental</SelectItem>
                      <SelectItem value="netflix_original">Netflix Original</SelectItem>
                      <SelectItem value="youtube_series">YouTube Series</SelectItem>
                      <SelectItem value="any">No Restrictions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="prompt" className="text-white">Story Concept</Label>
                <Textarea
                  placeholder="Describe your story idea, characters, or concept. No limits - express any vision, theme, or subject matter for any platform..."
                  className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400 min-h-32"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform" className="text-white">Target Platform</Label>
                  <Select>
                    <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-gold-500/30">
                      <SelectItem value="netflix">Netflix</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="theatrical">Theatrical</SelectItem>
                      <SelectItem value="streaming">Streaming Platforms</SelectItem>
                      <SelectItem value="festival">Film Festivals</SelectItem>
                      <SelectItem value="all">All Platforms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="collaboration" className="text-white">AI/Human Collaboration</Label>
                  <Select>
                    <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-gold-500/30">
                      <SelectItem value="ai_actors">AI Actors + Human Crew</SelectItem>
                      <SelectItem value="human_actors">Human Actors + AI Support</SelectItem>
                      <SelectItem value="hybrid">Hybrid AI/Human Cast</SelectItem>
                      <SelectItem value="full_ai">Full AI Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-gold-600 hover:from-blue-700 hover:via-purple-700 hover:to-gold-700 shadow-lg">
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Script
              </Button>
            </div>
          );

        case 'casting':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-4 rounded-lg border border-gold-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-violet-500 to-gold-500 rounded-full flex items-center justify-center animate-pulse">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">AI Casting Director</h4>
                    <p className="text-sm text-gray-400">Finding the perfect talent</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="text-xs text-purple-300 mt-2">
                  Cross-functional with: {agent.crossFunctional.join(', ')}
                </div>
              </div>

              <div>
                <Label htmlFor="character" className="text-white">Character Name</Label>
                <Input
                  placeholder="Enter character name"
                  className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white">Character Description</Label>
                <Textarea
                  placeholder="Describe the character's personality, background, role, and any specific requirements..."
                  className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400 min-h-24"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age_range" className="text-white">Age Range</Label>
                  <Input
                    placeholder="e.g., 25-35"
                    className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                  />
                </div>
                <div>
                  <Label htmlFor="casting_type" className="text-white">Casting Type</Label>
                  <Select>
                    <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-gold-500/30">
                      <SelectItem value="lead">Lead Role</SelectItem>
                      <SelectItem value="supporting">Supporting</SelectItem>
                      <SelectItem value="background">Background</SelectItem>
                      <SelectItem value="ai_actor">AI Actor</SelectItem>
                      <SelectItem value="voice_only">Voice Only</SelectItem>
                      <SelectItem value="special">Special Requirements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="talent_type" className="text-white">Talent Type</Label>
                <Select>
                  <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                    <SelectValue placeholder="Select talent type" />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-800 border-gold-500/30">
                    <SelectItem value="human">Human Actor</SelectItem>
                    <SelectItem value="ai_generated">AI Generated Actor</SelectItem>
                    <SelectItem value="hybrid">Hybrid (AI + Human)</SelectItem>
                    <SelectItem value="voice_ai">AI Voice Actor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-gold-600 hover:from-purple-700 hover:via-violet-700 hover:to-gold-700 shadow-lg">
                <Users className="w-4 h-4 mr-2" />
                Generate Casting Profile
              </Button>
            </div>
          );

        case 'post_production':
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-4 rounded-lg border border-gold-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-gold-500 rounded-full flex items-center justify-center animate-pulse">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">AI Post-Production Supervisor</h4>
                    <p className="text-sm text-gray-400">Complete editing suite</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="text-xs text-purple-300 mt-2">
                  Cross-functional with: {agent.crossFunctional.join(', ')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_type" className="text-white">Edit Type</Label>
                  <Select>
                    <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                      <SelectValue placeholder="Select edit type" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-gold-500/30">
                      <SelectItem value="rough_cut">Rough Cut</SelectItem>
                      <SelectItem value="fine_cut">Fine Cut</SelectItem>
                      <SelectItem value="color_grade">Color Grading</SelectItem>
                      <SelectItem value="vfx">VFX Integration</SelectItem>
                      <SelectItem value="sound_design">Sound Design</SelectItem>
                      <SelectItem value="final_mix">Final Mix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="platform_specs" className="text-white">Platform Specs</Label>
                  <Select>
                    <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-gold-500/30">
                      <SelectItem value="netflix_4k">Netflix 4K HDR</SelectItem>
                      <SelectItem value="youtube_hd">YouTube HD</SelectItem>
                      <SelectItem value="theatrical_dcp">Theatrical DCP</SelectItem>
                      <SelectItem value="streaming_hd">Streaming HD</SelectItem>
                      <SelectItem value="mobile_optimized">Mobile Optimized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit_notes" className="text-white">Edit Instructions</Label>
                <Textarea
                  placeholder="Describe your editing vision, style preferences, pacing notes, or specific requirements..."
                  className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400 min-h-24"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="ai-color" />
                  <Label htmlFor="ai-color" className="text-white text-sm">AI Color Grading</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="ai-sound" />
                  <Label htmlFor="ai-sound" className="text-white text-sm">AI Sound Design</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="ai-vfx" />
                  <Label htmlFor="ai-vfx" className="text-white text-sm">AI VFX Enhancement</Label>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-gold-600 hover:from-indigo-700 hover:via-purple-700 hover:to-gold-700 shadow-lg">
                <Palette className="w-4 h-4 mr-2" />
                Start Post-Production
              </Button>
            </div>
          );

        default:
          return (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Agent Interface</h3>
              <p className="text-gray-400 mb-4">
                This AI agent interface is coming soon. Each agent will have specialized tools and workflows.
              </p>
              <Badge className="bg-gold-500/20 text-gold-300 border-gold-500/30">
                In Development
              </Badge>
            </div>
          );
      }
    };

    return (
      <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${agent.color} rounded-lg flex items-center justify-center shadow-lg animate-pulse`}>
              <agent.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-white">{agent.name}</CardTitle>
              <CardDescription className="text-gray-400">{agent.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 uppercase tracking-wide">Online</span>
              </div>
              <p className="text-xs text-gray-500">{agent.personality}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderAgentForm()}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-gold-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Sparkles className="w-4 h-4 text-navy-900" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              AI Studio
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Harness the power of 8 specialized AI agents for complete film production. 
              <span className="text-gold-400 font-semibold"> Cross-functional collaboration</span> between AI and human talent for 
              <span className="text-purple-400 font-semibold"> Netflix, YouTube, and all platforms</span>.
            </p>

            {/* Creative Controls */}
            <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 backdrop-blur-sm border border-gold-500/20 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Creative Freedom Controls</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">No-Limits Creativity Mode</Label>
                    <p className="text-sm text-gray-400">Remove all content restrictions and creative barriers</p>
                  </div>
                  <Switch 
                    checked={noLimitsMode} 
                    onCheckedChange={setNoLimitsMode}
                    className="data-[state=checked]:bg-gold-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-white font-medium">Creativity Level</Label>
                    <span className="text-gold-400 font-semibold">{creativityLevel[0]}%</span>
                  </div>
                  <Slider
                    value={creativityLevel}
                    onValueChange={setCreativityLevel}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Conservative</span>
                    <span>Experimental</span>
                    <span>Revolutionary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agents Grid */}
        {!activeAgent ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Choose Your AI Agent</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>{aiAgents.length} agents online</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiAgents.map((agent) => (
                <Card 
                  key={agent.id} 
                  className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 cursor-pointer group transform hover:scale-105 hover:shadow-xl"
                  onClick={() => setActiveAgent(agent.id)}
                >
                  <CardHeader>
                    <div className="flex flex-col items-center text-center gap-3 mb-3">
                      <div className={`w-14 h-14 bg-gradient-to-r ${agent.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg animate-pulse`}>
                        <agent.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white group-hover:text-gold-400 transition-colors text-lg text-center">
                          {agent.name}
                        </CardTitle>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-xs text-green-400 uppercase tracking-wide">Online</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400 mb-3 text-center text-sm">
                      {agent.description}
                    </CardDescription>
                    <p className="text-xs text-gray-500 italic mb-3 text-center">
                      "{agent.personality}"
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 justify-center mb-3">
                      {agent.features.map((feature) => (
                        <Badge 
                          key={feature} 
                          variant="secondary" 
                          className="bg-navy-700/50 text-gray-300 text-xs border-gold-500/20"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-purple-300 text-center">
                      Cross-functional: {agent.crossFunctional.length} departments
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setActiveAgent(null)}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Agents
              </Button>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                {aiAgents.find(a => a.id === activeAgent)?.name}
              </h2>
            </div>
            
            <AgentInterface agent={aiAgents.find(a => a.id === activeAgent)} />
          </div>
        )}

        {/* Features Section */}
        {!activeAgent && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-8 text-center">Next-Gen Production Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-gold-500 rounded-lg flex items-center justify-center mb-4 shadow-lg animate-pulse">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Cross-Functional AI</CardTitle>
                  <CardDescription className="text-gray-400">
                    8 AI agents working together across all departments for seamless production workflow.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-gold-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 shadow-lg animate-pulse">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">AI/Human Collaboration</CardTitle>
                  <CardDescription className="text-gray-400">
                    Seamless integration of AI actors and real talent for next-generation productions.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-gold-500 via-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 shadow-lg animate-pulse">
                    <Scissors className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Complete Editing Suite</CardTitle>
                  <CardDescription className="text-gray-400">
                    Full post-production capabilities with AI-enhanced editing, color grading, and VFX.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 via-blue-500 to-gold-500 rounded-lg flex items-center justify-center mb-4 shadow-lg animate-pulse">
                    <Share className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Platform Ready</CardTitle>
                  <CardDescription className="text-gray-400">
                    Optimized for Netflix, YouTube, theatrical, and all distribution platforms.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
