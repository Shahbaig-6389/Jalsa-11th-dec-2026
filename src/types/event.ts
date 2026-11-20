export type SessionPeriod = 'Morning' | 'Afternoon' | 'Evening';

export interface ScheduleItem {
  id: string;
  time: string;
  endTime: string;
  period: SessionPeriod;
  title: string;
  urduTitle?: string;
  speaker: string;
  location: string;
  description: string;
}

export interface SpeakerRelation {
  name: string;
  relation: string;
}

export interface EventData {
  organizationName: string;
  organizationUrdu: string;
  editionLabel: string;
  eventUrduTitle?: string;
  eventTitle: string;
  eventTopicBracket?: string;
  eventSubtitle: string;
  eventDateISO: string; // e.g. "2026-12-11T09:30:00+05:30"
  eventDateDisplay: string;
  eventDayDisplay: string;
  venueName: string;
  venueAddress: string;
  venueNote: string;
  scopeNote: string;
  entryNote: string;
  contactPhone: string;
  contactEmail: string;
  logoImageUrl: string;
  posterImageUrl: string;
  mobilePosterImageUrl: string;
  youtubeUrl: string;
  isLiveActive: boolean;
  liveStreamNote: string;
  speaker: {
    honorificTitle: string;
    urduName: string;
    englishName: string;
    almaMater: string;
    profession: string;
    bio: string;
    wikipediaUrl?: string;
    relations: SpeakerRelation[];
  };
  schedule: ScheduleItem[];
}

export interface RsvpEntry {
  id: string;
  fullName: string;
  district: string;
  phone: string;
  attendeesCount: number;
  organization: string;
  createdAt: string;
}
