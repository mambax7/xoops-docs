---
title: "XOOPS मॉड्यूल सिस्टम"
description: "मॉड्यूल जीवनचक्र, XoopsModule क्लास, मॉड्यूल इंस्टॉलेशन/अनइंस्टॉलेशन, मॉड्यूल हुक और मॉड्यूल प्रबंधन"
---
XOOPS मॉड्यूल सिस्टम मॉड्यूल कार्यक्षमता के विकास, स्थापना, प्रबंधन और विस्तार के लिए एक संपूर्ण ढांचा प्रदान करता है। मॉड्यूल स्व-निहित पैकेज हैं जो अतिरिक्त सुविधाओं और क्षमताओं के साथ XOOPS का विस्तार करते हैं।

## मॉड्यूल आर्किटेक्चर

```mermaid
graph TD
    A[Module Package] -->|contains| B[xoops_version.php]
    A -->|contains| C[Admin Interface]
    A -->|contains| D[User Interface]
    A -->|contains| E[Class Files]
    A -->|contains| F[SQL Schema]

    B -->|defines| G[Module Metadata]
    B -->|defines| H[Admin Pages]
    B -->|defines| I[User Pages]
    B -->|defines| J[Blocks]
    B -->|defines| K[Hooks]

    L[Module Manager] -->|reads| B
    L -->|controls| M[Installation]
    L -->|controls| N[Activation]
    L -->|controls| O[Update]
    L -->|controls| P[Uninstallation]
```

## मॉड्यूल संरचना

मानक XOOPS मॉड्यूल निर्देशिका संरचना:

```
mymodule/
├── xoops_version.php          # Module manifest and configuration
├── admin.php                  # Admin main page
├── index.php                  # User main page
├── admin/                     # Admin pages directory
│   ├── main.php
│   ├── manage.php
│   └── settings.php
├── class/                     # Module classes
│   ├── Handler/
│   │   ├── ItemHandler.php
│   │   └── CategoryHandler.php
│   └── Objects/
│       ├── Item.php
│       └── Category.php
├── sql/                       # Database schemas
│   ├── mysql.sql
│   └── postgres.sql
├── include/                   # Include files
│   ├── common.inc.php
│   └── functions.php
├── templates/                 # Module templates
│   ├── admin/
│   │   └── main.tpl
│   └── user/
│       ├── index.tpl
│       └── item.tpl
├── blocks/                    # Module blocks
│   └── blocks.php
├── tests/                     # Unit tests
├── language/                  # Language files
│   ├── english/
│   │   └── main.php
│   └── spanish/
│       └── main.php
└── docs/                      # Documentation
```

## XoopsModule कक्षा

XoopsModule वर्ग एक स्थापित XOOPS मॉड्यूल का प्रतिनिधित्व करता है।

### कक्षा अवलोकन

```php
namespace Xoops\Core\Module;

class XoopsModule extends XoopsObject
{
    protected int $moduleid = 0;
    protected string $name = '';
    protected string $dirname = '';
    protected string $version = '';
    protected string $description = '';
    protected array $config = [];
    protected array $blocks = [];
    protected array $adminPages = [];
    protected array $userPages = [];
}
```

### गुण

| संपत्ति | प्रकार | विवरण |
|---|------|----|
| `$moduleid` | int | अद्वितीय मॉड्यूल आईडी |
| `$name` | स्ट्रिंग | मॉड्यूल प्रदर्शन नाम |
| `$dirname` | स्ट्रिंग | मॉड्यूल निर्देशिका नाम |
| `$version` | स्ट्रिंग | वर्तमान मॉड्यूल संस्करण |
| `$description` | स्ट्रिंग | मॉड्यूल विवरण |
| `$config` | सारणी | मॉड्यूल विन्यास |
| `$blocks` | सारणी | मॉड्यूल ब्लॉक |
| `$adminPages` | सारणी | व्यवस्थापक पैनल पेज |
| `$userPages` | सारणी | उपयोगकर्ता-सामना वाले पृष्ठ |

