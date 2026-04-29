---
title: "Razvoj modula"
description: "Obsežen vodnik za razvoj XOOPS modulov z uporabo sodobnih PHP praks"
---
Ta razdelek ponuja obsežno dokumentacijo za razvoj XOOPS modulov z uporabo sodobnih PHP praks, vzorcev oblikovanja in najboljših praks.

## Pregled

XOOPS Razvoj modula se je z leti močno razvil. Sodobni moduli izkoriščajo:

- **MVC Arhitektura** - Čisto ločevanje skrbi
- **PHP Funkcije 8.x** - Izjave tipov, atributi, imenovani argumenti
- **Design Patterns** - Repozitorij, DTO, vzorci storitvene plasti
- **Testiranje** - PHPUnit s sodobnimi praksami testiranja
- **XMF Framework** - XOOPS Module Framework pripomočki

## Struktura dokumentacije

### Vadnice

Navodila po korakih za izdelavo modulov XOOPS iz nič.

- Tutorials/Hello-World-Module - Vaš prvi modul XOOPS
- Tutorials/Building-a-CRUD-Modul - Popolna funkcija ustvarjanja, branja, posodabljanja, brisanja

### Oblikovalski vzorci

Arhitekturni vzorci, uporabljeni v sodobnem razvoju modulov XOOPS.

- Vzorci/MVC-Vzorec - Arhitektura Model-Pogled-Krmilnik
- Patterns/Repository-Pattern - Abstrakcija dostopa do podatkov
- Patterns/DTO-Pattern - Objekti prenosa podatkov za čist pretok podatkov

### Najboljše prakse

Smernice za pisanje vzdržljive visokokakovostne kode.

- Best-Practices/Clean-Code - Načela čiste kode za XOOPS
- Best-Practices/Code-Smells - Pogosti anti-vzorci in kako jih popraviti
- Best-Practices/Testing - Strategije testiranja PHPUnit### Primeri

Analiza modulov v resničnem svetu in primeri implementacije.

– Analiza modula založnika – Poglobite se v modul založnika

## Struktura imenika modulov

Dobro organiziran modul XOOPS sledi tej strukturi imenika:
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
## Razložene ključne datoteke

### xoops_version.php

The module definition file that tells XOOPS about your module:
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
### Skupna vključena datoteka

Ustvarite skupno zagonsko datoteko za svoj modul:
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
## PHP Zahteve za različico

Sodobni moduli XOOPS bi morali ciljati na PHP 8.0 ali višje, da bi izkoristili:

- **Promocija gradbenih nepremičnin**
- **Imenovani argumenti**
- **Vrste sindikatov**
- **Ujemanje izrazov**
- **Atributi**
- **Nullsafe Operator**

## Kako začeti

1. Začnite z vadnico Tutorials/Hello-World-Module
2. Napredek do Tutorials/Building-a-CRUD-modula
3. Preučite Patterns/MVC-Pattern za arhitekturne smernice
4. Povsod uporabljajte prakse Best-Practices/Clean-Code
5. Implementirajte Best-Practices/Testing od začetka

## Sorodni viri

- ../05-XMF-Framework/XMF-Framework - XOOPS pripomočki Module Framework
- Database-Operations - Delo z bazo podatkov XOOPS
- ../04-API-Reference/Template/Template-System - Smarty templating v XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Zaščita vašega modula

## Zgodovina različic

| Različica | Datum | Spremembe |
|---------|------|---------|
| 1,0 | 2025-01-28 | Začetna dokumentacija |