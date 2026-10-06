import React, { useState, useEffect, useRef } from 'react';
import { Book } from '../types';
import { 
  X, 
  Calendar, 
  Edit3, 
  Check, 
  Star, 
  BookOpen, 
  Quote, 
  Notebook, 
  BookOpenCheck, 
  Bookmark, 
  Sparkles, 
  Settings2, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  CornerDownRight, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Trophy 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getBookContent } from '../bookContent';

interface ReviewModalProps {
  book: Book;
  onClose: () => void;
  onUpdateReview: (id: string, newReview: string) => void;
  initialTab?: 'journal' | 'reader';
  onUpdatePage?: (id: string, newPage: number) => void;
}

interface LocalComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  postedAt: string;
}

const SEEDED_COMMENTS: Record<string, LocalComment[]> = {
  'seed-1': [
    { id: 'c-1', author: 'Sylvia Moss', avatar: '🌲', text: 'This review perfectly captures the melancholy of Zafón\'s cemetery. Excellent reflections!', postedAt: '2 days ago' },
    { id: 'c-2', author: 'Cyril Thorne', avatar: '☕', text: 'I agree. The gothic, rainy atmosphere of Barcelona is practically another character in the novel.', postedAt: '1 day ago' }
  ],
  'seed-2': [
    { id: 'c-3', author: 'Harlan Vance', avatar: '📊', text: 'Stunning critique! The cognitive revolution section was definitely the highlight of the volume.', postedAt: '5 days ago' }
  ],
  'seed-3': [
    { id: 'c-4', author: 'Kaladin_Adept', avatar: '⚡', text: 'dalinar\'s chapters are indeed incredible! Your notes on the geological erosion are fantastic.', postedAt: '3 days ago' }
  ]
};

