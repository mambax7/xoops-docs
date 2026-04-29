---
title: "Uw eerste pagina maken"
description: "Stapsgewijze handleiding voor het maken en publiceren van inhoud in XOOPS, inclusief opmaak, media-insluiting en publicatieopties"
---
# Uw eerste pagina maken in XOOPS

Leer hoe u uw eerste stuk inhoud kunt maken, opmaken en publiceren in XOOPS.

## XOOPS-inhoud begrijpen

### Wat is een pagina/bericht?

In XOOPS wordt de inhoud beheerd via modules. De meest voorkomende inhoudstypen zijn:

| Typ | Beschrijving | Gebruiksscenario |
|---|---|---|
| **Pagina** | Statische inhoud | Over ons, Contact, Diensten |
| **Bericht/Artikel** | Tijdstempel inhoud | Nieuws, Blogberichten |
| **Categorie** | Inhoud organisatie | Groepsgerelateerde inhoud |
| **Commentaar** | Gebruikersfeedback | Bezoekersinteractie toestaan ​​|

Deze handleiding behandelt het maken van een basispagina/artikel met behulp van de standaard inhoudsmodule van XOOPS.

## Toegang tot de inhoudseditor

### Vanuit het beheerdersdashboard

1. Log in op het beheerderspaneel: `http://your-domain.com/xoops/admin/`
2. Navigeer naar **Inhoud > Pagina's** (of uw inhoudsmodule)
3. Klik op 'Nieuwe pagina toevoegen' of 'Nieuw bericht'

### Frontend (indien ingeschakeld)

Als uw XOOPS is geconfigureerd om het maken van frontend-inhoud toe te staan:

1. Log in als geregistreerde gebruiker
2. Ga naar je profiel
3. Zoek naar de optie "Inhoud indienen".
4. Volg dezelfde stappen hieronder

## Interface voor inhoudeditor

De inhoudseditor omvat:

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

## Stapsgewijze handleiding: uw eerste pagina maken

### Stap 1: Toegang tot de inhoudseditor

1. Klik in het beheerdersdashboard op **Inhoud > Pagina's**
2. Klik op **"Nieuwe pagina toevoegen"** of **"Maken"**
3. Je ziet de inhoudseditor

### Stap 2: Voer de paginatitel in

Voer in het veld 'Titel' uw paginanaam in:

```
Title: Welcome to Our Website
```

Praktische tips voor titels:
- Duidelijk en beschrijvend
- Voeg indien mogelijk trefwoorden toe
- 50-60 tekens ideaal
- Vermijd ALL CAPS (moeilijk te lezen)
- Wees specifiek (niet "Pagina 1")

### Stap 3: Selecteer Categorie

Kies waar u deze inhoud wilt ordenen:

```
Category: [Dropdown ▼]
```

Opties kunnen zijn:
- Algemeen
- Nieuws
- Blog
- Aankondigingen
- Diensten

Als er geen categorieën bestaan, vraag dan de beheerder om ze aan te maken.

### Stap 4: Schrijf uw inhoud

Klik in het inhoudeditorgebied en typ uw tekst.

#### Basistekstopmaak

Gebruik de editorwerkbalk:

| Knop | Actie | Resultaat |
|---|---|---|
| **B** | Vet | **Vetgedrukte tekst** |
| *Ik* | Cursief | *Cursieve tekst* |
| <u>U</u> | Onderstreep | <u>Onderstreepte tekst</u> |

#### HTML gebruiken

XOOPS maakt veilige HTML-tags mogelijk. Veelvoorkomende voorbeelden:

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

#### Veilige HTML Voorbeelden

**Aanbevolen tags:**
- Paragrafen: `<p>`, `<br>`
- Koppen: `<h1>` tot `<h6>`
- Tekst: `<strong>`, `<em>`, `<u>`
- Lijsten: `<ul>`, `<ol>`, `<li>`
- Koppelingen: `<a href="">`
- Blokaanhalingstekens: `<blockquote>`
- Tabellen: `<table>`, `<tr>`, `<td>`

**Vermijd deze tags** (kan om veiligheidsredenen uitgeschakeld zijn):
- Scripts: `<script>`
- Stijlen: `<style>`
- Iframes: `<iframe>` (tenzij geconfigureerd)
- Formulieren: `<form>`, `<input>`

### Stap 5: Afbeeldingen toevoegen

#### Optie 1: Afbeelding invoegen URL

De editor gebruiken:

1. Klik op de knop **Afbeelding invoegen** (afbeeldingspictogram)
2. Voer afbeelding URL in: `https://example.com/image.jpg`
3. Voer alt-tekst in: "Beschrijving van afbeelding"
4. Klik op "Invoegen"

