import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import AITeam from "@/components/AITeam";
import FeatureCards from "@/components/FeatureCards";
import ProjectsSection from "@/components/ProjectsSection";
import WelcomeModal from "@/components/WelcomeModal";
import Footer from "@/components/Footer";
import CreateProjectDialog from "@/components/CreateProjectDialog";

export default function AITeamStudio() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedFJStudio");
    if (!hasVisited) {
      setIsWelcomeModalOpen(true);
      localStorage.setItem("hasVisitedFJStudio", "true");
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Hero onCreateProject={() => setIsCreateDialogOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Meet Your AI Studio Team
          </h2>
          <p className="text-xl text-gray-400">
            8 specialized AI agents working 24/7 to bring your vision to life
          </p>
        </div>
        <AITeam />

        <FeatureCards />

        <ProjectsSection />
      </div>

      <Footer />

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <WelcomeModal
        open={isWelcomeModalOpen}
        onOpenChange={setIsWelcomeModalOpen}
      />
    </div>
  );
}
