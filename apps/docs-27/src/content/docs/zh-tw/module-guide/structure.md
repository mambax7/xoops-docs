---
title: "模組結構"
---

## 概述

組織良好的模組結構是可維護 XOOPS 開發的基礎。本指南涵蓋舊版和現代 (PSR-4) 模組佈局。

## 標準模組佈局

### 舊版結構

```
modules/mymodule/
├── admin/                      # 管理面板檔案
│   ├── index.php              # 管理員儀表板
│   ├── menu.php               # 管理員功能表定義
│   ├── permissions.php        # 權限管理
│   └── templates/             # 管理員範本
├── assets/                     # 前端資源
│   ├── css/
│   ├── js/
│   └── images/
├── class/                      # PHP 類別
│   ├── Common/                # 共用工具
│   │   ├── Breadcrumb.php
│   │   └── Configurator.php
│   ├── Form/                  # 自訂表單元素
│   └── Handler/               # 物件處理器
├── include/                    # 包含檔案
│   ├── common.php             # 通用初始化
│   ├── functions.php          # 工具函數
│   ├── oninstall.php          # 安裝掛鉤
│   ├── onupdate.php           # 更新掛鉤
│   └── onuninstall.php        # 卸載掛鉤
├── language/                   # 翻譯
│   ├── english/
│   │   ├── admin.php          # 管理員字串
│   │   ├── main.php           # 前端字串
│   │   ├── modinfo.php        # 模組資訊字串
│   │   └── help/              # 說明檔案
│   └── other_language/
├── sql/                        # 資料庫架構
│   └── mysql.sql              # MySQL 架構
├── templates/                  # Smarty 範本
│   ├── admin/
│   └── blocks/
├── blocks/                     # 區塊函數
├── preloads/                   # 預載類別
├── xoops_version.php          # 模組清單
├── header.php                 # 模組標頭
├── footer.php                 # 模組頁尾
└── index.php                  # 主進入點
```

### 現代 PSR-4 結構

```
modules/mymodule/
├── src/                        # PSR-4 自動載入的源代碼
│   ├── Controller/            # 請求處理器
│   │   ├── ArticleController.php
│   │   └── CategoryController.php
│   ├── Service/               # 業務邏輯
│   │   ├── ArticleService.php
│   │   └── CategoryService.php
│   ├── Repository/            # 資料存取
│   │   ├── ArticleRepository.php
│   │   └── ArticleRepositoryInterface.php
│   ├── Entity/                # 領域物件
│   │   ├── Article.php
│   │   └── Category.php
│   ├── DTO/                   # 資料傳輸物件
│   │   ├── CreateArticleDTO.php
│   │   └── UpdateArticleDTO.php
│   ├── Event/                 # 領域事件
│   │   └── ArticleCreatedEvent.php
│   ├── Exception/             # 自訂例外狀況
│   │   └── ArticleNotFoundException.php
│   ├── ValueObject/           # 值型別
│   │   └── ArticleId.php
│   └── Middleware/            # HTTP 中介軟體
│       └── AuthenticationMiddleware.php
├── config/                     # 組態
│   ├── routes.php             # 路由定義
│   ├── services.php           # DI 容器組態
│   └── events.php             # 事件監聽器
├── migrations/                 # 資料庫遷移
│   ├── 001_create_articles.php
│   └── 002_add_indexes.php
├── tests/                      # 測試檔案
│   ├── Unit/
│   └── Integration/
├── templates/                  # Smarty 範本
├── language/                   # 翻譯 (JSON)
│   ├── en/
│   │   └── main.json
│   └── de/
├── assets/                     # 前端資源
├── module.json                 # 模組清單 (XOOPS 4.0)
└── composer.json              # Composer 組態
```

## 關鍵檔案說明

### xoops_version.php (舊版清單)

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

    // 系統
    'system_menu'    => 1,
    'hasAdmin'       => 1,
    'adminindex'     => 'admin/index.php',
    'adminmenu'      => 'admin/menu.php',
    'hasMain'        => 1,

    // 資料庫
    'sqlfile'        => ['mysql' => 'sql/mysql.sql'],
    'tables'         => ['mymodule_items', 'mymodule_categories'],

    // 範本
    'templates'      => [
        ['file' => 'mymodule_index.tpl', 'description' => 'Index page'],
        ['file' => 'mymodule_item.tpl', 'description' => 'Item detail'],
    ],

    // 區塊
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

    // 組態
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

### module.json (XOOPS 4.0 清單)

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

## 目錄用途

| 目錄 | 用途 |
|-----------|---------|
| `admin/` | 管理界面 |
| `assets/` | CSS、JavaScript、圖片 |
| `blocks/` | 區塊呈現函數 |
| `class/` | PHP 類別 (舊版) |
| `config/` | 組態檔案 (現代) |
| `include/` | 共用包含檔案 |
| `language/` | 翻譯檔案 |
| `migrations/` | 資料庫遷移 |
| `sql/` | 初始資料庫架構 |
| `src/` | PSR-4 源代碼 |
| `templates/` | Smarty 範本 |
| `tests/` | 測試檔案 |

## 最佳實踐

1. **分離關注點** - 將業務邏輯保留在範本之外
2. **使用命名空間** - 使用適當的命名空間組織代碼
3. **遵循 PSR-4** - 使用標準自動載入約定
4. **將組態外部化** - 將組態與代碼分開
5. **記錄結構** - 包含說明組織的 README

## 相關文件

- Module-Development - 完整開發指南
- Best-Practices/Code-Organization - 程式碼組織模式
- Module Manifest - 清單組態
- Database/Database-Schema - 資料庫設計
