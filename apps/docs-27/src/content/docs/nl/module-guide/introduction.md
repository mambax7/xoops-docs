---
title: "Module-ontwikkeling"
description: "Uitgebreide gids voor het ontwikkelen van XOOPS-modules met behulp van moderne PHP-praktijken"
---
Deze sectie biedt uitgebreide documentatie voor het ontwikkelen van XOOPS-modules met behulp van moderne PHP-praktijken, ontwerppatronen en best practices.

## Overzicht

De ontwikkeling van de XOOPS-module is in de loop der jaren aanzienlijk geëvolueerd. Moderne modules maken gebruik van:

- **MVC Architectuur** - Schone scheiding van zorgen
- **PHP 8.x Functies** - Typedeclaraties, attributen, benoemde argumenten
- **Ontwerppatronen** - Repository, DTO, Service Layer-patronen
- **Testen** - PHPUnit met moderne testpraktijken
- **XMF Framework** - XOOPS Module Framework-hulpprogramma's

## Documentatiestructuur

### Handleidingen

Stapsgewijze handleidingen voor het helemaal opnieuw bouwen van XOOPS-modules.

- Tutorials/Hello-World-Module - Je eerste XOOPS-module
- Tutorials/Een-CRUD-module bouwen - Volledige functionaliteit voor maken, lezen, bijwerken en verwijderen

### Ontwerppatronen

Architecturale patronen die worden gebruikt bij de moderne XOOPS-moduleontwikkeling.

- Patronen/MVC-Pattern - Model-View-Controller-architectuur
- Patronen/Repository-Pattern - Abstractie van gegevenstoegang
- Patronen/DTO-Pattern - Gegevensoverdrachtobjecten voor een schone gegevensstroom

### Beste praktijken

Richtlijnen voor het schrijven van onderhoudbare code van hoge kwaliteit.

- Best practices/Clean-Code - Schone codeprincipes voor XOOPS
- Beste praktijken/code-geuren - Veelvoorkomende antipatronen en hoe u deze kunt oplossen
- Best practices/testen - PHPUnit-teststrategieën

### Voorbeelden

Real-world moduleanalyse en implementatievoorbeelden.

- Publisher-module-analyse - Diepe duik in de Publisher-module

## Modulemapstructuur

Een goed georganiseerde XOOPS-module volgt deze directorystructuur:

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

## Belangrijke bestanden uitgelegd

### xoops_version.php

Het moduledefinitiebestand dat XOOPS over uw module vertelt:

```php
<?php
$modversion = [];

// Basic Information
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Module Flags
$modversion['hasMain']     = 1;  // Has frontend pages
$modversion['hasAdmin']    = 1;  // Has admin section
$modversion['system_menu'] = 1;  // Show in admin menu

// Admin Configuration
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Database
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// Templates
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// Blocks
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Module Preferences
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### Algemeen Inclusief bestand

Maak een algemeen bootstrapbestand voor uw module:

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

## PHP Versievereisten

Moderne XOOPS-modules moeten zich richten op PHP 8.0 of hoger om gebruik te maken van:

- **Promotie van onroerend goed voor constructeurs**
- **Genoemde argumenten**
- **Verenigingstypen**
- **Overeenkomen met expressies**
- **Kenmerken**
- **Nullsafe-operator**

## Aan de slag

1. Begin met de tutorial Tutorials/Hello-World-Module
2. Voortgang naar tutorials/Een-CRUD-module bouwen
3. Bestudeer de Patterns/MVC-Pattern voor architectuurrichtlijnen
4. Pas overal best practices/Clean-Code-praktijken toe
5. Implementeer best practices/testen vanaf het begin

## Gerelateerde bronnen

- ../05-XMF-Framework/XMF-Framework - XOOPS Module Framework-hulpprogramma's
- Databasebewerkingen - Werken met de XOOPS-database
- ../04-API-Reference/Template/Template-System - Slimme templates in XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Uw module beveiligen

## Versiegeschiedenis

| Versie | Datum | Wijzigingen |
|---------|------|---------|
| 1,0 | 28-01-2025 | Initiële documentatie |