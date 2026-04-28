---
title: "Publisher - Шаблоны и переменные"
description: "Справочник переменных шаблонов и компонентов Smarty для Publisher"
---

# Шаблоны и переменные Publisher

> Справочник доступных переменных, блоков и компонентов Smarty для шаблонов Publisher.

---

## Переменные шаблонов

### Переменные статьи

```smarty
{* Информация статьи *}
{$item.itemid}          {* ID статьи *}
{$item.title}           {* Название *}
{$item.description}     {* Описание *}
{$item.body}            {* Содержание *}
{$item.subtitle}        {* Подзаголовок *}
{$item.image}           {* Изображение *}
{$item.uid}             {* ID автора *}
{$item.uname}           {* Имя автора *}
{$item.categoryid}      {* ID категории *}
{$item.category}        {* Название категории *}
{$item.datesub}         {* Дата публикации *}
{$item.datemod}         {* Дата изменения *}
{$item.counter}         {* Количество просмотров *}
{$item.status}          {* Статус *}
{$item.featured}        {* Избранное *}
{$item.url}             {* URL статьи *}
```

### Переменные категории

```smarty
{$category.categoryid}  {* ID категории *}
{$category.name}       {* Название *}
{$category.description} {* Описание *}
{$category.image}      {* Изображение *}
{$category.url}        {* URL категории *}
{$category.count}      {* Количество статей *}
```

---

## Встроенные функции шаблонов

```smarty
{* Форматирование даты *}
{$item.datesub|date_format:"%d.%m.%Y"}

{* Обрезка текста *}
{$item.description|truncate:100:"..."}

{* HTML безопасность *}
{$item.title|escape:'html'}

{* Преобразование переносов строк *}
{$item.body|nl2br}
```

---

## Похожие руководства

- Custom Templates
- API Reference
- Theme Development

---

#publisher #templates #smarty #variables #xoops
