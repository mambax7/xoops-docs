---
title: "Шаблон сховища в XOOPS"
description: "Реалізація рівня абстракції доступу до даних"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Не впевнені, що це правильний шаблон?]
Перегляньте [Вибір шаблону доступу до даних](../Choosing-Data-Access-Pattern.md) для дерева рішень, у якому порівнюються обробники, сховища, служби та CQRS.
:::

:::tip[Працює сьогодні та завтра]
Шаблон сховища **працює як у XOOPS 2.5.x, так і в XOOPS 4.0.x**. У версії 2.5.x оберніть існуючий `XoopsPersistableObjectHandler` у клас Repository, щоб отримати переваги абстракції:

| Підхід | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| Прямий доступ обробника | `xoops_getModuleHandler()` | Через контейнер DI |
| Обгортка сховища | ✅ Рекомендовано | ✅ Рідний візерунок |
| Тестування за допомогою макетів | ✅ З ручним DI | ✅ Автомонтаж контейнерів |

**Почніть із шаблону Repository сьогодні**, щоб підготувати свої модулі до міграції XOOPS 4.0.
:::

Шаблон сховища — це шаблон доступу до даних, який абстрагує операції бази даних, забезпечуючи чистий інтерфейс для доступу до даних. Він діє як посередник між рівнями бізнес-логіки та відображення даних.

## Концепція сховища

Шаблон репозиторію надає:
- Абстрагування деталей реалізації бази даних
— Легке знущання для модульного тестування
- Логіка централізованого доступу до даних
- Гнучкість зміни бази даних без впливу на бізнес-логіку
— Багаторазова логіка доступу до даних у програмі

## Коли використовувати репозиторії

**Використовуйте репозиторії, коли:**
- Передача даних між рівнями програми
- Потрібно змінити реалізацію бази даних
- Написання тестованого коду з макетами
- Абстрагування шаблонів доступу до даних

## Шаблон реалізації
```php
<?php
// Define repository interface
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// Implement repository
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // Implementation
    }
    
    public function save($entity)
    {
        // Implementation
    }
}
?>
```
## Використання в службах
```php
<?php
class UserService
{
    private $userRepository;
    
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Check if user exists
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```
## Найкращі практики

- Використовуйте інтерфейси для визначення контрактів сховища
- Кожен репозиторій обробляє один тип сутності
- Зберігайте бізнес-логіку в службах, а не в сховищах
- Використовуйте об'єкти сутності для відображення даних
- Створення відповідних винятків для недійсних операцій

## Пов'язана документація

Дивіться також:
- [MVC-шаблон](../Patterns/MVC-Pattern.md) для інтеграції контролера
- [Service-Layer](../Patterns/Service-Layer.md) для впровадження служби
- [DTO-Pattern](DTO-Pattern.md) для об’єктів передачі даних
- [Тестування](../Best-Practices/Testing.md) для тестування сховища

---

Теги: #репозиторій-паттерн #доступ до даних #шаблони-проектування #розробка-модуля