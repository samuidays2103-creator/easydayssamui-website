/* ============================================
   EASY DAYS SAMUI — Main JavaScript
   Navigation, Language, Animations, Gallery
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initLangSwitch();
  initScrollAnimations();
  initLightbox();
});

/* ---------- Sticky Header Shadow ---------- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ---------- Mobile Navigation ---------- */
function initMobileNav() {
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');
  if (!btn || !nav || !header) return;

  function closeMenu() {
    nav.classList.remove('nav--open');
    btn.classList.remove('hamburger--open');
    header.classList.remove('header--menu-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    btn.classList.toggle('hamburger--open', isOpen);
    header.classList.toggle('header--menu-open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav--open') &&
        !nav.contains(e.target) && !btn.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ---------- Language Switcher ---------- */
function initLangSwitch() {
  const saved = localStorage.getItem('ed-lang') || 'en';
  setLanguage(saved);

  document.querySelectorAll('.lang-switch__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
      localStorage.setItem('ed-lang', lang);
    });
  });
}

function setLanguage(lang) {
  // Toggle active button
  document.querySelectorAll('.lang-switch__btn').forEach(btn => {
    btn.classList.toggle('lang-switch__btn--active', btn.dataset.lang === lang);
  });

  // Toggle content visibility
  document.querySelectorAll('[data-lang]').forEach(el => {
    if (el.classList.contains('lang-switch__btn')) return; // skip buttons
    el.style.display = el.dataset.lang === lang ? '' : 'none';
  });

  // Update text via data attributes
  document.querySelectorAll('[data-en][data-ru]').forEach(el => {
    el.textContent = el.dataset[lang] || el.dataset.en;
  });

  document.documentElement.lang = lang;
}

/* ---------- Scroll Animations ---------- */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ---------- Lightbox for Gallery ---------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const img = lightbox.querySelector('img');

  document.querySelectorAll('.gallery__item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      if (src) {
        img.src = src;
        lightbox.classList.add('lightbox--open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('lightbox--open')) {
      lightbox.classList.remove('lightbox--open');
      document.body.style.overflow = '';
    }
  });
}
