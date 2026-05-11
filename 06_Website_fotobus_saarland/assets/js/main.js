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

// Formspree-Formular: AJAX-Submit + Redirect auf eigene Danke-Seite
// (Hintergrund: Formspree Free leitet nicht auf _next um → wir machen es manuell)
function initFormspreeForm() {
  const form = document.querySelector('form[action*="formspree.io"]');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.textContent : '';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet …';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        window.location.href = '/danke.html';
      } else {
        // Formspree-Validierungsfehler oder Quota überschritten
        const data = await response.json().catch(() => ({}));
        const msg = data.errors && data.errors.length
          ? data.errors.map(err => err.message).join(', ')
          : 'Beim Senden ist ein Fehler aufgetreten. Bitte rufen Sie uns direkt unter 0800 80 44 200 an.';
        alert(msg);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
      }
    } catch (err) {
      alert('Netzwerkfehler beim Senden. Bitte rufen Sie uns direkt unter 0800 80 44 200 an oder versuchen Sie es später erneut.');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
    }
  });
}

// Cookie-Hinweis-Banner — zeigt sich beim ersten Besuch, speichert Choice in localStorage
function initCookieBanner() {
  const STORAGE_KEY = 'fotobus_cookie_consent';

  // Falls User schon bestätigt hat → Banner nicht zeigen
  try {
    if (localStorage.getItem(STORAGE_KEY)) return;
  } catch (e) {
    // localStorage nicht verfügbar (z.B. Private Mode) → Banner immer anzeigen
  }

  // Banner-Element bauen
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie-Hinweis');
  banner.innerHTML = `
    <p class="cookie-banner__text">
      <span class="cookie-banner__icon">🍪</span>
      <strong>Datenschutz-Hinweis:</strong> Diese Webseite verwendet ausschließlich <strong>technisch notwendige Cookies</strong> (Sicherheit &amp; Grundfunktion). Wir setzen <strong>keine Tracking-Cookies</strong>, keine Analyse-Tools, keine Werbung. Mehr Infos in unserer <a href="/datenschutz.html">Datenschutzerklärung</a>.
    </p>
    <div class="cookie-banner__actions">
      <button type="button" class="cookie-banner__btn" aria-label="Hinweis bestätigen und schließen">Verstanden</button>
    </div>
  `;

  document.body.appendChild(banner);

  // Animation: Banner einblenden (mit kleinem Delay damit Animation greift)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => banner.classList.add('is-visible'));
  });

  // Button-Click: Banner schließen + Choice speichern
  const btn = banner.querySelector('.cookie-banner__btn');
  btn.addEventListener('click', () => {
    banner.classList.remove('is-visible');
    setTimeout(() => banner.remove(), 400);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ verstanden: true, timestamp: Date.now() }));
    } catch (e) {
      // ignorieren — kein localStorage verfügbar
    }
  });
}

// WhatsApp-Button: schwebt unten rechts auf allen Seiten
function initWhatsAppButton() {
  if (document.querySelector('.whatsapp-float')) return;

  // Festnetznummer im internationalen Format ohne Leerzeichen/+ (für wa.me)
  const phoneNumber = '496813720122';
  const message = encodeURIComponent('Hallo, ich interessiere mich für den Feuerwehr-Fotobus für mein Event. Datum: ');
  const link = `https://wa.me/${phoneNumber}?text=${message}`;

  const btn = document.createElement('a');
  btn.href = link;
  btn.className = 'whatsapp-float';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'WhatsApp-Chat starten');
  btn.title = 'Schnell anfragen via WhatsApp';
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  `;
  document.body.appendChild(btn);
}

// Mobile-Menü Toggle
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initFormspreeForm();
  initWhatsAppButton();
  initCookieBanner();
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
