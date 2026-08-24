import { Trash2, Film } from "lucide-react";
import type { Project } from "~backend/project/create";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectCardProps {
  project: Project;
  onDelete: () => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 hover:border-purple-500/50 transition-all hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-gold-500 to-purple-600 shadow-lg">
            <Film className="h-6 w-6 text-white" />
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">
                  Delete Project
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Are you sure you want to delete "{project.name}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-800 border-slate-700 text-foreground hover:bg-slate-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2">
          {project.name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Type:</span>
            <span className="text-sm text-foreground font-medium">
              {project.type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {project.status}
            </span>
          </div>
          {project.budget && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Budget:</span>
              <span className="text-sm text-foreground font-medium">
                ${project.budget.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {project.description}
          </p>
        )}

        {project.targetPlatforms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.targetPlatforms.map((platform) => (
              <span
                key={platform}
                className="text-xs px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20"
              >
                {platform}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
