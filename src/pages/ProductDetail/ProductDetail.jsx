import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { NavBar } from "../../components/navbar/navbar.jsx";
import { Footer } from '../../components/footer/Footer.jsx';
import ProductGallery from '../../components/ProductComponents/ProductGallery';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Helmet } from 'react-helmet';
import './ProductDetail.css';
import ButtonHoverBg from '../../components/CustomButton/ButtonHoverBg.jsx';

gsap.registerPlugin(ScrollTrigger);

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

// Products data
const productsData = {
  'mallas-electrosoldadas': {
    id: '01',
    title: 'Mallas Electrosoldadas',
    subtitle: 'Refuerzo estructural certificado',
    description:
      'Solución industrial que ofrece rapidez y economía. Garantiza la calidad de su obra mediante una soldadura controlada, uniformidad dimensional y proporcionar mejor control de las fisuras. Disponible en stock en medidas estándar.',
    disclaimerCTA: '*Consulte por nuestras mallas especiales.',
    datasheetPdf: '/pdf/mallas-electrosoldadas.pdf',
    // specifications: [
    //   'Certificadas bajo norma UNIT 845:1995',
    //   'Medidas estándar de 600x240cm en stock permanente',
    //   'Medidas especiales fabricadas a pedido',
    //   '3.5mm en 15x15cm en rollos de 50m',
    //   '3.5mm en 20x20cm en rollos de 50m',
    //   '4.2mm en 15x15cm en paños de 600x245cm',
    //   '4.2mm en 15x15cm en rollos de 25m y 50m',
    //   '5.5mm en 15x15cm en paños de 600x245cm',
    //   'Todos los diámetros, combinados de hasta 12+12 mm',
    // ],
    features: [
      'Presentación en paños y rollos',
      'Fabricación en diámetros desde 3,0mm hasta 12mm',
      'Stock permanente en medidas estándar',
      'Diseño de mallas especiales adaptadas a requerimientos del proyecto',
      'Bigotes y entramados especiales con largos hasta 12m',
      'Etiquetado que facilita identificación en obra y su uso',
      'Cortado de mallas a medida con guillotina',
      'Controles de carga y descarga mediante planillas',
      'Asistencia técnica permanente',
    ],
    technicalInfo: {
      Norma: 'UNIT 845:1995',
      Formato: 'Paños y rollos',
      Medidas: '600x240cm',
      Stock: 'Permanente',
      Diámetros: 'Hasta 12+12mm',
      Entrega: 'Programada',
    },
    availability: 'Entregas a todo el país',
    images: [
      { src: '/images/mallaElectrosoldada.jpg', alt: 'Mallas Electrosoldadas' },
      { src: '/images/mallas3.jpg', alt: 'Mallas Electrosoldadas proceso' },
      { src: '/images/mallas2.webp', alt: 'Mallas Electrosoldadas en rollo' },
      { src: '/images/mallas6.jpg', alt: 'Soldadura controlada' },
      { src: '/images/ACEROSPAISANO-081.jpg', alt: 'Mallas Electrosoldadas en rollo' },
      { src: '/images/ACEROSPAISANO-035.jpg', alt: 'Mallas Electrosoldadas en rollos' },
    ],
    // ✅ sin 3D acá
    threeDImage: null,
  },

  'mallas-plegadas': {
    id: '02',
    title: 'Mallas Plegadas',
    subtitle: 'Innovación en armaduras prefabricadas',
    description:
      'Combina las ventajas del cortado y doblado con las mallas tradicionales. Proceso industrializado con plegadora automatizada.',
    datasheetPdf: '/pdf/mallas-plegadas.pdf',
    specifications: [
      'Diseños a medida con alta precisión dimensional',
      'Proceso industrializado con plegadora automatizada',
      'Optimización del uso de hierro en obra',
      'Eliminación de empalmes y atado manual',
      'Refuerzos de borde integrados',
      'Adaptables a cualquier geometría estructural',
    ],
    features: [
      'Evita el armado de estructuras en obra',
      'Reduce mano de obra en un 60%',
      'Entrega según cronograma de obra',
      'Controles de carga y descarga mediante planillas',
      'Asistencia técnica permanente',
      'Trazabilidad completa del material',
    ],
    technicalInfo: {
      Proceso: 'Automatizado',
      'Reducción MO': '60%',
      Entrega: 'Programada',
      Geometría: 'Adaptable',
      Trazabilidad: 'Completa',
    },
    availability: 'Entregas a todo el país',
    images: [
      { src: '/images/plegada.jpg', alt: 'Mallas Plegadas' },
      { src: '/images/plegada1.jpg', alt: 'Mallas Plegadas proceso' },
      { src: '/images/plegada2.jpg', alt: 'Mallas Plegadas optimización' },
      { src: '/images/plegada3.jpg', alt: 'Mallas Plegadas formatos' },
      { src: '/images/plegada6.jpg', alt: 'Mallas Plegadas diseño' },
    ],
    // ✅ 3D se mueve a mallas plegadas
    threeDImage: {
      src: '/images/Frame 112 (1).png',
      alt: 'Plano 3D Mallas Plegadas',
    },
  },


  'mallas-galvanizadas': {
    id: '03',
    title: 'Mallas Galvanizadas',
    subtitle: 'Protección superior contra la corrosión',
    description:
      'Mallas galvanizadas confeccionadas bajo estrictos estándares de calidad, con alambre con triple capa de galvanizado.',
    datasheetPdf: null,
    specifications: [
      'Alambre con triple capa de galvanizado',
      'Alta resistencia a la corrosión y ambientes húmedos',
      'Ideales para aplicaciones en exteriores',
      'Confección bajo estrictos estándares de calidad',
      'Calibres disponibles: 1.8mm, 2.0mm, 2.5mm, 4.0mm',
    ],
    features: [
      'Larga vida útil en exteriores',
      'Resistencia a la oxidación',
      'Versatilidad de uso',
      'Stock permanente',
    ],
    technicalInfo: {
      Galvanizado: 'Triple capa',
      Calibres: '1.8mm - 4.0mm',
      Aplicación: 'Exteriores / Humedad',
      Stock: 'Permanente',
    },
    availability: 'Entregas a todo el país',
    images: [
      { src: '/images/mallas2.jpg', alt: 'Mallas Galvanizadas detalle' },
      { src: '/images/mallas4.jpg', alt: 'Mallas Galvanizadas medidas' },
      { src: '/images/mallas7.jpg', alt: 'Mallas Electrosoldadas en rollos' },
    ],
    threeDImage: null,
  },

  'hierro-cortado-y-doblado': {
    id: '04',
    title: 'Hierro Cortado y Doblado',
    subtitle: 'Sistema industrial de corte y doblado',
    description:
      //'Sistema industrial de corte y doblado de varillas de acero que permite cumplir con las especificaciones exactas del proyecto.',
      'Sistema Industrializado de corte y doblado de varillas que garantiza la precisión de sus armaduras y el cero desperdicio.',
    datasheetPdf: null,
    // specifications: [
    //   'Procesos de calidad garantizada ISO 9001',
    //   'Pedidos diseñados y validados en software especializado',
    //   'Pedidos identificados con colores por elemento estructural',
    //   'Entrega en paquetes con doble etiquetado',
    //   'Todos los diámetros disponibles 6mm a 32mm',
    // ],
    features: [
      'Cero desperdicio de acero',
      'Economía de tiempo y mano de obra',
      'Calidad de las estructuras.',
      'Doblados conformes a normas técnicas.',
      'Entrega según cronograma de obra.',
      'Asesoramiento por técnicos especializados',
      'Entrega del material debidamente identificado facilitando su uso y armado.',
      'Asistencia técnica permanente',
    ],
    technicalInfo: {
      Calidad: 'ISO 9001',
      Desperdicio: '0%',
      Diámetros: '6-32mm',
      Software: 'Especializado',
      Identificación: 'Por colores',
    },
    availability: 'Entregas a todo el país',
    images: [
      { src: '/images/cortadoYdoblado.jpg', alt: 'Hierro Cortado y Doblado' },
      { src: '/images/doblado2.jpg', alt: 'Proceso de doblado' },
      { src: '/images/ACEROSPAISANO-192.jpg', alt: 'Cero desperdicio' },
      { src: '/images/doblado6.jpg', alt: 'Control de calidad' },
      { src: '/images/doblado7.jpg', alt: 'Economía de tiempo' },
    ],
    threeDImage: null,
  },

  'barras-conformadas': {
    id: '05',
    title: 'Barras Conformadas',
    subtitle: 'Máxima adherencia para hormigón armado',
    description:
      'Barras de acero de alta calidad con superficie nervurada que permite gran adherencia al hormigón y garantiza un desempeño uniforme de las estructuras.',
    datasheetPdf: null,
    specifications: [
      'Producido bajo los estándares de la norma UNIT 843:95',
      'Longitud estándar de 6m y 12m',
      'Diámetros disponibles: 6mm, 8mm, 10mm, 12mm, 14mm, 16mm, 20mm, 25mm, 32mm',
      'Acero calidad ADN 500',
      'Barras cortadas a medida',
    ],
    features: [
      'Superficie nervurada para máxima adherencia',
      'Resistencia característica a la fluencia 500 Mpa',
      'Calidad garantizada con certificación',
      'Stock permanente',
      'Presentación en atados con barras a 12m y 6m',
      'Barras rectas en diámetros de 6mm hasta 32mm',
      'Soldable en todos sus diámetros',
    ],
    technicalInfo: {
      Norma: 'UNIT 34:1995',
      Calidad: 'ADN 500 S',
      Diámetros: '6-32mm',
      Longitud: '12m',
      Stock: 'Permanente',
    },
    availability: 'Entregas a todo el país',
    images: [
      { src: '/images/barras.jpg', alt: 'Barras Conformadas' },
      { src: '/images/barras2.jpg', alt: 'Certificación garantizada' },
      { src: '/images/ACEROSPAISANO-003.jpg', alt: 'Optimización en obra' },
      { src: '/images/ACEROSPAISANO-115.webp', alt: 'Optimización en obra' },
    ],
    threeDImage: null,
  },

  'barras-lisas': {
    id: '06',
    title: 'Barras Lisas',
    subtitle: 'Calidad certificada para construcción',
    description:
      'Barras de acero de alta calidad con superficie lisa, certificadas bajo normas UNIT 34:1995.',
    datasheetPdf: null,
    specifications: [
      'Producido bajo los estándares de la norma UNIT 34:95',
      'Diámetros disponibles: 6mm, 8mm, 10mm, 12mm, 14mm, 16mm, 19mm, 25mm, 32mm',
      'Acero calidad AL 220',
      'Barras cortadas a medida - pasadores',
    ],
    features: [
      'Superficie lisa',
      'Resistencia característica a la fluencia 220 Mpa',
      'Calidad garantizada con certificación',
      'Stock permanente',
      'Barras rectas en diámetros de 6mm hasta 32mm',
      'Presentación en atados con barras a 6m (hasta 25mm) y 12m (solo en 32mm)',
      'Soldable en todos sus diámetros',
    ],
    technicalInfo: {
      Norma: 'UNIT 34:1995',
      Calidad: 'AL-220',
      Diámetros: '6-25mm',
      Longitud: '12m',
      Stock: 'Permanente',
    },
    availability: 'Entregas a todo el país',
    images: [
      { src: '/images/barras1.jpg', alt: 'Barras de calidad' },
      { src: '/images/barras5.jpg', alt: 'Medidas precisas' },
      { src: '/images/ACEROSPAISANO-119.webp', alt: 'Optimización de recursos' },
    ],
    threeDImage: null,
  },
};

