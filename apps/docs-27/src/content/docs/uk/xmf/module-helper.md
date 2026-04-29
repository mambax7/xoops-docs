---
title: "XMF Помічник модуля"
description: 'Спрощено роботу модуля з використанням класу XMF\Module\Helper та відповідних помічників'
---
Клас `XMF\Module\Helper` забезпечує простий спосіб доступу до інформації, пов’язаної з модулем, конфігурацій, обробників тощо. Використання помічника модулів спрощує ваш код і зменшує шаблонність.

## Огляд

Помічник модуля забезпечує:

- Спрощений доступ до конфігурації
- Модуль пошуку об'єктів
— Створення екземпляра обробника
- Шлях і роздільна здатність URL
- Дозволи та помічники сеансу
- Керування кеш-пам'яттю

## Отримання помічника модуля

### Основне використання
```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```
### З поточного модуля

Якщо ви не вкажете назву модуля, він використовує поточний активний модуль:
```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```
## Доступ до конфігурації

### Традиційний XOOPS спосіб

Отримання конфігурації модуля старим способом є багатослівним:
```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```
### XMF Шлях

З допоміжним модулем те саме завдання стає простим:
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```
## Допоміжні методи

### getModule()

Повертає об’єкт XoopsModule для допоміжного модуля.
```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```
### getConfig($name, $default)

Повертає значення конфігурації модуля або всі конфігурації.
```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```
### getHandler($name)

Повертає обробник об’єкта для модуля.
```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```
### loadLanguage($name)

Завантажує мовний файл для модуля.
```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```
### isCurrentModule()

Перевіряє, чи цей модуль є поточним активним модулем.
```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```
### isUserAdmin()

Перевіряє, чи має поточний користувач права адміністратора для цього модуля.
```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```
## Шлях і URL Методи

### url($url)

Повертає абсолютний URL для відносного шляху модуля.
```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```
### шлях($path)

Повертає абсолютний шлях до файлової системи для відносного шляху модуля.
```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```
### uploadUrl($url)

Повертає абсолютний URL для файлів завантаження модуля.
```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```
### uploadPath($path)

Повертає абсолютний шлях файлової системи для файлів завантаження модуля.
```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```
### перенаправлення($url, $time, $message)

Переспрямовує в межах модуля до відносного модуля URL.
```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```
## Підтримка налагодження

### setDebug($bool)

Увімкніть або вимкніть режим налагодження для помічника.
```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```
### addLog($log)

Додайте повідомлення до журналу модуля.
```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```
## Пов'язані допоміжні класи

XMF надає спеціалізовані помічники, які розширюють `XMF\Module\Helper\AbstractHelper`:

### Помічник дозволів

Див../Recipes/Permission-Helper для отримання детальної документації.
```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```
### Помічник сеансу

Зберігання сеансу з урахуванням модуля з автоматичним префіксом ключа.
```php
$session = new \Xmf\Module\Helper\Session('mymodule');

// Store value
$session->set('last_viewed', $itemId);

// Retrieve value
$lastViewed = $session->get('last_viewed', 0);

// Delete value
$session->del('last_viewed');

// Clear all module session data
$session->destroy();
```
### Кеш-помічник

Кешування з урахуванням модуля з автоматичним префіксом ключа.
```php
$cache = new \Xmf\Module\Helper\Cache('mymodule');

// Write to cache (TTL in seconds)
$cache->write('item_' . $id, $itemData, 3600);

// Read from cache
$data = $cache->read('item_' . $id, null);

// Delete from cache
$cache->delete('item_' . $id);

// Read with automatic regeneration
$data = $cache->cacheRead(
    'expensive_data',
    function() {
        // This runs only if cache miss
        return computeExpensiveData();
    },
    3600
);
```
## Повний приклад

Ось вичерпний приклад використання помічника модуля:
```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;
use Xmf\Module\Helper\Session;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Initialize helpers
$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');
$session = new Session('mymodule');

// Load language
$helper->loadLanguage('main');

// Get configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableComments = $helper->getConfig('enable_comments', true);

// Handle request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

require_once XOOPS_ROOT_PATH . '/header.php';

switch ($op) {
    case 'view':
        // Check permission
        if (!$permHelper->checkPermission('view', $id)) {
            redirect_header($helper->url('index.php'), 3, _NOPERM);
        }

        // Track in session
        $session->set('last_viewed', $id);

        // Get handler and item
        $itemHandler = $helper->getHandler('items');
        $item = $itemHandler->get($id);

        if (!$item) {
            redirect_header($helper->url('index.php'), 3, 'Item not found');
        }

        // Display item
        $xoopsTpl->assign('item', $item->toArray());
        break;

    case 'list':
    default:
        $itemHandler = $helper->getHandler('items');

        $criteria = new CriteriaCompo();
        $criteria->setLimit($itemsPerPage);
        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        $items = $itemHandler->getObjects($criteria);
        $xoopsTpl->assign('items', $items);

        // Show last viewed if exists
        $lastViewed = $session->get('last_viewed', 0);
        if ($lastViewed > 0) {
            $xoopsTpl->assign('last_viewed', $lastViewed);
        }
        break;
}

// Admin link if authorized
if ($helper->isUserAdmin()) {
    $xoopsTpl->assign('admin_url', $helper->url('admin/index.php'));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```
## Базовий клас AbstractHelper

Усі допоміжні класи XMF розширюють `XMF\Module\Helper\AbstractHelper`, що забезпечує:

### Конструктор
```php
public function __construct($dirname)
```
Створює екземпляри з назвою каталогу модуля. Якщо пустий, використовується поточний модуль.

### dirname()

Повертає ім'я каталогу модуля, пов'язаного з помічником.
```php
$dirname = $helper->dirname();
```
### init()

Викликається конструктором після завантаження модуля. Перевизначення в спеціальних помічниках для логіки ініціалізації.

## Створення спеціальних помічників

Ви можете розширити помічник для окремих модулів:
```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

class Helper extends \Xmf\Module\Helper\GenericHelper
{
    public function init()
    {
        // Custom initialization
    }

    public function getItemUrl($id)
    {
        return $this->url('item.php?id=' . $id);
    }

    public function getUploadDirectory()
    {
        $path = $this->uploadPath('');
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
        return $path;
    }
}
```
## Дивіться також

- Початок роботи з-XMF - Основне використання XMF
- XMF-Запит - Обробка запиту
- ../Recipes/Permission-Helper - Керування дозволами
- ../Recipes/Module-Admin-Pages - Створення інтерфейсу адміністратора

---

#XMF #module-helper #configuration #handlers #session #cache