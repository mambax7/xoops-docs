---
title: "الأسئلة الشائعة حول القوالب"
description: "الأسئلة والإجابات الشائعة حول قوالب XOOPS"
dir: rtl
lang: ar
---

# الأسئلة الشائعة حول القوالب

> أسئلة وإجابات شائعة حول قوالب XOOPS والتخصيص والإدارة.

---

## تثبيت القالب وتفعيله

### س: كيف أثبّت قالباً جديداً في XOOPS؟

**ج:**
1. حمّل ملف القالب المضغوط
2. اذهب إلى XOOPS Admin > Appearance > Themes
3. انقر "Upload" واختر الملف المضغوط
4. يظهر القالب في قائمة القوالب
5. انقر لتفعيله على موقعك

بديل: استخرج يدوياً في دليل `/themes/` وأعد تحميل لوحة الإدارة.

---

### س: فشل تحميل القالب برسالة "Permission denied"

**ج:** صحّح أذونات دليل القالب:

```bash
# اجعل دليل القوالب قابلاً للكتابة
chmod 755 /path/to/xoops/themes

# صحّح التحميلات إذا كنت تحمّل
chmod 777 /path/to/xoops/uploads

# صحّح الملكية إذا لزم الأمر
chown -R www-data:www-data /path/to/xoops/themes
```

---

### س: كيف أعيّن قالباً مختلفاً لمستخدمين محددين؟

**ج:**
1. اذهب إلى User Manager > Edit User
2. اذهب إلى تبويب "Other"
3. اختر القالب المفضل في dropdown "User Theme"
4. احفظ

القوالب المختارة من المستخدم تحل محل قالب الموقع الافتراضي.

---

### س: هل يمكن أن يكون لدي قوالب مختلفة للإدارة والموقع العام؟

**ج:** نعم، عيّن في XOOPS Admin > Settings:

1. **قالب الواجهة الأمامية** - قالب الموقع الافتراضي
2. **قالب الإدارة** - قالب لوحة التحكم (عادة منفصل)

ابحث عن إعدادات مثل:
- `theme_set` - قالب الواجهة الأمامية
- `admin_theme` - قالب الإدارة

---

## تخصيص القالب

### س: كيف أخصص قالباً موجوداً؟

**ج:** أنشئ قالباً فرعياً للحفاظ على التحديثات:

```
themes/
├── original_theme/
│   ├── style.css
│   ├── templates/
│   └── images/
└── custom_theme/          {* أنشئ نسخة للتعديل *}
    ├── style.css
    ├── templates/
    └── images/
```

ثم عدّل `theme.html` في قالبك المخصص.

---

### س: كيف أغيّر ألوان القالب؟

**ج:** عدّل ملف CSS للقالب:

```bash
# حدّد موقع CSS للقالب
themes/mytheme/style.css

# أو قالب المشهد
themes/mytheme/theme.html
```

بالنسبة لقوالب XOOPS:

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

### س: كيف أضيف CSS مخصص إلى القالب؟

**ج:** عدة خيارات:

**الخيار 1: عدّل theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* CSS موجود *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**الخيار 2: أنشئ custom.css**
```bash
# أنشئ الملف
themes/mytheme/custom.css

# أضف أنماطك
body { background: #fff; }
```

**الخيار 3: إعدادات الإدارة (إذا كانت مدعومة)**
اذهب إلى XOOPS Admin > Settings > Theme Settings وأضف CSS مخصص.

---

### س: كيف أعدّل قوالس HTML للمشهد؟

**ج:** حدّد موقع ملف القالب:

```bash
# اعرض قوالس القالب
ls -la themes/mytheme/templates/

# القوالس الشائعة
themes/mytheme/templates/theme.html      {* التخطيط الرئيسي *}
themes/mytheme/templates/header.html     {* الرأس *}
themes/mytheme/templates/footer.html     {* التذييل *}
themes/mytheme/templates/sidebar.html    {* الشريط الجانبي *}
```

عدّل مع بناء جملة Smarty الصحيح:

```html
<!-- themes/mytheme/templates/theme.html -->
{* قالب مشهد XOOPS *}
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

## هيكل القالب

### س: ما الملفات المطلوبة في القالب؟

**ج:** الحد الأدنى للهيكل:

```
themes/mytheme/
├── theme.html              {* القالب الرئيسي (مطلوب) *}
├── style.css              {* أسلوب الورقة (اختياري لكن مُنصح به) *}
├── screenshot.png         {* صورة المعاينة للإدارة (اختياري) *}
├── images/                {* صور القالب *}
│   └── logo.png
└── templates/             {* اختياري: قوالس إضافية *}
    ├── header.html
    ├── footer.html
    └── sidebar.html
```

انظر Theme Structure للتفاصيل.

---

### س: كيف أنشئ قالباً من الصفر؟

**ج:** أنشئ الهيكل:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

أنشئ `theme.html`:
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

أنشئ `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## متغيرات القالب

### س: ما المتغيرات المتاحة في قوالس المشهد؟

**ج:** متغيرات قالب XOOPS الشائعة:

