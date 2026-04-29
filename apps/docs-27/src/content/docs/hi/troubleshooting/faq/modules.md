---
title: "मॉड्यूल अक्सर पूछे जाने वाले प्रश्न"
description: "XOOPS मॉड्यूल के बारे में अक्सर पूछे जाने वाले प्रश्न"
---
# मॉड्यूल अक्सर पूछे जाने वाले प्रश्न

> XOOPS मॉड्यूल, स्थापना और प्रबंधन के बारे में सामान्य प्रश्न और उत्तर।

---

## स्थापना एवं सक्रियण

### प्रश्न: मैं XOOPS में मॉड्यूल कैसे स्थापित करूं?

**ए:**
1. मॉड्यूल ज़िप फ़ाइल डाउनलोड करें
2. XOOPS एडमिन > मॉड्यूल > मॉड्यूल प्रबंधित करें पर जाएं
3. "ब्राउज़ करें" पर क्लिक करें और ज़िप फ़ाइल चुनें
4. "अपलोड करें" पर क्लिक करें
5. मॉड्यूल सूची में दिखाई देता है (आमतौर पर निष्क्रिय)
6. इसे सक्षम करने के लिए सक्रियण आइकन पर क्लिक करें

वैकल्पिक रूप से, ज़िप को सीधे `/xoops_root/modules/` में निकालें और व्यवस्थापक पैनल पर जाएँ।

---

### प्रश्न: "अनुमति अस्वीकृत" के साथ मॉड्यूल अपलोड विफल हो जाता है

**ए:** यह एक फ़ाइल अनुमति समस्या है:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

अधिक विवरण के लिए मॉड्यूल स्थापना विफलताएँ देखें।

---

### प्रश्न: इंस्टालेशन के बाद मैं एडमिन पैनल में मॉड्यूल क्यों नहीं देख सकता?

**ए:** निम्नलिखित की जाँच करें:

1. **मॉड्यूल सक्रिय नहीं है** - मॉड्यूल सूची में आंख आइकन पर क्लिक करें
2. **अनुपलब्ध व्यवस्थापक पृष्ठ** - मॉड्यूल में xoopsversion.php में `hasAdmin = 1` होना चाहिए
3. **भाषा फ़ाइलें अनुपलब्ध** - आवश्यकता `language/english/admin.php`
4. **कैश साफ़ नहीं हुआ** - कैश साफ़ करें और ब्राउज़र रीफ़्रेश करें

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### प्रश्न: मैं किसी मॉड्यूल को कैसे अनइंस्टॉल करूं?

**ए:**
1. XOOPS एडमिन > मॉड्यूल > मॉड्यूल प्रबंधित करें पर जाएं
2. मॉड्यूल को निष्क्रिय करें (आंख आइकन पर क्लिक करें)
3. ट्रैश/डिलीट आइकन पर क्लिक करें
4. यदि आप पूर्ण निष्कासन चाहते हैं तो मॉड्यूल फ़ोल्डर को मैन्युअल रूप से हटाएं:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## मॉड्यूल प्रबंधन

### प्रश्न: अक्षम करने और अनइंस्टॉल करने के बीच क्या अंतर है?

**ए:**
- **अक्षम**: मॉड्यूल को निष्क्रिय करें (आई आइकन पर क्लिक करें)। डेटाबेस तालिकाएँ बनी हुई हैं।
- **अनइंस्टॉल**: मॉड्यूल हटाएं। डेटाबेस तालिकाओं को हटाता है और सूची से हटाता है।

वास्तव में हटाने के लिए, फ़ोल्डर भी हटाएं:
```bash
rm -rf modules/modulename
```

---

### प्रश्न: मैं कैसे जांचूं कि कोई मॉड्यूल ठीक से स्थापित है या नहीं?

**ए:** डिबग स्क्रिप्ट का उपयोग करें:

```php
<?php
// Create admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

echo "<h1>Module Debug</h1>";

// List all modules
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Status: " . ($module->getVar('isactive') ? "Active" : "Inactive") . "<br>";
    echo "Directory: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "Version: " . $module->getVar('version') . "<br>";
}
?>
```

---

