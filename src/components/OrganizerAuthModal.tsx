import React, { useEffect, useState } from 'react';
import { Lock, X } from 'lucide-react';

interface OrganizerAuthModalProps {
  isOpen: boolean;
  onUnlock: (passcode: string) => boolean;
  onClose: () => void;
}

export const OrganizerAuthModal: React.FC<OrganizerAuthModalProps> = ({
  isOpen,
  onUnlock,
  onClose,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setPasscode('');
    setError('');
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Enter the organizer passcode.');
      return;
    }
    const ok = onUnlock(passcode.trim());
    if (!ok) {
      setError('Incorrect organizer passcode. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Organizer Access Verification"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-emerald-950/15 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#084E39] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#C2DC62]" />
            <h2 className="font-serif text-lg font-bold">Organizer Access</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close organizer login"
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-[#4E6459] leading-relaxed">
            Enter your committee passcode to unlock schedule editing, YouTube Live stream setup, attendee CSV export, and GitHub HTML export.
          </p>

          <div className="space-y-1.5">
            <label htmlFor="organizer-passcode" className="block text-xs font-semibold text-[#111C17]">
              Organizer Passcode
            </label>
            <input
              id="organizer-passcode"
              type="password"
              autoFocus
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError('');
              }}
              placeholder="Enter passcode"
              className="w-full px-3.5 py-2.5 text-sm border border-emerald-950/20 rounded-md bg-[#FAFBF9] text-[#111C17]"
            />
          </div>

          {error && <p className="text-xs font-medium text-red-700">{error}</p>}

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#4E6459] hover:text-[#111C17] rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#084E39] text-white text-xs font-semibold rounded-md hover:bg-[#063B2B] cursor-pointer"
            >
              Unlock Organizer Tools
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
