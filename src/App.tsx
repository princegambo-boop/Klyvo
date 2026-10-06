import React, { useState, useEffect, useMemo } from 'react';
import { Book, SuggestedBook, NotificationItem } from './types';
import BookForm from './components/BookForm';
import BookCard from './components/BookCard';
import ReviewModal from './components/ReviewModal';
import SuggestionsSection from './components/SuggestionsSection';
import FeaturedSeries from './components/FeaturedSeries';
import Confetti from './components/Confetti';
import SupportModal from './components/SupportModal';
import AudiobookSection from './components/AudiobookSection';
import SocialSection from './components/SocialSection';
import { 
  BookOpen, 
  Library, 
  BookMarked, 
  Award, 
  Percent, 
  Search, 
  Undo2, 
  Sparkles, 
  Info, 
  CheckCircle, 
  AlertOctagon, 
  Moon, 
  Sun, 
  Bell, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  MessageSquare, 
  Radio, 
  HelpCircle,
  Play,
  Pause
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Seeding 3 beautiful default books to make the library appear lived-in and stunning on first boot
const DEFAULT_BOOKS: Book[] = [
  {
    id: 'seed-1',
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    genre: 'Magical Realism',
    category: 'Fiction',
    rating: 5,
    review: 'An absolutely enchanting gothic love letter to literature itself. Set in industrial post-war Barcelona, the Cemetery of Forgotten Books captured my heart instantly. Zafón’s prose is incredibly rich, evocative, and atmospheric. One of my favorite reads of all time.',
    totalPages: 487,
    currentPage: 320,
    dateAdded: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
  {
    id: 'seed-2',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'History',
    category: 'Nonfiction',
    rating: 4,
    review: 'A highly provocational sweep through history. Harari does a spectacular job of analyzing our evolutionary story through social myths, money, empire, and cognitive revolutions. Truly changes how you view our species and standard societies.',
    totalPages: 512,
    currentPage: 512, // Completed
    dateAdded: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
  },
  {
    id: 'seed-3',
    title: 'The Way of Kings',
    author: 'Brandon Sanderson',
    genre: 'Fantasy',
    category: 'Fiction',
    rating: 5,
    review: 'The world-building here is titanic. From storm-ridden geology to specialized spren entities, Sanderson constructs a breathtakingly epic canvas. Kaladin and Dalinar’s viewpoints are incredibly heroic and gripping. Highly recommended for fans of expansive high fantasy!',
    totalPages: 1007,
    currentPage: 180,
    dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  }
];

export default function App() {
  // Books Shelf state
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('personal_book_library');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error parsing shelved books from localStorage:', e);
    }
    return DEFAULT_BOOKS;
  });

  // Dark/Light Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('klyvo_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'light';
  });

  // Connection management simulation
  const [offlineMode, setOfflineMode] = useState<boolean>(false);

  // Layout Nav Tabs
  const [activeTabSegment, setActiveTabSegment] = useState<'sanctuary' | 'audiobooks' | 'exchange'>('sanctuary');

  // Real-time notifications container
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'n-1', text: 'Welcome to your newly restored Mossy Hollow Literary Sanctuary! 🦉', timestamp: 'Just now', read: false, category: 'achievement' },
    { id: 'n-2', text: 'Auto-sync enabled across registered Apple and Android devices.', timestamp: 'Just now', read: false, category: 'sync' }
  ]);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState<boolean>(false);

  // Background Audio playing state passed to Audiobook systems
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [audiobookPlaying, setAudiobookPlaying] = useState<boolean>(false);
  const [audiobookProgress, setAudiobookProgress] = useState<number>(0);

  // Review modal
  const [activeReviewBook, setActiveReviewBook] = useState<Book | null>(null);
  const [activeReviewTab, setActiveReviewTab] = useState<'journal' | 'reader'>('journal');
  
  // Custom states for interactive modals & toasts
  const [confettiActive, setConfettiActive] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [klyvoToast, setKlyvoToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setKlyvoToast({ text, type });
  };

  // Helper to append real-time notifications
  const addNotification = (text: string, category: 'social' | 'sync' | 'achievement' | 'reading') => {
    const fresh: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2,6)}`,
      text,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      read: false,
      category
    };
    setNotifications(prev => [fresh, ...prev]);
  };

  // Trigger smooth dark mode switching
  useEffect(() => {
    localStorage.setItem('klyvo_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle Multi-Tab Device Sync natively via storage listener!
  useEffect(() => {
    const handleRemoteSync = (e: StorageEvent) => {
      if (e.key === 'personal_book_library' && e.newValue) {
        setBooks(JSON.parse(e.newValue));
        showToast('Cross-device database synchronized!', 'info');
        addNotification('Shelved journals and progress synchronized from remote device!', 'sync');
      }
    };
    window.addEventListener('storage', handleRemoteSync);
    return () => window.removeEventListener('storage', handleRemoteSync);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('personal_book_library', JSON.stringify(books));
  }, [books]);

  // Simulate incoming community notifications every minute to make it feel alive!
  useEffect(() => {
    const notificationsTickers = [
      () => {
        addNotification('Clarissa Pine reacted to your review of Carlos Ruiz Zafón', 'social');
        showToast('New social note from Clarissa!', 'info');
      },
      () => {
        addNotification('Synergy Completed: 12 offline pages logged have been synchronized with Cloud backup ledger', 'sync');
        showToast('Incremental sync completed successfully.', 'success');
      },
      () => {
        addNotification('New discussion thread active in "The Oakwood Circle" guild chat!', 'social');
      },
      () => {
        addNotification('Achievement Unlocked: Midnight Scholar (Logged a volume during peaceful hours)', 'achievement');
        setConfettiActive(true);
        showToast('Achievement Unlocked: Midnight Scholar!', 'success');
      }
    ];

    const interval = setInterval(() => {
      if (!offlineMode) {
        const randomIndex = Math.floor(Math.random() * notificationsTickers.length);
        notificationsTickers[randomIndex]();
      }
    }, 45000); // Track notifications every 45 secs

    return () => clearInterval(interval);
  }, [offlineMode]);

  // Auto-clear toast helper
  useEffect(() => {
    if (klyvoToast) {
      const timer = setTimeout(() => {
        setKlyvoToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [klyvoToast]);

  // Searching & Filtration States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Fiction' | 'Nonfiction'>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'rating' | 'progress'>('date');

  // Handle adding new books to shelf list
  const handleAddBook = (newBookData: Omit<Book, 'id' | 'dateAdded'>) => {
    const freshBook: Book = {
      ...newBookData,
      id: `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      dateAdded: new Date().toISOString(),
    };
    setBooks(prev => [freshBook, ...prev]);
    showToast(`Successfully logged and shelved "${newBookData.title}"!`, 'success');
    addNotification(`Logged and shelved ancient volume "${newBookData.title}" to digital stack.`, 'reading');
    
    // Simulate immediate offline warning if flagged
    if (offlineMode) {
      addNotification(`Book saved locally to offline backup cache ledger.`, 'sync');
    }
  };

  // Handle updates to a book's current page count
  const handleUpdatePage = (id: string, newPage: number) => {
    setBooks(prev => {
      const updatedBooks = prev.map(b => {
        if (b.id === id) {
          const originallyNotFinished = b.currentPage < b.totalPages;
          const targetPage = Math.min(b.totalPages, Math.max(0, newPage));
          const nowFinished = targetPage >= b.totalPages;
          
          if (originallyNotFinished && nowFinished) {
            setConfettiActive(true);
            showToast(`Congratulations! You have completed "${b.title}"! 🎉`, 'success');
            addNotification(`You have successfully finished the entire book: "${b.title}"! 🎉`, 'reading');
          } else if (targetPage !== b.currentPage) {
            showToast(`Updated progress on "${b.title}"`, 'info');
          }
          return { ...b, currentPage: targetPage };
        }
        return b;
      });

      // Maintain modal state if focused
      const focusedBook = updatedBooks.find(b => b.id === id);
      if (focusedBook && activeReviewBook?.id === id) {
        setActiveReviewBook(focusedBook);
      }

      return updatedBooks;
    });
  };

  // Remove / Unlog volume from shelf - non-blocking promptless deletion with toast!
  const handleRemoveBook = (id: string) => {
    const bookToDelete = books.find(b => b.id === id);
    if (bookToDelete) {
      setBooks(prev => prev.filter(b => b.id !== id));
      if (activeReviewBook?.id === id) {
        setActiveReviewBook(null);
      }
      showToast(`Removed "${bookToDelete.title}" from your bookshelf.`, 'info');
      addNotification(`Unlogged and deleted volume "${bookToDelete.title}" from your curated stacks.`, 'reading');
    }
  };

  // Handle updating writing reviews
  const handleUpdateReview = (id: string, newReview: string) => {
    setBooks(prev =>
      prev.map(b => {
        if (b.id === id) {
          const updated = { ...b, review: newReview };
          if (activeReviewBook?.id === id) {
            setActiveReviewBook(updated);
          }
          return updated;
        }
        return b;
      })
    );
    showToast("Journal entry updated successfully.", "success");
    addNotification(`Edited critique notes on file for "${books.find(x => x.id === id)?.title}".`, 'reading');
  };

  // Shelve suggested book
  const handleAddFromSuggestions = (suggested: SuggestedBook) => {
    const isAlreadyOnShelf = books.some(b => b.title.toLowerCase() === suggested.title.toLowerCase());
    if (isAlreadyOnShelf) {
      showToast(`"${suggested.title}" is already on your library shelf.`, 'error');
      return;
    }

    const defaultPages = suggested.genre === 'Sci-Fi' || suggested.genre === 'Fantasy' ? 450 : 320;
    
    const freshBook: Book = {
      id: `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: suggested.title,
      author: suggested.author,
      genre: suggested.genre,
      category: suggested.category,
      rating: 5,
      review: `Shelved from custom recommendations: "${suggested.description}"`,
      totalPages: defaultPages,
      currentPage: 0,
      dateAdded: new Date().toISOString()
    };

    setBooks(prev => [freshBook, ...prev]);
    showToast(`Shelved "${suggested.title}" to your library.`, 'success');
    addNotification(`Acquired and shelved suggested reading volume: "${suggested.title}"`, 'reading');
  };

  // Open modal with specific initial tab
  const handleOpenReviewWithTab = (book: Book, tab: 'journal' | 'reader') => {
    setActiveReviewTab(tab);
    setActiveReviewBook(book);
  };

  // Reset to default seeds if shelf is empty
  const handleSeedDefaults = () => {
    setBooks(DEFAULT_BOOKS);
    showToast('Loaded 3 seeded medieval classic volumes!', 'success');
  };

  // Get unique genres
  const uniqueGenres = useMemo(() => {
    const genres = new Set<string>();
    books.forEach(b => genres.add(b.genre));
    return Array.from(genres);
  }, [books]);

  // Statistics Computations
  const stats = useMemo(() => {
    const totalCount = books.length;
    let completedCount = 0;
    let sumPagesRead = 0;
    let sumTotalPages = 0;
    let sumRating = 0;

    books.forEach(b => {
      if (b.currentPage >= b.totalPages) {
        completedCount += 1;
      }
      sumPagesRead += b.currentPage;
      sumTotalPages += b.totalPages;
      sumRating += b.rating;
    });

    const averageRating = totalCount > 0 ? (sumRating / totalCount).toFixed(1) : '0';
    const overallProgressPercent = sumTotalPages > 0 ? Math.round((sumPagesRead / sumTotalPages) * 100) : 0;

    return {
      totalCount,
      completedCount,
      sumPagesRead,
      sumTotalPages,
      averageRating,
      overallProgressPercent
    };
  }, [books]);

  // Search filter list
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(b => b.category === selectedCategory);
    }

    if (selectedGenre !== 'All') {
      result = result.filter(b => b.genre === selectedGenre);
    }

    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'progress') {
        const aProgress = a.currentPage / a.totalPages;
        const bProgress = b.currentPage / b.totalPages;
        return bProgress - aProgress;
      }
      return 0;
    });

    return result;
  }, [books, searchQuery, selectedCategory, selectedGenre, sortBy]);

  // Handle manual toggle of online/offline status
  const toggleOfflineMode = () => {
    const targetState = !offlineMode;
    setOfflineMode(targetState);
    if (targetState) {
      showToast('Offline Mode Activated. Changes cached locally.', 'error');
      addNotification('Connectivity state changed: Offline. Transactions saved local-only until reconnect.', 'sync');
    } else {
      showToast('Connection Re-established. Syncing stacks...', 'success');
      addNotification('Connectivity restored! Synced 3 offline journals, bookmarks, and highlights.', 'sync');
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications marked read.', 'info');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotificationsPanel(false);
    showToast('Alarms list cleared.', 'info');
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text pb-16 font-sans antialiased transition-colors duration-300">
      
      {/* Top utility helper bar showing devices and sync indicators */}
      <div className="bg-[#ECEFE9] dark:bg-[#121914] border-b border-natural-border dark:border-[#1E3023] py-2 px-4 sm:px-6 lg:px-8 text-[11px] font-sans font-bold text-natural-accent flex flex-wrap gap-4 items-center justify-between">
        
        {/* Device Sync List */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 inline text-natural-accent/60" />
            <span>Devices Linked: iPad Mini, iPhone 15 & MacBook </span>
          </span>
          <span className="text-natural-border dark:text-[#203324] font-light">|</span>
          <span className="text-emerald-700 dark:text-emerald-500 flex items-center gap-1 animate-pulse">
            <CheckCircle className="w-3 h-3" />
            <span>Live Multi-Tab Sync Active</span>
          </span>
        </div>

        {/* Sync trigger simulation panel */}
        <div className="flex items-center gap-4.5">
          {/* Signal Indicator & Offline Toggle Switch */}
          <button
            onClick={toggleOfflineMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase font-sans tracking-wider border cursor-pointer font-black transition-all ${
              offlineMode
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
            }`}
            title="Toggle Offline Status Simulation"
          >
            {offlineMode ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-700" />
                <span>Simulated Offline Cache</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-700 animate-pulse" />
                <span>Online / Cloud Syncing</span>
              </>
            )}
          </button>

          {/* Theme custom button */}
          <button
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="p-1 px-2.5 rounded-lg bg-white dark:bg-[#1E3023] border border-natural-border dark:border-transparent text-natural-accent hover:text-natural-text dark:hover:text-[#ECEFEA] flex items-center gap-1 cursor-pointer transition-colors"
            title="Toggle Cozy Dark/Light Mode"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-700" />
                <span className="text-[10px] uppercase font-black tracking-wider">Hollow Shadows</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '10s' }} />
                <span className="text-[10px] uppercase font-black tracking-wider">Morning Light</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Literary Top Banner */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-end border-b-2 border-natural-accent pb-4 mb-6 mt-6 relative">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight italic text-natural-text">Klyvo</h1>
          <p className="text-natural-accent font-sans uppercase tracking-widest text-[#4F7057] dark:text-[#83A98B] text-xs mt-1 font-extrabold">Your Personal Literary Sanctuary</p>
        </div>
        
        {/* RIGHT SIDE: Volumes logged, and Notifications System */}
        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-4xl font-light italic text-natural-text font-serif leading-none">{stats.totalCount}</span>
            <p className="text-natural-accent font-sans uppercase tracking-widest text-[10px] font-black">Curated Stacks</p>
          </div>

          {/* Real-time Notifications Alert Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
              className="p-2.5 bg-neutral-100 dark:bg-[#1E3023] hover:bg-neutral-200 rounded-xl relative transition-all cursor-pointer border border-[#E3EAE0] dark:border-transparent text-natural-text"
              title="Notifications Drawer"
            >
              <Bell className="w-4 h-4 text-natural-accent" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-600 border-2 border-white dark:border-neutral-900 rounded-full text-[9px] font-sans font-black text-white flex items-center justify-center animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* EXPANDABLE REAL-TIME NOTIFICATIONS DRAWER */}
            <AnimatePresence>
              {showNotificationsPanel && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#121914] border border-natural-border dark:border-[#1E3023] rounded-2xl shadow-xl p-4 z-40 text-left space-y-3"
                >
                  <div className="flex justify-between items-center border-b border-natural-border dark:border-[#203324] pb-2 text-xs">
                    <span className="font-serif font-black italic text-natural-text flex items-center gap-1">
                      <Bell className="w-3.5 h-3.5 text-natural-accent" /> Scroll Alerts
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[9px] uppercase tracking-wide font-bold hover:underline text-natural-accent"
                      >
                        Read All
                      </button>
                      <span className="text-natural-accent/30 font-light">•</span>
                      <button
                        onClick={clearAllNotifications}
                        className="text-[9px] uppercase tracking-wide font-bold hover:underline text-red-600"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 select-text custom-scrollbar">
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-natural-accent text-center py-6 italic font-serif">
                        Your alerts stack is currently peaceful
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2 rounded-xl text-[10px] leading-relaxed border transition-colors ${
                            n.read 
                              ? 'bg-neutral-50/50 dark:bg-black/5 border-neutral-100 dark:border-transparent text-natural-text/60' 
                              : 'bg-[#4F7057]/10 dark:bg-[#83A98B]/10 border-[#ECEFE9] dark:border-transparent text-natural-text font-bold'
                          }`}
                        >
                          <div className="flex justify-between text-[8px] opacity-60 mb-0.5 font-sans font-bold uppercase">
                            <span>{n.category} log</span>
                            <span>{n.timestamp}</span>
                          </div>
                          <p className="font-sans leading-normal">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="text-center pt-1.5 border-t border-natural-border/30">
                    <button
                      onClick={() => setShowNotificationsPanel(false)}
                      className="text-[10px] uppercase font-sans font-black text-natural-text hover:text-natural-accent"
                    >
                      Hide alerts
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Floating Persistant Background Audiobook Player Notification */}
      {activeTrackId && (
        <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-80 bg-white dark:bg-natural-card border border-natural-accent/30 dark:border-[#203324] p-3 rounded-2xl shadow-xl z-30 font-sans text-xs flex items-center justify-between gap-3 animate-slide-up bg-opacity-95 backdrop-blur-xs">
          <div className="flex items-center gap-3 truncate">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-natural-accent flex items-center justify-center text-white text-xs animate-spin" style={{ animationDuration: '6s' }}>
                <Radio className="w-4 h-4" />
              </div>
            </div>
            <div className="truncate">
              <span className="text-[8px] uppercase font-sans font-black text-natural-accent tracking-widest leading-none">Acoustic background on</span>
              <h4 className="font-serif font-black text-natural-text truncate leading-tight">Narrating ChapterExcerpt</h4>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setActiveTabSegment('audiobooks')}
              className="px-2 py-1 bg-natural-card dark:bg-[#1E3023] hover:bg-natural-accent hover:text-white rounded text-[8px] font-sans font-black uppercase tracking-wider"
            >
              Open Hub
            </button>
            <button
              onClick={() => {
                // stop speech
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setAudiobookPlaying(false);
                setActiveTrackId(null);
                showToast('Acoustic voice suspended.', 'info');
              }}
              className="p-1 px-1.5 hover:bg-red-50 text-red-600 rounded text-[9px] uppercase font-bold"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* App Tab Switcher Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-1 font-sans text-xs" id="curator-navigation-headers">
        <div className="flex border-b border-natural-accent/30 dark:border-white/5 gap-2.5 md:gap-4 pb-0">
          
          {/* Sanctuary Tab Card */}
          <button
            onClick={() => setActiveTabSegment('sanctuary')}
            className={`pb-3 px-1 md:px-3 font-black uppercase tracking-widest border-b-2 hover:text-natural-text dark:hover:text-[#ECEFEA] transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSegment === 'sanctuary'
                ? 'border-natural-accent text-natural-text text-sm'
                : 'border-transparent text-natural-accent/60'
            }`}
          >
            <Library className="w-4 h-4 text-natural-accent" />
            <span>The Stacks</span>
          </button>

          {/* Dedicated Audiobook Sanctuary Tab Card */}
          <button
            onClick={() => setActiveTabSegment('audiobooks')}
            className={`pb-3 px-1 md:px-3 font-black uppercase tracking-widest border-b-2 hover:text-natural-text dark:hover:text-[#ECEFEA] transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSegment === 'audiobooks'
                ? 'border-natural-accent text-natural-text text-sm'
                : 'border-transparent text-natural-accent/60'
            }`}
          >
            <Radio className="w-4 h-4 text-natural-accent animate-pulse" />
            <span>Audiobook Shelter</span>
            <span className="bg-[#4F7057] text-[#FCF9F5] text-[8px] font-sans font-extrabold px-1.5 py-0.2 rounded-full scale-90">Whisper</span>
          </button>

          {/* Dedicated exchange social board */}
          <button
            onClick={() => setActiveTabSegment('exchange')}
            className={`pb-3 px-1 md:px-3 font-black uppercase tracking-widest border-b-2 hover:text-natural-text dark:hover:text-[#ECEFEA] transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSegment === 'exchange'
                ? 'border-natural-accent text-natural-text text-sm'
                : 'border-transparent text-natural-accent/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-natural-accent" />
            <span>The Exchange</span>
            <span className="bg-amber-600 text-white text-[8px] font-sans font-extrabold px-1.5 py-0.2 rounded-full scale-90">Social</span>
          </button>

        </div>
      </nav>

      {/* Main Container Grid with Active Views switcher */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        
        <AnimatePresence mode="wait">
          {activeTabSegment === 'sanctuary' && (
            <motion.div
              key="sanctuary-segment"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Metric Row */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="metric-summary-dashboard">
                {/* Metric 1 - Total Books */}
                <div className="bg-white dark:bg-natural-card border border-natural-border dark:border-[#1E3023] rounded-xl p-4 flex items-center space-x-3 shadow-xs">
                  <div className="p-3 bg-neutral-50 dark:bg-[#1E3023] text-natural-accent rounded-lg border border-neutral-100 dark:border-transparent">
                    <Library className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-natural-accent font-semibold">Curated</span>
                    <span className="font-serif text-2xl font-black text-natural-text">{stats.totalCount}</span>
                    <span className="text-xs text-natural-text/70 ml-1">vols</span>
                  </div>
                </div>

                {/* Metric 2 - Completed Volume */}
                <div className="bg-white dark:bg-natural-card border border-natural-border dark:border-[#1E3023] rounded-xl p-4 flex items-center space-x-3 shadow-xs">
                  <div className="p-3 bg-neutral-50 dark:bg-[#1E3023] text-natural-accent rounded-lg border border-neutral-100 dark:border-transparent">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-natural-accent font-semibold">Finished</span>
                    <span className="font-serif text-2xl font-black text-natural-text">{stats.completedCount}</span>
                    <span className="text-xs text-natural-text/70 ml-1">read</span>
                  </div>
                </div>

                {/* Metric 3 - Cumulative Page Percent */}
                <div className="bg-white dark:bg-natural-card border border-natural-border dark:border-[#1E3023] rounded-xl p-4 flex items-center space-x-3 shadow-xs">
                  <div className="p-3 bg-neutral-50 dark:bg-[#1E3023] text-natural-accent rounded-lg border border-neutral-100 dark:border-transparent">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-natural-accent font-semibold">Read Percent</span>
                    <span className="font-serif text-2xl font-black text-natural-text">{stats.overallProgressPercent}%</span>
                    <span className="text-xs text-natural-text/70 ml-1">pages</span>
                  </div>
                </div>

                {/* Metric 4 - Average Rating */}
                <div className="bg-white dark:bg-natural-card border border-natural-border dark:border-[#1E3023] rounded-xl p-4 flex items-center space-x-3 shadow-xs">
                  <div className="p-3 bg-neutral-50 dark:bg-[#1E3023] text-natural-accent rounded-lg border border-neutral-100 dark:border-transparent">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-natural-accent font-semibold">Avg Rating</span>
                    <span className="font-serif text-2xl font-black text-natural-text">{stats.averageRating}</span>
                    <span className="text-xs text-natural-text/70 ml-1">stars</span>
                  </div>
                </div>
              </section>

              {/* Form and Book list stack */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column - Book Logging Form */}
                <div className="lg:col-span-4 space-y-6">
                  <BookForm onAddBook={handleAddBook} />
                </div>

                {/* Right Column - Curated Volumes Collection logs */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-white dark:bg-natural-card border border-natural-border dark:border-[#1E3023] rounded-xl p-5 md:p-6 shadow-sm">
                    
                    {/* Shelves Control header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-natural-border dark:border-[#1E3023] mb-5">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-natural-text flex items-center gap-1.5 italic">
                          Current Stacks Curation
                        </h3>
                        <p className="text-xs text-natural-accent font-mono mt-0.5 uppercase tracking-wide font-semibold">
                          {filteredAndSortedBooks.length} showing of {books.length} logs
                        </p>
                      </div>

                      {/* Theme Categories filter pills */}
                      <div className="flex gap-1.5 font-sans">
                        {(['All', 'Fiction', 'Nonfiction'] as const).map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 text-[10px] rounded-full font-sans uppercase transition-all duration-150 font-bold cursor-pointer ${
                              selectedCategory === cat
                                ? 'bg-natural-accent text-white'
                                : 'bg-neutral-100 dark:bg-[#1E3023] text-natural-text border border-[#D6DBD2] dark:border-transparent hover:border-natural-accent'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      
                      {/* Seed button if library empty */}
                      {books.length === 0 && (
                        <button
                          onClick={handleSeedDefaults}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 dark:bg-[#1C291E] hover:opacity-85 text-natural-text border border-natural-border dark:border-transparent text-xs font-mono font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          <span>Load Seeds</span>
                        </button>
                      )}
                    </div>

                    {/* Advanced filter row */}
                    <div className="space-y-4">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-natural-accent/60" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by book title or author..."
                          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E3023] border border-natural-border dark:border-transparent text-sm rounded-lg text-natural-text placeholder:opacity-50 focus:outline-none focus:ring-1 focus:ring-natural-accent focus:border-natural-accent font-sans"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-natural-text hover:text-natural-accent bg-neutral-100 dark:bg-black/40 px-1.5 py-0.5 rounded transition-all cursor-pointer"
                          >
                            CLEAR
                          </button>
                        )}
                      </div>

                      {/* Filter / Sort dropdown settings */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        
                        {/* Genre Selection */}
                        <div className="space-y-1">
                          <span className="block text-[10px] font-sans font-bold text-natural-accent uppercase tracking-widest pl-0.5">Genre Filter</span>
                          <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-[#1E3023] border border-natural-border dark:border-transparent rounded-lg text-xs font-sans font-semibold focus:outline-none focus:ring-1 focus:ring-natural-accent text-natural-text cursor-pointer"
                          >
                            <option value="All">All Genres</option>
                            {uniqueGenres.map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>

                        {/* Sort selection */}
                        <div className="space-y-1">
                          <span className="block text-[10px] font-sans font-bold text-natural-accent uppercase tracking-widest pl-0.5">Sort Sequence</span>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full px-3 py-2 bg-white dark:bg-[#1E3023] border border-natural-border dark:border-transparent rounded-lg text-xs font-sans font-semibold focus:outline-none focus:ring-1 focus:ring-natural-accent text-natural-text cursor-pointer"
                          >
                            <option value="date">Date Logged</option>
                            <option value="title">Alphabetical (A-Z)</option>
                            <option value="rating">Star Rating (High-Low)</option>
                            <option value="progress">Reading Progress (%)</option>
                          </select>
                        </div>

                      </div>
                    </div>

                    {/* Bookshelves Cards Grid */}
                    <div className="mt-6">
                      {filteredAndSortedBooks.length === 0 ? (
                        <div className="text-center py-16 px-4 bg-neutral-50 dark:bg-zinc-950 rounded-xl border border-dashed border-natural-border dark:border-[#203324]">
                          <BookOpen className="w-12 h-12 text-natural-accent/40 mx-auto mb-3" />
                          <h4 className="font-serif text-lg font-bold text-natural-text">Your bookshelf is quiet</h4>
                          <p className="text-xs text-natural-accent font-serif leading-relaxed max-w-sm mx-auto mt-2.5">
                            No matching volumes found. Log your read above, or pick one of the recommended titles below!
                          </p>
                          
                          {books.length > 0 && (
                            <button
                              onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                                setSelectedGenre('All');
                              }}
                              className="mt-4 px-4 py-2 bg-natural-accent hover:bg-natural-text text-white rounded-lg text-xs font-sans font-bold cursor-pointer"
                            >
                              Reset Filtration Settings
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="bookshelf-card-grid">
                          <AnimatePresence mode="popLayout">
                            {filteredAndSortedBooks.map((book) => (
                              <BookCard
                                key={book.id}
                                book={book}
                                onUpdatePage={handleUpdatePage}
                                onRemoveBook={handleRemoveBook}
                                onOpenReview={(b, initialTab) => handleOpenReviewWithTab(b, initialTab || 'reader')}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </section>

              {/* Wimpy Kid Series */}
              <FeaturedSeries
                onAddBook={handleAddBook}
                shelvedBooks={books}
              />

              {/* Dynamic Bottom Smart Suggestions */}
              <SuggestionsSection
                booksOnShelf={books}
                onAddFromSuggestions={handleAddFromSuggestions}
              />
            </motion.div>
          )}

          {activeTabSegment === 'audiobooks' && (
            <motion.div
              key="audiobook-segment"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <AudiobookSection
                booksRef={books}
                offlineMode={offlineMode}
                onShowToast={showToast}
                activeTrackId={activeTrackId}
                setActiveTrackId={setActiveTrackId}
                isPlaying={audiobookPlaying}
                setIsPlaying={setAudiobookPlaying}
                playbackProgress={audiobookProgress}
                setPlaybackProgress={setAudiobookProgress}
              />
            </motion.div>
          )}

          {activeTabSegment === 'exchange' && (
            <motion.div
              key="exchange-segment"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <SocialSection
                booksRef={books}
                onShowToast={showToast}
                onAddNotification={addNotification}
              />
            </motion.div>
          )}

        </AnimatePresence>

        {/* Floating Modals and Dialog Canvas indicators */}
        <AnimatePresence>
          {activeReviewBook && (
            <ReviewModal
              book={activeReviewBook}
              initialTab={activeReviewTab}
              onClose={() => setActiveReviewBook(null)}
              onUpdateReview={handleUpdateReview}
              onUpdatePage={handleUpdatePage}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {supportOpen && (
            <SupportModal
              isOpen={supportOpen}
              onClose={() => setSupportOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Dynamic Confetti triggers */}
        <Confetti
          active={confettiActive}
          onComplete={() => setConfettiActive(false)}
        />

        {/* Toast alerts */}
        <AnimatePresence>
          {klyvoToast && (
            <motion.div
              initial={{ opacity: 0, y: -25, x: '-50%', scale: 0.9 }}
              animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
              exit={{ opacity: 0, y: -10, x: '-50%', scale: 0.9 }}
              className={`fixed top-6 left-1/2 -translate-x-1/2 z-55 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-md font-sans text-xs font-bold leading-none ${
                klyvoToast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/90 dark:border-emerald-800'
                  : klyvoToast.type === 'error'
                  ? 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/90 dark:border-amber-800'
                  : 'bg-white border-natural-accent/30 text-natural-text font-black dark:bg-[#1E3023]'
              }`}
            >
              {klyvoToast.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : klyvoToast.type === 'error' ? (
                <AlertOctagon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <Info className="w-4 h-4 text-natural-accent" />
              )}
              <span>{klyvoToast.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer Section decorated in cozy natural colors */}
      <footer className="w-full mt-16 border-t border-natural-border dark:border-[#1E3023] bg-white dark:bg-natural-card py-10 px-4 sm:px-6 lg:px-8" id="klyvo-app-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 font-sans text-xs text-natural-accent">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left">
            <span className="font-serif font-black italic text-2xl text-natural-text leading-none">Klyvo</span>
            <span className="hidden sm:inline text-natural-accent/40 font-light">|</span>
            <span className="font-medium">© 2026 Klyvo. All rights reserved. Your Mossy Hollow Sanctuary.</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="mailto:support@klyvo.com" 
              className="hover:text-natural-text transition-colors duration-150 font-bold text-natural-accent hover:underline decoration-natural-accent/30 decoration-2"
            >
              support@klyvo.com
            </a>
            <span className="text-natural-accent/30 font-light">•</span>
            <button 
              onClick={() => setSupportOpen(true)}
              className="bg-natural-dark dark:bg-[#203324] hover:bg-natural-accent hover:shadow-xs text-white rounded-lg px-4 py-2 transition-all duration-150 font-bold uppercase tracking-wider text-[10px] shadow-xs cursor-pointer border border-[#E3EAE0] dark:border-transparent"
            >
              Contact Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
