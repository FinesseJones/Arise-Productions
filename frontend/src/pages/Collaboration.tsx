import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Collaboration() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 studio-gradient-text">
          Collaboration Hub
        </h1>
        <p className="text-muted-foreground mb-8">
          Real-time collaboration and team communication.
        </p>

        <Card className="studio-glass">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Seamless team collaboration with real-time updates and feedback.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm">💬 Team chat and messaging</p>
              <p className="text-sm">🎥 Video conferencing</p>
              <p className="text-sm">📝 Shared notes and annotations</p>
              <p className="text-sm">✅ Task assignment and tracking</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
