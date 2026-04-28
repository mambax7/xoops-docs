---
title: "Klasy Criteria i CriteriaCompo"
description: "Budowanie zapytań i zaawansowane filtrowanie przy użyciu klas Criteria"
---

Klasy `Criteria` i `CriteriaCompo` zapewniają fluent, zorientowany na obiekty interfejs do budowania złożonych zapytań do bazy danych. Klasy te abstrahują klauzule SQL WHERE, pozwalając deweloperom konstruować dynamiczne zapytania bezpiecznie i czytelnie.

## Przegląd Klasy

### Klasa Criteria

Klasa `Criteria` reprezentuje pojedynczy warunek w klauzuli WHERE:

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

## Podstawowe Użycie

### Proste Kryteria

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Pojedynczy warunek
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### Różne Operatory

```php
// Równość (domyślnie)
$criteria = new Criteria('status', 'active', '=');

// Nie równa się
$criteria = new Criteria('status', 'active', '<>');

// Większe niż
$criteria = new Criteria('age', 18, '>');

// Mniejsze niż lub równe
$criteria = new Criteria('age', 65, '<=');

// LIKE (do dopasowania wzorca)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (dla wielu wartości)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## Budowanie Złożonych Zapytań

### Logika AND (Domyślnie)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### Logika OR

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Integracja ze Wzorcem Repozytorium

### Przykład Repozytorium

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

## Bezpieczeństwo i Ochrona

### Automatyczne Ucieczki

Klasa `Criteria` automatycznie ucieka od wartości, aby zapobiec wstrzykiwaniu SQL:

```php
// Bezpieczne - wartość jest automatycznie uciekana
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Bezpiecznie renderuje: `username` = '\''; DROP TABLE users; --'
```

## Odniesienie API

### Metody Criteria

| Metoda | Opis | Zwraca |
|--------|------|--------|
| `__construct()` | Inicjalizuj warunek kryteriów | void |
| `render($prefix = '')` | Renderuj do segmentu klauzuli WHERE SQL | string |
| `getColumn()` | Pobierz nazwę kolumny | string |
| `getValue()` | Pobierz wartość porównania | mixed |
| `getOperator()` | Pobierz operator porównania | string |

### Metody CriteriaCompo

| Metoda | Opis | Zwraca |
|--------|------|--------|
| `__construct($logic = 'AND')` | Inicjalizuj złożone kryteria | void |
| `add($criteria, $logic = null)` | Dodaj kryteria lub zagnieżdżoną złożoną | void |
| `render($prefix = '')` | Renderuj do kompletnej klauzuli WHERE | string |
| `count()` | Pobierz liczbę kryteriów | int |
| `clear()` | Usuń wszystkie kryteria | void |

## Powiązana Dokumentacja

- XoopsDatabase - Odniesienie klasy bazy danych
- ../../03-Module-Development/Patterns/Repository-Pattern - Wzorzec repozytorium w XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Wzorzec warstwy serwisowej

## Informacje Wersji

- **Wprowadzono:** XOOPS 2.5.0
- **Ostatnia Aktualizacja:** XOOPS 4.0
- **Kompatybilność:** PHP 7.4+
