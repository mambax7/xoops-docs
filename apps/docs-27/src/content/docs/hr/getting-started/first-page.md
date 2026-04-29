---
title: "Stvaranje vaše prve stranice"
description: "Vodič korak po korak za stvaranje i objavljivanje sadržaja u XOOPS, uključujući formatiranje, ugrađivanje medija i opcije objavljivanja"
---
# Stvaranje vaše prve stranice u XOOPS

Naučite kako stvoriti, formatirati i objaviti svoj prvi dio sadržaja u XOOPS.

## Razumijevanje sadržaja XOOPS

### Što je stranica/post?

U XOOPS sadržajem se upravlja putem modules. Najčešće vrste sadržaja su:

| Upišite | Opis | Slučaj upotrebe |
|---|---|---|
| **Stranica** | Statički sadržaj | O nama, Kontakt, Usluge |
| **Post/članak** | Sadržaj s vremenskim žigom | Vijesti, Blogovi |
| **Kategorija** | Organizacija sadržaja | Sadržaj povezan s grupom |
| **Komentiraj** | Povratne informacije korisnika | Dopusti interakciju posjetitelja |

Ovaj vodič pokriva stvaranje osnovne stranice/članka pomoću zadanog modula sadržaja XOOPS.

## Pristup uređivaču sadržaja

### Iz administratorske ploče

1. Prijavite se na ploču admin: `http://your-domain.com/xoops/admin/`
2. Idite na **Sadržaj > Stranice** (ili svoj modul sadržaja)
3. Kliknite "Dodaj novu stranicu" ili "Novi post"

### Sučelje (ako je omogućeno)

Ako je vaš XOOPS konfiguriran da dopušta stvaranje sadržaja na sučelju:

1. Prijavite se kao registrirani korisnik
2. Idite na svoj profil
3. Potražite opciju "Pošalji sadržaj".
4. Slijedite iste korake u nastavku

## Sučelje uređivača sadržaja

Uređivač sadržaja includes:

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

## Vodič korak po korak: Stvaranje vaše prve stranice

### Korak 1: Pristup uređivaču sadržaja

1. Na ploči admin kliknite **Sadržaj > Stranice**
2. Kliknite **"Dodaj novu stranicu"** ili **"Izradi"**
3. Vidjet ćete uređivač sadržaja

### Korak 2: Unesite naslov stranice

U polje "Naslov" unesite naziv svoje stranice:

```
Title: Welcome to Our Website
```

Najbolji primjeri iz prakse za naslove:
- Jasno i opisno
- Uključite ključne riječi ako je moguće
- Idealno 50-60 znakova
- Izbjegavajte SVE VELIKA SLOVA (teško za čitanje)
- Budite precizni (ne "Stranica 1")

### Korak 3: Odaberite kategoriju

Odaberite gdje ćete organizirati ovaj sadržaj:

```
Category: [Dropdown ▼]
```

Moguće opcije include:
- Generale
- Vijesti
- Blog
- Obavijesti
- Usluge

Ako kategorije ne postoje, zamolite administrator da ih stvori.

### Korak 4: Napišite svoj sadržaj

Pritisnite u području uređivača sadržaja i upišite tekst.

#### Osnovno oblikovanje teksta

Koristite alatnu traku uređivača:

| Gumb | Radnja | Rezultat |
|---|---|---|
| **B** | Podebljano | **Podebljani tekst** |
| *Ja* | Kurziv | *kurziv* |
| <u>U</u> | Podcrtano | <u>Podcrtani tekst</u> |

#### Korištenje HTML

XOOPS omogućuje sigurne oznake HTML. Uobičajeni primjeri:

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

#### Sigurno HTML Primjeri

**Preporučene oznake:**
- Odlomci: `<p>`, `<br>`
- Naslovi: `<h1>` do `<h6>`
- Tekst: `<strong>`, `<em>`, `<u>`
- Popisi: `<ul>`, `<ol>`, `<li>`
- Veze: `<a href="">`
- Navodnici: `<blockquote>`
- Stolovi: `<table>`, `<tr>`, `<td>`

**Izbjegavajte ove oznake** (mogu biti onemogućene radi sigurnosti):
- Skripte: `<script>`
- Stilovi: `<style>`
- iframes: `<iframe>` (osim ako nije konfiguriran)
- Obrasci: `<form>`, `<input>`

### Korak 5: Dodajte slike

#### Opcija 1: Umetanje slike URL

Korištenje uređivača:

