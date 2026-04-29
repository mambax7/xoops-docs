---
title: "Δομή θεμάτων"
---

## Επισκόπηση

Τα θέματα XOOPS ελέγχουν την οπτική παρουσίαση του ιστότοπού σας. Η κατανόηση της δομής του θέματος είναι απαραίτητη για την προσαρμογή και τη δημιουργία νέων θεμάτων.

## Διάταξη καταλόγου

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

## Βασικά αρχεία

## # theme.html

Το βασικό πρότυπο διάταξης που αναδιπλώνει όλο το περιεχόμενο:

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

## # theme.ini

Αρχείο διαμόρφωσης θέματος:

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

## # Αποκλεισμός προτύπων

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

## Μεταβλητές προτύπου

## # Καθολικές μεταβλητές

| Μεταβλητή | Περιγραφή |
|----------|-------------|
| `$xoops_sitename` | Όνομα τοποθεσίας |
| `$xoops_url` | Ιστότοπος URL |
| `$xoops_theme` | Όνομα τρέχοντος θέματος |
| `$xoops_langcode` | Κωδικός γλώσσας |
| `$xoops_charset` | Κωδικοποίηση χαρακτήρων |
| `$xoops_pagetitle` | Τίτλος σελίδας |
| `$xoops_dirname` | Όνομα τρέχοντος module |

## # Μεταβλητές χρήστη

| Μεταβλητή | Περιγραφή |
|----------|-------------|
| `$xoops_isuser` | Έχει συνδεθεί |
| `$xoops_isadmin` | Είναι διαχειριστής |
| `$xoops_userid` | Αναγνωριστικό χρήστη |
| `$xoops_uname` | Όνομα χρήστη |

## # Μεταβλητές διάταξης

| Μεταβλητή | Περιγραφή |
|----------|-------------|
| `$xoops_showlblock` | Εμφάνιση αριστερών μπλοκ |
| `$xoops_showrblock` | Εμφάνιση δεξιών μπλοκ |
| `$xoops_showcblock` | Εμφάνιση κεντρικών μπλοκ |
| `$xoops_lblocks` | Συστοιχία αριστερών μπλοκ |
| `$xoops_rblocks` | Πίνακας δεξιών μπλοκ |
| `$xoops_contents` | Περιεχόμενο της κύριας σελίδας |

## Αντικαταστάσεις προτύπων μονάδας

Αντικαταστήστε τα πρότυπα λειτουργικών μονάδων τοποθετώντας τα στο θέμα σας:

```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # Overrides news module's index
    └── news_article.tpl    # Overrides article display
```

## CSS Οργάνωση

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

## Σχετική τεκμηρίωση

- ../Templates/Smarty-Templating - Σύνταξη προτύπου
- Θέμα-Ανάπτυξη - Πλήρης οδηγός θεμάτων
- CSS-Best-Practices - Οδηγίες στυλ 
- ../../03-Module-Development/Block-Development - Δημιουργία μπλοκ

