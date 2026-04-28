---
title: "اتفاقيات قالب Smarty"
description: "معايير ترميز قالب Smarty في XOOPS وأفضل الممارسات"
dir: rtl
lang: ar
---

> تستخدم XOOPS Smarty للقوالب. يغطي هذا الدليل الاتفاقيات وأفضل الممارسات لتطوير قوالب Smarty.

---

## نظرة عامة

قوالب Smarty في XOOPS تتبع:

- **بنية قالب XOOPS** والتسمية
- **معايير سهولة الوصول** (WCAG)
- **قالب HTML5 دلالي**
- **تسمية فئة على نمط BEM**
- **تحسين الأداء**

---

## بنية الملفات

### تنظيم القالب

```
templates/
├── admin/                   # قوالب الإدارة
│   ├── admin_header.tpl
│   ├── admin_footer.tpl
│   ├── items_list.tpl
│   └── item_form.tpl
├── blocks/                  # قوالب الكتل
│   ├── recent_items.tpl
│   └── featured.tpl
├── common/                  # قوالب مشتركة
│   ├── pagination.tpl
│   ├── breadcrumb.tpl
│   └── empty_state.tpl
├── emails/                  # قوالب البريد
│   ├── notification.tpl
│   └── verification.tpl
├── pages/                   # قوالب الصفحات
│   ├── index.tpl
│   ├── detail.tpl
│   └── list.tpl
├── db:modulename_header.tpl # مخزنة في DB
└── db:modulename_footer.tpl
```

### تسمية الملفات

```smarty
{* ملفات قوالب XOOPS تستخدم بادئة الوحدة *}
modulename_index.tpl
modulename_item_detail.tpl
modulename_item_form.tpl
modulename_list.tpl
modulename_pagination.tpl

{* قوالب الإدارة *}
admin_index.tpl
admin_edit.tpl
admin_list.tpl
```

---

## هياكل التحكم

### الشروط

```smarty
{* if/else بسيط *}
<{if $is_published}>
  <span class="status--published">منشور</span>
<{else}>
  <span class="status--draft">مسودة</span>
<{/if}>

{* if/elseif/else *}
<{if $status == 'active'}>
  <div class="alert--success">نشط</div>
<{elseif $status == 'pending'}>
  <div class="alert--warning">قيد المراجعة</div>
<{else}>
  <div class="alert--danger">غير نشط</div>
<{/if}>
```

### الحلقات

```smarty
{* foreach أساسي *}
<ul class="item-list">
  <{foreach item=item from=$items}>
    <li class="item-list__item">
      <{$item.title}>
    </li>
  <{/foreach}>
</ul>

{* مع المفتاح والعداد *}
<{foreach item=item key=key from=$items}>
  <div class="item" data-index="<{$key}>">
    <{$item.title}> (<{$smarty.foreach.item.iteration}>/<{$smarty.foreach.item.total}>)
  </div>
<{/foreach}>

{* التحقق من الفراغ *}
<{if $items|@count > 0}>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{else}>
  <p class="empty-state">لم يتم العثور على عناصر</p>
<{/if}>
```

---

## إخراج المتغير

### الإخراج الأساسي

```smarty
{* عرض المتغير كما هو *}
<{$title}>

{* العرض مع القيمة الافتراضية إذا كانت فارغة *}
<{$title|default:'بدون عنوان'}>

{* الهروب HTML (الافتراضي للأمان) *}
<{$content}>                  {* تم الهروب بشكل افتراضي *}
<{$content|escape:'html'}>    {* تم الهروب بشكل واضح *}

{* إخراج خام (استخدم بحذر!) *}
<{$html_content|escape:false}>

{* ترميز خاص *}
<{$url|escape:'url'}>         {* سياق URL *}
<{$json|escape:'javascript'}> {* سياق JavaScript *}
```

### المعدلات