1. Kliknite gumb **Umetni sliku** (ikona slike)
2. Unesite sliku URL: `https://example.com/image.jpg`
3. Unesite zamjenski tekst: "Opis slike"
4. Kliknite "Umetni"

HTML ekvivalent:

```html
<img src="https://example.com/image.jpg" alt="Description">
```
#### Opcija 2: Prenesi sliku

1. Prvo prenesite sliku na XOOPS:
   - Idite na **Sadržaj > Upravitelj medija**
   - Učitajte svoju sliku
   - Kopirajte sliku URL

2. U uređivač sadržaja umetnite koristeći URL (gornji koraci)

#### Najbolji primjeri iz prakse za slike

- Koristite odgovarajuće veličine datoteka (optimizirajte slike)
- Koristite opisne nazive datoteka
- Uvijek include alternativni tekst (pristupačnost)
- Podržani formati: JPG, PNG, GIF, WebP
- Preporučena širina: 600-800 piksela za sadržaj

### Korak 6: Ugradite medije

#### Ugradite video s YouTubea

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

Zamijenite `VIDEO_ID` YouTube ID-om videozapisa.

**Da biste pronašli YouTube ID videozapisa:**
1. Otvorite video na YouTubeu
2. URL je: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Kopirajte ID (znakovi nakon `v=`)

#### Ugradite video s Vimea

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### Korak 7: Dodajte meta opis

U polje "Opis" dodajte kratak sažetak:

```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```

**Najbolji primjeri iz prakse meta opisa:**
- 150-160 znakova
- Uključite glavne ključne riječi
- Treba točno sažeti sadržaj
- Koristi se u rezultatima tražilice
- Neka bude uvjerljivo (korisnici ovo vide)

### Korak 8: Konfigurirajte opcije objavljivanja

#### Status objave

Odaberite status objave:

```
Status: ☑ Published
```

Mogućnosti:
- **Objavljeno:** Vidljivo javnosti
- **Skica:** vidljivo samo za admins
- **Na čekanju za pregled:** Čeka se odobrenje
- **Arhivirano:** Skriveno, ali sačuvano

#### Vidljivost

Postavite tko može vidjeti ovaj sadržaj:

```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```

#### Datum objave

Postavite kada sadržaj postaje vidljiv:

```
Publish Date: [Date Picker] [Time]
```

Ostavite kao "Sada" za objavu odmah.

#### Dopusti komentare

Omogućite ili onemogućite komentare posjetitelja:

```
Allow Comments: ☑ Yes
```

Ako je omogućeno, posjetitelji mogu dodati povratne informacije.

### Korak 9: Spremite svoj sadržaj

Više opcija spremanja:

```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```

- **Objavi sada:** Učini vidljivim odmah
- **Spremi kao nacrt:** Za sada zadrži privatno
- **Raspored:** Objavi na budući datum/vrijeme
- **Pregled:** Pogledajte kako izgleda prije spremanja

Kliknite na svoj izbor:

```
Click [Publish Now]
```

### Korak 10: Potvrdite svoju stranicu

Nakon objave provjerite svoj sadržaj:

1. Idite na početnu stranicu svoje web stranice
2. Dođite do područja sadržaja
3. Potražite svoju novostvorenu stranicu
4. Kliknite za pregled
5. Provjerite:
   - [ ] Sadržaj se prikazuje ispravno
   - [ ] Pojavljuju se slike
   - [ ] Formatiranje izgleda dobro
   - [ ] Veze rade
   - [ ] Naslov i opis točni

## Primjer: Cijela stranica

### Naslov
```
Getting Started with XOOPS
```

### Sadržaj
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

