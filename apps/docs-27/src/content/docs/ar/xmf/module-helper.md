---
title: "مساعد وحدة XMF"
description: "عمليات وحدة مبسطة باستخدام فئة Xmf\Module\Helper والمساعدات ذات الصلة"
dir: rtl
lang: ar
---

توفر فئة `Xmf\Module\Helper` طريقة سهلة للوصول إلى معلومات الوحدة والتكوينات والمعالجات والمزيد. يسهل مساعد الوحدة رمزك ويقلل من الأنماط الحالية.

## نظرة عامة

يوفر مساعد الوحدة:

- وصول التكوين المبسط
- استرجاع كائن الوحدة
- تحقق من الأداة
- حل المسار وعنوان URL
- مساعدات الإذن والجلسة
- إدارة ذاكرة التخزين المؤقت

## الحصول على مساعد الوحدة

### الاستخدام الأساسي

```php
use Xmf\Module\Helper;

// الحصول على مساعد لوحدة محددة
$helper = Helper::getHelper('mymodule');

// المساعد مرتبط تلقائيا بمجلد الوحدة
```

### من الوحدة الحالية

إذا لم تحدد اسم وحدة، فإنها تستخدم الوحدة النشطة الحالية:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## وصول التكوين

### الطريقة التقليدية XOOPS

الحصول على تكوين الوحدة بالطريقة القديمة مفصول:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### طريقة XMF

مع مساعد الوحدة، تصبح المهمة نفسها بسيطة:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## طرق المساعد

### getModule()

يعيد كائن XoopsModule لوحدة المساعد.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

يعيد قيمة تكوين الوحدة أو جميع التكوينات.

```php
// احصل على تكوين واحد مع الافتراضي
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// احصل على جميع التكوينات كمصفوفة
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

يعيد معالج كائن للوحدة.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// استخدم المعالج
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

يحمل ملف لغة الوحدة.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

يتحقق مما إذا كانت هذه الوحدة هي الوحدة النشطة حاليا.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

يتحقق مما إذا كان المستخدم الحالي لديه حقوق إدارية لهذه الوحدة.

```php
if ($helper->isUserAdmin()) {
    // اظهر خيارات الإدارة
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## طرق المسار وعنوان URL

### url($url)

يعيد عنوان URL مطلق لمسار نسبي للوحدة.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

### path($path)

يعيد مسار نظام ملفات مطلق لمسار نسبي للوحدة.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

يعيد عنوان URL مطلق لملفات تحميل الوحدة.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadPath($path)

يعيد مسار نظام ملفات مطلق لملفات تحميل الوحدة.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### redirect($url, $time, $message)

يعيد التوجيه داخل الوحدة إلى عنوان URL نسبي للوحدة.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## دعم التصحيح

### setDebug($bool)

تمكين أو تعطيل وضع التصحيح للمساعد.

```php
$helper->setDebug(true);  // تمكين
$helper->setDebug(false); // تعطيل
$helper->setDebug();      // تمكين (الافتراضي هو true)
```

### addLog($log)

أضف رسالة إلى سجل الوحدة.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## فئات المساعد ذات الصلة

يوفر XMF مساعدين متخصصين يمتدون `Xmf\Module\Helper\AbstractHelper`:

### مساعد الإذن

انظر ../Recipes/Permission-Helper للوثائق التفصيلية.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// التحقق من الإذن
if ($permHelper->checkPermission('view', $itemId)) {
    // المستخدم لديه إذن
}

// التحقق وإعادة التوجيه إذا لم يكن هناك إذن
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### مساعد الجلسة

تخزين جلسة يدرك الوحدة مع الإضافة التلقائية لمفتاح البادئة.

```php
$session = new \Xmf\Module\Helper\Session('mymodule');

// قيمة المخزن
$session->set('last_viewed', $itemId);

// قيمة الاسترجاع
$lastViewed = $session->get('last_viewed', 0);

// حذف القيمة
$session->del('last_viewed');

// امسح جميع بيانات جلسة الوحدة
$session->destroy();
```

### مساعد ذاكرة التخزين المؤقت

التخزين المؤقت يدرك الوحدة مع الإضافة التلقائية لمفتاح البادئة.

```php
$cache = new \Xmf\Module\Helper\Cache('mymodule');

// اكتب إلى ذاكرة التخزين المؤقت (TTL بالثواني)
$cache->write('item_' . $id, $itemData, 3600);

// اقرأ من ذاكرة التخزين المؤقت
$data = $cache->read('item_' . $id, null);

// حذف من ذاكرة التخزين المؤقت
$cache->delete('item_' . $id);

// اقرأ مع إعادة التوليد التلقائية
$data = $cache->cacheRead(
    'expensive_data',
    function() {
        // هذا يعمل فقط عند فقدان ذاكرة التخزين المؤقت
        return computeExpensiveData();
    },
    3600
);
```

## مثال كامل

إليك مثال شامل يستخدم مساعد الوحدة:

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;
use Xmf\Module\Helper\Session;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// تهيئة المساعدات
$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');
$session = new Session('mymodule');

// تحميل اللغة
$helper->loadLanguage('main');

// الحصول على التكوين
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableComments = $helper->getConfig('enable_comments', true);

// معالجة الطلب
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

require_once XOOPS_ROOT_PATH . '/header.php';

switch ($op) {
    case 'view':
        // التحقق من الإذن
        if (!$permHelper->checkPermission('view', $id)) {
            redirect_header($helper->url('index.php'), 3, _NOPERM);
        }

        // التتبع في الجلسة
        $session->set('last_viewed', $id);

        // الحصول على معالج والعنصر
        $itemHandler = $helper->getHandler('items');
        $item = $itemHandler->get($id);

        if (!$item) {
            redirect_header($helper->url('index.php'), 3, 'Item not found');
        }

        // عرض العنصر
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

        // اظهر آخر عرض إذا كان موجودا
        $lastViewed = $session->get('last_viewed', 0);
        if ($lastViewed > 0) {
            $xoopsTpl->assign('last_viewed', $lastViewed);
        }
        break;
}

// رابط الإدارة إذا كان مصرح به
if ($helper->isUserAdmin()) {
    $xoopsTpl->assign('admin_url', $helper->url('admin/index.php'));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## فئة AbstractHelper الأساسية

تمتد جميع فئات مساعد XMF `Xmf\Module\Helper\AbstractHelper`، والتي توفر:

### المُنشئ

```php
public function __construct($dirname)
```

ينشئ مع اسم مجلد الوحدة. إذا كانت فارغة، فإنها تستخدم الوحدة الحالية.

### dirname()

يعيد اسم مجلد الوحدة المرتبط بالمساعد.

```php
$dirname = $helper->dirname();
```

### init()

يُستدعى بواسطة المُنشئ بعد تحميل الوحدة. تجاوز في مساعدين مخصصين لمنطق التهيئة.

## إنشاء مساعدين مخصصين

يمكنك توسيع المساعد لوظائف محددة للوحدة:

```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

class Helper extends \Xmf\Module\Helper\GenericHelper
{
    public function init()
    {
        // تهيئة مخصصة
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

## انظر أيضا

- Getting-Started-with-XMF - استخدام XMF الأساسي
- XMF-Request - معالجة الطلب
- ../Recipes/Permission-Helper - إدارة الأذونات
- ../Recipes/Module-Admin-Pages - إنشاء واجهة الإدارة

---

#xmf #module-helper #configuration #handlers #session #cache
