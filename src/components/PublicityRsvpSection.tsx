import React, { useState } from 'react';
import { Check, Copy, Download, Share2, Users } from 'lucide-react';
import { EventData, RsvpEntry } from '../types/event';

interface PublicityRsvpSectionProps {
  event: EventData;
  rsvps: RsvpEntry[];
  onAddRsvp: (entry: Omit<RsvpEntry, 'id' | 'createdAt'>) => void;
}

const KARNATAKA_DISTRICTS = [
  'Tumakuru (Tumkur)',
  'Bengaluru Urban',
  'Bengaluru Rural',
  'Mysuru',
  'Hubballi-Dharwad',
  'Dakshina Kannada (Mangaluru)',
  'Belagavi',
  'Kalaburagi',
  'Ballari',
  'Shivamogga',
  'Vijayapura',
  'Davanagere',
  'Hassan',
  'Chitradurga',
  'Kolar',
  'Mandya',
  'Raichur',
  'Bidar',
  'Udupi',
  'Other District in Karnataka',
];

export const PublicityRsvpSection: React.FC<PublicityRsvpSectionProps> = ({
  event,
  rsvps,
  onAddRsvp,
}) => {
  const [copiedType, setCopiedType] = useState<'en' | 'ur' | 'link' | null>(null);
  const [fullName, setFullName] = useState('');
  const [district, setDistrict] = useState(KARNATAKA_DISTRICTS[0]);
  const [phone, setPhone] = useState('');
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [organization, setOrganization] = useState('');
  const [formError, setFormError] = useState('');
  const [submittedName, setSubmittedName] = useState('');

  const totalDelegates = rsvps.reduce((sum, item) => sum + item.attendeesCount, 0);
  const uniqueDistricts = new Set(rsvps.map((r) => r.district)).size;

  const englishInvite = `*${event.eventTitle}*
${event.editionLabel}

Hosted by: ${event.organizationName}
Keynote Speaker: ${event.speaker.englishName} (${event.speaker.honorificTitle})
Date: ${event.eventDateDisplay} (${event.eventDayDisplay})
Venue: ${event.venueName}, ${event.venueAddress}

${event.entryNote}. Delegations from across Karnataka are warmly invited.`;

  const urduInvite = `*${event.organizationUrdu}*
*${event.eventTitle}*

خصوصی خطاب: ${event.speaker.urduName}
تاریخ: ${event.eventDateDisplay}
مقام: ${event.venueName}، ٹمکور (کرناٹک)

تمام برادرانِ اسلام سے شرکت کی مخلصانہ درخواست ہے۔`;

  const copyText = (text: string, type: 'en' | 'ur' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    window.setTimeout(() => setCopiedType(null), 2000);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedName = fullName.trim();
    const cleanedPhone = phone.trim();

    if (cleanedName.length < 2) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!/^[+\d\s()-]{8,16}$/.test(cleanedPhone)) {
      setFormError('Please enter a valid 10-digit mobile or WhatsApp number.');
      return;
    }

    setFormError('');
    onAddRsvp({
      fullName: cleanedName,
      district,
      phone: cleanedPhone,
      attendeesCount: Math.max(1, Math.min(500, attendeesCount)),
      organization: organization.trim() || 'Individual / Family',
    });
    setSubmittedName(cleanedName);
    setFullName('');
    setPhone('');
    setAttendeesCount(1);
    setOrganization('');
  };

  return (
    <section id="publicity" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Community Publicity Toolkit */}
        <div className="lg:col-span-6 min-w-0 w-full bg-white border border-emerald-950/10 rounded-xl p-5 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#084E39]">
              Publicity &amp; Community Outreach
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#111C17] break-words">
              Invite Your District &amp; Masjid
            </h2>
            <p className="text-sm text-[#4E6459] leading-relaxed break-words">
              This gathering is organized on a strictly non-profit basis for the 5th time at the same venue ({event.venueName}, {event.venueAddress}). Share the official poster and formatted invitations across Karnataka WhatsApp groups.
            </p>
          </div>

          {/* Preview Box of WhatsApp Message */}
          <div className="bg-[#F4F7F4] border border-emerald-950/10 rounded-lg p-4 text-xs text-[#2B3D34] whitespace-pre-line [overflow-wrap:anywhere] font-sans leading-relaxed min-w-0">
            {englishInvite}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => copyText(englishInvite, 'en')}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-[#084E39] text-white text-xs font-semibold rounded-md hover:bg-[#063B2B] transition-colors cursor-pointer sm:whitespace-nowrap text-center"
            >
              {copiedType === 'en' ? <Check className="w-4 h-4 shrink-0" /> : <Copy className="w-4 h-4 shrink-0" />}
              {copiedType === 'en' ? 'Copied English Invite' : 'Copy English WhatsApp'}
            </button>

            <button
              type="button"
              onClick={() => copyText(urduInvite, 'ur')}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 border border-emerald-950/20 text-[#111C17] text-xs font-semibold rounded-md hover:bg-[#F3F7F4] transition-colors cursor-pointer sm:whitespace-nowrap text-center"
            >
              {copiedType === 'ur' ? <Check className="w-4 h-4 text-[#084E39] shrink-0" /> : <Copy className="w-4 h-4 text-[#084E39] shrink-0" />}
              {copiedType === 'ur' ? 'Copied Urdu Invite' : 'Copy Urdu WhatsApp'}
            </button>

            <a
              href={event.posterImageUrl}
              download="Islamic-Event-Tumkur-Desktop-11Dec2026.png"
              className="hidden lg:inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-emerald-950/20 text-[#111C17] text-xs font-semibold rounded-md hover:bg-[#F3F7F4] transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-[#084E39] shrink-0" />
              Download Official Poster
            </a>
            <a
              href={event.mobilePosterImageUrl || event.posterImageUrl}
              download="Islamic-Event-Tumkur-Mobile-11Dec2026.png"
              className="inline-flex lg:hidden items-center justify-center gap-2 px-3 sm:px-4 py-2.5 border border-emerald-950/20 text-[#111C17] text-xs font-semibold rounded-md hover:bg-[#F3F7F4] transition-colors sm:whitespace-nowrap text-center"
            >
              <Download className="w-4 h-4 text-[#084E39] shrink-0" />
              Download Official Poster
            </a>

            <button
              type="button"
              onClick={() => copyText(window.location.href, 'link')}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 border border-emerald-950/20 text-[#111C17] text-xs font-semibold rounded-md hover:bg-[#F3F7F4] transition-colors cursor-pointer sm:whitespace-nowrap text-center"
            >
              {copiedType === 'link' ? <Check className="w-4 h-4 text-[#084E39] shrink-0" /> : <Share2 className="w-4 h-4 text-[#084E39] shrink-0" />}
              {copiedType === 'link' ? 'Event Link Copied' : 'Copy Event Page Link'}
            </button>
          </div>
        </div>

        {/* Right: Karnataka Attendance & Delegation RSVP */}
        <div className="lg:col-span-6 min-w-0 w-full bg-white border border-emerald-950/10 rounded-xl p-5 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-emerald-950/10">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#084E39]">
                Hospitality &amp; Seating Planning
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#111C17] mt-1 break-words">
                Confirm Attendance
              </h2>
            </div>
            <div className="text-left sm:text-right font-mono tabular-nums text-xs text-[#4E6459] shrink-0">
              <div className="inline-flex items-center gap-1.5 font-semibold text-[#084E39]">
                <Users className="w-3.5 h-3.5" />
                <span>{totalDelegates} Confirmed Attendees</span>
              </div>
              <div>Across {uniqueDistricts} Districts</div>
            </div>
          </div>

          {submittedName && (
            <div className="bg-[#EDF5EF] border border-[#084E39]/25 rounded-lg p-4 text-sm text-[#084E39]">
              JazakAllahu Khairan, <span className="font-semibold">{submittedName}</span>. Your attendance for {event.eventDateDisplay} has been noted for hospitality arrangements.
            </div>
          )}

          <form onSubmit={handleRsvpSubmit} className="space-y-4 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 min-w-0">
                <label htmlFor="rsvp-name" className="block text-xs font-medium text-[#3F5249]">
                  Full Name *
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mohammed Imran"
                  className="w-full min-w-0 px-3.5 py-2.5 text-sm border border-emerald-950/15 rounded-md bg-[#FAFBF9] text-[#111C17]"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label htmlFor="rsvp-phone" className="block text-xs font-medium text-[#3F5249]">
                  WhatsApp / Mobile Number *
                </label>
                <input
                  id="rsvp-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 00000"
                  className="w-full min-w-0 px-3.5 py-2.5 text-sm border border-emerald-950/15 rounded-md bg-[#FAFBF9] text-[#111C17]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-7 min-w-0 space-y-1.5">
                <label htmlFor="rsvp-district" className="block text-xs font-medium text-[#3F5249]">
                  District (Karnataka)
                </label>
                <select
                  id="rsvp-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full max-w-full min-w-0 px-3.5 py-2.5 text-sm border border-emerald-950/15 rounded-md bg-[#FAFBF9] text-[#111C17]"
                >
                  {KARNATAKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-5 min-w-0 space-y-1.5">
                <label htmlFor="rsvp-count" className="block text-xs font-medium text-[#3F5249]">
                  Number of Attendees
                </label>
                <input
                  id="rsvp-count"
                  type="number"
                  min={1}
                  max={500}
                  value={attendeesCount}
                  onChange={(e) => setAttendeesCount(Number(e.target.value) || 1)}
                  className="w-full min-w-0 px-3.5 py-2.5 text-sm border border-emerald-950/15 rounded-md bg-[#FAFBF9] text-[#111C17] tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <label htmlFor="rsvp-org" className="block text-xs font-medium text-[#3F5249]">
                Masjid / Madrasa / Group Name (Optional)
              </label>
              <input
                id="rsvp-org"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Jamia Masjid Committee or Individual"
                className="w-full min-w-0 px-3.5 py-2.5 text-sm border border-emerald-950/15 rounded-md bg-[#FAFBF9] text-[#111C17]"
              />
            </div>

            {formError && <p className="text-xs font-medium text-red-700">{formError}</p>}

            <button
              type="submit"
              className="w-full px-5 py-3 bg-[#084E39] text-white text-sm font-semibold rounded-md hover:bg-[#063B2B] transition-colors cursor-pointer"
            >
              Register Attendance (Free Entry)
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
