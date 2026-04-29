---
title: "モジュール FAQ"
description: "XOOPS モジュールについてのよくある質問"
---

# モジュール よくある質問

> XOOPS モジュール、インストール、管理についてのよくある質問と回答。

---

## インストールと有効化

### Q: XOOPS にモジュールをインストールするには？

**A:**
1. モジュール zip ファイルをダウンロード
2. XOOPS 管理 > モジュール > モジュール管理 に移動
3. 「参照」をクリックして zip ファイルを選択
4. 「アップロード」をクリック
5. モジュールがリストに表示（通常、非有効化状態）
6. 有効化アイコンをクリックして有効化

別の方法として、zip ファイルを `/xoops_root/modules/` に直接展開して、管理パネルに移動することもできます。

---

### Q: モジュールアップロードが「アクセス拒否」で失敗します

**A:** これはファイルパーミッションの問題です：

```bash
# モジュールディレクトリのパーミッションを修正
chmod 755 /path/to/xoops/modules

# アップロードディレクトリを修正（アップロード時）
chmod 777 /path/to/xoops/uploads

# 必要に応じて所有権を修正
chown -R www-data:www-data /path/to/xoops
```

詳細は「モジュールインストール失敗」を参照してください。

---

### Q: インストール後、管理パネルにモジュールが表示されません

**A:** 以下を確認してください：

1. **モジュールが有効化されていない** - モジュールリストで目玉アイコンをクリック
2. **管理ページがない** - モジュールは xoopsversion.php で `hasAdmin = 1` が必要
3. **言語ファイルが見つからない** - `language/english/admin.php` が必要
4. **キャッシュがクリアされていない** - キャッシュをクリアしてブラウザをリフレッシュ

```bash
# XOOPS キャッシュをクリア
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### Q: モジュールをアンインストールするには？

**A:**
1. XOOPS 管理 > モジュール > モジュール管理 に移動
2. モジュールを非有効化（目玉アイコンをクリック）
3. ゴミ箱/削除アイコンをクリック
4. 完全に削除したい場合、モジュールフォルダを手動で削除：

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## モジュール管理

### Q: 無効化とアンインストールの違いは何ですか？

**A:**
- **無効化**: モジュールを非有効化（目玉アイコンをクリック）。データベーステーブルは残ります。
- **アンインストール**: モジュールを削除。データベーステーブルを削除してリストから削除します。

完全に削除するには、フォルダも削除します：
```bash
rm -rf modules/modulename
```

---

### Q: モジュールが正しくインストールされているかどうか確認するには？

**A:** デバッグスクリプトを使用：

```php
<?php
// admin/debug_modules.php を作成
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('管理者のみ');
}

echo "<h1>モジュール デバッグ</h1>";

// すべてのモジュールをリスト
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "ステータス: " . ($module->getVar('isactive') ? "有効" : "無効") . "<br>";
    echo "ディレクトリ: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "バージョン: " . $module->getVar('version') . "<br>";
}
?>
```

---

### Q: 同じモジュールの複数バージョンを実行できますか？

**A:** いいえ、XOOPS はネイティブでこれをサポートしていません。ただし、以下の方法があります：

1. 異なるディレクトリ名でコピーを作成：`mymodule` と `mymodule2`
2. 両方のモジュールの xoopsversion.php で dirname を更新
3. ユニークなデータベーステーブル名を確保

これは推奨されません。同じコードを共有しているためです。

---

## モジュール設定

### Q: モジュール設定はどこにありますか？

**A:**
1. XOOPS 管理 > モジュール に移動
2. モジュールの横にある設定/ギアアイコンをクリック
3. 環境設定を設定

設定は `xoops_config` テーブルに保存されます。

**コード内でアクセス：**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```

---

### Q: モジュール設定オプションを定義するには？

**A:** xoopsversion.php で：

```php
<?php
$modversion['config'] = [
    [
        'name' => 'items_per_page',
        'title' => '_AM_MYMODULE_ITEMS_PER_PAGE',
        'description' => '_AM_MYMODULE_ITEMS_PER_PAGE_DESC',
        'formtype' => 'text',
        'valuetype' => 'int',
        'default' => 10
    ],
    [
        'name' => 'enable_feature',
        'title' => '_AM_MYMODULE_ENABLE_FEATURE',
        'description' => '_AM_MYMODULE_ENABLE_FEATURE_DESC',
        'formtype' => 'yesno',
        'valuetype' => 'bool',
        'default' => 1
    ]
];
?>
```

---

## モジュール機能

### Q: モジュールに管理ページを追加するには？

**A:** 構造を作成：

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

xoopsversion.php で：
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

