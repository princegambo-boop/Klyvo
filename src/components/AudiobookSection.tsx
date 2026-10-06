import React, { useState, useEffect, useRef } from 'react';
import { AudiobookTrack, Book } from '../types';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Disc, Radio, RefreshCw, AudioLines, VolumeX, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getBookContent } from '../bookContent';

interface AudiobookSectionProps {
  booksRef: Book[];
  offlineMode: boolean;
  onShowToast: (text: string, type: 'success' | 'info' | 'error') => void;
  // Callback when audiobook plays to synchronize mini-player at footer
  activeTrackId: string | null;
  setActiveTrackId: (id: string | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playbackProgress: number; // 0 to 100
  setPlaybackProgress: (p: number) => void;
}

const DEFAULT_AUDIOBOOKS: AudiobookTrack[] = [
  {
    id: 'audio-1',
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    totalDuration: 520,
    narrator: 'Isabella Vance (Mellow British)',
    coverAccent: '#4F7057'
  },
  {
    id: 'audio-2',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    totalDuration: 640,
    narrator: 'Cyril Thorne (Deep Scholar)',
    coverAccent: '#83A98B'
  },
  {
    id: 'audio-3',
    title: 'The Way of Kings',
    author: 'Brandon Sanderson',
    totalDuration: 1200,
    narrator: 'Harlan Vance (Epic Saga Voice)',
    coverAccent: '#D3DAD1'
  }
];

export default function AudiobookSection({
  booksRef,
  offlineMode,
  onShowToast,
  activeTrackId,
  setActiveTrackId,
  isPlaying,
  setIsPlaying,
  playbackProgress,
  setPlaybackProgress
}: AudiobookSectionProps) {
  const [tracks, setTracks] = useState<AudiobookTrack[]>(DEFAULT_AUDIOBOOKS);
  const [selectedTrackId, setSelectedTrackId] = useState<string>(DEFAULT_AUDIOBOOKS[0].id);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80); // range 0 to 100
  const [activeVoice, setActiveVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  // Local track state synchronized back to props
  const [localProgress, setLocalProgress] = useState<number>(0);

  // Background listening modes
  const [bgListening, setBgListening] = useState<boolean>(true);

  // Excerpt playback references
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  const activeTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0];

  // Track selection changes reset progress bars cleanly
  useEffect(() => {
    setLocalProgress(0);
    setPlaybackProgress(0);
  }, [selectedTrackId]);

  // Synchronize local states upward to parent context
  useEffect(() => {
    setPlaybackProgress(localProgress);
  }, [localProgress]);

  // Synchronize incoming playbackProgress (e.g. from seeking slider scrubs) back down to local state
  useEffect(() => {
    if (Math.abs(localProgress - playbackProgress) > 1) {
      setLocalProgress(playbackProgress);
    }
  }, [playbackProgress]);

  // Synthesize text selection for reading based on active book title
  const getNarrationText = () => {
    const detail = getBookContent(activeTrack.title);
    if (detail.chapters && detail.chapters.length > 0) {
      return detail.chapters[0].excerpt.slice(0, 320) + "...";
    }
    return "This is the classic, hand-crafted translation of the prose written down by the curators of the Klyvo Literary Sanctuary, preserved under pine bindings.";
  };

