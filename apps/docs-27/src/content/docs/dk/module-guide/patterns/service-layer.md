---
title: "Service Layer Pattern in XOOPS"
description: "Forretningslogikabstraktion og afhængighedsinjektion"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Ikke sikker på om dette er det rigtige mønster?]
Se [Valg af et dataadgangsmønster](../Choosing-Data-Access-Pattern.md) for et beslutningstræ, der sammenligner handlere, lagre, tjenester og CQRS.
:::

:::tip[Virker i dag og i morgen]
Service Layer-mønsteret **fungerer i både XOOPS 2.5.x og XOOPS 4.0.x**. Koncepterne er universelle - kun syntaksen er forskellig:

| Funktion | XOOPS 2.5.x | XOOPS 4.0 |
|--------|-------------|--------|
| PHP Version | 7,4+ | 8,2+ |
| Konstruktørindsprøjtning | ✅ Manuel ledningsføring | ✅ Container autowiring |
| Indskrevne egenskaber | `@var` docblocks | Indfødte typedeklarationer |
| Skrivebeskyttede egenskaber | ❌ Ikke tilgængelig | ✅ `readonly` søgeord |

Kodeeksempler nedenfor bruger PHP 8.2+ syntaks. For 2.5.x skal du udelade `readonly` og bruge traditionelle ejendomserklæringer.
:::

Service Layer Pattern indkapsler forretningslogik i dedikerede serviceklasser, hvilket giver en klar adskillelse mellem controllere og dataadgangslag. Dette mønster fremmer kodegenanvendelighed, testbarhed og vedligeholdelse.

## Service Layer Concept

### Formål
Servicelaget:
- Indeholder domæne forretningslogik
- Koordinerer flere depoter
- Håndterer komplekse operationer
- Håndterer transaktioner
- Udfører validering og autorisation
- Giver operationer på højt niveau til controllere

### Fordele
- Genanvendelig forretningslogik på tværs af flere controllere
- Let at teste isoleret
- Centraliseret implementering af forretningsregler
- Klar adskillelse af bekymringer
- Forenklet controller-kode

## Afhængighedsindsprøjtning

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

## Servicecontainer

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

## Brug i controllere

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

## Bedste praksis

- Hver tjeneste håndterer et domæneproblem
- Tjenester afhænger af grænseflader, ikke implementeringer
- Brug konstruktørinjektion til afhængigheder
- Tjenester skal kunne testes isoleret
- Smid domænespecifikke undtagelser
- Tjenester bør ikke afhænge af HTTP anmodningsoplysninger
- Hold tjenesterne fokuserede og sammenhængende

## Relateret dokumentation

Se også:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) til controllerintegration
- [Repository-Pattern](../Patterns/Repository-Pattern.md) til dataadgang
- [DTO-Pattern](DTO-Pattern.md) til dataoverførselsobjekter
- [Test](../Best-Practices/Testing.md) til servicetest

---

Tags: #service-layer #business-logic #dependency-injection #design-patterns
