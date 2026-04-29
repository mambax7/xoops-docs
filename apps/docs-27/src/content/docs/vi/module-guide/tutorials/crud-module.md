---
title: "Xây dựng mô-đun CRUD"
description: "Hướng dẫn đầy đủ để xây dựng mô-đun CRUD với các hoạt động, biểu mẫu cơ sở dữ liệu và giao diện admin"
---
# Hướng dẫn xây dựng mô-đun CRUD

Hướng dẫn này hướng dẫn bạn cách xây dựng mô-đun CRUD (Tạo, Đọc, Cập nhật, Xóa) hoàn chỉnh cho XOOPS. Chúng tôi sẽ tạo mô-đun "Ghi chú" cho phép người dùng quản lý ghi chú cá nhân.

## Điều kiện tiên quyết

- Đã hoàn thành hướng dẫn Mô-đun Hello-World
- Hiểu biết về các khái niệm OOP PHP
- Kiến thức cơ bản về SQL

## Tổng quan về mô-đun

**Tính năng của mô-đun ghi chú:**
- Tạo, xem, chỉnh sửa và xóa ghi chú
- Giao diện quản lý quản trị
- Ghi chú dành riêng cho người dùng
- Tổ chức hạng mục
- Chức năng tìm kiếm

## Bước 1: Cấu trúc thư mục

Tạo cấu trúc sau trong `/modules/notes/`:

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

## Bước 2: Lược đồ cơ sở dữ liệu

Tạo `sql/mysql.sql`:

```sql
-- Notes Module Database Schema

-- Categories Table
CREATE TABLE `notes_categories` (
    `catid` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `weight` INT(5) NOT NULL DEFAULT 0,
    `created` INT(10) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`catid`),
    KEY `idx_weight` (`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notes Table
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

## Bước 3: Định nghĩa mô-đun

Tạo `xoops_version.php`:

```php
<?php
/**
 * Notes Module - Module Definition
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Basic Information
$modversion['name']        = _MI_NOTES_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_NOTES_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'notes';

// Requirements
$modversion['min_php']   = '8.0';
$modversion['min_xoops'] = '2.5.11';

// Admin
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main
$modversion['hasMain'] = 1;

// Submenu
$modversion['sub'][] = [
    'name' => _MI_NOTES_MENU_LIST,
    'url'  => 'index.php',
];
$modversion['sub'][] = [
    'name' => _MI_NOTES_MENU_ADD,
    'url'  => 'edit.php',
];

// Database
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'notes_categories',
    'notes_notes',
];

// Templates
$modversion['templates'][] = ['file' => 'notes_index.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_view.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_edit.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_list.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_index.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_notes.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_categories.tpl', 'description' => ''];

// Configuration
$modversion['config'][] = [
    'name'        => 'notes_per_page',
    'title'       => '_MI_NOTES_PERPAGE',
    'description' => '_MI_NOTES_PERPAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

// Install/Update Functions
$modversion['onInstall'] = 'include/install.php';
$modversion['onUpdate']  = 'include/update.php';
```

## Bước 4: Lớp thực thể

### Thực thể ghi chú

Tạo `class/Note.php`:

```php
<?php
/**
 * Note Entity Class
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsObject;

class Note extends XoopsObject
{
    /**
     * Constructor
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
     * Get formatted creation date
     */
    public function getFormattedDate(string $format = 'Y-m-d H:i:s'): string
    {
        $timestamp = (int) $this->getVar('created');
        return date($format, $timestamp);
    }

    /**
     * Get the author's username
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
     * Get category object
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
     * Get note as array for templates
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

### Trình xử lý ghi chú

Tạo `class/NoteHandler.php`:

```php
<?php
/**
 * Note Handler Class
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsPersistableObjectHandler;
use CriteriaCompo;
use Criteria;

class NoteHandler extends XoopsPersistableObjectHandler
{
    /**
     * Constructor
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
     * Get notes by user ID
     *
     * @param int $uid User ID
     * @param int $limit Limit
     * @param int $start Start offset
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
     * Get notes by category
     *
     * @param int $catid Category ID
     * @param int $limit Limit
     * @param int $start Start offset
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
     * Get recent notes
     *
     * @param int $limit Limit
     * @param int|null $uid Optional user ID filter
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
     * Search notes
     *
     * @param string $query Search query
     * @param int|null $uid Optional user ID filter
     * @return Note[]
     */
    public function search(string $query, ?int $uid = null): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 1));

        // Search in title and content
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
     * Count notes by user
     *
     * @param int $uid User ID
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
     * Save a note with automatic timestamps
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

### Thực thể danh mục

Tạo `class/Category.php`:

