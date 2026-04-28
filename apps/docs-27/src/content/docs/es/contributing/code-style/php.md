---
title: "Estándares de Codificación PHP"
description: "Estándares de codificación PHP de XOOPS basados en PSR-1, PSR-4 y PSR-12"
---

# Estándares-PHP

> XOOPS sigue estándares de codificación PSR-1, PSR-4 y PSR-12 con convenciones específicas de XOOPS.

---

## Resumen de Estándares

```mermaid
graph TB
    subgraph "Estándares PSR"
        A[PSR-1: Codificación Básica]
        B[PSR-4: Autocarga]
        C[PSR-12: Estilo Extendido]
    end

    subgraph "Convenciones XOOPS"
        D[Patrones de Nombres]
        E[Organización de Archivos]
        F[Documentación]
    end

    A --> G[Código Limpio]
    B --> G
    C --> G
    D --> G
    E --> G
    F --> G
```

---

## Estructura de Archivos

### Etiquetas PHP

```php
<?php
// Siempre usar etiquetas PHP completas, nunca etiquetas cortas
// Omitir etiqueta de cierre ?> en archivos PHP puros

declare(strict_types=1);

namespace XoopsModules\MyModule;

// Código aquí...
```

### Encabezado de Archivo

```php
<?php

declare(strict_types=1);

/**
 * XOOPS - PHP Content Management System
 *
 * @package    XoopsModules\MyModule
 * @subpackage Class
 * @author     Your Name <email@example.com>
 * @copyright  2026 XOOPS Project
 * @license    GPL-2.0-or-later
 * @link       https://xoops.org
 */

namespace XoopsModules\MyModule;

use XoopsObject;
use XoopsPersistableObjectHandler;
```

---

## Convenciones de Nombres

### Clases

```php
// PascalCase para nombres de clase
class ItemHandler extends XoopsPersistableObjectHandler
{
    // ...
}

// Las interfaces terminan con "Interface"
interface RepositoryInterface
{
    public function find(int $id): ?object;
}

// Los traits terminan con "Trait"
trait TimestampTrait
{
    public function getCreatedAt(): \DateTimeInterface
    {
        // ...
    }
}

// Las clases abstractas tienen prefijo "Abstract"
abstract class AbstractEntity
{
    // ...
}
```

### Métodos y Funciones

```php
// camelCase para métodos
public function getActiveItems(): array
{
    // ...
}

// Verbos para métodos de acción
public function createItem(array $data): Item
public function updateItem(int $id, array $data): bool
public function deleteItem(int $id): bool
public function findById(int $id): ?Item
public function hasPermission(string $permission): bool
public function isActive(): bool
public function canEdit(): bool
```

### Variables y Propiedades

```php
class Item
{
    // camelCase para propiedades
    private int $itemId;
    private string $itemTitle;
    private bool $isPublished;
    private array $categoryIds;

    // camelCase para variables
    public function process(): void
    {
        $itemCount = 0;
        $activeItems = [];
        $isValid = true;
    }
}
```

### Constantes

```php
// UPPER_SNAKE_CASE para constantes
class Config
{
    public const DEFAULT_ITEMS_PER_PAGE = 10;
    public const MAX_UPLOAD_SIZE = 10485760;
    public const CACHE_LIFETIME = 3600;
}

// O en llamadas define()
define('XOOPS_ROOT_PATH', '/path/to/xoops');
define('MYMODULE_VERSION', '1.0.0');
```

---

## Estructura de Clase

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use XoopsDatabase;
use XoopsPersistableObjectHandler;

/**
 * Handler for Item objects
 *
 * @package XoopsModules\MyModule
 */
class ItemHandler extends XoopsPersistableObjectHandler
{
    // 1. Constantes
    public const TABLE_NAME = 'mymodule_items';

    // 2. Propiedades (orden de visibilidad: public, protected, private)
    public int $defaultLimit = 10;

    protected string $table;

    private XoopsDatabase $db;

    // 3. Constructor
    public function __construct(?XoopsDatabase $db = null)
    {
        $this->db = $db ?? \XoopsDatabaseFactory::getDatabaseConnection();
        parent::__construct($this->db, self::TABLE_NAME, Item::class, 'id', 'title');
    }

    // 4. Métodos públicos
    public function getPublishedItems(int $limit = 10): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    public function findBySlug(string $slug): ?Item
    {
        $criteria = new \Criteria('slug', $slug);
        $items = $this->getObjects($criteria);

        return $items[0] ?? null;
    }

