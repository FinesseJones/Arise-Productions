import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  MessageSquare, 
  Video, 
  Share2, 
  Bell, 
  Clock, 
  Eye,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Settings,
  Star,
  Pin,
  Reply,
  Heart,
  Send,
  Paperclip,
  Mic,
  Camera,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

export default function Collaboration() {
  const [newMessage, setNewMessage] = useState('');

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Director',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      lastSeen: 'now'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Cinematographer',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      lastSeen: '5 min ago'
    },
    {
      id: 3,
      name: 'Emma Thompson',
      role: 'Producer',
      avatar: '/api/placeholder/40/40',
      status: 'away',
      lastSeen: '1 hour ago'
    },
    {
      id: 4,
      name: 'AI Script Supervisor',
      role: 'AI Agent',
      avatar: null,
      status: 'online',
      lastSeen: 'always available'
    }
  ];

  const conversations = [
    {
      id: 1,
      title: 'Scene 5 Discussion',
      participants: ['Sarah Chen', 'Marcus Rodriguez'],
      lastMessage: 'The lighting setup looks perfect for the mood we want',
      timestamp: '2 min ago',
      unread: 3,
      type: 'discussion'
    },
    {
      id: 2,
      title: 'Script Review - Act 2',
      participants: ['Emma Thompson', 'AI Script Supervisor'],
      lastMessage: 'AI analysis suggests strengthening the character arc',
      timestamp: '15 min ago',
      unread: 0,
      type: 'review'
    },
    {
      id: 3,
      title: 'Production Meeting',
      participants: ['Sarah Chen', 'Emma Thompson', 'Marcus Rodriguez'],
      lastMessage: 'Meeting scheduled for tomorrow at 2 PM',
      timestamp: '1 hour ago',
      unread: 1,
      type: 'meeting'
    }
  ];

  const comments = [
    {
      id: 1,
      author: 'Sarah Chen',
      avatar: '/api/placeholder/32/32',
      content: 'The opening sequence needs more emotional depth. What if we add a close-up of the character\'s hands?',
      timestamp: '10 min ago',
      replies: 2,
      likes: 3,
      type: 'suggestion'
    },
    {
      id: 2,
      author: 'AI Script Supervisor',
      avatar: null,
      content: 'Analysis complete: Character development shows 85% consistency. Suggested improvement: Add backstory reference in Scene 12.',
      timestamp: '25 min ago',
      replies: 1,
      likes: 5,
      type: 'ai-analysis'
    },
    {
      id: 3,
      author: 'Marcus Rodriguez',
      avatar: '/api/placeholder/32/32',
      content: 'Camera test footage uploaded. The new lens gives us exactly the cinematic look we discussed.',
      timestamp: '1 hour ago',
      replies: 0,
      likes: 2,
      type: 'update'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      online: 'bg-green-400',
      away: 'bg-yellow-400',
      offline: 'bg-gray-400'
    };
    return colors[status] || colors.offline;
  };

  const getCommentIcon = (type: string) => {
    const icons = {
      suggestion: MessageSquare,
      'ai-analysis': Star,
      update: Info,
      meeting: Calendar
    };
    return icons[type] || MessageSquare;
  };

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
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Collaboration Hub</h1>
              <p className="text-gray-300">Connect, communicate, and create together</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Team
              </Button>
              <Button variant="outline" className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
                <Video className="w-4 h-4 mr-2" />
                Start Meeting
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Team Members Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-navy-700/30 transition-colors cursor-pointer">
                    <div className="relative">
                      {member.avatar ? (
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-navy-600 text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-navy-800`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-gold-500/30 text-gold-300 hover:bg-gold-500/10">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  New Discussion
                </Button>
                <Button variant="outline" className="w-full justify-start border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Asset
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="discussions" className="space-y-6">
              <TabsList className="bg-navy-800/50 border-gold-500/20 backdrop-blur-sm">
                <TabsTrigger value="discussions" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                  Discussions
                </TabsTrigger>
                <TabsTrigger value="comments" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                  Comments & Reviews
                </TabsTrigger>
                <TabsTrigger value="meetings" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
                  Meetings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="discussions" className="space-y-4">
                {/* Search and Filter */}
                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search discussions..."
                          className="pl-10 bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400"
                        />
                      </div>
                      <Button variant="outline" className="border-gold-500/30 text-gold-300 hover:bg-gold-500/10">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Conversations List */}
                <div className="space-y-4">
                  {conversations.map((conversation) => (
                    <Card key={conversation.id} className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm hover:bg-navy-800/50 transition-all duration-300 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-white">{conversation.title}</h3>
                              {conversation.unread > 0 && (
                                <Badge className="bg-gold-500 text-navy-900 text-xs">
                                  {conversation.unread}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{conversation.lastMessage}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {conversation.timestamp}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {conversation.participants.length} participants
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                {/* Comments Feed */}
                <div className="space-y-4">
                  {comments.map((comment) => {
                    const IconComponent = getCommentIcon(comment.type);
                    return (
                      <Card key={comment.id} className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              {comment.avatar ? (
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={comment.avatar} alt={comment.author} />
                                  <AvatarFallback className="bg-navy-600 text-white text-xs">
                                    {comment.author.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <Star className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-white">{comment.author}</span>
                                <IconComponent className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400">{comment.timestamp}</span>
                              </div>
                              <p className="text-gray-300 mb-3">{comment.content}</p>
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400 p-0">
                                  <Heart className="w-4 h-4 mr-1" />
                                  {comment.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 p-0">
                                  <Reply className="w-4 h-4 mr-1" />
                                  {comment.replies}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* New Comment */}
                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-navy-600 text-white text-xs">
                          You
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <Textarea
                          placeholder="Share your thoughts, feedback, or suggestions..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="bg-navy-800/50 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-400 min-h-20"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                              <Paperclip className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                              <Mic className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                              <Camera className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button className="bg-gradient-to-r from-navy-600 to-blue-600 hover:from-navy-700 hover:to-blue-700">
                            <Send className="w-4 h-4 mr-2" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="meetings" className="space-y-4">
                <Card className="bg-navy-800/30 border-gold-500/20 backdrop-blur-sm">
                  <CardContent className="text-center py-16">
                    <Video className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Meetings Scheduled</h3>
                    <p className="text-gray-400 mb-6">Schedule your first team meeting to collaborate in real-time.</p>
                    <Button className="bg-gradient-to-r from-navy-600 to-blue-600 hover:from-navy-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
