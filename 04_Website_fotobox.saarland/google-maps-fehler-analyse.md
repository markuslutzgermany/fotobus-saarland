# Google Maps Fehler – Analyse & Untersuchung
**Website:** https://www.fotobox.saarland  
**Datum:** 05.05.2026  

---

## Das Problem

Auf der Homepage gibt es im Kontakt-Abschnitt (`#kontakt`) eine Google Maps-Karte, die folgenden Fehler anzeigt:

> **„Hoppla! Ein Fehler ist aufgetreten. Google Maps wurde auf dieser Seite nicht richtig geladen."**

Der genaue JavaScript-Fehler in der Browser-Konsole lautet:

```
InvalidKeyMapError
https://maps.googleapis.com/maps/api/js?key=AIzaSyBN-eNDx3XEzXi7Q2EAflAuyl_WMTCs0MM&ver=3.15.4
```

---

## Wichtige Erkenntnisse

### Zwei verschiedene API-Schlüssel im Einsatz
| | API-Schlüssel |
|---|---|
| **Neuer (korrekter) Schlüssel** | `AIzaSyDGWmLlqLGryDzqWFdA-_BpdXK4g1xjN_8` |
| **Alter (ungültiger) Schlüssel** | `AIzaSyBN-eNDx3XEzXi7Q2EAflAuyl_WMTCs0MM` |

Der neue Schlüssel ist korrekt in **Elementor** eingetragen – aber der **alte Schlüssel** wird trotzdem noch von einer anderen Quelle geladen und verursacht den Fehler.

### Wer lädt den alten Schlüssel?
Der WordPress-Script-Handle des problematischen Skripts lautet:

```
flatsome-maps-js
```

Das bedeutet: **Das Flatsome-Theme (Version 3.15.4)** ist die Quelle, die den alten API-Schlüssel lädt – **nicht** Elementor.

### Seitenstruktur
- Der Kontakt-Bereich ist **kein eigener Unterlink** (`/kontakt/`), sondern ein **Anker-Link** (`/#kontakt`) auf der Homepage
- Die Homepage ist die Seite **„Start"** mit der WordPress **Post-ID: 193**
- Die Seite ist mit **Elementor** gebaut, enthält aber intern **Flatsome UX Builder Shortcodes** (z.B. `[ux_slider]`, `[ux_image]`) in Elementor-Textwidgets
- Aktives Theme: **Flatsome Child** (Elterntheme: Flatsome 3.15.4)

---

## Was bereits geprüft wurde (und ausgeschlossen ist)

| Ort | Ergebnis |
|---|---|
| **Elementor → Einstellungen → Integrationen → Google Maps API Key** | ✅ Neuer Key ist korrekt eingetragen |
| **Post-Inhalt & Meta von Seite ID 193** | ❌ Alter Key **nicht** gefunden |
| **WordPress-Optionen (options.php)** | ❌ Alter Key **nicht** gefunden |
| **Alle 436 Customizer-Einstellungen (theme_mods)** | ❌ Alter Key **nicht** gefunden |
| **Child-Theme functions.php** | ❌ Leer, nur Standard-Kommentar |
| **Flatsome „Advanced"-Panel** | ❌ Zugriff verweigert |
| **Elementor-Datenmodell (JS)** | ❌ Alter Key **nicht** gefunden |
| **Flatsome-Shortcode PHP-Datei** | ❌ Zugriff verweigert |

---

## Wo der Schlüssel wahrscheinlich gespeichert ist

Der alte Key kommt aus dem **Flatsome-Theme-Code** selbst. Flatsome registriert Google Maps über:

```php
wp_enqueue_script('flatsome-maps', '//maps.googleapis.com/maps/api/js?key=' . get_theme_mod('gmap_api_key', ''), [], FLATSOME_VERSION);
```

Das Problem: Obwohl wir alle 436 Customizer-Einstellungen durchsucht haben, war der Key **nicht** darunter. Der Schlüssel könnte in der **WordPress-Datenbank** (`wp_options` Tabelle) unter einem Eintrag gespeichert sein, der nicht als Customizer-Einstellung registriert ist.

---

## Nächste Schritte beim nächsten Versuch

### Option 1 – Datenbank direkt durchsuchen (empfohlen)
Über **phpMyAdmin** oder ein Datenbank-Tool folgenden SQL-Befehl ausführen:
```sql
SELECT option_name, option_value 
FROM wp_options 
WHERE option_value LIKE '%AIzaSyBN%';
```
Damit findet man genau in welcher Option der alte Schlüssel gespeichert ist.

### Option 2 – Plugin „Better Search Replace" installieren
1. WordPress Admin → Plugins → Neu hinzufügen → „Better Search Replace" installieren
2. Suchen: `AIzaSyBN-eNDx3XEzXi7Q2EAflAuyl_WMTCs0MM`
3. Ersetzen: `AIzaSyDGWmLlqLGryDzqWFdA-_BpdXK4g1xjN_8`
4. Alle Tabellen durchsuchen
5. ⚠️ Vorher Dry Run machen!

### Option 3 – FTP/cPanel-Zugang nutzen
Die Flatsome-Theme-Datei finden, die das Skript registriert (vermutlich `flatsome/inc/init.php` oder ähnlich) und dort den alten Key ersetzen oder die Quelle der Option identifizieren.

### Option 4 – WP-CLI (falls Serverzugang vorhanden)
```bash
wp option get theme_mods_flatsome-child
wp option get theme_mods_flatsome
wp search-replace 'AIzaSyBN-eNDx3XEzXi7Q2EAflAuyl_WMTCs0MM' 'AIzaSyDGWmLlqLGryDzqWFdA-_BpdXK4g1xjN_8' --all-tables --dry-run
```

---

## Technische Details der Website

| | |
|---|---|
| **URL** | https://www.fotobox.saarland |
| **CMS** | WordPress 6.9.4 (Update verfügbar) |
| **Theme** | Flatsome Child (Flatsome 3.15.4) |
| **Page Builder** | Elementor + Flatsome UX Builder Shortcodes |
| **Homepage Post-ID** | 193 |
| **Kontakt-Anker** | `/#kontakt` (kein separater Unterordner) |
| **Problematischer Script-Handle** | `flatsome-maps-js` |
| **Neuer API-Schlüssel** | `AIzaSyDGWmLlqLGryDzqWFdA-_BpdXK4g1xjN_8` |
| **Alter API-Schlüssel** | `AIzaSyBN-eNDx3XEzXi7Q2EAflAuyl_WMTCs0MM` |
