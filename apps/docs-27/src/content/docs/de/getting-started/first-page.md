---
title: "Erstelle deine erste Seite"
description: "Schritt-für-Schritt-Anleitung zum Erstellen und Veröffentlichen von Inhalten in XOOPS, einschließlich Formatierung, Medieneinbettung und Veröffentlichungsoptionen"
---

# Erstellen Sie Ihre erste Seite in XOOPS

Erfahren Sie, wie Sie Ihren ersten Inhalt in XOOPS erstellen, formatieren und veröffentlichen.

## XOOPS-Inhalte verstehen

### Was ist eine Seite/ein Beitrag?

In XOOPS wird Inhalt durch Module verwaltet. Die häufigsten Inhaltstypen sind:

| Typ | Beschreibung | Anwendungsfall |
|---|---|---|
| **Seite** | Statischer Inhalt | Über uns, Kontakt, Dienstleistungen |
| **Beitrag/Artikel** | Zeitgestempelter Inhalt | Nachrichten, Blogbeiträge |
| **Kategorie** | Inhaltsorganisation | Zugehörige Inhalte gruppieren |
| **Kommentar** | Benutzerfeedback | Besucherinteraktion ermöglichen |

Diese Anleitung behandelt das Erstellen einer grundlegenden Seite/eines Artikels mit dem Standard-Inhaltsmodul von XOOPS.

## Zugriff auf den Inhalts-Editor

### Aus dem Admin-Panel

1. Melden Sie sich beim Admin-Panel an: `http://your-domain.com/xoops/admin/`
2. Navigieren Sie zu **Content > Pages** (oder Ihr Inhaltsmodul)
3. Klicken Sie auf „Neue Seite hinzufügen" oder „Neuer Beitrag"

### Frontend (falls aktiviert)

Wenn XOOPS so konfiguriert ist, dass Frontend-Inhaltserstellung erlaubt ist:

1. Melden Sie sich als registrierter Benutzer an
2. Gehen Sie zu Ihrem Profil
3. Suchen Sie nach der Option „Inhalt einreichen"
4. Führen Sie die gleichen Schritte unten durch

## Inhalts-Editor Oberfläche

Der Inhalts-Editor umfasst:

```
┌─────────────────────────────────────┐
│ Content Editor                      │
├─────────────────────────────────────┤
│                                     │
│ Title: [________________]           │
│                                     │
│ Category: [Dropdown]                │
│                                     │
│ [B I U] [Link] [Image] [Video]    │
│ ┌─────────────────────────────────┐ │
│ │ Enter your content here...      │ │
│ │                                 │ │
│ │ You can use HTML tags here      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Description (Meta): [____________]  │
│                                     │
│ [Publish] [Save Draft] [Preview]   │
│                                     │
└─────────────────────────────────────┘
```

## Schritt-für-Schritt-Anleitung: Erstellen Sie Ihre erste Seite

### Schritt 1: Zugriff auf den Inhalts-Editor

1. Klicken Sie im Admin-Panel auf **Content > Pages**
2. Klicken Sie auf **„Neue Seite hinzufügen"** oder **„Erstellen"**
3. Der Inhalts-Editor wird angezeigt

### Schritt 2: Seitentitel eingeben

Geben Sie Ihren Seitennamen in das Feld „Titel" ein:

```
Title: Welcome to Our Website
```

