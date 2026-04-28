---
title: "Utilidades de Base de Datos"
description: "Utilidades de base de datos XMF para gestión de esquema, migraciones y carga de datos"
---

El espacio de nombres `Xmf\Database` proporciona clases para simplificar tareas de mantenimiento de bases de datos asociadas con la instalación y actualización de módulos de XOOPS. Estas utilidades manejan migraciones de esquema, modificaciones de tabla y carga inicial de datos.

## Descripción General

Las utilidades de base de datos incluyen:

- **Tables** - Construir y ejecutar declaraciones DDL para modificaciones de tabla
- **Migrate** - Sincronizar esquema de base de datos entre versiones de módulo
- **TableLoad** - Cargar datos iniciales en tablas

## Xmf\Database\Tables

La clase `Tables` simplifica crear y modificar tablas de base de datos. Construye una cola de trabajo de declaraciones DDL (Data Definition Language) que se ejecutan juntas.

### Características Clave

- Carga el esquema actual de las tablas existentes
- Pone en cola cambios sin ejecución inmediata
- Considera el estado actual al determinar el trabajo a realizar
- Maneja automáticamente el prefijo de tabla de XOOPS

### Primeros Pasos

```php
use Xmf\Database\Tables;

// Crear una nueva instancia de Tables
$tables = new Tables();

// Cargar una tabla existente o comenzar nuevo esquema
$tables->addTable('mymodule_items');

// Solo para tablas existentes (falla si la tabla no existe)
$tables->useTable('mymodule_items');
```

### Operaciones de Tabla

#### Renombrar una Tabla

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### Establecer Opciones de Tabla

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### Eliminar una Tabla

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### Copiar una Tabla

```php
// Copiar solo la estructura
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copiar estructura y datos
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### Trabajar con Columnas

#### Agregar una Columna

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

#### Alterar una Columna

```php
$tables->useTable('mymodule_items');

// Cambiar atributos de columna
$tables->alterColumn(
    'mymodule_items',
    'title',
    "VARCHAR(255) NOT NULL DEFAULT ''"
);

// Renombrar y modificar columna
$tables->alterColumn(
    'mymodule_items',
    'old_column_name',
    "VARCHAR(100) NOT NULL",
    'new_column_name'
);

$tables->executeQueue();
```

#### Obtener Atributos de Columna

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Devuelve: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### Eliminar una Columna

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### Trabajar con Índices

#### Obtener Índices de Tabla

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Devuelve una matriz como:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### Agregar Clave Primaria

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Clave primaria compuesta
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### Agregar Índice

```php
$tables->useTable('mymodule_items');

// Índice simple
$tables->addIndex('idx_category', 'mymodule_items', 'category_id');

// Índice único
$tables->addIndex('idx_slug', 'mymodule_items', 'slug', true);

// Índice compuesto
$tables->addIndex('idx_cat_status', 'mymodule_items', 'category_id, status');

$tables->executeQueue();
```

#### Eliminar Índice

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### Eliminar Todos los Índices No Primarios

```php
// Útil para limpiar nombres de índices auto-generados
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### Eliminar Clave Primaria

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### Operaciones de Datos

#### Insertar Datos

```php
$tables->useTable('mymodule_categories');

$tables->insert('mymodule_categories', [
    'category_id' => 1,
    'name' => 'General',
    'weight' => 0
]);

// Sin entrecomillado automático (para expresiones)
$tables->insert('mymodule_logs', [
    'created' => 'NOW()',
    'message' => "'Test message'"
], false);

$tables->executeQueue();
```

#### Actualizar Datos

```php
$tables->useTable('mymodule_items');

// Actualizar con objeto de criterios
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Actualizar con criterios de cadena
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### Eliminar Datos

```php
$tables->useTable('mymodule_items');

// Eliminar con criterios
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Eliminar con criterios de cadena
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### Vaciar Tabla

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### Gestión de Cola de Trabajo

#### Ejecutar Cola

```php
// Ejecución normal (respeta la seguridad del método HTTP)
$result = $tables->executeQueue();

// Forzar ejecución incluso en solicitudes GET
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### Reiniciar Cola

```php
// Limpiar cola sin ejecutar
$tables->resetQueue();
```

#### Agregar SQL Crudo

```php
// Agregar SQL personalizado a la cola
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### Manejo de Errores

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Manejar error
}
```

## Xmf\Database\Migrate

La clase `Migrate` simplifica sincronizar cambios de base de datos entre versiones de módulo. Extiende `Tables` con comparación de esquema y sincronización automática.

### Uso Básico

```php
use Xmf\Database\Migrate;

