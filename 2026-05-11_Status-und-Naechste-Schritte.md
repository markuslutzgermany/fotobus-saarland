# 🚒 Fotobus Saarland — Status & Nächste Schritte

**Datum:** 11. Mai 2026
**Session-Inhalt:** Komplette Webseiten-Optimierung + SEO + Google Business Profile

---

## ✅ Was heute fertig wurde

### Webseite (fotobus.saarland)

- **Karneval-2017-Throwback-Video** auf `der-bus.html` eingebaut (16,7 MB, 1280×720, mit Poster-Bild)
- **Anlässe-Seite komplett überarbeitet**: 6 Sektionen mit Emotions-Bildern, alternierendes Desktop-Layout, Quick-Nav-Anker, 2 Mini-Testimonials (Antje Löwenbrück + Bernd Niemeyer), neue Sektion „Tag der offenen Tür"
- **Instagram-Reel auf der Startseite eingebettet**: Drone-Shot Brand-Reveal, Caption-Zitat, Follow-Button, 1.100 Aufrufe-Stat
- **Performance-Optimierung**: 47 WebP-Versionen aller Bilder (30–60 % kleiner als JPG), `<picture>`-Tags mit JPG-Fallback, `loading="lazy"` für below-the-fold, Hero-Preload pro Seite
- **Favicon-Set** komplett: 16/32/48/192/512 px PNG + Apple-Touch-Icon (180×180) + `favicon.ico` im Root
- **Open-Graph-Bild** (1200×630) für Social Sharing — Bus + roter Teppich + ★★★★★
- **Meta-Tags** auf allen 9 Seiten: OG + Twitter-Cards mit page-spezifischen Titles/Descriptions
- **Datenschutzerklärung** erweitert um Instagram-Embed-Klausel (Meta Platforms Ireland Ltd., EU-US Data Privacy Framework)
- **`.gitignore`** angelegt — Event-Rohdaten und `.DS_Store` werden nicht mehr in Git getrackt

### Google Search Console

- **Sitemap.xml** aktualisiert (FAQ-Seite ergänzt, alle 6 indexierungs-relevanten URLs)
- **Sitemap neu eingereicht** in GSC (vorher fehlte die FAQ-Seite)
- **Indexierung beantragt** für alle 6 Hauptseiten:
  - `https://fotobus.saarland/` (war schon indexiert, Re-Crawl beantragt)
  - `der-bus.html`, `anlaesse.html`, `preise.html`, `faq.html`, `kontakt.html`
- **FAQ Rich-Snippets validiert**: „1 gültiges Element erkannt" ✓ — sobald FAQ-Seite indexiert, erscheinen Fragen als ausklappbare Karten in Google-Suchergebnissen

### Google Business Profile

