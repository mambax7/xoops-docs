---
title: "theme Yapısı"
---
## Genel Bakış

XOOPS temaları sitenizin görsel sunumunu kontrol eder. theme yapısını anlamak, kişiselleştirme ve yeni themes oluşturmak için çok önemlidir.

## Dizin Düzeni
```
themes/mytheme/
├── theme.html                  # Main layout template
├── theme.ini                   # Theme configuration
├── theme_blockleft.html        # Left sidebar block template
├── theme_blockright.html       # Right sidebar block template
├── theme_blockcenter_c.html    # Center block (centered)
├── theme_blockcenter_l.html    # Center block (left-aligned)
├── theme_blockcenter_r.html    # Center block (right-aligned)
├── css/
│   ├── style.css              # Main stylesheet
│   ├── admin.css              # Admin customizations (optional)
│   └── print.css              # Print stylesheet (optional)
├── js/
│   └── theme.js               # Theme JavaScript
├── images/
│   ├── logo.png               # Site logo
│   └── icons/                 # Theme icons
├── language/
│   └── english/
│       └── main.php           # Theme translations
├── modules/                    # Module template overrides
│   └── news/
│       └── news_index.tpl
└── screenshot.png             # Theme preview image
```
## Temel Dosyalar

### theme.html

Tüm içeriği saran ana düzen şablonu:
```html
<!DOCTYPE html>
<html lang="<{$xoops_langcode}>">
<head>
    <meta charset="<{$xoops_charset}>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><{$xoops_sitename}> - <{$xoops_pagetitle}></title>
    <meta name="description" content="<{$xoops_meta_description}>">
    <meta name="keywords" content="<{$xoops_meta_keywords}>">

    {* Module-specific headers *}
    <{$xoops_module_header}>

    {* Theme stylesheets *}
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
        {* Left sidebar *}
        <{if $xoops_showlblock == 1}>
        <aside class="sidebar-left">
            <{foreach item=block from=$xoops_lblocks}>
                <{include file="theme:theme_blockleft.html"}>
            <{/foreach}>
        </aside>
        <{/if}>

        {* Main content *}
        <main class="content">
            <{$xoops_contents}>
        </main>

        {* Right sidebar *}
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

    {* Module-specific footers *}
    <{$xoops_module_footer}>
</body>
</html>
```
### theme.ini

theme yapılandırma dosyası:
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
### Blok Şablonları
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
## template Değişkenleri

### Genel Değişkenler

| Değişken | Açıklama |
|----------|----------------|
| `$xoops_sitename` | Site adı |
| `$xoops_url` | Sitesi URL |
| `$xoops_theme` | Geçerli theme adı |
| `$xoops_langcode` | Dil kodu |
| `$xoops_charset` | Karakter kodlaması |
| `$xoops_pagetitle` | Sayfa başlığı |
| `$xoops_dirname` | Geçerli module adı |

### user Değişkenleri

| Değişken | Açıklama |
|----------|----------------|
| `$xoops_isuser` | Oturum açıldı |
| `$xoops_isadmin` | Yönetici |
| `$xoops_userid` | user Kimliği |
| `$xoops_uname` | user adı |

### Düzen Değişkenleri

| Değişken | Açıklama |
|----------|----------------|
| `$xoops_showlblock` | Sol blokları göster |
| `$xoops_showrblock` | Sağ blokları göster |
| `$xoops_showcblock` | Orta blokları göster |
| `$xoops_lblocks` | Sol bloklar dizisi |
| `$xoops_rblocks` | Sağ bloklar dizisi |
| `$xoops_contents` | Ana sayfa içeriği |

## module Şablonu Geçersiz Kılmaları

module şablonlarını temanıza yerleştirerek geçersiz kılın:
```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # Overrides news module's index
    └── news_article.tpl    # Overrides article display
```
## CSS Organizasyon
```css
/* css/style.css */

/* === Variables === */
:root {
    --primary-color: #3498db;
    --text-color: #333;
    --bg-color: #fff;
}

/* === Base === */
body {
    font-family: system-ui, sans-serif;
    color: var(--text-color);
    background: var(--bg-color);
}

/* === Layout === */
.page-container {
    display: grid;
    grid-template-columns: 250px 1fr 250px;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

/* === Components === */
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

/* === Responsive === */
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
## İlgili Belgeler

- ../Templates/Smarty-Templating - template söz dizimi
- theme Geliştirme - Tam theme kılavuzu
- CSS-En İyi Uygulamalar - Şekillendirme yönergeleri 
- ../../03-Module-Development/Block-Development - Blok oluşturma