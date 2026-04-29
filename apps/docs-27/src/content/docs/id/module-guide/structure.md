---
title: "Struktur module"
---

## Ikhtisar

Struktur module yang terorganisir dengan baik sangat penting untuk pengembangan XOOPS yang dapat dikelola. Panduan ini mencakup tata letak module lama dan modern (PSR-4).

## Tata Letak module Standar

### Struktur Warisan

```
modules/mymodule/
├── admin/                      # Admin panel files
│   ├── index.php              # Admin dashboard
│   ├── menu.php               # Admin menu definition
│   ├── permissions.php        # Permission management
│   └── templates/             # Admin templates
├── assets/                     # front-end resources
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
│   │   ├── main.php           # front-end strings
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

### Struktur PSR-4 Modern

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
├── assets/                     # front-end resources
├── module.json                 # Module manifest (XOOPS 4.0)
└── composer.json              # Composer config
```

## File Kunci Dijelaskan

### xoops_version.php (Manifes Warisan)

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

### module.json (Manifes XOOPS 4.0)

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

## Tujuan Direktori

| Direktori | Tujuan |
|-----------|---------|
| `admin/` | Antarmuka administrasi |
| `assets/` | CSS, JavaScript, gambar |
| `blocks/` | Blokir fungsi rendering |
| `class/` | Kelas PHP (warisan) |
| `config/` | File konfigurasi (modern) |
| `include/` | Dibagikan sertakan file |
| `language/` | File terjemahan |
| `migrations/` | Migrasi basis data |
| `sql/` | Skema database awal |
| `src/` | Kode sumber PSR-4 |
| `templates/` | template Smarty |
| `tests/` | File uji |

## Praktik Terbaik

1. **Kekhawatiran Terpisah** - Jauhkan logika bisnis dari template
2. **Gunakan namespace** - Atur kode dengan namespace yang tepat
3. **Ikuti PSR-4** - Gunakan konvensi pemuatan otomatis standar
4. **Eksternalisasi Konfigurasi** - Pisahkan konfigurasi dari kode
5. **Struktur Dokumen** - Sertakan organisasi penjelasan README

## Dokumentasi Terkait

- Pengembangan module - Panduan pengembangan lengkap
- Best-Practices/Code-Organization - Pola organisasi kode
- Manifes module - Konfigurasi manifes
- Database/Database-Schema - Desain basis data