HTML-equivalent:

```html
<img src="https://example.com/image.jpg" alt="Description">
```

#### Optie 2: Afbeelding uploaden

1. Upload eerst de afbeelding naar XOOPS:
   - Ga naar **Inhoud > Mediabeheer**
   - Upload uw afbeelding
   - Kopieer de afbeelding URL

2. Voeg in de inhoudseditor in met URL (bovenstaande stappen)

#### Beste praktijken voor afbeeldingen

- Gebruik de juiste bestandsgroottes (optimaliseer afbeeldingen)
- Gebruik beschrijvende bestandsnamen
- Voeg altijd alt-tekst toe (toegankelijkheid)
- Ondersteunde formaten: JPG, PNG, GIF, WebP
- Aanbevolen breedte: 600-800 pixels voor inhoud

### Stap 6: Media insluiten

#### Video van YouTube insluiten

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

Vervang `VIDEO_ID` door de YouTube-video-ID.

**Om de YouTube-video-ID te vinden:**
1. Open video op YouTube
2. URL is: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Kopieer de ID (tekens na `v=`)

#### Video insluiten van Vimeo

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### Stap 7: Metabeschrijving toevoegen

Voeg in het veld 'Beschrijving' een korte samenvatting toe:
```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```

**Beste praktijken voor de metabeschrijving:**
- 150-160 tekens
- Neem de belangrijkste trefwoorden op
- Moet de inhoud nauwkeurig samenvatten
- Gebruikt in zoekresultaten van zoekmachines
- Maak het aantrekkelijk (gebruikers zien dit)

### Stap 8: Publicatieopties configureren

#### Publicatiestatus

Kies publicatiestatus:

```
Status: ☑ Published
```

Opties:
- **Gepubliceerd:** Zichtbaar voor publiek
- **Concept:** Alleen zichtbaar voor beheerders
- **In afwachting van beoordeling:** In afwachting van goedkeuring
- **Gearchiveerd:** Verborgen maar bewaard

#### Zichtbaarheid

Stel in wie deze inhoud kan zien:

```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```

#### Publicatiedatum

Instellen wanneer inhoud zichtbaar wordt:

```
Publish Date: [Date Picker] [Time]
```

Laat het als 'Nu' staan om onmiddellijk te publiceren.

#### Reacties toestaan

Bezoekersreacties in- of uitschakelen:

```
Allow Comments: ☑ Yes
```

Indien ingeschakeld kunnen bezoekers feedback toevoegen.

### Stap 9: Bewaar uw inhoud

Meerdere opslagopties:

```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```

- **Nu publiceren:** Onmiddellijk zichtbaar maken
- **Opslaan als concept:** Blijf voorlopig privé
- **Schema:** Publiceer op toekomstige datum/tijd
- **Voorbeeld:** Bekijk hoe het eruit ziet voordat u het opslaat

Klik op uw keuze:

```
Click [Publish Now]
```

### Stap 10: Verifieer uw pagina

Verifieer uw inhoud na publicatie:

1. Ga naar de startpagina van uw website
2. Navigeer naar uw inhoudsgebied
3. Zoek naar uw nieuw gemaakte pagina
4. Klik om het te bekijken
5. Controleer:
   - [ ] Inhoud wordt correct weergegeven
   - [ ] Afbeeldingen verschijnen
   - [ ] Opmaak ziet er goed uit
   - [ ] Links werken
   - [ ] Titel en beschrijving correct

## Voorbeeld: Volledige pagina

### Titel
```
Getting Started with XOOPS
```

### Inhoud
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

