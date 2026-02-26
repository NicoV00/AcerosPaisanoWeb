import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { NavBar } from "../../components/navbar/navbar.jsx";
import { Footer } from "../../components/footer/Footer.jsx";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./CatalogueNew.css";

gsap.registerPlugin(ScrollTrigger);

const GridViewIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const ListViewIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const PdfIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 2.75h7.2L19.25 7.8V20a1.25 1.25 0 0 1-1.25 1.25H7A1.25 1.25 0 0 1 5.75 20V4A1.25 1.25 0 0 1 7 2.75Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M14 2.9V8h5.1" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8.25 16.25h7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8.25 13.25h5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export function CatalogueNew() {
  const [viewMode, setViewMode] = useState("grid");
  const [openExtended, setOpenExtended] = useState({});

  const navigate = useNavigate();
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const productsRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const products = useMemo(
    () => [
      {
        id: 1,
        slug: "mallas-electrosoldadas",
        code: "ME-001",
        category: "Mallas",
        title: "Mallas electrosoldadas",
        description: "Mallas electrosoldadas para hormigón certificadas bajo norma UNIT 845:1995.",
        extended:
          "Solución industrial para refuerzo: soldadura controlada, uniformidad dimensional y disponibilidad en medidas estándar para obra.",
        specs: "Espesor: 3.5mm – 5.5mm",
        availability: "Stock permanente",
        image: "/images/mallaElectrosoldada.webp",
        isPrimary: true,
        datasheet: "/pdf/mallas-electrosoldadas.pdf",
      },
      {
        id: 2,
        slug: "mallas-plegadas",
        code: "MP-002",
        category: "Mallas",
        title: "Mallas plegadas",
        description: "Prefabricación industrial para armaduras con plegadora automatizada.",
        extended:
          "Permite mejorar productividad, reducir tareas en obra y mantener precisión en geometrías repetitivas o a medida.",
        specs: "Adaptable a cualquier geometría",
        availability: "Bajo pedido",
        image: "/images/plegada.webp",
        isPrimary: true,
        datasheet: "/pdf/mallas-plegadas.pdf",
      },
      {
        id: 3,
        slug: "hierro-cortado-y-doblado",
        code: "HCD-003",
        category: "Servicios",
        title: "Hierro cortado y doblado",
        description: "Corte y doblado industrial de varillas de acero con precisión garantizada.",
        extended: "Optimización total del acero con desperdicio cero. Cada pieza se entrega identificada y lista para armar, reduciendo los tiempos de obra.",
        specs: "Diámetros: 6–32mm",
        availability: "Servicio disponible",
        image: "/images/cortadoYdoblado.webp",
        isPrimary: true,
      },
      {
        id: 4,
        slug: "barras-lisas",
        code: "BL-004",
        category: "Barras",
        title: "Barras lisas",
        description: "Barras de acero de alta calidad con superficie lisa, certificadas bajo normas UNIT.",
        specs: "Calidad: AL-220",
        availability: "Stock permanente",
        image: "/images/barrasLisas.webp",
      },
      {
        id: 5,
        slug: "barras-conformadas",
        code: "BC-005",
        category: "Barras",
        title: "Barras conformadas",
        description: "Barras de acero con superficie corrugada para máxima adherencia al hormigón.",
        specs: "Calidad: ADN-420",
        availability: "Stock permanente",
        image: "/images/barras.webp",
      },
      {
        id: 6,
        slug: "clavos",
        code: "CL-006",
        category: "Clavos",
        title: "Clavos de acero",
        description: "Clavos de acero de alta calidad para construcción y carpintería.",
        extended: "Fabricados con acero de primera calidad, garantizando resistencia y durabilidad en aplicaciones de construcción.",
        specs: 'Medidas: 2" y 2 1/2"',
        availability: "Stock permanente",
        image: "/images/clavos.webp",
        isPrimary: false,
      },
      {
        id: 7,
        slug: "alambre-recocido",
        code: "AR-007",
        category: "Alambres",
        title: "Alambre recocido",
        description: "Alambre recocido de alta calidad para aplicaciones múltiples en construcción.",
        extended: "Proceso de recocido que garantiza flexibilidad y resistencia, ideal para amarres y aplicaciones diversas en obra.",
        specs: "Calibres: ISWG 14, 16, 18",
        availability: "Stock permanente",
        image: "/images/alambrerecocido2.webp",
        isPrimary: false,
      },
    ],
    []
  );

  // Mobile siempre grid
  useEffect(() => {
    if (isMobile) setViewMode("grid");
  }, [isMobile]);

  // Animaciones clean
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: -6, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
        );
      }

      if (productsRef.current) {
        const items = productsRef.current.querySelectorAll(".product-item");
        gsap.fromTo(
          items,
          { y: 6, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.22,
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: { trigger: productsRef.current, start: "top 90%", once: true },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [viewMode]);

  const goToProduct = useCallback((slug) => navigate(`/${slug}`), [navigate]);

  const onCardKeyDown = (e, slug) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToProduct(slug);
    }
  };

  const onViewDetailsClick = (e, slug) => {
    e.stopPropagation();
    goToProduct(slug);
  };

  const onDatasheetClick = (e, href) => {
    e.stopPropagation();
    if (!href) return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const toggleExtended = (e, id) => {
    e.stopPropagation();
    setOpenExtended((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="catalogue-wrapper is-light" ref={containerRef}>
      <NavBar whiteBackground={true} />

      <section className="catalogue-header">
        <Container maxWidth="xl">
          <h1 ref={titleRef} className="catalogue-title">
            Catálogo
          </h1>
          <p className="catalogue-subtitle">Soluciones industriales en acero para construcción</p>
        </Container>
      </section>

      <Container maxWidth="xl" className="catalogue-container">
        {!isMobile && (
          <div className="view-controls">
            <div className="view-toggle" aria-label="Cambiar vista del catálogo">
              <button
                type="button"
                className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
              >
                <ListViewIcon />
                <span>List view</span>
              </button>
              <button
                type="button"
                className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
              >
                <GridViewIcon />
                <span>Grid view</span>
              </button>
            </div>
          </div>
        )}

        <div ref={productsRef} className={`products-container ${viewMode}`}>
          {products.map((p) => {
            const isOpen = !!openExtended[p.id];

            return (
              <article
                key={p.id}
                className="product-item"
                role="link"
                tabIndex={0}
                aria-label={`Ver ${p.title}`}
                onClick={() => goToProduct(p.slug)}
                onKeyDown={(e) => onCardKeyDown(e, p.slug)}
              >
                <div className="product-image-container">
                  <img src={p.image} alt={p.title} className="product-image" loading="lazy" />
                </div>

                <div className="product-content">
                  <div className="product-header">
                    <span className="pill pill-code">{p.code}</span>
                    <span className="pill pill-category">{p.category}</span>
                  </div>

                  <h3 className="product-title">{p.title}</h3>
                  <p className="product-description">{p.description}</p>

                  <div className="product-rows">
                    <div className="row">
                      <span className="row-label">Especificaciones</span>
                      <span className="row-value">{p.specs}</span>
                    </div>

                    {p.datasheet && (
                      <div className="row row-action datasheet" onClick={(e) => onDatasheetClick(e, p.datasheet)}>
                        <span className="row-label">Ficha técnica</span>
                        <span className="row-icon-btn pdf">
                          <PdfIcon />
                        </span>
                      </div>
                    )}

                    {p.isPrimary && (
                      <>
                        <div
                          className={`row row-action toggle ${isOpen ? "is-open" : ""}`}
                          onClick={(e) => toggleExtended(e, p.id)}
                        >
                          <span className="row-label">Descripción extendida</span>
                          <span className="toggle-x" aria-hidden="true" />
                        </div>

                        <div
                          id={`extended-${p.id}`}
                          className={`extended-panel ${isOpen ? "open" : ""}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="extended-text">{p.extended}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Stock + Ver detalles SIEMPRE MISMA FILA (también mobile) */}
                  <div className="product-bottom">
                    <span className="availability-badge">{p.availability}</span>

                    <button
                      type="button"
                      className="view-details-btn"
                      onClick={(e) => onViewDetailsClick(e, p.slug)}
                    >
                      Ver detalles <span className="arrow" aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>

      <Footer />
    </div>
  );
}

export default CatalogueNew;
