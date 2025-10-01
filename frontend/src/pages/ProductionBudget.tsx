import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ProductionBudget() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 studio-gradient-text">
          Production Budget
        </h1>
        <p className="text-muted-foreground mb-8">
          Comprehensive budget planning and tracking for your productions.
        </p>

        <Card className="studio-glass">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This module will provide advanced budget management, cost tracking,
              and financial analytics for your production workflow.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm">📊 Budget breakdowns by department</p>
              <p className="text-sm">💰 Real-time expense tracking</p>
              <p className="text-sm">📈 Financial forecasting and reports</p>
              <p className="text-sm">🔔 Alert system for budget overruns</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
