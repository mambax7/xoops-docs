---
title: "سیستم ماژول XOOPS"
description: "چرخه عمر ماژول، کلاس XoopsModule، ماژول installation/uninstallation، قلاب ماژول و مدیریت ماژول"
---
سیستم ماژول XOOPS یک چارچوب کامل برای توسعه، نصب، مدیریت و گسترش عملکرد ماژول ارائه می دهد. ماژول ها بسته های مستقلی هستند که XOOPS را با ویژگی ها و قابلیت های اضافی گسترش می دهند.

## معماری ماژول

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

## ساختار ماژول

ساختار دایرکتوری ماژول استاندارد XOOPS:

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

## کلاس XoopsModule

کلاس XoopsModule نشان دهنده یک ماژول XOOPS نصب شده است.

### مرور کلی کلاس

```php
namespace XOOPS\Core\Module;

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

### خواص

| اموال | نوع | توضیحات |
|----------|------|-------------|
| `$moduleid` | int | شناسه ماژول منحصر به فرد |
| `$name` | رشته | نام نمایشی ماژول |
| `$dirname` | رشته | نام دایرکتوری ماژول |
| `$version` | رشته | نسخه فعلی ماژول |
| `$description` | رشته | توضیحات ماژول |
| `$config` | آرایه | پیکربندی ماژول |
| `$blocks` | آرایه | بلوک های ماژول |
| `$adminPages` | آرایه | صفحات پنل مدیریت |
| `$userPages` | آرایه | صفحات رو به رو کاربر |

### سازنده

```php
public function __construct()
```

یک نمونه ماژول جدید ایجاد می کند و متغیرها را مقداردهی اولیه می کند.

### روشهای اصلی

#### getName

نام نمایشی ماژول را دریافت می کند.

```php
public function getName(): string
```

**بازگشت:** `string` - نام نمایش ماژول

**مثال:**
```php
$module = new XoopsModule();
$module->setVar('name', 'Publisher');
echo $module->getName(); // "Publisher"
```

#### getDirname

نام دایرکتوری ماژول را دریافت می کند.

```php
public function getDirname(): string
```

**بازگشت:** `string` - نام دایرکتوری ماژول

**مثال:**
```php
echo $module->getDirname(); // "publisher"
```

#### دریافت نسخه

نسخه ماژول فعلی را دریافت می کند.

```php
public function getVersion(): string
```

**برگرداند:** `string` - رشته نسخه

**مثال:**
```php
echo $module->getVersion(); // "2.1.0"
```

#### دریافت توضیحات

توضیحات ماژول را دریافت می کند.

```php
public function getDescription(): string
```

**بازگشت:** `string` - توضیحات ماژول

**مثال:**
```php
$desc = $module->getDescription();
```

#### getConfig

پیکربندی ماژول را بازیابی می کند.

```php
public function getConfig(string $key = null): mixed
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$key` | رشته | کلید پیکربندی (تهی برای همه) |

**برمی‌گرداند:** `mixed` - مقدار یا آرایه پیکربندی

**مثال:**
```php
$config = $module->getConfig();
$itemsPerPage = $module->getConfig('items_per_page');
```

#### setConfig

پیکربندی ماژول را تنظیم می کند.

```php
public function setConfig(string $key, mixed $value): void
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$key` | رشته | کلید پیکربندی |
| `$value` | مخلوط | مقدار پیکربندی |

**مثال:**
```php
$module->setConfig('items_per_page', 20);
$module->setConfig('enable_cache', true);
```

#### getPath

مسیر سیستم فایل کامل به ماژول را دریافت می کند.

```php
public function getPath(): string
```

**بازگشت:** `string` - مسیر دایرکتوری ماژول مطلق

**مثال:**
```php
$path = $module->getPath(); // "/var/www/xoops/modules/publisher"
$classPath = $module->getPath() . '/class';
```

#### getUrl

آدرس ماژول را دریافت می کند.

```php
public function getUrl(): string
```

**برگرداندن:** `string` - URL ماژول

**مثال:**
```php
$url = $module->getUrl(); // "http://example.com/modules/publisher"
```

## فرآیند نصب ماژول

### عملکرد xoops_module_install

تابع نصب ماژول تعریف شده در `xoops_version.php`:

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

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$module` | XoopsModule | ماژول در حال نصب |

**بازگشت:** `bool` - درست در مورد موفقیت، نادرست در شکست

**مثال:**
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

### عملکرد xoops_module_uninstall

عملکرد حذف نصب ماژول:

