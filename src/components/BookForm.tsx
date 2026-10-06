import React, { useState } from 'react';
import { Book } from '../types';
import { FICTION_GENRES, NONFICTION_GENRES } from '../data';
import { BookOpen, Plus, Sparkles, Feather, Hash } from 'lucide-react';

interface BookFormProps {
  onAddBook: (book: Omit<Book, 'id' | 'dateAdded'>) => void;
}

export default function BookForm({ onAddBook }: BookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Fantasy'); // Default value
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState('');
  const [totalPagesStr, setTotalPagesStr] = useState('300');
  const [currentPageStr, setCurrentPageStr] = useState('0');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Book title is required.');
      return;
    }
    if (!author.trim()) {
      setError('Author is required.');
      return;
    }

    const totalPages = parseInt(totalPagesStr, 10);
    const currentPage = parseInt(currentPageStr, 10);

    if (isNaN(totalPages) || totalPages <= 0) {
      setError('Total pages must be a number greater than 0.');
      return;
    }
    if (isNaN(currentPage) || currentPage < 0) {
      setError('Current page must be 0 or greater.');
      return;
    }
    if (currentPage > totalPages) {
      setError('Current page cannot exceed total pages.');
      return;
    }

    // Determine category based on genre list
    const category = FICTION_GENRES.includes(genre) ? 'Fiction' : 'Nonfiction';

    onAddBook({
      title: title.trim(),
      author: author.trim(),
      genre,
      category,
      rating,
      review: review.trim(),
      totalPages,
      currentPage,
    });

    // Reset inputs
    setTitle('');
    setAuthor('');
    setReview('');
    setTotalPagesStr('300');
    setCurrentPageStr('0');
    setGenre(FICTION_GENRES[0]);
    setRating(5);
  };

  return (
    <div className="bg-natural-card border border-natural-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
      
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 font-serif text-natural-text">
        <span className="w-3 h-3 bg-natural-accent rounded-full inline-block"></span>
        New Volume
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3.5 font-sans text-sm" id="new-book-form">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded-lg font-sans">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-natural-accent mb-1">
            Book Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The Name of the Rose"
            className="w-full bg-white border border-natural-border rounded-lg p-2.5 focus:ring-1 focus:ring-natural-accent outline-none placeholder:opacity-40 text-natural-text text-sm transition-all font-sans"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Author */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-natural-accent mb-1">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., Umberto Eco"
              className="w-full bg-white border border-natural-border rounded-lg p-2.5 focus:ring-1 focus:ring-natural-accent outline-none placeholder:opacity-40 text-natural-text text-sm transition-all font-sans"
              required
            />
          </div>

          {/* Genre Dropdown */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-natural-accent mb-1">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-white border border-natural-border rounded-lg p-2.5 outline-none text-natural-text text-sm transition-all cursor-pointer font-sans"
            >
              <optgroup label="Fiction">
                {FICTION_GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Nonfiction">
                {NONFICTION_GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Rating Dropdown */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-natural-accent mb-1">
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full bg-white border border-natural-border rounded-lg p-2.5 outline-none text-natural-text text-sm transition-all cursor-pointer font-sans"
            >
              <option value="5">★★★★★</option>
              <option value="4">★★★★☆</option>
              <option value="3">★★★☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="1">★☆☆☆☆</option>
            </select>
          </div>

          {/* Reading Pages */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-natural-accent mb-1">
              Pages
            </label>
            <input
              type="number"
              min="1"
              value={totalPagesStr}
              onChange={(e) => setTotalPagesStr(e.target.value)}
              placeholder="500"
              className="w-full bg-white border border-natural-border rounded-lg p-2.5 outline-none text-natural-text text-xs transition-all font-sans"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-natural-accent mb-1">
              Current
            </label>
            <input
              type="number"
              min="0"
              value={currentPageStr}
              onChange={(e) => setCurrentPageStr(e.target.value)}
              placeholder="0"
              className="w-full bg-white border border-natural-border rounded-lg p-2.5 outline-none text-natural-text text-xs transition-all font-sans"
            />
          </div>
        </div>

        {/* Review */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-natural-accent mb-1">
            Short Review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Thoughts on this edition..."
            rows={3}
            className="w-full bg-white border border-natural-border rounded-lg p-2.5 outline-none text-natural-text text-sm transition-all resize-none placeholder:opacity-40 font-serif leading-relaxed"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="btn-add-book"
          className="w-full bg-natural-dark text-natural-bg font-bold py-3 rounded-lg hover:bg-natural-accent transition-all duration-200 mt-2 cursor-pointer font-sans text-sm shadow-xs uppercase tracking-wide flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Log to Library</span>
        </button>
      </form>
    </div>
  );
}
