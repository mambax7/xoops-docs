---
title: "XMF के साथ शुरुआत करना"
description: "इंस्टालेशन, बुनियादी अवधारणाएँ, और XOOPS मॉड्यूल फ्रेमवर्क के साथ पहला चरण"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

यह मार्गदर्शिका XOOPS मॉड्यूल फ्रेमवर्क (XMF) की मूलभूत अवधारणाओं और अपने मॉड्यूल में इसका उपयोग कैसे शुरू करें, को कवर करती है।

## पूर्वावश्यकताएँ

- XOOPS 2.5.8 या बाद का संस्करण स्थापित
- PHP 7.2 या बाद का संस्करण
- PHP ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग की बुनियादी समझ

## नेमस्पेस को समझना

XMF अपनी कक्षाओं को व्यवस्थित करने और नामकरण विवादों से बचने के लिए PHP नेमस्पेस का उपयोग करता है। सभी XMF कक्षाएं `Xmf` नेमस्पेस में हैं।

### वैश्विक अंतरिक्ष समस्या

नेमस्पेस के बिना, सभी PHP कक्षाएं एक वैश्विक स्थान साझा करती हैं। इससे टकराव हो सकता है:

```php
<?php
// This would conflict with PHP's built-in ArrayObject
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Fatal error: Cannot redeclare class ArrayObject
```

### नेमस्पेस समाधान

नामस्थान पृथक नामकरण संदर्भ बनाते हैं:

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// No conflict - this is \MyNamespace\ArrayObject
```

### XMF नेमस्पेस का उपयोग करना

आप XMF कक्षाओं को कई तरीकों से संदर्भित कर सकते हैं:

**पूर्ण नामस्थान पथ:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**उपयोग कथन के साथ:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**एकाधिक आयात:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## ऑटोलोडिंग

XMF की सबसे बड़ी सुविधाओं में से एक स्वचालित क्लास लोडिंग है। आपको कभी भी XMF क्लास फ़ाइलों को मैन्युअल रूप से शामिल करने की आवश्यकता नहीं है।

### पारंपरिक XOOPS लोड हो रहा है

पुराने तरीके से स्पष्ट लोडिंग की आवश्यकता होती है:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMF ऑटोलोडिंग

XMF के साथ, संदर्भित होने पर कक्षाएं स्वचालित रूप से लोड होती हैं:

```php
$input = Xmf\Request::getString('input', '');
```

या उपयोग कथन के साथ:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

ऑटोलोडर [PSR-4](http://www.php-fig.org/psr/psr-4/) मानक का पालन करता है और उन निर्भरताओं का भी प्रबंधन करता है जिन पर XMF निर्भर करता है।

## बुनियादी उपयोग के उदाहरण

### रीडिंग अनुरोध इनपुट

```php
use Xmf\Request;

// Get integer value with default of 0
$id = Request::getInt('id', 0);

// Get string value with default empty string
$title = Request::getString('title', '');

// Get command (alphanumeric, lowercase)
$op = Request::getCmd('op', 'list');

// Get email with validation
$email = Request::getEmail('email', '');

// Get from specific hash (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```

### मॉड्यूल हेल्पर का उपयोग करना

```php
use Xmf\Module\Helper;

// Get helper for your module
$helper = Helper::getHelper('mymodule');

// Read module configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Access the module object
$module = $helper->getModule();
$version = $module->getVar('version');

// Get a handler
$itemHandler = $helper->getHandler('items');

// Load language file
$helper->loadLanguage('admin');

// Check if current module
if ($helper->isCurrentModule()) {
    // We are in this module
}

// Check admin rights
if ($helper->isUserAdmin()) {
    // User has admin access
}
```

### पथ और URL सहायक

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Get module URL
$moduleUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

// Get module path
$modulePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

// Upload paths
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## XMF के साथ डिबगिंग

XMF सहायक डिबगिंग टूल प्रदान करता है:

```php
// Dump a variable with nice formatting
\Xmf\Debug::dump($myVariable);

// Dump multiple variables
\Xmf\Debug::dump($var1, $var2, $var3);

// Dump POST data
\Xmf\Debug::dump($_POST);

// Show a backtrace
\Xmf\Debug::backtrace();
```

डिबग आउटपुट संक्षिप्त करने योग्य है और ऑब्जेक्ट और एरेज़ को पढ़ने में आसान प्रारूप में प्रदर्शित करता है।

## परियोजना संरचना अनुशंसा

XMF-आधारित मॉड्यूल बनाते समय, अपना कोड व्यवस्थित करें:

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Optional custom helper
    ItemHandler.php     # Your handlers
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```

## सामान्य शामिल पैटर्न

एक विशिष्ट मॉड्यूल प्रवेश बिंदु:

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Get operation from request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Include XOOPS header
require_once XOOPS_ROOT_PATH . '/header.php';

// Your module logic here
switch ($op) {
    case 'view':
        // Handle view
        break;
    case 'list':
    default:
        // Handle list
        break;
}

// Include XOOPS footer
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## अगले चरण

अब जब आप मूल बातें समझ गए हैं, तो जानें:

- XMF-अनुरोध - विस्तृत अनुरोध प्रबंधन दस्तावेज
- XMF-मॉड्यूल-हेल्पर - पूर्ण मॉड्यूल सहायक संदर्भ
- ../रेसिपी/अनुमति-सहायक - उपयोगकर्ता अनुमतियाँ प्रबंधित करना
- ../रेसिपी/मॉड्यूल-एडमिन-पेज - एडमिन इंटरफेस का निर्माण

## यह भी देखें

- ../XMF-फ्रेमवर्क - फ्रेमवर्क सिंहावलोकन
- ../Reference/JWT - JSON वेब टोकन समर्थन
- ../संदर्भ/डेटाबेस - डेटाबेस उपयोगिताएँ

---

#XMF #आरंभ करना #नेमस्पेस #ऑटोलोडिंग #बेसिक्स