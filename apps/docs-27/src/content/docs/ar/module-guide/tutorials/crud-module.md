---
title: "بناء وحدة CRUD"
description: "دليل شامل لبناء وحدة CRUD مع عمليات قاعدة البيانات والنماذج وواجهة الإدارة"
dir: rtl
lang: ar
---

# دليل بناء وحدة CRUD

يوضح هذا الدليل كيفية بناء وحدة كاملة لـ CRUD (إنشاء، قراءة، تحديث، حذف) لـ XOOPS. سننشئ وحدة "الملاحظات" التي تسمح للمستخدمين بإدارة الملاحظات الشخصية.

## المتطلبات الأساسية

- أكملت دليل Hello-World-Module
- فهم مفاهيم PHP OOP
- معرفة أساسية بـ SQL

## نظرة عامة على الوحدة

**ميزات وحدة الملاحظات:**
- إنشاء وعرض وتحرير وحذف الملاحظات
- واجهة إدارة
- ملاحظات خاصة بالمستخدم
- تنظيم الفئات
- وظيفة البحث

## الخطوة 1: هيكل المجلد

أنشئ البنية التالية في `/modules/notes/`:

```
/modules/notes/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
        notes.php
        categories.php
    /assets/
        /css/
            style.css
        /images/
            logo.png
    /class/
        Note.php
        NoteHandler.php
        Category.php
        CategoryHandler.php
        Common/
            Breadcrumb.php
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
    /sql/
        mysql.sql
    /templates/
        /admin/
            notes_admin_index.tpl
            notes_admin_notes.tpl
            notes_admin_categories.tpl
        notes_index.tpl
        notes_view.tpl
        notes_edit.tpl
        notes_list.tpl
    index.php
    view.php
    edit.php
    xoops_version.php
```

## الخطوة 2: نمط قاعدة البيانات

أنشئ `sql/mysql.sql`:

```sql
-- نمط قاعدة بيانات وحدة الملاحظات

-- جدول الفئات
CREATE TABLE `notes_categories` (
    `catid` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `weight` INT(5) NOT NULL DEFAULT 0,
    `created` INT(10) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`catid`),
    KEY `idx_weight` (`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- جدول الملاحظات
