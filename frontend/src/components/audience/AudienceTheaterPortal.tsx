"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Heart,
  Flame,
  Award,
  Star,
  MessageSquare,
  Share2,
  Tv,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Layers,
  ChevronRight,
  Send,
  Eye,
  ArrowLeft,
  Crown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../../lib/api';
import { ARISE_LOGO_BASE64 } from '../../constants/branding';
import StudioWatermark from '../common/StudioWatermark';

interface AudienceTheaterPortalProps {
  initialProjectId?: string;
  onSwitchToStudio?: () => void;
}

export function AudienceTheaterPortal({
  initialProjectId = 'proj-fatherless-child',
  onSwitchToStudio,
}: AudienceTheaterPortalProps) {
  const apiBase = getAPIBaseURL();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId);
  const [catalogue, setCatalogue] = useState<any[]>([]);
  const [activeProject, setActiveProject] = useState<any>({
    id: 'proj-fatherless-child',
    name: 'A Fatherless Child',
    format: 'episodic_tv',
    genre: 'Emotional Family Drama',
    description: "Devon grapples with identity and legacy after discovering his late father's unprocessed 16mm reels.",
  });

  // Cinema Player State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '2.39:1' | '9:16'>('16:9');
  const [activeTab, setActiveTab] = useState<'overview' | 'episodes' | 'trailers' | 'reviews'>('overview');
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);

  // Audience Reactions State
  const [reactions, setReactions] = useState<{
    applause: number;
    fire: number;
    ovation: number;
    mindblown: number;
    heart: number;
  }>({
    applause: 3420,
    fire: 4890,
    ovation: 2150,
    mindblown: 1840,
    heart: 5210,
  });
  const [userReacted, setUserReacted] = useState<Record<string, boolean>>({});

  // Audience Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>('');
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Episodes List for TV Series
  const episodes = [
    {
      number: 1,
      title: 'Echoes of the 16mm Reel',
      runtime: '54 Min',
      synopsis: 'Devon unlocks his late father’s sealed steel archive, discovering unprocessed 16mm camera reels and a zoning blueprint that contradicts everything his family was told.',
      badge: 'NOW STREAMING 🟢',
    },
    {
      number: 2,
      title: 'The Foundry Confrontation',
      runtime: '58 Min',
      synopsis: 'Ayanna investigates the historic East District property records as Malachi rallies the youth community to protect the center from sudden redevelopment.',
      badge: 'STREAMING 4K',
    },
    {
      number: 3,
      title: 'Covenant in the Shadows',
      runtime: '52 Min',
      synopsis: 'Leila Jackson confronts the past, revealing why Devon’s father hid the master footage twenty years ago during the city expansion hearing.',
      badge: 'STREAMING 4K',
    },
    {
      number: 4,
      title: 'The Evidence Conformed',
      runtime: '61 Min',
      synopsis: 'Using the restored optical reels, the team stages an emergency injunction hearing before the midnight council vote.',
      badge: 'STREAMING 4K',
    },
  ];

  // Fetch Catalogue, Reactions & Reviews
  useEffect(() => {
    fetch(`${apiBase}/api/v1/audience/catalogue`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.catalogue && Array.isArray(data.catalogue) && data.catalogue.length > 0) {
          setCatalogue(data.catalogue);
          const found = data.catalogue.find((p: any) => p.id === selectedProjectId);
          if (found) setActiveProject(found);
        }
      })
      .catch(() => {});

    fetch(`${apiBase}/api/v1/audience/reactions/${selectedProjectId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.reactions) setReactions(data.reactions);
      })
      .catch(() => {});

    fetch(`${apiBase}/api/v1/audience/reviews/${selectedProjectId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.reviews) setReviews(data.reviews);
      })
      .catch(() => {});
  }, [selectedProjectId, apiBase]);

  const handleSelectProject = (proj: any) => {
    setSelectedProjectId(proj.id);
    setActiveProject(proj);
    toast.success(`🎬 Loaded "${proj.name || 'Title'}" in Arise Cinema`);
  };

  const handleTriggerReaction = async (type: 'applause' | 'fire' | 'ovation' | 'mindblown' | 'heart') => {
    setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setUserReacted((prev) => ({ ...prev, [type]: true }));

    const emojiMap = {
      applause: '👏',
      fire: '🔥',
      ovation: '🏆',
      mindblown: '🤯',
      heart: '❤️',
    };
    toast.success(`${emojiMap[type]} Audience reaction sent!`, { duration: 1500 });

    try {
      await fetch(`${apiBase}/api/v1/audience/reactions/${selectedProjectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType: type }),
      });
    } catch {}
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    setIsSubmittingReview(true);
    const authorName = newReviewAuthor.trim() || 'Audience Member';

    try {
      const res = await fetch(`${apiBase}/api/v1/audience/reviews/${selectedProjectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: authorName,
          rating: newReviewRating,
          comment: newReviewComment.trim(),
          verified: true,
        }),
      });
      const data = await res.json();
      if (data && data.reviews) {
        setReviews(data.reviews);
        setNewReviewComment('');
        setNewReviewAuthor('');
        toast.success('✨ Your review has been published to Arise Cinema!');
      }
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatTimecode = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#06030e] text-slate-100 font-sans flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* Top Audience Cinema Header */}
      <header className="sticky top-0 z-40 bg-[#09041a]/95 backdrop-blur-xl border-b border-amber-500/30 px-6 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-black border border-amber-500/60 overflow-hidden flex-shrink-0 shadow-lg shadow-amber-500/10">
            <img src={ARISE_LOGO_BASE64} alt="Arise Cinema" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif uppercase">
                ARISE CINEMA
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                4K PREMIERE THEATER
              </span>
            </div>
            <p className="text-[10.5px] text-amber-300/70 font-mono tracking-tight">
              Official Public Audience Screening & Streaming Portal
            </p>
          </div>
        </div>

        {/* Right Action: Studio Producer Backstage Switcher */}
        <div className="flex items-center space-x-3">
          {onSwitchToStudio && (
            <button
              onClick={onSwitchToStudio}
              className="px-3.5 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 border border-purple-500/50 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md transition"
              title="Return to Studio Backstage Suite"
            >
              <Crown size={14} className="text-amber-400" />
              <span>Studio Producer Backstage</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Cinema Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Project Selector Bar (Audience Showcase Carousel) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {catalogue.length > 0 ? (
            catalogue.map((proj) => (
              <button
                key={proj.id}
                onClick={() => handleSelectProject(proj)}
                className={`flex-shrink-0 px-4 py-2 rounded-2xl border text-xs font-mono font-bold transition flex items-center space-x-2 ${
                  selectedProjectId === proj.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-purple-600/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
                    : 'bg-[#100826] border-purple-900/50 text-slate-400 hover:text-slate-200 hover:border-purple-700'
                }`}
              >
                <Film size={13} className={selectedProjectId === proj.id ? 'text-amber-400' : 'text-purple-400'} />
                <span>{proj.name}</span>
                {selectedProjectId === proj.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/30">
              🎬 Featured: {activeProject.name} (4K Master)
            </div>
          )}
        </div>

        {/* Big 4K Cinema Screen Player */}
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-[#090518] border border-amber-500/40 shadow-2xl shadow-black">
            
            {/* Player Viewport */}
            <div
              className={`relative mx-auto flex items-center justify-center bg-black transition-all duration-300 ${
                aspectRatio === '16:9'
                  ? 'w-full aspect-video'
                  : aspectRatio === '2.39:1'
                  ? 'w-full aspect-[2.39/1]'
                  : 'w-full max-w-sm aspect-[9/16]'
              }`}
            >
              {/* Real HTML5 4K Video Element */}
              <video
                ref={videoRef}
                src="/videos/arise_studio_walkthrough_demo.mp4"
                playsInline
                loop
                muted={isMuted}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                    if (videoRef.current.duration) setDuration(videoRef.current.duration);
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  isPlaying ? 'opacity-100' : 'opacity-40'
                }`}
              />

              {/* Cinematic Overlay Title Banner (When Paused) */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                  <div className="text-center space-y-3 p-6 max-w-xl">
                    <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shadow-2xl shadow-amber-500/20">
                      <Film className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold tracking-wide">
                        {activeProject.format === 'episodic_tv' ? `EPISODE ${selectedEpisode}: ${episodes[selectedEpisode - 1]?.title || 'Echoes of Absence'}` : 'FEATURE FILM MASTER'}
                      </span>
                      <h2 className="text-2xl font-black text-slate-100 uppercase tracking-widest font-serif mt-2">
                        {activeProject.name}
                      </h2>
                      <p className="text-xs text-amber-300/90 font-mono mt-1">
                        4K DCI (3840x2160) • 24.000 FPS • Blackmagic Gen 5 Film Color • 5.1 Atmos
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Timecode & Resolution Overlays */}
              <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-purple-800/60 font-mono text-xs text-amber-300 font-bold flex items-center space-x-2">
                <Clock size={12} className="text-amber-400" />
                <span>TC: {formatTimecode(currentTime)} / {formatTimecode(duration)}</span>
              </div>

              <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>4K MASTER STREAM</span>
              </div>

              {/* Central Play Button */}
              {!isPlaying && (
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.play();
                      setIsPlaying(true);
                    }
                  }}
                  className="absolute z-20 w-20 h-20 rounded-full bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black flex items-center justify-center shadow-2xl hover:scale-110 transition duration-300 shadow-amber-500/40 cursor-pointer"
                  title="Play Feature"
                >
                  <Play size={32} className="ml-1 fill-black" />
                </button>
              )}

              {/* Burned-in Proof-of-Ownership Watermark */}
              <div className="absolute bottom-4 right-4 z-20">
                <StudioWatermark variant="compact" showCopyright={true} />
              </div>
            </div>

            {/* Playback Controls Toolbar */}
            <div className="p-4 bg-[#0d0722] border-t border-purple-900/60 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 transition"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                <span className="text-slate-400 text-xs">
                  {formatTimecode(currentTime)} <span className="text-slate-600">/</span> 58:00
                </span>
              </div>

              {/* Aspect Ratio Toggles */}
              <div className="flex items-center space-x-1.5 bg-black/40 p-1 rounded-xl border border-purple-900/60">
                <span className="text-[10px] text-slate-400 px-2 font-bold">SCOPE:</span>
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                    aspectRatio === '16:9' ? 'bg-amber-500 text-black font-extrabold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  16:9 UHD
                </button>
                <button
                  onClick={() => setAspectRatio('2.39:1')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                    aspectRatio === '2.39:1' ? 'bg-amber-500 text-black font-extrabold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  2.39:1 SCOPE
                </button>
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                    aspectRatio === '9:16' ? 'bg-amber-500 text-black font-extrabold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  9:16 MOBILE
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Audience Claps & Live Reactions Bar */}
          <div className="p-4 rounded-2xl bg-[#0f0826] border border-amber-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center space-x-2">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                Live Audience Reactions:
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => handleTriggerReaction('applause')}
                className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 text-xs font-mono font-bold transition transform active:scale-95 ${
                  userReacted.applause
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20'
                    : 'bg-[#180e38] border-purple-800/60 text-slate-300 hover:border-amber-500/50'
                }`}
              >
                <span>👏</span>
                <span>Applause</span>
                <span className="px-1.5 py-0.5 rounded-md bg-black/40 text-[10px] text-amber-300 font-bold">
                  {reactions.applause.toLocaleString()}
                </span>
              </button>

              <button
                onClick={() => handleTriggerReaction('fire')}
                className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 text-xs font-mono font-bold transition transform active:scale-95 ${
                  userReacted.fire
                    ? 'bg-red-500/20 border-red-500 text-red-300 shadow-md shadow-red-500/20'
                    : 'bg-[#180e38] border-purple-800/60 text-slate-300 hover:border-red-500/50'
                }`}
              >
                <span>🔥</span>
                <span>Fire</span>
                <span className="px-1.5 py-0.5 rounded-md bg-black/40 text-[10px] text-red-300 font-bold">
                  {reactions.fire.toLocaleString()}
                </span>
              </button>

              <button
                onClick={() => handleTriggerReaction('ovation')}
                className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 text-xs font-mono font-bold transition transform active:scale-95 ${
                  userReacted.ovation
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20'
                    : 'bg-[#180e38] border-purple-800/60 text-slate-300 hover:border-emerald-500/50'
                }`}
              >
                <span>🏆</span>
                <span>Ovation</span>
                <span className="px-1.5 py-0.5 rounded-md bg-black/40 text-[10px] text-emerald-300 font-bold">
                  {reactions.ovation.toLocaleString()}
                </span>
              </button>

              <button
                onClick={() => handleTriggerReaction('mindblown')}
                className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 text-xs font-mono font-bold transition transform active:scale-95 ${
                  userReacted.mindblown
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/20'
                    : 'bg-[#180e38] border-purple-800/60 text-slate-300 hover:border-purple-500/50'
                }`}
              >
                <span>🤯</span>
                <span>Mind Blown</span>
                <span className="px-1.5 py-0.5 rounded-md bg-black/40 text-[10px] text-purple-300 font-bold">
                  {reactions.mindblown.toLocaleString()}
                </span>
              </button>

              <button
                onClick={() => handleTriggerReaction('heart')}
                className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 text-xs font-mono font-bold transition transform active:scale-95 ${
                  userReacted.heart
                    ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-md shadow-pink-500/20'
                    : 'bg-[#180e38] border-purple-800/60 text-slate-300 hover:border-pink-500/50'
                }`}
              >
                <span>❤️</span>
                <span>Love</span>
                <span className="px-1.5 py-0.5 rounded-md bg-black/40 text-[10px] text-pink-300 font-bold">
                  {reactions.heart.toLocaleString()}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Overview, Episodes, Trailers, Reviews) */}
        <div className="border-b border-purple-900/60 flex items-center space-x-6 text-sm font-mono font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition border-b-2 flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film size={15} />
            <span>Story & Details</span>
          </button>

          {activeProject.format === 'episodic_tv' && (
            <button
              onClick={() => setActiveTab('episodes')}
              className={`pb-3 transition border-b-2 flex items-center gap-2 ${
                activeTab === 'episodes'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tv size={15} />
              <span>Episodes ({episodes.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('trailers')}
            className={`pb-3 transition border-b-2 flex items-center gap-2 ${
              activeTab === 'trailers'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={15} />
            <span>Trailers & Featurettes</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition border-b-2 flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare size={15} />
            <span>Audience Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* Tab 1: Story & Details */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-3xl bg-[#0f0826] border border-purple-900/60 space-y-4">
                <h3 className="text-base font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Film size={16} />
                  <span>Logline & Dramatic Vision</span>
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {activeProject.description || "Devon grapples with identity, faith, and generational legacy after discovering his late father's unprocessed 16mm film reels."}
                </p>
                <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/50 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Thematic Core</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Exploring fatherly legacy, reconciliation, and the courage to break generational cycles through biblical covenant and personal accountability.
                  </p>
                </div>
              </div>

              {/* Cast & Characters Showcase */}
              <div className="p-6 rounded-3xl bg-[#0f0826] border border-purple-900/60 space-y-4">
                <h3 className="text-base font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Award size={16} />
                  <span>Principal Cast & Characters</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/50 space-y-1.5">
                    <span className="font-bold text-xs text-amber-300">Devon Wells (Protagonist)</span>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      A determined young archivist seeking answers to his father’s sudden disappearance two decades ago.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/50 space-y-1.5">
                    <span className="font-bold text-xs text-amber-300">Leila Jackson (Mentor)</span>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      A resilient faith leader who anchored her family through two decades of uncertainty and hardship.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/50 space-y-1.5">
                    <span className="font-bold text-xs text-amber-300">Malachi Davis (Allied Lead)</span>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      Community organizer and director of the East District recreation center fighting for urban youth.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/50 space-y-1.5">
                    <span className="font-bold text-xs text-amber-300">Ayanna Jackson (Lead Advocate)</span>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      Fiercely independent social worker dedicated to defending single-parent households.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Technical Specs & Production Credentials */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#0f0826] border border-amber-500/30 space-y-4">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <ShieldCheck size={15} />
                  <span>Theatrical & Audio Specs</span>
                </h3>
                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div className="flex justify-between border-b border-purple-900/40 pb-1.5">
                    <span className="text-slate-400">Resolution:</span>
                    <span className="text-amber-300 font-bold">4K DCI (3840x2160)</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-900/40 pb-1.5">
                    <span className="text-slate-400">Frame Rate:</span>
                    <span className="text-slate-200">24.000 FPS DCI</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-900/40 pb-1.5">
                    <span className="text-slate-400">Color Pipeline:</span>
                    <span className="text-purple-300 font-bold">Blackmagic Gen 5 / ACEScc</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-900/40 pb-1.5">
                    <span className="text-slate-400">Audio Standard:</span>
                    <span className="text-emerald-400 font-bold">5.1 Dolby Atmos (-24 LKFS)</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-900/40 pb-1.5">
                    <span className="text-slate-400">Rating:</span>
                    <span className="text-amber-400 font-bold">TV-14 / Four-Quadrant</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 font-mono leading-relaxed border-t border-purple-900/50">
                  © 2026 Arise Productions, LLC • A product of THE AI CONTENT FOUNDRY, LLC. Registered with WGA & U.S. Copyright Office.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Episodes */}
        {activeTab === 'episodes' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-amber-300 uppercase tracking-wider font-mono">
              Season 1 Episodes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {episodes.map((ep) => (
                <div
                  key={ep.number}
                  onClick={() => {
                    setSelectedEpisode(ep.number);
                    toast.success(`🎬 Playing Episode ${ep.number}: ${ep.title}`);
                  }}
                  className={`p-5 rounded-3xl border text-left cursor-pointer transition space-y-2 ${
                    selectedEpisode === ep.number
                      ? 'bg-amber-500/10 border-amber-500 shadow-xl shadow-amber-500/10'
                      : 'bg-[#0f0826] border-purple-900/60 hover:border-purple-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      EPISODE {ep.number} • {ep.runtime}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {ep.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 font-serif">
                    {ep.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {ep.synopsis}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Trailers & Featurettes */}
        {activeTab === 'trailers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-3xl bg-[#0f0826] border border-purple-900/60 space-y-3">
              <div className="w-full aspect-video rounded-2xl bg-black border border-purple-800/50 flex items-center justify-center relative overflow-hidden">
                <Film className="text-amber-400" size={24} />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-amber-300">
                  1:45
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 font-serif">Official 4K Theatrical Teaser</h4>
              <p className="text-xs text-slate-400 font-sans">The first reveal of the 16mm archives.</p>
            </div>

            <div className="p-5 rounded-3xl bg-[#0f0826] border border-purple-900/60 space-y-3">
              <div className="w-full aspect-video rounded-2xl bg-black border border-purple-800/50 flex items-center justify-center relative overflow-hidden">
                <Sparkles className="text-purple-400" size={24} />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-purple-300">
                  3:10
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 font-serif">Color Grading Featurette (BRAW Gen 5)</h4>
              <p className="text-xs text-slate-400 font-sans">Side-by-side ACEScc film print emulation.</p>
            </div>

            <div className="p-5 rounded-3xl bg-[#0f0826] border border-purple-900/60 space-y-3">
              <div className="w-full aspect-video rounded-2xl bg-black border border-purple-800/50 flex items-center justify-center relative overflow-hidden">
                <Volume2 className="text-emerald-400" size={24} />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-emerald-300">
                  2:25
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 font-serif">Dolby Atmos Spatial Soundstage</h4>
              <p className="text-xs text-slate-400 font-sans">5.1 Surround sound mastering breakdown.</p>
            </div>
          </div>
        )}

        {/* Tab 4: Audience Reviews & Community Feed */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Submit a Review Form */}
            <form onSubmit={handleAddReview} className="p-6 rounded-3xl bg-[#0f0826] border border-amber-500/30 space-y-4 max-w-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-mono">
                  Share Your Viewer Reaction
                </h3>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className={`text-sm ${newReviewRating >= star ? 'text-amber-400' : 'text-slate-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="Your Name (or Critic Handle)"
                  className="bg-[#180e38] border border-purple-800/60 rounded-xl px-3 py-2 text-xs text-amber-200 font-mono"
                />
              </div>

              <textarea
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="What did you think of the cinematography, story, and performance?"
                rows={3}
                className="w-full bg-[#180e38] border border-purple-800/60 rounded-xl p-3 text-xs text-slate-200 font-sans"
              />

              <button
                type="submit"
                disabled={isSubmittingReview || !newReviewComment.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold font-mono text-xs shadow-md shadow-amber-500/20 hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmittingReview ? 'Submitting...' : 'Post Audience Review'}
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider font-mono">
                Verified Audience Reviews ({reviews.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-3xl bg-[#0f0826] border border-purple-900/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-amber-300 font-mono">{rev.author}</span>
                        {rev.verified && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/40">
                            VERIFIED VIEW
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-amber-400 font-bold">
                        {'★'.repeat(Math.round(rev.rating))}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {rev.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default AudienceTheaterPortal;
