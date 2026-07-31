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

// SF-Symbols-style line icons (24x24, stroke, rounded)
const svgBase = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const FeatureIcons = {
  clock: (
    <svg {...svgBase}><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3.2 2" /></svg>
  ),
  cube: (
    <svg {...svgBase}><path d="M12 3l7.5 4.3v8.9L12 21l-7.5-4.8V7.3L12 3z" /><path d="M4.6 7.4 12 11.7l7.4-4.3M12 11.7V21" /></svg>
  ),
  geometry: (
    <svg {...svgBase}><path d="M4 19h16L4 5v14z" /><path d="M8 15.5v-2.2M11 15.5v-3.6" /></svg>
  ),
  tag: (
    <svg {...svgBase}><path d="M4 4h7.2l8.4 8.4-7.2 7.2L4 11.2V4z" /><circle cx="8" cy="8" r="1.4" /></svg>
  ),
  headset: (
    <svg {...svgBase}><path d="M5 12.5a7 7 0 0 1 14 0" /><path d="M5 12.5h1.6a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1zM19 12.5h-1.6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1H18a2 2 0 0 0 2-2v-2a1 1 0 0 0-1-1z" /></svg>
  ),
  bolt: (
    <svg {...svgBase}><path d="M13 3 5.5 13H11l-1 8 8.5-11H13l1-7z" /></svg>
  ),
  leaf: (
    <svg {...svgBase}><path d="M4.5 19.5c0-8 6-14 15.5-14 0 9.5-6 15.5-14 15.5" /><path d="M4.5 19.5c3.8-3.8 7.5-6 11.5-7" /></svg>
  ),
  shield: (
    <svg {...svgBase}><path d="M12 3l7 3v5.2c0 4.8-3.4 7.8-7 9.8-3.6-2-7-5-7-9.8V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
  ),
  arrows: (
    <svg {...svgBase}><path d="M7 8.5 3.5 12 7 15.5M17 8.5 20.5 12 17 15.5M4 12h16" /></svg>
  ),
  layers: (
    <svg {...svgBase}><path d="M12 3.5l8.5 4.5L12 12.5 3.5 8 12 3.5z" /><path d="M3.5 12.5 12 17l8.5-4.5" /></svg>
  ),
  box: (
    <svg {...svgBase}><rect x="4" y="7" width="16" height="13" rx="1.2" /><path d="M3 4.5h18v3H3zM9.5 11h5" /></svg>
  ),
  people: (
    <svg {...svgBase}><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M16 5.5a3 3 0 0 1 0 6M17.5 14.2a5.5 5.5 0 0 1 3 4.8" /></svg>
  ),
  link: (
    <svg {...svgBase}><path d="M9.5 14.5l5-5" /><path d="M11 7.5l1.2-1.2a3.4 3.4 0 0 1 4.8 4.8l-1.2 1.2M13 16.5l-1.2 1.2a3.4 3.4 0 0 1-4.8-4.8l1.2-1.2" /></svg>
  ),
  scissors: (
    <svg {...svgBase}><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><path d="M8.2 7.6 20 18M8.2 16.4 20 6" /></svg>
  ),
  clipboard: (
    <svg {...svgBase}><rect x="5" y="4.5" width="14" height="16" rx="1.6" /><path d="M9 4.5v-1h6v1" /><path d="M8.6 10l1.2 1.2 2.1-2.3M8.6 15l1.2 1.2 2.1-2.3M14.4 10h2.2M14.4 16h2.2" /></svg>
  ),
  diameter: (
    <svg {...svgBase}><circle cx="12" cy="12" r="8" /><path d="M7.5 12h9M7.5 12l1.8-1.8M7.5 12l1.8 1.8M16.5 12l-1.8-1.8M16.5 12l-1.8 1.8" /></svg>
  ),
  mesh: (
    <svg {...svgBase}><rect x="4" y="4" width="16" height="16" rx="1.6" /><path d="M4 9.3h16M4 14.6h16M9.3 4v16M14.6 4v16" /></svg>
  ),
  seal: (
    <svg {...svgBase}><path d="M12 3l1.9 1.5 2.4-.3.9 2.2 2.2.9-.3 2.4L20.5 12l1.5 1.9-1.9-.3.3 2.4-2.2.9-.9 2.2-2.4-.3L12 20.5l-1.9-1.5-2.4.3-.9-2.2-2.2-.9.3-2.4L3.5 12l-1.5-1.9 1.9.3-.3-2.4 2.2-.9.9-2.2 2.4.3L12 3z" transform="translate(0.5 0)" /><path d="M9 12l2 2 4-4" /></svg>
  ),
};

