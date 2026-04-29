---
title: "Smarty 4 הגירה"
description: "מדריך לשדרוג תבניות XOOPS מ-Smarty 3 ל-Smarty 4"
---

מדריך זה מכסה את השינויים ושלבי ההעברה הדרושים בעת שדרוג מ-Smarty 3 ל-Smarty 4 ב-XOOPS. הבנת ההבדלים הללו חיונית לשמירה על תאימות עם התקנות XOOPS מודרניות.

## תיעוד קשור

- Smarty-Basics - היסודות של Smarty ב-XOOPS
- פיתוח נושא - יצירת ערכות נושא של XOOPS
- Template-Variables - משתנים זמינים בתבניות

## סקירה כללית של שינויים

Smarty 4 הציג מספר שינויים פורצים מ-Smarty 3:

1. התנהגות הקצאת משתנה השתנתה
2. תגיות `{php}` הוסרו לחלוטין
3. שמירה בcache API שינויים
4. טיפול בעדכונים של שינוי
5. שינויים במדיניות האבטחה
6. תכונות שהוצאו משימוש הוסרו

## שינויים בגישה משתנה

### הבעיה

ב-Smarty 2/3, היו נגישים ישירות לערכים שהוקצו:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

ב-Smarty 4, משתנים עטופים באובייקטים של `Smarty_Variable`:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### פתרון 1: גש למאפיין הערך

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### פתרון 2: מצב תאימות

אפשר מצב תאימות ב-PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

זה מאפשר גישה ישירה משתנה כמו Smarty 3.

### פתרון 3: בדיקת גרסה מותנית

כתוב תבניות שעובדות בשתי הגרסאות:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### פתרון 4: פונקציית עטיפה

צור פונקציית עוזר עבור מטלות:

```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - assign normally, access via ->value in templates
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - standard assignment
        $smarty->assign($name, $value);
    }
}
```

## הסרת תגיות {php}

### הבעיה

Smarty 3+ אינו תומך בתגיות `{php}` מסיבות אבטחה:

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### פתרון: השתמש במשתני Smarty

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### פתרון: העבר את הלוגיקה ל-PHP

ההיגיון המורכב צריך להיות ב-PHP, לא בתבניות:

```php
// In PHP - do the processing
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Assign processed data to template
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* In template - just display *}
<h2><{$category.name}></h2>
```

### פתרון: תוספים מותאמים אישית

לפונקציונליות ניתנת לשימוש חוזר, צור תוספים של Smarty:

```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* In template *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```

## שינויים בcache

### Smarty 3 cache

```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4 cache

```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### שמירה בcache

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

### Nocache בתבניות

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## שינויים בשינויים

### משנה מחרוזת

שמם של חלק מהשינויים שונו או הוצא משימוש:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

### משנה מערך

משנהי מערך דורשים קידומת `@`:

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### מתקנים מותאמים אישית

יש לרשום מתקנים מותאמים אישית:

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## שינויים במדיניות אבטחה

### Smarty 4 אבטחה

ל-Smarty 4 אבטחת ברירת מחדל מחמירה יותר:

```php
// Configure security policy
$smarty->enableSecurity('Smarty_Security');

// Or create custom policy
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```

### פונקציות מותרות

כברירת מחדל, Smarty 4 מגביל באילו פונקציות PHP ניתן להשתמש:

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

הגדר את הפונקציות המותרות במידת הצורך:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## עדכוני ירושה של תבנית

### תחביר חסימה

תחביר הבלוק נשאר דומה אך עם כמה שינויים:

```smarty
{* Parent template *}
<html>
<head>
    {block name=head}
    <title>Default Title</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```

```smarty
{* Child template *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Include parent block content *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```

### הוסף והכנה

```smarty
{block name=head append}
    {* This is added after parent content *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* This is added before parent content *}
    <script src="early.js"></script>
{/block}
```

## תכונות שהוצאו משימוש

### הוסר ב-Smarty 4

| תכונה | אלטרנטיבה |
|--------|----------------|
| תגיות `{php}` | העבר את ההיגיון ל-PHP או השתמש בתוספים |
| `{include_php}` | השתמש בתוספים רשומים |
| `$smarty.capture` | עדיין עובד אבל הוצא משימוש |
| `{strip}` עם רווחים | השתמש בכלי הקטנה |

### השתמש בחלופות

```smarty
{* Instead of {php} *}
{* Move to PHP and assign result *}

{* Instead of include_php *}
<{include file="db:mytemplate.tpl"}>

{* Instead of capture (still works but consider) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```

## רשימת הגירה

### לפני ההגירה

1. [ ] גבה את כל התבניות
2. [ ] רשום את כל השימוש בתג `{php}`
3. [ ] מסמך תוספים מותאמים אישית
4. [ ] בדוק את הפונקציונליות הנוכחית

### במהלך ההגירה

1. [ ] הסר את כל תגי `{php}`
2. [ ] עדכן תחביר גישה משתנה
3. [ ] בדוק את השימוש במשנה
4. [ ] עדכן את תצורת הcache
5. [ ] סקור את הגדרות האבטחה

### לאחר ההגירה

1. [ ] בדוק את כל התבניות
2. [ ] בדוק שכל הטפסים עובדים
3. [ ] ודא שהcache עובד
4. [ ] בדיקה עם תפקידי משתמש שונים

## בדיקת תאימות

### זיהוי גרסה

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

### בדיקת גרסת תבנית

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```

## כתיבת תבניות תואמות צולבות

### שיטות עבודה מומלצות

1. **הימנע לחלוטין מתגי `{php}`** - הם לא עובדים ב-Smarty 3+

2. **שמור על תבניות פשוטות** - היגיון מורכב שייך ל-PHP

3. **השתמש בשינויים סטנדרטיים** - הימנע משינויים שיצאו משימוש

4. **בדוק בשתי הגרסאות** - אם אתה צריך לתמוך בשתיהן

5. **השתמש בתוספים לפעולות מורכבות** - ניתנים לתחזוקה יותר

### דוגמה: תבנית תואמת צולבת

```smarty
{* Works in both Smarty 3 and 4 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'Default Title'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>No items found.</p>
    <{/if}>
</body>
</html>
```

## בעיות הגירה נפוצות

### בעיה: משתנים מחזירים ריקים

**בעיה**: `<{$mod_url}>` לא מחזיר כלום ב-Smarty 4

**פתרון**: השתמש ב-`<{$mod_url->value}>` או הפעל מצב תאימות

### בעיה: שגיאות תג PHP

**בעיה**: התבנית זורקת שגיאה בתגי `{php}`

**פתרון**: הסר את כל תגי PHP והעבר את ההיגיון לקבצי PHP

### בעיה: השינוי לא נמצא

**בעיה**: שינוי מותאם אישית משליך שגיאת "משנה לא ידוע".

**פתרון**: רשום את המשנה עם `registerPlugin()`

### בעיה: הגבלת אבטחה

**בעיה**: הפונקציה אינה מותרת בתבנית

**פתרון**: הוסף פונקציה לרשימה המותרת של מדיניות האבטחה

---

#חכם #הגירה #שדרוג #xoops #smarty4 #תאימות
