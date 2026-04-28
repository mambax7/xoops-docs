---
title: "Паттерн DTO в XOOPS"
description: "Data Transfer Objects для чистой обработки данных"
---

# Паттерн DTO (Data Transfer Objects) в XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Работает в обеих версиях]
DTOs — это простые PHP объекты без зависимостей от фреймворка. Они работают одинаково в XOOPS 2.5.x и XOOPS 4.0.x. Для PHP 8.2+ используйте property promotion конструктора и readonly классы для более чистого синтаксиса.
:::

Data Transfer Objects (DTOs) — это простые объекты, используемые для передачи данных между разными слоями приложения. DTOs помогают поддерживать четкие границы между слоями и снижают зависимости от объектов сущностей.

## Концепция DTO

### Что такое DTO?
DTO это:
- Простой value object со свойствами
- Неизменяемый или read-only после создания
- Без бизнес-логики или методов
- Оптимизирован для передачи данных
- Независим от механизмов сохранения

### Когда использовать DTOs

**Используйте DTOs когда:**
- Передаете данные между слоями
- Раскрываете данные через APIs
- Агрегируете данные из нескольких сущностей
- Скрываете детали внутренней реализации
- Меняете структуру данных для разных потребителей

## Базовая реализация DTO

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

## Использование в Services

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

## Использование в API Controllers

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

- Держите DTOs сфокусированными и конкретными
- Делайте DTOs неизменяемыми или read-only
- Не включайте бизнес-логику в DTOs
- Используйте отдельные DTOs для входа и выхода
- Четко документируйте свойства DTO
- Держите DTOs простыми - просто контейнеры данных

## Related Documentation

See also:
- [Service-Layer](../Patterns/Service-Layer.md) for service integration
- [Repository-Pattern](../Patterns/Repository-Pattern.md) for data access
- [MVC-Pattern](../Patterns/MVC-Pattern.md) for controller usage
- [Testing](../Best-Practices/Testing.md) for DTO testing

---

Tags: #dto #data-transfer-objects #design-patterns #module-development
