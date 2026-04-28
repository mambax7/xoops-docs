---
title: "構建一個 CRUD 模塊"
description: "具有數據庫操作、表單和管理界面的完整 CRUD 模塊構建教程"
---

# 構建 CRUD 模塊教程

本教程逐步指導您為 XOOPS 構建完整的 CRUD（創建、讀取、更新、刪除）模塊。我們將創建一個"便簽"模塊，允許用戶管理個人便簽。

## 先決條件

- 完成 Hello-World-Module 教程
- 對 PHP OOP 概念的理解
- 基本 SQL 知識

## 模塊概述

**便簽模塊功能：**
- 創建、查看、編輯和刪除便簽
- 管理管理界面
- 用戶特定便簽
- 分類組織
- 搜索功能

## 步驟 1：目錄結構

在 `/modules/notes/` 中創建以下結構：

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

## 步驟 2：數據庫架構

創建 `sql/mysql.sql`：

```sql
-- 便簽模塊數據庫架構

-- 分類表
CREATE TABLE `notes_categories` (
    `catid` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `weight` INT(5) NOT NULL DEFAULT 0,
    `created` INT(10) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`catid`),
    KEY `idx_weight` (`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 便簽表
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

## 步驟 3：模塊定義

創建 `xoops_version.php`：

```php
<?php
/**
 * 便簽模塊 - 模塊定義
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// 基本信息
$modversion['name']        = _MI_NOTES_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_NOTES_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'notes';

// 需求
$modversion['min_php']   = '8.0';
$modversion['min_xoops'] = '2.5.11';

// 管理
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// 主頁
$modversion['hasMain'] = 1;

// 子菜單
$modversion['sub'][] = [
    'name' => _MI_NOTES_MENU_LIST,
    'url'  => 'index.php',
];
$modversion['sub'][] = [
    'name' => _MI_NOTES_MENU_ADD,
    'url'  => 'edit.php',
];

// 數據庫
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'notes_categories',
    'notes_notes',
];

// 模板
$modversion['templates'][] = ['file' => 'notes_index.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_view.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_edit.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_list.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_index.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_notes.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_categories.tpl', 'description' => ''];

// 配置
$modversion['config'][] = [
    'name'        => 'notes_per_page',
    'title'       => '_MI_NOTES_PERPAGE',
    'description' => '_MI_NOTES_PERPAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

// 安裝/更新功能
$modversion['onInstall'] = 'include/install.php';
$modversion['onUpdate']  = 'include/update.php';
```

## 步驟 4：實體類

### 便簽實體

創建 `class/Note.php`：

```php
<?php
/**
 * 便簽實體類
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsObject;

class Note extends XoopsObject
{
    /**
     * 構造函數
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
     * 獲取格式化創建日期
     */
    public function getFormattedDate(string $format = 'Y-m-d H:i:s'): string
    {
        $timestamp = (int) $this->getVar('created');
        return date($format, $timestamp);
    }

    /**
     * 獲取作者用戶名
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
     * 獲取分類對象
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
     * 以數組形式獲取便簽用於模板
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

### 便簽處理程序

創建 `class/NoteHandler.php`：

```php
<?php
/**
 * 便簽處理程序類
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsPersistableObjectHandler;
use CriteriaCompo;
use Criteria;

class NoteHandler extends XoopsPersistableObjectHandler
{
    /**
     * 構造函數
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
     * 按用戶 ID 獲取便簽
     *
     * @param int $uid 用戶 ID
     * @param int $limit 限制
     * @param int $start 開始偏移
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
     * 按分類獲取便簽
     *
     * @param int $catid 分類 ID
     * @param int $limit 限制
     * @param int $start 開始偏移
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
     * 獲取最近便簽
     *
     * @param int $limit 限制
     * @param int|null $uid 可選用戶 ID 篩選
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
     * 搜索便簽
     *
     * @param string $query 搜索查詢
     * @param int|null $uid 可選用戶 ID 篩選
     * @return Note[]
     */
    public function search(string $query, ?int $uid = null): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 1));

        // 在標題和內容中搜索
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
     * 按用戶計數便簽
     *
     * @param int $uid 用戶 ID
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
     * 帶有自動時間戳的便簽保存
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

### 分類實體

創建 `class/Category.php`：

