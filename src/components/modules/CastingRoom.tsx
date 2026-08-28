// ============================================
// CASTING ROOM MODULE
// Save as: frontend/src/components/modules/CastingRoom.tsx
// ============================================

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAPIBaseURL } from "@/lib/api";

// Types for casting data
interface CastingProfile {
  character_name: string;
  age_range: string;
  physical_description: string;
  personality_traits: string[];
  key_scenes: string[];
  suggested_actors: string[];
  casting_notes: string;
}

interface BudgetAnalysis {
  total_estimated_cost: string;
  breakdown: Record<string, string>;
  savings_opportunities: string[];
  risk_factors: string[];
}

interface ScheduleAnalysis {
  total_production_days: number;
  pre_production: string;
  principal_photography: string;
  post_production: string;
  key_milestones: string[];
  critical_path: string[];
}

type AnalysisResult = CastingProfile | BudgetAnalysis | ScheduleAnalysis | null;

export default function CastingRoom() {
  const [activeTab, setActiveTab] = useState<"casting" | "budget" | "schedule">("casting");
  const [characterName, setCharacterName] = useState("");
  const [projectType, setProjectType] = useState("feature");
  const [budgetRange, setBudgetRange] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult>(null);

  // Real AI-Powered Casting Analysis
  const handleAnalyze = async () => {
    setLoading(true);

    try {
      const apiBase = getAPIBaseURL();
      const response = await fetch(`${apiBase}/casting/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character_name: characterName || 'Lead Protagonist',
          project_type: projectType,
          budget_range: budgetRange,
          analysis_type: activeTab,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.data) {
          setResult(json.data);
          setLoading(false);
          return;
        }
      }
      const errJson = await response.json().catch(() => ({}));
      toast.error(`⚠️ Casting analysis failed: ${errJson.error || 'Failed to connect to AI engine'}`);
    } catch (err: any) {
      console.error('[CastingRoom] Backend analysis error:', err);
      toast.error(`⚠️ Casting analysis failed: ${err.message || 'API connection error'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderCastingResults = (data: CastingProfile) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Character</h4>
          <p className="text-lg">{data.character_name}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Age Range</h4>
          <p className="text-lg">{data.age_range}</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Physical Description</h4>
        <p>{data.physical_description}</p>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Personality Traits</h4>
        <div className="flex flex-wrap gap-2">
          {data.personality_traits.map((trait, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-studio-blue/10 text-studio-blue rounded-full text-sm"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Key Scenes</h4>
        <ul className="space-y-1">
          {data.key_scenes.map((scene, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-studio-purple">•</span>
              <span>{scene}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Suggested Actors</h4>
        <ul className="space-y-1">
          {data.suggested_actors.map((actor, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-studio-cyan">•</span>
              <span>{actor}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Casting Notes</h4>
        <p className="text-sm">{data.casting_notes}</p>
      </div>
    </div>
  );

  const renderBudgetResults = (data: BudgetAnalysis) => (
    <div className="space-y-4">
      <div className="bg-studio-blue/10 p-6 rounded-lg text-center">
        <h4 className="text-sm text-muted-foreground mb-2">Total Estimated Cost</h4>
        <p className="text-4xl font-bold text-studio-blue">{data.total_estimated_cost}</p>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Budget Breakdown</h4>
        <div className="space-y-2">
          {Object.entries(data.breakdown).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="capitalize">{key.replace('_', ' ')}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Savings Opportunities</h4>
        <ul className="space-y-2">
          {data.savings_opportunities.map((opportunity, i) => (
            <li key={i} className="flex items-start gap-2 p-2 bg-green-500/10 rounded">
              <span className="text-green-500">💰</span>
              <span className="text-sm">{opportunity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Risk Factors</h4>
        <ul className="space-y-2">
          {data.risk_factors.map((risk, i) => (
            <li key={i} className="flex items-start gap-2 p-2 bg-red-500/10 rounded">
              <span className="text-red-500">⚠️</span>
              <span className="text-sm">{risk}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderScheduleResults = (data: ScheduleAnalysis) => (
    <div className="space-y-4">
      <div className="bg-studio-purple/10 p-6 rounded-lg text-center">
        <h4 className="text-sm text-muted-foreground mb-2">Total Production Days</h4>
        <p className="text-4xl font-bold text-studio-purple">{data.total_production_days}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-muted/30 rounded-lg text-center">
          <h4 className="text-xs text-muted-foreground mb-2">Pre-Production</h4>
          <p className="text-lg font-semibold">{data.pre_production}</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg text-center">
          <h4 className="text-xs text-muted-foreground mb-2">Principal Photography</h4>
          <p className="text-lg font-semibold">{data.principal_photography}</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg text-center">
          <h4 className="text-xs text-muted-foreground mb-2">Post-Production</h4>
          <p className="text-lg font-semibold">{data.post_production}</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Key Milestones</h4>
        <ul className="space-y-2">
          {data.key_milestones.map((milestone, i) => (
            <li key={i} className="flex items-start gap-2 p-2 bg-studio-cyan/10 rounded">
              <span className="text-studio-cyan">📍</span>
              <span className="text-sm">{milestone}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Critical Path Items</h4>
        <ul className="space-y-2">
          {data.critical_path.map((item, i) => (
            <li key={i} className="flex items-start gap-2 p-2 bg-amber-500/10 rounded">
              <span className="text-amber-500">⚡</span>
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 studio-gradient-text">
          🎭 AI-Powered Casting & Production Suite
        </h1>
        <p className="text-muted-foreground">
          Generate casting profiles, analyze budgets, and create production schedules using AI.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Input Panel */}
        <Card className="studio-glass">
          <CardHeader>
            <h2 className="text-xl font-semibold">Project Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="character-name">Character/Project Name</Label>
              <Input
                id="character-name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Enter name..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="project-type">Project Type</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger id="project-type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature Film</SelectItem>
                  <SelectItem value="series">TV Series</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="short">Short Film</SelectItem>
                  <SelectItem value="documentary">Documentary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget-range">Budget Range</Label>
              <Select value={budgetRange} onValueChange={setBudgetRange}>
                <SelectTrigger id="budget-range" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Under $500K</SelectItem>
                  <SelectItem value="medium">$500K - $5M</SelectItem>
                  <SelectItem value="high">$5M - $50M</SelectItem>
                  <SelectItem value="blockbuster">$50M+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full mt-6"
              size="lg"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⚙️</span>
                  Analyzing...
                </>
              ) : (
                <>
                  Generate Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="lg:col-span-2 studio-glass">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="casting">🎭 Casting</TabsTrigger>
                <TabsTrigger value="budget">💰 Budget</TabsTrigger>
                <TabsTrigger value="schedule">📅 Schedule</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground">
                  Enter project details and click "Generate Analysis" to begin.
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                {activeTab === "casting" && renderCastingResults(result as CastingProfile)}
                {activeTab === "budget" && renderBudgetResults(result as BudgetAnalysis)}
                {activeTab === "schedule" && renderScheduleResults(result as ScheduleAnalysis)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
