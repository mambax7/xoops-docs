---
title: "Помощник модулей XMF"
description: 'Упрощенные операции модулей, использующие класс Xmf\Module\Helper и связанные помощники'
---

Класс `Xmf\Module\Helper` обеспечивает простой способ доступа к информации модуля, конфигурациям, обработчикам и многому другому. Использование помощника модулей упрощает ваш код и уменьшает основной код.

## Обзор

Помощник модулей обеспечивает:

- Упрощенный доступ к конфигурации
- Получение объекта модуля
- Создание экземпляра обработчика
- Разрешение пути и URL
- Помощники разрешений и сеанса
- Управление кэшем

## Получение помощника модулей

### Базовое использование

```php
use Xmf\Module\Helper;

// Получить помощника для конкретного модуля
$helper = Helper::getHelper('mymodule');

// Помощник автоматически связан с директорией модуля
```

### Из текущего модуля

Если вы не указываете название модуля, он использует текущий активный модуль:

```php
$helper = Helper::getHelper('');
// или
$helper = Helper::getHelper(basename(__DIR__));
```

## Доступ к конфигурации

### Традиционный способ XOOPS

Получение конфигурации модуля старым способом многословно:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### Способ XMF

С помощником модулей та же задача становится простой:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## Методы помощника

### getModule()

Возвращает объект XoopsModule для модуля помощника.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

Возвращает значение конфигурации модуля или все конфигурации.

```php
// Получить одну конфигурацию с значением по умолчанию
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Получить все конфигурации как массив
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

Возвращает обработчик объектов для модуля.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Использовать обработчик
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

Загружает файл языка для модуля.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

Проверяет, является ли этот модуль текущим активным модулем.

```php
if ($helper->isCurrentModule()) {
    // Мы находимся в собственных страницах модуля
} else {
    // Вызвано из другого модуля или расположения
}
```

### isUserAdmin()

Проверяет, имеет ли текущий пользователь права администратора для этого модуля.

```php
if ($helper->isUserAdmin()) {
    // Показать опции администратора
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Методы пути и URL

### url($url)

Возвращает абсолютный URL для пути, относительного к модулю.

```php
$logoUrl = $helper->url('images/logo.png');
// Возвращает: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Возвращает: https://example.com/modules/mymodule/admin/index.php
```

### path($path)

Возвращает абсолютный путь файловой системы для пути, относительного к модулю.

```php
$templatePath = $helper->path('templates/view.tpl');
// Возвращает: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

Возвращает абсолютный URL для файлов загрузки модуля.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadPath($path)

Возвращает абсолютный путь файловой системы для файлов загрузки модуля.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### redirect($url, $time, $message)

Перенаправляет внутри модуля на URL, относительный к модулю.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## Поддержка отладки

### setDebug($bool)

Включить или отключить режим отладки для помощника.

```php
$helper->setDebug(true);  // Включить
$helper->setDebug(false); // Отключить
$helper->setDebug();      // Включить (значение по умолчанию true)
```

### addLog($log)

Добавить сообщение в журнал модуля.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## Связанные вспомогательные классы

XMF предоставляет специализированных помощников, которые расширяют `Xmf\Module\Helper\AbstractHelper`:

### Помощник разрешений

См. ../Recipes/Permission-Helper для детальной документации.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Проверить разрешение
if ($permHelper->checkPermission('view', $itemId)) {
    // У пользователя есть разрешение
}

// Проверить и перенаправить при отсутствии разрешения
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### Помощник сеанса

Хранилище сеанса с поддержкой модулей с автоматическим префиксом ключей.

```php
$session = new \Xmf\Module\Helper\Session('mymodule');

// Хранить значение
$session->set('last_viewed', $itemId);

// Получить значение
$lastViewed = $session->get('last_viewed', 0);

// Удалить значение
$session->del('last_viewed');

// Очистить все данные сеанса модуля
$session->destroy();
```

### Помощник кэша

Кэширование с поддержкой модулей с автоматическим префиксом ключей.

```php
$cache = new \Xmf\Module\Helper\Cache('mymodule');

// Записать в кэш (TTL в секундах)
$cache->write('item_' . $id, $itemData, 3600);

// Прочитать из кэша
$data = $cache->read('item_' . $id, null);

// Удалить из кэша
$cache->delete('item_' . $id);

// Прочитать с автоматическим восстановлением
$data = $cache->cacheRead(
    'expensive_data',
    function() {
        // Это выполняется только при промахе кэша
        return computeExpensiveData();
    },
    3600
);
```

## Полный пример

Вот комплексный пример использования помощника модулей:

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;
use Xmf\Module\Helper\Session;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Инициализировать помощники
$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');
$session = new Session('mymodule');

// Загрузить язык
$helper->loadLanguage('main');

// Получить конфигурацию
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableComments = $helper->getConfig('enable_comments', true);

// Обработать запрос
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

require_once XOOPS_ROOT_PATH . '/header.php';

switch ($op) {
    case 'view':
        // Проверить разрешение
        if (!$permHelper->checkPermission('view', $id)) {
            redirect_header($helper->url('index.php'), 3, _NOPERM);
        }

        // Отслеживать в сеансе
        $session->set('last_viewed', $id);

        // Получить обработчик и элемент
        $itemHandler = $helper->getHandler('items');
        $item = $itemHandler->get($id);

        if (!$item) {
            redirect_header($helper->url('index.php'), 3, 'Item not found');
        }

        // Отобразить элемент
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

        // Показать последний просмотренный если существует
        $lastViewed = $session->get('last_viewed', 0);
        if ($lastViewed > 0) {
            $xoopsTpl->assign('last_viewed', $lastViewed);
        }
        break;
}

// Ссылка администратора, если авторизирован
if ($helper->isUserAdmin()) {
    $xoopsTpl->assign('admin_url', $helper->url('admin/index.php'));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Базовый класс AbstractHelper

Все вспомогательные классы XMF расширяют `Xmf\Module\Helper\AbstractHelper`, который обеспечивает:

### Constructor

```php
public function __construct($dirname)
```

Создает экземпляр с названием директории модуля. Если пусто, использует текущий модуль.

### dirname()

Возвращает название директории модуля, связанное с помощником.

```php
$dirname = $helper->dirname();
```

### init()

Вызывается конструктором после загрузки модуля. Переопределите в пользовательских помощниках для логики инициализации.

## Создание пользовательских помощников

Вы можете расширить помощника для функциональности, специфичной для модуля:

```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

class Helper extends \Xmf\Module\Helper\GenericHelper
{
    public function init()
    {
        // Пользовательская инициализация
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

## Также см.

- Getting-Started-with-XMF - Базовое использование XMF
- XMF-Request - Обработка запросов
- ../Recipes/Permission-Helper - Управление разрешениями
- ../Recipes/Module-Admin-Pages - Создание административного интерфейса

---

#xmf #module-helper #configuration #handlers #session #cache