export default function ReviewModal({ book, onClose, onUpdateReview, initialTab = 'journal', onUpdatePage }: ReviewModalProps) {
  const [activeTab, setActiveTab] = useState<'journal' | 'reader'>(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState(book.review);
  const [readerLayout, setReaderLayout] = useState<'continuous' | 'paged'>('paged');
  const [hasFinishedReading, setHasFinishedReading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load book content
  const content = getBookContent(book.title);

  // Calculate initial chapter based on user's current progress page
  const getInitialChapterIndex = () => {
    if (!content.chapters || content.chapters.length === 0) return 0;
    const itemsCount = content.chapters.length;
    const progressPages = book.currentPage;
    const pagesPer = Math.ceil(book.totalPages / itemsCount) || 1;
    const computedIndex = Math.floor((progressPages - 1) / pagesPer);
    return Math.min(itemsCount - 1, Math.max(0, computedIndex));
  };

  const [activeChapterIndex, setActiveChapterIndex] = useState(getInitialChapterIndex);

  // E-reader adjustable customization states
  const [fontSize, setFontSize] = useState<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'>('base');
  const [fontStyle, setFontStyle] = useState<'serif' | 'sans' | 'mono' | 'dyslexic'>('serif');
  const [spacing, setSpacing] = useState<'normal' | 'relaxed' | 'loose'>('relaxed');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Comments state
  const [comments, setComments] = useState<LocalComment[]>(() => {
    return SEEDED_COMMENTS[book.id] || [
      { id: 'c-gen', author: 'Cyrus Oak', avatar: '🦉', text: 'An exquisite addition to our sanctuary library shelves!', postedAt: 'Just now' }
    ];
  });
  const [newCommentText, setNewCommentText] = useState('');

  // Auto-fading toast helper
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 25;
    if (isAtBottom && !hasFinishedReading) {
      setHasFinishedReading(true);
      triggerToast("Achievement Unlocked: Finished Book! 🎉");
      if (onUpdatePage && book.currentPage < book.totalPages) {
        onUpdatePage(book.id, book.totalPages);
      }
    }
  };

  const handleNextPage = () => {
    if (activeChapterIndex < content.chapters.length - 1) {
      const nextIndex = activeChapterIndex + 1;
      setActiveChapterIndex(nextIndex);
      triggerToast(`Chapter ${nextIndex + 1} Flip!`);
      
      if (onUpdatePage) {
        const pagesPer = Math.ceil(book.totalPages / content.chapters.length) || 1;
        const newPage = Math.min(book.totalPages, nextIndex * pagesPer + 1);
        onUpdatePage(book.id, newPage);
      }
    } else {
      if (!hasFinishedReading) {
        setHasFinishedReading(true);
        triggerToast("Achievement Unlocked: Finished Book! 🎉");
        if (onUpdatePage && book.currentPage < book.totalPages) {
          onUpdatePage(book.id, book.totalPages);
        }
      }
    }
  };

  const handlePrevPage = () => {
    if (activeChapterIndex > 0) {
      const prevIndex = activeChapterIndex - 1;
      setActiveChapterIndex(prevIndex);
      triggerToast(`Chapter ${prevIndex + 1} Flip!`);
      
      if (onUpdatePage) {
        const pagesPer = Math.ceil(book.totalPages / content.chapters.length) || 1;
        const newPage = Math.max(1, prevIndex * pagesPer + 1);
        onUpdatePage(book.id, newPage);
      }
    }
  };

  const handleSave = () => {
    onUpdateReview(book.id, editedReview);
    setIsEditing(false);
    triggerToast("Saved journal entry!");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const freshComment: LocalComment = {
      id: `comm-${Date.now()}`,
      author: 'Prince Gambo (You)',
      avatar: '🦉',
      text: newCommentText,
      postedAt: 'Just now'
    };

    setComments(prev => [...prev, freshComment]);
    setNewCommentText('');
    triggerToast("Posted margin scribbles!");
  };

  // Convert font settings to classes
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'xs': return 'text-xs';
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      case '2xl': return 'text-2xl';
      case 'base':
      default:
        return 'text-base';
    }
  };

  const getFontStyleClass = () => {
    switch (fontStyle) {
      case 'sans': return 'font-sans';
      case 'mono': return 'font-mono text-[13px]';
      case 'dyslexic': return 'font-dyslexic';
      case 'serif':
      default:
        return 'font-serif italic';
    }
  };

  const getSpacingClass = () => {
    switch (spacing) {
      case 'normal': return 'leading-normal';
      case 'loose': return 'leading-loose';
      case 'relaxed':
      default:
        return 'leading-relaxed';
    }
  };

  // Compile eBook contents to download instantly for offline reading list
  const handleDownloadOfflineBook = () => {
    try {
      let archive = `========================================================\n`;
      archive += `           KLYVO BOOK SANCTUARY OFFLINE PRESS           \n`;
      archive += `========================================================\n\n`;
      archive += `TITLE: ${book.title}\n`;
      archive += `AUTHOR: ${book.author}\n`;
      archive += `GENRE: ${book.genre} (${book.category})\n`;
      archive += `DOWNLOADED ON: ${new Date().toLocaleDateString()}\n\n`;
      archive += `--- SYNOPSIS ---\n`;
      archive += `"${content.synopsis}"\n\n`;
      archive += `========================================================\n\n`;

      content.chapters.forEach((ch, idx) => {
        archive += `CHAPTER ${idx + 1}: ${ch.title.toUpperCase()}\n`;
        archive += `--------------------------------------------------------\n`;
        archive += `${ch.excerpt}\n\n`;
      });

      archive += `========================================================\n`;
      archive += `    Thank you for choosing Klyvo: Your Mossy Sanctuary.\n`;
      archive += `========================================================\n`;

      const blob = new Blob([archive], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.download = `${book.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}_klyvo_edition.txt`;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);

      triggerToast("Book Downloaded Successfully! 📥");
    } catch (e) {
      console.error(e);
      triggerToast("Download failed, please try again.");
    }
  };

  // -------------------------
  // RENDER OPTION 1: IMMERSIVE FULL-SCREEN PARCHMENT E-READER
  // -------------------------
  if (activeTab === 'reader') {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col bg-[#F3ECE4] dark:bg-[#111A13] select-none text-neutral-900 transition-colors duration-300" 
        id="klyvo-fullscreen-pdf-reader"
      >
        {/* Floating Reader Toast Message */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, x: '-50%' }}
              className="fixed top-18 left-1/2 -translate-x-1/2 z-[60] bg-neutral-900 text-[#FCF9F5] px-4 py-2 rounded-lg text-xs font-sans font-bold shadow-xl border border-white/10"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP IMMERSIVE HEADER BAR */}
        <header className="px-6 py-4 bg-[#EDE5DB] dark:bg-[#18241C] border-b border-[#D6CBBF]/80 dark:border-[#203324] flex items-center justify-between z-30 font-sans shadow-xs">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] uppercase font-bold bg-[#8B5E3C] text-white tracking-wider">
              eReader Mode
            </span>
            <div>
              <h3 className="font-serif font-black text-[#1F2E22] dark:text-[#EAECE9] text-base leading-none">
                {book.title}
              </h3>
              <p className="text-[10px] text-neutral-600 dark:text-neutral-400 font-medium italic mt-0.5">
                by {book.author}
              </p>
            </div>
          </div>

          {/* Dynamic Tool Adjustments row */}
          <div className="flex items-center gap-2">
            
            {/* Download eBook Button */}
            <button
              onClick={handleDownloadOfflineBook}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B5E3C] hover:bg-[#6F492E] text-white text-xs font-sans font-extrabold rounded-lg shadow-sm cursor-pointer transition-all active:scale-95"
              title="Download full content for offline usage"
            >
              <Download className="w-3.5 h-3.5 fill-white" />
              <span className="hidden md:inline">Download book</span>
            </button>

            {/* Layout Toggle */}
            <div className="flex gap-1 bg-[#E4DACF] dark:bg-[#1E2E23] p-1 rounded-lg">
              <button
                onClick={() => setReaderLayout('continuous')}
                className={`px-2 py-1 text-[9px] uppercase font-black rounded ${
                  readerLayout === 'continuous'
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/50'
                }`}
              >
                Continuous Scroll
              </button>
              <button
                onClick={() => setReaderLayout('paged')}
                className={`px-2 py-1 text-[9px] uppercase font-black rounded ${
                  readerLayout === 'paged'
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/50'
                }`}
              >
                Page Flipping
              </button>
            </div>

            {/* Adjust typography trigger */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded-lg border cursor-pointer flex items-center justify-center gap-1 text-[#8B5E3C] bg-white border-[#D6CBBF] hover:bg-[#E4DACF]`}
              title="Adjust Reader Typography Setup"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Switch into Journal mode */}
            <button
              onClick={() => setActiveTab('journal')}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#4F7057] hover:bg-natural-highlight text-white text-xs font-sans font-extrabold rounded-lg shadow-sm cursor-pointer transition-all"
            >
              <Notebook className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">Journal Review</span>
            </button>

            {/* Back out button */}
            <button
              onClick={onClose}
              className="p-1 px-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-[#E4DACF] dark:bg-[#1E2E23] rounded-lg transition-colors cursor-pointer ml-1.5"
              title="Return to stack"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* TYPOGRAPHY OVERLAY ADJUST PANEL */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-[#EDE5DB] dark:bg-[#1E2E23] border-b border-[#D6CBBF]/80 dark:border-[#2B3E31] grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] font-sans font-bold text-neutral-800 dark:text-neutral-200 z-20 shadow-inner"
            >
              <div className="space-y-1">
                <span className="block uppercase tracking-wider">Font Sizing</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setFontSize(prev => prev === 'xs' ? 'xs' : prev === 'sm' ? 'xs' : prev === 'base' ? 'sm' : prev === 'lg' ? 'base' : prev === 'xl' ? 'lg' : 'xl')}
                    className="bg-white dark:bg-neutral-800 px-2 py-1 rounded border border-neutral-300 dark:border-transparent text-neutral-800 dark:text-neutral-100"
                  >
                    A-
                  </button>
                  <span className="flex-1 text-center py-1 bg-white dark:bg-neutral-900 rounded text-neutral-800 dark:text-neutral-100 uppercase tracking-widest text-[9px] font-mono leading-relaxed pt-1.5">
                    {fontSize}
                  </span>
                  <button
                    onClick={() => setFontSize(prev => prev === '2xl' ? '2xl' : prev === 'xl' ? '2xl' : prev === 'lg' ? 'xl' : prev === 'base' ? 'lg' : prev === 'sm' ? 'base' : 'sm')}
                    className="bg-white dark:bg-neutral-800 px-2 py-1 rounded border border-neutral-300 dark:border-transparent text-neutral-800 dark:text-neutral-100"
                  >
                    A+
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block uppercase tracking-wider">Font Family</span>
                <select
                  value={fontStyle}
                  onChange={(e) => setFontStyle(e.target.value as any)}
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-transparent p-1.5 rounded text-neutral-800 dark:text-neutral-100 outline-none cursor-pointer"
                >
                  <option value="serif">Lora Classic Serif</option>
                  <option value="sans">Inter Modern Sans</option>
                  <option value="mono">JetBrains Technical Mono</option>
                  <option value="dyslexic">Dyslexic Reading Aid</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="block uppercase tracking-wider">Text Spacing</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['normal', 'relaxed', 'loose'] as const).map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setSpacing(sp)}
                      className={`p-1.5 rounded capitalize ${spacing === sp ? 'bg-[#8B5E3C] text-white font-extrabold' : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-transparent'}`}
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="block uppercase tracking-wider">Parchment Theme</span>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-full py-1.5 rounded flex items-center justify-center gap-1 border ${
                    highContrast
                      ? 'bg-[#1C291E] text-white border-transparent'
                      : 'bg-white dark:bg-neutral-850 text-neutral-800 border-neutral-300 hover:border-neutral-500'
                  }`}
                >
                  {highContrast ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{highContrast ? 'Monochrome Contrast' : 'Aged Parchment'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN E-READER CANVAS AREA */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col justify-between items-center relative select-text">
          
          {/* Chapter direct drawer selector when in Paged Flip layout */}
          {readerLayout === 'paged' && (
            <div className="w-full max-w-3xl mb-4 p-2 bg-[#EDE5DB] dark:bg-[#1E2E23] border border-[#D6CBBF]/70 dark:border-[#203324] rounded-xl flex items-center justify-between text-xs z-10 font-sans shadow-inner">
              <span className="text-[10px] font-sans text-neutral-700 dark:text-neutral-350 uppercase font-black pl-1">Chapter Index:</span>
              <select
                value={activeChapterIndex}
                onChange={(e) => {
                  const nextIndex = Number(e.target.value);
                  setActiveChapterIndex(nextIndex);
                  triggerToast(`Flipped to Chapter ${nextIndex + 1}!`);
                  if (onUpdatePage) {
                    const pagesPer = Math.ceil(book.totalPages / content.chapters.length) || 1;
                    const newPage = Math.min(book.totalPages, Math.max(1, nextIndex * pagesPer + 1));
                    onUpdatePage(book.id, newPage);
                  }
                }}
                className="flex-1 max-w-sm bg-white dark:bg-neutral-800 outline-none text-xs font-serif font-extrabold p-1 rounded text-[#1F2E22] dark:text-[#EAECE9] border border-neutral-300 dark:border-transparent cursor-pointer"
              >
                {content.chapters.map((ch, idx) => (
                  <option key={idx} value={idx}>
                    Chapter {idx + 1}: {ch.title}
                  </option>
                ))}
              </select>
              <div className="h-4 w-[1px] bg-neutral-300 mx-2 hidden sm:block"></div>
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-600 dark:text-neutral-400 hidden sm:block">
                Sample Reader Volume ({content.chapters.length} segments)
              </span>
            </div>
          )}

          {/* DYNAMIC parchment sheet book frame */}
          <div 
            className={`w-full max-w-3xl p-8 sm:p-14 relative rounded-xl shadow-2xl border flex-1 flex flex-col justify-between transition-all duration-300 min-h-[60vh] select-text overflow-hidden ${
              highContrast 
                ? 'border-neutral-800 bg-white text-neutral-950' 
                : 'border-[#CEC2B3] bg-[#FCF7F0] text-[#1D2B1E]'
            }`}
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset -2px -2px 10px rgba(0,0,0,0.05)'
            }}
          >
            {/* Real physics lookups */}
            {/* Book Spine gutter shadow in center-left to pretend binding depth */}
            <div className="absolute top-0 bottom-0 left-6 w-[1.5px] bg-gradient-to-r from-black/10 to-transparent z-10" />
            <div className="absolute top-0 bottom-0 left-3 w-2 bg-gradient-to-r from-black/5 via-black/2 to-transparent pointer-events-none rounded-full z-10" />

            {/* Book Spine Bevel on right */}
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-transparent to-black/5 pointer-events-none z-10" />

            {/* HEADER METADATA inside book pages */}
            <div className={`flex justify-between items-center text-[9px] uppercase tracking-widest font-sans font-bold border-b pb-2 mb-6 ${
              highContrast ? 'border-neutral-300 text-neutral-600' : 'border-[#EBE2D4] text-neutral-500'
            }`}>
              <span>VOL. {Math.round(book.totalPages / 150) || 1} • KLYVO CURATOR PRESS</span>
              <span>{book.title}</span>
            </div>

            {/* DYNAMIC TEXT BODY SEGMENT */}
            <div className="flex-1 flex flex-col select-text">
              {readerLayout === 'continuous' ? (
                /* Continuous scroll down design */
                <div 
                  onScroll={handleScroll} 
                  className="overflow-y-auto max-h-[50vh] pr-4 space-y-12 select-text custom-scrollbar scrollbar-thumb-neutral-300"
                >
                  <div className={`text-center pb-6 border-b ${highContrast ? 'border-neutral-300' : 'border-[#EADCC7]'}`}>
                    <h4 className="font-serif text-3xl font-black text-[#1D2B1E] tracking-tight italic">
                      {book.title}
                    </h4>
                    <p className="text-xs font-serif text-neutral-500 mt-1 italic">
                      by {book.author}
                    </p>
                    <span className="inline-block mt-4 px-2 py-0.5 rounded text-[8px] font-mono text-neutral-500 border border-neutral-300 uppercase tracking-widest animate-pulse font-bold bg-[#EADCC7]/30">
                      ↓ Scroll page block down to finalize reading state
                    </span>
                  </div>

                  {content.chapters.map((ch, idx) => (
                    <div key={idx} className="space-y-4 border-b border-neutral-200/40 pb-10 last:border-none last:pb-0">
                      <h5 className="font-serif text-center font-bold text-[#8B5E3C] tracking-tighter text-lg italic pb-1">
                        Chapter {idx + 1}: {ch.title}
                      </h5>
                      <div className={`max-w-xl mx-auto space-y-3 ${getFontSizeClass()} ${getFontStyleClass()} ${getSpacingClass()} text-[#1D2B1E] text-justify`}>
                        <p className="indent-8 whitespace-pre-line leading-relaxed pb-2">
                          {ch.excerpt}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="text-center py-6 border-t border-neutral-200 text-neutral-500 font-serif text-xs italic">
                    — The End of Curated Excerpts —
                  </div>
                </div>
              ) : (
                /* Traditional paged-by-chapter view with arrows and sliding progress elements */
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex-1 relative overflow-hidden min-h-[300px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeChapterIndex}
                        initial={{ opacity: 0, rotateY: 30, transformOrigin: "left center", x: 20 }}
                        animate={{ opacity: 1, rotateY: 0, x: 0 }}
                        exit={{ opacity: 0, rotateY: -30, x: -20 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="absolute inset-0 space-y-4 overflow-y-auto pr-2 custom-scrollbar select-text pb-4"
                      >
                        <h5 className="font-serif text-center font-bold text-[#8B5E3C] tracking-tighter text-xl italic border-b border-neutral-200 pb-1">
                          Chapter {activeChapterIndex + 1}: {content.chapters[activeChapterIndex]?.title}
                        </h5>
                        <div className={`max-w-xl mx-auto ${getFontSizeClass()} ${getFontStyleClass()} ${getSpacingClass()} text-[#1D2B1E] text-justify select-text`}>
                          <p className="indent-8 whitespace-pre-line leading-relaxed pb-4">
                            {content.chapters[activeChapterIndex]?.excerpt}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Page Flip Interactive Bottom Navigators */}
                  <div className="flex justify-between items-center pt-4 border-t border-[#CEC2B3]/50">
                    <button
                      onClick={handlePrevPage}
                      disabled={activeChapterIndex === 0}
                      className="px-3.5 py-1.5 bg-[#8B5E3C] disabled:opacity-30 hover:bg-[#6F492E] text-white text-[10px] font-sans font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all disabled:cursor-not-allowed select-none"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev Chapter</span>
                    </button>
                    <span className="text-[10px] font-mono text-neutral-600 font-bold">
                      Chapter {activeChapterIndex + 1} of {content.chapters.length}
                    </span>
                    <button
                      onClick={handleNextPage}
                      className="px-3.5 py-1.5 bg-[#8B5E3C] hover:bg-[#6F492E] text-white text-[10px] font-sans font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all select-none"
                    >
                      <span>{activeChapterIndex === content.chapters.length - 1 ? 'Finish Book' : 'Next Chapter'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM BOOK PAGE DECORATION FOOTER */}
            <div className={`flex justify-between items-center text-[9px] font-sans font-bold border-t pt-2 mt-6 ${
              highContrast ? 'border-neutral-300 text-neutral-600' : 'border-[#EBE2D4] text-[#8B5E3C]'
            }`}>
              <span>Sanctuary Bindings • Mossy Hollow Press</span>
              <span>Page {activeChapterIndex * 15 + 1} of {book.totalPages}</span>
            </div>

            {/* CELEBRATING ACHIEVEMENT OVERLAY MODAL */}
            <AnimatePresence>
              {hasFinishedReading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-neutral-900/95 backdrop-blur-md z-50 flex items-center justify-center p-4 text-center rounded-xl"
                >
                  <motion.div
                    initial={{ scale: 0.85, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.85, y: 30 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="bg-white dark:bg-[#121914] rounded-2xl p-6 shadow-2xl max-w-sm space-y-4 border-2 border-[#D4AF37] relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-[#D4AF37] to-yellow-500 animate-pulse" />
                    
                    <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto border-2 border-amber-300 text-3xl animate-bounce">
                      🏆
                    </div>
                    
                    <h3 className="font-serif text-xl font-black text-neutral-900 dark:text-white italic">
                      Literary Milestone Achieved!
                    </h3>
                    
                    <p className="text-xs text-neutral-700 dark:text-neutral-350 font-sans leading-relaxed">
                      Outstanding scholarship, friend! You parsed the absolute depth and finished reading <span className="font-bold text-[#8B5E3C]">"{book.title}"</span>. Progress updated to 100%!
                    </p>

                    <div className="bg-[#FCF7F0] dark:bg-[#18241C] border border-[#CEC2B3]/50 dark:border-white/10 rounded-xl p-3 text-left text-[11px] space-y-1">
                      <span className="block text-[8px] font-sans font-extrabold uppercase tracking-widest text-[#8B5E3C] dark:text-[#EAECE9]">Curatorial Rewards Dispensed:</span>
                      <div className="space-y-0.5 text-neutral-800 dark:text-neutral-200 font-bold font-sans">
                        <p>🌿 +100 Bibliotheca XP Added</p>
                        <p>📜 "Midnight Scholar" Curator Rank</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setHasFinishedReading(false)}
                      className="w-full py-2.5 bg-[#8B5E3C] hover:bg-[#6F492E] text-white rounded-xl text-xs font-sans font-black uppercase tracking-wider cursor-pointer shadow-md transition-all border border-[#CEC2B3]"
                    >
                      Claim Curatorial Honors
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Key Excerpts quote ribbon inside reader canvas */}
          {content.keyQuotes && content.keyQuotes.length > 0 && (
            <div className="w-full max-w-3xl mt-4 p-4 bg-[#EDE5DB]/50 dark:bg-[#1E2E23]/20 border border-[#D6CBBF]/80 dark:border-[#2B3E31] rounded-xl flex items-start gap-2 backdrop-blur-xs select-text">
              <Quote className="w-4 h-4 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-[8px] font-sans font-black text-neutral-500 uppercase tracking-widest">Key Takeaway</span>
                <p className="font-serif italic text-xs text-[#1D2B1E] dark:text-neutral-300 leading-normal pl-1 mt-0.5">
                  "{content.keyQuotes[0]}"
                </p>
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM FIXED READER STATUS METRIC FOOTER */}
        <footer className="w-full bg-[#EDE5DB] dark:bg-[#18241C] border-t border-[#D6CBBF]/80 dark:border-[#203324] px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-[#8B5E3C] dark:text-[#91A696] font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Device Synced Status: Saved offline and replicated to ledger clouds.</span>
          </div>
          <p>Curated stacks read tracker: {activeChapterIndex + 1} / {content.chapters.length} chapters mapped</p>
        </footer>
      </div>
    );
  }

  // -------------------------
  // RENDER OPTION 2: DEFAULT COMPACT COZY JOURNAL REVIEW MODAL
  // -------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs select-none">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-natural-border dark:border-[#1E3023] relative flex flex-col max-h-[85vh] select-none"
      >
        {/* Book spine decorative headband block */}
        <div className="h-1.5 bg-gradient-to-r from-[#8B5E3C] via-[#4F7057] to-[#83A98B] w-full"></div>

        {/* Header */}
        <div className="p-5 md:p-6 bg-neutral-50 dark:bg-[#18241C] border-b border-natural-border dark:border-[#1E3023] flex flex-col gap-4">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] uppercase font-sans bg-[#8B5E3C] text-white font-extrabold tracking-wider">
                {book.category} • {book.genre}
              </span>
              <h3 className="font-serif text-2xl font-black text-natural-text dark:text-white leading-tight">
                {book.title}
              </h3>
              <p className="text-sm font-medium text-natural-accent italic">
                Written by {book.author}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 px-2.5 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-natural-border/30 dark:border-white/5 gap-1 mt-1 font-sans text-xs select-none">
            <button
              onClick={() => setActiveTab('journal')}
              className={`pb-2.5 px-4 font-bold border-b-2 hover:text-natural-text dark:hover:text-[#ECEFEA] transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'journal'
                  ? 'border-natural-accent text-natural-text dark:text-white'
                  : 'border-transparent text-natural-accent/60'
              }`}
            >
              <Notebook className="w-3.5 h-3.5" />
              <span>Journal & Comments</span>
            </button>
            <button
              onClick={() => setActiveTab('reader')}
              className={`pb-2.5 px-4 font-bold border-b-2 hover:text-natural-text dark:hover:text-[#ECEFEA] transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reader'
                  ? 'border-natural-accent text-natural-text dark:text-white'
                  : 'border-transparent text-natural-accent/60'
              }`}
            >
              <BookOpenCheck className="w-3.5 h-3.5 text-natural-accent" />
              <span>Read Full Contents</span>
              <span className="bg-natural-accent text-white text-[9px] px-1.5 py-0.2 rounded-full font-sans font-black flex items-center justify-center scale-90">LIVE</span>
            </button>
          </div>
        </div>

        {/* Content body layout */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-neutral-900 select-text">
          
          <AnimatePresence mode="wait">
            {activeTab === 'journal' ? (
              <motion.div
                key="journal-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Statistics Card Summary */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#FCFDFB] dark:bg-[#152018] border border-natural-border dark:border-[#1E3023] rounded-xl shadow-xs">
                  <div>
                    <span className="block text-[10px] font-sans text-natural-accent uppercase tracking-widest font-bold">
                      Review Score
                    </span>
                    <div className="flex items-center space-x-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < book.rating ? 'text-[#8B5E3C] fill-[#8B5E3C]' : 'text-natural-border dark:text-[#213526]'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold ml-1.5 text-natural-text dark:text-neutral-200">{book.rating}/5</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-sans text-natural-accent uppercase tracking-widest font-bold">
                      Completion Progress
                    </span>
                    <p className="text-xs font-mono font-bold text-natural-text dark:text-neutral-200 mt-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-natural-accent inline" />
                      {book.currentPage} / {book.totalPages} pages ({Math.min(100, Math.max(0, Math.round((book.currentPage / book.totalPages) * 100)))}%)
                    </p>
                  </div>
                </div>

                {/* Synopsis / Background Segment */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-transparent rounded-xl space-y-2">
                  <h4 className="text-[10px] font-sans font-bold text-natural-accent uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3" /> Editor's Synopsis
                  </h4>
                  <p className="font-serif italic text-xs md:text-[13px] text-natural-text dark:text-neutral-200 leading-relaxed font-semibold">
                    "{content.synopsis}"
                  </p>
                </div>

                {/* Curators Personal critique logs */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center pr-1">
                    <span className="block text-[10px] font-sans font-bold text-natural-accent uppercase tracking-widest">
                      Your Personal Critique Journal
                    </span>
                    {!isEditing && book.review.trim() && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-[10px] font-sans font-extrabold text-[#4F7057] hover:text-[#8B5E3C] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Scribe
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editedReview}
                        onChange={(e) => setEditedReview(e.target.value)}
                        placeholder="Write down your curatorial notes about this master copy..."
                        className="w-full bg-neutral-50 dark:bg-neutral-850 text-natural-text dark:text-white p-4 font-serif text-xs leading-relaxed italic border border-natural-border dark:border-[#203324] rounded-xl outline-none focus:ring-1 focus:ring-natural-accent h-36"
                      />
                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          onClick={() => {
                            setEditedReview(book.review);
                            setIsEditing(false);
                          }}
                          className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-sans font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-3.5 py-1.5 bg-[#4F7057] hover:bg-natural-highlight text-white rounded-lg flex items-center gap-1 font-sans font-bold cursor-pointer shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" /> Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-white dark:bg-black/10 rounded-xl border border-natural-border dark:border-[#1E3023] italic font-serif leading-relaxed text-natural-text dark:text-neutral-200 text-[14px] min-h-[100px] whitespace-pre-wrap relative shadow-inner">
                      {book.review.trim() ? (
                        book.review
                      ) : (
                        <span className="text-natural-accent/60 not-italic font-sans text-sm block py-4 text-center">
                          "No written review currently exists on this shelf card."
                          <button
                            onClick={() => setIsEditing(true)}
                            className="block mx-auto mt-3 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 hover:opacity-85 text-natural-text dark:text-white rounded border font-sans font-bold text-xs cursor-pointer"
                          >
                            Write Review
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Communal Marginalia Comments System */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-sans text-[10px] font-black uppercase text-[#4F7057] tracking-widest flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Marginalia Comments ({comments.length})
                  </h4>

                  {/* Comment Timeline list */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 select-text custom-scrollbar">
                    {comments.map((comm) => (
                      <div key={comm.id} className="p-2.5 bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-transparent rounded-xl flex items-start gap-2.5">
                        <span className="text-xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-transparent w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 scale-90 select-none">
                          {comm.avatar}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="font-bold text-natural-text dark:text-neutral-100">{comm.author}</span>
                            <span className="text-natural-accent/40">•</span>
                            <span className="opacity-60 text-natural-accent">{comm.postedAt}</span>
                          </div>
                          <p className="font-serif italic text-xs text-natural-text/85 dark:text-neutral-200 mt-0.5">{comm.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form to submit marginalia comment */}
                  <form onSubmit={handleAddComment} className="flex gap-2 items-center select-none">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Scribble a margin comment on this review..."
                      className="flex-1 bg-neutral-50 dark:bg-neutral-850 border border-natural-border dark:border-transparent rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-natural-accent text-natural-text dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="px-3.5 py-1.5 bg-[#4F7057] hover:bg-natural-highlight text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-40"
                    >
                      Post
                    </button>
                  </form>
                </div>

              </motion.div>
            ) : null}
          </AnimatePresence>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-[#18241C] border-t border-natural-border dark:border-[#1E3023] flex justify-between items-center text-xs text-natural-accent font-sans select-none">
          <div className="flex items-center gap-1.5 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-natural-accent/60" />
            <span>Shelved on {new Date(book.dateAdded).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#4F7057] hover:bg-natural-highlight hover:shadow-xs text-white rounded-lg font-sans font-bold tracking-wide transition-all duration-150 cursor-pointer uppercase text-[10px] tracking-wider"
          >
            Close book entry
          </button>
        </div>
      </motion.div>
    </div>
  );
}
