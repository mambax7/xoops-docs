---
title: "Kriterier og CriteriaCompo-klasser"
description: "Forespørgselsopbygning og avanceret filtrering ved hjælp af Criteria-klasser"
---

Klasserne `Criteria` og `CriteriaCompo` giver en flydende, objektorienteret grænseflade til opbygning af komplekse databaseforespørgsler. Disse klasser abstraherer SQL WHERE-klausuler, hvilket giver udviklere mulighed for at konstruere dynamiske forespørgsler sikkert og læsbart.

## Klasseoversigt

### Kriterieklasse

Klassen `Criteria` repræsenterer en enkelt betingelse i en WHERE-sætning:

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

## Grundlæggende brug

### Simple kriterier

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### Forskellige operatører

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

## Bygning af komplekse forespørgsler

### AND logik (standard)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### ELLER Logik

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Integration med Repository Pattern

### Eksempel på lager

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

## Sikkerhed og sikkerhed

### Automatisk escape

Klassen `Criteria` undslipper automatisk værdier for at forhindre SQL-injektion:

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## API Reference

### Kriterier Metoder

| Metode | Beskrivelse | Retur |
|--------|-------------|--------|
| `__construct()` | Initialiser en kriteriebetingelse | ugyldig |
| `render($prefix = '')` | Gengiv til SQL WHERE klausulsegment | streng |
| `getColumn()` | Hent kolonnenavnet | streng |
| `getValue()` | Få sammenligningsværdien | blandet |
| `getOperator()` | Hent sammenligningsoperatoren | streng |

### CriteriaCompo metoder

| Metode | Beskrivelse | Retur |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Initialiser sammensatte kriterier | ugyldig |
| `add($criteria, $logic = null)` | Tilføj kriterier eller indlejret sammensat | ugyldig |
| `render($prefix = '')` | Gengiv for at fuldføre WHERE-klausul | streng |
| `count()` | Få antal kriterier | int |
| `clear()` | Fjern alle kriterier | ugyldig |

## Relateret dokumentation

- XoopsDatabase - Database klasse reference
- ../../03-Module-Development/Patterns/Repository-Pattern - Opbevaringsmønster i XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Servicelagsmønster

## Versionsoplysninger

- **Introduceret:** XOOPS 2.5.0
- **Sidst opdateret:** XOOPS 4.0
- **Kompatibilitet:** PHP 7.4+
