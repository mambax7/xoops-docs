---
title: "Πρότυπα και μπλοκ"
---

## Επισκόπηση

Ο Publisher παρέχει προσαρμόσιμα πρότυπα για την εμφάνιση άρθρων και μπλοκ για ενσωμάτωση sidebar/widget. Αυτός ο οδηγός καλύπτει την προσαρμογή προτύπου και τη διαμόρφωση μπλοκ.

## Αρχεία προτύπων

## # Βασικά πρότυπα

| Πρότυπο | Σκοπός |
|----------|---------|
| `publisher_index.tpl` | Αρχική σελίδα ενότητας |
| `publisher_item.tpl` | Προβολή ενός άρθρου |
| `publisher_category.tpl` | Καταχώριση κατηγορίας |
| `publisher_archive.tpl` | Σελίδα αρχείου |
| `publisher_search.tpl` | Αποτελέσματα αναζήτησης |
| `publisher_submit.tpl` | Έντυπο υποβολής άρθρου |
| `publisher_print.tpl` | Προβολή φιλική προς την εκτύπωση |

## # Αποκλεισμός προτύπων

| Πρότυπο | Σκοπός |
|----------|---------|
| `publisher_block_latest.tpl` | Τελευταία άρθρα μπλοκ |
| `publisher_block_spotlight.tpl` | Μπλοκ επιλεγμένων άρθρων |
| `publisher_block_category.tpl` | Μπλοκ λίστας κατηγοριών |
| `publisher_block_author.tpl` | Μπλοκ άρθρων συγγραφέα |

## Μεταβλητές προτύπου

## # Μεταβλητές άρθρου

```smarty
{* Available in publisher_item.tpl *}
<{$item.title}>           {* Article title *}
<{$item.body}>            {* Full content *}
<{$item.summary}>         {* Summary/excerpt *}
<{$item.author}>          {* Author name *}
<{$item.authorid}>        {* Author user ID *}
<{$item.datesub}>         {* Publication date *}
<{$item.datemodified}>    {* Last modified date *}
<{$item.counter}>         {* View count *}
<{$item.rating}>          {* Average rating *}
<{$item.votes}>           {* Number of votes *}
<{$item.categoryname}>    {* Category name *}
<{$item.categorylink}>    {* Category URL *}
<{$item.itemurl}>         {* Article URL *}
<{$item.image}>           {* Featured image *}
```

## # Μεταβλητές κατηγορίας

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## Προσαρμογή προτύπων

## # Παράκαμψη τοποθεσίας

Αντιγράψτε πρότυπα στο θέμα σας για προσαρμογή:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

## # Παράδειγμα: Προσαρμοσμένο πρότυπο άρθρου

```smarty
{* themes/mytheme/modules/publisher/publisher_item.tpl *}
<article class="publisher-article">
    <header>
        <h1><{$item.title}></h1>
        <div class="meta">
            <span class="author">By <{$item.author}></span>
            <span class="date"><{$item.datesub}></span>
            <span class="category">
                <a href="<{$item.categorylink}>"><{$item.categoryname}></a>
            </span>
        </div>
    </header>

    <{if $item.image}>
    <figure class="featured-image">
        <img src="<{$item.image}>" alt="<{$item.title}>">
    </figure>
    <{/if}>

    <div class="content">
        <{$item.body}>
    </div>

    <footer>
        <{if $item.who_when}>
            <p class="attribution"><{$item.who_when}></p>
        <{/if}>

        <div class="actions">
            <{if $can_edit}>
                <a href="<{$xoops_url}>/modules/publisher/submit.php?itemid=<{$item.itemid}>">
                    Edit Article
                </a>
            <{/if}>
            <a href="<{$item.printlink}>" target="_blank">Print</a>
            <a href="<{$item.maillink}>">Email</a>
        </div>
    </footer>
</article>
```

## Μπλοκ

## # Διαθέσιμα μπλοκ

| Μπλοκ | Περιγραφή |
|-------|-------------|
| Τελευταία Νέα | Εμφανίζει πρόσφατα άρθρα |
| Φώτα της δημοσιότητας | Επιλεγμένο άρθρο |
| Μενού κατηγορίας | Πλοήγηση κατηγορίας |
| Αρχεία | Σύνδεσμοι αρχείου |
| Κορυφαίοι Συγγραφείς | Οι πιο ενεργοί συγγραφείς |
| Δημοφιλή είδη | Άρθρα με τις περισσότερες προβολές |

## # Επιλογές αποκλεισμού

### # Τελευταία Μπλοκ ειδήσεων

| Επιλογή | Περιγραφή |
|--------|-------------|
| Στοιχεία προς εμφάνιση | Αριθμός άρθρων |
| Φίλτρο κατηγορίας | Όριο σε συγκεκριμένες κατηγορίες |
| Εμφάνιση περίληψης | Εμφάνιση αποσπάσματος άρθρου |
| Μήκος τίτλου | Περικοπή τίτλων |
| Πρότυπο | Αποκλεισμός αρχείου προτύπου |

## # Πρότυπο προσαρμοσμένου μπλοκ

```smarty
{* themes/mytheme/modules/publisher/blocks/publisher_block_latest.tpl *}
<div class="publisher-latest-block">
    <{foreach item=item from=$block.items}>
    <article class="block-item">
        <h4>
            <a href="<{$item.link}>"><{$item.title}></a>
        </h4>
        <{if $block.show_summary}>
            <p><{$item.summary}></p>
        <{/if}>
        <div class="block-meta">
            <span class="date"><{$item.date}></span>
            <span class="views"><{$item.counter}> views</span>
        </div>
    </article>
    <{/foreach}>
</div>
```

## Κόλπα προτύπων

## # Οθόνη υπό όρους

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

## # Προσαρμοσμένη τάξη CSS

```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```

## # Μορφοποίηση ημερομηνίας

```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## Σχετική τεκμηρίωση

- ../User-Guide/Basic-Configuration - Ρυθμίσεις μονάδας
- ../User-Guide/Creating-Articles - Διαχείριση περιεχομένου
- ../../04-API-Reference/Template/Template-System - XOOPS κινητήρας προτύπου
- ../../02-Core-Concepts/Themes/Theme-Development - Προσαρμογή θέματος
