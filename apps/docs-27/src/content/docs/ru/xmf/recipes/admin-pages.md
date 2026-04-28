---
title: "Страницы администрирования модулей"
description: "Создание стандартизированных и совместимых со будущим модулями администрирования страниц с XMF"
---

Класс `Xmf\Module\Admin` предоставляет последовательный способ создания интерфейсов администрирования модулей. Использование XMF для админ-страниц гарантирует прямую совместимость с будущими версиями XOOPS с сохранением единообразного пользовательского опыта.

## Обзор

Класс ModuleAdmin в XOOPS Frameworks облегчил администрирование, но его API эволюционировал между версиями. Обертка `Xmf\Module\Admin`:

- Предоставляет стабильный API, работающий во всех версиях XOOPS
- Автоматически обрабатывает различия API между версиями
- Гарантирует, что ваш админ-код совместим со будущим
- Предлагает удобные статические методы для общих задач

## Начало работы

### Создание экземпляра администратора

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Это возвращает либо экземпляр `Xmf\Module\Admin` либо встроенный системный класс, если уже совместимый.

## Управление значками

### Проблема расположения значков

Значки перемещались между версиями XOOPS, вызывая головную боль обслуживания. XMF решает это с утилитами-методами.

### Поиск значков

**Старый способ (зависит от версии):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**Способ XMF:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

Метод `iconUrl()` возвращает полный URL, поэтому вам не нужно беспокоиться о построении пути.

### Размеры значков

```php
// 16x16 значки
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 значки (по умолчанию)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Просто путь (без названия файла)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

## Стандартные админ-страницы

### Страница индекса

**Старый формат:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**Формат XMF:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

## API справочник

### Статические методы

| Метод | Описание |
|--------|-------------|
| `getInstance()` | Получить экземпляр администратора |
| `iconUrl($name, $size)` | Получить URL значка (размер: 16 или 32) |
| `menuIconPath($image)` | Получить путь значка для menu.php |
| `setPaypal($paypal)` | Установить PayPal ID для страницы about |

### Методы экземпляра

| Метод | Описание |
|--------|-------------|
| `displayNavigation($menu)` | Показать навигационное меню |
| `renderNavigation($menu)` | Возвратить HTML навигации |
| `addInfoBox($title)` | Добавить информационный блок |
| `addInfoBoxLine($text, $type, $color)` | Добавить строку в информационный блок |
| `displayInfoBox()` | Показать информационный блок |
| `addConfigBoxLine($value, $type)` | Добавить строку проверки конфигурации |
| `displayIndex()` | Показать страницу индекса |
| `displayAbout($logo_xoops)` | Показать страницу about |

---

#xmf #admin #module-development #navigation #icons
