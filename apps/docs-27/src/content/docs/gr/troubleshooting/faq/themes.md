---
title: "Θέμα FAQ"
description: "Συχνές ερωτήσεις σχετικά με XOOPS θέματα"
---

# Θέμα Συχνές Ερωτήσεις

> Συνήθεις ερωτήσεις και απαντήσεις σχετικά με XOOPS θέματα, προσαρμογή και διαχείριση.

---

## Εγκατάσταση & Ενεργοποίηση θέματος

## # Ε: Πώς μπορώ να εγκαταστήσω ένα νέο θέμα στο XOOPS;

**Α:**
1. Κατεβάστε το αρχείο zip του θέματος
2. Μεταβείτε στο XOOPS Διαχειριστής > Εμφάνιση > Θέματα
3. Κάντε κλικ στο «Μεταφόρτωση» και επιλέξτε το αρχείο zip
4. Το θέμα εμφανίζεται στη λίστα θεμάτων
5. Κάντε κλικ για να το ενεργοποιήσετε για τον ιστότοπό σας

Εναλλακτικά: Εξαγωγή μη αυτόματα στον κατάλογο `/themes/` και ανανέωση του πίνακα διαχείρισης.

---

## # Ε: Η μεταφόρτωση θέματος αποτυγχάνει με "Απόρριψη άδειας"

**Α:** Διόρθωση δικαιωμάτων καταλόγου θεμάτων:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

## # Ε: Πώς μπορώ να ορίσω ένα διαφορετικό θέμα για συγκεκριμένους χρήστες;

**Α:**
1. Μεταβείτε στη Διαχείριση χρηστών > Επεξεργασία χρήστη
2. Μεταβείτε στην καρτέλα "Άλλα".
3. Επιλέξτε το προτιμώμενο θέμα στο αναπτυσσόμενο μενού "Θέμα χρήστη".
4. Αποθήκευση

Τα θέματα που έχουν επιλεγεί από τον χρήστη αντικαθιστούν το προεπιλεγμένο θέμα τοποθεσίας.

---

## # Ε: Μπορώ να έχω διαφορετικά θέματα για ιστότοπους διαχειριστών και χρηστών;

**Α:** Ναι, ορίστηκε στο XOOPS Διαχειριστής > Ρυθμίσεις:

1. **Μπροστινό θέμα** - Προεπιλεγμένο θέμα ιστότοπου
2. **Θέμα διαχειριστή** - Θέμα πίνακα ελέγχου διαχειριστή (συνήθως ξεχωριστό)

Αναζητήστε ρυθμίσεις όπως:
- `theme_set` - Θέμα Frontend
- `admin_theme` - Θέμα διαχειριστή

---

## Προσαρμογή θέματος

## # Ε: Πώς μπορώ να προσαρμόσω ένα υπάρχον θέμα;

**Α:** Δημιουργήστε ένα θυγατρικό θέμα για να διατηρήσετε τις ενημερώσεις:

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

Στη συνέχεια, επεξεργαστείτε το `theme.html` στο προσαρμοσμένο θέμα σας.

---

## # Ε: Πώς μπορώ να αλλάξω τα χρώματα του θέματος;

**Α:** Επεξεργαστείτε το αρχείο CSS του θέματος:

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

Για XOOPS θέματα:

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

## # Ε: Πώς μπορώ να προσθέσω προσαρμοσμένο CSS σε ένα θέμα;

**Α:** Αρκετές επιλογές:

**Επιλογή 1: Επεξεργασία θέματος.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**Επιλογή 2: Δημιουργία custom.css**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**Επιλογή 3: Ρυθμίσεις διαχειριστή (αν υποστηρίζονται)**
Μεταβείτε στο XOOPS Διαχειριστής > Ρυθμίσεις > Ρυθμίσεις θέματος και προσθέστε προσαρμοσμένο CSS.

---

## # Ε: Πώς μπορώ να τροποποιήσω τα πρότυπα θέματος HTML;

**Α:** Εντοπίστε το αρχείο προτύπου:

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

Επεξεργασία με τη σωστή σύνταξη Smarty:

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

## Δομή θέματος

## # Ε: Ποια αρχεία απαιτούνται σε ένα θέμα;

**Α:** Ελάχιστη δομή:

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

Δείτε τη Δομή του θέματος για λεπτομέρειες.

---

## # Ε: Πώς μπορώ να δημιουργήσω ένα θέμα από την αρχή;

**Α:** Δημιουργήστε τη δομή:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

