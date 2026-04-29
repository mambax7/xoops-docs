---
title: "Repository Pattern in XOOPS"
description: "Implementering af dataadgangsabstraktionslag"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Ikke sikker på om dette er det rigtige mønster?]
Se [Valg af et dataadgangsmønster](../Choosing-Data-Access-Pattern.md) for et beslutningstræ, der sammenligner handlere, lagre, tjenester og CQRS.
:::

:::tip[Virker i dag og i morgen]
Repository-mønsteret **fungerer i både XOOPS 2.5.x og XOOPS 4.0.x**. Indpak din eksisterende `XoopsPersistableObjectHandler` i 2.5.x i en Repository-klasse for at få abstraktionsfordele:

| Tilgang | XOOPS 2.5.x | XOOPS 4.0 |
|--------|-------------|--------|
| Direkte handleradgang | `xoops_getModuleHandler()` | Via DI container |
| Repository wrapper | ✅ Anbefalet | ✅ Native mønster |
| Test med håner | ✅ Med manuel DI | ✅ Container autowiring |

**Start med Repository-mønster i dag** for at forberede dine moduler til XOOPS 4.0-migrering.
:::

Repository Pattern er et dataadgangsmønster, der abstraherer databaseoperationer, hvilket giver en ren grænseflade til at få adgang til data. Det fungerer som en mellemmand mellem forretningslogikken og datakortlægningslagene.

## Depotkoncept

Repository-mønsteret giver:
- Abstraktion af databaseimplementeringsdetaljer
- Nem at håne for enhedstest
- Centraliseret dataadgangslogik
- Fleksibilitet til at ændre database uden at påvirke forretningslogikken
- Genanvendelig dataadgangslogik på tværs af applikationen

## Hvornår skal man bruge repositories

**Brug Repositories når:**
- Overførsel af data mellem applikationslag
- Behov for at ændre databaseimplementering
- Skrivning af testbar kode med mocks
- Abstraktion af dataadgangsmønstre

## Implementeringsmønster

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

## Brug i tjenester

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

## Bedste praksis

- Brug grænseflader til at definere depotkontrakter
- Hvert lager håndterer én enhedstype
- Hold forretningslogik i tjenester, ikke lagre
- Brug entitetsobjekter til datakortlægning
- Kast passende undtagelser for ugyldige operationer

## Relateret dokumentation

Se også:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) til controllerintegration
- [Service-Layer](../Patterns/Service-Layer.md) til serviceimplementering
- [DTO-Pattern](DTO-Pattern.md) til dataoverførselsobjekter
- [Test](../Best-Practices/Testing.md) til depottest

---

Tags: #repository-pattern #data-access #design-patterns #module-development
