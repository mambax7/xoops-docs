---
title: "Prevención de Inyección SQL"
description: "Prácticas de seguridad de base de datos y prevención de inyección SQL en XOOPS"
---

La inyección SQL es una de las vulnerabilidades de aplicaciones web más peligrosas y comunes. Esta guía cubre cómo proteger sus módulos XOOPS de ataques de inyección SQL.

## Documentación Relacionada

- Security-Best-Practices - Guía completa de seguridad
- CSRF-Protection - Sistema de tokens y clase XoopsSecurity
- Input-Sanitization - MyTextSanitizer y validación

## Comprensión de Inyección SQL

La inyección SQL ocurre cuando la entrada del usuario se incluye directamente en consultas SQL sin la sanitización o parametrización adecuada.

### Ejemplo de Código Vulnerable

```php
// PELIGROSO - NO USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

Si un usuario pasa `1 OR 1=1` como ID, la consulta se convierte en:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

Esto devuelve todos los registros en lugar de solo uno.

## Uso de Consultas Parametrizadas

La defensa más efectiva contra la inyección SQL es usar consultas parametrizadas (sentencias preparadas).

### Consulta Parametrizada Básica

```php
// Obtener conexión de base de datos
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SEGURO - Usar consulta parametrizada
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### Múltiples Parámetros

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### Parámetros Nombrados

Algunas abstracciones de base de datos soportan parámetros nombrados:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## Uso de XoopsObject y XoopsObjectHandler

XOOPS proporciona acceso a base de datos orientado a objetos que ayuda a prevenir inyección SQL a través del sistema Criteria.

### Uso Básico de Criteria

```php
// Obtener el controlador
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Crear criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Obtener objetos - automáticamente seguro contra inyección SQL
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo para Múltiples Condiciones

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('category_id', (int)$categoryId));
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', (int)$userId));

// Opcional: Añadir ordenamiento y límites
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart(0);

$items = $itemHandler->getObjects($criteria);
```

### Operadores de Criteria

```php
// Igual (predeterminado)
$criteria->add(new Criteria('status', 'active'));

// No igual
$criteria->add(new Criteria('status', 'deleted', '!='));

// Mayor que
$criteria->add(new Criteria('count', 100, '>'));

// Menor o igual que
$criteria->add(new Criteria('price', 50, '<='));

// LIKE (para coincidencia parcial)
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));

// IN (múltiples valores)
$criteria->add(new Criteria('id', '(' . implode(',', $ids) . ')', 'IN'));
```

### Condiciones OR

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// Condición OR
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## Prefijos de Tabla

Siempre use el sistema de prefijo de tabla XOOPS:

```php
// Correcto - usando prefijo
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// También correcto
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## Consultas INSERT

### Uso de Sentencias Preparadas

```php
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') .
       " (title, content, uid, created) VALUES (?, ?, ?, ?)";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    (int)$userId,
    time()
]);

if ($result) {
    $newId = $xoopsDB->getInsertId();
}
```

### Uso de XoopsObject

```php
// Crear nuevo objeto
$item = $itemHandler->create();

// Establecer valores - el controlador escapa automáticamente
$item->setVar('title', $title);
$item->setVar('content', $content);
$item->setVar('uid', (int)$userId);
$item->setVar('created', time());

// Insertar
if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}
```

## Consultas UPDATE

### Uso de Sentencias Preparadas

```php
$sql = "UPDATE " . $xoopsDB->prefix('mytable') .
       " SET title = ?, content = ?, updated = ? WHERE id = ?";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    time(),
    (int)$id
]);
```

### Uso de XoopsObject

```php
// Obtener objeto existente
$item = $itemHandler->get((int)$id);

if ($item) {
    $item->setVar('title', $title);
    $item->setVar('content', $content);
    $item->setVar('updated', time());

    $itemHandler->insert($item);
}
```

## Consultas DELETE

### Uso de Sentencias Preparadas

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Uso de XoopsObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Eliminación Masiva con Criteria

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## Escape Cuando Sea Necesario

Si no puede usar sentencias preparadas, use escape apropiado:

```php
// Usando mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

Sin embargo, **siempre prefiera sentencias preparadas** sobre escape.

## Construcción de Consultas Dinámicas de Forma Segura

### Nombres de Columna Dinámicos Seguros

Los nombres de columna no pueden parametrizarse. Validar contra una lista blanca:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Valor seguro predeterminado
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### Nombres de Tabla Dinámicos Seguros

De manera similar, validar nombres de tabla:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### Construcción de Cláusulas WHERE Dinámicamente

