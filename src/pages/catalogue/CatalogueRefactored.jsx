import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Typography,
  Box,
  Container,
  Button
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { NavBar } from "../../components/navbar/Navbar.jsx";
import { Footer } from '../../components/footer/Footer.jsx';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Helmet } from 'react-helmet';

gsap.registerPlugin(ScrollTrigger);

// Products data with original information - NO INVENTIONS
const products = [
  {
    id: '01',
    name: 'Mallas Electrosoldadas',
    slug: 'mallas-electrosoldadas',
    shortDescription: 'Refuerzo estructural certificado',
    description: 'Certificadas bajo norma UNIT 845:1995. Medidas estándar y especiales.',
    image: '/images/mallaElectrosoldada.jpg',
    specs: {
      'Norma': 'UNIT 845:1995',
      'Formato': 'Paños y rollos',
      'Medidas': '600x240cm',
      'Stock': 'Permanente'
    }
  },
  {
    id: '02',
    name: 'Mallas Plegadas',
    slug: 'mallas-plegadas',
    shortDescription: 'Prefabricación de armaduras',
    description: 'Proceso industrializado con plegadora automatizada.',
    image: '/images/plegada.jpg',
    specs: {
      'Proceso': 'Automatizado',
      'Reducción MO': '60%',
      'Entrega': 'Programada'
    }
  },
  {
    id: '03',
    name: 'Hierro Cortado y Doblado',
    slug: 'hierro-cortado-doblado',
    shortDescription: 'Sistema industrial',
    description: 'Cero desperdicio. Dimensiones precisas según proyecto.',
    image: '/images/cortadoYdoblado.jpg',
    specs: {
      'Calidad': 'ISO 9001',
      'Desperdicio': '0%',
      'Diámetros': '6-32mm'
    }
  },
  {
    id: '04',
    name: 'Barras Lisas',
    slug: 'barras-lisas',
    shortDescription: 'Acero certificado AL-220',
    description: 'Certificadas bajo normas UNIT 34:1995 y UNIT 845:1995.',
    image: '/images/barrasLisas.jpg',
    specs: {
      'Norma': 'UNIT 34:1995',
      'Calidad': 'AL-220',
      'Diámetros': '6-25mm',
      'Longitud': '12m'
    }
  },
  {
    id: '05',
    name: 'Barras Conformadas',
    slug: 'barras-conformadas',
    shortDescription: 'Máxima adherencia ADN 500 S',
    description: 'Superficie nervurada para óptima adherencia al hormigón.',
    image: '/images/barras3.webp',
    specs: {
      'Norma': 'UNIT 34:1995',
      'Calidad': 'ADN 500 S',
      'Diámetros': '6-32mm',
      'Longitud': '12m'
    }
  }
];

// CSS Variables and styled components
const CatalogueWrapper = styled(Box)`
  --font-sans: 'Europa Grotesk', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  --font-mono: 'Geist Mono', 'SF Mono', monospace;
  --bg: #000000;
  --ink: #FFFFFF;
  --muted: rgba(255, 255, 255, 0.65);
  --tertiary: rgba(255, 255, 255, 0.45);
  --hair: rgba(255, 255, 255, 0.14);
  --hair2: rgba(255, 255, 255, 0.08);
  --red: #E40000;

  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  font-family: var(--font-sans);
`;

const HeroSection = styled(Box)`
  padding: 120px 0 80px;
  border-bottom: 1px solid var(--hair2);
`;

const MainContent = styled(Box)`
  padding: 80px 0 120px;

  @media (max-width: 1024px) {
    padding: 60px 0 80px;
  }
`;

const ProductList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const ProductItem = styled(Box)`
  padding: 60px 0;
  border-bottom: 1px solid var(--hair2);
  cursor: pointer;
  transition: all 0.3s ease;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  &:hover {
    .product-number { opacity: 1; }
    .cta-primary { background: var(--red); }
    .product-image { transform: scale(1.02); }
  }
`;

const ProductImage = styled(Box)`
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: var(--hair2);
  position: relative;
  border: 1px solid var(--hair2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  @media (max-width: 768px) {
    height: 240px;
  }
`;

const ProductNumber = styled(Typography)`
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--tertiary);
  letter-spacing: 0.05em;
  margin-bottom: 16px;
  opacity: 0.65;
  transition: opacity 0.3s ease;
`;

