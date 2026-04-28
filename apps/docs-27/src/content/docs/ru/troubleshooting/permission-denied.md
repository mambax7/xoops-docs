---
title: "Устранение неполадок - Permission Denied"
description: "Решение ошибок разрешений на файлы и каталоги в XOOPS"
---

# Ошибки Permission Denied

> Решение проблем разрешений на файлы, каталоги и загрузку в XOOPS.

---

## Типичные ошибки

### "Permission denied" при загрузке

**Причина:** Каталог загрузки не доступен для записи

**Решение:**
```bash
# Найдите каталог загрузки
ls -la /var/www/xoops/uploads/

# Установите разрешения
chmod 755 /var/www/xoops/uploads/
chmod 777 /var/www/xoops/uploads/

# Проверьте владение
chown -R www-data:www-data /var/www/xoops/uploads/
```

### "Cannot write to cache directory"

**Причина:** Проблема с разрешениями на кэш

**Решение:**
```bash
# Очистите и переустановите разрешения
rm -rf /var/www/xoops/var/cache/*
chmod 777 /var/www/xoops/var/cache/
chmod 777 /var/www/xoops/var/
```

---

## Проверка разрешений

```bash
# Посмотрите владение
ls -la /var/www/xoops/

# Должно быть www-data:www-data или веб-сервер:веб-сервер

# Проверьте разрешения каталогов
find /var/www/xoops -type d ! -perm 755 -ls

# Проверьте разрешения файлов
find /var/www/xoops -type f ! -perm 644 -ls
```

---

## Похожие руководства

- [Установка](../modules/publisher/user-guide/installation.md)
- [Белый экран](white-screen.md)

---

#troubleshooting #permissions #files #xoops
