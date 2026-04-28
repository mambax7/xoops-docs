---
title: "Meilleures pratiques d'organisation du code"
description: "Structure du module, conventions de nommage et autoload PSR-4"
---

# Meilleures pratiques d'organisation du code dans XOOPS

Une bonne organisation du code est essentielle pour la maintenabilité, l'évolutivité et la collaboration en équipe.

## Structure du répertoire du module

Un module XOOPS bien organisé devrait suivre cette structure :

```
mymodule/
├── xoops_version.php           # Métadonnées du module
├── index.php                    # Point d'entrée frontal
├── admin.php                    # Point d'entrée d'administration
├── class/
│   ├── Controller/             # Gestionnaires de requêtes
│   ├── Handler/                # Gestionnaires de données
│   ├── Repository/             # Accès aux données
│   ├── Entity/                 # Objets de domaine
│   ├── Service/                # Logique métier
│   ├── DTO/                    # Objets de transfert de données
│   └── Exception/              # Exceptions personnalisées
├── templates/                  # Modèles Smarty
│   ├── admin/                  # Modèles d'administration
│   └── blocks/                 # Modèles de bloc
├── assets/
│   ├── css/                    # Feuilles de style
│   ├── js/                     # JavaScript
│   └── images/                 # Images
├── sql/                        # Schémas de base de données
├── tests/                      # Tests unitaires et d'intégration
├── docs/                       # Documentation
└── composer.json              # Configuration Composer
```

## Conventions de nommage

### Normes de nommage PHP (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Méthodes:     camelCase          (getUserById, createUser)
Propriétés:   camelCase          ($userId, $username)
Constantes:   UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Fonctions:    snake_case         (get_user_data, validate_email)
Fichiers:     PascalCase.php     (UserController.php)
```

### Organisation des fichiers et répertoires

- Un classe par fichier
- Le nom du fichier correspond au nom de la classe
- La structure du répertoire correspond à la hiérarchie de l'espace de noms
- Gardez les classes connexes ensemble
- Utiliser une dénomination cohérente dans le module

## Autoload PSR-4

### Configuration Composer

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Autoloadeur manuel

```php
<?php
class Autoloader
{
    public static function register()
    {
        spl_autoload_register([self::class, 'autoload']);
    }
    
    public static function autoload($class)
    {
        $prefix = 'Xoops\\Module\\Mymodule\\';
        if (strpos($class, $prefix) !== 0) {
            return;
        }
        
        $relative = substr($class, strlen($prefix));
        $file = __DIR__ . '/' . 
                str_replace('\\', '/', $relative) . '.php';
        
        if (file_exists($file)) {
            require $file;
        }
    }
}
?>
```

## Meilleures pratiques

### 1. Responsabilité unique
- Chaque classe doit avoir une seule raison de changer
- Séparer les préoccupations dans différentes classes
- Maintenir les classes ciblées et cohésives

### 2. Nommage cohérent
- Utiliser des noms significatifs et descriptifs
- Suivre les normes de codage PSR-12
- Éviter les abréviations sauf si évidentes
- Utiliser des modèles cohérents

### 3. Organisation du répertoire
- Grouper les classes connexes
- Séparer les préoccupations dans les sous-répertoires
- Garder les modèles et les ressources organisés
- Utiliser un nommage de fichier cohérent

### 4. Utilisation de l'espace de noms
- Utiliser des espaces de noms appropriés pour toutes les classes
- Suivre l'autoload PSR-4
- L'espace de noms correspond à la structure du répertoire

### 5. Gestion de la configuration
- Centraliser la configuration dans le répertoire config
- Utiliser la configuration basée sur l'environnement
- Ne pas coder en dur les paramètres

## Amorçage du module

```php
<?php
class Bootstrap
{
    private static $serviceContainer;
    private static $initialized = false;
    
    public static function initialize()
    {
        if (self::$initialized) {
            return;
        }
        
        global $xoopsDB;
        self::$serviceContainer = new ServiceContainer($xoopsDB);
        self::$initialized = true;
    }
    
    public static function getServiceContainer()
    {
        if (!self::$initialized) {
            self::initialize();
        }
        return self::$serviceContainer;
    }
}
?>
```

## Documentation connexe

Voir aussi:
- Gestion des erreurs pour la gestion des exceptions
- Tests pour l'organisation des tests
- ../Patterns/Motif-MVC pour la structure du contrôleur

---

Tags: #best-practices #code-organization #psr-4 #module-development
