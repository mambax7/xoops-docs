---
title: "Smarty 4 प्रवासन"
description: "XOOPS टेम्प्लेट को Smarty 3 से Smarty 4 में अपग्रेड करने के लिए गाइड"
---
यह मार्गदर्शिका XOOPS में Smarty 3 से Smarty 4 में अपग्रेड करते समय आवश्यक परिवर्तनों और माइग्रेशन चरणों को शामिल करती है। आधुनिक XOOPS इंस्टॉलेशन के साथ अनुकूलता बनाए रखने के लिए इन अंतरों को समझना आवश्यक है।

## संबंधित दस्तावेज़ीकरण

- Smarty- मूल बातें - XOOPS में Smarty के मूल सिद्धांत
- थीम-विकास - XOOPS थीम बनाना
- टेम्प्लेट-वेरिएबल्स - टेम्प्लेट में उपलब्ध वेरिएबल्स

## परिवर्तनों का अवलोकन

Smarty 4 ने Smarty 3 से कई महत्वपूर्ण बदलाव पेश किए:

1. परिवर्तनीय असाइनमेंट व्यवहार बदल गया
2. `{php}` टैग पूरी तरह से हटा दिए गए
3. कैशिंग API परिवर्तन
4. संशोधक हैंडलिंग अद्यतन
5. सुरक्षा नीति में बदलाव
6. अप्रचलित सुविधाएँ हटा दी गईं

## परिवर्तनीय पहुंच परिवर्तन

### समस्या

Smarty 2/3 में, निर्दिष्ट मान सीधे पहुंच योग्य थे:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

Smarty 4 में, वेरिएबल्स को `Smarty_Variable` ऑब्जेक्ट में लपेटा जाता है:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### समाधान 1: मूल्य संपत्ति तक पहुंचें

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### समाधान 2: संगतता मोड

PHP में संगतता मोड सक्षम करें:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

यह Smarty 3 जैसे सीधे वैरिएबल एक्सेस की अनुमति देता है।

### समाधान 3: सशर्त संस्करण जाँच

ऐसे टेम्प्लेट लिखें जो दोनों संस्करणों में काम करते हों:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### समाधान 4: रैपर फ़ंक्शन

असाइनमेंट के लिए एक सहायक फ़ंक्शन बनाएं:

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

## {php} टैग हटाना

### समस्या

Smarty 3+ सुरक्षा कारणों से `{php}` टैग का समर्थन नहीं करता:

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### समाधान: Smarty वेरिएबल का उपयोग करें

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### समाधान: तर्क को PHP में ले जाएँ

जटिल तर्क PHP में होना चाहिए, टेम्पलेट नहीं:

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

### समाधान: कस्टम प्लगइन्स

पुन: प्रयोज्य कार्यक्षमता के लिए, Smarty प्लगइन बनाएं:

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

## कैशिंग परिवर्तन

### Smarty 3 कैशिंग

```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4 कैशिंग

```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### कैशिंग स्थिरांक

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

### टेम्प्लेट में नोकैचे

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## संशोधक परिवर्तन

### स्ट्रिंग संशोधक

कुछ संशोधकों का नाम बदल दिया गया या हटा दिया गया:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

### सारणी संशोधक

सरणी संशोधक को `@` उपसर्ग की आवश्यकता होती है:

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### कस्टम संशोधक

कस्टम संशोधक पंजीकृत होना चाहिए:

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## सुरक्षा नीति में बदलाव

### Smarty 4 सुरक्षा

Smarty 4 में कड़ी डिफ़ॉल्ट सुरक्षा है:

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

### अनुमत कार्य

डिफ़ॉल्ट रूप से, Smarty 4 प्रतिबंधित करता है कि कौन से PHP फ़ंक्शंस का उपयोग किया जा सकता है:

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

यदि आवश्यक हो तो अनुमत कार्यों को कॉन्फ़िगर करें:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## टेम्पलेट इनहेरिटेंस अपडेट

### सिंटेक्स को ब्लॉक करें