- **Beschreibung aktualisiert**: „4 Schritten" (vorher 5), „12 Sekunden" (vorher 30), „DSGVO-konforme Online-Galerie inklusive", „Mitarbeiterveranstaltung" als Suchterm
- **Brand-Reveal-Post veröffentlicht**: „🚒 Neuer Name. Gleiche Leidenschaft." + „Mehr erfahren"-Button → `/der-bus.html`
- **7 neue Service-Tags aktiviert**: Hochzeit Fotobus Feuerwehr, Firmenfeier & Sommerfest, Messe & B2B-Event, Stadt & Vereinsfeste, Behörden & Tag der offenen Tür, Privatfeier & Geburtstag, **Vermietung von Fotoautomaten** (die offizielle „Photo Booth Rental"-Kategorie)
- **8 Services mit Ab-Preisen** versehen:
  - Hochzeit und Verlobung: Ab 990 €
  - Veranstaltungen und Partys: Ab 990 €
  - Vermietung von Fotoautomaten: Ab 990 €
  - Firmenfeier & Sommerfest: Ab 990 €
  - Privatfeier & Geburtstag: Ab 990 €
  - Stadt & Vereinsfeste: Ab 1.590 €
  - Behörden & Tag der offenen Tür: Ab 1.590 €
  - Messe & B2B-Event: Ab 1.590 €

---

## ⏳ Was in den nächsten Wochen passiert (automatisch)

- **24–72 h**: Google crawlt die 6 Hauptseiten und indexiert sie → erste Ergebnisse in `site:fotobus.saarland`-Suche sichtbar
- **~1 Woche**: FAQ-Rich-Snippets erscheinen in Suchergebnissen mit ausklappbaren Fragen
- **~24 h**: GBP-Review fertig → Beschreibung + 8 Services + neue Tags sind im Knowledge Panel sichtbar
- **2–4 Wochen**: Erste Rankings für lokale Keywords („feuerwehr fotobus saarbrücken", „fotobox firmenevent saarland")
- **1–2 Monate**: Stabile Positionen für Spezial-Keywords; Cloudflare-LCP-Statistik verbessert sich (durch WebP + Lazy-Load)

---

## 📋 Vorschlagsliste für später (nicht akut)

### Foto-Strategie für GBP

Pro Monat **3–5 neue Fotos** in den „Fotos"-Bereich des Google Business Profile hochladen.
Vorrat ist da — alle Bilder liegen in `06_Website_fotobus_saarland/assets/img/` (Originale + 1600er/800er-Versionen):

- `bus-01` bis `bus-05` — Bus-Außenansichten
- `event-01-gaeste`, `event-02-led-teppich`, `event-03-empfang`, `event-04-moebel-ehrmann`, `event-05-roter-teppich`, `event-06-vip-empfang` — Event-Bilder
- `werbeflaeche-links`, `werbeflaeche-rechts` — Branding-Möglichkeiten
- `hero-preise`, `vip-empfang-detail` — Premium-Aufnahmen
- `karneval-2015-poster` — Throwback

Reicht für **2–3 Monate** Foto-Material ohne neue Aufnahmen. GBP belohnt aktive Profile mit besseren Rankings.

### Q&A im GBP anlegen

5 vorbereitete Fragen + Antworten ins Profil eintragen (GBP → „Fragen & Antworten" → „Frage stellen"):

| Frage | Antwort |
|---|---|
| Wie lange braucht der Sofortprint? | 12 Sekunden vom Auslöser bis zum fertigen 10×15-Print in der Hand. |
| Was kostet der Fotobus? | Eventabend-Paket 990 € (4 h), Tagesevent-Paket 1.590 € (8 h). Zusatzstunde 150 €. Anfahrt im Frei-Bereich inkl. |
| Braucht der Bus Stromanschluss? | Nein — eigene autarke Stromversorgung für 6+ Stunden. Bei längeren Tagesevents 230 V empfohlen. |
| Wie weit fahrt ihr? | Servicegebiet bis 200 km Umkreis von Saarbrücken. Saarland, Trier, Luxemburg, Kaiserslautern, Frankfurt. |
| Wie viele Personen passen rein? | Bis zu 12 Personen — perfekt für Familien- und Gruppenfotos. |

### Reviews ankurbeln

GBP → „Um Rezensionen bitten" → der direkte Rezensions-Link wird angezeigt.
Diesen Link nach jedem Event an die Kunden schicken (per WhatsApp / E-Mail / SMS).

**Beispiel-Vorlage für die Nachricht:**

> Hallo {Name},
>
> vielen Dank für die schöne Buchung — wir hoffen, der Fotobus hat euch und euren Gästen viel Freude gemacht!
>
> Wenn ihr noch 30 Sekunden habt, würden wir uns über eine Google-Rezension freuen:
> {LINK aus „Um Rezensionen bitten"}
>
> Jede Bewertung hilft, dass uns andere Veranstalter im Saarland finden — danke! 🚒
>
> Beste Grüße
> Markus Lutz · Fotobus Saarland

Ziel: **1–2 neue 5-Sterne-Bewertungen pro Monat**. Das katapultiert das Profil im Local Pack nach vorne.

---

## 📊 Geschätzte Wirkung der heutigen Aktion

| Metric | Vor Heute | Erwartung nach 4 Wochen |
|---|---|---|
| Indexierte Seiten | 1 (Homepage) | 6 (alle Hauptseiten) |
| Rich Snippets in Suche | 0 | FAQ-Karten + Schema.org |
| Cloudflare LCP „Schlecht" | 75 % (Mini-Sample) | < 40 % (bei mehr Traffic) |
| Bandwidth pro Seite | ~1,5 MB | ~700–900 KB |
| GBP-Services mit Preisen | 0 | 8 |
| GBP-Posts in den letzten 30 Tagen | 0 | 1 (Brand-Reveal) |
| OG-Sharing-Vorschauen | Default-Bus-Bild | Premium-Hero mit ★★★★★ |
| Mobile Home-Bildschirm-Icon | generisch | dein Logo |

---

## 📁 Wichtige Dateien

| Was | Wo |
|---|---|
| Webseite-Quellcode | `06_Website_fotobus_saarland/` |
| Bus-Bilder + WebP-Varianten | `06_Website_fotobus_saarland/assets/img/` |
| Karneval-Video (web) | `06_Website_fotobus_saarland/assets/video/karneval-2015.mp4` |
| Karneval-Video (raw) | `08_Events_Referenzen/2015_Archiv_Alter-Bus/01_Roh/` |
| Möbel-Ehrmann-Material | `08_Events_Referenzen/2026-04_Möbel-Ehrmann_Tag-der-offenen-Tür/` |
| Deutsche-Bank-Material | `08_Events_Referenzen/2026-04_Deutsche-Bank_Mitarbeiterveranstaltung/` |
| Swift-Face-Blur-Script | `_swift_face_blur/BusFaceBlur.swift` |
| Diese Status-Datei | `2026-05-11_Status-und-Naechste-Schritte.md` |

---

## 🎯 Wo die Webseite live ist

- **Hauptseite:** https://fotobus.saarland/
- **Der Bus** (mit Karneval-Throwback-Video): https://fotobus.saarland/der-bus.html
- **Anlässe** (mit 6 Bildern + 2 Testimonials): https://fotobus.saarland/anlaesse.html
- **Preise**: https://fotobus.saarland/preise.html
- **FAQ** (mit Schema.org Rich Snippets): https://fotobus.saarland/faq.html
- **Kontakt** (mit Formspree + WhatsApp): https://fotobus.saarland/kontakt.html
- **Datenschutz** (neu mit Instagram-Klausel): https://fotobus.saarland/datenschutz.html
- **Sitemap**: https://fotobus.saarland/sitemap.xml

---

## 💪 Bottom Line

Die Webseite hat jetzt **alle technischen + inhaltlichen Standards einer professionellen B2B-Marketing-Seite**:
SEO (Schema.org, OG, Twitter, Sitemap, Rich Snippets), Performance (WebP, Lazy-Load, Preload), DSGVO (Cookie-Banner, Datenschutzerklärung mit Instagram-Klausel), Marketing (Anlässe-Seite mit Bildern + Testimonials, Brand-Reveal-Post, Karneval-2017-Pionier-Beweis, Instagram-Embed mit Follow-CTA), Mobile (Favicon-Set, Apple-Touch-Icon, responsive Grids), Trust (Testimonials, Sterne, 24+ Google-Bewertungen).

**Wenn Deutsche Bank, Möbel Ehrmann oder Volksbank-Marketing den Auftritt prüft — sie finden nichts zum Meckern.**

In 1–4 Wochen werden die Ergebnisse messbar.

---

*Erstellt am 11.05.2026 nach einer 4-Stunden-Tour-de-Force-Session.*