```smarty
{* تنسيق النص *}
<{$text|upper}>              {* تحويل إلى أحرف كبيرة *}
<{$text|lower}>              {* تحويل إلى أحرف صغيرة *}
<{$text|capitalize}>         {* جعل الحرف الأول كبيراً *}
<{$text|truncate:50:'...'}>  {* قطع إلى 50 حرف *}

{* تنسيق الأرقام *}
<{$price|number_format:2}>   {* تنسيق الرقم *}

{* تنسيق التاريخ *}
<{$date|date_format:'%Y-%m-%d'}> {* تنسيق التاريخ *}

{* عمليات المصفوفة *}
<{$items|@count}>            {* عد العناصر *}
<{$items|@array_keys}>       {* احصل على المفاتيح *}
```

---

## HTML أفضل الممارسات

### قالب دلالي

```smarty
{* استخدم عناصر HTML دلالية *}

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
    <span class="item__author">بقلم <{$item.author}></span>
  </footer>
</article>
```

### سهولة الوصول

```smarty
{* استخدم HTML دلالي لسهولة الوصول *}

{* روابط بنص معنى *}
<a href="<{$item.url}>" class="button">
  <{$item.title}> {* ✅ نص رابط ذو معنى *}
</a>

{* صور مع نص بديل *}
<img src="<{$image.url}>" alt="<{$image.alt_text}>" class="item__image">

{* تسميات نموذج مع مدخلات *}
<label for="email-input" class="form-field__label">
  عنوان البريد الإلكتروني
</label>
<input id="email-input" type="email" name="email" class="form-field__input" required>

{* العناوين بالترتيب *}
<h1><{$page_title}></h1>
<h2><{$section_title}></h2> {* ✅ بالترتيب *}

{* استخدم سمات aria عند الحاجة *}
<nav aria-label="التنقل الرئيسي">
  <{$menu}>
</nav>
```

---

## أفضل الممارسات

### افعل

- استخدم HTML5 دلالي
- أدرج نص بديل للصور
- استخدم ثوابت اللغة للنص
- اهرب من الإخراج (افتراضي)
- احتفظ بالمنطق في الحد الأدنى
- استخدم أسماء متغيرات معنى
- أدرج رؤوس الملفات
- استخدم أسماء فئات على نمط BEM
- اختبر باستخدام قارئات الشاشة

### لا تفعل

- لا تمزج المنطق والعرض
- لا تنسَ النص البديل
- لا تستخدم HTML خام بدون هروب
- لا تنشئ متغيرات عامة في القوالب
- لا تستخدم ميزات Smarty المهمل
- لا تتداخل القوالب بعمق
- لا تتجاهل سهولة الوصول
- لا تحد النص بشكل صارم (استخدم ثوابت)

---

## الأمثلة الشاملة

### قالب الوحدة الكامل

```smarty
{*
 * وحدة XOOPS - الناشر
 * @file قالب قائمة العناصر
 * @author فريق XOOPS
 * @copyright 2026 مشروع XOOPS
 * @license GPL-2.0-or-later
 *}

<{include file="db:publisher_header.tpl"}>

<main class="publisher-container">
  <header class="page-header">
    <h1 class="page-header__title"><{$page_title}></h1>
    <p class="page-header__subtitle"><{$smarty.const._MD_PUBLISHER_ITEMS_DESC}></p>
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
              </div>

              <p class="item-card__excerpt">
                <{$item.description|truncate:150:'...'}>
              </p>

              <a href="<{$item.url}>" class="button button--primary">
                <{$smarty.const._MD_PUBLISHER_READ_MORE}>
              </a>
            </article>
          </li>
        <{/foreach}>
      </ul>
    </section>
  <{else}>
    <div class="empty-state">
      <p class="empty-state__message">
        <{$smarty.const._MD_PUBLISHER_NO_ITEMS}>
      </p>
    </div>
  <{/if}>
</main>

<{include file="db:publisher_footer.tpl"}>
```

---

## التوثيق ذات الصلة

- معايير JavaScript
- إرشادات CSS
- قواعس السلوك
- معايير PHP

---

#xoops #smarty #templates #conventions #best-practices
