---
title: "Uzorak spremišta u XOOPS"
description: "Implementacija sloja apstrakcije pristupa podacima"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Niste sigurni je li ovo pravi uzorak?]
Pogledajte [Odabir uzorka pristupa podacima](../Choosing-Data-Access-Pattern.md) za stablo odlučivanja koje uspoređuje rukovatelje, spremišta, usluge i CQRS.
:::

:::savjet[Radi danas i sutra]
Uzorak spremišta **radi u XOOPS 2.5.x i XOOPS 4.0.x**. U 2.5.x, zamotajte svoj postojeći `XoopsPersistableObjectHandler` u repozitorij class kako biste dobili prednosti apstrakcije:

| Pristup | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| Izravni pristup rukovatelja | `xoops_getModuleHandler()` | Preko DI spremnika |
| Omotač spremišta | ✅ Preporučeno | ✅ Izvorni uzorak |
| Testiranje s mockovima | ✅ S ručnim DI | ✅ Automatsko ožičenje kontejnera |

**Počnite s uzorkom repozitorija danas** kako biste pripremili svoj modules za XOOPS 4.0 migraciju.
:::

Uzorak repozitorija je obrazac pristupa podacima koji apstrahira operacije baze podataka, pružajući čisto sučelje za pristup podacima. Djeluje kao posrednik između slojeva poslovne logike i mapiranja podataka.

## Koncept repozitorija

Uzorak repozitorija pruža:
- Apstrakcija detalja implementacije baze podataka
- Jednostavno ismijavanje za testiranje jedinica
- Centralizirana logika pristupa podacima
- Fleksibilnost promjene baze podataka bez utjecaja na poslovnu logiku
- Višekratna logika pristupa podacima u cijeloj aplikaciji

## Kada koristiti spremišta

**Koristite spremišta kada:**
- Prijenos podataka između aplikacijskih slojeva
- Treba promijeniti implementaciju baze podataka
- Pisanje koda koji se može testirati s mockovima
- Apstrahiranje obrazaca pristupa podacima

## Uzorak implementacije

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

## Upotreba u uslugama

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

## Najbolji primjeri iz prakse

- Koristite sučelja za definiranje ugovora o spremištu
- Svaki repozitorij obrađuje jednu vrstu entiteta
- Držite poslovnu logiku u uslugama, a ne u spremištima
- Koristite objekte entiteta za mapiranje podataka
- Baci odgovarajuće iznimke za nevažeće operacije

## Povezana dokumentacija

Vidi također:
- [MVC-uzorak](../Patterns/MVC-Pattern.md) za integraciju kontrolera
- [Sloj usluge](../Patterns/Service-Layer.md) za implementaciju usluge
- [DTO-uzorak](DTO-Pattern.md) za objekte prijenosa podataka
- [Testiranje](../Best-Practices/Testing.md) za testiranje repozitorija

---

Oznake: #repozitorij-uzorak #pristup podacima #dizajn-uzorci #modul-razvoj
