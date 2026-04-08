/* ═══════════════════════════════════════════════════════════════
   IBVJ — main.js
   ─────────────────────────────────────────────────────────────
   1. Navbar: transparente → sólida al hacer scroll
   2. Menú mobile: hamburger toggle
   3. Cerrar menú al hacer clic en un link
   4. Scroll suave + link activo en nav
   5. Animaciones de entrada (Intersection Observer)
   6. Año en footer
   7. Rotación de videos del hero
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 0. Scroll progress bar ─────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });


  /* ── 1. Navbar scroll ────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // estado inicial


  /* ── 2. Menú mobile ──────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    // Evitar scroll de body cuando el menú está abierto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });


  /* ── 3. Cerrar menú al hacer clic en un link ─────────────── */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });


  /* ── 4. Link activo en nav (Intersection Observer) ───────── */
  const sections    = document.querySelectorAll('section[id], footer[id]');
  const navAnchors  = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.classList.toggle(
              'active',
              a.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(section => sectionObserver.observe(section));


  /* ── 5. Animaciones de entrada ───────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Delay escalonado para elementos múltiples en la misma sección
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Las cards de ministerios y horarios también animan de forma escalonada
  const staggerItems = document.querySelectorAll(
    '.ministerio-card, .horario-card, .doctrina-galeria figure'
  );
  staggerItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 80}ms`;
    item.classList.add('reveal');
    revealObserver.observe(item);
  });


  /* ── 6. Año dinámico en footer ───────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ── 7. Rotación de videos del hero ──────────────────────── */
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    const videos = [
      'assets/videos/church-banner-1.mp4',
      'assets/videos/church-banner-2.mp4',
      'assets/videos/church-banner-3.mp4',
    ];
    let currentVideo = 0;

    heroVideo.addEventListener('ended', () => {
      currentVideo = (currentVideo + 1) % videos.length;
      heroVideo.src = videos[currentVideo];
      heroVideo.play().catch(() => {});
    });

    // Si el video no puede reproducirse (sin soporte o sin archivo), mostrar fallback
    heroVideo.addEventListener('error', () => {
      heroVideo.style.display = 'none';
    });
  }


  /* ── 8. Videos — carga en featured player al hacer clic ─── */
  const featuredIframe = document.getElementById('featuredIframe');
  const featuredTitle  = document.getElementById('featuredTitle');
  const featuredDesc   = document.getElementById('featuredDesc');

  document.querySelectorAll('.video-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    const loadVideo = () => {
      const id    = card.dataset.videoId;
      const title = card.querySelector('.video-info p')?.textContent || '';

      // Actualizar featured player
      if (featuredIframe) {
        featuredIframe.src = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`;
        featuredIframe.title = title;
      }
      if (featuredTitle) featuredTitle.textContent = title;
      if (featuredDesc)  featuredDesc.textContent  = 'Reproduciendo ahora';

      // Marcar tarjeta activa
      document.querySelectorAll('.video-card').forEach(c => c.classList.remove('active-video'));
      card.classList.add('active-video');

      // Scroll suave al player
      const featured = document.getElementById('videoFeatured');
      if (featured) {
        const navH = document.getElementById('navbar')?.offsetHeight ?? 60;
        const top  = featured.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };

    card.addEventListener('click', loadVideo);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadVideo(); }
    });
  });

  // "Ver más" button
  const verMasBtn = document.getElementById('verMasVideos');
  if (verMasBtn) {
    verMasBtn.addEventListener('click', () => {
      document.querySelectorAll('.video-extra').forEach(el => {
        el.classList.add('visible');
        revealObserver.observe(el);
      });
      verMasBtn.style.display = 'none';
    });
  }


  /* ── 9. Scroll suave ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar')?.offsetHeight ?? 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
