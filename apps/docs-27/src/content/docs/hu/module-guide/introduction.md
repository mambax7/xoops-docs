---
title: "modul fejlesztés"
description: "Átfogó útmutató XOOPS modulok fejlesztéséhez modern PHP gyakorlatok segítségével"
---
Ez a rész átfogó dokumentációt nyújt a XOOPS modulok fejlesztéséhez a modern PHP gyakorlatok, tervezési minták és legjobb gyakorlatok felhasználásával.

## Áttekintés

XOOPS modulfejlesztés az évek során jelentősen fejlődött. A modern modulok kihasználják:

- **MVC architektúra** - Az aggályok tiszta elkülönítése
- **PHP 8.x funkciók** - Típusdeklarációk, attribútumok, elnevezett argumentumok
- **Tervezési minták** - Adattár, DTO, szolgáltatási rétegminták
- **Tesztelés** - PHPUnit modern tesztelési gyakorlattal
- **XMF Framework** - XOOPS modul Framework segédprogramok

## Dokumentációs szerkezet

### Oktatóanyagok

Lépésről lépésre útmutatók a XOOPS modulok a semmiből történő építéséhez.

- Tutorials/Hello-World-module - Az első XOOPS modul
- Tutorials/Building-a-CRUD-module - Teljes létrehozási, olvasási, frissítési és törlési funkciók

### Tervezési minták

A modern XOOPS modulfejlesztésben használt építészeti minták.

- Patterns/MVC-Pattern - Modell-View-Controller architektúra
- Patterns/Repository-Pattern - Adatelérési absztrakció
- Patterns/DTO-Pattern - Adatátviteli objektumok a tiszta adatáramlás érdekében

### Bevált gyakorlatok

Útmutató karbantartható, jó minőségű kód írásához.

- Best-Practices/Clean-Code - A tiszta kód alapelvei a XOOPS számára
- Best-Practices/Code-Smells - Gyakori anti-minták és javításuk
- Best-Practices/Testing - PHPUnit tesztelési stratégiák

### Példák

Valós modulelemzési és megvalósítási példák.

- Publisher-module-Analysis - Mélyen merüljön el a Publisher modulban

## modul címtárszerkezete

Egy jól szervezett XOOPS modul ezt a könyvtárstruktúrát követi:

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

## A kulcsfájlok magyarázata

### xoops_version.php

A moduldefiníciós fájl, amely a XOOPS-t tájékoztatja a moduljáról:

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

Hozzon létre egy közös bootstrap fájlt a modulhoz:

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

## PHP Verziókövetelmények

A modern XOOPS moduloknak a PHP 8.0 vagy újabb verzióját kell célozniuk, hogy kihasználják:

- **Építői ingatlanok promóciója**
- **Elnevezett érvek**
- ** Szakszervezeti típusok**
- **Kifejezések egyezése**
- **Tulajdonságok**
- **Nullsafe kezelő**

## Első lépések

1. Kezdje a Tutorials/Hello-World-module oktatóanyaggal
2. Haladás a Tutorials/Building-a-CRUD-module-ra
3. Tanulmányozza a Patterns/MVC-Pattern-t az építészeti útmutatásért
4. Alkalmazza a Best-Practices/Clean-Code gyakorlatokat végig
5. Valósítsa meg a Best-Practices/Testing-t a kezdetektől

## Kapcsolódó források

- ../05-XMF-Framework/XMF-Framework - XOOPS modul keretrendszer segédprogramok
- Adatbázis-műveletek - Munka a XOOPS adatbázissal
- ../04-API-Reference/Template/Template-System - Okos sablonozás XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - A modul biztonsága

## Verzióelőzmények

| Verzió | Dátum | Változások |
|---------|------|---------|
| 1.0 | 2025-01-28 | Kezdeti dokumentáció |
