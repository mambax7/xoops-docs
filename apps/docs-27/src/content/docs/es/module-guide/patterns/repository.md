---
title: "Patrón de repositorio en XOOPS"
description: "Implementación de la capa de abstracción de acceso a datos"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[¿No está seguro de si este es el patrón correcto?]
Vea [Elegir un patrón de acceso a datos](../Choosing-Data-Access-Pattern.md) para un árbol de decisión que compare controladores, repositorios, servicios y CQRS.
:::

:::tip[Funciona hoy y mañana]
El patrón de repositorio **funciona tanto en XOOPS 2.5.x como en XOOPS 4.0.x**. En 2.5.x, envuelva su `XoopsPersistableObjectHandler` existente en una clase de repositorio para obtener los beneficios de abstracción:

| Enfoque | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| Acceso directo al controlador | `xoops_getModuleHandler()` | Vía contenedor DI |
| Envoltorio del repositorio | ✅ Recomendado | ✅ Patrón nativo |
| Pruebas con burlas | ✅ Con DI manual | ✅ Cableado automático del contenedor |

**Comience con el patrón de repositorio hoy** para preparar sus módulos para la migración de XOOPS 4.0.
:::

El patrón de repositorio es un patrón de acceso a datos que abstrae las operaciones de base de datos, proporcionando una interfaz limpia para acceder a los datos. Actúa como intermediario entre la lógica empresarial y las capas de asignación de datos.

## Repository Concept

The Repository Pattern provides:
- Abstraction of database implementation details
- Easy mocking for unit testing
- Centralized data access logic
- Flexibility to change database without affecting business logic
- Reusable data access logic across the application

## When to Use Repositories

**Use Repositories when:**
- Transferring data between application layers
- Needing to change database implementation
- Writing testable code with mocks
- Abstracting data access patterns

## Implementation Pattern

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

## Usage in Services

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

- Use interfaces to define repository contracts
- Each repository handles one entity type
- Keep business logic in services, not repositories
- Use entity objects for data mapping
- Throw appropriate exceptions for invalid operations

## Related Documentation

See also:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) for controller integration
- [Service-Layer](../Patterns/Service-Layer.md) for service implementation
- [DTO-Pattern](DTO-Pattern.md) for data transfer objects
- [Testing](../Best-Practices/Testing.md) for repository testing

---

Tags: #repository-pattern #data-access #design-patterns #module-development
