import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  MessageSquare, 
  Brain, 
  Plus, 
  Send,
  Mic,
  Video,
  FileText,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target,
  Zap,
  Settings,
  Save,
  Download,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

export default function WritingRoom() {
  const { id } = useParams<{ id: string }>();
  const [sessionType, setSessionType] = useState<'brainstorm' | 'script_review' | 'character_development' | 'plot_discussion'>('brainstorm');
  const [topic, setTopic] = useState('');
  const [currentScript, setCurrentScript] = useState('');
  const [participants, setParticipants] = useState([
    { name: 'You', role: 'writer' as const, ai_type: undefined },
    { name: 'Creative AI', role: 'ai_agent' as const, ai_type: 'creative' as const },
    { name: 'Structural AI', role: 'ai_agent' as const, ai_type: 'structural' as const },
    { name: 'Character AI', role: 'ai_agent' as const, ai_type: 'character_focused' as const }
  ]);
  const [sessionData, setSessionData] = useState<any>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [aiProvider, setAiProvider] = useState<'openai' | 'anthropic' | 'gemini'>('openai');
  const { toast } = useToast();

  const startWritingSession = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic for the writing session.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await backend.ai.createWritingRoomSession({
        project_id: parseInt(id!),
        session_type: sessionType,
        participants: participants,
        topic: topic,
        current_script: currentScript || undefined
      });

      setSessionData(response);
      setIsSessionActive(true);
      
      // Save session to project files
      await backend.studio.createProjectFile({
        project_id: parseInt(id!),
        file_type: 'session',
        file_name: `Writing_Session_${response.session_id}`,
        content: JSON.stringify(response),
        metadata: { session_type: sessionType, topic: topic }
      });

      toast({
        title: "🎬 Writing Session Started",
        description: "Your collaborative writing session is now active with AI agents.",
      });
    } catch (error) {
      console.error('Failed to start writing session:', error);
      toast({
        title: "Error",
        description: "Failed to start writing session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addParticipant = () => {
    setParticipants([...participants, { 
      name: `Writer ${participants.length + 1}`, 
      role: 'writer', 
      ai_type: undefined 
    }]);
  };

  const generateScript = async () => {
    try {
      const response = await backend.ai.generateScript({
        project_id: parseInt(id!),
        prompt: topic,
        structure: 'three_act',
        genre: 'drama',
        ai_provider: aiProvider
      });

      setCurrentScript(response.script);
      
      // Save script to project files
      await backend.studio.createProjectFile({
        project_id: parseInt(id!),
        file_type: 'script',
        file_name: `Generated_Script_${Date.now()}`,
        content: response.script,
        metadata: { 
          generated_by: 'ai',
          provider: aiProvider,
          logline: response.logline,
          title_suggestions: response.title_suggestions
        }
      });

      toast({
        title: "🎭 Script Generated",
        description: "AI has generated a new script based on your topic.",
      });
    } catch (error) {
      console.error('Failed to generate script:', error);
      toast({
        title: "Error",
        description: "Failed to generate script. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveSession = async () => {
    if (!sessionData) return;

    try {
      await backend.studio.createProjectFile({
        project_id: parseInt(id!),
        file_type: 'session',
        file_name: `Writing_Session_${Date.now()}`,
        content: JSON.stringify({
          ...sessionData,
          current_script: currentScript,
          final_notes: newMessage
        }),
        metadata: { 
          session_type: sessionType,
          topic: topic,
          participants_count: participants.length
        }
      });

      toast({
        title: "💾 Session Saved",
        description: "Writing session has been saved to project files.",
      });
    } catch (error) {
      console.error('Failed to save session:', error);
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
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
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-gold-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center animate-bounce">
                  <Brain className="w-4 h-4 text-navy-900" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-gold-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Writing Room
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Collaborate with AI agents and human writers around the virtual table. 
              Cross-functional perspectives for better storytelling.
            </p>
          </div>
        </div>

        {!isSessionActive ? (
          /* Session Setup */
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-3">
                  <Settings className="w-6 h-6" />
                  Setup Writing Session
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure your collaborative writing session with AI agents and human writers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="session-type" className="text-white">Session Type</Label>
                    <Select value={sessionType} onValueChange={(value: any) => setSessionType(value)}>
                      <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-800 border-gold-500/30">
                        <SelectItem value="brainstorm">Brainstorming</SelectItem>
                        <SelectItem value="script_review">Script Review</SelectItem>
                        <SelectItem value="character_development">Character Development</SelectItem>
                        <SelectItem value="plot_discussion">Plot Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ai-provider" className="text-white">AI Provider</Label>
                    <Select value={aiProvider} onValueChange={(value: any) => setAiProvider(value)}>
                      <SelectTrigger className="bg-navy-800/50 border-gold-500/30 text-white focus:border-gold-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-800 border-gold-500/30">
                        <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                        <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="topic" className="text-white">Session Topic</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="What would you like to discuss or work on?"
                    className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                  />
                </div>

                <div>
                  <Label htmlFor="script" className="text-white">Current Script (Optional)</Label>
                  <Textarea
                    id="script"
                    value={currentScript}
                    onChange={(e) => setCurrentScript(e.target.value)}
                    placeholder="Paste your current script here for review and discussion..."
                    className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400 min-h-32"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={generateScript}
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Script
                    </Button>
                  </div>
                </div>

                {/* Participants */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-white">Session Participants</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={addParticipant}
                      className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Writer
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {participants.map((participant, index) => (
                      <Card key={index} className="bg-navy-800/30 border-gold-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                              {participant.role === 'ai_agent' ? (
                                <Brain className="w-5 h-5 text-white" />
                              ) : (
                                <Users className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">{participant.name}</p>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${
                                    participant.role === 'ai_agent' 
                                      ? 'bg-purple-500/20 text-purple-300' 
                                      : 'bg-blue-500/20 text-blue-300'
                                  }`}
                                >
                                  {participant.role === 'ai_agent' ? 'AI Agent' : 'Human Writer'}
                                </Badge>
                                {participant.ai_type && (
                                  <Badge variant="secondary" className="bg-gold-500/20 text-gold-300 text-xs">
                                    {participant.ai_type.replace('_', ' ')}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={startWritingSession}
                  className="w-full bg-gradient-to-r from-purple-600 via-gold-600 to-blue-600 hover:from-purple-700 hover:via-gold-700 hover:to-blue-700 text-white py-6 text-lg shadow-xl"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Start Writing Session
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Active Session */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Participants Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Round Table
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-navy-700/30 border border-gold-500/10">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className={`${
                          participant.role === 'ai_agent' 
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                            : 'bg-gradient-to-r from-gold-500 to-orange-500'
                        } text-white`}>
                          {participant.role === 'ai_agent' ? (
                            <Brain className="w-5 h-5" />
                          ) : (
                            participant.name.charAt(0)
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{participant.name}</p>
                        <p className="text-xs text-gray-400">
                          {participant.role === 'ai_agent' ? participant.ai_type?.replace('_', ' ') : 'Writer'}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Session Controls */}
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Session Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-gold-500/30 text-gold-300 hover:bg-gold-500/10"
                    onClick={saveSession}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Session
                  </Button>
                  <Button variant="outline" className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
                    <Download className="w-4 h-4 mr-2" />
                    Export Notes
                  </Button>
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Session
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Session Area */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="discussion" className="space-y-6">
                <TabsList className="bg-navy-800/50 border-gold-500/20 backdrop-blur-sm">
                  <TabsTrigger value="discussion" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                    Discussion
                  </TabsTrigger>
                  <TabsTrigger value="script" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                    Script Work
                  </TabsTrigger>
                  <TabsTrigger value="next-steps" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                    Next Steps
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="discussion" className="space-y-4">
                  {/* Discussion Points */}
                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Session Discussion</CardTitle>
                      <CardDescription>Topic: {topic}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                      {sessionData?.discussion_points.map((point: any, index: number) => (
                        <div key={index} className="bg-navy-700/30 p-4 rounded-lg border border-gold-500/10">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                                {point.participant.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white font-medium text-sm">{point.participant}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(point.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-3">{point.perspective}</p>
                          <div className="space-y-1">
                            {point.suggestions.map((suggestion: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Lightbulb className="w-3 h-3 text-gold-400" />
                                <span className="text-sm text-gray-300">{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Add Comment */}
                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-r from-gold-500 to-orange-500 text-white">
                            You
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <Textarea
                            placeholder="Add your thoughts, ideas, or feedback to the discussion..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                                <Mic className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                                <Video className="w-4 h-4" />
                              </Button>
                            </div>
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                              <Send className="w-4 h-4 mr-2" />
                              Add to Discussion
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="script" className="space-y-4">
                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Script Editor</CardTitle>
                      <CardDescription>Collaborative script editing with AI assistance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={currentScript}
                        onChange={(e) => setCurrentScript(e.target.value)}
                        placeholder="Write or paste your script here..."
                        className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400 min-h-96 font-mono"
                      />
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                        >
                          <Brain className="w-4 h-4 mr-2" />
                          AI Suggestions
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Format Script
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Version
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="next-steps" className="space-y-4">
                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Next Steps & Action Items</CardTitle>
                      <CardDescription>AI-generated recommendations based on session discussion</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {sessionData?.next_steps.map((step: any, index: number) => (
                        <div key={index} className="bg-navy-700/30 p-4 rounded-lg border border-gold-500/10">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                step.priority === 'high' ? 'bg-red-400' :
                                step.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                              }`} />
                              <h4 className="text-white font-medium">{step.action}</h4>
                            </div>
                            <Badge 
                              variant="secondary" 
                              className={`${
                                step.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                                step.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-green-500/20 text-green-300'
                              }`}
                            >
                              {step.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Assigned to: {step.assigned_to}</span>
                            <span className="text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {step.estimated_time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Session Summary */}
                  <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Session Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">{sessionData?.session_summary}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
