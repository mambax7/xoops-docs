---
title: "Vzorec skladišča v XOOPS"
description: "Implementacija plasti abstrakcije dostopa do podatkov"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::opomba[Niste prepričani, ali je to pravi vzorec?]
Glejte [Izbira vzorca dostopa do podatkov](../Choosing-Data-Access-Pattern.md) za drevo odločitev, ki primerja obdelovalce, repozitorije, storitve in CQRS.
:::

:::nasvet[Deluje danes in jutri]
Vzorec repozitorija **deluje tako v XOOPS 2.5.x kot v XOOPS 4.0.x**. V 2.5.x ovijte vaš obstoječi `XoopsPersistableObjectHandler` v razred repozitorija, da dobite prednosti abstrakcije:

| Pristop | XOOPS 2.5.x | XOOPS 4,0 |
|----------|-------------|------------|
| Neposredni dostop upravljavca | `xoops_getModuleHandler()` | Prek vsebnika DI |
| Ovoj skladišča | ✅ Priporočeno | ✅ Izvorni vzorec |
| Testiranje z lažnimi | ✅ Z ročnim DI | ✅ Samodejno ožičenje zabojnika |

**Začnite z vzorcem repozitorija danes**, da pripravite svoje module za selitev XOOPS 4.0.
:::

Vzorec repozitorija je vzorec dostopa do podatkov, ki abstrahira operacije baze podatkov in zagotavlja čist vmesnik za dostop do podatkov. Deluje kot posrednik med plastmi poslovne logike in preslikave podatkov.

## Koncept skladišča

Vzorec repozitorija zagotavlja:
- Abstrakcija podrobnosti izvedbe baze podatkov
- Enostavno norčevanje za testiranje enot
- Centralizirana logika dostopa do podatkov
- Prilagodljivost spreminjanja baze podatkov brez vpliva na poslovno logiko
- Logika dostopa do podatkov za večkratno uporabo v aplikaciji## Kdaj uporabljati repozitorije

**Uporabite repozitorije, kadar:**
- Prenos podatkov med sloji aplikacije
- Potreba po spremembi izvedbe baze podatkov
- Pisanje kode, ki jo je mogoče testirati, z mocks
- Abstrahiranje vzorcev dostopa do podatkov

## Implementacijski vzorec
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
## Uporaba v storitvah
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
## Najboljše prakse

- Uporabite vmesnike za definiranje repozitorijskih pogodb
- Vsak repozitorij obravnava eno vrsto entitete
- Ohranite poslovno logiko v storitvah, ne v skladiščih
- Uporabite objekte entitet za preslikavo podatkov
- Vrzi ustrezne izjeme za neveljavne operacije

## Povezana dokumentacija

Glej tudi:
- [MVC-Vzorec](../Patterns/MVC-Pattern.md) za integracijo krmilnika
- [Service-Layer](../Patterns/Service-Layer.md) za izvedbo storitve
- [DTO-Vzorec](DTO-Pattern.md) za objekte prenosa podatkov
- [Testiranje](../Best-Practices/Testing.md) za testiranje repozitorija

---

Oznake: #repository-pattern #data-access #design-patterns #module-development