// Road/pavement-themed line icons for the "Uso en pavimentos" section
const RoadIcons = {
  // Carretera en perspectiva con línea central discontinua
  road: (
    <svg {...svgBase}><path d="M9.5 4 5 20M14.5 4 19 20" /><path d="M12 5v2.4M12 10.4v2.8M12 16.4V19" /></svg>
  ),
  // Norma / documento técnico
  norm: (
    <svg {...svgBase}><rect x="5" y="3.5" width="14" height="17" rx="1.6" /><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" /></svg>
  ),
  // Barra lisa (sección circular)
  bar: (
    <svg {...svgBase}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.2" /></svg>
  ),
  // Longitud del pasador: barra con flechas en los extremos
  length: (
    <svg {...svgBase}><path d="M3.5 12h17" /><path d="M6.5 9l-3 3 3 3M17.5 9l3 3-3 3" /><path d="M8 6.5h8M8 17.5h8" /></svg>
  ),
  // Separación entre pasadores: barras paralelas con cota
  spacing: (
    <svg {...svgBase}><path d="M5 4v16M19 4v16" /><path d="M8 12h8" /><path d="M9.8 9.8 8 12l1.8 2.2M14.2 9.8 16 12l-1.8 2.2" /></svg>
  ),
  // Distancia al borde: esquina de losa con cota
  edge: (
    <svg {...svgBase}><path d="M4 4v16h16" /><path d="M9 15.5h6.5M9 13.5v4" /><circle cx="17" cy="7" r="1.4" /></svg>
  ),
  // Ubicación en altura: losa con eje medio
  depth: (
    <svg {...svgBase}><rect x="3.5" y="6" width="17" height="12" rx="1.2" /><path d="M3.5 12h4M16.5 12h4M9.5 12h5" strokeDasharray="0.1 3" /><circle cx="12" cy="12" r="1.6" /></svg>
  ),
  // Acero liso: barra cilíndrica
  steel: (
    <svg {...svgBase}><path d="M4 8.5h13a3.5 3.5 0 0 1 0 7H4" /><ellipse cx="4.5" cy="12" rx="1.8" ry="3.5" /></svg>
  ),
  // Treliza: celosía triangular
  truss: (
    <svg {...svgBase}><path d="M3.5 17.5h17M3.5 17.5 8 7l4.5 10.5L17 7l3.5 10.5" /><path d="M8 7h9" /></svg>
  ),
};