### Metabeschrijving
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```

## Geavanceerde inhoudsfuncties

### WYSIWYG-editor gebruiken

Als er een RTF-editor is geïnstalleerd:

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

Klik op knoppen om tekst op te maken zonder HTML.

### Codeblokken invoegen

Voorbeelden van weergavecodes:

```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```

### Tabellen maken

Gegevens in tabellen ordenen:

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

### Inline-citaten

Markeer belangrijke tekst:

```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```

## SEO Beste praktijken voor inhoud

Optimaliseer uw inhoud voor zoekmachines:

### Titel
- Neem het hoofdzoekwoord op
- 50-60 tekens
- Uniek per pagina

### Metabeschrijving
- Voeg op natuurlijke wijze zoekwoorden toe
- 150-160 tekens
- Meeslepend en accuraat

### Inhoud
- Schrijf op een natuurlijke manier, vermijd het overmatig gebruik van zoekwoorden
- Gebruik kopjes (h2, h3) op de juiste manier
- Voeg interne links naar andere pagina's toe
- Gebruik alt-tekst op alle afbeeldingen
- Streef naar meer dan 300 woorden voor artikelen

### URL-structuur
- Houd URL's kort en beschrijvend
- Gebruik koppeltekens om woorden te scheiden
- Vermijd speciale tekens
- Voorbeeld: `/about-our-company`

## Uw inhoud beheren

### Bestaande pagina bewerken

1. Ga naar **Inhoud > Pagina's**
2. Zoek uw pagina in de lijst
3. Klik op **Bewerken** of op de paginatitel
4. Breng wijzigingen aan
5. Klik op **Bijwerken**

### Pagina verwijderen

1. Ga naar **Inhoud > Pagina's**
2. Zoek uw pagina
3. Klik op **Verwijderen**
4. Bevestig het verwijderen

### Wijzig de publicatiestatus

1. Ga naar **Inhoud > Pagina's**
2. Zoek pagina, klik op **Bewerken**
3. Wijzig de status in de vervolgkeuzelijst
4. Klik op **Bijwerken**

## Problemen met het maken van inhoud oplossen

### Inhoud verschijnt niet

**Symptoom:** Gepubliceerde pagina wordt niet weergegeven op de website

**Oplossing:**
1. Controleer de publicatiestatus: moet "Gepubliceerd" zijn
2. Controleer de publicatiedatum: moet actueel of in het verleden zijn
3. Controleer de zichtbaarheid: moet 'Openbaar' zijn
4. Cache wissen: Beheerder > Extra > Cache wissen
5. Controleer rechten: Gebruikersgroep moet toegang hebben

### Formatteren werkt niet

**Symptoom:** HTML-tags of opmaak verschijnen als tekst

**Oplossing:**
1. Controleer of HTML is ingeschakeld in de module-instellingen
2. Gebruik de juiste HTML-syntaxis
3. Sluit alle tags: `<p>Text</p>`
4. Gebruik alleen toegestane tags
5. Gebruik HTML-entiteiten: `&lt;` voor `<`, `&amp;` voor `&`

### Afbeeldingen worden niet weergegeven

**Symptoom:** Afbeeldingen tonen een gebroken pictogram

**Oplossing:**
1. Controleer of afbeelding URL correct is
2. Controleer of het afbeeldingsbestand bestaat
3. Controleer de juiste machtigingen voor de afbeelding
4. Probeer in plaats daarvan de afbeelding te uploaden naar XOOPS
5. Controleer op externe blokkering (mogelijk heeft u CORS nodig)

### Problemen met tekencodering

**Symptoom:** Speciale tekens verschijnen als wartaal**Oplossing:**
1. Sla het bestand op als UTF-8-codering
2. Zorg ervoor dat de paginatekenset UTF-8 is
3. Voeg toe aan HTML-kop: `<meta charset="UTF-8">`
4. Vermijd kopiëren en plakken vanuit Word (gebruik platte tekst)

## Beste praktijken voor de inhoudsworkflow

### Aanbevolen proces

1. **Schrijf eerst in de editor:** Gebruik de beheerdersinhoudeditor
2. **Voorbeeld vóór publicatie:** Klik op de knop Voorbeeld
3. **Metadata toevoegen:** Volledige titel, beschrijving, tags
4. **Eerst opslaan als concept:** Opslaan als concept om te voorkomen dat u werk kwijtraakt
5. **Eindrecensie:** Opnieuw lezen voordat u het publiceert
6. **Publiceren:** Klik op Publiceren als u klaar bent
7. **Verifiëren:** Controleer op live site
8. **Bewerk indien nodig:** Breng snel correcties aan

### Versiebeheer

Bewaar altijd back-ups:

1. **Vóór grote wijzigingen:** Opslaan als nieuwe versie of back-up
2. **Archiveer oude inhoud:** Bewaar niet-gepubliceerde versies
3. **Dateer uw concepten:** Gebruik een duidelijke naam: "Page-Draft-2025-01-28"

## Meerdere pagina's publiceren

Creëer een contentstrategie:

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

Maak pagina's die deze structuur volgen.

## Volgende stappen

Nadat u uw eerste pagina heeft gemaakt:

1. Gebruikersaccounts instellen
2. Installeer extra modules
3. Ontdek beheerdersfuncties
4. Configureer instellingen
5. Optimaliseer met prestatie-instellingen

---

**Tags:** #content-creation #pages #publishing #editor

**Gerelateerde artikelen:**
- Beheerderspaneel-overzicht
- Beheer-gebruikers
- Modules installeren
- ../Configuratie/Basisconfiguratie