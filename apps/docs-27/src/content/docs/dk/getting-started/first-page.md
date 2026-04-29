---
title: "Oprettelse af din første side"
description: "Trin-for-trin guide til oprettelse og udgivelse af indhold i XOOPS, inklusive formatering, medieindlejring og udgivelsesmuligheder"
---

# Oprettelse af din første side i XOOPS

Lær, hvordan du opretter, formaterer og udgiver dit første stykke indhold i XOOPS.

## Forstå XOOPS indhold

### Hvad er en side/en post?

I XOOPS administreres indhold gennem moduler. De mest almindelige indholdstyper er:

| Skriv | Beskrivelse | Use Case |
|---|---|---|
| **Side** | Statisk indhold | Om os, Kontakt, Tjenester |
| **Indlæg/Artikel** | Tidsstemplet indhold | Nyheder, blogindlæg |
| **Kategori** | Organisering af indhold | Grupperelateret indhold |
| **Kommentar** | Brugerfeedback | Tillad besøgende interaktion |

Denne vejledning dækker oprettelse af en grundlæggende side/artikel ved hjælp af XOOPS' standardindholdsmodul.

## Adgang til indholdseditoren

### Fra Admin Panel

1. Log ind på admin panel: `http://your-domain.com/xoops/admin/`
2. Naviger til **Indhold > Sider** (eller dit indholdsmodul)
3. Klik på "Tilføj ny side" eller "Nyt indlæg"

### Frontend (hvis aktiveret)

Hvis din XOOPS er konfigureret til at tillade oprettelse af frontendindhold:

1. Log ind som registreret bruger
2. Gå til din profil
3. Se efter indstillingen "Send indhold".
4. Følg de samme trin nedenfor

## Content Editor Interface

Indholdseditoren inkluderer:

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

## Trin-for-trin guide: Oprettelse af din første side

### Trin 1: Få adgang til Content Editor

1. I administrationspanelet skal du klikke på **Indhold > Sider**
2. Klik på **"Tilføj ny side"** eller **"Opret"**
3. Du vil se indholdseditoren

### Trin 2: Indtast sidetitel

I feltet "Titel" skal du indtaste dit sidenavn:

```
Title: Welcome to Our Website
```

Bedste fremgangsmåder for titler:
- Klar og beskrivende
- Medtag søgeord, hvis det er muligt
- 50-60 tegn ideelt
- Undgå ALL CAPS (svært at læse)
- Vær specifik (ikke "Side 1")

### Trin 3: Vælg kategori

Vælg, hvor du vil organisere dette indhold:

```
Category: [Dropdown ▼]
```

Valgmuligheder kan omfatte:
- General
- Nyheder
- Blog
- Meddelelser
- Tjenester

Hvis der ikke findes kategorier, skal du bede administratoren om at oprette dem.

### Trin 4: Skriv dit indhold

Klik i indholdsredigeringsområdet, og skriv din tekst.

#### Grundlæggende tekstformatering

Brug editorens værktøjslinje:

| Knap | Handling | Resultat |
|---|---|---|
| **B** | Fed | **Fed tekst** |
| *jeg* | Kursiv | *Kursiv tekst* |
| <u>U</u> | Understregning | <u>Understreget tekst</u> |

#### Brug af HTML

XOOPS tillader sikre HTML-tags. Almindelige eksempler:

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

#### Eksempler på sikker HTML

**Anbefalede tags:**
- Afsnit: `<p>`, `<br>`
- Overskrifter: `<h1>` til `<h6>`
- Tekst: `<strong>`, `<em>`, `<u>`
- Lister: `<ul>`, `<ol>`, `<li>`
- Links: `<a href="">`
- Blokcitater: `<blockquote>`
- Tabeller: `<table>`, `<tr>`, `<td>`

**Undgå disse tags** (kan være deaktiveret af sikkerhedsmæssige årsager):
- Scripts: `<script>`
- Stilarter: `<style>`
- Iframes: `<iframe>` (medmindre konfigureret)
- Formularer: `<form>`, `<input>`

### Trin 5: Tilføj billeder

#### Mulighed 1: Indsæt billede URL

Brug af editoren:

