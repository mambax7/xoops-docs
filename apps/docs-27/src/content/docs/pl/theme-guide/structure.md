---
title: "Struktura motywu"
description: ""
---

## Przegląd

Motywy XOOPS kontrolują wizualną prezentację Twojej witryny. Zrozumienie struktury motywu jest niezbędne do dostosowania i tworzenia nowych motywów.

## Układ katalogów

```
themes/mytheme/
├── theme.html                  # Główny szablon układu
├── theme.ini                   # Konfiguracja motywu
├── theme_blockleft.html        # Szablon bloku lewego paska bocznego
├── theme_blockright.html       # Szablon bloku prawego paska bocznego
├── theme_blockcenter_c.html    # Blok centrowy (wyśrodkowany)
├── theme_blockcenter_l.html    # Blok centrowy (wyrównany do lewej)
├── theme_blockcenter_r.html    # Blok centrowy (wyrównany do prawej)
├── css/
│   ├── style.css              # Główny arkusz stylów
│   ├── admin.css              # Dostosowania administracyjne (opcjonalnie)
│   └── print.css              # Arkusz stylów drukowania (opcjonalnie)
├── js/
│   └── theme.js               # JavaScript motywu
├── images/
│   ├── logo.png               # Logo witryny
│   └── icons/                 # Ikony motywu
├── language/
│   └── english/
│       └── main.php           # Tłumaczenia motywu
├── modules/                    # Przesłonięcia szablonów modułów
│   └── news/
│       └── news_index.tpl
└── screenshot.png             # Obraz podglądu motywu
```

## Pliki niezbędne

### theme.html

Główny szablon układu, który opakowuje całą zawartość:

```html
<!DOCTYPE html>
<html lang="<{$xoops_langcode}>">
<head>
    <meta charset="<{$xoops_charset}>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><{$xoops_sitename}> - <{$xoops_pagetitle}></title>
    <meta name="description" content="<{$xoops_meta_description}>">
    <meta name="keywords" content="<{$xoops_meta_keywords}>">

    {* Nagłówki specyficzne dla modułu *}
    <{$xoops_module_header}>

    {* Arkusze stylów motywu *}
    <link rel="stylesheet" href="<{$xoops_url}>/themes/<{$xoops_theme}>/css/style.css">
</head>
<body class="<{$xoops_dirname}>">
    <header class="site-header">
        <a href="<{$xoops_url}>" class="logo">
            <img src="<{$xoops_url}>/themes/<{$xoops_theme}>/images/logo.png"
                 alt="<{$xoops_sitename}>">
        </a>
        <nav class="main-nav">
            <{$xoops_mainmenu}>
        </nav>
    </header>

    <div class="page-container">
        {* Lewy pasek boczny *}
        <{if $xoops_showlblock == 1}>
        <aside class="sidebar-left">
            <{foreach item=block from=$xoops_lblocks}>
                <{include file="theme:theme_blockleft.html"}>
            <{/foreach}>
        </aside>
        <{/if}>

        {* Główna zawartość *}
        <main class="content">
            <{$xoops_contents}>
        </main>

        {* Prawy pasek boczny *}
        <{if $xoops_showrblock == 1}>
        <aside class="sidebar-right">
            <{foreach item=block from=$xoops_rblocks}>
                <{include file="theme:theme_blockright.html"}>
            <{/foreach}>
        </aside>
        <{/if}>
    </div>

    <footer class="site-footer">
        <{$xoops_footer}>
    </footer>

    {* Stopki specyficzne dla modułu *}
    <{$xoops_module_footer}>
</body>
</html>
```

### theme.ini

Plik konfiguracyjny motywu:

```ini
[Theme]
name = "My Theme"
version = "1.0.0"
author = "Your Name"
license = "GPL-2.0"
description = "A modern responsive theme"

[Screenshots]
screenshot = "screenshot.png"

[Options]
responsive = true
bootstrap = false

[Settings]
primary_color = "#3498db"
secondary_color = "#2c3e50"
```

### Szablony bloków

```html
{* theme_blockleft.html *}
<section class="block block-left" id="block-<{$block.id}>">
    <{if $block.title}>
        <h3 class="block-title"><{$block.title}></h3>
    <{/if}>
    <div class="block-content">
        <{$block.content}>
    </div>
</section>
```

## Zmienne szablonu

### Zmienne globalne

| Zmienna | Opis |
|----------|-------------|
| `$xoops_sitename` | Nazwa witryny |
| `$xoops_url` | URL witryny |
| `$xoops_theme` | Nazwa bieżącego motywu |
| `$xoops_langcode` | Kod języka |
| `$xoops_charset` | Kodowanie znaków |
| `$xoops_pagetitle` | Tytuł strony |
| `$xoops_dirname` | Nazwa bieżącego modułu |

### Zmienne użytkownika

| Zmienna | Opis |
|----------|-------------|
| `$xoops_isuser` | Czy zalogowany |
| `$xoops_isadmin` | Czy administrator |
| `$xoops_userid` | ID użytkownika |
| `$xoops_uname` | Nazwa użytkownika |

### Zmienne układu

| Zmienna | Opis |
|----------|-------------|
| `$xoops_showlblock` | Pokaż bloki lewe |
| `$xoops_showrblock` | Pokaż bloki prawe |
| `$xoops_showcblock` | Pokaż bloki centrowe |
| `$xoops_lblocks` | Tablica bloków lewych |
| `$xoops_rblocks` | Tablica bloków prawych |
| `$xoops_contents` | Główna zawartość strony |

## Przesłonięcia szablonów modułów

Przesłoń szablony modułów, umieszczając je w motywie:

```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # Przesłania indeks modułu news
    └── news_article.tpl    # Przesłania wyświetlanie artykułu
```

## Organizacja CSS

```css
/* css/style.css */

/* === Zmienne === */
:root {
    --primary-color: #3498db;
    --text-color: #333;
    --bg-color: #fff;
}

/* === Podstawa === */
body {
    font-family: system-ui, sans-serif;
    color: var(--text-color);
    background: var(--bg-color);
}

/* === Układ === */
.page-container {
    display: grid;
    grid-template-columns: 250px 1fr 250px;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

/* === Komponenty === */
.block {
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 4px;
}

.block-title {
    margin: 0 0 10px;
    font-size: 1.1em;
}

/* === Responsywny === */
@media (max-width: 768px) {
    .page-container {
        grid-template-columns: 1fr;
    }

    .sidebar-left,
    .sidebar-right {
        order: 2;
    }
}
```

## Powiązana dokumentacja

- ../Templates/Smarty-Templating - Składnia szablonów
- Theme-Development - Kompletny przewodnik po motywach
- CSS-Best-Practices - Wytyczne stylizacji
- ../../03-Module-Development/Block-Development - Tworzenie bloków

