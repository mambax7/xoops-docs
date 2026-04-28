---
title: "Система управления пользователями"
description: "Управление пользователями, группами и разрешениями"
---

Система управления пользователями XOOPS обеспечивает полный контроль над аутентификацией, авторизацией и управлением правами.

## Основные компоненты

### XoopsUser

Представляет пользователя системы.

```php
$userHandler = xoops_getHandler('user');
$user = $userHandler->getByLogin($_POST['uname']);
```

### XoopsGroup

Представляет группу пользователей.

```php
$groupHandler = xoops_getHandler('group');
$groups = $groupHandler->getAll();
```

### Разрешения

Разрешения управляются по группам пользователей.

```php
if ($xoopsUser && $xoopsUser->isInGroup(1)) {
    // Пользователь является администратором
}
```

## Аутентификация

### Вход в систему

```php
$uname = $_POST['uname'];
$pass = $_POST['pass'];

$userHandler = xoops_getHandler('user');
$user = $userHandler->authenticateUser($uname, $pass);

if ($user) {
    // Пользователь успешно вошел
}
```

## Управление сессией

```php
if (isset($xoopsUser)) {
    // Пользователь авторизован
    echo 'Привет, ' . $xoopsUser->getVar('uname');
}
```

## Связанная документация

- XoopsUser - Класс пользователя
- ../Core/XoopsObject - Объекты данных

---

*Система управления пользователями обеспечивает безопасность и управление доступом в XOOPS.*
