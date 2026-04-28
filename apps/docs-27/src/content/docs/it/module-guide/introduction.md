---
title: "Sviluppo dei Moduli"
description: "Guida completa allo sviluppo di moduli XOOPS usando pratiche PHP moderne"
---

Questa sezione fornisce documentazione completa per lo sviluppo di moduli XOOPS usando pratiche PHP moderne, design pattern e migliori pratiche.

## Panoramica

Lo sviluppo dei moduli XOOPS si è evoluto significativamente nel corso degli anni. I moduli moderni sfruttano:

- **Architettura MVC** - Separazione netta dei compiti
- **Funzionalità PHP 8.x** - Type declarations, attributes, named arguments
- **Design Pattern** - Pattern Repository, DTO, Service Layer
- **Testing** - PHPUnit con pratiche di testing moderne
- **XMF Framework** - Utilità del framework dei moduli XOOPS

## Struttura della Documentazione

### Tutorial

Guide passo dopo passo per la costruzione di moduli XOOPS da zero.

- Tutorials/Hello-World-Module - Il tuo primo modulo XOOPS
- Tutorials/Building-a-CRUD-Module - Funzionalità completa Create, Read, Update, Delete

### Design Pattern

Pattern architetturali utilizzati nello sviluppo moderno dei moduli XOOPS.

- Patterns/MVC-Pattern - Architettura Model-View-Controller
- Patterns/Repository-Pattern - Astrazione dell'accesso ai dati
- Patterns/DTO-Pattern - Oggetti di Trasferimento Dati per il flusso di dati pulito

### Migliori Pratiche

Linee guida per la scrittura di codice mantenibile e di alta qualità.

- Best-Practices/Clean-Code - Principi di codice pulito per XOOPS
- Best-Practices/Code-Smells - Anti-pattern comuni e come risolverli
- Best-Practices/Testing - Strategie di testing PHPUnit

### Esempi

Analisi e esempi di implementazione nel mondo reale.

- Publisher-Module-Analysis - Approfondimento nel modulo Publisher

## Struttura della Directory del Modulo

Un modulo XOOPS ben organizzato segue questa struttura di directory:

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

## Spiegazione dei File Chiave

### xoops_version.php

Il file di definizione del modulo che dice a XOOPS informazioni sul tuo modulo:

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

### File di Inclusione Comune

Crea un file di bootstrap comune per il tuo modulo:

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

## Requisiti della Versione PHP

I moduli XOOPS moderni dovrebbero mirare a PHP 8.0 o superiore per sfruttare:

- **Constructor Property Promotion**
- **Named Arguments**
- **Union Types**
- **Match Expressions**
- **Attributes**
- **Nullsafe Operator**

## Per Iniziare

1. Inizia con il tutorial Tutorials/Hello-World-Module
2. Avanza a Tutorials/Building-a-CRUD-Module
3. Studia il Pattern Patterns/MVC-Pattern per la guida all'architettura
4. Applica le pratiche Best-Practices/Clean-Code in tutto
5. Implementa Best-Practices/Testing da subito

## Risorse Correlate

- ../05-XMF-Framework/XMF-Framework - Utilità del framework dei moduli XOOPS
- Database-Operations - Lavoro con il database XOOPS
- ../04-API-Reference/Template/Template-System - Template Smarty in XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Protezione del tuo modulo

## Cronologia delle Versioni

| Versione | Data | Modifiche |
|---------|------|---------|
| 1.0 | 2025-01-28 | Documentazione iniziale |
