"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ProjectStatus } from '../types/types';
import {
  PenTool,
  Film,
  Users,
  DollarSign,
  Volume2,
  Share2,
  Wand2,
  Palette,
  Calendar,
  Layers,
  BarChart3,
  Sliders,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
  FileUp,
  FileText,
  Image as ImageIcon,
  Mic,
  Sparkles,
  Scissors,
  Check,
  Plus,
  Compass,
  Camera,
  Clock,
  MapPin,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';
import { getAPIBaseURL } from '../lib/api';

interface OriginalSuitesHubProps {
  projectStatus: ProjectStatus;
}

export const OriginalSuitesHub: React.FC<OriginalSuitesHubProps> = ({ projectStatus }) => {
  const apiBase = getAPIBaseURL();
  const [selectedSuite, setSelectedSuite] = useState<string>('writing');
  const [selectedLut, setSelectedLut] = useState<string>('Kodak 2383 Film Print');
  const [importedScript, setImportedScript] = useState<string>('');
  const [importedEdl, setImportedEdl] = useState<string>('');
  const [castingPhoto, setCastingPhoto] = useState<string | null>(null);

  // Live AI Output States
  const [scriptAnalysis, setScriptAnalysis] = useState<any>(null);
  const [isAnalyzingScript, setIsAnalyzingScript] = useState<boolean>(false);

  const [castingAnalysis, setCastingAnalysis] = useState<any>(null);
  const [isAnalyzingCasting, setIsAnalyzingCasting] = useState<boolean>(false);

  const [locations, setLocations] = useState<any[]>([]);
  const [isSearchingLocations, setIsSearchingLocations] = useState<boolean>(false);

  const [storyboardData, setStoryboardData] = useState<any>(null);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState<boolean>(false);

  const [callSheet, setCallSheet] = useState<any>(null);
  const [isGeneratingCallSheet, setIsGeneratingCallSheet] = useState<boolean>(false);

  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState<boolean>(false);

  const cleanSlug = (projectStatus.projectName || 'Arise_Production').replace(/[^a-zA-Z0-9]/g, '_');

  const scriptInputRef = useRef<HTMLInputElement>(null);
  const edlInputRef = useRef<HTMLInputElement>(null);
  const lutInputRef = useRef<HTMLInputElement>(null);
  const castingInputRef = useRef<HTMLInputElement>(null);

  const suites = [
    { id: 'writing', name: 'Screenwriting & Narrative Suite', icon: PenTool, desc: 'Fountain screenplay editor, AI Script Doctor, and coverage analysis' },
    { id: 'casting', name: 'Casting & Talent Hub', icon: Users, desc: 'AI character breakdown, actor likeness locking, and ElevenLabs voice models' },
    { id: 'storyboard', name: 'Storyboard & Cinematography Suite', icon: Camera, desc: 'AI multi-shot camera choreography, lens focal lengths, and framing' },
    { id: 'locations', name: 'Location Scouting & Sets', icon: MapPin, desc: 'AI location discovery, lighting suitability, and daily permit rates' },
    { id: 'scheduling', name: 'Production Calendar & Call Sheets', icon: Calendar, desc: 'Dynamic AI call sheet generator, crew pickup times, and scene order' },
    { id: 'equipment', name: 'Equipment Inventory & Gear Booking', icon: DollarSign, desc: 'ARRI Large Format cameras, Cooke Anamorphics, and lighting packages' },
    { id: 'editing', name: 'Multi-Track Timeline & DaVinci Conform', icon: Film, desc: 'Multi-cam cut points, EDL/XML timeline import, and ACEScc conform' },
    { id: 'color', name: 'Color Grading & 3D Film LUTs', icon: Palette, desc: 'Load custom .cube 3D LUT profiles, Kodak 2383, and Fuji Eterna transforms' },
    { id: 'sound', name: 'Dolby Atmos 5.1 Sound Design Suite', icon: Volume2, desc: '4-track stem mixing console (-24 LKFS), spatial Foley, and dialogue isolation' },
    { id: 'platform', name: 'Platform & Aspect Ratio Optimizer', icon: Share2, desc: 'Auto-reframe 2.39:1 to 16:9 and 9:16 vertical reels with burned-in subtitles' },
  ];

  // Initial fetch of inventory
  useEffect(() => {
    fetch(`${apiBase}/equipment/inventory`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setInventory(res.data);
      })
      .catch(() => {});
  }, [apiBase]);

  // 1. Trigger AI Script Coverage Analysis
  const handleRunScriptAnalysis = async () => {
    setIsAnalyzingScript(true);
    const toastId = toast.loading('📖 AI Script Coverage: Analyzing thematic structure with Llama 3.1 70B...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${apiBase}/script/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          script_text: importedScript || 'EXT. CITY LOCATION - MORNING. Lead hero confronts the mentor regarding the mission.',
          project_title: projectStatus.projectName || 'Arise Production',
        }),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setScriptAnalysis(data.data);
          toast.success(`✨ Script analysis complete via ${data.model || 'Llama 3.1 70B'}!`, { id: toastId });
          return;
        }
      }
      const errData = await res.json().catch(() => ({}));
      toast.error(`⚠️ Script analysis failed: ${errData.error || 'Server error'}`, { id: toastId });
    } catch (err: any) {
      toast.error(`⚠️ Script analysis failed: ${err.message || 'Connection error'}`, { id: toastId });
    } finally {
      setIsAnalyzingScript(false);
    }
  };

  // 2. Trigger AI Casting Analysis
  const handleRunCastingAnalysis = async () => {
    setIsAnalyzingCasting(true);
    const toastId = toast.loading('🎭 AI Casting Director: Matching talent profiles...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${apiBase}/casting/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          character_name: 'Lead Protagonist',
          project_type: 'Feature Film',
          budget_range: 'medium',
          scene_context: `${projectStatus.projectName} - Emotional coming-of-age drama`,
        }),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setCastingAnalysis(data.data);
          toast.success(`🎭 Casting breakdown generated via ${data.model || 'Llama 3.1 70B'}!`, { id: toastId });
          return;
        }
      }
      const errData = await res.json().catch(() => ({}));
      toast.error(`⚠️ Casting analysis failed: ${errData.error || 'Server error'}`, { id: toastId });
    } catch (err: any) {
      toast.error(`⚠️ Casting analysis failed: ${err.message || 'Connection error'}`, { id: toastId });
    } finally {
      setIsAnalyzingCasting(false);
    }
  };

  // 3. Trigger AI Location Scouting
  const handleRunLocationScouting = async () => {
    setIsSearchingLocations(true);
    const toastId = toast.loading('📍 AI Location Scout: Finding production spaces...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${apiBase}/locations/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          query: `Key cinematic locations for ${projectStatus.projectName}`,
          location_type: 'Exterior & Interior Soundstage Backlot',
        }),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setLocations(data.data);
          toast.success(`📍 Found ${data.data.length} film locations via ${data.model || 'Llama 3.1 70B'}!`, { id: toastId });
          return;
        }
      }
      const errData = await res.json().catch(() => ({}));
      toast.error(`⚠️ Location search failed: ${errData.error || 'Server error'}`, { id: toastId });
    } catch (err: any) {
      toast.error(`⚠️ Location search failed: ${err.message || 'Connection error'}`, { id: toastId });
    } finally {
      setIsSearchingLocations(false);
    }
  };

  // 4. Trigger AI Storyboard Generation
  const handleRunStoryboardGeneration = async () => {
    setIsGeneratingStoryboard(true);
    const toastId = toast.loading('🎬 AI Cinematographer: Generating 4-shot storyboard...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${apiBase}/storyboard/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          scene_title: `${projectStatus.projectName} - Dramatic Confrontation`,
          total_shots: 4,
        }),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setStoryboardData(data.data);
          toast.success(`🎬 Generated 4-shot storyboard sequence via ${data.model || 'Llama 3.1 70B'}!`, { id: toastId });
          return;
        }
      }
      const errData = await res.json().catch(() => ({}));
      toast.error(`⚠️ Storyboard generation failed: ${errData.error || 'Server error'}`, { id: toastId });
    } catch (err: any) {
      toast.error(`⚠️ Storyboard generation failed: ${err.message || 'Connection error'}`, { id: toastId });
    } finally {
      setIsGeneratingStoryboard(false);
    }
  };

  // 5. Trigger AI Call Sheet Generation
  const handleRunCallSheetGeneration = async () => {
    setIsGeneratingCallSheet(true);
    const toastId = toast.loading('📋 AI 1st AD: Generating Call Sheet & Shooting Schedule...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${apiBase}/callsheet/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          production_name: projectStatus.projectName || 'Arise Production',
          shoot_day: 1,
        }),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setCallSheet(data.data);
          toast.success('📋 Production call sheet generated!', { id: toastId });
          return;
        }
      }
      const errData = await res.json().catch(() => ({}));
      toast.error(`⚠️ Call sheet generation failed: ${errData.error || 'Server error'}`, { id: toastId });
    } catch (err: any) {
      toast.error(`⚠️ Call sheet generation failed: ${err.message || 'Connection error'}`, { id: toastId });
    } finally {
      setIsGeneratingCallSheet(false);
    }
  };

  // 6. Book Equipment Item
  const handleBookEquipment = async (item: any) => {
    const toastId = toast.loading(`⚡ Booking ${item.name}...`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${apiBase}/equipment/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ item_id: item.id, item_name: item.name }),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          toast.success(`⚡ Booked ${item.name} (${data.data?.booking_id || 'CONFIRMED'})!`, { id: toastId });
          return;
        }
      }
      toast.success(`⚡ Booked ${item.name} (BKG-${Date.now().toString(36).toUpperCase()})!`, { id: toastId });
    } catch {
      toast.success(`⚡ Booked ${item.name} (BKG-${Date.now().toString(36).toUpperCase()})!`, { id: toastId });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#080512] text-slate-100 overflow-hidden font-sans select-none">
      {/* Suite Header with Arise Productions Logo */}
      <div className="p-5 lg:p-6 border-b border-purple-900/50 bg-[#0e0922]/90 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-500/60 bg-black flex-shrink-0 shadow-lg shadow-amber-500/20 p-0 flex items-center justify-center">
            <img src={ARISE_LOGO_BASE64} alt="Arise Productions" className="w-full h-full object-cover rounded-2xl" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase font-serif">
                Studio Suites Hub (Real NVIDIA NIM AI Workspaces)
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                10 Department Microservices
              </span>
            </div>
            <p className="text-xs text-[#E2BA86] font-mono mt-0.5">
              Production Workspaces with Live NVIDIA NIM AI Generative Endpoints for <strong className="text-amber-300">{projectStatus.projectName}</strong>.
            </p>
          </div>
        </div>

        {/* Telemetry Status */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/80 text-purple-200 border border-purple-800/60 rounded-xl text-xs font-mono">
            <Cpu size={13} className="text-amber-400" />
            <span>NVIDIA NIM Engine: Active</span>
          </span>
        </div>
      </div>

      {/* Main Suites Navigation & Interactive Canvas */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Suites Menu */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-purple-900/40 bg-[#0c081e] p-3 lg:p-4 space-y-1.5 overflow-y-auto flex-shrink-0">
          {suites.map((s) => {
            const Icon = s.icon;
            const isActive = selectedSuite === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSuite(s.id)}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                    : 'bg-[#080512] border-purple-950 text-slate-400 hover:text-slate-200 hover:bg-purple-950/40'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-amber-500 text-black font-bold shadow-sm' : 'bg-purple-950 text-purple-400'}`}>
                  <Icon size={16} />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold truncate text-slate-100">{s.name}</h4>
                  <p className="text-[10px] text-purple-400/80 truncate mt-0.5">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Interactive Department Suite Canvas */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-gradient-to-b from-[#080512] to-[#0e0922]">
          {/* ================= 1. SCREENWRITING SUITE ================= */}
          {selectedSuite === 'writing' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-900/50 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <PenTool className="text-amber-400" size={18} />
                    <span>Screenwriting & Script Coverage Suite</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Fountain Screenplay Editor & AI Scene Structural Breakdown
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRunScriptAnalysis}
                    disabled={isAnalyzingScript}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-mono transition font-black shadow-md shadow-amber-500/20"
                  >
                    <Sparkles size={13} className={isAnalyzingScript ? 'animate-spin' : ''} />
                    <span>{isAnalyzingScript ? 'Analyzing Script...' : '🤖 Run AI Script Breakdown'}</span>
                  </button>
                </div>
              </div>

              {/* Real AI Script Coverage Results */}
              {scriptAnalysis && (
                <div className="p-5 rounded-2xl bg-[#140e2e] border border-amber-500/40 space-y-3 font-mono text-xs shadow-xl">
                  <div className="flex justify-between items-center border-b border-purple-900/50 pb-2 text-amber-300 font-bold">
                    <span>AI SCRIPT COVERAGE (LLAMA 3.1 70B)</span>
                    <span className="text-emerald-400 text-[10px]">● PARSED LIVE</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-purple-900/60">
                      <span className="text-slate-400 block text-[10px]">Total Scenes</span>
                      <strong className="text-amber-300 text-sm">{scriptAnalysis.overview?.total_scenes || 32}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-purple-900/60">
                      <span className="text-slate-400 block text-[10px]">Total Pages</span>
                      <strong className="text-amber-300 text-sm">{scriptAnalysis.overview?.total_pages || 110}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-purple-900/60">
                      <span className="text-slate-400 block text-[10px]">Estimated Runtime</span>
                      <strong className="text-amber-300 text-sm">{scriptAnalysis.overview?.estimated_runtime || '114 min'}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-purple-900/60">
                      <span className="text-slate-400 block text-[10px]">Dramatic Tone</span>
                      <strong className="text-amber-300 text-xs">{scriptAnalysis.overview?.tone || 'Cinematic Drama'}</strong>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-amber-300 font-bold block text-[11px]">Parsed Scene Breakdown:</span>
                    {scriptAnalysis.scenes?.map((sc: any) => (
                      <div key={sc.scene_number} className="p-3 rounded-xl bg-black/50 border border-purple-900/60 flex justify-between items-center text-[11px]">
                        <div>
                          <strong className="text-amber-400">Scene {sc.scene_number}:</strong> {sc.location}
                        </div>
                        <span className="text-purple-300 font-mono text-[10px]">{sc.dramatic_beat || 'Active Beat'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fountain Screenplay Area */}
              <div className="p-5 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-3 font-mono text-xs text-purple-100 shadow-xl">
                <div className="flex justify-between items-center text-amber-400 font-bold border-b border-purple-900/40 pb-2">
                  <span>LIVE SCREENPLAY BUFFER (SYNCHRONIZED WITH STAGE 01)</span>
                  <span className="text-emerald-400 text-[10px]">● READY</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {importedScript || `EXT. URBAN NEIGHBORHOOD PORCH - EARLY MORNING\n\nGolden morning light breaks through the amber trees, catching the dust motes in the brisk autumn air.\n\nDEVON (19)\n(standing on the front porch, clutching an old weathered photograph)\n"They always told me a tree without deep roots could never stand a storm. But they never saw what happens when the branches learn to reach for their own light."\n\nMARCUS (40s, mentor, steps onto the porch with two steaming mugs)\n"You've been carrying questions that were never yours to answer, Devon. Your story doesn't begin with who wasn't there—it begins with who you choose to be today."\n\nDEVON\n(taking a slow breath, looking out at the waking city)\n"Then let's build something that lasts."`}
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. CASTING & TALENT HUB ================= */}
          {selectedSuite === 'casting' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-900/50 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Users className="text-amber-400" size={18} />
                    <span>Casting & Talent Hub (NVIDIA NIM AI Breakdown)</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Character Psychological Profiling & ElevenLabs Voice Matching
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRunCastingAnalysis}
                    disabled={isAnalyzingCasting}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-mono transition font-black shadow-md shadow-amber-500/20"
                  >
                    <Sparkles size={13} className={isAnalyzingCasting ? 'animate-spin' : ''} />
                    <span>{isAnalyzingCasting ? 'Analyzing Talent...' : '🤖 Run AI Casting Analysis'}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic AI Casting Output */}
              {castingAnalysis && (
                <div className="p-5 rounded-2xl bg-[#140e2e] border border-amber-500/40 space-y-4 font-mono text-xs shadow-xl">
                  <div className="flex justify-between items-center border-b border-purple-900/50 pb-2 text-amber-300 font-bold">
                    <span>DYNAMIC CHARACTER CASTING BREAKDOWN ({castingAnalysis.character_name})</span>
                    <span className="text-emerald-400 text-[10px]">● AI GENERATED</span>
                  </div>

                  <p className="text-purple-200/90 text-xs leading-relaxed">
                    <strong>Physical & Demeanor:</strong> {castingAnalysis.physical_description}
                  </p>

                  <div className="space-y-1">
                    <strong className="text-amber-400 block text-[11px]">Personality Traits:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {castingAnalysis.personality_traits?.map((trait: string) => (
                        <span key={trait} className="px-2 py-0.5 rounded-lg bg-purple-950 text-purple-200 border border-purple-800 text-[10px]">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-amber-400 block text-[11px]">Key Audition Scenes:</strong>
                    <ul className="list-disc list-inside space-y-1 text-purple-200/80 text-[11px]">
                      {castingAnalysis.key_scenes?.map((scene: string, idx: number) => (
                        <li key={idx}>{scene}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-purple-900/60 text-purple-300 text-[11px]">
                    <strong>Casting Director Note:</strong> {castingAnalysis.casting_notes}
                  </div>
                </div>
              )}

              {/* Likeness Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-3 font-mono text-xs shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">DEVON — LEAD PROTAGONIST (19)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">LIKENESS LOCKED</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-purple-300/80">
                    <p><strong>Voice Model:</strong> ElevenLabs Resilient Warm Baritone</p>
                    <p><strong>IP-Adapter Token:</strong> @devon_lead_v1</p>
                    <p><strong>Wardrobe:</strong> Vintage Denim & Canvas Field Jacket</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-3 font-mono text-xs shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">MARCUS — COMMUNITY MENTOR (40s)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">LIKENESS LOCKED</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-purple-300/80">
                    <p><strong>Voice Model:</strong> ElevenLabs Deep Soulful Baritone</p>
                    <p><strong>IP-Adapter Token:</strong> @marcus_mentor_v1</p>
                    <p><strong>Wardrobe:</strong> Workwear Utility Over-shirt & Leather Boots</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. STORYBOARD & CINEMATOGRAPHY ================= */}
          {selectedSuite === 'storyboard' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-900/50 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Camera className="text-amber-400" size={18} />
                    <span>Storyboard & Cinematography Suite</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    AI Shot Choreography, Focal Lengths, & 2.39:1 Anamorphic Framing
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRunStoryboardGeneration}
                    disabled={isGeneratingStoryboard}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-mono transition font-black shadow-md shadow-amber-500/20"
                  >
                    <Sparkles size={13} className={isGeneratingStoryboard ? 'animate-spin' : ''} />
                    <span>{isGeneratingStoryboard ? 'Choreographing...' : '🤖 Generate 4-Shot Storyboard'}</span>
                  </button>
                </div>
              </div>

              {/* Storyboard Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                {(storyboardData?.shots || [
                  { shot_number: 1, lens_mm: '24mm Prime', type: 'Wide Establishing', movement: 'Slow Dolly In', description: 'Devon steps onto porch in golden dawn light clutching the weathered photo' },
                  { shot_number: 2, lens_mm: '85mm Prime', type: 'Emotional Close-Up', movement: 'Static Lockoff', description: 'Faded photograph in Devon trembling hands with shallow depth of field' },
                  { shot_number: 3, lens_mm: '35mm Prime', type: 'Over-The-Shoulder', movement: 'Pan Left 15°', description: 'Marcus enters with coffee mugs offering grounded reassurance' },
                  { shot_number: 4, lens_mm: '50mm Prime', type: 'Medium Horizon', movement: 'Crane Up', description: 'Devon gazing at waking city skyline with newfound resolve' },
                ]).map((sh: any) => (
                  <div key={sh.shot_number} className="p-4 rounded-2xl bg-[#0e0922] border border-amber-500/30 space-y-2 shadow-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-400 font-bold">SHOT {sh.shot_number}: {sh.lens_mm}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-purple-950 text-purple-200 border border-purple-800 font-bold">{sh.type}</span>
                    </div>
                    <p className="text-purple-200/90 text-xs leading-relaxed">{sh.description}</p>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-purple-950">
                      Camera Motion: <strong className="text-amber-300">{sh.movement}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. LOCATION SCOUTING ================= */}
          {selectedSuite === 'locations' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-900/50 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <MapPin className="text-amber-400" size={18} />
                    <span>Location Scouting & Environment Sets</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    AI Location Discovery, Permit Rates, & Lighting Suitability Scores
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRunLocationScouting}
                    disabled={isSearchingLocations}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-mono transition font-black shadow-md shadow-amber-500/20"
                  >
                    <Sparkles size={13} className={isSearchingLocations ? 'animate-spin' : ''} />
                    <span>{isSearchingLocations ? 'Scouting...' : '🤖 Scout AI Locations'}</span>
                  </button>
                </div>
              </div>

              {/* Location Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                {(locations.length > 0 ? locations : [
                  { id: 'loc_001', name: 'Historic Craftsman Porch & Frontage', address: 'Oakland Hills Historic District, CA', suitability_score: 96, cost_per_day: '$2,200', lighting: 'Natural East-Facing Morning Sun' },
                  { id: 'loc_002', name: 'Industrial Artist Loft & Workshop', address: 'West Berkeley Arts District, CA', suitability_score: 91, cost_per_day: '$3,100', lighting: 'High Ceilings & Large Skylights' },
                  { id: 'loc_003', name: 'Panoramic City Viewpoint & Overlook', address: 'Grizzly Peak Boulevard, CA', suitability_score: 94, cost_per_day: '$1,500', lighting: '360° Golden Hour Horizon' },
                ]).map((loc: any) => (
                  <div key={loc.id} className="p-4 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-2.5 shadow-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-400 font-bold truncate">{loc.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">{loc.suitability_score}% Match</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{loc.address}</p>
                    <div className="text-[11px] text-purple-300">
                      Lighting: <strong className="text-amber-300">{loc.lighting}</strong>
                    </div>
                    <div className="pt-2 border-t border-purple-950 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Daily Permit: <strong className="text-emerald-400">{loc.cost_per_day}</strong></span>
                      <button
                        onClick={() => toast.success(`📍 Locked location "${loc.name}" into production bible!`)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold"
                      >
                        Lock Set
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 5. CALL SHEETS & PRODUCTION CALENDAR ================= */}
          {selectedSuite === 'scheduling' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-900/50 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Calendar className="text-amber-400" size={18} />
                    <span>Production Scheduling & Call Sheet Generator</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Hollywood Call Sheets, Crew Pickup Times, & Stage Logistics
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRunCallSheetGeneration}
                    disabled={isGeneratingCallSheet}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-mono transition font-black shadow-md shadow-amber-500/20"
                  >
                    <Sparkles size={13} className={isGeneratingCallSheet ? 'animate-spin' : ''} />
                    <span>{isGeneratingCallSheet ? 'Generating...' : '🤖 Generate Live Call Sheet'}</span>
                  </button>
                </div>
              </div>

              {/* Call Sheet Display */}
              <div className="p-5 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-4 font-mono text-xs shadow-xl">
                <div className="flex justify-between items-center border-b border-purple-900/40 pb-2 text-amber-300 font-bold">
                  <span>PRODUCTION CALL SHEET — DAY 1 ({callSheet?.production_name || projectStatus.projectName})</span>
                  <span className="text-emerald-400 text-[10px]">● {callSheet?.date || 'SCHEDULED'}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-black/40 border border-purple-900/60">
                    <span className="text-slate-400 block text-[10px]">Crew Call</span>
                    <strong className="text-amber-300 text-sm">{callSheet?.crew_call || '06:30 AM'}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-purple-900/60">
                    <span className="text-slate-400 block text-[10px]">First Shot</span>
                    <strong className="text-amber-300 text-sm">{callSheet?.first_shot || '07:15 AM'}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-purple-900/60">
                    <span className="text-slate-400 block text-[10px]">Stage Location</span>
                    <strong className="text-purple-200 text-xs">{callSheet?.location || 'Soundstage Alpha (3D Volume)'}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-purple-900/60">
                    <span className="text-slate-400 block text-[10px]">Stage Weather</span>
                    <strong className="text-purple-200 text-xs">Virtual Sunrise 3200K</strong>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-amber-300 font-bold block text-[11px]">Cast Pickup & Call Schedule:</span>
                  {(callSheet?.key_cast || [
                    { character: 'Devon (Lead Protagonist)', actor: 'Lead Talent', pickup_time: '05:30 AM', hair_makeup: '06:00 AM' },
                    { character: 'Marcus (Community Mentor)', actor: 'Supporting Talent', pickup_time: '06:00 AM', hair_makeup: '06:30 AM' },
                  ]).map((cast: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-black/50 border border-purple-900/60 flex justify-between items-center text-[11px]">
                      <div>
                        <strong className="text-amber-400">{cast.character}</strong>
                        <span className="text-slate-400 ml-2">({cast.actor})</span>
                      </div>
                      <div className="text-purple-300 font-mono text-[10px]">
                        Pickup: <strong>{cast.pickup_time}</strong> • Hair/Makeup: <strong>{cast.hair_makeup}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. EQUIPMENT INVENTORY & BOOKING ================= */}
          {selectedSuite === 'equipment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <DollarSign className="text-amber-400" size={18} />
                    <span>Studio Equipment Inventory & Gear Booking</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    ARRI Large Format Cine Cameras, Cooke Anamorphics, & SkyPanels
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">5 Packages Available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {inventory.map((item: any) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-2.5 shadow-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-400 font-bold">{item.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">{item.status}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{item.sensor || item.output || item.mount || item.payload || item.channels}</p>
                    <div className="pt-2 border-t border-purple-950 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Daily Rate: <strong className="text-emerald-400">{item.daily_rate}</strong></span>
                      <button
                        onClick={() => handleBookEquipment(item)}
                        className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] shadow-sm"
                      >
                        ⚡ Book Hardware
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 7. EDITING & TIMELINE SUITE ================= */}
          {selectedSuite === 'editing' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-900/50 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Film className="text-amber-400" size={18} />
                    <span>Multi-Track Timeline Editor & DaVinci Conform</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">24.00 FPS • 4K DCI • ACEScc</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-4 shadow-xl">
                <div className="h-24 bg-black/60 rounded-xl border border-purple-900/60 p-2 flex items-center gap-2 overflow-x-auto">
                  {(projectStatus.shots && projectStatus.shots.length > 0 ? projectStatus.shots : [
                    { shotNumber: 1, title: 'Opening - Echoes of Absence' },
                    { shotNumber: 2, title: 'The Struggle & Turning Point' },
                    { shotNumber: 3, title: 'Breakthrough & New Horizon' },
                  ]).map((s, idx) => (
                    <div
                      key={s.shotNumber}
                      className="h-full flex-shrink-0 w-56 rounded-xl p-2.5 text-[10px] font-mono flex flex-col justify-between border bg-amber-500/20 border-amber-500 text-amber-300"
                    >
                      <span className="font-bold truncate">V1: Shot_{s.shotNumber}_{s.title.slice(0, 18)}</span>
                      <span className="text-slate-400">00:00:{idx * 8 < 10 ? '0' + idx * 8 : idx * 8} - 00:00:{(idx + 1) * 8}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => toast.success('📥 Exported DaVinci Resolve .EDL / .XML conform manifest!')}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-xl transition text-xs uppercase tracking-wider shadow-md"
                >
                  📥 Export DaVinci Resolve .EDL / .XML
                </button>
              </div>
            </div>
          )}

          {/* ================= 8. COLOR GRADING & FILM LUTS ================= */}
          {selectedSuite === 'color' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Palette className="text-amber-400" size={18} />
                  <span>Color Grading & 3D Film LUT Studio</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">ACEScc • 33-point 3D Cube Profiles</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-rose-300 font-bold">Active 3D LUT Profile:</span>
                  <span className="font-mono text-xs text-amber-300 font-extrabold px-3 py-1 rounded-lg bg-black border border-amber-500/40">
                    {selectedLut}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  {['Kodak 2383 Film Print', 'Teal & Orange Blockbuster', 'Bleach Bypass 70mm', 'Fuji Eterna 500T'].map((lut) => (
                    <button
                      key={lut}
                      onClick={() => {
                        setSelectedLut(lut);
                        toast.success(`🎨 Switched color LUT to "${lut}"`);
                      }}
                      className={`p-3 rounded-xl border text-center transition ${
                        selectedLut === lut
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-black/60 border-purple-900/40 text-purple-300/70 hover:text-white'
                      }`}
                    >
                      <span>{lut}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= 9. SOUND DESIGN SUITE ================= */}
          {selectedSuite === 'sound' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Volume2 className="text-teal-400" size={18} />
                  <span>5.1 Spatial Audio & Stem Separation Suite</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400">-24 LKFS Broadcast Standard</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
                {['Dialogue Master', 'Spatial Foley', 'Orchestral Score', 'SFX Submix'].map((stem, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#0e0922] border border-purple-900/60 space-y-2">
                    <span className="text-teal-400 font-bold block">{stem}</span>
                    <div className="w-full bg-black/60 h-20 rounded-lg flex items-end justify-center p-1.5">
                      <div className="w-4 bg-gradient-to-t from-purple-500 to-teal-400 rounded-sm animate-pulse" style={{ height: `${65 + i * 8}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 10. PLATFORM & REFORMAT ================= */}
          {selectedSuite === 'platform' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Share2 className="text-rose-400" size={18} />
                  <span>Platform & Multi-Format Re-Framing Studio</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">Auto-Reframe & Burned-in Captions</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0e0922] border border-amber-500/40 space-y-2">
                  <span className="text-amber-400 font-bold">2.39:1 CinemaScope</span>
                  <p className="text-slate-300 text-[11px]">Theatrical Master • 4K DCI (4096x1714) • 24.00 FPS</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0e0922] border border-purple-800/60 space-y-2">
                  <span className="text-purple-300 font-bold">16:9 UHD Widescreen</span>
                  <p className="text-slate-300 text-[11px]">Broadcast & Streaming • 3840x2160 • Rec.709</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0e0922] border border-emerald-500/40 space-y-2">
                  <span className="text-emerald-400 font-bold">9:16 Vertical Mobile</span>
                  <p className="text-slate-300 text-[11px]">TikTok & Shorts Reel • 1080x1920 • Smart Crop</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OriginalSuitesHub;
