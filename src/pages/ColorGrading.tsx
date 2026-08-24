import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ColorGrading() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 studio-gradient-text">
          Color Grading Suite
        </h1>
        <p className="text-muted-foreground mb-8">
          Professional color correction and grading tools.
        </p>

        <Card className="studio-glass">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Industry-standard color grading with LUT support and advanced controls.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm">🎨 Professional color wheels</p>
              <p className="text-sm">📊 Waveform and vectorscope</p>
              <p className="text-sm">🎞️ LUT import/export</p>
              <p className="text-sm">💾 Preset management</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
