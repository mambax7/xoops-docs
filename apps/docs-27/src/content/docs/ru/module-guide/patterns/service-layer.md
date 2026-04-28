---
title: "Паттерн Service Layer в XOOPS"
description: "Абстракция бизнес-логики и внедрение зависимостей"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Не уверены, правильно ли выбран паттерн?]
See [Choosing a Data Access Pattern](../Choosing-Data-Access-Pattern.md) for a decision tree comparing handlers, repositories, services, and CQRS.
:::

:::tip[Работает сегодня и завтра]
Паттерн Service Layer **работает в обеих XOOPS 2.5.x и XOOPS 4.0.x**. Концепции универсальны—отличается только синтаксис:

| Функция | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| PHP Version | 7.4+ | 8.2+ |
| Constructor Injection | ✅ Manual wiring | ✅ Container autowiring |
| Typed Properties | `@var` docblocks | Native type declarations |
| Readonly Properties | ❌ Not available | ✅ `readonly` keyword |

Примеры кода ниже используют синтаксис PHP 8.2+. Для 2.5.x опустите `readonly` и используйте традиционные объявления свойств.
:::

Паттерн Service Layer инкапсулирует бизнес-логику в специализированных классах сервисов, обеспечивая четкое разделение между контроллерами и слоями доступа к данным. Этот паттерн способствует переиспользованию кода, тестируемости и поддерживаемости.

## Концепция Service Layer

### Цель
Service Layer:
- Содержит домен бизнес-логики
- Координирует несколько repositories
- Обрабатывает сложные операции
- Управляет транзакциями
- Выполняет валидацию и авторизацию
- Обеспечивает высокоуровневые операции для контроллеров

### Преимущества
- Переиспользуемая бизнес-логика в нескольких контроллерах
- Легко тестировать в изоляции
- Централизованная реализация правил бизнеса
- Четкое разделение забот
- Упрощенный код контроллера

## Dependency Injection

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

## Service Container

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

## Использование в Controllers

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

## Best Practices

- Каждый сервис обрабатывает одну бизнес-заботу
- Services зависят от интерфейсов, а не от реализаций
- Используйте constructor injection для зависимостей
- Services должны быть тестируемыми в изоляции
- Выбрасывайте domain-специфичные исключения
- Services не должны зависеть от деталей HTTP запроса
- Держите services сфокусированными и когезивными

## Related Documentation

See also:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) for controller integration
- [Repository-Pattern](../Patterns/Repository-Pattern.md) for data access
- [DTO-Pattern](DTO-Pattern.md) for data transfer objects
- [Testing](../Best-Practices/Testing.md) for service testing

---

Tags: #service-layer #business-logic #dependency-injection #design-patterns
