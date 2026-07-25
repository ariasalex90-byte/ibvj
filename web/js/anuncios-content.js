/* ════════════════════════════════════════════════════════════════
   Renderizador de contenido editable de Anuncios
   Lee web/content/anuncios.json (que edita el panel /admin) y dibuja
   las tarjetas de "Peticiones de Oración" y "Agenda".
   No requiere build: corre en el navegador.
════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var COLORES_EVENTO = [
    "evento-icon--sport",
    "evento-icon--camp",
    "evento-icon--cafe",
    "evento-icon--men"
  ];

  // Escapa texto para evitar romper el HTML con caracteres especiales.
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
    // Permite escribir "fa-users" o "users"
    return val.indexOf("fa-") === 0 ? val : "fa-" + val;
  }

  function renderPeticiones(lista, cont) {
    cont.innerHTML = (lista || [])
      .map(function (p) {
        return (
          '<div class="prayer-card">' +
          '<div class="prayer-card-icon"><i class="fas ' + esc(iconoClase(p.icono)) + '"></i></div>' +
          "<h3>" + esc(p.titulo) + "</h3>" +
          "<p>" + esc(p.descripcion) + "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderEventos(lista, cont) {
    cont.innerHTML = (lista || [])
      .map(function (e, i) {
        var color = COLORES_EVENTO[i % COLORES_EVENTO.length];
        var desc = e.descripcion
          ? '<p class="evento-desc">' + esc(e.descripcion) + "</p>"
          : "";
        var etiqueta = e.etiqueta
          ? '<div class="evento-badge"><i class="fas fa-rotate"></i> ' + esc(e.etiqueta) + "</div>"
          : "";
        var cuando = e.cuando
          ? '<div class="evento-detail"><i class="fas fa-calendar-check"></i><span>' + esc(e.cuando) + "</span></div>"
          : "";
        var lugar = e.lugar
          ? '<div class="evento-detail"><i class="fas fa-church"></i><span>' + esc(e.lugar) + "</span></div>"
          : "";
        return (
          '<div class="evento-card">' +
          etiqueta +
          '<div class="evento-icon-wrap ' + color + '"><i class="fas ' + esc(iconoClase(e.icono)) + '"></i></div>' +
          '<div class="evento-body">' +
          "<h3>" + esc(e.titulo) + "</h3>" +
          desc +
          cuando +
          lugar +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function init() {
    var contPeticiones = document.querySelector("#peticiones .cards-grid");
    var contEventos = document.querySelector("#eventos .eventos-grid");

    fetch("content/anuncios.json", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("No se pudo cargar el contenido");
        return r.json();
      })
      .then(function (data) {
        if (contPeticiones) renderPeticiones(data.peticiones, contPeticiones);
        if (contEventos) renderEventos(data.eventos, contEventos);
      })
      .catch(function (err) {
        // Si falla la carga, se deja el contenido de respaldo del HTML.
        console.warn("Contenido dinámico de anuncios no disponible:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