```php
<?php
/**
 * 分類實體類
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsObject;

class Category extends XoopsObject
{
    /**
     * 構造函數
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
     * 以數組形式獲取分類
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

### 分類處理程序

創建 `class/CategoryHandler.php`：

```php
<?php
/**
 * 分類處理程序類
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsPersistableObjectHandler;
use CriteriaCompo;
use Criteria;

class CategoryHandler extends XoopsPersistableObjectHandler
{
    /**
     * 構造函數
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
     * 按權重獲取所有分類
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
     * 獲取分類作為選擇選項
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
     * 帶有自動時間戳的保存分類
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

## 步驟 5：通用包含文件

創建 `include/common.php`：

```php
<?php
/**
 * 通用包含文件
 */

declare(strict_types=1);

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// 模塊常量
define('NOTES_DIRNAME', 'notes');
define('NOTES_PATH', XOOPS_ROOT_PATH . '/modules/' . NOTES_DIRNAME);
define('NOTES_URL', XOOPS_URL . '/modules/' . NOTES_DIRNAME);

// 加載類文件
require_once NOTES_PATH . '/class/Category.php';
require_once NOTES_PATH . '/class/CategoryHandler.php';
require_once NOTES_PATH . '/class/Note.php';
require_once NOTES_PATH . '/class/NoteHandler.php';

/**
 * 獲取便簽模塊幫助程序
 */
function notesHelper(): \Xmf\Module\Helper
{
    return \Xmf\Module\Helper::getHelper('notes');
}

/**
 * 獲取便簽處理程序實例
 */
function noteHandler(): \XoopsModules\Notes\NoteHandler
{
    return xoops_getModuleHandler('note', 'notes');
}

/**
 * 獲取分類處理程序實例
 */
function categoryHandler(): \XoopsModules\Notes\CategoryHandler
{
    return xoops_getModuleHandler('category', 'notes');
}
```

## 步驟 6：前端頁面

### 索引頁面

創建 `index.php`：

```php
<?php
/**
 * 便簽索引 - 列表用戶的便簽
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';
require_once __DIR__ . '/include/common.php';

xoops_loadLanguage('main', 'notes');

// 需要登錄
if (!$GLOBALS['xoopsUser']) {
    redirect_header(XOOPS_URL . '/user.php', 3, _NOPERM);
    exit;
}

$uid = $GLOBALS['xoopsUser']->getVar('uid');
$helper = notesHelper();
$perPage = $helper->getConfig('notes_per_page');

// 獲取頁數
$start = Request::getInt('start', 0, 'GET');

// 獲取便簽
$noteHandler = noteHandler();
$categoryHandler = categoryHandler();

$totalNotes = $noteHandler->countByUser($uid);
$notes = $noteHandler->getByUser($uid, $perPage, $start);

// 準備便簽用於模板
$notesArray = [];
foreach ($notes as $note) {
    $notesArray[] = $note->toArray();
}

// 獲取用於篩選的分類
$categories = $categoryHandler->getAllOrdered();
$categoriesArray = [];
foreach ($categories as $category) {
    $categoriesArray[] = $category->toArray();
}

// 設置模板
$GLOBALS['xoopsOption']['template_main'] = 'notes_index.tpl';
require XOOPS_ROOT_PATH . '/header.php';

// 分配給模板
$xoopsTpl->assign([
    'notes'       => $notesArray,
    'categories'  => $categoriesArray,
    'total_notes' => $totalNotes,
    'module_url'  => NOTES_URL,
]);

// 分頁
if ($totalNotes > $perPage) {
    require_once XOOPS_ROOT_PATH . '/class/pagenav.php';
    $nav = new \XoopsPageNav($totalNotes, $perPage, $start, 'start');
    $xoopsTpl->assign('pagination', $nav->renderNav());
}

require XOOPS_ROOT_PATH . '/footer.php';
```

### 查看頁面

創建 `view.php`：

```php
<?php
/**
 * 查看單個便簽
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';
require_once __DIR__ . '/include/common.php';

xoops_loadLanguage('main', 'notes');

// 需要登錄
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

// 設置模板
$GLOBALS['xoopsOption']['template_main'] = 'notes_view.tpl';
require XOOPS_ROOT_PATH . '/header.php';

$xoopsTpl->assign([
    'note'       => $note->toArray(),
    'module_url' => NOTES_URL,
]);

require XOOPS_ROOT_PATH . '/footer.php';
```

### 編輯頁面（創建/更新）

創建 `edit.php`：

```php
<?php
/**
 * 創建/編輯便簽
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';
require_once __DIR__ . '/include/common.php';

xoops_loadLanguage('main', 'notes');

// 需要登錄
if (!$GLOBALS['xoopsUser']) {
    redirect_header(XOOPS_URL . '/user.php', 3, _NOPERM);
    exit;
}

$uid = $GLOBALS['xoopsUser']->getVar('uid');
$noteid = Request::getInt('id', 0, 'REQUEST');
$op = Request::getString('op', 'form', 'REQUEST');

$noteHandler = noteHandler();
$categoryHandler = categoryHandler();

// 獲取或創建便簽
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

// 處理表單提交
if ($op === 'save') {
    // CSRF 檢查
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header(NOTES_URL . '/index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
        exit;
    }

    // 獲取表單數據
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $catid = Request::getInt('catid', 0, 'POST');

    // 驗證
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

    // 設置值
    $note->setVar('title', $title);
    $note->setVar('content', $content);
    $note->setVar('catid', $catid);

    // 保存
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

// 處理刪除
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

// 顯示表單
$GLOBALS['xoopsOption']['template_main'] = 'notes_edit.tpl';
require XOOPS_ROOT_PATH . '/header.php';

// 獲取下拉列表的分類
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

## 步驟 7：模板

### 索引模板

創建 `templates/notes_index.tpl`：

```smarty
<{* 便簽索引模板 *}>

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

### 查看模板

創建 `templates/notes_view.tpl`：

```smarty
<{* 便簽查看模板 *}>

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

### 編輯模板

創建 `templates/notes_edit.tpl`：

```smarty
<{* 便簽編輯模板 *}>

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

## 步驟 8：語言文件

創建 `language/english/main.php`：

```php
<?php
/**
 * 主語言文件
 */

