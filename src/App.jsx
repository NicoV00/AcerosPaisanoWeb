import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

// Lazy load all pages to reduce main bundle size
const Home = lazy(() => import("./pages/home/Home").then(m => ({ default: m.Home })));
const About = lazy(() => import("./pages/about/About").then(m => ({ default: m.About })));
const CatalogueNew = lazy(() => import("./pages/catalogue/CatalogueNew"));
const Contact = lazy(() => import("./pages/contact/Contact").then(m => ({ default: m.Contact })));
const ProductDetail = lazy(() => import("./pages/ProductDetail/ProductDetail"));
const NotFound = lazy(() => import("./pages/notfound/Notfound"));
import Lenis from "@studio-freight/lenis";

function App() {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });

    let rafId;

    function raf(time) {
      if (lenis) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Google Tag Manager - DEFERRED LOAD (3.5s delay)
  // This helps minimize main thread work on mobile during the first s to 3s of loading
  useEffect(() => {
    const timer = setTimeout(() => {
      // Create script tag for gtag.js
      const script = document.createElement('script');
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-CPCFV23NH9";
      document.head.appendChild(script);

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-CPCFV23NH9');

      console.log("Analytics deferred loading complete");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <Suspense fallback={<div style={{ backgroundColor: '#000', height: '100vh', width: '100vw' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre-nosotros" element={<About />} />
          <Route path="/productos" element={<CatalogueNew />} />
          <Route path="/productos-y-servicios" element={<CatalogueNew />} />
          <Route path="/contacto" element={<Contact />} />

          {/* Páginas de productos específicos */}
          <Route path="/mallas-electrosoldadas" element={<ProductDetail serviceSlug="mallas-electrosoldadas" />} />
          <Route path="/mallas-plegadas" element={<ProductDetail serviceSlug="mallas-plegadas" />} />
          <Route path="/mallas-galvanizadas" element={<ProductDetail serviceSlug="mallas-galvanizadas" />} />
          <Route path="/hierro-cortado-y-doblado" element={<ProductDetail serviceSlug="hierro-cortado-y-doblado" />} />
          <Route path="/barras-conformadas" element={<ProductDetail serviceSlug="barras-conformadas" />} />
          <Route path="/barras-lisas" element={<ProductDetail serviceSlug="barras-lisas" />} />

          <Route path="/productos/:slug" element={<ProductDetail />} />

          {/* RUTA 404: Captura cualquier ruta que no exista */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <SpeedInsights />
      <Analytics />
    </div>
  );
}

export default App;
