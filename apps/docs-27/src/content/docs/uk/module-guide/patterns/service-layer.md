---
title: "Шаблон рівня обслуговування в XOOPS"
description: "Абстракція бізнес-логіки та впровадження залежностей"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Не впевнені, що це правильний шаблон?]
Перегляньте [Вибір шаблону доступу до даних](../Choosing-Data-Access-Pattern.md) для дерева рішень, у якому порівнюються обробники, сховища, служби та CQRS.
:::

:::tip[Працює сьогодні та завтра]
Шаблон рівня обслуговування **працює як у XOOPS 2.5.x, так і в XOOPS 4.0.x**. Концепції універсальні — відрізняється лише синтаксис:

| Особливість | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| PHP Версія | 7,4+ | 8,2+ |
| Конструктор Injection | ✅ Ручна проводка | ✅ Автомонтаж контейнерів |
| Введені властивості | `@var` блоки документів | Оголошення рідного типу |
| Властивості лише для читання | ❌ Недоступно | ✅ Ключове слово `readonly` |

У наведених нижче прикладах коду використовується синтаксис PHP 8.2+. Для 2.5.x опустіть `readonly` і використовуйте традиційні оголошення властивостей.
:::

Шаблон рівня обслуговування інкапсулює бізнес-логіку в виділені класи обслуговування, забезпечуючи чіткий розподіл між контролерами та рівнями доступу до даних. Цей шаблон сприяє багаторазовому використанню коду, тестуванню та зручності обслуговування.

## Концепція рівня обслуговування

### Мета
Сервісний рівень:
- Містить бізнес-логіку домену
- Координує кілька сховищ
- Виконує складні операції
- Керує транзакціями
- Виконує перевірку та авторизацію
- Забезпечує операції високого рівня для контролерів

### Переваги
- Багаторазова бізнес-логіка на кількох контролерах
- Легко тестувати в ізоляції
- Впровадження централізованого бізнес-правила
- Чіткий розподіл проблем
- Спрощений код контролера

## Ін'єкція залежності
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
## Сервісний контейнер
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
## Використання в контролерах
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
## Найкращі практики

- Кожна служба обробляє одну проблему домену
- Послуги залежать від інтерфейсів, а не від реалізації
- Використовуйте впровадження конструктора для залежностей
- Послуги повинні тестуватися окремо
- Створювати винятки для домену
- Сервіси не повинні залежати від деталей запиту HTTP
- Зберігайте послуги зосередженими та згуртованими

## Пов'язана документація

Дивіться також:
- [MVC-шаблон](../Patterns/MVC-Pattern.md) для інтеграції контролера
- [Шаблон сховища](../Patterns/Repository-Pattern.md) для доступу до даних
- [DTO-Pattern](DTO-Pattern.md) для об’єктів передачі даних
- [Тестування](../Best-Practices/Testing.md) для тестування служби

---

Теги: #сервісний-рівень #бізнес-логіка #впровадження залежностей #шаблони проектування