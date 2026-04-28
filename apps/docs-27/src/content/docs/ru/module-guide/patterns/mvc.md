---
title: "Паттерн MVC в XOOPS"
description: "Реализация архитектуры Model-View-Controller в модулях XOOPS"
---

<span class="version-badge version-xmf">XMF Required</span> <span class="version-badge version-40x">4.0.x Native</span>

:::note[Не уверены, правильно ли выбран паттерн?]
See [Choosing a Data Access Pattern](../Choosing-Data-Access-Pattern.md) for guidance on when to use MVC vs simpler patterns.
:::

:::caution[Уточнение: Архитектура XOOPS]
**Standard XOOPS 2.5.x** использует паттерн **Page Controller** (также называемый Transaction Script), а не MVC. Legacy модули используют `index.php` с прямыми включениями, глобальными объектами (`$xoopsUser`, `$xoopsDB`), и доступом на основе обработчиков.

**Чтобы использовать MVC в XOOPS 2.5.x**, вам нужен **XMF Framework**, который обеспечивает поддержку маршрутизации и контроллеров.

**XOOPS 4.0** будет нативно поддерживать MVC с PSR-15 middleware и правильной маршрутизацией.

See also: [Current XOOPS Architecture](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Паттерн Model-View-Controller (MVC) — это фундаментальный архитектурный паттерн для разделения забот в модулях XOOPS. Этот паттерн делит приложение на три взаимосвязанных компонента.

## Объяснение MVC

### Model
**Model** представляет данные и бизнес-логику вашего приложения. Это:
- Управляет сохранением данных
- Реализует бизнес-правила
- Валидирует данные
- Взаимодействует с базой данных
- Независим от пользовательского интерфейса

### View
**View** отвечает за представление данных пользователю. Это:
- Рендерит HTML-шаблоны
- Отображает данные модели
- Обрабатывает представление пользовательского интерфейса
- Отправляет действия пользователя контроллеру
- Должен содержать минимум логики

### Controller
**Controller** обрабатывает взаимодействия пользователя и координирует работу между Model и View. Это:
- Получает запросы пользователя
- Обрабатывает входные данные
- Вызывает методы модели
- Выбирает подходящие представления
- Управляет потоком приложения

## Реализация XOOPS

В XOOPS паттерн MVC реализуется с использованием обработчиков и шаблонов с движком Smarty, обеспечивающим поддержку шаблонов.

### Базовая структура Model
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // Database query implementation
    }
    
    public function createUser($data)
    {
        // Create user implementation
    }
}
?>
```

### Реализация Controller
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```

### Шаблон View
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Best Practices

- Держите бизнес-логику в Models
- Держите представление в Views  
- Держите маршрутизацию/координацию в Controllers
- Не смешивайте заботы между слоями
- Валидируйте весь вход на уровне Controller

## Related Documentation

See also:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) for advanced data access
- [Service-Layer](../Patterns/Service-Layer.md) for business logic abstraction
- [Code-Organization](../Best-Practices/Code-Organization.md) for project structure
- [Testing](../Best-Practices/Testing.md) for MVC testing strategies

---

Tags: #mvc #patterns #architecture #module-development #design-patterns