```php
<?php
/**
 * Category Entity Class
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsObject;

class Category extends XoopsObject
{
    /**
     * Constructor
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
     * Get category as array
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

### Trình xử lý danh mục

Tạo `class/CategoryHandler.php`:

```php
<?php
/**
 * Category Handler Class
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsPersistableObjectHandler;
use CriteriaCompo;
use Criteria;

class CategoryHandler extends XoopsPersistableObjectHandler
{
    /**
     * Constructor
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
     * Get all categories ordered by weight
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
     * Get categories as select options
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
     * Save category with automatic timestamp
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

## Bước 5: Tệp bao gồm chung

Tạo `include/common.php`:

```php
<?php
/**
 * Common Include File
 */

declare(strict_types=1);

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Module constants
define('NOTES_DIRNAME', 'notes');
define('NOTES_PATH', XOOPS_ROOT_PATH . '/modules/' . NOTES_DIRNAME);
define('NOTES_URL', XOOPS_URL . '/modules/' . NOTES_DIRNAME);

// Load class files
require_once NOTES_PATH . '/class/Category.php';
require_once NOTES_PATH . '/class/CategoryHandler.php';
require_once NOTES_PATH . '/class/Note.php';
require_once NOTES_PATH . '/class/NoteHandler.php';

/**
 * Get the Notes module helper
 */
function notesHelper(): \Xmf\Module\Helper
{
    return \Xmf\Module\Helper::getHelper('notes');
}

/**
 * Get note handler instance
 */
function noteHandler(): \XoopsModules\Notes\NoteHandler
{
    return xoops_getModuleHandler('note', 'notes');
}

/**
 * Get category handler instance
 */
function categoryHandler(): \XoopsModules\Notes\CategoryHandler
{
    return xoops_getModuleHandler('category', 'notes');
}
```

## Bước 6: Giao diện trang

### Trang chỉ mục

Tạo `index.php`:

```php
<?php
/**
 * Notes Index - List User's Notes
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';
require_once __DIR__ . '/include/common.php';

xoops_loadLanguage('main', 'notes');

// Require login
if (!$GLOBALS['xoopsUser']) {
    redirect_header(XOOPS_URL . '/user.php', 3, _NOPERM);
    exit;
}

$uid = $GLOBALS['xoopsUser']->getVar('uid');
$helper = notesHelper();
$perPage = $helper->getConfig('notes_per_page');

// Get page number
$start = Request::getInt('start', 0, 'GET');

// Get notes
$noteHandler = noteHandler();
$categoryHandler = categoryHandler();

$totalNotes = $noteHandler->countByUser($uid);
$notes = $noteHandler->getByUser($uid, $perPage, $start);

// Prepare notes for template
$notesArray = [];
foreach ($notes as $note) {
    $notesArray[] = $note->toArray();
}

// Get categories for filter
$categories = $categoryHandler->getAllOrdered();
$categoriesArray = [];
foreach ($categories as $category) {
    $categoriesArray[] = $category->toArray();
}

// Set template
$GLOBALS['xoopsOption']['template_main'] = 'notes_index.tpl';
require XOOPS_ROOT_PATH . '/header.php';

// Assign to template
$xoopsTpl->assign([
    'notes'       => $notesArray,
    'categories'  => $categoriesArray,
    'total_notes' => $totalNotes,
    'module_url'  => NOTES_URL,
]);

// Pagination
if ($totalNotes > $perPage) {
    require_once XOOPS_ROOT_PATH . '/class/pagenav.php';
    $nav = new \XoopsPageNav($totalNotes, $perPage, $start, 'start');
    $xoopsTpl->assign('pagination', $nav->renderNav());
}

require XOOPS_ROOT_PATH . '/footer.php';
```

### Xem trang

Tạo `view.php`:

```php
<?php
/**
 * View Single Note
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';
require_once __DIR__ . '/include/common.php';

xoops_loadLanguage('main', 'notes');

// Require login
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

// Set template
$GLOBALS['xoopsOption']['template_main'] = 'notes_view.tpl';
require XOOPS_ROOT_PATH . '/header.php';

$xoopsTpl->assign([
    'note'       => $note->toArray(),
    'module_url' => NOTES_URL,
]);

require XOOPS_ROOT_PATH . '/footer.php';
```

### Chỉnh sửa trang (Tạo/Cập nhật)

Tạo `edit.php`:

```php
<?php
/**
 * Create/Edit Note
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';
require_once __DIR__ . '/include/common.php';

xoops_loadLanguage('main', 'notes');

// Require login
if (!$GLOBALS['xoopsUser']) {
    redirect_header(XOOPS_URL . '/user.php', 3, _NOPERM);
    exit;
}

$uid = $GLOBALS['xoopsUser']->getVar('uid');
$noteid = Request::getInt('id', 0, 'REQUEST');
$op = Request::getString('op', 'form', 'REQUEST');

$noteHandler = noteHandler();
$categoryHandler = categoryHandler();

// Get or create note
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

// Handle form submission
if ($op === 'save') {
    // CSRF check
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header(NOTES_URL . '/index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
        exit;
    }

    // Get form data
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $catid = Request::getInt('catid', 0, 'POST');

    // Validate
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

    // Set values
    $note->setVar('title', $title);
    $note->setVar('content', $content);
    $note->setVar('catid', $catid);

    // Save
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

// Handle delete
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

// Display form
$GLOBALS['xoopsOption']['template_main'] = 'notes_edit.tpl';
require XOOPS_ROOT_PATH . '/header.php';

// Get categories for dropdown
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

## Bước 7: Mẫu

### Mẫu chỉ mục

Tạo `templates/notes_index.tpl`:

```smarty
<{* Notes Index Template *}>

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

### Xem mẫu

Tạo `templates/notes_view.tpl`:

```smarty
<{* Note View Template *}>

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

### Chỉnh sửa mẫu

Tạo `templates/notes_edit.tpl`:

```smarty
<{* Note Edit Template *}>

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

## Bước 8: Tệp ngôn ngữ

Tạo `language/english/main.php`:

```php
<?php
/**
 * Main Language File
 */

