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
    title: "Misión",
    paragraphs: [
      "Nuestra misión es desarrollar una empresa sustentable, brindando productos metálicos de calidad certificada destinados a los sectores de la construcción, el agro y la industria.",
      "La sustentabilidad se obtiene a través de mejorar en forma continua el Sistema de Gestión, el Sistema de Seguridad y el Sistema Ambiental.",
    ],
  },
  {
    title: "Política de Gestión",
    paragraphs: [
      "Nuestro Sistema de Gestión se controla con la obtención y el mantenimiento de la certificación ISO 9001.",
      "Para mejorar continuamente se aplican los conceptos del Modelo de Mejora Continua del Instituto Nacional de Calidad.",
    ],
  },
  {
    title: "Política de Calidad",
    paragraphs: [
      "Nuestro Sistema de Calidad tiene como prioridades:",
      "- La obtención y el mantenimiento de la certificación de calidad de producto.",
      "- La venta de productos metálicos que cumplan los requisitos de las normas vigentes aplicables y las necesidades de nuestros clientes.",
    ],
  },
  {
    title: "Política de Seguridad",
    paragraphs: [
      "Nuestro Sistema de Seguridad se controla con la obtención y el mantenimiento de la certificación de la norma ISO 45001",
      "Nuestra principal política es que el operador debe detener el proceso si no se encuentra dentro de las condiciones estándares de seguridad, hasta asegurarse de la erradicación de la condición insegura.",
    ],
  },
  {
    title: "Política Ambiental",
    paragraphs: [
      "Nuestro Sistema de Protección del Medio Ambiente se controla con la obtención y el mantenimiento de la certificación de la norma ISO 14001.",
      "Nuestra política es realizar inversiones y orientar nuestras operaciones de acuerdo al concepto de tecnología limpia, de forma de prevenir y minimizar la generación de elementos contaminantes.",
    ],
  },
];

const sections = [
  { content: content[0], video: "/videos/13.mp4", reverse: false },
  { content: content[1], video: "/videos/home3.mp4", reverse: true },
  { content: content[2], video: "/videos/9.mp4", reverse: false },
  { content: content[3], video: "/videos/22.mp4", reverse: true },
  { content: content[4], video: "/videos/1.mp4", reverse: false },
];

export const About = () => {
  const sectionsRef = useRef([]);

  // HERO refs
  const titleRef = useRef(null);
  const taglineRef = useRef(null);

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
    });

    return () => ctx.revert();
  }, []);

  // Pin stacking (fix footer)
  useEffect(() => {
    pinTriggersRef.current.forEach((t) => t?.kill?.());
    pinTriggersRef.current = [];

    sectionsRef.current.forEach((sectionEl, idx) => {
      if (!sectionEl) return;

      const isLast = idx === sectionsRef.current.length - 1;

      const trigger = ScrollTrigger.create({
        trigger: sectionEl,
        start: "top top",
        pin: true,
        // Si es la última, damos espacio para que el footer no se solape
        pinSpacing: isLast,
        end: () =>
          "+=" + Math.round(window.innerHeight * (isLast ? 1.0 : 1)),
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
        <div className="about-hero__media" aria-hidden="true">
          <img src="/images/malla10.jpg" alt="" />
        </div>

        <div className="about-hero__overlay" aria-hidden="true" />

        <div className="about-hero__content">
          {/* Título grande top-left */}
          <div className="about-hero__titleWrap">
            <h1 ref={titleRef} className="about-hero__title">
              Sobre nosotros
            </h1>
          </div>

          {/* Frase inferior */}
          <div className="about-hero__taglineWrap">
            <div ref={taglineRef} className="about-hero__taglineInner">
              {/* Desktop / tablet */}
              <p className="about-hero__tagline about-hero__tagline--desktop">
                <span className="about-hero__taglineLine">
                  Forjamos <strong>acero de calidad certificada</strong> para impulsar
                </span>
                <span className="about-hero__taglineLine">
                  la construcción, el agro y la industria en <strong>Uruguay</strong>.
                </span>
              </p>

              {/* Mobile (3 líneas balanceadas para evitar corte raro) */}
              <p className="about-hero__tagline about-hero__tagline--mobile">
                <span className="about-hero__taglineLine">
                  Forjamos <strong>acero de calidad certificada</strong>
                </span>
                <span className="about-hero__taglineLine">
                  para impulsar la construcción, el agro y
                </span>
                <span className="about-hero__taglineLine">
                  la industria en <strong>Uruguay</strong>.
                </span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* NO TOCAR: videos abajo */}
      <div className="about-sub-section">
        {sections.map((section, index) => (
          <Box
            key={index}
            ref={(el) => (sectionsRef.current[index] = el)}
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            sx={{
              backgroundColor: "black",
              minHeight: { xs: "100vh", md: "80vh" },
              justifyContent: "space-between",
            }}
          >
            {!section.reverse && (
              <Box width={{ xs: "100%", md: "50%" }} fontSize={"25px"}>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={{ xs: "flex-start", md: "space-between" }}
                  height={{ sm: "60%", md: "70%", xl: "80%" }}
                  padding={{ xs: "25px", sm: "50px", md: "60px", xl: "80px" }}
                >
                  <Typography
                    className="subtitle"
                    variant="h3"
                    fontSize={{ xs: "25px", md: "30px", xl: "40px" }}
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
                          opacity: 0.9
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
                  padding={{ xs: "25px", sm: "50px", md: "60px", xl: "80px" }}
                >
                  <Typography
                    className="subtitle"
                    variant="h3"
                    fontSize={{ xs: "25px", md: "30px", xl: "40px" }}
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
                          opacity: 0.9
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

      <Footer />
    </section>
  );
};
