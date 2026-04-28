---
title: "Класс XoopsUser"
description: "Управление учетными записями пользователей и аутентификацией"
---

Класс `XoopsUser` представляет пользователя XOOPS с полной информацией об учетной записи, группах и разрешениях.

## Обзор класса

```php
namespace Xoops;

class XoopsUser extends XoopsObject
{
    protected $uid;
    protected $uname;
    protected $email;
    protected $pass;
    protected $groups = [];
}
```

## Основные методы

### getVar

Получает информацию пользователя.

```php
$user->getVar('uname');      // Имя пользователя
$user->getVar('email');      // Email
$user->getVar('uid');        // ID пользователя
$user->getVar('pass');       // Хеш пароля (не сырой пароль)
```

### isInGroup

Проверяет, принадлежит ли пользователь к группе.

```php
if ($user->isInGroup(1)) {
    // Пользователь администратор (группа 1)
}
```

### getGroups

Получает все группы пользователя.

```php
$groups = $user->getGroups();
foreach ($groups as $groupId) {
    echo "Группа: $groupId";
}
```

## Безопасность

### Проверка пароля

```php
if (password_verify($_POST['pass'], $user->getVar('pass'))) {
    // Пароль верный
}
```

### Изменение пароля

```php
$user->setVar('pass', password_hash($_POST['pass'], PASSWORD_BCRYPT));
$userHandler = xoops_getHandler('user');
$userHandler->insert($user);
```

## Использование

```php
$userHandler = xoops_getHandler('user');
$user = $userHandler->get($uid);

if ($user) {
    echo 'Пользователь: ' . $user->getVar('uname');
    echo 'Email: ' . $user->getVar('email');
    
    if ($user->isInGroup(1)) {
        echo 'Администратор';
    }
}
```

## Связанная документация

- ../Core/XoopsObject - Базовый класс объекта
- System - Система управления пользователями

---

*Класс XoopsUser предоставляет полную функциональность для работы с пользователями.*
