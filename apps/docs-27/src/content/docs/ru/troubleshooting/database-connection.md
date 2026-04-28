---
title: "Устранение неполадок - Соединение с базой данных"
description: "Решение проблем соединения с MySQL и ошибок базы данных в XOOPS"
---

# Проблемы соединения с базой данных

> Решение проблем подключения MySQL, аутентификации и ошибок базы данных в XOOPS.

---

## Распространенные ошибки

### "Unable to connect to database"

**Причины:**
- Сервер MySQL не запущен
- Неверные учетные данные
- Хост недоступен
- Порт неверный

**Решение:**
```bash
# Проверьте запущен ли MySQL
systemctl status mysql

# Проверьте конфиг базы данных
cat /var/www/xoops/xoops_lib/XoopsLoad.php

# Проверьте учетные данные
mysql -u username -p -h localhost
```

### "Access denied for user"

**Причина:** Неверный пароль или пользователь

**Решение:**
```bash
# Установите новый пароль
mysql -u root -p
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;

# Обновите конфиг XOOPS с новым паролем
```

### "Host 'server' is blocked"

**Причина:** Слишком много неудачных попыток подключения

**Решение:**
```bash
# Используя root
mysql -u root -p
FLUSH HOSTS;
```

---

## Проверка подключения

```bash
# Тест подключения
mysql -u xoops_user -p -h localhost xoops_db

# Если работает, вы в интерпретаторе mysql
# Выведите на выход
mysql> exit;
```

---

## Похожие руководства

- [Белый экран](white-screen.md)
- [Установка](../modules/publisher/user-guide/installation.md)

---

#troubleshooting #database #mysql #xoops
