---
title: "Moduł Hello World"
description: "Samouczek krok po kroku do tworzenia twojego pierwszego modułu XOOPS"
---

# Samouczek modułu Hello World

Ten samouczek prowadzi cię przez tworzenie twojego pierwszego modułu XOOPS. Na koniec będziesz mieć działający moduł, który wyświetla "Hello World" zarówno w obszarze front-end, jak i admin.

## Wymagania wstępne

- XOOPS 2.5.x zainstalowany i uruchomiony
- PHP 8.0 lub wyższe
- Podstawowa wiedza PHP
- Edytor tekstu lub IDE (rekomendowany PhpStorm)

## Krok 1: Utwórz strukturę katalogów

Utwórz następującą strukturę katalogów w `/modules/helloworld/`:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Krok 2: Utwórz definicję modułu

Create `xoops_version.php`:

```php
<?php
/**
 * Hello World Module - Module Definition
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Basic Module Information
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// Module Status
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// Admin Configuration
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main Menu
$modversion['hasMain'] = 1;

// Templates
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// Admin Templates
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// No database tables needed for this simple module
$modversion['tables'] = [];
```

## Krok 3: Utwórz pliki języka

### modinfo.php (Informacje o module)

Utwórz `language/english/modinfo.php`:

```php
<?php
/**
 * Stałe języka informacji modułu
 */

// Info modułu
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// Opisy szablonów
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```

### main.php (Język front-end)

Utwórz `language/english/main.php`:

```php
<?php
/**
 * Stałe języka front-end
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```

### admin.php (Język admin)

Utwórz `language/english/admin.php`:

```php
<?php
/**
 * Stałe języka admin
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```

## Krok 4: Utwórz index front-end

Create `index.php` in the module root:

```php
<?php
/**
 * Hello World Module - Frontend Index
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Load language file
xoops_loadLanguage('main', 'helloworld');

// Get the module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// Set page template
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Include XOOPS header
require XOOPS_ROOT_PATH . '/header.php';

// Get module configuration
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// Generate page content
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// Simple visitor counter (using session)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// Assign variables to template
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// Include XOOPS footer
require XOOPS_ROOT_PATH . '/footer.php';
```

## Krok 5: Utwórz szablon front-end

Utwórz `templates/helloworld_index.tpl`:

```smarty
<{* Hello World Module - Index Template *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```

## Krok 6: Utwórz pliki admin

### Nagłówek admin

Utwórz `admin/admin_header.php`:

```php
<?php
/**
 * Admin Header
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// Load admin language file
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// Get module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// Module directory
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### Stopka admin

Utwórz `admin/admin_footer.php`:

```php
<?php
/**
 * Stopka admin
 */

// Wyświetl stopkę admin
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### Menu admin

Utwórz `admin/menu.php`:

```php
<?php
/**
 * Konfiguracja menu admin
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// Pulpit
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### Strona indeksu admin

Utwórz `admin/index.php`:

```php
<?php
/**
 * Admin Index Page
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// Display admin navigation
$adminObject->displayNavigation('index.php');

// Create admin info box
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// Display info box
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// Display admin footer
require_once __DIR__ . '/admin_footer.php';
```

## Krok 7: Utwórz szablon admin

Utwórz `templates/admin/helloworld_admin_index.tpl`:

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## Krok 8: Utwórz logo modułu

Utwórz lub skopiuj obraz PNG (rekomendowany rozmiar: 92x92 piksele) do:
`assets/images/logo.png`

Możesz użyć dowolnego edytora obrazów do tworzenia prostego logo, lub użyć zastępczego z witryny takich jak placeholder.com.

## Krok 9: Zainstaluj moduł

1. Zaloguj się do swojej witryny XOOPS jako administrator
2. Przejdź do **Admin systemu** > **Moduły**
3. Znajdź "Hello World" na liście dostępnych modułów
4. Kliknij przycisk **Instaluj**
5. Potwierdź instalację

## Krok 10: Przetestuj twój moduł

### Test front-end

1. Przejdź do swojej witryny XOOPS
2. Kliknij na "Hello World" w menu głównym
3. Powinieneś zobaczyć wiadomość powitalną i bieżący czas

### Test admin

1. Przejdź do obszaru administracyjnego
2. Kliknij na "Hello World" w menu administracyjnym
3. Powinieneś zobaczyć pulpit administracyjny

## Rozwiązywanie problemów

### Moduł nie pojawia się na liście instalacji

- Sprawdź uprawnienia pliku (755 dla katalogów, 644 dla plików)
- Sprawdź, czy `xoops_version.php` nie ma błędów składniowych
- Wyczyść pamięć podręczną XOOPS

### Szablon się nie ładuje

- Upewnij się, że pliki szablonów znajdują się w poprawnym katalogu
- Sprawdź, czy nazwy plików szablonów pasują do tych w `xoops_version.php`
- Sprawdź, czy składnia Smarty jest poprawna

### Łańcuchy języka się nie wyświetlają

- Sprawdź ścieżki plików języka
- Upewnij się, że stałe języka są zdefiniowane
- Sprawdź, czy istnieje poprawny folder języka

## Następne kroki

Teraz, gdy masz działający moduł, kontynuuj naukę z:

- Building-a-CRUD-Module - Dodaj funkcjonalność bazy danych
- ../Patterns/MVC-Pattern - Organizuj swój kod prawidłowo
- ../Best-Practices/Testing - Dodaj testy PHPUnit

## Pełne odniesienie pliku

Twój ukończony moduł powinien mieć te pliki:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Podsumowanie

Gratulacje! Utworzyłeś swój pierwszy moduł XOOPS. Objęte kluczowe koncepcje:

1. **Struktura modułu** - Standardowy układ katalogów modułu XOOPS
2. **xoops_version.php** - Definicja modułu i konfiguracja
3. **Pliki języka** - Obsługa internacjonalizacji
4. **Szablony** - Integracja szablonów Smarty
5. **Interfejs admin** - Podstawowy panel administracyjny

Patrz także: ../Module-Development | Building-a-CRUD-Module | ../Patterns/MVC-Pattern
