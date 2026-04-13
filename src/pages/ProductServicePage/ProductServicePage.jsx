import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import '../../components/homeComponents/HomeModal.css';
import ButtonHoverBg from '../../components/CustomButton/ButtonHoverBg';

const modalInfo = {
  "hierro-cortado-y-doblado": {
    name: "Hierro Cortado y Doblado",
    items: [
      { "title": "A Medida", "content": "Dimensiones precisas según necesidades del proyecto.", "image": "/images/doblado2.jpg", "alt": "Construcción y Arquitectura" },
      { "title": "Calidad", "content": "Procesos de calidad garantizada.", "image": "/images/doblado6.jpg", "alt": "Industria Energética" },
      { "title": "Cero Desperdicio", "content": "Trabajamos con rollos de alambrón que generan cero desperdicio.", "image": "/images/doblado4.jpg", "alt": "Manufactura Industrial" },
      { "title": "Ahorro", "content": "Economía de tiempo y mano de obra.", "image": "/images/doblado7.jpg", "alt": "Ahorro" },
      { "title": "Asistencia Técnica", "content": "Asesoramiento y seguimiento de obra por técnicos especializados.", "image": "/images/doblado5.jpg", "alt": "Industria Agropecuaria" }
    ]
  },
  "mallas-electrosoldadas": {
    name: "Mallas Electrosoldadas",
    items: [
      { "title": "Certificación", "content": "Certificadas bajo Norma UNIT 845:95.", "image": "/images/certificado1.jpg", "alt": "Construcción y Arquitectura" },
      { "title": "Garantía de calidad", "content": "Producción validada por ensayos de laboratorio.", "image": "/images/mallas3.jpg", "alt": "Industria Energética" },
      { "title": "Medidas estándar", "content": "Amplia gama de diámetros.", "image": "/images/mallas4.jpg", "alt": "Manufactura Industrial" },
      { "title": "Presentación", "content": "Adaptable a las necesidades del proyecto civil.", "image": "/images/mallas2.jpg", "alt": "Industria Agropecuaria" },
      { "title": "Diseño Especial", "content": "Soluciones a medida, personalizadas para proyectos específicos.", "image": "/images/mallas6.jpg", "alt": "Industria Agropecuaria" }
    ]
  },
  "barras-conformadas": {
    name: "Barras lisas y Conformadas",
    items: [
      { "title": "Certificación", "content": "Producidas bajo los estándares de las normas UNIT 843:95 y UNIT 34:95.", "image": "/images/barras3.webp", "alt": "Construcción y Arquitectura" },
      { "title": "Rendimiento y calidad", "content": "Procesos de calidad garantizada.", "image": "/images/barras1.jpg", "alt": "Industria Energética" },
      { "title": "Cero desperdicio", "content": "Superficie nervurada y soldable en todos los diámetros.", "image": "/images/barras2.jpg", "alt": "Manufactura Industrial" },
      { "title": "Maximización de recursos", "content": "Barras cortadas a medida.", "image": "/images/ACEROSPAISANO-115.webp", "alt": "Ahorro" },
      { "title": "Logística optimizada", "content": "Barras rectas en diámetros de 6.0mm hasta 32mm.", "image": "/images/barras5.jpg", "alt": "Industria Agropecuaria" }
    ]
  },
  "mallas-plegadas": {
    name: "Mallas Plegadas",
    items: [
      { "title": "Estandarización y confiabilidad", "content": "Combina las ventajas del cortado y doblado + mallas.", "image": "/images/plegada.jpg", "alt": "Construcción y Arquitectura" },
      { "title": "Alta precisión", "content": "Proceso industrializado con plegadora automatizada.", "image": "/images/plegada1.jpg", "alt": "Industria Energética" },
      { "title": "Optimización en obra", "content": "Elimina procesos manuales y mejora la productividad.", "image": "/images/plegada2.jpg", "alt": "Manufactura Industrial" },
      { "title": "Soluciones adaptables", "content": "Formatos versátiles para distintas necesidades constructivas.", "image": "/images/plegada3.jpg", "alt": "Industria Agropecuaria" },
      { "title": "Diseño optimizado", "content": "Adaptamos cada detalle a los requerimientos de la obra.", "image": "/images/plegada6.jpg", "alt": "Industria Agropecuaria" }
    ]
  }
};

