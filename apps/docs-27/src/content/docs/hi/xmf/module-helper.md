---
title: "XMF मॉड्यूल हेल्पर"
description: 'Xmf\Module\Helper वर्ग और संबंधित सहायकों का उपयोग करके सरलीकृत मॉड्यूल संचालन'
---
`Xmf\Module\Helper` क्लास मॉड्यूल से संबंधित जानकारी, कॉन्फ़िगरेशन, हैंडलर और बहुत कुछ तक पहुंचने का एक आसान तरीका प्रदान करता है। मॉड्यूल हेल्पर का उपयोग करने से आपका कोड सरल हो जाता है और बॉयलरप्लेट कम हो जाती है।

## अवलोकन

मॉड्यूल सहायक प्रदान करता है:

- सरलीकृत कॉन्फ़िगरेशन पहुंच
- मॉड्यूल ऑब्जेक्ट पुनर्प्राप्ति
- हैंडलर इन्स्टेन्शियशन
- पथ और URL संकल्प
- अनुमति और सत्र सहायक
- कैश प्रबंधन

## एक मॉड्यूल हेल्पर प्राप्त करना

### मूल उपयोग

```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### वर्तमान मॉड्यूल से

यदि आप मॉड्यूल नाम निर्दिष्ट नहीं करते हैं, तो यह वर्तमान सक्रिय मॉड्यूल का उपयोग करता है:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## कॉन्फ़िगरेशन एक्सेस

### पारंपरिक XOOPS तरीका

मॉड्यूल कॉन्फ़िगरेशन को पुराने तरीके से प्राप्त करना वर्बोज़ है:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### XMF रास्ता

मॉड्यूल सहायक के साथ, वही कार्य सरल हो जाता है:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## सहायक तरीके

### getModule()

सहायक मॉड्यूल के लिए XoopsModule ऑब्जेक्ट लौटाता है।

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

एक मॉड्यूल कॉन्फ़िगरेशन मान या सभी कॉन्फ़िगरेशन लौटाता है।

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

मॉड्यूल के लिए ऑब्जेक्ट हैंडलर लौटाता है।

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

मॉड्यूल के लिए एक भाषा फ़ाइल लोड करता है।

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

जाँचता है कि क्या यह मॉड्यूल वर्तमान में सक्रिय मॉड्यूल है।

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

जाँचता है कि वर्तमान उपयोगकर्ता के पास इस मॉड्यूल के लिए व्यवस्थापक अधिकार हैं या नहीं।

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## पथ और URL विधियाँ

### url($url)

मॉड्यूल-सापेक्ष पथ के लिए एक पूर्ण URL लौटाता है।

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

### path($path)

मॉड्यूल-सापेक्ष पथ के लिए एक पूर्ण फ़ाइल सिस्टम पथ लौटाता है।

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

मॉड्यूल अपलोड फ़ाइलों के लिए एक पूर्ण URL लौटाता है।

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadPath($path)

मॉड्यूल अपलोड फ़ाइलों के लिए एक संपूर्ण फ़ाइल सिस्टम पथ लौटाता है।

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### redirect($url, $time, $message)

मॉड्यूल के भीतर मॉड्यूल-सापेक्ष URL पर रीडायरेक्ट करता है।

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## डिबगिंग समर्थन

### setDebug($bool)

सहायक के लिए डिबग मोड सक्षम या अक्षम करें।

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### addLog($log)

मॉड्यूल लॉग में एक संदेश जोड़ें.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## संबंधित सहायक वर्ग

XMF विशेष सहायक प्रदान करता है जो `Xmf\Module\Helper\AbstractHelper` का विस्तार करता है:

### अनुमति सहायक

विस्तृत दस्तावेज़ीकरण के लिए ../रेसिपी/अनुमति-सहायक देखें।

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### सत्र सहायक

स्वचालित कुंजी उपसर्ग के साथ मॉड्यूल-जागरूक सत्र भंडारण।

```php
$session = new \Xmf\Module\Helper\Session('mymodule');

// Store value
$session->set('last_viewed', $itemId);

// Retrieve value
$lastViewed = $session->get('last_viewed', 0);

// Delete value
$session->del('last_viewed');

