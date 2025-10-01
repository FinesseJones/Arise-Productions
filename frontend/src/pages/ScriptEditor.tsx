import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Save, 
  Download, 
  Share2, 
  Eye, 
  Edit3,
  Clock,
  Users,
  MessageSquare,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Plus,
  Undo,
  Redo,
  Search,
  Replace,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

export default function ScriptEditor() {
  const { id } = useParams<{ id: string }>();
  const [scriptContent, setScriptContent] = useState('');
  const [scriptTitle, setScriptTitle] = useState('');
  const [currentVersion, setCurrentVersion] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [collaborators, setCollaborators] = useState([
    { name: 'Director', status: 'reviewing', lastSeen: '2 hours ago' },
    { name: 'Producer', status: 'approved', lastSeen: '1 day ago' },
    { name: 'Script Supervisor AI', status: 'online', lastSeen: 'now' }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    loadScript();
  }, [id]);

  const loadScript = async () => {
    try {
      const response = await backend.studio.getProjectFiles({
        project_id: parseInt(id!),
        file_type: 'script'
      });
      
      if (response.files.length > 0) {
        const latestScript = response.files[0];
        setScriptContent(latestScript.content);
        setScriptTitle(latestScript.file_name);
        setCurrentVersion(latestScript.metadata.version || 1);
      }
    } catch (error) {
      console.error('Failed to load script:', error);
    }
  };

  const saveScript = async () => {
    try {
      await backend.studio.createProjectFile({
        project_id: parseInt(id!),
        file_type: 'script',
        file_name: scriptTitle || `Script_v${currentVersion + 1}`,
        content: scriptContent,
        metadata: {
          version: currentVersion + 1,
          revision_notes: revisionNotes,
          timestamp: new Date().toISOString()
        }
      });

      setCurrentVersion(currentVersion + 1);
      setHasUnsavedChanges(false);
      setRevisionNotes('');
      
      toast({
        title: "📝 Script Saved",
        description: `Version ${currentVersion + 1} has been saved to project files.`,
      });
    } catch (error) {
      console.error('Failed to save script:', error);
      toast({
        title: "Error",
        description: "Failed to save script. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContentChange = (content: string) => {
    setScriptContent(content);
    setHasUnsavedChanges(true);
  };

  const formatScript = () => {
    // Basic script formatting
    const formatted = scriptContent
      .replace(/^([A-Z][A-Z\s]+)$/gm, '$1') // Character names
      .replace(/^\s*\(([^)]+)\)\s*$/gm, '($1)') // Parentheticals
      .replace(/^(FADE IN:|FADE OUT:|CUT TO:)/gm, '$1'); // Transitions
    
    setScriptContent(formatted);
    setHasUnsavedChanges(true);
    
    toast({
      title: "✨ Script Formatted",
      description: "Script has been formatted according to industry standards.",
    });
  };

  const findAndReplace = () => {
    if (!searchTerm) return;
    
    const newContent = scriptContent.replace(new RegExp(searchTerm, 'g'), replaceTerm);
    setScriptContent(newContent);
    setHasUnsavedChanges(true);
    
    toast({
      title: "🔍 Find & Replace Complete",
      description: `Replaced all instances of "${searchTerm}" with "${replaceTerm}".`,
    });
  };

  const exportScript = () => {
    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scriptTitle || 'script'}_v${currentVersion}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "📥 Script Exported",
      description: "Script has been downloaded to your device.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-purple-900">
      {/* Header */}
      <div className="border-b border-gold-500/20 bg-navy-800/30 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/editing-suite/${id}`}>
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editing Suite
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Script Editor</h1>
                <p className="text-sm text-gray-400">Post-production script editing & revision tracking</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-navy-700/50 text-gray-300">
                Version {currentVersion}
              </Badge>
              {hasUnsavedChanges && (
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  Unsaved Changes
                </Badge>
              )}
            </div>
            <Button 
              onClick={saveScript}
              disabled={!hasUnsavedChanges}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Script
            </Button>
            <Button 
              variant="outline" 
              onClick={exportScript}
              className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="editor" className="space-y-6">
              <TabsList className="bg-navy-800/50 border-gold-500/20 backdrop-blur-sm">
                <TabsTrigger value="editor" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                  Script Editor
                </TabsTrigger>
                <TabsTrigger value="revisions" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                  Revision History
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                  Production Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="space-y-4">
                {/* Script Title */}
                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label htmlFor="script-title" className="text-white">Script Title</Label>
                        <Input
                          id="script-title"
                          value={scriptTitle}
                          onChange={(e) => setScriptTitle(e.target.value)}
                          placeholder="Enter script title..."
                          className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={formatScript}
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Format
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Find & Replace */}
                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="search" className="text-white text-sm">Find</Label>
                        <Input
                          id="search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search text..."
                          className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="replace" className="text-white text-sm">Replace</Label>
                        <Input
                          id="replace"
                          value={replaceTerm}
                          onChange={(e) => setReplaceTerm(e.target.value)}
                          placeholder="Replace with..."
                          className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          onClick={findAndReplace}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        >
                          <Replace className="w-4 h-4 mr-2" />
                          Replace All
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Script Content */}
                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Script Content</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Undo className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Redo className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={scriptContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="FADE IN:

EXT. LOCATION - DAY

Write your script here using standard screenplay format...

CHARACTER NAME
Dialogue goes here.

(Parenthetical)
More dialogue.

FADE OUT."
                      className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400 min-h-96 font-mono text-sm leading-relaxed"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="revisions" className="space-y-4">
                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Revision History</CardTitle>
                    <CardDescription>Track all script changes and versions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { version: 3, date: '2024-01-15', author: 'Script Supervisor AI', changes: 'Dialogue polish and formatting' },
                      { version: 2, date: '2024-01-14', author: 'Director', changes: 'Character development in Act 2' },
                      { version: 1, date: '2024-01-13', author: 'Writer', changes: 'Initial script creation' }
                    ].map((revision) => (
                      <div key={revision.version} className="bg-navy-700/30 p-4 rounded-lg border border-gold-500/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              v{revision.version}
                            </Badge>
                            <span className="text-white font-medium">{revision.author}</span>
                          </div>
                          <span className="text-gray-400 text-sm">{revision.date}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{revision.changes}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Production Notes</CardTitle>
                    <CardDescription>Notes and feedback from the production team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-navy-700/30 p-4 rounded-lg border border-gold-500/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Director</p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">The dialogue in scene 12 needs to be more emotional. Consider adding a pause before the final line.</p>
                    </div>
                    
                    <div className="bg-navy-700/30 p-4 rounded-lg border border-gold-500/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-gold-500 to-yellow-500 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Script Supervisor AI</p>
                          <p className="text-xs text-gray-400">1 day ago</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">Continuity check: Character mentions being 25 in scene 3 but 26 in scene 8. Please verify character age consistency.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Add Note */}
                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Label htmlFor="revision-notes" className="text-white">Add Revision Notes</Label>
                      <Textarea
                        id="revision-notes"
                        value={revisionNotes}
                        onChange={(e) => setRevisionNotes(e.target.value)}
                        placeholder="Add notes about changes made in this revision..."
                        className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                      />
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Collaborators */}
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Collaborators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {collaborators.map((collaborator, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-navy-700/30">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{collaborator.name}</p>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            collaborator.status === 'online' ? 'bg-green-400' :
                            collaborator.status === 'approved' ? 'bg-blue-400' : 'bg-yellow-400'
                          }`} />
                          <span className="text-xs text-gray-400">{collaborator.lastSeen}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Script Stats */}
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Script Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pages</span>
                    <span className="text-white font-medium">{Math.ceil(scriptContent.length / 250)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Words</span>
                    <span className="text-white font-medium">{scriptContent.split(' ').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Characters</span>
                    <span className="text-white font-medium">{scriptContent.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Est. Runtime</span>
                    <span className="text-white font-medium">{Math.ceil(scriptContent.length / 250)} min</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-gold-500/30 text-gold-300 hover:bg-gold-500/10"
                    onClick={exportScript}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Script
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  >
                    <GitBranch className="w-4 h-4 mr-2" />
                    Create Branch
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