ब्लॉक सिंटैक्स समान रहता है लेकिन कुछ बदलावों के साथ:

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

### जोड़ें और जोड़ें

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

## बहिष्कृत सुविधाएँ

### Smarty 4 में हटाया गया

| फ़ीचर | वैकल्पिक |
|---------|-----------------|
| `{php}` टैग | तर्क को PHP में ले जाएँ या प्लगइन्स का उपयोग करें |
| `{include_php}` | पंजीकृत प्लगइन्स का उपयोग करें |
| `$smarty.capture` | अभी भी काम करता है लेकिन बहिष्कृत |
| `{strip}` रिक्त स्थान के साथ | लघुकरण उपकरण का उपयोग करें |

### विकल्पों का उपयोग करें

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

## माइग्रेशन चेकलिस्ट

### प्रवास से पहले

1. [ ] सभी टेम्प्लेट का बैकअप लें
2. [ ] सभी @@00042@@ टैग उपयोग की सूची बनाएं
3. [ ] दस्तावेज़ कस्टम प्लगइन्स
4. [ ] वर्तमान कार्यक्षमता का परीक्षण करें

### प्रवास के दौरान

1. [ ] सभी `{php}` टैग हटा दें
2. [ ] वेरिएबल एक्सेस सिंटैक्स अपडेट करें
3. [ ] संशोधक उपयोग की जाँच करें
4. [ ] कैशिंग कॉन्फ़िगरेशन अपडेट करें
5. [ ] सुरक्षा सेटिंग्स की समीक्षा करें

### प्रवास के बाद

1. [ ] सभी टेम्प्लेट का परीक्षण करें
2. [ ] सभी प्रपत्रों के कार्य की जाँच करें
3. [ ] कैशिंग कार्यों को सत्यापित करें
4. [ ] विभिन्न उपयोगकर्ता भूमिकाओं के साथ परीक्षण करें

## अनुकूलता के लिए परीक्षण

### संस्करण का पता लगाना

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

### टेम्प्लेट संस्करण जांचें

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```## क्रॉस-संगत टेम्पलेट लिखना

### सर्वोत्तम प्रथाएँ

1. **`{php}` टैग से पूरी तरह बचें** - वे Smarty 3+ में काम नहीं करते हैं

2. **टेम्प्लेट को सरल रखें** - जटिल तर्क PHP में आता है

3. **मानक संशोधक का उपयोग करें** - अप्रचलित संशोधकों से बचें

4. **दोनों संस्करणों में परीक्षण करें** - यदि आपको दोनों का समर्थन करने की आवश्यकता है

5. **जटिल परिचालनों के लिए प्लगइन्स का उपयोग करें** - अधिक रखरखाव योग्य

### उदाहरण: क्रॉस-संगत टेम्पलेट

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

## सामान्य प्रवासन मुद्दे

### समस्या: वेरिएबल्स खाली लौटते हैं

**समस्या**: `<{$mod_url}>` Smarty 4 में कुछ भी नहीं लौटाता

**समाधान**: `<{$mod_url->value}>` का उपयोग करें या संगतता मोड सक्षम करें

### समस्या: PHP टैग त्रुटियाँ

**समस्या**: टेम्प्लेट `{php}` टैग पर त्रुटि उत्पन्न करता है

**समाधान**: सभी PHP टैग हटाएं और तर्क को PHP फ़ाइलों में ले जाएं

### समस्या: संशोधक नहीं मिला

**समस्या**: कस्टम संशोधक "अज्ञात संशोधक" त्रुटि उत्पन्न करता है

**समाधान**: संशोधक को `registerPlugin()` के साथ पंजीकृत करें

### मुद्दा: सुरक्षा प्रतिबंध

**समस्या**: टेम्पलेट में फ़ंक्शन की अनुमति नहीं है

**समाधान**: सुरक्षा नीति की अनुमत सूची में फ़ंक्शन जोड़ें

---

#Smarty #माइग्रेशन #अपग्रेड #xoops #smarty4 #संगतता