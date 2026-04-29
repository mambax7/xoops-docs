---
title: "Vzorec storitvenega sloja v XOOPS"
description: "Abstrakcija poslovne logike in vstavljanje odvisnosti"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::opomba[Niste prepričani, ali je to pravi vzorec?]
Glejte [Izbira vzorca dostopa do podatkov](../Choosing-Data-Access-Pattern.md) za drevo odločitev, ki primerja obdelovalce, repozitorije, storitve in CQRS.
:::

:::nasvet[Deluje danes in jutri]
Vzorec storitvenega sloja **deluje tako v XOOPS 2.5.x kot v XOOPS 4.0.x**. Koncepti so univerzalni - razlikuje se le sintaksa:

| Funkcija | XOOPS 2.5.x | XOOPS 4,0 |
|---------|-------------|------------|
| PHP Različica | 7,4+ | 8,2+ |
| Vbrizgavanje konstruktorja | ✅ Ročno ožičenje | ✅ Samodejno ožičenje zabojnika |
| Tipizirane lastnosti | `@var` bloki dokumentov | Izjave izvornega tipa |
| Lastnosti samo za branje | ❌ Ni na voljo | ✅ `readonly` ključna beseda |

Spodnji primeri kode uporabljajo sintakso PHP 8.2+. Za 2.5.x izpustite `readonly` in uporabite tradicionalne izjave o lastnostih.
:::

Vzorec storitvenega sloja zajema poslovno logiko v namenskih storitvenih razredih, kar zagotavlja jasno ločevanje med krmilniki in plastmi za dostop do podatkov. Ta vzorec spodbuja ponovno uporabnost kode, možnost testiranja in vzdržljivost.

## Koncept storitvenega sloja

### Namen
Storitvena plast:
- Vsebuje domensko poslovno logiko
- Koordinira več skladišč
- Obvladuje kompleksne operacije
- Upravlja transakcije
- Izvaja validacijo in avtorizacijo
- Krmilnikom zagotavlja delovanje na visoki ravni### Prednosti
- Poslovna logika za večkratno uporabo v več krmilnikih
- Enostaven za testiranje v izolaciji
- Centralizirano izvajanje poslovnih pravil
- Jasno ločevanje skrbi
- Poenostavljena koda krmilnika

## Injekcija odvisnosti
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
## Storitvena posoda
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
## Uporaba v krmilnikih
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
## Najboljše prakse

- Vsaka storitev obravnava eno skrb domene
- Storitve so odvisne od vmesnikov, ne od implementacij
- Uporabite vbrizgavanje konstruktorja za odvisnosti
- Storitve je treba testirati ločeno
- Vrzi izjeme, specifične za domeno
- Storitve ne smejo biti odvisne od HTTP podrobnosti zahteve
- Storitve naj bodo osredotočene in povezane

## Povezana dokumentacija

Glej tudi:
- [MVC-Vzorec](../Patterns/MVC-Pattern.md) za integracijo krmilnika
- [Repository-Pattern](../Patterns/Repository-Pattern.md) za dostop do podatkov
- [DTO-Vzorec](DTO-Pattern.md) za objekte prenosa podatkov
- [Testiranje](../Best-Practices/Testing.md) za testiranje storitev

---

Oznake: #service-layer #business-logic #dependency-injection #design-patterns