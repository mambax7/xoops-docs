---
title: "権限ヘルパー"
description: "XMF権限ヘルパーでXOOPSグループ権限を管理"
---

XOOPSには、ユーザーグループメンバーシップに基づいた強力で柔軟な権限システムがあります。XMF権限ヘルパーはこれらの権限を簡素化し、複雑な権限チェックを単一のメソッド呼び出しに削減します。

## 概要

XOOPS権限システムは、以下をグループに関連付けます:
- モジュールID
- 権限名
- アイテムID

従来、権限をチェックするにはユーザーグループを見つけ、モジュールIDを検索し、権限テーブルをクエリする必要がありました。XMF権限ヘルパーはこれらすべてを自動的に処理します。

## 使い始める

### 権限ヘルパーの作成

```php
// 現在のモジュール用
$permHelper = new \Xmf\Module\Helper\Permission();

// 特定のモジュール用
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```

ヘルパーは自動的に現在のユーザーのグループと指定されたモジュールのIDを使用します。

## 権限をチェック

### ユーザーは権限を持っているか？

現在のユーザーが特定のアイテムに対して特定の権限を持っているかをチェック:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// ユーザーがトピックID 42を表示できるかをチェック
$canView = $permHelper->checkPermission('viewtopic', 42);

if ($canView) {
    // トピックを表示
} else {
    // アクセス拒否メッセージを表示
}
```

### リダイレクト付きチェック

権限がないユーザーを自動的にリダイレクト:

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// 権限がない場合は3秒後にindex.phpにリダイレクト
$permHelper->checkPermissionRedirect(
    'viewtopic',
    $topicId,
    'index.php',
    3,
    'You are not allowed to view that topic'
);

// このコードはユーザーが権限を持っている場合のみ実行
displayTopic($topicId);
```

### 管理者オーバーライド

デフォルトでは、管理者ユーザーは常に権限を持ちます。管理者もチェックするには:

```php
// 通常のチェック - 管理者は常に権限を持つ
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// 管理者もチェック (第3パラメータ = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```

### 許可されたアイテムIDを取得

特定のグループが権限を持つすべてのアイテムIDを取得:

```php
// 現在のユーザーのグループが表示可能なアイテムを取得
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// 特定のグループが表示可能なアイテムを取得
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// クエリで使用
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```

## 権限を管理

### アイテムのグループを取得

どのグループが特定の権限を持っているかを見つけ:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// トピック42を表示できるグループを取得
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// 返す: [1, 2, 5] (グループIDの配列)
```

### 権限を保存

特定のグループに権限を付与:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// グループ1、2、3がトピック42を表示することを許可
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

### 権限を削除

アイテムのすべての権限を削除 (通常はアイテム削除時):

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// このトピックの表示権限を削除
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

複数の権限タイプの場合:

```php
// 複数の権限タイプを一度に削除
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```

## フォーム統合

### フォームにグループ選択を追加

ヘルパーはグループを選択するためのフォーム要素を作成できます:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// フォームを構築
$form = new XoopsThemeForm('Edit Topic', 'topicform', 'save.php');

// タイトルフィールドなどを追加
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $topic->getVar('title')));

// 権限セレクタを追加
$form->addElement(
    $permHelper->getGroupSelectFormForItem(
        'viewtopic',                           // 権限名
        $topicId,                              // アイテムID
        'Groups with View Topic Permission'   // キャプション
    )
);

$form->addElement(new XoopsFormButton('', 'submit', 'Save', 'submit'));
```

### フォーム要素オプション

完全なメソッドシグネチャ:

```php
getGroupSelectFormForItem(
    $gperm_name,      // 権限名
    $gperm_itemid,    // アイテムID
    $caption,         // フォーム要素キャプション
    $name,            // 要素名 (空の場合は自動生成)
    $include_anon,    // 匿名グループを含める (デフォルト: false)
    $size,            // 表示行数 (デフォルト: 5)
    $multiple         // 複数選択を許可 (デフォルト: true)
)
```

### フォーム提出を処理

```php
use Xmf\Request;

$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = Request::getInt('topic_id', 0);

// 自動生成されたフィールド名を取得
$fieldName = $permHelper->defaultFieldName('viewtopic', $topicId);

// フォームから選択されたグループを取得
$selectedGroups = Request::getArray($fieldName, [], 'POST');

// 権限を保存
$permHelper->savePermissionForItem('viewtopic', $topicId, $selectedGroups);
```

