import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Analytics() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 studio-gradient-text">
          Production Analytics
        </h1>
        <p className="text-muted-foreground mb-8">
          Data-driven insights for your production workflow.
        </p>

        <Card className="studio-glass">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Comprehensive analytics dashboard for production metrics.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm">📊 Performance metrics</p>
              <p className="text-sm">⏱️ Timeline analysis</p>
              <p className="text-sm">💰 Budget efficiency reports</p>
              <p className="text-sm">👥 Team productivity insights</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