// 頁面標題
define('_MD_NOTES_MY_NOTES', 'My Notes');
define('_MD_NOTES_ADD_NEW', 'Add New Note');
define('_MD_NOTES_EDIT_NOTE', 'Edit Note');

// 表單標籤
define('_MD_NOTES_TITLE', 'Title');
define('_MD_NOTES_CONTENT', 'Content');
define('_MD_NOTES_CATEGORY', 'Category');
define('_MD_NOTES_NO_CATEGORY', '-- No Category --');

// 按鈕
define('_MD_NOTES_SAVE', 'Save');
define('_MD_NOTES_CANCEL', 'Cancel');
define('_MD_NOTES_DELETE', 'Delete');
define('_MD_NOTES_VIEW', 'View');
define('_MD_NOTES_EDIT', 'Edit');
define('_MD_NOTES_BACK_LIST', 'Back to List');

// 消息
define('_MD_NOTES_CREATED', 'Note created successfully.');
define('_MD_NOTES_UPDATED', 'Note updated successfully.');
define('_MD_NOTES_DELETED', 'Note deleted successfully.');
define('_MD_NOTES_NOT_FOUND', 'Note not found.');
define('_MD_NOTES_NO_NOTES', 'You have no notes yet.');
define('_MD_NOTES_CREATE_FIRST', 'Create Your First Note');
define('_MD_NOTES_CONFIRM_DELETE', 'Are you sure you want to delete this note?');

// 錯誤
define('_MD_NOTES_ERR_TITLE_REQUIRED', 'Title is required.');
define('_MD_NOTES_ERR_CONTENT_REQUIRED', 'Content is required.');
define('_MD_NOTES_ERR_SAVE', 'Error saving note.');
define('_MD_NOTES_ERR_DELETE', 'Error deleting note.');
```

## 步驟 9：管理界面

### 管理菜單

創建 `admin/menu.php`：

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

### 管理便簽管理

創建 `admin/notes.php`：

```php
<?php
/**
 * 管理便簽管理
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

        // 獲取所有便簽
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $notes = $noteHandler->getObjects($criteria);

        // 顯示表格
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

## 總結

恭喜！您已構建了一個完整的 CRUD 模塊。涵蓋的關鍵概念：

1. **數據庫設計** - 具有關係的表
2. **實體類** - 具有類型化屬性的 XoopsObject
3. **處理程序類** - 具有自定義方法的 XoopsPersistableObjectHandler
4. **前端頁面** - 列表、查看和編輯功能
5. **表單處理** - CSRF 保護和驗證
6. **管理界面** - 管理屏幕
7. **模板** - 帶有邏輯的 Smarty 模板

## 後續步驟

- 添加更多高級功能（評論、評分、共享）
- 為更清潔的數據訪問實現 ../Patterns/Repository-Pattern
- 應用 ../Patterns/MVC-Pattern 以獲得更好的代碼組織
- 添加 ../Best-Practices/Testing with PHPUnit

另見：../Module-Development | ../Patterns/MVC-Pattern | ../Patterns/Repository-Pattern
