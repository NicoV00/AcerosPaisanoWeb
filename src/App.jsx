import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/home/Home";
import { About } from "./pages/about/About";
import CatalogueNew from "./pages/catalogue/CatalogueNew";
import { Contact } from "./pages/contact/Contact";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Lenis from "@studio-freight/lenis";
import NotFound from "./pages/notfound/Notfound"; // Importamos la página 404
import { SpeedInsights } from "@vercel/speed-insights/react";

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

  return (
    <div className="App">
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
      <SpeedInsights />
    </div>
  );
}

export default App;
