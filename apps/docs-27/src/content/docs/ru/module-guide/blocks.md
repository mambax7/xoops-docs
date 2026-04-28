---
title: "Разработка блоков"
---

## Обзор

Блоки - это многократно используемые виджеты содержимого, отображаемые в боковых панелях и областях содержимого темы. Это руководство охватывает создание, настройку и кастомизацию блоков XOOPS.

## Структура блока

### Определение блока в xoops_version.php

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => '_MI_MYMODULE_BLOCK_RECENT',
    'description' => '_MI_MYMODULE_BLOCK_RECENT_DESC',
    'show_func'   => 'mymodule_recent_show',
    'edit_func'   => 'mymodule_recent_edit',
    'template'    => 'mymodule_block_recent.tpl',
    'options'     => '10|0|date',  // Опции по умолчанию: limit|category|sort
];
```

### Параметры блока

| Параметр | Описание |
|-----------|-------------|
| `file` | PHP-файл, содержащий функции блока |
| `name` | Языковая константа для названия блока |
| `description` | Языковая константа для описания |
| `show_func` | Функция для отрисовки содержимого блока |
| `edit_func` | Функция для отрисовки формы параметров блока |
| `template` | Файл шаблона Smarty |
| `options` | Опции по умолчанию, разделенные трубой |

## Функции блока

### Функция отрисовки

```php
// blocks/recent.php

function mymodule_recent_show(array $options): array
{
    // Парсинг опций
    $limit = (int) ($options[0] ?? 10);
    $categoryId = (int) ($options[1] ?? 0);
    $sortBy = $options[2] ?? 'date';

    // Получить помощник модуля
    $helper = \Xmf\Module\Helper::getHelper('mymodule');
    $handler = $helper->getHandler('Item');

    // Построить критерии
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('status', 'published'));

    if ($categoryId > 0) {
        $criteria->add(new \Criteria('category_id', $categoryId));
    }

    $criteria->setSort($sortBy === 'popular' ? 'views' : 'created_at');
    $criteria->setOrder('DESC');
    $criteria->setLimit($limit);

    // Получить элементы
    $items = $handler->getObjects($criteria);

    // Построить массив блока
    $block = [];
    foreach ($items as $item) {
        $block['items'][] = [
            'id'      => $item->getVar('id'),
            'title'   => $item->getVar('title'),
            'link'    => $helper->url("item.php?id=" . $item->getVar('id')),
            'date'    => formatTimestamp($item->getVar('created_at'), 's'),
            'summary' => $item->getVar('summary'),
            'views'   => $item->getVar('views'),
        ];
    }

    $block['show_summary'] = $helper->getConfig('block_show_summary');

    return $block;
}
```

### Функция редактирования

```php
function mymodule_recent_edit(array $options): string
{
    $helper = \Xmf\Module\Helper::getHelper('mymodule');

    // Опция 1: Количество элементов
    $form = _MI_MYMODULE_BLOCK_LIMIT . ': ';
    $form .= '<input type="text" name="options[0]" value="' . ($options[0] ?? 10) . '" size="5">';
    $form .= '<br>';

    // Опция 2: Выбор категории
    $form .= _MI_MYMODULE_BLOCK_CATEGORY . ': ';
    $form .= '<select name="options[1]">';
    $form .= '<option value="0">' . _ALL . '</option>';

    $categoryHandler = $helper->getHandler('Category');
    $categories = $categoryHandler->getObjects();
    foreach ($categories as $cat) {
        $selected = ($cat->getVar('id') == ($options[1] ?? 0)) ? ' selected' : '';
        $form .= '<option value="' . $cat->getVar('id') . '"' . $selected . '>';
        $form .= $cat->getVar('name') . '</option>';
    }
    $form .= '</select><br>';

    // Опция 3: Порядок сортировки
    $form .= _MI_MYMODULE_BLOCK_SORT . ': ';
    $form .= '<select name="options[2]">';
    $sortOptions = ['date' => _MI_MYMODULE_SORT_DATE, 'popular' => _MI_MYMODULE_SORT_POPULAR];
    foreach ($sortOptions as $value => $label) {
        $selected = ($value == ($options[2] ?? 'date')) ? ' selected' : '';
        $form .= '<option value="' . $value . '"' . $selected . '>' . $label . '</option>';
    }
    $form .= '</select>';

    return $form;
}
```

## Шаблон блока

```smarty
{* templates/blocks/mymodule_block_recent.tpl *}
<div class="mymodule-block-recent">
    <{if $block.items}>
        <ul class="item-list">
            <{foreach item=item from=$block.items}>
            <li class="item">
                <a href="<{$item.link}>" class="item-title">
                    <{$item.title}>
                </a>
                <{if $block.show_summary && $item.summary}>
                    <p class="item-summary"><{$item.summary|truncate:100}></p>
                <{/if}>
                <span class="item-meta">
                    <span class="date"><{$item.date}></span>
                    <span class="views"><{$item.views}> views</span>
                </span>
            </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MI_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>
```

## Блок с поддержкой клонирования

Клонируемые блоки позволяют несколько экземпляров:

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/category.php',
    'name'        => '_MI_MYMODULE_BLOCK_CATEGORY',
    'description' => '_MI_MYMODULE_BLOCK_CATEGORY_DESC',
    'show_func'   => 'mymodule_category_show',
    'edit_func'   => 'mymodule_category_edit',
    'template'    => 'mymodule_block_category.tpl',
    'options'     => '0',
    'can_clone'   => true,  // Включить клонирование
];
```

## Динамическое содержимое блока

### Блоки с загрузкой AJAX

```php
function mymodule_ajax_show(array $options): array
{
    $block = [
        'block_id'  => $options['bid'] ?? 0,
        'ajax_url'  => XOOPS_URL . '/modules/mymodule/ajax/block.php',
        'interval'  => (int) ($options[0] ?? 30),  // Интервал обновления в секундах
    ];

    return $block;
}
```

```smarty
{* Шаблон с обновлением AJAX *}
<div id="mymodule-block-<{$block.block_id}>" class="ajax-block">
    <div class="block-content"></div>
</div>

<script>
(function() {
    const container = document.getElementById('mymodule-block-<{$block.block_id}>');
    const url = '<{$block.ajax_url}>?bid=<{$block.block_id}>';

    function loadContent() {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                container.querySelector('.block-content').innerHTML = html;
            });
    }

    loadContent();
    setInterval(loadContent, <{$block.interval}> * 1000);
})();
</script>
```

## Лучшие практики

1. **Кешируйте результаты** - Кешируйте дорогостоящие запросы
2. **Проверяйте опции** - Всегда проверяйте параметры блока
3. **Экранируйте вывод** - Очищайте все пользовательское содержимое
4. **Используйте Criteria** - Создавайте запросы с классом Criteria
5. **Ограничивайте запросы** - Установите разумные лимиты для производительности
6. **Адаптивные шаблоны** - Убедитесь, что блоки работают на мобильных устройствах

## Связанная документация

- Module-Development - Руководство по созданию модуля
- ../02-Core-Concepts/Templates/Smarty-Templating - Синтаксис шаблонов
- ../04-API-Reference/Template/Template-System - Движок шаблонов XOOPS
- xoops_version.php - Манифест модуля
