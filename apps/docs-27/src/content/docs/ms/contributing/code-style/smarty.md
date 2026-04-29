---
title: "Konvensyen Templat Smarty"
description: "XOOPS Piawaian pengekodan templat Smarty dan amalan terbaik"
---
> XOOPS menggunakan Smarty untuk templat. Panduan ini merangkumi konvensyen dan amalan terbaik untuk membangunkan templat Smarty.---

## Gambaran KeseluruhanTemplat XOOPS Smarty mengikut:- **struktur templat XOOPS** dan penamaan
- **Piawaian kebolehaksesan** (WCAG)
- **Penanda semantik HTML5**
- **penamaan kelas gaya BEM**
- **Pengoptimuman prestasi**---

## Struktur Fail### Organisasi Templat
```
templates/
├── admin/                   # Admin templates
│   ├── admin_header.tpl
│   ├── admin_footer.tpl
│   ├── items_list.tpl
│   └── item_form.tpl
├── blocks/                  # Block templates
│   ├── recent_items.tpl
│   └── featured.tpl
├── common/                  # Shared templates
│   ├── pagination.tpl
│   ├── breadcrumb.tpl
│   └── empty_state.tpl
├── emails/                  # Email templates
│   ├── notification.tpl
│   └── verification.tpl
├── pages/                   # Page templates
│   ├── index.tpl
│   ├── detail.tpl
│   └── list.tpl
├── db:modulename_header.tpl # Stored in DB for theme overrides
└── db:modulename_footer.tpl
```
### Penamaan Fail
```
Smarty
{* XOOPS template files use module prefix *}
modulename_index.tpl
modulename_item_detail.tpl
modulename_item_form.tpl
modulename_list.tpl
modulename_pagination.tpl

{* Admin templates *}
admin_index.tpl
admin_edit.tpl
admin_list.tpl
```
---

## Pengepala Fail### Komen Pengepala Templat
```
Smarty
{*
 * XOOPS Module - Module Name
 * @file Item list template
 * @author Your Name <email@example.com>
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 * Description of what this template displays
 *}

<h1><{$page_title}></h1>
```
---

## Pembolehubah dan Penamaan### Konvensyen Penamaan Pembolehubah
```
Smarty
{* Use descriptive names *}
<{$page_title}>              {* ✅ Clear *}
<{$items}>                   {* ✅ Clear *}
<{$user_count}>              {* ✅ Clear *}

<{$p_t}>                     {* ❌ Unclear abbreviation *}
<{$x}>                       {* ❌ Unclear *}
```
### Skop Pembolehubah
```
Smarty
{* Global XOOPS variables *}
<{$xoops_url}>              {* Root URL *}
<{$xoops_sitename}>         {* Site name *}
<{$xoops_requesturi}>       {* Current URI *}
<{$xoops_isadmin}>          {* Admin mode flag *}
<{$xoops_user_is_admin}>    {* Is user admin *}

{* Common module variables *}
<{$module_id}>              {* Current module ID *}
<{$module_name}>            {* Current module name *}
<{$moduledir}>              {* Module directory *}
<{$lang}>                   {* Current language *}
```
---

## Pemformatan dan Jarak### Struktur Asas
```
Smarty
{*
 * Template header
 *}

{* Include other templates *}
<{include file="db:modulename_header.tpl"}>

{* Main content *}
<main class="modulename-container">
  <h1><{$page_title}></h1>

  <{if $items|@count > 0}>
    {* Render items *}
  <{else}>
    {* Show empty state *}
  <{/if}>
</main>

{* Footer *}
<{include file="db:modulename_footer.tpl"}>
```
### Lekukan
```
Smarty
{* Use 2 spaces for indentation *}
<{if $condition}>
  <div>
    <p><{$content}></p>
  </div>
<{/if}>

{* Don't skip lines within blocks *}
<{foreach item=item from=$items}>
  <div class="item">
    <h3><{$item.title}></h3>
    <p><{$item.description}></p>
  </div>
<{/foreach}>
```
### Jarak Sekitar Teg
```
Smarty
{* No spaces inside tag delimiters *}
<{$variable}>                {* ✅ *}
<{ $variable }>              {* ❌ *}

{* Space after pipes in modifiers *}
<{$text|truncate:50}>        {* ✅ *}
<{$text|truncate:50}>        {* ✅ *}

{* Space around operators in conditionals *}
<{if $count > 0}>            {* ✅ *}
<{if $count>0}>              {* ❌ *}
```
---

