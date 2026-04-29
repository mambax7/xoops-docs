---
title: "Az első oldal létrehozása"
description: "Lépésről lépésre a tartalom létrehozásához és közzétételéhez XOOPS-ban, beleértve a formázást, a médiabeágyazást és a közzétételi lehetőségeket"
---
# Az első oldal létrehozása a XOOPS-ban

Ismerje meg, hogyan hozhatja létre, formázhatja és teheti közzé az első tartalmat a XOOPS-ban.

## A XOOPS tartalom megértése

### Mi az a Page/Post?

A XOOPS-ban a tartalom kezelése modulokon keresztül történik. A leggyakoribb tartalomtípusok a következők:

| Típus | Leírás | Használati eset |
|---|---|---|
| **Oldal** | Statikus tartalom | Rólunk, Kapcsolat, Szolgáltatások |
| **Post/Article** | Időbélyeggel ellátott tartalom | Hírek, Blogbejegyzések |
| **Kategória** | Tartalomszervezés | Csoporthoz kapcsolódó tartalom |
| **Megjegyzés** | Felhasználói visszajelzés | Látogatói interakció engedélyezése |

Ez az útmutató egy alapvető page/article létrehozását ismerteti a XOOPS alapértelmezett tartalommoduljával.

## A Tartalomszerkesztő elérése

### Az adminisztrációs panelről

1. Jelentkezzen be az adminisztrációs panelre: `http://your-domain.com/xoops/admin/`
2. Nyissa meg a **Tartalom > Oldalak** (vagy a tartalommodul) elemet.
3. Kattintson az "Új oldal hozzáadása" vagy az "Új bejegyzés" elemre.

### Kezelőfelület (ha engedélyezve van)

Ha a XOOPS úgy van konfigurálva, hogy engedélyezze a frontend tartalom létrehozását:

1. Jelentkezzen be regisztrált felhasználóként
2. Nyissa meg a profilját
3. Keresse meg a "Tartalom elküldése" lehetőséget
4. Kövesse az alábbi lépéseket

## Tartalomszerkesztő felület

A tartalomszerkesztő a következőket tartalmazza:

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

## Útmutató lépésről lépésre: Az első oldal létrehozása

### 1. lépés: Nyissa meg a Tartalomszerkesztőt

1. Az adminisztrációs panelen kattintson a **Tartalom > Oldalak** lehetőségre.
2. Kattintson az **"Új oldal hozzáadása"** vagy a **"Létrehozás"** lehetőségre.
3. Megjelenik a tartalomszerkesztő

### 2. lépés: Írja be az oldal címét

A "Cím" mezőbe írja be az oldal nevét:

```
Title: Welcome to Our Website
```

A címek bevált gyakorlatai:
- Világos és leíró
- Ha lehetséges, adjon meg kulcsszavakat
- 50-60 karakter ideális
- Kerülje a ALL CAPS (nehezen olvasható)
- Legyen konkrét (ne "1. oldal")

### 3. lépés: Válassza ki a kategóriát

Válassza ki a tartalom rendszerezési helyét:

```
Category: [Dropdown ▼]
```

A lehetőségek a következők lehetnek:
- Tábornok
- Hírek
- Blog
- Közlemények
- Szolgáltatások

Ha nem léteznek kategóriák, kérje meg a rendszergazdát, hogy hozza létre őket.

### 4. lépés: Írja meg a tartalmat

Kattintson a tartalomszerkesztő területen, és írja be a szöveget.

#### Alapvető szövegformázás

Használja a szerkesztő eszköztárat:

| Gomb | Akció | Eredmény |
|---|---|---|
| **B** | Félkövér | **félkövér szöveg** |
| *én* | Dőlt | *Dőlt szöveg* |
| <u>U</u> | Aláhúzás | <u>Aláhúzott szöveg</u> |

#### A HTML használatával

A XOOPS biztonságos HTML címkéket tesz lehetővé. Gyakori példák:

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

#### Biztonságos HTML Példák

**Ajánlott címkék:**
- Bekezdések: `<p>`, `<br>`
- Címsorok: `<h1>` - `<h6>`
- Szöveg: `<strong>`, `<em>`, `<u>`
- Listák: `<ul>`, `<ol>`, `<li>`
- Linkek: `<a href="">`
- Idézetblokk: `<blockquote>`
- Asztalok: `<table>`, `<tr>`, `<td>`

**Kerülje el ezeket a címkéket** (biztonsági okokból ki van kapcsolva):
- Szkriptek: `<script>`
- Stílusok: `<style>`
- Iframe-ek: `<iframe>` (ha nincs konfigurálva)
- Űrlapok: `<form>`, `<input>`

### 5. lépés: Képek hozzáadása

#### 1. lehetőség: Kép beszúrása URL

A szerkesztő használata:

1. Kattintson a **Kép beszúrása** gombra (kép ikon)
2. Írja be a URL képet: `https://example.com/image.jpg`
3. Írja be az alternatív szöveget: "A kép leírása"
4. Kattintson a "Beszúrás" gombra.

