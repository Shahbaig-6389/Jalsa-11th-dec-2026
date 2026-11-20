import { useEffect, useState } from 'react';
import { DEFAULT_EVENT_DATA } from './data/defaultEvent';
import { EventData, RsvpEntry } from './types/event';
import { generateIcsCalendar } from './utils/exportHtml';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SpeakerSection } from './components/SpeakerSection';
import { ScheduleSection } from './components/ScheduleSection';
import { LiveStreamSection } from './components/LiveStreamSection';
import { PublicityRsvpSection } from './components/PublicityRsvpSection';
import { PosterModal } from './components/PosterModal';
import { OrganizerDrawer, OrganizerTab } from './components/OrganizerDrawer';
import { OrganizerAuthModal } from './components/OrganizerAuthModal';

const EVENT_STORAGE_KEY = 'jalsa_islah_2026_event_v1';
const RSVP_STORAGE_KEY = 'jalsa_islah_2026_rsvps_v1';
const ORGANIZER_SESSION_KEY = 'jalsa_islah_2026_org_unlocked_v1';
const ORGANIZER_PASSCODE_KEY = 'jalsa_islah_2026_org_passcode_v1';
const DEFAULT_PASSCODE = 'TUMKUR2026';

export default function App() {
  const [eventData, setEventData] = useState<EventData>(() => {
    try {
      const saved = localStorage.getItem(EVENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<EventData>;
        if (parsed.editionLabel === '2nd Annual State-Level Gathering · Same Venue as 2025') {
          parsed.editionLabel = DEFAULT_EVENT_DATA.editionLabel;
        }
        if (
          !parsed.posterImageUrl ||
          parsed.posterImageUrl ===
            '/assets/aistudio/Islamic_-_November_15__2026_at_00.33.56-3__1__9d06bd58.png' ||
          parsed.posterImageUrl === '/assets/aistudio/Islamic_Event_Tumkur_V-11Dec2026_43e7b6c5.png'
        ) {
          parsed.posterImageUrl = DEFAULT_EVENT_DATA.posterImageUrl;
        }
        if (
          !parsed.mobilePosterImageUrl ||
          parsed.mobilePosterImageUrl ===
            '/assets/aistudio/Islamic_-_November_15__2026_at_00.33.56-3__1__9d06bd58.png' ||
          parsed.mobilePosterImageUrl ===
            '/assets/aistudio/Islamic_Event_Tumkur_H-11Dec2026_e0893d50.png' ||
          parsed.mobilePosterImageUrl ===
            '/assets/aistudio/Islamic_Event_Tumkur_V-11Dec2026_43e7b6c5.png'
        ) {
          parsed.mobilePosterImageUrl = DEFAULT_EVENT_DATA.mobilePosterImageUrl;
        }
        if (parsed.eventDateISO === '2026-12-11T09:30:00+05:30') {
          parsed.eventDateISO = DEFAULT_EVENT_DATA.eventDateISO;
        }
        if (
          Array.isArray(parsed.schedule) &&
          parsed.schedule.length === 6 &&
          parsed.schedule[0]?.id === 'sess-1' &&
          parsed.schedule[5]?.id === 'sess-6'
        ) {
          parsed.schedule = DEFAULT_EVENT_DATA.schedule;
        }
        if (parsed.venueName === 'Tumkur Eidgah & Conference Grounds') {
          parsed.venueName = DEFAULT_EVENT_DATA.venueName;
        }
        if (parsed.venueAddress === 'Tumakuru, Karnataka 572101') {
          parsed.venueAddress = DEFAULT_EVENT_DATA.venueAddress;
        }
        if (parsed.venueNote === 'Returning for the 2nd consecutive year at the same Tumkur grounds') {
          parsed.venueNote = DEFAULT_EVENT_DATA.venueNote;
        }
        if (parsed.eventTitle === 'Ali-e-Shan Jalsa Islah-e-Moashara') {
          parsed.eventTitle = DEFAULT_EVENT_DATA.eventTitle;
          parsed.eventTopicBracket = DEFAULT_EVENT_DATA.eventTopicBracket;
          parsed.eventUrduTitle = DEFAULT_EVENT_DATA.eventUrduTitle;
        }
        return {
          ...DEFAULT_EVENT_DATA,
          ...parsed,
          speaker: {
            ...DEFAULT_EVENT_DATA.speaker,
            ...(parsed.speaker ?? {}),
          },
        };
      }
    } catch {
      // Fallback cleanly to default data
    }
    return DEFAULT_EVENT_DATA;
  });

  const [rsvps, setRsvps] = useState<RsvpEntry[]>(() => {
    try {
      const saved = localStorage.getItem(RSVP_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore storage parse failure
    }
    return [];
  });

  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [organizerOpen, setOrganizerOpen] = useState(false);
  const [organizerTab, setOrganizerTab] = useState<OrganizerTab>('general');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<OrganizerTab>('export');

  const [organizerPasscode, setOrganizerPasscode] = useState<string>(() => {
    try {
      return localStorage.getItem(ORGANIZER_PASSCODE_KEY) || DEFAULT_PASSCODE;
    } catch {
      return DEFAULT_PASSCODE;
    }
  });

  const [isOrganizerUnlocked, setIsOrganizerUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ORGANIZER_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('manage') === '1' && !isOrganizerUnlocked) {
      setPendingTab('export');
      setAuthModalOpen(true);
    }
  }, [isOrganizerUnlocked]);

  useEffect(() => {
    try {
      localStorage.setItem(ORGANIZER_PASSCODE_KEY, organizerPasscode || DEFAULT_PASSCODE);
    } catch {
      // Ignore storage errors
    }
  }, [organizerPasscode]);

  useEffect(() => {
    try {
      localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(eventData));
    } catch {
      // Ignore quota errors
    }
  }, [eventData]);

  useEffect(() => {
    try {
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(rsvps));
    } catch {
      // Ignore quota errors
    }
  }, [rsvps]);

  const handleDownloadCalendar = () => {
    const ics = generateIcsCalendar(eventData);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Jalsa-Islah-e-Moashara-11-Dec-2026.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpdateYouTube = (youtubeUrl: string, isLiveActive: boolean) => {
    setEventData((prev) => ({
      ...prev,
      youtubeUrl,
      isLiveActive,
    }));
  };

  const handleAddRsvp = (entry: Omit<RsvpEntry, 'id' | 'createdAt'>) => {
    const next: RsvpEntry = {
      ...entry,
      id: `rsvp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRsvps((prev) => [next, ...prev]);
  };

  const handleResetDefaults = () => {
    setEventData(DEFAULT_EVENT_DATA);
    localStorage.removeItem(EVENT_STORAGE_KEY);
  };

  const openOrganizer = (tab: OrganizerTab) => {
    if (!isOrganizerUnlocked) {
      setPendingTab(tab);
      setAuthModalOpen(true);
      return;
    }
    setOrganizerTab(tab);
    setOrganizerOpen(true);
  };

  const handleUnlockOrganizer = (entered: string): boolean => {
    if (entered === (organizerPasscode || DEFAULT_PASSCODE)) {
      setIsOrganizerUnlocked(true);
      try {
        sessionStorage.setItem(ORGANIZER_SESSION_KEY, 'true');
      } catch {
        // Ignore storage errors
      }
      setAuthModalOpen(false);
      setOrganizerTab(pendingTab);
      setOrganizerOpen(true);
      return true;
    }
    return false;
  };

  const handleLockOrganizer = () => {
    setIsOrganizerUnlocked(false);
    setOrganizerOpen(false);
    try {
      sessionStorage.removeItem(ORGANIZER_SESSION_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8FAF8] text-[#111C17] overflow-x-clip">
      <Header
        organizationName={eventData.organizationName}
        organizationUrdu={eventData.organizationUrdu}
        logoImageUrl={eventData.logoImageUrl}
        isOrganizerUnlocked={isOrganizerUnlocked}
        onOpenManage={() => openOrganizer('export')}
      />

      <main className="flex-1 min-w-0 w-full">
        <HeroSection
          event={eventData}
          isOrganizerUnlocked={isOrganizerUnlocked}
          onOpenPoster={() => setPosterModalOpen(true)}
          onDownloadCalendar={handleDownloadCalendar}
        />

        <SpeakerSection speaker={eventData.speaker} />

        <ScheduleSection
          eventDateDisplay={eventData.eventDateDisplay}
          schedule={eventData.schedule}
          isOrganizerUnlocked={isOrganizerUnlocked}
          onDownloadCalendar={handleDownloadCalendar}
          onOpenScheduleEditor={() => openOrganizer('schedule')}
        />

        <LiveStreamSection
          youtubeUrl={eventData.youtubeUrl}
          isLiveActive={eventData.isLiveActive}
          liveStreamNote={eventData.liveStreamNote}
          eventDateDisplay={eventData.eventDateDisplay}
          isOrganizerUnlocked={isOrganizerUnlocked}
          onUpdateYouTube={handleUpdateYouTube}
        />

        <PublicityRsvpSection
          event={eventData}
          rsvps={rsvps}
          onAddRsvp={handleAddRsvp}
        />
      </main>

      <footer className="w-full bg-[#063B2B] text-[#D7E6DF] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 min-w-0">
            <p className="font-serif text-lg font-bold text-white break-words">{eventData.organizationName}</p>
            <p className="text-xs text-[#B6CEC2] break-words">
              {eventData.venueName}, {eventData.venueAddress} · {eventData.entryNote}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <a href="#speaker" className="hover:text-white transition-colors">
              Speaker
            </a>
            <a href="#schedule" className="hover:text-white transition-colors">
              Schedule
            </a>
            <a href="#live" className="hover:text-white transition-colors">
              Live Stream
            </a>
            <button
              type="button"
              onClick={() => openOrganizer('export')}
              className="text-[#C2DC62] hover:underline cursor-pointer"
            >
              {isOrganizerUnlocked ? 'Manage & Export HTML' : 'Organizer Access'}
            </button>
          </div>

          <div className="text-xs text-[#B6CEC2] flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
            <span>{eventData.contactPhone}</span>
            <span aria-hidden="true">·</span>
            <span className="break-all">{eventData.contactEmail}</span>
          </div>
        </div>
      </footer>

      <PosterModal
        isOpen={posterModalOpen}
        imageUrl={eventData.posterImageUrl}
        mobileImageUrl={eventData.mobilePosterImageUrl}
        title={eventData.eventTitle}
        onClose={() => setPosterModalOpen(false)}
      />

      <OrganizerAuthModal
        isOpen={authModalOpen}
        onUnlock={handleUnlockOrganizer}
        onClose={() => setAuthModalOpen(false)}
      />

      <OrganizerDrawer
        isOpen={organizerOpen}
        initialTab={organizerTab}
        event={eventData}
        rsvps={rsvps}
        passcode={organizerPasscode}
        onChangePasscode={setOrganizerPasscode}
        onLock={handleLockOrganizer}
        onChangeEvent={setEventData}
        onResetDefaults={handleResetDefaults}
        onClose={() => setOrganizerOpen(false)}
      />
    </div>
  );
}
