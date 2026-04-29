---
title: "थीम संरचना"
---
## अवलोकन

XOOPS थीम आपकी साइट की दृश्य प्रस्तुति को नियंत्रित करती हैं। अनुकूलन और नई थीम बनाने के लिए थीम संरचना को समझना आवश्यक है।

## निर्देशिका लेआउट

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

## आवश्यक फ़ाइलें

### थीम.html

मुख्य लेआउट टेम्पलेट जो सभी सामग्री को लपेटता है:

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

### थीम.आईएनआई

थीम कॉन्फ़िगरेशन फ़ाइल:

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

### ब्लॉक टेम्पलेट्स

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

## टेम्पलेट वेरिएबल्स

### वैश्विक चर

| परिवर्तनीय | विवरण |
|---|----|
| `$xoops_sitename` | साइट का नाम |
| `$xoops_url` | साइट URL |
| `$xoops_theme` | वर्तमान थीम का नाम |
| `$xoops_langcode` | भाषा कोड |
| `$xoops_charset` | कैरेक्टर एन्कोडिंग |
| `$xoops_pagetitle` | पृष्ठ शीर्षक |
| `$xoops_dirname` | वर्तमान मॉड्यूल नाम |

### उपयोगकर्ता चर

| परिवर्तनीय | विवरण |
|---|----|
| `$xoops_isuser` | लॉग इन है |
| `$xoops_isadmin` | प्रशासक है |
| `$xoops_userid` | उपयोगकर्ता आईडी |
| `$xoops_uname` | उपयोगकर्ता नाम |

### लेआउट वेरिएबल्स

| परिवर्तनीय | विवरण |
|---|----|
| `$xoops_showlblock` | बाएँ ब्लॉक दिखाएँ |
| `$xoops_showrblock` | दाएँ ब्लॉक दिखाएँ |
| `$xoops_showcblock` | केंद्र ब्लॉक दिखाएँ |
| `$xoops_lblocks` | बाएँ ब्लॉक सरणी |
| `$xoops_rblocks` | राइट ब्लॉक ऐरे |
| `$xoops_contents` | मुख्य पृष्ठ सामग्री |

## मॉड्यूल टेम्पलेट ओवरराइड

मॉड्यूल टेम्प्लेट को अपनी थीम में रखकर ओवरराइड करें:

```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # Overrides news module's index
    └── news_article.tpl    # Overrides article display
```

## CSS संगठन

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

## संबंधित दस्तावेज़ीकरण

- ../Templates/Smarty-टेम्पलेटिंग - टेम्पलेट सिंटैक्स
- थीम-विकास - संपूर्ण थीम गाइड
- CSS-सर्वोत्तम अभ्यास - स्टाइलिंग दिशानिर्देश 
- ../../03-मॉड्यूल-विकास/ब्लॉक-विकास - ब्लॉक बनाना