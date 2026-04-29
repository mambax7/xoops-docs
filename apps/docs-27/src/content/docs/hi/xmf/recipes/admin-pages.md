---
title: "मॉड्यूल व्यवस्थापक पृष्ठ"
description: "XMF के साथ मानकीकृत और आगे-संगत मॉड्यूल प्रशासन पृष्ठ बनाना"
---
`Xmf\Module\Admin` वर्ग मॉड्यूल प्रशासन इंटरफेस बनाने का एक सुसंगत तरीका प्रदान करता है। व्यवस्थापक पृष्ठों के लिए XMF का उपयोग एक समान उपयोगकर्ता अनुभव को बनाए रखते हुए भविष्य के XOOPS संस्करणों के साथ आगे की संगतता सुनिश्चित करता है।

## अवलोकन

XOOPS फ्रेमवर्क में ModuleAdmin क्लास ने प्रशासन को आसान बना दिया है, लेकिन इसका API सभी संस्करणों में विकसित हुआ है। `Xmf\Module\Admin` रैपर:

- एक स्थिर API प्रदान करता है जो XOOPS संस्करणों पर काम करता है
- संस्करणों के बीच API अंतर को स्वचालित रूप से संभालता है
- सुनिश्चित करता है कि आपका एडमिन कोड फॉरवर्ड-संगत है
- सामान्य कार्यों के लिए सुविधाजनक स्थैतिक तरीके प्रदान करता है

## आरंभ करना

### एक एडमिन इंस्टेंस बनाना

```php
$admin = \Xmf\Module\Admin::getInstance();
```

यदि यह पहले से ही संगत है तो यह या तो `Xmf\Module\Admin` इंस्टेंस या मूल सिस्टम क्लास लौटाता है।

## चिह्न प्रबंधन

### चिह्न स्थान समस्या

प्रतीक XOOPS संस्करणों के बीच चले गए हैं, जिससे रखरखाव संबंधी सिरदर्द पैदा हो गया है। XMF इसे उपयोगिता विधियों से हल करता है।

### प्रतीक ढूँढना

**पुराना तरीका (संस्करण-निर्भर):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF तरीका:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

`iconUrl()` विधि एक पूर्ण URL लौटाती है, इसलिए आपको पथ निर्माण के बारे में चिंता करने की आवश्यकता नहीं है।

### चिह्न आकार

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### मेनू चिह्न

व्यवस्थापक मेनू.php फ़ाइलों के लिए:

**पुराना तरीका:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```

**XMF तरीका:**
```php
// Get path to icons
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## मानक व्यवस्थापक पृष्ठ

### अनुक्रमणिका पृष्ठ

**पुराना प्रारूप:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**XMF प्रारूप:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### पेज के बारे में

**पुराना प्रारूप:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**XMF प्रारूप:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **ध्यान दें:** भविष्य में XOOPS संस्करणों में, PayPal जानकारी xoops_version.php में सेट की गई है। `setPaypal()` कॉल मौजूदा संस्करणों के साथ अनुकूलता सुनिश्चित करती है जबकि नए संस्करणों में इसका कोई प्रभाव नहीं पड़ता है।

## नेविगेशन

### नेविगेशन मेनू प्रदर्शित करें

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## जानकारी बॉक्स

### जानकारी बॉक्स बनाना

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add an info box
$admin->addInfoBox('Module Statistics');

// Add lines to the info box
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// Display the info box
$admin->displayInfoBox();
```

## कॉन्फिग बॉक्स

कॉन्फ़िग बॉक्स सिस्टम आवश्यकताएँ और स्थिति जाँच प्रदर्शित करते हैं।

### बुनियादी कॉन्फिग लाइनें

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add a simple message
$admin->addConfigBoxLine('Module is properly configured', 'default');

// Check if directory exists
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Check directory with permissions
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Check if module is installed
$admin->addConfigBoxLine('xlanguage', 'module');

// Check module with warning instead of error if missing
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```

### सुविधाजनक तरीके

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add error message
$admin->addConfigError('Upload directory is not writable');

// Add success/accept message
$admin->addConfigAccept('Database tables verified');

// Add warning message
$admin->addConfigWarning('Cache directory should be cleared');

