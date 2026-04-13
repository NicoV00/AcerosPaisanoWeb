import React, { useEffect, useRef, useState } from 'react';
import {
  Typography,
  Box,
  Modal,
  Container,
  useMediaQuery,
  IconButton,
  Fade,
  Paper,
  Button
} from "@mui/material";
import { useTheme, styled, alpha } from '@mui/material/styles';
import { NavBar } from "../../components/navbar/navbar.jsx";
import { Footer } from '../../components/footer/Footer.jsx';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Styled components
const GridViewIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" stroke="currentColor" strokeWidth="0">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ListViewIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Main container
const CatalogueContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#000000',
  color: '#ffffff',
  minHeight: '100vh',
  overflow: 'hidden',
}));

// Toggle button group
const ViewToggleButton = styled(Button)(({ theme, active }) => ({
  minWidth: 'auto',
  borderRadius: '4px',
  padding: '6px 14px',
  fontWeight: 400,
  fontSize: '0.85rem',
  letterSpacing: '0.03em',
  backgroundColor: active ? '#ffffff' : 'transparent',
  color: active ? '#000000' : '#ffffff',
  border: `1px solid ${active ? '#ffffff' : '#333333'}`,
  transition: 'all 0.25s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '&:hover': {
    backgroundColor: active ? '#ffffff' : alpha('#ffffff', 0.1),
    color: active ? '#000000' : '#ffffff',
    borderColor: '#ffffff',
  },
}));

// Product container
const ProductContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 0,
  overflow: 'hidden',
  height: '100%',
  position: 'relative',
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  border: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: 'none',
  padding: '16px 0',
  marginBottom: '25px',
  '&:hover': {
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    transform: 'translateY(-4px)',
  },
}));

const ProductContainerList = styled(ProductContainer)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  padding: '24px 0',
  marginBottom: '35px',
  '&:hover': {
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    transform: 'translateY(0)',
  }
}));

//image styling
const ProductImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '240px',
  objectFit: 'cover',
  transition: 'opacity 0.3s ease',
  borderRadius: '1px',
}));

const ProductImageList = styled(ProductImage)(({ theme }) => ({
  width: '25%',
  height: 'auto',
  marginRight: '24px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '200px',
    marginRight: 0,
    marginBottom: '16px'
  }
}));

// Content container
const ProductContent = styled(Box)(({ theme }) => ({
  padding: '16px 8px 8px 8px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: 1,
  gap: '8px',
}));

// Logo styling
const BrandLogo = styled('img')(({ theme }) => ({
  height: '24px',
  width: 'auto',
  marginRight: '12px',
  opacity: 0.9,
}));

const ProductTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.40rem',
  fontWeight: 500,
  color: '#e40000',
  letterSpacing: '0.04em',
  marginBottom: '10px',
  fontFamily: "'Archivo', sans-serif",
  textShadow: '0 0 10px rgba(228, 0, 0, 0.4)',
  textTransform: 'uppercase', // Changed to uppercase
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.3rem',
  }
}));

// Description list
const DescriptionList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: 0,
  margin: '0 0 16px 0',
  '& li': {
    position: 'relative',
    paddingLeft: '22px',
    marginBottom: '8px',
    fontSize: '1.05rem',
    color: '#ffffff',
    lineHeight: 1.5,
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '0.6em',
      width: '7px',
      height: '7px',
      backgroundColor: '#e40000',
      borderRadius: '50%',
    }
  }
}));

// Footer area with price and action button
const ProductFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '16px',
}));

// price display
const PriceTag = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  color: '#ffffff',
  fontWeight: 500,
  opacity: 0.9,
}));

// Minimalist action button
const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#e40000',
  color: '#ffffff',
  textTransform: 'none',
  borderRadius: '2px',
  padding: '8px 18px',
  fontWeight: 500,
  fontSize: '1rem',
  letterSpacing: '0.03em',
  boxShadow: 'none',
  transition: 'background-color 0.25s ease',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: '#ff2222',
    boxShadow: 'none',
  }
}));

