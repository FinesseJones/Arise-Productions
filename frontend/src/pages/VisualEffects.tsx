import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function VisualEffects() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 studio-gradient-text">
          Visual Effects Suite
        </h1>
        <p className="text-muted-foreground mb-8">
          Advanced VFX compositing and effects creation.
        </p>

        <Card className="studio-glass">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Professional visual effects tools for compositing and CGI integration.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm">🎨 Compositing and layering</p>
              <p className="text-sm">✨ Particle systems and simulations</p>
              <p className="text-sm">🌈 Color grading and correction</p>
              <p className="text-sm">🎭 Green screen keying</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
