---
title: "Clase XoopsObject"
description: "Clase base para todos los objetos de datos en el sistema XOOPS que proporciona gestión de propiedades, validación y serialización"
---

La clase `XoopsObject` es la clase base fundamental para todos los objetos de datos en el sistema XOOPS. Proporciona una interfaz estandarizada para gestionar propiedades de objetos, validación, seguimiento de cambios y serialización.

## Descripción General de la Clase

```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```

## Jerarquía de Clases

```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Custom Module Objects]
```

## Propiedades

| Propiedad | Tipo | Visibilidad | Descripción |
|----------|------|------------|-------------|
| `$vars` | array | protected | Almacena definiciones y valores de variables |
| `$cleanVars` | array | protected | Almacena valores desinfectados para operaciones de base de datos |
| `$isNew` | bool | protected | Indica si el objeto es nuevo (aún no en la base de datos) |
| `$errors` | array | protected | Almacena mensajes de validación y error |

## Constructor

```php
public function __construct()
```

Crea una nueva instancia de XoopsObject. El objeto se marca como nuevo de forma predeterminada.

**Ejemplo:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## Métodos Principales

### initVar

Inicializa una definición de variable para el objeto.

```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$key` | string | Nombre de la variable |
| `$dataType` | int | Constante de tipo de datos (ver Tipos de Datos) |
| `$value` | mixed | Valor por defecto |
| `$required` | bool | Si el campo es obligatorio |
| `$maxlength` | int | Longitud máxima para tipos de cadena |
| `$options` | string | Opciones adicionales |

**Tipos de Datos:**

| Constante | Valor | Descripción |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Entrada de cuadro de texto |
| `XOBJ_DTYPE_TXTAREA` | 2 | Contenido de textarea |
| `XOBJ_DTYPE_INT` | 3 | Valor entero |
| `XOBJ_DTYPE_URL` | 4 | Cadena de URL |
| `XOBJ_DTYPE_EMAIL` | 5 | Dirección de correo electrónico |
| `XOBJ_DTYPE_ARRAY` | 6 | Matriz serializada |
| `XOBJ_DTYPE_OTHER` | 7 | Tipo personalizado |
| `XOBJ_DTYPE_SOURCE` | 8 | Código fuente |
| `XOBJ_DTYPE_STIME` | 9 | Formato de tiempo corto |
| `XOBJ_DTYPE_MTIME` | 10 | Formato de tiempo medio |
| `XOBJ_DTYPE_LTIME` | 11 | Formato de tiempo largo |
| `XOBJ_DTYPE_FLOAT` | 12 | Punto flotante |
| `XOBJ_DTYPE_DECIMAL` | 13 | Número decimal |
| `XOBJ_DTYPE_ENUM` | 14 | Enumeración |

**Ejemplo:**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```

---

### setVar

Establece el valor de una variable.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$key` | string | Nombre de la variable |
| `$value` | mixed | Valor a establecer |
| `$notGpc` | bool | Si es verdadero, el valor no proviene de GET/POST/COOKIE |

**Retorna:** `bool` - Verdadero si es exitoso, falso de lo contrario

**Ejemplo:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### getVar

Recupera el valor de una variable con formato opcional.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$key` | string | Nombre de la variable |
| `$format` | string | Formato de salida |

**Opciones de Formato:**

| Formato | Descripción |
|--------|-------------|
| `'s'` | Mostrar - Entidades HTML escapadas para mostrar |
| `'e'` | Editar - Para valores de entrada de formulario |
| `'p'` | Vista previa - Similar a mostrar |
| `'f'` | Datos de formulario - Sin procesar para procesamiento de formulario |
| `'n'` | Ninguno - Valor sin procesar, sin formato |

**Retorna:** `mixed` - El valor formateado

**Ejemplo:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (for input value)
echo $object->getVar('title', 'n'); // "Hello <World>" (raw)

// For array data types
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Returns array
```

---

### setVars

Establece múltiples variables de una vez desde una matriz.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$values` | array | Matriz asociativa de pares clave => valor |
| `$notGpc` | bool | Si es verdadero, los valores no provienen de GET/POST/COOKIE |

**Ejemplo:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// From database (not user input)
$object->setVars($row, true);
```

---

### getValues

Recupera todos los valores de las variables.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$keys` | array | Claves específicas a recuperar (nulo para todas) |
| `$format` | string | Formato de salida |
| `$maxDepth` | int | Profundidad máxima para objetos anidados |

**Retorna:** `array` - Matriz asociativa de valores

**Ejemplo:**
```php
$object = new MyObject();

// Get all values
$allValues = $object->getValues();

// Get specific values
$subset = $object->getValues(['title', 'status']);

// Get raw values for database
$rawValues = $object->getValues(null, 'n');
```

---

### assignVar

Asigna un valor directamente sin validación (usar con cuidado).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `$key` | string | Nombre de la variable |
| `$value` | mixed | Valor a asignar |

**Ejemplo:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

Desinfecta todas las variables para operaciones de base de datos.

```php
public function cleanVars(): bool
```

**Retorna:** `bool` - Verdadero si todas las variables son válidas

**Ejemplo:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Variables are sanitized and ready for database
    $cleanData = $object->cleanVars;
} else {
    // Validation errors occurred
    $errors = $object->getErrors();
}
```

---

### isNew

Comprueba o establece si el objeto es nuevo.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Ejemplo:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Métodos de Manejo de Errores

### setErrors

Agrega un mensaje de error.

```php
public function setErrors(string|array $error): void
```

**Ejemplo:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

Recupera todos los mensajes de error.

```php
public function getErrors(): array
```

**Ejemplo:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

Devuelve errores formateados como HTML.

```php
public function getHtmlErrors(): string
```

**Ejemplo:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Métodos de Utilidad

### toArray

Convierte el objeto a una matriz.

```php
public function toArray(): array
```

**Ejemplo:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

Devuelve las definiciones de variables.

```php
public function getVars(): array
```

**Ejemplo:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Ejemplo de Uso Completo

```php
<?php
/**
 * Custom Article Object
 */
class Article extends XoopsObject
{
    /**
     * Constructor - Initialize all variables
     */
    public function __construct()
    {
        parent::__construct();

        // Primary key
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Required fields
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Optional fields
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Timestamps
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Status flags
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadata as array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Get formatted creation date
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Check if article is published
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Increment view counter
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Custom validation
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Title validation
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Author validation
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Usage
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Save to database via handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```

## Mejores Prácticas

1. **Siempre Inicialice Variables**: Defina todas las variables en el constructor usando `initVar()`

2. **Use Tipos de Datos Apropiados**: Elija la constante `XOBJ_DTYPE_*` correcta para validación

3. **Maneje la Entrada del Usuario con Cuidado**: Use `setVar()` con `$notGpc = false` para entrada del usuario

4. **Valide Antes de Guardar**: Siempre llame a `cleanVars()` antes de operaciones de base de datos

5. **Use Parámetros de Formato**: Use el formato apropiado en `getVar()` para el contexto

6. **Extienda para Lógica Personalizada**: Agregue métodos específicos del dominio en subclases

## Documentación Relacionada

- XoopsObjectHandler - Patrón de controlador para persistencia de objetos
- ../Database/Criteria - Construcción de consultas con Criteria
- ../Database/XoopsDatabase - Operaciones de base de datos

---

*Ver también: [Código Fuente XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
