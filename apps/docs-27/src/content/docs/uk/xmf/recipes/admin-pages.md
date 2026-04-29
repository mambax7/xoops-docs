---
title: "Сторінки адміністратора модуля"
description: "Створення стандартизованих і сумісних із попередніми версіями сторінок адміністрування модулів із XMF"
---
Клас `XMF\Module\Admin` забезпечує послідовний спосіб створення інтерфейсів адміністрування модулів. Використання XMF для сторінок адміністратора забезпечує пряму сумісність із майбутніми версіями XOOPS, одночасно зберігаючи однакову взаємодію з користувачем.

## Огляд

Клас ModuleAdmin у XOOPS Frameworks полегшив адміністрування, але його API змінювався в різних версіях. Обгортка `XMF\Module\Admin`:

- Забезпечує стабільний API, який працює в усіх версіях XOOPS
- Автоматично обробляє API відмінності між версіями
- Гарантує, що ваш код адміністратора сумісний із попередніми версіями
- Пропонує зручні статичні методи для типових завдань

## Початок роботи

### Створення екземпляра адміністратора
```php
$admin = \Xmf\Module\Admin::getInstance();
```
Це повертає екземпляр `XMF\Module\Admin` або рідний системний клас, якщо він уже сумісний.

## Керування значками

### Проблема розташування піктограм

Піктограми переміщувалися між версіями XOOPS, що спричиняло головний біль з обслуговування. XMF вирішує це за допомогою корисних методів.

### Пошук значків

**Старий спосіб (залежно від версії):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```
**XMF спосіб:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```
Метод `iconUrl()` повертає повний URL, тому вам не потрібно турбуватися про побудову шляху.

### Розміри піктограм
```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```
### Значки меню

Для меню адміністратора.php files:

**Старий спосіб:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```
**XMF спосіб:**
```php
// Get path to icons
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```
## Стандартні сторінки адміністратора

### Індексна сторінка

**Старий формат:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```
**XMF формат:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```
### Про сторінку

**Старий формат:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```
**XMF формат:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```
> **Примітка:** У майбутніх версіях XOOPS інформація PayPal встановлюється в xoops_version.php. Виклик `setPaypal()` забезпечує сумісність із поточними версіями, але не впливає на новіші.

## Навігація

### Показати навігаційне меню
```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```
## Інформаційні поля

### Створення інформаційних блоків
```php
$admin = \Xmf\Module\Admin::getInstance();

// Add an info box
$admin->addInfoBox('Module Statistics');

// Add lines to the info box
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// Display the info box
$admin->displayInfoBox();
```
## Config Boxes

У вікнах конфігурації відображаються системні вимоги та перевірки стану.

### Основні рядки конфігурації
```php
$admin = \Xmf\Module\Admin::getInstance();

// Add a simple message
$admin->addConfigBoxLine('Module is properly configured', 'default');

// Check if directory exists
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Check directory with permissions
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Check if module is installed
$admin->addConfigBoxLine('xlanguage', 'module');

// Check module with warning instead of error if missing
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```
### Методи зручності
```php
$admin = \Xmf\Module\Admin::getInstance();

// Add error message
$admin->addConfigError('Upload directory is not writable');

// Add success/accept message
$admin->addConfigAccept('Database tables verified');

// Add warning message
$admin->addConfigWarning('Cache directory should be cleared');

// Check module version
$admin->addConfigModuleVersion('xlanguage', '1.0');
```
### Типи вікон конфігурації

| Тип | Значення | Поведінка |
|------|-------|----------|
| `default` | Рядок повідомлення | Відображає повідомлення безпосередньо |
| `folder` | Шлях до каталогу | Показує прийняти, якщо існує, помилку, якщо ні |
| `chmod` | `[path, permission]` | Перевіряє наявність каталогу з дозволом |
| `module` | Назва модуля | Прийняти, якщо встановлено, помилка, якщо ні |
| `module` | `[name, 'warning']` | Прийняти, якщо встановлено, попередження, якщо ні |

## Кнопки елементів

Додайте кнопки дій на сторінки адміністратора:
```php
$admin = \Xmf\Module\Admin::getInstance();

// Add buttons
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// Display buttons (left aligned by default)
$admin->displayButton('left');

// Or get HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```
## Повні приклади сторінок адміністратора

### index.php
```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Display navigation
$adminObject->displayNavigation(basename(__FILE__));

// Add info box with statistics
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Check configuration
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Check optional modules
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Display the index page
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```
### items.php
```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Get operation
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Add action buttons
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // List items
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Display table
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Form handling code...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```
### about.php
```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Set PayPal ID for donations (optional)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Display about page
// Pass false to hide XOOPS logo, true to show it
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```
### menu.php
```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Get icon path using XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Items
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Categories
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permissions
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// About
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```
## API Посилання

### Статичні методи

| Метод | Опис |
|--------|-------------|
| `getInstance()` | Отримати екземпляр адміністратора |
| `iconUrl($name, $size)` | Отримати значок URL (розмір: 16 або 32) |
| `menuIconPath($image)` | Отримати шлях до піктограми для меню.php |
| `setPaypal($paypal)` | Установіть ідентифікатор PayPal для сторінки about |

### Методи екземплярів

| Метод | Опис |
|--------|-------------|
| `displayNavigation($menu)` | Відображення навігаційного меню |
| `renderNavigation($menu)` | Повернутися до навігації HTML |
| `addInfoBox($title)` | Додати інформаційне поле |
| `addInfoBoxLine($text, $type, $color)` | Додати рядок до інформаційного поля |
| `displayInfoBox()` | Відображення інформаційного вікна |
| `renderInfoBox()` | Поле інформації про повернення HTML |
| `addConfigBoxLine($value, $type)` | Додати рядок перевірки конфігурації |
| `addConfigError($value)` | Додати помилку до вікна конфігурації |
| `addConfigAccept($value)` | Додати успіх до вікна конфігурації |
| `addConfigWarning($value)` | Додати попередження до вікна конфігурації |
| `addConfigModuleVersion($moddir, $version)` | Перевірити версію модуля |
| `addItemButton($title, $link, $icon, $extra)` | Додати кнопку дії |
| `displayButton($position, $delimiter)` | Кнопки дисплея |
| `renderButton($position, $delimiter)` | Кнопка повернення HTML |
| `displayIndex()` | Показати індексну сторінку |
| `renderIndex()` | Повернути покажчик HTML |
| `displayAbout($logo_xoops)` | Показати сторінку про |
| `renderAbout($logo_xoops)` | Повернутися про сторінку HTML |## Дивіться також

- ../Basics/XMF-Module-Helper - Клас допоміжного модуля
- Permission-Helper - Керування дозволами
- ../XMF-Framework - Огляд фреймворку

---

#XMF #admin #module-development #navigation #icons