// Check module version
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### कॉन्फिग बॉक्स प्रकार

| प्रकार | मूल्य | व्यवहार |
|------|-------|-------|
| `default` | संदेश स्ट्रिंग | संदेश सीधे प्रदर्शित करता है |
| `folder` | निर्देशिका पथ | यदि मौजूद है तो स्वीकार करता है, यदि नहीं है तो त्रुटि दिखाता है |
| `chmod` | `[path, permission]` | जाँच निर्देशिका अनुमति के साथ मौजूद है |
| `module` | मॉड्यूल का नाम | स्थापित होने पर स्वीकार करें, नहीं होने पर त्रुटि |
| `module` | `[name, 'warning']` | स्थापित होने पर स्वीकार करें, नहीं होने पर चेतावनी |

## आइटम बटन

व्यवस्थापक पृष्ठों पर क्रिया बटन जोड़ें:

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add buttons
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// Display buttons (left aligned by default)
$admin->displayButton('left');

// Or get HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```

## पूर्ण व्यवस्थापक पृष्ठ उदाहरण

### Index.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Display navigation
$adminObject->displayNavigation(basename(__FILE__));

// Add info box with statistics
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Check configuration
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Check optional modules
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Display the index page
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```

### आइटम.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Get operation
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Add action buttons
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // List items
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Display table
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Form handling code...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

### के बारे में.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Set PayPal ID for donations (optional)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Display about page
// Pass false to hide XOOPS logo, true to show it
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```

### मेनू.php

```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Get icon path using XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Items
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Categories
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permissions
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// About
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## API संदर्भ

### स्थैतिक विधियाँ

| विधि | विवरण |
|-------|----|
| `getInstance()` | व्यवस्थापक उदाहरण प्राप्त करें |
| `iconUrl($name, $size)` | आइकन URL प्राप्त करें (आकार: 16 या 32) |
| `menuIconPath($image)` | मेनू.php | के लिए आइकन पथ प्राप्त करें
| `setPaypal($paypal)` | अबाउट पेज के लिए PayPal आईडी सेट करें |

### उदाहरण विधियाँ| विधि | विवरण |
|-------|----|
| `displayNavigation($menu)` | नेविगेशन मेनू प्रदर्शित करें |
| `renderNavigation($menu)` | वापसी नेविगेशन HTML |
| `addInfoBox($title)` | जानकारी बॉक्स जोड़ें |
| `addInfoBoxLine($text, $type, $color)` | जानकारी बॉक्स में पंक्ति जोड़ें |
| `displayInfoBox()` | जानकारी बॉक्स प्रदर्शित करें |
| `renderInfoBox()` | वापसी जानकारी बॉक्स HTML |
| `addConfigBoxLine($value, $type)` | कॉन्फिग चेक लाइन जोड़ें |
| `addConfigError($value)` | कॉन्फ़िगरेशन बॉक्स में त्रुटि जोड़ें |
| `addConfigAccept($value)` | कॉन्फिग बॉक्स में सफलता जोड़ें |
| `addConfigWarning($value)` | कॉन्फिग बॉक्स में चेतावनी जोड़ें |
| `addConfigModuleVersion($moddir, $version)` | मॉड्यूल संस्करण की जाँच करें |
| `addItemButton($title, $link, $icon, $extra)` | क्रिया बटन जोड़ें |
| `displayButton($position, $delimiter)` | डिस्प्ले बटन |
| `renderButton($position, $delimiter)` | वापसी बटन HTML |
| `displayIndex()` | सूचकांक पृष्ठ प्रदर्शित करें |
| `renderIndex()` | रिटर्न इंडेक्स पेज HTML |
| `displayAbout($logo_xoops)` | पेज के बारे में प्रदर्शित करें |
| `renderAbout($logo_xoops)` | पेज के बारे में लौटें HTML |

## यह भी देखें

- ../बेसिक्स/XMF-मॉड्यूल-हेल्पर - मॉड्यूल सहायक वर्ग
- अनुमति-सहायक - अनुमति प्रबंधन
- ../XMF-फ्रेमवर्क - फ्रेमवर्क सिंहावलोकन

---

#XMF #एडमिन #मॉड्यूल-डेवलपमेंट #नेविगेशन #आइकॉन