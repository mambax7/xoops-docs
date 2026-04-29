---
title: "थीम अक्सर पूछे जाने वाले प्रश्न"
description: "XOOPS थीम के बारे में अक्सर पूछे जाने वाले प्रश्न"
---
# थीम अक्सर पूछे जाने वाले प्रश्न

> XOOPS थीम, अनुकूलन और प्रबंधन के बारे में सामान्य प्रश्न और उत्तर।

---

## थीम इंस्टालेशन एवं सक्रियण

### प्रश्न: मैं XOOPS में एक नई थीम कैसे स्थापित करूं?

**ए:**
1. थीम ज़िप फ़ाइल डाउनलोड करें
2. XOOPS एडमिन > उपस्थिति > थीम्स पर जाएं
3. "अपलोड" पर क्लिक करें और ज़िप फ़ाइल चुनें
4. थीम थीम सूची में दिखाई देती है
5. इसे अपनी साइट के लिए सक्रिय करने के लिए क्लिक करें

वैकल्पिक: `/themes/` निर्देशिका में मैन्युअल रूप से निकालें और व्यवस्थापक पैनल को ताज़ा करें।

---

### प्रश्न: "अनुमति अस्वीकृत" के साथ थीम अपलोड विफल हो गया

**ए:** थीम निर्देशिका अनुमतियाँ ठीक करें:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### प्रश्न: मैं विशिष्ट उपयोगकर्ताओं के लिए एक अलग थीम कैसे सेट करूं?

**ए:**
1. उपयोगकर्ता प्रबंधक > उपयोगकर्ता संपादित करें पर जाएँ
2. "अन्य" टैब पर जाएं
3. "उपयोगकर्ता थीम" ड्रॉपडाउन में पसंदीदा थीम चुनें
4. सहेजें

उपयोगकर्ता द्वारा चयनित थीम डिफ़ॉल्ट साइट थीम को ओवरराइड करती हैं।

---

### प्रश्न: क्या मेरे पास व्यवस्थापक और उपयोगकर्ता साइटों के लिए अलग-अलग थीम हो सकती हैं?

**ए:** हां, XOOPS एडमिन > सेटिंग्स में सेट करें:

1. **फ्रंटेंड थीम** - डिफ़ॉल्ट साइट थीम
2. **एडमिन थीम** - एडमिन कंट्रोल पैनल थीम (आमतौर पर अलग)

ऐसी सेटिंग खोजें:
- `theme_set` - फ्रंटएंड थीम
- `admin_theme` - एडमिन थीम

---

## थीम अनुकूलन

### प्रश्न: मैं किसी मौजूदा थीम को कैसे अनुकूलित करूं?

**ए:** अपडेट को संरक्षित करने के लिए एक चाइल्ड थीम बनाएं:

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

फिर अपनी कस्टम थीम में `theme.html` संपादित करें।

---

### प्रश्न: मैं थीम का रंग कैसे बदलूं?

**ए:** थीम की CSS फ़ाइल संपादित करें:

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

XOOPS थीम के लिए:

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

### प्रश्न: मैं किसी थीम में कस्टम CSS कैसे जोड़ूं?

**ए:** कई विकल्प:

**विकल्प 1: थीम संपादित करें.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**विकल्प 2: कस्टम.CSS बनाएं**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**विकल्प 3: व्यवस्थापक सेटिंग्स (यदि समर्थित हो)**
XOOPS एडमिन > सेटिंग्स > थीम सेटिंग्स पर जाएं और कस्टम CSS जोड़ें।

---

### प्रश्न: मैं थीम HTML टेम्प्लेट को कैसे संशोधित करूं?

**ए:** टेम्पलेट फ़ाइल का पता लगाएं:

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

उचित Smarty सिंटैक्स के साथ संपादित करें:

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

## थीम संरचना

### प्रश्न: किसी थीम में किन फ़ाइलों की आवश्यकता होती है?

**ए:** न्यूनतम संरचना:

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

विवरण के लिए थीम संरचना देखें।

---

