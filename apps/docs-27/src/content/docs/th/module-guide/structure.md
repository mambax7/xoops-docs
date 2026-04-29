---
title: "โครงสร้างโมดูล"
---
## ภาพรวม

โครงสร้างโมดูลที่มีการจัดระเบียบอย่างดีเป็นพื้นฐานของการพัฒนา XOOPS ที่สามารถบำรุงรักษาได้ คู่มือนี้ครอบคลุมเค้าโครงโมดูลทั้งแบบเดิมและสมัยใหม่ (PSR-4)

## เค้าโครงโมดูลมาตรฐาน

### โครงสร้างมรดก
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
### โครงสร้างสมัยใหม่ PSR-4
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
## อธิบายไฟล์สำคัญแล้ว

### xoops_version.php (รายการมรดก)
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
### module.json (XOOPS 4.0 รายการ)
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
## วัตถุประสงค์ของไดเรกทอรี

| ไดเรกทอรี | วัตถุประสงค์ |
|----------|---------|
| `admin/` | ส่วนต่อประสานการดูแลระบบ |
| `assets/` | CSS, JavaScript, รูปภาพ |
| `blocks/` | บล็อกฟังก์ชันการเรนเดอร์ |
| `class/` | PHP คลาส (ดั้งเดิม) |
| `config/` | ไฟล์กำหนดค่า (สมัยใหม่) |
| `include/` | แชร์ไฟล์รวม |
| `language/` | ไฟล์แปล |
| `migrations/` | การย้ายฐานข้อมูล |
| `sql/` | สคีมาฐานข้อมูลเริ่มต้น |
| `src/` | PSR-4 ซอร์สโค้ด |
| `templates/` | เทมเพลต Smarty |
| `tests/` | ไฟล์ทดสอบ |

## แนวทางปฏิบัติที่ดีที่สุด

1. **ข้อกังวลแยกต่างหาก** - เก็บตรรกะทางธุรกิจออกจากเทมเพลต
2. **ใช้เนมสเปซ** - จัดระเบียบโค้ดด้วยเนมสเปซที่เหมาะสม
3. **ปฏิบัติตาม PSR-4** - ใช้รูปแบบการโหลดอัตโนมัติมาตรฐาน
4. **กำหนดค่าภายนอก** - แยกการกำหนดค่าออกจากโค้ด
5. **โครงสร้างเอกสาร** - รวม README องค์กรที่อธิบาย

## เอกสารที่เกี่ยวข้อง

- การพัฒนาโมดูล - คู่มือการพัฒนาฉบับสมบูรณ์
- Best-Practices/Code-Organization - รูปแบบการจัดองค์กรโค้ด
- รายการโมดูล - การกำหนดค่ารายการ
- ฐานข้อมูล/ฐานข้อมูล-สคีมา - การออกแบบฐานข้อมูล