---
title: "DTO Шаблон у XOOPS"
description: "Об’єкти передачі даних для чистої обробки даних"
---
# DTO Шаблон (об’єкти передачі даних) у XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Працює в обох версіях]
DTO — це звичайні об’єкти PHP, які не залежать від структури. Вони однаково працюють у XOOPS 2.5.x і XOOPS 4.0.x. Для PHP 8.2+ використовуйте підвищення властивості конструктора та класи лише для читання для чистішого синтаксису.
:::

Об’єкти передачі даних (DTO) — це прості об’єкти, які використовуються для передачі даних між різними рівнями програми. DTO допомагають підтримувати чіткі межі між шарами та зменшувати залежність від об’єктів сутності.

Концепція ## DTO

### Що таке DTO?
DTO це:
- Простий об'єкт значення з властивостями
- Незмінний або доступний лише для читання після створення
- Жодної бізнес-логіки чи методів
- Оптимізовано для передачі даних
- Незалежність від механізмів збереження

### Коли використовувати DTO

**Використовуйте DTO, коли:**
- Передача даних між шарами
- Відкриття даних через API
- Агрегування даних з кількох об’єктів
- Приховування деталей внутрішньої реалізації
- Зміна структури даних для різних споживачів

## Базова реалізація DTO
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
## Використання в службах
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
## Використання в контролерах API
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
## Найкращі практики

- Тримайте DTO зосередженими та конкретними
- Зробіть DTO незмінними або доступними лише для читання
- Не включайте бізнес-логіку в DTO
- Використовуйте окремі DTO для введення та виведення
- Чітко задокументуйте властивості DTO
- Зберігайте DTO простими - лише контейнери даних

## Пов'язана документація

Дивіться також:
- [Service-Layer](../Patterns/Service-Layer.md) для інтеграції служби
- [Шаблон сховища](../Patterns/Repository-Pattern.md) для доступу до даних
- [MVC-шаблон](../Patterns/MVC-Pattern.md) для використання контролера
- [Тестування](../Best-Practices/Testing.md) для тестування DTO

---

Теги: #dto #об'єкти-передачі-даних #шаблони-проектування #розробка-модуля