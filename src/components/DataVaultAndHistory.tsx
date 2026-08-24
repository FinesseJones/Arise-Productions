"use client";

import React, { useState } from 'react';
import { ProjectStatus } from '../types/types';
import {
  FolderArchive,
  Film,
  FileText,
  Camera,
  Music,
  Scissors,
  Bot,
  Download,
  Search,
  Filter,
  Clock,
  Sparkles,
  Layers,
  Eye,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DataVaultProps {
  projectStatus: ProjectStatus;
}

export const DataVaultAndHistory: React.FC<DataVaultProps> = ({ projectStatus }) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'files' | 'history' | 'database'>('files');

  const cleanSlug = (projectStatus.projectName || 'Arise_Production').replace(/[^a-zA-Z0-9]/g, '_');

  // Comprehensive cross-department artifacts ledger
  const vaultItems = [
    {
      id: 'art-001',
      name: `${cleanSlug}_Screenplay_Master_Draft.fountain`,
      department: 'Screenwriting',
      type: 'Script Document',
      size: '142 KB',
      timestamp: 'Today, 2:45 PM',
      author: 'Screenwriter AI (NVIDIA NIM)',
      status: 'Locked',
      preview: `EXT. ${projectStatus.projectName.toUpperCase()} - SCENE 1\n${projectStatus.shots?.[0]?.description || `The opening world of ${projectStatus.projectName} unfolds with full visual scope and character setup.`}`,
    },
    {
      id: 'art-002',
      name: `${cleanSlug}_Camera_Track_Shot_01_CineCam.json`,
      department: 'Virtual Cinematography',
      type: 'Unreal Camera Path',
      size: '89 KB',
      timestamp: 'Today, 3:12 PM',
      author: 'Virtual DP AI (Unreal 5.4)',
      status: 'Calibrated',
      preview: `Focal Length: 35mm Prime | Sensor: Full Frame 36x24mm | Shot: ${projectStatus.shots?.[0]?.title || 'Shot 1'} | Orbit Vector: [12.4, -4.2, 8.9]`,
    },
    {
      id: 'art-003',
      name: `${cleanSlug}_ControlNet_Depth_Pass_Scene01.png`,
      department: 'Generative Prompt & Style',
      type: 'ComfyUI Depth Tensor',
      size: '4.2 MB',
      timestamp: 'Today, 3:30 PM',
      author: 'Prompt Engineer AI (Comfy MCP)',
      status: 'Rendered',
      preview: `Model: FLUX.1 Dev | Production: ${projectStatus.projectName} | ControlNet Depth V2 (Weight 0.85) | Guidance: 3.5 | Resolution: 1920x1080`,
    },
    {
      id: 'art-004',
      name: `${cleanSlug}_Dialogue_Stem_Lead_Line01.wav`,
      department: 'Sound & Scoring',
      type: 'Broadcast WAV (48kHz/24-bit)',
      size: '8.4 MB',
      timestamp: 'Today, 4:05 PM',
      author: 'Sound Supervisor AI',
      status: 'Mixed',
      preview: `Voice Model: ElevenLabs Dynamic Heroic | Project: ${projectStatus.projectName} | Spatialization: 5.1 Surround Submix | Noise Floor: -64 dB`,
    },
    {
      id: 'art-005',
      name: `${cleanSlug}_Timeline_Master_Reel_01.edl`,
      department: 'Editorial & Conform',
      type: 'DaVinci Resolve EDL',
      size: '34 KB',
      timestamp: 'Today, 4:40 PM',
      author: 'OpenMontage & Editorial AI',
      status: 'Conformed',
      preview: `001  AX       V     C        00:00:00:00 00:00:08:12 00:00:00:00 00:00:08:12\n* FROM CLIP NAME: ${cleanSlug.toUpperCase()}_SHOT01_TAKE03`,
    },
    {
      id: 'art-006',
      name: `${cleanSlug}_Final_Color_LUT_FilmEmulation_2383.cube`,
      department: 'Color & Mastering',
      type: '3D 33-point LUT',
      size: '1.2 MB',
      timestamp: 'Today, 5:15 PM',
      author: 'Colorist AI',
      status: 'Graded',
      preview: `Target: Rec.709 Gamma 2.4 | Film Space: ACEScg | Highlights: Warm Tungsten Roll-off | Graded for: ${projectStatus.projectName}`,
    },
    {
      id: 'art-007',
      name: `${cleanSlug}_Vertical_9x16_Reel_Cut.mp4`,
      department: 'Platform & Social',
      type: 'H.265 Master (4K)',
      size: '48.6 MB',
      timestamp: 'Today, 5:50 PM',
      author: 'Platform Optimizer AI',
      status: 'Ready',
      preview: `Format: 9:16 Vertical (1080x1920) | Safe Zone: Center 80% | Auto-Captions: Synchronized | Source: ${projectStatus.projectName}`,
    },
  ];

  // Live generation action log history
  const historyLogs = [
    { time: '19:33:11', dept: 'System', text: 'WebSocket connected to Central API Bridge (:4000/ws)' },
    { time: '19:33:10', dept: 'System', text: 'Live File Watcher initialized on storage/watch_folder' },
    { time: '19:31:14', dept: 'NVIDIA NIM', text: 'Model meta/llama-3.1-70b-instruct loaded for 10-department co-pilots' },
    { time: '19:28:50', dept: 'Editorial', text: 'Timeline compiled with 12 cut points via OpenMontage connector' },
    { time: '19:22:45', dept: 'Virtual DP', text: 'Unreal CineCameraActor exported 60 FPS trajectory track' },
    { time: '19:15:30', dept: 'Screenplay', text: 'Scene breakdown generated 8 shots and 14 dialogue beats' },
  ];

  const filteredItems = vaultItems.filter((item) => {
    const matchesDept = selectedDept === 'all' || item.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleDownload = (itemName: string) => {
    toast.success(`📥 Exporting ${itemName} from local storage vault...`);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Vault Header */}
      <div className="p-6 border-b border-slate-800/80 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FolderArchive className="text-amber-400 w-6 h-6" />
            <h2 className="text-xl font-bold tracking-tight text-slate-100">
              Studio Data Vault & Production History
            </h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live Synchronized
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Centralized data ledger, asset manifests, camera paths, audio stems, EDL conform files, and AI action logs for <strong className="text-amber-300">{projectStatus.projectName}</strong>.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'files' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={13} />
            <span>Vault Files ({vaultItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock size={13} />
            <span>Action History ({historyLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'files' ? (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search files, scripts, prompts, stems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
              </div>

              {/* Department filter chips */}
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                {['all', 'Screenwriting', 'Cinematography', 'Prompt', 'Sound', 'Editorial', 'Color'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDept(d)}
                    className={`px-2.5 py-1 rounded-lg border transition ${
                      selectedDept === d
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Vault Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {item.type.includes('Script') ? <FileText size={16} /> : item.type.includes('Camera') ? <Camera size={16} /> : item.type.includes('Sound') || item.type.includes('WAV') ? <Music size={16} /> : item.type.includes('EDL') ? <Scissors size={16} /> : <Film size={16} />}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 truncate max-w-[200px]" title={item.name}>
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-amber-400/80 font-mono block">
                            {item.department}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {item.size}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-300 line-clamp-3 leading-relaxed">
                      {item.preview}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <div className="flex items-center gap-1">
                      <Bot size={11} className="text-emerald-400" />
                      <span className="truncate max-w-[140px]">{item.author}</span>
                    </div>
                    <button
                      onClick={() => handleDownload(item.name)}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold transition"
                    >
                      <Download size={11} />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Live Department History Logs */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock size={15} className="text-amber-400" />
              <span>Real-Time Action & Telemetry Ledger</span>
            </h3>
            <div className="divide-y divide-slate-800 font-mono text-xs">
              {historyLogs.map((log, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 text-[11px]">{log.time}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400 text-[10px] border border-slate-800 font-semibold">
                      {log.dept}
                    </span>
                    <span className="text-slate-300">{log.text}</span>
                  </div>
                  <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataVaultAndHistory;
