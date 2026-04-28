---
title: "Утилиты базы данных"
description: "Утилиты базы данных XMF для управления схемой, миграций и загрузки данных"
---

Пространство имен `Xmf\Database` предоставляет классы для упрощения задач обслуживания БД, связанных с установкой и обновлением модулей XOOPS. Эти утилиты обрабатывают миграции схемы, модификации таблиц и начальную загрузку данных.

## Обзор

Утилиты базы данных включают:

- **Tables** - Построение и выполнение DDL утверждений для модификации таблиц
- **Migrate** - Синхронизация схемы БД между версиями модулей
- **TableLoad** - Загрузка начальных данных в таблицы

## Xmf\Database\Tables

Класс `Tables` упрощает создание и модификацию таблиц БД. Он строит очередь работы DDL (Data Definition Language) утверждений, которые выполняются вместе.

### Ключевые функции

- Загружает текущую схему из существующих таблиц
- Ставит в очередь изменения без немедленного выполнения
- Рассматривает текущее состояние при определении работы
- Автоматически обрабатывает префикс таблицы XOOPS

### Начало работы

```php
use Xmf\Database\Tables;

// Создать новый экземпляр Tables
$tables = new Tables();

// Загрузить существующую таблицу или начать новую схему
$tables->addTable('mymodule_items');

// Для существующих таблиц только (не выполняется, если таблица не существует)
$tables->useTable('mymodule_items');
```

### Операции с таблицами

#### Переименовать таблицу

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### Установить опции таблицы

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### Удалить таблицу

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

### Работа со столбцами

#### Добавить столбец

```php
$tables = new Tables();
$tables->addTable('mymodule_items');

$tables->addColumn(
    'mymodule_items',
    'status',
    "TINYINT(1) NOT NULL DEFAULT '1'"
);

$tables->executeQueue();
```

#### Изменить столбец

```php
$tables->useTable('mymodule_items');

// Изменить атрибуты столбца
$tables->alterColumn(
    'mymodule_items',
    'title',
    "VARCHAR(255) NOT NULL DEFAULT ''"
);

// Переименовать и изменить столбец
$tables->alterColumn(
    'mymodule_items',
    'old_column_name',
    "VARCHAR(100) NOT NULL",
    'new_column_name'
);

$tables->executeQueue();
```

### Работа с индексами

#### Добавить индекс

```php
$tables->useTable('mymodule_items');

// Простой индекс
$tables->addIndex('idx_category', 'mymodule_items', 'category_id');

// Уникальный индекс
$tables->addIndex('idx_slug', 'mymodule_items', 'slug', true);

// Составной индекс
$tables->addIndex('idx_cat_status', 'mymodule_items', 'category_id, status');

$tables->executeQueue();
```

#### Удалить индекс

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

### Операции данных

#### Вставить данные

```php
$tables->useTable('mymodule_categories');

$tables->insert('mymodule_categories', [
    'category_id' => 1,
    'name' => 'General',
    'weight' => 0
]);

$tables->executeQueue();
```

#### Обновить данные

```php
$tables->useTable('mymodule_items');

// Обновить с объектом критериев
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

$tables->executeQueue();
```

#### Удалить данные

```php
$tables->useTable('mymodule_items');

// Удалить с критериями
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

$tables->executeQueue();
```

### Управление очередью работы

#### Выполнить очередь

```php
// Нормальное выполнение (уважает безопасность метода HTTP)
$result = $tables->executeQueue();

// Принудительное выполнение даже при GET запросах
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

## Xmf\Database\Migrate

Класс `Migrate` упрощает синхронизацию изменений БД между версиями модулей. Он расширяет `Tables` сравнением схем и автоматической синхронизацией.

### Базовое использование

```php
use Xmf\Database\Migrate;

// Создать экземпляр migrate для модуля
$migrate = new Migrate('mymodule');

// Синхронизировать БД с целевой схемой
$migrate->synchronizeSchema();
```

### В обновлении модуля

Обычно вызывается в функции `xoops_module_pre_update_*` модуля:

```php
function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    $migrate = new \Xmf\Database\Migrate('mymodule');

    // Выполнить любые действия перед синхронизацией
    // ...

    // Синхронизировать схему
    return $migrate->synchronizeSchema();
}
```

## Xmf\Database\TableLoad

Класс `TableLoad` упрощает загрузку начальных данных в таблицы. Полезно для заполнения таблиц данными по умолчанию при установке модуля.

### Загрузка данных из массивов

```php
use Xmf\Database\TableLoad;

$data = [
    ['category_id' => 1, 'name' => 'General', 'weight' => 0],
    ['category_id' => 2, 'name' => 'News', 'weight' => 10],
    ['category_id' => 3, 'name' => 'Events', 'weight' => 20]
];

$count = TableLoad::loadTableFromArray('mymodule_categories', $data);
echo "Inserted {$count} rows";
```

### Загрузка данных из YAML

```php
// Загрузить из YAML файла
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

### API справочник

| Метод | Описание |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Загрузить из массива |
| `loadTableFromYamlFile($table, $file)` | Загрузить из YAML |
| `truncateTable($table)` | Очистить таблицу |
| `countRows($table, $criteria)` | Подсчитать строки |
| `extractRows($table, $criteria, $skip)` | Извлечь строки |

---

#xmf #database #migration #schema #tables #ddl
