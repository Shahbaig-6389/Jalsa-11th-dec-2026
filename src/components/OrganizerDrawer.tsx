import React, { useEffect, useState } from 'react';
import { Check, Code2, Copy, Download, Lock, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { EventData, RsvpEntry, ScheduleItem, SessionPeriod } from '../types/event';
import { generateStandaloneHtml } from '../utils/exportHtml';

export type OrganizerTab = 'general' | 'speaker' | 'schedule' | 'export';

interface OrganizerDrawerProps {
  isOpen: boolean;
  initialTab?: OrganizerTab;
  event: EventData;
  rsvps: RsvpEntry[];
  passcode: string;
  onChangePasscode: (next: string) => void;
  onLock: () => void;
  onChangeEvent: (updated: EventData) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

export const OrganizerDrawer: React.FC<OrganizerDrawerProps> = ({
  isOpen,
  initialTab = 'general',
  event,
  rsvps,
  passcode,
  onChangePasscode,
  onLock,
  onChangeEvent,
  onResetDefaults,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<OrganizerTab>(initialTab);
  const [copiedHtml, setCopiedHtml] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateField = <K extends keyof EventData>(key: K, value: EventData[K]) => {
    onChangeEvent({ ...event, [key]: value });
  };

  const updateSpeakerField = <K extends keyof EventData['speaker']>(
    key: K,
    value: EventData['speaker'][K]
  ) => {
    onChangeEvent({
      ...event,
      speaker: { ...event.speaker, [key]: value },
    });
  };

  const updateScheduleItem = (id: string, patch: Partial<ScheduleItem>) => {
    onChangeEvent({
      ...event,
      schedule: event.schedule.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    });
  };

  const addScheduleItem = () => {
    const newItem: ScheduleItem = {
      id: `sess-${Date.now()}`,
      time: '03:00 PM',
      endTime: '04:00 PM',
      period: 'Afternoon',
      title: 'New Conference Session',
      speaker: 'Guest Scholar',
      location: 'Main Pandal, Tumkur',
      description: 'Session details and topic overview.',
    };
    onChangeEvent({ ...event, schedule: [...event.schedule, newItem] });
  };

  const removeScheduleItem = (id: string) => {
    onChangeEvent({
      ...event,
      schedule: event.schedule.filter((item) => item.id !== id),
    });
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('posterImageUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadHtml = () => {
    const html = generateStandaloneHtml(event);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = () => {
    const html = generateStandaloneHtml(event);
    navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    window.setTimeout(() => setCopiedHtml(false), 2500);
  };

  const handleDownloadRsvpCsv = () => {
    const header = 'Name,District,Phone,Attendees,Organization,RegisteredAt\n';
    const rows = rsvps
      .map((r) =>
        [
          `"${r.fullName.replace(/"/g, '""')}"`,
          `"${r.district.replace(/"/g, '""')}"`,
          `"${r.phone.replace(/"/g, '""')}"`,
          r.attendeesCount,
          `"${r.organization.replace(/"/g, '""')}"`,
          `"${r.createdAt}"`,
        ].join(',')
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jalsa-2026-attendees.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: OrganizerTab; label: string }[] = [
    { id: 'general', label: 'Event & Venue' },
    { id: 'speaker', label: 'Speaker & Live' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'export', label: 'GitHub HTML & RSVPs' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Organizer Content Manager and HTML Exporter"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#F8FAF8] h-full flex flex-col shadow-2xl border-l border-emerald-950/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#084E39] text-white px-6 py-4 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2 className="font-serif text-xl font-bold">Organizer Manage &amp; Export</h2>
            <p className="text-xs text-[#D7E6DF]">
              Edits save in this browser; export index.html to publish updates for everyone.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onLock}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-md cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#C2DC62]" />
              Lock
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close organizer panel"
              className="w-9 h-9 inline-flex items-center justify-center rounded-md text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-emerald-950/10 px-6 py-2.5 flex items-center gap-1 overflow-x-auto shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#084E39] text-white'
                  : 'text-[#4E6459] hover:bg-[#EFF4F0] hover:text-[#111C17]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#3F5249]">Organization Name</label>
                  <input
                    type="text"
                    value={event.organizationName}
                    onChange={(e) => updateField('organizationName', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#3F5249]">Urdu Title</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={event.organizationUrdu}
                    onChange={(e) => updateField('organizationUrdu', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md font-urdu"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#3F5249]">Event Urdu Heading</label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={event.eventUrduTitle ?? ''}
                  onChange={(e) => updateField('eventUrduTitle', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md font-urdu"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#3F5249]">Event Title</label>
                  <input
                    type="text"
                    value={event.eventTitle}
                    onChange={(e) => updateField('eventTitle', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#3F5249]">Topic Subtitle (in brackets)</label>
                  <input
                    type="text"
                    value={event.eventTopicBracket ?? ''}
                    onChange={(e) => updateField('eventTopicBracket', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#3F5249]">Edition / Continuity Label</label>
                <input
                  type="text"
                  value={event.editionLabel}
                  onChange={(e) => updateField('editionLabel', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#3F5249]">Event Summary</label>
                <textarea
                  rows={3}
                  value={event.eventSubtitle}
                  onChange={(e) => updateField('eventSubtitle', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#3F5249]">Event Date Display</label>
                  <input
                    type="text"
                    value={event.eventDateDisplay}
                    onChange={(e) => updateField('eventDateDisplay', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#3F5249]">Day &amp; Hijri Note</label>
                  <input
                    type="text"
                    value={event.eventDayDisplay}
                    onChange={(e) => updateField('eventDayDisplay', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#3F5249]">Venue Name</label>
                  <input
                    type="text"
                    value={event.venueName}
                    onChange={(e) => updateField('venueName', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#3F5249]">Venue Address</label>
                  <input
                    type="text"
                    value={event.venueAddress}
                    onChange={(e) => updateField('venueAddress', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#3F5249]">Contact Phone</label>
                  <input
                    type="text"
                    value={event.contactPhone}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#3F5249]">Contact Email</label>
                  <input
                    type="email"
                    value={event.contactEmail}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white border border-emerald-950/10 rounded-lg p-4 space-y-2">
                  <label className="block text-xs font-semibold text-[#3F5249]">
                    Replace Top Logo Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          updateField('logoImageUrl', reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="block w-full text-xs text-[#4E6459] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#EFF4F0] file:text-[#084E39] hover:file:bg-[#e1ebe3]"
                  />
                </div>

                <div className="bg-white border border-emerald-950/10 rounded-lg p-4 space-y-2">
                  <label className="block text-xs font-semibold text-[#3F5249]">
                    Replace Desktop Poster (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    className="block w-full text-xs text-[#4E6459] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#EFF4F0] file:text-[#084E39] hover:file:bg-[#e1ebe3]"
                  />
                </div>

                <div className="bg-white border border-emerald-950/10 rounded-lg p-4 space-y-2 sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#3F5249]">
                    Replace Mobile Poster (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          updateField('mobilePosterImageUrl', reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="block w-full text-xs text-[#4E6459] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#EFF4F0] file:text-[#084E39] hover:file:bg-[#e1ebe3]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'speaker' && (
            <div className="space-y-5">
              <div className="bg-white border border-emerald-950/10 rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-semibold text-[#111C17]">YouTube Live Conference Settings</h3>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#3F5249]">
                    YouTube Live URL or Video ID
                  </label>
                  <input
                    type="text"
                    value={event.youtubeUrl}
                    onChange={(e) => updateField('youtubeUrl', e.target.value)}
                    placeholder="https://www.youtube.com/live/..."
                    className="w-full px-3 py-2 text-sm bg-[#FAFBF9] border border-emerald-950/15 rounded-md"
                  />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={event.isLiveActive}
                    onChange={(e) => updateField('isLiveActive', e.target.checked)}
                    className="w-4 h-4 accent-[#084E39]"
                  />
                  <span className="text-xs font-medium text-[#111C17]">
                    Show Live YouTube Video Player on Page
                  </span>
                </label>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#111C17]">Keynote Speaker Details</h3>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#3F5249]">English Name</label>
                  <input
                    type="text"
                    value={event.speaker.englishName}
                    onChange={(e) => updateSpeakerField('englishName', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#3F5249]">Urdu Name</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={event.speaker.urduName}
                    onChange={(e) => updateSpeakerField('urduName', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md font-urdu"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#3F5249]">Honorific Office</label>
                  <input
                    type="text"
                    value={event.speaker.honorificTitle}
                    onChange={(e) => updateSpeakerField('honorificTitle', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#3F5249]">Profession &amp; Institution</label>
                  <input
                    type="text"
                    value={event.speaker.profession}
                    onChange={(e) => updateSpeakerField('profession', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#3F5249]">Biography</label>
                  <textarea
                    rows={4}
                    value={event.speaker.bio}
                    onChange={(e) => updateSpeakerField('bio', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#3F5249]">Wikipedia URL (Optional)</label>
                  <input
                    type="url"
                    value={event.speaker.wikipediaUrl ?? ''}
                    onChange={(e) => updateSpeakerField('wikipediaUrl', e.target.value)}
                    placeholder="https://en.wikipedia.org/wiki/..."
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-950/15 rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#4E6459]">
                  Add, update, or remove sessions for {event.eventDateDisplay}.
                </p>
                <button
                  type="button"
                  onClick={addScheduleItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#084E39] text-white text-xs font-semibold rounded-md hover:bg-[#063B2B] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Session
                </button>
              </div>

              <div className="space-y-4">
                {event.schedule.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white border border-emerald-950/10 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-[#084E39]">
                        Session 0{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeScheduleItem(item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-900 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => updateScheduleItem(item.id, { time: e.target.value })}
                        placeholder="Start time"
                        className="px-2.5 py-1.5 text-xs border border-emerald-950/15 rounded font-mono"
                      />
                      <input
                        type="text"
                        value={item.endTime}
                        onChange={(e) => updateScheduleItem(item.id, { endTime: e.target.value })}
                        placeholder="End time"
                        className="px-2.5 py-1.5 text-xs border border-emerald-950/15 rounded font-mono"
                      />
                      <select
                        value={item.period}
                        onChange={(e) =>
                          updateScheduleItem(item.id, { period: e.target.value as SessionPeriod })
                        }
                        className="px-2.5 py-1.5 text-xs border border-emerald-950/15 rounded bg-white"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateScheduleItem(item.id, { title: e.target.value })}
                      placeholder="Session title"
                      className="w-full px-2.5 py-1.5 text-sm font-medium border border-emerald-950/15 rounded"
                    />

                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={item.speaker}
                        onChange={(e) => updateScheduleItem(item.id, { speaker: e.target.value })}
                        placeholder="Speaker"
                        className="px-2.5 py-1.5 text-xs border border-emerald-950/15 rounded"
                      />
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => updateScheduleItem(item.id, { location: e.target.value })}
                        placeholder="Location / Stage"
                        className="px-2.5 py-1.5 text-xs border border-emerald-950/15 rounded"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => updateScheduleItem(item.id, { description: e.target.value })}
                      placeholder="Session summary"
                      className="w-full px-2.5 py-1.5 text-xs border border-emerald-950/15 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              {/* Standalone GitHub index.html Exporter */}
              <div className="bg-[#084E39] text-white rounded-xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Code2 className="w-5 h-5 text-[#C2DC62] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold">
                      Editable Single-File GitHub index.html
                    </h3>
                    <p className="text-xs text-[#DCEAE3] leading-relaxed">
                      Download a complete, self-contained HTML file with all your edits, schedule, and YouTube live link baked in. Upload it directly to a GitHub repository (GitHub Pages) and edit the clearly marked <code className="text-[#C2DC62]">EVENT_CONFIG</code> section anytime.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadHtml}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C2DC62] text-[#063B2B] text-xs font-semibold rounded-md hover:bg-[#d2ea78] cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download index.html
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyHtml}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/25 text-white text-xs font-medium rounded-md hover:bg-white/10 cursor-pointer"
                  >
                    {copiedHtml ? <Check className="w-4 h-4 text-[#C2DC62]" /> : <Copy className="w-4 h-4" />}
                    {copiedHtml ? 'HTML Source Copied' : 'Copy HTML Source'}
                  </button>
                </div>
              </div>

              {/* Attendee List & CSV Export */}
              <div className="bg-white border border-emerald-950/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111C17]">
                      Registered Attendees ({rsvps.length} entries)
                    </h3>
                    <p className="text-xs text-[#556B60]">
                      Stored locally on this device for organizing committee planning.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadRsvpCsv}
                    disabled={rsvps.length === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-emerald-950/15 text-xs font-semibold rounded-md hover:bg-[#F3F7F4] disabled:opacity-40 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                </div>

                {rsvps.length === 0 ? (
                  <p className="text-xs text-[#556B60] py-4 text-center border-t border-emerald-950/10">
                    No registrations submitted on this browser yet.
                  </p>
                ) : (
                  <div className="divide-y divide-emerald-950/10 border-t border-emerald-950/10 max-h-60 overflow-y-auto text-xs">
                    {rsvps.map((r) => (
                      <div key={r.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#111C17]">
                            {r.fullName} ({r.attendeesCount})
                          </p>
                          <p className="text-[#556B60]">
                            {r.district} · {r.organization}
                          </p>
                        </div>
                        <span className="font-mono text-[#084E39] shrink-0">{r.phone}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Organizer Passcode */}
              <div className="bg-white border border-emerald-950/10 rounded-xl p-5 space-y-2">
                <label htmlFor="drawer-passcode" className="block text-xs font-semibold text-[#111C17]">
                  Organizer Access Passcode
                </label>
                <input
                  id="drawer-passcode"
                  type="text"
                  value={passcode}
                  onChange={(e) => onChangePasscode(e.target.value)}
                  className="w-full sm:max-w-xs px-3 py-2 text-sm bg-[#FAFBF9] border border-emerald-950/15 rounded-md font-mono"
                />
                <p className="text-xs text-[#556B60]">
                  Required to unlock management tools from the footer Organizer Access button.
                </p>
              </div>

              {/* Reset Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onResetDefaults}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-red-700 hover:bg-red-50 rounded-md cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset All Edits to Default Poster Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
