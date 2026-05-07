# fotobus.saarland — Statische Website

**Stack:** Reines HTML5 + CSS3 + JavaScript, kein Build-Step nötig
**Hosting (geplant):** Cloudflare Pages
**Versionskontrolle (geplant):** GitHub
**Stand:** 07.05.2026

## Lokale Vorschau

Im Terminal in diesen Ordner wechseln:

```bash
cd "/Users/macbook/Documents/Claude/Projects/Feuerwehr Fotobox/06_Website_fotobus_saarland"
python3 -m http.server 8000
```

Dann im Browser: `http://localhost:8000`

## Struktur

```
06_Website_fotobus_saarland/
├── index.html          ← Startseite
├── der-bus.html        ← Detail-Seite Fahrzeug
├── anlaesse.html       ← Anlässe (Hochzeit, Firma, Stadtfest, Behörden)
├── preise.html         ← Preisübersicht
├── kontakt.html        ← Anfrageformular
├── robots.txt          ← SEO
├── sitemap.xml         ← SEO
├── README.md           ← Diese Datei
├── (impressum.html)    ← TODO: rechtlich Pflicht
├── (datenschutz.html)  ← TODO: rechtlich Pflicht
└── assets/
    ├── css/style.css       ← Globales Stylesheet
    ├── js/main.js          ← Mobile-Menü + Smooth-Scroll
    └── img/
        ├── logo.png        ← Master-Logo (2600px)
        ├── logo-small.png  ← Kompakt-Logo (800px)
        ├── favicon-source.png
        ├── bus-01.jpg ... bus-05.jpg     ← Originale (groß)
        ├── bus-01-1600.jpg ... -800.jpg  ← Responsive Versionen
```

## Noch zu erledigen

- [ ] **Impressum erstellen** — Pflicht in DE; mit ladungsfähiger Adresse, GF, USt-IdNr, Handelsregister
- [ ] **Datenschutzerklärung** — DSGVO-konform, idealerweise via Generator (z. B. e-recht24)
- [ ] **Telefonnummer** ins Kontaktformular und Schema.org einsetzen
- [ ] **Formular-Backend** anbinden (Formspree, Netlify Forms oder eigener PHP-Endpunkt)
- [ ] **Favicon** in mehreren Größen generieren (16, 32, 192, 512 px)
- [ ] **Open-Graph-Bilder** optimieren (1200×630 für Social Sharing)
- [ ] **Cookie-Consent** falls Tracking eingebaut wird
- [ ] **Google Search Console** anbinden (sobald live)
- [ ] **Google Business Profile** für „Fotobus Saarland" anlegen

## Deployment-Plan

1. Lokal testen
2. Git-Repo initialisieren, auf GitHub pushen
3. Cloudflare Pages mit Repo verbinden
4. Custom Domain `fotobus.saarland` aktivieren
5. SSL prüfen (automatisch durch Cloudflare)
6. Erste Indexierung anstoßen via Search Console