HTML megfelelője:

```html
<img src="https://example.com/image.jpg" alt="Description">
```

#### 2. lehetőség: Kép feltöltése

1. Először töltse fel a képet a XOOPS-ba:
   - Lépjen a **Tartalom > Médiakezelő** oldalra
   - Töltsd fel a képedet
   - Másolja a képet URL

2. A tartalomszerkesztőben szúrja be a URL használatával (a fenti lépések)

#### Kép bevált gyakorlatok

- Használjon megfelelő fájlméretet (optimalizálja a képeket)
- Használjon leíró fájlneveket
- Mindig tartalmazzon alternatív szöveget (kisegítő lehetőségek)
- Támogatott formátumok: JPG, PNG, GIF, WebP
- Javasolt szélesség: 600-800 pixel a tartalomhoz

### 6. lépés: Média beágyazása

#### Videó beágyazása a YouTube-ról

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

Cserélje ki a `VIDEO_ID`-t a ID YouTube-videóval.

**A ID YouTube-videó megkeresése:**
1. Nyissa meg a videót a YouTube-on
2. A URL a következő: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Másolja a ID (a `v=` utáni karakterek)

#### Videó beágyazása a Vimeóból

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### 7. lépés: Meta leírás hozzáadása

A „Leírás” mezőben adjon hozzá egy rövid összefoglalót:
```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```

**Meta leírásának bevált gyakorlatai:**
- 150-160 karakter
- Tartalmazza a fő kulcsszavakat
- Pontosan össze kell foglalnia a tartalmat
- A keresőmotorok találatai között használják
- Legyen lenyűgöző (a felhasználók ezt látják)

### 8. lépés: Konfigurálja a közzétételi beállításokat

#### Közzététel állapota

Válassza ki a közzététel állapotát:

```
Status: ☑ Published
```

Opciók:
- **Közzétéve:** Nyilvánosan látható
- **Piszkozat:** Csak a rendszergazdák láthatják
- **Ellenőrzésre vár:** Jóváhagyásra vár
- **Archivált:** Rejtett, de megtartott

#### Láthatóság

Állítsa be, hogy ki láthatja ezt a tartalmat:

```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```

#### Megjelenés dátuma

Állítsa be, hogy mikor válik láthatóvá a tartalom:

```
Publish Date: [Date Picker] [Time]
```

Hagyja "Most" néven az azonnali közzétételhez.

#### Megjegyzések engedélyezése

Látogatói megjegyzések engedélyezése vagy letiltása:

```
Allow Comments: ☑ Yes
```

Ha engedélyezve van, a látogatók visszajelzést adhatnak.

### 9. lépés: Mentse el a tartalmat

Több mentési lehetőség:

```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```

- **Közzététel most:** Tedd azonnal láthatóvá
- **Mentés piszkozatként:** Egyelőre maradjon privát
- **Ütemezés:** Közzététel a jövőben: date/time
- **Előnézet:** Mentés előtt nézze meg, hogyan néz ki

Kattintson a választására:

```
Click [Publish Now]
```

### 10. lépés: Ellenőrizze az oldalt

A közzététel után ellenőrizze a tartalmat:

1. Nyissa meg webhelye kezdőlapját
2. Navigáljon a tartalomterületre
3. Keresse meg újonnan létrehozott oldalát
4. Kattintson a gombra a megtekintéséhez
5. Ellenőrizze:
   - [ ] A tartalom megfelelően jelenik meg
   - [ ] Megjelennek a képek
   - [ ] A formázás jól néz ki
   - [ ] A linkek működnek
   - [ ] A cím és a leírás helyes

## Példa: Teljes oldal

### Cím
```
Getting Started with XOOPS
```

### Tartalom
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