const ProductDetail = ({ serviceSlug }) => {
  const params = useParams();
  const resolvedSlug =
    serviceSlug || params.serviceSlug || params.slug || params.productSlug || null;

  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const productData = productsData[resolvedSlug];

    if (!productData) {
      navigate('/productos');
      return;
    }

    setProduct(productData);
    window.scrollTo(0, 0);
  }, [resolvedSlug, navigate]);

  useEffect(() => {
    if (!product) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.product-hero',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      const sections = gsap.utils.toArray('.product-content-section');
      sections.forEach((section, i) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.03,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              once: true,
            },
          }
        );
      });

      gsap.fromTo(
        '.spec-row',
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.tech-specs-container',
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [product]);

  const handleOpenDatasheet = () => {
    if (!product?.datasheetPdf) return;
    window.open(product.datasheetPdf, '_blank', 'noopener,noreferrer');
  };

  if (!product) return null;

  const technicalEntries = Object.entries(product.technicalInfo || {});
  const hasTechnicalInfo = technicalEntries.length > 0;

  return (
    <>
      <Helmet>
        <title>{product.title} | Aceros Paisano</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.title} | Aceros Paisano`} />
        <meta property="og:description" content={product.description} />
      </Helmet>

      <div className="product-detail-wrapper" ref={containerRef}>
        <NavBar whiteBackground={true} />

        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">INICIO</Link>
            <span className="separator">/</span>
            <Link to="/productos">PRODUCTOS</Link>
            <span className="separator">/</span>
            <span className="current">{product.title.toUpperCase()}</span>
          </nav>

          {/* Hero Section */}
          <div className="product-hero">
            <div className="hero-header">
              <span className="product-id">[{product.id}]</span>
              <h1 className="product-title">{product.title}</h1>
              <p className="product-subtitle">{product.subtitle}</p>
            </div>

            {/* Main Grid - Gallery left, Info right */}
            <div className="main-grid">
              <div className="gallery-section">
                <ProductGallery
                  images={product.images}
                  productTitle={product.title}
                />
              </div>

              <div className="info-section">
                <div className="info-card">
                  <div className="info-header">
                    <span className="info-label">CATEGORÍA</span>
                    <h3 className="info-value">Productos de Acero</h3>
                  </div>

                  <div className="info-description">
                    <span className="info-label">DESCRIPCIÓN</span>
                    <p>{product.description}</p>

                    {product.disclaimerCTA && (
                      <div>
                        <Typography variant="p" sx={{ fontSize: '12px', color: '#8a8a8aff', marginTop: '15px' }}>
                          {product.disclaimerCTA}
                        </Typography>
                      </div>
                    )}
                  </div>


                  <div className="info-availability">
                    <span className="availability-indicator"></span>
                    <span className="availability-text">{product.availability}</span>
                  </div>

                  {/* Ficha técnica compacta */}
                  <button
                    type="button"
                    className={`datasheet-row ${!product.datasheetPdf ? 'is-disabled' : ''}`}
                    onClick={handleOpenDatasheet}
                    disabled={!product.datasheetPdf}
                    aria-label={
                      product.datasheetPdf
                        ? 'Abrir ficha técnica PDF'
                        : 'Ficha técnica no disponible'
                    }
                  >
                    <span className="datasheet-icon" aria-hidden="true">
                      <img src="/images/image copy.png" alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                    </span>

                    <span className="datasheet-text">Ficha técnica</span>
                  </button>

                  {/* Single CTA Button */}
                  <button className="cta-button primary" onClick={() => navigate('/contacto')}>
                    <span className="cta-text">Solicitar información</span>
                    <span className="cta-arrow">↗</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Section */}
          {/* <section className="tech-specs-section product-content-section">
            <div className="section-header">
              <h2 className="section-title">Ficha Técnica</h2>
              <span className="section-subtitle">ESPECIFICACIONES TÉCNICAS</span>
            </div>

            <div className={product.threeDImage ? 'tech-specs-with-3d' : ''}>
              <div className="tech-specs-container">
                {hasTechnicalInfo ? (
                  <>
                    <div className="specs-grid">
                      {technicalEntries.map(([key, value], index) => (
                        <div className="spec-row" key={key}>
                          <span className="spec-index">[{String(index + 1).padStart(2, '0')}]</span>
                          <span className="spec-label">{key}</span>
                          <span className="spec-separator"></span>
                          <span className="spec-value">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="specs-footer">
                      <span className="certification-badge">
                        <span className="badge-icon">✓</span>
                        <span className="badge-text">CERTIFICADO</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="specs-grid">
                    <div className="spec-row">
                      <span className="spec-label">Ficha técnica</span>
                      <span className="spec-value">No disponible</span>
                    </div>
                  </div>
                )}
              </div>

              {product.threeDImage && (
                <div className="tech-3d-container">
                  <img
                    src={product.threeDImage.src}
                    alt={product.threeDImage.alt || `Plano 3D ${product.title}`}
                    className="tech-3d-image is-dark-lines"
                  />
                </div>
              )}
            </div>
          </section> */}

          {/* Features Section */}
          {product.features && (
            <section className="features-section product-content-section">
              <div className="section-header">
                <h2 className="section-title">Características</h2>
                <span className="section-subtitle">VENTAJAS DEL PRODUCTO</span>
              </div>

              <div className="features-grid">
                {product.features.map((feature, i) => (
                  <div className="feature-item" key={i}>
                    <span className="feature-icon">✓</span>
                    <p className="feature-text">{feature}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Specifications Section */}
          {product.specifications && (
            <section className="specifications-section product-content-section">
              <div className="section-header">
                <h2 className="section-title">Especificaciones</h2>
                <span className="section-subtitle">DETALLES TÉCNICOS</span>
              </div>

              <div className="specifications-grid">
                {product.specifications.map((spec, i) => (
                  <div className="specification-item" key={i}>
                    <span className="spec-number">{String(i + 1).padStart(2, '0')}</span>
                    <p className="spec-text">{spec}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="cta-section">
            <div className="cta-content">
              <h3 className="cta-title">¿Necesita más información?</h3>
              <p className="cta-description">
                Nuestro equipo técnico está disponible para asesorarlo sobre este producto
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="cta-button primary" style={{ maxWidth: '25%' }} onClick={() => navigate('/contacto')}>
                  <span className="cta-text">Solicitar información</span>
                  <span className="cta-arrow">↗</span>
                </button>
              </div>
            </div>
          </section>
        </Container>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;