---
title: "Modèle DTO dans XOOPS"
description: "Objets de transfert de données pour une gestion des données propre"
---

# Modèle DTO (Data Transfer Objects) dans XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Fonctionne dans les deux versions]
Les DTOs sont des objets PHP simples sans dépendances de framework. Ils fonctionnent de manière identique dans XOOPS 2.5.x et XOOPS 4.0.x. Pour PHP 8.2+, utilisez la promotion de propriété du constructeur et les classes en lecture seule pour une syntaxe plus propre.
:::

Les Data Transfer Objects (DTOs) sont des objets simples utilisés pour transférer des données entre différentes couches d'une application. Les DTOs aident à maintenir des limites claires entre les couches et réduisent les dépendances sur les objets d'entité.

## Concept DTO

### Qu'est-ce qu'un DTO?
Un DTO est :
- Un simple objet de valeur avec des propriétés
- Immuable ou en lecture seule après création
- Sans logique métier ou méthodes
- Optimisé pour le transfert de données
- Indépendant des mécanismes de persistance

### Quand utiliser les DTOs

**Utilisez les DTOs quand :**
- Transférer des données entre les couches
- Exposer les données via les API
- Agréger les données de plusieurs entités
- Masquer les détails d'implémentation interne
- Modifier la structure des données pour différents consommateurs

## Implémentation DTO de base

```php
<?php
class UserDTO
{
    private $id;
    private $username;
    private $email;
    private $isActive;
    private $createdAt;
    
    public function __construct($entity = null)
    {
        if ($entity instanceof User) {
            $this->id = $entity->getId();
            $this->username = $entity->getUsername();
            $this->email = $entity->getEmail();
            $this->isActive = $entity->isActive();
            $this->createdAt = $entity->getCreatedAt();
        }
    }
    
    // Accesseurs en lecture seule
    public function getId() { return $this->id; }
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function isActive() { return $this->isActive; }
    public function getCreatedAt() { return $this->createdAt; }
    
    public function toArray()
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
        ];
    }
    
    public function toJson()
    {
        return json_encode($this->toArray());
    }
}
?>
```

## DTO Requête/Entrée

```php
<?php
class CreateUserRequestDTO
{
    private $username;
    private $email;
    private $password;
    private $errors = [];
    
    public function __construct(array $data)
    {
        $this->username = $data['username'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->password = $data['password'] ?? '';
        
        $this->validate();
    }
    
    private function validate()
    {
        if (empty($this->username) || strlen($this->username) < 3) {
            $this->errors['username'] = 'Username too short';
        }
        
        if (empty($this->email) || !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'Invalid email';
        }
        
        if (empty($this->password) || strlen($this->password) < 6) {
            $this->errors['password'] = 'Password too short';
        }
    }
    
    public function isValid()
    {
        return empty($this->errors);
    }
    
    public function getErrors()
    {
        return $this->errors;
    }
    
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function getPassword() { return $this->password; }
}
?>
```

## Utilisation dans les services

```php
<?php
class UserService
{
    public function createUserFromRequest(CreateUserRequestDTO $dto)
    {
        if (!$dto->isValid()) {
            throw new ValidationException('Invalid input', $dto->getErrors());
        }
        
        $user = new User();
        $user->setUsername($dto->getUsername());
        $user->setEmail($dto->getEmail());
        $user->setPassword($dto->getPassword());
        
        $userId = $this->userRepository->save($user);
        
        return new UserDTO($user);
    }
}
?>
```

## Utilisation dans les contrôleurs API

```php
<?php
class ApiController
{
    public function createUserAction()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $dto = new CreateUserRequestDTO($input);
        
        if (!$dto->isValid()) {
            http_response_code(400);
            return ['success' => false, 'errors' => $dto->getErrors()];
        }
        
        try {
            $userDTO = $this->userService->createUserFromRequest($dto);
            http_response_code(201);
            return ['success' => true, 'data' => $userDTO->toArray()];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>
```

## Bonnes pratiques

- Gardez les DTOs concentrés et spécifiques
- Rendez les DTOs immuables ou en lecture seule
- N'incluez pas la logique métier dans les DTOs
- Utilisez les DTOs séparés pour l'entrée et la sortie
- Documentez clairement les propriétés DTO
- Gardez les DTOs simples - juste des conteneurs de données

## Documentation connexe

Voir aussi :
- [Service-Layer](../Patterns/Service-Layer.md) pour l'intégration de service
- [Repository-Pattern](../Patterns/Repository-Pattern.md) pour l'accès aux données
- [MVC-Pattern](../Patterns/MVC-Pattern.md) pour l'utilisation du contrôleur
- [Testing](../Best-Practices/Testing.md) pour le test DTO

---

Tags: #dto #data-transfer-objects #design-patterns #module-development