Δημιουργία `theme.html`:
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

Δημιουργία `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## Μεταβλητές θέματος

## # Ε: Ποιες μεταβλητές είναι διαθέσιμες στα πρότυπα θεμάτων;

**Α:** Κοινές μεταβλητές θέματος XOOPS:

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

## # Ε: Πώς μπορώ να προσθέσω προσαρμοσμένες μεταβλητές στο θέμα μου;

**Α:** Στον κωδικό PHP πριν την απόδοση:

```php
<?php
// In module or admin code
require_once XOOPS_ROOT_PATH . '/class/xoopstpl.php';
$xoopsTpl = new XoopsTpl();

// Add custom variables
$xoopsTpl->assign('my_variable', 'value');
$xoopsTpl->assign('data_array', ['key1' => 'val1', 'key2' => 'val2']);

// Use in theme template
$xoopsTpl->display('file:theme.html');
?>
```

Στο θέμα:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## Styling θέματος

## # Ε: Πώς μπορώ να κάνω το θέμα μου να ανταποκρίνεται;

**Α:** Χρησιμοποιήστε CSS Grid ή Flexbox:

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

Ή χρησιμοποιήστε την ενσωμάτωση Bootstrap:
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

## # Ε: Πώς μπορώ να προσθέσω μια σκοτεινή λειτουργία στο θέμα μου;

**ΕΝΑ:**
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

Εναλλαγή με JavaScript:
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

## Θέματα Θέματα

## # Ε: Το θέμα εμφανίζει σφάλματα "μη αναγνωρισμένη μεταβλητή προτύπου".

**Α:** Η μεταβλητή δεν μεταβιβάζεται στο πρότυπο. Έλεγχος:

1. **Η μεταβλητή εκχωρείται** στο PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **Το πρότυπο υπάρχει** όπου καθορίζεται
3. **Η σύνταξη του προτύπου είναι σωστή**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

## # Ε: CSS οι αλλαγές δεν εμφανίζονται στο πρόγραμμα περιήγησης

**Α:** Εκκαθάριση της προσωρινής μνήμης του προγράμματος περιήγησης:

1. Σκληρή ανανέωση: `Ctrl+Shift+R` (Cmd+Shift+R σε Mac)
2. Εκκαθάριση προσωρινής μνήμης θέματος στον διακομιστή:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. Ελέγξτε τη διαδρομή αρχείου CSS στο θέμα:
```bash
ls -la themes/mytheme/style.css
```

---

## # Ε: Οι εικόνες στο θέμα δεν φορτώνονται

**Α:** Ελέγξτε τις διαδρομές εικόνας:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

## # Ε: Τα πρότυπα θεμάτων λείπουν ή προκαλούν σφάλματα

**Α:** Δείτε Σφάλματα προτύπου για εντοπισμό σφαλμάτων.

---

## Διανομή θεμάτων

## # Ε: Πώς συσκευάζω ένα θέμα για διανομή;

**Α:** Δημιουργήστε ένα zip με δυνατότητα διανομής:

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

## # Ε: Μπορώ να πουλήσω το θέμα μου XOOPS;

**Α:** Ελέγξτε την άδεια XOOPS:
- Τα θέματα που χρησιμοποιούν XOOPS classes/templates πρέπει να σέβονται την άδεια XOOPS
- Τα καθαρά θέματα CSS/HTML έχουν λιγότερους περιορισμούς
- Ελέγξτε τις XOOPS Οδηγίες συνεισφοράς για λεπτομέρειες

---

## Απόδοση θέματος

## # Ε: Πώς μπορώ να βελτιστοποιήσω την απόδοση του θέματος;

**Α:**
1. **Ελαχιστοποίηση CSS/JS** - Αφαιρέστε τον αχρησιμοποίητο κωδικό
2. **Βελτιστοποίηση εικόνων** - Χρησιμοποιήστε τις κατάλληλες μορφές (WebP, AVIF)
3. **Χρησιμοποιήστε CDN** για πόρους
4. **Εικόνες Lazy load**:
```html
<img src="image.jpg" loading="lazy">
```

5. **Εκδόσεις cache-bust**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

Δείτε την απόδοση FAQ για περισσότερες λεπτομέρειες.

---

## Σχετική τεκμηρίωση

- Σφάλματα προτύπου
- Θεματική Δομή
- Απόδοση FAQ
- Έξυπνος εντοπισμός σφαλμάτων

---

# XOOPS #themes #faq #αντιμετώπιση προβλημάτων #προσαρμογή
