---
title: "Vytvoření první stránky"
description: "Podrobný průvodce vytvářením a publikováním obsahu v XOOPS, včetně formátování, vkládání médií a možností publikování"
---

# Vytvoření první stránky v XOOPS

Naučte se vytvářet, formátovat a publikovat svůj první obsah v XOOPS.

## Porozumění obsahu XOOPS

### Co je Page/Post?

V XOOPS je obsah spravován prostřednictvím modulů. Nejběžnější typy obsahu jsou:

| Typ | Popis | Případ použití |
|---|---|---|
| **Stránka** | Statický obsah | O nás, Kontakt, Služby |
| **Post/Article** | Obsah s časovým razítkem | Novinky, příspěvky na blogu |
| **Kategorie** | Organizace obsahu | Obsah související se skupinou |
| **Komentář** | Zpětná vazba od uživatelů | Povolit interakci návštěvníků |

Tato příručka popisuje vytvoření základního page/article pomocí výchozího modulu obsahu XOOPS.

## Přístup k Editoru obsahu

### Z panelu administrátora

1. Přihlaste se do administračního panelu: `http://your-domain.com/xoops/admin/`
2. Přejděte na **Obsah > Stránky** (nebo váš obsahový modul)
3. Klikněte na „Přidat novou stránku“ nebo „Nový příspěvek“

### Frontend (pokud je povoleno)

Pokud je váš XOOPS nakonfigurován tak, aby umožňoval vytváření frontendového obsahu:

1. Přihlaste se jako registrovaný uživatel
2. Přejděte do svého profilu
3. Hledejte možnost „Odeslat obsah“.
4. Postupujte podle níže uvedených kroků

## Rozhraní editoru obsahu

Editor obsahu obsahuje:

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

## Průvodce krok za krokem: Vytvoření první stránky

### Krok 1: Otevřete Editor obsahu

1. Na panelu administrátora klikněte na **Obsah > Stránky**
2. Klikněte na **„Přidat novou stránku“** nebo **„Vytvořit“**
3. Zobrazí se editor obsahu

### Krok 2: Zadejte název stránky

Do pole „Title“ zadejte název vaší stránky:

```
Title: Welcome to Our Website
```

Doporučené postupy pro tituly:
- Jasné a popisné
– Pokud je to možné, zahrňte klíčová slova
- Ideální 50-60 znaků
- Vyhněte se ALL CAPS (těžko čitelné)
– Buďte konkrétní (nikoli „Strana 1“)

### Krok 3: Vyberte kategorii

Vyberte, kde chcete tento obsah uspořádat:

```
Category: [Dropdown ▼]
```

Možnosti mohou zahrnovat:
- Generále
- Novinky
- Blog
- Oznámení
- Služby

Pokud kategorie neexistují, požádejte správce o jejich vytvoření.

### Krok 4: Napište svůj obsah

Klikněte do oblasti editoru obsahu a zadejte text.

#### Základní formátování textu

Použijte panel nástrojů editoru:

| Tlačítko | Akce | Výsledek |
|---|---|---|
| **B** | Tučné | **Tučný text** |
| *Já* | Kurzíva | *Text kurzívou* |
| <u>U</u> | Podtrhnout | <u>Podtržený text</u> |

#### Pomocí HTML

XOOPS umožňuje bezpečné štítky HTML. Běžné příklady:

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

#### Bezpečné příklady HTML

**Doporučené štítky:**
- Odstavce: `<p>`, `<br>`
- Záhlaví: `<h1>` až `<h6>`
- Text: `<strong>`, `<em>`, `<u>`
- Seznamy: `<ul>`, `<ol>`, `<li>`
- Odkazy: `<a href="">`
- Blokové uvozovky: `<blockquote>`
- Stoly: `<table>`, `<tr>`, `<td>`

**Vyhněte se těmto značkám** (mohou být z bezpečnostních důvodů zakázány):
- Skripty: `<script>`
- Styly: `<style>`
- iframe: `<iframe>` (pokud není nakonfigurováno)
- Formuláře: `<form>`, `<input>`

### Krok 5: Přidejte obrázky

#### Možnost 1: Vložit obrázek URL

Pomocí editoru:

1. Klikněte na tlačítko **Vložit obrázek** (ikona obrázku)
2. Zadejte obrázek URL: `https://example.com/image.jpg`
3. Zadejte alternativní text: „Popis obrázku“
4. Klikněte na "Vložit"

