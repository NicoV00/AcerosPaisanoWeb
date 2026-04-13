import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import './ProductShowcase.css';

const products = [
  {
    id: 'hierro',
    title: 'HIERRO CORTADO Y DOBLADO',
    subtitle: 'Precisión Industrial',
    number: '01',
    description: 'Soluciones a medida con dimensiones precisas según las necesidades del proyecto. Procesos de calidad garantizada con cero desperdicio.',
    features: [
      'A Medida: Dimensiones precisas según necesidades del proyecto',
      'Calidad: Procesos de calidad garantizada',
      'Cero Desperdicio: Trabajamos con rollos de alambrón',
      'Ahorro: Economía de tiempo y mano de obra',
      'Asistencia Técnica: Asesoramiento por técnicos especializados'
    ],
    images: [
      './images/doblado2.jpg',
      './images/doblado6.jpg',
      './images/doblado4.jpg',
      './images/doblado7.jpg',
      './images/doblado5.jpg'
    ],
    color: '#b62129'
  },
  {
    id: 'mallas-electro',
    title: 'MALLAS ELECTROSOLDADAS',
    subtitle: 'Refuerzo Estructural Certificado',
    number: '02',
    description: 'Certificadas bajo norma UNIT 845:1995. Producción validada por ensayos en laboratorio con medidas estándar disponibles.',
    features: [
      'Certificación: Certificadas bajo norma UNIT 845:1995',
      'Garantía de calidad: Producción validada por ensayos',
      'Medidas estándar: Todos los diámetros en plaza',
      'Presentación: Adaptable a las necesidades del proyecto',
      'Diseño Especial: Soluciones personalizadas'
    ],
    images: [
      './images/certificado1.jpg',
      './images/mallas3.jpg',
      './images/mallas4.jpg',
      './images/mallas2.jpg',
      './images/mallas6.jpg'
    ],
    color: '#000'
  },
  {
    id: 'barras',
    title: 'BARRAS LISAS Y CONFORMADAS',
    subtitle: 'Soluciones Versátiles',
    number: '03',
    description: 'Certificadas bajo normas UNIT 34:1995 Y UNIT 845:1995. Procesos de calidad garantizada con barras cortadas a medida.',
    features: [
      'Certificación: Normas UNIT 34:1995 Y UNIT 845:1995',
      'Rendimiento y calidad: Procesos garantizados',
      'Cero desperdicio: Barras cortadas a medida',
      'Maximización de recursos: Optimización en obra',
      'Logística optimizada: Traslado sencillo y seguro'
    ],
    images: [
      './images/barras3.webp',
      './images/barras1.jpg',
      './images/barras2.jpg',
      './images/barras3.jpg',
      './images/barras5.jpg'
    ],
    color: '#b62129'
  },
  {
    id: 'mallas-plegadas',
    title: 'MALLAS PLEGADAS',
    subtitle: 'Refuerzo Optimizado',
    number: '04',
    description: 'Combina las ventajas del cortado y doblado + mallas. Proceso industrializado con plegadora automatizada.',
    features: [
      'Estandarización: Combina ventajas de cortado/doblado + mallas',
      'Alta precisión: Plegadora automatizada',
      'Optimización en obra: Elimina procesos manuales',
      'Soluciones adaptables: Formatos versátiles',
      'Diseño optimizado: Adaptado a cada requerimiento'
    ],
    images: [
      './images/plegada.jpg',
      './images/plegada1.jpg',
      './images/plegada2.jpg',
      './images/plegada3.jpg',
      './images/plegada6.jpg'
    ],
    color: '#000'
  }
];

