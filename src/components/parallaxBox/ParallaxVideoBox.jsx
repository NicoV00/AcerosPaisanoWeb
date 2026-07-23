import { useEffect, useRef, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";

export default function ParallaxVideoBox({ videoSrc, title, titleColor, titleLeft = "2%", titleBottom = "14%", height = "75vh", clipPath }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // Lazy load video when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isVisible]);

  // Initialize parallax animation only when visible
  const initParallax = useCallback(async () => {
    if (!isVisible || gsapLoaded) return;

    const { default: gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    requestAnimationFrame(() => {
      if (!videoRef.current) return;

      // Add will-change for performance
      videoRef.current.style.willChange = 'transform';

      gsap.fromTo(
        videoRef.current,
        {
          transform: "translateY(-15%)",
        },
        {
          transform: "translateY(15%)",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
            onComplete: () => {
              if (videoRef.current) {
                videoRef.current.style.willChange = 'auto';
              }
            }
          },
        }
      );
    });

    setGsapLoaded(true);
  }, [isVisible, gsapLoaded]);

  useEffect(() => {
    if (isVisible) {
      initParallax();
    }
  }, [isVisible, initParallax]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100vw",
        height: height,
        marginTop: "40px",
        marginBottom: "40px",
        position: "relative",
        overflow: "hidden",
        marginLeft: "calc(50% - 50vw)",
        contain: "layout style",
        clipPath: clipPath,
      }}
    >
      {isVisible && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          loading="lazy"
          style={{
            position: "absolute",
            top: "-10%",
            transform: "translate(-50%, -50%)",
            width: "100vw",
            height: "120vh",
            objectFit: "cover",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </Box>
  );
}
