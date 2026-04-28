---
title: "Wzorzec repozytorium w XOOPS"
description: "Implementacja warstwy abstrakcji dostępu do danych"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::uwaga[Nie jesteś pewny, czy to właściwy wzorzec?]
See [Choosing a Data Access Pattern](../Choosing-Data-Access-Pattern.md) for a decision tree comparing handlers, repositories, services, and CQRS.
:::

:::wskazówka[Działa dzisiaj i jutro]
Wzorzec repozytorium **działa zarówno w XOOPS 2.5.x jak i XOOPS 4.0.x**. W 2.5.x, zawiń istniejący `XoopsPersistableObjectHandler` w klasę repozytorium, aby uzyskać korzyści abstrakcji:

| Podejście | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| Bezpośredni dostęp do handlera | `xoops_getModuleHandler()` | Via DI container |
| Wrapper repozytorium | ✅ Rekomendowany | ✅ Natywny wzorzec |
| Testowanie z mock'ami | ✅ Z ręcznym DI | ✅ Container autowiring |

**Zacznij od wzorca repozytorium dzisiaj**, aby przygotować swoje moduły do migracji XOOPS 4.0.
:::

Wzorzec repozytorium to wzorzec dostępu do danych, który abstrahuje operacje bazy danych, zapewniając czysty interfejs do dostępu do danych. Działa jako pośrednik między warstwą logiki biznesowej a warstwą mapowania danych.

## Koncepcja repozytorium

Wzorzec repozytorium zapewnia:
- Abstrakcję szczegółów implementacji bazy danych
- Łatwą mockowanie dla testów jednostkowych
- Scentralizowaną logikę dostępu do danych
- Elastyczność do zmiany bazy danych bez wpływu na logikę biznesową
- Wielokrotnie używalną logikę dostępu do danych w całej aplikacji

## Kiedy używać repozytoriów

**Używaj repozytoriów, gdy:**
- Transferujesz dane między warstwami aplikacji
- Musisz zmienić implementację bazy danych
- Piszesz testowy kod z mock'ami
- Abstrahują wzorce dostępu do danych

## Wzorzec implementacji

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

## Użycie w usługach

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

## Najlepsze praktyki

- Używaj interfejsów do definiowania kontraktów repozytorium
- Każde repozytorium obsługuje jeden typ encji
- Trzymaj logikę biznesową w usługach, nie w repozytoriach
- Używaj obiektów encji do mapowania danych
- Rzucaj odpowiednie wyjątki dla nieprawidłowych operacji

## Powiązana dokumentacja

Zobacz też:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) dla integracji kontrolera
- [Service-Layer](../Patterns/Service-Layer.md) dla implementacji usługi
- [DTO-Pattern](DTO-Pattern.md) dla obiektów transferu danych
- [Testing](../Best-Practices/Testing.md) dla testowania repozytorium

---

Tags: #repository-pattern #data-access #design-patterns #module-development
