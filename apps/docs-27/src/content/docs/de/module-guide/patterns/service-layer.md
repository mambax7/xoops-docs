---
title: "Service-Layer-Muster in XOOPS"
description: "Geschäftslogik-Abstraktion und Abhängigkeitsinjektion"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Nicht sicher, ob dies das richtige Muster ist?]
Siehe [Auswahl eines Datenzugriffsmusters](../Choosing-Data-Access-Pattern.md) für einen Entscheidungsbaum zum Vergleich von Handlern, Repositories, Services und CQRS.
:::

:::tip[Funktioniert heute und morgen]
Das Service-Layer-Muster **funktioniert sowohl in XOOPS 2.5.x als auch in XOOPS 4.0.x**. Die Konzepte sind universell - nur die Syntax unterscheidet sich:

| Funktion | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| PHP-Version | 7.4+ | 8.2+ |
| Konstruktor-Injektion | ✅ Manuelle Verkabelung | ✅ Container-Autowiring |
| Typisierte Eigenschaften | `@var` Docblöcke | Native Typdeklarationen |
| Readonly-Eigenschaften | ❌ Nicht verfügbar | ✅ `readonly`-Schlüsselwort |

Die unten stehenden Codebeispiele verwenden PHP 8.2+-Syntax. Für 2.5.x omit `readonly` und verwenden Sie traditionelle Eigenschaftsdeklarationen.
:::

Das Service-Layer-Muster kapselt Geschäftslogik in dedizierten Service-Klassen ein und bietet eine klare Trennung zwischen Controllern und Datenzugriffsebenen. Dieses Muster fördert Code-Wiederverwendung, Testbarkeit und Wartbarkeit.

## Service-Layer-Konzept

### Zweck
Die Service-Ebene:
- Enthält Domain-Geschäftslogik
- Koordiniert mehrere Repositories
- Handhabt komplexe Operationen
- Verwaltet Transaktionen
- Führt Validierung und Autorisierung durch
- Bietet High-Level-Operationen für Controller

### Vorteile
- Wiederverwendbare Geschäftslogik über mehrere Controller hinweg
- Einfach isoliert zu testen
- Zentralisierte Geschäftsregelimplementierung
- Klare Trennung von Bedenken
- Vereinfachter Controller-Code

## Abhängigkeitsinjektion

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

## Usage in Controllers

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

- Each service handles one domain concern
- Services depend on interfaces, not implementations
- Use constructor injection for dependencies
- Services should be testable in isolation
- Throw domain-specific exceptions
- Services should not depend on HTTP request details
- Keep services focused and cohesive

## Related Documentation

See also:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) for controller integration
- [Repository-Pattern](../Patterns/Repository-Pattern.md) for data access
- [DTO-Pattern](DTO-Pattern.md) for data transfer objects
- [Testing](../Best-Practices/Testing.md) for service testing

---

Tags: #service-layer #business-logic #dependency-injection #design-patterns