## Struktur Kawalan### Bersyarat
```
Smarty
{* Simple if/else *}
<{if $is_published}>
  <span class="status--published">Published</span>
<{else}>
  <span class="status--draft">Draft</span>
<{/if}>

{* if/elseif/else *}
<{if $status == 'active'}>
  <div class="alert--success">Active</div>
<{elseif $status == 'pending'}>
  <div class="alert--warning">Pending Review</div>
<{else}>
  <div class="alert--danger">Inactive</div>
<{/if}>

{* Inline ternary (Smarty 3+) *}
<span class="badge <{if $is_featured}>badge--featured<{/if}>">
  <{$label}>
</span>
```
### Gelung
```
Smarty
{* Basic foreach *}
<ul class="item-list">
  <{foreach item=item from=$items}>
    <li class="item-list__item">
      <{$item.title}>
    </li>
  <{/foreach}>
</ul>

{* With key and counter *}
<{foreach item=item key=key from=$items}>
  <div class="item" data-index="<{$key}>">
    <{$item.title}> (<{$Smarty.foreach.item.iteration}>/<{$Smarty.foreach.item.total}>)
  </div>
<{/foreach}>

{* With alternation *}
<{foreach item=item from=$items}>
  <div class="item <{if $Smarty.foreach.item.iteration % 2 == 0}>item--even<{else}>item--odd<{/if}>">
    <{$item.title}>
  </div>
<{/foreach}>

{* Check if empty *}
<{if $items|@count > 0}>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{else}>
  <p class="empty-state">No items found</p>
<{/if}>
```
### Bahagian (ditamatkan, gunakan foreach sebaliknya)
```
Smarty
{* Don't use section - it's deprecated *}
{* ❌ <{section name=i loop=$items}> *}

{* Use foreach instead *}
{* ✅ *}
<{foreach item=item from=$items}>
```
---

## Output Berubah### Output Asas
```
Smarty
{* Display variable as-is *}
<{$title}>

{* Display with default if empty *}
<{$title|default:'Untitled'}>

{* HTML escape (default for safety) *}
<{$content}>                  {* Escaped by default *}
<{$content|escape:'html'}>    {* Explicitly escaped *}

{* Raw output (use carefully!) *}
<{$html_content|escape:false}>

{* Special encoding *}
<{$url|escape:'url'}>         {* For URL context *}
<{$json|escape:'javascript'}> {* For JavaScript *}
```
### Pengubah suai
```
Smarty
{* Text formatting *}
<{$text|upper}>              {* Convert to uppercase *}
<{$text|lower}>              {* Convert to lowercase *}
<{$text|capitalize}>         {* Capitalize first letter *}
<{$text|truncate:50:'...'}>  {* Truncate to 50 chars *}

{* Number formatting *}
<{$price|number_format:2}>   {* Format number *}
<{$count|string_format:"%03d"}> {* Format as string *}

{* Date formatting *}
<{$date|date_format:'%Y-%m-%d'}> {* Format date *}
<{$date|date_format:'%B %d, %Y'}>

{* Array operations *}
<{$items|@count}>            {* Count items (note @) *}
<{$items|@array_keys}>       {* Get keys *}

{* Chaining modifiers *}
<{$title|upper|truncate:30:'...'}> {* Chain multiple *}

{* Conditional modifier *}
<{$status|default:'pending'}>
```
---

