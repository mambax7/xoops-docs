---
title: "Structure du module"
---

## Aperçu

Une structure de module bien organisée est fondamentale pour un développement XOOPS maintenable. Ce guide couvre à la fois les dispositions héritées et modernes (PSR-4).

## Disposition standard du module

### Structure héritée

```
modules/mymodule/
├── admin/                      # Fichiers du panneau d'administration
│   ├── index.php              # Tableau de bord d'administration
│   ├── menu.php               # Définition du menu d'administration
│   ├── permissions.php        # Gestion des permissions
│   └── templates/             # Modèles d'administration
├── assets/                     # Ressources frontales
│   ├── css/
│   ├── js/
│   └── images/
├── class/                      # Classes PHP
│   ├── Common/                # Utilitaires partagés
│   │   ├── Breadcrumb.php
│   │   └── Configurator.php
│   ├── Form/                  # Éléments de formulaire personnalisés
│   └── Handler/               # Gestionnaires d'objets
├── include/                    # Fichiers d'inclusion
│   ├── common.php             # Initialisation commune
│   ├── functions.php          # Fonctions utilitaires
│   ├── oninstall.php          # Crochets d'installation
│   ├── onupdate.php           # Crochets de mise à jour
│   └── onuninstall.php        # Crochets de désinstallation
├── language/                   # Traductions
│   ├── english/
│   │   ├── admin.php          # Chaînes d'administration
│   │   ├── main.php           # Chaînes frontales
│   │   ├── modinfo.php        # Chaînes d'info du module
│   │   └── help/              # Fichiers d'aide
│   └── other_language/
├── sql/                        # Schémas de base de données
│   └── mysql.sql              # Schéma MySQL
├── templates/                  # Modèles Smarty
│   ├── admin/
│   └── blocks/
├── blocks/                     # Fonctions de bloc
├── preloads/                   # Classes de préchargement
├── xoops_version.php          # Manifeste du module
├── header.php                 # En-tête du module
├── footer.php                 # Pied de page du module
└── index.php                  # Point d'entrée principal
```

### Structure moderne PSR-4

```
modules/mymodule/
├── src/                        # Source autoloadée PSR-4
│   ├── Controller/            # Gestionnaires de requêtes
│   │   ├── ArticleController.php
│   │   └── CategoryController.php
│   ├── Service/               # Logique métier
│   │   ├── ArticleService.php
│   │   └── CategoryService.php
│   ├── Repository/            # Accès aux données
│   │   ├── ArticleRepository.php
│   │   └── ArticleRepositoryInterface.php
│   ├── Entity/                # Objets de domaine
│   │   ├── Article.php
│   │   └── Category.php
│   ├── DTO/                   # Objets de transfert de données
│   │   ├── CreateArticleDTO.php
│   │   └── UpdateArticleDTO.php
│   ├── Event/                 # Événements de domaine
│   │   └── ArticleCreatedEvent.php
│   ├── Exception/             # Exceptions personnalisées
│   │   └── ArticleNotFoundException.php
│   ├── ValueObject/           # Types de valeur
│   │   └── ArticleId.php
│   └── Middleware/            # Middleware HTTP
│       └── AuthenticationMiddleware.php
├── config/                     # Configuration
│   ├── routes.php             # Définitions d'itinéraires
│   ├── services.php           # Configuration du conteneur DI
│   └── events.php             # Écouteurs d'événements
├── migrations/                 # Migrations de base de données
│   ├── 001_create_articles.php
│   └── 002_add_indexes.php
├── tests/                      # Fichiers de test
│   ├── Unit/
│   └── Integration/
├── templates/                  # Modèles Smarty
├── language/                   # Fichiers de traduction (JSON)
│   ├── en/
│   │   └── main.json
│   └── de/
├── assets/                     # Ressources frontales
├── module.json                 # Manifeste du module (XOOPS 4.0)
└── composer.json              # Configuration Composer
```

## Fichiers clés expliqués

### xoops_version.php (Manifeste hérité)

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

    // Système
    'system_menu'    => 1,
    'hasAdmin'       => 1,
    'adminindex'     => 'admin/index.php',
    'adminmenu'      => 'admin/menu.php',
    'hasMain'        => 1,

    // Base de données
    'sqlfile'        => ['mysql' => 'sql/mysql.sql'],
    'tables'         => ['mymodule_items', 'mymodule_categories'],

    // Modèles
    'templates'      => [
        ['file' => 'mymodule_index.tpl', 'description' => 'Index page'],
        ['file' => 'mymodule_item.tpl', 'description' => 'Item detail'],
    ],

    // Blocs
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

    // Configuration
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

### module.json (Manifeste XOOPS 4.0)

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

## Objectifs des répertoires

| Répertoire | Objectif |
|-----------|---------|
| `admin/` | Interface d'administration |
| `assets/` | CSS, JavaScript, images |
| `blocks/` | Fonctions de rendu de bloc |
| `class/` | Classes PHP (hérité) |
| `config/` | Fichiers de configuration (moderne) |
| `include/` | Fichiers d'inclusion partagés |
| `language/` | Fichiers de traduction |
| `migrations/` | Migrations de base de données |
| `sql/` | Schéma de base de données initial |
| `src/` | Code source PSR-4 |
| `templates/` | Modèles Smarty |
| `tests/` | Fichiers de test |

## Meilleures pratiques

1. **Séparer les préoccupations** - Gardez la logique métier en dehors des modèles
2. **Utiliser les espaces de noms** - Organisez le code avec un espace de noms approprié
3. **Suivre PSR-4** - Utiliser des conventions d'autoload standard
4. **Externaliser la configuration** - Maintenir la configuration séparée du code
5. **Documenter la structure** - Inclure un README expliquant l'organisation

## Documentation connexe

- Développement-de-modules - Guide complet de développement
- Meilleures-pratiques/Organisation-du-code - Modèles d'organisation du code
- Manifeste-du-module - Configuration du manifeste
- Base-de-données/Schéma-de-base-de-données - Conception de base de données