// Crear instancia de migración para un módulo
$migrate = new Migrate('mymodule');

// Sincronizar la base de datos con el esquema de destino
$migrate->synchronizeSchema();
```

### En Actualización de Módulo

Típicamente se llama en la función `xoops_module_pre_update_*` del módulo:

```php
function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    $migrate = new \Xmf\Database\Migrate('mymodule');

    // Realizar cualquier acción previa a la sincronización (renombramientos, etc.)
    // ...

    // Sincronizar esquema
    return $migrate->synchronizeSchema();
}
```

### Obtener Declaraciones DDL

Para bases de datos grandes o migraciones por línea de comandos:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Ejecutar declaraciones en lotes o desde CLI
foreach ($statements as $sql) {
    // Procesar cada declaración
}
```

### Acciones Pre-Sincronización

Algunos cambios requieren manejo explícito antes de la sincronización. Extender `Migrate` para migraciones complejas:

```php
class MyModuleMigrate extends \Xmf\Database\Migrate
{
    public function preSyncActions()
    {
        // Renombrar una tabla antes de sincronizar
        $this->useTable('mymodule_old_name');
        $this->renameTable('mymodule_old_name', 'mymodule_new_name');
        $this->executeQueue();

        // Renombrar una columna
        $this->useTable('mymodule_items');
        $this->alterColumn(
            'mymodule_items',
            'old_column',
            'VARCHAR(255) NOT NULL',
            'new_column'
        );
        $this->executeQueue();
    }
}

// Uso
$migrate = new MyModuleMigrate('mymodule');
$migrate->preSyncActions();
$migrate->synchronizeSchema();
```

### Gestión de Esquema

#### Obtener Esquema Actual

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### Obtener Esquema de Destino

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### Guardar Esquema Actual

Para que los desarrolladores de módulos capturen esquema después de cambios de base de datos:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Guarda esquema en sql/migrate.yml del módulo
```

> **Nota del Desarrollador:** Siempre haga cambios en la base de datos primero, luego ejecute `saveCurrentSchema()`. No edite manualmente el archivo de esquema generado.

## Xmf\Database\TableLoad

La clase `TableLoad` simplifica cargar datos iniciales en tablas. Útil para sembrar tablas con datos predeterminados durante la instalación del módulo.

### Cargar Datos de Matrices

```php
use Xmf\Database\TableLoad;

$data = [
    ['category_id' => 1, 'name' => 'General', 'weight' => 0],
    ['category_id' => 2, 'name' => 'Noticias', 'weight' => 10],
    ['category_id' => 3, 'name' => 'Eventos', 'weight' => 20]
];

$count = TableLoad::loadTableFromArray('mymodule_categories', $data);
echo "Se insertaron {$count} filas";
```

### Cargar Datos de YAML

```php
// Cargar desde archivo YAML
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

Formato YAML:

```yaml
-
  category_id: 1
  name: General
  weight: 0
-
  category_id: 2
  name: Noticias
  weight: 10
```

### Extrayendo Datos

#### Contar Filas

```php
// Contar todas las filas
$total = TableLoad::countRows('mymodule_items');

// Contar con criterios
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### Extraer Filas

```php
// Extraer todas las filas
$rows = TableLoad::extractRows('mymodule_items');

// Extraer con criterios
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Omitir ciertas columnas
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### Guardar Datos en YAML

```php
// Guardar todos los datos
TableLoad::saveTableToYamlFile(
    'mymodule_categories',
    '/path/to/categories.yml'
);

// Guardar datos filtrados
$criteria = new Criteria('is_default', 1);
TableLoad::saveTableToYamlFile(
    'mymodule_settings',
    '/path/to/default_settings.yml',
    $criteria
);

// Guardar sin ciertas columnas
TableLoad::saveTableToYamlFile(
    'mymodule_items',
    '/path/to/items.yml',
    null,
    ['created', 'modified']
);
```

### Vaciar Tabla

```php
// Vaciar una tabla
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## Ejemplo Completo de Migración

### xoops_version.php

```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_settings'
];
```

### include/onupdate.php

```php
<?php
use Xmf\Database\Migrate;
use Xmf\Database\Tables;
use Xmf\Database\TableLoad;

