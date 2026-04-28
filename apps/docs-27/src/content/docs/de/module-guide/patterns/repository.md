---
title: "Repository-Muster in XOOPS"
description: "Implementierung der Datenzugriffabstraktionsschicht"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Nicht sicher, ob dies das richtige Muster ist?]
Siehe [Auswahl eines Datenzugriffsmusters](../Choosing-Data-Access-Pattern.md) für einen Entscheidungsbaum zum Vergleich von Handlern, Repositories, Services und CQRS.
:::

:::tip[Funktioniert heute und morgen]
Das Repository-Muster **funktioniert sowohl in XOOPS 2.5.x als auch in XOOPS 4.0.x**. In 2.5.x können Sie Ihren vorhandenen `XoopsPersistableObjectHandler` in einer Repository-Klasse umwickeln, um die Abstraktionsvorteile zu nutzen:

| Ansatz | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| Direkter Handler-Zugriff | `xoops_getModuleHandler()` | Via DI Container |
| Repository-Wrapper | ✅ Empfohlen | ✅ Natives Muster |
| Testen mit Mocks | ✅ Mit manueller DI | ✅ Container-Autowiring |

**Beginnen Sie heute mit dem Repository-Muster**, um Ihre Module auf die XOOPS-4.0-Migration vorzubereiten.
:::

Das Repository-Muster ist ein Datenzugriffsmuster, das Datenbankoperationen abstrahiert und eine saubere Schnittstelle für den Datenzugriff bietet. Es fungiert als Vermittler zwischen der Geschäftslogik und den Datenmapping-Ebenen.

## Repository-Konzept

Das Repository-Muster bietet:
- Abstraktion von Datenbankimplementierungsdetails
- Einfaches Mocking für Unit-Tests
- Zentralisierte Datenzugrifflogik
- Flexibilität zum Ändern der Datenbank ohne Auswirkungen auf die Geschäftslogik
- Wiederverwendbare Datenzugrifflogik in der gesamten Anwendung

## Wann man Repositories verwendet

**Verwenden Sie Repositories, wenn:**
- Daten zwischen Anwendungsschichten übertragen werden
- Die Datenbankimplementierung geändert werden muss
- Testbarer Code mit Mocks geschrieben wird
- Datenzugriffsmuster abstrahiert werden

## Implementierungsmuster

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

## Verwendung in Services

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

- Verwenden Sie Schnittstellen, um Repository-Verträge zu definieren
- Jedes Repository verarbeitet einen Entity-Typ
- Halten Sie Geschäftslogik in Services, nicht in Repositories
- Verwenden Sie Entity-Objekte für Datenmapping
- Werfen Sie geeignete Ausnahmen für ungültige Operationen

## Verwandte Dokumentation

Siehe auch:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) für Controller-Integration
- [Service-Layer](../Patterns/Service-Layer.md) für Service-Implementierung
- [DTO-Pattern](DTO-Pattern.md) für Datentransferobjekte
- [Testing](../Best-Practices/Testing.md) für Repository-Tests

---

Tags: #repository-pattern #data-access #design-patterns #module-development
