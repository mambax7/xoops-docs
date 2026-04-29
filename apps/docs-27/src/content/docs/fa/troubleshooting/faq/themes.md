---
title: "سوالات متداول تم"
description: "سوالات متداول در مورد تم های XOOPS"
---
# موضوع سوالات متداول

> پرسش ها و پاسخ های متداول در مورد تم ها، سفارشی سازی و مدیریت XOOPS.

---

## نصب و فعال سازی تم

### س: چگونه یک تم جدید در XOOPS نصب کنم؟

**الف:**
1. فایل فشرده تم را دانلود کنید
2. به XOOPS Admin > Appearance > Themes بروید
3. روی «آپلود» کلیک کنید و فایل فشرده را انتخاب کنید
4. تم در لیست تم ظاهر می شود
5. کلیک کنید تا برای سایت شما فعال شود

جایگزین: به صورت دستی در فهرست `/themes/` استخراج کنید و پنل مدیریت را تازه کنید.

---

### س: بارگذاری طرح زمینه با "مجوز رد شد" ناموفق بود

**A:** رفع مجوزهای دایرکتوری تم:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### س: چگونه می توانم یک موضوع متفاوت برای کاربران خاص تنظیم کنم؟

**الف:**
1. به User Manager > Edit User بروید
2. به برگه «سایر» بروید
3. موضوع دلخواه را در منوی کشویی «طرح زمینه کاربر» انتخاب کنید
4. ذخیره کنید

تم های انتخاب شده توسط کاربر، طرح زمینه پیش فرض سایت را لغو می کند.

---

### س: آیا می توانم تم های مختلف برای سایت های مدیریت و کاربر داشته باشم؟

**A:** بله، در XOOPS Admin > تنظیمات تنظیم شده است:

1. **موضوع جلویی** - تم پیش فرض سایت
2. ** تم مدیریت ** - موضوع پنل کنترل مدیریت (معمولاً جداگانه)

به دنبال تنظیماتی مانند:
- `theme_set` - تم Frontend
- `admin_theme` - تم مدیریت

---

## سفارشی سازی تم

### س: چگونه یک تم موجود را سفارشی کنم؟

**A:** برای حفظ به‌روزرسانی‌ها، یک تم کودک ایجاد کنید:

```
themes/
├── original_theme/
│   ├── style.css
│   ├── templates/
│   └── images/
└── custom_theme/          {* Create copy for editing *}
    ├── style.css
    ├── templates/
    └── images/
```

سپس `theme.html` را در تم سفارشی خود ویرایش کنید.

---

### س: چگونه رنگ های تم را تغییر دهم؟

**A:** ویرایش فایل CSS موضوع:

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

برای تم های XOOPS:

```css
/* themes/mytheme/style.css */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
}

body {
    background-color: var(--primary-color);
    color: #333;
}

a {
    color: var(--secondary-color);
}

.button {
    background-color: var(--accent-color);
}
```

---

### س: چگونه CSS سفارشی را به یک موضوع اضافه کنم؟

**A:** چندین گزینه:

**گزینه 1: ویرایش theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**گزینه 2: ایجاد custom.css**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**گزینه 3: تنظیمات مدیریت (در صورت پشتیبانی)**
به XOOPS Admin > Settings > Theme Settings بروید و CSS سفارشی را اضافه کنید.

---

### س: چگونه می توانم قالب های HTML تم را تغییر دهم؟

**A:** فایل الگو را پیدا کنید:

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

ویرایش با دستور Smarty مناسب:

```html
<!-- themes/mytheme/templates/theme.html -->
{* XOOPS Theme Template *}
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>
        {include file="file:header.html"}
    </header>

    <main>
        <div class="container">
            <div class="row">
                <div class="col-md-9">
                    {$xoops_contents}
                </div>
                <aside class="col-md-3">
                    {include file="file:sidebar.html"}
                </aside>
            </div>
        </div>
    </main>

    <footer>
        {include file="file:footer.html"}
    </footer>
</body>
</html>
```

---

## ساختار تم

### س: چه فایل هایی در یک موضوع مورد نیاز است؟

**A:** حداقل ساختار:

```
themes/mytheme/
├── theme.html              {* Main template (required) *}
├── style.css              {* Stylesheet (optional but recommended) *}
├── screenshot.png         {* Preview image for admin (optional) *}
├── images/                {* Theme images *}
│   └── logo.png
└── templates/             {* Optional: Additional templates *}
    ├── header.html
    ├── footer.html
    └── sidebar.html
```

برای جزئیات بیشتر به ساختار تم مراجعه کنید.

---

### س: چگونه از ابتدا یک تم ایجاد کنم؟

**A:** ساختار را ایجاد کنید:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

`theme.html` را ایجاد کنید:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>{$xoops_headers}</header>
    <main>{$xoops_contents}</main>
    <footer>{$xoops_footers}</footer>
</body>
</html>
```

`style.css` را ایجاد کنید:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## متغیرهای تم

### س: چه متغیرهایی در قالب های تم موجود هستند؟

**A:** متغیرهای تم رایج XOOPS:

```smarty
{* Site Information *}
{$xoops_sitename}          {* Site name *}
{$xoops_url}               {* Site URL *}
{$xoops_theme}             {* Current theme name *}

