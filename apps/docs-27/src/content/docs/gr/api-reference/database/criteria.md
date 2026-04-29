---
title: "Criteria and CriteriaCompo Classes"
description: "Δημιουργία ερωτημάτων και προηγμένο φιλτράρισμα με χρήση κλάσεων Criteria"
---

Οι κλάσεις `Criteria ` και ` CriteriaCompo` παρέχουν μια ευχάριστη, αντικειμενοστραφή διεπαφή για τη δημιουργία σύνθετων ερωτημάτων βάσης δεδομένων. Αυτές οι κλάσεις αφαιρούν τις ρήτρες SQL WHERE, επιτρέποντας στους προγραμματιστές να κατασκευάζουν δυναμικά ερωτήματα με ασφάλεια και ευανάγνωστα.

## Επισκόπηση τάξης

## # Κατηγορία κριτηρίων

Η κλάση `Criteria` αντιπροσωπεύει μια μεμονωμένη συνθήκη σε μια πρόταση WHERE:

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

## Βασική χρήση

## # Απλά κριτήρια

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

## # Διαφορετικοί χειριστές

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

## Ερωτήματα σύνθετων κτιρίων

## # AND Λογική (Προεπιλογή)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

## # Ή Λογική

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Ενσωμάτωση με μοτίβο αποθετηρίου

## # Παράδειγμα αποθετηρίου

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

## Ασφάλεια και ασφάλεια

## # Αυτόματη διαφυγή

Η κλάση `Criteria` διαφεύγει αυτόματα τις τιμές για να αποτρέψει την έγχυση SQL:

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## API Αναφορά

## # Κριτήρια Μέθοδοι

| Μέθοδος | Περιγραφή | Επιστροφή |
|--------|-------------|--------|
| `__construct()` | Αρχικοποίηση συνθήκης κριτηρίων | κενό |
| `render($prefix = '')` | Απόδοση στο τμήμα ρήτρας SQL WHERE | χορδή |
| `getColumn()` | Λάβετε το όνομα της στήλης | χορδή |
| `getValue()` | Λάβετε την τιμή σύγκρισης | μικτή |
| `getOperator()` | Λήψη του τελεστή σύγκρισης | χορδή |

## # Μέθοδοι CriteriaCompo

| Μέθοδος | Περιγραφή | Επιστροφή |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Αρχικοποίηση σύνθετων κριτηρίων | κενό |
| `add($criteria, $logic = null)` | Προσθήκη κριτηρίων ή ένθετων σύνθετων | κενό |
| `render($prefix = '')` | Απόδοση για να ολοκληρωθεί η ρήτρα WHERE | χορδή |
| `count()` | Λήψη αριθμού κριτηρίων | int |
| `clear()` | Κατάργηση όλων των κριτηρίων | κενό |

## Σχετική τεκμηρίωση

- XoopsDatabase - Αναφορά κλάσης βάσης δεδομένων
- ../../03-Module-Development/Patterns/Repository-Pattern - Μοτίβο αποθετηρίου στο XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Μοτίβο επιπέδου υπηρεσίας

## Πληροφορίες έκδοσης

- **Εισαγωγή:** XOOPS 2.5.0
- **Τελευταία ενημέρωση:** XOOPS 4.0
- **Συμβατότητα:** PHP 7.4+