// Modal styling
const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'auto', // Added overflow auto for scrolling
  [theme.breakpoints.down('sm')]: {
    alignItems: 'flex-start',
  }
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: '#0a0a0a',
  color: '#ffffff',
  borderRadius: '4px',
  width: '90%',
  maxWidth: '1000px',
  maxHeight: '90vh',
  overflow: 'auto',
  outline: 'none',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.05)', // Track styling
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.2)', // Thumb styling
    borderRadius: '4px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '100vh',
    maxHeight: '100vh',
    borderRadius: 0,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  }
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  paddingBottom: '16px',
  marginBottom: '4px',
  position: 'relative',
}));

const ModalTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 500,
  color: '#e40000',
  letterSpacing: '0.01em',
  fontFamily: "'Archivo', sans-serif",
  textAlign: 'center',
  textShadow: '0 0 10px rgba(228, 0, 0, 0.3)',
  textTransform: 'uppercase', // Changed to uppercase
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  }
}));

const ModalBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '32px',
  overflow: 'auto',
  flex: '1 1 auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.05)', // Track styling
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.2)', // Thumb styling
    borderRadius: '4px',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: '24px',
  }
}));

const ModalImageContainer = styled(Box)(({ theme }) => ({
  flex: '0 0 40%',
  [theme.breakpoints.down('md')]: {
    flex: 'none',
    maxHeight: isMobile => isMobile ? '30vh' : 'auto',
  }
}));

const ModalImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  borderRadius: '2px',
  [theme.breakpoints.down('sm')]: {
    maxHeight: '30vh',
  }
}));

const ModalTextContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto', // Ensure text content is scrollable
  display: 'flex',
  flexDirection: 'column',
  '&::-webkit-scrollbar': {
    width: '8px', // Show scrollbar with width
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.05)', // Track styling
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.2)', // Thumb styling
    borderRadius: '4px',
  },
  [theme.breakpoints.down('sm')]: {
    maxHeight: '40vh',
    flex: '1 1 auto',
  }
}));

const ModalSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#ffffff',
  marginBottom: '12px',
  fontFamily: "'Inter', sans-serif",
}));

const ModalFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    marginTop: 'auto',
    paddingBottom: '12px'
  }
}));

