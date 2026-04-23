import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

export default function ParallaxBoxColumn({ image, height = "60vh" }) {
  const boxRef = useRef(null);
  const imageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (boxRef.current) {
      observer.observe(boxRef.current);
    }

    return () => {
      if (boxRef.current) {
        observer.unobserve(boxRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const loadGSAP = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            y: "-10%",
            scale: 1.2
          },
          {
            y: "10%",
            scale: 1.2,
            ease: "none",
            scrollTrigger: {
              trigger: boxRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    };

    loadGSAP();
  }, [isVisible]);

  return (
    <Box
      ref={boxRef}
      sx={{
        width: "100%",
        height: height,
        overflow: "hidden",
        position: "relative",
        borderRadius: "8px",
        backgroundColor: "#f0f0f0",
      }}
    >
      {isVisible && (
        <Box
          ref={imageRef}
          component="img"
          src={image}
          alt={"Parallax image - " + image}
          sx={{
            width: "100%",
            height: "120%",
            objectFit: "cover",
            position: "absolute",
            top: "-10%",
            left: 0,
            willChange: "transform",
          }}
        />
      )}
    </Box>
  );
}