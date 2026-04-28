---
title: "Patrón de capa de servicio en XOOPS"
description: "Abstracción de lógica empresarial e inyección de dependencias"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[¿No está seguro de si este es el patrón correcto?]
Vea [Elegir un patrón de acceso a datos](../Choosing-Data-Access-Pattern.md) para un árbol de decisión que compare controladores, repositorios, servicios y CQRS.
:::

:::tip[Funciona hoy y mañana]
El patrón de capa de servicio **funciona tanto en XOOPS 2.5.x como en XOOPS 4.0.x**. Los conceptos son universales, solo la sintaxis difiere:

| Característica | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Versión PHP | 7.4+ | 8.2+ |
| Inyección de constructor | ✅ Cableado manual | ✅ Cableado automático del contenedor |
| Propiedades tipificadas | Bloques de documentación `@var` | Declaraciones de tipo nativo |
| Propiedades de solo lectura | ❌ No disponible | ✅ Palabra clave `readonly` |

Los ejemplos de código a continuación utilizan sintaxis PHP 8.2+. Para 2.5.x, omita `readonly` y use declaraciones de propiedad tradicionales.
:::

El patrón de capa de servicio encapsula la lógica empresarial en clases de servicio dedicadas, proporcionando una separación clara entre controladores y capas de acceso a datos. Este patrón promueve la reutilización del código, la verificabilidad y la mantenibilidad.

## Service Layer Concept

### Purpose
The Service Layer:
- Contains domain business logic
- Coordinates multiple repositories
- Handles complex operations
- Manages transactions
- Performs validation and authorization
- Provides high-level operations to controllers

### Benefits
- Reusable business logic across multiple controllers
- Easy to test in isolation
- Centralized business rule implementation
- Clear separation of concerns
- Simplified controller code

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
