import React, { useState, useEffect } from 'react';
import { UserProfile, ReadingClub, ClubMessage, Book, NotificationItem } from '../types';
import { Users, Send, User, Trophy, Shield, HelpCircle, MessageSquare, Plus, Bell, Check, BookOpen, MessageCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SocialSectionProps {
  booksRef: Book[];
  onShowToast: (text: string, type: 'success' | 'info' | 'error') => void;
  onAddNotification: (text: string, category: 'social' | 'sync' | 'achievement' | 'reading') => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Prince Gambo',
  role: 'Venerable Archivist',
  avatar: '🦉',
  readingSpeed: 275, // words per minute
  achievementBadges: [
    { title: 'Labyrinth Explorer', desc: 'Curated 3+ fantasy novels on a single shelf', iconName: '🗝️' },
    { title: 'Mossy Folio Sage', desc: 'Read more than 500 cumulative pages', iconName: '🌿' },
    { title: 'Nocturnal Reader', desc: 'Successfully logged writing at midnight hours', iconName: '🌙' }
  ],
  joinedClubs: ['club-1'],
  readGoal: 4
};

const DEFAULT_CLUBS: ReadingClub[] = [
  {
    id: 'club-1',
    name: 'The Oakwood Circle',
    description: 'A cozy corner dedicated to Magical Realism, Gothic secrets, and atmospheric fiction. We discuss Ruiz Zafón, Gabriel García Márquez, and atmospheric world-weaving.',
    category: 'Fiction',
    activeBook: 'The Shadow of the Wind',
    membersCount: 42,
    bannerColor: 'from-[#4F7057] to-[#1F2F20]',
    messages: [
      { id: 'm-1', author: 'Clarissa Pine', avatar: '🌲', text: "Has anyone completed Chapter 4 of Zafón's masterpiece yet? The descriptions of the Cemetery of Forgotten Books are so immersive, they make me feel like I can smell the old leather bindings!", timestamp: '10:45 AM' },
      { id: 'm-2', author: 'Cyril Thorne', avatar: '☕', text: "Absolutely, Clarissa! It feels like moving through a fog-ridden dream. Zafón's atmospheric prose is just unmatched. Highly recommend reading with some warm tea.", timestamp: '10:52 AM' }
    ]
  },
  {
    id: 'club-2',
    name: 'The Sage Scrolls',
    description: 'An exchange of deep reviews evaluating Sapiens, global histories, cognitive evolutions, scientific trends, and modern biographies.',
    category: 'Nonfiction',
    activeBook: 'Sapiens: A Brief History of Humankind',
    membersCount: 29,
    bannerColor: 'from-[#6C8E74] to-[#2E3C32]',
    messages: [
      { id: 'm-3', author: 'Harlan Vance', avatar: '📊', text: "Harari's section on how imagined realities allowed humans to cooperate at a scale of millions is so mindboggling. This is truly changing my outlook on modern institutions.", timestamp: 'Yesterday' }
    ]
  },
  {
    id: 'club-3',
    name: 'Highstorm Chroniclers',
    description: 'For seekers of massive worldbuilding, hard magic grids, and heroic standpoints. Focused primarily on Brandon Sanderson, Rothfuss, and Jordan.',
    category: 'Epic Fantasy',
    activeBook: 'The Way of Kings',
    membersCount: 56,
    bannerColor: 'from-[#3A5F43] to-[#121B13]',
    messages: [
      { id: 'm-4', author: 'Kaladin_Adept', avatar: '⚡', text: "The concept of Spren reacting to human emotions is brilliant. It makes the ecology feel alive!", timestamp: '3 days ago' }
    ]
  }
];

export default function SocialSection({ booksRef, onShowToast, onAddNotification }: SocialSectionProps) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(profile.name);
  const [profileReadingSpeed, setProfileReadingSpeed] = useState(profile.readingSpeed);
  const [profileReadGoal, setProfileReadGoal] = useState(profile.readGoal);

  const [clubs, setClubs] = useState<ReadingClub[]>(DEFAULT_CLUBS);
  const [activeClubId, setActiveClubId] = useState<string>('club-1');
  const [messageText, setMessageText] = useState('');

  // Track comments list under general community reviews
  const [communityReviews, setCommunityReviews] = useState([
    { id: 'rev-1', user: 'Sylvia Moss', avatar: '🦔', bookTitle: 'The Ocean at the End of the Lane', text: 'Stunningly nostalgic. Perfectly nests fears of childhood into magical settings. 5 stars!', likes: 8, liked: false, timestamp: Date.now() - 3600000 * 2 },
    { id: 'rev-2', user: 'Arthur Wood', avatar: '🦊', bookTitle: 'The Hobbit', text: 'Classic comfort reading. Smaug’s golden belly gets me every single time. A cozy masterpiece.', likes: 14, liked: false, timestamp: Date.now() - 3600000 * 5 }
  ]);
  const [critiqueSortBy, setCritiqueSortBy] = useState<'newest' | 'oldest' | 'likes'>('newest');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewText, setNewReviewText] = useState('');

  const sortedCommunityReviews = React.useMemo(() => {
    return [...communityReviews].sort((a, b) => {
      if (critiqueSortBy === 'newest') {
        return (b.timestamp || 0) - (a.timestamp || 0);
      }
      if (critiqueSortBy === 'oldest') {
        return (a.timestamp || 0) - (b.timestamp || 0);
      }
      if (critiqueSortBy === 'likes') {
        return b.likes - a.likes;
      }
      return 0;
    });
  }, [communityReviews, critiqueSortBy]);

  const activeClub = clubs.find(c => c.id === activeClubId) || clubs[0];

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      name: profileName || prev.name,
      readingSpeed: profileReadingSpeed || prev.readingSpeed,
      readGoal: profileReadGoal || prev.readGoal
    }));
    setIsEditingProfile(false);
    onShowToast('UserProfile updated successfully!', 'success');
    onAddNotification('Syncing edited profile details across registered Cloud systems!', 'sync');
  };

  const handleJoinClub = (clubId: string) => {
    setProfile(prev => {
      const isJoined = prev.joinedClubs.includes(clubId);
      let updated: string[];
      if (isJoined) {
        updated = prev.joinedClubs.filter(id => id !== clubId);
        onShowToast(`Left "${clubs.find(c => c.id === clubId)?.name}" club circle.`, 'info');
      } else {
        updated = [...prev.joinedClubs, clubId];
        onShowToast(`Joined "${clubs.find(c => c.id === clubId)?.name}" club circle! Welcome! ✨`, 'success');
        onAddNotification(`You have been admitted to ${clubs.find(c => c.id === clubId)?.name}!`, 'social');
      }
      return { ...prev, joinedClubs: updated };
    });

    // Update member count organically
    setClubs(prev => prev.map((c) => {
      if (c.id === clubId) {
        const joined = profile.joinedClubs.includes(clubId);
        return {
          ...c,
          membersCount: c.membersCount + (joined ? -1 : 1)
        };
      }
      return c;
    }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const userMsg: ClubMessage = {
      id: `msg-${Date.now()}`,
      author: profile.name,
      avatar: profile.avatar,
      text: messageText,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };

    // Append message to active club
    setClubs(prev => prev.map(c => {
      if (c.id === activeClubId) {
        return {
          ...c,
          messages: [...c.messages, userMsg]
        };
      }
      return c;
    }));

    const textSent = messageText;
    setMessageText('');
    onShowToast('Message dispatched to club journal thread!', 'success');

    // Simulate reactive AI-co-reader response logic with beautiful literature content
    setTimeout(() => {
      let automatedText = "Fascinating comment! Within the realm of early bibliotherapy, that resonates deeply. Let's see what the other Oakwood participants think!";
      if (activeClubId === 'club-1') {
        if (textSent.toLowerCase().includes('zafon') || textSent.toLowerCase().includes('shadow')) {
          automatedText = "Ah! Speaking of Carlos Ruiz Zafón, remember Julian Carax's core quote: 'Every book has a soul. The soul of the person who wrote it, and those who read it and live and dream with it.' Truly haunting!";
        } else {
          automatedText = "Indeed! Magical realism relies heavily on integrating enchanted elements smoothly with mundane realities, making the mossy forests feel deeply alive!";
        }
      } else if (activeClubId === 'club-2') {
        automatedText = "Precisely. Reflecting on Harari's thesis, human myths created the foundation for robust collaborative achievements. The agricultural revolution was indeed a trap of domesticating wheat, in retrospect!";
      } else if (activeClubId === 'club-3') {
        automatedText = "Stormfather! The way Sanderson coordinates Spren entities with the Oathpact outlines represents peak modular high magic structure. A beautiful analysis!";
      }

      const botMsg: ClubMessage = {
        id: `msg-bot-${Date.now()}`,
        author: 'Cyrus Pine Archivist',
        avatar: '🌳',
        text: automatedText,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        isAI: true
      };

      setClubs(prev => prev.map(c => {
        if (c.id === activeClubId) {
          return {
            ...c,
            messages: [...c.messages, botMsg]
          };
        }
        return c;
      }));

      onAddNotification(`New message from Cyrus Pine in "${activeClub.name}"`, 'social');
      onShowToast(`New message in ${activeClub.name}`, 'info');
    }, 1500);
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewText.trim()) return;

    const freshRev = {
      id: `rev-${Date.now()}`,
      user: profile.name,
      avatar: profile.avatar,
      bookTitle: newReviewTitle,
      text: newReviewText,
      likes: 0,
      liked: false,
      timestamp: Date.now()
    };

    setCommunityReviews(prev => [freshRev, ...prev]);
    onShowToast('Community log posted successfully!', 'success');
    onAddNotification(`You published a critique for "${newReviewTitle}"`, 'reading');
    setNewReviewTitle('');
    setNewReviewText('');
  };

  const handleToggleLike = (id: string) => {
    setCommunityReviews(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          liked: !r.liked,
          likes: r.likes + (r.liked ? -1 : 1)
        };
      }
      return r;
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="literary-exchange-grid">
      
      {/* LEFT COLUMN: User Profile & Statistics Overview (4 Cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-natural-card border border-natural-border dark:border-[#1E3023] rounded-2xl p-6 shadow-sm transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4F7057] to-[#83A98B]" />
          
          <div className="flex items-center gap-4.5 pb-4 border-b border-natural-border dark:border-[#1F3323] mb-5">
            <span className="text-4xl bg-natural-card dark:bg-[#1E3023] w-14 h-14 rounded-2xl flex items-center justify-center border border-natural-border dark:border-[#203324] shadow-inner select-none">
              {profile.avatar}
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-natural-text leading-tight">{profile.name}</h3>
              <p className="text-[10px] font-sans text-natural-accent uppercase tracking-widest font-extrabold mt-0.5">{profile.role}</p>
            </div>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-natural-accent">Archivist Pen Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-white dark:bg-[#1E3023] border border-natural-border dark:border-[#1C291E] rounded-lg p-2 text-natural-text"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-natural-accent">Speed (WPM)</label>
                  <input
                    type="number"
                    min="100"
                    max="1000"
                    value={profileReadingSpeed}
                    onChange={(e) => setProfileReadingSpeed(Number(e.target.value))}
                    className="w-full bg-white dark:bg-[#1E3023] border border-natural-border dark:border-[#1C291E] rounded-lg p-2 text-natural-text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-natural-accent">Goals (Vols/Mo)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={profileReadGoal}
                    onChange={(e) => setProfileReadGoal(Number(e.target.value))}
                    className="w-full bg-white dark:bg-[#1E3023] border border-natural-border dark:border-[#1C291E] rounded-lg p-2 text-natural-text"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-black/20 dark:hover:bg-black/40 text-neutral-800 dark:text-[#E2E8E4] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-natural-accent hover:opacity-90 text-white font-bold"
                >
                  Save Settings
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Profile statistics cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-natural-bg dark:bg-[#1E3023] rounded-xl border border-natural-border dark:border-transparent text-center">
                  <span className="block text-[9px] font-sans text-natural-accent uppercase tracking-widest font-bold">Speed Gauge</span>
                  <span className="font-mono text-lg font-black text-natural-text">{profile.readingSpeed}</span>
                  <span className="text-[10px] text-natural-accent"> WPM</span>
                </div>
                <div className="p-3 bg-natural-bg dark:bg-[#1E3023] rounded-xl border border-natural-border dark:border-transparent text-center">
                  <span className="block text-[9px] font-sans text-natural-accent uppercase tracking-widest font-bold">Monthly Target</span>
                  <span className="font-mono text-lg font-black text-natural-text">{profile.readGoal}</span>
                  <span className="text-[10px] text-natural-accent"> books</span>
                </div>
              </div>

              {/* Badges container */}
              <div className="space-y-2">
                <span className="block text-[10px] font-sans font-black uppercase text-[#4F7057] pl-0.5 tracking-wider">
                  Accolades & Seals ({profile.achievementBadges.length})
                </span>
                <div className="space-y-1.5">
                  {profile.achievementBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-[#1E3023]/20 rounded-xl border border-neutral-100 dark:border-transparent">
                      <span className="text-xl bg-white dark:bg-[#1C291E] w-8 h-8 rounded-lg flex items-center justify-center border border-neutral-200/40 dark:border-transparent scale-90">
                        {badge.iconName}
                      </span>
                      <div>
                        <h4 className="font-sans text-xs font-bold text-natural-text leading-tight">{badge.title}</h4>
                        <p className="text-[9px] text-[#4F7057] dark:text-[#83A98B] mt-0.5">{badge.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsEditingProfile(true)}
                className="w-full py-2 bg-natural-bg dark:bg-black/20 hover:bg-natural-accent hover:text-white border border-natural-border dark:border-[#203324] text-natural-accent rounded-xl text-xs font-sans font-bold transition-all duration-150 cursor-pointer text-center"
              >
                Modify Personal Dossier
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Reading Clubs & General Exchange forums (8 Cols) */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Hub Directory Lists (5 Cols in subgrid) */}
        <div className="bg-white dark:bg-natural-card border border-natural-border dark:border-[#1E3023] rounded-2xl p-5 md:col-span-5 space-y-4 shadow-sm">
          <div>
            <h4 className="font-serif text-lg font-bold text-natural-text italic flex items-center gap-1.5">
              <Users className="w-4 h-4 text-natural-accent" />
              Reading Guilds
            </h4>
            <p className="text-[10px] font-sans text-natural-accent uppercase tracking-widest leading-none mt-1">Literary circles</p>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar">
            {clubs.map((club) => {
              const active = club.id === activeClubId;
              const joined = profile.joinedClubs.includes(club.id);
              return (
                <div
                  key={club.id}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    active 
                      ? 'border-natural-accent bg-[#4F7057]/10 dark:bg-[#83A98B]/10' 
                      : 'border-natural-border dark:border-[#1E3023] hover:border-natural-accent/50 bg-transparent'
                  }`}
                  onClick={() => setActiveClubId(club.id)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h5 className="font-serif text-xs font-extrabold text-natural-text leading-none">{club.name}</h5>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinClub(club.id);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[8px] font-sans font-black uppercase tracking-wider transition-colors ${
                        joined
                          ? 'bg-emerald-500 text-white'
                          : 'bg-natural-card dark:bg-[#1E3023] text-[#4F7057] dark:text-[#83A98B] border border-natural-border dark:border-transparent'
                      }`}
                    >
                      {joined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                  <p className="text-[10px] text-natural-accent line-clamp-2 mt-1 leading-normal">
                    {club.description}
                  </p>
                  <div className="flex justify-between items-center text-[9px] font-mono text-natural-accent mt-2 border-t border-natural-border/30 pt-1.5">
                    <span>Active: {club.activeBook.slice(0,18)}...</span>
                    <span className="font-sans font-bold text-[#4F7057] dark:text-[#83A98B]">👥 {club.membersCount} connected</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Hub Chat Stream & Comments (7 Cols in subgrid) */}
        <div className="bg-[#FCF9F5] dark:bg-zinc-900/30 border border-[#E3EAE0] dark:border-[#1C291E] rounded-2xl p-5 md:col-span-7 flex flex-col justify-between min-h-[420px] shadow-sm">
          <div>
            <div className={`p-4 rounded-xl text-white bg-gradient-to-r ${activeClub.bannerColor} relative overflow-hidden mb-4 shadow-sm`}>
              <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  {activeClub.category} Forum
                </span>
                <span className="text-[10px] font-sans text-[#ECEFEA] font-bold">
                  {profile.joinedClubs.includes(activeClub.id) ? '✓ Active Member' : 'Guest mode'}
                </span>
              </div>
              <h4 className="font-serif text-base font-black italic mt-1">{activeClub.name}</h4>
              <p className="text-[10px] text-zinc-100/80 italic mt-0.5 font-medium leading-relaxed max-w-sm line-clamp-2">{activeClub.description}</p>
            </div>

            {/* Chat Messages */}
            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1 select-text custom-scrollbar mb-4">
              {activeClub.messages.map((m) => (
                <div key={m.id} className={`flex items-start gap-2.5 max-w-md ${m.author === profile.name ? 'ml-auto flex-row-reverse text-right' : 'mr-auto'}`}>
                  <span className="w-7 h-7 bg-white dark:bg-[#1E3023] border border-neutral-200 dark:border-transparent shadow-xs rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                    {m.avatar}
                  </span>
                  <div className={`p-2.5 rounded-xl border leading-relaxed text-[11px] ${
                    m.author === profile.name 
                      ? 'bg-[#4F7057] text-[#FCF9F5] border-transparent rounded-tr-none' 
                      : m.isAI
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 rounded-tl-none dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-[#E2E8E4]'
                      : 'bg-white border-[#E3EAE0] text-natural-text rounded-tl-none dark:bg-black/20 dark:border-transparent'
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-0.5 text-[9px] font-sans font-bold">
                      <span className={m.author === profile.name ? 'text-zinc-200' : 'text-natural-accent'}>
                        {m.author} {m.isAI && <span className="bg-emerald-500 text-white font-mono rounded text-[8px] px-1 ml-0.5">Clerk</span>}
                      </span>
                      <span className="opacity-60 text-[8px] font-mono">{m.timestamp}</span>
                    </div>
                    <p className="font-serif antialiased leading-normal">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prompt Entry Box */}
          <form onSubmit={handleSendMessage} className="flex gap-2 items-center border-t border-natural-border/30 pt-3">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={!profile.joinedClubs.includes(activeClub.id)}
              placeholder={profile.joinedClubs.includes(activeClub.id) ? "Drip down literary thoughts to club logs..." : "Join this club to start responding"}
              className="flex-1 bg-white dark:bg-[#1E3023] border border-[#E3EAE0] dark:border-transparent rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-natural-accent text-natural-text"
            />
            <button
              type="submit"
              disabled={!messageText.trim() || !profile.joinedClubs.includes(activeClub.id)}
              className="p-2 py-2 bg-natural-accent text-white rounded-xl shadow-xs hover:opacity-90 transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

      {/* BOTTOM SEGMENT: Community Critique Wall & Notes Feed */}
      <div className="lg:col-span-12 bg-white dark:bg-natural-card border border-natural-border dark:border-[#1E3023] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-natural-border/40 pb-4 mb-5">
          <div>
            <h4 className="font-serif text-lg font-bold text-natural-text flex items-center gap-1.5 italic">
              <MessageSquare className="w-4.5 h-4.5 text-natural-accent" />
              Community Critique Wall
            </h4>
            <p className="text-[10px] font-sans text-natural-accent uppercase tracking-widest leading-none mt-1">Marginalia commentary & book reviews</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans uppercase font-bold text-natural-accent">Sort Reviews:</span>
            <select
              value={critiqueSortBy}
              onChange={(e) => setCritiqueSortBy(e.target.value as any)}
              className="bg-neutral-100 dark:bg-[#1E3023] border border-natural-border dark:border-transparent rounded-lg px-2.5 py-1 text-xs font-bold text-natural-text outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Post critique form */}
          <form onSubmit={handlePostReview} className="md:col-span-4 space-y-3.5 font-sans text-xs bg-neutral-50 dark:bg-neutral-900/10 border border-neutral-100 dark:border-[#1E3023] rounded-xl p-4 shadow-inner">
            <span className="block text-[10px] font-sans font-black uppercase text-[#4F7057] pl-0.5 tracking-wider">Log Custom Book Review</span>
            
            <div className="space-y-1">
              <label className="block text-[10px] font-sans uppercase font-bold text-natural-accent">Book Title</label>
              <input
                type="text"
                required
                value={newReviewTitle}
                onChange={(e) => setNewReviewTitle(e.target.value)}
                placeholder="e.g. Sapiens"
                className="w-full bg-white dark:bg-[#1E3023] border border-natural-border dark:border-transparent rounded-lg p-2.5 text-natural-text text-xs"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-[10px] font-sans uppercase font-bold text-natural-accent">Review Excerpts</label>
              <textarea
                required
                rows={3}
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Publish thoughts on style, plot, or themes..."
                className="w-full bg-white dark:bg-[#1E3023] border border-natural-border dark:border-transparent rounded-lg p-2 text-natural-text text-xs font-serif leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-natural-accent hover:opacity-90 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-1 cursor-pointer uppercase text-[10px]"
            >
              <Plus className="w-3.5 h-3.5" /> Publish critique
            </button>
          </form>

          {/* Social review timeline */}
          <div className="md:col-span-8 space-y-3">
            {sortedCommunityReviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-white dark:bg-zinc-900/10 border border-natural-border dark:border-[#1E3023] rounded-xl flex items-start gap-3.5 shadow-xs transition-colors hover:bg-neutral-50/40 select-text">
                <span className="text-2xl bg-natural-card dark:bg-[#1C291E] w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 select-none scale-90">
                  {rev.avatar}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-natural-text">{rev.user}</span>
                    <span className="text-[10px] bg-natural-accent/10 text-natural-accent px-2 py-0.5 rounded font-mono font-bold">{rev.bookTitle}</span>
                  </div>
                  <p className="font-serif italic text-xs text-natural-text/90 leading-relaxed pr-2">
                    "{rev.text}"
                  </p>
                  <div className="flex justify-between items-center pt-2 text-[10px] text-natural-accent font-sans mt-1">
                    <button
                      onClick={() => handleToggleLike(rev.id)}
                      className={`flex items-center gap-1 font-bold ${rev.liked ? 'text-red-500' : 'hover:text-red-500'}`}
                    >
                      <span>♥</span>
                      <span>{rev.likes} literary likes</span>
                    </button>
                    <span className="text-[9px] opacity-60">Posted recently</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
