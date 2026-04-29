---
title: "Vzor servisní vrstvy v XOOPS"
description: "Abstrakce obchodní logiky a injekce závislosti"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::poznámka[Nejste si jisti, zda je to správný vzor?]
Viz [Volba vzoru přístupu k datům](../Choosing-Data-Access-Pattern.md), kde najdete strom rozhodování porovnávající obslužné programy, úložiště, služby a CQRS.
:::

:::tip[Pracuje dnes a zítra]
Vzor Service Layer **funguje v XOOPS 2.5.xa XOOPS 4.0.x**. Koncepty jsou univerzální – liší se pouze syntaxí:

| Funkce | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Verze PHP | 7,4+ | 8,2+ |
| Konstrukční vstřikování | ✅ Ruční zapojení | ✅ Automatické zapojení kontejneru |
| Typované vlastnosti | Dokovací bloky `@var` | Prohlášení nativního typu |
| Vlastnosti pouze pro čtení | ❌ Není k dispozici | ✅ Klíčové slovo `readonly` |

Níže uvedené příklady kódu používají syntaxi PHP 8.2+. Pro 2.5.x vynechejte `readonly` a použijte tradiční prohlášení o vlastnostech.
:::

Vzor Service Layer Pattern zapouzdřuje obchodní logiku do vyhrazených tříd služeb a poskytuje jasné oddělení mezi řadiči a vrstvami pro přístup k datům. Tento vzor podporuje opětovnou použitelnost kódu, testovatelnost a udržovatelnost.

## Koncept servisní vrstvy

### Účel
Servisní vrstva:
- Obsahuje doménovou obchodní logiku
- Koordinuje více úložišť
- Zvládá složité operace
- Řídí transakce
- Provádí validaci a autorizaci
- Poskytuje ovládání na vysoké úrovni

### Výhody
- Opakovaně použitelná obchodní logika napříč více ovladači
- Snadné testování v izolaci
- Centralizovaná implementace obchodních pravidel
- Jasné oddělení zájmů
- Zjednodušený kód ovladače

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

## Servisní kontejner

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

## Použití v ovladačích

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

## Nejlepší postupy

- Každá služba zpracovává jednu doménu
- Služby závisí na rozhraních, nikoli na implementacích
- Použijte vložení konstruktoru pro závislosti
- Služby by měly být testovatelné samostatně
- Vyhazujte výjimky specifické pro doménu
- Služby by neměly záviset na podrobnostech požadavku HTTP
- Udržujte služby zaměřené a soudržné

## Související dokumentace

Viz také:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) pro integraci ovladače
- [Repository-Pattern](../Patterns/Repository-Pattern.md) pro přístup k datům
- [DTO-Pattern](DTO-Pattern.md) pro objekty přenosu dat
- [Testování](../Best-Practices/Testing.md) pro servisní testování

---

Tagy: #service-layer #business-logic #dependency-injection #design-patterns