### कंस्ट्रक्टर

```php
public function __construct()
```

एक नया मॉड्यूल इंस्टेंस बनाता है और वेरिएबल प्रारंभ करता है।

### कोर तरीके

#### नाम प्राप्त करें

मॉड्यूल का प्रदर्शन नाम प्राप्त करें।

```php
public function getName(): string
```

**रिटर्न:** `string` - मॉड्यूल प्रदर्शन नाम

**उदाहरण:**
```php
$module = new XoopsModule();
$module->setVar('name', 'Publisher');
echo $module->getName(); // "Publisher"
```

#### नाम प्राप्त करें

मॉड्यूल का निर्देशिका नाम प्राप्त करें।

```php
public function getDirname(): string
```

**रिटर्न:** `string` - मॉड्यूल निर्देशिका नाम

**उदाहरण:**
```php
echo $module->getDirname(); // "publisher"
```

#### संस्करण प्राप्त करें

वर्तमान मॉड्यूल संस्करण प्राप्त करता है।

```php
public function getVersion(): string
```

**रिटर्न:** `string` - संस्करण स्ट्रिंग

**उदाहरण:**
```php
echo $module->getVersion(); // "2.1.0"
```

#### विवरण प्राप्त करें

मॉड्यूल विवरण प्राप्त करता है।

```php
public function getDescription(): string
```

**रिटर्न:** `string` - मॉड्यूल विवरण

**उदाहरण:**
```php
$desc = $module->getDescription();
```

#### कॉन्फिग प्राप्त करें

मॉड्यूल कॉन्फ़िगरेशन पुनर्प्राप्त करता है।

```php
public function getConfig(string $key = null): mixed
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$key` | स्ट्रिंग | कॉन्फ़िगरेशन कुंजी (सभी के लिए शून्य) |

**रिटर्न:** `mixed` - कॉन्फ़िगरेशन मान या सरणी

**उदाहरण:**
```php
$config = $module->getConfig();
$itemsPerPage = $module->getConfig('items_per_page');
```

#### सेट कॉन्फिग

मॉड्यूल कॉन्फ़िगरेशन सेट करता है।

```php
public function setConfig(string $key, mixed $value): void
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$key` | स्ट्रिंग | कॉन्फ़िगरेशन कुंजी |
| `$value` | मिश्रित | कॉन्फ़िगरेशन मान |

**उदाहरण:**
```php
$module->setConfig('items_per_page', 20);
$module->setConfig('enable_cache', true);
```

#### गेटपाथ

मॉड्यूल के लिए पूर्ण फ़ाइल सिस्टम पथ प्राप्त करता है।

```php
public function getPath(): string
```

**रिटर्न:** `string` - पूर्ण मॉड्यूल निर्देशिका पथ

**उदाहरण:**
```php
$path = $module->getPath(); // "/var/www/xoops/modules/publisher"
$classPath = $module->getPath() . '/class';
```

#### getUrl

मॉड्यूल का URL प्राप्त करता है।

```php
public function getUrl(): string
```

**रिटर्न:** `string` - मॉड्यूल URL

**उदाहरण:**
```php
$url = $module->getUrl(); // "http://example.com/modules/publisher"
```

## मॉड्यूल स्थापना प्रक्रिया

### xoops_module_install फ़ंक्शन

मॉड्यूल इंस्टॉलेशन फ़ंक्शन `xoops_version.php` में परिभाषित है:

```php
function xoops_module_install_modulename($module)
{
    // $module is an XoopsModule instance

    // Create database tables
    // Initialize default configuration
    // Create default folders
    // Set up file permissions

    return true; // Success
}
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$module` | XoopsModule | मॉड्यूल स्थापित किया जा रहा है |

**रिटर्न:** `bool` - सफलता पर सच, असफलता पर झूठ