### デフォルトフィールド名

ヘルパーは一貫性のあるフィールド名を生成:

```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// 返すもの例: 'mymodule_viewtopic_42'
```

## 完全な例: 権限保護されたアイテム

### 権限付きのアイテムを作成

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$op = Request::getCmd('op', 'form');
$itemId = Request::getInt('id', 0);

switch ($op) {
    case 'save':
        // アイテムデータを保存
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
        }

        $item->setVar('title', Request::getString('title', ''));
        $item->setVar('content', Request::getText('content', ''));

        if ($handler->insert($item)) {
            $newId = $item->getVar('item_id');

            // 表示権限を保存
            $viewFieldName = $permHelper->defaultFieldName('view', $newId);
            $viewGroups = Request::getArray($viewFieldName, [], 'POST');
            $permHelper->savePermissionForItem('view', $newId, $viewGroups);

            // 編集権限を保存
            $editFieldName = $permHelper->defaultFieldName('edit', $newId);
            $editGroups = Request::getArray($editFieldName, [], 'POST');
            $permHelper->savePermissionForItem('edit', $newId, $editGroups);

            redirect_header('index.php', 2, 'Item saved');
        }
        break;

    case 'form':
    default:
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
            $itemId = 0;
        }

        $form = new XoopsThemeForm('Edit Item', 'itemform', 'edit.php');
        $form->addElement(new XoopsFormHidden('op', 'save'));
        $form->addElement(new XoopsFormHidden('id', $itemId));

        $form->addElement(new XoopsFormText('Title', 'title', 50, 255, $item->getVar('title')));
        $form->addElement(new XoopsFormTextArea('Content', 'content', $item->getVar('content')));

        // 表示権限セレクタ
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('view', $itemId, 'Groups that can view')
        );

        // 編集権限セレクタ
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('edit', $itemId, 'Groups that can edit')
        );

        $form->addElement(new XoopsFormButton('', 'submit', 'Save', 'submit'));

        $form->display();
        break;
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### 権限チェック付きで表示

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// 表示権限をチェック - 拒否されたらリダイレクト
$permHelper->checkPermissionRedirect(
    'view',
    $itemId,
    'index.php',
    3,
    'You do not have permission to view this item'
);

require_once XOOPS_ROOT_PATH . '/header.php';

// ユーザーは権限を持っています、アイテムを表示
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

$xoopsTpl->assign('item', $item->toArray());

// ユーザーが編集権限を持っている場合のみ編集ボタンを表示
if ($permHelper->checkPermission('edit', $itemId)) {
    $xoopsTpl->assign('can_edit', true);
    $xoopsTpl->assign('edit_url', $helper->url('edit.php?id=' . $itemId));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### 権限クリーンアップ付きで削除

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// アイテムを削除
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

if ($item && $handler->delete($item)) {
    // このアイテムのすべての権限をクリーンアップ
    $permissionNames = ['view', 'edit', 'delete'];
    $permHelper->deletePermissionForItem($permissionNames, $itemId);

    redirect_header('index.php', 2, 'Item deleted');
}
```

## APIリファレンス

| メソッド | 説明 |
|---------|------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | ユーザーが権限を持っているかをチェック |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | チェックして拒否されたらリダイレクト |
| `getItemIds($name, $groupIds)` | グループがアクセス可能なアイテムIDを取得 |
| `getGroupsForItem($name, $itemId)` | 権限を持つグループを取得 |
| `savePermissionForItem($name, $itemId, $groups)` | 権限を保存 |
| `deletePermissionForItem($name, $itemId)` | 権限を削除 |
| `getGroupSelectFormForItem(...)` | フォーム選択要素を作成 |
| `defaultFieldName($name, $itemId)` | デフォルトのフォームフィールド名を取得 |

## 関連項目

- ../Basics/XMF-Module-Helper - モジュールヘルパードキュメント
- Module-Admin-Pages - 管理インターフェース作成
- ../Basics/Getting-Started-with-XMF - XMFの基本

---

#xmf #permissions #security #groups #forms