const stripAccents = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const getFeatureIcon = (text) => {
  const t = stripAccents(text);
  const has = (...ks) => ks.some((k) => t.includes(k));

  if (has('cortad', 'guillotina', 'tijera')) return FeatureIcons.scissors;
  if (has('control', 'planilla', 'registro')) return FeatureIcons.clipboard;
  if (has('diametro')) return FeatureIcons.diameter;
  if (has('malla', 'entramado', 'bigote', 'plegad')) return FeatureIcons.mesh;
  if (has('geometr', 'precis', 'dimensional', 'espiral', 'paso ', 'a medida')) return FeatureIcons.geometry;
  if (has('soldad', 'soldable')) return FeatureIcons.bolt;
  if (has('transferencia', 'movimiento', 'junta', 'escalonam')) return FeatureIcons.arrows;
  if (has('adheren', 'superficie', 'nervurada', 'capa', 'galvaniz')) return FeatureIcons.layers;
  if (has('desperdicio', 'optimiz', 'economia', 'econom', 'residuo')) return FeatureIcons.leaf;
  if (has('calidad', 'certific', 'garantiz', 'resist', 'norma', 'fluencia', 'mpa')) return FeatureIcons.shield;
  if (has('tiempo', 'cronograma', 'entrega', 'programad', 'reduc')) return FeatureIcons.clock;
  if (has('identif', 'plano', 'etiquet', 'trazab', 'color')) return FeatureIcons.tag;
  if (has('asisten', 'asesor', 'tecnic', 'soporte')) return FeatureIcons.headset;
  if (has('mano de obra', 'operad')) return FeatureIcons.people;
  if (has('empalme', 'anclaje', 'solap')) return FeatureIcons.link;
  if (has('stock', 'presentac', 'atado', 'paquete', 'roll', 'paño', 'pano')) return FeatureIcons.box;
  if (has('armado', 'jaula', 'estructura', 'manipul', 'transporte', 'rigid', 'premold', 'prefabric', 'izaje', 'obra')) return FeatureIcons.cube;
  return FeatureIcons.seal;
};

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
      'Diámetros desde 3,0mm hasta 12mm',
      'Stock permanente en medidas estándar',
      'Diseño de mallas especiales a medida',
      'Bigotes y entramados de hasta 12m',
      'Etiquetado para identificación en obra',
      'Cortado a medida con guillotina',
      'Controles de carga y descarga por planilla',
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
    cta: {
      title: '¿Necesitás mallas para tu obra?',
      description: 'Contanos las medidas y cantidades, y te cotizamos la solución más adecuada.',
      button: 'Solicitar cotización',
    },
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
    cta: {
      title: '¿Tu proyecto tiene geometrías repetitivas?',
      description: 'Envíanos los planos y diseñamos las mallas plegadas a medida de tu obra.',
      button: 'Solicitar asesoramiento',
    },
    images: [
      { src: '/images/plegada.webp', alt: 'Mallas Plegadas' },
      { src: '/images/plegada1.jpg', alt: 'Mallas Plegadas proceso' },
      { src: '/images/plegada3.jpg', alt: 'Mallas Plegadas formatos' },
      { src: '/images/plegadas-obra1.jpg', alt: 'Mallas Plegadas en obra' },
      { src: '/images/plegadasobra.webp', alt: 'Mallas Plegadas instalación' },
      { src: '/images/plegadas-obra3.jpg', alt: 'Mallas Plegadas estructural' },
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
      'Control de carga y descarga en obra mediante planillas',
    ],
    technicalInfo: {
      Calidad: 'ISO 9001',
      Desperdicio: '0%',
      Diámetros: '6-32mm',
      Software: 'Especializado',
      Identificación: 'Por colores',
    },
    availability: 'Entregas a todo el país',
    cta: {
      title: '¿Querés eliminar el corte y doblado en obra?',
      description: 'Envíanos la planilla de hierros y te cotizamos el pedido listo para armar.',
      button: 'Solicitar cotización',
    },
    images: [
      { src: '/images/cortadoYdoblado.jpg', alt: 'Hierro Cortado y Doblado' },
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
    cta: {
      title: '¿Necesitás barras conformadas para tu obra?',
      description: 'Contanos diámetros y cantidades, y te cotizamos con entrega a todo el país.',
      button: 'Solicitar cotización',
    },
    images: [
      { src: '/images/barras3.webp', alt: 'Barras Conformadas' },
      { src: '/images/barras2.jpg', alt: 'Certificación garantizada' },
      { src: '/images/barrasConformadas.webp', alt: 'Optimización en obra' },
      { src: '/images/ACEROSPAISANO-115.webp', alt: 'Optimización en obra' },
    ],
    threeDImage: null,
  },

  'barras-lisas': {
    id: '06',
    title: 'Barras Lisas',
    subtitle: 'Calidad certificada para la industria y la construcción',
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
    cta: {
      title: '¿Necesitás barras lisas a medida?',
      description: 'Contanos diámetros, largos y cantidades, y te cotizamos a la brevedad.',
      button: 'Solicitar cotización',
    },
    images: [
      { src: '/images/barras1.jpg', alt: 'Barras de calidad' },
      { src: '/images/barras5.png', alt: 'Medidas precisas' },
      { src: '/images/ACEROSPAISANO-119.webp', alt: 'Optimización de recursos' },
    ],
    threeDImage: null,
  },
  'armaduras-de-pilotes': {
    id: '07',
    title: 'Armaduras de pilotes',
    subtitle: 'Armaduras prefabricadas para fundaciones profundas',
    description:
      'Armaduras cilíndricas fabricadas industrialmente, para cimentaciones de pilotes, listas para posicionar. Fabricadas según los requerimientos del proyecto, están diseñadas para absorber los esfuerzos de tracción, flexión y torsión en cimentaciones profundas. Eliminan el armado manual en obra garantizando la geometría de la jaula y reduciendo los tiempos de la cimentación.',
    datasheetPdf: null,
    specifications: [
      'Fabricación según planos y especificaciones del proyecto',
      'Acero certificado según norma UNIT 843:95',
      'Diámetros de jaula y largos a medida',
      'Rigidizadores internos que aseguran la geometría durante el izaje',
      'Zuncho helicoidal con paso uniforme y controlado',
      'Empalmes y anclajes según requerimiento estructural',
    ],
    features: [
      'Cero desperdicio',
      'Optimización financiera',
      'Geometría exacta y paso de espiral uniforme',
      'Reducción de tiempos y espacio de armado en obra',
      'Identificación de cada armadura según plano',
      'Entrega según cronograma de obra',
    ],
    cta: {
      title: '¿Necesitás una armadura para tu proyecto?',
      description: 'Envíanos los requerimientos y analizamos la solución más adecuada.',
      button: 'Solicitar asesoramiento',
    },
    technicalInfo: {
      Acero: 'ADN 500',
      Diámetros: '6-32mm',
      Largo: 'A medida',
      Fabricación: 'Según plano',
      Entrega: 'Programada',
    },
    availability: 'Entregas a todo el país',
    images: [
      { src: '/images/pilotes 1.webp', alt: 'Armaduras de Pilotes' },
      { src: '/images/Pilotes2.webp', alt: 'Armaduras de Pilotes fabricación' },
      { src: '/images/Pilotes3.webp', alt: 'Armaduras de Pilotes proceso' },
      { src: '/images/Pilotes.webp', alt: 'Armaduras de Pilotes detalle' },
    ],
    threeDImage: null,
  },

  'pasadores': {
    id: '08',
    title: 'Pasadores',
    subtitle: 'Transferencia de cargas en juntas de pavimentos',
    description:
      'Barras de acero liso cortadas a medida, diseñadas para transferir cargas entre losas de hormigón y permitir el movimiento por dilatación o contracción. Permiten la transferencia de cargas entre losas, evitando escalonamientos. Producidos en equipos de alta precisión permiten obtener una calidad en el corte libre de defectos y una tolerancia dimensional estricta.',
    datasheetPdf: null,
    specifications: [
      'Producido bajo los estándares de la norma UNIT 34:95',
      'Acero liso calidad AL-220',
      'Diámetros habituales: Ø20mm, Ø25mm y Ø32mm',
      'Longitudes frecuentes: 40cm y 50cm',
      'Corte a medida según plano o pliego técnico',
    ],
    features: [
      'Mayor rapidez y productividad',
      'Calidad de su armadura',
      'Reducción de tiempos de obra',
      'Medidas exactas',
      'Extremos de corte limpio, sin rebabas',
      'Menor costo financiero',
      'Reducción del espacio en obra',
      'Cero desperdicio',
    ],
    technicalInfo: {
      Norma: 'UNIT 34:95',
      Calidad: 'AL-220',
      Diámetros: '20-32mm',
      Longitudes: '40cm y 50cm',
      Corte: 'A medida',
    },
    availability: 'Entregas a todo el país',
    cta: {
      title: '¿Necesitás pasadores para tu pavimento?',
      description: 'Envíanos el plano o pliego técnico y te cotizamos el corte a medida.',
      button: 'Solicitar cotización',
    },
    images: [
      { src: '/images/pasadores3.webp', alt: 'Pasadores Aceros Paisano' },
      { src: '/images/pasadores.webp', alt: 'Pasadores para pavimentos' },
      { src: '/images/pasadores2.webp', alt: 'Pasadores barras lisas' },
    ],
    threeDImage: null,
  },

  'trelizas': {
    id: '09',
    title: 'Trelizas',
    subtitle: 'Armaduras triangulares electrosoldadas',
    description:
      'Estructura de sección triangular fabricada con acero de 600Mpa nervurado, conformada por tres hilos de acero unidos por dos diagonales electrosoldadas. Poseen la capacidad de lograr grandes luces y soportar cargas elevadas con total seguridad.',
    datasheetPdf: null,
    features: [
      'Reducción del costo de mano de obra',
      'Mejor productividad',
      'Racionalización en la ejecución',
      'Organización del cantero de obras',
      'Mayor rapidez en el montaje',
    ],
    technicalInfo: {
      Proceso: 'Electrosoldado',
      Geometría: 'Triangular',
      Medidas: 'Según proyecto',
      Aplicación: 'Premoldeados',
      Entrega: 'Programada',
    },
    availability: 'Entregas a todo el país',
    cta: {
      title: '¿Necesitás trelizas para tus premoldeados?',
      description: 'Contanos las medidas de tu proyecto y te asesoramos sobre la treliza adecuada.',
      button: 'Solicitar asesoramiento',
    },
    images: [
      { src: '/images/trelizas.webp', alt: 'Trelizas electrosoldadas' },
      { src: '/images/trelizasss.webp', alt: 'Trelizas en paquete' },
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
                    <span className="availability-text">{product.availability}</span>
                  </div>

                  {/* TEMPORALMENTE OCULTO - Ficha técnica
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
                  */}

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

          {/* Datos técnicos viales - solo Pasadores */}
          {product.id === '08' && (
            <section className="road-data-section product-content-section">
              <div className="section-header">
                <h2 className="section-title">Uso en pavimentos</h2>
                <span className="section-subtitle">DATOS TÉCNICOS PARA OBRAS VIALES</span>
              </div>

              <div className="road-data-grid">
                {/* Cuadro 1: referencia + espesor de losa */}
                <div className="road-card">
                  <div className="road-card-head">
                    <span className="road-card-head-icon">{RoadIcons.road}</span>
                    <h3 className="road-card-title">Espesor de losa para pavimentos de carreteras</h3>
                  </div>

                  <div className="road-ref-row">
                    <div className="road-ref-item">
                      <span className="road-ref-icon">{RoadIcons.norm}</span>
                      <div>
                        <span className="road-ref-label">Referencia</span>
                        <span className="road-ref-value">Norma <strong>UNIT 34:95</strong></span>
                      </div>
                    </div>
                    <div className="road-ref-item">
                      <span className="road-ref-icon">{RoadIcons.bar}</span>
                      <div>
                        <span className="road-ref-label">Liso</span>
                        <span className="road-ref-value"><strong>AL-220</strong></span>
                      </div>
                    </div>
                  </div>

                  <table className="road-table">
                    <thead>
                      <tr>
                        <th>Espesor de losa</th>
                        <th>Diám. (mm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>20 cm</td>
                        <td className="road-td-accent">25 mm</td>
                      </tr>
                      <tr>
                        <td>20 cm - 25 cm</td>
                        <td className="road-td-accent">32 mm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Cuadro 2: dimensiones características */}
                <div className="road-card">
                  <div className="road-card-head">
                    <span className="road-card-head-icon">{RoadIcons.length}</span>
                    <h3 className="road-card-title">Dimensiones características en obras viales</h3>
                  </div>
                  <table className="road-table road-table-dims">
                    <thead>
                      <tr>
                        <th>Parámetro de Diseño</th>
                        <th>Medida Sugerida</th>
                        <th>Criterio de Colocación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          icon: RoadIcons.length,
                          param: 'Longitud del pasador',
                          medida: '45 cm a 50 cm',
                          criterio: 'Centrado (la mitad a cada lado de la junta).',
                        },
                        {
                          icon: RoadIcons.spacing,
                          param: 'Separación entre pasadores',
                          medida: '30 cm de centro a centro',
                          criterio: 'Colocados en paralelo al eje de la calzada.',
                        },
                        {
                          icon: RoadIcons.edge,
                          param: 'Distancia al borde',
                          medida: '15 cm de centro a borde',
                          criterio: 'Evita concentraciones de tensiones en la esquina.',
                        },
                        {
                          icon: RoadIcons.depth,
                          param: 'Ubicación en altura',
                          medida: 'Mitad del espesor (e/2)',
                          criterio: 'Perfectamente nivelado para evitar la trabazón.',
                        },
                        {
                          icon: RoadIcons.steel,
                          param: 'Tipo de acero',
                          medida: 'Acero liso AL-220',
                          criterio: 'Permite el movimiento libre por dilatación térmica.',
                        },
                      ].map((row) => (
                        <tr key={row.param}>
                          <td>
                            <span className="road-param">
                              <span className="road-param-icon">{row.icon}</span>
                              {row.param}
                            </span>
                          </td>
                          <td className="road-td-accent">{row.medida}</td>
                          <td className="road-td-muted">{row.criterio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Datos técnicos - solo Trelizas */}
          {product.id === '09' && (
            <section className="road-data-section product-content-section">
              <div className="section-header">
                <h2 className="section-title">Medidas y presentación</h2>
                <span className="section-subtitle">TRELIZAS — MEDIDAS COMERCIALES</span>
              </div>

              <div className="road-data-grid road-data-grid-single">
                <div className="road-card">
                  <div className="road-ref-row">
                    <div className="road-ref-item">
                      <span className="road-ref-icon">{RoadIcons.steel}</span>
                      <div>
                        <span className="road-ref-label">Material</span>
                        <span className="road-ref-value"><strong>ATR 600</strong> nervurado</span>
                      </div>
                    </div>
                    <div className="road-ref-item">
                      <span className="road-ref-icon">{RoadIcons.spacing}</span>
                      <div>
                        <span className="road-ref-label">Largos comerciales</span>
                        <span className="road-ref-value"><strong>8 m</strong> y <strong>12 m</strong></span>
                      </div>
                    </div>
                    <div className="road-ref-item">
                      <span className="road-ref-icon">{RoadIcons.norm}</span>
                      <div>
                        <span className="road-ref-label">Presentación</span>
                        <span className="road-ref-value">Paquetes de <strong>10, 8 o 6</strong> un.</span>
                      </div>
                    </div>
                  </div>

                  <table className="road-table road-table-dims road-table-trelizas">
                    <thead>
                      <tr>
                        <th rowSpan={2}>Designación</th>
                        <th rowSpan={2}>Peso <span className="road-th-unit">(kg/pieza)</span></th>
                        <th rowSpan={2}>Altura <span className="road-th-unit">(cm)</span></th>
                        <th rowSpan={2}>Largo <span className="road-th-unit">(m)</span></th>
                        <th rowSpan={2}>Un./paquete</th>
                        <th colSpan={3} className="road-th-group">Diámetros <span className="road-th-unit">(mm)</span></th>
                      </tr>
                      <tr>
                        <th>Barra superior</th>
                        <th>Diagonal</th>
                        <th>Barra inferior</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['TG8 L', '5,88', '8', '8', '10', '6,0', '4,2', '4,2'],
                        ['TG12 R', '12,2', '12', '12', '8', '6,0', '4,2', '6,0'],
                        ['TG16 R', '14,02', '16', '12', '6', '7,0', '4,2', '6,0'],
                      ].map((row) => (
                        <tr key={row[0]}>
                          <td className="road-td-accent">{row[0]}</td>
                          {row.slice(1).map((cell, i) => (
                            <td key={i} className="road-td-mono">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

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
                    <span className="feature-icon">{getFeatureIcon(feature)}</span>
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
              <h3 className="cta-title">{product.cta?.title || '¿Necesita más información?'}</h3>
              <p className="cta-description">
                {product.cta?.description ||
                  'Nuestro equipo técnico está disponible para asesorarlo sobre este producto'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="cta-button primary" style={{ maxWidth: '25%' }} onClick={() => navigate('/contacto')}>
                  <span className="cta-text">{product.cta?.button || 'Solicitar información'}</span>
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