const ProductTitle = styled(Typography)`
  font-size: 42px;
  font-weight: 500;
  line-height: 1.1;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: -0.02em;
`;

const ProductDesc = styled(Typography)`
  font-size: 18px;
  color: var(--muted);
  margin-bottom: 8px;
`;

const ProductSubDesc = styled(Typography)`
  font-size: 16px;
  color: var(--tertiary);
  margin-bottom: 32px;
  line-height: 1.5;
`;

const MetaTable = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  margin-bottom: 40px;
  border-top: 1px solid var(--hair2);
`;

const MetaItem = styled(Box)`
  padding: 16px 0;
  border-bottom: 1px solid var(--hair2);
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:nth-child(odd) {
    padding-right: 24px;
    border-right: 1px solid var(--hair2);
  }

  &:nth-child(even) {
    padding-left: 24px;
  }
`;

const MetaLabel = styled(Typography)`
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--tertiary);
`;

const MetaValue = styled(Typography)`
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--muted);
`;

const CTAGroup = styled(Box)`
  display: flex;
  gap: 16px;
`;

const PrimaryButton = styled(Button)`
  background: var(--red);
  color: var(--ink);
  border: 1px solid var(--red);
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0.03em;
  transition: all 0.3s ease;

  &:hover {
    background: #CC0000;
    border-color: #CC0000;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: var(--muted);
  border: 1px solid var(--hair2);
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0.03em;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--hair);
    color: var(--ink);
  }
`;

const SidePanel = styled(Box)`
  position: sticky;
  top: 120px;
  height: calc(100vh - 240px);
  background: var(--bg);
  border: 1px solid var(--hair2);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const CatalogueRefactored = () => {
  const navigate = useNavigate();
  const itemsRef = useRef([]);
  const ctx = useRef(null);

  useLayoutEffect(() => {
    ctx.current = gsap.context(() => {
      // Animate products on scroll
      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        gsap.fromTo(item,
          {
            opacity: 0,
            y: 40
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    });

    return () => {
      ctx.current?.revert();
    };
  }, []);

  const handleProductClick = (slug) => {
    navigate(`/productos/${slug}`);
  };

  const handleSpecsClick = (e, slug) => {
    e.stopPropagation();
    navigate(`/productos/${slug}#especificaciones`);
  };

  return (
    <>
      <Helmet>
        <title>Productos | Aceros Paisano</title>
        <meta name="description" content="Catálogo de productos de acero para construcción. Soluciones industriales certificadas." />
      </Helmet>

      <CatalogueWrapper>
        <NavBar />

        <Container maxWidth="xl">
          <HeroSection>
            <Typography
              sx={{
                fontSize: { xs: '48px', md: '64px' },
                fontWeight: 500,
                lineHeight: 1,
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                marginBottom: '24px'
              }}
            >
              Productos
            </Typography>
            <Typography
              sx={{
                fontSize: '18px',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              Soluciones industriales en acero
            </Typography>
          </HeroSection>

          <MainContent>
            {products.map((product, index) => (
              <ProductItem
                key={product.id}
                ref={el => itemsRef.current[index] = el}
                onClick={() => handleProductClick(product.slug)}
              >
                <ProductImage className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                </ProductImage>

                <Box>
                  <ProductNumber className="product-number">
                    {product.id} / {products.length.toString().padStart(2, '0')}
                  </ProductNumber>

                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductDesc>{product.shortDescription}</ProductDesc>
                  <ProductSubDesc>{product.description}</ProductSubDesc>

                  <MetaTable>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <MetaItem key={key}>
                        <MetaLabel>{key}</MetaLabel>
                        <MetaValue>{value}</MetaValue>
                      </MetaItem>
                    ))}
                  </MetaTable>

                  <CTAGroup>
                    <PrimaryButton className="cta-primary">
                      Ver producto
                    </PrimaryButton>
                    <SecondaryButton onClick={(e) => handleSpecsClick(e, product.slug)}>
                      Ver especificaciones →
                    </SecondaryButton>
                  </CTAGroup>
                </Box>
              </ProductItem>
            ))}
          </MainContent>
        </Container>

        <Footer />
      </CatalogueWrapper>
    </>
  );
};

export default CatalogueRefactored;