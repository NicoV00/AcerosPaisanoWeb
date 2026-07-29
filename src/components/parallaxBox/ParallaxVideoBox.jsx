import { useEffect, useRef, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";

export default function ParallaxVideoBox({ videoSrc, title, titleColor, titleLeft = "2%", titleBottom = "14%", height = "75vh", clipPath }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
    // En móvil no hay parallax: el video queda fijo y bien encuadrado
    if (!isVisible || gsapLoaded || isMobile) return;

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
  }, [isVisible, gsapLoaded, isMobile]);

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
          style={
            isMobile
              ? {
                  // Móvil: video fijo que llena el contenedor, centrado y subido
                  // para que se vea el chispazo
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 25%",
                }
              : {
                  position: "absolute",
                  top: "-10%",
                  transform: "translate(-50%, -50%)",
                  width: "100vw",
                  height: "120vh",
                  objectFit: "cover",
                }
          }
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </Box>
  );
}
