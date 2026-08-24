import { Sparkles, Zap, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import backend from "~backend/client";

interface HeroProps {
  onCreateProject: () => void;
}

export default function Hero({ onCreateProject }: HeroProps) {
  const navigate = useNavigate();

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => backend.project.list(),
  });

  const stats = [
    {
      label: "Active Projects",
      value: projectsData?.projects.length || 0,
      icon: Zap,
    },
    {
      label: "AI Agents",
      value: 8,
      icon: Users,
    },
    {
      label: "Creative Freedom",
      value: "∞",
      icon: Sparkles,
    },
    {
      label: "AI Assistance",
      value: "24/7",
      icon: Clock,
    },
  ];

  return (
    <div className="relative overflow-hidden py-20 px-8">
      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-purple-500/10 to-blue-500/10 animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 via-purple-500 to-blue-500 mb-6 shadow-2xl shadow-purple-500/50 relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-400 via-purple-500 to-blue-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative text-4xl font-black text-white flex items-center gap-1">
              FJ
              <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-gold-300 animate-pulse" />
            </div>
          </div>

          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-gold-300 via-purple-300 to-blue-300 bg-clip-text text-transparent animate-gradient">
            Finesse Jones
          </h1>
          <p className="text-3xl font-bold text-foreground mb-4">
            Digital Film Studio
          </p>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Where vision meets technology. Creator-led, AI-powered filmmaking
            that brings your stories to life with precision and artistry.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={onCreateProject}
              className="bg-gradient-to-r from-gold-500 to-purple-600 hover:from-gold-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/50 transform hover:scale-105 transition-all"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Create New Project
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/ai-studio")}
              className="border-purple-500/50 hover:bg-purple-500/10 transform hover:scale-105 transition-all"
            >
              AI Studio
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 hover:border-purple-500/50 transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <stat.icon className="h-8 w-8 mb-3 text-purple-400 group-hover:text-gold-400 transition-colors" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-purple-400 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
