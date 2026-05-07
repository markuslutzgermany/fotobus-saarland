// Event-Slider (Auto-Rotation + Dots + Pfeile + Touch)
function initSlider() {
  const slider = document.querySelector('.event-slider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.slide');
  const dots = slider.querySelectorAll('.slider-dots button');
  const prev = slider.querySelector('.slider-arrow.prev');
  const next = slider.querySelector('.slider-arrow.next');
  let current = 0;
  let timer;

  const show = (i) => {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    current = i;
  };
  const go = (n) => {
    const i = (current + n + slides.length) % slides.length;
    show(i);
  };
  const start = () => { timer = setInterval(() => go(1), 5000); };
  const stop = () => clearInterval(timer);

  if (prev) prev.addEventListener('click', () => { go(-1); stop(); start(); });
  if (next) next.addEventListener('click', () => { go(1); stop(); start(); });
  dots.forEach((d, idx) => d.addEventListener('click', () => { show(idx); stop(); start(); }));

  // Touch-Swipe
  let startX = 0;
  slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { go(dx < 0 ? 1 : -1); stop(); start(); }
  }, { passive: true });

  show(0);
  start();
}

// Mobile-Menü Toggle
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  // Smooth scroll for anchor links + close mobile menu
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nav.classList.contains('open')) nav.classList.remove('open');
      }
    });
  });
});
