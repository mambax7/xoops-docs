---
title: "データベースユーティリティ"
description: "スキーマ管理、マイグレーション、データロード用のXMFデータベースユーティリティ"
---

`Xmf\Database` 名前空間は、XOOPSモジュールのインストールと更新に関連するデータベース保守タスクを簡素化するクラスを提供します。これらのユーティリティはスキーママイグレーション、テーブル修正、初期データロードを処理します。

## 概要

データベースユーティリティには以下が含まれます:

- **Tables** - テーブル修正用のDDLステートメントの構築と実行
- **Migrate** - モジュールバージョン間でのデータベーススキーマの同期
- **TableLoad** - テーブルへの初期データロード

## Xmf\Database\Tables

`Tables` クラスはデータベーステーブルの作成と修正を簡素化します。実行時にまとめて実行されるDDL (Data Definition Language) ステートメントの作業キューを構築します。

### 主な機能

- 既存テーブルから現在のスキーマをロード
- 即座に実行されないように変更をキューイング
- 作業内容を決定する際に現在の状態を考慮
- XOOPSテーブルプレフィックスを自動的に処理

### 使い始める

```php
use Xmf\Database\Tables;

// 新しいTablesインスタンスを作成
$tables = new Tables();

// 既存テーブルをロードまたは新しいスキーマを開始
$tables->addTable('mymodule_items');

// 既存テーブルのみ (テーブルが存在しない場合は失敗)
$tables->useTable('mymodule_items');
```

### テーブル操作

#### テーブルを名前変更

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### テーブルオプションを設定

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### テーブルを削除

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### テーブルをコピー

```php
// 構造のみをコピー
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// 構造とデータをコピー
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### カラムを操作

#### カラムを追加

```php
$tables = new Tables();
$tables->addTable('mymodule_items');

$tables->addColumn(
    'mymodule_items',
    'status',
    "TINYINT(1) NOT NULL DEFAULT '1'"
);

$tables->executeQueue();
```

#### カラムを変更

```php
$tables->useTable('mymodule_items');

// カラム属性を変更
$tables->alterColumn(
    'mymodule_items',
    'title',
    "VARCHAR(255) NOT NULL DEFAULT ''"
);

// カラムを名前変更および修正
$tables->alterColumn(
    'mymodule_items',
    'old_column_name',
    "VARCHAR(100) NOT NULL",
    'new_column_name'
);

$tables->executeQueue();
```

#### カラム属性を取得

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// 返す: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### カラムを削除

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### インデックスを操作

#### テーブルインデックスを取得

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// 次のような配列を返す:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### 主キーを追加

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// 複合主キー
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### インデックスを追加

```php
$tables->useTable('mymodule_items');

// 単純なインデックス
$tables->addIndex('idx_category', 'mymodule_items', 'category_id');

// ユニークインデックス
$tables->addIndex('idx_slug', 'mymodule_items', 'slug', true);

// 複合インデックス
$tables->addIndex('idx_cat_status', 'mymodule_items', 'category_id, status');

$tables->executeQueue();
```

#### インデックスを削除

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### すべての非主キーインデックスを削除

```php
// 自動生成されたインデックス名をクリーンアップするのに便利
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### 主キーを削除

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### データ操作

#### データを挿入

```php
$tables->useTable('mymodule_categories');

$tables->insert('mymodule_categories', [
    'category_id' => 1,
    'name' => 'General',
    'weight' => 0
]);

// 自動引用符なし (式用)
$tables->insert('mymodule_logs', [
    'created' => 'NOW()',
    'message' => "'Test message'"
], false);

$tables->executeQueue();
```

#### データを更新

```php
$tables->useTable('mymodule_items');

// 条件オブジェクト付きで更新
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// 文字列条件で更新
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### データを削除

```php
$tables->useTable('mymodule_items');

// 条件付きで削除
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// 文字列条件で削除
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### テーブルを切り詰め

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### 作業キュー管理

#### キューを実行

```php
// 通常の実行 (HTTPメソッドの安全性を尊重)
$result = $tables->executeQueue();

// GETリクエストでも強制実行
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### キューをリセット

```php
// 実行せずキューをクリア
$tables->resetQueue();
```

#### 生SQLを追加

```php
// キューにカスタムSQLを追加
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### エラーハンドリング

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // エラーを処理
}
```

## Xmf\Database\Migrate

`Migrate` クラスは、モジュールバージョン間のデータベース変更の同期を簡素化します。スキーマ比較と自動同期で `Tables` を拡張します。

### 基本的な使用方法

```php
use Xmf\Database\Migrate;

