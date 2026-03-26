import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function ParallaxBox({ image, title, titleColor, titleLeft = "2%", titleBottom = "14%" }) {
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      boxRef.current,
      { backgroundPosition: "50% 0%" },
      {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: boxRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.5,
        },
      }
    );
  }, []);

  return (
    <Box
      ref={boxRef}
      sx={{
        width: "100vw",
        height: "75vh",
        marginTop: "40px",
        marginBottom: "40px",
        marginLeft: "0px",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
        backgroundAttachment: "fixed", // Ensures parallax feel
      }}
    >
      {title && (
        <Box position="absolute" left={titleLeft} bottom={titleBottom} zIndex={1}>
          <Typography variant="h2" fontSize={{ xs: "75px", md: "200px", xl: "200px" }} fontFamily={"Bona Nova SC"} color={titleColor}>{title}</Typography>

        </Box>
      )}
    </Box>
  );
}
