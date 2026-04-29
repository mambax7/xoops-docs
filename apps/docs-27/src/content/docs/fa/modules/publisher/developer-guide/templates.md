---
title: "قالب ها و بلوک ها"
---
## بررسی اجمالی

Publisher قالب های قابل تنظیم برای نمایش مقالات و بلوک ها را برای ادغام sidebar/widget فراهم می کند. این راهنما سفارشی سازی قالب و پیکربندی بلوک را پوشش می دهد.

## فایل های قالب

### قالب های اصلی

| الگو | هدف |
|----------|---------|
| `publisher_index.tpl` | صفحه اصلی ماژول |
| `publisher_item.tpl` | مشاهده تک مقاله |
| `publisher_category.tpl` | فهرست بندی دسته ها |
| `publisher_archive.tpl` | صفحه آرشیو |
| `publisher_search.tpl` | نتایج جستجو |
| `publisher_submit.tpl` | فرم ارسال مقاله |
| `publisher_print.tpl` | نمایش مناسب چاپ |

### قالب ها را مسدود کنید

| الگو | هدف |
|----------|---------|
| `publisher_block_latest.tpl` | آخرین مقالات بلوک |
| `publisher_block_spotlight.tpl` | بلوک مقاله ویژه |
| `publisher_block_category.tpl` | بلوک فهرست دسته بندی |
| `publisher_block_author.tpl` | بلوک مقالات نویسنده |

## متغیرهای قالب

### متغیرهای مقاله

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

### متغیرهای دسته

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## سفارشی کردن الگوها

### لغو مکان

الگوها را برای سفارشی کردن در تم خود کپی کنید:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### مثال: قالب مقاله سفارشی

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

## بلوک

### بلوک های موجود

| بلوک | توضیحات |
|-------|------------|
| آخرین اخبار | نمایش مقالات اخیر |
| کانون توجه | برجسته مقاله |
| منوی دسته بندی | ناوبری دسته |
| آرشیو | لینک های آرشیو |
| نویسندگان برتر | فعال ترین نویسندگان |
| اقلام محبوب | پربازدیدترین مقالات |

### گزینه های مسدود کردن

#### آخرین بلوک اخبار

| گزینه | توضیحات |
|--------|------------|
| موارد برای نمایش | تعداد مقالات |
| فیلتر دسته | محدود به دسته های خاص |
| نمایش خلاصه | نمایش گزیده مقاله |
| طول عنوان | کوتاه کردن عناوین |
| الگو | فایل قالب مسدود |

### قالب بلوک سفارشی

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

## ترفندهای قالب

### نمایش مشروط

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### کلاس CSS سفارشی

```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```

### قالب بندی تاریخ

```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## مستندات مرتبط

- ../User-Guide/Basic-Configuration - تنظیمات ماژول
- ../User-Guide/Creating-Articles - مدیریت محتوا
- ../../04-API-Reference/Template/Template-System - موتور قالب XOOPS
- ../../02-Core-Concepts/Themes/Theme-Development - سفارشی سازی تم