import React from "react";
import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

const mapUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.1781069733797!2d-56.2442349109211!3d-34.70068739278997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a1cd0dee1b74d7%3A0x9d3355e7c66adcd2!2sAcerospaisano%20S.A.!5e0!3m2!1ses-419!2suy!4v1776969216181!5m2!1ses-419!2suy";

export const Footer = () => {
  const location = useLocation();

  // Rutas directas de detalle de producto (sin el prefijo /productos)
  const productDetailSlugs = [
    "mallas-electrosoldadas",
    "mallas-plegadas",
    "mallas-galvanizadas",
    "hierro-cortado-y-doblado",
    "barras-conformadas",
    "barras-lisas",
    "armaduras-de-pilotes",
    "pasadores",
    "trelizas",
  ];

  const isLightView =
    location.pathname.includes("productos") ||
    location.pathname.includes("catalogo") ||
    location.pathname.includes("detalle") ||
    productDetailSlugs.some((slug) => location.pathname.includes(slug));

  const COLORS = {
    // En vistas claras el footer no pinta fondo propio: deja pasar el de la página
    canvasBg: isLightView ? "transparent" : "#000000",
    cardBg: isLightView ? "#FFFFFF" : "#121212",
    textPrimary: isLightView ? "#000000" : "#FFFFFF",
    textSecondary: isLightView ? "#707070" : "rgba(255,255,255,0.5)",
    accentRed: "#EE2737",
    accentOrange: "#EE2737",
    border: isLightView ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)",
  };

  // ✅ Inter para todos los textos normales (reemplaza Roboto)
  const sansFontFamily =
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  // ✅ Geist Mono se mantiene SOLO para labels / monospace
  const monoFontFamily =
    '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

  const monoStyle = {
    fontFamily: monoFontFamily,
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontWeight: 500,
    color: COLORS.textPrimary,
    transition: "color 0.3s ease",
  };

  const interBaseText = {
    fontFamily: sansFontFamily,
    color: COLORS.textPrimary,
  };

  /* ✅ mismos títulos (grisecitos, mismo tamaño) */
  const sectionTitleMonoSx = {
    ...monoStyle,
    color: COLORS.textSecondary,
    mb: 3,
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "0.14em",
  };

  /* ✅ hover rojo / active rojo */
  const footerLinkHover = {
    transition: "color 0.2s ease, opacity 0.2s ease",
    "&:hover": {
      color: COLORS.accentRed,
      opacity: 1,
    },
    "&:focus-visible": {
      color: COLORS.accentRed,
      outline: "none",
      opacity: 1,
    },
    "&:active": {
      color: COLORS.accentRed,
      opacity: 1,
    },
  };

  const NavLink = ({ to, children }) => (
    <Typography
      component={Link}
      to={to}
      sx={{
        ...interBaseText, // ✅ Inter
        display: "block",
        textDecoration: "none",
        mb: 1.2,
        fontSize: "15px",
        fontWeight: 400,
        lineHeight: 1.25,
        ...footerLinkHover,
      }}
    >
      {children}
    </Typography>
  );

  const videoWrapSx = {
    width: "220px",
    height: "220px",
    overflow: "hidden",
    position: "relative",
    isolation: "isolate",
    borderRadius: "26px",
    backgroundColor: COLORS.cardBg,
    ...(isLightView
      ? {
        WebkitMaskImage:
          "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 64%, rgba(0,0,0,0) 78%)",
        maskImage:
          "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 64%, rgba(0,0,0,0) 78%)",
      }
      : {
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 50% 50%, rgba(18,18,18,0) 55%, rgba(18,18,18,0.85) 100%)",
        },
      }),
  };

  const videoSx = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    backgroundColor: "transparent",
    transform: "translateZ(0)",
    willChange: "filter, opacity",
    ...(isLightView
      ? {
        mixBlendMode: "multiply",
        filter: "invert(1) grayscale(1) contrast(3.2) brightness(1.08)",
        opacity: 0.999,
      }
      : {
        mixBlendMode: "lighten",
        filter: "grayscale(1) contrast(1.05) brightness(0.98)",
        opacity: 0.72,
      }),
  };

  /* ✅ contactos con hover rojo y SIN negrita + Inter */
  const contactLinkSx = {
    ...interBaseText, // ✅ Inter
    display: "block",
    fontSize: "14px",
    textDecoration: "none",
    fontWeight: 400,
    lineHeight: 1.35,
    ...footerLinkHover,
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: COLORS.canvasBg,
        py: { xs: 2, md: 2 },
        transition: "background-color 0.6s ease",
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            bgcolor: COLORS.cardBg,
            borderRadius: { xs: "8px", md: "12px" },
            p: { xs: 3, sm: 4, md: 8, lg: 10 },
            boxShadow: isLightView
              ? "0 10px 40px rgba(0,0,0,0.03)"
              : "0 10px 40px rgba(0,0,0,0.5)",
            position: "relative",
            border: `1px solid ${COLORS.border}`,
            transition: "all 0.6s ease",
          }}
        >
          {/* TOP HEADER */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 8 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                bgcolor: COLORS.accentRed,
                borderRadius: "50%",
              }}
            />
            <Typography
              sx={{
                ...monoStyle, // ✅ Geist Mono
                fontSize: "12px",
                color: COLORS.textSecondary,
              }}
            >
              SISTEMA INDUSTRIAL ACEROS PAISANO / 2026
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* LADO IZQUIERDO */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  ...interBaseText,
                  fontSize: { xs: "2.05rem", sm: "2.55rem", md: "4.2rem" }, // 👈 achicado en mobile
                  fontWeight: 400,
                  lineHeight: { xs: 0.96, sm: 0.95, md: 0.95 },
                  letterSpacing: { xs: "-0.035em", md: "-0.05em" }, // 👈 menos agresivo en mobile
                  mb: { xs: 5, md: 6 },
                  transition: "color 0.4s ease",
                }}
              >
                Construyendo el futuro <br /> del acero en Uruguay
              </Typography>

              <Box sx={videoWrapSx}>
                <Box
                  component="video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                  sx={videoSx}
                >
                  <source src="/videos/Liquidlogo.mp4" type="video/mp4" />
                </Box>
              </Box>
            </Grid>

            {/* LADO DERECHO */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={4} sx={{ mb: 8 }}>
                <Grid item xs={6}>
                  <Typography sx={sectionTitleMonoSx}>Navegación</Typography>
                  <NavLink to="/">Inicio</NavLink>
                  <NavLink to="/sobre-nosotros">Sobre Nosotros</NavLink>
                  <NavLink to="/productos">Productos</NavLink>
                  <NavLink to="/contacto">Contacto</NavLink>
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={sectionTitleMonoSx}>Catálogo</Typography>
                  <NavLink to="/productos/mallas-electrosoldadas">
                    Mallas Electrosoldadas
                  </NavLink>
                  <NavLink to="/productos/mallas-plegadas">
                    Mallas Plegadas
                  </NavLink>
                  <NavLink to="/productos/hierro-cortado-y-doblado">
                    Hierro cortado y doblado
                  </NavLink>
                  <NavLink to="/productos/armaduras-de-pilotes">Armaduras de Pilotes</NavLink>
                  <NavLink to="/productos/pasadores">Pasadores</NavLink>
                  <NavLink to="/productos/trelizas">Trelizas</NavLink>
                  <NavLink to="/productos/barras-conformadas">Barras Conformadas</NavLink>
                  <NavLink to="/productos/barras-lisas">Barras Lisas</NavLink>
                </Grid>
              </Grid>

              {/* INFO CON LINKS DE CONTACTO */}
              <Grid
                container
                spacing={2}
                sx={{ pt: 4, borderTop: `1px solid ${COLORS.border}` }}
              >
                <Grid item xs={6}>
                  <Typography sx={sectionTitleMonoSx}>Contactos</Typography>

                  <Typography
                    component="a"
                    href="mailto:ventas@acerospaisano.com.uy"
                    sx={contactLinkSx}
                  >
                    ventas@acerospaisano.com.uy
                  </Typography>

                  <Typography
                    component="a"
                    href="https://wa.me/59899914939"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ ...contactLinkSx, mt: 0.5 }}
                  >
                    +598 99 914 939
                  </Typography>

                  <Typography
                    component="a"
                    href="tel:2365 0000"
                    sx={contactLinkSx}
                  >
                    2365 0000
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                  sx={{
                    textAlign: "right",
                    position: "relative",
                    cursor: "pointer",
                    "&:hover .map-popover": {
                      opacity: 1,
                      visibility: "visible",
                      transform: "translateY(0)",
                    },
                  }}
                >
                  <Typography variant="h1" sx={{ ...sectionTitleMonoSx, textAlign: "right" }}>
                    Planta Industrial
                  </Typography>

                  <Typography
                    sx={{
                      ...interBaseText, // ✅ Inter
                      fontSize: "13px",
                      color: COLORS.textSecondary,
                      lineHeight: 1.35,
                      mt: { xs: 1.5, md: 0 },
                      transition: "color 0.2s ease",
                      "&:hover": { color: COLORS.accentRed },
                    }}
                    variant="h1"
                  >
                    <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
                      Brigadier Gral. Fructuoso Rivera KM 25.500
                      <br />
                      15900 18 de Mayo, Departamento de Canelones
                    </Box>
                    <Box component="span" sx={{ display: { xs: "inline", md: "none" } }}>
                      Brig. Gral. F. Rivera KM 25.500
                      <br />
                      18 de Mayo, Canelones
                    </Box>
                  </Typography>

                  <Box
                    className="map-popover"
                    sx={{
                      position: "absolute",
                      bottom: "120%",
                      right: 0,
                      width: "300px",
                      height: "180px",
                      bgcolor: COLORS.cardBg,
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                      opacity: 0,
                      visibility: "hidden",
                      transform: "translateY(10px)",
                      transition: "all 0.4s ease",
                      border: `1px solid ${COLORS.border}`,
                      zIndex: 3,
                    }}
                  >
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="100%"
                      style={{
                        border: 0,
                        filter: isLightView
                          ? "grayscale(1)"
                          : "invert(1) grayscale(1)",
                      }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Mapa Aceros Paisano"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* BOTTOM ROW */}
          <Box
            sx={{
              mt: 12,
              pt: 4,
              borderTop: `1px solid ${COLORS.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 2,
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box
                sx={{
                  width: "50px",
                  height: "32px",
                  backgroundImage:
                    "url(https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Uruguay.svg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: isLightView
                    ? "grayscale(1) opacity(0.2)"
                    : "grayscale(1) brightness(2) opacity(0.3)",
                }}
              />
              <Box>
                <Typography
                  sx={{
                    ...monoStyle, // ✅ Geist Mono
                    color: COLORS.accentOrange,
                    fontSize: "13px",
                    lineHeight: 1.2,
                  }}
                >
                  FORJADO EN URUGUAY
                  <br />
                  PARA URUGUAY
                </Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
              <Typography
                sx={{
                  ...monoStyle, // ✅ Geist Mono
                  fontSize: "11px",
                  color: COLORS.textSecondary,
                }}
                variant="h2"
              >
                ©2026 ACEROS PAISANO S.A.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;