---
title: "Clase XoopsDatabase"
description: "Capa de abstracción de base de datos que proporciona gestión de conexiones, ejecución de consultas y manejo de resultados"
---

La clase `XoopsDatabase` proporciona una capa de abstracción de base de datos para XOOPS, manejando la gestión de conexiones, la ejecución de consultas, el procesamiento de resultados y el manejo de errores. Admite múltiples controladores de base de datos a través de una arquitectura de controladores.

## Descripción General de la Clase

```php
namespace Xoops\Database;

abstract class XoopsDatabase
{
    protected $conn;
    protected $prefix;
    protected $logger;

    abstract public function connect(bool $selectdb = true): bool;
    abstract public function query(string $sql, int $limit = 0, int $start = 0);
    abstract public function fetchArray($result): ?array;
    abstract public function fetchObject($result): ?object;
    abstract public function getRowsNum($result): int;
    abstract public function getAffectedRows(): int;
    abstract public function getInsertId(): int;
    abstract public function escape(string $string): string;
}
```

## Jerarquía de Clases

```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```

## Obtención de una Instancia de Base de Datos

### Usando la Factory

```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### Usando getInstance

```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```

### Variable Global

```php
// Legacy: Use global variable
global $xoopsDB;
```

## Métodos Principales

### connect

Establece una conexión de base de datos.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$selectdb` | bool | Si se debe seleccionar la base de datos |

**Retorna:** `bool` - Verdadero en conexión exitosa

**Ejemplo:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### query

Ejecuta una consulta SQL.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$sql` | string | Cadena de consulta SQL |
| `$limit` | int | Máximo de filas a devolver (0 = sin límite) |
| `$start` | int | Desplazamiento inicial |

**Retorna:** `resource|bool` - Recurso de resultado o falso en caso de error

**Ejemplo:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// Simple query
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid > 0";
$result = $db->query($sql);

// Query with limit
$sql = "SELECT * FROM " . $db->prefix('users');
$result = $db->query($sql, 10, 0); // First 10 rows

// Query with offset
$result = $db->query($sql, 10, 20); // 10 rows starting at row 20
```

---

### queryF

Ejecuta una consulta forzando la operación (omite comprobaciones de seguridad).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Casos de Uso:**
- Operaciones INSERT, UPDATE, DELETE
- Cuando necesita omitir restricciones de solo lectura

**Ejemplo:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### prefix

Antepone el prefijo de tabla de base de datos.

```php
public function prefix(string $table = ''): string
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$table` | string | Nombre de tabla sin prefijo |

**Retorna:** `string` - Nombre de tabla con prefijo

**Ejemplo:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

### fetchArray

Obtiene una fila de resultado como matriz asociativa.

```php
abstract public function fetchArray($result): ?array
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$result` | resource | Recurso de resultado de consulta |

**Retorna:** `array|null` - Matriz asociativa o nulo si no hay más filas

**Ejemplo:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```

---

### fetchObject

Obtiene una fila de resultado como objeto.

```php
abstract public function fetchObject($result): ?object
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$result` | resource | Recurso de resultado de consulta |

**Retorna:** `object|null` - Objeto con propiedades para cada columna

**Ejemplo:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

### fetchRow

Obtiene una fila de resultado como matriz numérica.

```php
abstract public function fetchRow($result): ?array
```

**Ejemplo:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### fetchBoth

Obtiene una fila de resultado como matriz asociativa y numérica.

```php
abstract public function fetchBoth($result): ?array
```

**Ejemplo:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

### getRowsNum

Obtiene el número de filas en un conjunto de resultados.

```php
abstract public function getRowsNum($result): int
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$result` | resource | Recurso de resultado de consulta |

**Retorna:** `int` - Número de filas

**Ejemplo:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### getAffectedRows

Obtiene el número de filas afectadas por la última consulta.

```php
abstract public function getAffectedRows(): int
```

**Retorna:** `int` - Número de filas afectadas

**Ejemplo:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### getInsertId

Obtiene el ID generado automáticamente del último INSERT.

```php
abstract public function getInsertId(): int
```

**Retorna:** `int` - ID del último insert

**Ejemplo:**
```php
$sql = sprintf(
    "INSERT INTO %s (title, content) VALUES (%s, %s)",
    $db->prefix('articles'),
    $db->quoteString($title),
    $db->quoteString($content)
);
$db->queryF($sql);
$newId = $db->getInsertId();
echo "Created article with ID: $newId";
```

---

### escape

Escapa una cadena para uso seguro en consultas SQL.

```php
abstract public function escape(string $string): string
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$string` | string | Cadena a escapar |

**Retorna:** `string` - Cadena escapada (sin comillas)

**Ejemplo:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

Escapa y cita una cadena para SQL.

```php
public function quoteString(string $string): string
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$string` | string | Cadena a citar |

**Retorna:** `string` - Cadena escapada y citada

**Ejemplo:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

Libera la memoria asociada con un resultado.

```php
abstract public function freeRecordSet($result): void
```

**Ejemplo:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## Manejo de Errores

### error

Obtiene el último mensaje de error.

```php
abstract public function error(): string
```

**Ejemplo:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### errno

Obtiene el último número de error.

```php
abstract public function errno(): int
```

**Ejemplo:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## Sentencias Preparadas (MySQLi)

El controlador MySQLi admite sentencias preparadas para mayor seguridad.

### prepare

Crea una sentencia preparada.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**Ejemplo:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = ?";
$stmt = $db->prepare($sql);

$stmt->bind_param('i', $userId);
$userId = 5;
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    echo $row['uname'];
}
$stmt->close();
```