    // 5. Métodos protegidos
    protected function validateItem(Item $item): bool
    {
        // Lógica de validación
        return true;
    }

    // 6. Métodos privados
    private function sanitizeInput(string $input): string
    {
        return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
}
```

---

## Reglas de Formato

### Indentación y Espaciado

```php
// Usar 4 espacios para indentación (no tabulaciones)
class Example
{
    public function method(): void
    {
        if ($condition) {
            // 4 espacios
            foreach ($items as $item) {
                // 8 espacios
                $this->process($item);
            }
        }
    }
}

// Una línea en blanco entre métodos
public function methodOne(): void
{
    // ...
}

public function methodTwo(): void
{
    // ...
}

// Sin espacios en blanco al final
// Los archivos terminan con una sola nueva línea
```

### Longitud de Línea

```php
// Máximo 120 caracteres por línea
// Romper líneas largas lógicamente

// Llamadas de método largas
$result = $this->someHandler->processComplexOperation(
    $parameter1,
    $parameter2,
    $parameter3,
    $parameter4
);

// Arrays largos
$config = [
    'option1' => 'value1',
    'option2' => 'value2',
    'option3' => 'value3',
];

// Condiciones largas
if ($condition1
    && $condition2
    && $condition3
) {
    // ...
}
```

### Estructuras de Control

```php
// if/elseif/else
if ($condition) {
    // código
} elseif ($otherCondition) {
    // código
} else {
    // código
}

// switch
switch ($value) {
    case 1:
        doSomething();
        break;

    case 2:
        doSomethingElse();
        break;

    default:
        doDefault();
        break;
}

// try/catch
try {
    $result = $this->riskyOperation();
} catch (SpecificException $e) {
    $this->handleSpecific($e);
} catch (\Exception $e) {
    $this->handleGeneral($e);
} finally {
    $this->cleanup();
}

// foreach
foreach ($items as $key => $value) {
    // código
}

// for
for ($i = 0; $i < $count; $i++) {
    // código
}
```

---

## Declaraciones de Tipo

```php
<?php

declare(strict_types=1);

class TypeExample
{
    // Tipos de propiedad (PHP 7.4+)
    private int $id;
    private string $title;
    private ?string $description = null;
    private array $tags = [];
    private bool $isActive = false;

    // Constructor con parámetros tipados
    public function __construct(
        int $id,
        string $title,
        ?string $description = null
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
    }

    // Declaraciones de tipo de retorno
    public function getId(): int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    // Tipo de retorno nullable
    public function getDescription(): ?string
    {
        return $this->description;
    }

    // Tipos unión (PHP 8.0+)
    public function getValue(): int|string
    {
        return $this->value;
    }

    // Tipo de retorno void
    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    // Retorno de array con docblock para contenidos
    /**
     * @return Item[]
     */
    public function getItems(): array
    {
        return $this->items;
    }
}
```

---

## Documentación

### DocBlock de Clase

```php
/**
 * Handles CRUD operations for Article entities
 *
 * This handler provides methods for creating, reading, updating,
 * and deleting articles in the database.
 *
 * @package    XoopsModules\Publisher
 * @subpackage Handler
 * @author     XOOPS Development Team
 * @since      1.0.0
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
```

### DocBlock de Método

```php
/**
 * Retrieve articles by category
 *
 * Fetches published articles belonging to a specific category,
 * ordered by creation date descending.
 *
 * @param int  $categoryId Category identifier
 * @param int  $limit      Maximum articles to return
 * @param int  $offset     Starting offset for pagination
 * @param bool $published  Only return published articles
 *
 * @return Article[] Array of Article objects
 *
 * @throws \InvalidArgumentException If category ID is invalid
 *
 * @since 1.0.0
 */
public function getByCategory(
    int $categoryId,
    int $limit = 10,
    int $offset = 0,
    bool $published = true
): array {
```

---

## Configuración de Herramientas

### PHP CS Fixer

```php
// .php-cs-fixer.php
<?php

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__ . '/class')
    ->in(__DIR__ . '/src');

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        'array_syntax' => ['syntax' => 'short'],
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'no_unused_imports' => true,
        'declare_strict_types' => true,
    ])
    ->setFinder($finder);
```

### PHPStan

```yaml
# phpstan.neon
parameters:
    level: 6
    paths:
        - class/
        - src/
    ignoreErrors:
        - '#Call to an undefined method XoopsObject::#'
```

---

## Documentación Relacionada

- Estándares JavaScript
- Organización de Código
- Directrices de Pull Request

---

#xoops #php #coding-standards #psr #best-practices
