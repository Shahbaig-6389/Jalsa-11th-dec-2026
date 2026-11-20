import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  organizationName: string;
  organizationUrdu: string;
  logoImageUrl: string;
  isOrganizerUnlocked: boolean;
  onOpenManage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  organizationName,
  organizationUrdu,
  logoImageUrl,
  isOrganizerUnlocked,
  onOpenManage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#speaker', label: 'Speaker' },
    { href: '#schedule', label: 'Schedule' },
    { href: '#live', label: 'Live Stream' },
    { href: '#publicity', label: 'Publicity' },
  ];

  return (
    <header className="w-full sticky top-0 z-40 bg-[#084E39]/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 py-1.5 flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Zone 1: Brand Logo & Wordmark */}
        <a
          href="#top"
          className="inline-flex items-center gap-2 sm:gap-3 text-white min-w-0 flex-1 md:flex-initial md:shrink-0"
        >
          {logoImageUrl && (
            <span className="h-9 w-9 sm:h-11 sm:w-11 rounded-md bg-white p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              <img
                src={logoImageUrl}
                alt={`${organizationName} Logo`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain"
              />
            </span>
          )}
          <span className="flex flex-col justify-center min-w-0">
            <span className="font-serif text-[15px] sm:text-lg font-bold tracking-tight leading-tight truncate">
              {organizationName}
            </span>
            {organizationUrdu && (
              <span
                className="font-urdu text-[11px] sm:text-sm font-normal text-[#E9F5BE] leading-[1.7] text-left truncate"
                dir="rtl"
              >
                {organizationUrdu}
              </span>
            )}
          </span>
        </a>

        {/* Zone 2: 4 Single-line Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7 text-sm font-medium text-[#D7E6DF]">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#E7F4B4] hover:underline underline-offset-4 transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {isOrganizerUnlocked ? (
            <button
              type="button"
              onClick={onOpenManage}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold bg-[#C2DC62] text-[#063B2B] rounded-md hover:bg-[#d2ea78] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Manage &amp; Export HTML
            </button>
          ) : (
            <a
              href="#live"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold bg-[#C2DC62] text-[#063B2B] rounded-md hover:bg-[#d2ea78] transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              Watch Live
            </a>
          )}

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#063B2B] px-4 py-4 space-y-2">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 text-sm font-medium text-[#E5F0EA] hover:bg-white/10 rounded-md"
            >
              {item.label}
            </a>
          ))}
          {isOrganizerUnlocked ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenManage();
              }}
              className="w-full mt-2 px-4 py-2.5 text-sm font-semibold bg-[#C2DC62] text-[#063B2B] rounded-md text-center cursor-pointer"
            >
              Manage &amp; Export HTML
            </button>
          ) : (
            <a
              href="#live"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full mt-2 px-4 py-2.5 text-sm font-semibold bg-[#C2DC62] text-[#063B2B] rounded-md text-center"
            >
              Watch Live
            </a>
          )}
        </div>
      )}
    </header>
  );
};
