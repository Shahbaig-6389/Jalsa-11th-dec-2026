import React from 'react';
import { ExternalLink } from 'lucide-react';
import { EventData } from '../types/event';

interface SpeakerSectionProps {
  speaker: EventData['speaker'];
}

export const SpeakerSection: React.FC<SpeakerSectionProps> = ({ speaker }) => {
  return (
    <section id="speaker" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Bio Column */}
        <div className="lg:col-span-5 min-w-0 space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#084E39]">
              Guest of Honour &amp; Keynote Speaker
            </p>
            <p
              className="font-urdu text-2xl sm:text-3xl text-[#084E39] leading-[2.2] break-words"
              dir="rtl"
            >
              {speaker.urduName}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111C17] leading-tight [text-wrap:balance] break-words">
              {speaker.englishName}
            </h2>
          </div>

          <div className="pt-2 border-t border-emerald-950/10 space-y-2 text-sm break-words">
            <div>
              <span className="text-[#556B60]">Office &amp; Title: </span>
              <span className="font-semibold text-[#111C17]">{speaker.honorificTitle}</span>
            </div>
            <div>
              <span className="text-[#556B60]">Tradition: </span>
              <span className="font-medium text-[#111C17]">{speaker.almaMater}</span>
            </div>
            <div>
              <span className="text-[#556B60]">Institution: </span>
              <span className="font-medium text-[#111C17]">{speaker.profession}</span>
            </div>
          </div>

          <p className="text-[15px] text-[#3F5249] leading-[1.75] max-w-prose break-words">
            {speaker.bio}
          </p>

          {speaker.wikipediaUrl && (
            <div className="pt-1">
              <a
                href={speaker.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#084E39] hover:text-[#063B2B] underline underline-offset-4 transition-colors"
              >
                <span>Read on Wikipedia</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Right Lineage & Relations Directory */}
        <div className="lg:col-span-7 min-w-0 w-full bg-white border border-emerald-950/10 rounded-xl p-5 sm:p-8">
          <div className="pb-4 border-b border-emerald-950/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h3 className="font-serif text-2xl font-bold text-[#111C17] break-words">
              Distinguished Scholarly Lineage &amp; Relations
            </h3>
            <span className="text-xs text-[#556B60] tabular-nums shrink-0">
              {speaker.relations.length} Listed Elders &amp; Scholars
            </span>
          </div>

          <dl className="divide-y divide-emerald-950/10 text-sm">
            {speaker.relations.map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-baseline"
              >
                <dt className="sm:col-span-7 min-w-0 font-semibold text-[#111C17] break-words">{item.name}</dt>
                <dd className="sm:col-span-5 min-w-0 sm:text-right text-[#4E6459] break-words">{item.relation}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