// Main component
export function Catalogue() {
  const [viewMode, setViewMode] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const filtersRef = useRef(null);
  const titleRef = useRef(null);
  const containerRef = useRef(null);

  // Responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  // Products data
  const products = [
    {
      id: 1,
      title: 'Malla Electrosoldada',
      description: [
        'Mallas electrosoldadas para hormigón certificadas bajo norma UNIT 845:1995',
        'Medidas estándar de 600x240cm en stock',
        'Medidas especiales a pedido',
        '3.5mm en 15x15cm en rollos de 50m',
        '3.5mm en 20x20cm en rollos de 50m',
        '4.2mm en 15x15cm  en paños de 600x245cm',
        '4.2mm en 15x15cm en rollos de 25m',
        '4.2mm en 15x15cm en rollos de 50m',
        '5.5mm en 15x15cm en paños de 600x245cm',
        'Todos los diámetros, combinados de hasta 12+12 mm',
        'Presentación en paños y rollos',
        'Diseño de mallas especiales adaptadas a los requerimientos del proyecto',
        'Largos especiales que evitan empalmes y minimizan desperdicios',
        'Bigotes y entramados especiales con largos de hasta 12m',
        'Atillado de paquetes identificados con etiquetas',
        'Cortado de mallas a medida con guillotina',
        'Entrega del material de acuerdo al cronograma',
        'Controles de carga y descarga en obra mediante planillas',
        'Asistencia técnica permanente'
      ],
      extraInfo: 'Las mallas electrosoldadas son fundamentales para reforzar estructuras de hormigón. Nuestra capacidad de fabricarlas a medida permite optimizar el uso de material, reducir desperdicios y acelerar los procesos constructivos.',
      price: 'Entregas a todo el País',
      image: './images/mallaElectrosoldada.jpg',
      showModal: true
    },
    {
      id: 2,
      title: 'Malla Plegada',
      description: [
        'Combina las ventajas del cortado y doblado + mallas',
        'Diseños a medida con alta precisión',
        'Proceso industrializado con plegadora automatizada',
        'Optimiza el uso de hierro en obra',
        'Evita empalmes y atado manual',
        'Evita el armado de estructuras en obra',
        'Refuerzos de borde',
        'Entrega del material de acuerdo al cronograma',
        'Controles de carga y descarga en obra mediante planillas',
        'Asistencia técnica permanente'
      ],
      extraInfo: 'Las mallas plegadas representan un avance significativo en la prefabricación de armaduras para hormigón, reduciendo tiempos de obra y garantizando mayor precisión estructural.',
      price: 'Entregas a todo el País',
      image: './images/plegada.jpg',
      showModal: true
    },
    {
      id: 3,
      title: 'Varillas de hierro liso',
      description: [
        'Barras de acero de alta calidad con superficie lisa',
        'Certificadas bajo normas UNIT 34:1995 y UNIT 845:1995',
        'Barras cortadas a medida',
        'Facilidad en el transporte',
        'Optimización de recursos en obra',
      ],
      price: 'Entregas a todo el País',
      image: './images/barrasLisas.jpg',
      showModal: false
    },
    {
      id: 4,
      title: 'Varillas de hierro conformado',
      description: [
        'Barras de acero de alta calidad con textura rugosa',
        'Certificadas bajo normas UNIT 34:1995 y UNIT 845:1995',
        'Barras cortadas a medida',
        'Facilidad en el transporte',
        'Optimización de recursos en obra',
      ],
      price: 'Entregas a todo el País',
      image: './images/barras3.webp',
      showModal: false
    },
    {
      id: 5,
      title: 'Hierro Cortado y Doblado',
      description: [
        'Sistema industrial de corte y doblado de varillas de acero',
        'Permite cumplir con las especificaciones del proyecto',
        'Procesos de calidad garantizada',
        'Pedidos diseñados y validados en software especializado',
        'Pedidos identificados con colores por elemento estructural',
        'Entrega del pedido en paquetes identificados con doble etiquetado',
        'Diagramas y guías de armado en obra a petición',
        'Todos los diámetros y dimensiones',
        'Aseroramiento y segumiento de obra por técnicos especializados',
      ],
      extraInfo: 'Ventajas para nuestros clientes:\n• Cero desperdicio de acero\n• Economía de tiempo y mano de obra\n• Dimensiones precisas según necesidades del proyecto\n• Identificación de los paquetes facilitando su uso y armado\n• Entrega del material de acuerdo al cronograma\n• Controles de carga y descarga en obra mediante planillas\n• Asistencia técnica permanente',
      price: 'Entregas a Todo el País',
      image: './images/cortadoYdoblado.jpg',
      showModal: true
    },
    {
      id: 6,
      title: 'Clavos de Acero',
      description: [
        'Clavos de acero de 2" y 2 1/2"',
      ],
      price: 'Entregas a todo el País',
      image: './images/clavos.jpg',
      showModal: false
    },
    {
      id: 7,
      title: 'Alambres Recocidos',
      description: [
        'Alambres Recocidos, ISWG 14, ISWG 16, ISWG 18',
      ],
      price: 'Entregas a todo el país',
      image: './images/alambrerecocido2.jpg',
      showModal: false
    },
  ];

  // Force grid view on mobile
  useEffect(() => {
    if (isMobile) {
      setViewMode('grid');
    }
  }, [isMobile]);

  // Calcular el tamaño de fuente responsivo para el título
  const getHeadingFontSize = () => {
    if (isMobile) return "50px";
    if (isTablet) return "70px";
    return "100px";
  };

  // GSAP animations
  useEffect(() => {
    // Aplicar animación al título como en ContactComponent
    const tl = gsap.timeline({ delay: 0.5 });
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 0, opacity: 0 },
        { y: isMobile ? "50px" : isTablet ? "150px" : "180px", opacity: 1, duration: 1.5, ease: "power3.out" }
      );
    }

    // Pin the filters section for scrolling effect
    const trigger = ScrollTrigger.create({
      trigger: filtersRef.current,
      start: "top 10px",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
    });

    return () => {
      trigger.kill();
    };
  }, [isMobile, isTablet]);

  // Modal handlers
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    // Reset scroll position when opening modal
    setTimeout(() => {
      const modalContent = document.querySelector('.modal-content');
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    }, 50);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <CatalogueContainer>
      <NavBar />

      {/* Title Section */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          pt: { xs: 60, md: 80 },
          pb: { xs: 0, md: 0 }
        }}
      >
        <Box
          position="absolute"
          zIndex={0}
          sx={{
            top: isMobile ? "2%" : "10%",
            left: 0,
            width: "100%",
            textAlign: isMobile ? "center" : "left",
            paddingLeft: isMobile ? 0 : "20px"
          }}
        >
          <Typography
            ref={titleRef}
            variant="h2"
            fontSize={getHeadingFontSize()}
            fontFamily="'Archivo', sans-serif"
            fontWeight={400}
            color="#fff"
            sx={{
              textShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
              letterSpacing: "2px",
              textTransform: "uppercase"
            }}
          >
            Productos y Servicios
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Container
        ref={containerRef}
        maxWidth="xl"
        sx={{
          position: 'relative',
          mt: { xs: -25, md: -25 }, // Valores negativos para acercar más al título
          pb: { xs: 6, md: 8 },
          px: { xs: 2, md: 4 }
        }}
      >
        {/* View Toggle and Filters - fixed position */}
        <Box
          ref={filtersRef}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: 3,
            gap: 1,
            py: 1,
            position: 'sticky',
            top: '10px',
            zIndex: 5,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            borderRadius: '4px',
            px: 1
          }}
        >
          {!isMobile && (
            <>
              <ViewToggleButton
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                <GridViewIcon />
                <span>Grid View</span>
              </ViewToggleButton>
              <ViewToggleButton
                active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                <ListViewIcon />
                <span>List View</span>
              </ViewToggleButton>
            </>
          )}
        </Box>

        {/* Products Grid/List */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: viewMode === 'list' ? '1fr' : 'repeat(2, 1fr)',
              md: viewMode === 'list' ? '1fr' : 'repeat(3, 1fr)',
            },
            gap: viewMode === 'list' ? '20px' : '36px 24px',
            width: '100%',
          }}
        >
          {products.map((product) => (
            viewMode === 'list' ? (
              // List View
              <ProductContainerList
                key={product.id}
                className="product-item"
                elevation={0}
              >
                <ProductImageList
                  src={product.image}
                  alt={product.title}
                />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1
                  }}>
                    <BrandLogo
                      src='./images/paisanologo.png'
                      alt="Aceros Paisano"
                    />
                    <ProductTitle variant="h3">
                      {product.title}
                    </ProductTitle>
                  </Box>

                  <DescriptionList>
                    {product.description.slice(0, 4).map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </DescriptionList>

                  <ProductFooter>
                    <PriceTag>{product.price}</PriceTag>
                    {product.showModal && (
                      <ActionButton
                        variant="contained"
                        onClick={() => handleOpenModal(product)}
                        disableElevation
                      >
                        Ver más
                      </ActionButton>
                    )}
                  </ProductFooter>
                </Box>
              </ProductContainerList>
            ) : (
              // Grid View
              <ProductContainer
                key={product.id}
                className="product-item"
                elevation={0}
              >
                <ProductImage
                  src={product.image}
                  alt={product.title}
                />
                <ProductContent>
                  <Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1
                    }}>
                      <BrandLogo
                        src='./images/paisanologo.png'
                        alt="Aceros Paisano"
                      />
                      <ProductTitle variant="h3">
                        {product.title}
                      </ProductTitle>
                    </Box>

                    <DescriptionList>
                      {product.description.slice(0, 4).map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </DescriptionList>
                  </Box>

                  <ProductFooter>
                    <PriceTag>{product.price}</PriceTag>
                    {product.showModal && (
                      <ActionButton
                        variant="contained"
                        onClick={() => handleOpenModal(product)}
                        disableElevation
                      >
                        Ver más
                      </ActionButton>
                    )}
                  </ProductFooter>
                </ProductContent>
              </ProductContainer>
            )
          ))}
        </Box>
      </Container>

      {/* Product Modal */}
      <StyledModal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        sx={{ overflowY: 'auto' }}
      >
        <Fade in={modalOpen}>
          <ModalContent className="modal-content">
            {selectedProduct && (
              <>
                <ModalHeader>
                  <ModalTitle>
                    {selectedProduct.title}
                  </ModalTitle>
                  <IconButton
                    onClick={handleCloseModal}
                    sx={{
                      color: 'white',
                      p: 1,
                      position: 'absolute',
                      right: '0',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </ModalHeader>

                <ModalBody>
                  <ModalImageContainer isMobile={isMobile}>
                    <ModalImage
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                    />
                    <Typography
                      sx={{
                        mt: 2,
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 300,
                        letterSpacing: '0.03em',
                        color: '#ffffff',
                        opacity: 0.9,
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {selectedProduct.price}
                    </Typography>
                  </ModalImageContainer>

                  <ModalTextContent>
                    <ModalSectionTitle>
                      Características
                    </ModalSectionTitle>
                    <DescriptionList
                      sx={{
                        '& li': {
                          fontSize: '1.05rem',
                          lineHeight: 1.7,
                          marginBottom: '12px',
                          color: '#ffffff',
                          fontWeight: 300,
                          letterSpacing: '0.01em',
                          paddingLeft: '22px',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: '0.6em',
                            width: '7px',
                            height: '7px',
                            backgroundColor: '#e40000',
                            borderRadius: '50%',
                          }
                        }
                      }}
                    >
                      {selectedProduct.description.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </DescriptionList>

                    {selectedProduct.extraInfo && (
                      <Box sx={{ mt: 3 }}>
                        <ModalSectionTitle>
                          Información adicional
                        </ModalSectionTitle>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.9rem',
                            lineHeight: 1.7,
                            color: '#d0d0d0',
                            whiteSpace: 'pre-line',
                            fontWeight: 300,
                            letterSpacing: '0.01em',
                          }}
                        >
                          {selectedProduct.extraInfo}
                        </Typography>
                      </Box>
                    )}
                  </ModalTextContent>
                </ModalBody>

                <ModalFooter>
                  <Button
                    component={Link}
                    to="/contact"
                    variant="contained"
                    disableElevation
                    sx={{
                      backgroundColor: '#e40000',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: '2px',
                      fontSize: '0.85rem',
                      letterSpacing: '0.03em',
                      padding: '8px 16px',
                      fontWeight: 400,
                      '&:hover': {
                        backgroundColor: '#ff2222',
                      },
                      flex: isMobile ? 1 : 'auto'
                    }}
                  >
                    Solicitar información
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCloseModal}
                    sx={{
                      borderColor: '#333',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: '2px',
                      fontSize: '0.85rem',
                      letterSpacing: '0.03em',
                      padding: '8px 16px',
                      fontWeight: 400,
                      '&:hover': {
                        borderColor: '#666',
                        backgroundColor: 'rgba(255,255,255,0.05)'
                      },
                      flex: isMobile ? 1 : 'auto'
                    }}
                  >
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Fade>
      </StyledModal>

      <Footer />
    </CatalogueContainer>
  );
}

export default Catalogue;