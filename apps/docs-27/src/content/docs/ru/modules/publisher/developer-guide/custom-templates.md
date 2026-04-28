---
title: "Publisher - Пользовательские шаблоны"
description: "Руководство по созданию и кастомизации шаблонов Publisher для вашего сайта"
---

# Пользовательские шаблоны Publisher

> Полное руководство по созданию, кастомизации и развертыванию пользовательских шаблонов Smarty для Publisher.

---

## Обзор системы шаблонов

### Структура шаблонов

```
modules/publisher/templates/
├── publisher_index.tpl           # Главная страница
├── publisher_category.tpl        # Страница категории
├── publisher_item.tpl            # Просмотр статьи
├── publisher_archive.tpl         # Архив статей
├── publisher_search.tpl          # Результаты поиска
├── publisher_comments.tpl        # Комментарии
├── blocks/
│   ├── publisher_recent.tpl      # Недавние статьи
│   ├── publisher_categories.tpl  # Категории
│   └── publisher_archives.tpl    # Архивы
└── admin/
    ├── publisher_admin_items.tpl       # Admin статьи
    ├── publisher_admin_categories.tpl  # Admin категории
    └── publisher_admin_form.tpl        # Admin форма
```

### Доступные переменные

Каждый шаблон имеет доступ к переменным из контроллера:

```smarty
{* Переменные статьи *}
{$item.title}
{$item.description}
{$item.body}
{$item.category}
{$item.author}
{$item.date}
{$item.image}
{$item.url}

{* Переменные категории *}
{$category.name}
{$category.description}
{$category.image}

{* Переменные навигации *}
{$xoops_breadcrumb}
{$xoops_pagenav}
```

### Создание пользовательского шаблона

1. Скопируйте оригинальный шаблон
2. Отредактируйте как нужно
3. Сохраните с новым именем
4. Обновите контроллер для использования

---

## Блоки шаблонов

### Последние статьи

```smarty
{foreach $items as $item}
  <article class="publisher-item">
    <h2>{$item.title}</h2>
    <img src="{$item.image}" alt="">
    <p>{$item.description}</p>
    <a href="{$item.url}">Читать дальше</a>
  </article>
{/foreach}
```

### Список категорий

```smarty
<ul class="publisher-categories">
{foreach $categories as $cat}
  <li>
    <a href="{$cat.url}">{$cat.name}</a>
    <span class="count">({$cat.count})</span>
  </li>
{/foreach}
</ul>
```

---

## Похожие руководства

- Template Variables
- Extending Publisher
- Module Customization

---

#publisher #templates #customization #smarty #xoops
