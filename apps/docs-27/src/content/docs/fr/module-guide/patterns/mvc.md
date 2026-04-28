---
title: "Modèle MVC dans XOOPS"
description: "Implémentation de l'architecture Model-View-Controller dans les modules XOOPS"
---

<span class="version-badge version-xmf">XMF Requis</span> <span class="version-badge version-40x">4.0.x Natif</span>

:::note[Pas sûr si c'est le bon modèle?]
Consultez [Choisir un modèle d'accès aux données](../Choosing-Data-Access-Pattern.md) pour des conseils sur le moment d'utiliser MVC par rapport aux modèles plus simples.
:::

:::caution[Clarification : Architecture XOOPS]
**XOOPS 2.5.x standard** utilise un modèle **Page Controller** (également appelé Transaction Script), pas MVC. Les modules hérités utilisent `index.php` avec des inclusions directes, des objets globaux (`$xoopsUser`, `$xoopsDB`), et un accès aux données basé sur les gestionnaires.

**Pour utiliser MVC dans XOOPS 2.5.x**, vous avez besoin du **Framework XMF** qui fournit le routage et le support des contrôleurs.

**XOOPS 4.0** supportera nativement MVC avec les middlewares PSR-15 et le routage approprié.

Voir aussi : [Architecture XOOPS actuelle](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Le modèle Model-View-Controller (MVC) est un modèle architectural fondamental pour séparer les préoccupations dans les modules XOOPS. Ce modèle divise une application en trois composants interconnectés.

## Explication MVC

### Modèle
Le **Modèle** représente les données et la logique métier de votre application. Il :
- Gère la persistance des données
- Implémente les règles métier
- Valide les données
- Communique avec la base de données
- Est indépendant de l'interface utilisateur

### Vue
La **Vue** est responsable de la présentation des données à l'utilisateur. Elle :
- Rend les modèles HTML
- Affiche les données du modèle
- Gère la présentation de l'interface utilisateur
- Envoie les actions utilisateur au contrôleur
- Doit contenir une logique minimale

### Contrôleur
Le **Contrôleur** gère les interactions utilisateur et coordonne entre le Modèle et la Vue. Il :
- Reçoit les demandes des utilisateurs
- Traite les données d'entrée
- Appelle les méthodes du modèle
- Sélectionne les vues appropriées
- Gère le flux de l'application

## Implémentation XOOPS

Dans XOOPS, le modèle MVC est implémenté en utilisant des gestionnaires et des modèles avec le moteur Smarty fournissant le support des modèles.

### Structure de modèle de base
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // Implémentation de la requête à la base de données
    }
    
    public function createUser($data)
    {
        // Implémentation de la création d'utilisateur
    }
}
?>
```

### Implémentation du contrôleur
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```

### Modèle Vue
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Bonnes pratiques

- Conservez la logique métier dans les modèles
- Conservez la présentation dans les vues
- Conservez le routage/la coordination dans les contrôleurs
- Ne mélangez pas les préoccupations entre les couches
- Validez toutes les entrées au niveau du contrôleur

## Documentation connexe

Voir aussi :
- [Repository-Pattern](../Patterns/Repository-Pattern.md) pour l'accès avancé aux données
- [Service-Layer](../Patterns/Service-Layer.md) pour l'abstraction de la logique métier
- [Code-Organization](../Best-Practices/Code-Organization.md) pour la structure du projet
- [Testing](../Best-Practices/Testing.md) pour les stratégies de test MVC

---

Tags: #mvc #patterns #architecture #module-development #design-patterns
