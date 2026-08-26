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
  MessageSquare
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
  const [activeTab, setActiveTab] = useState<'video_review' | 'press_kit' | 'screeners' | 'strategy' | 'transcripts'>('video_review');
  const [activeAgentId, setActiveAgentId] = useState<string>('distribution_lead');

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
      text: "🌍 **Vance Morgan (Global Distribution Lead):** Welcome to the **05: Distribution & Marketing Release Hub**! Here we package your finished master into Electronic Press Kits (EPK), generate forensic watermarked screeners for studio buyers, and review video playhead timing to optimize audience retention. How can we position your film today?",
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Voice Intercom & Microphone State
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [voiceHistory, setVoiceHistory] = useState<any[]>([]);
  const recognitionRef = useRef<any>(null);

  // Load Voice Transcripts from DB
  const loadTranscripts = async () => {
    try {
      const res = await fetch(`${apiBase}/api/v1/studio/transcripts?projectId=${projectId}`).then((r) => r.json());
      if (res && res.success && Array.isArray(res.transcripts)) {
        setVoiceHistory(res.transcripts);
      }
    } catch (e) {
      console.warn('Failed to load transcripts:', e);
    }
  };

  useEffect(() => {
    loadTranscripts();
  }, [projectId, apiBase]);

  // Video Time Update Listener
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const seekToTimestamp = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  // Trigger Multi-Agent Video Commentary at current timestamp
  const handleAnalyzeCurrentFrame = async () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setIsAnalyzingTimestamp(true);
    const toastId = toast.loading(`🔍 Analyzing scene moment at [${formatTime(currentTime)}] with Distribution & Camera leads...`);

    try {
      const res = await fetch(`${apiBase}/api/v1/distribution/video-commentary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: projectName,
          timestampSeconds: Math.round(currentTime),
          formattedTime: formatTime(currentTime),
          videoContext: 'Master Cut / Trailer Review',
        }),
      }).then((r) => r.json());

      if (res && res.success && res.commentary) {
        setCommentaryData(res.commentary);
        setCommentaryHistory((prev) => [res.commentary, ...prev.slice(0, 10)]);
        toast.success(`✨ Agents reviewed timestamp [${formatTime(currentTime)}]!`, { id: toastId });
      } else {
        toast.error('Failed to analyze timestamp', { id: toastId });
      }
    } catch {
      toast.error('Network error during video analysis', { id: toastId });
    } finally {
      setIsAnalyzingTimestamp(false);
    }
  };

  // Generate Electronic Press Kit (EPK)
  const handleGeneratePressKit = async () => {
    setIsGeneratingEpk(true);
    const toastId = toast.loading('📋 Generating Hollywood Electronic Press Kit (EPK)...');

    try {
      const res = await fetch(`${apiBase}/api/v1/distribution/press-kit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: projectName,
          format: 'feature_film',
          genre: 'Cinematic High-Concept Drama',
          director: 'CineDirector Maya',
          cast: ['Devon Wells', 'Seraphina Cross', 'Kinetics Kai'],
        }),
      }).then((r) => r.json());

      if (res && res.success && res.epk) {
        setEpkData(res.epk);
        toast.success('🎉 EPK Press Kit successfully generated!', { id: toastId });
      } else {
        toast.error('Could not generate EPK', { id: toastId });
      }
    } catch {
      toast.error('Network error generating EPK', { id: toastId });
    } finally {
      setIsGeneratingEpk(false);
    }
  };

  // Generate Watermarked Screener
  const handleGenerateScreener = async () => {
    const toastId = toast.loading(`🔐 Generating forensic screener for ${screenerRecipient}...`);
    try {
      const res = await fetch(`${apiBase}/api/v1/distribution/screener`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: projectName,
          recipientName: screenerRecipient,
          recipientEmail: screenerEmail,
          securityLevel: screenerSecurity,
          expirationDays: 14,
        }),
      }).then((r) => r.json());

      if (res && res.success && res.screener) {
        setScreenerResult(res.screener);
        toast.success('🔒 Watermarked Screener package locked and generated!', { id: toastId });
      }
    } catch {
      toast.error('Error generating screener', { id: toastId });
    }
  };

  // Generate Global Release Strategy
  const handleGenerateStrategy = async () => {
    setIsGeneratingStrategy(true);
    const toastId = toast.loading('🗺️ Formulating worldwide windowing and festival roadmap...');
    try {
      const res = await fetch(`${apiBase}/api/v1/distribution/release-strategy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: projectName,
          format: 'feature_film',
          genre: 'Cinematic Sci-Fi Thriller',
          targetPlatforms: ['Theatrical', 'A24', 'Neon', 'Netflix', 'Apple TV+'],
        }),
      }).then((r) => r.json());

      if (res && res.success && res.strategy) {
        setStrategyData(res.strategy);
        toast.success('🏆 Global Release Strategy compiled!', { id: toastId });
      }
    } catch {
      toast.error('Network error formulating release strategy', { id: toastId });
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  // Voice Intercom Live Recognition Toggle
  const toggleVoiceIntercom = () => {
    if (isVoiceActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsVoiceActive(false);
      setIsVoiceListening(false);
      toast('🎙️ Voice Intercom standby.');
    } else {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        toast.error('Web Speech API is not supported in this browser. Please use text chat.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsVoiceActive(true);
        setIsVoiceListening(true);
        toast.success('🎙️ Live Voice Intercom active! Speak directly to studio agents.');
      };

      recognition.onresult = async (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setVoiceTranscript(interimTranscript || finalTranscript);

        if (finalTranscript.trim()) {
          const userSpokenText = finalTranscript.trim();
          setVoiceTranscript('');

          // Send to backend voice transcript & AI
          try {
            const res = await fetch(`${apiBase}/api/v1/studio/transcripts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userTranscript: userSpokenText,
                agentId: activeAgentId,
                agentName: activeAgentId === 'distribution_lead' ? 'Vance Morgan' : 'Chloe Sterling',
                room: '05: Distribution & Marketing',
                projectId,
              }),
            }).then((r) => r.json());

            if (res && res.success && res.reply) {
              setChatMessages((prev) => [
                ...prev,
                { role: 'user', text: `🎙️ [Voice]: "${userSpokenText}"` },
                { role: 'assistant', agentName: activeAgentId === 'distribution_lead' ? 'Vance Morgan' : 'Chloe Sterling', text: res.reply }
              ]);

              // Optional Speech Synthesis playback
              if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(res.reply.slice(0, 180));
                utterance.rate = 1.05;
                window.speechSynthesis.speak(utterance);
              }

              await loadTranscripts();
            }
          } catch (e) {
            console.error('Error submitting voice transcript:', e);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event?.error);
        setIsVoiceListening(false);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  // Send In-Room Text Chat Message
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsChatLoading(true);

    try {
      const activeAgent = DEPARTMENT_AGENTS.find((a) => a.id === activeAgentId) || DEPARTMENT_AGENTS[0];
      const res = await fetch(`${apiBase}/api/v1/agents/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: activeAgent.id,
          agentName: activeAgent.name,
          role: activeAgent.role,
          message: userText,
          systemPrompt: activeAgent.systemPrompt,
        }),
      }).then((r) => r.json());

      if (res && res.assistantMessage && res.assistantMessage.content) {
        setChatMessages((prev) => [...prev, { role: 'assistant', agentName: activeAgent.name, text: res.assistantMessage.content }]);
      } else if (res && res.reply) {
        setChatMessages((prev) => [...prev, { role: 'assistant', agentName: activeAgent.name, text: res.reply }]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', agentName: 'Vance Morgan', text: '🌍 Market perspective noted. Let’s calibrate our platform bidding strategy!' }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const nextRelayStep = PRODUCTION_CHAIN_RELAY[activeAgentId];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080512] text-slate-100 overflow-hidden font-sans select-text">
      {/* Top Header Bar */}
      <div className="px-6 py-3 bg-[#0c0620]/95 border-b border-amber-500/30 flex items-center justify-between flex-wrap gap-3 flex-shrink-0 backdrop-blur-2xl specular-border z-20">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/25">
            🌍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#F59E0B] font-serif">
                05 DISTRIBUTION & MARKETING RELEASE HUB
              </h2>
              <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                COMMERCIAL RELEASE
              </span>
            </div>
            <p className="text-[11px] text-amber-200/70 font-mono">
              Project: <span className="text-amber-400 font-bold">{projectName}</span> • EPK Press Kits • Watermarked Screeners • Festival Circuits
            </p>
          </div>
        </div>

        {/* Live Voice Intercom Toggle & Transcripts Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleVoiceIntercom}
            className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold transition shadow-lg ${
              isVoiceActive
                ? 'bg-rose-600/90 text-white border-rose-400 animate-pulse shadow-rose-500/30'
                : 'bg-[#150a30] text-amber-300 border-amber-500/40 hover:bg-amber-500/20 shadow-amber-500/10'
            }`}
          >
            {isVoiceActive ? <Mic size={14} className="text-white animate-bounce" /> : <MicOff size={14} className="text-amber-400" />}
            <span>{isVoiceActive ? '🎙️ Intercom LIVE (Speaking)' : '🎙️ Live Voice Intercom'}</span>
          </button>

          {/* Tab Segmenter */}
          <div className="flex bg-[#12082b] p-1 rounded-xl border border-amber-500/30 text-xs font-mono space-x-1">
            <button
              onClick={() => setActiveTab('video_review')}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === 'video_review'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              🎬 Video Review
            </button>
            <button
              onClick={() => setActiveTab('press_kit')}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === 'press_kit'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              📋 EPK Press Kit
            </button>
            <button
              onClick={() => setActiveTab('screeners')}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === 'screeners'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              🔒 Screeners
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === 'strategy'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              🏆 Global Release
            </button>
            <button
              onClick={() => setActiveTab('transcripts')}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === 'transcripts'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold shadow'
                  : 'text-purple-300/80 hover:text-white'
              }`}
            >
              📜 Transcripts ({voiceHistory.length})
            </button>
          </div>
        </div>
      </div>

      {/* Voice Intercom Live Waveform Banner */}
      {isVoiceActive && (
        <div className="bg-gradient-to-r from-rose-950/80 via-amber-950/80 to-purple-950/80 px-6 py-2 border-b border-rose-500/40 flex items-center justify-between flex-shrink-0 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span className="text-xs font-mono text-rose-200 font-bold uppercase tracking-wider">
              VOICE RECOGNITION ACTIVE • Speak naturally to Vance Morgan or Chloe Sterling
            </span>
          </div>
          <div className="text-xs font-mono text-amber-200 truncate max-w-xl italic">
            {voiceTranscript ? `"${voiceTranscript}"` : 'Listening to microphone stream...'}
          </div>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Active Deck Workspace */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#080417]">
          {/* TAB 1: INTERACTIVE VIDEO PLAYER & MULTI-AGENT REVIEW */}
          {activeTab === 'video_review' && (
            <div className="space-y-6">
              {/* Cinema Player Container */}
              <div className="glass-card-4k specular-border rounded-3xl p-5 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film size={18} className="text-amber-400" />
                    <h3 className="text-base font-black text-amber-200 font-serif uppercase tracking-wider">
                      Interactive Video Dailies & Trailer Screening Deck
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-lg bg-[#150a30] text-amber-300 border border-amber-500/30">
                      ⏱️ {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      4K DCI • 24.000 FPS • Gen 5 Film Color
                    </span>
                  </div>
                </div>

                {/* HTML5 Video Element with High-Contrast Viewport */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-amber-500/40 shadow-2xl flex items-center justify-center group">
                  <video
                    ref={videoRef}
                    src={selectedVideoSource}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleTimeUpdate}
                    className="w-full h-full object-contain"
                  />

                  {/* Playhead Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center text-xs font-mono text-amber-300">
                      <span>{projectName} • Master Cut Review</span>
                      <span>SMPTE TC: 01:00:{formatTime(currentTime)}:00</span>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="w-14 h-14 rounded-full bg-amber-500/90 text-black flex items-center justify-center text-xl shadow-lg hover:scale-110 transition"
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                      </button>
                    </div>

                    {/* Timeline Scrubber */}
                    <div className="space-y-1">
                      <input
                        type="range"
                        min={0}
                        max={duration || 120}
                        value={currentTime}
                        onChange={(e) => seekToTimestamp(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-purple-900/60 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Video Navigation Bar & Beat Markers */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 transition"
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>

                    <button
                      onClick={handleAnalyzeCurrentFrame}
                      disabled={isAnalyzingTimestamp}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
                    >
                      <Sparkles size={14} className={isAnalyzingTimestamp ? 'animate-spin' : ''} />
                      <span>🔍 Review Current Timestamp [{formatTime(currentTime)}] with Agents</span>
                    </button>
                  </div>

                  {/* Beat Marker Shortcuts */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span className="text-amber-400/80 mr-1">Beats:</span>
                    <button onClick={() => seekToTimestamp(5)} className="px-2 py-1 rounded bg-[#160b33] border border-amber-500/30 text-amber-300 hover:bg-amber-500/20">
                      [00:05] Hook
                    </button>
                    <button onClick={() => seekToTimestamp(30)} className="px-2 py-1 rounded bg-[#160b33] border border-amber-500/30 text-amber-300 hover:bg-amber-500/20">
                      [00:30] Inciting
                    </button>
                    <button onClick={() => seekToTimestamp(75)} className="px-2 py-1 rounded bg-[#160b33] border border-amber-500/30 text-amber-300 hover:bg-amber-500/20">
                      [01:15] Midpoint
                    </button>
                    <button onClick={() => seekToTimestamp(105)} className="px-2 py-1 rounded bg-[#160b33] border border-amber-500/30 text-amber-300 hover:bg-amber-500/20">
                      [01:45] Climax
                    </button>
                  </div>
                </div>
              </div>

              {/* Timestamp Commentary Display (When Analyzed) */}
              {commentaryData && (
                <div className="glass-card-4k specular-border rounded-3xl p-6 border border-amber-500/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <h4 className="text-sm font-black text-amber-200 uppercase font-mono">
                        Agent Multi-Perspective Review @ [{commentaryData.timestamp}]
                      </h4>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                      {commentaryData.overallVerdict}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {commentaryData.notes?.map((note: any, nIdx: number) => (
                      <div key={nIdx} className="p-4 rounded-2xl bg-[#12082b] border border-amber-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold text-amber-300">{note.agentName}</strong>
                          <span className="text-[10px] text-purple-300 font-mono">{note.role}</span>
                        </div>
                        <p className="text-xs text-slate-200 font-sans leading-relaxed">{note.comment}</p>
                      </div>
                    ))}
                  </div>

                  {commentaryData.actionableTweak && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-xs font-mono text-amber-200 flex items-center gap-2">
                      <strong className="text-amber-400">💡 Actionable Director Recommendation:</strong>
                      <span>{commentaryData.actionableTweak}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ELECTRONIC PRESS KIT (EPK) */}
          {activeTab === 'press_kit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-amber-200 font-serif uppercase tracking-wider">
                    Hollywood Electronic Press Kit (EPK) Engine
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Generate comprehensive studio press kits, cast bios, technical specifications, and marketing taglines.
                  </p>
                </div>

                <button
                  onClick={handleGeneratePressKit}
                  disabled={isGeneratingEpk}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  <Sparkles size={14} className={isGeneratingEpk ? 'animate-spin' : ''} />
                  <span>{isGeneratingEpk ? 'Generating EPK...' : '⚡ Generate Full Hollywood EPK'}</span>
                </button>
              </div>

              {epkData ? (
                <div className="space-y-5 font-mono text-xs">
                  {/* Synopsis & Director Statement */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card-4k specular-border rounded-2xl p-5 border border-amber-500/30 space-y-3">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">Narrative Synopsis</span>
                      <p className="text-xs text-slate-200 font-sans leading-relaxed italic">
                        "{epkData.pressKit?.shortSynopsis}"
                      </p>
                      <div className="p-3 rounded-xl bg-[#140a33] border border-purple-900/50 text-[11px] text-purple-200 font-sans leading-relaxed whitespace-pre-line">
                        {epkData.pressKit?.longSynopsis}
                      </div>
                    </div>

                    <div className="glass-card-4k specular-border rounded-2xl p-5 border border-amber-500/30 space-y-3">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">Director's Statement</span>
                      <p className="text-xs text-slate-200 font-sans leading-relaxed">
                        {epkData.pressKit?.directorStatement}
                      </p>
                      <div className="p-3 rounded-xl bg-[#140a33] border border-amber-500/30 text-[11px] space-y-1">
                        <strong className="text-amber-300">BMPCC 4K Camera & Color Science:</strong>
                        <p className="text-slate-300 font-sans">{epkData.pressKit?.productionNotes}</p>
                      </div>
                    </div>
                  </div>

                  {/* Technical Specs & Marketing Taglines */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card-4k specular-border rounded-2xl p-4 border border-amber-500/30 space-y-2">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">Technical Specs</span>
                      <div className="space-y-1.5 text-[11px] text-slate-300">
                        <div><strong>Master Format:</strong> {epkData.pressKit?.technicalSpecs?.format}</div>
                        <div><strong>Aspect Ratio:</strong> {epkData.pressKit?.technicalSpecs?.aspectRatio}</div>
                        <div><strong>Audio:</strong> {epkData.pressKit?.technicalSpecs?.sound}</div>
                        <div><strong>Color Science:</strong> {epkData.pressKit?.technicalSpecs?.color}</div>
                        <div><strong>Runtime:</strong> {epkData.pressKit?.technicalSpecs?.runtime}</div>
                      </div>
                    </div>

                    <div className="glass-card-4k specular-border rounded-2xl p-4 border border-amber-500/30 space-y-2 md:col-span-2">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">Marketing Taglines & Poster Art</span>
                      <div className="space-y-2">
                        {epkData.marketingMaterials?.taglines?.map((tagline: string, tIdx: number) => (
                          <div key={tIdx} className="p-2 rounded-lg bg-[#160b33] border border-amber-500/30 text-amber-200 font-serif italic text-xs">
                            "{tagline}"
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card-4k rounded-3xl p-12 text-center border border-amber-500/20 text-slate-400 font-mono text-xs space-y-2">
                  <FileText size={32} className="mx-auto text-amber-400/40" />
                  <p>No EPK Press Kit generated yet.</p>
                  <p className="text-[11px] text-amber-400/60">Click "Generate Full Hollywood EPK" to formulate press materials.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WATERMARKED SCREENERS */}
          {activeTab === 'screeners' && (
            <div className="space-y-6">
              <div className="glass-card-4k specular-border rounded-3xl p-6 border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <Lock size={18} className="text-amber-400" />
                  <h3 className="text-base font-black text-amber-200 font-serif uppercase tracking-wider">
                    Forensic Watermarked Screener Generator
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-amber-300 font-bold uppercase text-[10px]">Recipient Name / Organization</label>
                    <input
                      type="text"
                      value={screenerRecipient}
                      onChange={(e) => setScreenerRecipient(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#140a2c] border border-amber-500/40 text-xs text-slate-100 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-amber-300 font-bold uppercase text-[10px]">Recipient Email</label>
                    <input
                      type="email"
                      value={screenerEmail}
                      onChange={(e) => setScreenerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#140a2c] border border-amber-500/40 text-xs text-slate-100 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-amber-300 font-bold uppercase text-[10px]">Security Level</label>
                    <select
                      value={screenerSecurity}
                      onChange={(e) => setScreenerSecurity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#140a2c] border border-amber-500/40 text-xs text-amber-200 focus:outline-none font-mono"
                    >
                      <option value="high_watermark">🔒 High Security (Forensic Dynamic Watermark)</option>
                      <option value="standard">🛡️ Standard (Burned-in Timecode & Email)</option>
                      <option value="festival_jury">🏆 Festival Jury Link (7-Day Expiry)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleGenerateScreener}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
                  >
                    <Lock size={14} />
                    <span>Generate Secure Forensic Screener</span>
                  </button>
                </div>
              </div>

              {/* Screener Result */}
              {screenerResult && (
                <div className="glass-card-4k specular-border rounded-2xl p-5 border border-emerald-500/40 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-base">✅</span>
                      <strong className="text-amber-200">Screener Package Active: {screenerResult.screenerId}</strong>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px]">
                      Expires in 14 Days
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#12082b] border border-amber-500/30 space-y-1.5">
                    <div className="text-slate-300"><strong>Direct Screening URL:</strong> <code className="text-amber-300">{screenerResult.playbackUrl}</code></div>
                    <div className="text-slate-300"><strong>Forensic Watermark:</strong> <span className="text-rose-300 italic">{screenerResult.security?.watermarkText}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GLOBAL RELEASE STRATEGY */}
          {activeTab === 'strategy' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-amber-200 font-serif uppercase tracking-wider">
                    Worldwide Release, Festival & Territory Sales Strategy
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Formulate multi-territory pre-sales, Sundance/Cannes festival windows, and global streaming rollouts.
                  </p>
                </div>

                <button
                  onClick={handleGenerateStrategy}
                  disabled={isGeneratingStrategy}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  <Sparkles size={14} className={isGeneratingStrategy ? 'animate-spin' : ''} />
                  <span>{isGeneratingStrategy ? 'Compiling Strategy...' : '🏆 Generate Worldwide Strategy'}</span>
                </button>
              </div>

              {strategyData && (
                <div className="space-y-5 font-mono text-xs">
                  {/* Primary Strategy */}
                  <div className="glass-card-4k specular-border rounded-2xl p-5 border border-amber-500/30 space-y-2">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Executive Rollout Blueprint</span>
                    <p className="text-xs text-slate-200 font-sans leading-relaxed">{strategyData.primaryStrategy}</p>
                  </div>

                  {/* Festival Circuit Table */}
                  <div className="glass-card-4k specular-border rounded-2xl p-5 border border-amber-500/30 space-y-3">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Tier-1 Festival Submission Circuit</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {strategyData.festivalCircuit?.map((fest: any, fIdx: number) => (
                        <div key={fIdx} className="p-3 rounded-xl bg-[#140a33] border border-amber-500/30 space-y-1">
                          <div className="flex items-center justify-between">
                            <strong className="text-amber-300 text-xs">{fest.festival}</strong>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-500/40">
                              {fest.tier}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300"><strong>Premiere:</strong> {fest.premiereWindow} • <strong>Deadline:</strong> {fest.submissionDeadline}</div>
                          <p className="text-[11px] text-purple-200 font-sans italic">{fest.strategicGoal}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pre-sale Territories */}
                  <div className="glass-card-4k specular-border rounded-2xl p-5 border border-amber-500/30 space-y-3">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Territory Pre-Sale Valuations</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {strategyData.presaleTerritories?.map((terr: any, tIdx: number) => (
                        <div key={tIdx} className="p-3 rounded-xl bg-[#140a33] border border-emerald-500/30 space-y-1">
                          <strong className="text-amber-200 text-xs block">{terr.territory}</strong>
                          <div className="text-emerald-400 font-bold text-xs">{terr.estimatedValuation}</div>
                          <div className="text-[10px] text-slate-400">Buyers: {terr.buyerTargets?.join(', ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TRANSCRIPT HISTORY & CONTEXTUAL MEMORY */}
          {activeTab === 'transcripts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-amber-200 font-serif uppercase tracking-wider">
                    Voice & Intercom Transcript History
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Chronological audit log of all microphone instructions, agent decisions, and contextual memories.
                  </p>
                </div>

                <button
                  onClick={loadTranscripts}
                  className="px-3 py-1.5 rounded-xl bg-[#150a30] border border-amber-500/30 text-amber-300 hover:text-white text-xs font-mono flex items-center gap-1.5"
                >
                  <RefreshCw size={12} />
                  <span>Refresh Transcripts</span>
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {voiceHistory.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p>No voice transcripts recorded yet.</p>
                    <p className="text-[11px] text-amber-400/60 mt-1">Activate the "🎙️ Live Voice Intercom" to speak directly to agents.</p>
                  </div>
                ) : (
                  voiceHistory.map((rec: any, idx: number) => (
                    <div key={idx} className="glass-card-4k specular-border rounded-2xl p-4 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-amber-400/80">
                        <span>{new Date(rec.timestamp).toLocaleString()} • {rec.room}</span>
                        <span className="text-purple-300 font-bold">{rec.agentName}</span>
                      </div>
                      <div className="text-slate-200 font-sans">
                        <strong className="text-amber-300">Filmmaker:</strong> "{rec.userTranscript}"
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#140a33] text-purple-200 font-sans border border-purple-900/40">
                        <strong className="text-purple-300">{rec.agentName}:</strong> {rec.agentReply}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dedicated Distribution Agent & Relay Console */}
        <div className="w-80 lg:w-96 border-l border-amber-500/30 bg-[#0a051a]/95 flex flex-col flex-shrink-0">
          {/* Agent Selector Header */}
          <div className="p-3.5 border-b border-amber-500/20 bg-[#0e0724] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌍</span>
              <div>
                <h4 className="text-xs font-bold text-amber-200">Vance Morgan & Chloe Sterling</h4>
                <p className="text-[10px] text-amber-400/70 font-mono">Distribution & Marketing Leads</p>
              </div>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Live Council
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500/20 text-amber-100 border border-amber-500/40 ml-4'
                    : 'bg-[#150a30] text-slate-200 border border-purple-800/40 mr-2 whitespace-pre-wrap font-sans'
                }`}
              >
                {msg.agentName && msg.role === 'assistant' && (
                  <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">
                    {msg.agentName}:
                  </div>
                )}
                {msg.text}
              </div>
            ))}
            {isChatLoading && (
              <div className="p-3 rounded-2xl bg-[#150a30] border border-purple-800/40 text-xs text-amber-300 flex items-center gap-2 font-mono animate-pulse">
                <RefreshCw size={12} className="animate-spin" />
                <span>Vance Morgan is analyzing market metrics...</span>
              </div>
            )}
          </div>

          {/* Baton Relay Step */}
          {nextRelayStep && (
            <div className="p-3 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-purple-500/10 border-t border-amber-500/30 text-[11px] font-mono space-y-1.5">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span>Next Relay:</span>
                <span>{nextRelayStep.nextAgentName} ({nextRelayStep.nextRole})</span>
              </div>
              <p className="text-[10px] text-slate-300 font-sans line-clamp-2">{nextRelayStep.batonSummary}</p>
            </div>
          )}

          {/* Chat Input Box */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-amber-500/20 bg-[#0d0722] flex gap-2">
            <input
              type="text"
              placeholder="Ask Vance or Chloe about sales, festivals, trailers..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-[#150a30] border border-amber-500/40 text-xs text-slate-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 font-sans"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:opacity-40 text-black font-bold rounded-xl transition flex items-center justify-center flex-shrink-0"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DistributionRoom;
