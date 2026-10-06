import React, { useMemo } from 'react';
import { Book, SuggestedBook } from '../types';
import { Sparkles, Bookmark, User, Compass, Heart } from 'lucide-react';
import { POPULAR_FALLBACKS } from '../data';

// Expanded dataset of literary suggestions to ensure high-quality matches across genres
const SUGGESTIONS_DATABASE: SuggestedBook[] = [
  // Fiction - Fantasy
  {
    title: 'The Way of Kings',
    author: 'Brandon Sanderson',
    genre: 'Fantasy',
    category: 'Fiction',
    description: 'An expansive modern fantasy masterpiece set in a storm-torn nation of highstorms and rich lore.',
  },
  {
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    genre: 'Fantasy',
    category: 'Fiction',
    description: 'The poetic first-person chronicle of Kvothe, a legendary wizard, musician, and fugitive.',
  },
  // Fiction - Sci-Fi
  {
    title: 'Neuromancer',
    author: 'William Gibson',
    genre: 'Sci-Fi',
    category: 'Fiction',
    description: 'The pioneering cyber-punk novel tracing a washed-up data-thief on a high-stakes matrix heist.',
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Sci-Fi',
    category: 'Fiction',
    description: 'A thrilling science-fueled survival story of a lone astronaut tasked with saving Earth from extinction.',
  },
  // Fiction - Romance
  {
    title: 'Book Lovers',
    author: 'Emily Henry',
    genre: 'Romance',
    category: 'Fiction',
    description: 'A witty enemies-to-lovers story set in a small, idyllic North Carolina town among literary agents.',
  },
  // Fiction - Mystery
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Mystery',
    category: 'Fiction',
    description: 'A shocking psychological thriller about a woman who shoots her husband and never speaks another word.',
  },
  // Fiction - Thriller
  {
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    genre: 'Thriller',
    category: 'Fiction',
    description: 'A dark, twisty exploration of a marriage gone sour and a mysterious disappearance.',
  },
  // Fiction - Historical Fiction
  {
    title: 'The Book Thief',
    author: 'Markus Zusak',
    genre: 'Historical Fiction',
    category: 'Fiction',
    description: 'Narrated by Death, this is a heartwarming yet devastating tale of a young girl in Nazi Germany.',
  },
  {
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    genre: 'Historical Fiction',
    category: 'Fiction',
    description: 'An aging Hollywood movie icon reflects on her glamorous, scandalous, and secret-filled life path.',
  },
  // Fiction - Horror
  {
    title: 'The Shining',
    author: 'Stephen King',
    genre: 'Horror',
    category: 'Fiction',
    description: 'A terrifying, slow-burn psychological descent into madness at an isolated mountain hotel.',
  },
  // Fiction - Adventure
  {
    title: 'Treasure Island',
    author: 'Robert Louis Stevenson',
    genre: 'Adventure',
    category: 'Fiction',
    description: 'The quintessential pirate adventure of young Jim Hawkins, maps, treasure, and Long John Silver.',
  },
  // Fiction - Dystopian
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    category: 'Fiction',
    description: 'The definitive dystopian statement on totalitarian surveillance, speech control, and thought policing.',
  },
  {
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    genre: 'Dystopian',
    category: 'Fiction',
    description: 'A chilling vision of a future society where reading is strictly forbidden and books are systematically burned.',
  },
  // Fiction - Contemporary
  {
    title: 'Normal People',
    author: 'Sally Rooney',
    genre: 'Contemporary',
    category: 'Fiction',
    description: 'An elegant, understated chronicle of young, intricate codependency and friendship across university years.',
  },
  // Fiction - Magical Realism
  {
    title: 'The Ocean at the End of the Lane',
    author: 'Neil Gaiman',
    genre: 'Magical Realism',
    category: 'Fiction',
    description: 'A dark, beautifully woven modern myth exploring memory, childhood terror, and hidden water magic.',
  },
  // Fiction - Graphic Novels
  {
    title: 'Watchmen',
    author: 'Alan Moore',
    genre: 'Graphic Novels',
    category: 'Fiction',
    description: 'An intricate, groundbreaking graphic novel deconstructing super-hero conventions amid cold-war paranoia.',
  },

  // Nonfiction - Biography
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    genre: 'Biography',
    category: 'Nonfiction',
    description: 'The riveting character study of a creative entrepreneur who revolutionized multiple global tech industries.',
  },
  // Nonfiction - Self-Help
  {
    title: 'Quiet: The Power of Introverts',
    author: 'Susan Cain',
    genre: 'Self-Help',
    category: 'Nonfiction',
    description: 'An enlightening argument for the creative power and value of introverts in a world that can not stop talking.',
  },
  // Nonfiction - True Crime
  {
    title: 'Mindhunter',
    author: 'John Douglas',
    genre: 'True Crime',
    category: 'Nonfiction',
    description: 'Insights from the FBI agent who spearheaded modern behavioral criminal profiling and serial killer interviews.',
  },
  // Nonfiction - History
  {
    title: 'Guns, Germs, and Steel',
    author: 'Jared Diamond',
    genre: 'History',
    category: 'Nonfiction',
    description: 'An environmental breakdown of how geography and resources shaped global wealth distribution over millennia.',
  },
  // Nonfiction - Science & Tech
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    genre: 'Science & Tech',
    category: 'Nonfiction',
    description: 'The landmark, elegant introduction to black holes, relativity, quantum gravity, and cosmic origin.',
  }
];

interface SuggestionsSectionProps {
  booksOnShelf: Book[];
  onAddFromSuggestions: (suggested: SuggestedBook) => void;
}

