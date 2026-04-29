---
title: "मॉड्यूल विकास"
description: "आधुनिक PHP प्रथाओं का उपयोग करके XOOPS मॉड्यूल विकसित करने के लिए व्यापक मार्गदर्शिका"
---
यह अनुभाग आधुनिक PHP प्रथाओं, डिज़ाइन पैटर्न और सर्वोत्तम प्रथाओं का उपयोग करके XOOPS मॉड्यूल विकसित करने के लिए व्यापक दस्तावेज़ीकरण प्रदान करता है।

## अवलोकन

XOOPS मॉड्यूल विकास पिछले कुछ वर्षों में महत्वपूर्ण रूप से विकसित हुआ है। आधुनिक मॉड्यूल उत्तोलन:

- **एमवीसी आर्किटेक्चर** - चिंताओं का स्पष्ट पृथक्करण
- **PHP 8.x विशेषताएँ** - प्रकार की घोषणाएँ, विशेषताएँ, नामित तर्क
- **डिज़ाइन पैटर्न** - रिपॉजिटरी, डीटीओ, सर्विस लेयर पैटर्न
- **परीक्षण** - आधुनिक परीक्षण प्रथाओं के साथ PHPUnit
- **XMF फ्रेमवर्क** - XOOPS मॉड्यूल फ्रेमवर्क उपयोगिताएँ

## दस्तावेज़ीकरण संरचना

### ट्यूटोरियल

शुरुआत से XOOPS मॉड्यूल बनाने के लिए चरण-दर-चरण मार्गदर्शिकाएँ।

- ट्यूटोरियल/हैलो-वर्ल्ड-मॉड्यूल - आपका पहला XOOPS मॉड्यूल
- ट्यूटोरियल/बिल्डिंग-ए-CRUD-मॉड्यूल - पूर्ण बनाएं, पढ़ें, अपडेट करें, हटाएं कार्यक्षमता

### डिज़ाइन पैटर्न

आधुनिक XOOPS मॉड्यूल विकास में प्रयुक्त वास्तुशिल्प पैटर्न।

- पैटर्न/एमवीसी-पैटर्न - मॉडल-व्यू-कंट्रोलर आर्किटेक्चर
- पैटर्न/रिपॉजिटरी-पैटर्न - डेटा एक्सेस एब्स्ट्रैक्शन
- पैटर्न/डीटीओ-पैटर्न - स्वच्छ डेटा प्रवाह के लिए डेटा ट्रांसफर ऑब्जेक्ट

### सर्वोत्तम प्रथाएँ

रखरखाव योग्य, उच्च गुणवत्ता वाले कोड लिखने के लिए दिशानिर्देश।

- सर्वोत्तम अभ्यास/क्लीन-कोड - XOOPS के लिए स्वच्छ कोड सिद्धांत
- सर्वोत्तम अभ्यास/कोड-सुगंध - सामान्य विरोधी पैटर्न और उन्हें कैसे ठीक करें
- सर्वोत्तम अभ्यास/परीक्षण - PHPUnit परीक्षण रणनीतियाँ

### उदाहरण

वास्तविक दुनिया मॉड्यूल विश्लेषण और कार्यान्वयन उदाहरण।

- प्रकाशक-मॉड्यूल-विश्लेषण - प्रकाशक मॉड्यूल में गहराई से उतरें

## मॉड्यूल निर्देशिका संरचना

एक सुव्यवस्थित XOOPS मॉड्यूल इस निर्देशिका संरचना का अनुसरण करता है:

```
/modules/mymodule/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /css/
        /js/
        /images/
    /blocks/
        myblock.php
    /class/
        /Controller/
        /Entity/
        /Repository/
        /Service/
    /include/
        common.php
        install.php
        uninstall.php
        update.php
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /preloads/
        core.php
    /sql/
        mysql.sql
    /templates/
        /admin/
        /blocks/
        main_index.tpl
    /test/
        bootstrap.php
        /Unit/
        /Integration/
    index.php
    xoops_version.php
```

## मुख्य फाइलों की व्याख्या

### xoops_version.php

मॉड्यूल परिभाषा फ़ाइल जो आपके मॉड्यूल के बारे में XOOPS बताती है:

```php
<?php
$modversion = [];

// Basic Information
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Module Flags
$modversion['hasMain']     = 1;  // Has frontend pages
$modversion['hasAdmin']    = 1;  // Has admin section
$modversion['system_menu'] = 1;  // Show in admin menu

// Admin Configuration
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Database
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// Templates
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// Blocks
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Module Preferences
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### सामान्य फ़ाइल शामिल करें

अपने मॉड्यूल के लिए एक सामान्य बूटस्ट्रैप फ़ाइल बनाएं:

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Module constants
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// Autoload classes
require_once MYMODULE_PATH . '/class/autoload.php';
```

## PHP संस्करण आवश्यकताएँ

आधुनिक XOOPS मॉड्यूल को लाभ उठाने के लिए PHP 8.0 या उच्चतर को लक्षित करना चाहिए:

- **कंस्ट्रक्टर प्रॉपर्टी प्रमोशन**
- **नामांकित तर्क**
- **संघ के प्रकार**
- **अभिव्यक्तियों का मिलान करें**
- **गुण**
- **नलसेफ ऑपरेटर**

## आरंभ करना

1. ट्यूटोरियल/हैलो-वर्ल्ड-मॉड्यूल ट्यूटोरियल से शुरुआत करें
2. ट्यूटोरियल/बिल्डिंग-ए-CRUD-मॉड्यूल की प्रगति
3. वास्तुकला मार्गदर्शन के लिए पैटर्न/एमवीसी-पैटर्न का अध्ययन करें
4. संपूर्ण सर्वोत्तम-प्रथाएँ/क्लीन-कोड प्रथाएँ लागू करें
5. शुरुआत से ही सर्वोत्तम अभ्यास/परीक्षण लागू करें

## संबंधित संसाधन

- ../05-XMF-फ्रेमवर्क/XMF-फ्रेमवर्क - XOOPS मॉड्यूल फ्रेमवर्क उपयोगिताएँ
- डेटाबेस-संचालन - XOOPS डेटाबेस के साथ कार्य करना
- ../04-API-रेफरेंस/टेम्पलेट/टेम्पलेट-सिस्टम - Smarty टेम्प्लेटिंग इन XOOPS
- ../02-कोर-अवधारणाएं/सुरक्षा/सुरक्षा-सर्वोत्तम अभ्यास - अपने मॉड्यूल को सुरक्षित करना

## संस्करण इतिहास

| संस्करण | दिनांक | परिवर्तन |
|------|------|------|
| 1.0 | 2025-01-28 | प्रारंभिक दस्तावेज |