function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    // Crear clase de migración personalizada
    $migrate = new MyModuleMigrate('mymodule');

    // Manejar migraciones específicas de versión
    if ($previousVersion < 120) {
        // Versión 1.2.0 renombró una tabla
        $migrate->renameOldTable();
    }

    if ($previousVersion < 130) {
        // Versión 1.3.0 renombró una columna
        $migrate->renameOldColumn();
    }

    // Sincronizar esquema
    return $migrate->synchronizeSchema();
}

function xoops_module_update_mymodule($module, $previousVersion)
{
    // Migraciones de datos posteriores a la actualización
    if ($previousVersion < 130) {
        // Cargar nueva configuración predeterminada
        TableLoad::loadTableFromYamlFile(
            'mymodule_settings',
            XOOPS_ROOT_PATH . '/modules/mymodule/sql/new_settings.yml'
        );
    }

    return true;
}

class MyModuleMigrate extends Migrate
{
    public function renameOldTable()
    {
        if ($this->useTable('mymodule_posts')) {
            $this->renameTable('mymodule_posts', 'mymodule_items');
            $this->executeQueue();
        }
    }

    public function renameOldColumn()
    {
        if ($this->useTable('mymodule_items')) {
            $this->alterColumn(
                'mymodule_items',
                'post_title',
                "VARCHAR(255) NOT NULL DEFAULT ''",
                'title'
            );
            $this->executeQueue();
        }
    }
}
```

## Referencia de API

### Xmf\Database\Tables

| Método | Descripción |
|--------|-------------|
| `addTable($table)` | Cargar o crear esquema de tabla |
| `useTable($table)` | Cargar tabla existente solo |
| `renameTable($table, $newName)` | Encolar renombramiento de tabla |
| `setTableOptions($table, $options)` | Encolar cambio de opciones de tabla |
| `dropTable($table)` | Encolar eliminación de tabla |
| `copyTable($table, $newTable, $withData)` | Encolar copia de tabla |
| `addColumn($table, $column, $attributes)` | Encolar adición de columna |
| `alterColumn($table, $column, $attributes, $newName)` | Encolar cambio de columna |
| `getColumnAttributes($table, $column)` | Obtener definición de columna |
| `dropColumn($table, $column)` | Encolar eliminación de columna |
| `getTableIndexes($table)` | Obtener definiciones de índice |
| `addPrimaryKey($table, $column)` | Encolar clave primaria |
| `addIndex($name, $table, $column, $unique)` | Encolar índice |
| `dropIndex($name, $table)` | Encolar eliminación de índice |
| `dropIndexes($table)` | Encolar todas las eliminaciones de índice |
| `dropPrimaryKey($table)` | Encolar eliminación de clave primaria |
| `insert($table, $columns, $quote)` | Encolar inserción |
| `update($table, $columns, $criteria, $quote)` | Encolar actualización |
| `delete($table, $criteria)` | Encolar eliminación |
| `truncate($table)` | Encolar truncamiento |
| `executeQueue($force)` | Ejecutar operaciones encoladas |
| `resetQueue()` | Limpiar cola |
| `addToQueue($sql)` | Agregar SQL crudo |
| `getLastError()` | Obtener último mensaje de error |
| `getLastErrNo()` | Obtener último código de error |

### Xmf\Database\Migrate

| Método | Descripción |
|--------|-------------|
| `__construct($dirname)` | Crear para módulo |
| `synchronizeSchema()` | Sincronizar base de datos al destino |
| `getSynchronizeDDL()` | Obtener declaraciones DDL |
| `preSyncActions()` | Anular para acciones personalizadas |
| `getCurrentSchema()` | Obtener esquema de base de datos actual |
| `getTargetDefinitions()` | Obtener esquema de destino |
| `saveCurrentSchema()` | Guardar esquema para desarrolladores |

### Xmf\Database\TableLoad

| Método | Descripción |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Cargar desde matriz |
| `loadTableFromYamlFile($table, $file)` | Cargar desde YAML |
| `truncateTable($table)` | Vaciar tabla |
| `countRows($table, $criteria)` | Contar filas |
| `extractRows($table, $criteria, $skip)` | Extraer filas |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Guardar a YAML |

## Ver También

- ../XMF-Framework - Descripción general del marco
- ../Basics/XMF-Module-Helper - Clase de ayuda de módulo
- Metagen - Utilidades de metadatos

---

#xmf #database #migration #schema #tables #ddl
