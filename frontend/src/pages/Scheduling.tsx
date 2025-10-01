import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Scheduling() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 studio-gradient-text">
          Production Scheduling
        </h1>
        <p className="text-muted-foreground mb-8">
          Intelligent scheduling and resource management.
        </p>

        <Card className="studio-glass">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              AI-powered production scheduling with resource optimization.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm">📅 Smart calendar management</p>
              <p className="text-sm">👥 Crew availability tracking</p>
              <p className="text-sm">📍 Location scheduling</p>
              <p className="text-sm">🤖 AI-optimized timelines</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
