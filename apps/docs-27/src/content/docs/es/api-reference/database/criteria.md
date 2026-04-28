---
title: "Clases Criteria y CriteriaCompo"
description: "Construcción de consultas y filtrado avanzado usando clases Criteria"
---

Las clases `Criteria` y `CriteriaCompo` proporcionan una interfaz fluida orientada a objetos para construir consultas de base de datos complejas. Estas clases abstraen las cláusulas SQL WHERE, permitiendo a los desarrolladores construir consultas dinámicas de forma segura y legible.

## Descripción General de la Clase

### Clase Criteria

La clase `Criteria` representa una única condición en una cláusula WHERE:

```php
namespace Xoops\Database;

class Criteria
{
    protected $column;
    protected $operator;
    protected $value;
    protected $function;

    public function __construct(
        string $column,
        mixed $value = null,
        string $operator = '=',
        string $function = ''
    ) {}

    public function render(string $prefix = ''): string {}
}
```

## Uso Básico

### Criterios Simples

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### Diferentes Operadores

```php
// Equality (default)
$criteria = new Criteria('status', 'active', '=');

// Not equal
$criteria = new Criteria('status', 'active', '<>');

// Greater than
$criteria = new Criteria('age', 18, '>');

// Less than or equal
$criteria = new Criteria('age', 65, '<=');

// LIKE (for pattern matching)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (for multiple values)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## Construcción de Consultas Complejas

### Lógica AND (Predeterminada)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### Lógica OR

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Integración con el Patrón Repository

### Ejemplo de Repository

```php
namespace MyModule\Repository;

use Xoops\Database\XoopsDatabase;
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

class UserRepository
{
    private $db;
    private $table = 'users';

    public function __construct(XoopsDatabase $db)
    {
        $this->db = $db;
    }

    public function findByCriteria(CriteriaCompo $criteria): array
    {
        $sql = "SELECT * FROM {$this->table}";

        if ($criteria->count() > 0) {
            $sql .= " WHERE " . $criteria->render();
        }

        $result = $this->db->query($sql);
        $users = [];

        while ($row = $this->db->fetchArray($result)) {
            $users[] = new User($row);
        }

        return $users;
    }
}
```

## Seguridad y Protección

### Escapado Automático

La clase `Criteria` escapa automáticamente los valores para prevenir inyección SQL:

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## Referencia de la API

### Métodos de Criteria

| Método | Descripción | Retorna |
|--------|-------------|--------|
| `__construct()` | Inicializar una condición de criterio | void |
| `render($prefix = '')` | Renderizar a segmento de cláusula WHERE SQL | string |
| `getColumn()` | Obtener el nombre de la columna | string |
| `getValue()` | Obtener el valor de comparación | mixed |
| `getOperator()` | Obtener el operador de comparación | string |

### Métodos de CriteriaCompo

| Método | Descripción | Retorna |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Inicializar criterios compuestos | void |
| `add($criteria, $logic = null)` | Agregar criterio o compuesto anidado | void |
| `render($prefix = '')` | Renderizar a cláusula WHERE completa | string |
| `count()` | Obtener número de criterios | int |
| `clear()` | Eliminar todos los criterios | void |

## Documentación Relacionada

- XoopsDatabase - Referencia de clase de base de datos
- ../../03-Module-Development/Patterns/Repository-Pattern - Patrón de repository en XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Patrón de capa de servicio

## Información de Versión

- **Introducido en:** XOOPS 2.5.0
- **Actualizado por última vez:** XOOPS 4.0
- **Compatibilidad:** PHP 7.4+
