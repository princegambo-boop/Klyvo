import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { Star, CheckCircle, Bookmark, Trash2, BookOpen, Quote, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BookCover from './BookCover';

interface BookCardProps {
  key?: React.Key;
  book: Book;
  onUpdatePage: (id: string, newPage: number) => void;
  onRemoveBook: (id: string) => void;
  onOpenReview: (book: Book, initialTab?: 'journal' | 'reader') => void;
}

export default function BookCard({ book, onUpdatePage, onRemoveBook, onOpenReview }: BookCardProps) {
  const [currentPageInput, setCurrentPageInput] = useState<string>(book.currentPage.toString());
  const [inputError, setInputError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync state if book changes externally
  useEffect(() => {
    setCurrentPageInput(book.currentPage.toString());
    setInputError(false);
  }, [book.currentPage]);

  const percentage = Math.min(100, Math.max(0, Math.round((book.currentPage / book.totalPages) * 100)));
  const isCompleted = book.currentPage >= book.totalPages;

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPage = parseInt(currentPageInput, 10);
    
    if (isNaN(parsedPage) || parsedPage < 0 || parsedPage > book.totalPages) {
      setInputError(true);
      setCurrentPageInput(book.currentPage.toString());
      setTimeout(() => setInputError(false), 2000);
      return;
    }

    setInputError(false);
    onUpdatePage(book.id, parsedPage);
  };

  const handleBlur = () => {
    const parsedPage = parseInt(currentPageInput, 10);
    if (!isNaN(parsedPage) && parsedPage >= 0 && parsedPage <= book.totalPages) {
      if (parsedPage !== book.currentPage) {
        onUpdatePage(book.id, parsedPage);
      }
    } else {
      setCurrentPageInput(book.currentPage.toString());
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-natural-card border border-natural-border dark:border-[#1E3023] hover:border-natural-accent group rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-300 relative flex flex-col justify-between overflow-hidden"
    >
      {/* Accent Spine Cover binding strip overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-natural-accent"></div>

      {/* Main card inner contents splits into Left Cover column & Right Metadata column */}
      <div className="flex gap-4 items-start relative z-10">
        
        {/* LEFT COLUMN: Dynamic E-Cover */}
        <div 
          onClick={() => onOpenReview(book, 'reader')}
          className="flex-shrink-0 cursor-pointer shadow-sm hover:shadow-lg transition-transform duration-300 active:scale-95"
          title="Click to open full book reader & journal entries"
        >
          <BookCover title={book.title} author={book.author} genre={book.genre} size="flat" />
        </div>

        {/* RIGHT COLUMN: Info Header */}
        <div className="flex-1 min-w-0 pr-1 select-text">
          <div className="flex justify-between items-start mb-1">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] uppercase font-mono font-bold bg-neutral-100 dark:bg-[#1E3023] text-natural-accent border border-neutral-200/50 dark:border-transparent tracking-widest leading-none">
              {book.genre}
            </span>
            
            {/* Trash option for unlogging/remove books */}
            <div className="relative">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-neutral-400 hover:text-red-600 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer relative z-10"
                  title="Remove Book from Shelf"
                >
                  <Trash2 className="w-3.5 h-3.5" id={`remove-book-${book.id}`} />
                </button>
              ) : (
                <div className="absolute right-0 top-0 bg-white dark:bg-natural-card border border-red-300 rounded-lg p-1.5 shadow-md flex items-center gap-1.5 z-30 text-[9px] font-sans font-black whitespace-nowrap animate-scale-up">
                  <span className="text-red-600">Unlog?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveBook(book.id);
                      setShowDeleteConfirm(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-1.5 py-0.5 rounded cursor-pointer uppercase"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-neutral-100 dark:bg-black/30 text-[#4F7057] px-1.5 py-0.5 rounded cursor-pointer uppercase border border-neutral-200 dark:border-transparent"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          </div>

          <div 
            onClick={() => onOpenReview(book, 'reader')}
            className="cursor-pointer group/title select-text"
            title="Open Interactive Reader"
          >
            <h3 className="font-serif font-bold text-sm md:text-base text-natural-text group-hover/title:text-natural-accent transition-colors leading-snug line-clamp-2 hover:underline decoration-natural-accent/30 decoration-1">
              {book.title}
            </h3>
            <p className="font-sans text-xs text-natural-text/75 mt-0.5 italic truncate">
              by {book.author}
            </p>
          </div>

          {/* Stars indicator click trigger */}
          <div 
            onClick={() => onOpenReview(book, 'journal')}
            className="flex items-center space-x-0.5 mt-2 cursor-pointer"
            title="Click to read reviews"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < book.rating ? 'text-natural-accent fill-natural-accent' : 'text-natural-border dark:text-[#213526]'
                }`}
              />
            ))}
            <span className="text-[10px] text-natural-accent font-mono ml-1 font-semibold">({book.rating}/5)</span>
          </div>

        </div>
      </div>

      {/* Progress & Quick Log form inside lower block */}
      <div className="space-y-3.5 pt-3 mt-3 border-t border-natural-border dark:border-[#1E3023] pl-1 relative z-10">
        <div>
          <div className="flex justify-between items-center text-[10px] font-sans mb-1 leading-none">
            <span>
              {isCompleted ? (
                <span className="text-natural-accent font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 inline" /> Completed Vol
                </span>
              ) : (
                <span className="flex items-center gap-1 text-natural-text/75">
                  <Bookmark className="w-3 h-3 inline text-natural-accent" /> Active Reading
                </span>
              )}
            </span>
            <span className="font-bold text-natural-text font-mono">{percentage}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-neutral-100 dark:bg-black/30 rounded-full overflow-hidden border border-natural-border dark:border-transparent">
            <div
              className="h-full transition-all duration-500 ease-out bg-natural-accent"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <p className="text-[10px] text-natural-accent font-mono mt-1 text-right font-medium">
            {book.currentPage} of {book.totalPages} pages
          </p>
        </div>

        {/* Form controls to submit quick logs */}
        <form onSubmit={handlePageSubmit} className="flex items-center justify-between gap-2 pt-0.5 font-sans">
          <div className="flex items-center space-x-1 text-[10px]">
            <span className="font-sans font-medium text-natural-text/80">Page:</span>
            <input
              type="number"
              min="0"
              max={book.totalPages}
              value={currentPageInput}
              onChange={(e) => setCurrentPageInput(e.target.value)}
              onBlur={handleBlur}
              className={`w-12 px-1 py-0.5 text-xs text-center font-mono font-bold bg-neutral-50 dark:bg-black/20 focus:bg-white dark:focus:bg-[#1E3023] border rounded focus:outline-none transition-colors ${
                inputError 
                  ? 'border-red-400 text-red-700 ring-1 ring-red-400' 
                  : 'border-natural-border dark:border-transparent text-natural-text focus:border-natural-accent'
              }`}
            />
            <span className="text-natural-accent/75 font-mono">/ {book.totalPages}</span>
          </div>
          
          <button
            type="submit"
            className="px-2 py-0.5 text-[9px] font-sans font-extrabold bg-neutral-100 dark:bg-[#1E3023] hover:bg-natural-accent hover:text-white text-natural-accent rounded border border-natural-border dark:border-transparent transition-colors cursor-pointer uppercase tracking-wider"
          >
            Log
          </button>
        </form>

        {/* Immersive Controls Row: Read (glowing button) & Journal */}
        <div className="grid grid-cols-2 gap-2 pt-1 font-sans">
          <button
            onClick={() => onOpenReview(book, 'reader')}
            className="py-2 px-2 bg-[#4F7057] dark:bg-[#203324] hover:bg-[#6C8E74] text-white rounded-xl text-[9px] font-sans font-black uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer shadow-sm glowing-moss-btn text-center"
          >
            <BookOpen className="w-3 h-3" />
            <span>Read Scroll</span>
          </button>
          
          <button
            onClick={() => onOpenReview(book, 'journal')}
            className="py-2 px-2 bg-neutral-50 dark:bg-[#1E3023] hover:bg-neutral-100 dark:hover:bg-[#2B4430] text-natural-text rounded-xl text-[9px] font-sans font-black uppercase tracking-widest border border-natural-border dark:border-transparent transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer"
          >
            <FileText className="w-3 h-3 text-natural-accent" />
            <span>Notes</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
