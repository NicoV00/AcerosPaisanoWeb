import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Container,
  useMediaQuery,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import { NavBar } from "../../../components/navbar/navbar.jsx";
import { Footer } from "../../components/footer/Footer.jsx";
import { products } from "../../data/productsData";
import gsap from "gsap";

/* =========================
   Styled components
   ========================= */

const PageContainer = styled(Box)(() => ({
  position: "relative",
  backgroundColor: "#000000",
  color: "#ffffff",
  minHeight: "100vh",
  overflowX: "hidden", // ✅ evita corrimientos horizontales
}));

const BackButton = styled(Button)(() => ({
  backgroundColor: "transparent",
  color: "#ffffff",
  textTransform: "none",
  borderRadius: "2px",
  padding: "8px 18px",
  fontWeight: 500,
  fontSize: "1rem",
  letterSpacing: "0.03em",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  transition: "all 0.25s ease",
  marginBottom: "24px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "#ffffff",
  },
}));

const ProductDetailContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgba(44, 44, 44, 0.35)",
  borderRadius: "4px",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "none",
  padding: "32px",
  minWidth: 0, // ✅ importante para evitar overflow en flex/grid internos
  [theme.breakpoints.down("md")]: {
    padding: "24px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
  },
}));

/* Header */
const BrandLogo = styled("img")(({ theme }) => ({
  height: "32px",
  width: "auto",
  marginRight: "16px",
  opacity: 0.9,
  flexShrink: 0,
  [theme.breakpoints.down("sm")]: {
    height: "22px",
    marginRight: "10px",
  },
}));

const ProductTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2.25rem",
  fontWeight: 500,
  color: "#e40000",
  letterSpacing: "0.04em",
  marginBottom: 0,
  fontFamily: "'Archivo', sans-serif",
  textShadow: "0 0 10px rgba(228, 0, 0, 0.35)",
  textTransform: "uppercase",
  lineHeight: 1.05,
  minWidth: 0,
  wordBreak: "break-word",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
    letterSpacing: "0.02em",
  },
}));

/* Gallery / slider (seguro en mobile) */
const GalleryWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  minWidth: 0,
  overflow: "hidden", // ✅ clave
  marginBottom: "18px",
}));

const MainImageFrame = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  borderRadius: "2px",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.02)",
  aspectRatio: "16 / 10",
  maxHeight: "520px",
  [theme.breakpoints.down("sm")]: {
    aspectRatio: "4 / 3",
    maxHeight: "320px",
  },
}));

const MainImage = styled("img")(() => ({
  width: "100%",
  height: "100%",
  objectFit: "contain", // ✅ si es PNG sin fondo / renders 3D, no recorta
  display: "block",
  background: "transparent",
}));

const GalleryNavButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 2,
  width: 34,
  height: 34,
  background: "rgba(0,0,0,0.55)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  "&:hover": {
    background: "rgba(0,0,0,0.75)",
  },
  [theme.breakpoints.down("sm")]: {
    width: 30,
    height: 30,
  },
}));

const ThumbsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "8px",
  marginTop: "10px",
  overflowX: "auto",
  overflowY: "hidden",
  WebkitOverflowScrolling: "touch",
  paddingBottom: "2px",
  minWidth: 0,
  "&::-webkit-scrollbar": {
    height: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255,255,255,0.18)",
    borderRadius: "999px",
  },
}));

const ThumbButton = styled("button")(({ active }) => ({
  flex: "0 0 auto",
  width: "72px",
  height: "54px",
  borderRadius: "2px",
  overflow: "hidden",
  border: active ? "1px solid rgba(228,0,0,0.9)" : "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.02)",
  padding: 0,
  cursor: "pointer",
}));

const ThumbImage = styled("img")(() => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
}));

/* Sections */
const SectionTitle = styled(Typography)(() => ({
  fontSize: "1.05rem",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#ffffff",
  marginBottom: "14px",
  marginTop: "28px",
  fontFamily: "'Inter', sans-serif",
}));

const DescriptionList = styled("ul")(() => ({
  listStyle: "none",
  padding: 0,
  margin: "0 0 24px 0",
  "& li": {
    position: "relative",
    paddingLeft: "20px",
    marginBottom: "10px",
    fontSize: "1rem",
    color: "#ffffff",
    lineHeight: 1.65,
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: "0.62em",
      width: "6px",
      height: "6px",
      backgroundColor: "#e40000",
      borderRadius: "50%",
    },
  },
}));