Ekvivalent HTML:

```html
<img src="https://example.com/image.jpg" alt="Description">
```

#### Možnost 2: Nahrajte obrázek

1. Nejprve nahrajte obrázek do XOOPS:
   – Přejděte na **Obsah > Správce médií**
   - Nahrajte svůj obrázek
   - Zkopírujte obrázek URL

2. V editoru obsahu vložte pomocí URL (výše uvedené kroky)

#### Doporučené postupy pro obrázky

- Používejte vhodné velikosti souborů (optimalizace obrázků)
- Používejte popisné názvy souborů
- Vždy zahrňte alternativní text (přístupnost)
- Podporované formáty: JPG, PNG, GIF, WebP
- Doporučená šířka: 600–800 pixelů pro obsah

### Krok 6: Vložení média

#### Vložit video z YouTube

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

Nahraďte `VIDEO_ID` ID videa YouTube.

**Zjištění ID videa YouTube:**
1. Otevřete video na YouTube
2. URL je: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Zkopírujte ID (znaky za `v=`)

#### Vložit video z Vimeo

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### Krok 7: Přidejte popis metadat

Do pole „Popis“ přidejte krátké shrnutí:

```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```

**Doporučené postupy pro popis metadat:**
- 150-160 znaků
- Zahrňte hlavní klíčová slova
- Měl by přesně shrnout obsah
- Používá se ve výsledcích vyhledávačů
- Udělejte to přesvědčivé (uživatelé to vidí)

### Krok 8: Nakonfigurujte možnosti publikování

#### Stav publikováníVyberte stav publikace:

```
Status: ☑ Published
```

Možnosti:
- **Publikováno:** Viditelné pro veřejnost
- **Koncept:** Viditelné pouze pro administrátory
- **Čeká na kontrolu:** Čeká na schválení
- **Archivováno:** Skryto, ale zachováno

#### Viditelnost

Nastavte, kdo může tento obsah vidět:

```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```

#### Datum vydání

Nastavit, kdy bude obsah viditelný:

```
Publish Date: [Date Picker] [Time]
```

Chcete-li okamžitě publikovat, ponechte jako „Nyní“.

#### Povolit komentáře

Povolit nebo zakázat komentáře návštěvníků:

```
Allow Comments: ☑ Yes
```

Pokud je povoleno, návštěvníci mohou přidávat zpětnou vazbu.

### Krok 9: Uložte svůj obsah

Více možností uložení:

```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```

- **Publikovat nyní:** Okamžitě zviditelnit
- **Uložit jako koncept:** Zachovejte zatím soukromí
- **Plán:** Publikovat na budoucím date/time
- **Náhled:** Před uložením se podívejte, jak to vypadá

Klikněte na svou volbu:

```
Click [Publish Now]
```

### Krok 10: Ověřte svou stránku

Po publikování ověřte svůj obsah:

1. Přejděte na domovskou stránku svého webu
2. Přejděte do oblasti obsahu
3. Vyhledejte svou nově vytvořenou stránku
4. Kliknutím jej zobrazíte
5. Zkontrolujte:
   - [ ] Obsah se zobrazuje správně
   - [ ] Zobrazí se obrázky
   - [ ] Formátování vypadá dobře
   - [ ] Odkazy fungují
   - [ ] Správný název a popis

## Příklad: Kompletní stránka

### Název
```
Getting Started with XOOPS
```

### Obsah
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

