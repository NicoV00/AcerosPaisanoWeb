import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";
import { NavBar } from "../../components/navbar/navbar.jsx";
import { Footer } from "../../components/footer/Footer.jsx";
import { Box, Typography } from "@mui/material";

gsap.registerPlugin(ScrollTrigger);

const content = [
  {
    title: "Nuestra forma de construir valor",
    paragraphs: [
      "Aceros Paisano nació en 2010 con una idea clara: aportar soluciones que generen valor en la construcción uruguaya.",
      "Desde entonces, fuimos ampliando nuestra propuesta y desarrollando productos que permiten reducir tareas en obra, mejorar los tiempos de ejecución y brindar mayor previsibilidad a cada proyecto.",
      "Esa búsqueda permanente de soluciones nos llevó a especializarnos en productos de acero con mayor grado de elaboración, adaptados a las exigencias de constructoras, industrias y profesionales de todo el país.",
    ],
  },
  {
    title: "Soluciones pensadas para cada proyecto",
    paragraphs: [
      "Proveemos y elaboramos soluciones de acero para diferentes etapas de la construcción: mallas electrosoldadas, acero cortado y doblado, armaduras de pilotes, pasadores, barras de acero y otros productos destinados a mejorar la eficiencia y el desempeño de cada obra.",
      "Trabajamos junto a constructoras, ingenieros, arquitectos e industrias, acompañando proyectos de distintas escalas y complejidades.",
    ],
  },
  {
    title: "El valor del acero",
    paragraphs: [
      "Creemos que el verdadero valor del acero no está solamente en su resistencia, sino en todo lo que permite construir.",
      "Por eso seguimos incorporando tecnología, desarrollando nuevos productos y buscando formas más eficientes de acompañar a nuestros clientes.",
      "Porque cuando una solución mejora la productividad de una obra, también ayuda a impulsar el crecimiento de toda la construcción.",
    ],
  },
];

const sections = [
  { content: content[0], video: "/videos/13.mp4", reverse: false },
  { content: content[1], video: "/videos/home3.mp4", reverse: true },
  { content: content[2], video: "/videos/9.mp4", reverse: false },
];

