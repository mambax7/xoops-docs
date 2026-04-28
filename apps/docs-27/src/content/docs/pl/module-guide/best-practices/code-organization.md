---
title: "Najlepsze praktyki organizacji kodu"
description: "Struktura modułu, konwencje nazewnictwa i autoładowanie PSR-4"
---

# Najlepsze praktyki organizacji kodu w XOOPS

Właściwa organizacja kodu jest niezbędna dla utrzymania, skalowalności i współpracy zespołu.

## Struktura katalogów modułu

Dobrze zorganizowany moduł XOOPS powinien następować tę strukturę:

```
mymodule/
├── xoops_version.php           # Metadane modułu
├── index.php                    # Punkt wejścia frontenu
├── admin.php                    # Punkt wejścia admina
├── class/
│   ├── Controller/             # Obsługiwacze żądań
│   ├── Handler/                # Obsługiwacze danych
│   ├── Repository/             # Dostęp do danych
│   ├── Entity/                 # Obiekty domenowe
│   ├── Service/                # Logika biznesowa
│   ├── DTO/                    # Obiekty transferu danych
│   └── Exception/              # Wyjątki niestandardowe
├── templates/                  # Szablony Smarty
│   ├── admin/                  # Szablony admina
│   └── blocks/                 # Szablony bloków
├── assets/
│   ├── css/                    # Arkusze stylów
│   ├── js/                     # JavaScript
│   └── images/                 # Obrazy
├── sql/                        # Schematy baz danych
├── tests/                      # Testy jednostkowe i integracyjne
├── docs/                       # Dokumentacja
└── composer.json              # Konfiguracja Composer
```

## Konwencje nazewnictwa

### Standardy nazewnictwa PHP (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### Organizacja plików i katalogów

- Jedna klasa na plik
- Nazwa pliku odpowiada nazwie klasy
- Struktura katalogów odpowiada hierarchii namespace
- Trzymaj powiązane klasy razem
- Używaj konsystentnego nazewnictwa w całym module

## Autoładowanie PSR-4

### Konfiguracja Composer

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Ręczny autoloader

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

## Najlepsze praktyki

### 1. Pojedyncza odpowiedzialność
- Każda klasa powinna mieć jeden powód do zmiany
- Rozdziel obawy do różnych klas
- Trzymaj klasy skoncentrowane i spójne

### 2. Konsystentne nazewnictwo
- Używaj znaczących, opisowych nazw
- Postępuj zgodnie ze standardami kodowania PSR-12
- Unikaj skrótów, chyba że są oczywiste
- Używaj konsystentnych wzorców

### 3. Organizacja katalogów
- Grupuj powiązane klasy razem
- Rozdziel obawy do podkatalogów
- Trzymaj szablony i zasoby zorganizowane
- Używaj konsystentnego nazewnictwa plików

### 4. Użycie namespace
- Używaj odpowiednich namespace dla wszystkich klas
- Postępuj zgodnie z autoładowaniem PSR-4
- Namespace odpowiada strukturze katalogów

### 5. Zarządzanie konfiguracją
- Scentralizuj konfigurację w katalogu konfiguracji
- Używaj konfiguracji opartej na środowisku
- Nie koduj ustawień na stałe

## Bootstrap modułu

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

## Powiązana dokumentacja

Zobacz też:
- Obsługa błędów dla zarządzania wyjątkami
- Testowanie dla organizacji testów
- ../Patterns/MVC-Pattern dla struktury kontrolera

---

Tags: #best-practices #code-organization #psr-4 #module-development
