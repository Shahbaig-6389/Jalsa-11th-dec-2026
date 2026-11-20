import React, { useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface PosterModalProps {
  isOpen: boolean;
  imageUrl: string;
  mobileImageUrl?: string;
  title: string;
  onClose: () => void;
}

export const PosterModal: React.FC<PosterModalProps> = ({
  isOpen,
  imageUrl,
  mobileImageUrl,
  title,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Official Event Poster Full View"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-[#063B2B] border border-white/15 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 text-white">
          <p className="text-sm font-medium truncate pr-4">{title} — Official Invitation Poster</p>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={imageUrl}
              download="Islamic-Event-Tumkur-Desktop-11Dec2026.png"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#C2DC62] text-[#063B2B] rounded-md hover:bg-[#d2ea78] whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              Download Poster
            </a>
            <a
              href={mobileImageUrl || imageUrl}
              download="Islamic-Event-Tumkur-Mobile-11Dec2026.png"
              className="inline-flex lg:hidden items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#C2DC62] text-[#063B2B] rounded-md hover:bg-[#d2ea78] whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              Download Poster
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close poster view"
              className="w-9 h-9 inline-flex items-center justify-center rounded-md text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="max-h-[82vh] overflow-auto p-4 flex justify-center bg-[#042B1F]">
          <picture className="flex justify-center">
            <source media="(min-width: 1024px)" srcSet={imageUrl} />
            <img
              src={mobileImageUrl || imageUrl}
              alt={`${title} Official Event Poster`}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto rounded-md object-contain"
            />
          </picture>
        </div>
      </div>
    </div>
  );
};
