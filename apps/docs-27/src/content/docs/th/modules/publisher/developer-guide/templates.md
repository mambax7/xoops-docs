---
title: "เทมเพลตและบล็อก"
---
## ภาพรวม

ผู้เผยแพร่มีเทมเพลตที่ปรับแต่งได้สำหรับการแสดงบทความและบล็อกสำหรับการรวมแถบด้านข้าง/วิดเจ็ต คู่มือนี้ครอบคลุมถึงการปรับแต่งเทมเพลตและการกำหนดค่าบล็อก

## ไฟล์เทมเพลต

### เทมเพลตหลัก

| แม่แบบ | วัตถุประสงค์ |
|----------|---------|
| `publisher_index.tpl` | หน้าแรกของโมดูล |
| `publisher_item.tpl` | มุมมองบทความเดียว |
| `publisher_category.tpl` | รายการหมวดหมู่ |
| `publisher_archive.tpl` | หน้าเอกสารเก่า |
| `publisher_search.tpl` | ผลการค้นหา |
| `publisher_submit.tpl` | แบบฟอร์มการส่งบทความ |
| `publisher_print.tpl` | มุมมองที่เหมาะกับการพิมพ์ |

### เทมเพลตบล็อก

| แม่แบบ | วัตถุประสงค์ |
|----------|---------|
| `publisher_block_latest.tpl` | บล็อกบทความล่าสุด |
| `publisher_block_spotlight.tpl` | บล็อกบทความเด่น |
| `publisher_block_category.tpl` | บล็อกรายการหมวดหมู่ |
| `publisher_block_author.tpl` | บล็อกบทความผู้เขียน |

## ตัวแปรเทมเพลต

### ตัวแปรของบทความ
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
### ตัวแปรหมวดหมู่
```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```
## การปรับแต่งเทมเพลต

### แทนที่ตำแหน่ง

คัดลอกเทมเพลตไปยังธีมของคุณเพื่อปรับแต่ง:
```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```
### ตัวอย่าง: เทมเพลตบทความที่กำหนดเอง
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
## บล็อก

### บล็อกที่มีอยู่

| บล็อก | คำอธิบาย |
|-------|-------------|
| ข่าวล่าสุด | แสดงบทความล่าสุด |
| สปอตไลท์ | บทความเด่นไฮไลท์ |
| เมนูหมวดหมู่ | การนำทางหมวดหมู่ |
| หอจดหมายเหตุ | ลิงค์เก็บถาวร |
| ผู้เขียนยอดนิยม | นักเขียนที่กระตือรือร้นที่สุด |
| สินค้ายอดนิยม | บทความที่มีผู้เข้าชมมากที่สุด |

### ตัวเลือกการบล็อก

#### บล็อกข่าวล่าสุด

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| รายการที่จะแสดง | จำนวนบทความ |
| ตัวกรองหมวดหมู่ | จำกัดเฉพาะหมวดหมู่เฉพาะ |
| แสดงสรุป | แสดงข้อความที่ตัดตอนมาจากบทความ |
| ความยาวของชื่อเรื่อง | ตัดหัวเรื่อง |
| แม่แบบ | บล็อกไฟล์เทมเพลต |

### เทมเพลตบล็อกแบบกำหนดเอง
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
## เคล็ดลับเทมเพลต

### การแสดงผลแบบมีเงื่อนไข
```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```
### คลาส CSS แบบกำหนดเอง
```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```
### การจัดรูปแบบวันที่
```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```
## เอกสารที่เกี่ยวข้อง

- ../User-Guide/Basic-Configuration - การตั้งค่าโมดูล
- ../User-Guide/Creating-Articles - การจัดการเนื้อหา
- ../../04-API-อ้างอิง/เทมเพลต/เทมเพลต-ระบบ - XOOPS โปรแกรมเทมเพลต
- ../../02-Core-Concepts/Themes/Theme-Development - การปรับแต่งธีม