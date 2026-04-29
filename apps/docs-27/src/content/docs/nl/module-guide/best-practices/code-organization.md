---
title: "Beste praktijken voor codeorganisatie"
description: "Modulestructuur, naamgevingsconventies en automatisch laden van PSR-4"
---
# Best practices voor codeorganisatie in XOOPS

Een goede code-organisatie is essentieel voor onderhoudbaarheid, schaalbaarheid en teamsamenwerking.

## Modulemapstructuur

Een goed georganiseerde XOOPS-module zou deze structuur moeten volgen:

```
mymodule/
├── xoops_version.php           # Module metadata
├── index.php                    # Frontend entry point
├── admin.php                    # Admin entry point
├── class/
│   ├── Controller/             # Request handlers
│   ├── Handler/                # Data handlers
│   ├── Repository/             # Data access
│   ├── Entity/                 # Domain objects
│   ├── Service/                # Business logic
│   ├── DTO/                    # Data transfer objects
│   └── Exception/              # Custom exceptions
├── templates/                  # Smarty templates
│   ├── admin/                  # Admin templates
│   └── blocks/                 # Block templates
├── assets/
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript
│   └── images/                 # Images
├── sql/                        # Database schemas
├── tests/                      # Unit and integration tests
├── docs/                       # Documentation
└── composer.json              # Composer configuration
```

## Naamgevingsconventies

### PHP-naamgevingsnormen (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### Bestands- en maporganisatie

- Eén klasse per bestand
- Bestandsnaam komt overeen met de klassenaam
- Directorystructuur komt overeen met naamruimtehiërarchie
- Houd gerelateerde lessen bij elkaar
- Gebruik consistente naamgeving in de hele module

## PSR-4 Automatisch laden

### Componistconfiguratie

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Handmatige autolader

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

## Beste praktijken

### 1. Eén verantwoordelijkheid
- Elke klas moet één reden hebben om te veranderen
- Verdeel de zorgen in verschillende klassen
- Houd de lessen gefocust en samenhangend

### 2. Consistente naamgeving
- Gebruik betekenisvolle, beschrijvende namen
- Volg de PSR-12-coderingsnormen
- Vermijd afkortingen tenzij duidelijk
- Gebruik consistente patronen

### 3. Directory-organisatie
- Groepeer gerelateerde klassen samen
- Scheid problemen in submappen
- Houd sjablonen en middelen georganiseerd
- Gebruik consistente bestandsnamen

### 4. Gebruik van naamruimte
- Gebruik de juiste naamruimten voor alle klassen
- Volg het automatisch laden van PSR-4
- Naamruimte komt overeen met de mapstructuur

### 5. Configuratiebeheer
- Centraliseer de configuratie in de configuratiedirectory
- Gebruik omgevingsgebaseerde configuratie
- Codeer de instellingen niet

## Module-bootstrap

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

## Gerelateerde documentatie

Zie ook:
- Foutafhandeling voor uitzonderingsbeheer
- Testen voor testorganisatie
- ../Patterns/MVC-Patroon voor controllerstructuur

---

Tags: #best-practices #code-organisatie #psr-4 #module-ontwikkeling