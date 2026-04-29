---
title: "Ustvarjanje vaše prve strani"
description: "Vodnik po korakih za ustvarjanje in objavljanje vsebine v XOOPS, vključno z možnostmi oblikovanja, vdelave medijev in objavljanja"
---
# Ustvarjanje vaše prve strani v XOOPS

Naučite se ustvariti, oblikovati in objaviti svojo prvo vsebino v XOOPS.

## Razumevanje XOOPS vsebine

### Kaj je Page/Post?

V XOOPS se vsebina upravlja preko modulov. Najpogostejše vrste vsebine so:

| Vrsta | Opis | Primer uporabe |
|---|---|---|
| **Stran** | Statična vsebina | O nas, Kontakt, Storitve |
| **Post/Article** | Vsebina s časovnim žigom | Novice, objave na spletnem dnevniku |
| **Kategorija** | Organizacija vsebine | Vsebina, povezana s skupino |
| **Komentar** | Povratne informacije uporabnikov | Dovoli interakcijo obiskovalcev |

Ta priročnik pokriva ustvarjanje osnovnega page/article z uporabo privzetega vsebinskega modula XOOPS.

## Dostop do urejevalnika vsebine

### Iz skrbniške plošče

1. Prijavite se v skrbniško ploščo: `http://your-domain.com/XOOPS/admin/`
2. Pomaknite se na **Vsebina > Strani** (ali vaš vsebinski modul)
3. Kliknite »Dodaj novo stran« ali »Nova objava«

### Frontend (če je omogočeno)

Če je vaš XOOPS konfiguriran tako, da omogoča ustvarjanje vsebine na sprednji strani:

1. Prijavite se kot registriran uporabnik
2. Pojdite na svoj profil
3. Poiščite možnost »Pošlji vsebino«.
4. Sledite istim korakom spodaj

## Vmesnik urejevalnika vsebine

Urejevalnik vsebine vključuje:
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
## Vodič po korakih: Ustvarjanje prve strani

### 1. korak: Dostop do urejevalnika vsebine

1. V skrbniški plošči kliknite **Vsebina > Strani**
2. Kliknite **"Dodaj novo stran"** ali **"Ustvari"**
3. Videli boste urejevalnik vsebine

### 2. korak: Vnesite naslov strani

V polje "Naslov" vnesite ime svoje strani:
```
Title: Welcome to Our Website
```
Najboljše prakse za naslove:
- Jasno in opisno
- Če je mogoče, vključite ključne besede
- Idealno 50-60 znakov
- Izogibajte se ALL CAPS (težko berljivo)
– Bodite natančni (ne "Stran 1")

### 3. korak: Izberite kategorijo

Izberite, kje želite organizirati to vsebino:
```
Category: [Dropdown ▼]
```
Možnosti lahko vključujejo:
- General
- Novice
- Blog
- Obvestila
- Storitve

Če kategorije ne obstajajo, prosite administratorja, da jih ustvari.

### 4. korak: Napišite svojo vsebino

Kliknite na območje urejevalnika vsebine in vnesite besedilo.

#### Osnovno oblikovanje besedila

Uporabite orodno vrstico urejevalnika:

| Gumb | Akcija | Rezultat |
|---|---|---|
| **B** | Krepko | **Krepko besedilo** |
| *jaz* | Ležeče | *Poševno besedilo* |
| <u>U</u> | Podčrtaj | <u>Podčrtano besedilo</u> |

#### Uporaba HTML

XOOPS omogoča varne oznake HTML. Pogosti primeri:
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
#### Varno HTML Primeri

**Priporočene oznake:**
- Odstavki: `<p>`, `<br>`
- Naslovi: `<h1>` do `<h6>`
- Besedilo: `<strong>`, `<em>`, `<u>`
- Seznami: `<ul>`, `<ol>`, `<li>`
- Povezave: `<a href="">`
- Narekovaji: `<blockquote>`
- Tabele: `<table>`, `<tr>`, `<td>`

**Izogibajte se tem oznakam** (morda so onemogočene zaradi varnosti):
- Skripte: `<script>`
- Slogi: `<style>`
- iframes: `<iframe>` (če ni konfiguriran)
- Obrazci: `<form>`, `<input>`

### 5. korak: Dodajte slike

#### 1. možnost: Vstavite sliko URL

Uporaba urejevalnika:

1. Kliknite gumb **Vstavi sliko** (ikona slike)
2. Vnesite sliko URL: `https://example.com/image.jpg`
3. Vnesite nadomestno besedilo: "Opis slike"
4. Kliknite "Vstavi"