const ProductServicePage = ({ serviceSlug, onClose }) => {
  const { slug } = useParams();
  const effectiveSlug = serviceSlug || slug;
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const imageContainerRef = useRef(null);
  const cursorLabelRef = useRef(null);
  const rafRef = useRef(null);

  const handleImageMouseMove = useCallback((e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const label = cursorLabelRef.current;
      const container = imageContainerRef.current;
      if (!label || !container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      label.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });
  }, []);

  const handleImageMouseEnter = useCallback(() => {
    const label = cursorLabelRef.current;
    if (label) label.style.opacity = '1';
  }, []);

  const handleImageMouseLeave = useCallback(() => {
    const label = cursorLabelRef.current;
    if (label) label.style.opacity = '0';
  }, []);

  const handleImageClick = useCallback(() => {
    navigate(`/${effectiveSlug}`);
    window.scrollTo(0, 0);
  }, [navigate, effectiveSlug]);

  const productInfo = modalInfo[effectiveSlug];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 960);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!productInfo && !onClose) {
      navigate('/');
      return;
    }

    // Scroll to top only if it's not a modal (or maybe always if it's full screen)
    if (!onClose) window.scrollTo(0, 0);

    if (!isMobile) {
      // Initial image state (only for desktop)
      const firstImage = document.querySelector(`.images.image-0`);
      if (firstImage) {
        firstImage.style.opacity = "1";
      }
    }

    // Manage body scroll
    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [effectiveSlug, navigate, productInfo, onClose, isMobile]);

  if (!productInfo) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  // Mobile version
  if (isMobile) {
    return (
      <Box
        width={"100%"}
        height={"100vh"}
        sx={{
          overflow: 'auto',
          overflowX: 'hidden',
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999
        }}
      >
        {/* X Close Button */}
        <Box
          onClick={handleClose}
          sx={{
            position: "fixed",
            top: "20px",
            left: "20px",
            cursor: "pointer",
            color: "#fff",
            fontSize: "2.2rem",
            fontWeight: "200",
            zIndex: 10001,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "rotate(90deg)",
            }
          }}
        >
          ×
        </Box>

        {/* Product Title */}
        <Box sx={{
          paddingTop: "120px", // Más margen para evitar que la X se pise con el título
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "20px"
        }}>
          <Typography sx={{
            fontSize: "2.2rem",
            fontWeight: 400, // Menos bold
            color: "#fff",
            lineHeight: 1.1,
            letterSpacing: "-0.03em"
          }}>
            {productInfo.name}
          </Typography>
        </Box>

        {/* Scrollable Content - imagen, texto con número, imagen, texto con número... */}
        <Box sx={{ paddingBottom: "20px", width: "100%", overflowX: "hidden" }}>
          {productInfo.items.map((item, index) => (
            <Box key={index} sx={{ marginBottom: "32px", width: "100%" }}>
              {/* Image */}
              <Box sx={{ paddingLeft: "12px", paddingRight: "12px", width: "100%", boxSizing: "border-box" }}>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.alt}
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "400px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    display: "block"
                  }}
                />
              </Box>

              {/* Número y texto principal */}
              <Box sx={{ paddingLeft: "24px", paddingRight: "24px", width: "100%", boxSizing: "border-box" }}>
                <Typography sx={{
                  fontSize: "1.4rem", // Un poco más chica
                  color: "#fff",
                  lineHeight: 1.3,
                  fontWeight: 300, // Ligera
                  opacity: 0.8
                }}>
                  <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: "0.9rem", marginRight: "10px", color: "#666" }}>
                    0{index + 1}
                  </span>
                  {item.content}
                </Typography>
              </Box>
            </Box>
          ))}

          {/* Go to Product Button at the end */}
          <Box sx={{
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingTop: "20px",
            paddingBottom: "40px"
          }}>
            <Link to={`/${effectiveSlug}`} style={{ textDecoration: "none", width: "100%" }} >
              <Typography
                sx={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "12px",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255, 255, 255, 0.75)",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "white",
                  },
                  lineHeight: 1,
                }}
              >
                Ir al Producto
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop version
  return (
    <Box width={"100%"} height={"100vh"} sx={{ overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 1)', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      <div style={{ zIndex: 1000, position: 'relative', height: '100%' }}>



        {/* X Close Button */}
        <Box
          onClick={handleClose}
          sx={{
            position: "fixed",
            top: "30px", // Posición limpia en la esquina
            right: "100px",
            cursor: "pointer",
            color: "#fff",
            fontSize: "2.5rem",
            fontWeight: "100",
            zIndex: 1001,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "rotate(90deg)",
            }
          }}
        >
          ×
        </Box>

        <Box display={"flex"} flexDirection={"row"} sx={{ height: '100%' }}>
          {/* Left Side - Text Content */}
          <Box
            className='industrias-container'
            sx={{
              height: '100%',
              width: { xs: '100%', md: '55%', xl: '50%' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              marginTop: { xs: '20px', md: '25px', xl: '35px' },
              paddingLeft: { xs: '40px', md: '100px', xl: '120px' },
              paddingRight: { xs: '40px', md: '40px', xl: '60px' },
              color: '#999',
              fontSize: '1.1rem',
              lineHeight: 1.5,
              position: 'relative',
              zIndex: 1000,
            }}
          >
            {productInfo.items.map((item, index) => (
              <Box
                key={index}
                className="modal-entry"
                onMouseEnter={() => {
                  setActiveIndex(index);
                  document.querySelectorAll('.images').forEach((img, i) => {
                    img.style.opacity = i === index ? "1" : "0";
                    img.style.transition = "opacity 0.5s ease-in-out";
                  });
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  paddingBlock: { xs: "15px", md: "20px", xl: "20px" },
                  width: "100%",
                  cursor: 'pointer',
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    ".number": { color: "#fff" },
                    ".modal-title": { color: "#fff" },
                    ".modal-description": { color: "#ccc" }
                  },
                }}
              >
                <Typography
                  className="number"
                  sx={{
                    fontSize: { md: '0.8rem', xl: '0.9rem' },
                    fontFamily: '"Geist Mono", monospace',
                    color: index === activeIndex ? '#fff' : '#222', // Muy apagado si no es activo
                    marginRight: '0px',
                    minWidth: '35px',
                    transition: 'color 0.4s ease',
                  }}
                >
                  0{index + 1}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    className="modal-description"
                    sx={{
                      fontSize: { md: '1.6rem', xl: '3.15rem' }, // Más chica y elegante
                      lineHeight: 0.95,
                      fontWeight: 400, // Extra light look
                      color: index === activeIndex ? '#fff' : '#303030ff',
                      maxWidth: '800px',
                      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      letterSpacing: '-0.04em'
                    }}
                  >
                    {item.content}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Right Side - Images Container */}
          <Box
            ref={imageContainerRef}
            onMouseMove={handleImageMouseMove}
            onMouseEnter={handleImageMouseEnter}
            onMouseLeave={handleImageMouseLeave}
            onClick={handleImageClick}
            sx={{
              position: "relative",
              width: { xs: "0%", md: "45%", xl: "50%" },
              height: "100%",
              display: { xs: "none", md: "block" },
              cursor: "none"
            }}
            className='images-container'
          >
            {/* Cursor-following label */}
            <Box
              ref={cursorLabelRef}
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: "translate(0px, 0px) translate(-50%, -50%)",
                willChange: "transform",
                pointerEvents: "none",
                zIndex: 1002,
                opacity: 0,
                transition: "opacity 0.25s ease",
                color: "#fff",
                fontSize: "11px",
                fontFamily: '"Geist Mono", monospace',
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.2)",
                whiteSpace: "nowrap"
              }}
            >
              Ir al producto
            </Box>

            {productInfo.items.map((item, index) => (
              <Box key={index} className={`images image-${index}`} sx={{ opacity: index === 0 ? 1 : 0, position: 'absolute', width: '100%', height: '100%', transition: 'opacity 0.6s ease-in-out' }}>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.alt}
                  sx={{
                    position: "absolute",
                    top: "60%",
                    right: { md: "60px", xl: "100px" },
                    transform: "translateY(-50%)",
                    width: "auto",
                    height: "60%",
                    maxWidth: "85%",
                    objectFit: "cover",
                    borderRadius: "4px",
                    boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
                    pointerEvents: "none"
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default ProductServicePage;
