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
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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

  // Secondary video lazy-load state
  const [electroVideoVisible, setElectroVideoVisible] = useState(false);
  const [cornerVideoVisible, setCornerVideoVisible] = useState(false);
  const electroVideoRef = useRef();
  const cornerVideoRef = useRef();

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
      // En móvil: dejar un solo bloque para que el navegador haga el salto (wrap) de forma natural
      // y llene los espacios vacíos, evitando los saltos duros forzados.
      return [homeText];
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
      // ✅ Tamaño calcado del componente inferior para xs
      fontSize: { xs: "2.5rem", sm: "42px", md: "54px", lg: "96px" },

      // ✅ Line-height original (no tocar para evitar overlap roto)
      lineHeight: { xs: 1.1, sm: 1.15, md: 1.2, lg: 1.2 },

      textAlign: "left",
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      letterSpacing: { xs: "-0.05em", sm: "-0.08em" },
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
  const HERO_LINE_GAP_TIGHT_MOBILE = "-0.45em";  // Interlineado muy apretado en móvil (original)

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

  // Lazy-load secondary videos with IntersectionObserver
  useEffect(() => {
    const observers = [];

    const makeObserver = (ref, setter) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
            obs.disconnect();
          }
        },
        { rootMargin: "200px", threshold: 0 }
      );
      obs.observe(ref.current);
      observers.push(obs);
    };

    makeObserver(electroVideoRef, setElectroVideoVisible);
    makeObserver(cornerVideoRef, setCornerVideoVisible);

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Optimize intro animation
  useEffect(() => {
    // Skip entirely on mobile — the overlay is hidden via CSS (display:{xs:'none'}) anyway
    // but GSAP still runs and burns ~400 ms of script evaluation
    if (isMobile || prefersReducedMotion) {
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
  }, [prefersReducedMotion, isMobile]);

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
                  fetchPriority="high"
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
              fetchPriority="high"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            >
              {/* Mobile: 480p compressed version (0.57 MB vs 4.24 MB) */}
              <source src="/14-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
              {/* Desktop: full quality */}
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
            <Typography variant="h1" sx={{ maxWidth: "none", whiteSpace: "nowrap", fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: { xs: "14px", md: "20px" }, fontWeight: "400", letterSpacing: "0.01em", lineHeight: "1.3", marginBottom: "20px" }} className="catalogue-description">
              Desde 2011 apoyando a la industria nacional
            </Typography>
            <Box className="catalogue-button-wrapper" sx={{ paddingRight: { xs: "12px", md: "20px" } }}>
              <Link to={"/productos"}>
                <ButtonHoverBg label="Explorar Productos" buttonStyles={"catalogue-button"} />
              </Link>
            </Box>
          </Box>

          <Box
            sx={{ paddingBottom: { xs: "60px", sm: "0px", md: "0px", lg: "0px" }, fontSize: { xs: "18px", md: "22px" }, fontWeight: "500", letterSpacing: "0.05em" }}
            ref={descubrirRef}
            className="scroll-indicator"
            variant="h6"
          >
            [Scroll]
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
            boxSizing: "border-box"
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
                  component="h3"
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

        {/* Single flat image with opposite cut corners */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            boxSizing: "border-box",
            py: { xs: "32px", md: "64px" },
            marginTop: "40px",
            marginBottom: "40px",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "60vh", md: "88vh" },
              minWidth: 0,
              overflow: "hidden",
              clipPath:
                "polygon(150px 0, 100% 0, 100% calc(100% - 70px), calc(100% - 150px) 100%, 0 100%, 0 70px)",
            }}
          >
            <img
              src="/images/malla10.jpg"
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        </Box>

        {/* First Product Row - Hierro Cortado y Doblado & Mallas Electrosoldadas */}
        <Box
          sx={{
            backgroundColor: "#000",
            width: "100%",
            boxSizing: "border-box",
            px: { xs: 2, sm: 3, md: 4 },
            pt: { xs: "40px", md: "40px" },
            pb: { xs: "40px", md: "40px" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              width: "100%",
              gap: { xs: "12px", md: "12px" },
            }}
          >
            {[
              {
                slug: "hierro-cortado-y-doblado",
                title: "Hierro Cortado y Doblado",
                image: "/images/doblado2.jpg",
                description:
                  "Sistema Industrializado de corte y doblado de varillas que garantiza la precisión de sus armaduras y el cero desperdicio. Nuestro proceso automatizado reduce hasta un 60% los tiempos de obra, optimizando recursos y garantizando la calidad estructural de su proyecto.",
              },
              {
                slug: "mallas-electrosoldadas",
                title: "Mallas Electrosoldadas",
                image: "/images/mallas3.jpg",
                description:
                  "Mallas electrosoldadas para hormigón fabricadas bajo norma UNIT 845:1995 que garantizan rapidez y una solución estructural óptima. Con medidas estándar en stock permanente y fabricación de medidas especiales, aseguramos la disponibilidad inmediata para su obra con la máxima calidad certificada.",
              },
            ].map((product) => (
              <Box
                key={product.slug}
                onClick={() => setSelectedService(product.slug)}
                sx={{
                  position: "relative",
                  width: { xs: "100%", md: "50%" },
                  height: { xs: "62vh", md: "82vh" },
                  cursor: "pointer",
                  overflow: "hidden",
                  borderRadius: { xs: "8px", md: "12px" },
                  backgroundColor: "#000",
                  border: "1px solid rgba(255,255,255,0.12)",
                  "&:hover .hover-img": { opacity: 1 },
                }}
              >
                <Box
                  className="hover-img"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${product.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0,
                    transition: "opacity 0.5s ease",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.55) 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    textAlign: "left",
                    padding: { xs: "24px", md: "44px" },
                    boxSizing: "border-box",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "1.8rem", md: "2.6rem" },
                      fontWeight: 400,
                      fontFamily: "Inter, sans-serif",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {product.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#fff",
                      opacity: 0.92,
                      fontSize: { xs: "0.95rem", md: "1.1rem" },
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      lineHeight: 1.45,
                      maxWidth: "560px",
                    }}
                  >
                    {product.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </div>
      {/* END of home-container */}

      {/* First Parallax Video — lazy: only mounts when scrolled into view */}
      <div className="Home" style={{ marginTop: "60px", marginBottom: "60px" }} ref={electroVideoRef}>
        {electroVideoVisible ? (
          <Suspense fallback={<div style={{ height: "88vh", backgroundColor: "#000" }} />}>
            <ParallaxVideoBox
              videoSrc="/videos/Electro.mp4"
              height={{ xs: "60vh", md: "88vh" }}
              clipPath="polygon(150px 0, 100% 0, 100% calc(100% - 70px), calc(100% - 150px) 100%, 0 100%, 0 70px)"
            />
          </Suspense>
        ) : (
          <div style={{ height: "88vh", backgroundColor: "#000" }} />
        )}
      </div>

      {/* Second Product Row - Mallas Plegadas & Barras Lisas */}
      <Box
        sx={{
          backgroundColor: "#000",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: "40px", md: "80px" },
          pb: { xs: "40px", md: "80px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            gap: { xs: "12px", md: "12px" },
          }}
        >
          {[
            {
              slug: "mallas-plegadas",
              title: "Mallas Plegadas",
              image: "/images/plegadasobra.webp",
              description:
                "Combina las ventajas del cortado y doblado + mallas. Tecnología de punta en plegado con plegadora automatizada para optimización total de su proyecto constructivo.",
            },
            {
              slug: "barras-conformadas",
              title: "Barras Lisas y Conformadas",
              image: "/images/barras3.webp",
              description:
                "Producido de acuerdo con las especificaciones de la norma UNIT 843:95 y UNIT 34:95. Procesos de calidad garantizada. Para mayor practicidad las barras pueden ir cortadas a medida para reducir el costo, generar economía de tiempo y eliminar desperdicios en obra.",
            },
          ].map((product) => (
            <Box
              key={product.slug}
              onClick={() => setSelectedService(product.slug)}
              sx={{
                position: "relative",
                width: { xs: "100%", md: "50%" },
                height: { xs: "62vh", md: "82vh" },
                cursor: "pointer",
                overflow: "hidden",
                borderRadius: { xs: "8px", md: "12px" },
                backgroundColor: "#000",
                border: "1px solid rgba(255,255,255,0.12)",
                "&:hover .hover-img": { opacity: 1 },
              }}
            >
              <Box
                className="hover-img"
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0,
                  transition: "opacity 0.5s ease",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.55) 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: { xs: "24px", md: "44px" },
                  boxSizing: "border-box",
                }}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: { xs: "1.8rem", md: "2.6rem" },
                    fontWeight: 400,
                    fontFamily: "Inter, sans-serif",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {product.title}
                </Typography>

                <Typography
                  sx={{
                    color: "#fff",
                    opacity: 0.92,
                    fontSize: { xs: "0.95rem", md: "1.1rem" },
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    lineHeight: 1.45,
                    maxWidth: "560px",
                  }}
                >
                  {product.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Last Video Section - Phrase + Corner Video */}
      <Box
        sx={{
          backgroundColor: "#000",
          minHeight: { xs: "70vh", md: "95vh" },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          // Reforzamos el padding lateral para asegurar el margen
          px: { xs: "24px", md: "3.5vw" },
          pt: { xs: "80px", md: "120px" },
          pb: { xs: "16px", md: "20px" },
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
            marginTop: { xs: "100px", md: "24px" },
            zIndex: 1,
          }}
        >
          <Box
            ref={cornerVideoRef}
            sx={{
              width: { xs: "80%", md: "420px", lg: "530px" },
              height: { xs: "48vh", md: "60vh" },
              borderRadius: { xs: "8px", md: "12px" },
              overflow: "hidden",
              boxShadow: "0 40px 80px rgba(0,0,0,0.9)",
              transition: "transform 0.6s cubic-bezier(0.2, 1, 0.3, 1)",
              "&:hover": {
                transform: { md: "translateY(-10px) scale(1.03)" }
              }
            }}
          >
            {/* Corner video — only starts loading once section is in viewport */}
            {cornerVideoVisible && (
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 65%" }}
              >
                <source src="/videos/19.mp4" type="video/mp4" />
              </video>
            )}
          </Box>
        </Box>
      </Box>

      {/* Animated Benefits Section - INNOVACIONES (Mismo ancho que card Footer) */}
      <Box
        sx={{
          backgroundColor: "#000",
          pt: { xs: "80px", md: "140px" },
          pb: 0,
          px: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: { xs: "8px", md: "12px" },
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

      {/* Nuevos Productos - Armaduras de Pilotes & Pasadores */}
      <Box
        sx={{
          backgroundColor: "#000",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: "12px", md: "12px" },
          pb: { xs: "40px", md: "80px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            gap: { xs: "12px", md: "12px" },
          }}
        >
          {[
            {
              slug: "armaduras-de-pilotes",
              title: "Armaduras de Pilotes",
              image: "/images/Pilotes2.webp",
              description:
                "Jaulas de acero bajo norma UNIT 843:95, con fabricación automatizada de precisión milimétrica y cero desperdicio.",
            },
            {
              slug: "pasadores",
              title: "Pasadores",
              image: "/images/pasadores3.webp",
              description:
                "Barras de acero liso AL 220 cortadas a medida para transferir cargas entre losas de hormigón, permitiendo el movimiento por dilatación o contracción.",
            },
          ].map((product) => (
            <Box
              key={product.slug}
              onClick={() => setSelectedService(product.slug)}
              sx={{
                position: "relative",
                width: { xs: "100%", md: "50%" },
                height: { xs: "62vh", md: "82vh" },
                cursor: "pointer",
                overflow: "hidden",
                borderRadius: { xs: "8px", md: "12px" },
                backgroundImage: `url(${product.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.55) 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: { xs: "24px", md: "44px" },
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "1.8rem", md: "2.6rem" },
                      fontWeight: 400,
                      fontFamily: "Inter, sans-serif",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {product.title}
                  </Typography>

                  <Box
                    sx={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: { xs: "11px", md: "12px" },
                      letterSpacing: "0.08em",
                      color: "#000",
                      backgroundColor: "#fff",
                      borderRadius: "999px",
                      padding: "6px 14px",
                      flexShrink: 0,
                    }}
                  >
                    NUEVO
                  </Box>
                </Box>

                <Typography
                  sx={{
                    color: "#fff",
                    opacity: 0.92,
                    fontSize: { xs: "0.95rem", md: "1.1rem" },
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    lineHeight: 1.45,
                    maxWidth: "560px",
                  }}
                >
                  {product.description}
                </Typography>
              </Box>
            </Box>
          ))}
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
