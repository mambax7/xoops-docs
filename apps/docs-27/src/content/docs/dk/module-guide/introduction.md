---
title: "Moduludvikling"
description: "Omfattende guide til udvikling af XOOPS-moduler ved hjælp af moderne PHP-praksis"
---

Dette afsnit indeholder omfattende dokumentation til udvikling af XOOPS-moduler ved hjælp af moderne PHP-praksis, designmønstre og bedste praksis.

## Oversigt

XOOPS moduludvikling har udviklet sig betydeligt gennem årene. Moderne moduler udnytter:

- **MVC arkitektur** - Ren adskillelse af bekymringer
- **PHP 8.x funktioner** - Typeerklæringer, attributter, navngivne argumenter
- **Designmønstre** - Repository, DTO, Service Layer-mønstre
- **Test** - PHPUnit med moderne testpraksis
- **XMF Framework** - XOOPS Module Framework-værktøjer

## Dokumentationsstruktur

### Selvstudier

Trin-for-trin guider til at bygge XOOPS moduler fra bunden.

- Tutorials/Hello-World-Module - Dit første XOOPS modul
- Selvstudier/Building-a-CRUD-Module - Fuldfør Opret, Læs, Opdater, Slet funktionalitet

### Designmønstre

Arkitektoniske mønstre brugt i moderne XOOPS moduludvikling.

- Mønstre/MVC-mønster - Model-View-Controller-arkitektur
- Patterns/Repository-Pattern - Dataadgangsabstraktion
- Patterns/DTO-Pattern - Dataoverførselsobjekter til rent dataflow

### Bedste praksis

Retningslinjer for skrivning af vedligeholdelsesvenlig kode af høj kvalitet.

- Bedste praksis/Clean-Code - Rene kodeprincipper for XOOPS
- Best-Practices/Code-Smells - Almindelige anti-mønstre og hvordan man løser dem
- Bedste praksis/test - PHPUnit teststrategier

### Eksempler

Eksempler på modulanalyse og implementering i den virkelige verden.

- Publisher-Module-Analysis - Dybt dyk ned i Publisher-modulet

## Modulkatalogstruktur

Et velorganiseret XOOPS-modul følger denne mappestruktur:

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

## Nøglefiler forklaret

### xoops_version.php

Moduldefinitionsfilen, der fortæller XOOPS om dit modul:

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

### Fælles inkludere fil

Opret en fælles bootstrap-fil til dit modul:

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

## PHP versionskrav

Moderne XOOPS-moduler bør målrette mod PHP 8.0 eller højere for at udnytte:

- **Promovering af entreprenørejendomme**
- **Navngivne argumenter**
- **Uniontyper**
- **Match-udtryk**
- **Attributter**
- **Nullsafe-operatør**

## Kom godt i gang

1. Start med selvstudiet/Hej-verden-modulet
2. Fremskridt til selvstudier/Building-a-CRUD-modul
3. Studer Patterns/MVC-Pattern til arkitekturvejledning
4. Anvend best-practices/clean-code-praksis hele vejen igennem
5. Implementer bedste praksis/test fra begyndelsen

## Relaterede ressourcer

- ../05-XMF-Framework/XMF-Framework - XOOPS Module Framework-værktøjer
- Database-operationer - Arbejde med XOOPS databasen
- ../04-API-Reference/Template/Template-System - Smart skabelon i XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Sikring af dit modul

## Versionshistorik

| Version | Dato | Ændringer |
|--------|-------|--------|
| 1,0 | 28-01-2025 | Indledende dokumentation |
