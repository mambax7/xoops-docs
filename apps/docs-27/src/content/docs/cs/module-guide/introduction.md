---
title: "Vývoj modulu"
description: "Komplexní průvodce vývojem modulů XOOPS pomocí moderních postupů PHP"
---

Tato část poskytuje komplexní dokumentaci pro vývoj modulů XOOPS pomocí moderních postupů, návrhových vzorů a osvědčených postupů PHP.

## Přehled

Vývoj modulů XOOPS se v průběhu let výrazně vyvíjel. Využití moderních modulů:

- **MVC Architektura** - Čisté oddělení zájmů
- **Funkce PHP 8.x** - Zadejte deklarace, atributy, pojmenované argumenty
- **Vzory návrhu** - Úložiště, DTO, vzory vrstvy služeb
- **Testování** - PHPUnit s moderními testovacími postupy
- **XMF Framework** - Nástroje XOOPS Module Framework

## Struktura dokumentace

### Tutoriály

Podrobné pokyny pro stavbu modulů XOOPS od začátku.

- Tutorials/Hello-World-Module - Váš první modul XOOPS
- Tutorials/Building-a-CRUD-Module - Kompletní funkce vytváření, čtení, aktualizace, mazání

### Návrhové vzory

Architektonické vzory používané při vývoji moderních modulů XOOPS.

- Patterns/MVC-Pattern - Architektura Model-View-Controller
- Patterns/Repository-Pattern - Abstrakce přístupu k datům
- Patterns/DTO-Pattern - Objekty přenosu dat pro čistý tok dat

### Nejlepší postupy

Pokyny pro psaní udržovatelného a vysoce kvalitního kódu.

- Best-Practices/Clean-Code - Principy čistého kódu pro XOOPS
- Best-Practices/Code-Smells - Běžné anti-vzory a jak je opravit
- Best-Practices/Testing - Strategie testování PHPUnit

### Příklady

Analýza modulů v reálném světě a příklady implementace.

- Publisher-Module-Analýza - Ponořte se do hloubky modulu Publisher

## Struktura adresáře modulu

Dobře organizovaný modul XOOPS sleduje tuto adresářovou strukturu:

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

## Vysvětlení klíčových souborů

### xoops_version.php

Soubor definice modulu, který informuje XOOPS o vašem modulu:

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

### Common Include File

Vytvořte společný bootstrap soubor pro váš modul:

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

## Požadavky na verzi PHP

Moderní moduly XOOPS by se měly zaměřit na PHP 8.0 nebo vyšší, aby mohly využít:

– **Propagace majetku konstruktéra**
- **Pojmenované argumenty**
- **Typy odborů**
- **Shoda výrazů**
- **Atributy**
- **Operátor Nullsafe**

## Začínáme

1. Začněte výukovým programem Tutorials/Hello-World-Module
2. Přejděte na Tutorials/Building-a-CRUD-Module
3. Prostudujte si návod k architektuře Patterns/MVC-Pattern
4. Aplikujte postupy Best-Practices/Clean-Code
5. Implementujte Best-Practices/Testing od začátku

## Související zdroje

- ../05-XMF-Framework/XMF-Framework - Nástroje rámce modulu XOOPS
- Operace databáze - Práce s databází XOOPS
- ../04-API-Reference/Template/Template-System - Šablona Smarty v XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Zabezpečení vašeho modulu

## Historie verzí

| Verze | Datum | Změny |
|---------|------|---------|
| 1,0 | 2025-01-28 | Počáteční dokumentace |