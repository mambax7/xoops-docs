---
title: "Téma FAQ"
description: "Časté dotazy k tématům XOOPS"
---

# Téma Často kladené otázky

> Běžné otázky a odpovědi týkající se témat, přizpůsobení a správy XOOPS.

---

## Instalace a aktivace motivu

### Otázka: Jak nainstaluji nový motiv do XOOPS?

**A:**
1. Stáhněte si soubor zip motivu
2. Přejděte na XOOPS Admin > Vzhled > Motivy
3. Klikněte na „Nahrát“ a vyberte soubor zip
4. Motiv se zobrazí v seznamu motivů
5. Kliknutím jej aktivujete pro svůj web

Alternativa: Extrahujte ručně do adresáře `/themes/` a obnovte panel administrátora.

---

### Otázka: Nahrání motivu se nezdařilo s „Povolení odepřeno“

**A:** Opravte oprávnění adresáře motivu:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### Otázka: Jak nastavím jiné téma pro konkrétní uživatele?

**A:**
1. Přejděte do Správce uživatelů > Upravit uživatele
2. Přejděte na kartu „Další“.
3. V rozevíracím seznamu „Uživatelský motiv“ vyberte preferovaný motiv
4. Uložit

Motivy vybrané uživatelem přepíší výchozí motiv webu.

---

### Otázka: Mohu mít různá témata pro administrátorské a uživatelské stránky?

**A:** Ano, nastavit v XOOPS Admin > Nastavení:

1. **Frontend theme** – Výchozí motiv webu
2. **Téma správce** – Motiv ovládacího panelu správce (obvykle samostatný)

Hledejte nastavení jako:
- `theme_set` - Motiv frontendu
- `admin_theme` - Téma správce

---

## Přizpůsobení motivu

### Otázka: Jak přizpůsobím existující motiv?

**A:** Vytvořte podřízený motiv pro zachování aktualizací:

```
themes/
├── original_theme/
│   ├── style.css
│   ├── templates/
│   └── images/
└── custom_theme/          {* Create copy for editing *}
    ├── style.css
    ├── templates/
    └── images/
```

Poté upravte `theme.html` ve svém vlastním motivu.

---

### Otázka: Jak změním barvy motivu?

**A:** Upravte soubor CSS motivu:

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

Pro motivy XOOPS:

```css
/* themes/mytheme/style.css */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
}

body {
    background-color: var(--primary-color);
    color: #333;
}

a {
    color: var(--secondary-color);
}

.button {
    background-color: var(--accent-color);
}
```

---

### Otázka: Jak přidám vlastní CSS do motivu?

**A:** Několik možností:

**Možnost 1: Upravit theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**Možnost 2: Vytvořte custom.css**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**Možnost 3: Nastavení správce (pokud je podporováno)**
Přejděte do Správce XOOPS > Nastavení > Nastavení motivu a přidejte vlastní CSS.

---

### Otázka: Jak upravím šablony motivu HTML?

**A:** Najděte soubor šablony:

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

Upravit se správnou syntaxí Smarty:

```html
<!-- themes/mytheme/templates/theme.html -->
{* XOOPS Theme Template *}
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>
        {include file="file:header.html"}
    </header>

    <main>
        <div class="container">
            <div class="row">
                <div class="col-md-9">
                    {$xoops_contents}
                </div>
                <aside class="col-md-3">
                    {include file="file:sidebar.html"}
                </aside>
            </div>
        </div>
    </main>

    <footer>
        {include file="file:footer.html"}
    </footer>
</body>
</html>
```

---

## Struktura tématu

### Otázka: Jaké soubory jsou vyžadovány v motivu?

**A:** Minimální struktura:

```
themes/mytheme/
├── theme.html              {* Main template (required) *}
├── style.css              {* Stylesheet (optional but recommended) *}
├── screenshot.png         {* Preview image for admin (optional) *}
├── images/                {* Theme images *}
│   └── logo.png
└── templates/             {* Optional: Additional templates *}
    ├── header.html
    ├── footer.html
    └── sidebar.html
```

Podrobnosti viz Struktura motivu.

---

### Otázka: Jak vytvořím téma úplně od začátku?

**A:** Vytvořte strukturu:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

Vytvořit `theme.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>{$xoops_headers}</header>
    <main>{$xoops_contents}</main>
    <footer>{$xoops_footers}</footer>
</body>
</html>
```

Vytvořit `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## Tématické proměnné

### Otázka: Jaké proměnné jsou dostupné v šablonách motivů?

**A:** Běžné proměnné motivu XOOPS:

```smarty
{* Site Information *}
{$xoops_sitename}          {* Site name *}
{$xoops_url}               {* Site URL *}
{$xoops_theme}             {* Current theme name *}

{* Page Content *}
{$xoops_contents}          {* Main page content *}
{$xoops_pagetitle}         {* Page title *}
{$xoops_headers}           {* Meta tags, styles in head *}

