import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  Edit3, 
  Save, 
  Eye, 
  Code, 
  Palette, 
  Globe,
  Users,
  Database,
  Shield,
  Monitor,
  Zap,
  Star,
  Brain,
  Film,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export default function AdminPanel() {
  const [isEditing, setIsEditing] = useState(false);
  const [studioConfig, setStudioConfig] = useState({
    studioName: 'Finesse Jones Studio',
    tagline: 'Your AI-Powered Digital Film Studio',
    description: 'Where vision meets technology. Creator-led. AI-powered. Built to empower the next generation of filmmakers with zero creative restrictions and cutting-edge automation for Netflix, YouTube, and beyond.',
    heroTitle: 'Finesse Jones Digital Film Studio',
    heroSubtitle: 'Where vision meets technology',
    copyrightText: '© Finesse Jones | Vision-Driven | Creator-Led | Built To Empower Bold',
    primaryColor: '#D4AF37', // Gold
    secondaryColor: '#8B5CF6', // Purple
    accentColor: '#3B82F6', // Blue
    enableAIStudio: true,
    enableEditingSuite: true,
    enablePlatformOptimizer: true,
    maxProjects: 100,
    aiAgentsCount: 8,
    supportedPlatforms: ['Netflix', 'YouTube', 'Theatrical', 'Streaming', 'Mobile', 'VR']
  });
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, this would save to a backend
    localStorage.setItem('studioConfig', JSON.stringify(studioConfig));
    setIsEditing(false);
    toast({
      title: "⚙️ Configuration Saved",
      description: "Studio configuration has been updated successfully.",
    });
  };

  const handleReset = () => {
    // Reset to defaults
    setStudioConfig({
      studioName: 'Finesse Jones Studio',
      tagline: 'Your AI-Powered Digital Film Studio',
      description: 'Where vision meets technology. Creator-led. AI-powered. Built to empower the next generation of filmmakers with zero creative restrictions and cutting-edge automation for Netflix, YouTube, and beyond.',
      heroTitle: 'Finesse Jones Digital Film Studio',
      heroSubtitle: 'Where vision meets technology',
      copyrightText: '© Finesse Jones | Vision-Driven | Creator-Led | Built To Empower Bold',
      primaryColor: '#D4AF37',
      secondaryColor: '#8B5CF6',
      accentColor: '#3B82F6',
      enableAIStudio: true,
      enableEditingSuite: true,
      enablePlatformOptimizer: true,
      maxProjects: 100,
      aiAgentsCount: 8,
      supportedPlatforms: ['Netflix', 'YouTube', 'Theatrical', 'Streaming', 'Mobile', 'VR']
    });
    toast({
      title: "🔄 Configuration Reset",
      description: "Studio configuration has been reset to defaults.",
    });
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
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-500 via-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-gray-300">Configure and customize your studio experience</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(!isEditing)}
                className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10"
              >
                {isEditing ? <Eye className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {isEditing ? 'Preview' : 'Edit Mode'}
              </Button>
              {isEditing && (
                <>
                  <Button 
                    onClick={handleSave}
                    className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                  >
                    Reset
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-navy-800/50 border-gold-500/20 backdrop-blur-sm">
            <TabsTrigger value="general" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
              General Settings
            </TabsTrigger>
            <TabsTrigger value="branding" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
              Branding & UI
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
              Features & Modules
            </TabsTrigger>
            <TabsTrigger value="ai-config" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
              AI Configuration
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
              Live Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Studio Information
                  </CardTitle>
                  <CardDescription>Basic studio configuration and metadata</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="studio-name" className="text-white">Studio Name</Label>
                    <Input
                      id="studio-name"
                      value={studioConfig.studioName}
                      onChange={(e) => setStudioConfig(prev => ({ ...prev, studioName: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline" className="text-white">Tagline</Label>
                    <Input
                      id="tagline"
                      value={studioConfig.tagline}
                      onChange={(e) => setStudioConfig(prev => ({ ...prev, tagline: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      value={studioConfig.description}
                      onChange={(e) => setStudioConfig(prev => ({ ...prev, description: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400 min-h-24"
                    />
                  </div>
                  <div>
                    <Label htmlFor="copyright" className="text-white">Copyright Text</Label>
                    <Input
                      id="copyright"
                      value={studioConfig.copyrightText}
                      onChange={(e) => setStudioConfig(prev => ({ ...prev, copyrightText: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>Technical settings and limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="max-projects" className="text-white">Maximum Projects</Label>
                    <Input
                      id="max-projects"
                      type="number"
                      value={studioConfig.maxProjects}
                      onChange={(e) => setStudioConfig(prev => ({ ...prev, maxProjects: parseInt(e.target.value) }))}
                      disabled={!isEditing}
                      className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ai-agents" className="text-white">AI Agents Count</Label>
                    <Input
                      id="ai-agents"
                      type="number"
                      value={studioConfig.aiAgentsCount}
                      onChange={(e) => setStudioConfig(prev => ({ ...prev, aiAgentsCount: parseInt(e.target.value) }))}
                      disabled={!isEditing}
                      className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Supported Platforms</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['Netflix', 'YouTube', 'Theatrical', 'Streaming', 'Mobile', 'VR', 'Broadcast', 'Festival'].map((platform) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Switch
                            id={platform}
                            checked={studioConfig.supportedPlatforms.includes(platform)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setStudioConfig(prev => ({
                                  ...prev,
                                  supportedPlatforms: [...prev.supportedPlatforms, platform]
                                }));
                              } else {
                                setStudioConfig(prev => ({
                                  ...prev,
                                  supportedPlatforms: prev.supportedPlatforms.filter(p => p !== platform)
                                }));
                              }
                            }}
                            disabled={!isEditing}
                            className="data-[state=checked]:bg-gold-500"
                          />
                          <Label htmlFor={platform} className="text-white text-sm">{platform}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Color Scheme
                  </CardTitle>
                  <CardDescription>Customize the studio's visual appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="primary-color" className="text-white">Primary Color (Gold)</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="primary-color"
                        type="color"
                        value={studioConfig.primaryColor}
                        onChange={(e) => setStudioConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                        disabled={!isEditing}
                        className="w-16 h-10 bg-navy-800/50 border-gold-500/30"
                      />
                      <Input
                        value={studioConfig.primaryColor}
                        onChange={(e) => setStudioConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                        disabled={!isEditing}
                        className="flex-1 bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondary-color" className="text-white">Secondary Color (Purple)</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={studioConfig.secondaryColor}
                        onChange={(e) => setStudioConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        disabled={!isEditing}
                        className="w-16 h-10 bg-navy-800/50 border-gold-500/30"
                      />
                      <Input
                        value={studioConfig.secondaryColor}
                        onChange={(e) => setStudioConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        disabled={!isEditing}
                        className="flex-1 bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accent-color" className="text-white">Accent Color (Blue)</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="accent-color"
                        type="color"
                        value={studioConfig.accentColor}
                        onChange={(e) => setStudioConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                        disabled={!isEditing}
                        className="w-16 h-10 bg-navy-800/50 border-gold-500/30"
                      />
                      <Input
                        value={studioConfig.accentColor}
                        onChange={(e) => setStudioConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                        disabled={!isEditing}
                        className="flex-1 bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Film className="w-5 h-5" />
                    Hero Section
                  </CardTitle>
                  <CardDescription>Main landing page content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hero-title" className="text-white">Hero Title</Label>
                    <Input
                      id="hero-title"
                      value={studioConfig.heroTitle}
                      onChange={(e) => setStudioConfig(prev => ({ ...prev, heroTitle: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-subtitle" className="text-white">Hero Subtitle</Label>
                    <Input
                      id="hero-subtitle"
                      value={studioConfig.heroSubtitle}
                      onChange={(e) => setStudioConfig(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Studio Modules
                </CardTitle>
                <CardDescription>Enable or disable studio features and modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Core Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white font-medium">AI Studio</Label>
                          <p className="text-sm text-gray-400">8 AI agents for production</p>
                        </div>
                        <Switch
                          checked={studioConfig.enableAIStudio}
                          onCheckedChange={(checked) => setStudioConfig(prev => ({ ...prev, enableAIStudio: checked }))}
                          disabled={!isEditing}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white font-medium">Editing Suite</Label>
                          <p className="text-sm text-gray-400">Complete post-production</p>
                        </div>
                        <Switch
                          checked={studioConfig.enableEditingSuite}
                          onCheckedChange={(checked) => setStudioConfig(prev => ({ ...prev, enableEditingSuite: checked }))}
                          disabled={!isEditing}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white font-medium">Platform Optimizer</Label>
                          <p className="text-sm text-gray-400">Multi-platform delivery</p>
                        </div>
                        <Switch
                          checked={studioConfig.enablePlatformOptimizer}
                          onCheckedChange={(checked) => setStudioConfig(prev => ({ ...prev, enablePlatformOptimizer: checked }))}
                          disabled={!isEditing}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Collaboration</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white font-medium">Writing Room</Label>
                          <p className="text-sm text-gray-400">Collaborative scripting</p>
                        </div>
                        <Switch
                          defaultChecked
                          disabled={!isEditing}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white font-medium">Asset Library</Label>
                          <p className="text-sm text-gray-400">File management</p>
                        </div>
                        <Switch
                          defaultChecked
                          disabled={!isEditing}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white font-medium">Team Collaboration</Label>
                          <p className="text-sm text-gray-400">Real-time collaboration</p>
                        </div>
                        <Switch
                          defaultChecked
                          disabled={!isEditing}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Advanced</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white font-medium">Analytics</Label>
                          <p className="text-sm text-gray-400">Project insights</p>
                        </div>
                        <Switch
                          defaultChecked
                          disabled={!isEditing}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white font-medium">API Access</Label>
                          <p className="text-sm text-gray-400">External integrations</p>
                        </div>
                        <Switch
                          disabled={!isEditing}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white font-medium">Custom Branding</Label>
                          <p className="text-sm text-gray-400">White-label options</p>
                        </div>
                        <Switch
                          defaultChecked
                          disabled={!isEditing}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-config" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Agents Configuration
                  </CardTitle>
                  <CardDescription>Configure AI agent behavior and capabilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Default AI Provider</Label>
                    <Select disabled={!isEditing}>
                      <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                        <SelectValue placeholder="Select AI provider" />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-800 border-gold-500/30">
                        <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                        <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-medium">Creative Freedom Mode</Label>
                      <p className="text-sm text-gray-400">Remove content restrictions</p>
                    </div>
                    <Switch
                      defaultChecked
                      disabled={!isEditing}
                      className="data-[state=checked]:bg-gold-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-medium">Cross-Functional AI</Label>
                      <p className="text-sm text-gray-400">Enable agent collaboration</p>
                    </div>
                    <Switch
                      defaultChecked
                      disabled={!isEditing}
                      className="data-[state=checked]:bg-gold-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    AI Agent Status
                  </CardTitle>
                  <CardDescription>Current status of all AI agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Screenwriting Assistant',
                      'Script Supervisor',
                      'Casting Director',
                      'Production Coordinator',
                      'Virtual Camera Operator',
                      'Post-Production Supervisor',
                      'Distribution Desk',
                      'Studio Forms Generator'
                    ].map((agent) => (
                      <div key={agent} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-white text-sm">{agent}</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                          Online
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>Preview how your changes will appear to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-slate-900 via-navy-900 to-purple-900 rounded-lg p-8 border border-gold-500/20">
                  {/* Mini Dashboard Preview */}
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-gold-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <div className="text-2xl font-bold text-white tracking-wider">FJ</div>
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      {studioConfig.heroTitle}
                    </h1>
                    <p className="text-lg text-gray-300 mb-4">
                      {studioConfig.heroSubtitle}
                    </p>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                      {studioConfig.description}
                    </p>
                  </div>

                  {/* Sample Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700">
                      <Film className="w-4 h-4 mr-2" />
                      Create Project
                    </Button>
                    <Button className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Studio
                    </Button>
                  </div>

                  {/* Copyright Preview */}
                  <div className="text-center border-t border-gold-500/20 pt-6">
                    <p className="text-gold-400 font-medium">
                      {studioConfig.copyrightText}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
