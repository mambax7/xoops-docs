---
title: "דפוס שכבת שירות ב-XOOPS"
description: "הפשטה בלוגיקה עסקית והזרקת תלות"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::הערה[לא בטוח אם זה התבנית הנכונה?]
ראה [בחירת דפוס גישה לנתונים](../Choosing-Data-Access-Pattern.md) לעץ החלטות המשווה בין מטפלים, מאגרים, שירותים ו-CQRS.
:::

:::טיפ[עובד היום ומחר]
דפוס שכבת השירות **עובד גם ב-XOOPS 2.5.x וגם ב-XOOPS 4.0.x**. המושגים הם אוניברסליים - רק התחביר שונה:

| תכונה | XOOPS 2.5.x | XOOPS 4.0 |
|--------|-------------|--------|
| PHP גרסה | 7.4+ | 8.2+ |
| הזרקת קונסטרוקטור | ✅ חיווט ידני | ✅ חיווט אוטומטי של מיכל |
| מאפיינים מוקלדים | `@var` docblocks | הצהרות סוג מקומי |
| נכסים לקריאה בלבד | ❌ לא זמין | ✅ `readonly` מילת מפתח |

דוגמאות הקוד שלהלן משתמשות בתחביר PHP 8.2+. עבור 2.5.x, השמט את `readonly` והשתמש בהצהרות רכוש מסורתיות.
:::

תבנית שכבת השירות מקפלת את ההיגיון העסקי במחלקות שירות ייעודיות, ומספקת הפרדה ברורה בין בקרים לשכבות גישה לנתונים. דפוס זה מקדם שימוש חוזר בקוד, יכולת בדיקה ותחזוקה.

## קונספט שכבת שירות

### מטרה
שכבת השירות:
- מכיל לוגיקה עסקית של תחום
- מתאם מאגרים מרובים
- מטפל בפעולות מורכבות
- ניהול עסקאות
- מבצע אימות והרשאה
- מספק פעולות ברמה גבוהה לבקרים

### הטבות
- לוגיקה עסקית ניתנת לשימוש חוזר על פני מספר בקרים
- קל לבדיקה בבידוד
- יישום כללים עסקיים מרוכזים
- הפרדה ברורה של חששות
- קוד בקר פשוט

## הזרקת תלות

```php
<?php
// Service with injected dependencies
class UserService
{
    private $userRepository;
    private $emailService;
    
    public function __construct(
        UserRepositoryInterface $userRepository,
        EmailServiceInterface $emailService
    ) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Validate
        $this->validate($username, $email, $password);
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // Save
        $userId = $this->userRepository->save($user);
        
        // Send welcome email
        $this->emailService->sendWelcome($email, $username);
        
        return $userId;
    }
    
    private function validate($username, $email, $password)
    {
        $errors = [];
        
        if (strlen($username) < 3) {
            $errors['username'] = 'Username too short';
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email';
        }
        
        if (strlen($password) < 6) {
            $errors['password'] = 'Password too short';
        }
        
        if (!empty($errors)) {
            throw new ValidationException('Invalid input', $errors);
        }
    }
}
?>
```

## מיכל שירות

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // Register repositories
        $this->services['userRepository'] = new UserRepository($db);
        
        // Register services
        $this->services['userService'] = new UserService(
            $this->services['userRepository']
        );
    }
    
    public function get($name)
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("Service not found: $name");
        }
        return $this->services[$name];
    }
}
?>
```

## שימוש בבקרים

```php
<?php
class UserController
{
    private $userService;
    
    public function __construct(ServiceContainer $container)
    {
        $this->userService = $container->get('userService');
    }
    
    public function registerAction()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return [];
        }
        
        try {
            $userId = $this->userService->registerUser(
                $_POST['username'],
                $_POST['email'],
                $_POST['password']
            );
            
            return [
                'success' => true,
                'userId' => $userId,
            ];
        } catch (ValidationException $e) {
            return [
                'success' => false,
                'errors' => $e->getErrors(),
            ];
        }
    }
}
?>
```

## שיטות עבודה מומלצות

- כל שירות מטפל בתחום אחד
- השירותים תלויים בממשקים, לא בהטמעות
- השתמש בהזרקת קונסטרוקטור עבור תלות
- שירותים צריכים להיות ניתנים לבדיקה במנותק
- זרוק חריגים ספציפיים לדומיין
- השירותים אינם צריכים להיות תלויים בפרטי בקשת HTTP
- שמור על שירותים ממוקדים ומלוכדים

## תיעוד קשור

ראה גם:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) לשילוב בקר
- [Repository-Pattern](../Patterns/Repository-Pattern.md) לגישה לנתונים
- [DTO-Pattern](DTO-Pattern.md) עבור אובייקטי העברת נתונים
- [בדיקה](../Best-Practices/Testing.md) לבדיקת שירות

---

תגיות: #שכבת שירות #היגיון עסקי #הזרקת תלות #עיצוב-דפוסי
