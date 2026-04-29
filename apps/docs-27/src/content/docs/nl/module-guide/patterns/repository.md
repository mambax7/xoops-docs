---
title: "Repositorypatroon in XOOPS"
description: "Implementatie van de abstractielaag voor gegevenstoegang"
---
<span class="version-badge versie-25x">2.5.x ✅</span> <span class="version-badge versie-40x">4.0.x ✅</span>

:::note[Weet je niet zeker of dit het juiste patroon is?]
Zie [Een patroon voor gegevenstoegang kiezen](../Choosing-Data-Access-Pattern.md) voor een beslissingsboom waarin handlers, opslagplaatsen, services en CQRS worden vergeleken.
:::

:::tip[Werkt vandaag en morgen]
Het Repository-patroon **werkt in zowel XOOPS 2.5.x als XOOPS 4.0.x**. In 2.5.x plaatst u uw bestaande `XoopsPersistableObjectHandler` in een Repository-klasse om van de abstractievoordelen te profiteren:

| Benader | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|-----------|
| Directe toegang voor afhandeling | `xoops_getModuleHandler()` | Via DI-container |
| Repository-wrapper | ✅ Aanbevolen | ✅ Inheems patroon |
| Testen met schijnvertoningen | ✅ Met handmatige DI | ✅ Automatische bedrading van containers |

**Begin vandaag nog met het Repository-patroon** om uw modules voor te bereiden op de XOOPS 4.0-migratie.
:::

Het Repository Pattern is een patroon voor gegevenstoegang dat databasebewerkingen abstraheert en een overzichtelijke interface biedt voor toegang tot gegevens. Het fungeert als tussenpersoon tussen de lagen van de bedrijfslogica en de datamapping.

## Bewaarplaatsconcept

Het Repository-patroon biedt:
- Abstractie van details over database-implementatie
- Gemakkelijk spotten voor het testen van eenheden
- Gecentraliseerde logica voor gegevenstoegang
- Flexibiliteit om van database te wisselen zonder de bedrijfslogica te beïnvloeden
- Herbruikbare logica voor gegevenstoegang in de hele applicatie

## Wanneer moet u opslagplaatsen gebruiken?

**Gebruik opslagplaatsen wanneer:**
- Gegevens overdragen tussen applicatielagen
- Noodzaak om de database-implementatie te veranderen
- Testbare code schrijven met mocks
- Het abstraheren van datatoegangspatronen

## Implementatiepatroon

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

## Gebruik in services

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

## Beste praktijken

- Gebruik interfaces om repositorycontracten te definiëren
- Elke repository verwerkt één entiteitstype
- Bewaar bedrijfslogica in services, niet in repository's
- Gebruik entiteitsobjecten voor gegevenstoewijzing
- Gooi passende uitzonderingen op voor ongeldige bewerkingen

## Gerelateerde documentatie

Zie ook:
- [MVC-patroon](../Patterns/MVC-Pattern.md) voor controllerintegratie
- [Servicelaag](../Patterns/Service-Layer.md) voor service-implementatie
- [DTO-Patroon](DTO-Pattern.md) voor gegevensoverdrachtobjecten
- [Testen](../Best-Practices/Testing.md) voor het testen van opslagplaatsen

---

Tags: #repository-pattern #data-access #design-patterns #module-ontwikkeling