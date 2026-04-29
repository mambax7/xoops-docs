---
title: "اسمارتی 4 مهاجرت"
description: "راهنمای ارتقاء قالب های XOOPS از Smarty 3 به Smarty 4"
---
این راهنما تغییرات و مراحل مهاجرت مورد نیاز هنگام ارتقاء از Smarty 3 به Smarty 4 در XOOPS را پوشش می‌دهد. درک این تفاوت ها برای حفظ سازگاری با تاسیسات مدرن XOOPS ضروری است.

## مستندات مرتبط

- Smarty-Basics - مبانی Smarty در XOOPS
- توسعه تم - ایجاد تم های XOOPS
- Template-Variables - متغیرهای موجود در قالب ها

## مروری بر تغییرات

Smarty 4 چندین تغییر اساسی را از Smarty 3 ارائه کرد:

1. رفتار انتساب متغیر تغییر کرد
2. تگ های `{php}` به طور کامل حذف شدند
3. ذخیره تغییرات API
4. به روز رسانی های مدیریت اصلاح کننده
5. تغییر سیاست امنیتی
6. ویژگی های منسوخ حذف شده است

## تغییرات دسترسی متغیر

### مشکل

در Smarty 2/3، مقادیر اختصاص داده شده مستقیماً قابل دسترسی بودند:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

در Smarty 4، متغیرها در اشیاء `Smarty_Variable` پیچیده می شوند:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### راه حل 1: به ویژگی Value دسترسی داشته باشید

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### راه حل 2: حالت سازگاری

فعال کردن حالت سازگاری در PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

این امکان دسترسی متغیر مستقیم مانند Smarty 3 را فراهم می کند.

### راه حل 3: بررسی نسخه شرطی

الگوهایی را بنویسید که در هر دو نسخه کار می کنند:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### راه حل 4: تابع Wrapper

یک تابع کمکی برای تکالیف ایجاد کنید:

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

## حذف برچسب های {php}

### مشکل

Smarty 3+ به دلایل امنیتی از برچسب های `{php}` پشتیبانی نمی کند:

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### راه حل: از متغیرهای هوشمند استفاده کنید

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### راه حل: Logic را به PHP منتقل کنید

منطق پیچیده باید در PHP باشد، نه قالب:

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

### راه حل: پلاگین های سفارشی

برای عملکرد قابل استفاده مجدد، افزونه های Smarty ایجاد کنید:

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

## تغییرات در حافظه پنهان

### Smarty 3 Caching

```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4 Caching

```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### ثابت های ذخیره

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

### Nocache در قالب ها

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## تغییرات اصلاح کننده

### اصلاح‌کننده‌های رشته

برخی از اصلاح کننده ها تغییر نام داده یا منسوخ شدند:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

### اصلاح کننده های آرایه

اصلاح کننده های آرایه به پیشوند `@` نیاز دارند:

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### اصلاح کننده های سفارشی

اصلاح کننده های سفارشی باید ثبت شوند:

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## تغییرات سیاست امنیتی

### Smarty 4 Security

Smarty 4 دارای امنیت پیش فرض سخت گیرانه تری است:

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

### توابع مجاز

به طور پیش‌فرض، Smarty 4 عملکردهای PHP را محدود می‌کند:

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

در صورت نیاز توابع مجاز را پیکربندی کنید:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## به‌روزرسانی‌های وراثت الگو

### Block Syntax

نحو بلاک مشابه است اما با برخی تغییرات:

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

### Append و Prepend

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

## ویژگی های منسوخ شده

### در اسمارتی 4 حذف شد

| ویژگی | جایگزین |
|---------|-------------|
| برچسب های `{php}` | منطق را به PHP منتقل کنید یا از افزونه ها استفاده کنید |
| `{include_php}` | استفاده از افزونه های ثبت شده |
| `$smarty.capture` | هنوز کار می کند اما منسوخ شده |
| `{strip}` با فاصله | استفاده از ابزارهای کوچک سازی |

### از گزینه های جایگزین استفاده کنید

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

## چک لیست مهاجرت

### قبل از مهاجرت

1. [ ] از همه قالب ها پشتیبان تهیه کنید
2. [ ] لیست استفاده از برچسب `{php}`
3. [ ] افزونه های سفارشی را مستند کنید
4. [ ] عملکرد فعلی را آزمایش کنید

### در طول مهاجرت

1. [ ] تمام برچسب های `{php}` را حذف کنید
2. [ ] نحو دسترسی متغیر را به روز کنید
3. [ ] استفاده از اصلاح کننده را بررسی کنید
4. [ ] پیکربندی کش را به روز کنید
5. [ ] تنظیمات امنیتی را مرور کنید

### پس از مهاجرت

1. [ ] همه قالب ها را تست کنید
2. [ ] کار همه فرم ها را بررسی کنید
3. [ ] بررسی آثار ذخیره سازی
4. [ ] تست با نقش های مختلف کاربر

## تست برای سازگاری

### تشخیص نسخه

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

### نسخه الگو را بررسی کنید

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```

## نوشتن الگوهای متقابل سازگار

### بهترین شیوه ها

1. **از تگ های `{php}` به طور کامل اجتناب کنید** - آنها در Smarty 3+ کار نمی کنند2. **قالب ها را ساده نگه دارید** - منطق پیچیده متعلق به PHP است

3. **از اصلاح کننده های استاندارد** استفاده کنید - از اصلاح کننده های منسوخ خودداری کنید

4. ** تست در هر دو نسخه ** - اگر شما نیاز به پشتیبانی از هر دو

5. **از پلاگین ها برای عملیات پیچیده استفاده کنید** - قابلیت نگهداری بیشتر

### مثال: الگوی متقابل سازگار

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

## مسائل رایج مهاجرت

### مسئله: متغیرها خالی می‌شوند

**مشکل**: `<{$mod_url}>` هیچ چیز را در Smarty 4 برنمی‌گرداند

**راه حل**: از `<{$mod_url->value}>` استفاده کنید یا حالت سازگاری را فعال کنید

### مسئله: خطاهای تگ PHP

**مشکل**: الگو روی تگ های `{php}` خطا ایجاد می کند

**راه حل**: تمام تگ های PHP را حذف کرده و منطق را به فایل های PHP منتقل کنید

### مسئله: Modifier یافت نشد

**مشکل**: اصلاح کننده سفارشی خطای "اصلاح کننده ناشناخته" را ایجاد می کند

**راه حل**: اصلاح کننده را با `registerPlugin()` ثبت کنید

### مسئله: محدودیت امنیتی

**مشکل**: عملکرد در قالب مجاز نیست

**راه حل**: اضافه کردن تابع به لیست مجاز خط مشی امنیتی

---

#هوشمند #مهاجرت #ارتقا #xoops #smarty4 #سازگاری