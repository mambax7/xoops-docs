---
title: "Rozwój modułów"
description: "Kompleksowy przewodnik do tworzenia modułów XOOPS przy użyciu nowoczesnych praktyk PHP"
---

Ta sekcja zawiera kompleksową dokumentację do tworzenia modułów XOOPS przy użyciu nowoczesnych praktyk PHP, wzorców projektowych i najlepszych praktyk.

## Przegląd

Rozwój modułów XOOPS znacznie się zmienił na przestrzeni lat. Nowoczesne moduły wykorzystują:

- **Architektura MVC** - Czysty podział odpowiedzialności
- **Funkcje PHP 8.x** - Deklaracje typów, atrybuty, nazwane argumenty
- **Wzorce projektowe** - Wzorce Repository, DTO, Service Layer
- **Testowanie** - PHPUnit z nowoczesną praktyką testowania
- **Framework XMF** - Narzędzia XOOPS Module Framework

## Struktura dokumentacji

### Samouczki

Przewodniki krok po kroku do tworzenia modułów XOOPS od podstaw.

- Tutorials/Hello-World-Module - Twój pierwszy moduł XOOPS
- Tutorials/Building-a-CRUD-Module - Pełna funkcjonalność Create, Read, Update, Delete

### Wzorce projektowe

Wzorce architektoniczne używane w nowoczesnym rozwoju modułów XOOPS.

- Patterns/MVC-Pattern - Architektura Model-View-Controller
- Patterns/Repository-Pattern - Abstrakcja dostępu do danych
- Patterns/DTO-Pattern - Obiekty transferu danych do czystego przepływu danych

### Najlepsze praktyki

Wskazówki do pisania konserwowanego kodu wysokiej jakości.

- Best-Practices/Clean-Code - Zasady czystego kodu dla XOOPS
- Best-Practices/Code-Smells - Typowe antywzorce i jak ich naprawić
- Best-Practices/Testing - Strategie testowania PHPUnit

### Przykłady

Analiza modułów rzeczywistych i przykłady implementacji.

- Publisher-Module-Analysis - Głębokie zanurzenie się w moduł Publisher

## Struktura katalogów modułu

Dobrze zorganizowany moduł XOOPS podąża za tą strukturą katalogów:

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

## Objaśnienie kluczowych plików

### xoops_version.php

Plik definicji modułu, który mówi XOOPS o Twoim module:

```php
<?php
$modversion = [];

// Podstawowe informacje
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Flagi modułu
$modversion['hasMain']     = 1;  // Ma strony front-end
$modversion['hasAdmin']    = 1;  // Ma sekcję admin
$modversion['system_menu'] = 1;  // Pokaż w menu admin

// Konfiguracja Admin
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Baza danych
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// Szablony
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// Bloki
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Preferencje modułu
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### Plik Include wspólny

Utwórz wspólny plik bootstrap dla Twojego modułu:

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Stałe modułu
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// Autoload klas
require_once MYMODULE_PATH . '/class/autoload.php';
```

## Wymagania wersji PHP

Nowoczesne moduły XOOPS powinny być skierowane na PHP 8.0 lub wyżej, aby wykorzystać:

- **Promocja właściwości konstruktora**
- **Nazwane argumenty**
- **Typy unii**
- **Wyrażenia Match**
- **Atrybuty**
- **Operator bezpieczny dla wartości null**

## Wprowadzenie

1. Zacznij od samouczka Tutorials/Hello-World-Module
2. Przejdź do Tutorials/Building-a-CRUD-Module
3. Zbadaj Patterns/MVC-Pattern dla wytycznych architektonicznych
4. Zastosuj praktyki Best-Practices/Clean-Code w całym projekcie
5. Wdrażaj Best-Practices/Testing od początku

## Powiązane zasoby

- ../05-XMF-Framework/XMF-Framework - Narzędzia XOOPS Module Framework
- Database-Operations - Praca z bazą danych XOOPS
- ../04-API-Reference/Template/Template-System - System szablonów Smarty w XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Bezpieczeństwo modułu

## Historia wersji

| Wersja | Data | Zmiany |
|---------|------|---------|
| 1.0 | 2025-01-28 | Dokumentacja początkowa |
