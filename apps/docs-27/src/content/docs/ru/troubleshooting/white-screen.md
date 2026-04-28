---
title: "Устранение неполадок - Белый экран смерти"
description: "Решение проблемы белого экрана без ошибок в XOOPS"
---

# Белый экран смерти (WSoD)

> Решение проблемы пустого белого экрана без сообщений об ошибках в XOOPS.

---

## Причины

Белый экран обычно означает:
- Ошибка PHP с отключенным отображением
- Лимит памяти PHP превышен
- Бесконечная рекурсия
- Фатальная ошибка парсера

---

## Решение

### Шаг 1: Включите отображение ошибок

**В php.ini:**
```ini
display_errors = On
error_reporting = E_ALL
log_errors = On
error_log = /var/log/php_errors.log
```

**Или в файле XOOPS:**
```php
// В mainfile.php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

### Шаг 2: Проверьте логи

```bash
# Проверьте логи Apache/Nginx
tail -50 /var/log/apache2/error.log
tail -50 /var/log/nginx/error.log

# Проверьте логи PHP
tail -50 /var/log/php_errors.log

# Проверьте логи XOOPS
tail -50 /var/www/xoops/var/logs/error.log
```

### Шаг 3: Увеличьте лимит памяти

**В php.ini:**
```ini
memory_limit = 256M
max_execution_time = 300
```

### Шаг 4: Отключите конфликтующие расширения

```bash
# В php.ini прокомментируйте подозрительные
# extension=opcache.so
# extension=xdebug.so
```

---

## Похожие руководства

- [Режим отладки](debugging/debug-mode.md)
- [Database Connection](database-connection.md)

---

#troubleshooting #white-screen #debugging #php #xoops