### Meta opis
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```

## Napredne značajke sadržaja

### Korištenje WYSIWYG uređivača

Ako je instaliran uređivač obogaćenog teksta:

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

Pritisnite gumbe za oblikovanje teksta bez HTML.

### Umetanje blokova koda

Primjeri kodova za prikaz:

```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```

### Stvaranje tablica

Organizirajte podatke u tablice:

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

### Umetnuti citati

Istaknite važan tekst:

```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```

## Najbolje prakse SEO-a za sadržaj

Optimizirajte svoj sadržaj za tražilice:

### Naslov
- Uključite glavnu ključnu riječ
- 50-60 znakova
- Jedinstveno po stranici

### Meta opis
- Uključite ključnu riječ prirodno
- 150-160 znakova
- Uvjerljivo i točno

### Sadržaj
- Pišite prirodno, izbjegavajte pretrpavanje ključnim riječima
- Koristite naslove (h2, h3) na odgovarajući način
- Uključite interne poveznice na druge stranice
- Koristite alternativni tekst na svim slikama
- Ciljajte na 300+ riječi za članke### URL Struktura
- Neka URL-ovi budu kratki i opisni
- Koristite crtice za odvajanje riječi
- Izbjegavajte posebne znakove
- Primjer: `/about-our-company`

## Upravljanje vašim sadržajem

### Uredite postojeću stranicu

1. Idite na **Sadržaj > Stranice**
2. Pronađite svoju stranicu na popisu
3. Kliknite **Uredi** ili naslov stranice
4. Napravite promjene
5. Kliknite **Ažuriraj**

### Izbriši stranicu

1. Idite na **Sadržaj > Stranice**
2. Pronađite svoju stranicu
3. Kliknite **Izbriši**
4. Potvrdite brisanje

### Promjena statusa publikacije

1. Idite na **Sadržaj > Stranice**
2. Pronađite stranicu, kliknite **Uredi**
3. Promijenite status u padajućem izborniku
4. Kliknite **Ažuriraj**

## Rješavanje problema sa stvaranjem sadržaja

### Sadržaj se ne pojavljuje

**Simptom:** Objavljena stranica ne prikazuje se na web stranici

**Rješenje:**
1. Provjerite status objave: Trebalo bi biti "Objavljeno"
2. Provjerite datum objave: Trebao bi biti trenutačni ili prošli
3. Provjerite vidljivost: Treba biti "Javno"
4. Obrišite cache: Administrator > Alati > Obriši predmemoriju
5. Provjerite dopuštenja: Grupa korisnika mora imati pristup

### Formatiranje ne radi

**Simptom:** HTML oznake ili oblikovanje pojavljuju se kao tekst

**Rješenje:**
1. Provjerite je li HTML omogućen u postavkama modula
2. Koristite odgovarajuću sintaksu HTML
3. Zatvori sve oznake: `<p>Text</p>`
4. Koristite samo dopuštene oznake
5. Koristite entitete HTML: `&lt;` za `<`, `&amp;` za `&`

### Slike se ne prikazuju

**Simptom:** Slike prikazuju slomljenu ikonu

**Rješenje:**
1. Provjerite je li slika URL ispravna
2. Provjerite postoji li slikovna datoteka
3. Provjerite ispravna dopuštenja za sliku
4. Pokušajte umjesto toga prenijeti sliku na XOOPS
5. Provjerite vanjsko blokiranje (možda će trebati CORS)

### Problemi s kodiranjem znakova

**Simptom:** Posebni znakovi pojavljuju se kao besmislica

**Rješenje:**
1. Spremite datoteku kao UTF-8 kodiranje
2. Provjerite je li skup znakova stranice UTF-8
3. Dodajte glavi HTML: `<meta charset="UTF-8">`
4. Izbjegavajte kopiranje i lijepljenje iz Worda (koristite običan tekst)

## Najbolji primjeri iz prakse tijeka rada sadržaja

### Preporučeni postupak

1. **Prvo upišite u uređivač:** koristite uređivač sadržaja admin
2. **Pregled prije objavljivanja:** Kliknite gumb Pregled
3. **Dodajte metapodatke:** Kompletan naslov, opis, oznake
4. **Prvo spremite kao nacrt:** Spremite kao nacrt da biste izbjegli gubitak posla
5. **Završni pregled:** Ponovno pročitajte prije objavljivanja
6. **Objavi:** Kliknite Objavi kada budete spremni
7. **Potvrdi:** Provjerite na web mjestu uživo
8. **Uredite ako je potrebno:** Brzo izvršite ispravke

### Kontrola verzija

Uvijek čuvajte sigurnosne kopije:

1. **Prije većih promjena:** Spremite kao novu verziju ili sigurnosnu kopiju
2. **Arhivirajte stari sadržaj:** Sačuvajte neobjavljene verzije
3. **Datirajte svoje skice:** Koristite jasno imenovanje: "Page-Draft-2025-01-28"

## Objavljivanje više stranica

Izradite strategiju sadržaja:

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

Izradite stranice koje će slijediti ovu strukturu.

## Sljedeći koraci

Nakon izrade prve stranice:

1. Postavite korisničke račune
2. Instalirajte dodatni modules
3. Istražite značajke admin
4. Konfigurirajte postavke
5. Optimizirajte s postavkama performansi

---

**Oznake:** #stvaranje sadržaja #stranice #izdavanje #urednik

**Povezani članci:**
- administratorska ploča - Pregled
- Upravljanje korisnicima
- Instaliranje modula
- ../Configuration/Basic-Configuration
