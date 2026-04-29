---
title: "Smarty Basics"
description: "Βασικές αρχές του προτύπου Smarty στο XOOPS"
---

<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::note[Έξυπνη έκδοση από XOOPS Έκδοση]
| XOOPS Έκδοση | Έξυπνη έκδοση | Βασικές διαφορές |
|---------------|----------------|-----------------|
| 2.5.11 | Smarty 3.x | `{php}` μπλοκ επιτρέπονται (αλλά αποθαρρύνονται) |
| 2.7.0+ | Smarty 3.x/4.x | Προετοιμασία για συμβατότητα με Smarty 4 |
| 4,0 | Smarty 4.x | Καταργήθηκαν τα μπλοκ `{php}`, αυστηρότερη σύνταξη |

Δείτε το Smarty-4-Migration για καθοδήγηση σχετικά με τη μετεγκατάσταση.
:::

Το Smarty είναι μια μηχανή προτύπων για το PHP που επιτρέπει στους προγραμματιστές να διαχωρίζουν την παρουσίαση (HTML/CSS) από τη λογική της εφαρμογής. Το XOOPS χρησιμοποιεί το Smarty για όλες τις ανάγκες δημιουργίας προτύπων, επιτρέποντας τον καθαρό διαχωρισμό μεταξύ του κωδικού PHP και της εξόδου HTML.

## Σχετική τεκμηρίωση

- Ανάπτυξη θεμάτων - Δημιουργία XOOPS θεμάτων
- Template-Variables - Διαθέσιμες μεταβλητές σε πρότυπα
- Smarty-4-Migration - Αναβάθμιση από Smarty 3 σε 4

## Τι είναι το Smarty;

Το Smarty παρέχει:

- **Διαχωρισμός ανησυχιών**: Διατήρηση HTML στα πρότυπα, PHP λογική στις τάξεις
- **Κληρονόμηση προτύπων**: Δημιουργήστε σύνθετες διατάξεις από απλά μπλοκ
- **Caching**: Βελτιώστε την απόδοση με μεταγλωττισμένα πρότυπα
- **Τροποποιητές**: Μετασχηματισμός εξόδου με ενσωματωμένες ή προσαρμοσμένες λειτουργίες
- **Ασφάλεια**: Ελέγξτε σε ποιες λειτουργίες μπορούν να έχουν πρόσβαση τα πρότυπα λειτουργιών PHP

## XOOPS Smarty Configuration

Το XOOPS διαμορφώνει το Smarty με προσαρμοσμένους οριοθέτες:

```
Default Smarty: { and }
XOOPS Smarty:   <{ and }>
```

Αυτό αποτρέπει τις διενέξεις με τον κώδικα JavaScript στα πρότυπα.

## Βασική σύνταξη

## # Μεταβλητές

Οι μεταβλητές περνούν από το PHP στα πρότυπα:

```php
// In PHP
$GLOBALS['xoopsTpl']->assign('title', 'My Page Title');
$GLOBALS['xoopsTpl']->assign('count', 42);
```

```smarty
{* In template *}
<h1><{$title}></h1>
<p>Total items: <{$count}></p>
```

## # Πρόσβαση σε πίνακα

```php
// PHP
$item = [
    'id' => 1,
    'title' => 'Article Title',
    'author' => 'John Doe'
];
$GLOBALS['xoopsTpl']->assign('item', $item);
```

```smarty
{* Template *}
<h2><{$item.title}></h2>
<p>By: <{$item.author}></p>
```

## # Ιδιότητες αντικειμένου

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Template *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## Σχόλια

Τα σχόλια στο Smarty δεν αποδίδονται σε HTML:

```smarty
{* This is a comment - it will not appear in the HTML output *}

{*
   Multi-line comments
   are also supported
*}
```

## Δομές ελέγχου

## # If/Else Δηλώσεις

```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```

## # Σύγκριση τελεστών