### प्रश्न: क्या मैं एक ही मॉड्यूल के कई संस्करण चला सकता हूँ?

**ए:** नहीं, XOOPS मूल रूप से इसका समर्थन नहीं करता है। हालाँकि, आप यह कर सकते हैं:

1. भिन्न निर्देशिका नाम के साथ एक प्रतिलिपि बनाएँ: `mymodule` और `mymodule2`
2. दोनों मॉड्यूल के xoopsversion.php में dirname अपडेट करें
3. अद्वितीय डेटाबेस तालिका नाम सुनिश्चित करें

यह अनुशंसित नहीं है क्योंकि वे समान कोड साझा करते हैं।

---

## मॉड्यूल कॉन्फ़िगरेशन

### प्रश्न: मैं मॉड्यूल सेटिंग्स कहां कॉन्फ़िगर करूं?

**ए:**
1. XOOPS एडमिन > मॉड्यूल पर जाएं
2. मॉड्यूल के आगे सेटिंग्स/गियर आइकन पर क्लिक करें
3. प्राथमिकताएँ कॉन्फ़िगर करें

सेटिंग्स `xoops_config` तालिका में संग्रहीत हैं।

**कोड में प्रवेश:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```

---

### प्रश्न: मैं मॉड्यूल कॉन्फ़िगरेशन विकल्पों को कैसे परिभाषित करूं?

**ए:** xoopsversion.php में:

```php
<?php
$modversion['config'] = [
    [
        'name' => 'items_per_page',
        'title' => '_AM_MYMODULE_ITEMS_PER_PAGE',
        'description' => '_AM_MYMODULE_ITEMS_PER_PAGE_DESC',
        'formtype' => 'text',
        'valuetype' => 'int',
        'default' => 10
    ],
    [
        'name' => 'enable_feature',
        'title' => '_AM_MYMODULE_ENABLE_FEATURE',
        'description' => '_AM_MYMODULE_ENABLE_FEATURE_DESC',
        'formtype' => 'yesno',
        'valuetype' => 'bool',
        'default' => 1
    ]
];
?>
```

---

## मॉड्यूल सुविधाएँ

### प्रश्न: मैं अपने मॉड्यूल में एक व्यवस्थापक पृष्ठ कैसे जोड़ूँ?

**ए:** संरचना बनाएं:

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

xoopsversion.php में:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

`admin/index.php` बनाएं:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

### प्रश्न: मैं अपने मॉड्यूल में खोज कार्यक्षमता कैसे जोड़ूं?

**ए:**
1. xoopsversion.php में सेट करें:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. `search.php` बनाएं:
```php
<?php
function mymodule_search($queryArray, $andor, $limit, $offset) {
    // Search implementation
    $results = [];
    return $results;
}
?>
```

---

### प्रश्न: मैं अपने मॉड्यूल में सूचनाएं कैसे जोड़ूं?

**ए:**
1. xoopsversion.php में सेट करें:
```php
<?php
$modversion['hasNotification'] = 1;
$modversion['notification_categories'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
$modversion['notifications'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
?>
```

2. कोड में ट्रिगर अधिसूचना:
```php
<?php
$notification_handler = xoops_getHandler('notification');
$notification_handler->triggerEvent(
    'item_published',
    $item_id,
    'Item published',
    'description'
);
?>
```

---

## मॉड्यूल अनुमतियाँ

### प्रश्न: मैं मॉड्यूल अनुमतियाँ कैसे सेट करूँ?

**ए:**
1. XOOPS एडमिन > मॉड्यूल > मॉड्यूल अनुमतियाँ पर जाएँ
2. मॉड्यूल का चयन करें
3. उपयोगकर्ता/समूह और अनुमति स्तर चुनें
4. सहेजें

**कोड में:**
```php
<?php
// Check if user can access module
if (!xoops_isUser()) {
    exit('Login required');
}

// Check specific permission
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('Access denied');
}
?>
```

---

## मॉड्यूल डेटाबेस

### प्रश्न: मॉड्यूल डेटाबेस तालिकाएँ कहाँ संग्रहीत की जाती हैं?

**ए:** मुख्य XOOPS डेटाबेस में सभी, आपकी तालिका उपसर्ग के साथ उपसर्ग (आमतौर पर `xoops_`):

```bash
# List all module tables
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# Or in PHP
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```

---

### प्रश्न: मैं मॉड्यूल डेटाबेस तालिकाओं को कैसे अद्यतन करूं?

**ए:** अपने मॉड्यूल में एक अपडेट स्क्रिप्ट बनाएं:

```php
<?php
// modules/mymodule/update.php
require_once '../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

// Add new column
$sql = "ALTER TABLE `" . XOOPS_DB_PREFIX . "mymodule_items`
        ADD COLUMN `new_field` VARCHAR(255)";

if ($GLOBALS['xoopsDB']->query($sql)) {
    echo "✓ Updated successfully";
} else {
    echo "✗ Error: " . $GLOBALS['xoopsDB']->error;
}
?>
```

---## मॉड्यूल निर्भरताएँ

### प्रश्न: मैं कैसे जांचूं कि आवश्यक मॉड्यूल स्थापित हैं या नहीं?

**ए:**
```php
<?php
$module_handler = xoops_getHandler('module');

// Check if a module exists
$module = $module_handler->getByDirname('required_module');

if (!$module || !$module->getVar('isactive')) {
    die('Error: required_module is not installed or active');
}
?>
```

---

### प्रश्न: क्या मॉड्यूल अन्य मॉड्यूल पर निर्भर हो सकते हैं?

**ए:** हां, xoopsversion.php में घोषित करें:

```php
<?php
$modversion['dependencies'] = [
    [
        'dirname' => 'required_module',
        'version_min' => '1.0',
        'version_max' => 0,  // 0 = unlimited
        'order' => 1
    ]
];
?>
```

---

## समस्या निवारण

### प्रश्न: मॉड्यूल सूची में दिखाई देता है लेकिन सक्रिय नहीं होगा

**ए:** जांचें:
1. xoopsversion.php सिंटैक्स - PHP लिंटर का उपयोग करें:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. डेटाबेस SQL फ़ाइल:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. भाषा फ़ाइलें:
```bash
ls -la modules/mymodule/language/english/
```

विस्तृत निदान के लिए मॉड्यूल इंस्टालेशन विफलताएँ देखें।

---

### प्रश्न: मॉड्यूल सक्रिय है लेकिन मुख्य साइट पर दिखाई नहीं देता है

**ए:**
1. xoopsversion.php में `hasMain = 1` सेट करें:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. `modules/mymodule/index.php` बनाएं:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### प्रश्न: मॉड्यूल "मौत की सफेद स्क्रीन" का कारण बनता है

**ए:** त्रुटि ढूंढने के लिए डिबगिंग सक्षम करें:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

त्रुटि लॉग की जाँच करें:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

समाधान के लिए व्हाइट स्क्रीन ऑफ़ डेथ देखें।

---

## प्रदर्शन

### प्रश्न: मॉड्यूल धीमा है, मैं अनुकूलन कैसे करूं?

**ए:**
1. **डेटाबेस क्वेरी जांचें** - क्वेरी लॉगिंग का उपयोग करें
2. **कैश डेटा** - XOOPS कैश का उपयोग करें:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 hour
}
?>
```

3. **टेम्प्लेट ऑप्टिमाइज़ करें** - टेम्प्लेट में लूप से बचें
4. **PHP ऑपकोड कैश सक्षम करें** - APCu, XDebug, आदि।

अधिक विवरण के लिए प्रदर्शन FAQ देखें.

---

## मॉड्यूल विकास

### प्रश्न: मुझे मॉड्यूल विकास दस्तावेज कहां मिल सकता है?

**ए:** देखें:
- मॉड्यूल विकास गाइड
- मॉड्यूल संरचना
- अपना पहला मॉड्यूल बनाना

---

## संबंधित दस्तावेज़ीकरण

- मॉड्यूल स्थापना विफलताएँ
- मॉड्यूल संरचना
- प्रदर्शन अक्सर पूछे जाने वाले प्रश्न
- डिबग मोड सक्षम करें

---

#xoops #मॉड्यूल #faq #समस्या निवारण