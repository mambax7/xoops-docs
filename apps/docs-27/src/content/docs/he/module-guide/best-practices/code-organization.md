---
title: "שיטות עבודה מומלצות של ארגון הקוד"
description: "מבנה המודול, מוסכמות שמות וטעינה אוטומטית של PSR-4"
---

# שיטות עבודה מומלצות לארגון ב-XOOPS

ארגון קוד נכון חיוני לתחזוקה, מדרגיות ושיתוף פעולה בצוות.

## מבנה ספריית מודול

מודול XOOPS מאורגן היטב צריך לעקוב אחר המבנה הזה:

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

## מוסכמות שמות

### PHP תקני מתן שמות (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### ארגון קבצים וספריות

- מחלקה אחת לקובץ
- שם הקובץ תואם את שם המחלקה
- מבנה הספריות תואם להיררכיית מרחב השמות
- שמור שיעורים קשורים יחד
- השתמש בשמות עקביים בכל המודול

## PSR-4 טעינה אוטומטית

### Composer תצורה

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### טוען אוטומטי ידני

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

## שיטות עבודה מומלצות

### 1. אחריות יחידה
- לכל כיתה צריכה להיות סיבה אחת לשנות
- הפרד את הדאגות למעמדות שונים
- שמור על שיעורים ממוקדים ומלוכדים

### 2. מתן שמות עקביים
- השתמש בשמות תיאוריים ומשמעותיים
- עקוב אחר תקני הקידוד PSR-12
- הימנע מקיצורים אלא אם הם ברורים
- השתמש בדפוסים עקביים

### 3. ארגון ספריות
- קבצו יחד שיעורים הקשורים
- הפרד חששות לתוך ספריות משנה
- שמור על תבניות ונכסים מסודרים
- השתמש בשמות קבצים עקביים

### 4. שימוש במרחב שמות
- השתמש במרחבי שמות מתאימים לכל המחלקות
- עקוב אחר הטעינה האוטומטית של PSR-4
- מרחב השמות תואם את מבנה הספריות

### 5. ניהול תצורה
- מרכז את התצורה בספריית התצורה
- השתמש בתצורה מבוססת סביבה
- אל תקוד קשיח הגדרות

## אתחול מודול

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

## תיעוד קשור

ראה גם:
- טיפול בשגיאות לניהול חריגים
- בדיקה לארגון בדיקה
- ../Patterns/MVC-Pattern למבנה הבקר

---

תגיות: #שיטות עבודה מומלצות #קוד-ארגון #psr-4 #פיתוח-מודולים
