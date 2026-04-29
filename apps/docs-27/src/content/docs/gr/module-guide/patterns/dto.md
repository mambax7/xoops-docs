---
title: "DTO Μοτίβο σε XOOPS"
description: "Αντικείμενα μεταφοράς δεδομένων για καθαρό χειρισμό δεδομένων"
---

# DTO Μοτίβο (Αντικείμενα μεταφοράς δεδομένων) στο XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Λειτουργεί και στις δύο εκδόσεις]
Τα DTO είναι απλά αντικείμενα PHP χωρίς εξαρτήσεις πλαισίου. Λειτουργούν πανομοιότυπα σε XOOPS 2.5.x και XOOPS 4.0.x. Για το PHP 8.2+, χρησιμοποιήστε την προώθηση ιδιοτήτων κατασκευαστή και κλάσεις μόνο για ανάγνωση για πιο καθαρή σύνταξη.
:::

Τα αντικείμενα μεταφοράς δεδομένων (DTO) είναι απλά αντικείμενα που χρησιμοποιούνται για τη μεταφορά δεδομένων μεταξύ διαφορετικών επιπέδων μιας εφαρμογής. Οι DTO βοηθούν στη διατήρηση σαφών ορίων μεταξύ των επιπέδων και στη μείωση των εξαρτήσεων από αντικείμενα οντοτήτων.

## DTO Έννοια

## # Τι είναι το DTO;
Ένα DTO είναι:
- Ένα απλό αντικείμενο αξίας με ιδιότητες
- Αμετάβλητο ή μόνο για ανάγνωση μετά τη δημιουργία
- Χωρίς επιχειρηματική λογική ή μεθόδους
- Βελτιστοποιημένο για μεταφορά δεδομένων
- Ανεξάρτητο από μηχανισμούς επιμονής

## # Πότε να χρησιμοποιείτε DTO

**Χρησιμοποιήστε DTO όταν:**
- Μεταφορά δεδομένων μεταξύ επιπέδων
- Έκθεση δεδομένων μέσω API
- Συγκέντρωση δεδομένων από πολλαπλές οντότητες
- Απόκρυψη εσωτερικών λεπτομερειών υλοποίησης
- Αλλαγή της δομής δεδομένων για διαφορετικούς καταναλωτές

## Βασικό DTO Υλοποίηση

```php
<?php
class UserDTO
{
    private $id;
    private $username;
    private $email;
    private $isActive;
    private $createdAt;
    
    public function __construct($entity = null)
    {
        if ($entity instanceof User) {
            $this->id = $entity->getId();
            $this->username = $entity->getUsername();
            $this->email = $entity->getEmail();
            $this->isActive = $entity->isActive();
            $this->createdAt = $entity->getCreatedAt();
        }
    }
    
    // Read-only accessors
    public function getId() { return $this->id; }
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function isActive() { return $this->isActive; }
    public function getCreatedAt() { return $this->createdAt; }
    
    public function toArray()
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
        ];
    }
    
    public function toJson()
    {
        return json_encode($this->toArray());
    }
}
?>
```

## Request/Input DTO

```php
<?php
class CreateUserRequestDTO
{
    private $username;
    private $email;
    private $password;
    private $errors = [];
    
    public function __construct(array $data)
    {
        $this->username = $data['username'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->password = $data['password'] ?? '';
        
        $this->validate();
    }
    
    private function validate()
    {
        if (empty($this->username) || strlen($this->username) < 3) {
            $this->errors['username'] = 'Username too short';
        }
        
        if (empty($this->email) || !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'Invalid email';
        }
        
        if (empty($this->password) || strlen($this->password) < 6) {
            $this->errors['password'] = 'Password too short';
        }
    }
    
    public function isValid()
    {
        return empty($this->errors);
    }
    
    public function getErrors()
    {
        return $this->errors;
    }
    
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function getPassword() { return $this->password; }
}
?>
```

## Χρήση στις Υπηρεσίες

```php
<?php
class UserService
{
    public function createUserFromRequest(CreateUserRequestDTO $dto)
    {
        if (!$dto->isValid()) {
            throw new ValidationException('Invalid input', $dto->getErrors());
        }
        
        $user = new User();
        $user->setUsername($dto->getUsername());
        $user->setEmail($dto->getEmail());
        $user->setPassword($dto->getPassword());
        
        $userId = $this->userRepository->save($user);
        
        return new UserDTO($user);
    }
}
?>
```

## Χρήση σε ελεγκτές API

```php
<?php
class ApiController
{
    public function createUserAction()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $dto = new CreateUserRequestDTO($input);
        
        if (!$dto->isValid()) {
            http_response_code(400);
            return ['success' => false, 'errors' => $dto->getErrors()];
        }
        
        try {
            $userDTO = $this->userService->createUserFromRequest($dto);
            http_response_code(201);
            return ['success' => true, 'data' => $userDTO->toArray()];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>
```

## Βέλτιστες πρακτικές

- Διατηρήστε τους DTO εστιασμένους και συγκεκριμένους
- Κάντε τους DTO αμετάβλητους ή μόνο για ανάγνωση
- Μην συμπεριλάβετε την επιχειρηματική λογική στους DTO
- Χρησιμοποιήστε ξεχωριστούς DTO για είσοδο και έξοδο
- Καταγράψτε με σαφήνεια τις ιδιότητες DTO
- Διατηρήστε τους DTO απλούς - μόνο δοχεία δεδομένων

## Σχετική τεκμηρίωση

Δείτε επίσης:
- [Service-Layer](../Patterns/Service-Layer.md) για ενσωμάτωση υπηρεσιών
- [Repository-Pattern](../Patterns/Repository-Pattern.md) για πρόσβαση σε δεδομένα
- [MVC-Pattern](../Patterns/MVC-Pattern.md) για χρήση ελεγκτή
- [Δοκιμή](../Best-Practices/Testing.md) για δοκιμές DTO

---

Ετικέτες: #dto #data-transfer-objects #design-patterns #module-development
