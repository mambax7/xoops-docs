---
title: "Wzorzec DTO w XOOPS"
description: "Obiekty transferu danych do czystego obsługiwania danych"
---

# Wzorzec DTO (Data Transfer Objects) w XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::wskazówka[Działa w obu wersjach]
DTO to zwykłe obiekty PHP bez zależności od framework'a. Działają identycznie w XOOPS 2.5.x i XOOPS 4.0.x. Na PHP 8.2+, używaj promowania właściwości konstruktora i klas readonly dla czystszej składni.
:::

Obiekty transferu danych (DTO) to proste obiekty używane do transferu danych między różnymi warstwami aplikacji. DTO pomagają utrzymać jasne granice między warstwami i zmniejszają zależności od obiektów encji.

## Koncepcja DTO

### Co to jest DTO?
DTO to:
- Prosty obiekt wartości z właściwościami
- Niezmienny lub tylko do odczytu po utworzeniu
- Brak logiki biznesowej ani metod
- Zoptymalizowany do transferu danych
- Niezależny od mechanizmów trwałości

### Kiedy używać DTO

**Używaj DTO, gdy:**
- Transferujesz dane między warstwami
- Udostępniasz dane przez API
- Agregujesz dane z wielu encji
- Ukrywasz szczegóły wdrażania wewnętrznego
- Zmieniasz strukturę danych dla różnych konsumentów

## Podstawowa implementacja DTO

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

## DTO żądania/danych wejściowych

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

## Użycie w usługach

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

## Użycie w kontrolerach API

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

## Najlepsze praktyki

- Trzymaj DTO skoncentrowane i specyficzne
- Ustaw DTO jako niezmienne lub tylko do odczytu
- Nie dołączaj logiki biznesowej w DTO
- Używaj osobnych DTO dla danych wejściowych i wyjściowych
- Jasno dokumentuj właściwości DTO
- Trzymaj DTO proste - tylko kontenery danych

## Powiązana dokumentacja

Zobacz też:
- [Service-Layer](../Patterns/Service-Layer.md) dla integracji usług
- [Repository-Pattern](../Patterns/Repository-Pattern.md) dla dostępu do danych
- [MVC-Pattern](../Patterns/MVC-Pattern.md) dla użycia kontrolera
- [Testing](../Best-Practices/Testing.md) dla testowania DTO

---

Tags: #dto #data-transfer-objects #design-patterns #module-development