// Clear all module session data
$session->destroy();
```

### कैश हेल्पर

स्वचालित कुंजी उपसर्ग के साथ मॉड्यूल-जागरूक कैशिंग।

```php
$cache = new \Xmf\Module\Helper\Cache('mymodule');

// Write to cache (TTL in seconds)
$cache->write('item_' . $id, $itemData, 3600);

// Read from cache
$data = $cache->read('item_' . $id, null);

// Delete from cache
$cache->delete('item_' . $id);

// Read with automatic regeneration
$data = $cache->cacheRead(
    'expensive_data',
    function() {
        // This runs only if cache miss
        return computeExpensiveData();
    },
    3600
);
```

## पूरा उदाहरण

मॉड्यूल सहायक का उपयोग करके यहां एक व्यापक उदाहरण दिया गया है:

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;
use Xmf\Module\Helper\Session;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Initialize helpers
$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');
$session = new Session('mymodule');

// Load language
$helper->loadLanguage('main');

// Get configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableComments = $helper->getConfig('enable_comments', true);

// Handle request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

require_once XOOPS_ROOT_PATH . '/header.php';

switch ($op) {
    case 'view':
        // Check permission
        if (!$permHelper->checkPermission('view', $id)) {
            redirect_header($helper->url('index.php'), 3, _NOPERM);
        }

        // Track in session
        $session->set('last_viewed', $id);

        // Get handler and item
        $itemHandler = $helper->getHandler('items');
        $item = $itemHandler->get($id);

        if (!$item) {
            redirect_header($helper->url('index.php'), 3, 'Item not found');
        }

        // Display item
        $xoopsTpl->assign('item', $item->toArray());
        break;

    case 'list':
    default:
        $itemHandler = $helper->getHandler('items');

        $criteria = new CriteriaCompo();
        $criteria->setLimit($itemsPerPage);
        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        $items = $itemHandler->getObjects($criteria);
        $xoopsTpl->assign('items', $items);

        // Show last viewed if exists
        $lastViewed = $session->get('last_viewed', 0);
        if ($lastViewed > 0) {
            $xoopsTpl->assign('last_viewed', $lastViewed);
        }
        break;
}

// Admin link if authorized
if ($helper->isUserAdmin()) {
    $xoopsTpl->assign('admin_url', $helper->url('admin/index.php'));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## AbstractHelper बेस क्लास

सभी XMF सहायक वर्ग `Xmf\Module\Helper\AbstractHelper` का विस्तार करते हैं, जो प्रदान करता है:

### कंस्ट्रक्टर

```php
public function __construct($dirname)
```

मॉड्यूल निर्देशिका नाम के साथ त्वरित होता है। यदि खाली है, तो वर्तमान मॉड्यूल का उपयोग करता है।

### dirname()

सहायक से संबद्ध मॉड्यूल निर्देशिका नाम लौटाता है।

```php
$dirname = $helper->dirname();
```

### init()

मॉड्यूल लोड होने के बाद कंस्ट्रक्टर द्वारा कॉल किया जाता है। आरंभीकरण तर्क के लिए कस्टम सहायकों में ओवरराइड करें।

## कस्टम हेल्पर्स बनाना

आप मॉड्यूल-विशिष्ट कार्यक्षमता के लिए सहायक का विस्तार कर सकते हैं:

```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

class Helper extends \Xmf\Module\Helper\GenericHelper
{
    public function init()
    {
        // Custom initialization
    }

    public function getItemUrl($id)
    {
        return $this->url('item.php?id=' . $id);
    }

    public function getUploadDirectory()
    {
        $path = $this->uploadPath('');
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
        return $path;
    }
}
```

## यह भी देखें

- XMF के साथ शुरुआत करना - मूल XMF उपयोग
- XMF-अनुरोध - अनुरोध प्रबंधन
- ../रेसिपी/अनुमति-सहायक - अनुमति प्रबंधन
- ../रेसिपी/मॉड्यूल-एडमिन-पेज - एडमिन इंटरफ़ेस निर्माण

---

#xmf #मॉड्यूल-हेल्पर #कॉन्फ़िगरेशन #हैंडलर #सत्र #कैश