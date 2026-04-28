---
title: "Миграция с XOOPS 2.5"
description: "Руководство по миграции с XOOPS 2.5 на XOOPS 2.7, включая подготовку, процесс обновления и решение проблем"
---

# Миграция с XOOPS 2.5 на XOOPS 2.7

Полное руководство по обновлению вашего сайта XOOPS 2.5 на XOOPS 2.7.

## Перед началом

### Требования

Убедитесь, что ваш сервер соответствует требованиям XOOPS 2.7:

```
PHP: 8.0+ (XOOPS 2.5 требует 5.6+)
MySQL: 5.7+ или MariaDB 10.4+
Apache/Nginx: Все версии
Disk Space: минимум 500MB свободного места
```

### Резервная копия БД

**КРИТИЧЕСКИ:** Создайте полную резервную копию перед миграцией!

```bash
# Полная резервная копия БД
mysqldump -u xoops_user -p xoops_db > xoops_2.5_backup.sql

# Резервная копия файлов
tar -czf xoops_2.5_files.tar.gz /var/www/html/xoops/

# Проверить резервные копии
ls -lh xoops_2.5_backup.sql xoops_2.5_files.tar.gz
```

### Проверка совместимости модулей

Некоторые модули XOOPS 2.5 несовместимы с 2.7:

```
СОВМЕСТИМЫЕ модули:
✓ News
✓ System
✓ User
✓ Profile

ТРЕБУЮТ ОБНОВЛЕНИЯ:
✗ Forum (обновите версию)
✗ Comments (обновите версию)
✗ Некоторые старые модули

Проверьте:
https://xoops.org/modules/repository/
```

## Процесс миграции

### Шаг 1: Загрузите XOOPS 2.7

```bash
# Загрузить XOOPS 2.7
wget https://github.com/XOOPS/XoopsCore27/releases/download/2.7.0/xoops-2.7.0.tar.gz

# Распаковать
tar -xzf xoops-2.7.0.tar.gz

# Или клонировать из GitHub
git clone https://github.com/XOOPS/XoopsCore27.git xoops-2.7
```

### Шаг 2: Сохранить данные 2.5

Перед обновлением сохраните свои файлы:

```bash
# Сохранить uploads
cp -r /var/www/html/xoops/uploads /var/backups/xoops_2.5_uploads/

# Сохранить пользовательские модули
cp -r /var/www/html/xoops/modules/custom_module /var/backups/

# Сохранить пользовательскую тему
cp -r /var/www/html/xoops/themes/custom_theme /var/backups/
```

### Шаг 3: Подготовить XOOPS 2.7

Скопируйте сохранённые данные в новую установку:

```bash
# Скопировать старые uploads
cp -r /var/backups/xoops_2.5_uploads/* /var/www/html/xoops/uploads/

# Скопировать пользовательские модули
cp -r /var/backups/custom_module /var/www/html/xoops/modules/

# Скопировать пользовательские темы
cp -r /var/backups/custom_theme /var/www/html/xoops/themes/
```

### Шаг 4: Обновить БД

Запустите скрипт обновления XOOPS 2.7:

```bash
# Доступ к обновлению
http://your-domain.com/xoops/install/

# Или если install удалён, используйте admin
http://your-domain.com/xoops/admin/

# Администратор > Система > Обновить БД
```

Система обновит таблицы автоматически.

### Шаг 5: Проверить данные

После обновления проверьте:

```bash
# Проверить количество пользователей
mysql -u xoops_user -p xoops_db << EOF
SELECT COUNT(*) as user_count FROM xoops_users;
SELECT COUNT(*) as post_count FROM xoops_posts;
EOF

# Проверить модули
http://your-domain.com/xoops/admin/ > Модули > Модули
```

## Обновление модулей

### Обновить встроенные модули

После обновления XOOPS обновите модули:

**Панель администратора > Модули > Модули > Проверить обновления**

Установите обновления для:
- News
- Forum (если установлен)
- Comments (если установлен)

### Переустановить несовместимые модули

Для модулей, которые не совместимы:

1. Удалите старую версию
2. Загрузите версию, совместимую с XOOPS 2.7
3. Установите новую версию

