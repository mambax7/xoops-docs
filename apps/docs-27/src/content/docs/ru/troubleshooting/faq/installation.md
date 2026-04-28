---
title: "FAQ - Установка XOOPS"
description: "Часто задаваемые вопросы по установке XOOPS и модулей"
---

# Часто задаваемые вопросы - Установка

> Ответы на распространенные вопросы по установке XOOPS и модулей.

---

## Как установить XOOPS?

1. Загрузите файлы на сервер
2. Создайте базу данных MySQL
3. Посетите install.php
4. Следуйте мастеру установки
5. Удалите папку install/

---

## Как установить модуль?

1. Загрузите модуль в /modules/
2. Перейдите в Admin → Modules
3. Нажмите "Install Module"
4. Найдите модуль и нажмите "Install"

---

## Какие требования?

- PHP 7.1+
- MySQL 5.7+
- Apache/Nginx с mod_rewrite
- 50 МБ дискового пространства

---

## Как отремонтировать сломанную установку?

```bash
# Перезагрузите базу данных
mysql -u user -p database < install.sql

# Очистите кэш
rm -rf /var/www/xoops/var/cache/*

# Сбросьте разрешения
chmod -R 755 /var/www/xoops/
```

---

## Похожие FAQ

- [Modules FAQ](modules.md)
- [Performance FAQ](performance.md)

---

#faq #installation #setup #xoops
