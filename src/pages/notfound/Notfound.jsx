import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        backgroundColor: "#000",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Contenedor principal */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "100dvh",
          boxSizing: "border-box",
          px: { xs: "16px", sm: "20px", md: "28px", lg: "36px" },
          py: { xs: "16px", sm: "18px", md: "20px" },
        }}
      >
        {/* =========================================================
            BLOQUE SUPERIOR (más hacia el centro, como la referencia)
           ========================================================= */}
        <Box
          sx={{
            position: "absolute",
            zIndex: 6,

            // Mobile: arriba izquierda
            top: { xs: "18px", sm: "18px", md: "70px" },
            left: {
              xs: "16px",
              sm: "20px",
              md: "58%", // desktop/tablet: mover hacia el centro-derecha
              lg: "58%",
            },
            right: "auto",

            width: {
              xs: "240px",
              sm: "250px",
              md: "220px",
              lg: "240px",
            },
            maxWidth: "42vw",
            textAlign: "left",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: { xs: "12px", md: "14px", lg: "16px" },
              fontWeight: 500,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "0.005em",
              mb: 1.25,
            }}
          >
            La estructura que buscás no está
            disponible ahora. Seguimos forjando
            una mejor experiencia.
          </Typography>

          <Button
            component={RouterLink}
            to="/contacto"
            endIcon={<ArrowDownwardIcon sx={{ fontSize: "13px !important" }} />}
            sx={{
              color: "#fff",
              textTransform: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: { xs: "12px", md: "12px", lg: "13px" },
              fontWeight: 400,
              p: 0,
              minWidth: "auto",
              borderRadius: 0,
              justifyContent: "flex-start",
              "& .MuiButton-endIcon": { ml: "4px" },
              "&:hover": {
                backgroundColor: "transparent",
                opacity: 0.8,
              },
            }}
          >
            Contactar asistencia
          </Button>

          {/* Línea fina tipo referencia */}
          <Box
            sx={{
              mt: 0.7,
              width: { xs: "96px", md: "150px", lg: "150px" },
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.45)",
            }}
          />
        </Box>

        {/* =========================================================
            404 (reducido para que no quede tan masivo)
           ========================================================= */}
        <Typography
          aria-hidden
          sx={{
            position: "absolute",
            zIndex: 2,
            userSelect: "none",
            pointerEvents: "none",
            whiteSpace: "nowrap",

            // En desktop queda centrado pero levemente hacia la izquierda
            left: { xs: "50%", md: "50%" },
            top: { xs: "44%", sm: "44%", md: "46%" },
            transform: "translate(-50%, -50%)",

            fontFamily: "Inter, sans-serif",
            fontWeight: 600,

            // ✅ Más chico que antes (más parecido a la 2da imagen)
            fontSize: {
              xs: "104px",
              sm: "118px",
              md: "190px",
              lg: "200px",
              xl: "220px",
            },

            lineHeight: 1,
            letterSpacing: "-0.045em",
            color: "#f1f1f1",
          }}
        >
          404
        </Typography>

        {/* =========================================================
            Título abajo izquierda (más compacto como referencia)
           ========================================================= */}
        <Box
          sx={{
            position: "absolute",
            zIndex: 5,
            left: { xs: "16px", sm: "20px", md: "28px", lg: "36px" },
            bottom: { xs: "18px", sm: "22px", md: "24px", lg: "28px" },
            maxWidth: { xs: "280px", sm: "320px", md: "420px", lg: "700px" },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,

              // ✅ Reducido respecto a tu versión anterior (que estaba muy grande)
              fontSize: {
                xs: "44px",
                sm: "52px",
                md: "54px",
                lg: "66px",
                xl: "120px",
              },

              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              color: "#fff",
            }}
          >
            Esta Escena
            No Existe
          </Typography>

          <Button
            component={RouterLink}
            to="/"
            sx={{
              mt: { xs: 1.6, md: 2.0 },
              color: "rgba(255,255,255,0.95)",
              textTransform: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: { xs: "12px", md: "12px", lg: "13px" },
              fontWeight: 400,
              p: 0,
              minWidth: "auto",
              borderRadius: 0,
              "&:hover": {
                backgroundColor: "transparent",
                opacity: 0.75,
              },
            }}
          >
            Volver al inicio
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
