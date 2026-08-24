import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Sparkles } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WelcomeModal({ open, onOpenChange }: WelcomeModalProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-slate-900 via-navy-900 to-purple-900 border-gold-500/30 backdrop-blur-xl">
        <DialogHeader>
          <div className="text-center mb-6">
            <div className="relative mx-auto mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-gold-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl animate-pulse">
                <div className="text-4xl font-bold text-white z-10">FJ</div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4 text-navy-900" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-gold-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Welcome to Finesse Jones Studio
            </DialogTitle>
            <DialogDescription className="text-lg text-gray-300 mt-4">
              Your AI-powered digital film studio where creativity meets cutting-edge technology. No limits. No restrictions. Pure creative freedom.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-navy-800/50 via-purple-800/30 to-gold-800/20 p-4 rounded-lg border border-gold-500/20">
              <Brain className="w-8 h-8 text-gold-400 mb-2" />
              <h3 className="font-semibold text-white mb-1">AI-Powered Workflow</h3>
              <p className="text-sm text-gray-400">
                Automated production pipeline with intelligent agents
              </p>
            </div>
            <div className="bg-gradient-to-br from-navy-800/50 via-purple-800/30 to-gold-800/20 p-4 rounded-lg border border-gold-500/20">
              <Zap className="w-8 h-8 text-gold-400 mb-2" />
              <h3 className="font-semibold text-white mb-1">Zero Restrictions</h3>
              <p className="text-sm text-gray-400">
                Complete creative freedom with no content limitations
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                navigate("/studio-tour");
                onOpenChange(false);
              }}
              className="flex-1 bg-gradient-to-r from-gold-600 via-purple-600 to-blue-600 hover:from-gold-700 hover:via-purple-700 hover:to-blue-700"
            >
              Take Studio Tour
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-gold-500/30 hover:bg-gold-500/10"
            >
              Get Started
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
