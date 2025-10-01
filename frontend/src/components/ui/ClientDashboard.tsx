import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Download, 
  Upload, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  MessageSquare,
  FileText,
  Camera,
  Edit,
  Star,
  TrendingUp,
  Folder,
  Share
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  status: 'pre-production' | 'in-production' | 'post-production' | 'completed' | 'approved';
  progress: number;
  dueDate: string;
  type: string;
  thumbnail: string;
  description: string;
  team: string[];
  lastUpdate: string;
  budget: {
    total: number;
    spent: number;
  };
  deliverables: {
    name: string;
    status: 'pending' | 'in-progress' | 'completed' | 'approved';
    dueDate: string;
  }[];
  messages: number;
  files: number;
}

interface FileAsset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'document' | 'audio';
  size: string;
  uploadDate: string;
  status: 'processing' | 'ready' | 'approved' | 'rejected';
  thumbnail?: string;
  url: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Brand Campaign 2024',
    status: 'in-production',
    progress: 65,
    dueDate: '2024-02-15',
    type: 'Commercial',
    thumbnail: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&h=225&fit=crop',
    description: 'High-impact commercial for luxury fashion brand spring collection',
    team: ['Sarah Chen', 'Mike Rodriguez', 'Alex Thompson'],
    lastUpdate: '2 hours ago',
    budget: { total: 15000, spent: 9750 },
    deliverables: [
      { name: 'Main Commercial (60s)', status: 'in-progress', dueDate: '2024-02-10' },
      { name: 'Social Cuts (15s)', status: 'pending', dueDate: '2024-02-12' },
      { name: 'Behind the Scenes', status: 'completed', dueDate: '2024-02-05' },
    ],
    messages: 12,
    files: 48
  },
  {
    id: '2',
    title: 'Product Launch Video',
    status: 'post-production',
    progress: 85,
    dueDate: '2024-01-30',
    type: 'Product Demo',
    thumbnail: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=225&fit=crop',
    description: 'Sleek product showcase for tech startup\'s flagship device',
    team: ['David Kim', 'Lisa Park'],
    lastUpdate: '1 day ago',
    budget: { total: 8500, spent: 7225 },
    deliverables: [
      { name: 'Main Product Video', status: 'completed', dueDate: '2024-01-25' },
      { name: 'Feature Highlights', status: 'approved', dueDate: '2024-01-28' },
      { name: 'Installation Guide', status: 'in-progress', dueDate: '2024-01-30' },
    ],
    messages: 8,
    files: 32
  },
  {
    id: '3',
    title: 'Documentary Series',
    status: 'pre-production',
    progress: 25,
    dueDate: '2024-04-20',
    type: 'Documentary',
    thumbnail: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=225&fit=crop',
    description: 'Environmental documentary series exploring climate solutions',
    team: ['Emma Wilson', 'Carlos Martinez', 'Anna Johnson', 'Tom Davis'],
    lastUpdate: '3 days ago',
    budget: { total: 45000, spent: 11250 },
    deliverables: [
      { name: 'Episode 1 Script', status: 'completed', dueDate: '2024-02-01' },
      { name: 'Location Scouting', status: 'in-progress', dueDate: '2024-02-15' },
      { name: 'Casting Decisions', status: 'pending', dueDate: '2024-02-20' },
    ],
    messages: 24,
    files: 156
  }
];

