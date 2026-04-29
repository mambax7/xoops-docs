---
title: "Repository Pattern in XOOPS"
description: "Adathozzáférési absztrakciós réteg megvalósítása"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::megjegyzés[Nem biztos benne, hogy ez a megfelelő minta?]
A kezelőket, adattárakat, szolgáltatásokat és a CQRS-t összehasonlító döntési fát az [Adat-hozzáférési minta kiválasztása](../Choosing-Data-Access-Pattern.md) részben talál.
:::

:::tipp [Ma és holnap működik]
A Repository minta **mind a XOOPS 2.5.x, mind a XOOPS 4.0.x** esetén működik. A 2.5.x-ben csomagolja a meglévő `XOOPSPersistableObjectHandler`-ját egy Repository osztályba, hogy kihasználja az absztrakciós előnyöket:

| Megközelítés | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|-------------|
| Közvetlen kezelői hozzáférés | `xoops_getmoduleHandler()` | DI konténeren keresztül |
| Repository wrapper | ✅ Ajánlott | ✅ Natív minta |
| Tesztelés gúnyokkal | ✅ Kézi DI | ✅ Konténer automatikus vezetékezése |

**Kezdje el még ma a Repository mintával**, hogy felkészítse moduljait a XOOPS 4.0-s migrációra.
:::

A Repository Pattern egy adathozzáférési minta, amely elvonatkoztatja az adatbázis-műveleteket, tiszta felületet biztosítva az adatok eléréséhez. Közvetítőként működik az üzleti logika és az adatleképezési rétegek között.

## Repository koncepció

A Repository Pattern a következőket kínálja:
- Az adatbázis megvalósítás részleteinek absztrakciója
- Könnyű gúnyolódni az egység teszteléséhez
- Központosított adatelérési logika
- Az adatbázis megváltoztatásának rugalmassága az üzleti logika befolyásolása nélkül
- Újrafelhasználható adathozzáférési logika az alkalmazásban

## Mikor kell használni a tárolókat

**A tárhelyek használata, amikor:**
- Adatátvitel az alkalmazási rétegek között
- Az adatbázis megvalósításának megváltoztatása szükséges
- Tesztelhető kód írása gúnyokkal
- Adathozzáférési minták absztrahálása

## Megvalósítási minta

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

## Használat a szolgáltatásokban

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

## Bevált gyakorlatok

- Interfészek használata az adattári szerződések meghatározásához
- Minden adattár egy entitástípust kezel
- Tartsa meg az üzleti logikát a szolgáltatásokban, ne a tárolókban
- Entitásobjektumok használata az adatleképezéshez
- Adjon megfelelő kivételeket az érvénytelen műveletekhez

## Kapcsolódó dokumentáció

Lásd még:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) a vezérlő integrációjához
- [Service-Layer](../Patterns/Service-Layer.md) a szolgáltatás megvalósításához
- [DTO-Pattern](DTO-Pattern.md) adatátviteli objektumokhoz
- [Tesztelés](../Best-Practices/Testing.md) az adattár teszteléséhez

---

Címkék: #repository-pattern #data-access #design-patterns #module-development