// モジュール用のマイグレーションインスタンスを作成
$migrate = new Migrate('mymodule');

// データベースをターゲットスキーマと同期
$migrate->synchronizeSchema();
```

### モジュール更新時

通常、モジュールの `xoops_module_pre_update_*` 関数で呼び出されます:

```php
function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    $migrate = new \Xmf\Database\Migrate('mymodule');

    // 同期前のアクション (名前変更など) を実行
    // ...

    // スキーマを同期
    return $migrate->synchronizeSchema();
}
```

### DDLステートメントを取得

大規模データベースまたはコマンドラインマイグレーション用:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// バッチで、またはCLIからステートメントを実行
foreach ($statements as $sql) {
    // 各ステートメントを処理
}
```

### 同期前のアクション

一部の変更は同期前に明示的な処理が必要です。複雑なマイグレーション用に `Migrate` を拡張:

```php
class MyModuleMigrate extends \Xmf\Database\Migrate
{
    public function preSyncActions()
    {
        // 同期前にテーブルを名前変更
        $this->useTable('mymodule_old_name');
        $this->renameTable('mymodule_old_name', 'mymodule_new_name');
        $this->executeQueue();

        // カラムを名前変更
        $this->useTable('mymodule_items');
        $this->alterColumn(
            'mymodule_items',
            'old_column',
            'VARCHAR(255) NOT NULL',
            'new_column'
        );
        $this->executeQueue();
    }
}

// 使用方法
$migrate = new MyModuleMigrate('mymodule');
$migrate->preSyncActions();
$migrate->synchronizeSchema();
```

### スキーマ管理

#### 現在のスキーマを取得

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### ターゲットスキーマを取得

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### 現在のスキーマを保存

モジュール開発者がデータベース変更後にスキーマをキャプチャするため:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// スキーマをモジュールのsql/migrate.ymlに保存
```

> **開発者注:** 常にデータベースで変更を加えてから `saveCurrentSchema()` を実行します。生成されたスキーマファイルを手動で編集しないでください。

## Xmf\Database\TableLoad

`TableLoad` クラスはテーブルへの初期データロードを簡素化します。モジュール インストール中にテーブルにデフォルトデータを設定するのに役立ちます。

### 配列からデータをロード

```php
use Xmf\Database\TableLoad;

$data = [
    ['category_id' => 1, 'name' => 'General', 'weight' => 0],
    ['category_id' => 2, 'name' => 'News', 'weight' => 10],
    ['category_id' => 3, 'name' => 'Events', 'weight' => 20]
];

$count = TableLoad::loadTableFromArray('mymodule_categories', $data);
echo "Inserted {$count} rows";
```

### YAMLからデータをロード

```php
// YAMLファイルからロード
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

YAML形式:

```yaml
-
  category_id: 1
  name: General
  weight: 0
-
  category_id: 2
  name: News
  weight: 10
```

### データを抽出

#### 行をカウント

```php
// すべての行をカウント
$total = TableLoad::countRows('mymodule_items');

// 条件付きでカウント
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### 行を抽出

```php
// すべての行を抽出
$rows = TableLoad::extractRows('mymodule_items');

// 条件付きで抽出
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// 特定のカラムをスキップ
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### データをYAMLに保存

```php
// すべてのデータを保存
TableLoad::saveTableToYamlFile(
    'mymodule_categories',
    '/path/to/categories.yml'
);

// フィルター済みデータを保存
$criteria = new Criteria('is_default', 1);
TableLoad::saveTableToYamlFile(
    'mymodule_settings',
    '/path/to/default_settings.yml',
    $criteria
);

// 特定のカラムなしで保存
TableLoad::saveTableToYamlFile(
    'mymodule_items',
    '/path/to/items.yml',
    null,
    ['created', 'modified']
);
```

### テーブルを切り詰め

```php
// テーブルを空にする
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## 完全なマイグレーション例

### xoops_version.php

```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_settings'
];
```

### include/onupdate.php

```php
<?php
use Xmf\Database\Migrate;
use Xmf\Database\Tables;
use Xmf\Database\TableLoad;

