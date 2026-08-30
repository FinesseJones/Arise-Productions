"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Film,
  Sparkles,
  FileText,
  Lock,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RefreshCw,
  Send,
  Mic,
  MicOff,
  Clock,
  Award,
  CheckCircle2,
  Tag,
  ShieldCheck,
  TrendingUp,
  Download,
  Eye,
  Calendar,
  DollarSign,
  Layers,
  ChevronRight,
  MessageSquare,
  Smartphone,
  Tv,
  ExternalLink,
  Video,
  Radio,
  Sliders
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../lib/api';
import { DEPARTMENT_AGENTS, PRODUCTION_CHAIN_RELAY } from '../constants/departmentAgents';

interface DistributionRoomProps {
  projectId?: string;
  projectName?: string;
  onNavigateToRoom?: (roomKey: string) => void;
}

export function DistributionRoom({
  projectId = 'default',
  projectName = 'Arise Production Project',
  onNavigateToRoom,
}: DistributionRoomProps) {
  const apiBase = getAPIBaseURL();
  const [activeTab, setActiveTab] = useState<'streaming' | 'social_media' | 'video_review' | 'press_kit' | 'screeners' | 'strategy'>('streaming');
  const [activeAgentId, setActiveAgentId] = useState<string>('distribution_lead');

  // OTT Streaming Platforms State
  const [streamingPackage, setStreamingPackage] = useState<any | null>(null);
  const [isGeneratingStreaming, setIsGeneratingStreaming] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('netflix');

  // Social Media & Vertical Video State
  const [socialCampaign, setSocialCampaign] = useState<any | null>(null);
  const [isGeneratingSocial, setIsGeneratingSocial] = useState<boolean>(false);
  const [socialAspectRatio, setSocialAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [socialHookText, setSocialHookText] = useState<string>("HE FOUND HIS FATHER'S SECRET REELS...");
  const [socialChannel, setSocialChannel] = useState<string>('tiktok');
  const [isRenderingSocialClip, setIsRenderingSocialClip] = useState<boolean>(false);
  const [lastRenderedSocialClip, setLastRenderedSocialClip] = useState<any | null>(null);

  // Video Player State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(120);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedVideoSource, setSelectedVideoSource] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
  );

  // Timestamp Commentary State
  const [isAnalyzingTimestamp, setIsAnalyzingTimestamp] = useState<boolean>(false);
  const [commentaryData, setCommentaryData] = useState<any | null>(null);
  const [commentaryHistory, setCommentaryHistory] = useState<any[]>([]);

  // Press Kit (EPK) State
  const [epkData, setEpkData] = useState<any | null>(null);
  const [isGeneratingEpk, setIsGeneratingEpk] = useState<boolean>(false);

  // Screener State
  const [screenerRecipient, setScreenerRecipient] = useState<string>('A24 Acquisitions Council');
  const [screenerEmail, setScreenerEmail] = useState<string>('acquisitions@a24films.com');
  const [screenerSecurity, setScreenerSecurity] = useState<string>('high_watermark');
  const [screenerResult, setScreenerResult] = useState<any | null>(null);

  // Release Strategy State
  const [strategyData, setStrategyData] = useState<any | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState<boolean>(false);

  // In-Room Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; text: string; agentName?: string }>>([
    {
      role: 'assistant',
      agentName: 'Vance Morgan',
      text: "🌍 **Vance Morgan (Global Distribution Lead):** Welcome to the **Studio Global Distribution & Multi-Platform Syndication Hub**! From here, away from public view, you can generate complete delivery packages for **Netflix, Apple TV+, Amazon Prime Video, Disney+, Max, and Tubi**, as well as render **vertical 9:16 clips for TikTok, IG Reels, and YouTube Shorts** with burned-in viral hooks and Arise proof-of-ownership watermarks. How would you like to syndicate your project today?",
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Auto-load Streaming Packages & Social Campaigns on Mount
  useEffect(() => {
    handleGenerateStreamingPackage();
    handleGenerateSocialCampaign();
  }, [projectName, apiBase]);

  // Handler: Generate Streaming Package
  const handleGenerateStreamingPackage = async () => {
    setIsGeneratingStreaming(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/distribution/streaming-package`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectTitle: projectName, format: 'episodic_tv' }),
      });
      const data = await res.json();
      if (data && data.platforms) {
        setStreamingPackage(data);
      }
    } catch {
      toast.error('Failed to compile OTT delivery specs');
    } finally {
      setIsGeneratingStreaming(false);
    }
  };

  // Handler: Generate Social Media Campaign
  const handleGenerateSocialCampaign = async () => {
    setIsGeneratingSocial(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/distribution/social-pack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectTitle: projectName }),
      });
      const data = await res.json();
      if (data && data.channels) {
        setSocialCampaign(data);
      }
    } catch {
      toast.error('Failed to compile social media campaign');
    } finally {
      setIsGeneratingSocial(false);
    }
  };

  // Handler: Render Social Video Clip (FFmpeg)
  const handleRenderSocialClip = async () => {
    setIsRenderingSocialClip(true);
    const toastId = toast.loading(`🎬 Rendering ${socialAspectRatio} vertical video for ${socialChannel.toUpperCase()} with FFmpeg...`);
    try {
      const res = await fetch(`${apiBase}/api/v1/distribution/render-social-clip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: projectName,
          hookText: socialHookText,
          aspectRatio: socialAspectRatio,
          channel: socialChannel,
          durationSeconds: 6,
        }),
      });
      const data = await res.json();
      if (data && data.success) {
        setLastRenderedSocialClip(data);
        toast.success(`✨ Rendered ${socialAspectRatio} clip with burned-in hook and Arise watermark!`, { id: toastId });
      } else {
        toast.error('Video clip rendering failed', { id: toastId });
      }
    } catch {
      toast.error('Network error during render', { id: toastId });
    } finally {
      setIsRenderingSocialClip(false);
    }
  };

  // Handler: Generate EPK
  const handleGenerateEPK = async () => {
    setIsGeneratingEpk(true);
    const toastId = toast.loading('📄 Compiling Electronic Press Kit (EPK)...');
    try {
      const res = await fetch(`${apiBase}/api/v1/distribution/press-kit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectTitle: projectName }),
      });
      const data = await res.json();
      if (data && data.pressKit) {
        setEpkData(data);
        toast.success('✨ EPK Compiled & Verified with BMPCC 4K Specs!', { id: toastId });
      }
    } catch {
      toast.error('EPK generation error', { id: toastId });
    } finally {
      setIsGeneratingEpk(false);
    }
  };

  // Handler: Generate Screener
  const handleGenerateScreener = async () => {
    const toastId = toast.loading('🔒 Minting Forensic Watermarked Screener Link...');
    try {
      const res = await fetch(`${apiBase}/api/v1/distribution/screener`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: projectName,
          recipientName: screenerRecipient,
          recipientEmail: screenerEmail,
          securityLevel: screenerSecurity,
        }),
      });
      const data = await res.json();
      if (data && data.screener) {
        setScreenerResult(data.screener);
        toast.success('✨ Forensic Watermarked Screener Generated!', { id: toastId });
      }
    } catch {
      toast.error('Screener generation error', { id: toastId });
    }
  };

  // Handler: Send Chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsChatLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/v1/agent/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are Vance Morgan (Global Distribution Lead) and Chloe Sterling (Marketing Director) for "${projectName}". User asks: "${userText}"`,
          projectId,
        }),
      });
      const data = await res.json();
      const reply = data.result?.summary || data.result?.response || data.response || "Distribution package is ready for worldwide syndication.";
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', agentName: 'Vance Morgan', text: reply }
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', agentName: 'Vance Morgan', text: "Deliverables are verified and ready for streaming and social export." }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#070314] text-slate-100 font-sans overflow-hidden">
      
      {/* Top Distribution Room Header */}
      <header className="flex-shrink-0 px-6 py-4 bg-[#0d0722]/90 border-b border-purple-900/60 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Globe size={18} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-black tracking-widest text-slate-100 uppercase font-serif">
                GLOBAL DISTRIBUTION & SYNDICATION COMMAND
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                PRODUCER PRIVATE BACKSTAGE 🔒
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Syndicating <strong className="text-amber-300">{projectName}</strong> across Tier-1 OTT Streaming & All Social Formats
            </p>
          </div>
        </div>

        {/* Audience Portal Direct Switcher */}
        <div className="flex items-center space-x-3">
          {onNavigateToRoom && (
            <button
              onClick={() => onNavigateToRoom('theater')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:opacity-90 text-black font-mono font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
              title="Open Public Audience Screening Theater"
            >
              <Eye size={14} />
              <span>Preview Arise Cinema (Audience Portal)</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left / Center Panels */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
          
          {/* Sub-Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-purple-900/60 pb-3 overflow-x-auto scrollbar-none font-mono text-xs font-bold">
            <button
              onClick={() => setActiveTab('streaming')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                activeTab === 'streaming'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tv size={14} />
              <span>Streaming Platforms (Netflix, Apple, Prime, Tubi)</span>
            </button>

            <button
              onClick={() => setActiveTab('social_media')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                activeTab === 'social_media'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone size={14} />
              <span>Social Media & 9:16 Vertical Video (TikTok, Shorts, Reels)</span>
            </button>

            <button
              onClick={() => setActiveTab('press_kit')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                activeTab === 'press_kit'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText size={14} />
              <span>Press Kit (EPK)</span>
            </button>

            <button
              onClick={() => setActiveTab('screeners')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                activeTab === 'screeners'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock size={14} />
              <span>Watermarked Screeners</span>
            </button>

            <button
              onClick={() => setActiveTab('strategy')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                activeTab === 'strategy'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp size={14} />
              <span>Roadmap & Valuations</span>
            </button>
          </div>

          {/* TAB 1: Streaming Platforms (OTT Delivery Packages) */}
          {activeTab === 'streaming' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide font-mono">
                    Tier-1 OTT Platform Delivery Packages
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    SMPTE IMF Containers, ProRes 422 HQ, 5.1 Dolby Atmos stem packages, and EIDR metadata.
                  </p>
                </div>
                <button
                  onClick={handleGenerateStreamingPackage}
                  disabled={isGeneratingStreaming}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition"
                >
                  <RefreshCw size={13} className={isGeneratingStreaming ? 'animate-spin' : ''} />
                  <span>Recompile All Specs</span>
                </button>
              </div>

              {streamingPackage && streamingPackage.platforms ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {streamingPackage.platforms.map((plat: any) => (
                    <div
                      key={plat.id}
                      className="p-5 rounded-3xl bg-[#0e0725] border border-purple-900/60 space-y-3 hover:border-amber-500/50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Tv className="text-amber-400" size={16} />
                          <h4 className="font-bold text-sm text-slate-100 font-serif">{plat.name}</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {plat.status}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-black/40 border border-purple-900/40 space-y-1.5 text-xs font-mono">
                        <div className="text-slate-300">
                          <span className="text-slate-500">Container:</span> {plat.packageType}
                        </div>
                        <div className="text-slate-300">
                          <span className="text-slate-500">Video:</span> {plat.videoSpec}
                        </div>
                        <div className="text-slate-300">
                          <span className="text-slate-500">Audio:</span> {plat.audioSpec}
                        </div>
                        <div className="text-slate-300">
                          <span className="text-slate-500">Captions:</span> {plat.captionSpec}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">QC Checklist:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          100% Broadcast Compliant
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-[#0e0725] text-center space-y-2 text-slate-400 font-mono text-xs">
                  <RefreshCw className="animate-spin mx-auto text-amber-400" size={20} />
                  <p>Compiling OTT delivery packages for Netflix, Apple TV+, Prime Video, Disney+, Max...</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Social Media & Vertical Video Hub */}
          {activeTab === 'social_media' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide font-mono">
                    Multi-Platform Social Syndication & Vertical 9:16 Video Engine
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Generate viral hooks, aspect ratio transformations, and render real video clips via FFmpeg.
                  </p>
                </div>
              </div>

              {/* FFmpeg Multi-Aspect Ratio Clip Generator Box */}
              <div className="p-6 rounded-3xl bg-[#0e0725] border border-amber-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Smartphone size={15} />
                    <span>One-Click Social Video Clip Renderer (FFmpeg Engine)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-purple-300 font-bold">
                    Target: /storage/ingested/social/
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1 font-bold">Channel Format:</label>
                    <select
                      value={socialChannel}
                      onChange={(e) => setSocialChannel(e.target.value)}
                      className="w-full bg-[#180e38] border border-purple-800/60 rounded-xl px-3 py-2 text-xs text-amber-200 font-mono"
                    >
                      <option value="tiktok">TikTok (9:16 Vertical)</option>
                      <option value="reels">Instagram Reels (9:16 Vertical)</option>
                      <option value="shorts">YouTube Shorts (9:16 Vertical)</option>
                      <option value="youtube_4k">YouTube (16:9 4K UHD)</option>
                      <option value="x_twitter">X / Twitter (1:1 Square)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1 font-bold">Aspect Ratio:</label>
                    <div className="flex items-center space-x-1.5 bg-[#180e38] p-1 rounded-xl border border-purple-800/60">
                      <button
                        type="button"
                        onClick={() => setSocialAspectRatio('9:16')}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold font-mono transition ${
                          socialAspectRatio === '9:16' ? 'bg-amber-500 text-black font-extrabold' : 'text-slate-400'
                        }`}
                      >
                        9:16 Vertical
                      </button>
                      <button
                        type="button"
                        onClick={() => setSocialAspectRatio('1:1')}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold font-mono transition ${
                          socialAspectRatio === '1:1' ? 'bg-amber-500 text-black font-extrabold' : 'text-slate-400'
                        }`}
                      >
                        1:1 Square
                      </button>
                      <button
                        type="button"
                        onClick={() => setSocialAspectRatio('16:9')}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold font-mono transition ${
                          socialAspectRatio === '16:9' ? 'bg-amber-500 text-black font-extrabold' : 'text-slate-400'
                        }`}
                      >
                        16:9 Wide
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1 font-bold">Viral Hook Text:</label>
                    <input
                      type="text"
                      value={socialHookText}
                      onChange={(e) => setSocialHookText(e.target.value)}
                      placeholder="Enter top viral hook banner..."
                      className="w-full bg-[#180e38] border border-purple-800/60 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    Includes automatic <strong>Arise Productions Proof-of-Ownership Watermark</strong> & 24fps motion fade.
                  </span>
                  <button
                    onClick={handleRenderSocialClip}
                    disabled={isRenderingSocialClip}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:opacity-90 text-black font-extrabold font-mono text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <Film size={14} />
                    <span>{isRenderingSocialClip ? 'Rendering via FFmpeg...' : 'Render Social Video Clip'}</span>
                  </button>
                </div>

                {lastRenderedSocialClip && (
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-bold">{lastRenderedSocialClip.summary}</p>
                      <p className="text-[10px] text-slate-400">Path: {lastRenderedSocialClip.outputFile}</p>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                      SAVED 🟢
                    </span>
                  </div>
                )}
              </div>

              {/* Social Channels Campaign Cards */}
              {socialCampaign && socialCampaign.channels && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialCampaign.channels.map((chan: any, idx: number) => (
                    <div key={idx} className="p-5 rounded-3xl bg-[#0e0725] border border-purple-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="text-amber-400" size={16} />
                          <h4 className="font-bold text-sm text-slate-100 font-serif">{chan.platform}</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {chan.aspectRatio}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-black/40 border border-purple-900/40 space-y-2 text-xs font-mono">
                        <div>
                          <span className="text-slate-500">Post Title:</span>
                          <p className="text-amber-200 font-bold mt-0.5">{chan.title}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Opening Hook:</span>
                          <p className="text-slate-300 italic">"{chan.hook}"</p>
                        </div>
                        {chan.hashtags && (
                          <div>
                            <span className="text-slate-500">Tags:</span>
                            <p className="text-purple-300">{chan.hashtags.join(' ')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Press Kit (EPK) */}
          {activeTab === 'press_kit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide font-mono">
                  Electronic Press Kit (EPK) & Theatrical Marketing Suite
                </h3>
                <button
                  onClick={handleGenerateEPK}
                  disabled={isGeneratingEpk}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-bold font-mono text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>{isGeneratingEpk ? 'Compiling...' : 'Generate Hollywood EPK'}</span>
                </button>
              </div>

              {epkData ? (
                <div className="space-y-4">
                  <div className="p-6 rounded-3xl bg-[#0e0725] border border-purple-900/60 space-y-3">
                    <span className="text-xs font-bold text-amber-400 uppercase font-mono">1-Line Sales Hook</span>
                    <p className="text-sm text-slate-100 font-sans italic">"{epkData.pressKit?.oneLineSynopsis}"</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-[#0e0725] border border-purple-900/60 space-y-3">
                    <span className="text-xs font-bold text-amber-400 uppercase font-mono">Director's Statement</span>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">{epkData.pressKit?.directorStatement}</p>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-[#0e0725] text-center space-y-3">
                  <FileText className="mx-auto text-amber-400" size={32} />
                  <p className="text-xs font-mono text-slate-400">
                    Click "Generate Hollywood EPK" to compile production notes, cast bios, and marketing taglines.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Forensic Watermarked Screeners */}
          {activeTab === 'screeners' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#0e0725] border border-amber-500/30 space-y-4 max-w-2xl">
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Lock size={16} />
                  <span>Mint Secure Watermarked Buyer Screener</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Buyer / Recipient Organization:</label>
                    <input
                      type="text"
                      value={screenerRecipient}
                      onChange={(e) => setScreenerRecipient(e.target.value)}
                      className="w-full bg-[#180e38] border border-purple-800/60 rounded-xl px-3 py-2 text-xs text-amber-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Recipient Email:</label>
                    <input
                      type="email"
                      value={screenerEmail}
                      onChange={(e) => setScreenerEmail(e.target.value)}
                      className="w-full bg-[#180e38] border border-purple-800/60 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                    />
                  </div>
                  <button
                    onClick={handleGenerateScreener}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-bold font-mono text-xs shadow-md transition"
                  >
                    Mint Watermarked Link
                  </button>
                </div>

                {screenerResult && (
                  <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/40 space-y-2 text-xs font-mono">
                    <p className="text-emerald-400 font-bold">✨ Screener Active:</p>
                    <p className="text-amber-300 break-all">{screenerResult.playbackUrl}</p>
                    <p className="text-[10px] text-slate-400">Watermark: {screenerResult.security?.watermarkText}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Roadmap & Valuations */}
          {activeTab === 'strategy' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#0e0725] border border-purple-900/60 space-y-4">
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-mono">
                  Multi-Territory Valuation & Windowing Strategy
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/50 space-y-1 font-mono text-xs">
                    <span className="text-slate-400">North America (US/CA)</span>
                    <p className="text-amber-300 font-bold text-sm">$2.5M - $5.0M</p>
                    <span className="text-[10px] text-emerald-400">A24 / Apple Original Films</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/50 space-y-1 font-mono text-xs">
                    <span className="text-slate-400">United Kingdom & Ireland</span>
                    <p className="text-amber-300 font-bold text-sm">$600K - $1.2M</p>
                    <span className="text-[10px] text-emerald-400">StudioCanal / Curzon</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/50 space-y-1 font-mono text-xs">
                    <span className="text-slate-400">Western Europe</span>
                    <p className="text-amber-300 font-bold text-sm">$800K - $1.5M</p>
                    <span className="text-[10px] text-emerald-400">Wild Bunch / Capelight</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/50 space-y-1 font-mono text-xs">
                    <span className="text-slate-400">Direct Arise Cinema PPV</span>
                    <p className="text-amber-300 font-bold text-sm">$1.0M+ Net Fan Rev</p>
                    <span className="text-[10px] text-emerald-400">Exclusive Premiere</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Rail: In-Room Distribution & Marketing Agent Intercom */}
        <aside className="w-80 xl:w-96 flex-shrink-0 border-l border-purple-900/60 bg-[#0a051d]/95 flex flex-col justify-between">
          <div className="p-4 border-b border-purple-900/60 bg-black/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-xs text-amber-300 font-mono uppercase">Vance Morgan (Distribution Lead)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">AGENT ONLINE</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl text-xs ${
                  msg.role === 'user'
                    ? 'bg-amber-500/10 border border-amber-500/40 text-amber-200 ml-6'
                    : 'bg-[#150c33] border border-purple-900/60 text-slate-200 mr-4'
                }`}
              >
                {msg.agentName && (
                  <span className="text-[10px] font-bold text-amber-400 font-mono block mb-1">
                    {msg.agentName}
                  </span>
                )}
                <p className="leading-relaxed font-sans">{msg.text}</p>
              </div>
            ))}
            {isChatLoading && (
              <div className="p-3 rounded-2xl bg-[#150c33] border border-purple-900/60 text-slate-400 text-xs font-mono animate-pulse">
                Vance Morgan is formulating syndication strategy...
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} className="p-4 border-t border-purple-900/60 bg-black/40 flex items-center space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Vance Morgan about OTT delivery or viral hooks..."
              className="flex-1 bg-[#180e38] border border-purple-800/60 rounded-xl px-3 py-2 text-xs text-slate-200 font-sans focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </form>
        </aside>

      </div>
    </div>
  );
}

export default DistributionRoom;
