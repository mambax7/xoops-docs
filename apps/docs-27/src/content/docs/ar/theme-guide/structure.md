---
title: "هيكل المواضيع"
dir: rtl
lang: ar
---

## نظرة عامة

تتحكم مواضيع XOOPS في العرض البصري لموقعك. يعتبر فهم هيكل المواضيع ضروريا للتخصيص وإنشاء مواضيع جديدة.

## تخطيط الدليل

```
themes/mytheme/
├── theme.html                  # قالب التخطيط الرئيسي
├── theme.ini                   # تكوين المواضيع
├── theme_blockleft.html        # قالب كتلة الشريط الجانبي الأيسر
├── theme_blockright.html       # قالب كتلة الشريط الجانبي الأيمن
├── theme_blockcenter_c.html    # كتلة وسط (في المنتصف)
├── theme_blockcenter_l.html    # كتلة وسط (محاذاة يسار)
├── theme_blockcenter_r.html    # كتلة وسط (محاذاة يمين)
├── css/
│   ├── style.css              # ورقة الأنماط الرئيسية
│   ├── admin.css              # تخصيصات الإدارة (اختياري)
│   └── print.css              # ورقة النمط للطباعة (اختياري)
├── js/
│   └── theme.js               # جافا سكريبت المواضيع
├── images/
│   ├── logo.png               # شعار الموقع
│   └── icons/                 # رموز المواضيع
├── language/
│   └── english/
│       └── main.php           # ترجمات المواضيع
├── modules/                    # تجاوزات قالب الوحدة
│   └── news/
│       └── news_index.tpl
└── screenshot.png             # صورة معاينة المواضيع
```

## الملفات الأساسية

### theme.html

قالب التخطيط الرئيسي الذي يلتف حول جميع المحتويات:

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

ملف تكوين المواضيع:

```ini
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

### قوالب الكتل

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

## متغيرات القالب

### المتغيرات العامة

| المتغير | الوصف |
|----------|-------------|
| `$xoops_sitename` | اسم الموقع |
| `$xoops_url` | عنوان URL الموقع |
| `$xoops_theme` | اسم المواضيع الحالي |
| `$xoops_langcode` | رمز اللغة |
| `$xoops_charset` | ترميز الأحرف |
| `$xoops_pagetitle` | عنوان الصفحة |
| `$xoops_dirname` | اسم الوحدة الحالي |

### متغيرات المستخدم

| المتغير | الوصف |
|----------|-------------|
| `$xoops_isuser` | هل تم تسجيل الدخول |
| `$xoops_isadmin` | هل هو مسؤول |
| `$xoops_userid` | معرف المستخدم |
| `$xoops_uname` | اسم المستخدم |

### متغيرات التخطيط

| المتغير | الوصف |
|----------|-------------|
| `$xoops_showlblock` | إظهار الكتل اليسرى |
| `$xoops_showrblock` | إظهار الكتل اليمنى |
| `$xoops_showcblock` | إظهار الكتل الوسطى |
| `$xoops_lblocks` | مصفوفة الكتل اليسرى |
| `$xoops_rblocks` | مصفوفة الكتل اليمنى |
| `$xoops_contents` | محتوى الصفحة الرئيسية |

## تجاوزات قالب الوحدة

تجاوز قوالب الوحدات بوضعها في موضوعك:

```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # Overrides news module's index
    └── news_article.tpl    # Overrides article display
```

## تنظيم CSS

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

## الوثائق ذات الصلة

- ../Templates/Smarty-Templating - بناء جملة القالب
- Theme-Development - دليل المواضيع الكامل
- CSS-Best-Practices - إرشادات تصميم النمط
- ../../03-Module-Development/Block-Development - إنشاء الكتل
