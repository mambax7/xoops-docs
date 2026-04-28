---
title: "Отладка - Database Queries"
description: "Отладка SQL запросов и проблем базы данных в XOOPS"
---

# Отладка запросов базы данных

> Как отлаживать SQL запросы, медленные запросы и проблемы в XOOPS.

---

## Включение логирования SQL

### В XOOPS config

```php
// В /xoops_lib/Xoops/Core/Debug.php
define('XOOPS_DEBUG_MODE', 1);
```

### В php.ini

```ini
[MySQLi]
mysqli.allow_local_infile = On

[MySQL]
mysql.trace_mode = On
```

---

## Просмотр SQL запросов

```php
// Получите последний запрос
$conn = xoops_getHandler('db');
echo $conn->getLastQuery();

// Посмотрите все запросы
$conn->showQueries();
```

---

## Выявление медленных запросов

```bash
# Включите slow query log в MySQL
mysql> SET GLOBAL slow_query_log = 'ON';
mysql> SET GLOBAL long_query_time = 2;

# Просмотрите логи
tail /var/log/mysql/slow-query.log
```

---

## Похожие руководства

- [Режим отладки](debug-mode.md)
- [Соединение БД](../database-connection.md)

---

#debugging #database #sql #xoops
