---
title: "Clase XoopsObjectHandler"
description: "Clase controladora base para operaciones CRUD en instancias de XoopsObject con persistencia de base de datos"
---

La clase `XoopsObjectHandler` y su extensión `XoopsPersistableObjectHandler` proporcionan una interfaz estandarizada para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en instancias de `XoopsObject`. Esto implementa el patrón Data Mapper, separando la lógica del dominio del acceso a la base de datos.

## Descripción General de la Clase

```php
namespace Xoops\Core;

abstract class XoopsObjectHandler
{
    protected XoopsDatabase $db;

    public function __construct(XoopsDatabase $db);
    abstract public function create(bool $isNew = true);
    abstract public function get(int $id);
    abstract public function insert(XoopsObject $obj, bool $force = false): bool;
    abstract public function delete(XoopsObject $obj, bool $force = false): bool;
}
```

## Jerarquía de Clases

```
XoopsObjectHandler (Abstract Base)
└── XoopsPersistableObjectHandler (Extended Implementation)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Custom Module Handlers]
```

## XoopsObjectHandler

### Constructor

```php
public function __construct(XoopsDatabase $db)
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Instancia de conexión de base de datos |

**Ejemplo:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### create

Crea una nueva instancia de objeto.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$isNew` | bool | Si el objeto es nuevo (predeterminado: true) |

**Retorna:** `XoopsObject|null` - Nueva instancia de objeto

**Ejemplo:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### get

Recupera un objeto por su clave principal.

```php
abstract public function get(int $id): ?XoopsObject
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$id` | int | Valor de clave principal |

**Retorna:** `XoopsObject|null` - Instancia de objeto o nulo si no se encuentra

**Ejemplo:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### insert

Guarda un objeto en la base de datos (insertar o actualizar).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$obj` | XoopsObject | Objeto a guardar |
| `$force` | bool | Forzar operación aunque el objeto no haya cambiado |

**Retorna:** `bool` - Verdadero si es exitoso

**Ejemplo:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'testuser');
$user->setVar('email', 'test@example.com');

if ($handler->insert($user)) {
    echo "User saved with ID: " . $user->getVar('uid');
} else {
    echo "Save failed: " . implode(', ', $user->getErrors());
}
```

---

### delete

Elimina un objeto de la base de datos.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$obj` | XoopsObject | Objeto a eliminar |
| `$force` | bool | Forzar eliminación |

**Retorna:** `bool` - Verdadero si es exitoso

**Ejemplo:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

El `XoopsPersistableObjectHandler` extiende `XoopsObjectHandler` con métodos adicionales para consultas y operaciones en lote.

### Constructor

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Conexión de base de datos |
| `$table` | string | Nombre de tabla (sin prefijo) |
| `$className` | string | Nombre de clase completo del objeto |
| `$keyName` | string | Nombre del campo de clave principal |
| `$identifierName` | string | Campo identificador legible por humanos |

**Ejemplo:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Table name
            'Article',               // Class name
            'article_id',            // Primary key
            'title'                  // Identifier field
        );
    }
}
```

---

### getObjects

Recupera múltiples objetos que coinciden con los criterios.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Criterios de consulta (opcional) |
| `$idAsKey` | bool | Usar clave principal como clave de matriz |
| `$asObject` | bool | Devolver objetos (verdadero) o matrices (falso) |

**Retorna:** `array` - Matriz de objetos o matrices asociativas

**Ejemplo:**
```php
$handler = xoops_getHandler('user');

// Get all active users
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Get users with ID as key
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Access by ID

// Get as arrays instead of objects
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### getCount

Cuenta los objetos que coinciden con los criterios.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Criterios de consulta (opcional) |

**Retorna:** `int` - Número de objetos coincidentes

**Ejemplo:**
```php
$handler = xoops_getHandler('user');

// Count all users
$totalUsers = $handler->getCount();

// Count active users
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```

---

### getAll

Recupera todos los objetos (alias para getObjects sin criterios).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Criterios de consulta |
| `$fields` | array | Campos específicos a recuperar |
| `$asObject` | bool | Devolver como objetos |
| `$idAsKey` | bool | Usar ID como clave de matriz |

**Ejemplo:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

Recupera solo las claves principales de los objetos coincidentes.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Criterios de consulta |

**Retorna:** `array` - Matriz de valores de clave principal

**Ejemplo:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

### getList

Recupera una lista clave-valor para desplegables.

```php
public function getList(CriteriaElement $criteria = null): array
```

**Retorna:** `array` - Matriz asociativa [id => identifier]

**Ejemplo:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### deleteAll

Elimina todos los objetos que coinciden con los criterios.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Criterios para objetos a eliminar |
| `$force` | bool | Forzar eliminación |
| `$asObject` | bool | Cargar objetos antes de eliminar (dispara eventos) |

**Retorna:** `bool` - Verdadero si es exitoso

**Ejemplo:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

### updateAll

Actualiza un valor de campo para todos los objetos coincidentes.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$fieldname` | string | Campo a actualizar |
| `$fieldvalue` | mixed | Nuevo valor |
| `$criteria` | CriteriaElement | Criterios para objetos a actualizar |
| `$force` | bool | Forzar actualización |

