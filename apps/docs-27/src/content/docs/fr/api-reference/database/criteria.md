---
title: "Classes Criteria et CriteriaCompo"
description: "Construction de requêtes et filtrage avancé utilisant les classes Criteria"
---

Les classes `Criteria` et `CriteriaCompo` fournissent une interface fluide orientée objet pour construire des requêtes base de données complexes. Ces classes abstraient les clauses SQL WHERE, permettant aux développeurs de construire des requêtes dynamiques de manière sécurisée et lisible.

## Vue d'ensemble des classes

### Classe Criteria

La classe `Criteria` représente une condition unique dans une clause WHERE :

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

## Utilisation de base

### Criteria simple

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Condition unique
$criteria = new Criteria('status', 'active');
// Rendu : `status` = 'active'
```

### Différents opérateurs

```php
// Égalité (défaut)
$criteria = new Criteria('status', 'active', '=');

// Pas égal
$criteria = new Criteria('status', 'active', '<>');

// Plus grand que
$criteria = new Criteria('age', 18, '>');

// Moins ou égal
$criteria = new Criteria('age', 65, '<=');

// LIKE (pour correspondance motif)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (pour valeurs multiples)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## Construction de requêtes complexes

### Logique AND (défaut)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Rendu : `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### Logique OR

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Intégration avec modèle Repository

### Exemple Repository

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

## Sécurité et prévention de l'injection SQL

### Échappement automatique

La classe `Criteria` échappe automatiquement les valeurs pour prévenir l'injection SQL :

```php
// Sécurisé - la valeur est automatiquement échappée
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Rendu sécurisé : `username` = '\''; DROP TABLE users; --'
```

## Référence de l'API

### Méthodes Criteria

| Méthode | Description | Retour |
|--------|-------------|--------|
| `__construct()` | Initialiser une condition criteria | void |
| `render($prefix = '')` | Rendu en segment clause WHERE SQL | string |
| `getColumn()` | Obtenir le nom de colonne | string |
| `getValue()` | Obtenir la valeur de comparaison | mixed |
| `getOperator()` | Obtenir l'opérateur de comparaison | string |

### Méthodes CriteriaCompo

| Méthode | Description | Retour |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Initialiser criteria composites | void |
| `add($criteria, $logic = null)` | Ajouter criteria ou composite imbriqué | void |
| `render($prefix = '')` | Rendu en clause WHERE complète | string |
| `count()` | Obtenir le nombre de criteria | int |
| `clear()` | Supprimer tous les criteria | void |

## Documentation connexe

- XoopsDatabase - Classe de base de données
- ../../03-Module-Development/Patterns/Repository-Pattern - Modèle repository dans XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Modèle service layer

## Informations de version

- **Introduit :** XOOPS 2.5.0
- **Dernière mise à jour :** XOOPS 4.0
- **Compatibilité :** PHP 7.4+
