import React, { useEffect, useMemo, useState, useCallback } from "react";
import "./HomeModal.css";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const modalInfo = {
  "Hierro Cortado y Doblado": [
    { title: "A Medida", content: "Dimensiones precisas según necesidades del proyecto.", image: "./images/doblado2.jpg", alt: "Construcción y Arquitectura" },
    { title: "Calidad", content: "Procesos de calidad garantizada.", image: "./images/doblado6.jpg", alt: "Industria Energética" },
    { title: "Cero Desperdicio", content: "Trabajamos con rollos de alambrón que generan cero desperdicio.", image: "./images/doblado4.jpg", alt: "Manufactura Industrial" },
    { title: "Ahorro", content: "Economía de tiempo y mano de obra.", image: "./images/doblado7.jpg", alt: "Ahorro" },
    { title: "Asistencia Técnica", content: "Asesoramiento y seguimiento de obra por técnicos especializados.", image: "./images/doblado5.jpg", alt: "Industria Agropecuaria" },
  ],
  "Mallas Electrosoldadas": [
    { title: "Certificación", content: "Certificadas bajo norma UNIT 845:1995.", image: "./images/certificado1.jpg", alt: "Construcción y Arquitectura" },
    { title: "Garantía de calidad", content: "Producción validada por ensayos en laboratorio.", image: "./images/mallas3.jpg", alt: "Industria Energética" },
    { title: "Medidas estándar", content: "Todos los diámetros encontrados en plaza.", image: "./images/mallas4.jpg", alt: "Manufactura Industrial" },
    { title: "Presentación", content: "Adapatable a las necesidades del proyecto civíl.", image: "./images/mallas2.jpg", alt: "Industria Agropecuaria" },
    { title: "Diseño Especial", content: "Soluciones a medida, personalizadas para proyectos específicos.", image: "./images/mallas6.jpg", alt: "Industria Agropecuaria" },
  ],
  "Barras lisas y Conformadas": [
    { title: "Certificación", content: "Certificadas bajo normas UNIT 34:1995 Y UNIT 845:1995.", image: "./images/barras3.webp", alt: "Construcción y Arquitectura" },
    { title: "Rendimiento y calidad", content: "Procesos de calidad garantizada.", image: "./images/barras1.jpg", alt: "Industria Energética" },
    { title: "Cero desperdicio", content: "Barras cortadas a medida.", image: "./images/barras2.jpg", alt: "Manufactura Industrial" },
    { title: "Maximización de recursos", content: "Optimización de recursos en obra.", image: "./images/ACEROSPAISANO-126.webp", alt: "Ahorro" },
    { title: "Logística optimizada", content: "Traslado sencillo y seguro.", image: "./images/barras5.jpg", alt: "Industria Agropecuaria" },
  ],
  "Mallas Plegadas": [
    { title: "Estandarización y confiabilidad", content: "Combina las ventajas del cortado y doblado + mallas.", image: "./images/plegada.jpg", alt: "Construcción y Arquitectura" },
    { title: "Alta precisión", content: "Proceso industrializado con plegadora automatizada.", image: "./images/plegada1.jpg", alt: "Industria Energética" },
    { title: "Optimización en obra", content: "Elimina procesos manuales y mejora la productividad.", image: "./images/plegada2.jpg", alt: "Manufactura Industrial" },
    { title: "Soluciones adaptables", content: "Formatos versátiles para distintas necesidades constructivas.", image: "./images/plegada3.jpg", alt: "Industria Agropecuaria" },
    { title: "Diseño optimizado", content: "Adaptamos cada detalle a los requerimientos de la obra.", image: "./images/plegada6.jpg", alt: "Industria Agropecuaria" },
  ],
};