**Retorna:** `bool` - Verdadero si es exitoso

**Ejemplo:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Mark all articles by an author as draft
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Update view count
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### insert (Extendido)

El método insert extendido con funcionalidad adicional.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Comportamiento:**
- Si el objeto es nuevo (`isNew() === true`): INSERT
- Si el objeto existe (`isNew() === false`): UPDATE
- Llama a `cleanVars()` automáticamente
- Establece ID de incremento automático en objetos nuevos

**Ejemplo:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Create new article
$article = $handler->create();
$article->setVar('title', 'New Article');
$article->setVar('content', 'Content here');
$handler->insert($article);
echo "Created with ID: " . $article->getVar('article_id');

// Update existing article
$article = $handler->get(5);
$article->setVar('title', 'Updated Title');
$handler->insert($article);
```

---

## Funciones de Ayuda

### xoops_getHandler

Función global para recuperar un controlador principal.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$name` | string | Nombre del controlador (usuario, módulo, grupo, etc.) |
| `$optional` | bool | Devolver nulo en lugar de generar error |

**Ejemplo:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

Recupera un controlador específico del módulo.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$name` | string | Nombre del controlador |
| `$dirname` | string | Nombre del directorio del módulo |
| `$optional` | bool | Devolver nulo si falla |

**Ejemplo:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Creación de Controladores Personalizados

### Implementación Básica del Controlador

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Handler for Article objects
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * Constructor
     */
    public function __construct(XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',
            Article::class,
            'article_id',
            'title'
        );
    }

    /**
     * Get published articles
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->add(new Criteria('publish_date', time(), '<='));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by author
     */
    public function getByAuthor(int $authorId, bool $publishedOnly = true): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('author_id', $authorId));

        if ($publishedOnly) {
            $criteria->add(new Criteria('published', 1));
        }

        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by category
     */
    public function getByCategory(int $categoryId, int $limit = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('category_id', $categoryId));
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        if ($limit > 0) {
            $criteria->setLimit($limit);
        }

        return $this->getObjects($criteria);
    }

    /**
     * Search articles
     */
    public function search(string $query, array $fields = ['title', 'content']): array
    {
        $criteria = new CriteriaCompo();
        $searchCriteria = new CriteriaCompo();

        foreach ($fields as $field) {
            $searchCriteria->add(
                new Criteria($field, '%' . $query . '%', 'LIKE'),
                'OR'
            );
        }

        $criteria->add($searchCriteria);
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Get popular articles by view count
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * Increment view count
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            "UPDATE %s SET views = views + 1 WHERE article_id = %d",
            $this->db->prefix($this->table),
            $articleId
        );

        return $this->db->queryF($sql) !== false;
    }

    /**
     * Override insert for custom behavior
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // Set updated timestamp
        $obj->setVar('updated', time());

        // If new, set created timestamp
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * Override delete for cascade operations
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // Delete associated comments
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### Uso del Controlador Personalizado

```php
// Get the handler
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Create a new article
$article = $articleHandler->create();
$article->setVars([
    'title' => 'My New Article',
    'content' => 'Article content here...',
    'author_id' => $xoopsUser->getVar('uid'),
    'category_id' => 1,
    'published' => 1,
    'publish_date' => time()
]);

if ($articleHandler->insert($article)) {
    redirect_header('article.php?id=' . $article->getVar('article_id'), 2, 'Article created');
}

// Get published articles
$articles = $articleHandler->getPublished(10);

// Search articles
$results = $articleHandler->search('xoops');

// Get popular articles
$popular = $articleHandler->getPopular(5);

// Update view count
$articleHandler->incrementViews($articleId);
```

## Mejores Prácticas

1. **Use Criteria para Consultas**: Siempre use objetos Criteria para consultas de tipo seguro

2. **Extienda para Métodos Personalizados**: Agregue métodos de consulta específicos del dominio a los controladores

3. **Anule insert/delete**: Agregue operaciones en cascada y marcas de tiempo en anulaciones

4. **Use Transacciones Cuando Sea Necesario**: Envuelva operaciones complejas en transacciones

5. **Aproveche getList**: Use `getList()` para desplegables de selección para reducir consultas

6. **Indexar Claves**: Asegúrese de que los campos de base de datos utilizados en criterios estén indexados

7. **Limitar Resultados**: Siempre use `setLimit()` para conjuntos de resultados potencialmente grandes

## Documentación Relacionada

- XoopsObject - Clase de objeto base
- ../Database/Criteria - Construcción de criterios de consulta
- ../Database/XoopsDatabase - Operaciones de base de datos

---

*Ver también: [Código Fuente XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