export const About = () => {
  const sectionsRef = useRef([]);

  // HERO refs
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const gridImgRef = useRef(null);

  // Guardamos SOLO los triggers creados acá
  const pinTriggersRef = useRef([]);
  const lineTriggersRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.05, ease: "power3.out", delay: 0.12 }
        );
      }

      if (taglineRef.current) {
        gsap.fromTo(
          taglineRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", delay: 0.28 }
        );
      }

      if (gridImgRef.current) {
        // Revelado desde el centro: la imagen se descubre con un círculo
        // que crece desde el punto central hasta cubrirla por completo.
        gsap.fromTo(
          gridImgRef.current,
          { clipPath: "circle(0% at 50% 50%)", scale: 1.08 },
          {
            clipPath: "circle(75% at 50% 50%)",
            scale: 1,
            duration: 1.6,
            ease: "power3.inOut",
            delay: 0.35,
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Pin stacking (fix footer)
  useEffect(() => {
    pinTriggersRef.current.forEach((t) => t?.kill?.());
    pinTriggersRef.current = [];

    // En mobile no se pinea: las secciones scrollean normal, una tras otra
    if (window.innerWidth < 900) return;

    sectionsRef.current.forEach((sectionEl, idx) => {
      if (!sectionEl) return;

      // La última sección NO se pinea: scrollea normal y el footer la sigue
      // (evita el salto y el espacio negro variable antes del footer)
      const isLast = idx === sectionsRef.current.length - 1;
      if (isLast) return;

      const trigger = ScrollTrigger.create({
        trigger: sectionEl,
        start: "top top",
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        end: () => "+=" + Math.round(window.innerHeight),
        invalidateOnRefresh: true,
      });

      pinTriggersRef.current.push(trigger);
    });

    ScrollTrigger.refresh();

    return () => {
      pinTriggersRef.current.forEach((t) => t?.kill?.());
      pinTriggersRef.current = [];
    };
  }, []);

  useEffect(() => {
    // Reveal overlay líneas eliminado a pedido del usuario (texto fijo blanco)
  }, []);

  return (
    <section id="about" className="about">
      <NavBar />

      {/* HERO */}
      <header className="about-hero">
        {/* Marco de líneas que encapsula todo el hero */}
        <span className="about-hero__frameline about-hero__frameline--top" aria-hidden="true" />
        <span className="about-hero__frameline about-hero__frameline--v about-hero__frameline--v1" aria-hidden="true" />
        <span className="about-hero__frameline about-hero__frameline--v about-hero__frameline--v2" aria-hidden="true" />
        <span className="about-hero__frameline about-hero__frameline--v about-hero__frameline--v3" aria-hidden="true" />
        {/* Líneas de margen: llegan hasta la imagen grande cortando la divisoria final */}
        <span className="about-hero__frameline about-hero__frameline--margin about-hero__frameline--mleft" aria-hidden="true" />
        <span className="about-hero__frameline about-hero__frameline--margin about-hero__frameline--mright" aria-hidden="true" />

        <div className="about-hero__top">
          <h1 ref={titleRef} className="about-hero__headline">
            Acero que impulsa obras más eficientes
          </h1>

          <p ref={taglineRef} className="about-hero__subtext">
            Desde 2010 desarrollamos soluciones de acero de calidad certificada
            que ayudan a optimizar procesos, mejorar la productividad y generar
            más valor en cada proyecto. Trabajamos para entender las necesidades
            de cada proyecto y ofrecer soluciones que permitan simplificar
            procesos, optimizar recursos y mejorar la productividad en obra.
          </p>
        </div>

        {/* Imagen custom decorativa */}
        <div className="about-hero__gridDeco" aria-hidden="true">
          {/* Líneas horizontales: pasan por los lados de la imagen y llegan hasta la derecha */}
          <span className="about-hero__gridline about-hero__gridline--h about-hero__gridline--top" />
          <span className="about-hero__gridline about-hero__gridline--h about-hero__gridline--bottom" />
          {/* Puntos en los vértices recortados de la imagen */}
          <span className="about-hero__griddot about-hero__griddot--tl" />
          <span className="about-hero__griddot about-hero__griddot--br" />
          <div className="about-hero__gridImage">
            <img
              ref={gridImgRef}
              src="/images/sobre selllo.png"
              alt=""
              style={{ clipPath: "circle(0% at 50% 50%)", willChange: "clip-path, transform" }}
            />
          </div>
        </div>

        {/* Línea divisoria antes de la imagen grande */}
        <hr className="about-hero__divider" />

        <div className="about-hero__media">
          <img src="/images/aa.webp" alt="" />
        </div>
      </header>

      {/* NO TOCAR: videos abajo */}
      <div className="about-sub-section">
        {sections.map((section, index) => (
          <Box
            key={index}
            className="about-panel"
            ref={(el) => (sectionsRef.current[index] = el)}
            display="flex"
            // Mobile: siempre texto arriba y video abajo (las secciones "reverse"
            // tienen el video primero en el JSX, así que se invierte la columna)
            flexDirection={{ xs: section.reverse ? "column-reverse" : "column", md: "row" }}
            sx={{
              backgroundColor: "black",
              minHeight: { xs: "auto", md: "80vh" },
              justifyContent: "space-between",
              // El contenido (video incluido) termina en la línea de margen
              px: "var(--margin-x)",
              boxSizing: "border-box",
            }}
          >
            {!section.reverse && (
              <Box width={{ xs: "100%", md: "50%" }} fontSize={"25px"}>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={{ xs: "flex-start", md: "space-between" }}
                  height={{ sm: "60%", md: "70%", xl: "80%" }}
                  // Menos espacio arriba para que el título quede más centrado
                  paddingTop={{ xs: "16px", sm: "24px", md: "28px", xl: "36px" }}
                  paddingBottom={{ xs: "25px", sm: "50px", md: "60px", xl: "80px" }}
                  paddingX="calc(var(--headline-pad) - var(--margin-x))"
                >
                  <Typography
                    className="subtitle"
                    variant="h2"
                    fontSize={{ xs: "22px", md: "27px", xl: "36px" }}
                    sx={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {section.content.title}
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    {section.content.paragraphs.map((item, i) => (
                      <Typography
                        key={i}
                        component="p"
                        fontSize={{ xs: "18px", md: "24px", xl: "28px" }}
                        sx={{
                          color: "#fff",
                          lineHeight: 1.2,
                          marginBottom: "16px",
                          fontWeight: 300,
                          opacity: 0.9,
                          fontFamily: "Inter, sans-serif"
                        }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            <Box
              width={{ xs: "100%", md: "50%" }}
              height={{ xs: "350px", md: "760px" }}
              sx={{ overflow: "hidden" }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              >
                <source src={section.video} type="video/mp4" />
                Tu navegador no admite videos.
              </video>
            </Box>

            {section.reverse && (
              <Box width={{ xs: "100%", md: "50%" }} fontSize={"25px"}>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={{ xs: "flex-start", md: "space-between" }}
                  height={{ md: "70%", xl: "80%" }}
                  // Menos espacio arriba para que el título quede más centrado
                  paddingTop={{ xs: "16px", sm: "24px", md: "28px", xl: "36px" }}
                  paddingBottom={{ xs: "25px", sm: "50px", md: "60px", xl: "80px" }}
                  paddingX="calc(var(--headline-pad) - var(--margin-x))"
                >
                  <Typography
                    className="subtitle"
                    variant="h2"
                    fontSize={{ xs: "22px", md: "27px", xl: "36px" }}
                    sx={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {section.content.title}
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    {section.content.paragraphs.map((item, i) => (
                      <Typography
                        key={i}
                        component="p"
                        fontSize={{ xs: "18px", md: "24px", xl: "28px" }}
                        sx={{
                          color: "#fff",
                          lineHeight: 1.2,
                          marginBottom: "16px",
                          fontWeight: 300,
                          opacity: 0.9,
                          fontFamily: "Inter, sans-serif"
                        }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </div>

      {/* Línea final + espacio negro antes del footer */}
      <div className="about-footer-gap" aria-hidden="true" />

      <Footer />
    </section>
  );
};