### Popis metadat
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```

## Pokročilé funkce obsahu

### Pomocí editoru WYSIWYG

Pokud je nainstalován editor formátovaného textu:

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

Klepnutím na tlačítka formátujete text bez HTML.

### Vkládání bloků kódu

Příklady kódu zobrazení:

```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```

### Vytváření tabulek

Uspořádejte data do tabulek:

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

### Vložené nabídky

Zvýrazněte důležitý text:

```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```

## SEO Nejlepší postupy pro obsah

Optimalizujte svůj obsah pro vyhledávače:

### Název
- Zahrnout hlavní klíčové slovo
- 50-60 znaků
- Jedinečné na stránku

### Popis metadat
- Přirozeně zahrňte klíčové slovo
- 150-160 znaků
- Působivé a přesné

### Obsah
- Pište přirozeně, vyvarujte se přeplňování klíčovými slovy
- Použijte nadpisy (h2, h3) vhodně
- Zahrnout interní odkazy na jiné stránky
- Používejte alternativní text na všech obrázcích
- Zaměřte se na 300+ slov pro články

### Struktura URL
- Udržujte adresy URL krátké a popisné
- K oddělení slov používejte pomlčky
- Vyhněte se speciálním znakům
- Příklad: `/about-our-company`

## Správa vašeho obsahu

### Upravit existující stránku

1. Přejděte na **Obsah > Stránky**
2. Najděte svou stránku v seznamu
3. Klikněte na **Upravit** nebo na název stránky
4. Proveďte změny
5. Klikněte na **Aktualizovat**

### Smazat stránku

1. Přejděte na **Obsah > Stránky**
2. Najděte svou stránku
3. Klikněte na **Smazat**
4. Potvrďte smazání

### Změnit stav publikace

1. Přejděte na **Obsah > Stránky**
2. Najděte stránku, klikněte na **Upravit**
3. Změňte stav v rozevíracím seznamu
4. Klikněte na **Aktualizovat**

## Odstraňování problémů s vytvářením obsahu

### Obsah se nezobrazuje

**Příznak:** Publikovaná stránka se na webu nezobrazuje

**Řešení:**
1. Zkontrolujte stav publikace: Mělo by být „Publikováno“
2. Zkontrolujte datum zveřejnění: Mělo by být aktuální nebo minulé
3. Zkontrolujte viditelnost: Mělo by být „Veřejné“
4. Vymazat mezipaměť: Správce > Nástroje > Vymazat mezipaměť
5. Zkontrolujte oprávnění: Skupina uživatelů musí mít přístup

### Formátování nefunguje

**Příznak:** HTML značky nebo formátování se zobrazí jako text

**Řešení:**
1. Ověřte, zda je v nastavení modulu povoleno HTML
2. Použijte správnou syntaxi HTML
3. Zavřete všechny značky: `<p>Text</p>`
4. Používejte pouze povolené značky
5. Použijte entity HTML: `&lt;` pro `<`, `&amp;` pro `&`

### Obrázky se nezobrazují

**Příznak:** Obrázky zobrazují rozbitou ikonu

**Řešení:**
1. Ověřte správnost obrázku URL
2. Zkontrolujte, zda soubor obrázku existuje
3. Ověřte správná oprávnění k obrázku
4. Zkuste místo toho nahrát obrázek do XOOPS
5. Zkontrolujte vnější blokování (může potřebovat CORS)

### Problémy s kódováním znaků

**Příznak:** Speciální znaky se zobrazují jako nesmysly

**Řešení:**
1. Uložte soubor jako kódování UTF-8
2. Ujistěte se, že znaková sada stránky je UTF-8
3. Přidat k hlavě HTML: `<meta charset="UTF-8">`
4. Vyhněte se kopírování a vkládání z Wordu (použijte prostý text)

## Doporučené postupy pro práci s obsahem

### Doporučený postup1. **Nejdříve napište v editoru:** Použijte administrátorský editor obsahu
2. **Náhled před publikováním:** Klikněte na tlačítko Náhled
3. **Přidat metadata:** Kompletní název, popis, značky
4. **Uložit nejprve jako koncept:** Uložte jako koncept, abyste neztratili práci
5. **Konečná recenze:** Před publikováním si znovu přečtěte
6. **Publikovat:** Až budete připraveni, klikněte na Publikovat
7. **Ověřte:** Zkontrolujte na živém webu
8. **V případě potřeby upravte:** Rychle provádějte opravy

### Kontrola verzí

Vždy mějte zálohy:

1. **Před hlavními změnami:** Uložte jako novou verzi nebo zálohu
2. **Archivujte starý obsah:** Uchovávejte nepublikované verze
3. **Datum vašich návrhů:** Použijte jasný název: „Page-Draft-2025-01-28“

## Publikování více stránek

Vytvořte obsahovou strategii:

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

Vytvořte stránky podle této struktury.

## Další kroky

Po vytvoření první stránky:

1. Nastavte uživatelské účty
2. Nainstalujte další moduly
3. Prozkoumejte funkce správce
4. Nakonfigurujte nastavení
5. Optimalizujte pomocí nastavení výkonu

---

**Značky:** #tvorba obsahu #stránky #publikování #editor

**Související články:**
- Admin-Panel-Přehled
- Správa uživatelů
- Instalační moduly
- ../Configuration/Basic-Configuration