HTML enakovredno:
```html
<img src="https://example.com/image.jpg" alt="Description">
```
#### 2. možnost: Naloži sliko

1. Najprej naložite sliko na XOOPS:
   - Pojdite na **Vsebina > Upravitelj medijev**
   - Naložite svojo sliko
   - Kopirajte sliko URL

2. V urejevalnik vsebine vstavite z URL (zgornji koraki)

#### Najboljše prakse za slike

- Uporabite ustrezne velikosti datotek (optimizirajte slike)
- Uporabite opisna imena datotek
- Vedno vključi nadomestno besedilo (dostopnost)
- Podprti formati: JPG, PNG, GIF, WebP
- Priporočena širina: 600–800 slikovnih pik za vsebino

### 6. korak: Vdelajte medije

#### Vdelaj video iz YouTuba
```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```
Zamenjajte `VIDEO_ID` z ID-jem videa YouTube.

**Če želite najti ID videoposnetka YouTube:**
1. Odprite video na YouTubu
2. URL je: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Kopirajte ID (znaki za `v=`)

#### Vdelaj video iz Vimea
```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```
### 7. korak: dodajte meta opis

V polje »Opis« dodajte kratek povzetek:
```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```
**Najboljše prakse metaopisa:**
- 150-160 znakov
- Vključite glavne ključne besede
- Natančno mora povzemati vsebino
- Uporablja se v rezultatih iskalnikov
- Naj bo privlačno (uporabniki to vidijo)

### 8. korak: Konfigurirajte možnosti objave

#### Status objave

Izberite status objave:
```
Status: ☑ Published
```
možnosti:
- **Objavljeno:** Vidno javnosti
- **Osnutek:** Vidno samo skrbnikom
- **Pregled v teku:** Čakanje na odobritev
- **Arhivirano:** Skrito, a ohranjeno

#### Vidljivost

Nastavite, kdo lahko vidi to vsebino:
```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```
#### Datum objave

Nastavite, kdaj postane vsebina vidna:
```
Publish Date: [Date Picker] [Time]
```
Pustite kot »Zdaj« za takojšnjo objavo.

#### Dovoli komentarje

Omogoči ali onemogoči komentarje obiskovalcev:
```
Allow Comments: ☑ Yes
```
Če je omogočeno, lahko obiskovalci dodajo povratne informacije.

### 9. korak: Shranite svojo vsebino

Več možnosti shranjevanja:
```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```
- **Objavi zdaj:** naredi vidno takoj
- **Shrani kot osnutek:** Za zdaj naj bo zasebno
- **Razpored:** Objava v prihodnosti date/time
- **Predogled:** Oglejte si, kako izgleda, preden shranite

Kliknite svojo izbiro:
```
Click [Publish Now]
```
### 10. korak: Preverite svojo stran

Po objavi preverite svojo vsebino:

1. Pojdite na domačo stran svojega spletnega mesta
2. Pomaknite se do področja z vsebino
3. Poiščite svojo novo ustvarjeno stran
4. Kliknite za ogled
5. Preverite:
   - [ ] Vsebina je prikazana pravilno
   - [ ] Prikažejo se slike
   - [ ] Oblikovanje je videti dobro
   - [ ] Povezave delujejo
   - [ ] Naslov in opis sta pravilna

## Primer: Celotna stran

### Naslov
```
Getting Started with XOOPS
```
### Vsebina
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
## Napredne funkcije vsebine

### Uporaba urejevalnika WYSIWYG

Če je nameščen urejevalnik obogatenega besedila:
```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```
Kliknite gumbe za oblikovanje besedila brez HTML.

### Vstavljanje kodnih blokov

Primeri prikazne kode:
```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```
### Ustvarjanje tabel

Organizirajte podatke v tabelah:
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
### Narekovaji v vrstici

Označi pomembno besedilo:
```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```
## SEO Najboljše prakse za vsebino

Optimizirajte svojo vsebino za iskalnike:

### Naslov
- Vključite glavno ključno besedo
- 50-60 znakov
- Edinstven na stran

### Meta opis
- Vključite ključno besedo naravno
- 150-160 znakov
- Prepričljivo in natančno

### Vsebina
- Pišite naravno, izogibajte se kopičenju ključnih besed
- Ustrezno uporabite naslove (h2, h3).
- Vključite notranje povezave do drugih strani
- Uporabite nadomestno besedilo na vseh slikah
- Ciljajte na 300+ besed za članke

