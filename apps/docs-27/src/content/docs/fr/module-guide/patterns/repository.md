---
title: "Modèle Repository dans XOOPS"
description: "Implémentation de la couche d'abstraction d'accès aux données"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Pas sûr si c'est le bon modèle?]
Consultez [Choisir un modèle d'accès aux données](../Choosing-Data-Access-Pattern.md) pour un arbre de décision comparant les gestionnaires, les dépôts, les services et CQRS.
:::

:::tip[Fonctionne aujourd'hui et demain]
Le modèle Repository **fonctionne dans XOOPS 2.5.x et XOOPS 4.0.x**. Dans 2.5.x, encapsulez votre `XoopsPersistableObjectHandler` existant dans une classe Repository pour obtenir les avantages de l'abstraction :

| Approche | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| Accès direct aux gestionnaires | `xoops_getModuleHandler()` | Via le conteneur DI |
| Wrapper du dépôt | ✅ Recommandé | ✅ Modèle natif |
| Test avec mocks | ✅ Avec DI manuel | ✅ Autowiring du conteneur |

**Commencez avec le modèle Repository dès maintenant** pour préparer vos modules à la migration vers XOOPS 4.0.
:::

Le modèle Repository est un modèle d'accès aux données qui abstrait les opérations sur la base de données, fournissant une interface propre pour accéder aux données. Il agit comme intermédiaire entre la logique métier et les couches de mappage de données.

## Concept Repository

Le modèle Repository fournit :
- Abstraction des détails d'implémentation de la base de données
- Facilité de simulation pour les tests unitaires
- Logique d'accès aux données centralisée
- Flexibilité pour changer la base de données sans affecter la logique métier
- Logique d'accès aux données réutilisable dans l'application

## Quand utiliser les dépôts

**Utilisez les dépôts quand :**
- Transférer des données entre les couches de l'application
- Avoir besoin de changer l'implémentation de la base de données
- Rédiger du code testable avec des mocks
- Abstraire les modèles d'accès aux données

## Modèle d'implémentation

```php
<?php
// Définir l'interface du dépôt
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// Implémenter le dépôt
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // Implémentation
    }
    
    public function save($entity)
    {
        // Implémentation
    }
}
?>
```

## Utilisation dans les services

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
        // Vérifier si l'utilisateur existe
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // Créer l'utilisateur
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```

## Bonnes pratiques

- Utilisez les interfaces pour définir les contrats du dépôt
- Chaque dépôt gère un type d'entité
- Gardez la logique métier dans les services, pas dans les dépôts
- Utilisez les objets d'entité pour le mappage de données
- Lancez les exceptions appropriées pour les opérations invalides

## Documentation connexe

Voir aussi :
- [MVC-Pattern](../Patterns/MVC-Pattern.md) pour l'intégration du contrôleur
- [Service-Layer](../Patterns/Service-Layer.md) pour l'implémentation du service
- [DTO-Pattern](DTO-Pattern.md) pour les objets de transfert de données
- [Testing](../Best-Practices/Testing.md) pour le test du dépôt

---

Tags: #repository-pattern #data-access #design-patterns #module-development
