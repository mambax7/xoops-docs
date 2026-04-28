---
title: "Modèle Service Layer dans XOOPS"
description: "Abstraction de la logique métier et injection de dépendances"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Pas sûr si c'est le bon modèle?]
Consultez [Choisir un modèle d'accès aux données](../Choosing-Data-Access-Pattern.md) pour un arbre de décision comparant les gestionnaires, les dépôts, les services et CQRS.
:::

:::tip[Fonctionne aujourd'hui et demain]
Le modèle Service Layer **fonctionne dans XOOPS 2.5.x et XOOPS 4.0.x**. Les concepts sont universels, seule la syntaxe diffère :

| Fonctionnalité | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Version PHP | 7.4+ | 8.2+ |
| Injection de constructeur | ✅ Câblage manuel | ✅ Autowiring du conteneur |
| Propriétés typées | `@var` docblocks | Déclarations de type natives |
| Propriétés en lecture seule | ❌ Non disponible | ✅ Mot-clé `readonly` |

Les exemples de code ci-dessous utilisent la syntaxe PHP 8.2+. Pour 2.5.x, omettez `readonly` et utilisez les déclarations de propriétés traditionnelles.
:::

Le modèle Service Layer encapsule la logique métier dans des classes de service dédiées, fournissant une séparation claire entre les contrôleurs et les couches d'accès aux données. Ce modèle promeut la réutilisabilité du code, la testabilité et la maintenabilité.

## Concept de Service Layer

### Objectif
Le Service Layer :
- Contient la logique métier du domaine
- Coordonne plusieurs dépôts
- Gère les opérations complexes
- Gère les transactions
- Effectue la validation et l'autorisation
- Fournit des opérations de haut niveau aux contrôleurs

### Avantages
- Logique métier réutilisable sur plusieurs contrôleurs
- Facile à tester isolément
- Implémentation centralisée des règles métier
- Séparation claire des préoccupations
- Code de contrôleur simplifié

## Injection de dépendances

```php
<?php
// Service avec dépendances injectées
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
        // Valider
        $this->validate($username, $email, $password);
        
        // Créer l'utilisateur
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // Enregistrer
        $userId = $this->userRepository->save($user);
        
        // Envoyer un e-mail de bienvenue
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

## Conteneur de service

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // Enregistrer les dépôts
        $this->services['userRepository'] = new UserRepository($db);
        
        // Enregistrer les services
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

## Utilisation dans les contrôleurs

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

## Bonnes pratiques

- Chaque service gère une seule préoccupation du domaine
- Les services dépendent des interfaces, pas des implémentations
- Utilisez l'injection de constructeur pour les dépendances
- Les services doivent être testables isolément
- Lancez des exceptions spécifiques au domaine
- Les services ne doivent pas dépendre des détails de la demande HTTP
- Gardez les services concentrés et cohésifs

## Documentation connexe

Voir aussi :
- [MVC-Pattern](../Patterns/MVC-Pattern.md) pour l'intégration du contrôleur
- [Repository-Pattern](../Patterns/Repository-Pattern.md) pour l'accès aux données
- [DTO-Pattern](DTO-Pattern.md) pour les objets de transfert de données
- [Testing](../Best-Practices/Testing.md) pour le test de service

---

Tags: #service-layer #business-logic #dependency-injection #design-patterns