{* Page Content *}
{$xoops_contents}          {* Main page content *}
{$xoops_pagetitle}         {* Page title *}
{$xoops_headers}           {* Meta tags, styles in head *}

{* Module Information *}
{$xoops_module_header}     {* Module-specific header *}
{$xoops_moduledesc}        {* Module description *}

{* User Information *}
{$xoops_isuser}            {* Is user logged in? *}
{$xoops_userid}            {* User ID *}
{$xoops_uname}             {* Username *}

{* Blocks *}
{$xoops_blocks}            {* All block content *}

{* Other *}
{$xoops_charset}           {* Document charset *}
{$xoops_version}           {* XOOPS version *}
```

---

### س: چگونه متغیرهای سفارشی را به موضوع خود اضافه کنم؟

**A:** در کد PHP قبل از رندر کردن:

```php
<?php
// In module or admin code
require_once XOOPS_ROOT_PATH . '/class/xoopstpl.php';
$xoopsTpl = new XoopsTpl();

// Add custom variables
$xoopsTpl->assign('my_variable', 'value');
$xoopsTpl->assign('data_array', ['key1' => 'val1', 'key2' => 'val2']);

// Use in theme template
$xoopsTpl->display('file:theme.html');
?>
```

در موضوع:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## یک ظاهر طراحی شده

### س: چگونه تم خود را پاسخگو کنم؟

**A:** از CSS Grid یا Flexbox استفاده کنید:

```css
/* themes/mytheme/style.css */

/* Mobile first approach */
body {
    font-size: 14px;
}

.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

main {
    order: 2;
}

aside {
    order: 3;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        grid-template-columns: 2fr 1fr;
    }
}

/* Desktop and up */
@media (min-width: 1200px) {
    .container {
        grid-template-columns: 3fr 1fr;
    }
}
```

یا از ادغام بوت استرپ استفاده کنید:
```html
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<div class="container">
    <div class="row">
        <div class="col-md-9">{$xoops_contents}</div>
        <div class="col-md-3">{* Sidebar *}</div>
    </div>
</div>
```

---

### س: چگونه یک حالت تاریک را به طرح زمینه خود اضافه کنم؟

**الف:**
```css
/* themes/mytheme/style.css */

/* Light mode (default) */
:root {
    --bg-color: #ffffff;
    --text-color: #000000;
    --border-color: #cccccc;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
        --border-color: #444444;
    }
}

/* Or with CSS class */
body.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #444444;
}
```

جابجایی با جاوا اسکریپت:
```html
<script>
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
</script>
```

---

## مسائل تم

### س: طرح زمینه خطاهای "متغیر الگوی شناسایی نشده" را نشان می دهد

**A:** متغیر به الگو منتقل نمی شود. بررسی کنید:

1. **متغیر در PHP اختصاص داده شده است**:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **الگو وجود دارد** در جایی که مشخص شده است
3. ** نحو الگو صحیح است**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

### س: تغییرات CSS در مرورگر ظاهر نمی شوند

**A:** پاک کردن کش مرورگر:

1. به‌روزرسانی سخت: `Ctrl+Shift+R` (Cmd+Shift+R در مک)
2. کش تم را روی سرور پاک کنید:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. مسیر فایل CSS را در موضوع بررسی کنید:
```bash
ls -la themes/mytheme/style.css
```

---

### س: تصاویر موجود در طرح زمینه بارگیری نمی شوند

**A:** مسیرهای تصویر را بررسی کنید:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### س: الگوهای تم گم شده یا باعث خطا می شوند

**A:** برای اشکال زدایی به خطاهای الگو مراجعه کنید.

---

## توزیع تم

### س: چگونه یک موضوع را برای توزیع بسته بندی کنم؟

**A:** ایجاد یک فایل فشرده قابل توزیع:

```bash
# Structure
mytheme/
├── theme.html           {* Required *}
├── style.css
├── screenshot.png       {* 300x225 recommended *}
├── README.txt
├── LICENSE
├── images/
│   ├── logo.png
│   └── favicon.ico
└── templates/           {* Optional *}
    ├── header.html
    └── footer.html

# Create zip
zip -r mytheme.zip mytheme/
```

---

### س: آیا می توانم تم XOOPS خود را بفروشم؟**A:** مجوز XOOPS را بررسی کنید:
- تم هایی که از XOOPS classes/templates استفاده می کنند باید مجوز XOOPS را رعایت کنند
- تم های خالص CSS/HTML محدودیت های کمتری دارند
- راهنمای XOOPS Contributing Guidelines را برای جزئیات بررسی کنید

---

## عملکرد تم

### س: چگونه عملکرد تم را بهینه کنم؟

**الف:**
1. **به حداقل رساندن CSS/JS** - حذف کد استفاده نشده
2. **بهینه سازی تصاویر** - استفاده از فرمت های مناسب (WebP، AVIF)
3. **از CDN** برای منابع استفاده کنید
4. **تصاویر بار تنبل**:
```html
<img src="image.jpg" loading="lazy">
```

5. **نسخه های Cache-bust**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

برای جزئیات بیشتر به سوالات متداول عملکرد مراجعه کنید.

---

## مستندات مرتبط

- خطاهای قالب
- ساختار تم
- سوالات متداول عملکرد
- اشکال زدایی هوشمندانه

---

#xoops #themes #FAQ #عیب‌یابی #سفارشی‌سازی