  // Keep progress moving elegantly when playing
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = window.setInterval(() => {
        setLocalProgress((prev) => {
          if (prev >= 100) {
            handleStopSpeech();
            onShowToast(`Completed listening to "${activeTrack.title}" chapter sample!`, 'success');
            return 0;
          }
          return prev + (0.5 * playbackSpeed);
        });
      }, 1000);
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    }
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, activeTrack]);

  // Handle native Web Speech Synthesis matching rates
  const handleStartSpeech = () => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Reset previous running speeches
        
        const targetText = getNarrationText();
        const utterance = new SpeechSynthesisUtterance(targetText);
        
        // Speed & Volume rate sync
        utterance.rate = playbackSpeed;
        utterance.volume = isMuted ? 0 : (volume / 100) * 0.85;

        utterance.onend = () => {
          // Native ended, but we let our progress interval naturally finish the chapter timeline cleanly
          console.log("SpeechSynthesis completed speaking excerpt.");
        };

        utterance.onerror = (e) => {
          // Inside preview environments/iframes, speechSynthesis can throw an error due to sandboxing
          // We capture it but DO NOT pause isPlaying, so the visual timeline and simulated audio flow flawlessly!
          console.warn("SpeechSynthesis error (common under sandboxed container):", e);
        };

        speechUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("SpeechSynthesis speak failed:", err);
      }
      
      setActiveTrackId(activeTrack.id);
      setIsPlaying(true);
      onShowToast(`Streaming Narrator for "${activeTrack.title}"`, 'info');
    } else {
      // Fallback
      setActiveTrackId(activeTrack.id);
      setIsPlaying(true);
      onShowToast(`Narrating Excerpt (System Voice Unavailable)`, 'info');
    }
  };

  const handlePauseSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
  };

  const handleResumeSpeech = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    } else {
      handleStartSpeech();
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  // Watch for speed and volume updates and adjust utterance in real-time
  useEffect(() => {
    if (isPlaying) {
      // Adjust speech parameters gracefully by re-starting narration
      handleStartSpeech();
    }
  }, [playbackSpeed, isMuted, volume]);

  // Clean speech synthesis if unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const totalTimeStr = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const elapsedSeconds = Math.round((playbackProgress / 100) * activeTrack.totalDuration);

  // Sync additional shelf books into audiobook listing if unique!
  useEffect(() => {
    const merged = [...DEFAULT_AUDIOBOOKS];
    booksRef.forEach((b) => {
      const exists = merged.some(x => x.title.toLowerCase() === b.title.toLowerCase());
      if (!exists) {
        merged.push({
          id: `audio-${b.id}`,
          title: b.title,
          author: b.author,
          totalDuration: b.totalPages * 1.5, // 1.5s per page for simulated audiobook ratio
          narrator: 'Klyvo Scholar Voice Synth',
          coverAccent: '#6C8E74'
        });
      }
    });
    setTracks(merged);
  }, [booksRef]);

  return (
    <section className="bg-white dark:bg-natural-card border border-natural-border dark:border-[#1E3023] rounded-2xl p-6 shadow-sm transition-all duration-300 relative overflow-hidden" id="audiobook-sanctuary">
      {/* Absolute Glow Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-natural-accent/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-natural-border dark:border-[#203324] pb-4 mb-5">
        <div>
          <h3 className="font-serif text-2xl font-black text-natural-text placeholder-opacity-50 flex items-center gap-2 italic">
            <Radio className="w-5 h-5 text-natural-accent animate-pulse" />
            Audiobook Sanctuary
          </h3>
          <p className="text-xs text-natural-accent font-sans mt-0.5 uppercase tracking-wider font-bold">
            Immersive Whispers & Acoustic Narrations
          </p>
        </div>
        
        {/* Connection Mode Indicator */}
        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          <span className={`inline-block w-2.5 h-2.5 rounded-full animate-pulse ${offlineMode ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-natural-accent">
            {offlineMode ? 'Offline Playback Mode' : 'Online Stream Enabled'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Track Directory Selection */}
        <div className="lg:col-span-5 space-y-3">
          <span className="block text-[10px] font-sans font-black uppercase tracking-widest text-[#4F7057] pl-1">
            Narrations Directory ({tracks.length} Recs)
          </span>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1.5 custom-scrollbar">
            {tracks.map((track) => {
              const acts = track.id === selectedTrackId;
              const globalPlaying = acts && isPlaying;
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    handleStopSpeech();
                    setSelectedTrackId(track.id);
                    setPlaybackProgress(0);
                    // Let user double-tap to auto play
                    if (acts && !globalPlaying) {
                      handleStartSpeech();
                    }
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                    acts
                      ? 'border-natural-accent bg-natural-accent/15 dark:bg-natural-accent/20'
                      : 'border-natural-border dark:border-[#1E3023] hover:border-natural-accent/50 hover:bg-neutral-50 dark:hover:bg-neutral-900 bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="relative">
                      {globalPlaying ? (
                        <div className="w-9 h-9 bg-natural-accent text-white rounded-lg flex items-center justify-center spinning-gear animate-spin">
                          <Disc className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 bg-natural-card dark:bg-[#1E3023] border border-natural-border dark:border-transparent text-natural-accent rounded-lg flex items-center justify-center">
                          <AudioLines className="w-4 h-4 text-natural-accent/85" />
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <h4 className="font-serif text-sm font-bold text-natural-text leading-snug truncate">
                        {track.title}
                      </h4>
                      <p className="font-sans text-[11px] text-natural-accent truncate leading-none mt-1">
                        narrated by {track.narrator}
                      </p>
                    </div>
                  </div>
                  
                  {acts && globalPlaying && (
                    <span className="flex gap-0.5 items-end h-3 pl-1 pr-1.5">
                      <span className="w-0.5 h-2 bg-natural-accent rounded-full animate-[bounce_0.6s_infinite]" />
                      <span className="w-0.5 h-3 bg-natural-accent rounded-full animate-[bounce_0.8s_infinite_0.15s]" />
                      <span className="w-0.5 h-1.5 bg-natural-accent rounded-full animate-[bounce_0.5s_infinite_0.3s]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Immersive Playback Chassis */}
        <div className="lg:col-span-7 bg-[#FCF9F5] dark:bg-natural-card border border-[#E4EAE1] dark:border-[#1C291E] rounded-2xl p-6 relative flex flex-col justify-between min-h-[290px] shadow-inner">
          {/* Cover decorative bindings */}
          <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-neutral-900/5 dark:bg-white/5" />

          {/* Current track showcase */}
          <div className="flex items-center gap-4 border-b border-[#D6DBD2] dark:border-[#1E3023] pb-4">
            <div className={`w-16 h-22 rounded-md bg-gradient-to-br from-[#121B13] to-[#4F7057] shadow-md flex items-center justify-center text-white text-xs relative overflow-hidden flex-shrink-0 ${isPlaying ? 'glowing-moss-btn animate-pulse-slow' : ''}`}>
              <Disc className={`w-8 h-8 text-[#ECEFEA]/80 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              {/* Spreading ambient nodes */}
              {isPlaying && (
                <div className="absolute inset-0 bg-natural-accent/15 animate-ping rounded-full" />
              )}
            </div>
            
            <div className="space-y-1 truncate-text truncate">
              <span className="inline-flex items-center gap-1 bg-[#4F7057]/15 dark:bg-[#83A98B]/20 text-[#4F7057] dark:text-[#83A98B] px-2 py-0.5 rounded text-[9px] uppercase font-mono font-bold tracking-widest leading-none">
                <Sparkles className="w-3 h-3 text-natural-accent inline" /> Acoustic Excerpt
              </span>
              <h3 className="font-serif text-lg font-black text-natural-text truncate leading-tight mt-1">
                {activeTrack.title}
              </h3>
              <p className="font-sans text-xs text-natural-accent truncate italic font-medium leading-none">
                by {activeTrack.author} — Read by {activeTrack.narrator}
              </p>
            </div>
          </div>

          {/* Narration interactive visualizer transcript text */}
          <div className="my-3 py-2 bg-white/70 dark:bg-black/10 rounded-xl px-4 border border-dashed border-[#D6DBD2] dark:border-[#1E3023] text-center">
            <p className="font-serif text-xs text-natural-text italic leading-relaxed line-clamp-2">
              "{getNarrationText()}"
            </p>
          </div>

          {/* Acoustic Waveform Visualization Panel when Playing */}
          <div className="h-8 flex justify-center items-center gap-[4px] px-4 my-2">
            {isPlaying ? (
              Array.from({ length: 24 }).map((_, i) => {
                const randomDelay = Math.random() * 0.8;
                const randomHeight = 15 + Math.random() * 20;
                return (
                  <motion.div
                    key={i}
                    animate={{ height: [4, randomHeight, 4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + randomDelay,
                      ease: "easeInOut"
                    }}
                    className="w-[3px] bg-natural-accent rounded-full"
                  />
                );
              })
            ) : (
              <div className="w-full h-[2px] bg-natural-accent/30 rounded-full flex items-center justify-center">
                <span className="bg-[#FCF9F5] dark:bg-natural-card px-3 text-[9px] font-sans font-black uppercase text-natural-accent/80 tracking-widest">
                  Narration Suspended
                </span>
              </div>
            )}
          </div>

          {/* Timeline scrubbing interface */}
          <div className="space-y-1 pt-2">
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={playbackProgress}
                onChange={(e) => {
                  setPlaybackProgress(Number(e.target.value));
                  if (isPlaying) {
                    // Force Speech Synthesis update if scrubbed
                    handleStartSpeech();
                  }
                }}
                className="w-full accent-natural-accent cursor-pointer bg-natural-border dark:bg-[#1C291E] h-1 rounded-lg outline-none transition-all focus:ring-1 focus:ring-natural-accent"
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-mono text-natural-text opacity-70">
              <span>{totalTimeStr(elapsedSeconds)}</span>
              <span>{totalTimeStr(activeTrack.totalDuration)}</span>
            </div>
          </div>

          {/* Playback Settings Controls Row */}
          <div className="flex justify-between items-center pt-3 mt-1 border-t border-[#D6DBD2] dark:border-[#1E3023] gap-2">
            {/* Speed selection */}
            <div className="flex items-center gap-1.5 font-sans">
              <span className="text-[9px] font-sans font-black text-natural-accent uppercase tracking-wider">Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-white dark:bg-[#1E3023] border border-natural-border dark:border-transparent rounded-md px-1.5 py-0.5 text-[10px] font-bold text-natural-text outline-none cursor-pointer"
              >
                <option value="0.75">0.75x</option>
                <option value="1">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2.0x</option>
              </select>
            </div>

            {/* Main Playback Controls */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setPlaybackProgress(0);
                  if (isPlaying) handleStartSpeech();
                }}
                className="p-1.5 rounded-lg border border-natural-border dark:border-transparent bg-white dark:bg-[#1E3023] text-natural-accent hover:text-natural-text hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Restart Chapter Sample"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {isPlaying ? (
                <button
                  onClick={handlePauseSpeech}
                  className="p-2.5 rounded-xl bg-natural-accent text-white glowing-moss-btn hover:bg-natural-highlight transition-all duration-150 cursor-pointer flex items-center justify-center"
                >
                  <Pause className="w-4 h-4 fill-white" />
                </button>
              ) : (
                <button
                  onClick={handleResumeSpeech}
                  className="p-2.5 rounded-xl bg-natural-accent text-white glowing-moss-btn hover:bg-natural-highlight transition-all duration-150 cursor-pointer flex items-center justify-center animate-pulse"
                >
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </button>
              )}

              {/* Background Listening Toggle */}
              <button
                onClick={() => {
                  setBgListening(!bgListening);
                  onShowToast(bgListening ? 'Simulated background listening disabled' : 'Background listening simulation active!', 'info');
                }}
                className={`p-1.5 rounded-lg border font-bold text-[9px] uppercase font-sans tracking-wide transition-all ${
                  bgListening
                    ? 'border-natural-accent text-[#F8F9F5] bg-natural-accent'
                    : 'border-natural-border dark:border-transparent bg-white dark:bg-[#1E3023] text-natural-accent'
                }`}
                title="Simulated Background Listening Model"
              >
                BG listen: {bgListening ? 'On' : 'Off'}
              </button>
            </div>

            {/* Premium Volume Controls */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#1E3023] border border-natural-border dark:border-transparent rounded-lg px-2 py-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-natural-accent hover:text-natural-text transition-colors cursor-pointer"
                title={isMuted ? "Unmute Narration" : "Mute Narration"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 h-1 accent-natural-accent cursor-pointer bg-neutral-200 dark:bg-[#1C291E] rounded-lg outline-none"
                title={`Volume: ${isMuted ? 0 : volume}%`}
              />
              <span className="text-[9px] font-mono font-bold text-natural-accent w-6 text-right">
                {isMuted ? 0 : volume}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
