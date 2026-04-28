---
title: "Criteria und CriteriaCompo Klassen"
description: "Abfragebau und erweiterte Filterung mit Criteria-Klassen"
---

Die `Criteria` und `CriteriaCompo` Klassen bieten eine fließende, objektorientierte Schnittstelle zum Erstellen komplexer Datenbankabfragen. Diese Klassen abstrahieren SQL WHERE-Klauseln und ermöglichen Entwicklern das sichere und lesbare Konstruieren dynamischer Abfragen.

## Klassenübersicht

### Criteria Klasse

Die `Criteria` Klasse stellt eine einzelne Bedingung in einer WHERE-Klausel dar:

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

## Grundlegende Verwendung

### Einfache Criteria

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Einfache Bedingung
$criteria = new Criteria('status', 'active');
// Rendert: `status` = 'active'
```

### Verschiedene Operatoren

```php
// Gleichheit (Standard)
$criteria = new Criteria('status', 'active', '=');

// Nicht gleich
$criteria = new Criteria('status', 'active', '<>');

// Größer als
$criteria = new Criteria('age', 18, '>');

// Kleiner als oder gleich
$criteria = new Criteria('age', 65, '<=');

// LIKE (für Mustererkennung)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (für mehrere Werte)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## Komplexe Abfragen erstellen

### UND-Logik (Standard)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Rendert: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### ODER-Logik

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Integration mit Repository-Muster

### Repository-Beispiel

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

## Sicherheit und Escaping

### Automatisches Escaping

Die `Criteria` Klasse escaped Werte automatisch, um SQL-Injection zu verhindern:

```php
// Sicher - Wert wird automatisch escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Rendert sicher: `username` = '\''; DROP TABLE users; --'
```

## API-Referenz

### Criteria-Methoden

| Methode | Beschreibung | Rückgabewert |
|--------|-------------|--------|
| `__construct()` | Initialize a criteria condition | void |
| `render($prefix = '')` | Render to SQL WHERE clause segment | string |
| `getColumn()` | Get the column name | string |
| `getValue()` | Get the comparison value | mixed |
| `getOperator()` | Get the comparison operator | string |

### CriteriaCompo-Methoden

| Methode | Beschreibung | Rückgabewert |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Initialize composite criteria | void |
| `add($criteria, $logic = null)` | Add criteria or nested composite | void |
| `render($prefix = '')` | Render to complete WHERE clause | string |
| `count()` | Get number of criteria | int |
| `clear()` | Remove all criteria | void |

## Zugehörige Dokumentation

- XoopsDatabase - Datenbankklassen-Referenz
- ../../03-Module-Development/Patterns/Repository-Pattern - Repository-Muster in XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Service-Layer-Muster

## Versionsinformation

- **Eingeführt:** XOOPS 2.5.0
- **Zuletzt aktualisiert:** XOOPS 4.0
- **Kompatibilität:** PHP 7.4+
