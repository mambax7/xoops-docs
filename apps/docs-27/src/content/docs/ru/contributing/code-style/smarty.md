---
title: "Соглашения по шаблонам Smarty"
description: "Стандарты кодирования шаблонов Smarty XOOPS и лучшие практики"
---

> XOOPS использует Smarty для шаблонизации. Это руководство охватывает соглашения и лучшие практики для разработки шаблонов Smarty.

---

## Обзор

Шаблоны Smarty XOOPS следуют:

- **Структуре и наименованию шаблонов XOOPS**
- **Стандартам доступности** (WCAG)
- **Семантической разметке HTML5**
- **Наименованию классов в стиле BEM**
- **Оптимизации производительности**

---

## Структура файлов

### Организация шаблонов

```
templates/
├── admin/                   # Шаблоны администратора
│   ├── admin_header.tpl
│   ├── admin_footer.tpl
│   ├── items_list.tpl
│   └── item_form.tpl
├── blocks/                  # Шаблоны блоков
│   ├── recent_items.tpl
│   └── featured.tpl
├── common/                  # Общие шаблоны
│   ├── pagination.tpl
│   ├── breadcrumb.tpl
│   └── empty_state.tpl
├── emails/                  # Шаблоны электронной почты
│   ├── notification.tpl
│   └── verification.tpl
├── pages/                   # Шаблоны страниц
│   ├── index.tpl
│   ├── detail.tpl
│   └── list.tpl
├── db:modulename_header.tpl # Сохранено в БД для переопределений тем
└── db:modulename_footer.tpl
```

### Наименование файлов

```smarty
{* Файлы шаблонов XOOPS используют префикс модуля *}
modulename_index.tpl
modulename_item_detail.tpl
modulename_item_form.tpl
modulename_list.tpl
modulename_pagination.tpl

{* Шаблоны администратора *}
admin_index.tpl
admin_edit.tpl
admin_list.tpl
```

---

## Заголовок файла

### Комментарий заголовка шаблона

```smarty
{*
 * XOOPS Module - Module Name
 * @file Item list template
 * @author Your Name <email@example.com>
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 * Description of what this template displays
 *}

<h1><{$page_title}></h1>
```

---

## Переменные и наименование

### Соглашение об именовании переменных

```smarty
{* Используйте описательные имена *}
<{$page_title}>              {* ✅ Ясно *}
<{$items}>                   {* ✅ Ясно *}
<{$user_count}>              {* ✅ Ясно *}

<{$p_t}>                     {* ❌ Неясная аббревиатура *}
<{$x}>                       {* ❌ Неясно *}
```

### Область видимости переменных

```smarty
{* Глобальные переменные XOOPS *}
<{$xoops_url}>              {* Root URL *}
<{$xoops_sitename}>         {* Site name *}
<{$xoops_requesturi}>       {* Current URI *}
<{$xoops_isadmin}>          {* Admin mode flag *}
<{$xoops_user_is_admin}>    {* Is user admin *}

{* Общие переменные модуля *}
<{$module_id}>              {* Current module ID *}
<{$module_name}>            {* Current module name *}
<{$moduledir}>              {* Module directory *}
<{$lang}>                   {* Current language *}
```

---

## Форматирование и интервалы

### Базовая структура

```smarty
{*
 * Template header
 *}

{* Включите другие шаблоны *}
<{include file="db:modulename_header.tpl"}>

{* Основное содержимое *}
<main class="modulename-container">
  <h1><{$page_title}></h1>

  <{if $items|@count > 0}>
    {* Отрендерьте элементы *}
  <{else}>
    {* Покажите пустое состояние *}
  <{/if}>
</main>

{* Футер *}
<{include file="db:modulename_footer.tpl"}>
```

### Отступы

```smarty
{* Используйте 2 пробела для отступа *}
<{if $condition}>
  <div>
    <p><{$content}></p>
  </div>
<{/if}>

{* Не пропускайте строки в блоках *}
<{foreach item=item from=$items}>
  <div class="item">
    <h3><{$item.title}></h3>
    <p><{$item.description}></p>
  </div>
<{/foreach}>
```

### Интервалы вокруг тегов