```php
$criteria = new CriteriaCompo();

// Añadir condiciones basadas en entrada
if (!empty($_GET['category'])) {
    $criteria->add(new Criteria('category_id', (int)$_GET['category']));
}

if (!empty($_GET['status'])) {
    $allowed_statuses = ['draft', 'published', 'archived'];
    if (in_array($_GET['status'], $allowed_statuses)) {
        $criteria->add(new Criteria('status', $_GET['status']));
    }
}

if (!empty($_GET['search'])) {
    $search = '%' . $_GET['search'] . '%';
    $criteria->add(new Criteria('title', $search, 'LIKE'));
}

$items = $itemHandler->getObjects($criteria);
```

## Consultas LIKE

Tenga cuidado con consultas LIKE para evitar inyección de comodín:

```php
// Escapar caracteres especiales en término de búsqueda
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Luego usar en LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## Cláusulas IN

Cuando se usan cláusulas IN, asegurar que todos los valores estén tipados apropiadamente:

```php
// Matriz de IDs de entrada del usuario
$inputIds = $_POST['ids'] ?? [];

// Sanitizar: asegurar que todos sean enteros
$safeIds = array_map('intval', $inputIds);
$safeIds = array_filter($safeIds, function($id) { return $id > 0; });

if (!empty($safeIds)) {
    $idList = implode(',', $safeIds);
    $sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
           " WHERE id IN ({$idList})";
    $result = $xoopsDB->query($sql);
}
```

O con Criteria:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## Seguridad de Transacción

Cuando se realizan múltiples consultas relacionadas:

```php
// Iniciar transacción
$xoopsDB->query("START TRANSACTION");

try {
    // Consulta 1
    $sql1 = "INSERT INTO " . $xoopsDB->prefix('items') . " (title) VALUES (?)";
    $result1 = $xoopsDB->query($sql1, [$title]);

    if (!$result1) {
        throw new Exception('Insert failed');
    }

    $itemId = $xoopsDB->getInsertId();

    // Consulta 2
    $sql2 = "INSERT INTO " . $xoopsDB->prefix('item_meta') .
            " (item_id, meta_key, meta_value) VALUES (?, ?, ?)";
    $result2 = $xoopsDB->query($sql2, [$itemId, 'author', $author]);

    if (!$result2) {
        throw new Exception('Meta insert failed');
    }

    // Confirmar
    $xoopsDB->query("COMMIT");

} catch (Exception $e) {
    // Revertir en caso de error
    $xoopsDB->query("ROLLBACK");
    throw $e;
}
```

## Manejo de Errores

Nunca exponga errores SQL a los usuarios:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);

if (!$result) {
    // Registrar el error real para depuración
    error_log('Database error: ' . $xoopsDB->error());

    // Mostrar mensaje genérico al usuario
    redirect_header('index.php', 3, 'An error occurred. Please try again.');
    exit();
}
```

## Errores Comunes a Evitar

### Error 1: Interpolación Directa de Variable

```php
// INCORRECTO
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// CORRECTO
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Error 2: Usar addslashes()

```php
// INCORRECTO - addslashes NO es suficiente
$safe = addslashes($_GET['input']);

// CORRECTO - usar consultas parametrizadas o escape apropiado
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### Error 3: Confiar en IDs Numéricos

```php
// INCORRECTO - asumir que la entrada es numérica
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// CORRECTO - convertir explícitamente a entero
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### Error 4: Inyección de Segundo Orden

```php
// Los datos de la base de datos NO son automáticamente seguros
$userData = $itemHandler->get($id);
$username = $userData->getVar('username');

// INCORRECTO - confiar en datos de la base de datos
$sql = "SELECT * FROM log WHERE username = '" . $username . "'";

// CORRECTO - siempre usar parámetros
$sql = "SELECT * FROM log WHERE username = ?";
$result = $xoopsDB->query($sql, [$username]);
```

## Pruebas de Seguridad

### Probar sus Consultas

Pruebe sus formularios con estas entradas para verificar inyección SQL:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Si alguno de estos causa comportamiento inesperado o errores, tiene una vulnerabilidad.

### Pruebas Automatizadas

Use herramientas automatizadas de prueba de inyección SQL durante el desarrollo:

- SQLMap
- Burp Suite
- OWASP ZAP

## Resumen de Mejores Prácticas

1. **Siempre usar consultas parametrizadas** (sentencias preparadas)
2. **Usar XoopsObject/XoopsObjectHandler** cuando sea posible
3. **Usar clases Criteria** para construir consultas
4. **Validar contra lista blanca** para columnas y nombres de tabla
5. **Convertir valores numéricos** explícitamente con `(int)` o `(float)`
6. **Nunca exponer errores de base de datos** a los usuarios
7. **Usar transacciones** para múltiples consultas relacionadas
8. **Probar inyección SQL** durante el desarrollo
9. **Escapar comodines LIKE** en consultas de búsqueda
10. **Sanitizar valores de cláusula IN** individualmente

---

#security #sql-injection #database #xoops #prepared-statements #Criteria
