---
title: "Doporučené postupy organizace kódu"
description: "Struktura modulu, konvence pojmenování a automatické načítání PSR-4"
---

# Doporučené postupy organizace kódu v XOOPS

Správná organizace kódu je nezbytná pro udržovatelnost, škálovatelnost a týmovou spolupráci.

## Struktura adresáře modulu

Dobře organizovaný modul XOOPS by měl mít tuto strukturu:

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

## Konvence pojmenování

### Standardy názvů PHP (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### Organizace souborů a adresářů

- Jedna třída na soubor
- Název souboru odpovídá názvu třídy
- Struktura adresáře odpovídá hierarchii jmenného prostoru
- Udržujte související třídy pohromadě
- Používejte konzistentní pojmenování v rámci modulu

## PSR-4 Automatické načítání

### Konfigurace Composer

```json
{
  "autoload": {
    "psr-4": {
      "XOOPS\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Ruční Autoloader

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
        $prefix = 'XOOPS\\Module\\Mymodule\\';
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

## Nejlepší postupy

### 1. Jediná odpovědnost
- Každá třída by měla mít jeden důvod ke změně
- Rozdělit obavy do různých tříd
- Udržujte třídy soustředěné a soudržné

### 2. Konzistentní pojmenování
- Používejte smysluplné, popisné názvy
- Dodržujte standardy kódování PSR-12
- Vyhněte se zkratkám, pokud nejsou zřejmé
- Používejte konzistentní vzory

### 3. Organizace adresářů
- Seskupte související třídy dohromady
- Oddělte obavy do podadresářů
- Udržujte šablony a prostředky organizované
- Používejte konzistentní pojmenování souborů

### 4. Použití jmenného prostoru
- Používejte správné jmenné prostory pro všechny třídy
- Sledujte automatické načítání PSR-4
- Namespace odpovídá adresářové struktuře

### 5. Správa konfigurace
- Centralizujte konfiguraci v adresáři config
- Použijte konfiguraci založenou na prostředí
- Nekódujte nastavení napevno

## Bootstrap modulu

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

## Související dokumentace

Viz také:
- Zpracování chyb pro správu výjimek
- Testování pro testovací organizaci
- ../Patterns/MVC-Pattern pro strukturu ovladače

---

Štítky: #best-practices #code-organization #psr-4 #module-development