const PriceTag = styled(Typography)(({ theme }) => ({
  fontSize: "1.02rem",
  color: "#ffffff",
  fontWeight: 500,
  opacity: 0.9,
  marginTop: "4px",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.95rem",
  },
}));

/* Ficha técnica row (sin fondo + líneas grises a la derecha) */
const DatasheetRowButton = styled("button")(({ disabled }) => ({
  width: "100%",
  background: "transparent",
  border: "none",
  padding: "8px 0",
  margin: 0,
  color: "#fff",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: disabled ? "default" : "pointer",
  opacity: disabled ? 0.45 : 0.95,
  textAlign: "left",
}));

const DatasheetIconWrap = styled(Box)(() => ({
  width: 18,
  height: 18,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}));

const DatasheetLabel = styled(Typography)(() => ({
  fontSize: "0.92rem",
  fontWeight: 500,
  letterSpacing: "0.03em",
  color: "rgba(255,255,255,0.96)",
  whiteSpace: "nowrap",
  flexShrink: 0,
}));

const DatasheetMeta = styled(Typography)(() => ({
  fontSize: "0.82rem",
  color: "rgba(255,255,255,0.58)",
  marginLeft: "2px",
  whiteSpace: "nowrap",
  flexShrink: 0,
}));

const DatasheetRightLines = styled(Box)(() => ({
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  minWidth: 56,
  height: 12, // ✅ más chica en altura
  "& span": {
    display: "block",
    height: "1px",
    background: "rgba(255,255,255,0.22)",
    borderRadius: "999px",
  },
  "& span:nth-of-type(1)": { width: 10 },
  "& span:nth-of-type(2)": { width: 18 },
  "& span:nth-of-type(3)": { width: 28 },
}));

const ContactButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#e40000",
  color: "#ffffff",
  textTransform: "none",
  borderRadius: "2px",
  padding: "12px 32px",
  fontWeight: 500,
  fontSize: "1.05rem",
  letterSpacing: "0.03em",
  boxShadow: "none",
  transition: "background-color 0.25s ease",
  marginTop: "24px",
  width: "100%",
  maxWidth: "400px",
  "&:hover": {
    backgroundColor: "#ff2222",
    boxShadow: "none",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.98rem",
    padding: "12px 18px",
  },
}));

/* Icons */
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
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

/* =========================
   Component
   ========================= */

