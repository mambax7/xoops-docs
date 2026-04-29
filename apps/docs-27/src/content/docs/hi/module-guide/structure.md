---
title: "मॉड्यूल संरचना"
---
## अवलोकन

एक सुव्यवस्थित मॉड्यूल संरचना बनाए रखने योग्य XOOPS विकास के लिए मौलिक है। यह मार्गदर्शिका विरासत और आधुनिक (PSR-4) मॉड्यूल लेआउट दोनों को कवर करती है।

## मानक मॉड्यूल लेआउट

### विरासत संरचना

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

### आधुनिक पीएसआर-4 संरचना

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

## मुख्य फाइलों की व्याख्या

### xoops_version.php (विरासत प्रकट)

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

### मॉड्यूल.जेसन (XOOPS 4.0 मेनिफेस्ट)

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

## निर्देशिका उद्देश्य

| निर्देशिका | उद्देश्य |
|----|----|
| `admin/` | प्रशासन इंटरफ़ेस |
| `assets/` | CSS, JavaScript, छवियां |
| `blocks/` | ब्लॉक रेंडरिंग फ़ंक्शन |
| `class/` | PHP कक्षाएं (विरासत) |
| `config/` | कॉन्फ़िगरेशन फ़ाइलें (आधुनिक) |
| `include/` | साझा की गई फ़ाइलें शामिल हैं |
| `language/` | अनुवाद फ़ाइलें |
| `migrations/` | डेटाबेस माइग्रेशन |
| `sql/` | प्रारंभिक डेटाबेस स्कीमा |
| `src/` | पीएसआर-4 स्रोत कोड |
| `templates/` | Smarty टेम्प्लेट |
| `tests/` | परीक्षण फ़ाइलें |

## सर्वोत्तम प्रथाएँ

1. **चिंताओं को अलग करें** - व्यावसायिक तर्क को टेम्पलेट्स से बाहर रखें
2. **नेमस्पेस का उपयोग करें** - उचित नेमस्पेसिंग के साथ कोड व्यवस्थित करें
3. **पीएसआर-4 का पालन करें** - मानक ऑटोलोडिंग परंपराओं का उपयोग करें
4. **कॉन्फ़िगरेशन को बाहरी बनाएं** - कॉन्फ़िगरेशन को कोड से अलग रखें
5. **दस्तावेज़ संरचना** - व्याख्या करने वाले संगठन को README शामिल करें

## संबंधित दस्तावेज़ीकरण

- मॉड्यूल-विकास - संपूर्ण विकास मार्गदर्शिका
- सर्वोत्तम अभ्यास/कोड-संगठन - कोड संगठन पैटर्न
- मॉड्यूल मेनिफेस्ट - मेनिफेस्ट कॉन्फ़िगरेशन
- डेटाबेस/डेटाबेस-स्कीमा - डेटाबेस डिज़ाइन