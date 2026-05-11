# Bus Face-Blur — Selektive Gesichtserkennung mit Apple Vision

Dieses Swift-Tool nutzt **Apple's Vision Framework** (neural-network-basierte Gesichtserkennung)
und **Core Image** für selektiven Blur. Funktioniert offline, hardware-beschleunigt auf
Apple Silicon (M1/M2/M3/M4), und schafft locker 4K-Videos.

## Was es macht

1. Liest dein Video Frame für Frame
2. Erkennt **alle Gesichter** mit Apple's neuronaler Netz-AI (VNDetectFaceRectanglesRequest)
3. Blurrt **nur die Gesichts-Regionen** (mit Box-Erweiterung um Haare/Hals zu erfassen)
4. **Temporal Smoothing**: Wenn ein Gesicht in einem Frame mal nicht erkannt wird,
   übernimmt es die Position aus den ±8 benachbarten Frames → keine "Aussetzer"
5. Schreibt das Ergebnis als web-optimiertes H.264 MP4

Vorteile gegenüber OpenCV/Haar-Cascade:
- Erkennt Gesichter auch bei Bewegungs-Unschärfe
- Erkennt schräg gehaltene und teilweise verdeckte Gesichter
- Erkennt Gesichter über große Auflösungs-Bereiche (von Closeup bis Wimmelbild)
- Funktioniert sogar bei 4K ohne Performance-Probleme

## Verwendung — der einfachste Weg (ohne Xcode-Projekt)

### 1. Terminal öffnen

`/Programme/Dienstprogramme/Terminal.app`

### 2. In den Script-Ordner wechseln

```bash
cd "/Users/macbook/Documents/Claude/Projects/Feuerwehr Fotobox/_swift_face_blur"
```

### 3. Script ausführen

```bash
swift BusFaceBlur.swift \
  "/Users/macbook/Documents/Claude/Projects/Feuerwehr Fotobox/08_Events_Referenzen/zeitraffer_Fotobus_so_viele_passen_rein.MP4" \
  "/Users/macbook/Documents/Claude/Projects/Feuerwehr Fotobox/06_Website_fotobus_saarland/assets/video/bus-zeitraffer.mp4"
```

Das war's. Während es läuft siehst du im Terminal Fortschritts-Meldungen wie:

```
🎬 Input:  zeitraffer_Fotobus_so_viele_passen_rein.MP4
📤 Output: bus-zeitraffer.mp4
⚙️  Blur Radius: 28.0 · Box Expand: 1.55x · Temporal Window: ±8 frames
📐 Video: 1920×1080 @ 29.97fps

🔍 Pass 1/2: Gesichtserkennung...
  Frame 30: 4 Gesichter
  Frame 60: 6 Gesichter
  ...
✓ Detection: 431 Frames, 1284 Gesichter gesamt, 4.2s

🎨 Pass 2/2: Selektiver Blur + Encoding...
  Frame 30/431 gerendert
  ...
✓ Render: 431 Frames, 6.8s

📊 Fertig! Output: 8.3 MB
📂 Gespeichert unter: /.../bus-zeitraffer.mp4
```

Auf M-Chip läuft das in ~15 Sekunden für ein 14-Sekunden-Video in 1080p durch.

## Verwendung — mit Xcode-Projekt (falls du es kompilieren willst)

Du musst kein Xcode-Projekt anlegen, weil `swift run` direkt funktioniert. Aber falls du willst:

1. **Xcode öffnen** → Neues Projekt → macOS → "Command Line Tool" → Sprache: Swift
2. **Project Name:** `BusFaceBlur`
3. Den Inhalt von `BusFaceBlur.swift` in `main.swift` kopieren
4. **Build** drücken (Cmd+B)
5. Im Terminal das kompilierte Binary aufrufen — Pfad in Xcode unter "Product → Show Build Folder in Finder"

Für deinen Use-Case ist `swift BusFaceBlur.swift` direkt im Terminal aber einfacher.

## Anpassbare Parameter

Am Anfang von `BusFaceBlur.swift` kannst du folgende Werte ändern:

| Parameter | Default | Bedeutung |
|---|---|---|
| `BLUR_RADIUS` | 28.0 | Wie stark der Blur ist. Höher = stärker. 15-40 ist sinnvoll. |
| `BOX_EXPAND` | 1.20 | Wie viel größer die Blur-Region vs. erkanntes Gesicht. 1.0 = exakt, 1.2 = eng (≈ 1.4× Gesichts-Fläche), 1.55 = großzügig (≈ 2.4× Gesichts-Fläche). |
| `TEMPORAL_WINDOW` | 8 | Anzahl der Frames vor/nach für Smoothing. Höher = robuster gegen Aussetzer, aber Blur "klebt" länger. |
| `MIN_FACE_CONFIDENCE` | 0.5 | Mindest-Konfidenz fürs Detection-Modell. Höher = weniger False Positives, aber evtl. echte Faces verpasst. |

Nach Änderung einfach das Script nochmal laufen lassen.

## Wenn etwas nicht klappt

**"swift: command not found":**
Xcode-Command-Line-Tools installieren:
```bash
xcode-select --install
```

**Video-Datei wird nicht gefunden:**
Pfad in Anführungszeichen setzen wenn er Leerzeichen enthält:
```bash
swift BusFaceBlur.swift "/path with spaces/input.mp4" "/output.mp4"
```

**Ein Gesicht wird übersehen:**
- `TEMPORAL_WINDOW` erhöhen (z.B. auf 12-15)
- `MIN_FACE_CONFIDENCE` senken (z.B. auf 0.3)

**Blur ist zu stark / zu schwach:**
- `BLUR_RADIUS` anpassen (15-40)

**Box ist zu groß / zu klein:**
- `BOX_EXPAND` anpassen (1.3 für eng, 1.8 für extra Sicherheit)

## Lizenz

Frei verwendbar im Rahmen des Fotobus-Saarland-Projekts. Apple Vision Framework
benötigt macOS 10.13+ und ist Teil des Systems (keine externe Lizenz nötig).
