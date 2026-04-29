---
title: "Třídy Criteria a CriteriaCompo"
description: "Vytváření dotazů a pokročilé filtrování pomocí tříd Criteria"
---

Třídy `Criteria` a `CriteriaCompo` poskytují plynulé, objektově orientované rozhraní pro vytváření složitých databázových dotazů. Tyto třídy abstrahují klauzule SQL WHERE, což vývojářům umožňuje vytvářet dynamické dotazy bezpečně a čitelně.

## Přehled třídy

### Třída kritérií

Třída `Criteria` představuje jednu podmínku v klauzuli WHERE:

```php
namespace XOOPS\Database;

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

## Základní použití

### Jednoduchá kritéria

```php
use XOOPS\Database\Criteria;
use XOOPS\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### Různí operátoři

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

## Vytváření složitých dotazů

### Logika AND (výchozí)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### NEBO Logika

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Integrace se vzorem úložiště

### Příklad úložiště

```php
namespace MyModule\Repository;

use XOOPS\Database\XOOPSDatabase;
use XOOPS\Database\Criteria;
use XOOPS\Database\CriteriaCompo;

class UserRepository
{
    private $db;
    private $table = 'users';

    public function __construct(XOOPSDatabase $db)
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

## Bezpečnost a zabezpečení

### Automatické escapování

Třída `Criteria` automaticky unikne hodnotám, aby se zabránilo vstřikování SQL:

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## Reference API

### Metody kritérií

| Metoda | Popis | Návrat |
|--------|-------------|--------|
| `__construct()` | Inicializovat podmínku kritéria | neplatný |
| `render($prefix = '')` | Vykreslit do segmentu klauzule SQL WHERE | řetězec |
| `getColumn()` | Získejte název sloupce | řetězec |
| `getValue()` | Získejte srovnávací hodnotu | smíšené |
| `getOperator()` | Získejte operátor porovnání | řetězec |

### Metody CriteriaCompo

| Metoda | Popis | Návrat |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Inicializovat složená kritéria | neplatný |
| `add($criteria, $logic = null)` | Přidat kritéria nebo vnořený kompozit | neplatný |
| `render($prefix = '')` | Vykreslením dokončete klauzuli WHERE | řetězec |
| `count()` | Získat počet kritérií | int |
| `clear()` | Odebrat všechna kritéria | neplatný |

## Související dokumentace

- XOOPSDatabase - Odkaz na třídu databáze
- ../../03-Module-Development/Patterns/Repository-Pattern - Vzor úložiště v XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Vzor servisní vrstvy

## Informace o verzi

- **Představeno:** XOOPS 2.5.0
- **Poslední aktualizace:** XOOPS 4.0
- **Kompatibilita:** PHP 7.4+