---
title: "Criteria és CriteriaCompo osztályok"
description: "Lekérdezésépítés és speciális szűrés feltételosztályokkal"
---
A `Criteria` és `CriteriaCompo` osztályok gördülékeny, objektumorientált felületet biztosítanak összetett adatbázis-lekérdezések felépítéséhez. Ezek az osztályok absztrakt SQL WHERE záradékokat tartalmaznak, amelyek lehetővé teszik a fejlesztők számára a dinamikus lekérdezések biztonságos és olvasható összeállítását.

## Osztály áttekintése

### Kritériumosztály

A `Criteria` osztály egyetlen feltételt képvisel a WHERE záradékban:

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

## Alapvető használat

### Egyszerű kritériumok

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### Különböző operátorok

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

## Összetett lekérdezések készítése

### AND logika (alapértelmezett)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### VAGY Logika

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Integráció a Repository mintával

### Repository példa

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

## Biztonság és biztonság

### Automatikus kilépés

A `Criteria` osztály automatikusan kihagyja az értékeket, hogy megakadályozza a SQL befecskendezést:

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## API Referencia

### Kritérium módszerek

| Módszer | Leírás | Vissza |
|--------|--------------|---------|
| `__construct()` | Kritériumfeltétel inicializálása | semmis |
| `render($prefix = '')` | Renderelés SQL WHERE záradékszegmensben | húr |
| `getColumn()` | Az oszlopnév lekérése | húr |
| `getValue()` | Szerezze meg az összehasonlítási értéket | vegyes |
| `getOperator()` | Szerezze be az összehasonlító operátort | húr |

### CriteriaCompo Methods

| Módszer | Leírás | Vissza |
|--------|--------------|---------|
| `__construct($logic = 'AND')` | Összetett kritériumok inicializálása | semmis |
| `add($criteria, $logic = null)` | Feltételek hozzáadása vagy beágyazott összetett | semmis |
| `render($prefix = '')` | Renderelés a teljes WHERE záradékhoz | húr |
| `count()` | Kritériumok száma | int |
| `clear()` | Az összes feltétel eltávolítása | semmis |

## Kapcsolódó dokumentáció

- XOOPSDatabase - Adatbázis osztály hivatkozás
- ../../03-module-Development/Patterns/Repository-Pattern - Repository minta a XOOPS-ban
- ../../03-module-Development/Patterns/Service-Layer-Pattern - Szolgáltatási réteg minta

## Verzióinformáció

- **Bevezetés:** XOOPS 2.5.0
- **Utolsó frissítés:** XOOPS 4.0
- **Kompatibilitás:** PHP 7.4+