const ProductShowcase = () => {
  const [activeProduct, setActiveProduct] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const imagesRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if component is in view
      if (rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5) {
        setIsInView(true);

        // Calculate which product should be active based on scroll
        const scrollInComponent = (windowHeight * 0.5 - rect.top);
        const componentHeight = rect.height;
        const scrollPercentage = Math.max(0, Math.min(1, scrollInComponent / componentHeight));

        setScrollProgress(scrollPercentage);

        // Determine active product
        const productIndex = Math.floor(scrollPercentage * products.length);
        const clampedIndex = Math.min(products.length - 1, Math.max(0, productIndex));

        if (clampedIndex !== activeProduct) {
          setActiveProduct(clampedIndex);
          setActiveFeature(0); // Reset to first feature when changing products
        }

        // Calculate feature progress within current product
        const productProgress = (scrollPercentage * products.length) % 1;
        const featureIndex = Math.floor(productProgress * 5);
        const clampedFeatureIndex = Math.min(4, Math.max(0, featureIndex));

        if (clampedFeatureIndex !== activeFeature) {
          setActiveFeature(clampedFeatureIndex);
        }
      } else {
        setIsInView(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeProduct, activeFeature]);

  const currentProduct = products[activeProduct];

  return (
    <Box
      ref={containerRef}
      className="product-showcase"
      sx={{
        position: 'relative',
        minHeight: `${products.length * 150}vh`,
        width: '100%',
        backgroundColor: '#000',
      }}
    >
      {/* Sticky Container */}
      <Box
        className="sticky-container"
        sx={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: currentProduct.color,
          transition: 'background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Left Side - Product Info */}
        <Box
          sx={{
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px',
            color: '#fff',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Product Number */}
          <Typography
            className="product-number"
            sx={{
              fontSize: '180px',
              fontWeight: 900,
              lineHeight: 1,
              opacity: 0.1,
              position: 'absolute',
              top: '50px',
              left: '40px',
              transform: `translateY(${scrollProgress * -20}px)`,
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {currentProduct.number}
          </Typography>

          {/* Subtitle */}
          <Typography
            className="product-subtitle"
            sx={{
              fontSize: '14px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              opacity: 0.6,
              marginBottom: '20px',
              transform: `translateX(${isInView ? 0 : -30}px)`,
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {currentProduct.subtitle}
          </Typography>

          {/* Product Title */}
          <Typography
            className="product-title"
            variant="h1"
            sx={{
              fontSize: { xs: '40px', md: '60px', lg: '72px' },
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '40px',
              letterSpacing: '-2px',
              transform: `translateX(${isInView ? 0 : -50}px)`,
              opacity: isInView ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {currentProduct.title}
          </Typography>

          {/* Description */}
          <Typography
            className="product-description"
            sx={{
              fontSize: '18px',
              lineHeight: 1.6,
              opacity: 0.8,
              marginBottom: '60px',
              maxWidth: '600px',
              transform: `translateY(${isInView ? 0 : 20}px)`,
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {currentProduct.description}
          </Typography>

          {/* Features List */}
          <Box className="features-list">
            {currentProduct.features.map((feature, index) => (
              <Box
                key={index}
                className="feature-item"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '25px',
                  opacity: index <= activeFeature ? 1 : 0.3,
                  transform: `translateX(${index <= activeFeature ? 0 : -20}px)`,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                <Box
                  sx={{
                    width: '40px',
                    height: '2px',
                    backgroundColor: '#fff',
                    marginTop: '12px',
                    marginRight: '20px',
                    opacity: index === activeFeature ? 1 : 0.3,
                    transform: `scaleX(${index === activeFeature ? 1 : 0.5})`,
                    transformOrigin: 'left',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '16px',
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Side - Image */}
        <Box
          ref={imagesRef}
          sx={{
            width: '50%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {currentProduct.images.map((image, index) => (
            <Box
              key={`${currentProduct.id}-${index}`}
              component="img"
              src={image}
              alt={`${currentProduct.title} ${index + 1}`}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: index === activeFeature ? 1 : 0,
                transform: `scale(${index === activeFeature ? 1 : 1.1})`,
                transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: 'brightness(0.9)',
              }}
            />
          ))}

          {/* Overlay gradient */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%)',
              pointerEvents: 'none',
            }}
          />
        </Box>

        {/* Progress Indicator */}
        <Box
          className="progress-indicator"
          sx={{
            position: 'absolute',
            bottom: '40px',
            left: '80px',
            display: 'flex',
            gap: '10px',
            zIndex: 3,
          }}
        >
          {products.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: '40px',
                height: '4px',
                backgroundColor: '#fff',
                opacity: index === activeProduct ? 1 : 0.3,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductShowcase;