---
title: "Développement de modules"
description: "Guide complet pour développer les modules XOOPS en utilisant les meilleures pratiques PHP modernes"
---

Cette section fournit une documentation complète pour développer les modules XOOPS en utilisant les pratiques PHP modernes, les motifs de conception et les meilleures pratiques.

## Aperçu

Le développement des modules XOOPS a considérablement évolué au fil des années. Les modules modernes exploitent :

- **Architecture MVC** - Séparation nette des préoccupations
- **Fonctionnalités PHP 8.x** - Déclarations de type, attributs, arguments nommés
- **Motifs de conception** - Motifs Repository, DTO, Service Layer
- **Tests** - PHPUnit avec les pratiques modernes de test
- **Cadre XMF** - Utilitaires du framework XOOPS Module

## Structure de la documentation

### Tutoriels

Guides étape par étape pour construire des modules XOOPS à partir de zéro.

- Tutoriels/Module Hello-World - Votre premier module XOOPS
- Tutoriels/Construction-d-un-module-CRUD - Fonctionnalité complète Create, Read, Update, Delete

### Motifs de conception

Motifs architecturaux utilisés dans le développement moderne des modules XOOPS.

- Motifs/Motif-MVC - Architecture Model-View-Controller
- Motifs/Motif-Repository - Abstraction d'accès aux données
- Motifs/Motif-DTO - Objets de transfert de données pour un flux de données propre

### Meilleures pratiques

Lignes directrices pour écrire du code maintenable et de haute qualité.

- Meilleures-pratiques/Code-propre - Principes de code propre pour XOOPS
- Meilleures-pratiques/Odeurs-de-code - Antipatterns courants et comment les corriger
- Meilleures-pratiques/Tests - Stratégies de test PHPUnit

### Exemples

Analyse de modules du monde réel et exemples d'implémentation.

- Analyse-du-module-Publisher - Exploration approfondie du module Publisher

## Structure de répertoire du module

Un module XOOPS bien organisé suit cette structure de répertoire :

```
/modules/mymodule/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /css/
        /js/
        /images/
    /blocks/
        myblock.php
    /class/
        /Controller/
        /Entity/
        /Repository/
        /Service/
    /include/
        common.php
        install.php
        uninstall.php
        update.php
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /preloads/
        core.php
    /sql/
        mysql.sql
    /templates/
        /admin/
        /blocks/
        main_index.tpl
    /test/
        bootstrap.php
        /Unit/
        /Integration/
    index.php
    xoops_version.php
```

## Fichiers clés expliqués

### xoops_version.php

Le fichier de définition du module qui informe XOOPS à propos de votre module :

```php
<?php
$modversion = [];

// Informations de base
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Drapeaux du module
$modversion['hasMain']     = 1;  // Has frontend pages
$modversion['hasAdmin']    = 1;  // Has admin section
$modversion['system_menu'] = 1;  // Show in admin menu

// Configuration de l'administrateur
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Base de données
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// Modèles
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// Blocs
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Préférences du module
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### Fichier d'inclusion commune

Créez un fichier d'amorçage courant pour votre module :

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Module constants
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// Autoload classes
require_once MYMODULE_PATH . '/class/autoload.php';
```

## Exigences de version PHP

Les modules XOOPS modernes doivent cibler PHP 8.0 ou supérieur pour exploiter :

- **Promotion de propriété de constructeur**
- **Arguments nommés**
- **Types d'union**
- **Expressions de correspondance**
- **Attributs**
- **Opérateur Nullsafe**

## Premiers pas

1. Commencez par le tutoriel Tutoriels/Module Hello-World
2. Progressez vers Tutoriels/Construction-d-un-module-CRUD
3. Étudiez Motifs/Motif-MVC pour les conseils d'architecture
4. Appliquez les pratiques Meilleures-pratiques/Code-propre tout au long
5. Implémentez Meilleures-pratiques/Tests dès le début

## Ressources connexes

- ../05-XMF-Framework/Framework-XMF - Utilitaires du framework XOOPS Module
- Opérations-de-base-de-données - Travail avec la base de données XOOPS
- ../04-API-Reference/Template/Système-de-modèles - Modèles Smarty dans XOOPS
- ../02-Core-Concepts/Security/Meilleures-pratiques-de-sécurité - Sécurisation de votre module

## Historique de version

| Version | Date | Modifications |
|---------|------|---------|
| 1.0 | 2025-01-28 | Documentation initiale |
