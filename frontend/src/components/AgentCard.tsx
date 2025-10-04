import {
  FileText,
  Settings,
  Users,
  Calendar,
  Camera,
  Palette,
  Share,
  Scissors,
} from "lucide-react";
import type { AIAgent } from "~backend/agent/list";

const iconMap = {
  FileText,
  Settings,
  Users,
  Calendar,
  Camera,
  Palette,
  Share,
  Scissors,
};

interface AgentCardProps {
  agent: AIAgent;
  onClick?: () => void;
}

export default function AgentCard({ agent, onClick }: AgentCardProps) {
  const Icon = iconMap[agent.icon as keyof typeof iconMap];

  return (
    <div
      onClick={onClick}
      className={`group bg-gradient-to-br from-navy-800/30 via-purple-800/20 to-gold-800/10 border border-gold-500/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-navy-800/50 hover:via-purple-800/30 hover:to-gold-800/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-xl py-6 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex flex-col items-center text-center gap-4 px-6">
        <div className={`w-16 h-16 bg-gradient-to-r ${agent.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg animate-pulse`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <div className="font-semibold text-white group-hover:text-gold-400 transition-colors text-lg text-center">
            {agent.name}
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
