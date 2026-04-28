---
title: "Struttura del Modulo"
---

## Panoramica

Una struttura ben organizzata del modulo è fondamentale per lo sviluppo XOOPS mantenibile. Questa guida copre sia i layout dei moduli legacy che quelli moderni (PSR-4).

## Layout del Modulo Standard

### Struttura Legacy

```
modules/mymodule/
├── admin/                      # File del panel admin
│   ├── index.php              # Dashboard admin
│   ├── menu.php               # Definizione menu admin
│   ├── permissions.php        # Gestione permessi
│   └── templates/             # Template admin
├── assets/                     # Risorse frontend
│   ├── css/
│   ├── js/
│   └── images/
├── class/                      # Classi PHP
│   ├── Common/                # Utilità condivise
│   │   ├── Breadcrumb.php
│   │   └── Configurator.php
│   ├── Form/                  # Elementi form personalizzati
│   └── Handler/               # Handler di oggetti
├── include/                    # File di inclusione
│   ├── common.php             # Inizializzazione comune
│   ├── functions.php          # Funzioni di utilità
│   ├── oninstall.php          # Hook di installazione
│   ├── onupdate.php           # Hook di aggiornamento
│   └── onuninstall.php        # Hook di disinstallazione
├── language/                   # Traduzioni
│   ├── english/
│   │   ├── admin.php          # Stringhe admin
│   │   ├── main.php           # Stringhe frontend
│   │   ├── modinfo.php        # Stringhe info modulo
│   │   └── help/              # File di aiuto
│   └── other_language/
├── sql/                        # Schemi database
│   └── mysql.sql              # Schema MySQL
├── templates/                  # Template Smarty
│   ├── admin/
│   └── blocks/
├── blocks/                     # Funzioni blocchi
├── preloads/                   # Classi preload
├── xoops_version.php          # Manifest del modulo
├── header.php                 # Header del modulo
├── footer.php                 # Footer del modulo
└── index.php                  # Punto di ingresso principale
```

### Struttura Moderna PSR-4

```
modules/mymodule/
├── src/                        # Sorgente autoloaded PSR-4
│   ├── Controller/            # Gestori di richieste
│   │   ├── ArticleController.php
│   │   └── CategoryController.php
│   ├── Service/               # Logica di business
│   │   ├── ArticleService.php
│   │   └── CategoryService.php
│   ├── Repository/            # Accesso ai dati
│   │   ├── ArticleRepository.php
│   │   └── ArticleRepositoryInterface.php
│   ├── Entity/                # Oggetti di dominio
│   │   ├── Article.php
│   │   └── Category.php
│   ├── DTO/                   # Oggetti di trasferimento dati
│   │   ├── CreateArticleDTO.php
│   │   └── UpdateArticleDTO.php
│   ├── Event/                 # Eventi di dominio
│   │   └── ArticleCreatedEvent.php
│   ├── Exception/             # Eccezioni personalizzate
│   │   └── ArticleNotFoundException.php
│   ├── ValueObject/           # Tipi di valore
│   │   └── ArticleId.php
│   └── Middleware/            # Middleware HTTP
│       └── AuthenticationMiddleware.php
├── config/                     # Configurazione
│   ├── routes.php             # Definizioni rotte
│   ├── services.php           # Config contenitore DI
│   └── events.php             # Listener eventi
├── migrations/                 # Migrazioni database
│   ├── 001_create_articles.php
│   └── 002_add_indexes.php
├── tests/                      # File di test
│   ├── Unit/
│   └── Integration/
├── templates/                  # Template Smarty
├── language/                   # Traduzioni (JSON)
│   ├── en/
│   │   └── main.json
│   └── de/
├── assets/                     # Risorse frontend
├── module.json                 # Manifest del modulo (XOOPS 4.0)
└── composer.json              # Config Composer
```

## Spiegazione dei File Chiave

### xoops_version.php (Manifest Legacy)

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

### module.json (Manifest XOOPS 4.0)

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

## Scopi delle Directory

| Directory | Scopo |
|-----------|---------|
| `admin/` | Interfaccia di amministrazione |
| `assets/` | CSS, JavaScript, immagini |
| `blocks/` | Funzioni di rendering blocchi |
| `class/` | Classi PHP (legacy) |
| `config/` | File di configurazione (moderno) |
| `include/` | File di inclusione condivisi |
| `language/` | File di traduzione |
| `migrations/` | Migrazioni database |
| `sql/` | Schema database iniziale |
| `src/` | Codice sorgente PSR-4 |
| `templates/` | Template Smarty |
| `tests/` | File di test |

## Migliori Pratiche

1. **Separa i Compiti** - Mantieni la logica di business fuori dai template
2. **Usa Namespace** - Organizza il codice con namespace appropriati
3. **Segui PSR-4** - Usa convenzioni standard di autoloading
4. **Esternalizza la Config** - Tieni la configurazione separata dal codice
5. **Documenta la Struttura** - Includi README che spiega l'organizzazione

## Documentazione Correlata

- Module-Development - Guida completa di sviluppo
- Best-Practices/Code-Organization - Pattern di organizzazione del codice
- Module Manifest - Configurazione manifest
- Database/Database-Schema - Progettazione database
