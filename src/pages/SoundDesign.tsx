import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function SoundDesign() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 studio-gradient-text">
          Sound Design Studio
        </h1>
        <p className="text-muted-foreground mb-8">
          Professional audio editing, mixing, and sound design tools.
        </p>

        <Card className="studio-glass">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Full-featured sound design and audio post-production workspace.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm">🎵 Multi-track audio editing</p>
              <p className="text-sm">🎚️ Professional mixing console</p>
              <p className="text-sm">🔊 Sound effects library</p>
              <p className="text-sm">🎼 Music composition tools</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
