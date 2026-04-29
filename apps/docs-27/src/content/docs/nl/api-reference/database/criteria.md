---
title: "Criteria en CriteriaCompo-klassen"
description: "Query's bouwen en geavanceerd filteren met behulp van Criteria-klassen"
---
De klassen `Criteria` en `CriteriaCompo` bieden een vloeiende, objectgeoriënteerde interface voor het bouwen van complexe databasequery's. Deze klassen abstraheren SQL WHERE-clausules, waardoor ontwikkelaars dynamische query's veilig en leesbaar kunnen construeren.

## Klassenoverzicht

### Criteriaklasse

De klasse `Criteria` vertegenwoordigt één voorwaarde in een WHERE-clausule:

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

## Basisgebruik

### Eenvoudige criteria

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### Verschillende operators

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

## Complexe zoekopdrachten bouwen

### AND Logica (standaard)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### OF Logica

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Integratie met repositorypatroon

### Voorbeeld van opslagplaats

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

## Veiligheid en beveiliging

### Automatisch ontsnappen

De klasse `Criteria` ontsnapt automatisch aan waarden om injectie van SQL te voorkomen:

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## API-referentie

### Criteria Methoden

| Werkwijze | Beschrijving | Terug |
|--------|-------------|--------|
| `__construct()` | Initialiseer een criteriumvoorwaarde | leegte |
| `render($prefix = '')` | Renderen naar SQL WHERE clausulesegment | tekenreeks |
| `getColumn()` | Haal de kolomnaam op | tekenreeks |
| `getValue()` | De vergelijkingswaarde ophalen | gemengd |
| `getOperator()` | Verkrijg de vergelijkingsoperator | tekenreeks |

### CriteriaCompo-methoden

| Werkwijze | Beschrijving | Terug |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Initialiseer samengestelde criteria | leegte |
| `add($criteria, $logic = null)` | Criteria of geneste samenstelling toevoegen | leegte |
| `render($prefix = '')` | Render om de WHERE-clausule te voltooien | tekenreeks |
| `count()` | Aantal criteria ophalen | int |
| `clear()` | Alle criteria verwijderen | leegte |

## Gerelateerde documentatie

- XoopsDatabase - Referentie databaseklasse
- ../../03-Module-Development/Patterns/Repository-Pattern - Repositorypatroon in XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Servicelaagpatroon

## Versie-informatie

- **Geïntroduceerd:** XOOPS 2.5.0
- **Laatst bijgewerkt:** XOOPS 4.0
- **Compatibiliteit:** PHP 7.4+