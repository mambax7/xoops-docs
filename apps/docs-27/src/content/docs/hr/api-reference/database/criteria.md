---
title: "Kriterij i CriteriaCompo klase"
description: "Izrada upita i napredno filtriranje pomoću kriterija classes"
---
`Criteria` i `CriteriaCompo` classes pružaju tečno, objektno orijentirano sučelje za izradu složenih upita baze podataka. Ove classes apstraktne SQL WHERE klauzule, omogućujući programerima da sigurno i čitljivo konstruiraju dinamičke upite.

## Pregled razreda

### Klasa kriterija

`Criteria` class predstavlja jedan uvjet u klauzuli WHERE:

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

## Osnovna upotreba

### Jednostavni kriteriji

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### Različiti operateri

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

## Izgradnja složenih upita

### I logika (zadano)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### ILI Logika

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Integracija s uzorkom spremišta

### Primjer spremišta

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

## Sigurnost i sigurnost

### Automatsko izbjegavanje

`Criteria` class automatski izbjegava vrijednosti kako bi spriječio ubacivanje SQL:

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## API Referenca

### Metode kriterija

| Metoda | Opis | Povratak |
|--------|-------------|--------|
| `__construct()` | Inicijalizirati uvjet kriterija | poništiti |
| `render($prefix = '')` | Prikaži u SQL WHERE segment klauzule | niz |
| `getColumn()` | Dobiti naziv stupca | niz |
| `getValue()` | Dobiti usporednu vrijednost | mješoviti |
| `getOperator()` | Nabavite operator usporedbe | niz |

### CriteriaCompo metode

| Metoda | Opis | Povratak |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Inicijaliziraj složene kriterije | poništiti |
| `add($criteria, $logic = null)` | Dodajte kriterije ili ugniježđeni kompozit | poništiti |
| `render($prefix = '')` | Renderirajte za dovršetak WHERE klauzule | niz |
| `count()` | Dohvati broj kriterija | int |
| `clear()` | Ukloni sve kriterije | poništiti |

## Povezana dokumentacija

- XoopsDatabase - Referenca baze podataka class
- ../../03-Module-Development/Patterns/Repository-Pattern - Uzorak spremišta u XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Uzorak sloja usluge

## Informacije o verziji

- **Predstavljeno:** XOOPS 2.5.0
- **Zadnje ažuriranje:** XOOPS 4.0
- **Kompatibilnost:** PHP 7.4+
