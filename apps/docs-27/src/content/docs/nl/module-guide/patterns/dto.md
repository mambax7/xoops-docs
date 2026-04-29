---
title: "DTO Patroon in XOOPS"
description: "Gegevensoverdrachtobjecten voor schone gegevensverwerking"
---
# DTO-patroon (gegevensoverdrachtobjecten) in XOOPS

<span class="version-badge versie-25x">2.5.x ✅</span> <span class="version-badge versie-40x">4.0.x ✅</span>

:::tip[Werkt in beide versies]
DTO's zijn gewone PHP-objecten zonder raamwerkafhankelijkheden. Ze werken identiek in XOOPS 2.5.x en XOOPS 4.0.x. Gebruik voor PHP 8.2+ de promotie van constructoreigenschappen en alleen-lezen klassen voor een schonere syntaxis.
:::

Data Transfer Objects (DTO's) zijn eenvoudige objecten die worden gebruikt om gegevens over te dragen tussen verschillende lagen van een applicatie. DTO's helpen duidelijke grenzen tussen lagen te behouden en de afhankelijkheden van entiteitsobjecten te verminderen.

## DTO-concept

### Wat is een DTO?
Een DTO is:
- Een eenvoudig waardeobject met eigenschappen
- Onveranderlijk of alleen-lezen na creatie
- Geen bedrijfslogica of methoden
- Geoptimaliseerd voor gegevensoverdracht
- Onafhankelijk van persistentiemechanismen

### Wanneer moet u DTO's gebruiken?

**Gebruik DTO's wanneer:**
- Gegevens overbrengen tussen lagen
- Gegevens vrijgeven via API's
- Gegevens van meerdere entiteiten samenvoegen
- Interne implementatiedetails verbergen
- Veranderende datastructuur voor verschillende consumenten

## Basis DTO-implementatie

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

## Verzoek/invoer DTO

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

## Gebruik in services

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

## Gebruik in API-controllers

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

## Beste praktijken

- Houd DTO's gefocust en specifiek
- Maak DTO's onveranderlijk of alleen-lezen
- Neem geen bedrijfslogica op in DTO's
- Gebruik aparte DTO's voor invoer en uitvoer
- Documenteer de DTO-eigenschappen duidelijk
- Houd DTO's eenvoudig: alleen datacontainers

## Gerelateerde documentatie

Zie ook:
- [Servicelaag](../Patterns/Service-Layer.md) voor service-integratie
- [Repository-Pattern](../Patterns/Repository-Pattern.md) voor gegevenstoegang
- [MVC-patroon](../Patterns/MVC-Pattern.md) voor controllergebruik
- [Testen](../Best-Practices/Testing.md) voor DTO-testen

---

Tags: #dto #data-transfer-objects #design-patterns #module-ontwikkeling