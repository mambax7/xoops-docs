---
title: "Smarty 4 Migration"
description: "Οδηγός για την αναβάθμιση προτύπων XOOPS από Smarty 3 σε Smarty 4"
---

Αυτός ο οδηγός καλύπτει τις αλλαγές και τα βήματα μετεγκατάστασης που απαιτούνται κατά την αναβάθμιση από Smarty 3 σε Smarty 4 στο XOOPS. Η κατανόηση αυτών των διαφορών είναι απαραίτητη για τη διατήρηση της συμβατότητας με τις σύγχρονες εγκαταστάσεις XOOPS.

## Σχετική τεκμηρίωση

- Smarty-Basics - Fundamentals of Smarty in XOOPS
- Ανάπτυξη θεμάτων - Δημιουργία XOOPS θεμάτων
- Template-Variables - Διαθέσιμες μεταβλητές σε πρότυπα

## Επισκόπηση των αλλαγών

Το Smarty 4 εισήγαγε αρκετές σημαντικές αλλαγές από το Smarty 3:

1. Η συμπεριφορά ανάθεσης μεταβλητής άλλαξε
2. Οι ετικέτες `{php}` αφαιρέθηκαν πλήρως
3. Η προσωρινή αποθήκευση API αλλάζει
4. Ενημερώσεις χειρισμού τροποποιητών
5. Αλλαγές πολιτικής ασφαλείας
6. Καταργήθηκαν οι καταργημένες λειτουργίες

## Αλλαγές μεταβλητής πρόσβασης

## # Το πρόβλημα

Στο Smarty 2/3, οι εκχωρημένες τιμές ήταν άμεσα προσβάσιμες:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

Στο Smarty 4, οι μεταβλητές είναι τυλιγμένες σε `Smarty_Variable` αντικείμενα:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

## # Λύση 1: Πρόσβαση στην ιδιότητα τιμής

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

## # Λύση 2: Λειτουργία συμβατότητας

Ενεργοποιήστε τη λειτουργία συμβατότητας στο PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

Αυτό επιτρέπει την άμεση πρόσβαση μεταβλητών όπως το Smarty 3.

## # Λύση 3: Έλεγχος έκδοσης υπό όρους

Γράψτε πρότυπα που λειτουργούν και στις δύο εκδόσεις:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

## # Λύση 4: Λειτουργία περιτυλίγματος

Δημιουργήστε μια βοηθητική συνάρτηση για αναθέσεις:

```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - assign normally, access via ->value in templates
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - standard assignment
        $smarty->assign($name, $value);
    }
}
```

## Αφαίρεση ετικετών {php}

## # Το πρόβλημα

Το Smarty 3+ δεν υποστηρίζει ετικέτες `{php}` για λόγους ασφαλείας:

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

## # Λύση: Χρησιμοποιήστε Smarty Variables

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

## # Λύση: Μετακινήστε τη λογική στο PHP

Η σύνθετη λογική πρέπει να βρίσκεται στο PHP, όχι στα πρότυπα:

```php
// In PHP - do the processing
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Assign processed data to template
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* In template - just display *}
<h2><{$category.name}></h2>
```

## # Λύση: Προσαρμοσμένες προσθήκες

Για επαναχρησιμοποιήσιμη λειτουργικότητα, δημιουργήστε προσθήκες Smarty:

```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* In template *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```

## Αλλαγές προσωρινής αποθήκευσης

## # Smarty 3 Caching

```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

## # Smarty 4 Caching

```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

## # Σταθερές προσωρινής αποθήκευσης

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

## # Nocache στα πρότυπα

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## Αλλαγές τροποποιητή

## # Τροποποιητές συμβολοσειρών

Ορισμένοι τροποποιητές μετονομάστηκαν ή καταργήθηκαν:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

## # Τροποποιητές πίνακα

Οι τροποποιητές πίνακα απαιτούν το πρόθεμα `@`:

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

## # Προσαρμοσμένοι τροποποιητές

Οι προσαρμοσμένοι τροποποιητές πρέπει να είναι εγγεγραμμένοι:

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## Αλλαγές πολιτικής ασφαλείας

## # Smarty 4 Security

Το Smarty 4 έχει αυστηρότερη προεπιλεγμένη ασφάλεια:

```php
// Configure security policy
$smarty->enableSecurity('Smarty_Security');

// Or create custom policy
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```

## # Επιτρεπόμενες λειτουργίες

Από προεπιλογή, το Smarty 4 περιορίζει ποιες λειτουργίες PHP μπορούν να χρησιμοποιηθούν:

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

Διαμορφώστε τις επιτρεπόμενες λειτουργίες εάν χρειάζεται:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## Ενημερώσεις κληρονομικότητας προτύπων

## # Αποκλεισμός σύνταξης

Η σύνταξη μπλοκ παραμένει παρόμοια, αλλά με ορισμένες αλλαγές:

```smarty
{* Parent template *}
<html>
<head>
    {block name=head}
    <title>Default Title</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```

