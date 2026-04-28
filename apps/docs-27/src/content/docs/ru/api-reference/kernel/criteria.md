---
title: "Критерии ядра"
description: "Построение критериев запроса в системе ядра"
---

Критерии ядра предоставляют система для построения сложных условий запроса в ядре XOOPS.

## Основные классы

### Criteria

Представляет единое условие.

```php
class Criteria
{
    public function __construct(string $column, mixed $value, string $operator = '=');
    public function render(): string;
}
```

### CriteriaCompo

Композитные критерии для объединения нескольких условий.

```php
class CriteriaCompo
{
    public function __construct(string $logic = 'AND');
    public function add(Criteria $criteria): void;
    public function render(): string;
}
```

## Использование

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('level', 1, '>='));

$users = $handler->getObjects($criteria);
```

## Связанная документация

- ../Database/Criteria - Критерии базы данных
- ../Core/XoopsObject - Объекты данных

---

*Критерии ядра обеспечивают типобезопасный способ построения запросов.*
