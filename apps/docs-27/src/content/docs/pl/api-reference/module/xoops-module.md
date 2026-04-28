---
title: "Odniesienie API XoopsModule"
description: "Kompletne odniesienie API dla XoopsModule i klas systemu modułów"
---

> Kompletna dokumentacja API systemu modułów XOOPS.

---

## Architektura Systemu Modułów

```mermaid
graph TB
    subgraph "Ładowanie Modułu"
        A[Żądanie] --> B[Router]
        B --> C{Moduł Istnieje?}
        C -->|Tak| D[Załaduj xoops_version.php]
        C -->|Nie| E[Błąd 404]
        D --> F[Inicjalizuj Moduł]
        F --> G[Sprawdź Uprawnienia]
        G --> H[Wykonaj Kontroler]
    end

    subgraph "Komponenty Modułu"
        I[XoopsModule] --> J[Config]
        I --> K[Templates]
        I --> L[Blocks]
        I --> M[Handlers]
        I --> N[Preloads]
    end

    H --> I
```

---

## Klasa XoopsModule

### Definicja Klasy

```php
class XoopsModule extends XoopsObject
{
    // Właściwości
    public $modinfo;      // Tablica informacji modułu
    public $adminmenu;    // Elementy menu administracyjnego

    // Metody
    public function __construct();
    public function loadInfo(string $dirname, bool $verbose = true): bool;
    public function getInfo(string $name = null): mixed;
    public function setInfo(string $name, mixed $value): bool;
    public function mainLink(): string;
    public function subLink(): string;
    public function loadAdminMenu(): void;
    public function getAdminMenu(): array;
    public function loadConfig(): bool;
    public function getConfig(string $name = null): mixed;
}
```

### Właściwości

| Właściwość | Typ | Opis |
|-----------|-----|------|
| `mid` | int | ID modułu |
| `name` | string | Nazwa wyświetlana |
| `version` | string | Numer wersji |
| `dirname` | string | Nazwa katalogu |
| `isactive` | int | Status aktywności (0/1) |
| `hasmain` | int | Ma główny obszar |
| `hasadmin` | int | Ma obszar admin |
| `hassearch` | int | Ma funkcję wyszukiwania |
| `hasconfig` | int | Ma konfigurację |
| `hascomments` | int | Ma komentarze |
| `hasnotification` | int | Ma powiadomienia |

### Kluczowe Metody

```php
// Pobierz instancję modułu
$module = $GLOBALS['xoopsModule'];

// Lub załaduj po dirname
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');

// Pobierz informacje modułu
$version = $module->getVar('version');
$name = $module->getVar('name');
$dirname = $module->getVar('dirname');

// Pobierz config modułu
$config = $module->getConfig();
$specificConfig = $module->getConfig('items_per_page');

// Sprawdź czy moduł ma funkcję
$hasAdmin = $module->getVar('hasadmin');
$hasSearch = $module->getVar('hassearch');

// Pobierz ścieżkę modułu
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $module->getVar('dirname');
$moduleUrl = XOOPS_URL . '/modules/' . $module->getVar('dirname');
```

---

## XoopsModuleHandler

### Definicja Klasy

```php
class XoopsModuleHandler extends XoopsPersistableObjectHandler
{
    public function create(bool $isNew = true): XoopsModule;
    public function get(int $id): ?XoopsModule;
    public function getByDirname(string $dirname): ?XoopsModule;
    public function insert(XoopsObject $module, bool $force = false): bool;
    public function delete(XoopsObject $module, bool $force = false): bool;
    public function getList(?CriteriaElement $criteria = null): array;
    public function getObjects(?CriteriaElement $criteria = null): array;
}
```

### Przykłady Użycia

```php
// Pobierz handler
$moduleHandler = xoops_getHandler('module');

// Pobierz wszystkie aktywne moduły
$criteria = new Criteria('isactive', 1);
$activeModules = $moduleHandler->getObjects($criteria);

// Pobierz moduł po dirname
$publisherModule = $moduleHandler->getByDirname('publisher');

// Pobierz moduły z admin
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('isactive', 1));
$criteria->add(new Criteria('hasadmin', 1));
$adminModules = $moduleHandler->getObjects($criteria);

// Sprawdź czy moduł jest zainstalowany
$module = $moduleHandler->getByDirname('mymodule');
if ($module && $module->getVar('isactive')) {
    // Moduł jest zainstalowany i aktywny
}
```

---

## Cykl Życia Modułu

```mermaid
stateDiagram-v2
    [*] --> Uninstalled

    Uninstalled --> Installing: Zainstaluj Moduł
    Installing --> Installed: Sukces
    Installing --> Uninstalled: Niepowodzenie

    Installed --> Active: Aktywuj
    Installed --> Uninstalling: Odinstaluj

    Active --> Inactive: Deaktywuj
    Active --> Updating: Dostępna Aktualizacja

    Inactive --> Active: Aktywuj
    Inactive --> Uninstalling: Odinstaluj

    Updating --> Active: Sukces Aktualizacji
    Updating --> Active: Niepowodzenie Aktualizacji

    Uninstalling --> Uninstalled: Sukces
    Uninstalling --> Installed: Niepowodzenie

    Uninstalled --> [*]
```

