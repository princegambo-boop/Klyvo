import React, { useState } from 'react';
import { X, Mail, Sparkles, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORT_EXAMPLES = [
  "Example: Can you add more historical fiction or magical realism books?",
  "Example: Having trouble loading chapter 3 in the continuous scroll reader.",
  "Example: The progress tracker is showing 101% completion on a custom log.",
  "Example: Requesting the trilogy collection of Brandon Sanderson."
];

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('curation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setDescriptionError('');

    let hasError = false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('User email address is required.');
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }

    if (!description.trim()) {
      setDescriptionError('Description cannot be empty.');
      hasError = true;
    } else if (description.trim().length < 10) {
      setDescriptionError('Please provide a descriptive explanation (at least 10 characters).');
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);
    // Simulate a polished network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setDescription('');
      setEmail('');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3500);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3728]/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-natural-border relative flex flex-col"
      >
        {/* Book spine top color band */}
        <div className="h-1.5 bg-natural-accent w-full"></div>

        {/* Header */}
        <div className="p-5 bg-natural-card border-b border-natural-border flex justify-between items-center">
          <div>
            <h3 className="font-serif text-lg font-bold text-natural-text italic flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-natural-accent" />
              Klyvo Literary Helpdesk
            </h3>
            <p className="text-[10px] font-sans text-natural-accent/85 uppercase tracking-widest mt-0.5">
              Support & Curation Requests
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-natural-accent hover:text-natural-text hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success-prompt"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 space-y-3"
              >
                <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 animate-bounce">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-base font-bold text-natural-text">
                  Request Dispatched to Klyvo Archivists
                </h4>
                <p className="text-xs text-natural-accent font-sans leading-relaxed max-w-xs mx-auto">
                  We have received your request! Our curating clerks will look into this right away. Support responses will route back to your registered mailbox.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="support-form"
                onSubmit={handleSubmit}
                className="space-y-4 font-sans text-xs"
              >
                {/* Support Email showcase banner */}
                <div className="p-4 bg-natural-card/50 rounded-xl border border-natural-border/70 flex items-start gap-3">
                  <div className="p-2 bg-[#8B5E3C]/10 text-natural-accent rounded-lg">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-natural-accent font-bold">
                      Direct Support Channel
                    </span>
                    <a
                      href="mailto:support@klyvo.com"
                      className="text-sm font-bold text-natural-text hover:text-natural-accent underline decoration-[#8B5E3C]/20 hover:decoration-natural-accent hover:underline decoration-2 transition-colors inline-block mt-0.5"
                    >
                      support@klyvo.com
                    </a>
                  </div>
                </div>

                {/* Topic selection */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-semibold text-natural-accent">
                    Inquiry Category
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setTopic('curation')}
                      className={`p-2 rounded-lg border font-bold text-center transition-all ${
                        topic === 'curation'
                          ? 'border-natural-accent bg-[#8B5E3C]/10 text-natural-text'
                          : 'border-natural-border bg-white text-natural-accent/70 hover:border-natural-accent/50'
                      }`}
                    >
                      Library Curation
                    </button>
                    <button
                      type="button"
                      onClick={() => setTopic('technical')}
                      className={`p-2 rounded-lg border font-bold text-center transition-all ${
                        topic === 'technical'
                          ? 'border-natural-accent bg-[#8B5E3C]/10 text-natural-text'
                          : 'border-natural-border bg-white text-natural-accent/70 hover:border-natural-accent/50'
                      }`}
                    >
                      Technical Bug
                    </button>
                  </div>
                </div>

                {/* Guidelines examples */}
                <div className="p-3 bg-neutral-50 rounded-lg space-y-1 border border-neutral-100">
                  <span className="text-[9px] uppercase font-black text-natural-accent flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Guiding Questions Examples
                  </span>
                  <ul className="space-y-1 pl-1 text-[10px] text-natural-text/80 font-serif italic leading-snug">
                    {SUPPORT_EXAMPLES.map((ex, idx) => (
                      <li key={idx} className="line-clamp-1">
                        • {ex}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* User Email Input Field */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-natural-accent">
                    User Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="e.g. reader@klyvo.com"
                    className={`w-full bg-white border rounded-lg p-2.5 outline-none text-natural-text text-sm focus:ring-1 focus:ring-natural-accent placeholder:opacity-40 font-sans ${
                      emailError ? 'border-red-400 ring-1 ring-red-400' : 'border-natural-border'
                    }`}
                  />
                  {emailError && (
                    <span className="text-[10px] text-red-600 font-sans font-bold block pt-0.5 animate-pulse">
                      {emailError}
                    </span>
                  )}
                </div>

                {/* Textarea Description Box */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-natural-accent">
                    Description & Context
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (descriptionError) setDescriptionError('');
                    }}
                    rows={4}
                    placeholder="Provide details about what you need or the issue you are experiencing..."
                    className={`w-full bg-white border rounded-lg p-2.5 outline-none text-natural-text text-xs focus:ring-1 focus:ring-natural-accent placeholder:opacity-40 font-serif leading-relaxed ${
                      descriptionError ? 'border-red-400 ring-1 ring-red-400' : 'border-natural-border'
                    }`}
                  />
                  {descriptionError && (
                    <span className="text-[10px] text-red-600 font-sans font-bold block pt-0.5 animate-pulse">
                      {descriptionError}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-natural-border/40">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-5 py-2 rounded-lg bg-natural-dark text-white font-bold flex items-center gap-1.5 transition-colors uppercase text-[10px] tracking-wide ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-natural-accent cursor-pointer'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Dispatch Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
