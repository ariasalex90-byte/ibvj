/* ════════════════════════════════════════════════════════════════
   Renderizador de los datos de contacto del pie de página (footer).
   Lee web/content/contacto.json (editable desde /admin) y actualiza
   correo, dirección y enlaces de redes en index.html y anuncios.html.
════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  function init() {
    fetch("content/contacto.json", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("No se pudo cargar el contacto");
        return r.json();
      })
      .then(function (c) {
        var redes = c.redes || {};

        // Correo: texto (en el span) y enlace mailto (en el enlace <a>) por separado.
        document.querySelectorAll('[data-contact="email"]').forEach(function (el) {
          if (c.email != null) el.textContent = c.email;
        });
        document.querySelectorAll("[data-contact-mail]").forEach(function (el) {
          if (c.email != null) el.setAttribute("href", "mailto:" + c.email);
        });

        // Dirección: solo texto.
        document.querySelectorAll('[data-contact="direccion"]').forEach(function (el) {
          if (c.direccion != null) el.textContent = c.direccion;
        });

        // Enlaces de redes (solo el href; el texto/ícono queda igual).
        document.querySelectorAll("[data-contact-href]").forEach(function (el) {
          var key = el.getAttribute("data-contact-href");
          if (redes[key]) el.setAttribute("href", redes[key]);
        });

        // Enlaces de WhatsApp basados en el número.
        if (c.whatsapp) {
          document.querySelectorAll("[data-contact-wa]").forEach(function (el) {
            el.setAttribute("href", "https://wa.me/" + c.whatsapp);
          });
        }
      })
      .catch(function (err) {
        console.warn("Contenido de contacto no disponible:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
