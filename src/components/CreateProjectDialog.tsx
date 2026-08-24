import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import backend from "~backend/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const projectTypes = [
  "Film",
  "Documentary",
  "Music Video",
  "Commercial",
  "YouTube Series",
  "Short Film",
];

const platforms = ["Netflix", "YouTube", "Vimeo", "Instagram", "TikTok"];

export default function CreateProjectDialog({
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    budget: "",
    targetPlatforms: [] as string[],
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return backend.project.create({
        name: formData.name,
        type: formData.type,
        description: formData.description || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        targetPlatforms: formData.targetPlatforms,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Project created",
        description: "Your project has been successfully created.",
      });
      onOpenChange(false);
      setFormData({
        name: "",
        type: "",
        description: "",
        budget: "",
        targetPlatforms: [],
      });
      navigate("/projects");
    },
    onError: (error) => {
      console.error("Failed to create project:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      targetPlatforms: prev.targetPlatforms.includes(platform)
        ? prev.targetPlatforms.filter((p) => p !== platform)
        : [...prev.targetPlatforms, platform],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type) {
      toast({
        title: "Required fields",
        description: "Please fill in project name and type.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-gold-400 to-purple-400 bg-clip-text text-transparent">
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Start your next film production with AI-powered assistance
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-foreground">
                Project Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter project name"
                className="bg-slate-800 border-slate-700 text-foreground"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type" className="text-foreground">
                Project Type *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-foreground">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your project..."
                className="bg-slate-800 border-slate-700 text-foreground min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget" className="text-foreground">
                Budget ($)
              </Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                placeholder="Enter budget"
                className="bg-slate-800 border-slate-700 text-foreground"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-foreground">Target Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <Button
                    key={platform}
                    type="button"
                    variant={
                      formData.targetPlatforms.includes(platform)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => togglePlatform(platform)}
                    className={
                      formData.targetPlatforms.includes(platform)
                        ? "bg-gradient-to-r from-gold-500 to-purple-600"
                        : "border-slate-700"
                    }
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-gradient-to-r from-gold-500 to-purple-600 hover:from-gold-600 hover:to-purple-700 text-white"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
