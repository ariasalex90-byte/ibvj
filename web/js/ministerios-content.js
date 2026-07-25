/* ════════════════════════════════════════════════════════════════
   Renderizador de la sección "Nuestros ministerios" (página principal).
   Lee web/content/ministerios.json (que edita el panel /admin) y dibuja
   las tarjetas. Permite subir fotos y editar nombres sin tocar código.
════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function iconoClase(icono) {
    var val = (icono || "").trim();
    if (!val) return "fa-star";
    return val.indexOf("fa-") === 0 ? val : "fa-" + val;
  }

  function render(lista, cont) {
    cont.innerHTML = (lista || [])
      .map(function (m) {
        var foto = esc(m.foto || "");
        var nombre = esc(m.nombre || "");
        return (
          '<article class="ministerio-card">' +
          '<img src="' + foto + '" alt="Ministerio ' + nombre + '" loading="lazy" />' +
          '<div class="ministerio-overlay"></div>' +
          '<div class="ministerio-info">' +
          '<i class="fas ' + esc(iconoClase(m.icono)) + ' ministerio-icon"></i>' +
          "<h3>" + nombre + "</h3>" +
          "<p>" + esc(m.descripcion || "") + "</p>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function init() {
    var cont = document.querySelector(".ministerios-grid");
    if (!cont) return;

    fetch("content/ministerios.json", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("No se pudo cargar el contenido");
        return r.json();
      })
      .then(function (data) {
        render(data.ministerios, cont);
      })
      .catch(function (err) {
        console.warn("Contenido dinámico de ministerios no disponible:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
