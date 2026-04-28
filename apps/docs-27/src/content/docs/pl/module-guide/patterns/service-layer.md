---
title: "Wzorzec warstwy usług w XOOPS"
description: "Abstrakcja logiki biznesowej i wstrzykiwanie zależności"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::uwaga[Nie jesteś pewny, czy to właściwy wzorzec?]
See [Choosing a Data Access Pattern](../Choosing-Data-Access-Pattern.md) for a decision tree comparing handlers, repositories, services, and CQRS.
:::

:::wskazówka[Działa dzisiaj i jutro]
Wzorzec warstwy usług **działa zarówno w XOOPS 2.5.x jak i XOOPS 4.0.x**. Koncepcje są uniwersalne - różni się tylko składnia:

| Funkcja | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Wersja PHP | 7.4+ | 8.2+ |
| Wstrzykiwanie przez konstruktor | ✅ Ręczna konfiguracja | ✅ Container autowiring |
| Właściwości z typami | `@var` docblocks | Native type declarations |
| Właściwości readonly | ❌ Niedostępne | ✅ `readonly` keyword |

Przykłady kodu poniżej używają składni PHP 8.2+. Na 2.5.x, pomiń `readonly` i używaj tradycyjnych deklaracji właściwości.
:::

Wzorzec warstwy usług enkapsuluje logikę biznesową w dedykowanych klasach usług, zapewniając wyraźne rozdzielenie między kontrolerami a warstwami dostępu do danych. Ten wzorzec promuje ponowne użycie kodu, testowość i łatwość utrzymania.

## Koncepcja warstwy usług

### Cel
Warstwa usług:
- Zawiera logikę biznesową domeny
- Koordynuje wiele repozytoriów
- Obsługuje skomplikowane operacje
- Zarządza transakcjami
- Wykonuje walidację i autoryzację
- Zapewnia wysokopoziomowe operacje kontrolerom

### Korzyści
- Logika biznesowa wielokrotnie używalna przez wiele kontrolerów
- Łatwa do testowania izolacyjnie
- Scentralizowana implementacja reguł biznesowych
- Wyraźne rozdzielenie obaw
- Uproszczony kod kontrolera

## Wstrzykiwanie zależności

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

## Kontener usług

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

## Użycie w kontrolerach

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

## Najlepsze praktyki

- Każda usługa obsługuje jedną obawę domenową
- Usługi zależą od interfejsów, nie implementacji
- Używaj wstrzykiwania przez konstruktor dla zależności
- Usługi powinny być testowalne w izolacji
- Rzucaj wyjątkami specyficzne dla domeny
- Usługi nie powinny zależeć od szczegółów żądania HTTP
- Trzymaj usługi skoncentrowane i spójne

## Powiązana dokumentacja

Zobacz też:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) dla integracji kontrolera
- [Repository-Pattern](../Patterns/Repository-Pattern.md) dla dostępu do danych
- [DTO-Pattern](DTO-Pattern.md) dla obiektów transferu danych
- [Testing](../Best-Practices/Testing.md) dla testowania usługi

---

Tags: #service-layer #business-logic #dependency-injection #design-patterns
