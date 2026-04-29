---
title: "Szolgáltatási réteg minta az XOOPS-ban"
description: "Üzleti logikai absztrakció és függőségi injekció"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::megjegyzés[Nem biztos benne, hogy ez a megfelelő minta?]
Tekintse meg az [Adat-hozzáférési minta kiválasztása](../Choosing-Data-Access-Pattern.md) című részt a kezelők, adattárak, szolgáltatások és CQRS összehasonlító döntési fáért.
:::

:::tipp [Ma és holnap működik]
A szolgáltatási réteg minta **mind a XOOPS 2.5.x, mind a XOOPS 4.0.x** esetén működik. A fogalmak univerzálisak – csak a szintaxis különbözik:

| Funkció | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|-------------|
| PHP Verzió | 7,4+ | 8,2+ |
| Konstruktor befecskendezés | ✅ Kézi bekötés | ✅ Konténer automatikus vezetékezése |
| Beírt tulajdonságok | `@var` docblocks | Natív típusú deklarációk |
| Csak olvasható tulajdonságok | ❌ Nem elérhető | ✅ `readonly` kulcsszó |

Az alábbi kódpéldák PHP 8.2+ szintaxist használnak. A 2.5.x esetén hagyja ki a `readonly` paramétert, és használja a hagyományos tulajdonságnyilatkozatokat.
:::

A Service Layer Pattern az üzleti logikát dedikált szolgáltatási osztályokba foglalja, egyértelmű elválasztást biztosítva a vezérlők és az adathozzáférési rétegek között. Ez a minta elősegíti a kód újrafelhasználhatóságát, tesztelhetőségét és karbantarthatóságát.

## Szolgáltatási réteg koncepció

### Cél
A szolgáltatási réteg:
- Tartalmazza a domain üzleti logikáját
- Több adattárat koordinál
- Bonyolult műveleteket kezel
- Kezeli a tranzakciókat
- Érvényesítést és engedélyezést végez
- Magas szintű műveleteket biztosít a vezérlők számára

### Előnyök
- Újrafelhasználható üzleti logika több vezérlőn keresztül
- Könnyen tesztelhető elszigetelten
- Központosított üzletszabályzat megvalósítás
- Az aggodalmak világos elkülönítése
- Egyszerűsített vezérlőkód

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

## Használat a vezérlőkben

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

## Bevált gyakorlatok

- Minden szolgáltatás egy tartományi problémát kezel
- A szolgáltatások interfészektől függenek, nem implementációktól
- Használjon konstruktor injekciót a függőségekhez
- A szolgáltatásokat elkülönítve kell tesztelni
- Domain-specifikus kivételek dobása
- A szolgáltatások nem függhetnek a HTTP kérés részleteitől
- Tartsa a szolgáltatások összpontosítását és összetartását

## Kapcsolódó dokumentáció

Lásd még:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) a vezérlő integrációjához
- [Repository-Pattern](../Patterns/Repository-Pattern.md) az adathozzáféréshez
- [DTO-Pattern](DTO-Pattern.md) adatátviteli objektumokhoz
- [Tesztelés](../Best-Practices/Testing.md) a szolgáltatás teszteléséhez

---

Címkék: #szolgáltatási réteg #üzleti logika #dependency-injection #design-patterns
