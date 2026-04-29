---
title: "Amalan Terbaik Organisasi Kod"
description: "Struktur modul, konvensyen penamaan, dan pemuatan auto PSR-4"
---
# Amalan Terbaik Organisasi Kod dalam XOOPSOrganisasi kod yang betul adalah penting untuk kebolehselenggaraan, kebolehskalaan dan kerjasama pasukan.## Struktur Direktori ModulModul XOOPS yang teratur harus mengikut struktur ini:
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
## Konvensyen Penamaan### Piawaian Penamaan PHP (PSR-12)
```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```
### Organisasi Fail dan Direktori- Satu kelas setiap fail
- Nama fail sepadan dengan nama kelas
- Struktur direktori sepadan dengan hierarki ruang nama
- Pastikan kelas yang berkaitan bersama-sama
- Gunakan penamaan yang konsisten merentas modul## Pemuatan Auto PSR-4### Konfigurasi Komposer
```
json
{
  "autoload": {
    "psr-4": {
      "XOOPS\\Module\\Mymodule\\": "class/"
    }
  }
}
```
### Autoloader Manual
```
php
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
## Amalan Terbaik### 1. Tanggungjawab Tunggal
- Setiap kelas harus mempunyai satu sebab untuk berubah
- Pisahkan kebimbangan kepada kelas yang berbeza
- Pastikan kelas fokus dan padu### 2. Penamaan Konsisten
- Gunakan nama yang bermakna dan deskriptif
- Ikuti piawaian pengekodan PSR-12
- Elakkan singkatan melainkan jelas
- Gunakan corak yang konsisten### 3. Organisasi Direktori
- Kumpulan kelas berkaitan bersama-sama
- Pisahkan kebimbangan kepada subdirektori
- Pastikan templat dan aset teratur
- Gunakan penamaan fail yang konsisten### 4. Penggunaan Ruang Nama
- Gunakan ruang nama yang sesuai untuk semua kelas
- Ikuti pemuatan auto PSR-4
- Ruang nama sepadan dengan struktur direktori### 5. Pengurusan Konfigurasi
- Pusatkan konfigurasi dalam direktori konfigurasi
- Gunakan konfigurasi berasaskan persekitaran
- Jangan tetapan kod keras## Modul Bootstrap
```
php
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
## Dokumentasi BerkaitanLihat juga:
- Ralat-Pengendalian untuk pengurusan pengecualian
- Ujian untuk organisasi ujian
- ../Patterns/MVC-Pattern untuk struktur pengawal---

Tag: #amalan-terbaik #organisasi-kod #psr-4 #pembangunan-modul