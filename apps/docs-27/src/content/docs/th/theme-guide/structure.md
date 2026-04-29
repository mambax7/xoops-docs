---
title: "โครงสร้างธีม"
---
## ภาพรวม

ธีม XOOPS ควบคุมการนำเสนอด้วยภาพเว็บไซต์ของคุณ การทำความเข้าใจโครงสร้างธีมถือเป็นสิ่งสำคัญสำหรับการปรับแต่งและการสร้างธีมใหม่

## เค้าโครงไดเร็กทอรี
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
## ไฟล์สำคัญ

### theme.html

เทมเพลตโครงร่างหลักที่ล้อมรอบเนื้อหาทั้งหมด:
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
### theme.ini

ไฟล์การกำหนดค่าธีม:
```
ini
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
### เทมเพลตบล็อก
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
## ตัวแปรเทมเพลต

### ตัวแปรร่วม

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `$xoops_sitename` | ชื่อไซต์ |
| `$xoops_url` | ไซต์ URL |
| `$xoops_theme` | ชื่อธีมปัจจุบัน |
| `$xoops_langcode` | รหัสภาษา |
| `$xoops_charset` | การเข้ารหัสอักขระ |
| `$xoops_pagetitle` | ชื่อหน้า |
| `$xoops_dirname` | ชื่อโมดูลปัจจุบัน |

### ตัวแปรผู้ใช้

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `$xoops_isuser` | เข้าสู่ระบบ |
| `$xoops_isadmin` | เป็นผู้ดูแลระบบ |
| `$xoops_userid` | ผู้ใช้ ID |
| `$xoops_uname` | ชื่อผู้ใช้ |

### ตัวแปรเค้าโครง

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `$xoops_showlblock` | แสดงบล็อกด้านซ้าย |
| `$xoops_showrblock` | แสดงบล็อกด้านขวา |
| `$xoops_showcblock` | แสดงบล็อกกลาง |
| `$xoops_lblocks` | ซ้ายบล็อกอาร์เรย์ |
| `$xoops_rblocks` | บล็อกอาร์เรย์ทางขวา |
| `$xoops_contents` | เนื้อหาหน้าหลัก |

## การแทนที่เทมเพลตโมดูล

แทนที่เทมเพลตโมดูลโดยวางไว้ในธีมของคุณ:
```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # Overrides news module's index
    └── news_article.tpl    # Overrides article display
```
## CSS องค์กร
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
## เอกสารที่เกี่ยวข้อง

- ../Templates/Smarty-Templating - ไวยากรณ์เทมเพลต
- การพัฒนาธีม - คู่มือธีมฉบับสมบูรณ์
- CSS-แนวทางปฏิบัติที่ดีที่สุด - หลักเกณฑ์การจัดสไตล์ 
- ../../03-Module-Development/Block-Development - การสร้างบล็อก