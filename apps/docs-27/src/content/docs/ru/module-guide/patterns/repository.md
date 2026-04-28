---
title: "Паттерн Repository в XOOPS"
description: "Реализация слоя абстракции доступа к данным"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Не уверены, правильно ли выбран паттерн?]
See [Choosing a Data Access Pattern](../Choosing-Data-Access-Pattern.md) for a decision tree comparing handlers, repositories, services, and CQRS.
:::

:::tip[Работает сегодня и завтра]
Паттерн Repository **работает в обеих XOOPS 2.5.x и XOOPS 4.0.x**. В 2.5.x оберните ваш существующий `XoopsPersistableObjectHandler` в класс Repository, чтобы получить преимущества абстракции:

| Подход | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| Прямой доступ handler | `xoops_getModuleHandler()` | Via DI container |
| Repository wrapper | ✅ Recommended | ✅ Native pattern |
| Testing with mocks | ✅ With manual DI | ✅ Container autowiring |

**Начните использовать паттерн Repository сегодня**, чтобы подготовить ваши модули к миграции на XOOPS 4.0.
:::

Паттерн Repository — это паттерн доступа к данным, который абстрагирует операции с базой данных, обеспечивая чистый интерфейс для доступа к данным. Он действует как посредник между слоем бизнес-логики и слоем отображения данных.

## Концепция Repository

Паттерн Repository обеспечивает:
- Абстракцию деталей реализации базы данных
- Легкое мокирование для unit тестирования
- Централизованную логику доступа к данным
- Гибкость для изменения базы данных без влияния на бизнес-логику
- Переиспользуемую логику доступа к данным по всему приложению

## Когда использовать Repositories

**Используйте Repositories когда:**
- Передаете данные между слоями приложения
- Нужно изменить реализацию базы данных
- Пишете тестируемый код с mocks
- Абстрагируете паттерны доступа к данным

## Паттерн реализации

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

## Использование в Services

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

## Best Practices

- Используйте интерфейсы для определения контрактов repository
- Каждый repository обрабатывает один тип сущности
- Держите бизнес-логику в services, а не в repositories
- Используйте entity объекты для отображения данных
- Выбрасывайте подходящие исключения для недопустимых операций

## Related Documentation

See also:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) for controller integration
- [Service-Layer](../Patterns/Service-Layer.md) for service implementation
- [DTO-Pattern](DTO-Pattern.md) for data transfer objects
- [Testing](../Best-Practices/Testing.md) for repository testing

---

Tags: #repository-pattern #data-access #design-patterns #module-development
