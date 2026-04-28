---
title: "هيكل الوحدة"
dir: rtl
lang: ar
---

## نظرة عامة

هيكل الوحدة المنظم جيداً أمر أساسي لتطوير XOOPS الذي يسهل صيانته. يغطي هذا الدليل تخطيطات الوحدات القديمة والحديثة (PSR-4).

## تخطيط الوحدة القياسي

### البنية القديمة

```
modules/mymodule/
├── admin/                      # ملفات لوحة التحكم
│   ├── index.php              # لوحة معلومات الإدارة
│   ├── menu.php               # تعريف قائمة الإدارة
│   ├── permissions.php        # إدارة الأذونات
│   └── templates/             # قوالب الإدارة
├── assets/                     # موارد الواجهة الأمامية
│   ├── css/
│   ├── js/
│   └── images/
├── class/                      # فئات PHP
│   ├── Common/                # الأدوات المشتركة
│   │   ├── Breadcrumb.php
│   │   └── Configurator.php
│   ├── Form/                  # عناصر النموذج المخصصة
│   └── Handler/               # معالجات الكائنات
├── include/                    # ملفات التضمين
│   ├── common.php             # تهيئة مشتركة
│   ├── functions.php          # وظائف المرافق
│   ├── oninstall.php          # خطاطيف التثبيت
│   ├── onupdate.php           # خطاطيف التحديث
│   └── onuninstall.php        # خطاطيف إلغاء التثبيت
├── language/                   # الترجمات
│   ├── english/
│   │   ├── admin.php          # سلاسل الإدارة
│   │   ├── main.php           # سلاسل الواجهة الأمامية
│   │   ├── modinfo.php        # سلاسل معلومات الوحدة
│   │   └── help/              # ملفات المساعدة
│   └── other_language/
├── sql/                        # أنماط قواعد البيانات
│   └── mysql.sql              # نمط MySQL
├── templates/                  # قوالب Smarty
│   ├── admin/
│   └── blocks/
├── blocks/                     # وظائف الكتلة
├── preloads/                   # فئات التحميل المسبق
├── xoops_version.php          # بيان الوحدة
├── header.php                 # رأس الوحدة
├── footer.php                 # تذييل الوحدة
└── index.php                  # نقطة الدخول الرئيسية
```

### بنية PSR-4 الحديثة

```
modules/mymodule/
├── src/                        # مصدر معروّف PSR-4
│   ├── Controller/            # معالجات الطلبات
│   │   ├── ArticleController.php
│   │   └── CategoryController.php
│   ├── Service/               # منطق الأعمال
│   │   ├── ArticleService.php
│   │   └── CategoryService.php
│   ├── Repository/            # الوصول للبيانات
│   │   ├── ArticleRepository.php
│   │   └── ArticleRepositoryInterface.php
│   ├── Entity/                # كائنات المجال
│   │   ├── Article.php
│   │   └── Category.php
│   ├── DTO/                   # كائنات نقل البيانات
│   │   ├── CreateArticleDTO.php
│   │   └── UpdateArticleDTO.php
│   ├── Event/                 # أحداث المجال
│   │   └── ArticleCreatedEvent.php
│   ├── Exception/             # استثناءات مخصصة
│   │   └── ArticleNotFoundException.php
│   ├── ValueObject/           # أنواع القيمة
│   │   └── ArticleId.php
│   └── Middleware/            # وسيطة HTTP
│       └── AuthenticationMiddleware.php
├── config/                     # الملفات الإعدادية
│   ├── routes.php             # تعريفات المسارات
│   ├── services.php           # إعداد حاوية التبعية
│   └── events.php             # مستمعو الأحداث
├── migrations/                 # هجرات قاعدة البيانات
│   ├── 001_create_articles.php
│   └── 002_add_indexes.php
├── tests/                      # ملفات الاختبار
│   ├── Unit/
│   └── Integration/
├── templates/                  # قوالب Smarty
├── language/                   # ملفات الترجمة (JSON)
│   ├── en/
│   │   └── main.json
│   └── de/
├── assets/                     # موارد الواجهة الأمامية
├── module.json                 # بيان الوحدة (XOOPS 4.0)
└── composer.json              # إعداد Composer
```

## شرح الملفات الأساسية

### xoops_version.php (بيان قديم)

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

    // نظام
    'system_menu'    => 1,
    'hasAdmin'       => 1,
    'adminindex'     => 'admin/index.php',
    'adminmenu'      => 'admin/menu.php',
    'hasMain'        => 1,

    // قاعدة البيانات
    'sqlfile'        => ['mysql' => 'sql/mysql.sql'],
    'tables'         => ['mymodule_items', 'mymodule_categories'],

    // القوالب
    'templates'      => [
        ['file' => 'mymodule_index.tpl', 'description' => 'Index page'],
        ['file' => 'mymodule_item.tpl', 'description' => 'Item detail'],
    ],

    // الكتل
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

    // الإعداد
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

### module.json (بيان XOOPS 4.0)

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

## أغراض الدلائل

| المجلد | الغرض |
|-----------|---------|
| `admin/` | واجهة الإدارة |
| `assets/` | CSS، JavaScript، صور |
| `blocks/` | وظائف عرض الكتلة |
| `class/` | فئات PHP (قديم) |
| `config/` | ملفات الإعدادات (حديث) |
| `include/` | ملفات التضمين المشتركة |
| `language/` | ملفات الترجمة |
| `migrations/` | هجرات قاعدة البيانات |
| `sql/` | نمط قاعدة البيانات الأولية |
| `src/` | كود مصدر PSR-4 |
| `templates/` | قوالب Smarty |
| `tests/` | ملفات الاختبار |

## أفضل الممارسات

1. **فصل الاهتمامات** - احفظ منطق الأعمال بعيداً عن القوالب
2. **استخدم المساحات** - نظم الكود بـ namespacing مناسب
3. **اتبع PSR-4** - استخدم اتفاقيات التحميل الآلي القياسية
4. **خارجية الإعداد** - احتفظ بالإعدادات منفصلة عن الكود
5. **وثق البنية** - أضف README يشرح التنظيم

## الوثائق ذات الصلة

- Module-Development - دليل التطوير الكامل
- Best-Practices/Code-Organization - أنماط تنظيم الكود
- Module Manifest - إعدادات البيان
- Database/Database-Schema - تصميم قاعدة البيانات
