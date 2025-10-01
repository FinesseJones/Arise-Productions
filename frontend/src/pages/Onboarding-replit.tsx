import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Film, 
  Sparkles, 
  Brain, 
  Zap, 
  Star, 
  Target,
  Rocket,
  Eye,
  Wand2,
  Users,
  Camera,
  Palette,
  Share,
  FileText,
  Calendar,
  Settings,
  Scissors
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      title: "Welcome to Finesse Jones Studio",
      subtitle: "Your AI-Powered Digital Film Studio",
      content: (
        <div className="text-center space-y-6">
          <div className="relative mx-auto mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-gold-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl animate-pulse">
              <div className="text-5xl font-bold text-white z-10 tracking-wider">FJ</div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-gold-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <Sparkles className="w-6 h-6 text-navy-900" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Where Vision Meets Technology
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Experience the future of filmmaking with AI-powered workflows, unlimited creative freedom, 
            and professional-grade tools designed for the next generation of storytellers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-4 rounded-lg border border-gold-500/20">
              <Brain className="w-8 h-8 text-gold-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">AI-Powered</h3>
              <p className="text-sm text-gray-400">8 intelligent agents for every production phase</p>
            </div>
            <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-4 rounded-lg border border-gold-500/20">
              <Star className="w-8 h-8 text-gold-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Zero Limits</h3>
              <p className="text-sm text-gray-400">Complete creative freedom without restrictions</p>
            </div>
            <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 p-4 rounded-lg border border-gold-500/20">
              <Rocket className="w-8 h-8 text-gold-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Platform Ready</h3>
              <p className="text-sm text-gray-400">Netflix, YouTube, and all distribution platforms</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Meet Your 8 AI Studio Agents",
      subtitle: "Cross-functional specialists working 24/7 for your vision",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300 text-center mb-8">
            Each AI agent is a specialist in their field, with cross-functional capabilities for seamless collaboration.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Screenwriting Assistant', icon: FileText, color: 'from-blue-500 via-purple-400 to-gold-400', desc: 'Crafts compelling scripts and stories' },
              { name: 'Script Supervisor', icon: Settings, color: 'from-green-500 via-emerald-400 to-gold-400', desc: 'Manages shooting scripts and continuity' },
              { name: 'Casting Director', icon: Users, color: 'from-purple-500 via-violet-400 to-gold-400', desc: 'AI and human talent coordination' },
              { name: 'Production Coordinator', icon: Calendar, color: 'from-orange-500 via-gold-400 to-yellow-400', desc: 'Manages schedules and logistics' },
              { name: 'Virtual Camera Operator', icon: Camera, color: 'from-pink-500 via-purple-400 to-gold-400', desc: 'Creates stunning visual compositions' },
              { name: 'Post-Production Supervisor', icon: Palette, color: 'from-indigo-500 via-purple-400 to-gold-400', desc: 'Complete editing and VFX suite' },
              { name: 'Distribution Desk', icon: Share, color: 'from-teal-500 via-blue-400 to-gold-400', desc: 'Platform optimization and delivery' },
              { name: 'Studio Forms Generator', icon: Scissors, color: 'from-yellow-500 via-gold-400 to-orange-400', desc: 'Legal and production documentation' }
            ].map((agent) => (
              <Card key={agent.name} className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${agent.color} rounded-lg flex items-center justify-center shadow-lg animate-pulse`}>
                      <agent.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-sm">{agent.name}</CardTitle>
                      <CardDescription className="text-xs">{agent.desc}</CardDescription>
                    </div>
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Cross-Functional Production Pipeline",
      subtitle: "From script to screen, seamlessly automated",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300 text-center mb-8">
            Your projects flow through production phases with intelligent automation and cross-departmental collaboration.
          </p>
          <div className="space-y-4">
            {[
              { phase: 'Development', progress: 100, color: 'from-blue-500 via-purple-500 to-gold-500', items: ['Script Generation', 'Character Development', 'Story Structure'] },
              { phase: 'Pre-Production', progress: 75, color: 'from-yellow-500 via-gold-500 to-orange-500', items: ['Casting Profiles', 'Shot Lists', 'Production Calendar'] },
              { phase: 'Production', progress: 50, color: 'from-green-500 via-emerald-500 to-teal-500', items: ['Call Sheets', 'Daily Reports', 'Continuity Tracking'] },
              { phase: 'Post-Production', progress: 25, color: 'from-purple-500 via-violet-500 to-indigo-500', items: ['Edit Notes', 'VFX Coordination', 'Color Grading'] },
              { phase: 'Distribution', progress: 0, color: 'from-orange-500 via-red-500 to-pink-500', items: ['Press Kits', 'Platform Optimization', 'Festival Submissions'] }
            ].map((phase) => (
              <Card key={phase.phase} className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{phase.phase}</h3>
                    <Badge className={`bg-gradient-to-r ${phase.color} text-white`}>
                      {phase.progress}%
                    </Badge>
                  </div>
                  <Progress value={phase.progress} className="h-2 mb-3" />
                  <div className="flex flex-wrap gap-2">
                    {phase.items.map((item) => (
                      <Badge key={item} variant="secondary" className="bg-navy-700/50 text-gray-300 text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "AI/Human Collaboration & Platform Ready",
      subtitle: "Next-gen production for all platforms",
      content: (
        <div className="text-center space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-purple-500 to-gold-500 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">AI/Human Collaboration</CardTitle>
                <CardDescription className="text-gray-400">
                  Seamless integration of AI actors and real talent. Work with both AI-generated and human performers.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-gold-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Complete Editing Suite</CardTitle>
                <CardDescription className="text-gray-400">
                  Full post-production capabilities with AI-enhanced editing, color grading, VFX, and sound design.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-gold-500 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Platform Optimization</CardTitle>
                <CardDescription className="text-gray-400">
                  Optimized for Netflix, YouTube, theatrical, streaming, and all distribution platforms.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-gold-500 via-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Next-Gen Technology</CardTitle>
                <CardDescription className="text-gray-400">
                  Cutting-edge 3D interfaces, AR/VR ready components, and future-proof workflows.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 backdrop-blur-sm border border-gold-500/20 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">Your Complete Production Studio</h3>
            <p className="text-gray-300 leading-relaxed">
              Finesse Jones Studio is your complete digital film studio replica with next-generation technology. 
              Create any type of film or TV production with AI and human collaboration, complete editing capabilities, 
              and delivery-ready packages for Netflix, YouTube, and all major platforms.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Create?",
      subtitle: "Your filmmaking journey starts now",
      content: (
        <div className="text-center space-y-8">
          <div className="relative mx-auto mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-gold-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl animate-pulse">
              <Wand2 className="w-12 h-12 text-white z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Welcome to the Future of Filmmaking
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            You're now ready to explore Finesse Jones Studio. Create your first project, collaborate with 8 AI agents, 
            and discover unlimited possibilities with AI/human collaboration for any platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700 text-white py-6 text-lg shadow-xl"
            >
              <Film className="w-5 h-5 mr-2" />
              Create First Project
            </Button>
            <Button 
              onClick={() => navigate('/ai-studio')}
              variant="outline" 
              className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10 py-6 text-lg shadow-xl"
            >
              <Brain className="w-5 h-5 mr-2" />
              Explore AI Studio
            </Button>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <div className="text-xl font-bold text-white tracking-wider">FJ</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">Studio Onboarding</h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
            <div className="flex-1 max-w-xs">
              <Progress value={progress} className="h-2" />
            </div>
            <span className="text-sm text-gold-400 font-medium">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Content */}
        <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-lg text-gray-300">
              {steps[currentStep].subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {steps[currentStep].content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Skip Tour
              </Button>
            </Link>
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={nextStep}
                className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold"
              >
                Enter Studio
                <Rocket className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
