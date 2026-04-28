---
title: "مرجع واجهة برمجة تطبيقات XoopsModule"
description: "مرجع واجهة برمجة التطبيقات الكاملة لفئة XoopsModule وفئات نظام إدارة الوحدات"
dir: rtl
lang: ar
---

> توثيق واجهة برمجة التطبيقات الكاملة لنظام إدارة الوحدات في XOOPS.

---

## بنية نظام إدارة الوحدات

```mermaid
graph TB
    subgraph "تحميل الوحدة"
        A[الطلب] --> B[الموجه]
        B --> C{توجد الوحدة؟}
        C -->|نعم| D[تحميل xoops_version.php]
        C -->|لا| E[خطأ 404]
        D --> F[تهيئة الوحدة]
        F --> G[التحقق من الأذونات]
        G --> H[تنفيذ المتحكم]
    end

    subgraph "مكونات الوحدة"
        I[XoopsModule] --> J[الإعدادات]
        I --> K[القوالب]
        I --> L[الكتل]
        I --> M[المعالجات]
        I --> N[الأحمال المسبقة]
    end

    H --> I
```

---

## فئة XoopsModule

### تعريف الفئة

```php
class XoopsModule extends XoopsObject
{
    // الخصائص
    public $modinfo;      // مصفوفة معلومات الوحدة
    public $adminmenu;    // عناصر قائمة الإدارة

    // الدوال
    public function __construct();
    public function loadInfo(string $dirname, bool $verbose = true): bool;
    public function getInfo(string $name = null): mixed;
    public function setInfo(string $name, mixed $value): bool;
    public function mainLink(): string;
    public function subLink(): string;
    public function loadAdminMenu(): void;
    public function getAdminMenu(): array;
    public function loadConfig(): bool;
    public function getConfig(string $name = null): mixed;
}
```

### الخصائص

| الخاصية | النوع | الوصف |
|--------|------|-------|
| `mid` | int | معرف الوحدة |
| `name` | string | اسم العرض |
| `version` | string | رقم الإصدار |
| `dirname` | string | اسم الدليل |
| `isactive` | int | حالة النشاط (0/1) |
| `hasmain` | int | يمتلك منطقة رئيسية |
| `hasadmin` | int | يمتلك منطقة إدارة |
| `hassearch` | int | له دالة بحث |
| `hasconfig` | int | له إعدادات |
| `hascomments` | int | له تعليقات |
| `hasnotification` | int | له إخطارات |

### الدوال الرئيسية

```php
// الحصول على مثيل الوحدة
$module = $GLOBALS['xoopsModule'];

// أو تحميل حسب dirname
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');

// الحصول على معلومات الوحدة
$version = $module->getVar('version');
$name = $module->getVar('name');
$dirname = $module->getVar('dirname');

// الحصول على إعدادات الوحدة
$config = $module->getConfig();
$specificConfig = $module->getConfig('items_per_page');

// التحقق مما إذا كانت الوحدة تمتلك ميزة
$hasAdmin = $module->getVar('hasadmin');
$hasSearch = $module->getVar('hassearch');

// الحصول على مسار الوحدة
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $module->getVar('dirname');
$moduleUrl = XOOPS_URL . '/modules/' . $module->getVar('dirname');
```

---

## XoopsModuleHandler

### تعريف الفئة

```php
class XoopsModuleHandler extends XoopsPersistableObjectHandler
{
    public function create(bool $isNew = true): XoopsModule;
    public function get(int $id): ?XoopsModule;
    public function getByDirname(string $dirname): ?XoopsModule;
    public function insert(XoopsObject $module, bool $force = false): bool;
    public function delete(XoopsObject $module, bool $force = false): bool;
    public function getList(?CriteriaElement $criteria = null): array;
    public function getObjects(?CriteriaElement $criteria = null): array;
}
```

### أمثلة الاستخدام

```php
// الحصول على المعالج
$moduleHandler = xoops_getHandler('module');

// الحصول على جميع الوحدات النشطة
$criteria = new Criteria('isactive', 1);
$activeModules = $moduleHandler->getObjects($criteria);

// الحصول على وحدة حسب dirname
$publisherModule = $moduleHandler->getByDirname('publisher');

// الحصول على الوحدات التي لها إدارة
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('isactive', 1));
$criteria->add(new Criteria('hasadmin', 1));
$adminModules = $moduleHandler->getObjects($criteria);

// التحقق من تثبيت الوحدة
$module = $moduleHandler->getByDirname('mymodule');
if ($module && $module->getVar('isactive')) {
    // الوحدة مثبتة ونشطة
}
```

---

## دورة حياة الوحدة

```mermaid
stateDiagram-v2
    [*] --> Uninstalled

    Uninstalled --> Installing: تثبيت الوحدة
    Installing --> Installed: نجاح
    Installing --> Uninstalled: فشل

    Installed --> Active: التفعيل
    Installed --> Uninstalling: الإزالة

    Active --> Inactive: إلغاء التفعيل
    Active --> Updating: يوجد تحديث

    Inactive --> Active: التفعيل
    Inactive --> Uninstalling: الإزالة

    Updating --> Active: نجاح التحديث
    Updating --> Active: فشل التحديث

    Uninstalling --> Uninstalled: نجاح
    Uninstalling --> Installed: فشل

    Uninstalled --> [*]
```