**उदाहरण:**
```php
function xoops_module_install_publisher($module)
{
    // Get module path
    $modulePath = $module->getPath();

    // Create uploads directory
    $uploadsPath = XOOPS_ROOT_PATH . '/uploads/publisher';
    if (!is_dir($uploadsPath)) {
        mkdir($uploadsPath, 0755, true);
    }

    // Get database connection
    global $xoopsDB;

    // Execute SQL installation script
    $sqlFile = $modulePath . '/sql/mysql.sql';
    if (file_exists($sqlFile)) {
        $sqlQueries = file_get_contents($sqlFile);
        // Execute queries (simplified)
        $xoopsDB->queryFromFile($sqlFile);
    }

    // Set default configuration
    $module->setConfig('items_per_page', 10);
    $module->setConfig('enable_comments', true);

    return true;
}
```

### xoops_module_uninstall फ़ंक्शन

मॉड्यूल अनइंस्टॉलेशन फ़ंक्शन:

```php
function xoops_module_uninstall_modulename($module)
{
    // Drop database tables
    // Remove uploaded files
    // Clean up configuration

    return true;
}
```

**उदाहरण:**
```php
function xoops_module_uninstall_publisher($module)
{
    global $xoopsDB;

    // Drop tables
    $tables = ['publisher_items', 'publisher_categories', 'publisher_comments'];
    foreach ($tables as $table) {
        $xoopsDB->query('DROP TABLE IF EXISTS ' . $xoopsDB->prefix($table));
    }

    // Remove upload folder
    $uploadsPath = XOOPS_ROOT_PATH . '/uploads/publisher';
    if (is_dir($uploadsPath)) {
        // Recursive directory deletion
        $this->recursiveRemoveDir($uploadsPath);
    }

    return true;
}
```

## मॉड्यूल हुक

मॉड्यूल हुक मॉड्यूल को अन्य मॉड्यूल और सिस्टम के साथ एकीकृत करने की अनुमति देते हैं।

### हुक घोषणा

`xoops_version.php` में:

```php
$modversion['hooks'] = [
    'system.page.footer' => [
        'function' => 'publisher_page_footer'
    ],
    'user.profile.view' => [
        'function' => 'publisher_user_articles'
    ],
];
```

### हुक कार्यान्वयन