export function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Find product by slug or id
  const product = products.find((p) => p.slug === productId || p.id?.toString() === productId);

  const normalizedDescription = useMemo(() => {
    if (!product?.description) return [];
    return Array.isArray(product.description) ? product.description : [product.description];
  }, [product]);

  // soporte flexible para ficha técnica
  const datasheetHref =
    product?.datasheet || product?.pdf || product?.fichaTecnica || product?.technicalSheet || "";

  // soporte flexible para imágenes / galería
  const productImages = useMemo(() => {
    if (!product) return [];

    // Prioridad: gallery/images/detailImages
    const raw =
      product.gallery ||
      product.images ||
      product.detailImages ||
      (product.image ? [product.image] : []);

    const cleaned = (Array.isArray(raw) ? raw : [raw]).filter(Boolean);

    // Evitar duplicados
    return [...new Set(cleaned)];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [productId]);

  useEffect(() => {
    window.scrollTo(0, 0);

    gsap.fromTo(
      ".product-detail-content",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", stagger: 0.05, delay: 0.08 }
    );
  }, [productId]);

  const goPrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const goNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const onDatasheetClick = (e) => {
    e.stopPropagation();
    if (!datasheetHref) return;
    window.open(datasheetHref, "_blank", "noopener,noreferrer");
  };

  if (!product) {
    return (
      <PageContainer>
        <NavBar />

        <Container
          maxWidth="lg"
          sx={{
            pt: { xs: 15, md: 20 },
            pb: 8,
            minHeight: "60vh",
            px: { xs: "16px", sm: 3, md: 4 }, // ✅ 16px mobile
          }}
        >
          <BackButton startIcon={<ArrowLeftIcon />} onClick={() => navigate("/productos-y-servicios")}>
            Volver al catálogo
          </BackButton>

          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="h3" sx={{ color: "#e40000", mb: 2 }}>
              Producto no encontrado
            </Typography>
            <Typography sx={{ color: "#ffffff", opacity: 0.7 }}>
              El producto que buscas no existe o ha sido removido.
            </Typography>
          </Box>
        </Container>

        <Footer />
      </PageContainer>
    );
  }

  const activeImage = productImages[activeImageIndex] || product.image;

  return (
    <PageContainer>
      <NavBar />

      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 15, md: 20 },
          pb: { xs: 6, md: 8 },
          px: { xs: "16px", sm: 3, md: 4 }, // ✅ 16px en mobile
          overflow: "hidden", // ✅ extra safety
        }}
      >
        <BackButton
          startIcon={<ArrowLeftIcon />}
          onClick={() => navigate("/productos-y-servicios")}
          className="product-detail-content"
        >
          Volver al catálogo
        </BackButton>

        <ProductDetailContainer className="product-detail-content">
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.5 },
              mb: 2.5,
              minWidth: 0,
              flexWrap: "nowrap",
            }}
          >
            <BrandLogo src="/images/paisanologo.png" alt="Aceros Paisano" />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <ProductTitle variant="h1">{product.title}</ProductTitle>
            </Box>
          </Box>

          {/* Gallery / Image */}
          <GalleryWrapper>
            <MainImageFrame>
              {productImages.length > 1 && (
                <>
                  <GalleryNavButton
                    onClick={goPrevImage}
                    aria-label="Imagen anterior"
                    sx={{ left: { xs: 6, sm: 10 } }}
                  >
                    <ChevronLeftIcon />
                  </GalleryNavButton>

                  <GalleryNavButton
                    onClick={goNextImage}
                    aria-label="Siguiente imagen"
                    sx={{ right: { xs: 6, sm: 10 } }}
                  >
                    <ChevronRightIcon />
                  </GalleryNavButton>
                </>
              )}

              <MainImage src={activeImage} alt={product.title} />
            </MainImageFrame>

            {productImages.length > 1 && (
              <ThumbsRow>
                {productImages.map((img, i) => (
                  <ThumbButton
                    key={`${img}-${i}`}
                    type="button"
                    active={i === activeImageIndex ? 1 : 0}
                    onClick={() => setActiveImageIndex(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                    aria-pressed={i === activeImageIndex}
                  >
                    <ThumbImage src={img} alt={`${product.title} ${i + 1}`} />
                  </ThumbButton>
                ))}
              </ThumbsRow>
            )}
          </GalleryWrapper>

          {/* Price */}
          {product.price && <PriceTag>{product.price}</PriceTag>}

          {/* TEMPORALMENTE OCULTO - Ficha técnica
          <SectionTitle sx={{ mt: product.price ? 3 : 1 }}>Ficha técnica</SectionTitle>

          <DatasheetRowButton
            type="button"
            onClick={onDatasheetClick}
            disabled={!datasheetHref}
            aria-label={datasheetHref ? "Abrir ficha técnica PDF" : "Ficha técnica no disponible"}
          >
            <DatasheetIconWrap>
              <PdfIcon />
            </DatasheetIconWrap>

            <DatasheetLabel>Ficha técnica</DatasheetLabel>

            <DatasheetMeta>
              {datasheetHref ? "PDF" : "No disponible"}
            </DatasheetMeta>

            <DatasheetRightLines aria-hidden="true">
              <span />
              <span />
              <span />
            </DatasheetRightLines>
          </DatasheetRowButton>
          */}

          {/* Description */}
          <SectionTitle>Características</SectionTitle>
          <DescriptionList>
            {normalizedDescription.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </DescriptionList>

          {/* Extra Info */}
          {product.extraInfo && (
            <>
              <SectionTitle>Información adicional</SectionTitle>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.98rem",
                  lineHeight: 1.7,
                  color: "#d0d0d0",
                  whiteSpace: "pre-line",
                  fontWeight: 300,
                  letterSpacing: "0.01em",
                  marginBottom: "24px",
                }}
              >
                {product.extraInfo}
              </Typography>
            </>
          )}

          {/* Contact Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <ContactButton component={Link} to="/contacto">
              Solicitar información
            </ContactButton>
          </Box>
        </ProductDetailContainer>
      </Container>

      <Footer />
    </PageContainer>
  );
}

export default ProductDetail;