```smarty
{* Нет пробелов внутри разделителей тегов *}
<{$variable}>                {* ✅ *}
<{ $variable }>              {* ❌ *}

{* Пробел после трубок в модификаторах *}
<{$text|truncate:50}>        {* ✅ *}
<{$text|truncate:50}>        {* ✅ *}

{* Пробелы вокруг операторов в условиях *}
<{if $count > 0}>            {* ✅ *}
<{if $count>0}>              {* ❌ *}
```

---

## Управляющие структуры

### Условия

```smarty
{* Простой if/else *}
<{if $is_published}>
  <span class="status--published">Published</span>
<{else}>
  <span class="status--draft">Draft</span>
<{/if}>

{* if/elseif/else *}
<{if $status == 'active'}>
  <div class="alert--success">Active</div>
<{elseif $status == 'pending'}>
  <div class="alert--warning">Pending Review</div>
<{else}>
  <div class="alert--danger">Inactive</div>
<{/if}>

{* Встроенный тройной оператор (Smarty 3+) *}
<span class="badge <{if $is_featured}>badge--featured<{/if}>">
  <{$label}>
</span>
```

### Циклы

```smarty
{* Основной foreach *}
<ul class="item-list">
  <{foreach item=item from=$items}>
    <li class="item-list__item">
      <{$item.title}>
    </li>
  <{/foreach}>
</ul>

{* С ключом и счетчиком *}
<{foreach item=item key=key from=$items}>
  <div class="item" data-index="<{$key}>">
    <{$item.title}> (<{$smarty.foreach.item.iteration}>/<{$smarty.foreach.item.total}>)
  </div>
<{/foreach}>

{* С чередованием *}
<{foreach item=item from=$items}>
  <div class="item <{if $smarty.foreach.item.iteration % 2 == 0}>item--even<{else}>item--odd<{/if}>">
    <{$item.title}>
  </div>
<{/foreach}>

{* Проверьте, пусто ли *}
<{if $items|@count > 0}>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{else}>
  <p class="empty-state">No items found</p>
<{/if}>
```

### Раздел (устаревший, используйте foreach вместо этого)

```smarty
{* Не используйте раздел - это устаревший *}
{* ❌ <{section name=i loop=$items}> *}

{* Используйте foreach вместо этого *}
{* ✅ *}
<{foreach item=item from=$items}>
```

---

## Вывод переменных

### Базовый вывод

```smarty
{* Отобразить переменную как есть *}
<{$title}>

{* Отобразить с по умолчанию, если пусто *}
<{$title|default:'Untitled'}>

{* HTML escape (по умолчанию для безопасности) *}
<{$content}>                  {* Экранировано по умолчанию *}
<{$content|escape:'html'}>    {* Явно экранировано *}

{* Необработанный вывод (используйте с осторожностью!) *}
<{$html_content|escape:false}>

{* Специальное кодирование *}
<{$url|escape:'url'}>         {* Для URL контекста *}
<{$json|escape:'javascript'}> {* Для JavaScript *}
```

### Модификаторы

```smarty
{* Форматирование текста *}
<{$text|upper}>              {* Преобразование в верхний регистр *}
<{$text|lower}>              {* Преобразование в нижний регистр *}
<{$text|capitalize}>         {* Капитализировать первую букву *}
<{$text|truncate:50:'...'}>  {* Усечение до 50 символов *}

{* Форматирование чисел *}
<{$price|number_format:2}>   {* Формат числа *}
<{$count|string_format:"%03d"}> {* Формат как строка *}

{* Форматирование даты *}
<{$date|date_format:'%Y-%m-%d'}> {* Формат даты *}
<{$date|date_format:'%B %d, %Y'}>

{* Операции с массивом *}
<{$items|@count}>            {* Подсчитайте элементы (обратите внимание @) *}
<{$items|@array_keys}>       {* Получить ключи *}

{* Цепочка модификаторов *}
<{$title|upper|truncate:30:'...'}> {* Цепь несколько *}

{* Условный модификатор *}
<{$status|default:'pending'}>
```

---

## Константы

### Использование констант XOOPS

