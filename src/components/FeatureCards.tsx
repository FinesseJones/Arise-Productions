import { Zap, Layers, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function FeatureCards() {
  const features = [
    {
      icon: Zap,
      title: "Intelligent Automation",
      description: "AI agents automatically generate forms, schedules, and documentation as your project progresses through each phase.",
      gradient: "from-blue-500 via-purple-500 to-gold-500",
    },
    {
      icon: Layers,
      title: "Cross-Functional Workflow",
      description: "Full film studio replica with next-gen tech. AI and human collaboration for Netflix, YouTube, and all platforms.",
      gradient: "from-purple-500 via-gold-500 to-blue-500",
    },
    {
      icon: Star,
      title: "Complete Production Suite",
      description: "Full editing capabilities, AI actors, real talent collaboration, and zero creative restrictions.",
      gradient: "from-gold-500 via-purple-500 to-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <Card
            key={feature.title}
            className="bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 transform hover:scale-105"
          >
            <CardHeader>
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4 shadow-lg animate-pulse`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">{feature.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
