---
title: "Code Organisation Best Practices"
description: "Modulstruktur, navngivningskonventioner og PSR-4 autoloading"
---

# Code Organization Best Practices i XOOPS

Korrekt kodeorganisering er afgørende for vedligeholdelse, skalerbarhed og teamsamarbejde.

## Modulkatalogstruktur

Et velorganiseret XOOPS-modul bør følge denne struktur:

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

## Navnekonventioner

### PHP navngivningsstandarder (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### Fil- og biblioteksorganisation

- Én klasse pr. fil
- Filnavn matcher klassenavn
- Katalogstruktur matcher navnerumshierarki
- Hold relaterede klasser sammen
- Brug ensartet navngivning på tværs af modulet

## PSR-4 Autoloading

### Komponistkonfiguration

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Manuel autoloader

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

## Bedste praksis

### 1. Enkelt ansvar
- Hver klasse skal have én grund til at skifte
- Adskil bekymringer i forskellige klasser
- Hold klasserne fokuserede og sammenhængende

### 2. Konsekvent navngivning
- Brug meningsfulde, beskrivende navne
- Følg PSR-12 kodningsstandarder
- Undgå forkortelser, medmindre de er indlysende
- Brug konsistente mønstre

### 3. Directory Organisation
- Grupper relaterede klasser sammen
- Adskil bekymringer i undermapper
- Hold skabeloner og aktiver organiseret
- Brug konsekvent filnavngivning

### 4. Brug af navneområde
- Brug de rigtige navnerum til alle klasser
- Følg PSR-4 autoloading
- Navneområde matcher mappestruktur

### 5. Konfigurationsstyring
- Centraliser konfigurationen i config-biblioteket
- Brug miljøbaseret konfiguration
- Undlad at fastkode indstillinger

## Modul Bootstrap

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

## Relateret dokumentation

Se også:
- Fejlhåndtering til undtagelseshåndtering
- Test til testorganisation
- ../Patterns/MVC-Pattern til controllerstruktur

---

Tags: #best-practices #code-organization #psr-4 #module-development