```smarty
{* Equality *}
<{if $status == 'published'}>Published<{/if}>
<{if $status eq 'published'}>Published<{/if}>

{* Inequality *}
<{if $count != 0}>Has items<{/if}>
<{if $count neq 0}>Has items<{/if}>

{* Greater/Less than *}
<{if $count > 10}>Many items<{/if}>
<{if $count gt 10}>Many items<{/if}>
<{if $count < 5}>Few items<{/if}>
<{if $count lt 5}>Few items<{/if}>

{* Greater/Less than or equal *}
<{if $count >= 10}>Ten or more<{/if}>
<{if $count gte 10}>Ten or more<{/if}>
<{if $count <= 5}>Five or less<{/if}>
<{if $count lte 5}>Five or less<{/if}>

{* Logical operators *}
<{if $logged_in && $is_admin}>Admin Panel<{/if}>
<{if $logged_in and $is_admin}>Admin Panel<{/if}>
<{if $option1 || $option2}>One option selected<{/if}>
<{if $option1 or $option2}>One option selected<{/if}>
<{if !$is_banned}>Access granted<{/if}>
<{if not $is_banned}>Access granted<{/if}>
```

## # Έλεγχος για Empty/Isset

```smarty
{* Check if variable exists and has value *}
<{if $title}>
    <h1><{$title}></h1>
<{/if}>

{* Check if array is not empty *}
<{if $items|@count > 0}>
    <ul>
        <{foreach $items as $item}>
            <li><{$item.name}></li>
        <{/foreach}>
    </ul>
<{/if}>

{* Using isset *}
<{if isset($description)}>
    <p><{$description}></p>
<{/if}>
```

## # Βρόχοι Foreach

```smarty
{* Basic foreach *}
<ul>
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{/foreach}>
</ul>

{* With key *}
<{foreach $options as $key => $value}>
    <option value="<{$key}>"><{$value}></option>
<{/foreach}>

{* With @index, @first, @last *}
<{foreach $items as $item}>
    <{if $item@first}><ul><{/if}>
    <li class="item-<{$item@index}>"><{$item.name}></li>
    <{if $item@last}></ul><{/if}>
<{/foreach}>

{* Alternate row colors *}
<{foreach $rows as $row}>
    <tr class="<{if $row@iteration is odd}>odd<{else}>even<{/if}>">
        <td><{$row.name}></td>
    </tr>
<{/foreach}>

{* Foreachelse for empty arrays *}
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{foreachelse}>
    <li>No items found.</li>
<{/foreach}>
```

## # Για βρόχους

```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```

## # Ενώ βρόχους

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## Μεταβλητοί τροποποιητές

Οι τροποποιητές μετασχηματίζουν μεταβλητή έξοδο:

## # Τροποποιητές συμβολοσειρών

```smarty
{* HTML escape (always use for user input!) *}
<{$title|escape}>
<{$title|escape:'html'}>

{* URL encoding *}
<{$url|escape:'url'}>

{* Uppercase/Lowercase *}
<{$name|upper}>
<{$name|lower}>
<{$name|capitalize}>

{* Truncate text *}
<{$content|truncate:100:'...'}>

{* Strip HTML tags *}
<{$html|strip_tags}>

{* Replace *}
<{$text|replace:'old':'new'}>

{* Word wrap *}
<{$text|wordwrap:80:"\n"}>

{* Default value *}
<{$optional_var|default:'No value'}>
```

## # Αριθμητικοί Τροποποιητές

