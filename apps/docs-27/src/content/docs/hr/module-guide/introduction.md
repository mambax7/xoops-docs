---
title: "Razvoj modula"
description: "Sveobuhvatni vodič za razvoj XOOPS modules korištenjem modernih praksi PHP"
---
Ovaj odjeljak pruža sveobuhvatnu dokumentaciju za razvoj XOOPS modules korištenjem modernih PHP praksi, uzoraka dizajna i najboljih praksi.

## Pregled

Razvoj modula XOOPS značajno je evoluirao tijekom godina. Moderna poluga modules:

- **MVC Arhitektura** - Čisto odvajanje briga
- **PHP 8.x Značajke** - Deklaracije tipa, atributi, imenovani argumenti
- **Uzorci dizajna** - Repozitorij, DTO, Uzorci sloja usluge
- **Testiranje** - PHPUnit s modernim praksama testiranja
- **XMF Framework** - XOOPS Module Framework pomoćni programi

## Struktura dokumentacije

### Vodiči

Vodiči korak po korak za izradu XOOPS modules od nule.

- Vodiči/Hello-World-Module - Vaš prvi XOOPS modul
- Tutorials/Building-a-CRUD-Module - Potpuna funkcija stvaranja, čitanja, ažuriranja, brisanja

### Dizajn uzorci

Arhitektonski uzorci korišteni u modernom razvoju modula XOOPS.

- Uzorci/MVC-Uzorak - Arhitektura Model-View-Controller
- Patterns/Repository-Pattern - Apstrakcija pristupa podacima
- Patterns/DTO-Pattern - Objekti prijenosa podataka za čisti protok podataka

### Najbolji primjeri iz prakse

Smjernice za pisanje visokokvalitetnog koda koji se može održavati.

- Najbolje prakse/Clean-Code - Načela čistog koda za XOOPS
- Najbolje prakse/Mirisi kodova - Uobičajeni anti-obrasci i kako ih popraviti
- Najbolje prakse/testiranje - PHPUnit strategije testiranja

### Primjeri

Analiza modula iz stvarnog svijeta i primjeri implementacije.

- Analiza modula izdavača - Duboko zaronite u modul izdavača

## Struktura direktorija modula

Dobro organiziran modul XOOPS slijedi ovu strukturu direktorija:

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

## Objašnjenje ključnih datoteka

### xoops_version.php

Datoteka definicije modula koja govori XOOPS o vašem modulu:

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

### Uobičajena uključena datoteka

Napravite zajedničku bootstrap datoteku za svoj modul:

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

## Zahtjevi za verziju PHP

Moderni XOOPS modules trebao bi ciljati PHP 8.0 ili noviji kako bi iskoristio:

- **Promocija nekretnine za graditelje**
- **Imenovani argumenti**
- **Vrste sindikata**
- **Podudaranje izraza**
- **Atributi**
- **Nullsigurni operator**

## Početak

1. Započnite s vodičem Tutorials/Hello-World-Module
2. Napredak do Tutorials/Building-a-CRUD-Module
3. Proučite Patterns/MVC-Pattern za smjernice za arhitekturu
4. Primijenite prakse najbolje prakse/čistog koda u cijelosti
5. Provedite najbolju praksu/testiranje od početka

## Povezani resursi

- ../05-XMF-Framework/XMF-Framework - XOOPS Module Framework pomoćni programi
- Operacije baze podataka - Rad s bazom podataka XOOPS
- ../04-API-Reference/Template/Template-System - Smarty šabloniranje u XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Zaštita vašeg modula

## Povijest verzija

| Verzija | Datum | Promjene |
|---------|------|---------|
| 1.0 | 2025-01-28 | Početna dokumentacija |
