---
title: "Устранение неполадок - Установка модуля"
description: "Решение проблем при установке модулей XOOPS"
---

# Проблемы установки модуля

> Решение проблем при загрузке, установке и активации модулей Publisher и других.

---

## Модуль не появляется в списке

**Причины:**
- Файлы не загружены правильно
- xoops_version.php отсутствует или поврежден
- Проблемы с разрешениями на файлы

**Решение:**
```bash
# Проверьте структуру папок
ls -la /var/www/xoops/modules/publisher/

# Проверьте xoops_version.php существует
cat /var/www/xoops/modules/publisher/xoops_version.php | head -20

# Проверьте разрешения
chmod -R 755 /var/www/xoops/modules/publisher/
```

## Ошибка при установке SQL таблиц

**Причины:**
- Недостаточные привилегии MySQL
- Синтаксические ошибки в SQL
- Таблицы уже существуют

**Решение:**
```bash
# Проверьте привилегии
GRANT ALL ON xoops_db.* TO 'xoops_user'@'localhost';
FLUSH PRIVILEGES;

# Импортируйте SQL вручную
mysql -u xoops_user -p xoops_db < modules/publisher/sql/mysql.sql
```

---

## Похожие руководства

- [Соединение БД](database-connection.md)
- [Установка Publisher](../modules/publisher/user-guide/installation.md)

---

#troubleshooting #modules #installation #xoops
