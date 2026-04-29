---
title: „A kódszervezés bevált gyakorlatai”
description: "modulszerkezet, elnevezési konvenciók és PSR-4 automatikus betöltés"
---
# Code Organization legjobb gyakorlatai a XOOPS-ban

A megfelelő kódszervezés elengedhetetlen a karbantarthatósághoz, a méretezhetőséghez és a csoportos együttműködéshez.

## modul címtárszerkezete

Egy jól szervezett XOOPS modulnak ezt a struktúrát kell követnie:

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

## Elnevezési konvenciók

### PHP elnevezési szabványok (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### Fájl- és könyvtárszervezés

- Egy osztály fájlonként
- A fájlnév megegyezik az osztálynévvel
- A könyvtárszerkezet megegyezik a névtér-hierarchiával
- Tartsa együtt a kapcsolódó osztályokat
- Használjon következetes elnevezést a modulokban

## PSR-4 Automatikus betöltés

### Zeneszerző konfigurációja

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Manuális automatikus betöltő

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

## Bevált gyakorlatok

### 1. Egyedülálló felelősség
- Minden osztálynak legyen egy oka a változtatásra
- Külön aggodalmakat különböző osztályokba
- Tartsa az órákat koncentráltan és összetartóan

### 2. Következetes elnevezés
- Használjon értelmes, leíró neveket
- Kövesse a PSR-12 kódolási szabványokat
- Kerülje a rövidítéseket, hacsak nem nyilvánvaló
- Használjon következetes mintákat

### 3. Címtár-szervezés
- Csoportosítsd össze a kapcsolódó osztályokat
- Az aggályokat külön alkönyvtárakba
- A sablonokat és az eszközöket rendszerezetten tartsa
- Használjon következetes fájlelnevezést

### 4. Névtérhasználat
- Használjon megfelelő névtereket minden osztályhoz
- Kövesse a PSR-4 automatikus betöltést
- A névtér megfelel a könyvtárszerkezetnek

### 5. Konfigurációkezelés
- A konfiguráció központosítása a konfigurációs könyvtárban
- Környezetalapú konfiguráció használata
- Ne hardcode beállításokat

## modul Bootstrap

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

## Kapcsolódó dokumentáció

Lásd még:
- Hibakezelés a kivételkezeléshez
- Tesztelés a tesztszervezéshez
- ../Patterns/MVC-Pattern a vezérlőszerkezethez

---

Címkék: #best-practices #code-organisation #psr-4 #module-development