### Meta leírás
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```

## Speciális tartalomszolgáltatások

### A WYSIWYG szerkesztő használata

Ha rich text szerkesztő van telepítve:

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

Kattintson a gombokra a szöveg HTML nélküli formázásához.

### Kódblokkok beszúrása

Példák megjelenítési kódra:

```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```

### Táblázatok létrehozása

Rendszerezze az adatokat táblázatokba:

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

### Soron belüli idézetek

Fontos szöveg kiemelése:

```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```

## SEO Tartalom bevált gyakorlatai

Optimalizálja a tartalmat a keresőmotorok számára:

### Cím
- Tartalmazza a fő kulcsszót
- 50-60 karakter
- Oldalanként egyedi

### Meta leírás
- A kulcsszót természetesen adja meg
- 150-160 karakter
- Lenyűgöző és pontos

### Tartalom
- Írjon természetesen, kerülje a kulcsszavak tömését
- Megfelelően használja a címsorokat (h2, h3).
- Tartalmazzon belső hivatkozásokat más oldalakra
- Használjon alternatív szöveget az összes képen
- Cél a 300+ szó cikkeknél

### URL Szerkezet
- Az URL-ek legyenek rövidek és leíró jellegűek
- Használjon kötőjeleket a szavak elválasztásához
- Kerülje a speciális karaktereket
- Példa: `/about-our-company`

## A tartalom kezelése

### Meglévő oldal szerkesztése

1. Lépjen a **Tartalom > Oldalak** lehetőségre.
2. Keresse meg oldalát a listában
3. Kattintson a **Szerkesztés** gombra vagy az oldal címére
4. Végezzen változtatásokat
5. Kattintson a **Frissítés** gombra.

### Oldal törlése

1. Lépjen a **Tartalom > Oldalak** lehetőségre.
2. Keresse meg az oldalát
3. Kattintson a **Törlés** gombra.
4. Erősítse meg a törlést

### A közzététel állapotának módosítása

1. Lépjen a **Tartalom > Oldalak** lehetőségre.
2. Keresse meg az oldalt, kattintson a **Szerkesztés** lehetőségre.
3. Állapot módosítása a legördülő menüben
4. Kattintson a **Frissítés** gombra.

## A tartalomkészítéssel kapcsolatos hibaelhárítás

### A tartalom nem jelenik meg

**Tünet:** A közzétett oldal nem jelenik meg a webhelyen

**Megoldás:**
1. Ellenőrizze a közzététel állapotát: "Közzétéve" kell lennie
2. Ellenőrizze a közzététel dátumát: Aktuálisnak vagy elmúltnak kell lennie
3. Ellenőrizze a láthatóságot: "Nyilvános" legyen
4. Gyorsítótár törlése: Adminisztráció > Eszközök > Gyorsítótár törlése
5. Ellenőrizze az engedélyeket: A felhasználói csoportnak hozzáféréssel kell rendelkeznie

### A formázás nem működik

**Jelenség:** A HTML címkék vagy formázás szövegként jelennek meg

**Megoldás:**
1. Ellenőrizze, hogy a HTML engedélyezve van-e a modul beállításaiban
2. Használjon megfelelő HTML szintaxist
3. Zárja be az összes címkét: `<p>Text</p>`
4. Csak engedélyezett címkéket használjon
5. Használja a HTML entitásokat: `&lt;` a `<`, `&amp;` a `&` esetében

### A képek nem jelennek meg

**Tünet:** A képeken törött ikon látható

**Megoldás:**
1. Ellenőrizze, hogy a URL kép helyes-e
2. Ellenőrizze, hogy létezik-e képfájl
3. Ellenőrizze a kép megfelelő engedélyeit
4. Ehelyett próbálja meg feltölteni a képet a XOOPS címre
5. Ellenőrizze a külső blokkolást (szükség lehet a CORS-ra)

### Karakterkódolási problémák

**Tünet:** A speciális karakterek hamisságként jelennek meg**Megoldás:**
1. Mentse el a fájlt UTF-8 kódolásként
2. Győződjön meg arról, hogy az oldal karakterkészlete UTF-8
3. Hozzáadás a HTML fejhez: `<meta charset="UTF-8">`
4. Kerülje a Wordből való másolást (sima szöveget használjon)

## A tartalom munkafolyamatának bevált gyakorlatai

### Javasolt eljárás

1. **Először írja be a Szerkesztőbe:** Használja a rendszergazdai tartalomszerkesztőt
2. **Előnézet közzététel előtt:** Kattintson az Előnézet gombra
3. **Metaadatok hozzáadása:** Teljes cím, leírás, címkék
4. **Mentés először piszkozatként:** Mentse piszkozatként, hogy elkerülje a munka elvesztését
5. **Végső áttekintés:** Közzététel előtt olvassa el újra
6. **Közzététel:** Ha készen áll, kattintson a Közzététel gombra
7. **Ellenőrzés:** Ellenőrizze az élő oldalon
8. ** Szükség esetén szerkessze:** Gyors javítások elvégzése

### Verzióvezérlés

Mindig készítsen biztonsági másolatot:

1. **A főbb változtatások előtt:** Mentés új verzióként vagy biztonsági másolatként
2. **Régi tartalom archiválása:** A kiadatlan verziók megtartása
3. **Adja meg a piszkozatok dátumát:** Használjon egyértelmű elnevezést: „Page-Draft-2025-01-28”

## Több oldal közzététele

Tartalomstratégia létrehozása:

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

Hozzon létre oldalakat, hogy kövesse ezt a struktúrát.

## Következő lépések

Az első oldal létrehozása után:

1. Felhasználói fiókok beállítása
2. Telepítsen további modulokat
3. Fedezze fel a rendszergazdai funkciókat
4. Konfigurálja a beállításokat
5. Optimalizálja a teljesítmény beállításait

---

**Címkék:** #tartalomkészítés #oldalak #kiadás #szerkesztő

**Kapcsolódó cikkek:**
- Admin-Panel-Overview
- Kezelő-felhasználók
- modulok telepítése
- ../Configuration/Basic-Configuration
