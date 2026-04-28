---
title: "Best Practices zur Code-Organisation"
description: "Modulstruktur, Namenskonventionen und PSR-4-Autoloading"
---

# Best Practices zur Code-Organisation in XOOPS

Eine ordnungsgemäße Code-Organisation ist für Wartbarkeit, Skalierbarkeit und Zusammenarbeit im Team unerlässlich.

## Modulverzeichnisstruktur

Ein gut organisiertes XOOPS-Modul sollte dieser Struktur folgen:

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

## Namenskonventionen

### PHP-Namensstandards (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### Datei- und Verzeichnisorganisation

- Eine Klasse pro Datei
- Dateiname entspricht dem Klassennamen
- Verzeichnisstruktur entspricht der Namespace-Hierarchie
- Verwandte Klassen zusammen halten
- Konsistente Benennung im gesamten Modul verwenden

## PSR-4-Autoloading

### Composer-Konfiguration

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Manueller Autoloader

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

## Best Practices

### 1. Einzelverantwortung
- Jede Klasse sollte nur einen Grund haben, sich zu ändern
- Bedenken in verschiedene Klassen aufteilen
- Klassen fokussiert und kohärent halten

### 2. Konsistente Benennung
- Aussagekräftige, beschreibende Namen verwenden
- PSR-12-Codierungsstandards befolgen
- Abkürzungen vermeiden, wenn nicht offensichtlich
- Konsistente Muster verwenden

### 3. Verzeichnisorganisation
- Verwandte Klassen zusammengruppieren
- Bedenken in Unterverzeichnisse aufteilen
- Templates und Assets organisiert halten
- Konsistente Dateibenennung verwenden

### 4. Namespace-Verwendung
- Richtige Namespaces für alle Klassen verwenden
- PSR-4-Autoloading befolgen
- Namespace entspricht der Verzeichnisstruktur

### 5. Konfigurationsverwaltung
- Konfiguration in Konfigurationsverzeichnis zentralisieren
- Umgebungsbasierte Konfiguration verwenden
- Keine hartcodierten Einstellungen

## Modul-Bootstrap

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

## Verwandte Dokumentation

Siehe auch:
- Error-Handling für Ausnahmeverwaltung
- Testing für Testorganisation
- ../Patterns/MVC-Pattern für Controller-Struktur

---

Tags: #best-practices #code-organization #psr-4 #module-development
