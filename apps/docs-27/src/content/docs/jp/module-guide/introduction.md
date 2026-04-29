---
title: "モジュール開発"
description: "最新の PHP プラクティスを使用した XOOPS モジュール開発の包括的なガイド"
---

このセクションでは、最新の PHP プラクティス、設計パターン、およびベストプラクティスを使用した XOOPS モジュール開発の包括的なドキュメントを提供します。

## 概要

XOOPS モジュール開発は大きく進化してきました。最新のモジュールは以下を活用します。

- **MVC アーキテクチャ** - 関心事の明確な分離
- **PHP 8.x の機能** - 型宣言、属性、名前付き引数
- **デザインパターン** - リポジトリ、DTO、サービスレイヤーパターン
- **テスト** - 最新のテストプラクティスに対応した PHPUnit
- **XMF フレームワーク** - XOOPS モジュールフレームワークユーティリティ

## ドキュメント構成

### チュートリアル

XOOPS モジュールをゼロから構築するためのステップバイステップガイド。

- Tutorials/Hello-World-Module - 最初の XOOPS モジュール
- Tutorials/Building-a-CRUD-Module - 完全な作成、読み取り、更新、削除機能

### デザインパターン

最新の XOOPS モジュール開発で使用されるアーキテクチャパターン。

- Patterns/MVC-Pattern - モデルビューコントローラーアーキテクチャ
- Patterns/Repository-Pattern - データアクセス抽象化
- Patterns/DTO-Pattern - クリーンなデータフローのためのデータ転送オブジェクト

### ベストプラクティス

保守性の高い、高品質なコードを書くためのガイドライン。

- Best-Practices/Clean-Code - XOOPS 向けのクリーンコード原則
- Best-Practices/Code-Smells - 一般的なアンチパターンとその修正方法
- Best-Practices/Testing - PHPUnit テスト戦略

### 例

実世界のモジュール分析と実装例。

- Publisher-Module-Analysis - Publisher モジュールの詳細なダイブ

## モジュールディレクトリ構造

きちんと組織されたXOOPSモジュールは以下のディレクトリ構造に従います。

```
/modules/mymodule/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /css/
        /js/
        /images/
    /blocks/
        myblock.php
    /class/
        /Controller/
        /Entity/
        /Repository/
        /Service/
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
    /preloads/
        core.php
    /sql/
        mysql.sql
    /templates/
        /admin/
        /blocks/
        main_index.tpl
    /test/
        bootstrap.php
        /Unit/
        /Integration/
    index.php
    xoops_version.php
```

## キーファイルの説明

### xoops_version.php

XOOPS にモジュールについて伝えるモジュール定義ファイル:

```php
<?php
$modversion = [];

// 基本情報
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// モジュールフラグ
$modversion['hasMain']     = 1;  // フロントエンドページあり
$modversion['hasAdmin']    = 1;  // 管理セクションあり
$modversion['system_menu'] = 1;  // 管理メニューに表示

// 管理設定
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// データベース
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// テンプレート
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// ブロック
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// モジュール設定
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### 共通インクルードファイル

モジュール用の共通ブートストラップファイルを作成します。

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// モジュール定数
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// クラスをオートロード
require_once MYMODULE_PATH . '/class/autoload.php';
```

## PHP バージョン要件

最新の XOOPS モジュールは以下を活用するために PHP 8.0 以上をターゲットにする必要があります。

- **コンストラクタプロパティプロモーション**
- **名前付き引数**
- **ユニオン型**
- **マッチ式**
- **属性**
- **Nullsafe オペレーター**

## はじめに

1. Tutorials/Hello-World-Module チュートリアルから始めます
2. Tutorials/Building-a-CRUD-Module に進みます
3. アーキテクチャ設計ガイダンスは Patterns/MVC-Pattern を学習します
4. Best-Practices/Clean-Code プラクティスを全体的に適用します
5. Best-Practices/Testing から始まるテストを実装します

## 関連リソース

- ../05-XMF-Framework/XMF-Framework - XOOPS モジュールフレームワークユーティリティ
- Database-Operations - XOOPS データベースの操作
- ../04-API-Reference/Template/Template-System - XOOPS の Smarty テンプレートエンジン
- ../02-Core-Concepts/Security/Security-Best-Practices - モジュールのセキュリティ保護

## バージョン履歴

| バージョン | 日付 | 変更内容 |
|---------|------|---------|
| 1.0 | 2025-01-28 | 初期ドキュメント |
