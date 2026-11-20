import React, { useState } from 'react';
import { CalendarPlus, SlidersHorizontal } from 'lucide-react';
import { ScheduleItem, SessionPeriod } from '../types/event';

interface ScheduleSectionProps {
  eventDateDisplay: string;
  schedule: ScheduleItem[];
  isOrganizerUnlocked: boolean;
  onDownloadCalendar: () => void;
  onOpenScheduleEditor: () => void;
}

type FilterOption = 'All' | SessionPeriod;

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  eventDateDisplay,
  schedule,
  isOrganizerUnlocked,
  onDownloadCalendar,
  onOpenScheduleEditor,
}) => {
  const [filter, setFilter] = useState<FilterOption>('All');
  const allPeriods: FilterOption[] = ['All', 'Morning', 'Afternoon', 'Evening'];
  const availablePeriods = allPeriods.filter(
    (p) => p === 'All' || schedule.some((item) => item.period === p)
  );
  const showPeriodTabs = availablePeriods.length > 2;
  const activeFilter = availablePeriods.includes(filter) ? filter : 'All';

  const filteredItems =
    activeFilter === 'All'
      ? schedule
      : schedule.filter((item) => item.period === activeFilter);

  return (
    <section id="schedule" className="w-full bg-white border-y border-emerald-950/10 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-emerald-950/10">
          <div className="space-y-2 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#084E39]">
              Evening Programme · {eventDateDisplay}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111C17]">
              Event Schedule
            </h2>
            <p className="text-sm text-[#4E6459] max-w-xl">
              Programme timings from Maghrib prayer and pre-keynote addresses through the principal lecture and concluding Du&apos;a.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {showPeriodTabs && (
              <div
                role="tablist"
                aria-label="Filter schedule by time of day"
                className="inline-flex max-w-full overflow-x-auto items-center p-1 bg-[#EFF4F0] rounded-lg gap-1"
              >
                {availablePeriods.map((period) => {
                  const active = activeFilter === period;
                  return (
                    <button
                      key={period}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setFilter(period)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#084E39] text-white shadow-sm'
                          : 'text-[#3F5249] hover:text-[#111C17]'
                      }`}
                    >
                      {period === 'All' ? 'All Sessions' : period}
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={onDownloadCalendar}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border border-emerald-950/15 text-[#111C17] rounded-lg hover:bg-[#F3F7F4] transition-colors sm:whitespace-nowrap shrink-0 cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-[#084E39]" />
              Add to Calendar
            </button>

            {isOrganizerUnlocked && (
              <button
                type="button"
                onClick={onOpenScheduleEditor}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#084E39] hover:bg-[#EFF4F0] rounded-lg transition-colors sm:whitespace-nowrap shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Edit Schedule
              </button>
            )}
          </div>
        </div>

        {/* Schedule Rows */}
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#556B60]">
            No sessions listed for {filter}. Switch tabs or add a session from Edit Schedule.
          </div>
        ) : (
          <div className="divide-y divide-emerald-950/10">
            {filteredItems.map((session, index) => (
              <div
                key={session.id}
                className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start"
              >
                <div className="md:col-span-3 min-w-0 space-y-1">
                  <div className="font-mono tabular-nums text-sm font-semibold text-[#084E39]">
                    {session.time} – {session.endTime}
                  </div>
                  <div className="text-xs text-[#556B60] break-words">
                    0{index + 1}. {session.period} · {session.location}
                  </div>
                </div>

                <div className="md:col-span-9 min-w-0 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h3 className="text-lg font-semibold text-[#111C17] break-words">{session.title}</h3>
                    {session.urduTitle && (
                      <span className="font-urdu text-base text-[#084E39] leading-relaxed" dir="rtl">
                        {session.urduTitle}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#084E39] break-words">{session.speaker}</p>
                  <p className="text-sm text-[#4E6459] leading-relaxed max-w-3xl break-words">
                    {session.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
