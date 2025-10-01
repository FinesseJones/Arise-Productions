import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Marketing() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 studio-gradient-text">
          Marketing & Distribution
        </h1>
        <p className="text-muted-foreground mb-8">
          Plan and execute your content marketing strategies.
        </p>

        <Card className="studio-glass">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Comprehensive marketing tools for content promotion and distribution.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm">📱 Social media campaign management</p>
              <p className="text-sm">📊 Analytics and audience insights</p>
              <p className="text-sm">🎯 Targeted distribution strategies</p>
              <p className="text-sm">📧 Email marketing automation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