```php
function xoops_module_uninstall_modulename($module)
{
    // Drop database tables
    // Remove uploaded files
    // Clean up configuration

    return true;
}
```

**مثال:**
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

## قلاب ماژول

قلاب های ماژول به ماژول ها اجازه می دهد تا با سایر ماژول ها و سیستم یکپارچه شوند.

### اعلامیه هوک

در `xoops_version.php`:

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

### اجرای هوک

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

### قلاب های سیستم موجود| قلاب | پارامترها | توضیحات |
|------|-----------|-------------|
| `system.page.header` | هیچکدام | خروجی هدر صفحه |
| `system.page.footer` | هیچکدام | خروجی فوتر صفحه |
| `user.login.success` | شی $user | پس از ورود کاربر |
| `user.logout` | $user شی | پس از خروج کاربر |
| `user.profile.view` | $user_id | مشاهده مشخصات کاربر |
| `module.install` | $module شی | نصب ماژول |
| `module.uninstall` | شی $module | حذف ماژول |

## سرویس مدیر ماژول

سرویس ModuleManager عملیات ماژول را مدیریت می کند.

### روش ها

#### دریافت ماژول

یک ماژول را با نام بازیابی می کند.

```php
public function getModule(string $dirname): ?XoopsModule
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$dirname` | رشته | نام دایرکتوری ماژول |

**برگرداندن:** `?XoopsModule` - نمونه ماژول یا پوچ

**مثال:**
```php
$moduleManager = $kernel->getService('module');
$publisher = $moduleManager->getModule('publisher');
if ($publisher) {
    echo $publisher->getName();
}
```

#### دریافت همه ماژول ها

همه ماژول های نصب شده را دریافت می کند.

```php
public function getAllModules(bool $activeOnly = true): array
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$activeOnly` | bool | فقط ماژول های فعال را برگردانید |

**برگرداندن:** `array` - آرایه ای از اشیاء XoopsModule

**مثال:**
```php
$activeModules = $moduleManager->getAllModules(true);
foreach ($activeModules as $module) {
    echo $module->getName() . " - " . $module->getVersion() . "\n";
}
```

#### است ModuleActive

بررسی می کند که آیا یک ماژول فعال است.

```php
public function isModuleActive(string $dirname): bool
```

**مثال:**
```php
if ($moduleManager->isModuleActive('publisher')) {
    // Publisher module is active
}
```

#### فعال کردن ماژول

یک ماژول را فعال می کند.

```php
public function activateModule(string $dirname): bool
```

**مثال:**
```php
if ($moduleManager->activateModule('publisher')) {
    echo "Publisher activated";
}
```

#### غیرفعال کردن ماژول

یک ماژول را غیرفعال می کند.

```php
public function deactivateModule(string $dirname): bool
```

**مثال:**
```php
if ($moduleManager->deactivateModule('publisher')) {
    echo "Publisher deactivated";
}
```

## پیکربندی ماژول (xoops_version.php)

مثال مانیفست ماژول کامل:

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

## بهترین شیوه ها

1. ** فضای نام کلاس های شما ** - از فضاهای نام مخصوص ماژول برای جلوگیری از تضاد استفاده کنید

2. **استفاده از Handlers** - همیشه از کلاس های handler برای عملیات پایگاه داده استفاده کنید

3. **بین المللی کردن محتوا** - از ثابت های زبان برای همه رشته های رو به رو کاربر استفاده کنید

4. **ایجاد اسکریپت های نصب ** - ارائه طرحواره های SQL برای جداول پایگاه داده

5. **قلاب های سند ** - به وضوح آنچه قلاب های ماژول شما ارائه می دهد را مستند کنید

6. ** نسخه ماژول شما ** - افزایش تعداد نسخه با نسخه های منتشر شده

7. **تست نصب** - فرآیندهای install/uninstall را به طور کامل آزمایش کنید

8. **Handle Permissions** - قبل از اجازه دادن به اقدامات، مجوزهای کاربر را بررسی کنید

## مثال کامل ماژول

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

## مستندات مرتبط

- ../Kernel/Kernel-Classes - خدمات اولیه و اصلی هسته
- ../Template/Template-System - قالب‌های ماژول و ادغام تم
- ../Database/QueryBuilder - ساخت پرس و جو پایگاه داده
- ../Core/XoopsObject - کلاس شی پایه

---

*همچنین ببینید: [راهنمای توسعه ماژول XOOPS](https://github.com/XOOPS/XoopsCore27/wiki/Module-Development)*