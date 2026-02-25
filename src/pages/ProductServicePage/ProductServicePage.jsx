import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import '../../components/homeComponents/HomeModal.css';

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
      { "title": "Certificación", "content": " Certificadas bajo norma UNIT 845:1995.", "image": "/images/certificado1.jpg", "alt": "Construcción y Arquitectura" },
      { "title": "Garantía de calidad", "content": "Producción validada por ensayos en laboratorio.", "image": "/images/mallas3.jpg", "alt": "Industria Energética" },
      { "title": "Medidas estándar", "content": "Todos los diámetros encontrados en plaza.", "image": "/images/mallas4.jpg", "alt": "Manufactura Industrial" },
      { "title": "Presentación", "content": "Adapatable a las necesidades del proyecto civíl.", "image": "/images/mallas2.jpg", "alt": "Industria Agropecuaria" },
      { "title": "Diseño Especial", "content": "Soluciones a medida, personalizadas para proyectos específicos.", "image": "/images/mallas6.jpg", "alt": "Industria Agropecuaria" }
    ]
  },
  "barras-conformadas": {
    name: "Barras lisas y Conformadas",
    items: [
      { "title": "Certificación", "content": "Certificadas bajo normas UNIT 34:1995 Y UNIT 845:1995.", "image": "/images/barras.jpg", "alt": "Construcción y Arquitectura" },
      { "title": "Rendimiento y calidad", "content": "Procesos de calidad garantizada.", "image": "/images/barras1.jpg", "alt": "Industria Energética" },
      { "title": "Cero desperdicio", "content": "Barras cortadas a medida.", "image": "/images/barras2.jpg", "alt": "Manufactura Industrial" },
      { "title": "Maximización de recursos", "content": "Optimización de recursos en obra.", "image": "/images/barras3.jpg", "alt": "Ahorro" },
      { "title": "Logística optimizada", "content": "Traslado sencillo y seguro.", "image": "/images/barras5.jpg", "alt": "Industria Agropecuaria" }
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
            top: "16px",
            left: "16px",
            cursor: "pointer",
            color: "#999",
            fontSize: "2.5rem",
            fontWeight: "100",
            zIndex: 10001,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "rotate(90deg)",
              color: "#fff",
            }
          }}
        >
          ×
        </Box>

        {/* Product Title */}
        <Box sx={{
          paddingTop: "70px",
          paddingLeft: "12px",
          paddingRight: "12px",
          paddingBottom: "20px"
        }}>
          <Typography sx={{
            fontSize: "2rem",
            fontWeight: 500,
            color: "#fff",
            lineHeight: 1.2
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
              <Box sx={{ paddingLeft: "12px", paddingRight: "12px", width: "100%", boxSizing: "border-box" }}>
                <Typography sx={{
                  fontSize: "1.4rem",
                  color: "#fff",
                  lineHeight: 1.4,
                  fontWeight: 500
                }}>
                  {`0${index + 1}. ${item.content}`}
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
            <Box
              sx={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#EE2737",
                color: "#fff",
                textAlign: "center",
                borderRadius: "6px",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "#d61f1f",
                }
              }}
              onClick={() => navigate(`/${effectiveSlug}`)}
            >
              Ir al Producto
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop version
  return (
    <Box width={"100%"} height={"100vh"} sx={{ overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 0.98)', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      <div style={{ zIndex: 1000, position: 'relative', height: '100%' }}>
        {/* X Close Button */}
        <Box
          onClick={handleClose}
          sx={{
            position: "fixed",
            top: "40px",
            left: "40px",
            cursor: "pointer",
            color: "#999",
            fontSize: "3rem",
            fontWeight: "100",
            zIndex: 1001,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "rotate(90deg)",
              color: "#fff",
            }
          }}
        >
          ×
        </Box>

        <Box
          onClick={() => navigate(`/${effectiveSlug}`, window.scrollTo(0, 0))}
          sx={{
            position: "fixed",
            top: "40px",
            right: "40px",
            cursor: "pointer",
            color: "#999",
            fontSize: "3rem",
            fontWeight: "100",
            zIndex: 1001,
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#fff",
            }
          }}
        >
          Ir al producto
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
              justifyContent: 'center',
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
                  paddingBlock: { xs: "15px", md: "20px", xl: "25px" },
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
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: index === activeIndex ? '#fff' : '#666',
                    marginRight: '40px',
                    minWidth: '30px',
                    transition: 'color 0.3s ease',
                  }}
                >
                  0{index + 1}.
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h2"
                    className="modal-title"
                    sx={{
                      fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
                      fontWeight: 500,
                      marginBottom: '8px',
                      color: index === activeIndex ? '#fff' : '#999',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    className="modal-description"
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                      lineHeight: 1.5,
                      color: index === activeIndex ? '#ccc' : '#666',
                      maxWidth: '450px',
                      transition: 'color 0.3s ease',
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
            sx={{
              position: "relative",
              width: { xs: "0%", md: "45%", xl: "50%" },
              height: "100%",
              display: { xs: "none", md: "block" }
            }}
            className='images-container'
          >
            {productInfo.items.map((item, index) => (
              <Box key={index} className={`images image-${index}`} sx={{ opacity: index === 0 ? 1 : 0, position: 'absolute', width: '100%', height: '100%', transition: 'opacity 0.5s ease-in-out' }}>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.alt}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    transform: "translateY(-50%)",
                    width: "auto",
                    height: "60%",
                    maxWidth: "90%",
                    objectFit: "cover",
                    borderRadius: "8px",
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