## Pemalar### Menggunakan Pemalar XOOPS
```
Smarty
{* Use define()d constants from PHP *}
{* These must be defined in PHP first *}

{* Core constants *}
<{$Smarty.const._MD_MODULENAME_TITLE}>
<{$Smarty.const._MD_MODULENAME_SUBMIT}>

{* Module constants *}
<{$Smarty.const.MODULEDIR}>
<{$Smarty.const.MODULEURL}>

{* Custom constants *}
<{$Smarty.const._MY_CONSTANT}>
```
### Pemalar Bahasa
```
Smarty
{* Use language constants for i18n *}
{* Define in language file: define('_MD_MODULENAME_TITLE', 'English Title'); *}

<h1><{$Smarty.const._MD_MODULENAME_TITLE}></h1>
<p><{$Smarty.const._MD_MODULENAME_DESCRIPTION}></p>
<button><{$Smarty.const._MD_MODULENAME_SUBMIT}></button>
```
---

## HTML Amalan Terbaik### Penanda Semantik
```
Smarty
{* Use semantic HTML elements *}

<article class="item">
  <header class="item__header">
    <h1 class="item__title"><{$item.title}></h1>
    <time class="item__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
      <{$item.created|date_format:'%B %d, %Y'}>
    </time>
  </header>

  <main class="item__content">
    <{$item.content|escape:false}>
  </main>

  <footer class="item__footer">
    <span class="item__author">By <{$item.author}></span>
  </footer>
</article>
```
### Kebolehcapaian
```
Smarty
{* Use semantic HTML for accessibility *}

{* Links with meaningful text *}
<a href="<{$item.url}>" class="button">
  <{$item.title}> {* ✅ Meaningful link text *}
</a>

{* Images with alt text *}
<img src="<{$image.url}>" alt="<{$image.alt_text}>" class="item__image">

{* Form labels with inputs *}
<label for="email-input" class="form-field__label">
  Email Address
</label>
<input id="email-input" type="email" name="email" class="form-field__input" required>

{* Headings in order *}
<h1><{$page_title}></h1>
<h2><{$section_title}></h2> {* ✅ In order *}
<h4></h4>                  {* ❌ Skips h3 *}

{* Use aria attributes when needed *}
<nav aria-label="Main navigation">
  <{$menu}>
</nav>

<button aria-expanded="<{if $is_open}>true<{else}>false<{/if}>">
  Menu
</button>
```
---

## Corak Biasa### Penomboran
```
Smarty
{* Display pagination *}
<{if $paginator|default:false}>
  <nav class="pagination" aria-label="Pagination">
    <ul class="pagination__list">
      <{if $paginator.has_previous}>
        <li class="pagination__item">
          <a href="<{$paginator.first_url}>" class="pagination__link">First</a>
        </li>
      <{/if}>

      <{foreach item=page from=$paginator.pages}>
        <li class="pagination__item">
          <{if $page.is_current}>
            <span class="pagination__link pagination__link--current" aria-current="page">
              <{$page.number}>
            </span>
          <{else}>
            <a href="<{$page.url}>" class="pagination__link">
              <{$page.number}>
            </a>
          <{/if}>
        </li>
      <{/foreach}>

      <{if $paginator.has_next}>
        <li class="pagination__item">
          <a href="<{$paginator.last_url}>" class="pagination__link">Last</a>
        </li>
      <{/if}>
    </ul>
  </nav>
<{/if}>
```
### Serbuk roti
```
Smarty
{* Display breadcrumb navigation *}
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a href="<{$xoops_url}>" class="breadcrumb__link">Home</a>
    </li>

    <{foreach item=crumb from=$breadcrumbs}>
      <li class="breadcrumb__item">
        <{if $crumb.url}>
          <a href="<{$crumb.url}>" class="breadcrumb__link">
            <{$crumb.title}>
          </a>
        <{else}>
          <span class="breadcrumb__current" aria-current="page">
            <{$crumb.title}>
          </span>
        <{/if}>
      </li>
    <{/foreach}>
  </ol>
</nav>
```
### Mesej Makluman
```
Smarty
{* Display messages *}
<{if $messages|default:false}>
  <{foreach item=message from=$messages}>
    <div class="alert alert--<{$message.type}>" role="alert">
      <{$message.text}>
    </div>
  <{/foreach}>
<{/if}>

{* Display errors *}
<{if $errors|default:false}>
  <div class="alert alert--danger" role="alert">
    <h2 class="alert__title">Error</h2>
    <ul class="alert__list">
      <{foreach item=error from=$errors}>
        <li><{$error}></li>
      <{/foreach}>
    </ul>
  </div>
<{/if}>
```
---