1. Klik på knappen **Indsæt billede** (billedikon)
2. Indtast billede URL: `https://example.com/image.jpg`
3. Indtast alternativ tekst: "Beskrivelse af billede"
4. Klik på "Indsæt"

HTML svarende til:

```html
<img src="https://example.com/image.jpg" alt="Description">
```

#### Mulighed 2: Upload billede

1. Upload billede til XOOPS først:
   - Gå til **Indhold > Mediemanager**
   - Upload dit billede
   - Kopier billedet URL

2. Indsæt i indholdsredigering ved hjælp af URL (ovenfor trin)

#### Billedbedste praksis

- Brug passende filstørrelser (optimer billeder)
- Brug beskrivende filnavne
- Inkluder altid alternativ tekst (tilgængelighed)
- Understøttede formater: JPG, PNG, GIF, WebP
- Anbefalet bredde: 600-800 pixels for indhold

### Trin 6: Integrer medier

#### Integrer video fra YouTube

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

Erstat `VIDEO_ID` med YouTube video-id.

**For at finde YouTube video-id:**
1. Åbn video på YouTube
2. URL er: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Kopiér ID'et (tegn efter `v=`)

#### Integrer video fra Vimeo
```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### Trin 7: Tilføj metabeskrivelse

Tilføj en kort oversigt i feltet "Beskrivelse":

```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```

**Metabeskrivelses bedste fremgangsmåder:**
- 150-160 tegn
- Inkluder hovednøgleord
- Bør præcist opsummere indholdet
- Bruges i søgemaskineresultater
- Gør det overbevisende (brugere ser dette)

### Trin 8: Konfigurer udgivelsesindstillinger

#### Udgiv status

Vælg udgivelsesstatus:

```
Status: ☑ Published
```

Valgmuligheder:
- **Udgivet:** Synlig for offentligheden
- **Kladde:** Kun synlig for administratorer
- **Afventer gennemgang:** Afventer godkendelse
- **Arkiveret:** Skjult men gemt

#### Synlighed

Angiv, hvem der kan se dette indhold:

```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```

#### Udgivelsesdato

Indstil, hvornår indhold bliver synligt:

```
Publish Date: [Date Picker] [Time]
```

Lad være som "Nu" for at udgive med det samme.

#### Tillad kommentarer

Aktiver eller deaktiver besøgendes kommentarer:

```
Allow Comments: ☑ Yes
```

Hvis det er aktiveret, kan besøgende tilføje feedback.

### Trin 9: Gem dit indhold

Flere gemmemuligheder:

```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```

- **Udgiv nu:** Gør synlig med det samme
- **Gem som kladde:** Hold privat indtil videre
- **Tidsplan:** Udgiv på fremtidig dato/tidspunkt
- **Preview:** Se, hvordan det ser ud, før du gemmer

Klik på dit valg:

```
Click [Publish Now]
```

### Trin 10: Bekræft din side

Efter udgivelsen skal du bekræfte dit indhold:

1. Gå til din hjemmesides hjemmeside
2. Naviger til dit indholdsområde
3. Se efter din nyoprettede side
4. Klik for at se den
5. Tjek:
   - [ ] Indholdet vises korrekt
   - [ ] Billeder vises
   - [ ] Formatering ser godt ud
   - [ ] Links virker
   - [ ] Titel og beskrivelse korrekt

## Eksempel: Komplet side

### Titel
```
Getting Started with XOOPS
```

### Indhold
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

### Metabeskrivelse
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```

## Avancerede indholdsfunktioner

### Brug af WYSIWYG Editor

Hvis en Rich Text Editor er installeret:

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

Klik på knapperne for at formatere tekst uden HTML.

### Indsættelse af kodeblokke

Vis kodeeksempler:

```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```

### Oprettelse af tabeller

Organiser data i tabeller:

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

### Inline citater

Fremhæv vigtig tekst:

```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```

## SEO Bedste praksis for indhold

Optimer dit indhold til søgemaskiner:

### Titel
- Inkluder hovedsøgeord
- 50-60 tegn
- Unikt pr. side

### Metabeskrivelse
- Inkluder søgeord naturligt
- 150-160 tegn
- Overbevisende og præcis

