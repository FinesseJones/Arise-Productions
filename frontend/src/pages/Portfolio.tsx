import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  ExternalLink, 
  Calendar,
  Award,
  Users,
  Filter,
  X
} from 'lucide-react';

interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  client: string;
  year: string;
  duration: string;
  views: string;
  awards: string[];
  videoUrl: string;
  thumbnailUrl: string;
  tags: string[];
  results: {
    engagement: string;
    reach: string;
    conversion: string;
  };
}

const portfolioProjects: ProjectData[] = [
  {
    id: '1',
    title: 'Luxury Brand Campaign',
    category: 'Commercial',
    description: 'High-end commercial production for luxury fashion brand featuring cinematic storytelling and premium aesthetics.',
    client: 'Elite Fashion House',
    year: '2024',
    duration: '2:30',
    views: '2.5M',
    awards: ['Cannes Lions Bronze', 'D&AD Pencil'],
    videoUrl: 'https://example.com/video1.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&h=450&fit=crop',
    tags: ['4K', 'Drone', 'Color Grading', 'Fashion'],
    results: {
      engagement: '+340%',
      reach: '15M',
      conversion: '+125%'
    }
  },
  {
    id: '2',
    title: 'Tech Startup Documentary',
    category: 'Documentary',
    description: 'Behind-the-scenes documentary showcasing innovation and human stories in the tech industry.',
    client: 'InnovateTech',
    year: '2024',
    duration: '45:00',
    views: '1.8M',
    awards: ['Sundance Selection', 'Emmy Nomination'],
    videoUrl: 'https://example.com/video2.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551651809-3c41f7e3c141?w=800&h=450&fit=crop',
    tags: ['Documentary', 'Interview', 'B-Roll', 'Sound Design'],
    results: {
      engagement: '+280%',
      reach: '8M',
      conversion: '+200%'
    }
  },
  {
    id: '3',
    title: 'Social Media Series',
    category: 'Digital Content',
    description: 'Viral social media campaign with micro-content optimized for multiple platforms and audiences.',
    client: 'Brand Collective',
    year: '2024',
    duration: '0:30',
    views: '12M',
    awards: ['Social Media Awards Gold'],
    videoUrl: 'https://example.com/video3.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=450&fit=crop',
    tags: ['Vertical Video', 'Animation', 'Quick Edit', 'Multi-Platform'],
    results: {
      engagement: '+520%',
      reach: '25M',
      conversion: '+180%'
    }
  },
  {
    id: '4',
    title: 'Product Launch Film',
    category: 'Commercial',
    description: 'Sleek product showcase combining macro photography with dynamic motion graphics.',
    client: 'Premium Electronics',
    year: '2024',
    duration: '1:45',
    views: '5.2M',
    awards: ['Webby Awards Winner'],
    videoUrl: 'https://example.com/video4.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=450&fit=crop',
    tags: ['Macro', 'Motion Graphics', 'Product', 'VFX'],
    results: {
      engagement: '+290%',
      reach: '12M',
      conversion: '+310%'
    }
  },
  {
    id: '5',
    title: 'Environmental Awareness',
    category: 'Documentary',
    description: 'Powerful environmental documentary raising awareness about climate change through visual storytelling.',
    client: 'Green Future Foundation',
    year: '2023',
    duration: '28:00',
    views: '3.1M',
    awards: ['Environmental Film Festival Winner'],
    videoUrl: 'https://example.com/video5.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=450&fit=crop',
    tags: ['Nature', 'Drone', 'Time-lapse', 'Conservation'],
    results: {
      engagement: '+410%',
      reach: '18M',
      conversion: '+150%'
    }
  },
  {
    id: '6',
    title: 'Music Video',
    category: 'Creative',
    description: 'Artistic music video blending practical effects with digital artistry for emerging artist.',
    client: 'Independent Artist',
    year: '2024',
    duration: '3:45',
    views: '8.7M',
    awards: ['MTV VMA Nomination'],
    videoUrl: 'https://example.com/video6.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=450&fit=crop',
    tags: ['Music Video', 'VFX', 'Creative Direction', 'Performance'],
    results: {
      engagement: '+680%',
      reach: '30M',
      conversion: '+250%'
    }
  }
];

const categories = ['All', 'Commercial', 'Documentary', 'Digital Content', 'Creative'];

interface VideoPlayerProps {
  project: ProjectData;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ project, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative bg-slate-900 rounded-2xl overflow-hidden max-w-6xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Video Section */}
          <div className="relative aspect-video bg-black">
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>
            </div>
            {/* Hidden video element for demo */}
            <video
              ref={videoRef}
              className="hidden"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={project.videoUrl} type="video/mp4" />
            </video>
          </div>

          {/* Project Details */}
          <div className="p-8 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">
                  {project.category}
                </Badge>
                <span className="text-white/60 text-sm">{project.year}</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">{project.title}</h2>
              <p className="text-white/70 leading-relaxed">{project.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-white/60 text-sm mb-1">Client</div>
                <div className="text-white font-medium">{project.client}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm mb-1">Duration</div>
                <div className="text-white font-medium">{project.duration}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm mb-1">Views</div>
                <div className="text-white font-medium">{project.views}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm mb-1">Awards</div>
                <div className="text-white font-medium">{project.awards.length}</div>
              </div>
            </div>

            <div>
              <div className="text-white/60 text-sm mb-3">Results</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-gold-400 font-bold text-lg">{project.results.engagement}</div>
                  <div className="text-white/60 text-xs">Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-gold-400 font-bold text-lg">{project.results.reach}</div>
                  <div className="text-white/60 text-xs">Reach</div>
                </div>
                <div className="text-center">
                  <div className="text-gold-400 font-bold text-lg">{project.results.conversion}</div>
                  <div className="text-white/60 text-xs">Conversion</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-white/60 text-sm mb-3">Tags</div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-white/30 text-white/80">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold hover:from-gold-600 hover:to-gold-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Case Study
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface ProjectCardProps {
  project: ProjectData;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span className="font-medium">Watch Project</span>
                </div>
                <div className="text-sm opacity-80">{project.duration}</div>
              </div>
            </div>
          </div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-black/50 text-white border-white/30">
              {project.category}
            </Badge>
          </div>

          {/* Views */}
          <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
            {project.views} views
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-white/70 text-sm line-clamp-2">{project.description}</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-white/60">
                <Users className="w-4 h-4 mr-1" />
                {project.client}
              </div>
              <div className="flex items-center text-white/60">
                <Calendar className="w-4 h-4 mr-1" />
                {project.year}
              </div>
            </div>

            {project.awards.length > 0 && (
              <div className="flex items-center text-gold-400 text-sm">
                <Award className="w-4 h-4 mr-1" />
                {project.awards.length} Award{project.awards.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const filteredProjects = selectedCategory === 'All' 
    ? portfolioProjects 
    : portfolioProjects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen pt-16">
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-gold-200 to-gold-400 bg-clip-text text-transparent mb-6">
              Our Portfolio
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Explore our collection of award-winning projects that showcase our expertise 
              in creating compelling visual stories across all formats and platforms.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/20'
                }`}
              >
                <Filter className="w-4 h-4 mr-2 inline" />
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedProject && (
          <VideoPlayer
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}