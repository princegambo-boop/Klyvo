export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  category: 'Fiction' | 'Nonfiction';
  rating: number; // 1 to 5
  review: string;
  totalPages: number;
  currentPage: number;
  dateAdded: string;
}

export interface SuggestedBook {
  title: string;
  author: string;
  genre: string;
  category: 'Fiction' | 'Nonfiction';
  description: string;
  reason?: string;
}

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  readingSpeed: number; // Words per minute
  achievementBadges: { title: string; desc: string; iconName: string }[];
  joinedClubs: string[]; // Club IDs
  readGoal: number; // Goal books completed per month
}

export interface ClubMessage {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  isAI?: boolean;
}

export interface ReadingClub {
  id: string;
  name: string;
  description: string;
  category: string;
  activeBook: string;
  membersCount: number;
  bannerColor: string;
  messages: ClubMessage[];
}

export interface NotificationItem {
  id: string;
  text: string;
  timestamp: string;
  read: boolean;
  category: 'social' | 'sync' | 'achievement' | 'reading';
}

export interface AudiobookTrack {
  id: string;
  title: string;
  author: string;
  totalDuration: number; // seconds
  narrator: string;
  coverAccent: string;
}

export interface ReaderSettings {
  fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  fontStyle: 'serif' | 'sans' | 'mono' | 'dyslexic';
  spacing: 'normal' | 'relaxed' | 'loose';
  highContrast: boolean;
}
