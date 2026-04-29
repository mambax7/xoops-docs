---
title: "モジュール構造"
---

## 概要

きちんと組織されたモジュール構造は、保守性の高い XOOPS 開発の基礎です。このガイドは、レガシーと最新 (PSR-4) の両方のモジュールレイアウトをカバーしています。

## 標準モジュールレイアウト

### レガシー構造

```
modules/mymodule/
├── admin/                      # 管理パネルファイル
│   ├── index.php              # 管理ダッシュボード
│   ├── menu.php               # 管理メニュー定義
│   ├── permissions.php        # パーミッション管理
│   └── templates/             # 管理テンプレート
├── assets/                     # フロントエンドリソース
│   ├── css/
│   ├── js/
│   └── images/
├── class/                      # PHP クラス
│   ├── Common/                # 共有ユーティリティ
│   │   ├── Breadcrumb.php
│   │   └── Configurator.php
│   ├── Form/                  # カスタムフォーム要素
│   └── Handler/               # オブジェクトハンドラー
├── include/                    # インクルードファイル
│   ├── common.php             # 共通初期化
│   ├── functions.php          # ユーティリティ関数
│   ├── oninstall.php          # インストールフック
│   ├── onupdate.php           # アップデートフック
│   └── onuninstall.php        # アンインストールフック
├── language/                   # 翻訳
│   ├── english/
│   │   ├── admin.php          # 管理文字列
│   │   ├── main.php           # フロントエンド文字列
│   │   ├── modinfo.php        # モジュール情報文字列
│   │   └── help/              # ヘルプファイル
│   └── other_language/
├── sql/                        # データベーススキーマ
│   └── mysql.sql              # MySQL スキーマ
├── templates/                  # Smarty テンプレート
│   ├── admin/
│   └── blocks/
├── blocks/                     # ブロック関数
├── preloads/                   # Preload クラス
├── xoops_version.php          # モジュールマニフェスト
├── header.php                 # モジュールヘッダー
├── footer.php                 # モジュールフッター
└── index.php                  # メインエントリーポイント
```

### 最新 PSR-4 構造

```
modules/mymodule/
├── src/                        # PSR-4 オートロード対象ソース
│   ├── Controller/            # リクエストハンドラー
│   │   ├── ArticleController.php
│   │   └── CategoryController.php
│   ├── Service/               # ビジネスロジック
│   │   ├── ArticleService.php
│   │   └── CategoryService.php
│   ├── Repository/            # データアクセス
│   │   ├── ArticleRepository.php
│   │   └── ArticleRepositoryInterface.php
│   ├── Entity/                # ドメインオブジェクト
│   │   ├── Article.php
│   │   └── Category.php
│   ├── DTO/                   # データ転送オブジェクト
│   │   ├── CreateArticleDTO.php
│   │   └── UpdateArticleDTO.php
│   ├── Event/                 # ドメインイベント
│   │   └── ArticleCreatedEvent.php
│   ├── Exception/             # カスタム例外
│   │   └── ArticleNotFoundException.php
│   ├── ValueObject/           # 値型
│   │   └── ArticleId.php
│   └── Middleware/            # HTTP ミドルウェア
│       └── AuthenticationMiddleware.php
├── config/                     # 設定
│   ├── routes.php             # ルート定義
│   ├── services.php           # DI コンテナ設定
│   └── events.php             # イベントリスナー
├── migrations/                 # データベースマイグレーション
│   ├── 001_create_articles.php
│   └── 002_add_indexes.php
├── tests/                      # テストファイル
│   ├── Unit/
│   └── Integration/
├── templates/                  # Smarty テンプレート
├── language/                   # 翻訳 (JSON)
│   ├── en/
│   │   └── main.json
│   └── de/
├── assets/                     # フロントエンドリソース
├── module.json                 # モジュールマニフェスト (XOOPS 4.0)
└── composer.json              # Composer 設定
```

## キーファイルの説明

