import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import backend from "~backend/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Plus, Eye, Layers, Users, Settings } from "lucide-react";
import CreateProjectDialog from "./CreateProjectDialog";

export default function ProjectsSection() {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => backend.project.list(),
  });

  const hasProjects = projectsData && projectsData.projects.length > 0;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Your Projects
          </h2>
          <p className="text-gray-400">
            Manage your film projects and track production progress
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/asset-library")}
            className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700"
          >
            <Layers className="w-4 h-4 mr-2" />
            Asset Library
          </Button>
          <Button
            onClick={() => navigate("/collaboration")}
            className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700"
          >
            <Users className="w-4 h-4 mr-2" />
            Collaboration
          </Button>
          <Button
            onClick={() => navigate("/admin")}
            className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </div>
      </div>

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
          <h3 className="text-2xl font-semibold text-white mb-3">
            Ready to Create Your First Masterpiece?
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Start your filmmaking journey with AI-powered workflows, unlimited creative freedom, and professional-grade tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
            <Button
              onClick={() => navigate("/studio-tour")}
              className="bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              Take Studio Tour
            </Button>
          </div>
        </CardContent>
      </Card>

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
