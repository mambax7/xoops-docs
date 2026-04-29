---
title: "CRUDモジュール構築"
description: "データベース操作、フォーム、管理インターフェースを備えた完全なCRUDモジュール構築チュートリアル"
---

# CRUDモジュール チュートリアル

このチュートリアルはXOOPS用の完全なCRUD（作成、読み取り、更新、削除）モジュール構築のプロセスをウォークスルーします。ユーザーが個人的なノートを管理できる「ノート」モジュールを作成します。

## 前提条件

- Hello World モジュール チュートリアルを完了
- PHPオブジェクト指向概念の理解
- 基本的なSQL知識

## モジュール概要

**ノートモジュール機能:**
- ノートを作成、表示、編集、削除
- 管理管理インターフェース
- ユーザー固有のノート
- カテゴリー整理
- 検索機能

## ステップ1: ディレクトリ構造

`/modules/notes/` に以下を作成:

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

## ステップ2: データベーススキーマ

`sql/mysql.sql` を作成:

```sql
-- ノートモジュールデータベーススキーマ

-- カテゴリーテーブル
CREATE TABLE `notes_categories` (
    `catid` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `weight` INT(5) NOT NULL DEFAULT 0,
    `created` INT(10) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`catid`),
    KEY `idx_weight` (`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ノーテーブル
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

## ステップ3: モジュール定義

`xoops_version.php` を作成:

```php
<?php
/**
 * ノートモジュール - モジュール定義
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPSルートパスが定義されていません');
}

$modversion = [];

// 基本情報
$modversion['name']        = _MI_NOTES_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_NOTES_DESC;
$modversion['author']      = 'あなたの名前';
$modversion['credits']     = 'XOOPS Community';
$modversion['license']     = 'GPL 2.0 以降';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'notes';

// 必要条件
$modversion['min_php']   = '8.0';
$modversion['min_xoops'] = '2.5.11';

// 管理
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// メイン
$modversion['hasMain'] = 1;

// サブメニュー
$modversion['sub'][] = [
    'name' => _MI_NOTES_MENU_LIST,
    'url'  => 'index.php',
];
$modversion['sub'][] = [
    'name' => _MI_NOTES_MENU_ADD,
    'url'  => 'edit.php',
];

// データベース
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'notes_categories',
    'notes_notes',
];

// テンプレート
$modversion['templates'][] = ['file' => 'notes_index.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_view.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_edit.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'notes_list.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_index.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_notes.tpl', 'description' => ''];
$modversion['templates'][] = ['file' => 'admin/notes_admin_categories.tpl', 'description' => ''];

// 設定
$modversion['config'][] = [
    'name'        => 'notes_per_page',
    'title'       => '_MI_NOTES_PERPAGE',
    'description' => '_MI_NOTES_PERPAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

// インストール/更新関数
$modversion['onInstall'] = 'include/install.php';
$modversion['onUpdate']  = 'include/update.php';
```

## ステップ4 以降の主要コンポーネント

### エンティティクラス (class/Note.php)

```php
<?php
/**
 * ノートエンティティクラス
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsObject;

class Note extends XoopsObject
{
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

    public function getFormattedDate(string $format = 'Y-m-d H:i:s'): string
    {
        $timestamp = (int) $this->getVar('created');
        return date($format, $timestamp);
    }

    public function getAuthorName(): string
    {
        $uid = (int) $this->getVar('uid');
        if ($uid === 0) {
            return '匿名';
        }

        $memberHandler = xoops_getHandler('member');
        $user = $memberHandler->getUser($uid);

        return $user ? $user->getVar('uname') : '不明';
    }

    public function toArray(): array
    {
        return [
            'noteid'        => $this->getVar('noteid'),
            'catid'         => $this->getVar('catid'),
            'uid'           => $this->getVar('uid'),
            'title'         => $this->getVar('title'),
            'content'       => $this->getVar('content', 's'),
            'status'        => $this->getVar('status'),
            'created'       => $this->getFormattedDate(),
            'author'        => $this->getAuthorName(),
        ];
    }
}
```

### ハンドラークラス (class/NoteHandler.php)

ハンドラーは`XoopsPersistableObjectHandler`を拡張し、カスタムクエリメソッドを提供します:

```php
<?php
/**
 * ノートハンドラークラス
 */

declare(strict_types=1);

namespace XoopsModules\Notes;

use XoopsPersistableObjectHandler;
use CriteriaCompo;
use Criteria;

class NoteHandler extends XoopsPersistableObjectHandler
{
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

    public function countByUser(int $uid): int
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('uid', $uid));
        $criteria->add(new Criteria('status', 1));

        return $this->getCount($criteria);
    }
}
```

## フロントエンドページ

### index.php - ノートリスト

```php
<?php
/**
 * ノートインデックス - ユーザーのノートリスト
 */

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/mainfile.php';
require_once __DIR__ . '/include/common.php';

xoops_loadLanguage('main', 'notes');

// ログインを要求
if (!$GLOBALS['xoopsUser']) {
    redirect_header(XOOPS_URL . '/user.php', 3, _NOPERM);
    exit;
}

$uid = $GLOBALS['xoopsUser']->getVar('uid');
$helper = notesHelper();
$perPage = $helper->getConfig('notes_per_page');

$start = Request::getInt('start', 0, 'GET');

$noteHandler = noteHandler();
$totalNotes = $noteHandler->countByUser($uid);
$notes = $noteHandler->getByUser($uid, $perPage, $start);

$notesArray = [];
foreach ($notes as $note) {
    $notesArray[] = $note->toArray();
}

$GLOBALS['xoopsOption']['template_main'] = 'notes_index.tpl';
require XOOPS_ROOT_PATH . '/header.php';

$xoopsTpl->assign([
    'notes'       => $notesArray,
    'total_notes' => $totalNotes,
    'module_url'  => NOTES_URL,
]);

require XOOPS_ROOT_PATH . '/footer.php';
```

### edit.php - ノート作成/編集

`edit.php` はフォーム処理、CSRF保護、バリデーションを処理します。

## テンプレート例

### notes_index.tpl

```smarty
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
                </div>
            <{/foreach}>
        </div>
    <{else}>
        <p><{$smarty.const._MD_NOTES_NO_NOTES}></p>
    <{/if}>
</div>
```

## まとめ

このチュートリアルをフォローすることで、完全なCRUDモジュールが完成します。カバーされた主要な概念:

1. **データベース設計** - リレーションシップを持つテーブル
2. **エンティティクラス** - 型付きプロパティ付きXoopsObject
3. **ハンドラークラス** - XoopsPersistableObjectHandlerを拡張
4. **フロントエンドページ** - リスト、表示、編集機能
5. **フォーム処理** - CSRF保護とバリデーション
6. **管理インターフェース** - 管理スクリーン
7. **テンプレート** - Smarty テンプレートのロジック

## 次のステップ

さらに機能を追加:
- コメント、評価、共有を実装
- ../Patterns/Repository-Pattern でデータアクセスを改善
- ../Best-Practices/Testing でPHPUnitテストを追加

関連トピック: ../Module-Development | ../Patterns/MVC-Pattern | ../Patterns/Repository-Pattern
