---
title: "Classi Criteria e CriteriaCompo"
description: "Costruzione query e filtraggio avanzato usando classi Criteria"
---

Le classi `Criteria` e `CriteriaCompo` forniscono un'interfaccia fluente e orientata agli oggetti per costruire query database complesse. Queste classi astraggono le clausole WHERE SQL, permettendo agli sviluppatori di costruire query dinamiche in modo sicuro e leggibile.

## Panoramica Classe

### Classe Criteria

La classe `Criteria` rappresenta una singola condizione in una clausola WHERE:

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

## Utilizzo Base

### Criteria Semplice

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Singola condizione
$criteria = new Criteria('status', 'active');
// Render: `status` = 'active'
```

### Operatori Diversi

```php
// Uguaglianza (default)
$criteria = new Criteria('status', 'active', '=');

// Non uguale
$criteria = new Criteria('status', 'active', '<>');

// Maggiore di
$criteria = new Criteria('age', 18, '>');

// Minore o uguale
$criteria = new Criteria('age', 65, '<=');

// LIKE (per pattern matching)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (per valori multipli)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## Costruzione Query Complesse

### Logica AND (Default)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Render: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### Logica OR

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Integrazione con Pattern Repository

### Esempio Repository

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

## Sicurezza e Prevenzione SQL Injection

### Escaping Automatico

La classe `Criteria` fa l'escaping automatico dei valori per prevenire SQL injection:

```php
// Sicuro - il valore è automaticamente escapato
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Render sicuro: `username` = '\''; DROP TABLE users; --'
```

## Riferimento API

### Metodi Criteria

| Metodo | Descrizione | Restituisce |
|--------|-------------|--------|
| `__construct()` | Inizializza una condizione criteria | void |
| `render($prefix = '')` | Render a segmento clausola WHERE SQL | string |
| `getColumn()` | Ottieni il nome colonna | string |
| `getValue()` | Ottieni il valore di confronto | mixed |
| `getOperator()` | Ottieni l'operatore di confronto | string |

### Metodi CriteriaCompo

| Metodo | Descrizione | Restituisce |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Inizializza criteria composita | void |
| `add($criteria, $logic = null)` | Aggiungi criteria o composita annidati | void |
| `render($prefix = '')` | Render a clausola WHERE completa | string |
| `count()` | Ottieni numero di criteria | int |
| `clear()` | Rimuovi tutti i criteria | void |

## Documentazione Correlata

- XoopsDatabase - Riferimento classe database
- ../../03-Module-Development/Patterns/Repository-Pattern - Pattern repository in XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Pattern service layer

## Informazioni Versione

- **Introdotto:** XOOPS 2.5.0
- **Ultimo Aggiornamento:** XOOPS 4.0
- **Compatibilità:** PHP 7.4+
