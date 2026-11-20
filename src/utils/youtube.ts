export interface ParsedYouTube {
  videoId: string | null;
  embedUrl: string | null;
  watchUrl: string | null;
}

export function parseYouTubeUrl(rawUrl: string): ParsedYouTube {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { videoId: null, embedUrl: null, watchUrl: null };
  }

  // Raw 11-character YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return {
      videoId: trimmed,
      embedUrl: `https://www.youtube-nocookie.com/embed/${trimmed}?rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${trimmed}`,
    };
  }

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    let videoId: string | null = null;

    if (host === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] ?? null;
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v');
      } else if (url.pathname.startsWith('/live/')) {
        videoId = url.pathname.split('/live/')[1]?.split('/')[0] ?? null;
      } else if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/embed/')[1]?.split('/')[0] ?? null;
      } else if (url.pathname.startsWith('/shorts/')) {
        videoId = url.pathname.split('/shorts/')[1]?.split('/')[0] ?? null;
      }
    }

    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return {
        videoId,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    }

    // Channel live fallback URL (e.g. youtube.com/@channel/live)
    if (host.includes('youtube.com')) {
      return {
        videoId: null,
        embedUrl: null,
        watchUrl: withProtocol,
      };
    }
  } catch {
    return { videoId: null, embedUrl: null, watchUrl: null };
  }

  return { videoId: null, embedUrl: null, watchUrl: null };
}
