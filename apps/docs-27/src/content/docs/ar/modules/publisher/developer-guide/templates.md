---
title: "القوالس والكتل"
dir: rtl
lang: ar
---

## نظرة عامة

توفر Publisher قوالس قابلة للتخصيص وكتل لتكامل الأداة الجانبية/الأداة. يغطي هذا الدليل تخصيص القالس وتكوين الكتل.

## ملفات القالب

### القوالس الأساسية

| القالب | الغرض |
|----------|---------|
| `publisher_index.tpl` | الصفحة الرئيسية للوحدة |
| `publisher_item.tpl` | عرض مقالة واحدة |
| `publisher_category.tpl` | قائمة الفئة |
| `publisher_archive.tpl` | صفحة الأرشيف |
| `publisher_search.tpl` | نتائج البحث |
| `publisher_submit.tpl` | نموذج إرسال المقالة |
| `publisher_print.tpl` | عرض صديق للطباعة |

### قوالس الكتل

| القالب | الغرض |
|----------|---------|
| `publisher_block_latest.tpl` | كتلة أحدث المقالات |
| `publisher_block_spotlight.tpl` | كتلة المقالة المميزة |
| `publisher_block_category.tpl` | كتلة قائمة الفئات |
| `publisher_block_author.tpl` | كتلة مقالات المؤلف |

## متغيرات القالب

### متغيرات المقالة

```smarty
{* متاحة في publisher_item.tpl *}
<{$item.title}>           {* عنوان المقالة *}
<{$item.body}>            {* المحتوى الكامل *}
<{$item.summary}>         {* الملخص/المقتطف *}
<{$item.author}>          {* اسم المؤلف *}
<{$item.authorid}>        {* معرف مستخدم المؤلف *}
<{$item.datesub}>         {* تاريخ النشر *}
<{$item.datemodified}>    {* تاريخ آخر تعديل *}
<{$item.counter}>         {* عدد المشاهدات *}
<{$item.rating}>          {* متوسط التقييم *}
<{$item.votes}>           {* عدد الأصوات *}
<{$item.categoryname}>    {* اسم الفئة *}
<{$item.categorylink}>    {* رابط الفئة *}
<{$item.itemurl}>         {* رابط المقالة *}
<{$item.image}>           {* صورة مميزة *}
```

### متغيرات الفئة

```smarty
{* متاحة في publisher_category.tpl *}
<{$category.name}>        {* اسم الفئة *}
<{$category.description}> {* وصف الفئة *}
<{$category.image}>       {* صورة الفئة *}
<{$category.total}>       {* عدد المقالات *}
<{$category.link}>        {* رابط الفئة *}
```

## تخصيص القوالس

### موقع التجاوز

انسخ القوالس إلى المظهر الخاص بك للتخصيص:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### مثال: قالب مقالة مخصص

```smarty
{* themes/mytheme/modules/publisher/publisher_item.tpl *}
<article class="publisher-article">
    <header>
        <h1><{$item.title}></h1>
        <div class="meta">
            <span class="author">بقلم <{$item.author}></span>
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
                    تحرير المقالة
                </a>
            <{/if}>
            <a href="<{$item.printlink}>" target="_blank">طباعة</a>
            <a href="<{$item.maillink}>">بريد إلكتروني</a>
        </div>
    </footer>
</article>
```

## الكتل

### الكتل المتاحة

| الكتلة | الوصف |
|-------|-------------|
| أحدث الأخبار | يعرض المقالات الحديثة |
| مشهور | تسليط الضوء على مقالة مميزة |
| قائمة الفئات | التنقل بالفئة |
| الأرشيفات | روابط الأرشيف |
| أفضل المؤلفين | أكثر الكتاب نشاطاً |
| العناصر الشهيرة | المقالات الأكثر عرضاً |

### خيارات الكتلة

#### كتلة أحدث الأخبار

| الخيار | الوصف |
|--------|-------------|
| العناصر المراد عرضها | عدد المقالات |
| عامل تصفية الفئة | حد لفئات محددة |
| إظهار الملخص | عرض مقتطف المقالة |
| طول العنوان | اختصار العناوين |
| القالب | ملف قالب الكتلة |

### قالب كتلة مخصص

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
            <span class="views"><{$item.counter}> مشاهدات</span>
        </div>
    </article>
    <{/foreach}>
</div>
```

## حيل القالس

### العرض الشرطي

```smarty
{* عرض محتوى مختلف لمستخدمين مختلفين *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">تحرير المسؤول</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">تحرير مقالتك</a>
<{/if}>
```

### فئة CSS مخصصة

```smarty
{* إضافة نمط قائم على الحالة *}
<article class="article <{$item.status}>">
    {* المحتوى *}
</article>
```

### تنسيق التاريخ

```smarty
{* تنسيق التواريخ باستخدام Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## الوثائق ذات الصلة

- ../User-Guide/Basic-Configuration - إعدادات الوحدة
- ../User-Guide/Creating-Articles - إدارة المحتوى
- ../../04-API-Reference/Template/Template-System - محرك قالب XOOPS
- ../../02-Core-Concepts/Themes/Theme-Development - تطوير المظهر