```smarty
{* Child template *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Include parent block content *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```

## # Προσάρτηση και Prepend

```smarty
{block name=head append}
    {* This is added after parent content *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* This is added before parent content *}
    <script src="early.js"></script>
{/block}
```

## Καταργημένες λειτουργίες

## # Καταργήθηκε στο Smarty 4

| Χαρακτηριστικό | Εναλλακτική |
|---------|-------------|
| `{php}` ετικέτες | Μετακινήστε τη λογική στο PHP ή χρησιμοποιήστε πρόσθετα |
| `{include_php}` | Χρήση εγγεγραμμένων προσθηκών |
| `$Smarty.capture` | Λειτουργεί ακόμα αλλά καταργήθηκε |
| `{strip}` με κενά | Χρησιμοποιήστε εργαλεία ελαχιστοποίησης |

## # Χρησιμοποιήστε εναλλακτικές λύσεις

```smarty
{* Instead of {php} *}
{* Move to PHP and assign result *}

{* Instead of include_php *}
<{include file="db:mytemplate.tpl"}>

{* Instead of capture (still works but consider) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```

## Λίστα ελέγχου μετεγκατάστασης

## # Πριν από τη μετανάστευση

1. [ ] Δημιουργία αντιγράφων ασφαλείας όλων των προτύπων
2. [ ] Καταχωρίστε όλη τη χρήση ετικετών `{php}`
3. [ ] Έγγραφο προσαρμοσμένων προσθηκών
4. [ ] Ελέγξτε την τρέχουσα λειτουργικότητα

## # Κατά τη διάρκεια της μετανάστευσης

1. [ ] Αφαιρέστε όλες τις ετικέτες `{php}`
2. [ ] Ενημερώστε τη σύνταξη μεταβλητής πρόσβασης
3. [ ] Ελέγξτε τη χρήση τροποποιητή
4. [ ] Ενημερώστε τη διαμόρφωση προσωρινής αποθήκευσης
5. [ ] Ελέγξτε τις ρυθμίσεις ασφαλείας

## # Μετά τη Μετανάστευση

1. [ ] Δοκιμάστε όλα τα πρότυπα
2. [ ] Ελέγξτε όλες τις φόρμες εργασίας
3. [ ] Επαλήθευση των εργασιών της προσωρινής αποθήκευσης
4. [ ] Δοκιμή με διαφορετικούς ρόλους χρήστη

## Δοκιμή για συμβατότητα

## # Ανίχνευση έκδοσης

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

## # Έλεγχος έκδοσης προτύπου

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```

## Σύνταξη προτύπων πολλαπλών συμβατών

## # Βέλτιστες πρακτικές

1. **Αποφύγετε εντελώς τις ετικέτες `{php}`** - Δεν λειτουργούν στο Smarty 3+

2. **Διατηρήστε τα πρότυπα απλά** - Η σύνθετη λογική ανήκει στο PHP

3. **Χρησιμοποιήστε τυπικούς τροποποιητές** - Αποφύγετε τους καταργημένους

4. **Δοκιμή και στις δύο εκδόσεις** - Εάν χρειάζεται να υποστηρίξετε και τις δύο

5. **Χρησιμοποιήστε πρόσθετα για πολύπλοκες λειτουργίες** - Πιο διατηρήσιμα

## # Παράδειγμα: Πρότυπο πολλαπλών συμβατών

```smarty
{* Works in both Smarty 3 and 4 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'Default Title'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>No items found.</p>
    <{/if}>
</body>
</html>
```

## Κοινά θέματα μετανάστευσης

## # Θέμα: Οι μεταβλητές επιστρέφουν κενά

**Πρόβλημα**: `<{$mod_url}>` δεν επιστρέφει τίποτα στο Smarty 4

**Λύση**: Χρησιμοποιήστε το `<{$mod_url->value}>` ή ενεργοποιήστε τη λειτουργία συμβατότητας

## # Θέμα: PHP Σφάλματα ετικέτας

**Πρόβλημα**: Το πρότυπο εμφανίζει σφάλμα στις ετικέτες `{php}`

**Λύση**: Καταργήστε όλες τις ετικέτες PHP και μετακινήστε τη λογική στα αρχεία PHP

## # Θέμα: Ο τροποποιητής δεν βρέθηκε

**Πρόβλημα**: Ο προσαρμοσμένος τροποποιητής εμφανίζει σφάλμα "άγνωστος τροποποιητής".

**Λύση**: Καταχωρίστε τον τροποποιητή με `registerPlugin()`

## # Θέμα: Περιορισμός ασφαλείας

**Πρόβλημα**: Η λειτουργία δεν επιτρέπεται στο πρότυπο

**Λύση**: Προσθήκη συνάρτησης στη λίστα επιτρεπόμενων πολιτικών ασφαλείας

---

# Smarty #migration #upgrade #XOOPS #smarty4 #compatibility