### xoops_version.php (レガシーマニフェスト)

```php
<?php
$modversion = [
    'name'           => 'My Module',
    'version'        => '1.0.0',
    'description'    => 'Module description',
    'author'         => 'Your Name',
    'credits'        => 'Contributors',
    'license'        => 'GPL 2.0',
    'dirname'        => basename(__DIR__),
    'modicons16'     => 'assets/images/icons/16',
    'modicons32'     => 'assets/images/icons/32',
    'image'          => 'assets/images/logo.png',

    // System
    'system_menu'    => 1,
    'hasAdmin'       => 1,
    'adminindex'     => 'admin/index.php',
    'adminmenu'      => 'admin/menu.php',
    'hasMain'        => 1,

    // Database
    'sqlfile'        => ['mysql' => 'sql/mysql.sql'],
    'tables'         => ['mymodule_items', 'mymodule_categories'],

    // Templates
    'templates'      => [
        ['file' => 'mymodule_index.tpl', 'description' => 'Index page'],
        ['file' => 'mymodule_item.tpl', 'description' => 'Item detail'],
    ],

    // Blocks
    'blocks'         => [
        [
            'file'        => 'blocks/recent.php',
            'name'        => '_MI_MYMOD_BLOCK_RECENT',
            'description' => '_MI_MYMOD_BLOCK_RECENT_DESC',
            'show_func'   => 'mymodule_recent_show',
            'edit_func'   => 'mymodule_recent_edit',
            'template'    => 'mymodule_block_recent.tpl',
            'options'     => '5|0',
        ],
    ],

    // Config
    'config'         => [
        [
            'name'        => 'items_per_page',
            'title'       => '_MI_MYMOD_ITEMS_PER_PAGE',
            'description' => '_MI_MYMOD_ITEMS_PER_PAGE_DESC',
            'formtype'    => 'textbox',
            'valuetype'   => 'int',
            'default'     => 10,
        ],
    ],
];
```

### module.json (XOOPS 4.0 マニフェスト)

```json
{
    "name": "My Module",
    "slug": "mymodule",
    "version": "1.0.0",
    "description": "Module description",
    "author": "Your Name",
    "license": "GPL-2.0-or-later",
    "php": ">=8.2",

    "namespace": "XoopsModules\\MyModule",
    "autoload": "src/",

    "admin": {
        "menu": "config/admin-menu.php"
    },

    "routes": "config/routes.php",
    "services": "config/services.php",
    "events": "config/events.php",

    "templates": [
        {"file": "index.tpl", "description": "Index page"}
    ],

    "config": {
        "items_per_page": {
            "type": "int",
            "default": 10,
            "title": "@mymodule.config.items_per_page"
        }
    }
}
```

## ディレクトリの目的

| ディレクトリ | 目的 |
|-----------|---------|
| `admin/` | 管理インターフェース |
| `assets/` | CSS、JavaScript、画像 |
| `blocks/` | ブロック描画関数 |
| `class/` | PHP クラス (レガシー) |
| `config/` | 設定ファイル (最新) |
| `include/` | 共有インクルードファイル |
| `language/` | 翻訳ファイル |
| `migrations/` | データベースマイグレーション |
| `sql/` | 初期データベーススキーマ |
| `src/` | PSR-4 ソースコード |
| `templates/` | Smarty テンプレート |
| `tests/` | テストファイル |

## ベストプラクティス

1. **関心事の分離** - ビジネスロジックをテンプレートから除外
2. **名前空間を使用** - 適切なネームスペースでコードを組織
3. **PSR-4 に従う** - 標準オートローディング規約を使用
4. **設定を外部化** - コードから設定を分離
5. **構造をドキュメント化** - 組織を説明する README を含める

## 関連ドキュメント

- Module-Development - 完全な開発ガイド
- Best-Practices/Code-Organization - コード組織パターン
- Module Manifest - マニフェスト設定
- Database/Database-Schema - データベース設計
