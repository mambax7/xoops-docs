---
title: "Μοτίβο επιπέδου υπηρεσιών σε XOOPS"
description: "Αφαίρεση επιχειρησιακής λογικής και ένεση εξάρτησης"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Δεν είμαι σίγουρος αν αυτό είναι το σωστό μοτίβο;]
Ανατρέξτε στην ενότητα [Επιλογή μοτίβου πρόσβασης δεδομένων](../Choosing-Data-Access-Pattern.md) για ένα δέντρο αποφάσεων που συγκρίνει χειριστές, αποθετήρια, υπηρεσίες και CQRS.
:::

:::tip [Δουλεύει σήμερα και αύριο]
Το μοτίβο επιπέδου υπηρεσίας **λειτουργεί και σε XOOPS 2.5.x και XOOPS 4.0.x**. Οι έννοιες είναι καθολικές—μόνο η σύνταξη διαφέρει:

| Χαρακτηριστικό | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| PHP Έκδοση | 7,4+ | 8,2+ |
| Constructor Injection | ✅ Χειροκίνητη καλωδίωση | ✅ Αυτοκαλωδίωση κοντέινερ |
| Δακτυλογραφημένες ιδιότητες | `@var` μπλοκ εγγράφων | Δηλώσεις εγγενούς τύπου |
| Ιδιότητες μόνο για ανάγνωση | ❌ Μη διαθέσιμο | ✅ `readonly` λέξη-κλειδί |

Τα παρακάτω παραδείγματα κώδικα χρησιμοποιούν σύνταξη PHP 8.2+. Για 2.5.x, παραλείψτε το `readonly` και χρησιμοποιήστε παραδοσιακές δηλώσεις ιδιοκτησίας.
:::

Το μοτίβο επιπέδου υπηρεσιών ενσωματώνει την επιχειρηματική λογική σε ειδικές κλάσεις υπηρεσιών, παρέχοντας σαφή διαχωρισμό μεταξύ των ελεγκτών και των επιπέδων πρόσβασης δεδομένων. Αυτό το μοτίβο προωθεί την επαναχρησιμοποίηση κώδικα, τη δυνατότητα δοκιμής και τη δυνατότητα συντήρησης.

## Έννοια επιπέδου υπηρεσιών

## # Σκοπός
Το επίπεδο υπηρεσίας:
- Περιέχει επιχειρηματική λογική τομέα
- Συντονίζει πολλαπλά αποθετήρια
- Χειρίζεται πολύπλοκες λειτουργίες
- Διαχειρίζεται τις συναλλαγές
- Εκτελεί επικύρωση και εξουσιοδότηση
- Παρέχει λειτουργίες υψηλού επιπέδου στους ελεγκτές

## # Οφέλη
- Επαναχρησιμοποιήσιμη επιχειρηματική λογική σε πολλούς ελεγκτές
- Εύκολο στη δοκιμή μεμονωμένα
- Κεντρική εφαρμογή επιχειρηματικών κανόνων
- Σαφής διαχωρισμός των ανησυχιών
- Απλοποιημένος κωδικός ελεγκτή

## Έγχυση εξάρτησης

```php
<?php
// Service with injected dependencies
class UserService
{
    private $userRepository;
    private $emailService;
    
    public function __construct(
        UserRepositoryInterface $userRepository,
        EmailServiceInterface $emailService
    ) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Validate
        $this->validate($username, $email, $password);
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // Save
        $userId = $this->userRepository->save($user);
        
        // Send welcome email
        $this->emailService->sendWelcome($email, $username);
        
        return $userId;
    }
    
    private function validate($username, $email, $password)
    {
        $errors = [];
        
        if (strlen($username) < 3) {
            $errors['username'] = 'Username too short';
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email';
        }
        
        if (strlen($password) < 6) {
            $errors['password'] = 'Password too short';
        }
        
        if (!empty($errors)) {
            throw new ValidationException('Invalid input', $errors);
        }
    }
}
?>
```

## Δοχείο σέρβις

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // Register repositories
        $this->services['userRepository'] = new UserRepository($db);
        
        // Register services
        $this->services['userService'] = new UserService(
            $this->services['userRepository']
        );
    }
    
    public function get($name)
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("Service not found: $name");
        }
        return $this->services[$name];
    }
}
?>
```

## Χρήση σε ελεγκτές

```php
<?php
class UserController
{
    private $userService;
    
    public function __construct(ServiceContainer $container)
    {
        $this->userService = $container->get('userService');
    }
    
    public function registerAction()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return [];
        }
        
        try {
            $userId = $this->userService->registerUser(
                $_POST['username'],
                $_POST['email'],
                $_POST['password']
            );
            
            return [
                'success' => true,
                'userId' => $userId,
            ];
        } catch (ValidationException $e) {
            return [
                'success' => false,
                'errors' => $e->getErrors(),
            ];
        }
    }
}
?>
```

## Βέλτιστες πρακτικές

- Κάθε υπηρεσία χειρίζεται μία ανησυχία τομέα
- Οι υπηρεσίες εξαρτώνται από διεπαφές και όχι από υλοποιήσεις
- Χρησιμοποιήστε την έγχυση κατασκευαστή για εξαρτήσεις
- Οι υπηρεσίες θα πρέπει να μπορούν να ελεγχθούν μεμονωμένα
- Πραγματοποιήστε εξαιρέσεις για συγκεκριμένους τομείς
- Οι υπηρεσίες δεν πρέπει να εξαρτώνται από τις λεπτομέρειες αιτήματος HTTP
- Διατηρήστε τις υπηρεσίες εστιασμένες και συνεκτικές

## Σχετική τεκμηρίωση

Δείτε επίσης:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) για ενσωμάτωση ελεγκτή
- [Repository-Pattern](../Patterns/Repository-Pattern.md) για πρόσβαση σε δεδομένα
- [DTO-Pattern](DTO-Pattern.md) για αντικείμενα μεταφοράς δεδομένων
- [Testing](../Best-Practices/Testing.md) για δοκιμή σέρβις

---

Ετικέτες: #service-layer #business-logic #dependency-injection #design-patterns
