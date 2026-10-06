import { SuggestedBook } from './types';

export const FICTION_GENRES = [
  'Fantasy',
  'Sci-Fi',
  'Romance',
  'Mystery',
  'Thriller',
  'Historical Fiction',
  'Horror',
  'Adventure',
  'Dystopian',
  'Contemporary',
  'Magical Realism',
  'Graphic Novels',
];

export const NONFICTION_GENRES = [
  'Biography',
  'Self-Help',
  'True Crime',
  'History',
  'Science & Tech',
];

export const POPULAR_FALLBACKS: SuggestedBook[] = [
  // Fiction
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    category: 'Fiction',
    description: 'A classic high-fantasy quest across Middle-earth filled with dragons, treasure, and magic.',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Sci-Fi',
    category: 'Fiction',
    description: 'An epic space-opera exploring politics, religion, and survival on the desert planet Arrakis.',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Historical Fiction',
    category: 'Fiction',
    description: 'A tragic exploration of wealth, love, and ambition set during the roaring twenties.',
  },
  {
    title: 'And Then There Were None',
    author: 'Agatha Christie',
    genre: 'Mystery',
    category: 'Fiction',
    description: 'Ten strangers are lured to an isolated island, where they are mysteriously killed one by one.',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    category: 'Fiction',
    description: 'A timeless romantic comedy of manners, social standing, and overcoming first impressions.',
  },
  {
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel García Márquez',
    genre: 'Magical Realism',
    category: 'Fiction',
    description: 'The monumental story of the Buendía family across generations in the mythical town of Macondo.',
  },
  // Nonfiction
  {
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Biography',
    category: 'Nonfiction',
    description: 'An unforgettable memoir about family, survival, and the self-reinvention found through education.',
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'History',
    category: 'Nonfiction',
    description: 'An provocative investigation into the evolutionary journey of humanity and our global societies.',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    category: 'Nonfiction',
    description: 'A practical, science-backed handbook for breaking bad routines and forming tiny, positive habits.',
  },
  {
    title: 'In Cold Blood',
    author: 'Truman Capote',
    genre: 'True Crime',
    category: 'Nonfiction',
    description: 'A chillingly detailed reconstruction of a brutal murder and its psychological aftermath.',
  },
  {
    title: 'The Elegant Universe',
    author: 'Brian Greene',
    genre: 'Science & Tech',
    category: 'Nonfiction',
    description: 'An accessible plunge into superstring theory and the hidden dimensions of our cosmos.',
  }
];
