---
title: "أفضل ممارسات تنظيم الكود"
description: "هيكل الوحدة والاتفاقيات الأسماء والتحميل التلقائي PSR-4"
dir: rtl
lang: ar
---

# أفضل ممارسات تنظيم الكود في XOOPS

التنظيم الصحيح للكود ضروري للصيانة والقابلية للتوسع والتعاون الجماعي.

## هيكل دليل الوحدة

يجب أن تتبع وحدة XOOPS المنظمة بشكل جيد هذا الهيكل:

```
mymodule/
├── xoops_version.php           # بيانات وصفية للوحدة
├── index.php                    # نقطة دخول الواجهة الأمامية
├── admin.php                    # نقطة دخول الإدارة
├── class/
│   ├── Controller/             # معالجات الطلب
│   ├── Handler/                # معالجات البيانات
│   ├── Repository/             # الوصول إلى البيانات
│   ├── Entity/                 # كائنات المجال
│   ├── Service/                # منطق الأعمال
│   ├── DTO/                    # كائنات نقل البيانات
│   └── Exception/              # استثناءات مخصصة
├── templates/                  # قوالب Smarty
│   ├── admin/                  # قوالب الإدارة
│   └── blocks/                 # قوالب الكتل
├── assets/
│   ├── css/                    # أوراق الأنماط
│   ├── js/                     # JavaScript
│   └── images/                 # الصور
├── sql/                        # مخططات قاعدة البيانات
├── tests/                      # اختبارات الوحدة والتكامل
├── docs/                       # الوثائق
└── composer.json              # تكوين Composer
```

## اتفاقيات الأسماء

### معايير تسمية PHP (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### تنظيم الملف والدليل

- فئة واحدة لكل ملف
- اسم الملف يطابق اسم الفئة
- هيكل الدليل يطابق تسلسل النطاق الهرمي
- احتفظ بالفئات ذات الصلة معاً
- استخدم تسمية متسقة عبر الوحدة

## التحميل التلقائي PSR-4

### تكوين Composer

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### محمل تلقائي يدوي

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

## أفضل الممارسات

### 1. مسؤولية واحدة
- كل فئة يجب أن يكون لها سبب واحد للتغيير
- افصل الاهتمامات إلى فئات مختلفة
- حافظ على الفئات مركزة وملتحمة

### 2. تسمية متسقة
- استخدم أسماء ذات معنى وواصفة
- اتبع معايير تسمية PSR-12
- تجنب الاختصارات إلا إذا كانت واضحة
- استخدم أنماط متسقة

### 3. تنظيم الدليل
- جمّع الفئات ذات الصلة معاً
- افصل الاهتمامات إلى أدلة فرعية
- حافظ على القوالب والأصول منظمة
- استخدم تسمية ملف متسقة

### 4. استخدام النطاق
- استخدم النطاقات الصحيحة لجميع الفئات
- اتبع التحميل التلقائي PSR-4
- النطاق يطابق هيكل الدليل

### 5. إدارة التكوين
- مركزيّة التكوين في دليل التكوين
- استخدم التكوين المستند إلى البيئة
- لا تقم بترميز الإعدادات

## بدء تشغيل الوحدة

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

## الوثائق ذات الصلة

انظر أيضاً:
- Error-Handling لإدارة الاستثناء
- Testing لتنظيم الاختبار
- ../Patterns/MVC-Pattern لهيكل المتحكم

---

Tags: #best-practices #code-organization #psr-4 #module-development
