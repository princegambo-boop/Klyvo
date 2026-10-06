import React, { useState } from 'react';
import { Book } from '../types';
import { Check, Bookmark, BookOpen, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FeaturedSeriesProps {
  onAddBook: (book: Omit<Book, 'id' | 'dateAdded'>) => void;
  shelvedBooks: Book[];
}

const WIMPY_KID_BOOKS = [
  {
    title: "Diary of a Wimpy Kid",
    volume: "Volume 1",
    publishYear: 2007,
    totalPages: 217,
    bgColor: "#E11D48", // Rose Red
    textColor: "text-white",
    description: "Greg Heffley finds himself thrust into middle school, dealing with hilarious social tier struggles, awkward gym class, and his friend Rowley's accidental rise to popularity.",
    genre: "Humor & Children's Fiction",
    tagline: "The masterpiece book that started the global phenomenon."
  },
  {
    title: "Diary of a Wimpy Kid: Rodrick Rules",
    volume: "Volume 2",
    publishYear: 2008,
    totalPages: 217,
    bgColor: "#2563EB", // Royal Blue
    textColor: "text-white",
    description: "Greg tries to keep a highly embarrassing summer vacation incident under wraps, but his older brother Rodrick knows all the details and holds the ultimate leverage.",
    genre: "Humor & Children's Fiction",
    tagline: "Unforgettable sibling rivalry and heavy metal blackmail."
  },
  {
    title: "Diary of a Wimpy Kid: The Last Straw",
    volume: "Volume 3",
    publishYear: 2009,
    totalPages: 217,
    bgColor: "#059669", // Emerald Green
    textColor: "text-white",
    description: "Frank Heffley decides it is his duty to make his wimpy son tough, threatening him with military school enrollment if Greg cannot survive athletic programs.",
    genre: "Humor & Children's Fiction",
    tagline: "Frank's boot-camp attempts collide with Greg's lazy weekends."
  },
  {
    title: "Diary of a Wimpy Kid: Dog Days",
    volume: "Volume 4",
    publishYear: 2009,
    totalPages: 217,
    bgColor: "#D97706", // Amber Yellow
    textColor: "text-white",
    description: "School is out and Greg is ready for the ultimate summer of video gaming. However, his mother has a very different vision involving outdoor bonding.",
    genre: "Humor & Children's Fiction",
    tagline: "From country club pool credit crises to scary pet dogs."
  },
  {
    title: "Diary of a Wimpy Kid: The Ugly Truth",
    volume: "Volume 5",
    publishYear: 2010,
    totalPages: 217,
    bgColor: "#7C3AED", // Purple
    textColor: "text-white",
    description: "Greg is in a rush to grow up, but suddenly faces dental orthodonics, boy-girl parties, awkward family discussions, and life without his best friend Rowley.",
    genre: "Humor & Children's Fiction",
    tagline: "Greg takes on the terrifying realities of adolescence."
  },
  {
    title: "Diary of a Wimpy Kid: Cabin Fever",
    volume: "Volume 6",
    publishYear: 2011,
    totalPages: 217,
    bgColor: "#0284C7", // Cyan / sky blue
    textColor: "text-white",
    description: "A surprise blizzard traps the entire Heffley household inside their home during the holidays. Meanwhile, Greg fears he is being hunted by school patrol authorities.",
    genre: "Humor & Children's Fiction",
    tagline: "Claustrophobic family tension and hilarious indoor survival."
  }
];

export default function FeaturedSeries({ onAddBook, shelvedBooks }: FeaturedSeriesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleQuickAdd = (item: typeof WIMPY_KID_BOOKS[0]) => {
    // Check if food already shelved
    const alreadyShelved = shelvedBooks.some(b => b.title.toLowerCase() === item.title.toLowerCase());
    if (alreadyShelved) {
      setSuccessMessage(`"${item.title}" is already on your shelf!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    onAddBook({
      title: item.title,
      author: "Jeff Kinney",
      genre: "Humor",
      category: "Fiction",
      rating: 5,
      review: `Featured Volume: ${item.title}. "${item.tagline}" Added from Klyvo's Diary of a Wimpy Kid showcase!`,
      totalPages: item.totalPages,
      currentPage: 0 // starting from page 0
    });

    setSuccessMessage(`Logged "${item.title}" to your shelf!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <section className="bg-white border border-natural-border rounded-xl p-6 md:p-8 mt-10 shadow-xs relative overflow-hidden" id="featured-series-showcase">
      <div className="absolute top-0 right-0 w-32 h-32 bg-natural-card rounded-full blur-2xl opacity-40 pointer-events-none"></div>
      
      {/* Header section with theme styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-natural-border mb-6">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-natural-accent uppercase tracking-widest bg-natural-card px-2.5 py-1 rounded border border-natural-border mb-2">
            <Sparkles className="w-3 h-3 text-natural-accent" /> Featured Series
          </span>
          <h2 className="font-serif text-2xl font-bold text-natural-text italic flex items-center gap-2">
            Diary of a Wimpy Kid Collection
          </h2>
          <p className="text-xs text-natural-text/75 font-sans mt-1">
            By <span className="font-semibold text-natural-accent">Jeff Kinney</span> — Explore and log the adventures of Greg Heffley to your current shelves!
          </p>
        </div>
        <div className="text-left py-1 px-3 bg-natural-card rounded-lg border border-natural-border self-start">
          <span className="text-lg font-bold font-serif text-natural-text">6 Volumes</span>
          <p className="text-[9px] uppercase font-bold text-natural-accent tracking-wider">Ready to Shelf</p>
        </div>
      </div>

      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-3 bg-natural-card border border-natural-accent text-natural-text text-xs rounded-lg font-sans font-bold flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-natural-accent animate-ping"></div>
          {successMessage}
        </motion.div>
      )}

      {/* Grid containing book covers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WIMPY_KID_BOOKS.map((book, idx) => {
          const isAdded = shelvedBooks.some(b => b.title.toLowerCase() === book.title.toLowerCase());
          
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="bg-natural-card/45 border border-natural-border rounded-xl p-5 hover:bg-white hover:border-natural-accent hover:shadow-xs transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-4 items-start mb-4">
                  {/* Styled Mimic of Wimpy Kid book封面 corner spine */}
                  <div 
                    className="w-14 h-20 rounded-sm shadow-sm flex flex-col justify-between p-1.5 shrink-0 transform hover:scale-105 transition-transform duration-200"
                    style={{ backgroundColor: book.bgColor }}
                  >
                    {/* Spine lines */}
                    <div className="w-full h-[3px] bg-black/20 rounded"></div>
                    {/* Sketch doodle representation */}
                    <div className="mx-auto border border-white/30 w-8 h-10 flex items-center justify-center rounded-xs bg-white/10">
                      <span className="text-[10px] text-white font-mono font-black">{idx + 1}</span>
                    </div>
                    <div className="text-[6px] tracking-tighter text-center font-bold text-white uppercase opacity-90 truncate select-none">
                      Wimpy Kid
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-sans font-extrabold tracking-widest text-natural-accent uppercase">
                      {book.volume} • {book.publishYear}
                    </span>
                    <h3 className="font-serif font-bold text-base text-natural-text mt-0.5 leading-snug group-hover:text-natural-accent">
                      {book.title}
                    </h3>
                    <p className="text-[10px] font-sans text-natural-accent italic mt-0.5">
                      {book.genre}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-natural-text mb-4 leading-relaxed font-sans line-clamp-3">
                  {book.description}
                </p>
              </div>

              <div className="pt-3 border-t border-natural-border/70 mt-auto">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold text-natural-accent uppercase tracking-wider bg-white/80 border border-natural-border px-1.5 py-0.5 rounded">
                    {book.totalPages} Pages
                  </span>
                  
                  {isAdded && (
                    <span className="text-[10px] text-natural-accent font-sans font-bold flex items-center gap-1 uppercase tracking-wide">
                      <Check className="w-3.5 h-3.5" /> Shelved
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleQuickAdd(book)}
                  disabled={isAdded}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    isAdded
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 cursor-not-allowed'
                      : 'bg-natural-dark text-white hover:bg-natural-accent hover:shadow-xs cursor-pointer'
                  }`}
                >
                  {isAdded ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{isAdded ? "Shelved" : "Log to Shelf"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