```smarty
{* Используйте define()d константы из PHP *}
{* Они должны быть определены в PHP первыми *}

{* Основные константы *}
<{$smarty.const._MD_MODULENAME_TITLE}>
<{$smarty.const._MD_MODULENAME_SUBMIT}>

{* Константы модуля *}
<{$smarty.const.MODULEDIR}>
<{$smarty.const.MODULEURL}>

{* Пользовательские константы *}
<{$smarty.const._MY_CONSTANT}>
```

### Языковые константы

```smarty
{* Используйте языковые константы для i18n *}
{* Определите в языковом файле: define('_MD_MODULENAME_TITLE', 'English Title'); *}

<h1><{$smarty.const._MD_MODULENAME_TITLE}></h1>
<p><{$smarty.const._MD_MODULENAME_DESCRIPTION}></p>
<button><{$smarty.const._MD_MODULENAME_SUBMIT}></button>
```

---

## Лучшие практики HTML

### Семантическая разметка

```smarty
{* Используйте семантические элементы HTML5 *}

<article class="item">
  <header class="item__header">
    <h1 class="item__title"><{$item.title}></h1>
    <time class="item__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
      <{$item.created|date_format:'%B %d, %Y'}>
    </time>
  </header>

  <main class="item__content">
    <{$item.content|escape:false}>
  </main>

  <footer class="item__footer">
    <span class="item__author">By <{$item.author}></span>
  </footer>
</article>
```

### Доступность

```smarty
{* Используйте семантический HTML для доступности *}

{* Ссылки с значимым текстом *}
<a href="<{$item.url}>" class="button">
  <{$item.title}> {* ✅ Значимый текст ссылки *}
</a>

{* Изображения с альтернативным текстом *}
<img src="<{$image.url}>" alt="<{$image.alt_text}>" class="item__image">

{* Метки формы с вводами *}
<label for="email-input" class="form-field__label">
  Email Address
</label>
<input id="email-input" type="email" name="email" class="form-field__input" required>

{* Заголовки по порядку *}
<h1><{$page_title}></h1>
<h2><{$section_title}></h2> {* ✅ По порядку *}
<h4></h4>                  {* ❌ Пропускает h3 *}

{* Используйте атрибуты aria при необходимости *}
<nav aria-label="Main navigation">
  <{$menu}>
</nav>

<button aria-expanded="<{if $is_open}>true<{else}>false<{/if}>">
  Menu
</button>
```

---

## Общие паттерны

### Пагинация

```smarty
{* Отобразить пагинацию *}
<{if $paginator|default:false}>
  <nav class="pagination" aria-label="Pagination">
    <ul class="pagination__list">
      <{if $paginator.has_previous}>
        <li class="pagination__item">
          <a href="<{$paginator.first_url}>" class="pagination__link">First</a>
        </li>
      <{/if}>

      <{foreach item=page from=$paginator.pages}>
        <li class="pagination__item">
          <{if $page.is_current}>
            <span class="pagination__link pagination__link--current" aria-current="page">
              <{$page.number}>
            </span>
          <{else}>
            <a href="<{$page.url}>" class="pagination__link">
              <{$page.number}>
            </a>
          <{/if}>
        </li>
      <{/foreach}>

      <{if $paginator.has_next}>
        <li class="pagination__item">
          <a href="<{$paginator.last_url}>" class="pagination__link">Last</a>
        </li>
      <{/if}>
    </ul>
  </nav>
<{/if}>
```

### Хлебная крошка

```smarty
{* Отобразить навигацию по хлебным крошкам *}
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a href="<{$xoops_url}>" class="breadcrumb__link">Home</a>
    </li>

    <{foreach item=crumb from=$breadcrumbs}>
      <li class="breadcrumb__item">
        <{if $crumb.url}>
          <a href="<{$crumb.url}>" class="breadcrumb__link">
            <{$crumb.title}>
          </a>
        <{else}>
          <span class="breadcrumb__current" aria-current="page">
            <{$crumb.title}>
          </span>
        <{/if}>
      </li>
    <{/foreach}>
  </ol>
</nav>
```

### Сообщения оповещений

