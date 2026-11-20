import React, { useState } from 'react';
import { ExternalLink, Radio, Settings2, Video } from 'lucide-react';
import { parseYouTubeUrl } from '../utils/youtube';

interface LiveStreamSectionProps {
  youtubeUrl: string;
  isLiveActive: boolean;
  liveStreamNote: string;
  eventDateDisplay: string;
  isOrganizerUnlocked: boolean;
  onUpdateYouTube: (url: string, isLive: boolean) => void;
}

export const LiveStreamSection: React.FC<LiveStreamSectionProps> = ({
  youtubeUrl,
  isLiveActive,
  liveStreamNote,
  eventDateDisplay,
  isOrganizerUnlocked,
  onUpdateYouTube,
}) => {
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [draftUrl, setDraftUrl] = useState(youtubeUrl);
  const [draftLive, setDraftLive] = useState(isLiveActive);
  const [errorMsg, setErrorMsg] = useState('');

  const parsed = parseYouTubeUrl(youtubeUrl);
  const hasEmbed = Boolean(parsed.embedUrl);

  const handleSaveQuickLink = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draftUrl.trim();
    if (trimmed && !parseYouTubeUrl(trimmed).embedUrl && !parseYouTubeUrl(trimmed).watchUrl) {
      setErrorMsg('Please enter a valid YouTube link (e.g. https://youtube.com/live/... or Video ID).');
      return;
    }
    setErrorMsg('');
    onUpdateYouTube(trimmed, draftLive);
    setShowQuickSetup(false);
  };

  return (
    <section id="live" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="bg-[#084E39] text-white rounded-2xl p-5 sm:p-10 space-y-6 min-w-0">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#C2DC62] font-semibold">
              {isLiveActive && hasEmbed ? (
                <>
                  <Radio className="w-4 h-4 text-[#C2DC62]" />
                  <span>Live Conference Broadcast Active</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 text-[#C2DC62]" />
                  <span>Scheduled YouTube Broadcast · {eventDateDisplay}</span>
                </>
              )}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Live Conference Stream
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {parsed.watchUrl && (
              <a
                href={parsed.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#C2DC62] text-[#063B2B] text-xs font-semibold rounded-md hover:bg-[#d2ea78] transition-colors whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open on YouTube
              </a>
            )}
            {isOrganizerUnlocked && (
              <button
                type="button"
                onClick={() => {
                  setDraftUrl(youtubeUrl);
                  setDraftLive(isLiveActive);
                  setErrorMsg('');
                  setShowQuickSetup((prev) => !prev);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-white/25 text-white text-xs font-medium rounded-md hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Settings2 className="w-3.5 h-3.5 text-[#C2DC62]" />
                {showQuickSetup ? 'Close Stream Setup' : 'Connect YouTube Link'}
              </button>
            )}
          </div>
        </div>

        {/* Inline Organizer YouTube Link Connector */}
        {isOrganizerUnlocked && showQuickSetup && (
          <form
            onSubmit={handleSaveQuickLink}
            className="bg-[#063B2B] border border-white/15 rounded-xl p-5 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-7 min-w-0 space-y-1.5">
                <label htmlFor="quick-yt-url" className="block text-xs font-medium text-[#E5F0EA]">
                  YouTube Live / Video URL or 11-Character Video ID
                </label>
                <input
                  id="quick-yt-url"
                  type="text"
                  value={draftUrl}
                  onChange={(e) => setDraftUrl(e.target.value)}
                  placeholder="https://www.youtube.com/live/VIDEO_ID or https://youtu.be/VIDEO_ID"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#042B1F] border border-white/20 rounded-md text-white placeholder:text-white/40"
                />
              </div>

              <div className="md:col-span-3 min-w-0">
                <label className="flex items-center gap-2.5 py-2.5 px-3 bg-[#042B1F] border border-white/15 rounded-md cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={draftLive}
                    onChange={(e) => setDraftLive(e.target.checked)}
                    className="w-4 h-4 accent-[#C2DC62]"
                  />
                  <span className="text-xs font-medium text-white">Activate Live Player</span>
                </label>
              </div>

              <div className="md:col-span-2 min-w-0">
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-[#C2DC62] text-[#063B2B] text-xs font-semibold rounded-md hover:bg-[#d2ea78] cursor-pointer whitespace-nowrap"
                >
                  Save Stream
                </button>
              </div>
            </div>

            {errorMsg && <p className="text-xs text-amber-300">{errorMsg}</p>}
            <p className="text-xs text-[#C6DCD2]">
              Tip: On 11th Dec 2026, paste your YouTube Live link here and check &quot;Activate Live Player&quot;. Remember to export your updated GitHub index.html from &quot;Manage &amp; Export HTML&quot; to publish it for everyone.
            </p>
          </form>
        )}

        {/* Video Frame */}
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#042B1F] border border-white/15 flex items-center justify-center">
          {isLiveActive && parsed.embedUrl ? (
            <iframe
              className="w-full h-full"
              src={parsed.embedUrl}
              title="Jalsa Islah-e-Moashara Live YouTube Conference"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="max-w-lg px-6 py-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#084E39] border border-white/15 mx-auto flex items-center justify-center">
                <Video className="w-6 h-6 text-[#C2DC62]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-white">
                  {parsed.embedUrl
                    ? 'YouTube Stream Linked — Ready for Event Day'
                    : 'Broadcast Standby for 11th December 2026'}
                </h3>
                <p className="text-sm text-[#DCEAE3] leading-relaxed">{liveStreamNote}</p>
              </div>
              {isOrganizerUnlocked && (
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDraftUrl(youtubeUrl);
                      setDraftLive(true);
                      setShowQuickSetup(true);
                    }}
                    className="px-4 py-2 bg-[#C2DC62] text-[#063B2B] text-xs font-semibold rounded-md hover:bg-[#d2ea78] cursor-pointer"
                  >
                    {parsed.embedUrl ? 'Switch Live Player On' : 'Connect YouTube Live URL'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