### प्रश्न: मैं स्क्रैच से थीम कैसे बनाऊं?

**ए:** संरचना बनाएं:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

`theme.html` बनाएं:
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

`style.css` बनाएं:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## थीम वेरिएबल

### प्रश्न: थीम टेम्प्लेट में कौन से वेरिएबल उपलब्ध हैं?

**ए:** सामान्य XOOPS थीम चर:

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

### प्रश्न: मैं अपनी थीम में कस्टम वेरिएबल कैसे जोड़ूं?

**ए:** रेंडर करने से पहले अपने PHP कोड में:

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

थीम में:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## थीम स्टाइलिंग

### प्रश्न: मैं अपनी थीम को प्रतिक्रियाशील कैसे बनाऊं?

**ए:** CSS ग्रिड या फ्लेक्सबॉक्स का उपयोग करें:

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

या बूटस्ट्रैप एकीकरण का उपयोग करें:
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

### प्रश्न: मैं अपनी थीम में डार्क मोड कैसे जोड़ूं?

**ए:**
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

JavaScript के साथ टॉगल करें:
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

## थीम मुद्दे

### प्रश्न: थीम "अपरिचित टेम्पलेट वैरिएबल" त्रुटियां दिखाती है

**ए:** वेरिएबल को टेम्पलेट में पास नहीं किया जा रहा है। जांचें:

1. PHP में **वेरिएबल असाइन किया गया है**:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **टेम्पलेट मौजूद है** जहां निर्दिष्ट है
3. **टेम्पलेट सिंटैक्स सही है**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

### प्रश्न: CSS परिवर्तन ब्राउज़र में दिखाई नहीं देते हैं

**ए:** ब्राउज़र कैश साफ़ करें:

1. हार्ड रिफ्रेश: `Ctrl+Shift+R` (मैक पर Cmd+Shift+R)
2. सर्वर पर थीम कैश साफ़ करें:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. थीम में CSS फ़ाइल पथ की जाँच करें:
```bash
ls -la themes/mytheme/style.css
```

---

### प्रश्न: थीम में छवियाँ लोड नहीं होतीं

**ए:** छवि पथ जांचें:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### प्रश्न: थीम टेम्प्लेट गायब हैं या त्रुटियों का कारण बन रहे हैं

**ए:** डिबगिंग के लिए टेम्पलेट त्रुटियाँ देखें।

---

## थीम वितरण

### प्रश्न: मैं वितरण के लिए किसी थीम को कैसे पैकेज करूं?**ए:** एक वितरण योग्य ज़िप बनाएं:

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

### प्रश्न: क्या मैं अपनी XOOPS थीम बेच सकता हूँ?

**ए:** XOOPS लाइसेंस जांचें:
- XOOPS कक्षाओं/टेम्प्लेट का उपयोग करने वाले थीम को XOOPS लाइसेंस का सम्मान करना चाहिए
- शुद्ध CSS/HTML थीम पर कम प्रतिबंध हैं
- विवरण के लिए XOOPS योगदान दिशानिर्देश देखें

---

## थीम प्रदर्शन

### प्रश्न: मैं थीम प्रदर्शन को कैसे अनुकूलित करूं?

**ए:**
1. **CSS/जेएस को छोटा करें** - अप्रयुक्त कोड हटाएं
2. **छवियों को अनुकूलित करें** - उचित प्रारूप का उपयोग करें (WebP, AVIF)
3. संसाधनों के लिए **सीडीएन** का उपयोग करें
4. **आलसी भार** छवियाँ:
```html
<img src="image.jpg" loading="lazy">
```

5. **कैश-बस्ट संस्करण**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

अधिक विवरण के लिए प्रदर्शन FAQ देखें.

---

## संबंधित दस्तावेज़ीकरण

- टेम्पलेट त्रुटियाँ
- थीम संरचना
- प्रदर्शन अक्सर पूछे जाने वाले प्रश्न
- Smarty डिबगिंग

---

#xoops #थीम #faq #समस्या निवारण #अनुकूलन