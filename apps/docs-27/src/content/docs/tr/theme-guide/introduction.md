---
title: "theme Geliştirme"
description: "Smarty template mirasıyla XOOPS temalarını oluşturma ve özelleştirme"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Bu kılavuz, theme yapısı, template mirası ve duyarlı, modern themes oluşturmaya yönelik en iyi uygulamalar da dahil olmak üzere XOOPS temalarının nasıl oluşturulacağını kapsar.

## İlgili Belgeler

- Smarty-Basics - XOOPS'de Smarty'nin temelleri
- template-Değişkenler - Şablonlarda mevcut değişkenler
- Smarty-4-Migration - Smarty 3'ten 4'e yükseltme

## theme Yapısı

Bir XOOPS teması aşağıdaki dizin yapısından oluşur:
```
themes/
  mytheme/
    theme.tpl              # Main theme template
    theme_autorun.php      # Auto-executed PHP (optional)
    XOOPS_version.php      # Theme configuration
    css/
      style.css            # Main stylesheet
      custom.css           # Custom styles
    images/
      logo.png             # Theme images
    js/
      custom.js            # Theme JavaScript
    language/
      english/
        main.php           # Language strings
```
## XOOPS_version.php

theme yapılandırma dosyası theme özelliklerini tanımlar:
```php
<?php
$themeversion = [
    'name'        => 'My Theme',
    'description' => 'A modern responsive XOOPS theme',
    'version'     => '1.0.0',
    'author'      => 'Your Name',
    'author_url'  => 'https://yoursite.com',
    'license'     => 'GPL-2.0',
    'credits'     => 'Based on Bootstrap 5',
    'parent'      => '',  // Parent theme name for inheritance
    'screenshots' => [
        'screenshot.png',
    ],
    'features' => [
        'responsive' => true,
        'rtl'        => false,
    ],
];
```
## Temel theme.tpl Yapısı
```smarty
<!DOCTYPE html>
<html lang="<{$xoops_langcode}>">
<head>
    <meta charset="<{$xoops_charset}>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><{$xoops_pagetitle}></title>

    <{* Meta tags *}>
    <meta name="description" content="<{$xoops_meta_description}>">
    <meta name="keywords" content="<{$xoops_meta_keywords}>">
    <meta name="robots" content="<{$xoops_meta_robots}>">
    <meta name="author" content="<{$xoops_meta_author}>">
    <meta name="generator" content="XOOPS">

    <{* CSS files *}>
    <link rel="stylesheet" href="<{$xoops_themecss}>">
    <link rel="stylesheet" href="<{$xoops_url}>/themes/<{$xoops_theme}>/css/custom.css">

    <{* Additional head content *}>
    <{$xoops_module_header}>
</head>

<body>
    <{* Header *}>
    <header>
        <div class="container">
            <a href="<{$xoops_url}>">
                <img src="<{$xoops_imageurl}>images/logo.png" alt="<{$xoops_sitename}>">
            </a>
            <h1><{$xoops_sitename}></h1>
        </div>
    </header>

    <{* Navigation *}>
    <nav>
        <{$xoops_mainmenu}>
    </nav>

    <{* Content area *}>
    <main class="container">
        <{* Left blocks *}>
        <{if $xoops_showlblock}>
        <aside class="left-blocks">
            <{foreach item=block from=$xoops_lblocks}>
                <{include file="db:system_block_$block.template" block=$block}>
            <{/foreach}>
        </aside>
        <{/if}>

        <{* Main content *}>
        <div class="content">
            <{$xoops_contents}>
        </div>

        <{* Right blocks *}>
        <{if $xoops_showrblock}>
        <aside class="right-blocks">
            <{foreach item=block from=$xoops_rblocks}>
                <{include file="db:system_block_$block.template" block=$block}>
            <{/foreach}>
        </aside>
        <{/if}>
    </main>

    <{* Footer *}>
    <footer>
        <div class="container">
            <p>&copy; <{$smarty.now|date_format:"%Y"}> <{$xoops_sitename}></p>
            <{$xoops_footer}>
        </div>
    </footer>

    <{* JavaScript *}>
    <script src="<{$xoops_url}>/themes/<{$xoops_theme}>/js/custom.js"></script>
    <{$xoops_js}>
</body>
</html>
```
## template Mirası

Smarty'in template mirası, bir ana temadan miras alan alt themes oluşturmanıza olanak tanır.

