---
title: "Фреймворк XMF"
description: "Фреймворк модулей XOOPS - Комплексная библиотека для современной разработки модулей XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Мост в современный XOOPS]
XMF работает **как в XOOPS 2.5.x, так и в XOOPS 4.0.x**. Это рекомендуемый способ модернизировать ваши модули сегодня, подготавливаясь к XOOPS 4.0. XMF обеспечивает автозагрузку PSR-4, пространства имен и помощников, которые сглаживают переход.
:::

**XOOPS Module Framework (XMF)** - это мощная библиотека, разработанная для упрощения и стандартизации разработки модулей XOOPS. XMF обеспечивает современные практики PHP, включая пространства имен, автозагрузку и комплексный набор вспомогательных классов, которые уменьшают основной код и улучшают обслуживаемость.

## Что такое XMF?

XMF - это коллекция классов и утилит, которые предоставляют:

- **Поддержка современного PHP** - Полная поддержка пространств имен с автозагрузкой PSR-4
- **Обработка запросов** - Безопасная валидация входных данных и очистка
- **Помощники модулей** - Упрощенный доступ к конфигурациям и объектам модулей
- **Система разрешений** - Простое управление разрешениями в использовании
- **Утилиты базы данных** - Инструменты миграции схемы и управления таблицами
- **Поддержка JWT** - Реализация JSON Web Token для безопасной аутентификации
- **Генерация метаданных** - Утилиты SEO и извлечение контента
- **Административный интерфейс** - Стандартизированные страницы администрирования модулей

### Обзор компонентов XMF

```mermaid
graph TB
    subgraph XMF["XMF Framework"]
        direction TB
        subgraph Core["Core Components"]
            Request["🔒 Request<br/>Input Handling"]
            Module["📦 Module Helper<br/>Config & Handlers"]
            Perm["🔑 Permission<br/>Access Control"]
        end

        subgraph Utils["Utilities"]
            DB["🗄️ Database<br/>Schema Tools"]
            JWT["🎫 JWT<br/>Token Auth"]
            Meta["📊 Metagen<br/>SEO Utils"]
        end

        subgraph Admin["Admin Tools"]
            AdminUI["🎨 Admin UI<br/>Standardized Pages"]
            Icons["🖼️ Icons<br/>Font Awesome"]
        end
    end

    subgraph Module["Your Module"]
        Controller["Controller"]
        Handler["Handler"]
        Template["Template"]
    end

    Controller --> Request
    Controller --> Module
    Controller --> Perm
    Handler --> DB
    Template --> AdminUI

    style XMF fill:#e3f2fd,stroke:#1976d2
    style Core fill:#e8f5e9,stroke:#388e3c
    style Utils fill:#fff3e0,stroke:#f57c00
    style Admin fill:#fce4ec,stroke:#c2185b
```

## Ключевые функции

### Пространства имен и автозагрузка

Все классы XMF находятся в пространстве имен `Xmf`. Классы автоматически загружаются при упоминании - ручные включения не требуются.

```php
use Xmf\Request;
use Xmf\Module\Helper;

// Классы загружаются автоматически при использовании
$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
```

### Безопасная обработка запросов

Класс [Request](../05-XMF-Framework/Basics/XMF-Request.md) обеспечивает типобезопасный доступ к данным HTTP запроса с встроенной очисткой:

```mermaid
flowchart LR
    subgraph Input["Raw Input"]
        GET["$_GET"]
        POST["$_POST"]
        REQUEST["$_REQUEST"]
    end

    subgraph XMF["Xmf\Request"]
        Validate["Type Validation"]
        Sanitize["Sanitization"]
        Default["Default Values"]
    end

    subgraph Output["Safe Output"]
        Int["getInt()"]
        Str["getString()"]
        Email["getEmail()"]
        Bool["getBool()"]
    end

    GET --> XMF
    POST --> XMF
    REQUEST --> XMF
    XMF --> Int
    XMF --> Str
    XMF --> Email
    XMF --> Bool

    style Input fill:#ffcdd2,stroke:#c62828
    style XMF fill:#fff3e0,stroke:#f57c00
    style Output fill:#c8e6c9,stroke:#2e7d32
```

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$name = Request::getString('name', '');
$email = Request::getEmail('email', '');
```

### Система помощника модулей

[Помощник модулей](../05-XMF-Framework/Basics/XMF-Module-Helper.md) обеспечивает удобный доступ к функциональности, связанной с модулями:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');

// Доступ к конфигурации модуля
$configValue = $helper->getConfig('setting_name', 'default');

// Получить объект модуля
$module = $helper->getModule();

// Доступ к обработчикам
$handler = $helper->getHandler('items');
```

### Управление разрешениями

[Помощник разрешений](../05-XMF-Framework/Recipes/Permission-Helper.md) упрощает обработку разрешений XOOPS:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Проверить разрешение пользователя
if ($permHelper->checkPermission('view', $itemId)) {
    // У пользователя есть разрешение
}
```

## Структура документации

### Основы

- [Getting-Started-with-XMF](../05-XMF-Framework/Basics/Getting-Started-with-XMF.md) - Установка и базовое использование
- [XMF-Request](../05-XMF-Framework/Basics/XMF-Request.md) - Обработка запросов и валидация входных данных
- [XMF-Module-Helper](../05-XMF-Framework/Basics/XMF-Module-Helper.md) - Использование класса помощника модулей

### Рецепты

- [Permission-Helper](../05-XMF-Framework/Recipes/Permission-Helper.md) - Работа с разрешениями
- [Module-Admin-Pages](../05-XMF-Framework/Recipes/Module-Admin-Pages.md) - Создание стандартизированных административных интерфейсов

### Справочник

- [JWT](../05-XMF-Framework/Reference/JWT.md) - Реализация JSON Web Token
- [Database](../05-XMF-Framework/Reference/Database.md) - Утилиты базы данных и управление схемой
- [Metagen](Reference/Metagen.md) - Утилиты метаданных и SEO

## Требования

- XOOPS 2.5.8 или позже
- PHP 7.2 или позже (PHP 8.x рекомендуется)

## Установка

XMF включен в XOOPS 2.5.8 и более поздних версиях. Для ранних версий или ручной установки:

1. Загрузите пакет XMF из репозитория XOOPS
2. Извлеките в вашу директорию XOOPS `/class/xmf/`
3. Автозагрузчик будет автоматически обрабатывать загрузку классов

## Пример быстрого старта

Вот полный пример, показывающий общие паттерны использования XMF:

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

// Получить помощника модулей
$helper = Helper::getHelper('mymodule');

// Получить значения конфигурации
$itemsPerPage = $helper->getConfig('items_per_page', 10);

// Обработать входные данные запроса
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Проверить разрешения
$permHelper = new Permission();
if (!$permHelper->checkPermission('view', $id)) {
    redirect_header('index.php', 3, 'Access denied');
}

// Обработать на основе операции
switch ($op) {
    case 'view':
        $handler = $helper->getHandler('items');
        $item = $handler->get($id);
        // ... отобразить элемент
        break;
    case 'list':
    default:
        // ... список элементов
        break;
}
```

## Ресурсы

- [XMF GitHub Repository](https://github.com/XOOPS/XMF)
- [XOOPS Project Website](https://xoops.org)

---

#xmf #xoops #framework #php #module-development
