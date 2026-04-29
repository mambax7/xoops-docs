---
title: "נושא FAQ"
description: "שאלות נפוצות על XOOPS ערכות נושא"
---

# שאלות נפוצות בנושא נושא

> שאלות ותשובות נפוצות על XOOPS ערכות נושא, התאמה אישית וניהול.

---

## התקנה והפעלה של ערכות נושא

### ש: כיצד אוכל להתקין ערכת נושא חדשה ב-XOOPS?

**ת:**
1. הורד את קובץ ה-zip של ערכת הנושא
2. עבור אל XOOPS Admin > מראה > ערכות נושא
3. לחץ על "העלה" ובחר את קובץ ה-zip
4. הנושא מופיע ברשימת הנושאים
5. לחץ כדי להפעיל אותו עבור האתר שלך

חלופה: חלץ ידנית לספריית `/themes/` ורענן את לוח הניהול.

---

### ש: העלאת ערכת הנושא נכשלה עם "הרשאה נדחתה"

**ת:** תקן הרשאות ספריית נושא:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### ש: כיצד אוכל להגדיר ערכת נושא שונה עבור משתמשים ספציפיים?

**ת:**
1. עבור אל מנהל משתמשים > ערוך משתמש
2. עבור ללשונית "אחר".
3. בחר ערכת נושא מועדפת בתפריט הנפתח "נושא משתמש".
4. שמור

ערכות נושא שנבחרו על ידי המשתמש גורמות לעיצוב ברירת המחדל של האתר.

---

### ש: האם אני יכול לקבל ערכות נושא שונות לאתרי ניהול ומשתמשים?

**ת:** כן, הגדר ב-XOOPS Admin > הגדרות:

1. **עיצוב חזית** - ערכת נושא המוגדרת כברירת מחדל של האתר
2. **ערכת ניהול** - עיצוב לוח הבקרה של ניהול (בדרך כלל נפרד)

חפש הגדרות כמו:
- `theme_set` - נושא חזיתי
- `admin_theme` - ערכת נושא לניהול

---

## התאמה אישית של נושא

### ש: כיצד אוכל להתאים אישית ערכת נושא קיימת?

**ת:** צור ערכת נושא לילד כדי לשמר עדכונים:

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

לאחר מכן ערוך את `theme.html` בערכת הנושא המותאמת אישית שלך.

---

### ש: כיצד אוכל לשנות את צבעי הנושא?

**ת:** ערוך את קובץ ה-CSS של ערכת הנושא:

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

עבור ערכות נושא XOOPS:

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

### ש: כיצד אוכל להוסיף CSS מותאם אישית לערכת נושא?

**ת:** מספר אפשרויות:

**אפשרות 1: ערוך theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**אפשרות 2: צור custom.css**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**אפשרות 3: הגדרות אדמין (אם נתמכות)**
עבור אל XOOPS Admin > הגדרות > הגדרות ערכת נושא והוסף CSS מותאם אישית.

---

### ש: כיצד אוכל לשנות תבניות HTML ערכת נושא?

**ת:** אתר את קובץ התבנית:

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

ערוך עם תחביר Smarty מתאים:

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

## מבנה נושא

### ש: אילו קבצים נדרשים בעיצוב?

**ת:** מבנה מינימום:

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

ראה מבנה נושא לפרטים.

---

### ש: איך אני יוצר ערכת נושא מאפס?

**ת:** צור את המבנה:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

צור `theme.html`:
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

צור `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## משתני נושא

### ש: אילו משתנים זמינים בתבניות ערכת נושא?

**ת:** משתני נושא נפוצים של XOOPS:

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

### ש: כיצד אוכל להוסיף משתנים מותאמים אישית לערכת הנושא שלי?

**ת:** בקוד PHP לפני העיבוד:

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

בנושא:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## עיצוב נושא

### ש: כיצד אוכל להפוך את הנושא שלי למגיב?

**ת:** השתמש ב-CSS Grid או Flexbox:

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

או השתמש באינטגרציה של Bootstrap:
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

### ש: כיצד אוכל להוסיף מצב כהה לערכת הנושא שלי?

**א:**
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

החלף עם JavaScript:
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

## בעיות נושא

### ש: ערכת הנושא מציגה שגיאות "משתנה תבנית לא מזוהה".

**ת:** המשתנה לא מועבר לתבנית. בדוק:

1. **המשתנה מוקצה** ב-PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **קיימת תבנית** היכן שצוין
3. **תחביר התבנית נכון**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

### ש: CSS שינויים לא מופיעים בדפדפן

**ת:** נקה את הcache של הדפדפן:

1. רענון קשה: `Ctrl+Shift+R` (Cmd+Shift+R ב-Mac)
2. נקה cache ערכת נושא בשרת:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. בדוק את נתיב הקובץ CSS בעיצוב:
```bash
ls -la themes/mytheme/style.css
```

---

### ש: תמונות בעיצוב לא נטענות

**ת:** בדוק נתיבי תמונה:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### ש: תבניות ערכת נושא חסרות או גורמות לשגיאות

**ת:** ראה שגיאות תבנית לניפוי באגים.

---

## הפצת נושאים

### ש: כיצד אוכל לארוז ערכת נושא להפצה?

**ת:** צור מיקוד שניתן להפצה:

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

### ש: האם אוכל למכור את ערכת הנושא XOOPS שלי?

**ת:** בדוק את רישיון XOOPS:
- ערכות נושא המשתמשות ב-XOOPS classes/templates חייבים לכבד את רישיון XOOPS
- לנושאים טהורים CSS/HTML יש פחות הגבלות
- עיין בהנחיות התורמות של XOOPS לפרטים

---

## ביצועי נושא

### ש: כיצד אוכל לייעל את ביצועי ערכת הנושא?

**ת:**
1. **מזעור CSS/JS** - הסר קוד שאינו בשימוש
2. **בצע אופטימיזציה של תמונות** - השתמש בפורמטים מתאימים (WebP, AVIF)
3. **השתמש ב-CDN** למשאבים
4. תמונות **טעינה בעצלתיים**:
```html
<img src="image.jpg" loading="lazy">
```

5. **גרסאות ביטול cache**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

ראה ביצועים FAQ לפרטים נוספים.

---

## תיעוד קשור

- שגיאות תבנית
- מבנה נושא
- ביצועים FAQ
- Smarty ניפוי באגים

---

#xoops #נושאים #שאלות נפוצות #פתרון בעיות #התאמה אישית