export default function SuggestionsSection({ booksOnShelf, onAddFromSuggestions }: SuggestionsSectionProps) {
  
  // Calculate suggestions based on 4-star and 5-star books
  const recommendations = useMemo(() => {
    // If shelf is empty, display general mix fallback
    if (booksOnShelf.length === 0) {
      return POPULAR_FALLBACKS.map(book => ({
        ...book,
        reason: "Editor's Selection: High-Quality Starting Picks"
      }));
    }

    // Filter books with 4 or 5 stars rating
    const highRatedBooks = booksOnShelf.filter(b => b.rating >= 4);

    if (highRatedBooks.length === 0) {
      // If there are books but none are >= 4 stars, suggest from popular fallbacks that aren't on the shelf
      const shelfTitles = new Set(booksOnShelf.map(b => b.title.toLowerCase()));
      const availableFallbacks = POPULAR_FALLBACKS.filter(b => !shelfTitles.has(b.title.toLowerCase()));
      
      return (availableFallbacks.length > 0 ? availableFallbacks : POPULAR_FALLBACKS).slice(0, 4).map(book => ({
        ...book,
        reason: "Editor's Pick for Book Lovers"
      }));
    }

    // Count frequency of favorite genres and authors
    const genreFrequencies: Record<string, number> = {};
    const authorFrequencies: Record<string, number> = {};

    highRatedBooks.forEach(b => {
      genreFrequencies[b.genre] = (genreFrequencies[b.genre] || 0) + 1;
      authorFrequencies[b.author] = (authorFrequencies[b.author] || 0) + 1;
    });

    // Find the genres/authors with high frequency
    const sortedFavGenres = Object.entries(genreFrequencies)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    const sortedFavAuthors = Object.entries(authorFrequencies)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    const shelfTitles = new Set(booksOnShelf.map(b => b.title.toLowerCase()));
    const finalMatches: SuggestedBook[] = [];

    // Prioritize authors & genres from database
    SUGGESTIONS_DATABASE.forEach(dbBook => {
      // Check if user already owns it
      if (shelfTitles.has(dbBook.title.toLowerCase())) return;

      // Match conditions
      const matchesAuthor = sortedFavAuthors.includes(dbBook.author);
      const matchesGenre = sortedFavGenres.includes(dbBook.genre);

      if (matchesAuthor) {
        finalMatches.push({
          ...dbBook,
          reason: `Special match: Because you rated books by ${dbBook.author} highly!`
        });
      } else if (matchesGenre) {
        finalMatches.push({
          ...dbBook,
          reason: `Dynamic Recommendation: In your favorite genre "${dbBook.genre}"`
        });
      }
    });

    // If matches are lean, pad them with popular items not yet on the shelf to make a rich section
    if (finalMatches.length < 4) {
      POPULAR_FALLBACKS.forEach(fallback => {
        if (finalMatches.length >= 4) return;
        if (shelfTitles.has(fallback.title.toLowerCase())) return;
        if (finalMatches.some(m => m.title.toLowerCase() === fallback.title.toLowerCase())) return;

        finalMatches.push({
          ...fallback,
          reason: `Highly Acclaimed ${fallback.genre} masterpiece to expand your horizons`
        });
      });
    }

    return finalMatches.slice(0, 4);
  }, [booksOnShelf]);

  return (
    <div className="bg-[#FDFCFB] border-t border-natural-border py-10 px-6 sm:px-8 mt-12">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-natural-border">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold font-serif text-natural-text flex items-center gap-1.5 italic">
              <span className="w-2.5 h-2.5 bg-natural-accent rounded-full inline-block"></span>
              Suggested Reads
            </h2>
          </div>
          <p className="text-xs text-natural-accent font-sans uppercase tracking-widest mt-1 md:mt-0 font-semibold">
            Tailored Library Compilations
          </p>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="suggested-reads-deck">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-white border border-natural-border rounded-xl p-5 hover:border-natural-accent transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Cover spine ornament */}
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-natural-accent"></div>

              <div>
                {/* Match Tag / Reason */}
                <div className="flex items-start justify-between gap-1 mb-3.5 pl-1.5">
                  <span className="text-[9px] font-bold text-natural-accent uppercase tracking-wider bg-natural-card px-2 py-0.5 rounded border border-natural-border block font-sans">
                    {rec.genre}
                  </span>
                  <span className="text-[9px] font-sans font-medium text-natural-accent/85 uppercase">
                    {rec.category}
                  </span>
                </div>

                <div className="pl-1.5">
                  <h4 className="font-serif font-bold text-base text-natural-text leading-tight group-hover:text-natural-accent transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-natural-text/75 italic mt-0.5">
                    by {rec.author}
                  </p>
                  
                  <p className="text-xs text-natural-text leading-relaxed font-sans mt-3 line-clamp-3">
                    {rec.description}
                  </p>
                </div>
              </div>

              <div className="pl-1.5 pt-4 mt-4 border-t border-natural-border">
                {/* Intelligent recommendation explanation */}
                <p className="text-[10px] text-natural-accent font-sans leading-tight mb-3 italic font-semibold">
                  {rec.reason}
                </p>

                {/* Add to Shelf Button */}
                <button
                  onClick={() => onAddFromSuggestions(rec)}
                  className="w-full py-1.5 bg-natural-dark hover:bg-natural-accent text-white rounded text-[11px] font-sans font-bold tracking-wide transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Bookmark className="w-3 h-3 text-white/80" />
                  <span>Shelve Match</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
