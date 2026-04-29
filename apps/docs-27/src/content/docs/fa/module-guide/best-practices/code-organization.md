---
title: "بهترین شیوه های سازمان کد"
description: "ساختار ماژول، قراردادهای نامگذاری، و بارگذاری خودکار PSR-4"
---
# بهترین شیوه های سازماندهی کد در XOOPS

سازماندهی کد مناسب برای نگهداری، مقیاس پذیری و همکاری تیمی ضروری است.

## ساختار دایرکتوری ماژول

یک ماژول XOOPS به خوبی سازماندهی شده باید از این ساختار پیروی کند:

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

## قراردادهای نامگذاری

### استانداردهای نامگذاری PHP (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### سازماندهی فایل و دایرکتوری

- یک کلاس در هر فایل
- نام فایل با نام کلاس مطابقت دارد
- ساختار دایرکتوری با سلسله مراتب فضای نام مطابقت دارد
- کلاس های مرتبط را با هم نگه دارید
- از نامگذاری ثابت در سراسر ماژول استفاده کنید

## PSR-4 بارگیری خودکار

### پیکربندی آهنگساز

```json
{
  "autoload": {
    "psr-4": {
      "XOOPS\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Autoloader دستی

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

## بهترین شیوه ها

### 1. مسئولیت واحد
- هر کلاس باید یک دلیل برای تغییر داشته باشد
- نگرانی ها را به طبقات مختلف تفکیک کنید
- کلاس ها را متمرکز و منسجم نگه دارید

### 2. نامگذاری ثابت
- از اسامی معنی دار و توصیفی استفاده کنید
- استانداردهای کدگذاری PSR-12 را دنبال کنید
- از اختصارات بپرهیزید مگر اینکه واضح باشد
- از الگوهای ثابت استفاده کنید

### 3. سازمان دایرکتوری
- کلاس های مرتبط را با هم گروه کنید
- نگرانی ها را به زیر شاخه ها تفکیک کنید
- الگوها و دارایی ها را سازماندهی کنید
- از نامگذاری ثابت فایل استفاده کنید

### 4. استفاده از فضای نام
- از فضاهای نام مناسب برای همه کلاس ها استفاده کنید
- بارگذاری خودکار PSR-4 را دنبال کنید
- فضای نام با ساختار دایرکتوری مطابقت دارد

### 5. مدیریت پیکربندی
- پیکربندی را در دایرکتوری پیکربندی متمرکز کنید
- از پیکربندی مبتنی بر محیط استفاده کنید
- تنظیمات هاردکد نکنید

## ماژول بوت استرپ

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

## مستندات مرتبط

همچنین ببینید:
- Error-Handling برای مدیریت استثنا
- تست برای سازمان آزمون
- ../Patterns/MVC-Pattern برای ساختار کنترلر

---

برچسب‌ها: #بهترین روشها #سازمان کد #psr-4 #توسعه ماژول