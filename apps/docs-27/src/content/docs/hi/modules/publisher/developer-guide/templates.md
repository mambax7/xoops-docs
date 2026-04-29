---
title: "टेम्प्लेट और ब्लॉक"
---
## अवलोकन

प्रकाशक साइडबार/विजेट एकीकरण के लिए लेख और ब्लॉक प्रदर्शित करने के लिए अनुकूलन योग्य टेम्पलेट प्रदान करता है। यह मार्गदर्शिका टेम्पलेट अनुकूलन और ब्लॉक कॉन्फ़िगरेशन को कवर करती है।

## टेम्पलेट फ़ाइलें

### कोर टेम्पलेट्स

| टेम्पलेट | उद्देश्य |
|---|----|
| `publisher_index.tpl` | मॉड्यूल होमपेज |
| `publisher_item.tpl` | एकल लेख दृश्य |
| `publisher_category.tpl` | श्रेणी सूची |
| `publisher_archive.tpl` | पुरालेख पृष्ठ |
| `publisher_search.tpl` | खोज परिणाम |
| `publisher_submit.tpl` | लेख प्रस्तुत करने का फॉर्म |
| `publisher_print.tpl` | प्रिंट-अनुकूल दृश्य |

### ब्लॉक टेम्पलेट्स

| टेम्पलेट | उद्देश्य |
|---|----|
| `publisher_block_latest.tpl` | नवीनतम लेख ब्लॉक |
| `publisher_block_spotlight.tpl` | विशेष आलेख ब्लॉक |
| `publisher_block_category.tpl` | श्रेणी सूची ब्लॉक |
| `publisher_block_author.tpl` | लेखक लेख ब्लॉक |

## टेम्पलेट वेरिएबल्स

### आलेख चर

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

### श्रेणी चर

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## टेम्पलेट्स को अनुकूलित करना

### स्थान को ओवरराइड करें

अनुकूलित करने के लिए अपनी थीम में टेम्पलेट कॉपी करें:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### उदाहरण: कस्टम आलेख टेम्पलेट

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

## ब्लॉक

### उपलब्ध ब्लॉक

| ब्लॉक | विवरण |
|-------|----||
| नवीनतम समाचार | हाल के लेख दिखाता है |
| स्पॉटलाइट | विशेष आलेख हाइलाइट |
| श्रेणी मेनू | श्रेणी नेविगेशन |
| पुरालेख | पुरालेख लिंक |
| शीर्ष लेखक | सर्वाधिक सक्रिय लेखक |
| लोकप्रिय आइटम | सर्वाधिक देखे गए लेख |

### ब्लॉक विकल्प

#### नवीनतम समाचार ब्लॉक

| विकल्प | विवरण |
|-------|----|
| प्रदर्शित करने के लिए आइटम | लेखों की संख्या |
| श्रेणी फ़िल्टर | विशिष्ट श्रेणियों तक सीमित |
| सारांश दिखाएँ | आलेख अंश प्रदर्शित करें |
| शीर्षक की लंबाई | शीर्षकों को छोटा करें |
| टेम्पलेट | टेम्पलेट फ़ाइल को ब्लॉक करें |

### कस्टम ब्लॉक टेम्पलेट

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

## टेम्पलेट ट्रिक्स

### सशर्त प्रदर्शन

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### कस्टम CSS क्लास

```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```

### दिनांक स्वरूपण

```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## संबंधित दस्तावेज़ीकरण

- ../यूजर-गाइड/बेसिक-कॉन्फ़िगरेशन - मॉड्यूल सेटिंग्स
- ../उपयोगकर्ता-मार्गदर्शिका/रचना-लेख - सामग्री प्रबंधन
- ../../04-API-संदर्भ/टेम्पलेट/टेम्पलेट-सिस्टम - XOOPS टेम्पलेट इंजन
- ../../02-कोर-कॉन्सेप्ट्स/थीम्स/थीम-डेवलपमेंट - थीम अनुकूलन