---
title: "Struktura modułu"
---

## Przegląd

Dobrze zorganizowana struktura modułu jest fundamentem dla konserwowanego rozwoju XOOPS. Ten przewodnik obejmuje zarówno starszą jak i nowoczesną (PSR-4) strukturę modułów.

## Standardowy układ modułu

### Struktura Legacy

```
modules/mymodule/
├── admin/                      # Pliki panelu admin
│   ├── index.php              # Pulpit admin
│   ├── menu.php               # Definicja menu admin
│   ├── permissions.php        # Zarządzanie uprawnieniami
│   └── templates/             # Szablony admin
├── assets/                     # Zasoby front-end
│   ├── css/
│   ├── js/
│   └── images/
├── class/                      # Klasy PHP
│   ├── Common/                # Wspólne narzędzia
│   │   ├── Breadcrumb.php
│   │   └── Configurator.php
│   ├── Form/                  # Niestandardowe elementy formularza
│   └── Handler/               # Handlery obiektów
├── include/                    # Pliki include
│   ├── common.php             # Inicjalizacja wspólna
│   ├── functions.php          # Funkcje pomocnicze
│   ├── oninstall.php          # Hooki instalacji
│   ├── onupdate.php           # Hooki aktualizacji
│   └── onuninstall.php        # Hooki deinstalacji
├── language/                   # Pliki tłumaczeń
│   ├── english/
│   │   ├── admin.php          # Łańcuchy admin
│   │   ├── main.php           # Łańcuchy front-end
│   │   ├── modinfo.php        # Łańcuchy info modułu
│   │   └── help/              # Pliki pomocy
│   └── other_language/
├── sql/                        # Schematy bazy danych
│   └── mysql.sql              # Schemat MySQL
├── templates/                  # Szablony Smarty
│   ├── admin/
│   └── blocks/
├── blocks/                     # Funkcje bloku
├── preloads/                   # Klasy preload
├── xoops_version.php          # Manifest modułu
├── header.php                 # Nagłówek modułu
├── footer.php                 # Stopka modułu
└── index.php                  # Główny punkt wejścia
```

### Nowoczesna struktura PSR-4

```
modules/mymodule/
├── src/                        # Źródło autoloadowane PSR-4
│   ├── Controller/            # Handlery żądań
│   │   ├── ArticleController.php
│   │   └── CategoryController.php
│   ├── Service/               # Logika biznesowa
│   │   ├── ArticleService.php
│   │   └── CategoryService.php
│   ├── Repository/            # Dostęp do danych
│   │   ├── ArticleRepository.php
│   │   └── ArticleRepositoryInterface.php
│   ├── Entity/                # Obiekty domeny
│   │   ├── Article.php
│   │   └── Category.php
│   ├── DTO/                   # Obiekty transferu danych
│   │   ├── CreateArticleDTO.php
│   │   └── UpdateArticleDTO.php
│   ├── Event/                 # Zdarzenia domeny
│   │   └── ArticleCreatedEvent.php
│   ├── Exception/             # Wyjątki niestandardowe
│   │   └── ArticleNotFoundException.php
│   ├── ValueObject/           # Typy wartości
│   │   └── ArticleId.php
│   └── Middleware/            # Middleware HTTP
│       └── AuthenticationMiddleware.php
├── config/                     # Pliki konfiguracyjne
│   ├── routes.php             # Definicje tras
│   ├── services.php           # Konfiguracja kontenera DI
│   └── events.php             # Słuchacze zdarzeń
├── migrations/                 # Migracje bazy danych
│   ├── 001_create_articles.php
│   └── 002_add_indexes.php
├── tests/                      # Pliki testów
│   ├── Unit/
│   └── Integration/
├── templates/                  # Szablony Smarty
├── language/                   # Pliki tłumaczeń (JSON)
│   ├── en/
│   │   └── main.json
│   └── de/
├── assets/                     # Zasoby front-end
├── module.json                 # Manifest modułu (XOOPS 4.0)
└── composer.json              # Konfiguracja Composer
```

## Objaśnienie kluczowych plików

### xoops_version.php (Legacy Manifest)

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

    // Baza danych
    'sqlfile'        => ['mysql' => 'sql/mysql.sql'],
    'tables'         => ['mymodule_items', 'mymodule_categories'],

    // Szablony
    'templates'      => [
        ['file' => 'mymodule_index.tpl', 'description' => 'Index page'],
        ['file' => 'mymodule_item.tpl', 'description' => 'Item detail'],
    ],

    // Bloki
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

## Przeznaczenie katalogów

| Katalog | Przeznaczenie |
|-----------|---------|
| `admin/` | Interfejs administracyjny |
| `assets/` | CSS, JavaScript, obrazy |
| `blocks/` | Funkcje renderowania bloku |
| `class/` | Klasy PHP (legacy) |
| `config/` | Pliki konfiguracyjne (nowoczesne) |
| `include/` | Wspólne pliki include |
| `language/` | Pliki tłumaczeń |
| `migrations/` | Migracje bazy danych |
| `sql/` | Początkowy schemat bazy danych |
| `src/` | Kod źródłowy PSR-4 |
| `templates/` | Szablony Smarty |
| `tests/` | Pliki testów |

## Najlepsze praktyki

1. **Separacja odpowiedzialności** - Zachowaj logikę biznesową poza szablonami
2. **Używaj przestrzeni nazw** - Organizuj kod z odpowiednim namespace'owaniem
3. **Postępuj zgodnie z PSR-4** - Używaj standardowych konwencji autoloadingu
4. **Externalizuj konfigurację** - Trzymaj konfigurację oddzielnie od kodu
5. **Dokumentuj strukturę** - Dołącz README wyjaśniające organizację

## Powiązana dokumentacja

- Module-Development - Kompleksowy przewodnik rozwoju
- Best-Practices/Code-Organization - Wzorce organizacji kodu
- Module Manifest - Konfiguracja manifestu
- Database/Database-Schema - Projektowanie bazy danych
