---
title: "Migliori Pratiche di Organizzazione del Codice"
description: "Struttura del modulo, convenzioni di denominazione e autoloading PSR-4"
---

# Migliori Pratiche di Organizzazione del Codice in XOOPS

Una corretta organizzazione del codice è essenziale per la manutenibilità, la scalabilità e la collaborazione del team.

## Struttura della Directory del Modulo

Un modulo XOOPS ben organizzato dovrebbe seguire questa struttura:

```
mymodule/
├── xoops_version.php           # Metadati del modulo
├── index.php                    # Punto di ingresso frontend
├── admin.php                    # Punto di ingresso admin
├── class/
│   ├── Controller/             # Gestori di richieste
│   ├── Handler/                # Handler di dati
│   ├── Repository/             # Accesso ai dati
│   ├── Entity/                 # Oggetti di dominio
│   ├── Service/                # Logica di business
│   ├── DTO/                    # Oggetti di trasferimento dati
│   └── Exception/              # Eccezioni personalizzate
├── templates/                  # Template Smarty
│   ├── admin/                  # Template admin
│   └── blocks/                 # Template blocchi
├── assets/
│   ├── css/                    # Fogli di stile
│   ├── js/                     # JavaScript
│   └── images/                 # Immagini
├── sql/                        # Schemi database
├── tests/                      # Test unitari e di integrazione
├── docs/                       # Documentazione
└── composer.json              # Configurazione Composer
```

## Convenzioni di Denominazione

### Standard di Denominazione PHP (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### Organizzazione dei File e delle Directory

- Un classe per file
- Nome file corrisponde al nome classe
- Struttura directory corrisponde alla gerarchia di namespace
- Mantieni le classi correlate insieme
- Usa denominazione coerente in tutto il modulo

## Autoloading PSR-4

### Configurazione Composer

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Autoloader Manuale

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

## Migliori Pratiche

### 1. Single Responsibility
- Ogni classe dovrebbe avere una ragione per cambiare
- Separa i compiti in classi diverse
- Mantieni le classi focalizzate e coesive

### 2. Denominazione Coerente
- Usa nomi significativi e descrittivi
- Segui gli standard PSR-12 di codifica
- Evita abbreviazioni a meno che non ovvie
- Usa pattern coerenti

### 3. Organizzazione delle Directory
- Raggruppa le classi correlate insieme
- Separa i compiti in sottodirectory
- Mantieni i template e gli asset organizzati
- Usa denominazione coerente dei file

### 4. Uso dei Namespace
- Usa namespace appropriati per tutte le classi
- Segui l'autoloading PSR-4
- Il namespace corrisponde alla struttura della directory

### 5. Gestione della Configurazione
- Centralizza la configurazione nella directory config
- Usa configurazione basata su ambiente
- Non hardcodare le impostazioni

## Bootstrap del Modulo

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

## Documentazione Correlata

Vedi anche:
- Error-Handling per la gestione delle eccezioni
- Testing per l'organizzazione dei test
- ../Patterns/MVC-Pattern per la struttura dei controller

---

Tags: #best-practices #code-organization #psr-4 #module-development
