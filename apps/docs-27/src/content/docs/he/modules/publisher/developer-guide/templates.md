---
title: "תבניות ובלוקים"
---
## סקירה כללית

Publisher מספק תבניות הניתנות להתאמה אישית להצגת מאמרים ובלוקים לשילוב sidebar/widget. מדריך זה עוסק בהתאמה אישית של תבניות ותצורת בלוקים.

## קבצי תבנית

### תבניות ליבה

| תבנית | מטרה |
|--------|--------|
| `publisher_index.tpl` | דף הבית של המודול |
| `publisher_item.tpl` | תצוגת מאמר בודד |
| `publisher_category.tpl` | רישום קטגוריות |
| `publisher_archive.tpl` | עמוד ארכיון |
| `publisher_search.tpl` | תוצאות חיפוש |
| `publisher_submit.tpl` | טופס הגשת מאמר |
| `publisher_print.tpl` | תצוגה ידידותית להדפסה |

### תבניות חסימה

| תבנית | מטרה |
|--------|--------|
| `publisher_block_latest.tpl` | מאמרים אחרונים לחסום |
| `publisher_block_spotlight.tpl` | בלוק מאמרים מומלצים |
| `publisher_block_category.tpl` | בלוק רשימת קטגוריות |
| `publisher_block_author.tpl` | מחסום מאמרי מחבר |

## משתני תבנית

### משתני מאמר
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
### משתני קטגוריה
```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```
## התאמה אישית של תבניות

### ביטול מיקום

העתק תבניות לערכת הנושא שלך כדי להתאים אישית:
```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```
### דוגמה: תבנית מאמר מותאמת אישית
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
## בלוקים

### בלוקים זמינים

| חסום | תיאור |
|-------|-------------|
| חדשות אחרונות | מציג מאמרים אחרונים |
| זרקור | הדגשת מאמר מומלץ |
| תפריט קטגוריה | ניווט בקטגוריות |
| ארכיון | קישורי ארכיון |
| מחברים מובילים | הכותבים הפעילים ביותר |
| פריטים פופולריים | המאמרים הנצפים ביותר |

### אפשרויות חסימה

#### בלוק חדשות אחרונות

| אפשרות | תיאור |
|--------|----------------|
| פריטים לתצוגה | מספר מאמרים |
| מסנן קטגוריות | הגבל לקטגוריות ספציפיות |
| הצג תקציר | הצג קטע מאמר |
| אורך כותרת | קיצור כותרות |
| תבנית | קובץ תבנית חסום |

### תבנית בלוק מותאמת אישית
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
## טריקים של תבנית

### תצוגה מותנית
```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```
### מותאם אישית CSS מחלקה
```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```
### עיצוב תאריך
```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```
## תיעוד קשור

- ../User-Guide/Basic-Configuration - הגדרות מודול
- ../User-Guide/Creating-Articles - ניהול תוכן
- ../../04-API-Reference/Template/Template-System - XOOPS מנוע תבנית
- ../../02-Core-Concepts/Themes/Theme-Development - התאמה אישית של נושא