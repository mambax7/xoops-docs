---
title: "Patrón MVC en XOOPS"
description: "Implementación de arquitectura Modelo-Vista-Controlador en módulos XOOPS"
---

<span class="version-badge version-xmf">XMF Requerido</span> <span class="version-badge version-40x">4.0.x Nativo</span>

:::note[¿No está seguro de si este es el patrón correcto?]
Vea [Elegir un patrón de acceso a datos](../Choosing-Data-Access-Pattern.md) para obtener orientación sobre cuándo usar MVC versus patrones más simples.
:::

:::caution[Aclaración: Arquitectura XOOPS]
**XOOPS 2.5.x estándar** utiliza un patrón **Controlador de página** (también llamado Script de transacción), no MVC. Los módulos heredados usan `index.php` con inclusiones directas, objetos globales (`$xoopsUser`, `$xoopsDB`) y acceso a datos basado en controladores.

**Para usar MVC en XOOPS 2.5.x**, necesita el **Marco XMF** que proporciona enrutamiento y soporte de controlador.

**XOOPS 4.0** admitirá de forma nativa MVC con middleware PSR-15 y enrutamiento adecuado.

Ver también: [Arquitectura XOOPS actual](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

El patrón Modelo-Vista-Controlador (MVC) es un patrón arquitectónico fundamental para separar preocupaciones en módulos XOOPS. Este patrón divide una aplicación en tres componentes interconectados.

## MVC Explanation

### Model
The **Model** represents the data and business logic of your application. It:
- Manages data persistence
- Implements business rules
- Validates data
- Communicates with the database
- Is independent of the UI

### View
The **View** is responsible for presenting data to the user. It:
- Renders HTML templates
- Displays model data
- Handles user interface presentation
- Sends user actions to the controller
- Should contain minimal logic

### Controller
The **Controller** handles user interactions and coordinates between Model and View. It:
- Receives user requests
- Processes input data
- Calls model methods
- Selects appropriate views
- Manages application flow

## XOOPS Implementation

In XOOPS, the MVC pattern is implemented using handlers and templates with the Smarty engine providing template support.

### Basic Model Structure
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // Database query implementation
    }
    
    public function createUser($data)
    {
        // Create user implementation
    }
}
?>
```

### Controller Implementation
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```

### View Template
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Best Practices

- Keep business logic in Models
- Keep presentation in Views  
- Keep routing/coordination in Controllers
- Don't mix concerns between layers
- Validate all input at the Controller level

## Related Documentation

See also:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) for advanced data access
- [Service-Layer](../Patterns/Service-Layer.md) for business logic abstraction
- [Code-Organization](../Best-Practices/Code-Organization.md) for project structure
- [Testing](../Best-Practices/Testing.md) for MVC testing strategies

---

Tags: #mvc #patterns #architecture #module-development #design-patterns
