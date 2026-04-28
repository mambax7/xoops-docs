---
title: "DTO-Muster in XOOPS"
description: "Datentransferobjekte für saubere Datenbehandlung"
---

# DTO-Muster (Data Transfer Objects) in XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Funktioniert in beiden Versionen]
DTOs sind einfache PHP-Objekte ohne Framework-Abhängigkeiten. Sie funktionieren identisch in XOOPS 2.5.x und XOOPS 4.0.x. Verwenden Sie für PHP 8.2+ Constructor Property Promotion und Readonly-Klassen für sauberere Syntax.
:::

Data Transfer Objects (DTOs) sind einfache Objekte, die zum Übertragen von Daten zwischen verschiedenen Schichten einer Anwendung verwendet werden. DTOs helfen, klare Grenzen zwischen Schichten zu wahren und Abhängigkeiten von Entity-Objekten zu reduzieren.

## DTO-Konzept

### Was ist ein DTO?
Ein DTO ist:
- Ein einfaches Wertobjekt mit Eigenschaften
- Unveränderlich oder nach der Erstellung schreibgeschützt
- Keine Geschäftslogik oder Methoden
- Optimiert für Datenübertragung
- Unabhängig von Persistenzmechanismen

### Wann man DTOs verwendet

**Verwenden Sie DTOs, wenn:**
- Daten zwischen Schichten übertragen werden
- Daten über APIs verfügbar gemacht werden
- Daten aus mehreren Entitäten aggregiert werden
- Interne Implementierungsdetails ausgeblendet werden
- Datenstruktur für verschiedene Consumer geändert wird

## Grundlegende DTO-Implementierung

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

## Usage in Services

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

## Usage in API Controllers

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

## Best Practices

- Keep DTOs focused and specific
- Make DTOs immutable or read-only
- Don't include business logic in DTOs
- Use separate DTOs for input and output
- Document DTO properties clearly
- Keep DTOs simple - just data containers

## Related Documentation

See also:
- [Service-Layer](../Patterns/Service-Layer.md) for service integration
- [Repository-Pattern](../Patterns/Repository-Pattern.md) for data access
- [MVC-Pattern](../Patterns/MVC-Pattern.md) for controller usage
- [Testing](../Best-Practices/Testing.md) for DTO testing

---

Tags: #dto #data-transfer-objects #design-patterns #module-development
