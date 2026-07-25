/* ════════════════════════════════════════════════════════════════
   Renderizador de contenido editable de la página de Anuncios.
   Lee web/content/anuncios.json (que edita el panel /admin) y dibuja
   TODAS las secciones: peticiones, programación de oración, jueves,
   madres, provisión, redes, consolación y agenda.
   No requiere build: corre en el navegador.
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

  // Convierte "310 272 4597" o "573229059423" en un enlace tel válido.
  function telHref(valor) {
    var d = String(valor || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.length === 10) d = "57" + d;
    return "tel:+" + d;
  }

  function getPath(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, obj);
  }

  // Colores del ícono en la tabla de programación, según el ícono elegido.
  var COLOR_ICONO = {
    "fa-heart": "#e91e63",
    "fa-person": "#3B7DD8",
    "fa-bolt": "#E07B39",
    "fa-church": "var(--lima)"
  };

  var RED_ICONO = {
    youtube: "fa-youtube",
    facebook: "fa-facebook-f",
    instagram: "fa-instagram",
    whatsapp: "fa-whatsapp"
  };

  /* ---- Secciones tipo lista ---- */

  function renderPeticiones(lista) {
    var cont = document.querySelector("#peticiones .cards-grid");
    if (!cont) return;
    cont.innerHTML = (lista || [])
      .map(function (p) {
        return (
          '<div class="prayer-card">' +
          '<div class="prayer-card-icon"><i class="fas ' + esc(iconoClase(p.icono, "fa-hands-praying")) + '"></i></div>' +
          "<h3>" + esc(p.titulo) + "</h3>" +
          "<p>" + esc(p.descripcion) + "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderProgramacion(prog) {
    if (!prog) return;
    var tbody = document.querySelector("#programacion .prayer-table tbody");
    if (tbody) {
      tbody.innerHTML = (prog.horario || [])
        .map(function (r) {
          var icono = iconoClase(r.icono, "fa-church");
          var color = COLOR_ICONO[icono] || "var(--lima)";
          return (
            "<tr>" +
            '<td><i class="fas ' + esc(icono) + '" style="color:' + esc(color) + ';margin-right:.4rem"></i> <strong>' + esc(r.ministerio) + "</strong></td>" +
            "<td>" + esc(r.dia) + "</td>" +
            "<td>" + esc(r.hora) + "</td>" +
            "<td>" + esc(r.lider) + "</td>" +
            "</tr>"
          );
        })
        .join("");
    }
    var grid = document.querySelector("#programacion .leaders-grid");
    if (grid) {
      grid.innerHTML = (prog.lideres || [])
        .map(function (l) {
          var tels = (l.telefonos || [])
            .map(function (t) {
              return '<a href="' + esc(telHref(t)) + '"><i class="fas fa-phone"></i> ' + esc(t) + "</a>";
            })
            .join("");
          return (
            '<div class="leader-contact">' +
            '<i class="fas ' + esc(iconoClase(l.icono, "fa-person")) + ' leader-icon"></i>' +
            "<div>" +
            "<strong>" + esc(l.grupo) + "</strong>" +
            "<span>" + esc(l.nombre) + "</span>" +
            tels +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    }
  }

  function renderProvision(lista) {
    var cont = document.querySelector("#provision .provision-grid");
    if (!cont) return;
    cont.innerHTML = (lista || [])
      .map(function (p) {
        var color = "provision-icon--" + (p.color || "orange");
        var tel = p.telefono
          ? '<a href="' + esc(telHref(p.telefono)) + '"><i class="fas fa-phone"></i> ' + esc(p.telefono) + "</a>"
          : "";
        return (
          '<div class="provision-card">' +
          '<div class="provision-icon ' + esc(color) + '"><i class="fas ' + esc(iconoClase(p.icono, "fa-hands-holding-heart")) + '"></i></div>' +
          "<h3>" + esc(p.titulo) + "</h3>" +
          "<p>" + esc(p.descripcion) + "</p>" +
          '<div class="provision-contact">' +
          '<i class="fas fa-user"></i>' +
          "<span>" + esc(p.contacto) + "</span>" +
          tel +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderRedes(lista) {
    var cont = document.querySelector("#redes .redes-grid");
    if (!cont) return;
    cont.innerHTML = (lista || [])
      .map(function (r) {
        var tipo = r.tipo || "youtube";
        return (
          '<a href="' + esc(r.url) + '" target="_blank" rel="noopener" class="red-card red-card--' + esc(tipo) + '">' +
          '<div class="red-icon"><i class="fab ' + esc(RED_ICONO[tipo] || "fa-globe") + '"></i></div>' +
          "<h3>" + esc(r.titulo) + "</h3>" +
          "<p>" + esc(r.descripcion) + "</p>" +
          '<span class="red-cta">' + esc(r.cta || "Ver más") + ' <i class="fas fa-arrow-right"></i></span>' +
          "</a>"
        );
      })
      .join("");
  }

  function renderConsolacionContactos(lista) {
    var cont = document.querySelector("#consolacion .consolacion-contacts");
    if (!cont) return;
    cont.innerHTML = (lista || [])
      .map(function (c) {
        return (
          '<a href="' + esc(telHref(c.telefono)) + '" class="consolacion-contact-btn">' +
          '<i class="fas fa-phone"></i>' +
          "<div>" +
          "<strong>" + esc(c.nombre) + "</strong>" +
          "<span>" + esc(c.telefono) + "</span>" +
          "</div>" +
          "</a>"
        );
      })
      .join("");
  }

  function renderEventos(lista) {
    var cont = document.querySelector("#eventos .eventos-grid");
    if (!cont) return;
    var COLORES = ["evento-icon--sport", "evento-icon--camp", "evento-icon--cafe", "evento-icon--men"];
    cont.innerHTML = (lista || [])
      .map(function (e, i) {
        var color = COLORES[i % COLORES.length];
        var desc = e.descripcion ? '<p class="evento-desc">' + esc(e.descripcion) + "</p>" : "";
        var etiqueta = e.etiqueta ? '<div class="evento-badge"><i class="fas fa-rotate"></i> ' + esc(e.etiqueta) + "</div>" : "";
        var cuando = e.cuando ? '<div class="evento-detail"><i class="fas fa-calendar-check"></i><span>' + esc(e.cuando) + "</span></div>" : "";
        var lugar = e.lugar ? '<div class="evento-detail"><i class="fas fa-church"></i><span>' + esc(e.lugar) + "</span></div>" : "";
        return (
          '<div class="evento-card">' +
          etiqueta +
          '<div class="evento-icon-wrap ' + color + '"><i class="fas ' + esc(iconoClase(e.icono, "fa-calendar-check")) + '"></i></div>' +
          '<div class="evento-body">' +
          "<h3>" + esc(e.titulo) + "</h3>" +
          desc + cuando + lugar +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---- Campos sueltos (texto/enlaces) via data-field / data-tel ---- */

  function fillFields(data) {
    document.querySelectorAll("[data-field]").forEach(function (el) {
      var val = getPath(data, el.getAttribute("data-field"));
      if (val != null) el.textContent = val;
    });
    document.querySelectorAll("[data-tel]").forEach(function (el) {
      var val = getPath(data, el.getAttribute("data-tel"));
      if (val != null) el.setAttribute("href", telHref(val));
    });
  }

  function init() {
    fetch("content/anuncios.json", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("No se pudo cargar el contenido");
        return r.json();
      })
      .then(function (data) {
        renderPeticiones(data.peticiones);
        renderProgramacion(data.programacion);
        renderProvision(data.provision);
        renderRedes(data.redes);
        renderConsolacionContactos(data.consolacion && data.consolacion.contactos);
        renderEventos(data.eventos);
        fillFields(data);
      })
      .catch(function (err) {
        console.warn("Contenido dinámico de anuncios no disponible:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