### URL Struktura
- URL-ji naj bodo kratki in opisni
- Za ločevanje besed uporabljajte vezaje
- Izogibajte se posebnim znakom
- Primer: `/about-our-company`

## Upravljanje vaše vsebine

### Uredi obstoječo stran

1. Pojdite na **Vsebina > Strani**
2. Poiščite svojo stran na seznamu
3. Kliknite **Uredi** ali naslov strani
4. Naredite spremembe
5. Kliknite **Posodobi**

### Izbriši stran

1. Pojdite na **Vsebina > Strani**
2. Poiščite svojo stran
3. Kliknite **Izbriši**
4. Potrdite izbris

### Spremeni status objave

1. Pojdite na **Vsebina > Strani**
2. Poiščite stran, kliknite **Uredi**
3. Spremenite stanje v spustnem meniju
4. Kliknite **Posodobi**

## Odpravljanje težav pri ustvarjanju vsebine

### Vsebina se ne prikaže

**Simptom:** Objavljena stran ni prikazana na spletnem mestu

**Rešitev:**
1. Preverite status objave: mora biti "Objavljeno"
2. Preverite datum objave: mora biti trenutni ali pretekli
3. Preverite vidnost: mora biti "Javno"
4. Počisti predpomnilnik: Skrbnik > Orodja > Počisti predpomnilnik
5. Preverite dovoljenja: Uporabniška skupina mora imeti dostop### Oblikovanje ne deluje

**Simptom:** HTML oznake ali oblikovanje se prikaže kot besedilo

**Rešitev:**
1. Preverite, ali je HTML omogočen v nastavitvah modula
2. Uporabite pravilno sintakso HTML
3. Zaprite vse oznake: `<p>Text</p>`
4. Uporabljajte samo dovoljene oznake
5. Uporabite entitete HTML: `&lt;` za `<`, `&amp;` za `&`

### Slike se ne prikazujejo

**Simptom:** Slike prikazujejo pokvarjeno ikono

**Rešitev:**
1. Preverite, ali je slika URL pravilna
2. Preverite, ali slikovna datoteka obstaja
3. Preverite ustrezna dovoljenja za sliko
4. Namesto tega poskusite naložiti sliko na XOOPS
5. Preverite zunanjo blokado (morda potrebujete CORS)

### Težave s kodiranjem znakov

**Simptom:** Posebni znaki so videti kot bedarija

**Rešitev:**
1. Shranite datoteko kot kodiranje UTF-8
2. Zagotovite, da je nabor znakov UTF-8
3. Dodaj v HTML glavo: `<meta charset="UTF-8">`
4. Izogibajte se kopiranju in lepljenju iz Worda (uporabite navadno besedilo)

## Najboljše prakse poteka dela vsebine

### Priporočen postopek

1. **Najprej zapišite v urejevalnik:** uporabite skrbniški urejevalnik vsebine
2. **Predogled pred objavo:** Kliknite gumb Predogled
3. **Dodajte metapodatke:** Celoten naslov, opis, oznake
4. **Najprej shrani kot osnutek:** Shrani kot osnutek, da se izogneš izgubi dela
5. **Končni pregled:** Ponovno preberite pred objavo
6. **Objavi:** Kliknite Objavi, ko ste pripravljeni
7. **Preveri:** Preverite na spletnem mestu v živo
8. **Uredite, če je potrebno:** Hitro popravite### Nadzor različic

Vedno imejte varnostne kopije:

1. **Pred večjimi spremembami:** Shranite kot novo različico ali varnostno kopijo
2. **Arhiviraj staro vsebino:** obdrži neobjavljene različice
3. **Datirajte svoje osnutke:** Uporabite jasno poimenovanje: "Page-Draft-2025-01-28"

## Objava več strani

Ustvarite vsebinsko strategijo:
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
Ustvarite strani, ki bodo sledile tej strukturi.

## Naslednji koraki

Ko ustvarite prvo stran:

1. Nastavite uporabniške račune
2. Namestite dodatne module
3. Raziščite skrbniške funkcije
4. Konfigurirajte nastavitve
5. Optimizirajte z nastavitvami zmogljivosti

---

**Oznake:** #ustvarjanje vsebin #strani #objavljanje #urejevalnik

**Povezani članki:**
- Pregled skrbniške plošče
- Upravljanje uporabnikov
- Namestitev modulov
- ../Configuration/Basic-Configuration