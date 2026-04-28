---
title: "Modulentwicklung"
description: "Umfassender Leitfaden zur Entwicklung von XOOPS-Modulen mit modernen PHP-Praktiken"
---

Dieser Abschnitt bietet umfassende Dokumentation für die Entwicklung von XOOPS-Modulen mit modernen PHP-Praktiken, Design-Mustern und Best Practices.

## Überblick

Die XOOPS-Modulentwicklung hat sich im Laufe der Jahre erheblich entwickelt. Moderne Module nutzen:

- **MVC-Architektur** - Saubere Trennung von Bedenken
- **PHP 8.x-Funktionen** - Typdeklarationen, Attribute, benannte Argumente
- **Design-Muster** - Repository, DTO, Service Layer-Muster
- **Testen** - PHPUnit mit modernen Test-Praktiken
- **XMF-Framework** - XOOPS Module Framework-Dienstprogramme

## Dokumentationsstruktur

### Tutorials

Schritt-für-Schritt-Anleitungen zum Erstellen von XOOPS-Modulen von Grund auf.

- Tutorials/Hello-World-Module - Ihr erstes XOOPS-Modul
- Tutorials/Building-a-CRUD-Module - Vollständige Create, Read, Update, Delete-Funktionalität

### Design-Muster

Architektur-Muster, die in der modernen XOOPS-Modulentwicklung verwendet werden.

- Patterns/MVC-Pattern - Model-View-Controller-Architektur
- Patterns/Repository-Pattern - Datenzugriffsabstraktion
- Patterns/DTO-Pattern - Data Transfer Objects für sauberen Datenfluss

### Best Practices

Richtlinien zum Schreiben wartbarer, hochwertiger Code.

- Best-Practices/Clean-Code - Clean Code-Prinzipien für XOOPS
- Best-Practices/Code-Smells - Häufige Anti-Muster und deren Behebung
- Best-Practices/Testing - PHPUnit-Test-Strategien

### Beispiele

Analyse und Implementierungsbeispiele von echten Modulen.

- Publisher-Module-Analysis - Tiefenstudie des Publisher-Moduls

## Modulverzeichnisstruktur

Ein gut organisiertes XOOPS-Modul folgt dieser Verzeichnisstruktur:

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

## Schlüsseldateien erklärt

### xoops_version.php

Die Modul-Definitionsdatei, die XOOPS über Ihr Modul informiert:

```php
<?php
$modversion = [];

// Grundlegende Informationen
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Modul-Flaggen
$modversion['hasMain']     = 1;  // Hat Frontend-Seiten
$modversion['hasAdmin']    = 1;  // Hat Admin-Bereich
$modversion['system_menu'] = 1;  // Im Admin-Menü anzeigen

// Admin-Konfiguration
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Datenbank
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

// Blöcke
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Modul-Einstellungen
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### Gemeinsame Include-Datei

Erstellen Sie eine häufig verwendete Bootstrap-Datei für Ihr Modul:

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Modul-Konstanten
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// Autoload Klassen
require_once MYMODULE_PATH . '/class/autoload.php';
```

## PHP-Versionsanforderungen

Moderne XOOPS-Module sollten PHP 8.0 oder höher anstreben, um zu nutzen:

- **Constructor Property Promotion**
- **Named Arguments**
- **Union Types**
- **Match Expressions**
- **Attributes**
- **Nullsafe Operator**

## Erste Schritte

1. Beginnen Sie mit dem Tutorial Tutorials/Hello-World-Module
2. Gehen Sie zum Tutorial Tutorials/Building-a-CRUD-Module über
3. Studieren Sie das Patterns/MVC-Pattern für Architektur-Orientierung
4. Wenden Sie die Best-Practices/Clean-Code-Praktiken an
5. Implementieren Sie Best-Practices/Testing von Anfang an

## Verwandte Ressourcen

- ../05-XMF-Framework/XMF-Framework - XOOPS Module Framework-Dienstprogramme
- Database-Operations - Arbeiten mit der XOOPS-Datenbank
- ../04-API-Reference/Template/Template-System - Smarty-Templating in XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Sichern Sie Ihr Modul

## Versionsgeschichte

| Version | Datum | Änderungen |
|---------|------|---------|
| 1.0 | 2025-01-28 | Anfängliche Dokumentation |
