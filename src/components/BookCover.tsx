import React from 'react';

interface BookCoverProps {
  title: string;
  author: string;
  genre: string;
  size?: 'sm' | 'md' | 'lg' | 'flat';
}

export default function BookCover({ title, author, genre, size = 'md' }: BookCoverProps) {
  // Generate a key-value database mapping for major real titles to pull exact real book covers
  const getCoverUrl = () => {
    const t = title.toLowerCase();
    
    // Diary of a Wimpy Kid Collection
    if (t === "diary of a wimpy kid") return "https://covers.openlibrary.org/b/id/11481541-L.jpg";
    if (t.includes("rodrick rules")) return "https://covers.openlibrary.org/b/id/11388034-L.jpg";
    if (t.includes("the last straw")) return "https://covers.openlibrary.org/b/id/11388036-L.jpg";
    if (t.includes("dog days")) return "https://covers.openlibrary.org/b/id/11388037-L.jpg";
    if (t.includes("the ugly truth")) return "https://covers.openlibrary.org/b/id/11388039-L.jpg";
    if (t.includes("cabin fever")) return "https://covers.openlibrary.org/b/id/11388506-L.jpg";
    if (t.includes("third wheel")) return "https://covers.openlibrary.org/b/id/8316200-L.jpg";
    if (t.includes("hard luck")) return "https://covers.openlibrary.org/b/id/8316205-L.jpg";
    if (t.includes("long haul")) return "https://covers.openlibrary.org/b/id/8316212-L.jpg";
    if (t.includes("double down")) return "https://covers.openlibrary.org/b/id/8118949-L.jpg";
    if (t.includes("getaway")) return "https://covers.openlibrary.org/b/id/8316223-L.jpg";
    if (t.includes("wrecking ball")) return "https://covers.openlibrary.org/b/id/11559817-L.jpg";
    if (t.includes("meltdown")) return "https://covers.openlibrary.org/b/id/8695024-L.jpg";
    if (t.includes("awesome friendly kid")) return "https://covers.openlibrary.org/b/id/11388514-L.jpg";

    // Harry Potter Collection
    if (t.includes("sorcerer's stone") || t.includes("philosopher's stone")) return "https://covers.openlibrary.org/b/id/10521270-L.jpg";
    if (t.includes("chamber of secrets")) return "https://covers.openlibrary.org/b/id/10521272-L.jpg";
    if (t.includes("prisoner of azkaban")) return "https://covers.openlibrary.org/b/id/10521276-L.jpg";
    if (t.includes("goblet of fire")) return "https://covers.openlibrary.org/b/id/10521278-L.jpg";
    if (t.includes("order of the phoenix")) return "https://covers.openlibrary.org/b/id/9266155-L.jpg";
    if (t.includes("half-blood prince")) return "https://covers.openlibrary.org/b/id/10521280-L.jpg";
    if (t.includes("deathly hallows")) return "https://covers.openlibrary.org/b/id/10521282-L.jpg";

    // Tolkien Classics
    if (t.includes("the hobbit")) return "https://covers.openlibrary.org/b/id/10260494-L.jpg";
    if (t.includes("fellowship of the ring")) return "https://covers.openlibrary.org/b/id/11181816-L.jpg";
    if (t.includes("two towers")) return "https://covers.openlibrary.org/b/id/11417066-L.jpg";
    if (t.includes("return of the king")) return "https://covers.openlibrary.org/b/id/11417068-L.jpg";

    // Percy Jackson
    if (t.includes("lightning thief")) return "https://covers.openlibrary.org/b/id/12836208-L.jpg";
    if (t.includes("sea of monsters")) return "https://covers.openlibrary.org/b/id/8243679-L.jpg";
    if (t.includes("titan's curse")) return "https://covers.openlibrary.org/b/id/8316183-L.jpg";

    // Sanderson Masterpieces
    if (t.includes("way of kings")) return "https://covers.openlibrary.org/b/id/12836159-L.jpg";
    if (t.includes("words of radiance")) return "https://covers.openlibrary.org/b/id/12836164-L.jpg";

    // High quality thematic literary Unsplash cover graphics based on genre keywords:
    const lowerGenre = genre.toLowerCase();
    if (lowerGenre.includes('fantasy')) {
      return "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80"; // Glowing mystical chest/spellbook
    } else if (lowerGenre.includes('history') || lowerGenre.includes('nonfiction') || lowerGenre.includes('science')) {
      return "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=80"; // Ancient library arches
    } else if (lowerGenre.includes('realism') || lowerGenre.includes('gothic') || lowerGenre.includes('fiction')) {
      return "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80"; // Stack of aged red leather books
    } else if (lowerGenre.includes('humor') || lowerGenre.includes('youth') || lowerGenre.includes('children')) {
      return "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&q=80"; // Whimsical watercolor sketches
    } else if (lowerGenre.includes('romance')) {
      return "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&q=80"; // Glowing fairy lights romance tone
    } else if (lowerGenre.includes('mystery') || lowerGenre.includes('thriller')) {
      return "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&q=80"; // Spooky foggy pine woods path
    }

    // Cozy standard photo fallback
    return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80"; // Minimalistic book cover background
  };

  const coverUrl = getCoverUrl();

  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return 'w-16 h-24 text-[8px]';
      case 'lg':
        return 'w-44 h-64 text-xs';
      case 'flat':
        return 'w-24 h-36 text-[10px]';
      case 'md':
      default:
        return 'w-32 h-44 text-[10px]';
    }
  };

  return (
    <div 
      className={`${getDimensions()} rounded-lg shadow-md hover:shadow-2xl relative overflow-hidden select-none transition-all duration-500 transform hover:-translate-y-1.5 hover:rotate-1 border border-black/25 flex flex-col justify-end bg-neutral-900 group`}
      style={{
        boxShadow: '4px 6px 18px -3px rgba(0,0,0,0.65), inset -3px 0px 8px -2px rgba(0,0,0,0.45)',
      }}
    >
      {/* Real Cover Image Background Layer */}
      <img 
        src={coverUrl} 
        alt={title}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 pointer-events-none"
      />

      {/* Heavy shadow gradient veneer overlay to support bottom titles and authors */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 group-hover:via-black/50 transition-colors pointer-events-none z-10" />

      {/* Golden Highlight Foil / Ribbon at top-left representing quality binding */}
      <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-amber-500/90 border border-amber-300 px-1 py-0.5 rounded text-[7px] font-sans text-white/95 uppercase font-extrabold tracking-widest shadow-xs">
        <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
        <span>KLYVO</span>
      </div>

      {/* Book Gutter Spine Shadow Overlay modeling real-world physics paper spine pages */}
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/50 via-black/15 to-transparent pointer-events-none z-20" />
      <div className="absolute left-[3.5px] top-0 bottom-0 w-[0.7px] bg-white/20 pointer-events-none z-20" />

      {/* Dynamic Content Typography Overlay */}
      <div className="p-3 text-left relative z-20 space-y-1 flex flex-col justify-end min-h-[50%]">
        <h4 className={`font-serif font-black ${size === 'lg' ? 'text-base' : size === 'md' ? 'text-xs' : 'text-[10px]'} leading-tight tracking-tight text-white group-hover:text-amber-100 transition-colors line-clamp-3 italic`}>
          {title}
        </h4>
        <p className={`font-sans tracking-wide text-neutral-300 font-bold truncate group-hover:text-amber-200/95 transition-colors ${size === 'lg' ? 'text-xs' : 'text-[9px]'}`}>
          {author}
        </p>
        <span className="inline-block px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[7px] font-sans font-black uppercase tracking-widest text-amber-300 w-fit">
          {genre}
        </span>
      </div>
    </div>
  );
}