`admin/index.php` を作成：
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>モジュール管理</h1>";
xoops_cp_footer();
?>
```

---

### Q: モジュールに検索機能を追加するには？

**A:**
1. xoopsversion.php で設定：
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. `search.php` を作成：
```php
<?php
function mymodule_search($queryArray, $andor, $limit, $offset) {
    // 検索実装
    $results = [];
    return $results;
}
?>
```

---

### Q: モジュールに通知を追加するには？

**A:**
1. xoopsversion.php で設定：
```php
<?php
$modversion['hasNotification'] = 1;
$modversion['notification_categories'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
$modversion['notifications'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
?>
```

2. コードで通知をトリガー：
```php
<?php
$notification_handler = xoops_getHandler('notification');
$notification_handler->triggerEvent(
    'item_published',
    $item_id,
    '項目が発行されました',
    '説明'
);
?>
```

---

## モジュール権限

### Q: モジュール権限を設定するには？

**A:**
1. XOOPS 管理 > モジュール > モジュール権限 に移動
2. モジュールを選択
3. ユーザー/グループと権限レベルを選択
4. 保存

**コード内：**
```php
<?php
// ユーザーがモジュールにアクセスできるか確認
if (!xoops_isUser()) {
    exit('ログインが必要です');
}

// 特定の権限を確認
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('アクセスが拒否されました');
}
?>
```

---

## モジュール データベース

### Q: モジュール データベーステーブルはどこに保存されていますか？

**A:** すべてメイン XOOPS データベースに保存され、テーブルプレフィックス（通常 `xoops_`）が付きます：

```bash
# すべてのモジュール テーブルをリスト
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# または PHP で
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```

---

### Q: モジュール データベーステーブルを更新するには？

**A:** モジュール内に更新スクリプトを作成：

```php
<?php
// modules/mymodule/update.php
require_once '../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('管理者のみ');
}

// 新しい列を追加
$sql = "ALTER TABLE `" . XOOPS_DB_PREFIX . "mymodule_items`
        ADD COLUMN `new_field` VARCHAR(255)";

if ($GLOBALS['xoopsDB']->query($sql)) {
    echo "✓ 正常に更新されました";
} else {
    echo "✗ エラー: " . $GLOBALS['xoopsDB']->error;
}
?>
```

---

## モジュール 依存関係

### Q: 必要なモジュールがインストールされているか確認するには？

**A:**
```php
<?php
$module_handler = xoops_getHandler('module');

// モジュールが存在するか確認
$module = $module_handler->getByDirname('required_module');

if (!$module || !$module->getVar('isactive')) {
    die('エラー: required_module がインストールされていないか有効化されていません');
}
?>
```

---

### Q: モジュールが他のモジュールに依存できますか？

**A:** はい、xoopsversion.php で宣言します：

```php
<?php
$modversion['dependencies'] = [
    [
        'dirname' => 'required_module',
        'version_min' => '1.0',
        'version_max' => 0,  // 0 = 無制限
        'order' => 1
    ]
];
?>
```

---

## トラブルシューティング

### Q: モジュールはリストに表示されるが有効化できません

**A:** 確認事項：
1. xoopsversion.php 構文 - PHP linter を使用：
```bash
php -l modules/mymodule/xoopsversion.php
```

2. データベース SQL ファイル：
```bash
# SQL 構文を確認
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. 言語ファイル：
```bash
ls -la modules/mymodule/language/english/
```

詳細な診断については「モジュールインストール失敗」を参照してください。

---

### Q: モジュールは有効化されたが、メインサイトに表示されません

**A:**
1. xoopsversion.php で `hasMain = 1` を設定：
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. `modules/mymodule/index.php` を作成：
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "モジュールへようこそ";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### Q: モジュールが「ホワイトスクリーン」を引き起こします

**A:** デバッグを有効化してエラーを見つけます：

```php
<?php
// mainfile.php 内
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

エラーログを確認：
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

解決策については「ホワイトスクリーン」を参照してください。

---

## パフォーマンス

### Q: モジュールが遅い場合、最適化するには？

**A:**
1. **データベースクエリを確認** - クエリログを使用
2. **データをキャッシュ** - XOOPS キャッシュを使用：
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 時間
}
?>
```

3. **テンプレートを最適化** - テンプレート内のループを避ける
4. **PHP オペコードキャッシュを有効化** - APCu、XDebug など

詳細は「パフォーマンス FAQ」を参照してください。

---

## モジュール開発

### Q: モジュール開発ドキュメントはどこで見つけられますか？

**A:** 参照：
- モジュール開発ガイド
- モジュール構造
- 最初のモジュールを作成

---

## 関連ドキュメント

- モジュールインストール失敗
- モジュール構造
- パフォーマンス FAQ
- デバッグモードを有効化

---

#xoops #modules #faq #troubleshooting
