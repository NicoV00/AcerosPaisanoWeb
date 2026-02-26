import React, {
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import "./Home.css";
import "./Home-performance.css";
import "./Home-improvements.css";
import "./Home-fixes.css";
import { Link, useNavigate } from "react-router-dom";
import ButtonHoverBg from "../../components/CustomButton/ButtonHoverBg";
import { NavBar } from "../../components/navbar/navbar.jsx";
import { Footer } from "../../components/footer/Footer.jsx";
import { Box, Typography } from "@mui/material";
import ProductServicePage from "../ProductServicePage/ProductServicePage";

// Lazy load heavy components
const SlidingContainers = lazy(() =>
  import("../../components/carousel/SlidingContainers")
);
const ParallaxBox = lazy(() =>
  import("../../components/parallaxBox/ParallaxBox")
);
const ParallaxBoxColumn = lazy(() =>
  import("../../components/parallaxBox/ParallaxBoxColumn")
);
const ParallaxVideoBox = lazy(() =>
  import("../../components/parallaxBox/ParallaxVideoBox")
);
const HomeModal = lazy(() =>
  import("../../components/homeComponents/HomeModal").then((module) => ({
    default: module.HomeModal,
  }))
);
const OptimizedImage = lazy(() =>
  import("../../components/OptimizedImage/OptimizedImage")
);

// Lazy load GSAP only when needed
let gsap, ScrollTrigger;
const loadGSAP = async () => {
  if (!gsap) {
    const gsapModule = await import("gsap");
    const scrollTriggerModule = await import("gsap/ScrollTrigger");
    gsap = gsapModule.default;
    ScrollTrigger = scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  }
  return { gsap, ScrollTrigger };
};

export const Home = () => {
  const descubrirRef = useRef();
  const imageRef = useRef();
  const lineWrapperRef = useRef([]);
  const imageTitleRef = useRef();
  const welcomeRef = useRef();
  const heroVideoRef = useRef();
  const benefitsTitleLeftRef = useRef();
  const benefitsTitleRightRef = useRef();
  const benefitItemsRef = useRef([]);

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [animationsInitialized, setAnimationsInitialized] = useState(false);

  const [selectedService, setSelectedService] = useState(null);

  const navigate = useNavigate();

  const homeText = `Le damos forma al acero: soluciones eficientes para el hormigón armado`;

  const splitText = (text, parts) => {
    const partLength = Math.ceil(text.length / parts);
    const result = [];
    let start = 0;

    for (let i = 0; i < parts; i++) {
      let end = start + partLength;

      if (end < text.length) {
        while (end > start && text[end] !== " ") end--;
      }

      result.push(text.substring(start, end).trim());
      start = end + 1;
    }

    if (start < text.length) {
      result[result.length - 1] += " " + text.substring(start).trim();
    }

    return result;
  };

  const isSmallScreen = isMobile || window.innerWidth <= 768;
  const textParts = useMemo(() => {
    if (isSmallScreen) {
      // En móvil: dividir en 3 líneas bien distribuidas
      return [
        "Le damos forma al acero:",
        "soluciones eficientes",
        "para el hormigón armado"
      ];
    }
    return splitText(homeText, 3);
  }, [homeText, isSmallScreen]);


  const HERO_BEFORE_SLIDER_SPACING_DESKTOP = "180px"; // probá 140–240px
  const HERO_BEFORE_SLIDER_SPACING_MOBILE = "120px";  // probá 90–160px

  // =========================================================
  // ✅ AJUSTE 2: INTERLINEADO más apretado del hero
  // =========================================================
  const heroLineSx = useMemo(
    () => ({
      // ✅ Tamaño más grande en móvil
      fontSize: { xs: "clamp(36px, 32px, 96px)", sm: "42px", md: "54px", lg: "96px" },

      // ✅ Line-height aumentado para evitar cortes en letras como "g"
      lineHeight: { xs: 1.1, sm: 1.15, md: 1.2, lg: 1.2 },

      textAlign: "left",
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      letterSpacing: "-0.08em",
      m: 0,
      p: 0,
    }),
    []
  );

  const heroOverlaySx = useMemo(
    () => ({
      ...heroLineSx,
      // color: "#fff", // si querés forzar overlay a blanco, descomentá
    }),
    [heroLineSx]
  );

  // ✅ Ajuste fino extra: espaciado adecuado ENTRE líneas
  // (porque cada línea es un <div> separado)
  // Interlineado mucho más apretado
  const HERO_LINE_GAP_TIGHT_DESKTOP = "-0.6em"; // Interlineado muy apretado
  const HERO_LINE_GAP_TIGHT_MOBILE = "-0.45em";  // Interlineado muy apretado en móvil

  // Initialize scroll animations only when user starts scrolling
  // Utility to yield to the main thread between tasks
  const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

  const initializeScrollAnimations = useCallback(async () => {
    if (animationsInitialized || prefersReducedMotion) return;

    // Keep your existing delay — gives browser time to paint first
    await new Promise((resolve) => setTimeout(resolve, 500));
    const { gsap } = await loadGSAP();

    // Slice refs before the loop
    lineWrapperRef.current = lineWrapperRef.current.slice(0, textParts.length);

    // Scroll-triggered text reveal animation
    for (const wrapper of lineWrapperRef.current) {
      if (!wrapper) continue;
      const overlay = wrapper.querySelector(".line-overlay");
      if (!overlay) continue;

      // Yield BEFORE each heavy ScrollTrigger registration
      await yieldToMain();

      overlay.style.willChange = "clip-path";
      gsap.fromTo(
        overlay,
        { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 85%",
            end: "top 40%",
            scrub: 1,
            onComplete: () => {
              overlay.style.willChange = "auto";
            },
          },
        }
      );
    }

    // ✅ Yield before setting up descubrir animation
    if (descubrirRef.current) {
      await yieldToMain();
      descubrirRef.current.style.willChange = "opacity, transform";
      gsap.fromTo(
        descubrirRef.current,
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -20,
          scrollTrigger: {
            trigger: descubrirRef.current,
            start: "top 70%",
            end: "top 20%",
            scrub: 1,
            onComplete: () => {
              descubrirRef.current.style.willChange = "auto";
            },
          },
        }
      );
    }

    // ✅ Yield before imageRef animation
    if (imageRef.current) {
      await yieldToMain();
      imageRef.current.style.willChange = "opacity";
      gsap.fromTo(
        imageRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          scrollTrigger: {
            trigger: descubrirRef.current,
            start: "top 70%",
            end: "top 20%",
            scrub: 1,
            onComplete: () => {
              imageRef.current.style.willChange = "auto";
            },
          },
        }
      );
    }

    // ✅ Benefits Section Animations (Innovaciones en Acero)
    if (benefitsTitleLeftRef.current && benefitsTitleRightRef.current) {
      await yieldToMain();
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: benefitsTitleLeftRef.current,
          start: "top 85%",
          end: "top 45%",
          scrub: 1.5,
        }
      });

      tl.fromTo(benefitsTitleLeftRef.current,
        { x: isMobile ? -30 : -80, opacity: 0 },
        { x: isMobile ? 10 : 40, opacity: 1, duration: 1, ease: "power2.out" }
      ).fromTo(benefitsTitleRightRef.current,
        { x: isMobile ? 30 : 80, opacity: 0 },
        { x: isMobile ? -10 : -40, opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.8"
      );
    }

    benefitItemsRef.current.forEach((item, index) => {
      if (!item) return;
      gsap.fromTo(item,
        { opacity: 0, y: 60, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: "top 95%",
            end: "top 75%",
            scrub: 1.5,
          }
        }
      );
    });

    setAnimationsInitialized(true);
  }, [animationsInitialized, prefersReducedMotion, textParts.length]);

  // Optimize mobile and motion detection with debounce
  useEffect(() => {
    let resizeTimer;

    const checkMobile = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 150);
    };

    const checkReducedMotion = () => {
      setPrefersReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };

    setIsMobile(window.innerWidth <= 768);
    checkReducedMotion();

    window.addEventListener("resize", checkMobile, { passive: true });

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", checkReducedMotion);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", checkMobile);
      motionQuery.removeEventListener("change", checkReducedMotion);
    };
  }, []);

  // Lazy load video with IntersectionObserver
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !videoLoaded) {
            setVideoLoaded(true);
          }
        });
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (heroVideoRef.current) observer.observe(heroVideoRef.current);

    return () => {
      if (heroVideoRef.current) observer.unobserve(heroVideoRef.current);
    };
  }, [isMobile, prefersReducedMotion, videoLoaded]);

  // Optimize intro animation
  useEffect(() => {
    if (prefersReducedMotion) {
      if (welcomeRef.current) welcomeRef.current.style.display = "none";
      return;
    }

    let tl;

    const initIntroAnimation = async () => {
      await new Promise((resolve) => {
        if (document.readyState === "complete") setTimeout(resolve, 100);
        else window.addEventListener("load", () => setTimeout(resolve, 100));
      });

      const { gsap } = await loadGSAP();

      requestAnimationFrame(() => {
        if (!welcomeRef.current || !imageTitleRef.current) return;

        gsap.set(imageTitleRef.current, { y: 200, opacity: 0 });
        gsap.set(welcomeRef.current, { y: 0, opacity: 1 });

        tl = gsap.timeline({
          onComplete: () => {
            if (welcomeRef.current) welcomeRef.current.style.display = "none";
          },
        });

        tl.to(
          imageTitleRef.current,
          { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
          0.3
        ).to(
          welcomeRef.current,
          { y: "-100%", duration: 1, ease: "power3.inOut" },
          1.5
        );
      });
    };

    initIntroAnimation();
    return () => {
      if (tl) tl.kill();
    };
  }, [prefersReducedMotion]);

  // Initialize scroll animations
  useEffect(() => {
    if (animationsInitialized || prefersReducedMotion) return;

    const handleScroll = () => {
      if (!animationsInitialized) {
        initializeScrollAnimations();
        window.removeEventListener("scroll", handleScroll);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationsInitialized) {
            initializeScrollAnimations();
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" }
    );

    const elementsToObserve = [
      descubrirRef.current,
      ...lineWrapperRef.current,
      benefitsTitleLeftRef.current,
      ...benefitItemsRef.current
    ].filter(Boolean);
    elementsToObserve.forEach((el) => el && observer.observe(el));

    window.addEventListener("scroll", handleScroll, { passive: true, once: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [animationsInitialized, prefersReducedMotion, initializeScrollAnimations]);

  return (
    <section id="home" className="home">
      <NavBar />

      {/* Welcome Screen */}
      <Box
        ref={welcomeRef}
        sx={{
          display: { xs: "none", md: "block" },
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          zIndex: 100,
        }}
      >
        <Box
          ref={imageTitleRef}
          component="img"
          src="./images/titulo.jpg"
          alt="title"
          fetchPriority="high"
          sx={{
            height: "150px",
            width: "auto",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 101,
            opacity: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "rgb(0, 0, 0)",
            width: "90%",
            height: "45%",
            bottom: "0%",
            left: "5%",
            zIndex: 9999,
          }}
        />
      </Box>

      <div className="home-container" style={{ zIndex: 1 }}>
        {/* Top Section with Hero Video */}
        <div className="top">
          <div className="home-top-row">
            <div className="home-top-grid">
              <Box className="image-column image-left" sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                alignItems: "center",
                width: { xs: "95%", md: "100%" },
                position: { xs: "absolute", md: "relative" },
                top: { xs: "12vh", md: "auto" }
              }}>
                <Box
                  component="img"
                  src="./images/paisanologowhite1.png"
                  alt="Left Image"
                  fetchpriority="high"
                  sx={{
                    width: "auto",
                    height: { xs: "9vh", md: "10vh", xl: "20vh" },
                    marginTop: { xs: "0", md: "60px" },
                    paddingLeft: { xs: "24px", md: "3.5vw" },
                    paddingRight: { xs: "24px", md: "3.5vw" }
                  }}
                />
              </Box>
            </div>
          </div>

          <div className="Portada-video" ref={heroVideoRef}>
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src="/14-optimized.mp4" type="video/mp4" />
              <source src="/14.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Middle Row */}
        <div className="home-middle-row">
          <Box
            sx={{
              paddingBottom: { xs: "60px", sm: "0px", md: "0px", lg: "0px" },
              width: { xs: "70%", sm: "50%", md: "30%", lg: "20%" },
            }}
            className="catalogue-section"
          >
            <Typography sx={{ lineHeight: "1.3", marginBottom: "20px" }} className="catalogue-description">
              Desde 2011 apoyando a la industria nacional
            </Typography>
            <Box className="catalogue-button-wrapper" sx={{ paddingRight: { xs: "12px", md: "20px" } }}>
              <Link to={"/productos"}>
                <ButtonHoverBg label="Explorar Productos" buttonStyles={"catalogue-button"} />
              </Link>
            </Box>
          </Box>

          <Box
            sx={{ paddingBottom: { xs: "60px", sm: "0px", md: "0px", lg: "0px" } }}
            ref={descubrirRef}
            className="scroll-indicator"
          >
            Desliza para descubrir
          </Box>
        </div>

        {/* Bottom Row - Text Animation */}
        <Box
          className="home-bottom-row"
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            // ✅ MÁS ESPACIO antes del slider
            paddingBottom: isMobile
              ? HERO_BEFORE_SLIDER_SPACING_MOBILE
              : HERO_BEFORE_SLIDER_SPACING_DESKTOP,
            paddingLeft: { xs: "24px", md: "3.5vw" },
            paddingRight: { xs: "24px", md: "3.5vw" },
            width: "100%",
          }}
        >
          <Box
            className="about-intro"
            sx={{
              width: "100%",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              // Los márgenes ya están en el padre (home-bottom-row)
            }}
          >
            {textParts.map((part, index) => (
              <div
                key={index}
                ref={(el) => (lineWrapperRef.current[index] = el)}
                className="line-wrapper"
                style={{
                  width: "100%",

                  // ✅ Cierra el espacio ENTRE líneas (solo desde la 2da)
                  marginTop:
                    index === 0
                      ? "0em"
                      : (isMobile ? HERO_LINE_GAP_TIGHT_MOBILE : HERO_LINE_GAP_TIGHT_DESKTOP),
                }}
              >
                <Typography
                  component="p"
                  variant="inherit"
                  className="line"
                  sx={{
                    ...heroLineSx,
                    color: "#fff", // Fijo en blanco
                  }}
                >
                  {part}
                </Typography>
              </div>
            ))}
          </Box>
        </Box>

        {/* Products Slider */}
        <div className="home-products-slider">
          <Suspense
            fallback={
              <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Cargando...
              </div>
            }
          >
            <SlidingContainers />
          </Suspense>
        </div>

        {/* Two Column Parallax Images */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            boxSizing: "border-box",
            display: "flex",

            /* ✅ MENOS separación entre imágenes */
            gap: { xs: "20px", md: "18px" },

            /* ✅ MENOS márgenes laterales (mobile y web) */
            px: { xs: "16px", md: "16px" },
            py: { xs: "32px", md: "64px" },

            justifyContent: "center",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },

            marginTop: "40px",
            marginBottom: "40px",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "auto" },
              flex: { xs: "none", md: 1 },   // ✅ reparte mejor el ancho
              minWidth: 0,
              position: "relative",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <Suspense
              fallback={
                <div
                  style={{
                    height: "60vh",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                  }}
                />
              }
            >
              <ParallaxBoxColumn image="/images/malla10.jpg" />
            </Suspense>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", md: "auto" },
              flex: { xs: "none", md: 1 },
              minWidth: 0,
              position: "relative",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <Suspense
              fallback={
                <div
                  style={{
                    height: "60vh",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                  }}
                />
              }
            >
              <ParallaxBoxColumn image="/images/barras.jpg" />
            </Suspense>
          </Box>
        </Box>

        {/* First Product Row */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row", md: "row" }}
          width={"100%"}
          sx={{ marginTop: "40px", marginBottom: "40px" }}
        >
          <Box onClick={() => setSelectedService("hierro-cortado-y-doblado")} style={{ width: "100%", height: "100%", cursor: "pointer", position: "relative" }}>
            <Box
              className="interact"
              sx={{
                height: { xs: "40vh", sm: "70vh", md: "100vh", lg: "100vh", xl: "100vh" },
                zIndex: 0,
                backgroundColor: "#000",
                position: "relative",
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "#EE2737" },
              }}
            >
              <div
                className="interact-item"
                style={{
                  zIndex: 0,
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  paddingLeft: isMobile ? "30px" : "60px",
                  paddingTop: isMobile ? "40px" : "60px",
                  paddingBottom: isMobile ? "30px" : "60px",
                  paddingRight: isMobile ? "30px" : "60px",
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                <p style={{ margin: 0, fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: 500, color: "white" }}>
                  Hierro Cortado y Doblado
                </p>
                <p
                  style={{
                    fontSize: "0.95rem",
                    opacity: 0.7,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 300,
                    maxWidth: isMobile ? "100%" : "450px",
                    lineHeight: "1.6",
                    color: "white",
                    margin: 0,
                    textAlign: "left",
                  }}
                >
                  Sistema industrial de corte y doblado de varillas que garantiza precisión milimétrica y cero desperdicio. Nuestro proceso automatizado reduce hasta un 60% los tiempos de obra, optimizando recursos y garantizando la calidad estructural de su proyecto.
                </p>
              </div>
            </Box>
          </Box>

          <Box onClick={() => setSelectedService("mallas-electrosoldadas")} style={{ width: "100%", height: "100%", cursor: "pointer" }}>
            <Box
              className="interact"
              sx={{
                height: { xs: "40vh", sm: "70vh", md: "100vh", lg: "100vh", xl: "100vh" },
                zIndex: 0,
                backgroundColor: "#000",
                position: "relative",
                "&:hover": { backgroundColor: "#EE2737" },
              }}
            >
              <div
                className="interact-item"
                style={{
                  zIndex: 0,
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  paddingLeft: isMobile ? "30px" : "60px",
                  paddingTop: isMobile ? "40px" : "60px",
                  paddingBottom: isMobile ? "30px" : "60px",
                  paddingRight: isMobile ? "30px" : "60px",
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                <p style={{ margin: 0, fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: 500, color: "white" }}>
                  Mallas Electrosoldadas
                </p>
                <p
                  style={{
                    fontSize: "0.95rem",
                    opacity: 0.7,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 300,
                    maxWidth: isMobile ? "100%" : "450px",
                    lineHeight: "1.6",
                    color: "white",
                    margin: 0,
                    textAlign: "left",
                  }}
                >
                  Mallas certificadas bajo norma UNIT 845:1995 que garantizan el refuerzo estructural óptimo. Con medidas estándar en stock permanente y fabricación de medidas especiales, aseguramos la disponibilidad inmediata para su obra con la máxima calidad certificada.
                </p>
              </div>
            </Box>
          </Box>
        </Box>
      </div>
      {/* END of home-container */}

      {/* First Parallax Video */}
      <div className="Home" style={{ marginTop: "60px", marginBottom: "60px" }}>
        <Suspense fallback={<div style={{ height: "75vh", backgroundColor: "#000" }} />}>
          <ParallaxVideoBox videoSrc="/videos/Electro.mp4" />
        </Suspense>
      </div>

      {/* Second Product Row */}
      <Box display="flex" flexDirection={{ xs: "column", sm: "row", md: "row" }} width={"100%"} sx={{ marginTop: "80px", marginBottom: "80px" }}>
        <Box onClick={() => setSelectedService("barras-conformadas")} style={{ width: "100%", height: "100%", cursor: "pointer" }}>
          <Box className="interact" sx={{ height: { xs: "40vh", sm: "70vh", md: "100vh", lg: "100vh", xl: "100vh" }, zIndex: 0, backgroundColor: "#000", position: "relative", "&:hover": { backgroundColor: "#EE2737" } }}>
            <div className="interact-item" style={{ zIndex: 0, backgroundColor: "transparent", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", paddingLeft: isMobile ? "30px" : "60px", paddingTop: isMobile ? "40px" : "60px", paddingBottom: isMobile ? "30px" : "60px", paddingRight: isMobile ? "30px" : "60px", height: "100%", boxSizing: "border-box" }}>
              <p style={{ margin: 0, fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: 500, color: "white" }}>Barras Lisas y Conformadas</p>
              <p style={{ fontSize: "0.95rem", opacity: 0.7, fontFamily: "Inter, sans-serif", fontWeight: 300, maxWidth: isMobile ? "100%" : "450px", lineHeight: "1.6", color: "white", margin: 0, textAlign: "left" }}>
                Certificadas bajo normas UNIT 34:1995 Y UNIT 845:1995. Procesos de calidad garantizada con barras cortadas a medida para eliminar desperdicios en obra.
              </p>
            </div>
          </Box>
        </Box>

        <Box onClick={() => setSelectedService("mallas-plegadas")} style={{ width: "100%", height: "100%", cursor: "pointer" }}>
          <Box className="interact" sx={{ height: { xs: "40vh", sm: "70vh", md: "100vh", lg: "100vh", xl: "100vh" }, zIndex: 0, backgroundColor: "#000", position: "relative", "&:hover": { backgroundColor: "#EE2737" } }}>
            <div className="interact-item" style={{ zIndex: 0, backgroundColor: "transparent", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", paddingLeft: isMobile ? "30px" : "60px", paddingTop: isMobile ? "40px" : "60px", paddingBottom: isMobile ? "30px" : "60px", paddingRight: isMobile ? "30px" : "60px", height: "100%", boxSizing: "border-box" }}>
              <p style={{ margin: 0, fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: 500, color: "white" }}>Mallas Plegadas</p>
              <p style={{ fontSize: "0.95rem", opacity: 0.7, fontFamily: "Inter, sans-serif", fontWeight: 300, maxWidth: isMobile ? "100%" : "450px", lineHeight: "1.6", color: "white", margin: 0, textAlign: "left" }}>
                Combina las ventajas del cortado y doblado + mallas. Tecnología de punta en plegado con plegadora automatizada para optimización total de su proyecto constructivo.
              </p>
            </div>
          </Box>
        </Box>
      </Box>

      {/* Last Video Section - Phrase + Corner Video */}
      <Box
        sx={{
          backgroundColor: "#000",
          minHeight: { xs: "70vh", md: "110vh" },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          // Reforzamos el padding lateral para asegurar el margen
          px: { xs: "24px", md: "3.5vw" },
          py: { xs: "80px", md: "120px" },
          justifyContent: "space-between",
          boxSizing: "border-box"
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontSize: { xs: "2.5rem", md: "5rem" },
            fontWeight: 400,
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.0,
            maxWidth: { xs: "100%", md: "1100px" },
            textAlign: "left",
            zIndex: 2,
            letterSpacing: "-0.05em",
            opacity: 0.95,
            // Subimos la frase en móvil para quitar espacio negro, y mantenemos elevación en web
            marginTop: { xs: "-40px", md: "-60px" }
          }}
        >
          Soluciones en acero para proyectos que exigen precisión
        </Typography>

        <Box
          sx={{
            alignSelf: "stretch",
            width: "100%",
            display: "flex",
            // En móvil lo mandamos a la derecha pero con un ancho menor para que deje margen izquierdo
            justifyContent: { xs: "flex-end", md: "flex-end" },
            marginTop: { xs: "100px", md: "0" },
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: { xs: "80%", md: "350px", lg: "450px" },
              // Altura más pronunciada en móvil
              aspectRatio: { xs: "1/1.1", md: "1.2/1" },
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "0 40px 80px rgba(0,0,0,0.9)",
              transition: "transform 0.6s cubic-bezier(0.2, 1, 0.3, 1)",
              "&:hover": {
                transform: { md: "translateY(-10px) scale(1.03)" }
              }
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src="/videos/19.mp4" type="video/mp4" />
            </video>
          </Box>
        </Box>
      </Box>

      {/* Animated Benefits Section - INNOVACIONES (Mismo ancho que card Footer) */}
      <Box
        sx={{
          backgroundColor: "#000",
          py: { xs: "80px", md: "140px" },
          px: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: { xs: "28px", md: "40px" },
            width: "100%",
            padding: { xs: "60px 24px", md: "120px 100px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: "80px", md: "120px" },
            boxSizing: "border-box",
            position: "relative"
          }}
        >
          {/* Titles: Meeting towards the center */}
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
              <Typography
                ref={benefitsTitleLeftRef}
                sx={{
                  fontSize: { xs: "2.2rem", md: "7rem" },
                  fontWeight: 400,
                  color: "#999",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 0.85,
                  letterSpacing: "-0.05em"
                }}
              >
                Innovaciones
              </Typography>
            </Box>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <Typography
                ref={benefitsTitleRightRef}
                sx={{
                  fontSize: { xs: "2.2rem", md: "7rem" },
                  fontWeight: 400,
                  color: "#111",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 0.85,
                  letterSpacing: "-0.05em"
                }}
              >
                en acero industrial
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "60px",
              width: "100%",
              maxWidth: "600px", // Even narrower to force centering and neatness
              alignItems: "stretch",
              mx: "auto", // Absolute centering
              transform: { md: "translateX(40px)" } // Offset slightly right for visual balance
            }}
          >
            {[
              {
                num: "1",
                title: "Calidad certificada",
                desc: "Barras y mallas certificadas bajo normas UNIT, asegurando la máxima seguridad estructural y resistencia en cada proyecto."
              },
              {
                num: "2",
                title: "Velocidad y eficiencia",
                desc: "Entrega inmediata y procesos automatizados que optimizan los tiempos de obra y la rentabilidad de su inversión."
              },
              {
                num: "3",
                title: "Flexibilidad y servicio",
                desc: "Soluciones a medida que se adaptan a las demandas técnicas y arquitectónicas más exigentes de la industria nacional."
              },
              {
                num: "4",
                title: "Innovación tecnológica",
                desc: "Incorporamos maquinaria de última generación para garantizar cortes precisos y una optimización total del acero."
              },
              {
                num: "5",
                title: "Soporte especializado",
                desc: "Décadas de trayectoria brindando asesoramiento experto para maximizar los resultados técnicos en sus construcciones."
              }
            ].map((benefit, idx) => (
              <Box
                key={idx}
                ref={(el) => (benefitItemsRef.current[idx] = el)}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center", // Mejor alineación vertical con el círculo más grande
                  gap: { xs: "30px", md: "40px" },
                  opacity: 0,
                  paddingBottom: "40px",
                  position: "relative"
                }}
              >
                <Box
                  sx={{
                    minWidth: { xs: "45px", md: "60px" },
                    height: { xs: "45px", md: "60px" },
                    borderRadius: "50%",
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: { xs: "15px", md: "18px" },
                    fontWeight: 500,
                    color: "#000",
                    backgroundColor: "#f9f9f9",
                    flexShrink: 0
                  }}
                >
                  {benefit.num}
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "1.3rem", md: "1.7rem" },
                      fontWeight: 600,
                      color: "#1a1a1a",
                      fontFamily: "Inter, sans-serif",
                      marginBottom: "6px",
                      letterSpacing: "-0.01em"
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.85rem", md: "0.96rem" },
                      color: "#666",
                      fontFamily: "Inter, sans-serif",
                      lineHeight: 1.4,
                      maxWidth: { xs: "100%", md: "460px" },
                      fontWeight: 400
                    }}
                  >
                    {benefit.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Modal and Suspense removed - now using routes */}
      {
        selectedService && (
          <ProductServicePage
            serviceSlug={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )
      }

      <Footer />
    </section >
  );
};
