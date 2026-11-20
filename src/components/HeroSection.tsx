import React, { useEffect, useState } from 'react';
import { Calendar, Download, Maximize2, PlayCircle } from 'lucide-react';
import { EventData } from '../types/event';

interface HeroSectionProps {
  event: EventData;
  isOrganizerUnlocked: boolean;
  onOpenPoster: () => void;
  onDownloadCalendar: () => void;
}

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasStarted: boolean;
}

function getCountdown(targetIso: string): CountdownParts {
  const targetMs = new Date(targetIso).getTime();
  const validTarget = isNaN(targetMs) ? new Date('2026-12-11T09:30:00+05:30').getTime() : targetMs;
  const diff = validTarget - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, hasStarted: true };
  }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    hasStarted: false,
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  event,
  isOrganizerUnlocked,
  onOpenPoster,
  onDownloadCalendar,
}) => {
  const [countdown, setCountdown] = useState<CountdownParts>(() => getCountdown(event.eventDateISO));
  const [posterError, setPosterError] = useState(false);

  useEffect(() => {
    setPosterError(false);
  }, [event.posterImageUrl, event.mobilePosterImageUrl]);

  useEffect(() => {
    setCountdown(getCountdown(event.eventDateISO));
    const timer = window.setInterval(() => {
      setCountdown(getCountdown(event.eventDateISO));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [event.eventDateISO]);

  return (
    <div id="top" className="w-full">
      <section className="w-full bg-[#084E39] mosque-arch-pattern text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Editorial Column */}
            <div className="lg:col-span-6 min-w-0 w-full flex flex-col justify-between space-y-8">
              <div className="space-y-5 min-w-0">
                <p className="text-center text-xs sm:text-sm font-medium uppercase tracking-[0.1em] sm:tracking-[0.14em] text-[#C2DC62] break-words">
                  {event.editionLabel}
                </p>

                <div className="space-y-2.5 text-center min-w-0">
                  {event.eventUrduTitle && (
                    <div className="font-urdu space-y-1 max-w-full break-words" dir="rtl">
                      {event.eventUrduTitle.split('\n').map((line, idx) => (
                        <p
                          key={idx}
                          className={
                            idx === 0
                              ? 'text-xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-[2.15]'
                              : 'text-base sm:text-2xl font-medium text-[#E9F5BE] leading-[2.2]'
                          }
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                  <h1 className="font-serif leading-[1.1] tracking-tight text-white [text-wrap:balance] flex flex-col items-center max-w-full">
                    <span className="text-[1.85rem] sm:text-[3.4rem] lg:text-[3.9rem] font-extrabold tracking-tight text-white max-w-full break-words">
                      {event.eventTitle}
                    </span>
                    {event.eventTopicBracket && (
                      <span className="mt-1 text-2xl sm:text-5xl lg:text-[3.5rem] font-medium text-[#E9F5BE] max-w-full break-words">
                        {event.eventTopicBracket}
                      </span>
                    )}
                  </h1>
                </div>

                <p className="text-center text-sm sm:text-lg text-[#DCEAE3] leading-relaxed max-w-2xl mx-auto break-words">
                  {event.eventSubtitle}
                </p>

                {/* Primary & Secondary Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="#schedule"
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-[#C2DC62] text-[#063B2B] font-semibold text-sm rounded-md hover:bg-[#d2ea78] transition-colors duration-150 whitespace-nowrap"
                  >
                    <Calendar className="w-4 h-4" />
                    Event Schedule
                  </a>
                  <a
                    href="#live"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/25 text-white font-medium text-sm rounded-md hover:bg-white/10 transition-colors duration-150 whitespace-nowrap"
                  >
                    <PlayCircle className="w-4 h-4 text-[#C2DC62]" />
                    {event.isLiveActive && event.youtubeUrl
                      ? 'Watch Live Now'
                      : isOrganizerUnlocked
                        ? 'YouTube Live Setup'
                        : 'Live Stream'}
                  </a>
                  <button
                    type="button"
                    onClick={onDownloadCalendar}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium text-[#E9F5BE] hover:text-white underline underline-offset-4 cursor-pointer whitespace-nowrap"
                  >
                    Save Date (.ics)
                  </button>
                </div>
              </div>

              {/* Countdown & Keynote Spotlight Strip */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-6 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-[#B6CEC2] mb-2.5">
                    {countdown.hasStarted ? 'Event Day Status' : `Countdown to ${event.eventDateDisplay}`}
                  </p>
                  {countdown.hasStarted ? (
                    <div className="bg-[#063B2B] border border-white/15 rounded-lg px-4 py-3 text-sm font-medium text-[#E9F5BE]">
                      Gathering Day — {event.eventDateDisplay}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 sm:gap-2.5 font-mono tabular-nums">
                      {[
                        { label: 'Days', value: countdown.days },
                        { label: 'Hours', value: countdown.hours },
                        { label: 'Mins', value: countdown.minutes },
                        { label: 'Secs', value: countdown.seconds },
                      ].map((unit) => (
                        <div
                          key={unit.label}
                          className="min-w-0 bg-[#063B2B] border border-white/15 rounded-md py-2.5 px-1 sm:px-2 text-center"
                        >
                          <div className="text-lg sm:text-2xl font-semibold text-[#C2DC62]">
                            {String(unit.value).padStart(2, '0')}
                          </div>
                          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#C6DCD2] mt-0.5 truncate">
                            {unit.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-6 min-w-0 sm:border-l sm:border-white/15 sm:pl-6 space-y-1">
                  <p className="text-xs uppercase tracking-wider text-[#B6CEC2]">Keynote Address</p>
                  <p className="font-serif text-xl font-semibold text-white break-words">
                    {event.speaker.englishName}
                  </p>
                  <p className="text-xs text-[#DCEAE3] leading-relaxed break-words">
                    {event.speaker.honorificTitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Framed Poster Column */}
            <div className="lg:col-span-6 min-w-0 w-full flex flex-col">
              <div className="bg-[#063B2B] border border-white/15 rounded-xl p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between min-w-0 w-full">
                <div className="relative rounded-lg overflow-hidden bg-[#042B1F] flex-1 flex items-center justify-center min-w-0 w-full">
                  {posterError ? (
                    <div className="p-10 text-center space-y-2 text-[#DCEAE3]">
                      <p className="font-serif text-2xl font-bold text-[#C2DC62]">
                        {event.eventTitle}
                      </p>
                      <p className="text-sm">{event.speaker.englishName}</p>
                      <p className="text-xs text-[#B6CEC2]">{event.eventDateDisplay}</p>
                    </div>
                  ) : (
                    <picture className="block w-full max-w-full min-w-0">
                      <source media="(min-width: 1024px)" srcSet={event.posterImageUrl} />
                      <img
                        src={event.mobilePosterImageUrl || event.posterImageUrl}
                        alt={`${event.eventTitle} featuring ${event.speaker.englishName}`}
                        referrerPolicy="no-referrer"
                        onError={() => setPosterError(true)}
                        className="block w-full max-w-full h-auto max-h-[540px] object-contain cursor-zoom-in rounded mx-auto"
                        onClick={onOpenPoster}
                      />
                    </picture>
                  )}
                </div>

                <div className="pt-3 flex items-center justify-between gap-3 text-xs text-[#DCEAE3] min-w-0">
                  <span className="truncate min-w-0">Official Programme Poster · {event.eventDateDisplay}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={onOpenPoster}
                      className="inline-flex items-center gap-1 text-[#E9F5BE] hover:text-white cursor-pointer whitespace-nowrap"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      Enlarge
                    </button>
                    <a
                      href={event.posterImageUrl}
                      download="Islamic-Event-Tumkur-Desktop-11Dec2026.png"
                      className="hidden lg:inline-flex items-center gap-1 text-[#C2DC62] hover:text-white whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Save
                    </a>
                    <a
                      href={event.mobilePosterImageUrl || event.posterImageUrl}
                      download="Islamic-Event-Tumkur-Mobile-11Dec2026.png"
                      className="inline-flex lg:hidden items-center gap-1 text-[#C2DC62] hover:text-white whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Save
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width 4-Column Operational Utility Ribbon */}
      <section aria-label="Key Event Logistics" className="w-full bg-white border-b border-emerald-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-[#556B60] font-medium">Date &amp; Day</p>
              <p className="text-sm font-semibold text-[#111C17] mt-1 break-words">{event.eventDateDisplay}</p>
              <p className="text-xs text-[#556B60] mt-0.5 break-words">{event.eventDayDisplay}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-[#556B60] font-medium">Venue &amp; Continuity</p>
              <p className="text-sm font-semibold text-[#111C17] mt-1 break-words">
                {event.venueName}, {event.venueAddress}
              </p>
              <p className="text-xs text-[#556B60] mt-0.5 break-words">{event.venueNote}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-[#556B60] font-medium">Regional Reach</p>
              <p className="text-sm font-semibold text-[#111C17] mt-1 break-words">All Districts of Karnataka</p>
              <p className="text-xs text-[#556B60] mt-0.5 break-words">{event.scopeNote}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-[#556B60] font-medium">Organization</p>
              <p className="text-sm font-semibold text-[#111C17] mt-1 break-words">{event.organizationName}</p>
              <p className="text-xs text-[#556B60] mt-0.5 break-words">{event.entryNote}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