### Ana theme (base.tpl)
```smarty
<!DOCTYPE html>
<html>
<head>
    <title>{block name=title}{/block} - <{$xoops_sitename}></title>
    {block name=head_css}
    <link rel="stylesheet" href="<{$xoops_themecss}>">
    {/block}
</head>
<body>
    {block name=header}
    <header>
        <h1><{$xoops_sitename}></h1>
    </header>
    {/block}

    {block name=content}
    <main>
        <{$xoops_contents}>
    </main>
    {/block}

    {block name=footer}
    <footer>
        <p>&copy; <{$smarty.now|date_format:"%Y"}></p>
    </footer>
    {/block}
</body>
</html>
```
### Çocuk Teması (theme.tpl)
```smarty
{extends file="db:parenttheme/theme.tpl"}

{block name=title}My Custom Title{/block}

{block name=head_css}
    {$smarty.block.parent}  {* Include parent CSS *}
    <link rel="stylesheet" href="<{$xoops_url}>/themes/childtheme/css/custom.css">
{/block}

{block name=header}
    <header class="custom-header">
        <div class="logo">
            <img src="<{$xoops_imageurl}>images/logo.png" alt="Logo">
        </div>
        <nav class="main-nav">
            <{$xoops_mainmenu}>
        </nav>
    </header>
{/block}
```
### theme Varyasyonları Oluşturma

Bir temel temadan birden fazla theme varyasyonu oluşturun:

**xbootstrap-green/theme.tpl**:
```smarty
{extends file="db:xbootstrap/theme.tpl"}

{block name=css}
<link rel="stylesheet" href="<{$xoops_url}>/themes/xbootstrap-green/css/green.css">
{/block}
```
**xbootstrap-green/XOOPS_version.php**:
```php
<?php
$themeversion = [
    'name'   => 'xbootstrap-green',
    'parent' => 'xbootstrap',
    // ... other settings
];
```
## theme_autorun.php

Bu dosya otomatik olarak yürütülür ve şablonlara yönelik verileri hazırlamak için kullanılabilir:
```php
<?php
/** @var XoopsTpl $xoopsTpl */
global $xoopsTpl;

if (!empty($xoopsTpl)) {
    // Add configuration directory
    $xoopsTpl->addConfigDir(__DIR__);
}

// Include module autoloader if needed
if (file_exists(XOOPS_ROOT_PATH . '/modules/publisher/preloads/autoloader.php')) {
    require XOOPS_ROOT_PATH . '/modules/publisher/preloads/autoloader.php';
}

use XoopsModules\Publisher\Helper;
use XoopsModules\Publisher\Constants;

/**
 * Fetch items for theme display
 */
function getPublisherItems($limit, $sort = 'RAND()', $order = '')
{
    $helper = Helper::getInstance();
    $itemsObj = $helper->getHandler('Item')->getItems(
        $limit,
        0, // start
        [Constants::PUBLISHER_STATUS_PUBLISHED],
        -1, // categoryid
        $sort,
        $order
    );

    $items = [];
    if ($itemsObj) {
        foreach ($itemsObj as $itemObj) {
            $newItem = [
                'itemid'  => $itemObj->itemid(),
                'title'   => $itemObj->title(),
                'body'    => $itemObj->body(),
                'votes'   => $itemObj->votes(),
                'counter' => $itemObj->counter(),
                'image'   => XOOPS_URL . '/uploads/blank.gif',
            ];

            $images = $itemObj->getImages();
            if (isset($images['main']) && is_object($images['main'])) {
                $newItem['image'] = XOOPS_URL . '/uploads/' . $images['main']->getVar('image_name');
            }

            $items[] = $newItem;
        }
    }
    return $items;
}

// Assign data to templates
$xoopsTpl->assign('sliderItems', getPublisherItems(9));
$xoopsTpl->assign('featuredItems', getPublisherItems(3));
$xoopsTpl->assign('latestItems', getPublisherItems(4));
$xoopsTpl->assign('xoops_url', XOOPS_URL);
```
## Bootstrap'i Kullanmak

