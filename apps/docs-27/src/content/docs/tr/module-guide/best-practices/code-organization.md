---
title: "Kod Organizasyonu İçin En İyi Uygulamalar"
description: "module yapısı, adlandırma kuralları ve PSR-4 otomatik yükleme"
---
# XOOPS'de Kod Organizasyonu En İyi Uygulamaları

Sürdürülebilirlik, ölçeklenebilirlik ve ekip işbirliği için doğru kod organizasyonu şarttır.

## module Dizin Yapısı

İyi organize edilmiş bir XOOPS modülü şu yapıyı takip etmelidir:
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
## Adlandırma Kuralları

### PHP Adlandırma Standartları (PSR-12)
```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```
### Dosya ve Dizin Organizasyonu

- Dosya başına bir sınıf
- Dosya adı sınıf adıyla eşleşiyor
- Dizin yapısı ad alanı hiyerarşisiyle eşleşir
- İlgili sınıfları bir arada tutun
- module genelinde tutarlı adlandırma kullanın

## PSR-4 Otomatik Yükleme

### Oluşturucu Yapılandırması
```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```
### Manuel Otomatik Yükleyici
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
## En İyi Uygulamalar

### 1. Tek Sorumluluk
- Her sınıfın değişmek için bir nedeni olmalı
- Endişeleri farklı sınıflara ayırın
- Sınıfları odaklanmış ve uyumlu tutun

### 2. Tutarlı Adlandırma
- Anlamlı, açıklayıcı isimler kullanın
- PSR-12 kodlama standartlarını takip edin
- Açık olmadığı sürece kısaltmalardan kaçının
- Tutarlı desenler kullanın

### 3. Dizin Organizasyonu
- İlgili dersleri bir arada gruplayın
- Endişeleri alt dizinlere ayırın
- Şablonları ve varlıkları düzenli tutun
- Tutarlı dosya adlandırma kullanın

### 4. Ad Alanı Kullanımı
- Tüm sınıflar için uygun ad alanlarını kullanın
- PSR-4 otomatik yüklemeyi takip edin
- Ad alanı dizin yapısıyla eşleşir

### 5. Yapılandırma Yönetimi
- Yapılandırma dizininde yapılandırmayı merkezileştirin
- Ortam tabanlı yapılandırmayı kullanın
- Ayarları sabit kodlamayın

## module Önyüklemesi
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
## İlgili Belgeler

Ayrıca bakınız:
- İstisna yönetimi için Hata İşleme
- Test organizasyonu için testler
- ../Patterns/MVC-Pattern denetleyici yapısı için

---

Etiketler: #en iyi uygulamalar #kod organizasyonu #psr-4 #module geliştirme