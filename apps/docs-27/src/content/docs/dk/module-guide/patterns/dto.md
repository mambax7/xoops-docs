---
title: "DTO mønster i XOOPS"
description: "Dataoverførselsobjekter til ren datahåndtering"
---

# DTO mønster (dataoverførselsobjekter) i XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Virker i begge versioner]
DTO'er er almindelige PHP-objekter uden rammeafhængigheder. De fungerer identisk i XOOPS 2.5.x og XOOPS 4.0.x. For PHP 8.2+ skal du bruge promovering af constructor-egenskaber og skrivebeskyttede klasser til renere syntaks.
:::

Data Transfer Objects (DTO'er) er simple objekter, der bruges til at overføre data mellem forskellige lag af en applikation. DTO'er hjælper med at opretholde klare grænser mellem lag og reducerer afhængighed af entitetsobjekter.

## DTO koncept

### Hvad er en DTO?
En DTO er:
- Et simpelt værdiobjekt med egenskaber
- Uforanderlig eller skrivebeskyttet efter oprettelse
- Ingen forretningslogik eller metoder
- Optimeret til dataoverførsel
- Uafhængig af persistensmekanismer

### Hvornår skal DTO'er bruges

**Brug DTO'er, når:**
- Overførsel af data mellem lag
- Eksponering af data gennem API'er
- Samling af data fra flere enheder
- Skjul interne implementeringsdetaljer
- Ændring af datastruktur for forskellige forbrugere

## Grundlæggende DTO implementering

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

## Forespørgsel/input DTO

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

## Brug i tjenester

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

## Brug i API controllere

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

## Bedste praksis

- Hold DTO'er fokuserede og specifikke
- Gør DTO'er uforanderlige eller skrivebeskyttede
- Inkluder ikke forretningslogik i DTO'er
- Brug separate DTO'er til input og output
- Dokumenter DTO egenskaber tydeligt
- Hold DTO'er enkle - kun databeholdere

## Relateret dokumentation

Se også:
- [Service-Layer](../Patterns/Service-Layer.md) til serviceintegration
- [Repository-Pattern](../Patterns/Repository-Pattern.md) til dataadgang
- [MVC-Pattern](../Patterns/MVC-Pattern.md) til controllerbrug
- [Test](../Best-Practices/Testing.md) til DTO-test

---

Tags: #dto #data-transfer-objects #design-patterns #module-development
