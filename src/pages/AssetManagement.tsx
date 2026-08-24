import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function AssetManagement() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 studio-gradient-text">
          Asset Management
        </h1>
        <p className="text-muted-foreground mb-8">
          Centralized digital asset management system.
        </p>

        <Card className="studio-glass">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Comprehensive DAM system for all your production assets.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm">📁 Organized asset library</p>
              <p className="text-sm">🔍 Advanced search and tagging</p>
              <p className="text-sm">🔄 Version control</p>
              <p className="text-sm">☁️ Cloud synchronization</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
