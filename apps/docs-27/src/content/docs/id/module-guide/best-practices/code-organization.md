---
title: "Praktik Terbaik Organisasi Kode"
description: "Struktur module, konvensi penamaan, dan pemuatan otomatis PSR-4"
---

# Praktik Terbaik Organisasi Kode di XOOPS

Organisasi kode yang tepat sangat penting untuk pemeliharaan, skalabilitas, dan kolaborasi tim.

## Struktur Direktori module

module XOOPS yang terorganisir dengan baik harus mengikuti struktur ini:

```
mymodule/
├── xoops_version.php           # Module metadata
├── index.php                    # front-end entry point
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

## Konvensi Penamaan

### Standar Penamaan PHP (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### Organisasi File dan Direktori

- Satu kelas per file
- Nama file sesuai dengan nama kelas
- Struktur direktori cocok dengan hierarki namespace
- Satukan kelas-kelas terkait
- Gunakan penamaan yang konsisten di seluruh module

## PSR-4 Pemuatan otomatis

### Konfigurasi Komposer

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Pemuat Otomatis Manual

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

## Praktik Terbaik

### 1. Tanggung Jawab Tunggal
- Setiap kelas harus memiliki satu alasan untuk berubah
- Pisahkan kekhawatiran ke dalam kelas yang berbeda
- Jaga agar kelas tetap fokus dan kohesif

### 2. Penamaan yang Konsisten
- Gunakan nama yang bermakna dan deskriptif
- Ikuti standar pengkodean PSR-12
- Hindari singkatan kecuali sudah jelas
- Gunakan pola yang konsisten

### 3. Organisasi Direktori
- Kelompokkan kelas terkait bersama-sama
- Pisahkan masalah ke dalam subdirektori
- Jaga agar template dan aset tetap teratur
- Gunakan penamaan file yang konsisten

### 4. Penggunaan namespace
- Gunakan namespace yang tepat untuk semua kelas
- Ikuti pemuatan otomatis PSR-4
- namespace cocok dengan struktur direktori

### 5. Manajemen Konfigurasi
- Sentralisasi konfigurasi di direktori config
- Gunakan konfigurasi berbasis lingkungan
- Jangan melakukan pengaturan hardcode

## module Bootstrap

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

## Dokumentasi Terkait

Lihat juga:
- Penanganan Kesalahan untuk manajemen pengecualian
- Pengujian untuk organisasi pengujian
- ../Patterns/MVC-Pattern untuk struktur pengontrol

---

Tag: #praktik terbaik #organisasi kode #psr-4 #pengembangan module