Best Practices für Titel:
- Klar und aussagekräftig
- Schlüsselwörter einschließen, wenn möglich
- Idealerweise 50-60 Zeichen
- GROSSBUCHSTABEN vermeiden (schwer zu lesen)
- Spezifisch sein (nicht „Seite 1")

### Schritt 3: Kategorie auswählen

Wählen Sie, wo Sie diesen Inhalt organisieren möchten:

```
Category: [Dropdown ▼]
```

Die Optionen könnten umfassen:
- Allgemein
- Nachrichten
- Blog
- Ankündigungen
- Dienstleistungen

Wenn Kategorien nicht vorhanden sind, bitten Sie den Administrator, diese zu erstellen.

### Schritt 4: Schreiben Sie Ihren Inhalt

Klicken Sie in den Inhalts-Editor und geben Sie Ihren Text ein.

#### Grundlegende Textformatierung

Verwenden Sie die Editor-Symbolleiste:

| Schaltfläche | Aktion | Ergebnis |
|---|---|---|
| **B** | Fettdruck | **Fettgedruckter Text** |
| *I* | Kursiv | *Kursiver Text* |
| <u>U</u> | Unterstrichen | <u>Unterstrichener Text</u> |

#### Using HTML

XOOPS allows safe HTML tags. Common examples:

```html
<!-- Paragraphs -->
<p>This is a paragraph.</p>

<!-- Headings -->
<h1>Main Heading</h1>
<h2>Subheading</h2>

<!-- Lists -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Bold and Italic -->
<strong>Bold text</strong>
<em>Italic text</em>

<!-- Links -->
<a href="https://example.com">Link text</a>

<!-- Line breaks -->
<br>

<!-- Horizontal rule -->
<hr>
```

#### Sichere HTML-Beispiele

**Empfohlene Tags:**
- Absätze: `<p>`, `<br>`
- Überschriften: `<h1>` bis `<h6>`
- Text: `<strong>`, `<em>`, `<u>`
- Listen: `<ul>`, `<ol>`, `<li>`
- Links: `<a href="">`
- Blockquoten: `<blockquote>`
- Tabellen: `<table>`, `<tr>`, `<td>`

**Vermeiden Sie diese Tags** (möglicherweise sind sie aus Sicherheitsgründen deaktiviert):
- Scripts: `<script>`
- Styles: `<style>`
- Iframes: `<iframe>` (es sei denn, es ist konfiguriert)
- Formulare: `<form>`, `<input>`

### Schritt 5: Bilder hinzufügen

#### Option 1: Bild-URL einfügen

Mit dem Editor:

1. Klicken Sie auf die Schaltfläche **Bild einfügen** (Bildsymbol)
2. Geben Sie die Bild-URL ein: `https://example.com/image.jpg`
3. Geben Sie den Alt-Text ein: „Bildbeschreibung"
4. Klicken Sie auf „Einfügen"

HTML-Äquivalent:

```html
<img src="https://example.com/image.jpg" alt="Description">
```

#### Option 2: Bild hochladen

1. Laden Sie das Bild zunächst in XOOPS hoch:
   - Gehen Sie zu **Content > Media Manager**
   - Laden Sie Ihr Bild hoch
   - Kopieren Sie die Bild-URL

2. Fügen Sie es im Inhalts-Editor mit einer URL ein (obige Schritte)

#### Best Practices für Bilder

- Verwenden Sie angemessene Dateigrößen (optimieren Sie Bilder)
- Verwenden Sie aussagekräftige Dateinamen
- Binden Sie immer Alt-Text ein (Barrierefreiheit)
- Unterstützte Formate: JPG, PNG, GIF, WebP
- Empfohlene Breite: 600-800 Pixel für Inhalte

### Schritt 6: Medien einbetten

#### Video von YouTube einbetten

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

Ersetzen Sie `VIDEO_ID` durch die YouTube-Video-ID.

**So finden Sie die YouTube-Video-ID:**
1. Öffnen Sie das Video auf YouTube
2. URL ist: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Kopieren Sie die ID (Zeichen nach `v=`)

#### Video von Vimeo einbetten

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### Schritt 7: Metabeschreibung hinzufügen

Geben Sie im Feld „Beschreibung" eine kurze Zusammenfassung ein:

```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```

**Best Practices für Metabeschreibung:**
- 150-160 Zeichen
- Wichtige Schlüsselwörter einschließen
- Sollten Inhalte genau zusammenfassen
- Verwendet in Suchmaschinenergebnissen
- Machen Sie es verlockend (Benutzer sehen dies)

### Schritt 8: Veröffentlichungsoptionen konfigurieren

#### Veröffentlichungsstatus

Wählen Sie den Veröffentlichungsstatus:

```
Status: ☑ Published
```

Optionen:
- **Published:** Für die Öffentlichkeit sichtbar
- **Draft:** Nur für Administratoren sichtbar
- **Pending Review:** Wartet auf Genehmigung
- **Archived:** Versteckt, aber behalten

#### Sichtbarkeit

Legen Sie fest, wer diesen Inhalt sehen kann:

```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```

#### Veröffentlichungsdatum

Legen Sie fest, wann der Inhalt sichtbar wird:

```
Publish Date: [Date Picker] [Time]
```

Lassen Sie es auf „Jetzt" eingestellt, um es sofort zu veröffentlichen.

#### Kommentare zulassen

Aktivieren oder deaktivieren Sie Besucher-Kommentare:

```
Allow Comments: ☑ Yes
```

Falls aktiviert, können Besucher Feedback geben.

### Schritt 9: Speichern Sie Ihren Inhalt

Mehrere Speicheroptionen:

```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```

- **Publish Now:** Sofort sichtbar machen
- **Save as Draft:** Vorerst privat halten
- **Schedule:** Zu einem zukünftigen Datum/Zeit veröffentlichen
- **Preview:** Vorschau ansehen, bevor Sie speichern

Klicken Sie auf Ihre Wahl:

```
Click [Publish Now]
```

### Schritt 10: Überprüfen Sie Ihre Seite

Nach der Veröffentlichung überprüfen Sie Ihren Inhalt:

1. Gehen Sie zur Homepage Ihrer Website
2. Navigieren Sie zu Ihrem Inhaltsbereich
3. Suchen Sie nach Ihrer neu erstellten Seite
4. Klicken Sie, um sie anzuzeigen
5. Überprüfen Sie:
   - [ ] Inhalt wird korrekt angezeigt
   - [ ] Bilder erscheinen
   - [ ] Formatierung sieht gut aus
   - [ ] Links funktionieren
   - [ ] Titel und Beschreibung korrekt

## Example: Complete Page

### Title
```
Getting Started with XOOPS
```

### Content
```html
<h2>Welcome to XOOPS</h2>

<p>XOOPS is a powerful and flexible open-source
content management system. It allows you to build
dynamic websites with minimal technical knowledge.</p>

<h3>Key Features</h3>

<ul>
  <li>Easy content management</li>
  <li>User registration and management</li>
  <li>Module system for extensibility</li>
  <li>Flexible theming system</li>
  <li>Built-in security features</li>
</ul>

<h3>Getting Started</h3>

<p>Here are the first steps to get your XOOPS site
running:</p>

<ol>
  <li>Configure basic settings</li>
  <li>Create your first page</li>
  <li>Set up user accounts</li>
  <li>Install additional modules</li>
  <li>Customize appearance</li>
</ol>

<img src="https://example.com/xoops-logo.jpg"
  alt="XOOPS Logo">

<p>For more information, visit
<a href="https://xoops.org/">xoops.org</a></p>
```

### Meta Description
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```

## Erweiterte Inhaltsfunktionen

### Verwenden des WYSIWYG-Editors

Wenn ein Rich-Text-Editor installiert ist:

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

Klicken Sie auf Schaltflächen, um Text ohne HTML zu formatieren.

### Einfügen von Code-Blöcken

Codebeispiele anzeigen:

```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```

### Erstellen von Tabellen

Organisieren Sie Daten in Tabellen:

```html
<table border="1" cellpadding="5">
  <tr>
    <th>Feature</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Flexible</td>
    <td>Easy to customize</td>
  </tr>
  <tr>
    <td>Powerful</td>
    <td>Full-featured CMS</td>
  </tr>
</table>
```

### Inline-Zitate

Wichtigen Text hervorheben:

```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```

## SEO Best Practices für Inhalte

Optimieren Sie Ihren Inhalt für Suchmaschinen:

### Titel
- Hauptschlüsselwort einschließen
- 50-60 Zeichen
- Einzigartig pro Seite

### Metabeschreibung
- Schlüsselwort natürlich einfügen
- 150-160 Zeichen
- Überzeugend und genau

### Inhalt
- Schreiben Sie natürlich, vermeiden Sie Keyword-Stuffing
- Verwenden Sie Überschriften (h2, h3) angemessen
- Beziehen Sie interne Links zu anderen Seiten ein
- Verwenden Sie Alt-Text auf allen Bildern
- Streben Sie 300+ Wörter für Artikel an

### URL-Struktur
- Halten Sie URLs kurz und aussagekräftig
- Verwenden Sie Bindestriche zum Trennen von Wörtern
- Vermeiden Sie Sonderzeichen
- Beispiel: `/about-our-company`

## Verwalten Sie Ihren Inhalt

### Vorhandene Seite bearbeiten

1. Gehen Sie zu **Content > Pages**
2. Suchen Sie Ihre Seite in der Liste
3. Klicken Sie auf **Bearbeiten** oder den Seitentitel
4. Vornehmen von Änderungen
5. Klicken Sie auf **Aktualisieren**

### Seite löschen

1. Gehen Sie zu **Content > Pages**
2. Suchen Sie Ihre Seite
3. Klicken Sie auf **Löschen**
4. Bestätigen Sie das Löschen

### Veröffentlichungsstatus ändern

1. Gehen Sie zu **Content > Pages**
2. Suchen Sie die Seite, klicken Sie auf **Bearbeiten**
3. Ändern Sie den Status im Dropdown-Menü
4. Klicken Sie auf **Aktualisieren**

## Fehlerbehebung bei der Inhaltserstellung

### Inhalt wird nicht angezeigt

**Symptom:** Veröffentlichte Seite wird auf der Website nicht angezeigt

**Lösung:**
1. Überprüfen Sie den Veröffentlichungsstatus: Sollte „Veröffentlicht" sein
2. Überprüfen Sie das Veröffentlichungsdatum: Sollte aktuell oder in der Vergangenheit liegen
3. Überprüfen Sie die Sichtbarkeit: Sollte „Öffentlich" sein
4. Cache löschen: Admin > Tools > Clear Cache
5. Überprüfen Sie Berechtigungen: Benutzergruppe muss Zugriff haben

### Formatierung funktioniert nicht

**Symptom:** HTML-Tags oder Formatierung erscheinen als Text

**Lösung:**
1. Überprüfen Sie, ob HTML in den Moduleinstellungen aktiviert ist
2. Verwenden Sie die richtige HTML-Syntax
3. Schließen Sie alle Tags: `<p>Text</p>`
4. Verwenden Sie nur zulässige Tags
5. Verwenden Sie HTML-Entitäten: `&lt;` für `<`, `&amp;` für `&`

### Bilder werden nicht angezeigt

**Symptom:** Bilder zeigen das Symbol für fehlendes Bild

**Lösung:**
1. Überprüfen Sie, ob die Bild-URL korrekt ist
2. Überprüfen Sie, ob die Bilddatei vorhanden ist
3. Überprüfen Sie die richtigen Berechtigungen für das Bild
4. Versuchen Sie stattdessen, das Bild in XOOPS hochzuladen
5. Überprüfen Sie auf externes Blockieren (möglicherweise CORS erforderlich)

### Zeichencodierungsprobleme

**Symptom:** Sonderzeichen erscheinen als Kauderwelsch

**Lösung:**
1. Speichern Sie die Datei als UTF-8-Codierung
2. Stellen Sie sicher, dass das Seiten-Charset UTF-8 ist
3. Im HTML-Head hinzufügen: `<meta charset="UTF-8">`
4. Vermeiden Sie das Kopieren von Word (verwenden Sie Klartext)

## Best Practices für Inhalts-Workflow

### Empfohlener Prozess

1. **Zuerst im Editor schreiben:** Admin-Inhalts-Editor verwenden
2. **Vorschau vor der Veröffentlichung:** Klicken Sie auf die Vorschau-Schaltfläche
3. **Metadaten hinzufügen:** Füllen Sie Titel, Beschreibung, Tags aus
4. **Zuerst als Entwurf speichern:** Als Entwurf speichern, um Arbeitsverluste zu vermeiden
5. **Finale Überprüfung:** Vor dem Veröffentlichen erneut lesen
6. **Veröffentlichen:** Klicken Sie auf Veröffentlichen, wenn Sie bereit sind
7. **Überprüfen:** Überprüfen Sie auf der Live-Website
8. **Bei Bedarf bearbeiten:** Schnelle Korrektionen vornehmen

### Versionskontrolle

Halten Sie immer Sicherungen vor:

1. **Vor großen Änderungen:** Als neue Version oder Sicherung speichern
2. **Alte Inhalte archivieren:** Unpublizierte Versionen behalten
3. **Ihre Entwürfe datieren:** Verwenden Sie klare Benennung: „Page-Draft-2025-01-28"

## Veröffentlichen mehrerer Seiten

Erstellen Sie eine Inhaltsstrategie:

```
Homepage
├── About Us
├── Services
│   ├── Service 1
│   ├── Service 2
│   └── Service 3
├── Blog
│   ├── Article 1
│   ├── Article 2
│   └── Article 3
├── Contact
└── FAQ
```

Erstellen Sie Seiten, um dieser Struktur zu folgen.

## Nächste Schritte

Nach dem Erstellen Ihrer ersten Seite:

1. Richten Sie Benutzerkonten ein
2. Installieren Sie zusätzliche Module
3. Erkunden Sie Admin-Funktionen
4. Konfigurieren Sie Einstellungen
5. Optimieren Sie mit Leistungseinstellungen

---

**Tags:** #content-creation #pages #publishing #editor

**Related Articles:**
- Admin-Panel-Overview
- Managing-Users
- Installing-Modules
- ../Configuration/Basic-Configuration
