---
title: "Uzorak sloja usluge u XOOPS"
description: "Apstrakcija poslovne logike i uvođenje ovisnosti"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Niste sigurni je li ovo pravi uzorak?]
Pogledajte [Odabir uzorka pristupa podacima](../Choosing-Data-Access-Pattern.md) za stablo odlučivanja koje uspoređuje rukovatelje, spremišta, usluge i CQRS.
:::

:::savjet[Radi danas i sutra]
Uzorak sloja usluge **radi u XOOPS 2.5.x i XOOPS 4.0.x**. Koncepti su univerzalni - samo se sintaksa razlikuje:

| Značajka | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| PHP Verzija | 7,4+ | 8.2+ |
| Injekcija konstruktora | ✅ Ručno ožičenje | ✅ Automatsko ožičenje kontejnera |
| Tipizirana svojstva | `@var` docblokovi | Deklaracije izvornog tipa |
| Svojstva samo za čitanje | ❌ Nije dostupno | ✅ `readonly` ključna riječ |

Primjeri kodova u nastavku koriste sintaksu PHP 8.2+. Za 2.5.x izostavite `readonly` i koristite tradicionalne deklaracije svojstava.
:::

Uzorak sloja usluge enkapsulira poslovnu logiku u namjenskoj usluzi classes, pružajući jasno odvajanje između kontrolera i slojeva pristupa podacima. Ovaj obrazac promovira ponovnu upotrebu koda, mogućnost testiranja i održavanje.

## Koncept sloja usluge

### Svrha
Sloj usluge:
- Sadrži poslovnu logiku domene
- Koordinira više spremišta
- Rukuje složenim operacijama
- Upravlja transakcijama
- Obavlja validaciju i autorizaciju
- Omogućuje rad na visokoj razini kontrolerima

### Prednosti
- Višekratna poslovna logika na više kontrolera
- Lako se testira u izolaciji
- Implementacija centraliziranih poslovnih pravila
- Jasno razdvajanje briga
- Pojednostavljeni kod kontrolera

## Injekcija ovisnosti

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

## Servisni spremnik

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

## Upotreba u kontrolerima

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

## Najbolji primjeri iz prakse

- Svaka usluga rješava problem jedne domene
- Usluge ovise o sučeljima, a ne o implementaciji
- Koristite ubacivanje konstruktora za ovisnosti
- Usluge bi se trebale moći testirati u izolaciji
- Bacite iznimke specifične za domenu
- Usluge ne bi trebale ovisiti o detaljima HTTP zahtjeva
- Neka usluge budu usredotočene i kohezivne

## Povezana dokumentacija

Vidi također:
- [MVC-uzorak](../Patterns/MVC-Pattern.md) za integraciju kontrolera
- [Repository-Pattern](../Patterns/Repository-Pattern.md) za pristup podacima
- [DTO-uzorak](DTO-Pattern.md) za objekte prijenosa podataka
- [Testiranje](../Best-Practices/Testing.md) za testiranje usluge

---

Oznake: #sloj-usluge #poslovna-logika #injekcija-ovisnosti #uzorci-dizajna
