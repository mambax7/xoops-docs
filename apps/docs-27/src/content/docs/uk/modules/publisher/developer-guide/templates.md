---
title: "Шаблони та блоки"
---
## Огляд

Publisher надає настроювані шаблони для відображення статей і блоків для інтеграції sidebar/widget. Цей посібник охоплює налаштування шаблону та конфігурацію блоку.

## Файли шаблонів

### Основні шаблони

| Шаблон | Призначення |
|----------|---------|
| `publisher_index.tpl` | Головна сторінка модуля |
| `publisher_item.tpl` | Перегляд однієї статті |
| `publisher_category.tpl` | Перелік категорій |
| `publisher_archive.tpl` | Сторінка архіву |
| `publisher_search.tpl` | Результати пошуку |
| `publisher_submit.tpl` | Форма подання статті |
| `publisher_print.tpl` | Перегляд для друку |

### Шаблони блоків

| Шаблон | Призначення |
|----------|---------|
| `publisher_block_latest.tpl` | Блок останніх статей |
| `publisher_block_spotlight.tpl` | Блок вибраних статей |
| `publisher_block_category.tpl` | Блок списку категорій |
| `publisher_block_author.tpl` | Блок статей автора |

## Змінні шаблону

### Змінні статті
```smarty
{* Available in publisher_item.tpl *}
<{$item.title}>           {* Article title *}
<{$item.body}>            {* Full content *}
<{$item.summary}>         {* Summary/excerpt *}
<{$item.author}>          {* Author name *}
<{$item.authorid}>        {* Author user ID *}
<{$item.datesub}>         {* Publication date *}
<{$item.datemodified}>    {* Last modified date *}
<{$item.counter}>         {* View count *}
<{$item.rating}>          {* Average rating *}
<{$item.votes}>           {* Number of votes *}
<{$item.categoryname}>    {* Category name *}
<{$item.categorylink}>    {* Category URL *}
<{$item.itemurl}>         {* Article URL *}
<{$item.image}>           {* Featured image *}
```
### Змінні категорії
```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```
## Налаштування шаблонів

### Перевизначити розташування

Скопіюйте шаблони до своєї теми, щоб налаштувати:
```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```
### Приклад: спеціальний шаблон статті
```smarty
{* themes/mytheme/modules/publisher/publisher_item.tpl *}
<article class="publisher-article">
    <header>
        <h1><{$item.title}></h1>
        <div class="meta">
            <span class="author">By <{$item.author}></span>
            <span class="date"><{$item.datesub}></span>
            <span class="category">
                <a href="<{$item.categorylink}>"><{$item.categoryname}></a>
            </span>
        </div>
    </header>

    <{if $item.image}>
    <figure class="featured-image">
        <img src="<{$item.image}>" alt="<{$item.title}>">
    </figure>
    <{/if}>

    <div class="content">
        <{$item.body}>
    </div>

    <footer>
        <{if $item.who_when}>
            <p class="attribution"><{$item.who_when}></p>
        <{/if}>

        <div class="actions">
            <{if $can_edit}>
                <a href="<{$xoops_url}>/modules/publisher/submit.php?itemid=<{$item.itemid}>">
                    Edit Article
                </a>
            <{/if}>
            <a href="<{$item.printlink}>" target="_blank">Print</a>
            <a href="<{$item.maillink}>">Email</a>
        </div>
    </footer>
</article>
```
## Блоки

### Доступні блоки

| Блок | Опис |
|-------|-------------|
| Останні новини | Показує останні статті |
| Прожектор | Основна стаття |
| Меню категорій | Навігація за категоріями |
| Архіви | Посилання на архів |
| Кращі автори | Найактивніші автори |
| Популярні товари | Найбільш переглядані статті |

### Параметри блоку

#### Блок останніх новин

| Варіант | Опис |
|--------|-------------|
| Елементи для відображення | Кількість статей |
| Фільтр категорій | Обмеження конкретними категоріями |
| Показати резюме | Показати уривок статті |
| Довжина назви | Обрізати заголовки |
| Шаблон | Файл шаблону блоку |

### Спеціальний шаблон блоку
```smarty
{* themes/mytheme/modules/publisher/blocks/publisher_block_latest.tpl *}
<div class="publisher-latest-block">
    <{foreach item=item from=$block.items}>
    <article class="block-item">
        <h4>
            <a href="<{$item.link}>"><{$item.title}></a>
        </h4>
        <{if $block.show_summary}>
            <p><{$item.summary}></p>
        <{/if}>
        <div class="block-meta">
            <span class="date"><{$item.date}></span>
            <span class="views"><{$item.counter}> views</span>
        </div>
    </article>
    <{/foreach}>
</div>
```
## Хитрощі шаблонів

### Умовне відображення
```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```
### Спеціальний клас CSS
```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```
### Форматування дати
```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```
## Пов'язана документація

- ../User-Guide/Basic-Configuration - Налаштування модуля
- ../User-Guide/Creating-Articles - Управління вмістом
- ../../04-API-Reference/Template/Template-System - Система шаблонів XOOPS
- ../../02-Core-Concepts/Themes/Theme-Development - Налаштування теми