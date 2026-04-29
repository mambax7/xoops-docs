---
title: "Najboljše prakse organizacije kode"
description: "Struktura modula, pravila poimenovanja in samodejno nalaganje PSR-4"
---
# Najboljše prakse organizacije kode v XOOPS

Pravilna organizacija kode je bistvena za vzdržljivost, razširljivost in timsko sodelovanje.

## Struktura imenika modulov

Dobro organiziran modul XOOPS mora slediti tej strukturi:
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
## Dogovori o poimenovanju

### PHP Standardi poimenovanja (PSR-12)
```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```
### Organizacija datotek in imenikov

- En razred na datoteko
- Ime datoteke se ujema z imenom razreda
- Struktura imenika se ujema s hierarhijo imenskega prostora
- Ohranite povezane razrede skupaj
- Uporabite dosledno poimenovanje v celotnem modulu

## PSR-4 Samodejno nalaganje

### Konfiguracija skladatelja
```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```
### Ročni samodejni nalagalnik
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
## Najboljše prakse

### 1. Ena odgovornost
- Vsak razred mora imeti en razlog za spremembo
- Ločite skrbi v različne razrede
- Naj bodo razredi osredotočeni in povezani

### 2. Dosledno poimenovanje
- Uporabljajte pomenljiva, opisna imena
- Sledite standardom kodiranja PSR-12
- Izogibajte se okrajšavam, razen če so očitne
- Uporabljajte dosledne vzorce

### 3. Organizacija imenika
- Združite povezane razrede skupaj
- Ločite zadeve v podimenike
- Organizirajte predloge in sredstva
- Uporabite dosledno poimenovanje datotek

### 4. Uporaba imenskega prostora
- Uporabite ustrezne imenske prostore za vse razrede
- Sledite PSR-4 samodejnemu nalaganju
- Imenski prostor se ujema s strukturo imenika

### 5. Upravljanje konfiguracije
- Centralizirajte konfiguracijo v konfiguracijskem imeniku
- Uporabite konfiguracijo, ki temelji na okolju
- Ne vnašajte nastavitev v kodo

## Module Bootstrap
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
## Povezana dokumentacija

Glej tudi:
- Obravnava napak za upravljanje izjem
- Testiranje za organizacijo testov
- ../Patterns/MVC-Vzorec za strukturo krmilnika

---

Oznake: #najboljše prakse #organizacija kode #psr-4 #razvoj-modula