---

## Struktura xoops_version.php

```php
<?php
// Metadane modułu
$modversion['name']        = _MI_MYMODULE_NAME;
$modversion['version']     = '1.0.0';
$modversion['description'] = _MI_MYMODULE_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['license']     = 'GPL 2.0+';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = basename(__DIR__);

// Wymagania
$modversion['min_php']     = '7.4';
$modversion['min_xoops']   = '2.5.10';
$modversion['min_admin']   = '1.2';
$modversion['min_db']      = ['mysql' => '5.7', 'mysqli' => '5.7'];

// Funkcje
$modversion['hasMain']     = 1;
$modversion['hasAdmin']    = 1;
$modversion['hasSearch']   = 1;
$modversion['hasComments'] = 1;
$modversion['hasNotification'] = 1;

// Menu Admin
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Tabele bazy danych
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    $modversion['dirname'] . '_items',
    $modversion['dirname'] . '_categories',
];

// Szablony
$modversion['templates'] = [
    ['file' => 'mymodule_index.tpl', 'description' => 'Index template'],
    ['file' => 'mymodule_item.tpl', 'description' => 'Item template'],
];

// Bloki
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => _MI_MYMODULE_BLOCK_RECENT,
    'description' => _MI_MYMODULE_BLOCK_RECENT_DESC,
    'show_func'   => 'mymodule_block_recent_show',
    'edit_func'   => 'mymodule_block_recent_edit',
    'options'     => '10|0',
    'template'    => 'mymodule_block_recent.tpl',
];

// Opcje konfiguracji
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

// Wyszukiwanie
$modversion['search'] = [
    'file' => 'include/search.inc.php',
    'func' => 'mymodule_search',
];

// Komentarze
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
    'callbackFile' => 'include/comment_functions.php',
    'callback' => [
        'approve' => 'mymodule_comment_approve',
        'update'  => 'mymodule_comment_update',
    ],
];

// Powiadomienia
$modversion['notification'] = [
    'lookup_file' => 'include/notification.inc.php',
    'lookup_func' => 'mymodule_notify_iteminfo',
    'category' => [
        [
            'name'           => 'global',
            'title'          => _MI_MYMODULE_NOTIFY_GLOBAL,
            'description'    => _MI_MYMODULE_NOTIFY_GLOBAL_DESC,
            'subscribe_from' => ['index.php'],
        ],
        [
            'name'           => 'item',
            'title'          => _MI_MYMODULE_NOTIFY_ITEM,
            'description'    => _MI_MYMODULE_NOTIFY_ITEM_DESC,
            'subscribe_from' => ['item.php'],
            'item_name'      => 'item_id',
            'allow_bookmark' => 1,
        ],
    ],
    'event' => [
        [
            'name'          => 'new_item',
            'category'      => 'global',
            'title'         => _MI_MYMODULE_NOTIFY_NEW_ITEM,
            'caption'       => _MI_MYMODULE_NOTIFY_NEW_ITEM_CAP,
            'description'   => _MI_MYMODULE_NOTIFY_NEW_ITEM_DESC,
            'mail_template' => 'notify_newitem',
            'mail_subject'  => _MI_MYMODULE_NOTIFY_NEW_ITEM_SBJ,
        ],
    ],
];
```

---

## Wzorzec Helper Modułu

```php
<?php
namespace XoopsModules\MyModule;

class Helper extends \Xmf\Module\Helper
{
    public function __construct()
    {
        $this->dirname = basename(dirname(__DIR__));
    }

    public static function getInstance(): self
    {
        static $instance = null;
        if ($instance === null) {
            $instance = new self();
        }
        return $instance;
    }

    public function getHandler(string $name): ?object
    {
        return $this->getHandlerByName($name);
    }

    public function getConfig(string $name = null)
    {
        return parent::getConfig($name);
    }
}

// Użycie
$helper = Helper::getInstance();
$itemHandler = $helper->getHandler('Item');
$perPage = $helper->getConfig('items_per_page');
```

---

## Przepływ Instalacji Modułu

```mermaid
sequenceDiagram
    participant Admin
    participant System
    participant Database
    participant FileSystem

    Admin->>System: Zainstaluj Moduł
    System->>FileSystem: Czytaj xoops_version.php
    FileSystem-->>System: Config Modułu

    System->>Database: Utwórz tabele (mysql.sql)
    Database-->>System: Tabele utworzone

    System->>Database: Wstaw rekord modułu
    System->>Database: Wstaw opcje konfiguracji
    System->>Database: Wstaw szablony
    System->>Database: Wstaw bloki

    System->>FileSystem: Kompiluj szablony
    FileSystem-->>System: Szablony skompilowane

    System->>Database: Ustaw moduł jako aktywny
    System-->>Admin: Instalacja ukończona
```

---

## Powiązana Dokumentacja

- API XoopsObject
- Przewodnik Rozwoju Modułów
- Architektura XOOPS

---

#xoops #api #module #xoopsmodule #reference
