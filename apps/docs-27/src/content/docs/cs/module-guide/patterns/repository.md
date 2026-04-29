---
title: "Vzor úložiště v XOOPS"
description: "Implementace vrstvy abstrakce přístupu k datům"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::poznámka[Nejste si jisti, zda je to správný vzor?]
Viz [Volba vzoru přístupu k datům](../Choosing-Data-Access-Pattern.md) pro rozhodovací strom porovnávající obslužné programy, úložiště, služby a CQRS.
:::

:::tip[Pracuje dnes a zítra]
Vzor úložiště **funguje v XOOPS 2.5.xa XOOPS 4.0.x**. Ve verzi 2.5.x zabalte svůj stávající `XOOPSPersistableObjectHandler` do třídy úložiště, abyste získali výhody abstrakce:

| Přístup | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| Přímý přístup obsluhy | `xoops_getModuleHandler()` | Přes DI kontejner |
| Obálka úložiště | ✅ Doporučeno | ✅ Nativní vzor |
| Testování s maketami | ✅ S ručním DI | ✅ Automatické zapojení kontejneru |

**Začněte se vzorem úložiště ještě dnes** a připravte své moduly na migraci XOOPS 4.0.
:::

Vzor úložiště je vzor přístupu k datům, který abstrahuje databázové operace a poskytuje čisté rozhraní pro přístup k datům. Funguje jako prostředník mezi obchodní logikou a vrstvami mapování dat.

## Koncept úložiště

Vzor úložiště poskytuje:
- Abstrakce detailů implementace databáze
- Snadné zesměšňování pro testování jednotek
- Centralizovaná logika přístupu k datům
- Flexibilita při změně databáze bez ovlivnění obchodní logiky
- Znovu použitelná logika přístupu k datům v celé aplikaci

## Kdy použít úložiště

**Používejte úložiště, když:**
- Přenos dat mezi aplikačními vrstvami
- Potřeba změnit implementaci databáze
- Psaní testovatelného kódu pomocí simulací
- Abstrahování vzorů přístupu k datům

## Vzor implementace

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

## Použití ve službách

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

## Nejlepší postupy

- Použijte rozhraní k definování smluv o úložišti
- Každé úložiště zpracovává jeden typ entity
- Udržujte obchodní logiku ve službách, nikoli v úložištích
- Používejte objekty entit pro mapování dat
- Vyhoďte příslušné výjimky pro neplatné operace

## Související dokumentace

Viz také:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) pro integraci ovladače
- [Service-Layer](../Patterns/Service-Layer.md) pro implementaci služby
- [DTO-Pattern](DTO-Pattern.md) pro objekty přenosu dat
- [Testování](../Best-Practices/Testing.md) pro testování úložiště

---

Tagy: #repository-pattern #data-access #design-patterns #module-development