---
title: "Pattern DTO in XOOPS"
description: "Data Transfer Object per una gestione pulita dei dati"
---

# Pattern DTO (Data Transfer Object) in XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Funziona in Entrambe le Versioni]
I DTO sono oggetti PHP semplici senza dipendenze dal framework. Funzionano identicamente in XOOPS 2.5.x e XOOPS 4.0.x. Per PHP 8.2+, usa constructor property promotion e readonly classes per sintassi più pulita.
:::

I Data Transfer Object (DTO) sono oggetti semplici usati per trasferire dati tra diversi livelli di un'applicazione. I DTO aiutano a mantenere confini chiari tra i livelli e riducono le dipendenze dagli oggetti entità.

## Concetto DTO

### Cos'è un DTO?
Un DTO è:
- Un oggetto valore semplice con proprietà
- Immutabile o read-only dopo la creazione
- Senza logica di business o metodi
- Ottimizzato per il trasferimento di dati
- Indipendente dai meccanismi di persistenza

### Quando Usare i DTO

**Usa i DTO quando:**
- Trasferisci dati tra livelli
- Esponi dati attraverso API
- Aggreghi dati da multiple entità
- Nascondi i dettagli di implementazione interna
- Cambi la struttura dei dati per diversi consumatori

## Implementazione DTO di Base

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

## DTO Request/Input

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

## Utilizzo nei Servizi

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

## Utilizzo nei Controller API

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

## Migliori Pratiche

- Mantieni i DTO focalizzati e specifici
- Rendi i DTO immutabili o read-only
- Non includere logica di business nei DTO
- Usa DTO separati per input e output
- Documenta le proprietà DTO chiaramente
- Mantieni i DTO semplici - solo contenitori di dati

## Documentazione Correlata

Vedi anche:
- [Service-Layer](../Patterns/Service-Layer.md) per l'integrazione del servizio
- [Repository-Pattern](../Patterns/Repository-Pattern.md) per l'accesso ai dati
- [MVC-Pattern](../Patterns/MVC-Pattern.md) per l'utilizzo nel controller
- [Testing](../Best-Practices/Testing.md) per il testing del DTO

---

Tags: #dto #data-transfer-objects #design-patterns #module-development