```smarty
{* معلومات الموقع *}
{$xoops_sitename}          {* اسم الموقع *}
{$xoops_url}               {* رابط الموقع *}
{$xoops_theme}             {* اسم القالب الحالي *}

{* محتوى الصفحة *}
{$xoops_contents}          {* محتوى الصفحة الرئيسي *}
{$xoops_pagetitle}         {* عنوان الصفحة *}
{$xoops_headers}           {* الوسوم الوصفية والأنماط في الرأس *}

{* معلومات الوحدة *}
{$xoops_module_header}     {* رأس خاص بالوحدة *}
{$xoops_moduledesc}        {* وصف الوحدة *}

{* معلومات المستخدم *}
{$xoops_isuser}            {* هل المستخدم مسجل دخول؟ *}
{$xoops_userid}            {* معرف المستخدم *}
{$xoops_uname}             {* اسم المستخدم *}

{* الكتل *}
{$xoops_blocks}            {* كل محتوى الكتلة *}

{* أخرى *}
{$xoops_charset}           {* ترميز المستند *}
{$xoops_version}           {* إصدار XOOPS *}
```

---

### س: كيف أضيف متغيرات مخصصة إلى قالبي؟

**ج:** في كود PHP الخاص بك قبل العرض:

```php
<?php
// في الوحدة أو كود الإدارة
require_once XOOPS_ROOT_PATH . '/class/xoopstpl.php';
$xoopsTpl = new XoopsTpl();

// أضف متغيرات مخصصة
$xoopsTpl->assign('my_variable', 'value');
$xoopsTpl->assign('data_array', ['key1' => 'val1', 'key2' => 'val2']);

// استخدم في قالب المشهد
$xoopsTpl->display('file:theme.html');
?>
```

في القالب:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## تنسيق القالب

### س: كيف أجعل قالبي متجاوباً؟

**ج:** استخدم CSS Grid أو Flexbox:

```css
/* themes/mytheme/style.css */

/* نهج Mobile أولاً */
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

/* الجهاز اللوحي وما فوق */
@media (min-width: 768px) {
    .container {
        grid-template-columns: 2fr 1fr;
    }
}

/* سطح المكتب وما فوق */
@media (min-width: 1200px) {
    .container {
        grid-template-columns: 3fr 1fr;
    }
}
```

أو استخدم تكامل Bootstrap:
```html
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<div class="container">
    <div class="row">
        <div class="col-md-9">{$xoops_contents}</div>
        <div class="col-md-3">{* الشريط الجانبي *}</div>
    </div>
</div>
```

---

### س: كيف أضيف وضع مظلم إلى قالبي؟

**ج:**
```css
/* themes/mytheme/style.css */

/* الوضع الفاتح (الافتراضي) */
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

/* الوضع المظلم */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
        --border-color: #444444;
    }
}

/* أو مع فئة CSS */
body.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #444444;
}
```

بدّل مع JavaScript:
```html
<script>
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// حمّل التفضيل
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
</script>
```

---

## مشاكل القالب

### س: يظهر القالب أخطاء "unrecognized template variable"

**ج:** المتغير غير مُمرر إلى القالب. تحقق من:

1. **تم تعيين المتغير** في PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **القالب موجود** حيث تم تحديده
3. **بناء جملة القالب صحيح**:
```smarty
{* صحيح *}
{$variable_name}

{* خطأ *}
$variable_name
{variable_name}
```

---

### س: التغييرات في CSS لا تظهر في المتصفح

**ج:** امسح ذاكرة تخزين المتصفح المؤقتة:

1. إعادة تحميل قوية: `Ctrl+Shift+R` (Cmd+Shift+R على Mac)
2. امسح ذاكرة التخزين المؤقت للقالب على الخادم:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. تحقق من مسار ملف CSS في القالب:
```bash
ls -la themes/mytheme/style.css
```

---

### س: الصور في القالب لا تُحمّل

**ج:** تحقق من مسارات الصور:

```html
{* خطأ - مسار نسبي من جذر الويب *}
<img src="themes/mytheme/images/logo.png">

{* صحيح - استخدم xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* أو في CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### س: قوالس القالب مفقودة أو تسبب أخطاء

**ج:** انظر Template Errors لتصحيح الأخطاء.

---

## توزيع القالب

### س: كيف أحزّم قالباً للتوزيع؟

**ج:** أنشئ zip قابلة للتوزيع:

```bash
# الهيكل
mytheme/
├── theme.html           {* مطلوب *}
├── style.css
├── screenshot.png       {* 300x225 مُنصح به *}
├── README.txt
├── LICENSE
├── images/
│   ├── logo.png
│   └── favicon.ico
└── templates/           {* اختياري *}
    ├── header.html
    └── footer.html

# أنشئ zip
zip -r mytheme.zip mytheme/
```

---

### س: هل يمكنني بيع قالب XOOPS الخاص بي؟

**ج:** تحقق من ترخيص XOOPS:
- القوالس التي تستخدم فئات/قوالس XOOPS يجب أن تحترم ترخيص XOOPS
- قوالس CSS/HTML النقية لها قيود أقل
- تحقق من XOOPS Contributing Guidelines للتفاصيل

---

## أداء القالب

### س: كيف أحسّن أداء القالب؟

**ج:**
1. **قلّل CSS/JS** - أزل الكود غير المستخدم
2. **حسّن الصور** - استخدم التنسيقات الصحيحة (WebP، AVIF)
3. **استخدم CDN** للموارد
4. **حمّل الصور بشكل كسول**:
```html
<img src="image.jpg" loading="lazy">
```

5. **إصدارات cache-bust**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

انظر Performance FAQ لمزيد من التفاصيل.

---

## الوثائق ذات الصلة

- Template Errors
- Theme Structure
- Performance FAQ
- Smarty Debugging

---

#xoops #themes #faq #troubleshooting #customization
