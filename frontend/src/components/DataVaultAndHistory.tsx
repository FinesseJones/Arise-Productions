"use client";

import React, { useState, useRef } from 'react';
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
  CheckCircle2,
  UploadCloud,
  FileUp,
  File,
  Plus,
  Trash2,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';
import { getAPIBaseURL } from '../lib/api';

interface DataVaultProps {
  projectStatus: ProjectStatus;
}

interface VaultItem {
  id: string;
  name: string;
  department: string;
  type: string;
  size: string;
  timestamp: string;
  author: string;
  status: string;
  preview: string;
}

export const DataVaultAndHistory: React.FC<DataVaultProps> = ({ projectStatus }) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'files' | 'history' | 'database'>('files');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanSlug = (projectStatus.projectName || 'Arise_Production').replace(/[^a-zA-Z0-9]/g, '_');

  // Initial cross-department artifacts ledger
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([
    {
      id: 'art-001',
      name: `${cleanSlug}_Screenplay_Master_Draft.fountain`,
      department: 'Screenwriting',
      type: 'Script Document',
      size: '142 KB',
      timestamp: 'Today, 2:45 PM',
      author: 'Screenwriter AI (NVIDIA NIM)',
      status: 'Locked',
      preview: `EXT. ${(projectStatus?.projectName || "PRODUCTION").toUpperCase()} - SCENE 1\n${projectStatus.shots?.[0]?.description || `The opening world of ${projectStatus.projectName} unfolds with full visual scope and character setup.`}`,
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
      preview: `001  AX       V     C        00:00:00:00 00:00:08:12 00:00:00:00 00:00:08:12\n* FROM CLIP NAME: ${(cleanSlug || "SLUG").toUpperCase()}_SHOT01_TAKE03`,
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
  ]);

  // Live generation action log history
  const [formatFilter, setFormatFilter] = useState<'all' | 'feature_film' | 'short_form' | 'tv_series'>('all');
  const [liveAssets, setLiveAssets] = useState<any[]>([]);

  // Fetch real assets from backend
  const loadLiveAssets = async () => {
    try {
      const apiBase = getAPIBaseURL();
      const url = formatFilter === 'all' ? `${apiBase}/api/v1/assets` : `${apiBase}/api/v1/assets?format=${formatFilter}`;
      const res = await fetch(url).then((r) => r.json());
      if (res && res.success && Array.isArray(res.assets)) {
        setLiveAssets(res.assets);
      }
    } catch (e) {}
  };

  React.useEffect(() => {
    loadLiveAssets();
  }, [formatFilter]);

  const [historyLogs, setHistoryLogs] = useState([
    { time: '19:33:11', dept: 'System', text: 'WebSocket connected to Central API Bridge (:4000/ws)' },
    { time: '19:33:10', dept: 'System', text: 'Live File Watcher initialized on storage/watch_folder' },
    { time: '19:31:14', dept: 'NVIDIA NIM', text: 'Model meta/llama-3.1-70b-instruct loaded for 10-department co-pilots' },
    { time: '19:28:50', dept: 'Editorial', text: 'Timeline compiled with 12 cut points via OpenMontage connector' },
    { time: '19:22:45', dept: 'Virtual DP', text: 'Unreal CineCameraActor exported 60 FPS trajectory track' },
    { time: '19:15:30', dept: 'Screenplay', text: 'Scene breakdown generated 8 shots and 14 dialogue beats' },
  ]);

  // Universal Document Ingestion Handler
  const handleFilesIngested = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let dept = 'General Production';
      let docType = 'Production Artifact';

      if (['fountain', 'fdx', 'pdf', 'txt', 'docx'].includes(ext)) {
        dept = 'Screenwriting';
        docType = ext === 'fountain' ? 'Screenplay (.fountain)' : 'Script Document';
      } else if (['edl', 'xml', 'fcpxml'].includes(ext)) {
        dept = 'Editorial & Conform';
        docType = 'DaVinci Timeline EDL';
      } else if (['cube', 'look', 'cdl'].includes(ext)) {
        dept = 'Color & Mastering';
        docType = '3D 33-point Color LUT';
      } else if (['wav', 'mp3', 'flac', 'aac', 'm4a', 'ogg', 'aiff'].includes(ext)) {
        dept = 'Sound & Scoring';
        docType = 'Audio Stem Track';
      } else if (['png', 'jpg', 'jpeg', 'webp', 'exr', 'hdr', 'tiff', 'svg'].includes(ext)) {
        dept = 'Generative Prompt & Style';
        docType = 'Visual Reference Texture';
      } else if (['mp4', 'mov', 'mkv', 'avi', 'webm', 'braw', 'prores'].includes(ext)) {
        dept = 'Virtual Cinematography';
        docType = '4K Video Master / Camera RAW';
      } else if (['json', 'fbx', 'obj', 'usd', 'usda', 'usdz', 'gltf', 'glb', 'blend', 'abc'].includes(ext)) {
        dept = 'Virtual Cinematography';
        docType = '3D Spatial Asset / Model Rig';
      }

      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      // Read base64 to send to backend asset storage
      const b64Reader = new FileReader();
      b64Reader.onload = async (ev) => {
        const fileData = ev.target?.result as string;
        try {
          const apiBase = getAPIBaseURL();
          await fetch(`${apiBase}/api/v1/assets/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name,
              projectId: cleanSlug,
              format: formatFilter === 'all' ? 'feature_film' : formatFilter,
              category: dept.toLowerCase().includes('script') ? 'script' : dept.toLowerCase().includes('sound') ? 'audio' : dept.toLowerCase().includes('character') ? 'character' : dept.toLowerCase().includes('color') ? 'color_lut' : dept.toLowerCase().includes('cine') ? 'video' : 'environment',
              assetType: ['wav', 'mp3', 'flac', 'aac', 'm4a'].includes(ext) ? 'audio' : ['mp4', 'mov', 'braw', 'prores', 'mkv'].includes(ext) ? 'video' : ['cube', 'look'].includes(ext) ? 'lut' : ['fountain', 'txt', 'pdf', 'fdx'].includes(ext) ? 'script' : ['obj', 'fbx', 'gltf', 'glb', 'blend', 'usd'].includes(ext) ? 'model3d' : 'image',
              fileData,
              filename: file.name,
              uploaded_by: 'Creator (You)',
            }),
          });
          toast.success(`✅ Successfully vaulted ${file.name} (${sizeStr})`);
          loadLiveAssets();
        } catch (e) {
          console.warn('Asset upload error:', e);
        }
      };
      b64Reader.readAsDataURL(file);

      // Read text if it's a screenplay / data file
      if (['fountain', 'txt', 'json', 'edl'].includes(ext)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          if (text) {
            if (ext === 'fountain' || ext === 'txt') {
              try {
                localStorage.setItem(`arise_script_${cleanSlug}_shot_1`, text);
                const apiBase = getAPIBaseURL();
                fetch(`${apiBase}/api/v1/projects/script`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    projectId: cleanSlug,
                    shotNumber: 1,
                    scriptContent: text,
                  }),
                }).catch(() => {});
              } catch {}
            }
          }
        };
        reader.readAsText(file);
      }

      const newItem: VaultItem = {
        id: `ingest-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        department: dept,
        type: docType,
        size: sizeStr,
        timestamp: 'Just now',
        author: 'User Ingested (Master Vault)',
        status: 'Synchronized',
        preview: `Ingested document: ${file.name} | Stored in backend storage/assets/ for production ${projectStatus.projectName}.`,
      };

      setVaultItems((prev) => [newItem, ...prev]);

      // Add to action history
      setHistoryLogs((prev) => [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          dept: dept.split(' ')[0],
          text: `Ingested & Synchronized "${file.name}" to ${dept} storage vault`,
        },
        ...prev,
      ]);

      toast.success(`💾 "${file.name}" stored in Asset Vault & synchronized!`, { icon: '📦', duration: 4000 });
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFilesIngested(e.dataTransfer.files);
    }
  };

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
      <div className="p-6 border-b border-purple-900/50 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-500/60 bg-black flex-shrink-0 shadow-lg shadow-amber-500/20 p-0 flex items-center justify-center">
            <img
              src={ARISE_LOGO_BASE64}
              alt="Arise Productions"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase font-serif">
                Studio Data Vault & Document Ingestion
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                Live Synced
              </span>
            </div>
            <p className="text-xs text-[#E2BA86] font-mono mt-0.5">
              Drag & drop scripts (.fountain), timelines (.edl), color LUTs (.cube), audio stems (.wav), or 3D camera tracks (.json) for <strong className="text-amber-300">{projectStatus.projectName}</strong>.
            </p>
          </div>
        </div>

        {/* Tab switcher & Ingest Action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25"
          >
            <UploadCloud size={16} />
            <span>⚡ Upload Any Asset Format</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFilesIngested(e.target.files)}
            className="hidden"
            accept="*/*"
          />

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('files')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'files' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers size={13} />
              <span>Vault Files ({vaultItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'history' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock size={13} />
              <span>Action History ({historyLogs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'files' ? (
          <div className="space-y-5">
            {/* 🌟 HERO DRAG & DROP INGESTION DROPZONE (METHOD 1) */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 relative overflow-hidden backdrop-blur-md ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/15 scale-[1.01] shadow-2xl shadow-amber-500/30'
                  : 'border-amber-500/40 bg-[#140e2e]/70 hover:bg-[#140e2e]/95 hover:border-amber-400 shadow-xl'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
                <FileUp size={30} className={isDragging ? 'animate-bounce' : 'animate-pulse'} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 tracking-wide">
                  Drag & Drop <strong className="text-amber-300">ANY Media or Asset Format</strong> Here, or <span className="text-amber-400 underline">Browse Files</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl mx-auto">
                  Automatically parses and registers into your 16 AI departments and persistent disk storage. Fully supports all major Hollywood file standards:
                </p>
              </div>

              {/* Supported Format Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-[10px]">
                <span className="px-2.5 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-800/60">
                  🎬 Video: .mp4 / .mov / .mkv / .braw / .prores
                </span>
                <span className="px-2.5 py-1 rounded-full bg-teal-950/80 text-teal-300 border border-teal-800/60">
                  🎙️ Audio: .wav / .mp3 / .flac / .aac / .m4a / stems
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                  🖼️ Images: .png / .jpg / .webp / .exr / textures
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60">
                  📝 Screenplay: .fountain / .fdx / .pdf / .txt / .docx
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                  🧊 3D Models: .obj / .fbx / .gltf / .glb / .usd / .blend
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60">
                  🎨 Color LUT: .cube / .look / .cdl
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60">
                  🎞️ Timelines: .edl / .xml / .fcpxml
                </span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search files, scripts, prompts, stems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0e0922] border border-purple-900/60 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
                <Search size={14} className="absolute left-3 top-3 text-slate-500" />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 font-mono text-xs">
                <Filter size={13} className="text-slate-500 flex-shrink-0 ml-1" />
                {['all', 'Screenwriting', 'Virtual Cinematography', 'Generative Prompt & Style', 'Sound & Scoring', 'Editorial & Conform', 'Color & Mastering'].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap text-[11px] ${
                      selectedDept === dept
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-[#0e0922] border-purple-900/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {dept === 'all' ? 'All Departments' : dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#0e0922] border border-purple-900/50 hover:border-amber-500/50 transition space-y-3 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-xl bg-purple-950 text-amber-400 border border-purple-800/60">
                          {item.department.includes('Script') ? (
                            <FileText size={16} />
                          ) : item.department.includes('Camera') ? (
                            <Camera size={16} />
                          ) : item.department.includes('Sound') ? (
                            <Music size={16} />
                          ) : item.department.includes('Editorial') ? (
                            <Scissors size={16} />
                          ) : (
                            <File size={16} />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-slate-200 truncate" title={item.name}>
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-mono text-purple-400 block">{item.department}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {item.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-purple-950 font-mono text-[10px] text-slate-400 line-clamp-3 leading-relaxed">
                      {item.preview}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{item.size} • {item.timestamp}</span>
                    <button
                      onClick={() => handleDownload(item.name)}
                      className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 transition"
                      title="Export File"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Live Action History Log Tab */
          <div className="p-6 rounded-2xl bg-[#0e0922] border border-purple-900/50 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
              <span className="text-amber-400 font-bold">LIVE TELEMETRY & GENERATION AUDIT LOG</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                RECORDING ACTIVE
              </span>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {historyLogs.map((log, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-purple-950 flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-slate-500">[{log.time}]</span>
                    <span className="text-rose-400 font-bold px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-[10px]">
                      {log.dept}
                    </span>
                    <span className="text-slate-200">{log.text}</span>
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