Bootstrap 5 teması örneği:
```smarty
<!DOCTYPE html>
<html lang="<{$xoops_langcode}>">
<head>
    <meta charset="<{$xoops_charset}>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><{$xoops_pagetitle}></title>

    {* Bootstrap CSS *}
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<{$xoops_url}>/themes/<{$xoops_theme}>/css/custom.css">

    <{$xoops_module_header}>
</head>
<body>
    {* Navigation *}
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
            <a class="navbar-brand" href="<{$xoops_url}>">
                <{$xoops_sitename}>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <{$xoops_mainmenu}>
            </div>
        </div>
    </nav>

    {* Main content *}
    <div class="container my-4">
        <div class="row">
            {* Left sidebar *}
            <{if $xoops_showlblock}>
            <div class="col-lg-3">
                <{foreach item=block from=$xoops_lblocks}>
                <div class="card mb-3">
                    <div class="card-header"><{$block.title}></div>
                    <div class="card-body"><{$block.content}></div>
                </div>
                <{/foreach}>
            </div>
            <{/if}>

            {* Main content area *}
            <div class="col-lg-<{if $xoops_showlblock && $xoops_showrblock}>6<{elseif $xoops_showlblock || $xoops_showrblock}>9<{else}>12<{/if}>">
                <{$xoops_contents}>
            </div>

            {* Right sidebar *}
            <{if $xoops_showrblock}>
            <div class="col-lg-3">
                <{foreach item=block from=$xoops_rblocks}>
                <div class="card mb-3">
                    <div class="card-header"><{$block.title}></div>
                    <div class="card-body"><{$block.content}></div>
                </div>
                <{/foreach}>
            </div>
            <{/if}>
        </div>
    </div>

    {* Footer *}
    <footer class="bg-dark text-white py-4 mt-auto">
        <div class="container text-center">
            <p class="mb-0">&copy; <{$smarty.now|date_format:"%Y"}> <{$xoops_sitename}></p>
            <{$xoops_footer}>
        </div>
    </footer>

    {* Bootstrap JS *}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <{$xoops_js}>
</body>
</html>
```
## Blok Şablonları

Özel blok şablonları oluşturun:
```smarty
{* themes/mytheme/templates/system_block.tpl *}
<div class="block">
    <{if $block.title}>
    <h3 class="block-title"><{$block.title}></h3>
    <{/if}>
    <div class="block-content">
        <{$block.content}>
    </div>
</div>
```
## Özel Carousel/Slider

Dinamik içerik atlıkarıncaya örnek:
```smarty
{* Slider using theme_autorun.php data *}
<{if $sliderItems}>
<div class="owl-carousel owl-theme">
    <{foreach item=item from=$sliderItems}>
    <div class="owl-carousel-info-wrap item">
        <img src="<{$item.image}>" class="owl-carousel-image img-fluid" alt="<{$item.title}>">

        <div class="owl-carousel-info">
            <h4 class="mb-2">
                <a href="<{$xoops_url}>/modules/publisher/item.php?itemid=<{$item.itemid}>">
                    <{$item.title|truncate:15}>
                </a>
            </h4>
            <span class="badge">Reads: <{$item.counter}></span>
            <span class="badge">Votes: <{$item.votes}></span>
        </div>
    </div>
    <{/foreach}>
</div>
<{/if}>
```
## Duyarlı Tasarım İpuçları

### Mobil-First CSS
```css
/* Base styles for mobile */
.content {
    width: 100%;
    padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
    .content {
        width: 75%;
        padding: 2rem;
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .content {
        width: 60%;
        padding: 3rem;
    }
}
```
### Koşullu Blok Görünümü
```smarty
{* Hide blocks on mobile using CSS classes *}
<{if $xoops_showlblock}>
<aside class="left-blocks d-none d-lg-block">
    <{foreach item=block from=$xoops_lblocks}>
        <{include file="db:system_block.tpl" block=$block}>
    <{/foreach}>
</aside>
<{/if}>
```
## En İyi Uygulamalar

### Anlambilimi Kullan HTML
```smarty
<header>...</header>
<nav>...</nav>
<main>...</main>
<aside>...</aside>
<footer>...</footer>
```
### Varlıkları Optimize Edin
```smarty
{* Defer non-critical JavaScript *}
<script src="script.js" defer></script>

{* Async for independent scripts *}
<script src="analytics.js" async></script>
```
### Erişilebilirlik
```smarty
{* Use proper ARIA labels *}
<nav aria-label="Main navigation">
    <{$xoops_mainmenu}>
</nav>

{* Provide alt text for images *}
<img src="<{$item.image}>" alt="<{$item.title|escape}>">

{* Skip links for keyboard navigation *}
<a href="#main-content" class="skip-link">Skip to content</a>
```
### Performans
```smarty
{* Lazy load images *}
<img src="<{$item.image}>" loading="lazy" alt="<{$item.title}>">

{* Preload critical resources *}
<link rel="preload" href="fonts/custom.woff2" as="font" type="font/woff2" crossorigin>
```
---

#themes #smarty #xoops #css #design #responsive