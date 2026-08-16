/* ════════════════════════════════════════════════════════════════
   Renderizador de textos editables de la página principal (index.html):
   bienvenida, horarios de servicio, mensaje del pastor, sana doctrina
   y misiones. Lee web/content/inicio.json (editable desde /admin).
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

  function iconoClase(icono, fallback) {
    var val = (icono || "").trim();
    if (!val) return fallback || "fa-star";
    return val.indexOf("fa-") === 0 ? val : "fa-" + val;
  }

  function getPath(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, obj);
  }

  function renderHorarios(horarios) {
    if (!horarios) return;
    var grid = document.querySelector("#horarios .horarios-grid");
    if (!grid) return;
    grid.innerHTML = (horarios.servicios || [])
      .map(function (s) {
        var featured = s.destacado ? " horario-card--featured" : "";
        return (
          '<div class="horario-card' + featured + '">' +
          '<div class="horario-icon"><i class="fas ' + esc(iconoClase(s.icono, "fa-church")) + '"></i></div>' +
          '<div class="horario-dia">' + esc(s.dia) + "</div>" +
          '<div class="horario-nombre">' + esc(s.nombre) + "</div>" +
          '<div class="horario-hora">' + esc(s.hora) + "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderPastorParrafos(parrafos) {
    var cont = document.querySelector('[data-render="pastor.parrafos"]');
    if (!cont) return;
    cont.innerHTML = (parrafos || [])
      .map(function (p) {
        return "<p>" + esc(p) + "</p>";
      })
      .join("");
  }

  function renderMisionesPuntos(puntos) {
    var cont = document.querySelector("#misiones .misiones-list");
    if (!cont) return;
    cont.innerHTML = (puntos || [])
      .map(function (p) {
        return '<li><i class="fas fa-check-circle"></i> ' + esc(p) + "</li>";
      })
      .join("");
  }

  function fillFields(data) {
    document.querySelectorAll("[data-field]").forEach(function (el) {
      var val = getPath(data, el.getAttribute("data-field"));
      if (val != null) el.textContent = val;
    });
  }

  function init() {
    fetch("content/inicio.json", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("No se pudo cargar el contenido");
        return r.json();
      })
      .then(function (data) {
        fillFields(data);
        renderHorarios(data.horarios);
        renderPastorParrafos(data.pastor && data.pastor.parrafos);
        renderMisionesPuntos(data.misiones && data.misiones.puntos);
      })
      .catch(function (err) {
        console.warn("Contenido dinámico de la página principal no disponible:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
