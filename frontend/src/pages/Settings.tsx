import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 studio-gradient-text">
          Studio Settings
        </h1>
        <p className="text-muted-foreground mb-8">
          Configure your studio preferences and integrations.
        </p>

        <Card className="studio-glass">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Comprehensive settings and configuration options.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm">⚙️ General preferences</p>
              <p className="text-sm">🔌 Third-party integrations</p>
              <p className="text-sm">👤 User management</p>
              <p className="text-sm">🔐 Security settings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