{* Module Information *}
{$xoops_module_header}     {* Module-specific header *}
{$xoops_moduledesc}        {* Module description *}

{* User Information *}
{$xoops_isuser}            {* Is user logged in? *}
{$xoops_userid}            {* User ID *}
{$xoops_uname}             {* Username *}

{* Blocks *}
{$xoops_blocks}            {* All block content *}

{* Other *}
{$xoops_charset}           {* Document charset *}
{$xoops_version}           {* XOOPS version *}
```

---

### Otázka: Jak přidám vlastní proměnné do svého motivu?

**A:** V kódu PHP před vykreslením:

```php
<?php
// In module or admin code
require_once XOOPS_ROOT_PATH . '/class/xoopstpl.php';
$xoopsTpl = new XOOPSTpl();

// Add custom variables
$xoopsTpl->assign('my_variable', 'value');
$xoopsTpl->assign('data_array', ['key1' => 'val1', 'key2' => 'val2']);

// Use in theme template
$xoopsTpl->display('file:theme.html');
?>
```

V tématu:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## Styling motivu

### Otázka: Jak zajistím, aby mé téma reagovalo?

**A:** Použijte mřížku CSS nebo Flexbox:

```css
/* themes/mytheme/style.css */

/* Mobile first approach */
body {
    font-size: 14px;
}

.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

main {
    order: 2;
}

aside {
    order: 3;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        grid-template-columns: 2fr 1fr;
    }
}

/* Desktop and up */
@media (min-width: 1200px) {
    .container {
        grid-template-columns: 3fr 1fr;
    }
}
```

Nebo použijte integraci Bootstrap:
```html
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<div class="container">
    <div class="row">
        <div class="col-md-9">{$xoops_contents}</div>
        <div class="col-md-3">{* Sidebar *}</div>
    </div>
</div>
```

---

### Otázka: Jak do svého motivu přidám tmavý režim?

**A:**
```css
/* themes/mytheme/style.css */

/* Light mode (default) */
:root {
    --bg-color: #ffffff;
    --text-color: #000000;
    --border-color: #cccccc;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
        --border-color: #444444;
    }
}

/* Or with CSS class */
body.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #444444;
}
```

Přepnout pomocí JavaScript:
```html
<script>
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
</script>
```

---

## Tématické problémy

### Otázka: Motiv zobrazuje chyby „nerozpoznaná proměnná šablony“.

**A:** Proměnná není předávána do šablony. Zkontrolujte:

1. **Proměnná je přiřazena** v PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **Šablona existuje** tam, kde je uvedeno
3. **Syntaxe šablony je správná**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

### Otázka: Změny CSS se v prohlížeči nezobrazují

**A:** Vymažte mezipaměť prohlížeče:

1. Tvrdé obnovení: `Ctrl+Shift+R` (Cmd+Shift+R na Macu)
2. Vymažte mezipaměť motivu na serveru:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. Zkontrolujte cestu k souboru CSS v tématu: 
```bash
ls -la themes/mytheme/style.css
```

---

### Otázka: Obrázky v motivu se nenačítají

**A:** Zkontrolujte cesty obrázků:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### Otázka: Šablony motivů chybí nebo způsobují chyby

**A:** Ladění viz Chyby šablony.

---

## Distribuce motivů

### Otázka: Jak zabalím téma pro distribuci?

**A:** Vytvořte distribuovatelný zip:

```bash
# Structure
mytheme/
├── theme.html           {* Required *}
├── style.css
├── screenshot.png       {* 300x225 recommended *}
├── README.txt
├── LICENSE
├── images/
│   ├── logo.png
│   └── favicon.ico
└── templates/           {* Optional *}
    ├── header.html
    └── footer.html

# Create zip
zip -r mytheme.zip mytheme/
```

---

### Otázka: Mohu prodat své téma XOOPS?

**A:** Zkontrolujte licenci XOOPS:
- Motivy používající XOOPS classes/templates musí respektovat licenci XOOPS
- Čistá témata CSS/HTML mají méně omezení
- Podrobnosti naleznete v pokynech pro přispívání XOOPS

---

## Výkon motivu

### Otázka: Jak mohu optimalizovat výkon motivu?**A:**
1. **Minimalizujte CSS/JS** – Odstraňte nepoužívaný kód
2. **Optimalizace obrázků** – Používejte správné formáty (WebP, AVIF)
3. **Pro zdroje použijte CDN**
4. **Léné načítání** obrázky:
```html
<img src="image.jpg" loading="lazy">
```

5. **Verze s vynecháním mezipaměti**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

Další podrobnosti viz Výkon FAQ.

---

## Související dokumentace

- Chyby šablony
- Struktura tématu
- Výkon FAQ
- Ladění Smarty

---

#xoops #témata #časté dotazy #řešení problémů #přizpůsobení