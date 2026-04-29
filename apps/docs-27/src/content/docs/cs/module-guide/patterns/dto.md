---
title: "Vzor DTO v XOOPS"
description: "Data Transfer Objects pro čisté zpracování dat"
---

# Vzor DTO (objekty přenosu dat) v XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Funguje v obou verzích]
DTO jsou prosté objekty PHP bez závislostí na frameworku. Fungují identicky v XOOPS 2.5.xa XOOPS 4.0.x. Pro PHP 8.2+ použijte podporu vlastnosti konstruktoru a třídy pouze pro čtení pro čistší syntaxi.
:::

Data Transfer Objects (DTO) jsou jednoduché objekty používané k přenosu dat mezi různými vrstvami aplikace. DTO pomáhají udržovat jasné hranice mezi vrstvami a snižují závislosti na objektech entit.

## Koncept DTO

### Co je DTO?
A DTO je:
- Jednoduchý hodnotový objekt s vlastnostmi
- Po vytvoření neměnné nebo pouze pro čtení
- Žádná obchodní logika nebo metody
- Optimalizováno pro přenos dat
- Nezávislé na mechanismech perzistence

### Kdy použít DTO

**Použijte DTO, když:**
- Přenos dat mezi vrstvami
- Zpřístupnění dat prostřednictvím API
- Agregace dat z více subjektů
- Skrytí podrobností o interní implementaci
- Změna struktury dat pro různé spotřebitele

## Základní implementace DTO

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

## Použití ve službách

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

## Použití v ovladačích API

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

## Nejlepší postupy

- Udržujte DTO zaměřené a konkrétní
- Udělejte DTO neměnné nebo pouze pro čtení
- Nezahrnujte obchodní logiku do DTO
- Použijte samostatné DTO pro vstup a výstup
- Jasně zdokumentujte vlastnosti DTO
- Udržujte DTO jednoduché - pouze datové kontejnery

## Související dokumentace

Viz také:
- [Service-Layer](../Patterns/Service-Layer.md) pro integraci služeb
- [Repository-Pattern](../Patterns/Repository-Pattern.md) pro přístup k datům
- [MVC-Pattern](../Patterns/MVC-Pattern.md) pro použití ovladače
- [Testování](../Best-Practices/Testing.md) pro testování DTO

---

Tagy: #dto #data-transfer-objects #design-patterns #module-development