// Page Titles
define('_MD_NOTES_MY_NOTES', 'My Notes');
define('_MD_NOTES_ADD_NEW', 'Add New Note');
define('_MD_NOTES_EDIT_NOTE', 'Edit Note');

// Form Labels
define('_MD_NOTES_TITLE', 'Title');
define('_MD_NOTES_CONTENT', 'Content');
define('_MD_NOTES_CATEGORY', 'Category');
define('_MD_NOTES_NO_CATEGORY', '-- No Category --');

// Buttons
define('_MD_NOTES_SAVE', 'Save');
define('_MD_NOTES_CANCEL', 'Cancel');
define('_MD_NOTES_DELETE', 'Delete');
define('_MD_NOTES_VIEW', 'View');
define('_MD_NOTES_EDIT', 'Edit');
define('_MD_NOTES_BACK_LIST', 'Back to List');

// Messages
define('_MD_NOTES_CREATED', 'Note created successfully.');
define('_MD_NOTES_UPDATED', 'Note updated successfully.');
define('_MD_NOTES_DELETED', 'Note deleted successfully.');
define('_MD_NOTES_NOT_FOUND', 'Note not found.');
define('_MD_NOTES_NO_NOTES', 'You have no notes yet.');
define('_MD_NOTES_CREATE_FIRST', 'Create Your First Note');
define('_MD_NOTES_CONFIRM_DELETE', 'Are you sure you want to delete this note?');

// Errors
define('_MD_NOTES_ERR_TITLE_REQUIRED', 'Title is required.');
define('_MD_NOTES_ERR_CONTENT_REQUIRED', 'Content is required.');
define('_MD_NOTES_ERR_SAVE', 'Error saving note.');
define('_MD_NOTES_ERR_DELETE', 'Error deleting note.');
```

## Bước 9: Giao diện quản trị

### Menu quản trị

Tạo `admin/menu.php`:

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

### Quản lý ghi chú của quản trị viên

Tạo `admin/notes.php`:

```php
<?php
/**
 * Admin Notes Management
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

        // Get all notes
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $notes = $noteHandler->getObjects($criteria);

        // Display table
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

## Tóm tắt

Xin chúc mừng! Bạn đã xây dựng được mô-đun CRUD hoàn chỉnh. Các khái niệm chính được đề cập:

1. **Thiết kế cơ sở dữ liệu** - Các bảng có mối quan hệ
2. **Các lớp thực thể** - XoopsObject với các thuộc tính đã nhập
3. **Các lớp trình xử lý** - XoopsPersistableObjectHandler với các phương thức tùy chỉnh
4. **Trang giao diện** - Chức năng liệt kê, xem và chỉnh sửa
5. **Xử lý biểu mẫu** - Bảo vệ và xác thực CSRF
6. **Giao diện quản trị** - Màn hình quản lý
7. **Mẫu** - Smarty templates có logic

## Các bước tiếp theo

- Thêm nhiều tính năng nâng cao (bình luận, xếp hạng, chia sẻ)
- Triển khai ../Patterns/Repository-Pattern để truy cập dữ liệu sạch hơn
- Áp dụng ../Patterns/MVC-Pattern để tổ chức mã tốt hơn
- Thêm ../Thực hành tốt nhất/Thử nghiệm với PHPUnit

Xem thêm: ../Module-Phát triển | ../Patterns/MVC-Pattern | ../Patterns/Repository-Pattern