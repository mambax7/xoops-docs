---
title: "XoopsModule APIリファレンス"
description: "XoopsModuleとモジュールシステムクラスの完全なAPIリファレンス"
---

> XOOPSモジュールシステムの完全なAPIドキュメンテーション

---

## モジュールシステムアーキテクチャ

```mermaid
graph TB
    subgraph "モジュール読み込み"
        A[リクエスト] --> B[ルーター]
        B --> C{モジュルが存在?}
        C -->|Yes| D[xoops_version.phpをロード]
        C -->|No| E[404エラー]
        D --> F[モジュールを初期化]
        F --> G[権限をチェック]
        G --> H[コントローラーを実行]
    end

    subgraph "モジュールコンポーネント"
        I[XoopsModule] --> J[設定]
        I --> K[テンプレート]
        I --> L[ブロック]
        I --> M[ハンドラー]
        I --> N[プリロード]
    end

    H --> I
```

---

## XoopsModuleクラス

### クラス定義

```php
class XoopsModule extends XoopsObject
{
    // プロパティ
    public $modinfo;      // モジュール情報配列
    public $adminmenu;    // 管理メニューアイテム

    // メソッド
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

### プロパティ

| プロパティ | 型 | 説明 |
|----------|------|-------------|
| `mid` | int | モジュールID |
| `name` | string | 表示名 |
| `version` | string | バージョン番号 |
| `dirname` | string | ディレクトリ名 |
| `isactive` | int | アクティブステータス (0/1) |
| `hasmain` | int | メインエリアがある |
| `hasadmin` | int | 管理エリアがある |
| `hassearch` | int | 検索機能がある |
| `hasconfig` | int | 設定がある |
| `hascomments` | int | コメントがある |
| `hasnotification` | int | 通知がある |

### キーメソッド

```php
// モジュールインスタンスを取得
$module = $GLOBALS['xoopsModule'];

// またはディレクトリ名でロード
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');

// モジュール情報を取得
$version = $module->getVar('version');
$name = $module->getVar('name');
$dirname = $module->getVar('dirname');

// モジュール設定を取得
$config = $module->getConfig();
$specificConfig = $module->getConfig('items_per_page');

// モジュールに機能があるかをチェック
$hasAdmin = $module->getVar('hasadmin');
$hasSearch = $module->getVar('hassearch');

// モジュールパスを取得
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $module->getVar('dirname');
$moduleUrl = XOOPS_URL . '/modules/' . $module->getVar('dirname');
```

---

## XoopsModuleHandler

### クラス定義

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

### 使用例

```php
// ハンドラーを取得
$moduleHandler = xoops_getHandler('module');

// すべてのアクティブなモジュールを取得
$criteria = new Criteria('isactive', 1);
$activeModules = $moduleHandler->getObjects($criteria);

// ディレクトリ名でモジュールを取得
$publisherModule = $moduleHandler->getByDirname('publisher');

// 管理を持つモジュールを取得
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('isactive', 1));
$criteria->add(new Criteria('hasadmin', 1));
$adminModules = $moduleHandler->getObjects($criteria);

// モジュールがインストールされているかをチェック
$module = $moduleHandler->getByDirname('mymodule');
if ($module && $module->getVar('isactive')) {
    // モジュールがインストール済みでアクティブ
}
```

---

## モジュールライフサイクル

```mermaid
stateDiagram-v2
    [*] --> Uninstalled

    Uninstalled --> Installing: モジュールをインストール
    Installing --> Installed: 成功
    Installing --> Uninstalled: 失敗

    Installed --> Active: アクティベート
    Installed --> Uninstalling: アンインストール

    Active --> Inactive: ディアクティベート
    Active --> Updating: アップデート利用可能

    Inactive --> Active: アクティベート
    Inactive --> Uninstalling: アンインストール

    Updating --> Active: アップデート成功
    Updating --> Active: アップデート失敗

    Uninstalling --> Uninstalled: 成功
    Uninstalling --> Installed: 失敗

    Uninstalled --> [*]
```

---

## xoops_version.php構造

```php
<?php
// モジュールメタデータ
$modversion['name']        = _MI_MYMODULE_NAME;
$modversion['version']     = '1.0.0';
$modversion['description'] = _MI_MYMODULE_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['license']     = 'GPL 2.0+';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = basename(__DIR__);

// 要件
$modversion['min_php']     = '7.4';
$modversion['min_xoops']   = '2.5.10';
$modversion['min_admin']   = '1.2';
$modversion['min_db']      = ['mysql' => '5.7', 'mysqli' => '5.7'];

// 機能
$modversion['hasMain']     = 1;
$modversion['hasAdmin']    = 1;
$modversion['hasSearch']   = 1;
$modversion['hasComments'] = 1;
$modversion['hasNotification'] = 1;

// 管理メニュー
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// データベーステーブル
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    $modversion['dirname'] . '_items',
    $modversion['dirname'] . '_categories',
];

// テンプレート
$modversion['templates'] = [
    ['file' => 'mymodule_index.tpl', 'description' => 'インデックステンプレート'],
    ['file' => 'mymodule_item.tpl', 'description' => 'アイテムテンプレート'],
];

// ブロック
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => _MI_MYMODULE_BLOCK_RECENT,
    'description' => _MI_MYMODULE_BLOCK_RECENT_DESC,
    'show_func'   => 'mymodule_block_recent_show',
    'edit_func'   => 'mymodule_block_recent_edit',
    'options'     => '10|0',
    'template'    => 'mymodule_block_recent.tpl',
];

// 設定オプション
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

// 検索
$modversion['search'] = [
    'file' => 'include/search.inc.php',
    'func' => 'mymodule_search',
];

// コメント
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
    'callbackFile' => 'include/comment_functions.php',
    'callback' => [
        'approve' => 'mymodule_comment_approve',
        'update'  => 'mymodule_comment_update',
    ],
];

// 通知
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

## モジュールヘルパーパターン

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

// 使用
$helper = Helper::getInstance();
$itemHandler = $helper->getHandler('Item');
$perPage = $helper->getConfig('items_per_page');
```

---

## モジュールインストールフロー

```mermaid
sequenceDiagram
    participant Admin
    participant System
    participant Database
    participant FileSystem

    Admin->>System: モジュールをインストール
    System->>FileSystem: xoops_version.phpを読み取り
    FileSystem-->>System: モジュール設定

    System->>Database: テーブルを作成 (mysql.sql)
    Database-->>System: テーブルが作成される

    System->>Database: モジュールレコードを挿入
    System->>Database: 設定オプションを挿入
    System->>Database: テンプレートを挿入
    System->>Database: ブロックを挿入

    System->>FileSystem: テンプレートをコンパイル
    FileSystem-->>System: テンプレートがコンパイル

    System->>Database: モジュールをアクティブに設定
    System-->>Admin: インストール完了
```

---

## 関連ドキュメンテーション

- XoopsObject API
- モジュール開発ガイド
- XOOPSアーキテクチャ

---

#xoops #api #module #xoopsmodule #reference
