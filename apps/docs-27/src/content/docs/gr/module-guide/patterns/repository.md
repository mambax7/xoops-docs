---
title: "Μοτίβο αποθετηρίου στο XOOPS"
description: "Εφαρμογή επιπέδου αφαίρεσης πρόσβασης δεδομένων"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Δεν είμαι σίγουρος αν αυτό είναι το σωστό μοτίβο;]
Ανατρέξτε στην ενότητα [Επιλογή μοτίβου πρόσβασης δεδομένων](../Choosing-Data-Access-Pattern.md) για ένα δέντρο αποφάσεων που συγκρίνει χειριστές, αποθετήρια, υπηρεσίες και CQRS.
:::

:::tip [Δουλεύει σήμερα και αύριο]
Το μοτίβο Repository **λειτουργεί και σε XOOPS 2.5.x και XOOPS 4.0.x**. Στο 2.5.x, τυλίξτε το υπάρχον `XoopsPersistableObjectHandler` σε μια κλάση Repository για να λάβετε τα οφέλη της αφαίρεσης:

| Προσέγγιση | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| Άμεση πρόσβαση χειριστή | `xoops_getModuleHandler()` | Μέσω δοχείου DI |
| Περιτύλιγμα αποθήκης | ✅ Προτείνεται | ✅ Εγγενές μοτίβο |
| Δοκιμές με κοροϊδίες | ✅ Με χειροκίνητο DI | ✅ Αυτοκαλωδίωση κοντέινερ |

**Ξεκινήστε με το μοτίβο αποθετηρίου σήμερα** για να προετοιμάσετε τις μονάδες σας για μετεγκατάσταση XOOPS 4.0.
:::

Το μοτίβο αποθετηρίου είναι ένα μοτίβο πρόσβασης δεδομένων που αφαιρεί τις λειτουργίες της βάσης δεδομένων, παρέχοντας μια καθαρή διεπαφή για την πρόσβαση στα δεδομένα. Λειτουργεί ως μεσάζων μεταξύ των επιπέδων επιχειρηματικής λογικής και χαρτογράφησης δεδομένων.

## Έννοια αποθετηρίου

Το μοτίβο αποθετηρίου παρέχει:
- Περίληψη λεπτομερειών υλοποίησης βάσης δεδομένων
- Εύκολη κοροϊδία για δοκιμή μονάδας
- Κεντρική λογική πρόσβασης δεδομένων
- Ευελιξία αλλαγής βάσης δεδομένων χωρίς να επηρεάζεται η επιχειρηματική λογική
- Επαναχρησιμοποιήσιμη λογική πρόσβασης δεδομένων σε όλη την εφαρμογή

## Πότε να χρησιμοποιείτε τα αποθετήρια

**Χρησιμοποιήστε τα αποθετήρια όταν:**
- Μεταφορά δεδομένων μεταξύ των επιπέδων εφαρμογής
- Χρειάζεται αλλαγή της εφαρμογής της βάσης δεδομένων
- Σύνταξη ελεγχόμενου κώδικα με κοροϊδίες
- Περίληψη μοτίβων πρόσβασης δεδομένων

## Μοτίβο υλοποίησης

```php
<?php
// Define repository interface
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// Implement repository
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // Implementation
    }
    
    public function save($entity)
    {
        // Implementation
    }
}
?>
```

## Χρήση στις Υπηρεσίες

```php
<?php
class UserService
{
    private $userRepository;
    
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Check if user exists
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```

## Βέλτιστες πρακτικές

- Χρησιμοποιήστε διεπαφές για να ορίσετε συμβάσεις αποθετηρίου
- Κάθε αποθετήριο χειρίζεται έναν τύπο οντότητας
- Διατηρήστε την επιχειρηματική λογική στις υπηρεσίες, όχι στα αποθετήρια
- Χρησιμοποιήστε αντικείμενα οντοτήτων για αντιστοίχιση δεδομένων
- Βάλτε κατάλληλες εξαιρέσεις για μη έγκυρες λειτουργίες

## Σχετική τεκμηρίωση

Δείτε επίσης:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) για ενσωμάτωση ελεγκτή
- [Service-Layer](../Patterns/Service-Layer.md) για υλοποίηση υπηρεσίας
- [DTO-Pattern](DTO-Pattern.md) για αντικείμενα μεταφοράς δεδομένων
- [Testing](../Best-Practices/Testing.md) για δοκιμή αποθετηρίου

---

Ετικέτες: #repository-pattern #data-access #design-patterns #module-development