## Проблемы при миграции

### Проблема: Белая страница

**Решение:**

```bash
# Проверить ошибки PHP
tail -50 /var/log/apache2/error.log

# Включить режим отладки
vi /var/www/html/xoops/mainfile.php
# Измените: define('XOOPS_DEBUG', 0);
# На: define('XOOPS_DEBUG', 1);

# Проверить синтаксис PHP
php -l /var/www/html/xoops/mainfile.php
```

### Проблема: Ошибка БД

**Решение:**

```bash
# Проверить подключение БД
mysql -u xoops_user -p -h localhost xoops_db << EOF
SELECT VERSION();
SHOW TABLES;
EOF

# Проверить табли
mysql -u xoops_user -p xoops_db << EOF
CHECK TABLE xoops_users;
CHECK TABLE xoops_posts;
EOF

# При ошибке восстановить
REPAIR TABLE xoops_users;
REPAIR TABLE xoops_posts;
```

### Проблема: Модули не работают

**Решение:**

1. Проверить совместимость в https://xoops.org/modules/repository/
2. Обновить или заменить модуль
3. Проверить разрешения файлов
4. Проверить логи ошибок PHP

### Проблема: Потеря данных

**Восстановление:**

```bash
# Восстановить из резервной копии
mysql -u xoops_user -p xoops_db < xoops_2.5_backup.sql

# Или восстановить файлы
tar -xzf xoops_2.5_files.tar.gz -C /var/backups/
```

## Тестирование после миграции

### Проверка функциональности

Проверьте основные функции:

- [ ] Главная страница загружается
- [ ] Пользователи могут входить
- [ ] Модули работают правильно
- [ ] Загрузка файлов работает
- [ ] Отправка электронной почты работает
- [ ] Темы отображаются правильно
- [ ] Блоки видны
- [ ] Поиск работает
- [ ] Комментарии работают

### Тестирование администратора

Проверьте админ панель:

- [ ] Все меню доступны
- [ ] Параметры сохраняются
- [ ] Модули управляются
- [ ] Пользователи управляются
- [ ] Темы выбираются
- [ ] Блоки редактируются

## Оптимизация после миграции

### Очистить кэш

```bash
# Удалить файлы кэша
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# Или в админ панели:
# Система > Инструменты > Очистить кэш
```

### Оптимизировать БД

```bash
mysql -u xoops_user -p xoops_db << EOF
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_posts;
OPTIMIZE TABLE xoops_config;
ANALYZE TABLE xoops_users;
EOF
```

### Проверить производительность

```bash
# Проверить на https://pagespeed.web.dev/
# Проверить в консоли браузера на ошибки JavaScript
# Проверить скорость загрузки страницы
```

## Откат на XOOPS 2.5

Если возникают серьёзные проблемы, откатитесь:

```bash
# Восстановить файлы XOOPS 2.5
tar -xzf xoops_2.5_files.tar.gz -C /var/www/html/

# Восстановить БД XOOPS 2.5
mysql -u xoops_user -p xoops_db < xoops_2.5_backup.sql

# Перезагрузить сайт
systemctl restart apache2
```

## Контрольный список миграции

Для успешной миграции:

- [ ] Создана полная резервная копия
- [ ] Проверены требования сервера
- [ ] Загружены файлы XOOPS 2.7
- [ ] Сохранены пользовательские файлы
- [ ] Скопированы данные 2.5
- [ ] Обновлена БД
- [ ] Обновлены модули
- [ ] Протестирована функциональность
- [ ] Проверена администраторская панель
- [ ] Оптимизирована БД
- [ ] Очищен кэш
- [ ] Проверена производительность
- [ ] Документированы шаги

## Поддержка при миграции

Если потребуется помощь:

- XOOPS Форум: https://xoops.org/modules/newbb/
- GitHub Issues: https://github.com/XOOPS/XoopsCore/issues
- Официальный сайт: https://xoops.org/

---

**Теги:** #migration #upgrade #xoops2.5 #xoops2.7

**Связанные статьи:**
- ../Installation/Installation
- ../Configuration/Index
- ../Getting-Started/Admin-Panel-Overview