const mockFiles: FileAsset[] = [
  {
    id: '1',
    name: 'raw_footage_scene_01.mp4',
    type: 'video',
    size: '2.4 GB',
    uploadDate: '2024-01-20',
    status: 'ready',
    thumbnail: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=200&h=112&fit=crop',
    url: '#'
  },
  {
    id: '2',
    name: 'brand_guidelines.pdf',
    type: 'document',
    size: '12 MB',
    uploadDate: '2024-01-19',
    status: 'approved',
    url: '#'
  },
  {
    id: '3',
    name: 'hero_image_final.jpg',
    type: 'image',
    size: '8 MB',
    uploadDate: '2024-01-18',
    status: 'processing',
    thumbnail: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=112&fit=crop',
    url: '#'
  },
  {
    id: '4',
    name: 'voiceover_track.wav',
    type: 'audio',
    size: '45 MB',
    uploadDate: '2024-01-17',
    status: 'ready',
    url: '#'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'approved':
    case 'ready':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'in-progress':
    case 'in-production':
    case 'post-production':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'processing':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'pending':
    case 'pre-production':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case 'rejected':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
    case 'approved':
    case 'ready':
      return <CheckCircle className="w-4 h-4" />;
    case 'in-progress':
    case 'in-production':
    case 'post-production':
    case 'processing':
      return <Clock className="w-4 h-4" />;
    case 'pending':
    case 'pre-production':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Play className="w-5 h-5" />;
    case 'image':
      return <Camera className="w-5 h-5" />;
    case 'audio':
      return <Edit className="w-5 h-5" />;
    case 'document':
      return <FileText className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-lg text-white group-hover:text-gold-400 transition-colors">
                {project.title}
              </CardTitle>
              <Badge className={getStatusColor(project.status)}>
                {getStatusIcon(project.status)}
                <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
              </Badge>
            </div>
            <p className="text-white/70 text-sm">{project.description}</p>
          </div>
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-16 h-16 rounded-lg object-cover ml-4"
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progress</span>
            <span className="text-white font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white/60 mb-1">Due Date</div>
            <div className="text-white flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(project.dueDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-white/60 mb-1">Budget</div>
            <div className="text-white">
              ${project.budget.spent.toLocaleString()} / ${project.budget.total.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center text-white/80">
            <Users className="w-4 h-4 mr-1" />
            {project.team.length}
          </div>
          <div className="flex items-center text-white/80">
            <MessageSquare className="w-4 h-4 mr-1" />
            {project.messages}
          </div>
          <div className="flex items-center text-white/80">
            <Folder className="w-4 h-4 mr-1" />
            {project.files}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-medium hover:from-gold-600 hover:to-gold-700">
            View Details
          </Button>
          <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FileCard: React.FC<{ file: FileAsset }> = ({ file }) => {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.name}
              className="w-12 h-12 rounded object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-white/60">
              {getFileIcon(file.type)}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-white font-medium text-sm truncate">{file.name}</h4>
              <Badge className={getStatusColor(file.status)} size="sm">
                {file.status}
              </Badge>
            </div>
            <div className="text-white/60 text-xs mb-2">
              {file.size} • {new Date(file.uploadDate).toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-6 px-2 text-xs border-white/30 text-white hover:bg-white/10">
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
              <Button size="sm" variant="outline" className="h-6 px-2 text-xs border-white/30 text-white hover:bg-white/10">
                <Share className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="min-h-screen pt-16">
      
      {/* Header */}
      <section className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Welcome back, Alex
              </h1>
              <p className="text-white/70 text-lg">
                Track your projects, review deliverables, and collaborate with our team.
              </p>
            </div>
            <Button className="bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold hover:from-gold-600 hover:to-gold-700">
              <Upload className="w-5 h-5 mr-2" />
              Upload Files
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gold-400 mb-1">3</div>
                <div className="text-white/70 text-sm">Active Projects</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">8</div>
                <div className="text-white/70 text-sm">Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">44</div>
                <div className="text-white/70 text-sm">Unread Messages</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-1">236</div>
                <div className="text-white/70 text-sm">Total Files</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="projects" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400">
                  <Folder className="w-4 h-4 mr-2" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="files" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400">
                  <FileText className="w-4 h-4 mr-2" />
                  Files
                </TabsTrigger>
                <TabsTrigger value="messages" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {mockProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="files" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Project Files</h3>
                  <Button className="bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold hover:from-gold-600 hover:to-gold-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockFiles.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <FileCard file={file} />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="messages" className="space-y-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-white/60">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Messages feature coming soon!</p>
                      <p className="text-sm mt-2">Direct communication with your production team.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Project Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-white/60">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Analytics dashboard coming soon!</p>
                      <p className="text-sm mt-2">Track project performance and engagement metrics.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </div>
  );
}