function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    // カスタムマイグレートクラスを作成
    $migrate = new MyModuleMigrate('mymodule');

    // バージョン固有のマイグレーションを処理
    if ($previousVersion < 120) {
        // バージョン1.2.0はテーブルを名前変更
        $migrate->renameOldTable();
    }

    if ($previousVersion < 130) {
        // バージョン1.3.0はカラムを名前変更
        $migrate->renameOldColumn();
    }

    // スキーマを同期
    return $migrate->synchronizeSchema();
}

function xoops_module_update_mymodule($module, $previousVersion)
{
    // 更新後のデータマイグレーション
    if ($previousVersion < 130) {
        // 新しいデフォルト設定をロード
        TableLoad::loadTableFromYamlFile(
            'mymodule_settings',
            XOOPS_ROOT_PATH . '/modules/mymodule/sql/new_settings.yml'
        );
    }

    return true;
}

class MyModuleMigrate extends Migrate
{
    public function renameOldTable()
    {
        if ($this->useTable('mymodule_posts')) {
            $this->renameTable('mymodule_posts', 'mymodule_items');
            $this->executeQueue();
        }
    }

    public function renameOldColumn()
    {
        if ($this->useTable('mymodule_items')) {
            $this->alterColumn(
                'mymodule_items',
                'post_title',
                "VARCHAR(255) NOT NULL DEFAULT ''",
                'title'
            );
            $this->executeQueue();
        }
    }
}
```

## APIリファレンス

### Xmf\Database\Tables

| メソッド | 説明 |
|--------|------|
| `addTable($table)` | テーブルスキーマをロードまたは作成 |
| `useTable($table)` | 既存テーブルのみをロード |
| `renameTable($table, $newName)` | テーブル名前変更をキューイング |
| `setTableOptions($table, $options)` | テーブルオプション変更をキューイング |
| `dropTable($table)` | テーブル削除をキューイング |
| `copyTable($table, $newTable, $withData)` | テーブルコピーをキューイング |
| `addColumn($table, $column, $attributes)` | カラム追加をキューイング |
| `alterColumn($table, $column, $attributes, $newName)` | カラム変更をキューイング |
| `getColumnAttributes($table, $column)` | カラム定義を取得 |
| `dropColumn($table, $column)` | カラム削除をキューイング |
| `getTableIndexes($table)` | インデックス定義を取得 |
| `addPrimaryKey($table, $column)` | 主キーをキューイング |
| `addIndex($name, $table, $column, $unique)` | インデックスをキューイング |
| `dropIndex($name, $table)` | インデックス削除をキューイング |
| `dropIndexes($table)` | すべてのインデックス削除をキューイング |
| `dropPrimaryKey($table)` | 主キー削除をキューイング |
| `insert($table, $columns, $quote)` | 挿入をキューイング |
| `update($table, $columns, $criteria, $quote)` | 更新をキューイング |
| `delete($table, $criteria)` | 削除をキューイング |
| `truncate($table)` | 切り詰めをキューイング |
| `executeQueue($force)` | キューイングされた操作を実行 |
| `resetQueue()` | キューをクリア |
| `addToQueue($sql)` | 生SQLを追加 |
| `getLastError()` | 最後のエラーメッセージを取得 |
| `getLastErrNo()` | 最後のエラーコードを取得 |

### Xmf\Database\Migrate

| メソッド | 説明 |
|--------|------|
| `__construct($dirname)` | モジュール用に作成 |
| `synchronizeSchema()` | データベースをターゲットに同期 |
| `getSynchronizeDDL()` | DDLステートメントを取得 |
| `preSyncActions()` | カスタムアクション用にオーバーライド |
| `getCurrentSchema()` | 現在のデータベーススキーマを取得 |
| `getTargetDefinitions()` | ターゲットスキーマを取得 |
| `saveCurrentSchema()` | 開発者用にスキーマを保存 |

### Xmf\Database\TableLoad

| メソッド | 説明 |
|--------|------|
| `loadTableFromArray($table, $data)` | 配列からロード |
| `loadTableFromYamlFile($table, $file)` | YAMLからロード |
| `truncateTable($table)` | テーブルを空にする |
| `countRows($table, $criteria)` | 行をカウント |
| `extractRows($table, $criteria, $skip)` | 行を抽出 |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | YAMLに保存 |

## 関連項目

- ../XMF-Framework - フレームワーク概要
- ../Basics/XMF-Module-Helper - モジュールヘルパークラス
- Metagen - メタデータユーティリティ

---

#xmf #database #migration #schema #tables #ddl