```smarty
{* Number formatting *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Date formatting *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

## # Τροποποιητές πίνακα

```smarty
{* Count items *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

## # Αλυσίδες Τροποποιητές

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## Συμπερίληψη και Εισαγωγή

## # Συμπεριλαμβανομένων άλλων προτύπων

```smarty
{* Include a template file *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Include with assigned variables *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

## # Εισαγωγή δυναμικού περιεχομένου

```smarty
{* Insert calls a PHP function for dynamic content *}
<{insert name="getBanner"}>
```

## Εκχώρηση μεταβλητών σε Πρότυπα

```smarty
{* Simple assignment *}
<{assign var="page_title" value="Welcome"}>
<{$page_title = "Welcome"}>

{* Assignment from expression *}
<{assign var="full_name" value="`$first_name` `$last_name`"}>

{* Capture block content *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
    <ul>
        <li>Link 1</li>
        <li>Link 2</li>
    </ul>
<{/capture}>
<div class="sidebar"><{$smarty.capture.sidebar}></div>
```

## Ενσωματωμένες έξυπνες μεταβλητές

## # $Smarty Μεταβλητή

```smarty
{* Current timestamp *}
<{$smarty.now|date_format:"%Y-%m-%d"}>

{* Request variables *}
<{$smarty.get.page}>
<{$smarty.post.username}>
<{$smarty.request.id}>
<{$smarty.cookies.session_id}>
<{$smarty.server.HTTP_HOST}>

{* Constants *}
<{$smarty.const.XOOPS_URL}>

{* Configuration variables *}
<{$smarty.config.var_name}>

{* Template info *}
<{$smarty.template}>
<{$smarty.current_dir}>

{* Smarty version *}
<{$smarty.version}>

{* Section/Foreach properties *}
<{$smarty.foreach.items.index}>
<{$smarty.foreach.items.iteration}>
<{$smarty.foreach.items.first}>
<{$smarty.foreach.items.last}>
```

## Κυριολεκτικά μπλοκ

Για JavaScript με σγουρά άγκιστρα:

```smarty
<{literal}>
<script>
    var config = {
        url: 'https://example.com',
        count: 10
    };
    if (config.count > 5) {
        console.log('Many items');
    }
</script>
<{/literal}>
```

Ή χρησιμοποιήστε μεταβλητές Smarty εντός JavaScript:

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## Προσαρμοσμένες λειτουργίες

Το XOOPS παρέχει προσαρμοσμένες λειτουργίες Smarty:

```smarty
{* XOOPS Image URL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPS Module URL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* App URL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## Βέλτιστες πρακτικές

## # Εξόδου πάντα διαφυγής

```smarty
{* For user-generated content, always escape *}
<p><{$user_comment|escape}></p>

{* For HTML content, use appropriate method *}
<div><{$content}></div> {* Only if content is pre-sanitized *}
```

## # Χρησιμοποιήστε τα ονόματα μεταβλητών με νόημα

```php
// Good
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Avoid
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

## # Διατηρήστε τη λογική ελάχιστη

Τα πρότυπα πρέπει να επικεντρώνονται στην παρουσίαση. Μετακινήστε τη σύνθετη λογική στο PHP:

```smarty
{* Avoid complex logic in templates *}
{* Bad *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Good - calculate in PHP and pass a simple flag *}
<{if $can_edit}>
```

## # Χρησιμοποιήστε την κληρονομικότητα προτύπων

Για συνεπείς διατάξεις, χρησιμοποιήστε την κληρονομικότητα προτύπων (βλ. Θέμα-Ανάπτυξη).

## Πρότυπα εντοπισμού σφαλμάτων

## # Κονσόλα εντοπισμού σφαλμάτων

```smarty
{* Show all assigned variables *}
<{debug}>
```

## # Προσωρινή έξοδος

```smarty
{* Debug specific variable *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## Κοινά XOOPS Μοτίβα προτύπων

## # Δομή προτύπου μονάδας

```smarty
{* Module header *}
<div class="mymodule">
    <h2><{$module_name}></h2>

    {* Breadcrumb *}
    <{if $breadcrumb}>
    <nav class="breadcrumb">
        <{foreach $breadcrumb as $crumb}>
            <{if $crumb@last}>
                <span><{$crumb.title}></span>
            <{else}>
                <a href="<{$crumb.link}>"><{$crumb.title}></a> &raquo;
            <{/if}>
        <{/foreach}>
    </nav>
    <{/if}>

    {* Content *}
    <div class="content">
        <{$content}>
    </div>
</div>
```

## # Σελιδοποίηση

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

## # Εμφάνιση φόρμας

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

# Smarty #templates #XOOPS #frontend #template-engine
