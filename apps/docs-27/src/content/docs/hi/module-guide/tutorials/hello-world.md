---
title: "हेलो वर्ल्ड मॉड्यूल"
description: "अपना पहला XOOPS मॉड्यूल बनाने के लिए चरण-दर-चरण ट्यूटोरियल"
---
# हेलो वर्ल्ड मॉड्यूल ट्यूटोरियल

यह ट्यूटोरियल आपको अपना पहला XOOPS मॉड्यूल बनाने में मार्गदर्शन करता है। अंत तक, आपके पास एक कार्यशील मॉड्यूल होगा जो फ्रंटएंड और एडमिन दोनों क्षेत्रों पर "हैलो वर्ल्ड" प्रदर्शित करता है।

## पूर्वावश्यकताएँ

- XOOPS 2.5.x स्थापित और चल रहा है
- PHP 8.0 या उच्चतर
- बुनियादी PHP ज्ञान
- टेक्स्ट संपादक या आईडीई (PhpStorm अनुशंसित)

## चरण 1: निर्देशिका संरचना बनाएं

`/modules/helloworld/` में निम्नलिखित निर्देशिका संरचना बनाएं:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## चरण 2: मॉड्यूल परिभाषा बनाएं

`xoops_version.php` बनाएं:

```php
<?php
/**
 * Hello World Module - Module Definition
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Basic Module Information
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// Module Status
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// Admin Configuration
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main Menu
$modversion['hasMain'] = 1;

// Templates
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// Admin Templates
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// No database tables needed for this simple module
$modversion['tables'] = [];
```

## चरण 3: भाषा फ़ाइलें बनाएँ

### modinfo.php (मॉड्यूल सूचना)

`language/english/modinfo.php` बनाएं:

```php
<?php
/**
 * Module Information Language Constants
 */

// Module Info
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// Template Descriptions
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```

### main.php (फ्रंटएंड लैंग्वेज)

`language/english/main.php` बनाएं:

```php
<?php
/**
 * Frontend Language Constants
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```

### admin.php (एडमिन भाषा)

`language/english/admin.php` बनाएं:

```php
<?php
/**
 * Admin Language Constants
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```

## चरण 4: फ्रंटएंड इंडेक्स बनाएं

मॉड्यूल रूट में `index.php` बनाएं:

```php
<?php
/**
 * Hello World Module - Frontend Index
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Load language file
xoops_loadLanguage('main', 'helloworld');

// Get the module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// Set page template
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Include XOOPS header
require XOOPS_ROOT_PATH . '/header.php';

// Get module configuration
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// Generate page content
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// Simple visitor counter (using session)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// Assign variables to template
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// Include XOOPS footer
require XOOPS_ROOT_PATH . '/footer.php';
```

## चरण 5: फ्रंटएंड टेम्पलेट बनाएं

`templates/helloworld_index.tpl` बनाएं:

```smarty
<{* Hello World Module - Index Template *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```

## चरण 6: व्यवस्थापक फ़ाइलें बनाएं

### एडमिन हेडर

`admin/admin_header.php` बनाएं:

```php
<?php
/**
 * Admin Header
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// Load admin language file
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// Get module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// Module directory
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### एडमिन फ़ुटर

`admin/admin_footer.php` बनाएं:

```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### व्यवस्थापक मेनू

`admin/menu.php` बनाएं:

