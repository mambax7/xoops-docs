---
title: "Классы ядра"
description: "Основные системные классы ядра XOOPS"
---

Классы ядра образуют основу системы XOOPS, обеспечивая фундаментальные функции для управления конфигурацией, логированием и системным взаимодействием.

## XoopsKernel

Основной класс ядра системы.

```php
namespace Xoops;

class XoopsKernel
{
    public static function getInstance(): self;
    public function getConfig(string $key);
    public function setConfig(string $key, mixed $value): void;
}
```

## XoopsConfig

Управление конфигурацией системы.

```php
class XoopsConfig
{
    public function get(string $key);
    public function set(string $key, mixed $value): void;
}
```

## XoopsLogger

Логирование событий системы.

```php
class XoopsLogger
{
    public function info(string $message): void;
    public function warning(string $message): void;
    public function error(string $message): void;
    public function debug(string $message): void;
}
```

## Использование

```php
$kernel = XoopsKernel::getInstance();
$logger = $kernel->getLogger();
$logger->info('Информационное сообщение');
```

## Связанная документация

- ../Core/XoopsObject - Объекты данных
- ../Database/XoopsDatabase - Операции БД

---

*Классы ядра обеспечивают центральные функции системы XOOPS.*