CREATE TABLE `notes_notes` (
    `noteid` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `catid` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `uid` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `created` INT(10) UNSIGNED NOT NULL DEFAULT 0,
    `updated` INT(10) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`noteid`),
    KEY `idx_catid` (`catid`),
    KEY `idx_uid` (`uid`),
    KEY `idx_status` (`status`),
    KEY `idx_created` (`created`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## الخطوة 3: تعريف الوحدة

أنشئ `xoops_version.php`:

```php
<?php
/**
 * وحدة الملاحظات - تعريف الوحدة
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// المعلومات الأساسية
$modversion['name']        = _MI_NOTES_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_NOTES_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'notes';

// المتطلبات
$modversion['min_php']   = '8.0';
$modversion['min_xoops'] = '2.5.11';

// الإدارة
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// الرئيسية
$modversion['hasMain'] = 1;

// القائمة الفرعية
$modversion['sub'][] = [
    'name' => _MI_NOTES_MENU_LIST,
    'url'  => 'index.php',
];
$modversion['sub'][] = [
    'name' => _MI_NOTES_MENU_ADD,
    'url'  => 'edit.php',
];

// قاعدة البيانات
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'notes_categories',
    'notes_notes',
];

// القوالب
$modversion['templates'][] = ['file' => 'notes_index.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_view.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_edit.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_list.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_index.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_notes.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_categories.tpl', 'description' => ''];

// الإعدادات
$modversion['config'][] = [
    'name'        => 'notes_per_page',
    'title'       => '_MI_NOTES_PERPAGE',
    'description' => '_MI_NOTES_PERPAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

// وظائف التثبيت والتحديث
$modversion['onInstall'] = 'include/install.php';
$modversion['onUpdate']  = 'include/update.php';
```

## الخطوة 4: فئات الكيان

### كيان الملاحظة

أنشئ `class/Note.php`:

```php
<?php
/**
 * فئة كيان الملاحظة
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsObject;

class Note extends XoopsObject
{
    /**
     * المنشئ
     */
    public function __construct()
    {
        parent::__construct();
        $this->initVar('noteid', XOBJ_DTYPE_INT, null, false);
        $this->initVar('catid', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('uid', XOBJ_DTYPE_INT, 0, true);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', true);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, false);
        $this->initVar('created', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('updated', XOBJ_DTYPE_INT, 0, false);
    }

    /**
     * احصل على تاريخ الإنشاء المنسق
     */
    public function getFormattedDate(string $format = 'Y-m-d H:i:s'): string
    {
        $timestamp = (int) $this->getVar('created');
        return date($format, $timestamp);
    }

    /**
     * احصل على اسم مستخدم المؤلف
     */
    public function getAuthorName(): string
    {
        $uid = (int) $this->getVar('uid');
        if ($uid === 0) {
            return 'Anonymous';
        }

        $memberHandler = xoops_getHandler('member');
        $user = $memberHandler->getUser($uid);

        return $user ? $user->getVar('uname') : 'Unknown';
    }

    /**
     * احصل على كائن الفئة
     */
    public function getCategory(): ?Category
    {
        $catid = (int) $this->getVar('catid');
        if ($catid === 0) {
            return null;
        }

        /** @var CategoryHandler $categoryHandler */
        $categoryHandler = xoops_getModuleHandler('category', 'notes');
        return $categoryHandler->get($catid);
    }

    /**
     * احصل على الملاحظة كصفيف للقوالب
     */
    public function toArray(): array
    {
        return [
            'noteid'        => $this->getVar('noteid'),
            'catid'         => $this->getVar('catid'),
            'uid'           => $this->getVar('uid'),
            'title'         => $this->getVar('title'),
            'content'       => $this->getVar('content', 's'),
            'content_short' => $this->getVar('content', 's', 200),
            'status'        => $this->getVar('status'),
            'created'       => $this->getFormattedDate(),
            'author'        => $this->getAuthorName(),
        ];
    }
}
```

### معالج الملاحظة

أنشئ `class/NoteHandler.php`:

```php
<?php
/**
 * فئة معالج الملاحظة
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsPersistableObjectHandler;
use CriteriaCompo;
use Criteria;

class NoteHandler extends XoopsPersistableObjectHandler
{
    /**
     * المنشئ
     */
    public function __construct(\XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'notes_notes',
            Note::class,
            'noteid',
            'title'
        );
    }

    /**
     * احصل على الملاحظات حسب معرف المستخدم
     *
     * @param int $uid معرف المستخدم
     * @param int $limit الحد الأقصى
     * @param int $start الإزاحة
     * @return Note[]
     */
    public function getByUser(int $uid, int $limit = 0, int $start = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('uid', $uid));
        $criteria->add(new Criteria('status', 1));
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * احصل على الملاحظات حسب الفئة
     *
     * @param int $catid معرف الفئة
     * @param int $limit الحد الأقصى
     * @param int $start الإزاحة
     * @return Note[]
     */
    public function getByCategory(int $catid, int $limit = 0, int $start = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('catid', $catid));
        $criteria->add(new Criteria('status', 1));
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * احصل على الملاحظات الأخيرة
     *
     * @param int $limit الحد الأقصى
     * @param int|null $uid مرشح معرف المستخدم الاختياري
     * @return Note[]
     */
    public function getRecent(int $limit = 10, ?int $uid = null): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 1));

        if ($uid !== null) {
            $criteria->add(new Criteria('uid', $uid));
        }

        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * ابحث في الملاحظات
     *
     * @param string $query استعلام البحث
     * @param int|null $uid مرشح معرف المستخدم الاختياري
     * @return Note[]
     */
    public function search(string $query, ?int $uid = null): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 1));

        // البحث في العنوان والمحتوى
        $searchCriteria = new CriteriaCompo();
        $searchCriteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'), 'OR');
        $searchCriteria->add(new Criteria('content', '%' . $query . '%', 'LIKE'), 'OR');
        $criteria->add($searchCriteria);

        if ($uid !== null) {
            $criteria->add(new Criteria('uid', $uid));
        }

        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * عد الملاحظات حسب المستخدم
     *
     * @param int $uid معرف المستخدم
     * @return int
     */
    public function countByUser(int $uid): int
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('uid', $uid));
        $criteria->add(new Criteria('status', 1));

        return $this->getCount($criteria);
    }

    /**
     * احفظ ملاحظة مع طوابع زمنية تلقائية
     *
     * @param Note $note
     * @param bool $force
     * @return bool
     */
    public function insert($note, $force = true): bool
    {
        $now = time();

        if ($note->isNew()) {
            $note->setVar('created', $now);
        }
        $note->setVar('updated', $now);

        return parent::insert($note, $force);
    }
}
```

### كيان الفئة

أنشئ `class/Category.php`:

```php
<?php
/**
 * فئة كيان الفئة
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsObject;

class Category extends XoopsObject
{
    /**
     * المنشئ
     */
    public function __construct()
    {
        parent::__construct();
        $this->initVar('catid', XOBJ_DTYPE_INT, null, false);
        $this->initVar('name', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('description', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('weight', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('created', XOBJ_DTYPE_INT, 0, false);
    }

    /**
     * احصل على الفئة كصفيف
     */
    public function toArray(): array
    {
        return [
            'catid'       => $this->getVar('catid'),
            'name'        => $this->getVar('name'),
            'description' => $this->getVar('description', 's'),
            'weight'      => $this->getVar('weight'),
        ];
    }
}
```

### معالج الفئة

أنشئ `class/CategoryHandler.php`:

```php
<?php
/**
 * فئة معالج الفئة
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsPersistableObjectHandler;
use CriteriaCompo;
use Criteria;

class CategoryHandler extends XoopsPersistableObjectHandler
{
    /**
     * المنشئ
     */
    public function __construct(\XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'notes_categories',
            Category::class,
            'catid',
            'name'
        );
    }

    /**
     * احصل على جميع الفئات مرتبة حسب الوزن
     *
     * @return Category[]
     */
    public function getAllOrdered(): array
    {
        $criteria = new CriteriaCompo();
        $criteria->setSort('weight');
        $criteria->setOrder('ASC');

        return $this->getObjects($criteria);
    }

    /**
     * احصل على الفئات كخيارات التحديد
     *
     * @return array
     */
    public function getSelectOptions(): array
    {
        $options = [0 => _MD_NOTES_NO_CATEGORY];
        $categories = $this->getAllOrdered();

        foreach ($categories as $category) {
            $options[$category->getVar('catid')] = $category->getVar('name');
        }

        return $options;
    }

    /**
     * احفظ الفئة مع طابع زمني تلقائي
     */
    public function insert($category, $force = true): bool
    {
        if ($category->isNew()) {
            $category->setVar('created', time());
        }

        return parent::insert($category, $force);
    }
}
```

## الخطوة 5: ملف التضمين المشترك

أنشئ `include/common.php`:

```php
<?php
/**
 * ملف التضمين المشترك
 */

declare(strict_types=1);

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// ثوابت الوحدة
define('NOTES_DIRNAME', 'notes');
define('NOTES_PATH', XOOPS_ROOT_PATH . '/modules/' . NOTES_DIRNAME);
define('NOTES_URL', XOOPS_URL . '/modules/' . NOTES_DIRNAME);

// تحميل ملفات الفئات
require_once NOTES_PATH . '/class/Category.php';
require_once NOTES_PATH . '/class/CategoryHandler.php';
require_once NOTES_PATH . '/class/Note.php';
require_once NOTES_PATH . '/class/NoteHandler.php';

/**
 * احصل على مساعد وحدة الملاحظات
 */
function notesHelper(): \Xmf\Module\Helper
{
    return \Xmf\Module\Helper::getHelper('notes');
}

/**
 * احصل على نسخة معالج الملاحظة
 */
function noteHandler(): \XoopsModules\Notes\NoteHandler
{
    return xoops_getModuleHandler('note', 'notes');
}

/**
 * احصل على نسخة معالج الفئة
 */
function categoryHandler(): \XoopsModules\Notes\CategoryHandler
{
    return xoops_getModuleHandler('category', 'notes');
}
```

## الخطوة 6: صفحات الواجهة الأمامية

### صفحة الفهرس

أنشئ `index.php`:

```php
<?php
/**
 * فهرس الملاحظات - اعرض قائمة ملاحظات المستخدم
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';
require_once __DIR__ . '/include/common.php';

xoops_loadLanguage('main', 'notes');

// المتطلب الدخول
if (!$GLOBALS['xoopsUser']) {
    redirect_header(XOOPS_URL . '/user.php', 3, _NOPERM);
    exit;
}

$uid = $GLOBALS['xoopsUser']->getVar('uid');
$helper = notesHelper();
$perPage = $helper->getConfig('notes_per_page');

// احصل على رقم الصفحة
$start = Request::getInt('start', 0, 'GET');

// احصل على الملاحظات
$noteHandler = noteHandler();
$categoryHandler = categoryHandler();

$totalNotes = $noteHandler->countByUser($uid);
$notes = $noteHandler->getByUser($uid, $perPage, $start);

// حضر الملاحظات للقالب
$notesArray = [];
foreach ($notes as $note) {
    $notesArray[] = $note->toArray();
}

// احصل على الفئات للتصفية
$categories = $categoryHandler->getAllOrdered();
$categoriesArray = [];
foreach ($categories as $category) {
    $categoriesArray[] = $category->toArray();
}

// اضبط القالب
$GLOBALS['xoopsOption']['template_main'] = 'notes_index.tpl';
require XOOPS_ROOT_PATH . '/header.php';

// عيّن إلى القالب
$xoopsTpl->assign([
    'notes'       => $notesArray,
    'categories'  => $categoriesArray,
    'total_notes' => $totalNotes,
    'module_url'  => NOTES_URL,
]);

// الترقيم
if ($totalNotes > $perPage) {
    require_once XOOPS_ROOT_PATH . '/class/pagenav.php';
    $nav = new \XoopsPageNav($totalNotes, $perPage, $start, 'start');
    $xoopsTpl->assign('pagination', $nav->renderNav());
}

require XOOPS_ROOT_PATH . '/footer.php';
```

### صفحة العرض

أنشئ `view.php`:

```php
<?php
/**
 * اعرض ملاحظة واحدة
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';
require_once __DIR__ . '/include/common.php';

xoops_loadLanguage('main', 'notes');

// المتطلب الدخول
if (!$GLOBALS['xoopsUser']) {
    redirect_header(XOOPS_URL . '/user.php', 3, _NOPERM);
    exit;
}

$uid = $GLOBALS['xoopsUser']->getVar('uid');
$noteid = Request::getInt('id', 0, 'GET');

if ($noteid <= 0) {
    redirect_header(NOTES_URL . '/index.php', 3, _MD_NOTES_NOT_FOUND);
    exit;
}

$noteHandler = noteHandler();
$note = $noteHandler->get($noteid);

if (!$note || $note->getVar('uid') != $uid) {
    redirect_header(NOTES_URL . '/index.php', 3, _NOPERM);
    exit;
}

// اضبط القالب
$GLOBALS['xoopsOption']['template_main'] = 'notes_view.tpl';
require XOOPS_ROOT_PATH . '/header.php';

$xoopsTpl->assign([
    'note'       => $note->toArray(),
    'module_url' => NOTES_URL,
]);

require XOOPS_ROOT_PATH . '/footer.php';
```

### صفحة التحرير (إنشاء/تحديث)

أنشئ `edit.php`:

```php
<?php
/**
 * إنشاء/تحرير ملاحظة
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';
require_once __DIR__ . '/include/common.php';

xoops_loadLanguage('main', 'notes');

// المتطلب الدخول
if (!$GLOBALS['xoopsUser']) {
    redirect_header(XOOPS_URL . '/user.php', 3, _NOPERM);
    exit;
}

$uid = $GLOBALS['xoopsUser']->getVar('uid');
$noteid = Request::getInt('id', 0, 'REQUEST');
$op = Request::getString('op', 'form', 'REQUEST');

$noteHandler = noteHandler();
$categoryHandler = categoryHandler();

// احصل على أو أنشئ ملاحظة
if ($noteid > 0) {
    $note = $noteHandler->get($noteid);
    if (!$note || $note->getVar('uid') != $uid) {
        redirect_header(NOTES_URL . '/index.php', 3, _NOPERM);
        exit;
    }
    $isNew = false;
} else {
    $note = $noteHandler->create();
    $note->setVar('uid', $uid);
    $isNew = true;
}

// تعامل مع تقديم النموذج
if ($op === 'save') {
    // فحص CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header(NOTES_URL . '/index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
        exit;
    }

    // احصل على بيانات النموذج
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $catid = Request::getInt('catid', 0, 'POST');

    // تحقق
    $errors = [];
    if (empty($title)) {
        $errors[] = _MD_NOTES_ERR_TITLE_REQUIRED;
    }
    if (empty($content)) {
        $errors[] = _MD_NOTES_ERR_CONTENT_REQUIRED;
    }

    if (!empty($errors)) {
        redirect_header(
            NOTES_URL . '/edit.php?id=' . $noteid,
            3,
            implode('<br>', $errors)
        );
        exit;
    }

    // عيّن القيم
    $note->setVar('title', $title);
    $note->setVar('content', $content);
    $note->setVar('catid', $catid);

    // احفظ
    if ($noteHandler->insert($note)) {
        redirect_header(
            NOTES_URL . '/view.php?id=' . $note->getVar('noteid'),
            2,
            $isNew ? _MD_NOTES_CREATED : _MD_NOTES_UPDATED
        );
    } else {
        redirect_header(
            NOTES_URL . '/edit.php?id=' . $noteid,
            3,
            _MD_NOTES_ERR_SAVE
        );
    }
    exit;
}

// تعامل مع الحذف
if ($op === 'delete' && $noteid > 0) {
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header(NOTES_URL . '/index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
        exit;
    }

    if ($noteHandler->delete($note)) {
        redirect_header(NOTES_URL . '/index.php', 2, _MD_NOTES_DELETED);
    } else {
        redirect_header(NOTES_URL . '/index.php', 3, _MD_NOTES_ERR_DELETE);
    }
    exit;
}

// اعرض النموذج
$GLOBALS['xoopsOption']['template_main'] = 'notes_edit.tpl';
require XOOPS_ROOT_PATH . '/header.php';

// احصل على الفئات للقائمة المنسدلة
$categories = $categoryHandler->getSelectOptions();

$xoopsTpl->assign([
    'note'       => $note->toArray(),
    'categories' => $categories,
    'is_new'     => $isNew,
    'module_url' => NOTES_URL,
    'token'      => $GLOBALS['xoopsSecurity']->getTokenHTML(),
]);

require XOOPS_ROOT_PATH . '/footer.php';
```

## الخطوة 7: القوالب

### قالب الفهرس

أنشئ `templates/notes_index.tpl`:

```smarty
<{* قالب فهرس الملاحظات *}>

<div class="notes-container">
    <div class="notes-header">
        <h1><{$smarty.const._MD_NOTES_MY_NOTES}></h1>
        <a href="<{$module_url}>/edit.php" class="btn btn-primary">
            <{$smarty.const._MD_NOTES_ADD_NEW}>
        </a>
    </div>

    <{if $notes}>
        <div class="notes-list">
            <{foreach from=$notes item=note}>
                <div class="note-item">
                    <h3>
                        <a href="<{$module_url}>/view.php?id=<{$note.noteid}>">
                            <{$note.title}>
                        </a>
                    </h3>
                    <div class="note-meta">
                        <span class="date"><{$note.created}></span>
                    </div>
                    <div class="note-excerpt">
                        <{$note.content_short|truncate:200}>
                    </div>
                    <div class="note-actions">
                        <a href="<{$module_url}>/view.php?id=<{$note.noteid}>">
                            <{$smarty.const._MD_NOTES_VIEW}>
                        </a>
                        <a href="<{$module_url}>/edit.php?id=<{$note.noteid}>">
                            <{$smarty.const._MD_NOTES_EDIT}>
                        </a>
                    </div>
                </div>
            <{/foreach}>
        </div>

        <{if $pagination}>
            <div class="notes-pagination">
                <{$pagination}>
            </div>
        <{/if}>
    <{else}>
        <div class="notes-empty">
            <p><{$smarty.const._MD_NOTES_NO_NOTES}></p>
            <a href="<{$module_url}>/edit.php" class="btn btn-primary">
                <{$smarty.const._MD_NOTES_CREATE_FIRST}>
            </a>
        </div>
    <{/if}>
</div>
```

### قالب العرض

أنشئ `templates/notes_view.tpl`:

```smarty
<{* قالب عرض الملاحظة *}>

<div class="note-view">
    <div class="note-header">
        <h1><{$note.title}></h1>
        <div class="note-meta">
            <span class="date"><{$note.created}></span>
            <span class="author"><{$note.author}></span>
        </div>
    </div>

    <div class="note-content">
        <{$note.content}>
    </div>

    <div class="note-actions">
        <a href="<{$module_url}>/edit.php?id=<{$note.noteid}>" class="btn btn-secondary">
            <{$smarty.const._MD_NOTES_EDIT}>
        </a>
        <a href="<{$module_url}>/index.php" class="btn btn-link">
            <{$smarty.const._MD_NOTES_BACK_LIST}>
        </a>
    </div>
</div>
```

### قالب التحرير

أنشئ `templates/notes_edit.tpl`:

```smarty
<{* قالب تحرير الملاحظة *}>

<div class="note-edit">
    <h1>
        <{if $is_new}>
            <{$smarty.const._MD_NOTES_ADD_NEW}>
        <{else}>
            <{$smarty.const._MD_NOTES_EDIT_NOTE}>
        <{/if}>
    </h1>

    <form action="<{$module_url}>/edit.php" method="post" class="note-form">
        <{$token}>
        <input type="hidden" name="op" value="save">
        <input type="hidden" name="id" value="<{$note.noteid}>">

        <div class="form-group">
            <label for="title"><{$smarty.const._MD_NOTES_TITLE}></label>
            <input type="text"
                   name="title"
                   id="title"
                   class="form-control"
                   value="<{$note.title}>"
                   required>
        </div>

        <div class="form-group">
            <label for="catid"><{$smarty.const._MD_NOTES_CATEGORY}></label>
            <select name="catid" id="catid" class="form-control">
                <{foreach from=$categories key=id item=name}>
                    <option value="<{$id}>" <{if $note.catid == $id}>selected<{/if}>>
                        <{$name}>
                    </option>
                <{/foreach}>
            </select>
        </div>

        <div class="form-group">
            <label for="content"><{$smarty.const._MD_NOTES_CONTENT}></label>
            <textarea name="content"
                      id="content"
                      class="form-control"
                      rows="10"
                      required><{$note.content}></textarea>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-primary">
                <{$smarty.const._MD_NOTES_SAVE}>
            </button>
            <a href="<{$module_url}>/index.php" class="btn btn-link">
                <{$smarty.const._MD_NOTES_CANCEL}>
            </a>
            <{if !$is_new}>
                <button type="submit"
                        name="op"
                        value="delete"
                        class="btn btn-danger"
                        onclick="return confirm('<{$smarty.const._MD_NOTES_CONFIRM_DELETE}>');">
                    <{$smarty.const._MD_NOTES_DELETE}>
                </button>
            <{/if}>
        </div>
    </form>
</div>
```

## الخطوة 8: ملف اللغة

أنشئ `language/english/main.php`:

```php
<?php
/**
 * ملف اللغة الرئيسية
 */

// عناوين الصفحات
define('_MD_NOTES_MY_NOTES', 'My Notes');
define('_MD_NOTES_ADD_NEW', 'Add New Note');
define('_MD_NOTES_EDIT_NOTE', 'Edit Note');

// تسميات النموذج
define('_MD_NOTES_TITLE', 'Title');
define('_MD_NOTES_CONTENT', 'Content');
define('_MD_NOTES_CATEGORY', 'Category');
define('_MD_NOTES_NO_CATEGORY', '-- No Category --');

// الأزرار
define('_MD_NOTES_SAVE', 'Save');
define('_MD_NOTES_CANCEL', 'Cancel');
define('_MD_NOTES_DELETE', 'Delete');
define('_MD_NOTES_VIEW', 'View');
define('_MD_NOTES_EDIT', 'Edit');
define('_MD_NOTES_BACK_LIST', 'Back to List');

// الرسائل
define('_MD_NOTES_CREATED', 'Note created successfully.');
define('_MD_NOTES_UPDATED', 'Note updated successfully.');
define('_MD_NOTES_DELETED', 'Note deleted successfully.');
define('_MD_NOTES_NOT_FOUND', 'Note not found.');
define('_MD_NOTES_NO_NOTES', 'You have no notes yet.');
define('_MD_NOTES_CREATE_FIRST', 'Create Your First Note');
define('_MD_NOTES_CONFIRM_DELETE', 'Are you sure you want to delete this note?');

// الأخطاء
define('_MD_NOTES_ERR_TITLE_REQUIRED', 'Title is required.');
define('_MD_NOTES_ERR_CONTENT_REQUIRED', 'Content is required.');
define('_MD_NOTES_ERR_SAVE', 'Error saving note.');
define('_MD_NOTES_ERR_DELETE', 'Error deleting note.');
```

## الخطوة 9: واجهة الإدارة

### قائمة الإدارة

أنشئ `admin/menu.php`:

```php
<?php
$adminmenu = [];

$adminmenu[] = [
    'title' => _AM_NOTES_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];

$adminmenu[] = [
    'title' => _AM_NOTES_NOTES,
    'link'  => 'admin/notes.php',
    'icon'  => 'content.png',
];

$adminmenu[] = [
    'title' => _AM_NOTES_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => 'category.png',
];
```

### إدارة الملاحظات في الإدارة

أنشئ `admin/notes.php`:

```php
<?php
/**
 * إدارة ملاحظات الإدارة
 */

declare(strict_types=1);

use Xmf\Request;

require_once __DIR__ . '/admin_header.php';

$op = Request::getString('op', 'list', 'REQUEST');
$noteid = Request::getInt('id', 0, 'REQUEST');

$noteHandler = noteHandler();

switch ($op) {
    case 'delete':
        if ($noteid > 0) {
            $note = $noteHandler->get($noteid);
            if ($note && $noteHandler->delete($note)) {
                redirect_header('notes.php', 2, _AM_NOTES_DELETED);
            } else {
                redirect_header('notes.php', 3, _AM_NOTES_ERR_DELETE);
            }
        }
        break;

    case 'list':
    default:
        $adminObject->displayNavigation('notes.php');

        // احصل على جميع الملاحظات
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $notes = $noteHandler->getObjects($criteria);

        // عرض الجدول
        echo '<table class="outer">';
        echo '<tr class="head"><th>' . _AM_NOTES_ID . '</th>';
        echo '<th>' . _AM_NOTES_TITLE . '</th>';
        echo '<th>' . _AM_NOTES_AUTHOR . '</th>';
        echo '<th>' . _AM_NOTES_DATE . '</th>';
        echo '<th>' . _AM_NOTES_ACTIONS . '</th></tr>';

        foreach ($notes as $note) {
            echo '<tr class="even">';
            echo '<td>' . $note->getVar('noteid') . '</td>';
            echo '<td>' . $note->getVar('title') . '</td>';
            echo '<td>' . $note->getAuthorName() . '</td>';
            echo '<td>' . $note->getFormattedDate() . '</td>';
            echo '<td>';
            echo '<a href="notes.php?op=delete&id=' . $note->getVar('noteid') . '" ';
            echo 'onclick="return confirm(\'' . _AM_NOTES_CONFIRM_DELETE . '\');">';
            echo _AM_NOTES_DELETE . '</a>';
            echo '</td></tr>';
        }

        echo '</table>';
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

## الملخص

تهانينا! لقد بنيت وحدة CRUD كاملة. المفاهيم الرئيسية المغطاة:

1. **تصميم قاعدة البيانات** - الجداول مع العلاقات
2. **فئات الكيانات** - XoopsObject مع الخصائص المكتوبة
3. **فئات المعالجة** - XoopsPersistableObjectHandler مع الطرق المخصصة
4. **صفحات الواجهة الأمامية** - وظيفة قائمة وعرض وتحرير
5. **معالجة النموذج** - الحماية من CSRF والتحقق
6. **واجهة الإدارة** - شاشات الإدارة
7. **القوالب** - قوالب Smarty مع المنطق

## الخطوات التالية

- أضف ميزات أكثر تقدماً (تعليقات، تقييمات، مشاركة)
- نفذ ../Patterns/Repository-Pattern للوصول أنظف إلى البيانات
- طبق ../Patterns/MVC-Pattern لتنظيم كود أفضل
- أضف ../Best-Practices/Testing مع PHPUnit

انظر أيضاً: ../Module-Development | ../Patterns/MVC-Pattern | ../Patterns/Repository-Pattern