```smarty
{* Отобразить сообщения *}
<{if $messages|default:false}>
  <{foreach item=message from=$messages}>
    <div class="alert alert--<{$message.type}>" role="alert">
      <{$message.text}>
    </div>
  <{/foreach}>
<{/if}>

{* Отобразить ошибки *}
<{if $errors|default:false}>
  <div class="alert alert--danger" role="alert">
    <h2 class="alert__title">Error</h2>
    <ul class="alert__list">
      <{foreach item=error from=$errors}>
        <li><{$error}></li>
      <{/foreach}>
    </ul>
  </div>
<{/if}>
```

---

## Производительность

### Оптимизация шаблонов

```smarty
{* Назначьте переменные один раз, переиспользуйте *}
<{assign var=item_count value=$items|@count}>
<{if $item_count > 0}>
  <p>Found <{$item_count}> items</p>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{/if}>

{* Используйте {assign} для вычисленных значений *}
<{assign var=is_admin value=$xoops_isadmin}>
<{if $is_admin}>
  {* Параметры администратора *}
<{/if}>
<{if $is_admin}>
  {* Переиспользуйте то же вычисленное значение *}
<{/if}>

{* Избегайте сложной логики в шаблонах *}
{* ❌ Сложное вычисление в шаблоне *}
<{$total = 0}>
<{foreach item=item from=$items}>
  <{$total = $total + $item.price * $item.quantity}>
<{/foreach}>
<p><{$total}></p>

{* ✅ Вычислите в PHP, отобразите в шаблоне *}
<p><{$total}></p> {* Передано из PHP контроллера *}
```

---

## Лучшие практики

### Делайте

- Используйте семантический HTML5
- Включите альтернативный текст для изображений
- Используйте языковые константы для текста
- Экранируйте вывод (по умолчанию)
- Держите логику минимальной
- Используйте значимые имена переменных
- Включите заголовки файлов
- Используйте имена классов в стиле BEM
- Тестируйте с помощью средств чтения с экрана

### Не делайте

- Не смешивайте логику и представление
- Не забывайте альтернативный текст
- Не используйте необработанный HTML без экранирования
- Не создавайте глобальные переменные в шаблонах
- Не используйте устаревшие функции Smarty
- Не вкладывайте шаблоны слишком глубоко
- Не игнорируйте доступность
- Не жестко закодируйте текст (используйте константы)

---

## Примеры шаблонов

### Полный шаблон модуля

```smarty
{*
 * XOOPS Module - Publisher
 * @file Item list template
 * @author XOOPS Team
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 *}

<{include file="db:publisher_header.tpl"}>

<main class="publisher-container">
  <header class="page-header">
    <h1 class="page-header__title"><{$page_title}></h1>
    <p class="page-header__subtitle"><{$smarty.const._MD_PUBLISHER_ITEMS_DESC}></p>
  </header>

  <{if $items|@count > 0}>
    <section class="items-list">
      <ul class="items-list__items">
        <{foreach item=item from=$items}>
          <li class="items-list__item item-card">
            <article class="item-card">
              <h2 class="item-card__title">
                <a href="<{$item.url}>" class="item-card__link">
                  <{$item.title}>
                </a>
              </h2>

              <div class="item-card__meta">
                <time class="item-card__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
                  <{$item.created|date_format:'%B %d, %Y'}>
                </time>
                <span class="item-card__author">
                  By <{$item.author}>
                </span>
              </div>

              <p class="item-card__excerpt">
                <{$item.description|truncate:150:'...'}>
              </p>

              <a href="<{$item.url}>" class="button button--primary">
                <{$smarty.const._MD_PUBLISHER_READ_MORE}>
              </a>
            </article>
          </li>
        <{/foreach}>
      </ul>
    </section>

    <{if $paginator|default:false}>
      <{include file="db:publisher_pagination.tpl"}>
    <{/if}>
  <{else}>
    <div class="empty-state">
      <p class="empty-state__message">
        <{$smarty.const._MD_PUBLISHER_NO_ITEMS}>
      </p>
    </div>
  <{/if}>
</main>

<{include file="db:publisher_footer.tpl"}>
```

---

## Связанная документация

- Стандарты JavaScript
- Рекомендации CSS
- Кодекс поведения
- Стандарты PHP

---

#xoops #smarty #templates #conventions #best-practices
