import React, { useRef, useEffect, useState } from 'react';

export const OptimizedVideo = ({
  src,
  poster,
  className,
  style,
  preload = 'none',
  threshold = 0.25,
  ...props
}) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);

        if (entry.isIntersecting) {
          // Load and play video when it comes into view
          if (!hasPlayed) {
            video.load();
            setHasPlayed(true);
          }
          video.play().catch(() => {
            // Handle autoplay failures silently
          });
        } else {
          // Pause video when out of view
          video.pause();
        }
      },
      {
        threshold,
        rootMargin: '50px' // Start loading slightly before visible
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [hasPlayed, threshold]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      poster={poster}
      preload={preload}
      loop
      muted
      playsInline
      {...props}
    >
      <source src={src} type="video/mp4" />
      Tu navegador no admite videos.
    </video>
  );
};