### Sentencia Preparada con Múltiples Parámetros

```php
$sql = "INSERT INTO " . $db->prefix('articles') . " (title, content, author_id) VALUES (?, ?, ?)";
$stmt = $db->prepare($sql);

$stmt->bind_param('ssi', $title, $content, $authorId);

$title = "My Article";
$content = "Article content here";
$authorId = 1;

if ($stmt->execute()) {
    echo "Article created with ID: " . $stmt->insert_id;
}

$stmt->close();
```

---

## Soporte de Transacciones

### beginTransaction

Inicia una transacción.

```php
public function beginTransaction(): bool
```

### commit

Confirma la transacción actual.

```php
public function commit(): bool
```

### rollback

Revierte la transacción actual.

```php
public function rollback(): bool
```

**Ejemplo:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

try {
    $db->beginTransaction();

    // Multiple operations
    $sql1 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance - 100 WHERE id = 1";
    $db->queryF($sql1);

    $sql2 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance + 100 WHERE id = 2";
    $db->queryF($sql2);

    // Check for errors
    if ($db->errno()) {
        throw new Exception($db->error());
    }

    $db->commit();
    echo "Transaction completed";

} catch (Exception $e) {
    $db->rollback();
    echo "Transaction failed: " . $e->getMessage();
}
```

---

## Ejemplos de Uso Completo

### Operaciones CRUD Básicas

```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// CREATE
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('articles'),
    $db->quoteString('New Article'),
    $db->quoteString('Article content'),
    time()
);
$db->queryF($sql);
$articleId = $db->getInsertId();

// READ
$sql = "SELECT * FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$result = $db->query($sql);
$article = $db->fetchArray($result);

// UPDATE
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('articles'),
    $db->quoteString('Updated Title'),
    time(),
    $articleId
);
$db->queryF($sql);

// DELETE
$sql = "DELETE FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$db->queryF($sql);
```

### Consulta de Paginación

```php
function getArticles(int $page = 1, int $perPage = 10): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();
    $start = ($page - 1) * $perPage;

    // Get total count
    $sql = "SELECT COUNT(*) as total FROM " . $db->prefix('articles') . " WHERE published = 1";
    $result = $db->query($sql);
    $row = $db->fetchArray($result);
    $total = $row['total'];

    // Get page of results
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE published = 1 ORDER BY created DESC";
    $result = $db->query($sql, $perPage, $start);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return [
        'articles' => $articles,
        'total' => $total,
        'pages' => ceil($total / $perPage),
        'current' => $page
    ];
}
```

### Consulta de Búsqueda con LIKE

```php
function searchArticles(string $keyword): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $keyword = $db->escape($keyword);
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE title LIKE '%" . $keyword . "%'" .
           " OR content LIKE '%" . $keyword . "%'" .
           " ORDER BY created DESC";

    $result = $db->query($sql, 50);  // Limit to 50 results

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

### Consulta de Unión

```php
function getArticlesWithAuthors(): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $sql = "SELECT a.*, u.uname as author_name, u.email as author_email
            FROM " . $db->prefix('articles') . " a
            LEFT JOIN " . $db->prefix('users') . " u ON a.author_id = u.uid
            WHERE a.published = 1
            ORDER BY a.created DESC";

    $result = $db->query($sql, 20);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

---

## Clase SqlUtility

Clase auxiliar para operaciones de archivos SQL.

### splitMySqlFile

Divide un archivo SQL en consultas individuales.

```php
public static function splitMySqlFile(string $content): array
```

**Ejemplo:**
```php
$sqlContent = file_get_contents('install.sql');
$queries = SqlUtility::splitMySqlFile($sqlContent);

foreach ($queries as $query) {
    $db->queryF($query);
    if ($db->errno()) {
        echo "Error executing: " . $query . "\n";
        echo "Error: " . $db->error() . "\n";
    }
}
```

### prefixQuery

Reemplaza placeholders de tabla con nombres de tabla prefijados.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**Ejemplo:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## Mejores Prácticas

### Seguridad

1. **Siempre escape la entrada del usuario**:
```php
$safe = $db->escape($_POST['input']);
```

2. **Use sentencias preparadas cuando sea posible**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **Use quoteString para valores**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### Desempeño

1. **Siempre use LIMIT para tablas grandes**:
```php
$result = $db->query($sql, 100);  // Limit results
```

2. **Libere conjuntos de resultados cuando haya terminado**:
```php
$db->freeRecordSet($result);
```

3. **Use índices apropiados** en sus definiciones de tabla

4. **Prefiera controladores sobre SQL sin procesar** cuando sea posible

### Manejo de Errores

1. **Siempre compruebe si hay errores**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **Use transacciones para múltiples operaciones relacionadas**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## Documentación Relacionada

- Criteria - Sistema de criterios de consulta
- QueryBuilder - Construcción fluida de consultas
- ../Core/XoopsObjectHandler - Persistencia de objetos

---

*Ver también: [Código Fuente XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