```php
// In a module file (e.g., include/hooks.php)

function publisher_page_footer()
{
    // Return HTML for footer
    return '<div class="publisher-footer">Publisher Footer Content</div>';
}

function publisher_user_articles($user_id)
{
    global $xoopsDB;

    // Get user's articles
    $result = $xoopsDB->query(
        'SELECT * FROM ' . $xoopsDB->prefix('publisher_articles') .
        ' WHERE author_id = ? ORDER BY published DESC LIMIT 5',
        [$user_id]
    );

    $articles = [];
    while ($row = $xoopsDB->fetchAssoc($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

### उपलब्ध सिस्टम हुक| हुक | पैरामीटर्स | विवरण |
|------|----|----|
| `system.page.header` | कोई नहीं | पेज हेडर आउटपुट |
| `system.page.footer` | कोई नहीं | पृष्ठ पादलेख आउटपुट |
| `user.login.success` | $user वस्तु | उपयोगकर्ता लॉगिन के बाद |
| `user.logout` | $user वस्तु | उपयोगकर्ता लॉगआउट के बाद |
| `user.profile.view` | $user_id | उपयोगकर्ता प्रोफ़ाइल देखना |
| `module.install` | $module वस्तु | मॉड्यूल स्थापना |
| `module.uninstall` | $module वस्तु | मॉड्यूल अनइंस्टॉलेशन |

## मॉड्यूल प्रबंधक सेवा

ModuleManager सेवा मॉड्यूल संचालन संभालती है।

### तरीके

#### getModule

नाम से एक मॉड्यूल पुनर्प्राप्त करता है।

```php
public function getModule(string $dirname): ?XoopsModule
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$dirname` | स्ट्रिंग | मॉड्यूल निर्देशिका नाम |

**रिटर्न:** `?XoopsModule` - मॉड्यूल इंस्टेंस या शून्य

**उदाहरण:**
```php
$moduleManager = $kernel->getService('module');
$publisher = $moduleManager->getModule('publisher');
if ($publisher) {
    echo $publisher->getName();
}
```

#### सभी मॉड्यूल प्राप्त करें

सभी स्थापित मॉड्यूल प्राप्त करता है।

```php
public function getAllModules(bool $activeOnly = true): array
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$activeOnly` | बूल | केवल सक्रिय मॉड्यूल लौटाएं |

**रिटर्न:** `array` - XoopsModule ऑब्जेक्ट की श्रृंखला

**उदाहरण:**
```php
$activeModules = $moduleManager->getAllModules(true);
foreach ($activeModules as $module) {
    echo $module->getName() . " - " . $module->getVersion() . "\n";
}
```

#### मॉड्यूलएक्टिव है

जाँचता है कि कोई मॉड्यूल सक्रिय है या नहीं।

```php
public function isModuleActive(string $dirname): bool
```

**उदाहरण:**
```php
if ($moduleManager->isModuleActive('publisher')) {
    // Publisher module is active
}
```

#### सक्रिय मॉड्यूल

एक मॉड्यूल सक्रिय करता है.

```php
public function activateModule(string $dirname): bool
```

**उदाहरण:**
```php
if ($moduleManager->activateModule('publisher')) {
    echo "Publisher activated";
}
```

#### निष्क्रिय मॉड्यूल

एक मॉड्यूल को निष्क्रिय कर देता है.

```php
public function deactivateModule(string $dirname): bool
```

**उदाहरण:**
```php
if ($moduleManager->deactivateModule('publisher')) {
    echo "Publisher deactivated";
}
```

## मॉड्यूल कॉन्फ़िगरेशन (xoops_version.php)

संपूर्ण मॉड्यूल मेनिफेस्ट उदाहरण:

```php
<?php
/**
 * Module manifest for Publisher
 */

$modversion = [
    'name' => 'Publisher',
    'version' => '2.1.0',
    'description' => 'Professional content publishing module',
    'author' => 'XOOPS Community',
    'credits' => 'Based on original work by...',
    'license' => 'GPL v2',
    'official' => 1,
    'image' => 'images/logo.png',
    'dirname' => 'publisher',
    'onInstall' => 'xoops_module_install_publisher',
    'onUpdate' => 'xoops_module_update_publisher',
    'onUninstall' => 'xoops_module_uninstall_publisher',

    // Admin pages
    'hasAdmin' => 1,
    'adminindex' => 'admin/main.php',
    'adminmenu' => [
        [
            'title' => 'Dashboard',
            'link' => 'admin/main.php',
            'icon' => 'dashboard.png'
        ],
        [
            'title' => 'Manage Items',
            'link' => 'admin/items.php',
            'icon' => 'items.png'
        ],
        [
            'title' => 'Settings',
            'link' => 'admin/settings.php',
            'icon' => 'settings.png'
        ]
    ],

    // User pages
    'hasMain' => 1,
    'main_file' => 'index.php',

    // Blocks
    'blocks' => [
        [
            'file' => 'blocks/recent.php',
            'name' => 'Recent Articles',
            'description' => 'Display recent published articles',
            'show_func' => 'publisher_recent_show',
            'edit_func' => 'publisher_recent_edit',
            'options' => '5|0|0',
            'template' => 'publisher_block_recent.tpl'
        ],
        [
            'file' => 'blocks/featured.php',
            'name' => 'Featured Articles',
            'description' => 'Display featured articles',
            'show_func' => 'publisher_featured_show',
            'edit_func' => 'publisher_featured_edit'
        ]
    ],

    // Module hooks
    'hooks' => [
        'system.page.footer' => [
            'function' => 'publisher_page_footer'
        ],
        'user.profile.view' => [
            'function' => 'publisher_user_articles'
        ]
    ],

    // Configuration items
    'config' => [
        [
            'name' => 'items_per_page',
            'title' => '_MI_PUBLISHER_ITEMS_PER_PAGE',
            'description' => '_MI_PUBLISHER_ITEMS_PER_PAGE_DESC',
            'formtype' => 'text',
            'valuetype' => 'int',
            'default' => '10'
        ],
        [
            'name' => 'enable_comments',
            'title' => '_MI_PUBLISHER_ENABLE_COMMENTS',
            'description' => '_MI_PUBLISHER_ENABLE_COMMENTS_DESC',
            'formtype' => 'yesno',
            'valuetype' => 'int',
            'default' => '1'
        ]
    ]
];