## Prestasi### Pengoptimuman Templat
```
Smarty
{* Assign variables once, reuse *}
<{assign var=item_count value=$items|@count}>
<{if $item_count > 0}>
  <p>Found <{$item_count}> items</p>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{/if}>

{* Use {assign} for computed values *}
<{assign var=is_admin value=$xoops_isadmin}>
<{if $is_admin}>
  {* Admin options *}
<{/if}>
<{if $is_admin}>
  {* Reuse same computed value *}
<{/if}>

{* Avoid complex logic in templates *}
{* ❌ Complex calculation in template *}
<{$total = 0}>
<{foreach item=item from=$items}>
  <{$total = $total + $item.price * $item.quantity}>
<{/foreach}>
<p><{$total}></p>

{* ✅ Compute in PHP, display in template *}
<p><{$total}></p> {* Passed from PHP controller *}
```
---

## Amalan Terbaik### Lakukan- Gunakan semantik HTML5
- Sertakan teks alt untuk imej
- Gunakan pemalar bahasa untuk teks
- Keluaran melarikan diri (lalai)
- Pastikan logik minimum
- Gunakan nama pembolehubah yang bermakna
- Sertakan pengepala fail
- Gunakan nama kelas gaya BEM
- Uji dengan pembaca skrin### Jangan- Jangan campurkan logik dan persembahan
- Jangan lupa teks alt
- Jangan gunakan HTML mentah tanpa melarikan diri
- Jangan buat pembolehubah global dalam templat
- Jangan gunakan ciri Smarty yang telah ditamatkan
- Jangan sarang templat terlalu dalam
- Jangan abaikan kebolehaksesan
- Jangan teks kod keras (gunakan pemalar)---

## Contoh Templat### Templat Modul Lengkap
```
Smarty
{*
 * XOOPS Module - Publisher
 * @file Item list template
 * @author XOOPS Team
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 *}

<{include file="db:publisher_header.tpl"}>

<main class="publisher-container">
  <header class="page-header">
    <h1 class="page-header__title"><{$page_title}></h1>
    <p class="page-header__subtitle"><{$Smarty.const._MD_PUBLISHER_ITEMS_DESC}></p>
  </header>

  <{if $items|@count > 0}>
    <section class="items-list">
      <ul class="items-list__items">
        <{foreach item=item from=$items}>
          <li class="items-list__item item-card">
            <article class="item-card">
              <h2 class="item-card__title">
                <a href="<{$item.url}>" class="item-card__link">
                  <{$item.title}>
                </a>
              </h2>

              <div class="item-card__meta">
                <time class="item-card__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
                  <{$item.created|date_format:'%B %d, %Y'}>
                </time>
                <span class="item-card__author">
                  By <{$item.author}>
                </span>
              </div>

              <p class="item-card__excerpt">
                <{$item.description|truncate:150:'...'}>
              </p>

              <a href="<{$item.url}>" class="button button--primary">
                <{$Smarty.const._MD_PUBLISHER_READ_MORE}>
              </a>
            </article>
          </li>
        <{/foreach}>
      </ul>
    </section>

    <{if $paginator|default:false}>
      <{include file="db:publisher_pagination.tpl"}>
    <{/if}>
  <{else}>
    <div class="empty-state">
      <p class="empty-state__message">
        <{$Smarty.const._MD_PUBLISHER_NO_ITEMS}>
      </p>
    </div>
  <{/if}>
</main>

<{include file="db:publisher_footer.tpl"}>
```
---

## Dokumentasi Berkaitan- Piawaian JavaScript
- Garis Panduan CSS
- Tatakelakuan
- Piawaian PHP---

#XOOPS #Smarty #templates #conventions #best-practices