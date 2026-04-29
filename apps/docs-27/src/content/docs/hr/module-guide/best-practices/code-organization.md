---
title: "Najbolji primjeri organizacije koda"
description: "Struktura modula, konvencije imenovanja i automatsko učitavanje PSR-4"
---
# Najbolje prakse organizacije koda u XOOPS

Pravilna organizacija koda ključna je za mogućnost održavanja, skalabilnost i timsku suradnju.

## Struktura direktorija modula

Dobro organiziran modul XOOPS trebao bi slijediti ovu strukturu:

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

## Konvencije imenovanja

### PHP Standardi imenovanja (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### Organizacija datoteka i direktorija

- Jedan class po datoteci
- Naziv datoteke odgovara nazivu class
- Struktura imenika odgovara hijerarhiji imenskog prostora
- Držite povezani classes zajedno
- Koristite dosljedno imenovanje u cijelom modulu

## PSR-4 Automatsko učitavanje

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

### Ručni automatski učitavač

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

## Najbolji primjeri iz prakse

### 1. Jedna odgovornost
- Svaki class bi trebao imati jedan razlog za promjenu
- Odvojite probleme u različite classes
- Držite classes fokusiranim i kohezivnim

### 2. Dosljedno imenovanje
- Koristite smislena, opisna imena
- Slijedite standarde kodiranja PSR-12
- Izbjegavajte kratice osim ako su očite
- Koristite dosljedne obrasce

### 3. Organizacija imenika
- Grupirajte povezani classes zajedno
- Odvojite probleme u poddirektorije
- Držite templates i assets organiziranima
- Koristite dosljedno imenovanje datoteke

### 4. Upotreba imenskog prostora
- Koristite odgovarajuće prostore imena za sve classes
- Slijedite automatsko učitavanje PSR-4
- Prostor imena odgovara strukturi direktorija

### 5. Upravljanje konfiguracijom
- Centralizirajte konfiguraciju u konfiguracijskom direktoriju
- Koristite konfiguraciju temeljenu na okruženju
- Nemojte kodirati postavke

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

Vidi također:
- Rukovanje pogreškama za upravljanje iznimkama
- Testiranje za organizaciju testiranja
- ../Patterns/MVC-Uzorak za strukturu kontrolera

---

Oznake: #najbolje prakse #organizacija koda #psr-4 #razvoj-modula
