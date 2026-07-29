// Actualiza el <meta name="theme-color"> para que la UI de Safari iOS
// (status bar / barras del navegador) acompañe el color de la superficie visible.
export function setThemeColor(color) {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", color);
}