---

## هيكل xoops_version.php

```php
<?php
// البيانات الأساسية للوحدة
$modversion['name']        = _MI_MYMODULE_NAME;
$modversion['version']     = '1.0.0';
$modversion['description'] = _MI_MYMODULE_DESC;
$modversion['author']      = 'اسمك';
$modversion['credits']     = 'مجتمع XOOPS';
$modversion['license']     = 'GPL 2.0+';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = basename(__DIR__);

// المتطلبات
$modversion['min_php']     = '7.4';
$modversion['min_xoops']   = '2.5.10';
$modversion['min_admin']   = '1.2';
$modversion['min_db']      = ['mysql' => '5.7', 'mysqli' => '5.7'];

// الميزات
$modversion['hasMain']     = 1;
$modversion['hasAdmin']    = 1;
$modversion['hasSearch']   = 1;
$modversion['hasComments'] = 1;
$modversion['hasNotification'] = 1;

// قائمة الإدارة
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// جداول قاعدة البيانات
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    $modversion['dirname'] . '_items',
    $modversion['dirname'] . '_categories',
];

// القوالب
$modversion['templates'] = [
    ['file' => 'mymodule_index.tpl', 'description' => 'قالب الفهرس'],
    ['file' => 'mymodule_item.tpl', 'description' => 'قالب العنصر'],
];

// الكتل
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => _MI_MYMODULE_BLOCK_RECENT,
    'description' => _MI_MYMODULE_BLOCK_RECENT_DESC,
    'show_func'   => 'mymodule_block_recent_show',
    'edit_func'   => 'mymodule_block_recent_edit',
    'options'     => '10|0',
    'template'    => 'mymodule_block_recent.tpl',
];

// خيارات الإعدادات
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

// البحث
$modversion['search'] = [
    'file' => 'include/search.inc.php',
    'func' => 'mymodule_search',
];

// التعليقات
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
    'callbackFile' => 'include/comment_functions.php',
    'callback' => [
        'approve' => 'mymodule_comment_approve',
        'update'  => 'mymodule_comment_update',
    ],
];

// الإخطارات
$modversion['notification'] = [
    'lookup_file' => 'include/notification.inc.php',
    'lookup_func' => 'mymodule_notify_iteminfo',
    'category' => [
        [
            'name'           => 'global',
            'title'          => _MI_MYMODULE_NOTIFY_GLOBAL,
            'description'    => _MI_MYMODULE_NOTIFY_GLOBAL_DESC,
            'subscribe_from' => ['index.php'],
        ],
        [
            'name'           => 'item',
            'title'          => _MI_MYMODULE_NOTIFY_ITEM,
            'description'    => _MI_MYMODULE_NOTIFY_ITEM_DESC,
            'subscribe_from' => ['item.php'],
            'item_name'      => 'item_id',
            'allow_bookmark' => 1,
        ],
    ],
    'event' => [
        [
            'name'          => 'new_item',
            'category'      => 'global',
            'title'         => _MI_MYMODULE_NOTIFY_NEW_ITEM,
            'caption'       => _MI_MYMODULE_NOTIFY_NEW_ITEM_CAP,
            'description'   => _MI_MYMODULE_NOTIFY_NEW_ITEM_DESC,
            'mail_template' => 'notify_newitem',
            'mail_subject'  => _MI_MYMODULE_NOTIFY_NEW_ITEM_SBJ,
        ],
    ],
];
```

---

## نمط مساعد الوحدة

```php
<?php
namespace XoopsModules\MyModule;

class Helper extends \Xmf\Module\Helper
{
    public function __construct()
    {
        $this->dirname = basename(dirname(__DIR__));
    }

    public static function getInstance(): self
    {
        static $instance = null;
        if ($instance === null) {
            $instance = new self();
        }
        return $instance;
    }

    public function getHandler(string $name): ?object
    {
        return $this->getHandlerByName($name);
    }

    public function getConfig(string $name = null)
    {
        return parent::getConfig($name);
    }
}

// الاستخدام
$helper = Helper::getInstance();
$itemHandler = $helper->getHandler('Item');
$perPage = $helper->getConfig('items_per_page');
```

---

## تدفق تثبيت الوحدة

```mermaid
sequenceDiagram
    participant Admin
    participant System
    participant Database
    participant FileSystem

    Admin->>System: تثبيت الوحدة
    System->>FileSystem: قراءة xoops_version.php
    FileSystem-->>System: إعدادات الوحدة

    System->>Database: إنشاء جداول (mysql.sql)
    Database-->>System: تم إنشاء الجداول

    System->>Database: إدراج سجل الوحدة
    System->>Database: إدراج خيارات الإعدادات
    System->>Database: إدراج القوالب
    System->>Database: إدراج الكتل

    System->>FileSystem: ترجمة القوالب
    FileSystem-->>System: تمت الترجمة

    System->>Database: تعيين الوحدة نشطة
    System-->>Admin: انتهى التثبيت
```

---

## التوثيق ذو الصلة

- كائن XoopsObject
- دليل تطوير الوحدات
- بنية XOOPS

---

#xoops #api #module #xoopsmodule #reference
