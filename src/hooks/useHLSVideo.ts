import { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';

interface UseHLSVideoOptions {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function useHLSVideo({ src, autoPlay = true, muted = true, loop = true }: UseHLSVideoOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    video.muted = muted;
    video.loop = loop;
    video.playsInline = true;

    let hls: Hls | null = null;

    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          if (autoPlay) video.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) setError(data.type);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS
        video.src = src;
        video.addEventListener('loadeddata', () => setIsLoading(false));
        if (autoPlay) video.play().catch(() => {});
      }
    } else {
      video.src = src;
      video.addEventListener('loadeddata', () => setIsLoading(false));
      if (autoPlay) video.play().catch(() => {});
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src, autoPlay, muted, loop]);

  return { videoRef, isLoading, error };
}