function xoops_module_install_publisher($module)
{
    // Installation logic
    return true;
}

function xoops_module_update_publisher($module)
{
    // Update logic
    return true;
}

function xoops_module_uninstall_publisher($module)
{
    // Uninstallation logic
    return true;
}
```

## सर्वोत्तम प्रथाएँ

1. **अपनी कक्षाओं को नेमस्पेस करें** - टकराव से बचने के लिए मॉड्यूल-विशिष्ट नेमस्पेस का उपयोग करें

2. **हैंडलर का उपयोग करें** - डेटाबेस संचालन के लिए हमेशा हैंडलर क्लास का उपयोग करें

3. **सामग्री का अंतर्राष्ट्रीयकरण** - सभी उपयोगकर्ता-सामना वाली स्ट्रिंग के लिए भाषा स्थिरांक का उपयोग करें

4. **इंस्टॉलेशन स्क्रिप्ट बनाएं** - डेटाबेस तालिकाओं के लिए SQL स्कीमा प्रदान करें

5. **दस्तावेज़ हुक** - स्पष्ट रूप से दस्तावेज़ करें कि आपका मॉड्यूल क्या हुक प्रदान करता है

6. **अपने मॉड्यूल का संस्करण बनाएं** - रिलीज के साथ संस्करण संख्याएं बढ़ाएं

7. **इंस्टॉलेशन का परीक्षण करें** - इंस्टॉल/अनइंस्टॉल प्रक्रियाओं का पूरी तरह से परीक्षण करें

8. **अनुमतियाँ संभालें** - कार्यों की अनुमति देने से पहले उपयोगकर्ता की अनुमतियाँ जांचें

## संपूर्ण मॉड्यूल उदाहरण

```php
<?php
/**
 * Custom Article Module Main Page
 */

include __DIR__ . '/include/common.inc.php';

// Get module instance
$module = xoops_getModuleByDirname('mymodule');

// Check if module is active
if (!$module) {
    die('Module not found');
}

// Get module configuration
$itemsPerPage = $module->getConfig('items_per_page');

// Get item handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Fetch items with pagination
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$items = $itemHandler->getObjects($criteria, $itemsPerPage);

// Prepare template
$xoopsTpl->assign('items', $items);
$xoopsTpl->assign('module_name', $module->getName());
$xoopsTpl->display($module->getPath() . '/templates/user/index.tpl');
```

## संबंधित दस्तावेज़ीकरण

- ../कर्नेल/कर्नेल-क्लासेस - कर्नेल आरंभीकरण और मुख्य सेवाएँ
- ../टेम्पलेट/टेम्पलेट-सिस्टम - मॉड्यूल टेम्पलेट और थीम एकीकरण
- ../डेटाबेस/QueryBuilder - डेटाबेस क्वेरी बिल्डिंग
- ../Core/XoopsObject - बेस ऑब्जेक्ट क्लास

---

*यह भी देखें: [XOOPS मॉड्यूल डेवलपमेंट गाइड](https://github.com/XOOPS/XoopsCore27/wiki/Module-Development)*