export const HomeModal = ({ info, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeIndex, setActiveIndex] = useState(0);

  const data = useMemo(() => modalInfo[info] || [], [info]);
  const activeItem = data[activeIndex];

  useEffect(() => setActiveIndex(0), [info]);

  useEffect(() => {
    if (!isMobile) {
      // Get all containers
      const containers = document.querySelectorAll('.modal-entry');

      // Show the first image by default when the component mounts
      if (containers.length > 0) {
        const firstImage = document.querySelector(`.images.image-0`);
        if (firstImage) {
          firstImage.style.opacity = "1";
        }
      }

      // Set up event listeners for each container
      containers.forEach((container, index) => {
        container.addEventListener('mouseenter', () => {
          setActiveIndex(index);
          // Hide all images first
          document.querySelectorAll('.images').forEach(img => {
            img.style.opacity = "0";
          });

          // Show the current image
          const image = document.querySelector(`.images.image-${index}`);
          if (image) {
            image.style.opacity = "1";
            image.style.transition = "opacity 0.5s ease-in-out";
          }
        });
      });

      // Clean up event listeners on component unmount
      return () => {
        containers.forEach(container => {
          container.removeEventListener('mouseenter', () => { });
        });
      };
    }
  }, [isMobile]);

  useEffect(() => {
    // Manage body scroll when modal/route is open
    document.body.classList.add('no-scroll');

    // Clean up body scroll on component unmount
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleActivate = useCallback((idx) => setActiveIndex(idx), []);

  // Mobile version
  if (isMobile) {
    return (
      <Box
        width={"100%"}
        height={"100vh"}
        sx={{
          overflow: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999
        }}
      >
        {/* X Close Button */}
        <Box
          onClick={onClose}
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
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingBottom: "20px"
        }}>
          <Typography sx={{
            fontSize: "2rem",
            fontWeight: 500,
            color: "#fff",
            lineHeight: 1.2
          }}>
            {info}
          </Typography>
        </Box>

        {/* Scrollable Content - imagen, texto, imagen, texto... */}
        <Box sx={{ paddingBottom: "20px" }}>
          {modalInfo[info].map((item, index) => (
            <Box key={index} sx={{ marginBottom: "24px" }}>
              {/* Image */}
              <Box
                component="img"
                src={item.image}
                alt={item.alt}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "350px",
                  objectFit: "cover",
                  borderRadius: "0px",
                  marginBottom: "16px"
                }}
              />

              {/* Solo el texto principal del content */}
              <Box sx={{ paddingLeft: "16px", paddingRight: "16px", marginBottom: "8px" }}>
                <Typography sx={{
                  fontSize: "1rem",
                  color: "#ccc",
                  lineHeight: 1.5
                }}>
                  {item.content}
                </Typography>
              </Box>
            </Box>
          ))}

          {/* Go to Product Button at the end */}
          <Box sx={{
            paddingLeft: "16px",
            paddingRight: "16px",
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
              onClick={() => {
                window.location.href = "/productos";
              }}
            >
              Ir al Producto
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop version (original)
  return (
    <Box width={"100%"} height={"100vh"} sx={{ overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 0.98)' }}>
      <div style={{ zIndex: 1000, position: 'relative', height: '100%' }}>
        {/* X Close Button */}
        <Box
          onClick={onClose}
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
            {modalInfo[info].map((item, index) => (
              <Box
                key={index}
                className="modal-entry"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  paddingBlock: { xs: "15px", md: "20px", xl: "25px" },
                  width: "100%",
                  cursor: 'pointer',
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    ".number": {
                      color: "#fff",
                    },
                    ".modal-title": {
                      color: "#fff",
                    },
                    ".modal-description": {
                      color: "#ccc",
                    }
                  },
                }}
              >
                <Typography
                  className="number"
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: '#666',
                    marginRight: '40px',
                    minWidth: '30px',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {`0${index + 1}.`}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h2"
                    className="modal-title"
                    sx={{
                      fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
                      fontWeight: 500,
                      marginBottom: '8px',
                      color: '#fff',
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
                      color: '#999',
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
            {modalInfo[info].map((item, index) => (
              <Box key={index} className={`images image-${index}`} sx={{ opacity: 0, position: 'absolute', width: '100%', height: '100%' }}>
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
  )
}