### Indhold
- Skriv naturligt, undgå søgeordsfyld
- Brug overskrifterne (h2, h3) korrekt
- Inkluder interne links til andre sider
- Brug alt-tekst på alle billeder
- Sigt efter 300+ ord for artikler

### URL struktur
- Hold URL'er korte og beskrivende
- Brug bindestreger til at adskille ord
- Undgå specialtegn
- Eksempel: `/about-our-company`

## Håndtering af dit indhold

### Rediger eksisterende side

1. Gå til **Indhold > Sider**
2. Find din side på listen
3. Klik på **Rediger** eller sidetitlen
4. Foretag ændringer
5. Klik på **Opdater**

### Slet side

1. Gå til **Indhold > Sider**
2. Find din side
3. Klik på **Slet**
4. Bekræft sletning

### Skift udgivelsesstatus

1. Gå til **Indhold > Sider**
2. Find siden, klik på **Rediger**
3. Skift status i dropdown
4. Klik på **Opdater**

## Fejlfinding af indholdsoprettelse

### Indhold vises ikke

**Symptom:** Udgivet side vises ikke på webstedet

**Løsning:**
1. Tjek udgivelsesstatus: Skal være "Udgivet"
2. Tjek udgivelsesdato: Skal være aktuel eller tidligere
3. Tjek synlighed: Skal være "Offentlig"
4. Ryd cache: Admin > Værktøjer > Ryd cache
5. Tjek tilladelser: Brugergruppen skal have adgang

### Formatering virker ikke

**Symptom:** HTML tags eller formatering vises som tekst

**Løsning:**
1. Bekræft, at HTML er aktiveret i modulindstillinger
2. Brug den korrekte HTML-syntaks
3. Luk alle tags: `<p>Text</p>`
4. Brug kun tilladte tags
5. Brug HTML-enheder: `&lt;` for `<`, `&amp;` for `&`

### Billeder vises ikke

**Symptom:** Billeder viser et ødelagt ikon

**Løsning:**
1. Kontroller, at billedet URL er korrekt
2. Kontroller, at billedfilen findes
3. Bekræft korrekte tilladelser på billedet
4. Prøv i stedet at uploade billede til XOOPS
5. Tjek for ekstern blokering (kan have brug for CORS)

### Problemer med tegnkodning

**Symptom:** Specialtegn vises som volapyk**Løsning:**
1. Gem filen som UTF-8-kodning
2. Sørg for, at sidetegnsæt er UTF-8
3. Føj til HTML head: `<meta charset="UTF-8">`
4. Undgå at kopiere og indsætte fra Word (brug almindelig tekst)

## Best Practices for Content Workflow

### Anbefalet proces

1. **Skriv i Editor først:** Brug admin indholdseditor
2. **Vis eksempel før udgivelse:** Klik på knappen Eksempel
3. **Tilføj metadata:** Komplet titel, beskrivelse, tags
4. **Gem som kladde først:** Gem som kladde for at undgå at miste arbejde
5. **Afsluttende anmeldelse:** Genlæs før udgivelse
6. **Udgiv:** Klik på Udgiv, når du er klar
7. **Bekræft:** Tjek på live-webstedet
8. **Rediger, hvis det er nødvendigt:** Foretag rettelser hurtigt

### Versionskontrol

Opbevar altid sikkerhedskopier:

1. **Før større ændringer:** Gem som ny version eller backup
2. **Arkiver gammelt indhold:** Behold upublicerede versioner
3. **Dater dine kladder:** Brug tydeligt navn: "Page-Draft-2025-01-28"

## Udgivelse af flere sider

Lav en indholdsstrategi:

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

Opret sider for at følge denne struktur.

## Næste trin

Efter oprettelse af din første side:

1. Konfigurer brugerkonti
2. Installer yderligere moduler
3. Udforsk admin funktioner
4. Konfigurer indstillinger
5. Optimer med ydeevneindstillinger

---

**Tags:** #indholdsoprettelse #sider #udgivelse #redaktør

**Relaterede artikler:**
- Admin-Panel-Oversigt
- Håndtering af brugere
- Installation af moduler
- ../Configuration/Basic-Configuration
