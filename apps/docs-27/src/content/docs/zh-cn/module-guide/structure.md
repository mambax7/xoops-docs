---
title：“模区块结构”
---

## 概述

良好的-organized模区块结构是可维护的XOOPS开发的基础。本指南涵盖传统和现代 (PSR-4) 模区块布局。

## 标准模区块布局

### 遗留结构

```
modules/mymodule/
├── admin/                      # Admin panel files
│   ├── index.php              # Admin dashboard
│   ├── menu.php               # Admin menu definition
│   ├── permissions.php        # Permission management
│   └── templates/             # Admin templates
├── assets/                     # Frontend resources
│   ├── css/
│   ├── js/
│   └── images/
├── class/                      # PHP classes
│   ├── Common/                # Shared utilities
│   │   ├── Breadcrumb.php
│   │   └── Configurator.php
│   ├── Form/                  # Custom form elements
│   └── Handler/               # Object handlers
├── include/                    # Include files
│   ├── common.php             # Common initialization
│   ├── functions.php          # Utility functions
│   ├── oninstall.php          # Installation hooks
│   ├── onupdate.php           # Update hooks
│   └── onuninstall.php        # Uninstallation hooks
├── language/                   # Translations
│   ├── english/
│   │   ├── admin.php          # Admin strings
│   │   ├── main.php           # Frontend strings
│   │   ├── modinfo.php        # Module info strings
│   │   └── help/              # Help files
│   └── other_language/
├── sql/                        # Database schemas
│   └── mysql.sql              # MySQL schema
├── templates/                  # Smarty templates
│   ├── admin/
│   └── blocks/
├── blocks/                     # Block functions
├── preloads/                   # Preload classes
├── xoops_version.php          # Module manifest
├── header.php                 # Module header
├── footer.php                 # Module footer
└── index.php                  # Main entry point
```

### 现代PSR-4 结构

```
modules/mymodule/
├── src/                        # PSR-4 autoloaded source
│   ├── Controller/            # Request handlers
│   │   ├── ArticleController.php
│   │   └── CategoryController.php
│   ├── Service/               # Business logic
│   │   ├── ArticleService.php
│   │   └── CategoryService.php
│   ├── Repository/            # Data access
│   │   ├── ArticleRepository.php
│   │   └── ArticleRepositoryInterface.php
│   ├── Entity/                # Domain objects
│   │   ├── Article.php
│   │   └── Category.php
│   ├── DTO/                   # Data transfer objects
│   │   ├── CreateArticleDTO.php
│   │   └── UpdateArticleDTO.php
│   ├── Event/                 # Domain events
│   │   └── ArticleCreatedEvent.php
│   ├── Exception/             # Custom exceptions
│   │   └── ArticleNotFoundException.php
│   ├── ValueObject/           # Value types
│   │   └── ArticleId.php
│   └── Middleware/            # HTTP middleware
│       └── AuthenticationMiddleware.php
├── config/                     # Configuration
│   ├── routes.php             # Route definitions
│   ├── services.php           # DI container config
│   └── events.php             # Event listeners
├── migrations/                 # Database migrations
│   ├── 001_create_articles.php
│   └── 002_add_indexes.php
├── tests/                      # Test files
│   ├── Unit/
│   └── Integration/
├── templates/                  # Smarty templates
├── language/                   # Translations (JSON)
│   ├── en/
│   │   └── main.json
│   └── de/
├── assets/                     # Frontend resources
├── module.json                 # Module manifest (XOOPS 4.0)
└── composer.json              # Composer config
```

## 关键文件解释

### XOOPS_version.php（旧版清单）

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

### 模区块。json（XOOPS 4.0 清单）

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

## 目录用途

|目录 |目的|
|------------|---------|
| `admin/` |管理界面|
| `assets/` | CSS、JavaScript、图像 |
| `blocks/` |区块渲染函数 |
| `class/` | PHP类（遗留）|
| `config/` |配置文件（现代）|
| `include/` |共享包含文件 |
| `language/` |翻译文件|
| `migrations/` |数据库迁移 |
| `sql/`|初始数据库架构 |
| `src/` | PSR-4 源代码 |
| `templates/`| Smarty模板|
| `tests/`|测试文件|

## 最佳实践

1. **单独关注** - 将业务逻辑排除在模板之外
2. **使用命名空间** - 使用适当的命名空间组织代码
3. **遵循 PSR-4** - 使用标准自动加载约定
4. **外部化配置** - 将配置与代码分开
5. **文件结构** - 包括 README 解释组织

## 相关文档

- 模区块-Development - 完整的开发指南
- Best-Practices/Code-Organization - 代码组织模式
- 模区块清单 - 清单配置
- Database/Database-Schema - 数据库设计