```php
<?php
/**
 * Admin Menu Configuration
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### एडमिन इंडेक्स पेज

`admin/index.php` बनाएं:

```php
<?php
/**
 * Admin Index Page
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// Display admin navigation
$adminObject->displayNavigation('index.php');

// Create admin info box
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// Display info box
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// Display admin footer
require_once __DIR__ . '/admin_footer.php';
```

## चरण 7: एडमिन टेम्पलेट बनाएं

`templates/admin/helloworld_admin_index.tpl` बनाएं:

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## चरण 8: मॉड्यूल लोगो बनाएं

एक PNG छवि बनाएं या कॉपी करें (अनुशंसित आकार: 92x92 पिक्सेल):
`assets/images/logo.png`

आप एक साधारण लोगो बनाने के लिए किसी भी छवि संपादक का उपयोग कर सकते हैं, या प्लेसहोल्डर.कॉम जैसी साइट से प्लेसहोल्डर का उपयोग कर सकते हैं।

## चरण 9: मॉड्यूल स्थापित करें

1. व्यवस्थापक के रूप में अपनी XOOPS साइट पर लॉग इन करें
2. **सिस्टम एडमिन** > **मॉड्यूल** पर जाएं
3. उपलब्ध मॉड्यूल की सूची में "हैलो वर्ल्ड" ढूंढें
4. **इंस्टॉल** बटन पर क्लिक करें
5. स्थापना की पुष्टि करें

## चरण 10: अपने मॉड्यूल का परीक्षण करें

### फ्रंटएंड टेस्ट

1. अपनी XOOPS साइट पर नेविगेट करें
2. मुख्य मेनू में "हैलो वर्ल्ड" पर क्लिक करें
3. आपको स्वागत संदेश और वर्तमान समय देखना चाहिए

### एडमिन टेस्ट

1. एडमिन एरिया में जाएं
2. एडमिन मेनू में "हैलो वर्ल्ड" पर क्लिक करें
3. आपको एडमिन डैशबोर्ड देखना चाहिए

## समस्या निवारण

### मॉड्यूल इंस्टाल सूची में दिखाई नहीं दे रहा है

- फ़ाइल अनुमतियाँ जाँचें (निर्देशिकाओं के लिए 755, फ़ाइलों के लिए 644)
- सत्यापित करें `xoops_version.php` में कोई सिंटैक्स त्रुटि नहीं है
- XOOPS कैश साफ़ करें

### टेम्पलेट लोड नहीं हो रहा है

- सुनिश्चित करें कि टेम्प्लेट फ़ाइलें सही निर्देशिका में हैं
- जांचें कि टेम्प्लेट फ़ाइल नाम `xoops_version.php` से मेल खाते हैं
- सत्यापित करें कि Smarty सिंटैक्स सही है

### भाषा के तार दिखाई नहीं दे रहे हैं

- भाषा फ़ाइल पथ की जाँच करें
- सुनिश्चित करें कि भाषा स्थिरांक परिभाषित हैं
- सत्यापित करें कि सही भाषा फ़ोल्डर मौजूद है

## अगले चरण

अब जब आपके पास एक कार्यशील मॉड्यूल है, तो इसके साथ सीखना जारी रखें:

- बिल्डिंग-ए-CRUD-मॉड्यूल - डेटाबेस कार्यक्षमता जोड़ें
- ../पैटर्न/एमवीसी-पैटर्न - अपने कोड को ठीक से व्यवस्थित करें
- ../सर्वोत्तम अभ्यास/परीक्षण - PHPUnit परीक्षण जोड़ें

## संपूर्ण फ़ाइल संदर्भ

आपके पूर्ण मॉड्यूल में ये फ़ाइलें होनी चाहिए:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## सारांश

बधाई हो! आपने अपना पहला XOOPS मॉड्यूल बना लिया है। मुख्य अवधारणाएँ शामिल:

1. **मॉड्यूल संरचना** - मानक XOOPS मॉड्यूल निर्देशिका लेआउट
2. **xoops_version.php** - मॉड्यूल परिभाषा और कॉन्फ़िगरेशन
3. **भाषा फ़ाइलें** - अंतर्राष्ट्रीयकरण समर्थन
4. **टेम्पलेट्स** - Smarty टेम्पलेट एकीकरण
5. **एडमिन इंटरफ़ेस** - बेसिक एडमिन पैनल

यह भी देखें: ../मॉड्यूल-विकास | बिल्डिंग-ए-CRUD-मॉड्यूल | ../पैटर्न/एमवीसी-पैटर्न