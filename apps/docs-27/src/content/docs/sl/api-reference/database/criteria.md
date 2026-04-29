---
title: "Kriteriji in razredi CriteriaCompo"
description: "Gradnja poizvedb in napredno filtriranje z uporabo razredov kriterijev"
---
Razreda `Criteria` in `CriteriaCompo` zagotavljata tekoč, objektno usmerjen vmesnik za gradnjo kompleksnih poizvedb po bazi podatkov. Ti razredi abstrahirajo SQL WHERE klavzule, ki razvijalcem omogočajo varno in berljivo konstruiranje dinamičnih poizvedb.

## Pregled razreda

### Razred kriterijev

Razred `Criteria` predstavlja en sam pogoj v klavzuli WHERE:
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
## Osnovna uporaba

### Preprosta merila
```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```
### Različni operaterji
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
## Sestavljanje zapletenih poizvedb

### AND Logika (privzeto)
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```
### ALI Logika
```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```
## Integracija z vzorcem repozitorija

### Primer skladišča
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
## Varnost in varnost

### Samodejni umik

Razred `Criteria` samodejno uide vrednostim, da prepreči vstavljanje SQL:
```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```
## API Referenca

### Metode kriterijev

| Metoda | Opis | Vrnitev |
|--------|-------------|--------|
| `__construct()` | Inicializirajte pogoj kriterija | ničen |
| `render($prefix = '')` | Upodobi v segment klavzule SQL WHERE | niz |
| `getColumn()` | Pridobite ime stolpca | niz |
| `getValue()` | Pridobite primerjalno vrednost | mešano |
| `getOperator()` | Pridobite primerjalni operator | niz |

### Metode CriteriaCompo

| Metoda | Opis | Vrnitev |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Inicializiraj sestavljena merila | ničen |
| `add($criteria, $logic = null)` | Dodajte merila ali ugnezdeni sestavljen | ničen |
| `render($prefix = '')` | Upodobi za dokončanje klavzule WHERE | niz |
| `count()` | Pridobi število kriterijev | int |
| `clear()` | Odstrani vse kriterije | ničen |

## Povezana dokumentacija

- XoopsDatabase - Referenca razreda baze podatkov
- ../../03-Module-Development/Patterns/Repository-Pattern - vzorec repozitorija v XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Vzorec storitvenega sloja

## Informacije o različici

- **Predstavljeno:** XOOPS 2.5.0
- **Nazadnje posodobljeno:** XOOPS 4.0
- **Združljivost:** PHP 7.4+