---
title: "Modulstruktur"
---

## Überblick

Eine gut organisierte Modulstruktur ist grundlegend für wartbare XOOPS-Entwicklung. Dieser Leitfaden behandelt sowohl veraltete als auch moderne (PSR-4) Modullayouts.

## Standard-Modullayout

### Veraltete Struktur

```
modules/mymodule/
├── admin/                      # Admin-Panel-Dateien
│   ├── index.php              # Admin-Dashboard
│   ├── menu.php               # Admin-Menü-Definition
│   ├── permissions.php        # Berechtigungsverwaltung
│   └── templates/             # Admin-Templates
├── assets/                     # Frontend-Ressourcen
│   ├── css/
│   ├── js/
│   └── images/
├── class/                      # PHP-Klassen
│   ├── Common/                # Gemeinsame Dienstprogramme
│   │   ├── Breadcrumb.php
│   │   └── Configurator.php
│   ├── Form/                  # Benutzerdefinierte Formulärelemente
│   └── Handler/               # Objekt-Handler
├── include/                    # Include-Dateien
│   ├── common.php             # Häufige Initialisierung
│   ├── functions.php          # Dienstprogrammfunktionen
│   ├── oninstall.php          # Installations-Hooks
│   ├── onupdate.php           # Update-Hooks
│   └── onuninstall.php        # Deinstallations-Hooks
├── language/                   # Übersetzungen
│   ├── english/
│   │   ├── admin.php          # Admin-Zeichenfolgen
│   │   ├── main.php           # Frontend-Zeichenfolgen
│   │   ├── modinfo.php        # Modul-Info-Zeichenfolgen
│   │   └── help/              # Hilfedateien
│   └── other_language/
├── sql/                        # Datenbankschemas
│   └── mysql.sql              # MySQL-Schema
├── templates/                  # Smarty-Templates
│   ├── admin/
│   └── blocks/
├── blocks/                     # Block-Funktionen
├── preloads/                   # Preload-Klassen
├── xoops_version.php          # Modul-Manifest
├── header.php                 # Modul-Header
├── footer.php                 # Modul-Footer
└── index.php                  # Haupt-Einstiegspunkt
```

### Modernes PSR-4-Struktur

```
modules/mymodule/
├── src/                        # PSR-4 Autoload-Source
│   ├── Controller/            # Request-Handler
│   │   ├── ArticleController.php
│   │   └── CategoryController.php
│   ├── Service/               # Geschäftslogik
│   │   ├── ArticleService.php
│   │   └── CategoryService.php
│   ├── Repository/            # Datenzugriff
│   │   ├── ArticleRepository.php
│   │   └── ArticleRepositoryInterface.php
│   ├── Entity/                # Domain-Objekte
│   │   ├── Article.php
│   │   └── Category.php
│   ├── DTO/                   # Datentransferobjekte
│   │   ├── CreateArticleDTO.php
│   │   └── UpdateArticleDTO.php
│   ├── Event/                 # Domain-Ereignisse
│   │   └── ArticleCreatedEvent.php
│   ├── Exception/             # Benutzerdefinierte Exceptions
│   │   └── ArticleNotFoundException.php
│   ├── ValueObject/           # Werttypen
│   │   └── ArticleId.php
│   └── Middleware/            # HTTP-Middleware
│       └── AuthenticationMiddleware.php
├── config/                     # Konfiguration
│   ├── routes.php             # Route-Definitionen
│   ├── services.php           # DI-Container-Config
│   └── events.php             # Event-Listener
├── migrations/                 # Datenbankmigrations
│   ├── 001_create_articles.php
│   └── 002_add_indexes.php
├── tests/                      # Test-Dateien
│   ├── Unit/
│   └── Integration/
├── templates/                  # Smarty-Templates
├── language/                   # Übersetzungen (JSON)
│   ├── en/
│   │   └── main.json
│   └── de/
├── assets/                     # Frontend-Ressourcen
├── module.json                 # Modul-Manifest (XOOPS 4.0)
└── composer.json              # Composer-Konfiguration
```

## Schlüsseldateien erklärt

### xoops_version.php (Veraltetes Manifest)

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

    // Datenbank
    'sqlfile'        => ['mysql' => 'sql/mysql.sql'],
    'tables'         => ['mymodule_items', 'mymodule_categories'],

    // Templates
    'templates'      => [
        ['file' => 'mymodule_index.tpl', 'description' => 'Index page'],
        ['file' => 'mymodule_item.tpl', 'description' => 'Item detail'],
    ],

    // Blöcke
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

### module.json (XOOPS 4.0 Manifest)

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

## Verzeichniszwecke

| Verzeichnis | Zweck |
|-----------|---------|
| `admin/` | Verwaltungsschnittstelle |
| `assets/` | CSS, JavaScript, Bilder |
| `blocks/` | Block-Rendering-Funktionen |
| `class/` | PHP-Klassen (veraltet) |
| `config/` | Konfigurationsdateien (modern) |
| `include/` | Gemeinsame Include-Dateien |
| `language/` | Übersetzungsdateien |
| `migrations/` | Datenbankmigrations |
| `sql/` | Initiales Datenbankschema |
| `src/` | PSR-4 Source-Code |
| `templates/` | Smarty-Templates |
| `tests/` | Test-Dateien |

## Best Practices

1. **Bedenken trennen** - Halten Sie Geschäftslogik aus Templates
2. **Verwenden Sie Namespaces** - Organisieren Sie Code mit ordnungsgemäßem Namensraum
3. **Folgen Sie PSR-4** - Verwenden Sie Standard-Autoloading-Konventionen
4. **Externalisieren Sie Config** - Halten Sie Konfiguration vom Code getrennt
5. **Dokumentieren Sie Struktur** - Fügen Sie README hinzu, das die Organisation erklärt

## Verwandte Dokumentation

- Module-Development - Vollständiger Entwicklungsleitfaden
- Best-Practices/Code-Organization - Code-Organisations-Muster
- Module Manifest - Manifest-Konfiguration
- Database/Database-Schema - Datenbankdesign
