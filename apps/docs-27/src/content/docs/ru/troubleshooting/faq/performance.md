---
title: "FAQ - Производительность XOOPS"
description: "Часто задаваемые вопросы по оптимизации и производительности XOOPS"
---

# Часто задаваемые вопросы - Производительность

> Ответы на вопросы по оптимизации и ускорению XOOPS.

---

## Как ускорить XOOPS?

Основные способы:
1. Включите кэширование
2. Сжимайте изображения
3. Используйте CDN
4. Оптимизируйте запросы БД
5. Включите gzip сжатие

---

## Какие параметры кэширования использовать?

```
Cache Type: File (или Memcache)
Cache Lifetime: 3600 seconds (1 hour)
Cache Images: Yes
Cache Blocks: Yes
```

---

## Сколько памяти нужно?

- Минимум: 128 МБ
- Рекомендуется: 256 МБ
- Оптимально: 512 МБ+

---

## Как найти медленные страницы?

```bash
# Включите slow query log
mysql> SET GLOBAL slow_query_log = 'ON';
mysql> SET GLOBAL long_query_time = 1;

# Проверьте логи
tail /var/log/mysql/slow-query.log
```

---

## Похожие FAQ

- [Installation FAQ](installation.md)
- [Modules FAQ](modules.md)

---

#faq #performance #optimization #xoops
